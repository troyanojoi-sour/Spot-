<template>
  <div class="min-h-screen bg-spot-dark text-white font-sans flex flex-col justify-between overflow-x-hidden relative">
    
    <!-- Gradiente de fondo decorativo -->
    <div class="absolute inset-0 bg-radial-gradient from-violet-900/20 via-transparent to-transparent pointer-events-none"></div>

    <!-- Cabecera simple -->
    <header class="container mx-auto px-6 py-5 flex items-center justify-between z-20">
      <Logo />
      <button 
        @click="router.push('/')"
        class="bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-4 py-2 rounded-xl border border-white/10 transition-all cursor-pointer"
      >
        Volver a inicio
      </button>
    </header>

    <!-- Contenedor del Formulario de Registro -->
    <main class="flex-grow flex items-center justify-center p-6 z-10">
      <div class="w-full max-w-lg panel-dark rounded-3xl p-6 sm:p-8 border border-white/10 shadow-soft space-y-6 text-left">
        
        <!-- Encabezado informativo -->
        <div class="space-y-1">
          <h2 class="text-2xl font-black text-white">Crear una cuenta</h2>
          <p class="text-xs text-gray-400 font-semibold">Regístrate gratis para empezar a alquilar o publicar plazas de parking.</p>
        </div>

        <!-- Selector de Rol Doble: Conductor (Quiero aparcar) o Propietario (Quiero alquilar) -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">¿Cómo deseas usar Spot?</label>
          <div class="grid grid-cols-2 gap-3 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button 
              type="button"
              @click="role = 'Conductor'"
              :class="role === 'Conductor' ? 'bg-violet text-white shadow-glow' : 'bg-transparent text-gray-400 hover:text-white'"
              class="py-2.5 px-4 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer"
            >
              Quiero aparcar (Conductor)
            </button>
            <button 
              type="button"
              @click="role = 'Propietario'"
              :class="role === 'Propietario' ? 'bg-violet text-white shadow-glow' : 'bg-transparent text-gray-400 hover:text-white'"
              class="py-2.5 px-4 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer"
            >
              Quiero alquilar (Propietario)
            </button>
          </div>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          
          <!-- Nombre Completo -->
          <div class="space-y-1.5">
            <label for="reg-name" class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nombre y Apellidos</label>
            <input 
              id="reg-name"
              type="text" 
              v-model="fullName" 
              required
              placeholder="Aitor González"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet placeholder-gray-500"
            />
          </div>

          <!-- Correo y Teléfono en rejilla -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label for="reg-email" class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Correo electrónico</label>
              <input 
                id="reg-email"
                type="email" 
                v-model="email" 
                required
                placeholder="correo@ejemplo.com"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet placeholder-gray-500"
              />
            </div>
            <div class="space-y-1.5">
              <label for="reg-phone" class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Teléfono móvil</label>
              <input 
                id="reg-phone"
                type="tel" 
                v-model="phone" 
                required
                placeholder="+34 600 000 000"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet placeholder-gray-500"
              />
            </div>
          </div>

          <!-- Campo Condicional: Matrícula (solo visible si el rol es Conductor) -->
          <div v-if="role === 'Conductor'" class="space-y-1.5 animate-fade-in">
            <label for="reg-plate" class="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
              Matrícula del vehículo principal
              <span class="text-amber font-normal font-sans normal-case text-[9px]">(Recomendado)</span>
            </label>
            <input 
              id="reg-plate"
              type="text" 
              v-model="plate" 
              placeholder="Ej. 1234KGB"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet placeholder-gray-500 uppercase tracking-widest"
            />
          </div>

          <!-- Contraseña -->
          <div class="space-y-1.5">
            <label for="reg-password" class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Contraseña</label>
            <div class="relative flex items-center">
              <input 
                id="reg-password"
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                required
                placeholder="Mínimo 8 caracteres"
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

          <!-- Aceptación de Políticas de Privacidad -->
          <label class="flex items-start gap-2.5 cursor-pointer select-none group">
            <input 
              type="checkbox" 
              required
              class="w-4 h-4 rounded border-white/20 bg-white/5 text-violet focus:ring-violet/30 cursor-pointer accent-violet mt-0.5"
            />
            <span class="text-[11px] text-gray-400 group-hover:text-gray-300 transition-colors font-medium">
              Acepto las <a href="#" class="text-amber hover:underline">Condiciones del Servicio</a>, la <a href="#" class="text-amber hover:underline">Política de Privacidad</a> y que Spot me envíe notificaciones de servicio.
            </span>
          </label>

          <!-- Botón de Envío -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-spot-secondary hover:bg-amber-400 text-night font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-glow active:scale-[0.98] border-0 disabled:opacity-75 disabled:scale-100 cursor-pointer mt-4"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin text-night" />
            <span v-else>Crear cuenta</span>
          </button>
        </form>

        <!-- Enlace de desvío al inicio de sesión -->
        <p class="text-center text-xs text-gray-400 font-semibold pt-2">
          ¿Ya tienes una cuenta? 
          <a @click.prevent="router.push('/login')" class="text-amber hover:text-amber-300 font-bold cursor-pointer transition-colors">Inicia sesión</a>
        </p>

      </div>
    </main>

    <!-- Footer simple -->
    <footer class="py-6 border-t border-white/5 bg-ink/40 text-center text-xs text-gray-500 font-bold z-10">
      &copy; 2026 Spot. Alquiler de parking privado. Todos los derechos reservados.
    </footer>

  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: RegisterScreen.vue
 * DESCRIPCIÓN: Formulario de creación de cuenta.
 * Admite toggle de roles duales y vincula de forma inicial la matrícula ingresada
 * al almacén de vehículos en caliente del usuario.
 */
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Logo from "../components/Logo.vue";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

// Variables reactivas del formulario de registro
const role = ref("Conductor");
const fullName = ref("");
const email = ref("");
const phone = ref("");
const plate = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);

/**
 * Valida la contraseña y registra al usuario simulado.
 * Si se ingresa matrícula, la inyecta reactivamente en el garaje de Pinia.
 * Redirecciona al panel correspondiente según el rol escogido.
 */
const handleRegister = async () => {
  if (password.value.length < 8) {
    alert("La contraseña debe tener al menos 8 caracteres.");
    return;
  }

  loading.value = true;
  
  // Realiza el registro llamando al nuevo método del store
  const success = await authStore.register(
    fullName.value || "Usuario Spot",
    email.value || "nuevo.usuario@example.com",
    phone.value || "",
    role.value,
    role.value === "Conductor" ? plate.value : ""
  );

  loading.value = false;
  
  if (success) {
    // Redirecciona según rol escogido
    if (role.value === "Propietario") {
      router.push("/owner");
    } else {
      router.push("/dashboard");
    }
  } else {
    alert("Ocurrió un error al registrar el usuario. Por favor, inténtelo de nuevo.");
  }
};
</script>
