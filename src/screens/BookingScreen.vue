<template>
  <div class="min-h-screen bg-[#f6f3f8] text-night font-sans flex flex-col">
    
    <!-- Cabecera de Navegación -->
    <header class="bg-night text-white px-6 py-5 flex items-center justify-between sticky top-0 z-30 shadow-md">
      <Logo />
      
      <button 
        @click="goBack"
        class="bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4" />
        {{ hasActiveBooking ? 'Ir a Explorar' : 'Cancelar pago' }}
      </button>
    </header>

    <div class="flex-grow container mx-auto px-4 md:px-6 py-8 flex flex-col items-center justify-center">
      
      <!-- ESTADO A: Pantalla de Reserva Activa con Código QR de Acceso al Garaje -->
      <div 
        v-if="hasActiveBooking && activeBooking" 
        class="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-150/40 text-center space-y-6 animate-fade-in"
      >
        <!-- Encabezado de Éxito de Pago Stripe -->
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mb-3 animate-bounce">
            <CheckCircle2 class="w-8 h-8 fill-emerald-100 stroke-[2.5]" />
          </div>
          <h2 class="text-2xl font-black text-night">¡Reserva confirmada!</h2>
          <p class="text-sm text-gray-500 font-medium mt-1">El cobro ha sido procesado de forma segura con Stripe</p>
        </div>

        <!-- Bloque de código QR de acceso al parking -->
        <div class="bg-gray-50 border border-gray-100 rounded-3xl p-6 flex flex-col items-center space-y-4">
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Código de Acceso QR</h3>
          
          <!-- Representación artística vectorial (SVG) de un código QR con el isotipo de Spot en el centro -->
          <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group">
            <svg class="w-44 h-44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="25" height="25" fill="#080a25" />
              <rect x="10" y="10" width="15" height="15" fill="white" />
              <rect x="13" y="13" width="9" height="9" fill="#7628ef" />
              
              <rect x="70" y="5" width="25" height="25" fill="#080a25" />
              <rect x="75" y="10" width="15" height="15" fill="white" />
              <rect x="78" y="13" width="9" height="9" fill="#7628ef" />
              
              <rect x="5" y="70" width="25" height="25" fill="#080a25" />
              <rect x="10" y="75" width="15" height="15" fill="white" />
              <rect x="13" y="78" width="9" height="9" fill="#7628ef" />

              <rect x="35" y="15" width="10" height="5" fill="#080a25" />
              <rect x="50" y="5" width="5" height="15" fill="#7628ef" />
              <rect x="40" y="25" width="15" height="10" fill="#080a25" />
              <rect x="5" y="35" width="15" height="5" fill="#080a25" />
              <rect x="25" y="45" width="20" height="5" fill="#7628ef" />
              <rect x="15" y="55" width="10" height="10" fill="#080a25" />
              <rect x="35" y="60" width="5" height="25" fill="#7628ef" />
              <rect x="55" y="50" width="15" height="10" fill="#080a25" />
              <rect x="75" y="35" width="20" height="5" fill="#080a25" />
              <rect x="85" y="45" width="10" height="15" fill="#7628ef" />
              <rect x="70" y="65" width="25" height="5" fill="#080a25" />
              <rect x="50" y="70" width="10" height="10" fill="#080a25" />
              <rect x="45" y="85" width="20" height="10" fill="#7628ef" />
              <rect x="75" y="80" width="15" height="15" fill="#080a25" />
              <rect x="90" y="80" width="5" height="5" fill="#ffc466" />
              <circle cx="50" cy="50" r="10" fill="#080a25" />
              <path d="M50 45 L53 53 L45 49 L55 51 Z" fill="#ffc466" />
            </svg>
            <div class="absolute inset-0 bg-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
              <span class="bg-night text-white font-extrabold text-[10px] px-2 py-1 rounded-md">Lector de Matrícula y QR</span>
            </div>
          </div>

          <!-- Código serial formateado legible para teclear si falla la cámara -->
          <span class="bg-violet/10 text-violet border border-violet-100 font-mono font-bold text-xs px-4 py-1.5 rounded-full select-all">
            {{ activeBooking.qrCode }}
          </span>

          <!-- Placa autorizada -->
          <div class="text-xs font-semibold text-gray-600 flex items-center gap-1.5 mt-2 bg-white px-4 py-2 border border-gray-100 rounded-xl">
            <Car class="w-4 h-4 text-violet" />
            <span>Vehículo autorizado: <strong class="text-night font-bold uppercase">{{ activeBooking.vehiclePlate }}</strong></span>
          </div>
        </div>

        <!-- Temporizador/Reloj de Cuenta Atrás del tiempo restante de alquiler -->
        <div class="bg-amber/10 border border-amber/20 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 text-left">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center text-amber">
              <Hourglass class="w-5 h-5 animate-spin" style="animation-duration: 4s;" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide">Tiempo restante de reserva</h4>
              <p class="text-xl font-extrabold text-night font-mono mt-0.5">{{ formattedTimeLeft }}</p>
            </div>
          </div>

          <!-- Activar notificaciones flotantes en el navegador -->
          <div v-if="!notificationsStore.pushEnabled" class="flex-shrink-0">
            <button 
              @click="enableNotifications"
              class="bg-night hover:bg-night-90 border-0 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Bell class="w-3.5 h-3.5 text-amber" />
              Activar alertas push
            </button>
          </div>
          <div v-else class="text-xs font-bold text-emerald-500 flex items-center gap-1">
            <Bell class="w-4 h-4" />
            Alertas push activadas
          </div>
        </div>

        <!-- Simulador de Notificación del Service Worker (FCM) -->
        <div class="bg-violet/5 border border-violet/10 p-4 rounded-xl flex items-center justify-between text-left">
          <div>
            <h4 class="text-xs font-bold text-violet-800">Simulación del Service Worker (FCM)</h4>
            <p class="text-[11px] text-gray-400 mt-0.5">Envía la notificación push de aviso de 15 minutos de expiración.</p>
          </div>
          <button 
            @click="simulate15MinWarning"
            class="bg-violet hover:bg-violet-700 text-white border-0 font-bold text-[11px] py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
          >
            Disparar Alerta (15 min)
          </button>
        </div>

        <!-- Detalles del parking e itinerario -->
        <div class="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4 text-left">
          <div>
            <h3 class="font-extrabold text-night flex items-center gap-1.5">
              {{ activeBooking.spot.name }}
              <CheckCircle2 class="w-4 h-4 text-violet fill-violet/10" />
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ activeBooking.spot.address }}</p>
            <p class="text-[11px] text-gray-400 font-semibold mt-2">Planta -1, Plaza #14 • Franja: {{ activeBooking.timeSlot }}</p>
          </div>
          <button 
            @click="navigateToDashboard"
            class="bg-gray-100 hover:bg-gray-200 text-night border-0 font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MapPin class="w-4 h-4 text-violet" />
            Ver en el mapa
          </button>
        </div>

      </div>

      <!-- ESTADO B: Pasarela de Pago Stripe (Formulario de Tarjeta y Selección de Coche) -->
      <div 
        v-else-if="bookingStore.bookingInProgress" 
        class="w-full max-w-3xl bg-white rounded-3xl shadow-soft border border-gray-150/40 overflow-hidden flex flex-col md:flex-row animate-fade-in"
      >
        <!-- Panel Izquierdo: Resumen de Compra -->
        <div class="w-full md:w-5/12 bg-night text-white p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
          <div class="space-y-6">
            <h2 class="text-lg font-black text-white uppercase tracking-wider text-left">Resumen de reserva</h2>
            
            <div class="space-y-4 text-left">
              <div>
                <h4 class="text-xs text-violet-300 font-bold uppercase tracking-wider">Parking</h4>
                <p class="text-base font-black text-white mt-1">{{ bookingStore.bookingInProgress.spot.name }}</p>
                <p class="text-xs text-gray-400 truncate mt-0.5">{{ bookingStore.bookingInProgress.spot.address }}</p>
              </div>

              <div>
                <h4 class="text-xs text-violet-300 font-bold uppercase tracking-wider">Fecha y Horario</h4>
                <p class="text-sm font-semibold text-white mt-1">Hoy, 24 de mayo</p>
                <p class="text-sm font-semibold text-amber mt-0.5">{{ bookingStore.bookingInProgress.timeSlot }}</p>
              </div>
            </div>
          </div>

          <!-- desglose de precios (Parking y tasa de servicio) -->
          <div class="border-t border-white/10 pt-6 mt-6 md:mt-0">
            <div class="flex items-center justify-between text-xs text-gray-400 font-bold">
              <span>Alquiler (4h)</span>
              <span>{{ formatEuro(bookingStore.bookingInProgress.price) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-400 font-bold mt-2">
              <span>Comisión</span>
              <span>{{ formatEuro(bookingStore.bookingInProgress.commission) }}</span>
            </div>
            <div class="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
              <span class="text-sm font-black uppercase text-gray-300">Total a pagar</span>
              <span class="text-2xl font-black text-amber leading-none">{{ formatEuro(bookingStore.bookingInProgress.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Panel Derecho: Formulario de Pago y Asignación de Matrícula -->
        <div class="w-full md:w-7/12 p-6 sm:p-8 space-y-6 text-left">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-black text-night">Método de pago</h2>
            <span class="bg-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">Stripe</span>
          </div>

          <form @submit.prevent="submitPayment" class="space-y-4">
            
            <!-- Selector de Vehículo de "Mi Garaje" (Pinia + Autoselección) -->
            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <label for="vehicle-select" class="text-xs font-black text-gray-400 uppercase tracking-wider">Vehículo para esta reserva</label>
                <!-- Posibilidad de añadir un vehículo al vuelo durante el checkout -->
                <button 
                  type="button" 
                  @click="showAddVehicleInline = !showAddVehicleInline"
                  class="text-[10px] text-violet font-bold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  {{ showAddVehicleInline ? 'Cancelar' : '+ Añadir otro coche' }}
                </button>
              </div>

              <!-- Formulario embebido al vuelo (Inline) para registrar coche en caliente -->
              <div v-if="showAddVehicleInline" class="bg-gray-50 border border-violet-100 p-4 rounded-xl space-y-3 mt-1.5">
                <h4 class="text-xs font-bold text-violet">Añadir Vehículo a mi Garaje</h4>
                <div class="grid grid-cols-2 gap-2">
                  <input type="text" v-model="newBrand" placeholder="Marca (Ej. BMW)" class="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none" required />
                  <input type="text" v-model="newModel" placeholder="Modelo (Ej. X1)" class="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none" required />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <input type="text" v-model="newPlate" placeholder="Matrícula" class="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none uppercase" required />
                  <select v-model="newSize" class="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none">
                    <option value="moto">Moto</option>
                    <option value="coche">Coche</option>
                    <option value="furgoneta">Furgoneta</option>
                  </select>
                </div>
                <button 
                  type="button" 
                  @click="addVehicleInline" 
                  class="w-full bg-violet text-white font-bold py-1.5 rounded-lg text-xs border-0 cursor-pointer"
                >
                  Guardar y Seleccionar
                </button>
              </div>

              <!-- Selector normal de vehículos registrados en el garaje de Pinia -->
              <select 
                v-else
                id="vehicle-select"
                v-model="selectedVehicleId"
                required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-violet cursor-pointer"
              >
                <option 
                  v-for="v in authStore.vehicles" 
                  :key="v.id" 
                  :value="v.id"
                >
                  {{ v.brand }} {{ v.model }} ({{ v.plate }})
                </option>
              </select>
            </div>

            <!-- Titular de la Tarjeta -->
            <div class="space-y-1.5">
              <label for="cardname" class="text-xs font-black text-gray-400 uppercase tracking-wider">Nombre del titular</label>
              <input 
                id="cardname"
                type="text" 
                v-model="cardholderName" 
                required
                placeholder="Aitor González"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-violet"
              />
            </div>

            <!-- Datos de Tarjeta de Crédito (Visa/Stripe simulado con formateadores de teclado) -->
            <div class="space-y-1.5">
              <label class="text-xs font-black text-gray-400 uppercase tracking-wider">Tarjeta de crédito o débito</label>
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3 relative focus-within:border-violet transition-colors">
                
                <!-- Número de Tarjeta (Formateo automático de espacios cada 4 números) -->
                <div class="flex items-center gap-3">
                  <CreditCard class="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    v-model="cardNumber"
                    @input="formatCardNumber"
                    maxlength="19"
                    required
                    placeholder="4242 4242 4242 4242"
                    class="bg-transparent border-0 text-sm font-semibold focus:ring-0 focus:outline-none w-full tracking-wider"
                  />
                  <span class="text-xs font-black text-violet-500 tracking-wider">VISA</span>
                </div>
                
                <div class="h-[1px] bg-gray-200"></div>

                <!-- Fecha de Caducidad y CVC -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      v-model="cardExpiry"
                      @input="formatCardExpiry"
                      maxlength="5"
                      required
                      placeholder="MM/AA"
                      class="bg-transparent border-0 text-sm font-semibold focus:ring-0 focus:outline-none w-full"
                    />
                  </div>
                  <div class="flex items-center gap-2 border-l border-gray-200 pl-4">
                    <Lock class="w-4 h-4 text-gray-400" />
                    <input 
                      type="password" 
                      v-model="cardCvc"
                      maxlength="3"
                      required
                      placeholder="CVC"
                      class="bg-transparent border-0 text-sm font-semibold focus:ring-0 focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>
              <p class="text-[10px] text-gray-400 font-bold uppercase mt-1.5 flex items-center gap-1">
                <ShieldCheck class="w-3.5 h-3.5 text-spot-success" />
                Los datos de tarjeta se cifran y nunca pasan por nuestro servidor
              </p>
            </div>

            <!-- Contenedor de errores de validación de pago -->
            <div v-if="paymentError" class="bg-red-50 text-red-500 px-4 py-2.5 rounded-lg text-xs font-semibold border border-red-150">
              {{ paymentError }}
            </div>

            <!-- Botón de Envío y Procesamiento Seguro -->
            <button 
              type="submit" 
              :disabled="paying"
              class="w-full bg-violet hover:bg-violet-700 text-white font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-glow active:scale-[0.98] border-0 disabled:opacity-75 disabled:scale-100 cursor-pointer mt-6"
            >
              <Loader2 v-if="paying" class="w-4 h-4 animate-spin text-white" />
              <Lock v-else class="w-4 h-4 text-violet-300" />
              <span>{{ paying ? 'Procesando pago...' : `Confirmar y pagar ${formatEuro(bookingStore.bookingInProgress.total)}` }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Pantalla de reserva inexistente -->
      <div 
        v-else 
        class="w-full max-w-md bg-white rounded-3xl p-12 text-center shadow-soft border border-gray-150/40"
      >
        <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
          <Hourglass class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-extrabold text-night">No tienes reservas activas</h3>
        <p class="text-gray-500 text-sm mt-2">Busca una plaza libre en el mapa y reserva para obtener tu código QR.</p>
        <button 
          @click="router.push('/explore')"
          class="mt-6 bg-violet hover:bg-violet-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm border-0 transition-all cursor-pointer"
        >
          Explorar plazas
        </button>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: BookingScreen.vue
 * DESCRIPCIÓN: Pasarela de checkout y visor del código QR del parking activo.
 * Integra validación y formateo dinámico de tarjetas de crédito en Stripe simulado,
 * vincula la matrícula activa desde "Mi Garaje" en el QR
 * y activa el temporizador regresivo reactivo del alquiler.
 */
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useBookingStore } from "../stores/booking";
import { useNotificationsStore } from "../stores/notifications";
import { useAuthStore } from "../stores/auth";
import Logo from "../components/Logo.vue";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Hourglass, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Lock, 
  Loader2, 
  Bell, 
  ShieldCheck,
  Car
} from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const bookingStore = useBookingStore();
const notificationsStore = useNotificationsStore();

const paying = ref(false);
const paymentError = ref<string | null>(null);

// Datos del formulario de pago
const cardholderName = ref("Aitor González");
const cardNumber = ref("");
const cardExpiry = ref("");
const cardCvc = ref("");

// Variables para "Mi Garaje" inline
const selectedVehicleId = ref("");
const showAddVehicleInline = ref(false);
const newBrand = ref("");
const newModel = ref("");
const newPlate = ref("");
const newSize = ref<"moto" | "coche" | "furgoneta">("coche");

// Matrícula autorizada activa
const selectedPlate = computed(() => {
  const v = authStore.vehicles.find(item => item.id === selectedVehicleId.value);
  return v ? v.plate : (authStore.vehicles[0]?.plate || "9481KGB");
});

// Temporizador reactivo
const timeRemaining = ref(0);
let timerInterval: any = null;

const hasActiveBooking = computed(() => bookingStore.hasActiveBooking);
const activeBooking = computed(() => bookingStore.activeBooking);

onMounted(() => {
  authStore.initAuth();
  bookingStore.initBookings();
  notificationsStore.initNotifications();
  
  if (authStore.vehicles.length > 0) {
    selectedVehicleId.value = authStore.user?.selectedVehicleId || authStore.vehicles[0].id;
  }
  
  if (hasActiveBooking.value && activeBooking.value) {
    calculateTimeLeft();
    timerInterval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

/**
 * Añade un vehículo al garaje global (authStore) y lo autoselecciona.
 */
const addVehicleInline = () => {
  if (!newBrand.value || !newModel.value || !newPlate.value) {
    alert("Por favor, rellena todos los campos del vehículo.");
    return;
  }
  
  authStore.addVehicle({
    brand: newBrand.value,
    model: newModel.value,
    plate: newPlate.value.toUpperCase(),
    size: newSize.value
  });
  
  selectedVehicleId.value = authStore.user?.selectedVehicleId || "";
  showAddVehicleInline.value = false;
  newBrand.value = "";
  newModel.value = "";
  newPlate.value = "";
};

/**
 * Calcula la diferencia de milisegundos hasta la expiración.
 */
const calculateTimeLeft = () => {
  if (!activeBooking.value) return;
  const now = new Date().getTime();
  const expireTime = new Date(activeBooking.value.expiresAt).getTime();
  const diff = expireTime - now;
  
  if (diff <= 0) {
    timeRemaining.value = 0;
    bookingStore.checkExpirations();
    if (timerInterval) clearInterval(timerInterval);
  } else {
    timeRemaining.value = diff;
  }
};

// Formatea el milisegundero a cadena HHh MMm SSs
const formattedTimeLeft = computed(() => {
  if (timeRemaining.value <= 0) return "00h 00m 00s";
  
  const totalSecs = Math.floor(timeRemaining.value / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  
  const hStr = hours.toString().padStart(2, "0");
  const mStr = minutes.toString().padStart(2, "0");
  const sStr = seconds.toString().padStart(2, "0");
  
  return `${hStr}h ${mStr}m ${sStr}s`;
});

/**
 * Formatea el número de tarjeta (4 digitos + espacio).
 */
const formatCardNumber = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  let formatted = "";
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += " ";
    }
    formatted += value[i];
  }
  cardNumber.value = formatted;
};

/**
 * Formatea la fecha de caducidad (MM/AA).
 */
const formatCardExpiry = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/[^0-9]/gi, "");
  if (value.length > 2) {
    cardExpiry.value = value.slice(0, 2) + "/" + value.slice(2, 4);
  } else {
    cardExpiry.value = value;
  }
};

/**
 * Valida los datos e inicia el cobro simulado.
 */
const submitPayment = () => {
  if (cardNumber.value.replace(/\s/g, "").length !== 16) {
    paymentError.value = "Número de tarjeta inválido. Introduce 16 dígitos.";
    return;
  }
  if (!cardExpiry.value.includes("/") || cardExpiry.value.length < 5) {
    paymentError.value = "Fecha de expiración inválida (MM/AA).";
    return;
  }
  if (cardCvc.value.length < 3) {
    paymentError.value = "CVC inválido. Introduce 3 dígitos.";
    return;
  }

  paymentError.value = null;
  paying.value = true;

  // Simulación de respuesta de API de Stripe (2 segundos)
  setTimeout(() => {
    paying.value = false;
    const paymentMethodId = "pm_stripe_" + Math.random().toString(36).substr(2, 14);
    
    // Confirma pasándole la matrícula asignada
    const booking = bookingStore.confirmBooking(paymentMethodId, selectedPlate.value);
    
    if (booking) {
      calculateTimeLeft();
      timerInterval = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
    }
  }, 2000);
};

const enableNotifications = () => {
  notificationsStore.requestPermission();
};

/**
 * Simulación de FCM warning.
 */
const simulate15MinWarning = () => {
  if (!activeBooking.value) return;
  notificationsStore.sendNotification(
    "Tu reserva expira pronto", 
    `Quedan menos de 15 minutos para que termine tu tiempo en ${activeBooking.value.spot.name}.`,
    "/booking"
  );
};

const goBack = () => {
  if (hasActiveBooking.value) {
    router.push("/explore");
  } else {
    const spotId = bookingStore.bookingInProgress?.spot.id;
    bookingStore.bookingInProgress = null;
    router.push(spotId ? `/spot/${spotId}` : "/explore");
  }
};

const navigateToDashboard = () => {
  router.push("/dashboard");
};

const formatEuro = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
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
