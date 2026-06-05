import { defineStore } from "pinia";
import type { UserProfile, Vehicle } from "../types";

/**
 * STORE: auth.ts
 * DESCRIPCIÓN: Gestor de autenticación y de la flota de vehículos del usuario ("Mi Garaje").
 * Utiliza Pinia para mantener el estado global de la sesión del usuario,
 * sincronizando automáticamente los cambios en el almacenamiento local (localStorage).
 */
export const useAuthStore = defineStore("auth", {
  // Estado inicial del almacén
  state: () => ({
    // Datos del perfil del usuario (nombre, avatar, rol, vehículos y token de sesión)
    user: null as UserProfile | null,
    // Indicador de carga durante procesos asíncronos (como el login simulado)
    loading: false,
  }),

  // Propiedades computadas globales (Getters)
  getters: {
    // Determina si hay un usuario autenticado comprobando la presencia del token de sesión
    isAuthenticated: (state) => !!state.user?.token,
    
    // Devuelve el objeto de usuario actual
    currentUser: (state) => state.user,
    
    // Obtiene la lista de vehículos registrados del usuario o un arreglo vacío si no está autenticado
    vehicles: (state) => state.user?.vehicles || [],
    
    // Obtiene el vehículo seleccionado activo para reservar, o en su defecto, el primero disponible
    selectedVehicle: (state) => {
      if (!state.user || !state.user.vehicles) return null;
      return state.user.vehicles.find(v => v.id === state.user?.selectedVehicleId) || state.user.vehicles[0] || null;
    }
  },

  // Métodos para alterar el estado (Actions)
  actions: {
    /**
     * Inicializa la sesión del usuario recuperando los datos cacheados en localStorage.
     * Se ejecuta durante el montaje inicial del componente raíz de la aplicación (App.vue).
     */
    initAuth() {
      const savedUser = localStorage.getItem("spot_user");
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch (e) {
          // Si el JSON es corrupto o inválido, limpia la caché
          localStorage.removeItem("spot_user");
        }
      }
    },

    /**
     * Inicia sesión del usuario conectando con el backend.
     * Si falla, recurre a una simulación de usuario offline para mantener la aplicación operativa.
     * @param email Correo electrónico ingresado por el usuario.
     */
    async login(email: string) {
      this.loading = true;
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Error al iniciar sesión");
        }
        
        const data = await response.json();
        this.user = data;
        localStorage.setItem("spot_user", JSON.stringify(data));
        this.loading = false;
        return true;
      } catch (error: any) {
        console.warn("⚠️ Error en login backend (usando simulación offline):", error.message);
        
        // Simulación offline
        const name = email.split("@")[0];
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        const defaultVehicles: Vehicle[] = [
          { id: "vh_1", brand: "Audi", model: "A3 Sportback", plate: "9481KGB", size: "coche" },
          { id: "vh_2", brand: "Yamaha", model: "T-Max 560", plate: "2914FML", size: "moto" }
        ];

        const mockUser: UserProfile = {
          id: "usr_mock_aitor",
          name: capitalized || "Aitor G.",
          role: "Conductor",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenHere...",
          vehicles: defaultVehicles,
          selectedVehicleId: "vh_1"
        };
        
        this.user = mockUser;
        localStorage.setItem("spot_user", JSON.stringify(mockUser));
        this.loading = false;
        return true;
      }
    },

    /**
     * Registra un nuevo usuario en el backend.
     * Si falla, recurre a una simulación de usuario offline para mantener la aplicación operativa.
     */
    async register(name: string, email: string, phone: string, role: string, plate: string) {
      this.loading = true;
      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone, role, plate }),
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Error al registrar la cuenta");
        }
        
        const data = await response.json();
        this.user = data;
        localStorage.setItem("spot_user", JSON.stringify(data));
        this.loading = false;
        return true;
      } catch (error: any) {
        console.warn("⚠️ Error en registro backend (usando simulación offline):", error.message);
        
        // Simulación offline
        const defaultVehicles: Vehicle[] = [];
        if (role === "Conductor" && plate) {
          defaultVehicles.push({
            id: "vh_" + Math.random().toString(36).substr(2, 9),
            brand: "Vehículo",
            model: "Registrado",
            plate: plate.toUpperCase().trim(),
            size: "coche"
          });
        }

        const mockUser: UserProfile = {
          id: "usr_mock_" + Math.random().toString(36).substr(2, 9),
          name: name || "Usuario Spot",
          role: role,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenHere...",
          vehicles: defaultVehicles,
          selectedVehicleId: defaultVehicles[0]?.id || null
        };
        
        this.user = mockUser;
        localStorage.setItem("spot_user", JSON.stringify(mockUser));
        this.loading = false;
        return true;
      }
    },

    /**
     * Cierra la sesión activa limpiando el estado global y vaciando el localStorage.
     */
    logout() {
      this.user = null;
      localStorage.removeItem("spot_user");
    },

    /**
     * Añade un nuevo vehículo al garaje del usuario de forma reactiva.
     * Intenta registrarlo en el backend y actualiza el estado local de forma resiliente.
     * @param vehicle Parámetros del nuevo vehículo omitiendo el ID autogenerado.
     */
    async addVehicle(vehicle: Omit<Vehicle, "id">) {
      if (!this.user) return;
      if (!this.user.vehicles) this.user.vehicles = [];
      
      try {
        const response = await fetch("http://localhost:5000/api/vehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: this.user.id || "usr_mock_aitor",
            brand: vehicle.brand,
            model: vehicle.model,
            plate: vehicle.plate,
            size: vehicle.size
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Error del backend al guardar vehículo");
        }

        const newVehicle = await response.json();
        this.user.vehicles.push(newVehicle);
        this.user.selectedVehicleId = newVehicle.id;
      } catch (error: any) {
        console.warn("⚠️ Error al registrar vehículo en el backend (usando mock local):", error.message);
        
        const newVehicle: Vehicle = {
          ...vehicle,
          id: "vh_" + Math.random().toString(36).substr(2, 9)
        };
        this.user.vehicles.push(newVehicle);
        this.user.selectedVehicleId = newVehicle.id;
      }

      localStorage.setItem("spot_user", JSON.stringify(this.user));
    },

    /**
     * Elimina un vehículo de "Mi Garaje".
     * Intenta borrarlo en el backend y actualiza el estado local.
     * @param id Identificador único del vehículo a eliminar.
     */
    async removeVehicle(id: string) {
      if (!this.user || !this.user.vehicles) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Error del backend al borrar vehículo");
        }
      } catch (error: any) {
        console.warn("⚠️ Error al eliminar vehículo en el backend (usando mock local):", error.message);
      }
      
      // Actualización de estado local resiliente
      this.user.vehicles = this.user.vehicles.filter(v => v.id !== id);
      
      if (this.user.selectedVehicleId === id) {
        this.user.selectedVehicleId = this.user.vehicles[0]?.id || null;
      }
      
      localStorage.setItem("spot_user", JSON.stringify(this.user));
    },

    /**
     * Establece el vehículo activo por defecto para realizar las reservas de parking.
     * @param id Identificador único del vehículo seleccionado.
     */
    selectVehicle(id: string) {
      if (!this.user) return;
      this.user.selectedVehicleId = id;
      localStorage.setItem("spot_user", JSON.stringify(this.user));
    }
  }
});
