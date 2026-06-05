<template>
  <div class="min-h-screen bg-night text-white font-sans flex flex-col">
    
    <!-- Barra de Navegación de Cabecera (Header) -->
    <header class="container mx-auto px-6 py-5 flex items-center justify-between z-20 border-b border-white/5">
      <Logo />
      <button 
        @click="router.push('/explore')"
        class="bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4" />
        Volver a resultados
      </button>
    </header>

    <!-- Sección Principal (2 Columnas) -->
    <main v-if="spot" class="flex-grow container mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-8 items-start">
      
      <!-- COLUMNA IZQUIERDA: Fotos del parking, descripción y normas del garaje -->
      <section class="w-full lg:w-[60%] space-y-6">
        
        <!-- Carrusel de imagen activa -->
        <div class="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-soft border border-white/10">
          <img 
            :src="images[activeImageIndex]" 
            :alt="spot.name" 
            class="w-full h-full object-cover"
          />
          
          <!-- Indicador flotante del índice de foto -->
          <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
            {{ activeImageIndex + 1 }}/{{ images.length }}
          </div>
        </div>

        <!-- Galería de miniaturas (Thumbnails clickeables) -->
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          <div 
            v-for="(img, idx) in images" 
            :key="idx"
            @click="activeImageIndex = idx"
            :class="activeImageIndex === idx ? 'ring-2 ring-violet border-transparent' : 'border-white/10 hover:border-white/30'"
            class="relative w-28 h-18 rounded-xl overflow-hidden border cursor-pointer flex-shrink-0 transition-all duration-200"
          >
            <img :src="img" class="w-full h-full object-cover" />
            <!-- Caja de imágenes extra -->
            <div 
              v-if="idx === 3 && images.length > 4" 
              class="absolute inset-0 bg-black/60 flex items-center justify-center font-bold text-sm"
            >
              +{{ images.length - 4 }}
            </div>
          </div>
        </div>

        <!-- Bloque de Detalles (Descripción y Normas) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-sm">
          
          <!-- Descripción del Parking -->
          <div class="space-y-4">
            <h3 class="text-sm font-black uppercase tracking-wider text-gray-400">Descripción</h3>
            <p class="text-gray-300 text-sm leading-relaxed">
              {{ descriptionText }}
            </p>
          </div>

          <!-- Normas del Propietario -->
          <div class="space-y-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
            <h3 class="text-sm font-black uppercase tracking-wider text-gray-400">Normas de la plaza</h3>
            <ul class="space-y-3">
              <li 
                v-for="rule in rules" 
                :key="rule" 
                class="flex items-start gap-2.5 text-sm text-gray-300"
              >
                <CheckCircle2 class="w-4.5 h-4.5 text-spot-success flex-shrink-0 mt-0.5" />
                <span>{{ rule }}</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      <!-- COLUMNA DERECHA: Ficha flotante de reserva y estimación de tarifas -->
      <section class="w-full lg:w-[40%] lg:sticky lg:top-24">
        <div class="bg-white text-night rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-150/40 space-y-6">
          
          <!-- Metadatos superiores (Guardar en favoritos y Compartir) -->
          <div class="space-y-2">
            <div class="flex items-center justify-end gap-3">
              <button class="bg-gray-50 hover:bg-gray-100 p-2 rounded-xl text-gray-500 hover:text-night border-0 flex items-center gap-1.5 text-xs font-bold">
                <Share2 class="w-4 h-4" />
                Compartir
              </button>
              <button 
                @click="isFavorite = !isFavorite"
                class="bg-gray-50 hover:bg-gray-100 p-2 rounded-xl border-0 transition-colors cursor-pointer"
              >
                <Heart 
                  :class="isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'" 
                  class="w-4.5 h-4.5" 
                />
              </button>
            </div>

            <!-- Título del parking y marca verificada -->
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-black text-night leading-none">{{ spot.name }}</h1>
              <CheckCircle2 class="w-5 h-5 text-violet fill-violet/10 flex-shrink-0" />
            </div>

            <!-- Dirección completa -->
            <p class="text-xs text-gray-500 font-medium">
              {{ spot.zone }} • {{ spot.address }}
            </p>

            <!-- Valoración media y disponibilidad actual -->
            <div class="flex items-center justify-between pt-1 flex-wrap gap-2 text-xs">
              <div class="flex items-center gap-1.5 font-bold text-night">
                <Star class="w-4 h-4 text-amber fill-amber" />
                <span>{{ spot.rating.toFixed(1) }}</span>
                <span class="text-gray-400 font-normal">({{ spot.reviews }} valoraciones)</span>
              </div>
              <div class="flex items-center gap-1.5 font-bold text-spot-success">
                <div class="w-2 h-2 rounded-full bg-spot-success animate-ping"></div>
                <span>Disponible hoy</span>
              </div>
            </div>

          </div>

          <!-- Etiquetas de Servicios de la plaza -->
          <div class="flex flex-wrap gap-1.5 py-1 border-y border-gray-100">
            <span 
              v-for="tag in allTags" 
              :key="tag"
              class="bg-gray-50 text-gray-600 px-3 py-1 rounded-xl text-xs font-bold border border-gray-100/50"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Selector de Franjas Horarias (Filtradas dinámicamente por la disponibilidad del Propietario) -->
          <div class="space-y-3.5">
            <h3 class="text-sm font-black text-night uppercase tracking-wider">Selecciona tu franja horaria</h3>
            <p class="text-xs text-gray-400 font-bold uppercase mt-1">Hoy, 24 de mayo</p>
            
            <div v-if="timeSlots.length > 0" class="relative flex items-center">
              
              <!-- Contenedor scrollable horizontal de franjas -->
              <div class="flex gap-2.5 overflow-x-auto w-full pb-2 pr-8 scroll-smooth scrollbar-none">
                <button 
                  v-for="slot in timeSlots" 
                  :key="slot"
                  @click="activeSlot = slot"
                  :class="activeSlot === slot ? 'bg-violet text-white border-violet shadow-glow' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'"
                  class="py-3.5 px-4 rounded-2xl flex flex-col items-center justify-center font-bold text-xs border flex-shrink-0 transition-all cursor-pointer min-w-[100px]"
                >
                  <span>{{ slot.split(' - ')[0] }}</span>
                  <span class="opacity-60 font-semibold mt-0.5">{{ slot.split(' - ')[1] }}</span>
                </button>
              </div>

              <!-- Flecha de scroll derecha -->
              <div class="absolute right-0 top-0 bottom-2 bg-gradient-to-l from-white via-white to-transparent w-10 flex items-center justify-end pointer-events-none">
                <button class="w-7 h-7 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center text-night shadow-sm pointer-events-auto hover:bg-gray-100 active:scale-95 transition-all">
                  <ChevronRight class="w-4.5 h-4.5" />
                </button>
              </div>

            </div>
            
            <!-- Aviso informativo de horarios restringidos por el propietario -->
            <div v-if="spot.availability" class="bg-violet-50 text-[10px] font-bold text-violet-800 p-2.5 rounded-xl border border-violet-100 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 flex-shrink-0" />
              <span>Plaza disponible únicamente en horario de propietario: {{ spot.availability.startTime }} a {{ spot.availability.endTime }}</span>
            </div>
          </div>

          <!-- Desglose e importe estimado -->
          <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
            <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-wider">Precio estimado</h3>
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-extrabold text-night leading-none">{{ formatEuro(computedTotal) }}</span>
              <span class="text-[11px] text-gray-500 font-bold">
                ({{ formatEuro(spot.price) }}/h x 4h) + comisión ({{ formatEuro(0.56) }})
              </span>
            </div>
          </div>

          <!-- Botón de Confirmación para pasar a Pasarela Stripe -->
          <div class="space-y-3">
            <button 
              @click="handleBooking"
              class="w-full bg-violet hover:bg-violet-700 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-glow active:scale-[0.98] border-0 cursor-pointer"
            >
              <Lock class="w-4 h-4 text-violet-300" />
              Reservar ahora
            </button>
            
            <div class="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-bold">
              <Lock class="w-3.5 h-3.5" />
              <span>Pago seguro con Stripe</span>
            </div>
          </div>

        </div>
      </section>

    </main>

    <!-- Indicador de carga -->
    <div v-else class="flex-grow flex items-center justify-center text-center p-12">
      <div>
        <h2 class="text-xl font-bold text-gray-400">Cargando plaza de parking...</h2>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: DetailScreen.vue
 * DESCRIPCIÓN: Ficha de detalle de un parking seleccionado.
 * Obtiene el ID desde la ruta de Vue Router, lee la plaza desde Pinia,
 * calcula reactivamente las franjas horarias disponibles según el calendario de disponibilidad del propietario,
 * y arranca el flujo de reserva con la acción `startBooking`.
 */
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMapStore } from "../stores/map";
import { useBookingStore } from "../stores/booking";
import Logo from "../components/Logo.vue";
import { 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  Share2, 
  Heart, 
  Lock,
  Calendar
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const mapStore = useMapStore();
const bookingStore = useBookingStore();

// Obtiene la plaza de parking activa por parámetros de ruta de Vue Router
const spot = computed(() => {
  const id = route.params.id as string;
  return mapStore.spots.find(s => s.id === id) || mapStore.spots[0];
});

const isFavorite = ref(false);
const activeImageIndex = ref(0);
const activeSlot = ref("");

/**
 * Propiedad computada reactiva.
 * Devuelve únicamente las franjas de alquiler que caen dentro del horario configurado
 * por el propietario en el panel de disponibilidad (OwnerScreen).
 */
const timeSlots = computed(() => {
  const allSlots = ["08:00 - 12:00", "09:00 - 13:00", "10:00 - 14:00", "11:00 - 15:00", "12:00 - 16:00", "13:00 - 17:00", "14:00 - 18:00", "15:00 - 19:00", "16:00 - 20:00"];
  if (!spot.value || !spot.value.availability) {
    return allSlots;
  }
  
  const { startTime, endTime } = spot.value.availability;
  
  // Convierte formatos "HH:MM" a minutos absolutos del día
  const parseTimeToMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  
  const availStartMins = parseTimeToMins(startTime);
  const availEndMins = parseTimeToMins(endTime);
  
  return allSlots.filter(slot => {
    const [start, end] = slot.split(" - ");
    const startMins = parseTimeToMins(start);
    const endMins = parseTimeToMins(end);
    
    // Solo incluye el slot si está totalmente contenido en el rango del propietario
    return startMins >= availStartMins && endMins <= availEndMins;
  });
});

onMounted(() => {
  if (timeSlots.value.length > 0) {
    activeSlot.value = timeSlots.value[0];
  } else {
    activeSlot.value = "09:00 - 13:00";
  }
});

// Observador para actualizar el slot por defecto si cambia el parking
watch(spot, () => {
  if (timeSlots.value.length > 0) {
    activeSlot.value = timeSlots.value[0];
  }
});

// Galería de imágenes simuladas según la plaza
const images = computed(() => {
  if (spot.value?.id === "lesrundi") {
    return [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506521788723-85811181d33b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1512403754473-27855fbc7e1f?auto=format&fit=crop&w=400&q=80"
    ];
  } else if (spot.value?.id === "iparraguirre") {
    return [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506521788723-85811181d33b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1512403754473-27855fbc7e1f?auto=format&fit=crop&w=400&q=80"
    ];
  }
  return [
    "https://images.unsplash.com/photo-1506521788723-85811181d33b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=80"
  ];
});

const descriptionText = computed(() => {
  if (spot.value?.id === "lesrundi") {
    return "Plaza amplia y de fácil acceso en pleno Abando. Lersundi 9. Ideal para trabajar o gestiones en el centro de Bilbao. La plaza está situada en la planta -1 de un edificio moderno con rampas anchas.";
  }
  return `Excelente plaza de parking privada en ${spot.value?.zone || "Bilbao"}. Fácil acceso y maniobrabilidad. Perfecta para estancias cortas o largas. Ubicación céntrica y segura.`;
});

const rules = computed(() => {
  if (spot.value?.id === "lesrundi") {
    return [
      "No apto para vehículos > 4,5 m",
      "Dejar llaves en conserjería",
      "No se permite lavado de vehículos"
    ];
  }
  return [
    "Respetar las líneas de la plaza",
    "Cerrar la puerta al salir",
    "No arrojar basura en el garaje"
  ];
});

const allTags = computed(() => {
  const defaultTags = ["Cubierta", "Vigilancia 24/7", "Puerta automática", "Cámara", "Ascensor"];
  return spot.value ? [...spot.value.tags, "Cámara", "Ascensor"].slice(0, 5) : defaultTags;
});

// Importe total estimado
const computedTotal = computed(() => {
  if (!spot.value) return 0;
  if (spot.value.id === "lesrundi") {
    return 19.60;
  }
  return spot.value.price * 4 + 0.56;
});

const formatEuro = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Lanza la acción de compra en la store de reservas e inicia la pasarela Stripe (BookingScreen).
 */
const handleBooking = () => {
  if (!spot.value) return;
  bookingStore.startBooking(spot.value, activeSlot.value || "09:00 - 13:00", "Hoy, 24 de mayo");
  router.push("/booking");
};
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
