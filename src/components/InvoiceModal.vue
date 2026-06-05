<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Capa de fondo oscura (Backdrop) -->
    <div @click="close" class="fixed inset-0 bg-black/60 backdrop-blur-sm print:hidden"></div>

    <!-- Contenedor del documento de factura (Hoja) -->
    <div class="bg-white text-night w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-150 relative z-10 overflow-y-auto max-h-[90vh] print:max-h-none print:shadow-none print:border-0 print:p-0 print:static print:w-full print:rounded-none">
      
      <!-- Botón de Cerrar (se oculta al imprimir la factura) -->
      <button 
        @click="close"
        class="absolute top-4 right-4 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl text-gray-400 hover:text-night border-0 transition-colors print:hidden cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Contenedor Imprimible de Factura -->
      <div id="printable-invoice" class="space-y-6">
        
        <!-- Cabecera de Factura: Logotipo e Información Fiscal Simplificada -->
        <div class="flex justify-between items-start border-b border-gray-100 pb-5">
          <div class="text-left">
            <h1 class="text-2xl font-black text-violet flex items-center gap-1.5 leading-none">
              Spot
            </h1>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Alquiler de parking privado</p>
          </div>
          <div class="text-right">
            <h2 class="text-lg font-black text-night uppercase tracking-wide">Factura Simplificada</h2>
            <p class="text-xs text-gray-500 font-bold mt-1">Nº {{ invoiceNumber }}</p>
            <p class="text-[10px] text-gray-400 font-semibold">Fecha: {{ date }}</p>
          </div>
        </div>

        <!-- Bloque de Emisor y Cliente -->
        <div class="grid grid-cols-2 gap-6 text-xs text-left">
          <!-- Datos del Emisor (Plataforma Spot) -->
          <div class="space-y-1">
            <h3 class="font-black text-gray-400 uppercase tracking-wide text-[10px]">Emisor</h3>
            <p class="font-extrabold text-night">Spot Sharing S.L.</p>
            <p class="text-gray-500">NIF: B-88392104</p>
            <p class="text-gray-500">Lersundi Kalea, 9</p>
            <p class="text-gray-500">48009 Bilbao, España</p>
          </div>

          <!-- Datos del Cliente (Conductor) -->
          <div class="space-y-1">
            <h3 class="font-black text-gray-400 uppercase tracking-wide text-[10px]">Cliente</h3>
            <p class="font-extrabold text-night">{{ clientName }}</p>
            <p class="text-gray-500">NIF/NIE: ***8391*</p>
            <p class="text-gray-500">{{ clientEmail }}</p>
            <p class="text-gray-500">Vehículo: <span class="uppercase font-bold text-night">{{ plate }}</span></p>
          </div>
        </div>

        <!-- Tabla Detallada del Servicio -->
        <div class="border-t border-gray-100 pt-5 text-left">
          <h3 class="font-black text-gray-400 uppercase tracking-wide text-[10px] mb-3">Detalle del servicio</h3>
          
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-gray-100 text-gray-400 uppercase font-black tracking-wider text-[9px] pb-2">
                <th class="text-left font-black pb-2">Concepto</th>
                <th class="text-center font-black pb-2">Horas</th>
                <th class="text-right font-black pb-2">Precio/h</th>
                <th class="text-right font-black pb-2">Importe</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr class="font-semibold text-night">
                <td class="py-3">
                  <p class="font-bold">{{ parkingName }}</p>
                  <p class="text-[10px] text-gray-400 font-medium">Plaza nº 14, Planta -1. {{ address }}</p>
                </td>
                <td class="text-center py-3">4h</td>
                <td class="text-right py-3">{{ formatEuro(rate) }}</td>
                <td class="text-right py-3">{{ formatEuro(rate * 4) }}</td>
              </tr>
              <tr class="font-semibold text-gray-500">
                <td class="py-2.5">Comisión de servicio plataforma Spot</td>
                <td class="text-center py-2.5">-</td>
                <td class="text-right py-2.5">-</td>
                <td class="text-right py-2.5">{{ formatEuro(commission) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- desglose de Base Imponible, IVA del 21% de España y Importe Total -->
        <div class="border-t border-gray-100 pt-4 flex flex-col items-end text-xs text-right space-y-1.5">
          <div class="flex justify-between w-64 text-gray-500 font-semibold">
            <span>Base Imponible (Parking):</span>
            <span>{{ formatEuro(baseImponible) }}</span>
          </div>
          <div class="flex justify-between w-64 text-gray-500 font-semibold">
            <span>IVA Repercutido (21%):</span>
            <span>{{ formatEuro(iva) }}</span>
          </div>
          <div class="flex justify-between w-64 text-gray-500 font-semibold">
            <span>Comisión de Servicio:</span>
            <span>{{ formatEuro(commission) }}</span>
          </div>
          <div class="flex justify-between w-64 border-t border-gray-200 pt-2.5 text-sm font-black text-night">
            <span>Total Cobrado:</span>
            <span class="text-violet text-base">{{ formatEuro(total) }}</span>
          </div>
        </div>

        <!-- Nota legal al pie de la factura -->
        <div class="border-t border-gray-100 pt-5 text-center text-[10px] text-gray-400 font-semibold leading-relaxed">
          <p>Esta factura simplificada ha sido emitida por Spot Sharing S.L. en nombre y representación del propietario del parking privado.</p>
          <p class="mt-1">Operación cobrada a través de Stripe Payments Europe Ltd.</p>
        </div>

      </div>

      <!-- Botones de Acción (Se ocultan automáticamente al imprimir) -->
      <div class="flex gap-3 mt-8 print:hidden">
        <button 
          @click="close"
          class="flex-grow bg-gray-100 hover:bg-gray-200 text-night font-bold text-xs py-3 px-4 rounded-xl border-0 transition-colors cursor-pointer"
        >
          Cerrar
        </button>
        <button 
          @click="printInvoice"
          class="flex-grow bg-violet hover:bg-violet-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 border-0 transition-all cursor-pointer"
        >
          <Printer class="w-4 h-4" />
          Imprimir Factura
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * COMPONENTE: InvoiceModal.vue
 * DESCRIPCIÓN: Modal de visualización y facturación simplificada de las reservas efectuadas.
 * Realiza de forma dinámica las operaciones de desglose fiscal de IVA al 21% aplicable en España,
 * y activa las reglas de impresión CSS (@media print) para obtener facturas físicas limpias.
 */
import { ref, computed } from "vue";
import { X, Printer } from "lucide-vue-next";

// Propiedades recibidas del Dashboard para poblar los campos de la factura
const props = defineProps<{
  isOpen: boolean;
  invoice: {
    id: string;
    parkingName: string;
    address: string;
    date: string;
    time: string;
    amount: number;
    plate?: string;
  } | null;
}>();

// Eventos emitidos
const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};

// Generación reactiva del código secuencial de factura
const invoiceNumber = computed(() => {
  if (!props.invoice) return "FAC-2026-00000";
  return `FAC-2026-00${props.invoice.id.split('_')[1] || '342'}`;
});

const date = computed(() => props.invoice?.date || "24 May 2026");

// Datos de perfil de cliente
const clientName = ref("Aitor González");
const clientEmail = ref("aitor.gonzalez@example.com");

const plate = computed(() => props.invoice?.plate || "9481KGB");
const parkingName = computed(() => props.invoice?.parkingName || "Parking Lersundi");
const address = computed(() => props.invoice?.address || "Lersundi Kalea, 9");

// Importes globales
const total = computed(() => props.invoice?.amount || 19.60);
const commission = ref(0.56); // Comisión del portal
const parkingAmount = computed(() => total.value - commission.value);

// Desglose de impuestos españoles (21% de IVA incluido en tarifa)
const baseImponible = computed(() => parkingAmount.value / 1.21);
const iva = computed(() => parkingAmount.value - baseImponible.value);
const rate = computed(() => (parkingAmount.value / 4)); // Tarifa por hora estimada (basado en reserva estándar de 4 horas)

/**
 * Formatea importes numéricos a formato moneda Euro (€) en español (es-ES).
 * @param value Importe numérico a formatear.
 */
const formatEuro = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Lanza la impresión nativa de la página.
 * Gracias al bloque de estilos @media print, solo se imprimirá el elemento #printable-invoice.
 */
const printInvoice = () => {
  window.print();
};
</script>

<style>
/* Reglas de impresión CSS para ocultar fondos oscuros, botones, overlays y limpiar el documento */
@media print {
  body * {
    visibility: hidden;
  }
  #printable-invoice, #printable-invoice * {
    visibility: visible;
  }
  #printable-invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: black !important;
  }
}
</style>
