<template>
  <div class="min-h-screen bg-spot-dark text-white font-sans flex flex-col justify-between overflow-x-hidden relative">
    
    <!-- Gradiente de fondo decorativo -->
    <div class="absolute inset-0 bg-radial-gradient from-violet-900/20 via-transparent to-transparent pointer-events-none"></div>

    <!-- Cabecera simplificada -->
    <header class="container mx-auto px-6 py-5 flex items-center justify-between z-20">
      <Logo />
      <button 
        @click="router.push('/')"
        class="bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-4 py-2 rounded-xl border border-white/10 transition-all cursor-pointer"
      >
        Volver a inicio
      </button>
    </header>

    <!-- Contenedor del Formulario de Inicio de Sesión -->
    <main class="flex-grow flex items-center justify-center p-6 z-10">
      <div class="w-full max-w-md panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 shadow-soft space-y-6 text-left">
        
        <!-- Encabezado de la caja de login -->
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-white">Iniciar sesión</h2>
          <p class="text-xs text-gray-400 font-semibold">Accede a tu cuenta de Spot para gestionar tus reservas de parking.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Entrada de Correo Electrónico -->
          <div class="space-y-1.5">
            <label for="login-email" class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Correo electrónico</label>
            <input 
              id="login-email"
              type="email" 
              v-model="email" 
              required
              placeholder="correo@ejemplo.com"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet placeholder-gray-500"
            />
          </div>

          <!-- Entrada de Contraseña -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <label for="login-password" class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Contraseña</label>
              <a href="#" @click.prevent="alert('Simulación: Recuperación de contraseña enviada a su correo electrónico.')" class="text-[10px] text-amber hover:text-amber-300 font-bold transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
            
            <!-- Entrada con visualización alterna (Ojo visible/oculto) -->
            <div class="relative flex items-center">
              <input 
                id="login-password"
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                required
                placeholder="••••••••"
                class="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm font-semibold text-white focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet placeholder-gray-500"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 bg-transparent border-0 text-gray-400 hover:text-white cursor-pointer"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Mantener sesión iniciada -->
          <label class="flex items-center gap-2.5 cursor-pointer select-none group">
            <input 
              type="checkbox" 
              class="w-4 h-4 rounded border-white/20 bg-white/5 text-violet focus:ring-violet/30 cursor-pointer accent-violet"
            />
            <span class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors font-semibold">Mantener sesión iniciada</span>
          </label>

          <!-- Botón de Envío -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-spot-secondary hover:bg-amber-400 text-night font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-glow active:scale-[0.98] border-0 disabled:opacity-75 disabled:scale-100 cursor-pointer mt-6"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin text-night" />
            <span v-else>Iniciar sesión</span>
          </button>
        </form>

        <!-- Divisor con texto corporativo -->
        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-white/5"></div>
          <span class="flex-shrink mx-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">O continúa con</span>
          <div class="flex-grow border-t border-white/5"></div>
        </div>

        <!-- Botones de Redes Sociales (Google / Apple) -->
        <div class="grid grid-cols-2 gap-3">
          <button 
            @click="handleSocialLogin('Google')"
            class="bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-white"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.19-5.136 4.19A5.85 5.85 0 018.1 11.72a5.85 5.85 0 015.891-5.875c1.485 0 2.82.51 3.88 1.485l2.67-2.67C18.895 3.12 16.48 2 13.99 2 8.47 2 4 6.47 4 12s4.47 10 9.99 10c5.77 0 9.77-4.06 9.77-9.94 0-.665-.08-1.285-.22-1.775H12.24z"/>
            </svg>
            Google
          </button>
          <button 
            @click="handleSocialLogin('Apple')"
            class="bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-white"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.1.09 2.22-.55 2.94-1.39z"/>
            </svg>
            Apple
          </button>
        </div>

        <!-- Enlace de desvío al registro de cuenta -->
        <p class="text-center text-xs text-gray-400 font-semibold pt-2">
          ¿No tienes una cuenta? 
          <a @click.prevent="router.push('/register')" class="text-amber hover:text-amber-300 font-bold cursor-pointer transition-colors">Regístrate ahora</a>
        </p>

      </div>
    </main>

    <!-- Pie de página simple -->
    <footer class="py-6 border-t border-white/5 bg-ink/40 text-center text-xs text-gray-500 font-bold z-10">
      &copy; 2026 Spot. Alquiler de parking privado. Todos los derechos reservados.
    </footer>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: LoginScreen.vue
 * DESCRIPCIÓN: Formulario de inicio de sesión.
 * Utiliza variables reactivas para controlar la contraseña visible/oculta,
 * e inicia de forma simulada la sesión en la store de Pinia.
 */
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Logo from "../components/Logo.vue";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

// Credenciales precargadas de prueba
const email = ref("aitor.gonzalez@example.com");
const password = ref("••••••••");
const showPassword = ref(false);
const loading = ref(false);

/**
 * Valida y procesa el inicio de sesión.
 * Llama a la acción `login` de Pinia y redirige al panel del conductor.
 */
const handleLogin = async () => {
  loading.value = true;
  const success = await authStore.login(email.value);
  loading.value = false;
  if (success) {
    // Si es propietario, redirige a owner, si no a dashboard
    if (authStore.user?.role === "Propietario") {
      router.push("/owner");
    } else {
      router.push("/dashboard");
    }
  } else {
    alert("Ocurrió un error al iniciar sesión. Compruebe sus credenciales.");
  }
};

/**
 * Simula el login social mediante Google/Apple.
 * @param platform Nombre de la plataforma seleccionada.
 */
const handleSocialLogin = async (platform: string) => {
  alert(`Simulación: Autenticación con ${platform} exitosa.`);
  await authStore.login(`usuario.${platform.toLowerCase()}@example.com`);
  if (authStore.user?.role === "Propietario") {
    router.push("/owner");
  } else {
    router.push("/dashboard");
  }
};
</script>
