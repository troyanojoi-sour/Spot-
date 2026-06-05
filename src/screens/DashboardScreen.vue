<template>
  <div class="min-h-screen bg-night text-white font-sans flex overflow-hidden">
    
    <!-- COLUMNA IZQUIERDA: Menú lateral de navegación (Sidebar) -->
    <!-- Contiene enlaces directos a las pestañas dinámicas del panel de control -->
    <aside class="w-64 bg-[#0d1032] border-r border-white/5 flex flex-col justify-between p-6 flex-shrink-0 z-30 hidden md:flex">
      <div class="space-y-8">
        
        <!-- Logotipo corporativo animado -->
        <Logo />

        <!-- Lista del menú de navegación interactivo -->
        <nav class="space-y-1">
          <button 
            v-for="item in navItems" 
            :key="item.id"
            @click="handleNavClick(item)"
            :class="activeTab === item.id ? 'bg-violet/20 text-white border-l-4 border-violet' : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'"
            class="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-bold transition-all border-0 text-left cursor-pointer"
          >
            <div class="flex items-center gap-3.5">
              <!-- Carga dinámica del icono de Lucide -->
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span>{{ item.name }}</span>
            </div>
            
            <!-- Indicador de mensajes no leídos (Badge de chat) -->
            <span 
              v-if="item.badge && item.id === 'mensajes' && unreadMessagesCount > 0" 
              class="bg-violet text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
            >
              {{ unreadMessagesCount }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tarjeta de Perfil del Usuario en la parte inferior -->
      <div 
        @click="activeTab = 'ajustes'"
        class="border-t border-white/15 pt-5 flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all"
      >
        <div class="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" 
            alt="Aitor" 
            class="w-10 h-10 rounded-full border border-violet/50"
          />
          <div class="text-left leading-none">
            <h4 class="text-sm font-black text-white">Aitor G.</h4>
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">Conductor</span>
          </div>
        </div>
        <ChevronRight class="w-4 h-4 text-gray-400" />
      </div>
    </aside>

    <!-- ÁREA PRINCIPAL DERECHA: Cabecera y paneles dinámicos -->
    <main class="flex-grow flex flex-col min-w-0 h-screen overflow-hidden bg-night">
      
      <!-- Cabecera de la página (Header) -->
      <header class="bg-night/95 border-b border-white/5 p-5 md:p-6 flex-shrink-0">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="text-left">
            <h1 class="text-2xl font-black text-white flex items-center gap-2">
              {{ headerTitle }}
            </h1>
            <p class="text-gray-400 text-xs mt-1 font-medium">{{ headerSubtitle }}</p>
          </div>

          <!-- Cabecera y controles especiales para móviles -->
          <div class="flex items-center gap-3 md:hidden">
            <Logo />
            <button 
              @click="router.push('/explore')"
              class="bg-violet text-white p-2.5 rounded-xl border-0"
            >
              <Search class="w-4 h-4" />
            </button>
            <button 
              @click="activeTab = activeTab === 'inicio' ? 'reservas' : 'inicio'"
              class="bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-xs font-bold"
            >
              {{ activeTab === 'inicio' ? 'Mis Reservas' : 'Inicio' }}
            </button>
          </div>

          <!-- Barra de navegación por pestañas en móviles -->
          <div class="flex items-center gap-2 md:hidden overflow-x-auto w-full pt-2 pb-1 scrollbar-none text-xs">
            <button 
              v-for="item in navItems" 
              :key="item.id" 
              @click="handleNavClick(item)"
              :class="activeTab === item.id ? 'bg-violet text-white' : 'bg-white/5 text-gray-400'"
              class="px-3 py-1.5 rounded-lg border-0 font-bold flex-shrink-0"
            >
              {{ item.name }}
            </button>
          </div>

          <!-- Selector rápido de fechas (Solo en pestaña Inicio) -->
          <div v-if="activeTab === 'inicio'" class="hidden sm:flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 w-full sm:w-auto self-end">
            <div class="flex items-center gap-2 px-3 py-1 cursor-pointer" @click="router.push('/explore')">
              <Calendar class="w-4 h-4 text-violet-400" />
              <span class="text-xs font-semibold text-gray-300">Hoy, 24 may</span>
            </div>
            <div class="w-[1px] h-5 bg-white/15"></div>
            <div class="flex items-center gap-2 px-3 py-1 cursor-pointer" @click="router.push('/explore')">
              <Clock class="w-4 h-4 text-violet-400" />
              <span class="text-xs font-semibold text-gray-300">09:00 - 13:00</span>
            </div>
            <button 
              @click="router.push('/explore')"
              class="bg-violet hover:bg-violet-600 text-white font-bold text-xs py-1.5 px-3 rounded-xl border-0 transition-colors ml-2 cursor-pointer"
            >
              Filtros
            </button>
          </div>
        </div>
      </header>

      <!-- Paneles de pestañas dinámicos (Renderizado condicional) -->
      <div class="flex-grow relative min-h-0">
        
        <!-- PESTAÑA 1: INICIO (Mapa Leaflet y listado lateral) -->
        <div v-if="activeTab === 'inicio'" class="h-full flex flex-col lg:flex-row min-h-0">
          <!-- Mapa interactivo Leaflet -->
          <div class="flex-grow h-full min-h-[350px] lg:min-h-0 relative z-10 p-4">
            <SpotMap />
          </div>

          <!-- Listado lateral derecho de parkings recomendados -->
          <section class="w-full lg:w-80 h-[300px] lg:h-full bg-white text-night lg:border-l border-gray-100 flex flex-col p-5 md:p-6 overflow-hidden flex-shrink-0 shadow-lg lg:shadow-none z-20">
            <div class="flex items-center justify-between pb-3.5 border-b border-gray-100 flex-shrink-0">
              <h3 class="font-extrabold text-sm text-night uppercase tracking-wider">Mejores opciones cerca</h3>
              <span class="bg-violet/10 text-violet text-[10px] font-black px-2 py-0.5 rounded-full">Cerca</span>
            </div>

            <!-- Scroll con tarjetas simplificadas -->
            <div class="flex-grow overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
              <div 
                v-for="spot in mapStore.filteredSpots.slice(0, 3)" 
                :key="spot.id"
                @click="selectSpot(spot)"
                :class="spot.id === mapStore.selectedSpotId ? 'border-violet ring-1 ring-violet bg-violet/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'"
                class="p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3 text-left group"
              >
                <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 shadow-sm">
                  <img :src="getSpotImage(spot.id)" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>

                <div class="flex-grow min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 class="font-extrabold text-xs text-night truncate group-hover:text-violet transition-colors">
                      {{ spot.name }}
                    </h4>
                    <p class="text-[10px] text-gray-500 truncate mt-0.5">{{ spot.address.split(',')[1]?.trim() || spot.address }}</p>
                  </div>
                  <div class="flex items-center justify-between mt-2 flex-wrap">
                    <span class="text-[10px] font-bold text-violet flex items-center gap-0.5">
                      <Star class="w-3 h-3 fill-violet" />
                      {{ spot.rating.toFixed(1) }}
                    </span>
                    <span class="font-black text-xs text-night">{{ spot.price.toFixed(2) }} €/h</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enlace al buscador completo -->
            <div class="pt-3 border-t border-gray-100 flex-shrink-0">
              <button 
                @click="router.push('/explore')"
                class="w-full text-center text-xs font-bold text-violet hover:text-violet-700 flex items-center justify-center gap-1 group border-0 bg-transparent cursor-pointer"
              >
                Ver más resultados
                <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>
        </div>

        <!-- PESTAÑA 2: MIS RESERVAS -->
        <!-- Permite al conductor controlar sus plazas reservadas activas o dejar valoraciones en reservas expiradas -->
        <div v-else-if="activeTab === 'reservas'" class="h-full overflow-y-auto p-6 max-w-4xl mx-auto space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-white">Historial de Reservas</h2>
            <button 
              @click="router.push('/explore')"
              class="bg-violet hover:bg-violet-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl border-0"
            >
              Buscar nueva plaza
            </button>
          </div>

          <div v-if="bookingStore.bookings.length > 0" class="space-y-4">
            <div 
              v-for="b in bookingStore.bookings" 
              :key="b.id"
              class="bg-white text-night rounded-3xl p-5 border border-gray-150 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
            >
              <div class="flex gap-4">
                <div class="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-sm">
                  <img :src="getSpotImage(b.spot.id)" class="w-full h-full object-cover" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-extrabold text-base text-night">{{ b.spot.name }}</h3>
                    <span 
                      :class="{
                        'bg-emerald-50 text-emerald-600 border-emerald-100': b.status === 'active',
                        'bg-red-50 text-red-500 border-red-100': b.status === 'cancelled',
                        'bg-gray-50 text-gray-500 border-gray-150': b.status === 'expired'
                      }"
                      class="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border"
                    >
                      {{ b.status === 'active' ? 'Activa' : b.status === 'cancelled' ? 'Cancelada' : 'Expirada' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">{{ b.spot.address }}</p>
                  <p class="text-[11px] text-gray-400 font-bold mt-2">
                    {{ b.date }} • {{ b.timeSlot }} ({{ b.durationHours }}h)
                  </p>
                  <p v-if="b.vehiclePlate" class="text-[10px] text-violet font-bold mt-1 uppercase">Vehículo: {{ b.vehiclePlate }}</p>
                </div>
              </div>

              <!-- Lógica de control según el estado de la reserva -->
              <div class="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div class="text-left md:text-right">
                  <span class="text-xs text-gray-400 font-bold">Cobrado</span>
                  <p class="text-base font-black text-night leading-none mt-0.5">{{ formatEuro(b.total) }}</p>
                </div>
                
                <div class="flex gap-2">
                  <!-- Mostrar QR en reservas activas -->
                  <button 
                    v-if="b.status === 'active'"
                    @click="router.push('/booking')"
                    class="bg-violet hover:bg-violet-700 text-white font-bold text-xs py-2 px-3 rounded-lg border-0 transition-colors cursor-pointer"
                  >
                    Ver QR de acceso
                  </button>
                  <button 
                    v-if="b.status === 'active'"
                    @click="bookingStore.cancelBooking(b.id)"
                    class="bg-red-50 hover:bg-red-100 text-red-500 font-bold text-xs py-2 px-3 rounded-lg border-0 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <!-- Sistema de valoración interactiva (ReviewModal) para reservas expiradas -->
                  <button 
                    v-if="b.status === 'expired' && !reviewedBookingIds.includes(b.id)"
                    @click="openReviewModal(b)"
                    class="bg-spot-secondary hover:bg-amber-400 text-night font-bold text-xs py-2 px-3 rounded-lg border-0 transition-colors cursor-pointer"
                  >
                    Dejar valoración
                  </button>
                  <span v-else-if="reviewedBookingIds.includes(b.id)" class="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                    ✓ Valoración enviada
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="bg-white/5 rounded-3xl p-12 text-center border border-white/10">
            <p class="text-gray-400 font-semibold text-sm">No tienes ninguna reserva registrada en tu cuenta.</p>
          </div>
        </div>

        <!-- PESTAÑA 3: FAVORITOS -->
        <div v-else-if="activeTab === 'favoritos'" class="h-full overflow-y-auto p-6 max-w-4xl mx-auto space-y-6">
          <h2 class="text-xl font-black text-white text-left">Mis Plazas Favoritas</h2>
          
          <div v-if="favoriteSpots.length > 0" class="space-y-4">
            <ParkingCard 
              v-for="spot in favoriteSpots" 
              :key="spot.id" 
              :spot="spot" 
            />
          </div>

          <div v-else class="bg-white/5 rounded-3xl p-12 text-center border border-white/10 flex flex-col items-center">
            <Heart class="w-12 h-12 text-gray-500 stroke-1 mb-3" />
            <p class="text-gray-400 font-semibold text-sm">No tienes plazas guardadas en tus favoritos.</p>
            <button 
              @click="router.push('/explore')"
              class="mt-4 bg-violet hover:bg-violet-600 text-white font-bold text-xs py-2 px-4 rounded-xl border-0"
            >
              Explorar plazas
            </button>
          </div>
        </div>

        <!-- PESTAÑA 4: MENSAJES (Chat en Tiempo Real) -->
        <div v-else-if="activeTab === 'mensajes'" class="h-full flex min-h-0 bg-[#0d1032]">
          <!-- Bandeja de entrada de chats -->
          <div class="w-80 border-r border-white/5 flex flex-col h-full bg-[#0a0c25] flex-shrink-0">
            <div class="p-4 border-b border-white/5 text-left">
              <h3 class="font-extrabold text-sm text-white uppercase tracking-wider">Mensajes</h3>
            </div>
            
            <div class="flex-grow overflow-y-auto divide-y divide-white/5 scrollbar-thin">
              <div 
                v-for="chat in chats" 
                :key="chat.id"
                @click="activeChatId = chat.id"
                :class="activeChatId === chat.id ? 'bg-violet/10 border-l-4 border-violet' : 'border-l-4 border-transparent hover:bg-white/5'"
                class="p-4 cursor-pointer text-left transition-colors flex justify-between gap-3 relative"
              >
                <div class="flex gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-full bg-violet/20 flex-shrink-0 flex items-center justify-center font-bold text-violet-300">
                    {{ chat.ownerName.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <h4 class="font-extrabold text-xs text-white truncate">{{ chat.ownerName }}</h4>
                    <p class="text-[10px] text-gray-400 truncate mt-0.5 font-medium">{{ chat.parkingName }}</p>
                    <p :class="chat.unread ? 'text-white font-extrabold' : 'text-gray-500'" class="text-[11px] truncate mt-1">
                      {{ chat.lastMessage }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-col justify-between items-end flex-shrink-0">
                  <span class="text-[9px] text-gray-500 font-bold">{{ chat.time }}</span>
                  <div v-if="chat.unread" class="w-2.5 h-2.5 bg-violet rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel de Conversación Activa -->
          <div class="flex-grow flex flex-col h-full bg-[#0e1136] relative">
            <template v-if="activeChat">
              <!-- Cabecera del Chat -->
              <div class="p-4 border-b border-white/5 bg-[#0a0c25] flex justify-between items-center text-left flex-shrink-0">
                <div>
                  <h3 class="font-extrabold text-sm text-white">{{ activeChat.ownerName }}</h3>
                  <p class="text-[10px] text-violet-400 font-bold">{{ activeChat.parkingName }}</p>
                </div>
                <button 
                  @click="router.push(`/spot/${activeChat.spotId}`)"
                  class="bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-1.5 px-3 rounded-lg border border-white/10"
                >
                  Ver Plaza
                </button>
              </div>

              <!-- Histórico de Mensajes del Chat -->
              <div class="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin flex flex-col">
                <div 
                  v-for="(msg, idx) in activeChat.messages" 
                  :key="idx"
                  :class="msg.sender === 'me' ? 'self-end bg-violet text-white rounded-br-none' : 'self-start bg-[#161a48] text-gray-200 rounded-bl-none'"
                  class="max-w-[70%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm text-left animate-fade-in"
                >
                  <p>{{ msg.text }}</p>
                  <span class="text-[8px] text-white/50 block text-right mt-1.5 font-bold">{{ msg.time }}</span>
                </div>
              </div>

              <!-- Input de texto para enviar mensajes -->
              <div class="p-4 border-t border-white/5 bg-[#0a0c25] flex gap-3 items-center flex-shrink-0">
                <input 
                  type="text" 
                  v-model="typedMessage" 
                  @keyup.enter="sendMessage"
                  placeholder="Escribe un mensaje al propietario..." 
                  class="flex-grow bg-[#161a48] border-0 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-violet placeholder-gray-500"
                />
                <button 
                  @click="sendMessage"
                  class="bg-violet hover:bg-violet-700 text-white font-bold text-xs p-3 rounded-xl border-0 transition-colors cursor-pointer"
                >
                  <Send class="w-4 h-4" />
                </button>
              </div>
            </template>
            <div v-else class="flex-grow flex items-center justify-center text-center p-12 text-gray-400 font-semibold text-sm">
              Selecciona una conversación del panel izquierdo para chatear.
            </div>
          </div>
        </div>

        <!-- PESTAÑA 5: PAGOS (Métodos e Historial de Facturas Imprimibles) -->
        <div v-else-if="activeTab === 'pagos'" class="h-full overflow-y-auto p-6 max-w-4xl mx-auto space-y-6">
          <h2 class="text-xl font-black text-white text-left">Métodos de Pago e Historial</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Izquierda: Gráfico de Tarjeta VISA corporativa -->
            <div class="bg-white/5 border border-white/10 rounded-3xl p-6 text-left space-y-4">
              <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-400">Tarjetas guardadas</h3>
              
              <div class="bg-gradient-to-r from-violet-600 to-indigo-800 rounded-2xl p-5 shadow-glow relative overflow-hidden text-white flex flex-col justify-between h-40">
                <div class="flex justify-between items-start">
                  <CreditCard class="w-8 h-8" />
                  <span class="font-black tracking-widest text-sm text-violet-200">VISA</span>
                </div>
                <div>
                  <p class="font-mono text-lg tracking-widest">•••• •••• •••• 4242</p>
                  <div class="flex justify-between items-end mt-4">
                    <div>
                      <span class="text-[8px] uppercase font-bold text-violet-300">Titular</span>
                      <p class="text-xs font-bold font-mono">AITOR GONZALEZ</p>
                    </div>
                    <div>
                      <span class="text-[8px] uppercase font-bold text-violet-300">Expira</span>
                      <p class="text-xs font-bold font-mono">12/28</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Derecha: Historial de transacciones de Stripe y visor de Facturas -->
            <div class="bg-white/5 border border-white/10 rounded-3xl p-6 text-left space-y-4">
              <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-400">Transacciones recientes</h3>
              
              <div class="space-y-3 divide-y divide-white/5">
                <div 
                  v-for="invoice in invoices" 
                  :key="invoice.id"
                  class="flex justify-between items-center py-2.5"
                >
                  <div class="text-left">
                    <h4 class="font-extrabold text-xs text-white">{{ invoice.parkingName }}</h4>
                    <span class="text-[9px] text-gray-400 font-semibold">{{ invoice.date }} • {{ invoice.time }}</span>
                    <!-- Botón para disparar InvoiceModal -->
                    <button 
                      @click="openInvoice(invoice)"
                      class="text-[9px] text-violet hover:underline block font-bold mt-1 bg-transparent border-0 cursor-pointer p-0"
                    >
                      Ver Factura
                    </button>
                  </div>
                  <div class="text-right">
                    <span class="font-black text-xs text-red-400">-{{ formatEuro(invoice.amount) }}</span>
                    <span class="text-[9px] text-emerald-500 font-bold block uppercase tracking-wider">Completado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PESTAÑA 6: AJUSTES (Perfil y Notificaciones) -->
        <div v-else-if="activeTab === 'ajustes'" class="h-full overflow-y-auto p-6 max-w-2xl mx-auto space-y-6">
          <h2 class="text-xl font-black text-white text-left">Ajustes de Perfil</h2>
          
          <div class="bg-white text-night rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-150/40 text-left space-y-6">
            
            <div class="flex items-center gap-5 border-b border-gray-100 pb-5">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80" 
                class="w-16 h-16 rounded-full border-2 border-violet"
              />
              <div>
                <h3 class="font-extrabold text-base">{{ authStore.currentUser?.name || 'Aitor G.' }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">Rol activo: {{ authStore.currentUser?.role || 'Conductor' }}</p>
                <button 
                  @click="router.push('/owner')"
                  class="mt-2 bg-violet/10 hover:bg-violet/20 text-violet border-0 font-bold text-[10px] uppercase tracking-wider py-1 px-3.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cambiar a Propietario
                </button>
              </div>
            </div>

            <!-- Formulario de perfil -->
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-wide">Nombre</label>
                  <input type="text" value="Aitor" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-violet" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-wide">Apellidos</label>
                  <input type="text" value="González" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-violet" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-wide">Email</label>
                <input type="email" value="aitor.gonzalez@example.com" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-violet" />
              </div>
            </div>

            <!-- Preferencias de Alertas FCM -->
            <div class="space-y-3.5 border-t border-gray-100 pt-5">
              <h3 class="font-extrabold text-sm uppercase tracking-wider text-gray-400">Preferencias de Alertas</h3>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold text-gray-700">Notificaciones push en navegador</h4>
                  <p class="text-[10px] text-gray-400 mt-0.5">Avísame 15 minutos antes de expirar mi parking.</p>
                </div>
                
                <button 
                  @click="toggleNotifications"
                  :class="notificationsStore.pushEnabled ? 'bg-violet' : 'bg-gray-200'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out border-0"
                >
                  <span 
                    :class="notificationsStore.pushEnabled ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </div>
            </div>

            <!-- Botón de logout -->
            <div class="border-t border-gray-100 pt-5 text-right">
              <button 
                @click="handleLogout"
                class="bg-red-50 hover:bg-red-100 text-red-500 border-0 font-bold text-xs py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>

          </div>
        </div>

      </div>

    </main>

    <!-- RENDER DE MODALES COMPLEMENTARIOS -->
    
    <!-- Modal de Facturas Imprimibles -->
    <InvoiceModal 
      :isOpen="isInvoiceOpen" 
      :invoice="selectedInvoice" 
      @close="isInvoiceOpen = false" 
    />

    <!-- Modal de Reseñas / Valoración -->
    <ReviewModal 
      :isOpen="isReviewOpen" 
      :spotId="reviewSpotId" 
      :spotName="reviewSpotName" 
      @close="isReviewOpen = false" 
      @submitted="handleReviewSubmitted" 
    />

  </div>
</template>

<script setup lang="ts">
/**
 * ARCHIVO: DashboardScreen.vue
 * DESCRIPCIÓN: Panel de control integral del conductor.
 * Utiliza la Composition API de Vue 3, vinculaciones directas a Pinia y renderizado reactivo de subpestañas.
 */
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMapStore } from "../stores/map";
import { useBookingStore } from "../stores/booking";
import { useNotificationsStore } from "../stores/notifications";
import { useAuthStore } from "../stores/auth";
import Logo from "../components/Logo.vue";
import SpotMap from "../components/Map/SpotMap.vue";
import ParkingCard from "../components/ParkingCard.vue";
import InvoiceModal from "../components/InvoiceModal.vue";
import ReviewModal from "../components/ReviewModal.vue";
import { 
  Home, 
  Search, 
  Calendar, 
  Heart, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  Star,
  Send
} from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const mapStore = useMapStore();
const bookingStore = useBookingStore();
const notificationsStore = useNotificationsStore();

// Gestión de la pestaña de control activa
const activeTab = ref("inicio");

// Variables para el sistema de chat en vivo
const activeChatId = ref("chat_1");
const typedMessage = ref("");

// Variables para modales interactivos
const isInvoiceOpen = ref(false);
const selectedInvoice = ref<any>(null);

const isReviewOpen = ref(false);
const reviewSpotId = ref("");
const reviewSpotName = ref("");
const reviewedBookingId = ref("");
const reviewedBookingIds = ref<string[]>([]); // Almacena qué reservas ya han sido valoradas

// Elementos de navegación lateral
const navItems = ref([
  { id: "inicio", name: "Inicio", icon: Home },
  { id: "explorar", name: "Explorar", icon: Search },
  { id: "reservas", name: "Mis reservas", icon: Calendar },
  { id: "favoritos", name: "Favoritos", icon: Heart },
  { id: "mensajes", name: "Mensajes", icon: MessageSquare, badge: true },
  { id: "pagos", name: "Pagos", icon: CreditCard },
  { id: "ajustes", name: "Ajustes", icon: Settings }
]);

// Consulta el historial de chats de la base de datos del backend
const fetchChats = async () => {
  const userId = authStore.user?.id || "usr_mock_aitor";
  try {
    const response = await fetch(`http://localhost:5000/api/chats?userId=${userId}`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    if (data && data.length > 0) {
      // Para cada hilo de chat, cargamos sus mensajes individuales en segundo plano
      for (const chat of data) {
        const msgRes = await fetch(`http://localhost:5000/api/chats/${chat.id}/messages?userId=${userId}`);
        if (msgRes.ok) {
          chat.messages = await msgRes.json();
        } else {
          chat.messages = [];
        }
      }
      chats.value = data;
      // Selecciona el primer chat activo de la lista si no está establecido
      if (chats.value.length > 0 && !chats.value.some(c => c.id === activeChatId.value)) {
        activeChatId.value = chats.value[0].id;
      }
    }
  } catch (error) {
    console.warn("⚠️ Error al cargar chats desde el backend (utilizando base de datos local mock).");
  }
};

onMounted(() => {
  // Inicialización de la sesión persistente
  authStore.initAuth();
  bookingStore.initBookings();
  notificationsStore.initNotifications();
  
  if (!authStore.isAuthenticated) {
    authStore.login("aitor.gonzalez@example.com");
  }

  // Carga hilos de conversación del backend
  fetchChats();
});

const handleNavClick = (item: any) => {
  if (item.id === "explorar") {
    router.push("/explore");
  } else {
    activeTab.value = item.id;
  }
};

const selectSpot = (spot: any) => {
  mapStore.setSelectedSpotId(spot.id);
  mapStore.setSearchCenter(spot.lat, spot.lng);
};

const getSpotImage = (id: string) => {
  if (id === "lesrundi") {
    return "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=150&q=85";
  } else if (id === "iparraguirre") {
    return "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=150&q=85";
  }
  return "https://images.unsplash.com/photo-1506521788723-85811181d33b?auto=format&fit=crop&w=150&q=85";
};

// Títulos dinámicos de cabecera según la pestaña
const headerTitle = computed(() => {
  switch (activeTab.value) {
    case "inicio": return "Hola, Aitor 👋";
    case "reservas": return "Tus Reservas";
    case "favoritos": return "Tus Favoritos";
    case "mensajes": return "Mensajes Privados";
    case "pagos": return "Tus Pagos";
    case "ajustes": return "Perfil y Ajustes";
    default: return "Spot";
  }
});

const headerSubtitle = computed(() => {
  switch (activeTab.value) {
    case "inicio": return "¿Dónde quieres aparcar hoy?";
    case "reservas": return "Controla tus tiempos de parking y abre portones";
    case "favoritos": return "Las plazas que más te gustan guardadas en un clic";
    case "mensajes": return "Escríbete con los propietarios de las plazas de parking";
    case "pagos": return "Historial de transacciones y métodos de facturación";
    case "ajustes": return "Edita tus preferencias y cambia de rol de usuario";
    default: return "";
  }
});

// Carga las plazas favoritas marcadas
const favoriteSpots = computed(() => {
  return mapStore.spots.slice(0, 2);
});

// Apertura del modal de facturación detallada (IVA)
const openInvoice = (invoice: any) => {
  const plate = authStore.vehicles[0]?.plate || "9481KGB";
  
  selectedInvoice.value = {
    ...invoice,
    address: invoice.parkingName === "Parking Lersundi" ? "Lersundi Kalea, 9" : 
             invoice.parkingName === "Garaje Iparraguirre" ? "Iparraguirre Kalea, 32" : "Botika Zaharra Kalea, 1",
    plate
  };
  isInvoiceOpen.value = true;
};

// Control de apertura de reseñas
const openReviewModal = (booking: any) => {
  reviewSpotId.value = booking.spot.id;
  reviewSpotName.value = booking.spot.name;
  reviewedBookingId.value = booking.id;
  isReviewOpen.value = true;
};

// Callback al guardar opinión en ReviewModal
const handleReviewSubmitted = (review: { rating: number; comment: string }) => {
  const spot = mapStore.spots.find(s => s.id === reviewSpotId.value);
  if (spot) {
    // Recalcula la media de estrellas acumulada
    const totalRatingSum = spot.rating * spot.reviews + review.rating;
    spot.reviews += 1;
    spot.rating = totalRatingSum / spot.reviews;
  }
  
  // Guardar ID para ocultar botón
  reviewedBookingIds.value.push(reviewedBookingId.value);
  
  notificationsStore.sendNotification(
    "Reseña enviada", 
    `¡Gracias por tu opinión sobre ${reviewSpotName.value}! Tu valoración de ${review.rating} estrellas ha sido añadida.`
  );
};

// Conversaciones del chat (mocked)
const chats = ref([
  {
    id: "chat_1",
    ownerName: "Juan L.",
    parkingName: "Parking Lersundi",
    spotId: "lesrundi",
    lastMessage: "Hola Aitor, la plaza número 14 está libre.",
    time: "10:30",
    unread: true,
    messages: [
      { sender: "owner", text: "Hola Aitor, gracias por reservar en Parking Lersundi.", time: "10:20" },
      { sender: "me", text: "Hola Juan, muchas gracias. ¿El portón de acceso se abre con el código QR?", time: "10:25" },
      { sender: "owner", text: "Sí, la plaza número 14 está libre. Solo tienes que escanear el QR en la columna izquierda.", time: "10:30" }
    ]
  },
  {
    id: "chat_2",
    ownerName: "María P.",
    parkingName: "Garaje Iparraguirre",
    spotId: "iparraguirre",
    lastMessage: "El código del portal peatonal es 4801.",
    time: "Ayer",
    unread: false,
    messages: [
      { sender: "owner", text: "Hola, para acceder peatonalmente al garaje, tienes que digitar 4801 en el teclado del ascensor.", time: "Ayer 15:30" },
      { sender: "me", text: "Entendido, ¡muchas gracias!", time: "Ayer 15:35" }
    ]
  }
]);

const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value));
const unreadMessagesCount = computed(() => chats.value.filter(c => c.unread).length);

// Envío de mensajes y auto-respuesta simulada de propietario
const sendMessage = async () => {
  if (!typedMessage.value.trim() || !activeChat.value) return;
  
  const text = typedMessage.value;
  typedMessage.value = "";
  
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  
  // Agregar inmediatamente al feed local del cliente
  activeChat.value.messages.push({
    sender: "me",
    text: text,
    time: timeStr
  });
  
  activeChat.value.lastMessage = text;
  activeChat.value.time = timeStr;
  activeChat.value.unread = false;

  const currentChat = activeChat.value;
  const userId = authStore.user?.id || "usr_mock_aitor";

  try {
    const response = await fetch(`http://localhost:5000/api/chats/${currentChat.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: userId,
        text: text
      }),
    });

    if (!response.ok) {
      throw new Error();
    }

    // Si el backend recibió el mensaje, simula la auto-respuesta en la DB.
    // Recargamos el chat tras 1.6 segundos para reflejar la respuesta del dueño.
    setTimeout(async () => {
      try {
        const msgRes = await fetch(`http://localhost:5000/api/chats/${currentChat.id}/messages?userId=${userId}`);
        if (msgRes.ok) {
          currentChat.messages = await msgRes.json();
          const lastMsg = currentChat.messages[currentChat.messages.length - 1];
          if (lastMsg) {
            currentChat.lastMessage = lastMsg.text;
            currentChat.time = lastMsg.time;
          }
          notificationsStore.sendNotification("Nuevo mensaje de " + currentChat.ownerName, "¡Perfecto! Te deseo una buena estancia...");
        }
      } catch (err) {
        console.warn("⚠️ Error al recargar mensajes del backend.");
      }
    }, 1600);

  } catch (error) {
    console.warn("⚠️ Error en envío de mensaje al backend (usando simulación offline):");
    
    // Simulación offline
    setTimeout(() => {
      currentChat.messages.push({
        sender: "owner",
        text: "¡Perfecto! Te deseo una buena estancia en mi plaza de parking.",
        time: new Date().getHours().toString().padStart(2, "0") + ":" + new Date().getMinutes().toString().padStart(2, "0")
      });
      currentChat.lastMessage = "¡Perfecto! Te deseo una buena estancia...";
      currentChat.time = "Ahora";
      // Notificación en segundo plano
      notificationsStore.sendNotification("Nuevo mensaje de " + currentChat.ownerName, "¡Perfecto! Te deseo una buena estancia...");
    }, 1500);
  }
};

// Historial de Facturas
const invoices = ref([
  { id: "inv_1", parkingName: "Parking Lersundi", date: "24 May 2026", time: "09:00", amount: 19.60 },
  { id: "inv_2", parkingName: "Garaje Iparraguirre", date: "18 May 2026", time: "10:00", amount: 15.40 },
  { id: "inv_3", parkingName: "Parking Deusto", date: "05 May 2026", time: "12:00", amount: 13.30 }
]);

const toggleNotifications = () => {
  if (notificationsStore.pushEnabled) {
    notificationsStore.pushEnabled = false;
    notificationsStore.fcmToken = null;
    localStorage.removeItem("spot_fcm_token");
  } else {
    notificationsStore.requestPermission();
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
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
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(118, 40, 239, 0.15);
  border-radius: 4px;
}
</style>
