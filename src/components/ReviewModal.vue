<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop overlay -->
    <div @click="close" class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

    <!-- Rating Dialog Box -->
    <div class="bg-white text-night w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-150 relative z-10 space-y-6 text-left animate-scale-up">
      
      <!-- Close Button -->
      <button 
        @click="close"
        class="absolute top-4 right-4 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl text-gray-400 hover:text-night border-0 transition-colors cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Headers -->
      <div class="space-y-1">
        <h3 class="text-lg font-black text-night flex items-center gap-2">
          <Star class="w-5 h-5 text-amber fill-amber" />
          Valorar tu plaza de parking
        </h3>
        <p class="text-xs text-gray-500 font-medium">Cuéntanos qué tal fue tu estancia en <strong class="text-night font-bold">{{ spotName }}</strong>.</p>
      </div>

      <form @submit.prevent="submitReview" class="space-y-5">
        
        <!-- Interactive Star Rating selector (Micro-animations on hover) -->
        <div class="flex flex-col items-center py-4 bg-gray-50 rounded-2xl border border-gray-100 gap-2">
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Puntuación</span>
          
          <div class="flex items-center gap-1.5">
            <button 
              v-for="star in 5" 
              :key="star"
              type="button"
              @click="rating = star"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = 0"
              class="bg-transparent border-0 p-1 cursor-pointer transform hover:scale-125 transition-transform"
            >
              <Star 
                :class="{
                  'text-amber fill-amber': (hoverRating || rating) >= star,
                  'text-gray-200 fill-transparent': (hoverRating || rating) < star
                }"
                class="w-9 h-9 transition-colors" 
              />
            </button>
          </div>
          
          <!-- Text descriptor -->
          <span class="text-[11px] font-extrabold text-violet mt-1 uppercase tracking-wider">
            {{ ratingDescriptor }}
          </span>
        </div>

        <!-- Review Comment Textarea -->
        <div class="space-y-1.5">
          <label for="review-comment" class="text-xs font-black text-gray-400 uppercase tracking-wider">Tu comentario u opinión</label>
          <textarea 
            id="review-comment"
            rows="4" 
            v-model="comment"
            required
            placeholder="¿Qué tal estuvo el acceso, la limpieza o las maniobras? Ej. Plaza muy amplia y fácil de aparcar, el portón se abre súper rápido..."
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-night focus:outline-none focus:border-violet resize-none"
          ></textarea>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3">
          <button 
            type="button"
            @click="close"
            class="flex-grow bg-gray-100 hover:bg-gray-200 text-night font-bold text-xs py-3 px-4 rounded-xl border-0 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="rating === 0"
            class="flex-grow bg-violet hover:bg-violet-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-glow border-0 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            Enviar reseña
          </button>
        </div>

      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { X, Star } from "lucide-vue-next";

const props = defineProps<{
  isOpen: boolean;
  spotId: string;
  spotName: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submitted", review: { rating: number; comment: string }): void;
}>();

const rating = ref(0);
const hoverRating = ref(0);
const comment = ref("");

const close = () => {
  rating.value = 0;
  comment.value = "";
  emit("close");
};

// Return descriptive text depending on the star count
const ratingDescriptor = computed(() => {
  const current = hoverRating.value || rating.value;
  switch (current) {
    case 1: return "Muy mala";
    case 2: return "Mala";
    case 3: return "Aceptable";
    case 4: return "Muy buena";
    case 5: return "Excelente ¡Perfecta!";
    default: return "Elige una nota";
  }
});

const submitReview = () => {
  if (rating.value === 0) return;
  emit("submitted", {
    rating: rating.value,
    comment: comment.value
  });
  close();
};
</script>
