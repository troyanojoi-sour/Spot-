# Spot 

Frontend de **Spot**, una aplicación web tipo  para alquilar plazas de parking privadas que por ahora esta en beta.

---

## Stack Tecnológico

- **Core**: Vue 3 + Vite
- **Estado Global**: Pinia
- **Enrutamiento**: Vue Router 4 (con Lazy Loading de rutas)
- **Diseño**: Tailwind CSS (con configuración de colores de marca personalizada)
- **Mapas**: Leaflet + OpenStreetMap + Capa de diseño CartoDB Voyager
- **Lenguaje**: TypeScript

---

## 🌐 Integración con el Backend y Resiliencia Offline

Este frontend está diseñado para funcionar en un **entorno híbrido conectado/offline**:

1. **Conexión REST API**: Las tiendas globales Pinia interactúan de forma nativa con los endpoints del backend en `http://localhost:5000/api` para:
   - **Autenticación y Registro**: `POST /api/auth/login` y `POST /api/auth/register` (sincronizando el `id: user.id`).
   - **Garaje virtual**: `POST /api/vehicles` y `DELETE /api/vehicles/:id`.
   - **Búsqueda Geográfica**: `GET /api/spots` (consultas espaciales de **PostGIS**).
   - **Reservas**: `POST /api/bookings` (creación y checkout integrado con **Stripe Connect**).
   - **Mensajería**: `POST /api/chats/:bookingId/messages` y `GET /api/chats/:bookingId/messages` (sincronizado con **Firebase Cloud Messaging (FCM)**).

2. **Tolerancia a fallos (Modo Offline)**: Si el servidor backend está inactivo, las tiendas Pinia capturan el fallo de red, imprimen una advertencia de diagnóstico en la consola y activan la **simulación offline local con almacenamiento en localStorage**. La aplicación permanece 100% funcional y fluida para demostraciones locales.

---

## Documentación Detallada

Para mantener el proyecto organizado y modular, la documentación detallada se encuentra separada del archivo principal de la siguiente forma:

- 📄 **Historias de Usuario**: Las especificaciones funcionales tanto para el flujo de Conductor como el de Propietario se detallan en [user_stories.md](file:///c:/Users/HP/Documents/Spot/src/store/user_stories.md).
- 🛠️ **Arquitectura e Implementación**: El desglose de los almacenes globales Pinia, la integración con Leaflet, Nominatim, la conexión REST API, la lógica de resiliencia offline y el cálculo fiscal de IVA se detallan en [walkthrough.md](file:///c:/Users/HP/Documents/Spot/src/store/walkthrough.md).

---

## Comandos y Desarrollo

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Ejecutar servidor de desarrollo local
```bash
pnpm dev
```
La aplicación arrancará localmente en `http://localhost:5173`. Para que se conecte a la base de datos real, asegúrate de levantar previamente el servidor del backend en el puerto `5000`.

### 3. Compilar para producción
```bash
pnpm build
```
Genera los archivos optimizados listos para desplegar en el directorio `dist`.

---

## Estructura del Código

```text
src/
  ├── api/             # Datos y peticiones REST
  ├── components/      # Componentes reutilizables (Logo, Tarjetas, Facturas)
  │   └── Map/         # Mapa interactivo y marcadores de Leaflet
  ├── data/            # Mock de datos (plazas de parking de Bilbao offline)
  ├── router/          # Configuración de rutas (Vue Router)
  ├── screens/         # Pantallas/vistas de la aplicación (Home, Explore, Detail, Booking, Dashboard, Owner)
  ├── stores/          # Estado global y llamadas API con fallback offline (Pinia stores)
  ├── App.vue          # Componente principal raíz de la aplicación
  ├── main.ts          # Punto de entrada de inicialización de la app
  ├── shims-vue.d.ts   # Definiciones de TypeScript para archivos .vue
  └── styles.css       # Estilos globales y clases Tailwind extendidas
```
