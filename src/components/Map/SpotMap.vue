<template>
  <div class="relative w-full h-full rounded-3xl overflow-hidden shadow-soft border border-gray-150/40">
    
    <!-- Contenedor del canvas del mapa donde Leaflet renderizará la capa cartográfica -->
    <div ref="mapElement" class="w-full h-full z-10"></div>
    
    <!-- Botón flotante para geolocalizar al usuario mediante GPS del dispositivo -->
    <div class="absolute bottom-5 left-5 z-20">
      <UserLocationButton @location-found="onLocationFound" />
    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: SpotMap.vue
 * DESCRIPCIÓN: Mapa interactivo de Leaflet integrado con OpenStreetMap.
 * Se encarga de dibujar el mapa principal, situar marcadores de precio flotantes,
 * sincronizar las coordenadas con Pinia y gestionar la posición GPS en tiempo real.
 */
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapStore } from "../../stores/map";
import UserLocationButton from "./UserLocationButton.vue";

const router = useRouter();
const mapStore = useMapStore();

// Referencia al elemento HTML del mapa
const mapElement = ref<HTMLElement | null>(null);

// Instancias internas de Leaflet para control de capas, marcadores y GPS
let map: L.Map | null = null;
let markersGroup: L.LayerGroup | null = null;
let userLocationMarker: L.Marker | null = null;
let userLocationCircle: L.Circle | null = null;

// Hook de montaje para inicializar la instancia cartográfica de Leaflet
onMounted(() => {
  if (!mapElement.value) return;

  // Inicializa el mapa centrado en el punto registrado de Pinia
  map = L.map(mapElement.value, {
    center: [mapStore.searchCenter.lat, mapStore.searchCenter.lng],
    zoom: 15,
    zoomControl: false, // Oculta los controles nativos para customizarlos
    attributionControl: false
  });

  // Capa Voyager de CartoDB (estética premium, limpia y oscura ideal para resaltar marcadores)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 20
  }).addTo(map);

  // Añade controles de Zoom en la esquina superior izquierda
  L.control.zoom({
    position: "topleft"
  }).addTo(map);

  // Capa contenedora exclusiva para refrescar los marcadores de parking de forma ágil
  markersGroup = L.layerGroup().addTo(map);

  // Escucha los desplazamientos del mapa (arrastres y zooms) para actualizar bounds visibles en Pinia
  map.on("moveend", () => {
    if (map) {
      mapStore.updateBounds(map.getBounds());
      const center = map.getCenter();
      mapStore.setSearchCenter(center.lat, center.lng);
    }
  });

  // Registra los bordes iniciales del mapa visible
  mapStore.updateBounds(map.getBounds());

  // Renderiza los pines iniciales
  renderMarkers();
});

// Hook de desmontaje para limpiar el mapa y liberar memoria RAM
onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

// Re-renderiza los pines cada vez que cambien los filtros aplicados o se seleccione una plaza
watch(
  () => [mapStore.filteredSpots, mapStore.selectedSpotId],
  () => {
    renderMarkers();
  },
  { deep: true }
);

// Panea el mapa de forma fluida si el buscador Nominatim cambia la coordenada central
watch(
  () => mapStore.searchCenter,
  (newCenter) => {
    if (map) {
      const currentCenter = map.getCenter();
      const distance = currentCenter.distanceTo(L.latLng(newCenter.lat, newCenter.lng));
      // Evita saltos si la diferencia de posición es inferior a 10 metros
      if (distance > 10) {
        map.setView([newCenter.lat, newCenter.lng], map.getZoom());
      }
    }
  }
);

/**
 * Centra y coloca un marcador especial de localización GPS cuando el usuario clica en geolocalizar.
 * @param coords Objeto con latitud, longitud y precisión métrica del GPS.
 */
const onLocationFound = (coords: { lat: number; lng: number; accuracy: number }) => {
  if (!map) return;

  // Ajusta la vista al punto del usuario
  map.setView([coords.lat, coords.lng], 16);

  // Limpia antiguos marcadores de geolocalización
  if (userLocationMarker) map.removeLayer(userLocationMarker);
  if (userLocationCircle) map.removeLayer(userLocationCircle);

  // Añade un círculo translúcido azul que representa el margen de error del GPS
  userLocationCircle = L.circle([coords.lat, coords.lng], {
    radius: coords.accuracy,
    color: "#3b82f6",
    fillColor: "#3b82f6",
    fillOpacity: 0.15,
    weight: 1
  }).addTo(map);

  // Marcador dinámico animado (pulso azul)
  const pulseIcon = L.divIcon({
    className: "user-location-pulse-container",
    html: `
      <div class="relative w-6 h-6 flex items-center justify-center">
        <div class="absolute w-6 h-6 bg-blue-500 rounded-full opacity-35 animate-ping"></div>
        <div class="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  userLocationMarker = L.marker([coords.lat, coords.lng], { icon: pulseIcon }).addTo(map);
  
  // Centra las consultas geográficas en el punto de geolocalización
  mapStore.setSearchCenter(coords.lat, coords.lng);
};

/**
 * Función auxiliar para sanitizar cadenas HTML y evitar vulnerabilidades de inyección XSS
 * en popups dinámicos de Leaflet.
 */
const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Limpia y redibuja los marcadores de parkings en el mapa Leaflet.
 * Utiliza DivIcons para inyectar código HTML personalizado y dar estilo a las etiquetas de precio.
 */
const renderMarkers = () => {
  if (!map || !markersGroup) return;

  // Vacía todos los marcadores previos del grupo de capas
  markersGroup.clearLayers();

  // Dibuja un pin por cada parking coincidente con el filtro activo
  mapStore.filteredSpots.forEach((spot) => {
    const isSelected = spot.id === mapStore.selectedSpotId;
    const formattedPrice = spot.price.toFixed(2).replace(".", ",") + " €";

    // Diseña el pin de precio flotante con estilos reactivos
    const customIcon = L.divIcon({
      className: "custom-price-marker-wrap",
      html: `
        <div class="price-marker ${isSelected ? 'price-marker-gold border-amber-300' : ''} transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer">
          ${formattedPrice}
        </div>
      `,
      iconSize: [70, 38],
      iconAnchor: [35, 38]
    });

    const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });

    // Maqueta el popup informativo HTML asociado al marcador sanitizando entradas para evitar XSS
    const popupHtml = `
      <div class="p-2 min-w-[200px]">
        <h4 class="font-bold text-night text-sm leading-tight">${escapeHtml(spot.name)}</h4>
        <p class="text-xs text-gray-500 mt-1">${escapeHtml(spot.address)}</p>
        <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <span class="text-xs font-semibold text-violet">${spot.rating} ★ (${spot.reviews})</span>
          <span class="font-extrabold text-night text-sm">${spot.price.toFixed(2)} €/h</span>
        </div>
        <button 
          id="popup-btn-${spot.id}"
          class="w-full mt-3 bg-violet hover:bg-violet-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg text-center transition-colors border-0"
        >
          Ver detalles
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml, {
      closeButton: false,
      offset: L.point(0, -25),
      className: "custom-leaflet-popup"
    });

    // Cambia la plaza seleccionada en la store al cliquear el pin
    marker.on("click", () => {
      mapStore.setSelectedSpotId(spot.id);
    });

    // Enlaza el evento click del botón dentro del popup HTML con la navegación de Vue Router
    marker.on("popupopen", () => {
      setTimeout(() => {
        const btn = document.getElementById(`popup-btn-${spot.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            router.push(`/spot/${spot.id}`);
          });
        }
      }, 50);
    });

    // Añade el marcador dibujado al grupo para ser visible
    markersGroup?.addLayer(marker);
  });
};
</script>

<style>
/* Modificadores estéticos del popup nativo de Leaflet */
.custom-leaflet-popup .leaflet-popup-content-wrapper {
  background: white;
  border-radius: 16px;
  padding: 4px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.custom-leaflet-popup .leaflet-popup-tip {
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.custom-price-marker-wrap {
  background: transparent !important;
  border: none !important;
}
</style>
