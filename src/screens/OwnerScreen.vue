<template>
  <div class="min-h-screen bg-[#f6f3f8] text-night font-sans flex flex-col">
    
    <!-- Cabecera de Navegación -->
    <header class="bg-night text-white px-6 py-5 flex items-center justify-between sticky top-0 z-30 shadow-md">
      <Logo />
      
      <button 
        @click="router.push('/explore')"
        class="bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4" />
        Volver a Explorar
      </button>
    </header>

    <div class="flex-grow container mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8 items-start max-w-6xl animate-fade-in">
      
      <!-- COLUMNA IZQUIERDA: Formulario de Publicación de Plaza de Parking -->
      <main class="w-full lg:w-[60%] bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-150/40 space-y-6">
        <div class="text-left border-b border-gray-100 pb-4">
          <h2 class="text-xl font-black text-night flex items-center gap-2">
            <PlusCircle class="w-6 h-6 text-violet" />
            Publicar nueva plaza de parking
          </h2>
          <p class="text-xs text-gray-500 mt-1.5 font-medium">Completa la información para alquilar tu plaza por horas o días.</p>
        </div>

        <form @submit.prevent="submitSpot" class="space-y-5 text-left">
          
          <!-- Nombre descriptivo -->
          <div class="space-y-1.5">
            <label for="name" class="text-xs font-black text-gray-400 uppercase tracking-wider">Nombre del Parking</label>
            <input 
              id="name"
              type="text" 
              v-model="newSpot.name" 
              required
              placeholder="Ej. Garaje Gran Vía"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-violet"
            />
          </div>

          <!-- Zona y Dirección exacta -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Selector de barrio -->
            <div class="space-y-1.5">
              <label for="zone" class="text-xs font-black text-gray-400 uppercase tracking-wider">Barrio / Zona</label>
              <select 
                id="zone"
                v-model="newSpot.zone"
                required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-violet cursor-pointer"
              >
                <option value="Abando">Abando</option>
                <option value="Indautxu">Indautxu</option>
                <option value="Deusto">Deusto</option>
                <option value="Casco Viejo">Casco Viejo</option>
                <option value="Basurto">Basurto</option>
              </select>
            </div>

            <!-- Entrada de dirección fiscal/física -->
            <div class="space-y-1.5 md:col-span-2">
              <label for="address" class="text-xs font-black text-gray-400 uppercase tracking-wider">Dirección exacta</label>
              <input 
                id="address"
                type="text" 
                v-model="newSpot.address" 
                required
                placeholder="Ej. Gran Vía Kalea, 45, 48011 Bilbao"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-violet"
              />
            </div>
          </div>

          <!-- precio y dimensiones admisibles -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Precio por hora -->
            <div class="space-y-1.5">
              <label for="price" class="text-xs font-black text-gray-400 uppercase tracking-wider">Precio por hora (€/h)</label>
              <div class="relative flex items-center">
                <input 
                  id="price"
                  type="number" 
                  step="0.10"
                  min="0.50"
                  max="10.00"
                  v-model.number="newSpot.price" 
                  required
                  placeholder="2.00"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-sm font-semibold focus:outline-none focus:border-violet"
                />
                <span class="absolute right-4 text-xs font-extrabold text-gray-400">EUR/h</span>
              </div>
            </div>

            <!-- Adecuación del tamaño -->
            <div class="space-y-1.5">
              <label for="size" class="text-xs font-black text-gray-400 uppercase tracking-wider">Tamaño de vehículo admitido</label>
              <select 
                id="size"
                v-model="newSpotSize"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-violet cursor-pointer"
              >
                <option value="moto">Cualquiera (Hasta Moto)</option>
                <option value="coche">Coches estándar</option>
                <option value="furgoneta">Grandes (Hasta Furgoneta)</option>
              </select>
            </div>
          </div>

          <!-- Bloque de configuración del calendario de disponibilidad -->
          <div class="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4">
            <h3 class="text-xs font-black text-violet uppercase tracking-wider">Calendario de Disponibilidad</h3>
            <p class="text-[11px] text-gray-400 mt-0.5">Elige en qué momentos los conductores pueden reservar tu plaza.</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Hora inicial -->
              <div class="space-y-1">
                <label for="start-time" class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Hora de entrada desde</label>
                <input 
                  id="start-time"
                  type="time" 
                  v-model="newSpot.availability.startTime"
                  required
                  class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                />
              </div>

              <!-- Hora final -->
              <div class="space-y-1">
                <label for="end-time" class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Hora de salida hasta</label>
                <input 
                  id="end-time"
                  type="time" 
                  v-model="newSpot.availability.endTime"
                  required
                  class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                />
              </div>
            </div>

            <!-- Días de la semana seleccionables -->
            <div class="space-y-1.5 pt-1.5">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Días disponibles</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="day in availableWeekDays" 
                  :key="day.value"
                  type="button"
                  @click="toggleDaySelection(day.value)"
                  :class="newSpot.availability.days.includes(day.value) ? 'bg-violet text-white border-violet shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'"
                  class="w-8 h-8 rounded-xl border text-xs font-black transition-all flex items-center justify-center cursor-pointer select-none active:scale-95"
                >
                  {{ day.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Servicios y Etiquetas -->
          <div class="space-y-3">
            <h3 class="text-xs font-black text-gray-400 uppercase tracking-wider">Características u servicios</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label 
                v-for="tag in availableTags" 
                :key="tag"
                class="bg-gray-50 border border-gray-150 hover:bg-gray-100/50 p-3 rounded-xl flex items-center gap-3 cursor-pointer select-none transition-all active:scale-[0.98]"
              >
                <input 
                  type="checkbox" 
                  :value="tag" 
                  v-model="newSpot.tags" 
                  class="w-4 h-4 rounded border-gray-300 text-violet focus:ring-violet/30 cursor-pointer accent-violet"
                />
                <span class="text-xs font-bold text-gray-600">{{ tag }}</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full bg-violet hover:bg-violet-700 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-glow active:scale-[0.98] border-0 cursor-pointer mt-4"
          >
            <Check class="w-5 h-5" />
            Publicar plaza ahora
          </button>

        </form>
      </main>

      <!-- COLUMNA DERECHA: Resumen de ingresos y listado de mis plazas publicadas -->
      <aside class="w-full lg:w-[40%] space-y-6">
        
        <!-- Estimación de Ingresos -->
        <div class="bg-night text-white rounded-3xl p-6 sm:p-8 shadow-soft border border-white/5 space-y-4 relative overflow-hidden">
          <div class="absolute inset-0 bg-radial-gradient from-violet-900/10 via-transparent to-transparent pointer-events-none"></div>
          
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-wider">Mis ingresos estimaciones</h3>
          <div class="flex items-baseline justify-between pt-1">
            <span class="text-4xl font-extrabold text-amber">142,50 €</span>
            <span class="text-xs font-bold text-gray-400">Este mes (junio)</span>
          </div>

          <div class="h-[1px] bg-white/10 my-4"></div>

          <div class="grid grid-cols-2 gap-4 text-left">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Horas alquiladas</span>
              <p class="text-base font-extrabold text-white mt-0.5">57 horas</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Reservas este mes</span>
              <p class="text-base font-extrabold text-white mt-0.5">14 reservas</p>
            </div>
          </div>
        </div>

        <!-- Plazas Activas publicadas por el propietario -->
        <div class="bg-white text-night rounded-3xl p-6 shadow-soft border border-gray-150/40 space-y-4">
          <h3 class="font-extrabold text-sm text-night uppercase tracking-wider text-left pb-2 border-b border-gray-100">
            Mis Plazas Activas ({{ mapStore.spots.length - 4 }})
          </h3>
          
          <div class="space-y-3.5 pt-1">
            <div 
              v-for="spot in mapStore.spots.slice(4)" 
              :key="spot.id"
              class="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-left"
            >
              <div>
                <h4 class="font-extrabold text-sm text-night">{{ spot.name }}</h4>
                <p class="text-[10px] text-gray-500 mt-0.5">{{ spot.address }}</p>
                <div class="flex items-center gap-1.5 mt-2">
                  <span class="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Alquilable
                  </span>
                  <span v-if="spot.availability" class="text-[9px] font-bold text-violet-500 bg-violet-50 border border-violet-100/50 px-2 py-0.5 rounded-md">
                    {{ spot.availability.startTime }} - {{ spot.availability.endTime }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <span class="font-black text-sm text-night block">{{ spot.price.toFixed(2) }} €/h</span>
                <button 
                  @click="removeSpot(spot.id)"
                  class="text-[10px] font-bold text-red-500 hover:text-red-700 bg-transparent border-0 mt-3 cursor-pointer"
                >
                  Retirar
                </button>
              </div>
            </div>

            <div v-if="mapStore.spots.length <= 4" class="py-6 text-center text-gray-400 text-xs font-semibold">
              Todavía no has publicado ninguna plaza. ¡Completa el formulario de la izquierda!
            </div>
          </div>
        </div>

      </aside>

    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: OwnerScreen.vue
 * DESCRIPCIÓN: Panel de control de Propietarios.
 * Permite rellenar un formulario para publicar una plaza de parking privada en alquiler,
 * seleccionando días y horas límites (Calendario de disponibilidad)
 * y geolocalizando aleatoriamente los puntos en el mapa explorador según el barrio.
 */
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMapStore } from "../stores/map";
import { useNotificationsStore } from "../stores/notifications";
import Logo from "../components/Logo.vue";
import { ArrowLeft, PlusCircle, Check } from "lucide-vue-next";

const router = useRouter();
const mapStore = useMapStore();
const notificationsStore = useNotificationsStore();

const availableTags = ["Cubierta", "Vigilancia 24/7", "Puerta automática", "Cámara", "Ascensor", "Cargador eléctrico"];
const newSpotSize = ref("coche");

// Mapeo legible de días laborables
const availableWeekDays = [
  { label: "L", value: 1 },
  { label: "M", value: 2 },
  { label: "X", value: 3 },
  { label: "J", value: 4 },
  { label: "V", value: 5 },
  { label: "S", value: 6 },
  { label: "D", value: 7 }
];

// Estado inicial reactivo del formulario
const newSpot = ref({
  name: "",
  zone: "Abando",
  address: "",
  price: 2.00,
  tags: ["Cubierta"],
  availability: {
    startTime: "09:00",
    endTime: "18:00",
    days: [1, 2, 3, 4, 5] // Por defecto, de Lunes a Viernes
  }
});

/**
 * Añade o quita un día del listado de disponibilidad semanal.
 * @param value Número correspondiente al día de la semana (1-7).
 */
const toggleDaySelection = (value: number) => {
  const days = [...newSpot.value.availability.days];
  const idx = days.indexOf(value);
  if (idx > -1) {
    days.splice(idx, 1);
  } else {
    days.push(value);
  }
  newSpot.value.availability.days = days.sort();
};

/**
 * Procesa la publicación. Asigna coordenadas geográficas con desviaciones aleatorias
 * alrededor del barrio escogido para centrar el mapa y lanza avisos FCM.
 */
const submitSpot = () => {
  const id = "sp_" + Math.random().toString(36).substr(2, 9);
  
  // Coordenadas base estimadas por barrio de Bilbao
  const baseCoords = {
    Abando: { lat: 43.264, lng: -2.933 },
    Indautxu: { lat: 43.260, lng: -2.939 },
    Deusto: { lat: 43.272, lng: -2.949 },
    "Casco Viejo": { lat: 43.259, lng: -2.923 },
    Basurto: { lat: 43.258, lng: -2.946 }
  }[newSpot.value.zone] || { lat: 43.263, lng: -2.935 };

  // Margen de desviación para situar marcadores vecinos
  const randomOffset = () => (Math.random() - 0.5) * 0.006;

  const spotData = {
    id,
    name: newSpot.value.name,
    zone: newSpot.value.zone,
    address: newSpot.value.address,
    lat: baseCoords.lat + randomOffset(),
    lng: baseCoords.lng + randomOffset(),
    price: newSpot.value.price,
    total: newSpot.value.price * 7,
    rating: 5.0,
    reviews: 0,
    tags: [...newSpot.value.tags],
    availableToday: true,
    availability: {
      startTime: newSpot.value.availability.startTime,
      endTime: newSpot.value.availability.endTime,
      days: [...newSpot.value.availability.days]
    }
  };

  // Inserta la plaza en Pinia de forma reactiva
  mapStore.spots.push(spotData);

  // Notificación de confirmación
  notificationsStore.sendNotification(
    "Plaza publicada con éxito", 
    `Tu plaza '${spotData.name}' ya está visible para los conductores en ${spotData.zone}.`,
    "/explore"
  );

  // Resetea el formulario
  newSpot.value = {
    name: "",
    zone: "Abando",
    address: "",
    price: 2.00,
    tags: ["Cubierta"],
    availability: {
      startTime: "09:00",
      endTime: "18:00",
      days: [1, 2, 3, 4, 5]
    }
  };

  // Enfoca la vista del mapa en el nuevo marcador y redirige a la exploración
  mapStore.setSearchCenter(spotData.lat, spotData.lng);
  mapStore.setSelectedSpotId(spotData.id);
  router.push("/explore");
};

/**
 * Retira una plaza del listado público de alquiler.
 * @param id Identificador único de la plaza.
 */
const removeSpot = (id: string) => {
  const idx = mapStore.spots.findIndex(s => s.id === id);
  if (idx > -1) {
    mapStore.spots.splice(idx, 1);
  }
};
</script>
