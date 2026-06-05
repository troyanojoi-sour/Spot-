<template>
  <div id="app" class="min-h-screen">
    <!-- Router view with cross-fade transitions -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useBookingStore } from "./stores/booking";
import { useNotificationsStore } from "./stores/notifications";

const authStore = useAuthStore();
const bookingStore = useBookingStore();
const notificationsStore = useNotificationsStore();

onMounted(() => {
  // Initialize Pinia stores from localStorage cache
  authStore.initAuth();
  bookingStore.initBookings();
  notificationsStore.initNotifications();
  
  // Set up checking for expired bookings in background every 30 seconds
  setInterval(() => {
    bookingStore.checkExpirations();
  }, 30000);
});
</script>

<style>
/* Page cross-fade routing transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
