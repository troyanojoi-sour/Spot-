<template>
  <div class="min-h-screen bg-[#f6f3f8] text-night font-sans flex flex-col">
    
    <!-- Cabecera Superior: Filtros Rápidos, Nominatim y Navegación -->
    <header class="bg-night text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
      <Logo />

      <!-- Contenedores de Búsqueda Rápida y Geocodificación -->
      <div class="flex flex-wrap items-center bg-white/10 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10 shadow-inner w-full md:w-auto gap-2 md:gap-0">
        <!-- Input de geocodificación conectado a Nominatim -->
        <div class="flex items-center flex-grow md:flex-initial w-full md:w-60 z-30">
          <LocationAutocomplete @select="onLocationSelect" />
        </div>

        <!-- Selector de fecha (informativo) -->
        <div class="h-6 w-[1px] bg-white/20 hidden md:block"></div>
        <div class="flex items-center gap-2 px-4 py-1.5 md:py-1 relative cursor-pointer group flex-grow md:flex-initial">
          <Calendar class="w-4 h-4 text-violet-400 flex-shrink-0" />
          <span class="text-sm font-semibold text-white whitespace-nowrap">{{ selectedDate }}</span>
        </div>

        <!-- Selector de franja horaria (informativo) -->
        <div class="h-6 w-[1px] bg-white/20 hidden md:block"></div>
        <div class="flex items-center gap-2 px-4 py-1.5 md:py-1 relative cursor-pointer group flex-grow md:flex-initial">
          <Clock class="w-4 h-4 text-violet-400 flex-shrink-0" />
          <span class="text-sm font-semibold text-white whitespace-nowrap">{{ selectedTimeSlot }}</span>
        </div>

        <!-- Botón de filtros flotantes (Visible solo en dispositivos móviles) -->
        <button 
          @click="showMobileFilters = !showMobileFilters"
          class="md:hidden bg-violet hover:bg-violet-600 text-white p-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold border-0 cursor-pointer ml-auto"
        >
          <SlidersHorizontal class="w-3.5 h-3.5" />
          Filtros
        </button>
      </div>

      <!-- Acción de cambio de pantalla a vista de panel completo -->
      <div class="hidden md:flex items-center gap-3">
        <button 
          @click="router.push('/dashboard')"
          class="bg-violet hover:bg-violet-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-glow active:scale-95 border-0 cursor-pointer"
        >
          <Map class="w-4 h-4" />
          Ver Mapa
        </button>
      </div>
    </header>

    <!-- Cuerpo Principal de la Búsqueda (Estructura de 2 Columnas) -->
    <div class="flex-grow container mx-auto px-4 md:px-6 py-6 flex gap-6 relative">
      
      <!-- COLUMNA IZQUIERDA: Panel de Filtros (Fijo en desktop, desplegable en mobile) -->
      <aside 
        :class="showMobileFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
        class="fixed md:static inset-y-0 left-0 w-80 max-w-[90%] md:w-72 bg-white md:bg-transparent p-6 md:p-0 z-40 md:z-10 transition-transform duration-300 ease-in-out md:block border-r md:border-r-0 border-gray-200 overflow-y-auto"
      >
        <div class="bg-white rounded-3xl p-6 shadow-soft border border-gray-150/40 space-y-8 sticky top-24">
          
          <!-- Encabezado de la caja de filtros -->
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 class="text-lg font-extrabold text-night flex items-center gap-2">
              <SlidersHorizontal class="w-4.5 h-4.5 text-violet" />
              Filtros
            </h2>
            <button 
              @click="clearFilters"
              class="text-xs font-bold text-violet-500 hover:text-violet-700 bg-transparent border-0 cursor-pointer"
            >
              Limpiar
            </button>
          </div>

          <!-- Filtro 1: Características de la Plaza (Etiquetas) -->
          <div>
            <h3 class="text-sm font-black text-night uppercase tracking-wider mb-4">Tipos de plaza</h3>
            <div class="space-y-3.5">
              <label 
                v-for="type in spotTypes" 
                :key="type" 
                class="flex items-center gap-3 cursor-pointer group"
              >
                <input 
                  type="checkbox" 
                  :value="type" 
                  v-model="mapStore.filters.types" 
                  class="w-5 h-5 rounded-lg border-gray-300 text-violet focus:ring-violet/30 cursor-pointer accent-violet"
                />
                <span class="text-sm font-semibold text-gray-600 group-hover:text-night transition-colors">
                  {{ type }}
                </span>
              </label>
            </div>
          </div>

          <!-- Filtro 2: Deslizador de precio por hora -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-black text-night uppercase tracking-wider">Precio máximo</h3>
              <span class="text-sm font-extrabold text-violet">{{ formatEuro(mapStore.filters.maxPrice) }}</span>
            </div>
            
            <input 
              type="range" 
              min="0.5" 
              max="3.0" 
              step="0.1" 
              v-model.number="mapStore.filters.maxPrice"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet"
            />
            <div class="flex items-center justify-between text-[11px] text-gray-400 font-bold mt-2">
              <span>0,50 €</span>
              <span>3,00 €+</span>
            </div>
          </div>

          <!-- Filtro 3: Aptitud y dimensiones para el Vehículo -->
          <div>
            <h3 class="text-sm font-black text-night uppercase tracking-wider mb-4">Tamaño</h3>
            <div class="grid grid-cols-3 gap-2">
              
              <!-- Moto -->
              <button 
                @click="mapStore.filters.size = 'moto'"
                :class="mapStore.filters.size === 'moto' ? 'bg-violet text-white shadow-glow border-violet' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-150'"
                class="py-3.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 border font-extrabold text-[10px] tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Bike class="w-4 h-4" />
                Moto
              </button>

              <!-- Coche -->
              <button 
                @click="mapStore.filters.size = 'coche'"
                :class="mapStore.filters.size === 'coche' ? 'bg-violet text-white shadow-glow border-violet' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-150'"
                class="py-3.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 border font-extrabold text-[10px] tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Car class="w-4 h-4" />
                Coche
              </button>

              <!-- Furgoneta -->
              <button 
                @click="mapStore.filters.size = 'furgoneta'"
                :class="mapStore.filters.size === 'furgoneta' ? 'bg-violet text-white shadow-glow border-violet' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-150'"
                class="py-3.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 border font-extrabold text-[10px] tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Truck class="w-4 h-4" />
                Furgoneta
              </button>

            </div>
          </div>

          <!-- Botón de aplicar móvil -->
          <button 
            @click="showMobileFilters = false"
            class="md:hidden w-full bg-night hover:bg-night/95 text-white font-bold py-3 rounded-2xl transition-colors border-0 cursor-pointer"
          >
            Aplicar filtros
          </button>

        </div>
      </aside>

      <!-- Fondo oscuro del panel lateral en pantallas móviles -->
      <div 
        v-if="showMobileFilters" 
        @click="showMobileFilters = false" 
        class="fixed inset-0 bg-black/50 z-30 md:hidden"
      ></div>

      <!-- COLUMNA DERECHA: Listado de Resultados de Parkings Coincidentes -->
      <main class="flex-grow flex flex-col min-w-0">
        
        <!-- Barra de Estadísticas y Criterio de Ordenación -->
        <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div class="text-left">
            <h2 class="text-2xl font-black text-night leading-none">
              {{ mapStore.filteredSpots.length }} plazas disponibles
            </h2>
            <p class="text-gray-500 text-xs mt-1.5 font-medium">
              Mostrando plazas libres de parking
            </p>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">Ordenar:</span>
            <select 
              v-model="sortOrder"
              class="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-bold text-night focus:outline-none focus:border-violet cursor-pointer"
            >
              <option value="rating">Mejor valoradas</option>
              <option value="price-asc">Precio más bajo</option>
              <option value="price-desc">Precio más alto</option>
            </select>
          </div>
        </div>

        <!-- Renderizado de las Tarjetas de Parking encontradas -->
        <div v-if="mapStore.filteredSpots.length > 0" class="space-y-4">
          <ParkingCard 
            v-for="spot in sortedSpots" 
            :key="spot.id" 
            :spot="spot" 
          />
        </div>
        
        <!-- Estado Vacío (Empty State) si no hay resultados -->
        <div 
          v-else 
          class="flex-grow bg-white rounded-3xl border border-gray-150 p-12 text-center flex flex-col items-center justify-center shadow-soft"
        >
          <div class="w-16 h-16 rounded-2xl bg-violet/10 flex items-center justify-center text-violet mb-4">
            <SlidersHorizontal class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-extrabold text-night">No se encontraron plazas</h3>
          <p class="text-gray-500 text-sm max-w-sm mt-2">
            Intenta ampliar el rango de precio, desactivar algunos filtros de servicios o buscar en otra zona de la ciudad.
          </p>
          <button 
            @click="clearFilters"
            class="mt-6 bg-violet hover:bg-violet-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all border-0 cursor-pointer"
          >
            Resetear filtros
          </button>
        </div>

      </main>

    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: ExploreScreen.vue
 * DESCRIPCIÓN: Vista de búsqueda y exploración de parkings.
 * Muestra el listado de resultados reactivos aplicando filtros de geolocalización, precios y dimensiones de garaje.
 */
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMapStore } from "../stores/map";
import Logo from "../components/Logo.vue";
import ParkingCard from "../components/ParkingCard.vue";
import { 
  Calendar, 
  Clock, 
  SlidersHorizontal, 
  Map, 
  Bike, 
  Car, 
  Truck 
} from "lucide-vue-next";
import LocationAutocomplete from "../components/LocationAutocomplete.vue";

const router = useRouter();
const mapStore = useMapStore();

// Dispara la carga inicial y observa cambios para sincronizar con el backend
onMounted(() => {
  mapStore.fetchSpots();
});

watch(
  () => mapStore.filters,
  () => {
    mapStore.fetchSpots();
  },
  { deep: true }
);

watch(
  () => mapStore.searchCenter,
  () => {
    mapStore.fetchSpots();
  }
);

// Textos simulados para la cabecera
const selectedDate = ref("Hoy, 24 may");
const selectedTimeSlot = ref("09:00 - 13:00");
const showMobileFilters = ref(false);
const sortOrder = ref("rating");

/**
 * Centra el buscador cuando el geocodificador Nominatim devuelve un punto geográfico válido.
 * @param coords Coordenadas (lat/lng) del punto elegido.
 */
const onLocationSelect = (coords: { lat: number; lng: number; name: string }) => {
  mapStore.setSearchCenter(coords.lat, coords.lng);
  mapStore.setSelectedSpotId(null);
};

// Listado de características de parking disponibles
const spotTypes = ["Cubierta", "Descubierta", "Con vigilancia", "Con puerta automática", "Cargador eléctrico"];

// Limpia los filtros volviendo al estado inicial en Pinia
const clearFilters = () => {
  mapStore.resetFilters();
};

/**
 * Formatea importes numéricos a formato moneda Euro (€) en español (es-ES).
 * @param value Importe numérico a formatear.
 */
const formatEuro = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Propiedad computada reactiva.
 * Ordena las plazas coincidentes según la valoración por estrellas o tarifas de precio por hora.
 */
const sortedSpots = computed(() => {
  const list = [...mapStore.filteredSpots];
  if (sortOrder.value === "rating") {
    return list.sort((a, b) => b.rating - a.rating);
  } else if (sortOrder.value === "price-asc") {
    return list.sort((a, b) => a.price - b.price);
  } else if (sortOrder.value === "price-desc") {
    return list.sort((a, b) => b.price - a.price);
  }
  return list;
});
</script>

<style scoped>
/* Estilos premium personalizados para el deslizador de precio (Range input HTML) */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffc466;
  border: 3px solid #7628ef;
  box-shadow: 0 4px 10px rgba(118, 40, 239, 0.3);
  cursor: pointer;
  transition: transform 0.1s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
</style>
