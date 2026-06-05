<template>
  <div class="flex items-center gap-3 select-none cursor-pointer" @click="goHome">
    <!-- Icono del Pin de localización estilizado -->
    <div class="relative w-10 h-10 flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(118,40,239,0.3)]">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 transform transition-transform duration-300 hover:scale-110">
        <!-- Relleno con gradiente de color personalizado -->
        <path d="M12 2C7.58 2 4 5.58 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58 16.42 2 12 2Z" fill="url(#pinGradient)" />
        <circle cx="12" cy="10" r="4" fill="#080a25" />
        <circle cx="12" cy="10" r="2" fill="#ffc466" class="animate-pulse" />
        <defs>
          <linearGradient id="pinGradient" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#9d4edd" />
            <stop offset="100%" stop-color="#5a189a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    
    <!-- Texto corporativo del logotipo -->
    <div class="flex flex-col leading-none">
      <span class="text-white font-extrabold text-2xl tracking-tight">
        Spot
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: Logo.vue
 * DESCRIPCIÓN: Logotipo corporativo de la aplicación.
 * Representa la marca "Spot" y redirige a la página principal al cliquearlo.
 */
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => {
  router.push("/");
};
</script>
