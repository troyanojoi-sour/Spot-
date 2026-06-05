import { defineStore } from "pinia";

/**
 * STORE: notifications.ts
 * DESCRIPCIÓN: Administrador de notificaciones y alertas push simuladas de Firebase (FCM).
 * Pide permisos nativos al navegador, simula la obtención del token FCM,
 * y muestra alertas nativas de escritorio cuando la reserva está próxima a expirar.
 */
export const useNotificationsStore = defineStore("notifications", {
  // Estado inicial del gestor de alertas
  state: () => ({
    // Indica si el usuario ha otorgado permiso para emitir notificaciones push en el navegador
    pushEnabled: false,
    // Identificador único (FCM Token) del dispositivo para suscripciones push (simulado)
    fcmToken: null as string | null,
    // Historial con todos los mensajes y alertas de servicio emitidas durante la sesión
    history: [] as Array<{
      id: string;
      title: string;
      body: string;
      actionUrl?: string;
      timestamp: string;
      read: boolean;
    }>,
  }),

  actions: {
    /**
     * Carga el estado de permisos y el histórico de alertas almacenadas en el navegador.
     */
    initNotifications() {
      const savedToken = localStorage.getItem("spot_fcm_token");
      if (savedToken) {
        this.fcmToken = savedToken;
        this.pushEnabled = true;
      }
      
      const savedHistory = localStorage.getItem("spot_notification_history");
      if (savedHistory) {
        try {
          this.history = JSON.parse(savedHistory);
        } catch (e) {
          localStorage.removeItem("spot_notification_history");
        }
      }
    },

    /**
     * Solicita permisos de notificación al navegador web.
     * Si se otorgan, genera de forma reactiva un token FCM único de prueba y lanza un aviso.
     */
    async requestPermission() {
      if (!("Notification" in window)) {
        console.warn("Este navegador no soporta notificaciones de escritorio.");
        return false;
      }
      
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.pushEnabled = true;
        // Generación de un token de dispositivo simulado
        this.fcmToken = "fcm_token_spot_" + Math.random().toString(36).substr(2, 16);
        localStorage.setItem("spot_fcm_token", this.fcmToken);
        
        console.log("FCM Token registrado en servidor:", this.fcmToken);
        
        // Emite una alerta de confirmación al usuario
        this.sendNotification("Notificaciones activas", "¡Recibirás alertas 15 min antes de que expire tu reserva!");
        return true;
      } else {
        this.pushEnabled = false;
        this.fcmToken = null;
        localStorage.removeItem("spot_fcm_token");
        return false;
      }
    },

    /**
     * Envía una notificación. Crea el registro en el historial de la app y,
     * si se tienen los permisos, emite una notificación flotante nativa del sistema operativo.
     * @param title Título principal de la alerta.
     * @param body Descripción detallada del mensaje.
     * @param actionUrl Ruta interna para redireccionar si el usuario hace clic.
     */
    sendNotification(title: string, body: string, actionUrl?: string) {
      const id = "nt_" + Math.random().toString(36).substr(2, 9);
      const newNotification = {
        id,
        title,
        body,
        actionUrl,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      // Se añade al histórico
      this.history.unshift(newNotification);
      localStorage.setItem("spot_notification_history", JSON.stringify(this.history));
      
      // Lanza la alerta de escritorio del sistema si el permiso es favorable
      if (this.pushEnabled && Notification.permission === "granted") {
        try {
          const n = new Notification(title, {
            body,
            icon: "/favicon.ico", // Logotipo
          });
          
          if (actionUrl) {
            // Manejador del clic para enfocar la app y redireccionar
            n.onclick = () => {
              window.focus();
              if (actionUrl.startsWith("/")) {
                window.location.hash = "#" + actionUrl; // Enrutamiento hash
              }
            };
          }
        } catch (e) {
          console.error("Error mostrando notificación nativa:", e);
        }
      }
    },

    /**
     * Marca todas las notificaciones de la bandeja de entrada como leídas.
     */
    markAllAsRead() {
      this.history.forEach(n => n.read = true);
      localStorage.setItem("spot_notification_history", JSON.stringify(this.history));
    },

    /**
     * Limpia completamente el historial de alertas guardadas.
     */
    clearHistory() {
      this.history = [];
      localStorage.removeItem("spot_notification_history");
    }
  }
});
