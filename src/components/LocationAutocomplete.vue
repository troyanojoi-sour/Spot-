<template>
  <div class="relative w-full">
    <!-- Contenedor del buscador input -->
    <div class="flex items-center gap-2 px-3 py-1.5 flex-grow">
      <Search class="w-4 h-4 text-gray-400 flex-shrink-0" />
      <input 
        type="text" 
        v-model="query" 
        @input="onInput"
        @focus="isFocused = true"
        @blur="onBlur"
        placeholder="¿Dónde quieres aparcar en España?" 
        class="bg-transparent border-0 text-white font-semibold text-sm placeholder-gray-400 focus:ring-0 focus:outline-none w-full"
      />
      <!-- Animación de carga durante peticiones HTTP a Nominatim -->
      <Loader2 v-if="loading" class="w-3.5 h-3.5 animate-spin text-violet-400 flex-shrink-0" />
      <!-- Botón para vaciar el buscador -->
      <button 
        v-else-if="query" 
        type="button" 
        @click="clearSearch" 
        class="bg-transparent border-0 text-gray-400 hover:text-white cursor-pointer"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Menú desplegable flotante con las sugerencias encontradas -->
    <ul 
      v-if="isFocused && suggestions.length > 0" 
      class="absolute left-0 right-0 mt-3 bg-white text-night rounded-2xl shadow-soft border border-gray-150 overflow-hidden divide-y divide-gray-100 z-50 max-h-60 overflow-y-auto"
    >
      <li 
        v-for="s in suggestions" 
        :key="s.place_id"
        @mousedown="selectSuggestion(s)"
        class="px-4 py-3 hover:bg-violet/5 cursor-pointer text-xs font-bold text-left transition-colors flex items-start gap-2.5"
      >
        <MapPin class="w-4 h-4 text-violet flex-shrink-0 mt-0.5" />
        <div class="min-w-0">
          <p class="text-xs font-black text-night truncate">{{ s.name }}</p>
          <p class="text-[10px] text-gray-400 font-medium truncate mt-0.5">{{ s.address }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: LocationAutocomplete.vue
 * DESCRIPCIÓN: Buscador de autocompletado inteligente conectado a OpenStreetMap Nominatim.
 * Implementa una técnica de "debounce" para no saturar el servidor público con llamadas HTTP
 * y limita geográficamente las sugerencias obtenidas únicamente al territorio nacional español.
 */
import { ref } from "vue";
import { Search, Loader2, X, MapPin } from "lucide-vue-next";

// Definición de los eventos que emite el componente hacia su padre (ExploreScreen / HomeScreen)
const emit = defineEmits<{
  (e: "select", coords: { lat: number; lng: number; name: string }): void;
}>();

// Estado reactivo de la búsqueda
const query = ref("Bilbao, España");
const suggestions = ref<any[]>([]);
const loading = ref(false);
const isFocused = ref(false);

// Temporizador para el debounce del teclado
let debounceTimeout: any = null;

/**
 * Escucha las pulsaciones en el input de texto.
 * Retrasa la consulta a Nominatim 450ms para esperar que el usuario termine de escribir.
 */
const onInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  
  if (!query.value.trim() || query.value.length < 3) {
    suggestions.value = [];
    return;
  }

  loading.value = true;
  debounceTimeout = setTimeout(() => {
    fetchSuggestions();
  }, 450);
};

/**
 * Realiza la petición HTTP GET a la API Nominatim de OpenStreetMap.
 * Añade cabeceras de idioma y limita a 5 resultados para mantener un rendimiento óptimo.
 */
const fetchSuggestions = async () => {
  try {
    // Consulta restringida a España (countrycodes=es) para evitar resultados internacionales
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.value)}&countrycodes=es&limit=5&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "es" // Prioriza nombres e info en español
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      suggestions.value = data.map((item: any) => {
        // Estructura una respuesta legible combinando partes del nombre
        const name = item.address.road || item.address.suburb || item.address.city || item.address.town || item.name || "Dirección";
        const rest = item.display_name.replace(name + ",", "").trim();
        return {
          place_id: item.place_id,
          name,
          address: rest,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        };
      });
    }
  } catch (e) {
    console.error("Error consultando geocodificador Nominatim:", e);
  } finally {
    loading.value = false;
  }
};

/**
 * Emite la selección de dirección, enviando las coordenadas de latitud/longitud
 * y centrando el mapa en el resultado de búsqueda.
 * @param s Objeto de sugerencia seleccionado.
 */
const selectSuggestion = (s: any) => {
  query.value = `${s.name}, ${s.address.split(',')[0]}`;
  suggestions.value = [];
  isFocused.value = false;
  emit("select", { lat: s.lat, lng: s.lng, name: s.name });
};

/**
 * Borra el input de búsqueda y las sugerencias cargadas.
 */
const clearSearch = () => {
  query.value = "";
  suggestions.value = [];
};

/**
 * Cierra la lista de sugerencias cuando el input pierde el foco.
 * Aplica un delay mínimo (180ms) para posibilitar el clic en los elementos de la lista.
 */
const onBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 180);
};
</script>
