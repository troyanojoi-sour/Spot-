<template>
  <div class="min-h-screen bg-spot-dark text-white font-sans flex flex-col justify-between overflow-x-hidden relative">
    
    <!-- Efectos decorativos de gradientes en el fondo de la pantalla principal -->
    <div class="absolute inset-0 bg-radial-gradient from-violet-900/20 via-transparent to-transparent pointer-events-none"></div>

    <!-- Barra de Navegación de la Cabecera (Header) -->
    <header class="container mx-auto px-6 py-5 flex items-center justify-between z-20">
      <!-- Logotipo de Spot compartida -->
      <Logo />
      
      <!-- Enlaces del menú superior para pantallas grandes -->
      <nav class="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-300">
        <a href="#" class="hover:text-white transition-colors">Cómo funciona</a>
        <a href="#" class="hover:text-white transition-colors">Precios</a>
        <a href="#" class="hover:text-white transition-colors">Seguridad</a>
        <a href="#" class="hover:text-white transition-colors">FAQ</a>
      </nav>

      <!-- Botones de Acción de Autenticación en la Cabecera -->
      <div class="flex items-center gap-4">
        <!-- Si el usuario está autenticado, muestra enlace directo al panel -->
        <template v-if="authStore.isAuthenticated">
          <button 
            @click="router.push('/dashboard')"
            class="bg-violet hover:bg-violet-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl border border-violet-500/25 transition-all shadow-glow"
          >
            Ir a mi Panel
          </button>
        </template>
        <!-- En caso contrario, botones para Iniciar Sesión o Registrarse -->
        <template v-else>
          <button 
            @click="router.push('/login')" 
            class="text-gray-300 hover:text-white font-bold text-sm px-4 py-2 border border-white/20 hover:border-white/50 rounded-xl transition-all"
          >
            Iniciar sesión
          </button>
          <button 
            @click="router.push('/register')" 
            class="bg-spot-secondary hover:bg-amber-400 text-night font-extrabold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            Regístrate
          </button>
        </template>
      </div>
    </header>

    <!-- Contenido Hero Principal (Dividido en 2 Columnas) -->
    <main class="container mx-auto px-6 py-6 md:py-12 flex-grow flex flex-col lg:flex-row items-center justify-between gap-12 z-10 relative">
      
      <!-- COLUMNA IZQUIERDA: Titular, subtítulo y llamadas a la acción principales -->
      <div class="w-full lg:w-1/2 flex flex-col items-start text-left max-w-xl">
        
        <!-- Etiqueta del Slogan -->
        <div class="bg-violet/20 border border-violet-500/30 text-violet-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-6">
          Aparca. Comparte. Gana.
        </div>

        <!-- Título Hero Principal -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Encuentra o comparte plazas de parking <br class="hidden sm:inline"/>en <span class="text-amber">España.</span>
        </h1>

        <!-- Subtítulo Explicativo -->
        <p class="text-gray-400 text-base sm:text-lg mt-6 leading-relaxed">
          Aparca donde necesitas, cuando lo necesitas. <br class="hidden sm:inline" />
          Gana dinero alquilando tu plaza de parking privada cuando no la uses.
        </p>

        <!-- Botones de Enlace a Flujos de Conductor (Buscar) y Propietario (Publicar) -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-10 w-full sm:w-auto">
          <button 
            @click="router.push('/explore')"
            class="bg-spot-secondary hover:bg-amber-400 text-night font-extrabold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-glow transition-all active:scale-[0.98]"
          >
            <Search class="w-5 h-5 text-night stroke-[3]" />
            Buscar plaza
          </button>
          <button 
            @click="router.push('/owner')"
            class="bg-transparent hover:bg-white/5 border-2 border-violet/70 hover:border-violet text-white font-extrabold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <Plus class="w-5 h-5 text-violet-400 stroke-[3]" />
            Publicar mi plaza
          </button>
        </div>

      </div>

      <!-- COLUMNA DERECHA: Gráfico artístico interactivo que representa un plano de la ciudad con pines flotantes -->
      <div class="w-full lg:w-1/2 relative h-[380px] sm:h-[450px] flex items-center justify-center">
        
        <!-- Recuadro del Plano Artístico -->
        <div class="absolute inset-0 panel-dark rounded-3xl opacity-90 shadow-soft overflow-hidden border border-white/10 flex items-center justify-center">
          
          <!-- Elementos vectoriales (Carreteras/Ríos en formato SVG para visualización estética) -->
          <svg class="absolute w-full h-full opacity-20 pointer-events-none scale-110" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-50,250 C100,230 200,280 300,200 C380,130 450,140 550,100" stroke="#7628ef" stroke-width="8" stroke-linecap="round" />
            <path d="M-50,300 C150,280 180,320 280,340 C380,360 420,310 550,280" stroke="#3b82f6" stroke-width="4" stroke-opacity="0.3" />
            <path d="M100,-50 C120,150 70,250 180,350 C260,420 350,380 400,550" stroke="#7628ef" stroke-width="3" stroke-opacity="0.2" />
            <path d="M350,-50 C300,100 320,200 240,320 C180,400 280,480 300,550" stroke="#ffc466" stroke-width="2" stroke-opacity="0.15" />
          </svg>

          <!-- Puntos geográficos palpitantes de actividad en tiempo real (Pulsantes de CSS) -->
          <div class="absolute top-[28%] left-[25%] w-3 h-3 bg-violet rounded-full animate-ping"></div>
          <div class="absolute top-[28%] left-[25%] w-2.5 h-2.5 bg-violet rounded-full shadow-glow"></div>
          
          <div class="absolute top-[65%] left-[55%] w-3 h-3 bg-amber rounded-full animate-ping"></div>
          <div class="absolute top-[65%] left-[55%] w-2.5 h-2.5 bg-amber rounded-full shadow-glow"></div>

          <div class="absolute top-[48%] left-[75%] w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          <div class="absolute top-[48%] left-[75%] w-2.5 h-2.5 bg-blue-500 rounded-full shadow-glow"></div>

          <!-- Pines de Precios Flotantes Simulación de Mapa -->
          <div class="absolute top-[18%] left-[45%] bg-violet border border-white/20 px-2 py-1 rounded-xl shadow-glow transform -rotate-6 animate-bounce text-xs font-black">
            1,60 €
          </div>
          <div class="absolute top-[48%] left-[30%] bg-violet border border-white/20 px-2 py-1 rounded-xl shadow-glow transform rotate-3 animate-bounce text-xs font-black" style="animation-delay: 0.5s;">
            2,00 €
          </div>
          <!-- Pin Dorado Destacado -->
          <div class="absolute top-[38%] left-[58%] bg-spot-secondary border border-white/40 text-night px-3 py-1.5 rounded-2xl shadow-glow transform -rotate-2 font-black text-sm z-20 flex items-center gap-1">
            <MapPin class="w-3.5 h-3.5 fill-night" />
            2,80 €
          </div>
          <div class="absolute top-[75%] left-[38%] bg-violet border border-white/20 px-2 py-1 rounded-xl shadow-glow transform -rotate-12 animate-bounce text-xs font-black" style="animation-delay: 1s;">
            1,70 €
          </div>
          <div class="absolute top-[55%] left-[88%] bg-violet border border-white/20 px-2 py-1 rounded-xl shadow-glow transform rotate-6 animate-bounce text-xs font-black" style="animation-delay: 1.5s;">
            2,10 €
          </div>

          <!-- Tarjeta Flotante Lateral de Zonas/Barrios Recomendados -->
          <div class="absolute bottom-5 right-5 bg-night/95 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-soft w-64 z-10">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Plazas disponibles hoy</h4>
            <div class="mt-3.5 space-y-3">
              
              <!-- Zona Abando -->
              <div 
                @click="goToZone('Abando')"
                class="flex items-center justify-between hover:bg-white/5 p-1 rounded-lg cursor-pointer transition-colors"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-violet"></div>
                  <div class="text-left">
                    <div class="text-xs font-bold text-white">Abando</div>
                    <div class="text-[10px] text-gray-400">128 plazas</div>
                  </div>
                </div>
                <div class="text-xs font-extrabold text-gray-300">Desde 1,80 €</div>
              </div>

              <!-- Zona Indautxu -->
              <div 
                @click="goToZone('Indautxu')"
                class="flex items-center justify-between hover:bg-white/5 p-1 rounded-lg cursor-pointer transition-colors"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-amber"></div>
                  <div class="text-left">
                    <div class="text-xs font-bold text-white">Indautxu</div>
                    <div class="text-[10px] text-gray-400">96 plazas</div>
                  </div>
                </div>
                <div class="text-xs font-extrabold text-gray-300">Desde 1,60 €</div>
              </div>

              <!-- Zona Deusto -->
              <div 
                @click="goToZone('Deusto')"
                class="flex items-center justify-between hover:bg-white/5 p-1 rounded-lg cursor-pointer transition-colors"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-violet"></div>
                  <div class="text-left">
                    <div class="text-xs font-bold text-white">Deusto</div>
                    <div class="text-[10px] text-gray-400">74 plazas</div>
                  </div>
                </div>
                <div class="text-xs font-extrabold text-gray-300">Desde 1,40 €</div>
              </div>

            </div>

            <!-- Botón de exploración directa -->
            <button 
              @click="router.push('/explore')"
              class="w-full text-center mt-4 text-xs font-bold text-amber hover:text-amber-300 flex items-center justify-center gap-1 group border-0 bg-transparent cursor-pointer"
            >
              Ver todas las zonas 
              <ArrowRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>

    </main>

    <!-- Barra de Estadísticas Inferior -->
    <footer class="bg-ink/60 border-t border-white/5 py-8 backdrop-blur-sm z-10">
      <div class="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        <!-- Plazas Activas -->
        <div class="flex items-center gap-4 justify-start md:justify-center">
          <div class="w-12 h-12 rounded-2xl bg-violet/10 flex items-center justify-center border border-violet/20">
            <Car class="w-6 h-6 text-violet-400" />
          </div>
          <div class="text-left">
            <div class="text-xl font-extrabold text-white">1.245+</div>
            <div class="text-xs text-gray-400 font-semibold">Plazas activas</div>
          </div>
        </div>

        <!-- Cobertura Geográfica -->
        <div class="flex items-center gap-4 justify-start md:justify-center">
          <div class="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center border border-amber/20">
            <MapPin class="w-6 h-6 text-amber" />
          </div>
          <div class="text-left">
            <div class="text-xl font-extrabold text-white">47</div>
            <div class="text-xs text-gray-400 font-semibold">Barrios cubiertos</div>
          </div>
        </div>

        <!-- Cantidad de Usuarios -->
        <div class="flex items-center gap-4 justify-start md:justify-center">
          <div class="w-12 h-12 rounded-2xl bg-violet/10 flex items-center justify-center border border-violet/20">
            <Users class="w-6 h-6 text-violet-400" />
          </div>
          <div class="text-left">
            <div class="text-xl font-extrabold text-white">3.680+</div>
            <div class="text-xs text-gray-400 font-semibold">Usuarios en España</div>
          </div>
        </div>

        <!-- Valoración Media -->
        <div class="flex items-center gap-4 justify-start md:justify-center">
          <div class="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center border border-amber/20">
            <Star class="w-6 h-6 text-amber fill-amber/20" />
          </div>
          <div class="text-left">
            <div class="text-xl font-extrabold text-white">4.8 ★</div>
            <div class="text-xs text-gray-400 font-semibold">Valoración media</div>
          </div>
        </div>

      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: HomeScreen.vue
 * DESCRIPCIÓN: Landing page de presentación de Spot.
 * Utiliza enlaces y redirecciones reactivas, lectura de datos globales de usuario de Pinia,
 * y permite preseleccionar coordenadas geográficas antes de redirigir al mapa explorador.
 */
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useMapStore } from "../stores/map";
import Logo from "../components/Logo.vue";
import { Search, Plus, MapPin, ArrowRight, Car, Users, Star } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const mapStore = useMapStore();

/**
 * Centra el mapa explorador en las coordenadas del barrio escogido
 * y redirige al panel del buscador.
 * @param zone Nombre de la zona de Bilbao seleccionada.
 */
const goToZone = (zone: string) => {
  if (zone === "Abando") {
    mapStore.setSearchCenter(43.2631, -2.9328);
  } else if (zone === "Indautxu") {
    mapStore.setSearchCenter(43.2603, -2.9389);
  } else if (zone === "Deusto") {
    mapStore.setSearchCenter(43.2710, -2.9490);
  }
  router.push("/explore");
};
</script>
