import { defineStore } from "pinia";
import type { ParkingSpot, MapFilters } from "../types";
import { parkingSpots } from "../data/parkingSpots";

/**
 * STORE: map.ts
 * DESCRIPCIÓN: Administra el estado geográfico de la aplicación.
 * Registra la lista de parkings disponibles en España, el centro geográfico del buscador,
 * el área visible del mapa Leaflet (bounds) y los filtros aplicados (precio, servicios y dimensiones del vehículo).
 */
export const useMapStore = defineStore("map", {
  // Estado geográfico de la app
  state: () => ({
    // Listado de parkings importado del dataset estático
    spots: parkingSpots as ParkingSpot[],
    // ID de la plaza seleccionada activa (para iluminar el marcador o abrir la ficha)
    selectedSpotId: null as string | null,
    // Coordenadas del punto central de búsqueda (Por defecto, Bilbao centro)
    searchCenter: { lat: 43.2630, lng: -2.9350 } as { lat: number; lng: number },
    // Caja delimitadora de coordenadas visibles del mapa (L.LatLngBounds)
    bounds: null as any,
    // Filtros activos en el panel lateral de exploración
    filters: {
      types: [] as string[], // Servicios: cubiertas, vigilancia, cargador, etc.
      maxPrice: 3.0,        // Límite de coste por hora
      size: "coche" as "moto" | "coche" | "furgoneta", // Dimensiones máximas permitidas
    } as MapFilters,
  }),

  // Propiedades computadas dinámicas (Getters)
  getters: {
    // Devuelve el objeto completo de la plaza que está seleccionada actualmente
    selectedSpot: (state) => state.spots.find(s => s.id === state.selectedSpotId) || null,
    
    /**
     * Aplica de forma reactiva la lógica de filtrado de parkings.
     * Evalúa precio máximo, dimensiones requeridas, características/etiquetas
     * y filtra espacialmente si el parking está situado dentro de la caja de visualización (bounds) del mapa.
     */
    filteredSpots: (state) => {
      return state.spots.filter(spot => {
        // 1. Filtro por precio por hora
        if (spot.price > state.filters.maxPrice) {
          return false;
        }

        // 2. Filtro de servicios de la plaza (Etiquetas / Tags)
        // Valores de mapeo: Cubierta, Descubierta, Con vigilancia, Con puerta automática, Cargador eléctrico
        for (const type of state.filters.types) {
          if (type === "Cubierta" && !spot.tags.includes("Cubierta")) return false;
          if (type === "Descubierta" && spot.tags.includes("Cubierta")) return false; 
          if (type === "Con vigilancia" && !spot.tags.some(t => t.includes("vigilancia") || t.includes("Vigilancia") || t.includes("Cámara"))) return false;
          if (type === "Con puerta automática" && !spot.tags.some(t => t.includes("puerta") || t.includes("Puerta"))) return false;
          if (type === "Cargador eléctrico" && !spot.tags.some(t => t.includes("Cargador") || t.includes("eléctrico"))) return false;
        }

        // 3. Filtro por tamaño de plaza
        // Si el conductor lleva una furgoneta, se filtran las plazas pequeñas (Lersundi tiene restricción física)
        if (state.filters.size === "furgoneta") {
          if (spot.id === "lesrundi") {
            return false; // Restricción: "No apto para vehículos > 4,5 m"
          }
        }

        // 4. Filtro geográfico (Limita los marcadores del mapa a las coordenadas actualmente visibles en pantalla)
        if (state.bounds) {
          const { _southWest, _northEast } = state.bounds;
          if (_southWest && _northEast) {
            const inLat = spot.lat >= _southWest.lat && spot.lat <= _northEast.lat;
            const inLng = spot.lng >= _southWest.lng && spot.lng <= _northEast.lng;
            return inLat && inLng;
          }
        }

        return true;
      });
    }
  },

  // Acciones que modifican el estado (Actions)
  actions: {
    // Registra la plaza activa seleccionada por el usuario
    setSelectedSpotId(id: string | null) {
      this.selectedSpotId = id;
    },
    // Guarda el área visible de mapa para recalcular el filtro geográfico
    updateBounds(bounds: any) {
      this.bounds = bounds;
    },
    // Consulta la base de datos geográfica del backend con filtros activos
    async fetchSpots() {
      try {
        const { lat, lng } = this.searchCenter;
        const radius = 50000; // Radio amplio de 50 km para Bilbao y cercanías
        const { maxPrice, size, types } = this.filters;

        let url = `http://localhost:5000/api/spots?lat=${lat}&lng=${lng}&radius=${radius}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (size) url += `&size=${size}`;
        if (types && types.length > 0) {
          url += `&types=${encodeURIComponent(types.join(","))}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Respuesta no OK del backend");
        }

        const data = await response.json();
        // El backend devuelve los parkings con nota media agregada y ordenados espacialmente
        this.spots = data;
      } catch (error: any) {
        console.warn("⚠️ Error en fetchSpots backend (utilizando base de datos offline mock):", error.message);
        // Fallback resiliente al dataset offline mock local
        this.spots = parkingSpots as ParkingSpot[];
      }
    },
    // Aplica filtros de forma parcial
    setFilters(filters: Partial<MapFilters>) {
      this.filters = { ...this.filters, ...filters };
      this.fetchSpots();
    },
    // Restablece los filtros a sus valores predeterminados de fábrica
    resetFilters() {
      this.filters = {
        types: [],
        maxPrice: 3.0,
        size: "coche",
      };
      this.fetchSpots();
    },
    // Centra el buscador del mapa en unas coordenadas indicadas
    setSearchCenter(lat: number, lng: number) {
      this.searchCenter = { lat, lng };
      this.fetchSpots();
    }
  }
});
