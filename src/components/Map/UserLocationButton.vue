<template>
  <button 
    @click="geolocate"
    :disabled="loading"
    class="w-10 h-10 rounded-full bg-white text-night hover:text-violet flex items-center justify-center shadow-lg border border-gray-100 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-70 border-0 cursor-pointer"
    title="Centrar en mi ubicación"
  >
    <Navigation 
      v-if="!loading" 
      :class="{'fill-violet text-violet': active}"
      class="w-5 h-5 transform rotate-45" 
    />
    <Loader2 
      v-else 
      class="w-5 h-5 animate-spin text-violet" 
    />
  </button>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: UserLocationButton.vue
 * DESCRIPCIÓN: Botón flotante para geolocalizar al conductor vía GPS nativo (navigator.geolocation).
 * Si las coordenadas detectadas caen fuera del área geográfica de Bilbao,
 * sitúa una posición simulada de alta fidelidad en el centro de Bilbao para mantener la consistencia del prototipo.
 */
import { ref } from "vue";
import { Navigation, Loader2 } from "lucide-vue-next";

// Emite las coordenadas del usuario geolocalizado
const emit = defineEmits<{
  (e: "location-found", coords: { lat: number; lng: number; accuracy: number }): void;
}>();

const loading = ref(false);
const active = ref(false);

/**
 * Consulta la API de geolocalización nativa HTML5.
 */
const geolocate = () => {
  if (!navigator.geolocation) {
    alert("Geolocalización no soportada por este navegador.");
    return;
  }

  loading.value = true;
  active.value = false;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      
      // Comprueba si el usuario se encuentra físicamente cerca de Bilbao (lat 43.26, lng -2.93)
      const isNearBilbao = Math.abs(coords.lat - 43.26) < 0.2 && Math.abs(coords.lng - (-2.93)) < 0.2;
      
      // Si está en otro lugar, simula una posición en Bilbao para poder ver las plazas de prueba
      const targetCoords = isNearBilbao ? coords : {
        lat: 43.2630 + (Math.random() - 0.5) * 0.005, // Coordenadas aleatorias cerca del centro
        lng: -2.9350 + (Math.random() - 0.5) * 0.005,
        accuracy: 15
      };

      active.value = true;
      loading.value = false;
      emit("location-found", targetCoords);
    },
    (error) => {
      console.error("Error obteniendo ubicación:", error);
      loading.value = false;
      
      // Coordenadas de contingencia (Fallback en Bilbao) si falla el permiso GPS
      const fallbackCoords = {
        lat: 43.2631, 
        lng: -2.9328,
        accuracy: 25
      };
      active.value = true;
      emit("location-found", fallbackCoords);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};
</script>
