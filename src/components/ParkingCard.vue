<template>
  <div class="bg-white rounded-3xl p-4 shadow-soft border border-gray-100 flex flex-col md:flex-row gap-5 hover:border-violet-100 transition-all duration-300 group">
    
    <!-- Lado Izquierdo: Contenedor de Imagen de Parking con Favorito -->
    <div class="relative w-full md:w-56 h-40 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm">
      <img 
        :src="imageUrl" 
        :alt="spot.name" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      
      <!-- Botón de guardar en favoritos -->
      <button 
        @click.stop="toggleFavorite"
        class="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all active:scale-95 border-0 cursor-pointer"
      >
        <Heart 
          :class="isFavorite ? 'fill-red-500 text-red-500' : 'text-white'" 
          class="w-4 h-4 transition-transform group-hover:scale-110" 
        />
      </button>

      <!-- Indicador flotante de valoración por estrellas -->
      <div class="absolute bottom-3 left-3 bg-night/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
        <Star class="w-3 h-3 text-amber fill-amber" />
        <span>{{ spot.rating.toFixed(1) }} ({{ spot.reviews }})</span>
      </div>
    </div>

    <!-- Lado Central: Metadatos del parking, zona y tags -->
    <div class="flex-grow flex flex-col justify-between py-1">
      <div>
        <div class="flex items-center gap-1.5">
          <h3 class="text-night font-extrabold text-lg group-hover:text-violet transition-colors">
            {{ spot.name }}
          </h3>
          <!-- Marca verificada -->
          <CheckCircle2 class="w-4 h-4 text-violet fill-violet/10 flex-shrink-0" />
        </div>
        
        <p class="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
          <span class="font-bold text-gray-700">{{ spot.zone }}</span>
          <span>•</span>
          <span class="truncate max-w-[200px] md:max-w-[250px]">{{ spot.address.split(',')[1]?.trim() || spot.address }}</span>
        </p>

        <!-- Etiquetas de servicios/características -->
        <div class="flex flex-wrap gap-1.5 mt-3">
          <span 
            v-for="tag in spot.tags" 
            :key="tag"
            class="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-semibold border border-gray-100"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Puntuación para visualización alternativa en móvil -->
      <div class="flex items-center gap-1 text-xs text-violet font-semibold mt-3 md:mt-0">
        <div class="w-6 h-6 rounded-lg bg-violet/10 flex items-center justify-center">
          <Star class="w-3.5 h-3.5 text-violet fill-violet" />
        </div>
        <span>{{ spot.rating.toFixed(1) }} ({{ spot.reviews }} valoraciones)</span>
      </div>
    </div>

    <!-- Lado Derecho: Tarifas por hora y botón de llamada a la acción -->
    <div class="md:w-36 flex md:flex-col justify-between md:justify-center items-end md:items-stretch border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 flex-shrink-0">
      <div class="text-right md:mb-4">
        <div class="flex items-baseline justify-end gap-1">
          <span class="text-2xl font-extrabold text-night leading-none">{{ formatEuro(spot.price) }}</span>
          <span class="text-gray-400 text-xs font-bold">/h</span>
        </div>
        <div class="text-xs text-gray-500 font-medium mt-1">
          {{ formatEuro(spot.total) }} total <span class="font-semibold text-gray-700">(4h)</span>
        </div>
      </div>

      <button 
        @click="viewDetails"
        class="bg-spot-secondary hover:bg-amber-400 text-night font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] border-0 cursor-pointer"
      >
        Ver detalles
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: ParkingCard.vue
 * DESCRIPCIÓN: Tarjeta de presentación simplificada para cada parking en la lista del buscador.
 * Muestra fotos de prueba de alta resolución, marcas verificadas,
 * y formatea precios a Euros con localización española.
 */
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { ParkingSpot } from "../types";
import { Star, Heart, CheckCircle2 } from "lucide-vue-next";

const props = defineProps<{
  spot: ParkingSpot;
}>();

const router = useRouter();
const isFavorite = ref(false);

// Imágenes de prueba de alta resolución según ID de parking
const imageUrl = computed(() => {
  if (props.spot.id === "lesrundi") {
    return "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=400&q=80";
  } else if (props.spot.id === "iparraguirre") {
    return "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=80";
  } else if (props.spot.id === "deusto") {
    return "https://images.unsplash.com/photo-1506521788723-85811181d33b?auto=format&fit=crop&w=400&q=80";
  }
  return "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=400&q=80";
});

const formatEuro = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const viewDetails = () => {
  router.push(`/spot/${props.spot.id}`);
};
</script>
