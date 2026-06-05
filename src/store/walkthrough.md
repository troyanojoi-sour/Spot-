# Guía de Implementación y Arquitectura - Spot

Este documento describe la arquitectura técnica del frontend de **Spot**, detallando las últimas implementaciones avanzadas de la fase actual, la lógica fiscal española y el sistema de comentarios integrados.

---

## 🏛️ Estructura Arquitectónica

La aplicación está construida sobre **Vue 3** y **Vite**, empleando **TypeScript** y **Tailwind CSS**. A continuación se detalla la lógica de los módulos principales:

### 1. Gestión de Estado Global (Pinia Stores)
Para evitar el acoplamiento de componentes (*prop drilling*), se definieron 4 almacenes globales en `/src/stores`:
- **`auth.ts`**: Gestiona el perfil de sesión y el garaje del conductor (`vehicles`). Persiste el estado automáticamente al serializar los datos en `localStorage`.
- **`booking.ts`**: Administra el carro de la reserva en progreso (`bookingInProgress`), el listado de transacciones históricas (`bookings`) y activa los chequeos temporales de expiración.
- **`map.ts`**: Contiene la lista reactiva de parkings e implementa los filtros de coordenadas geométricas (`bounds`) y especificaciones del vehículo.
- **`notifications.ts`**: Enlaza con la API nativa de notificaciones de escritorio de HTML5, simula el registro de tokens FCM y emite avisos locales.

### 2. Mapa y Localización (Leaflet & Nominatim)
La integración geográfica está dividida en dos componentes especializados:
- **`LocationAutocomplete.vue`**: Ejecuta consultas de autocompletado contra el servidor de Nominatim de OpenStreetMap. Utiliza un disparador con temporizador de 450ms (*debounce*) para suspender peticiones mientras el usuario escribe y limita los resultados al territorio español (`countrycodes=es`).
- **`SpotMap.vue`**: Inicializa el plano Leaflet con la capa Voyager de CartoDB. Transforma los marcadores en burbujas interactivas de precio inyectando HTML dinámico a través de `L.divIcon`. Escucha el evento `moveend` del mapa para reportar el encuadre activo a Pinia y filtrar los parkings visibles en el sidebar.

---

## 🇪🇸 Lógica Fiscal de Facturación Española (21% IVA)

El componente **`InvoiceModal.vue`** implementa el cálculo fiscal de facturas simplificadas acorde al marco tributario de España:
- **Tarifa base e impuestos**: Asume que las tarifas de parking mostradas al usuario final ya incluyen el 21% de IVA (IVA repercutido).
- **Desglose impositivo**:
  - `Base Imponible` = `Importe del Parking / 1.21`
  - `IVA Repercutido (21%)` = `Importe del Parking - Base Imponible`
- **Comisión de Plataforma**: Se suma al final como una tasa de gestión de servicio fija de `0,56 €`.
- **Impresión Física / PDF**: Mediante la directiva `@media print` de CSS se inactiva el renderizado de botones de navegación, menús de la web y overlays de fondo, aislando únicamente la hoja de factura `#printable-invoice` con textos negros para generar archivos PDF listos para impresión.

---

## ⭐ Flujo de Reseñas y Valoraciones

La recogida de opiniones se gestiona en **`ReviewModal.vue`**:
- Ofrece 5 estrellas de puntuación reactivas. Al situar el cursor, los elementos se transforman aplicando micro-animaciones CSS y actualizan etiquetas semánticas del estado de la estancia (ej. "Muy buena", "Excelente").
- Al enviar la reseña, se notifica al dashboard y se recalcula reactivamente la media matemática del parking:
  $$\text{Nueva Media} = \frac{(\text{Media Anterior} \times \text{Reseñas Anteriores}) + \text{Nueva Nota}}{\text{Reseñas Anteriores} + 1}$$
- Persiste la reseña marcando la reserva histórica correspondiente para inhabilitar múltiples valoraciones sobre un mismo alquiler.

---

## 💬 Comentarios de Reactividad en Código (Composition API)

Se insertaron comentarios detallados en español en la totalidad del frontend explicando las mecánicas clave de Vue 3:
- **`ref` y `reactive`**: Para declarar estados reactivos simples u objetos estructurados que fuerzan el refresco del DOM al alterarse.
- **`computed`**: Para variables derivadas de cálculo automático (como listados de filtros o totales de facturas) que optimizan el rendimiento cacheando sus resultados.
- **`watch`**: Para observar cambios de variables asíncronas y disparar efectos secundarios, como reposicionar el mapa al cambiar de dirección.
- **`onMounted` y `onUnmounted`**: Ganchos de ciclo de vida empleados para levantar oyentes de eventos, reanudar cachés locales e iniciar bucles de temporizadores para liberar memoria de forma segura al salir de las pantallas.

---

## 🔒 Buenas Prácticas de Seguridad Implementadas

Para cumplir con los estándares de desarrollo profesional y asegurar la protección de la plataforma, se auditaron y reforzaron las siguientes directrices de seguridad:

1. **Prevención de Inyección HTML y Cross-Site Scripting (XSS)**:
   - **Vue Core escape**: Vue 3 codifica automáticamente todos los valores inyectados a través de llaves dobles (`{{ }}`) en componentes y listas, anulando la ejecución de scripts.
   - **Sanitización Leaflet**: Los mapas Leaflet requieren inyección manual de cadenas HTML para sus popups dinámicos. Para evitar inyecciones a través de nombres o direcciones de parkings introducidos por propietarios, se creó la función `escapeHtml` en [SpotMap.vue](file:///c:/Users/HP/Documents/Spot/src/components/Map/SpotMap.vue) que reemplaza caracteres especiales (`&`, `<`, `>`, `"`, `'`) por sus correspondientes entidades HTML seguras antes del renderizado.

2. **Mitigación de Inyección de Parámetros**:
   - En la comunicación con el geocodificador Nominatim, todas las consultas se escapan utilizando la función `encodeURIComponent(query.value)` en [LocationAutocomplete.vue](file:///c:/Users/HP/Documents/Spot/src/components/LocationAutocomplete.vue), evitando inyecciones de URL y alteración de parámetros de la consulta.

3. **Protección de Datos Sensibles (PCI-DSS & GDPR Compliant)**:
   - El formulario de pasarela de pago (Checkout en [BookingScreen.vue](file:///c:/Users/HP/Documents/Spot/src/screens/BookingScreen.vue)) gestiona las credenciales de tarjetas de crédito (`cardNumber`, `cardExpiry`, `cardCvc`) utilizando variables locales en memoria (`ref`), que nunca se graban en la store Pinia, no se persisten en `localStorage` y no se envían a través de ningún canal inseguro, simulando el comportamiento ideal de Stripe.js.
   - Las contraseñas de inicio de sesión se encapsulan de forma privada y no se exponen al almacenamiento persistente.

---

## 🌐 Conexión al Backend y Resiliencia Híbrida (Modo Offline)

En esta fase final, conectamos el frontend de Vue 3 con la API REST construida en Node.js + Express + TypeScript, garantizando al mismo tiempo un **mecanismo de resiliencia híbrida (modo offline)**:

1. **Integración con la API REST (`http://localhost:5000/api`)**:
   - **Autenticación**: Los procesos de inicio de sesión y registro consultan directamente `/api/auth/login` y `/api/auth/register`, persistiendo el perfil con su identificador real (`id: user.id`) de PostgreSQL.
   - **Garaje virtual**: Las acciones de añadir y retirar coches de "Mi Garaje" en la store `auth.ts` llaman a `POST /api/vehicles` y `DELETE /api/vehicles/:id` para reflejar los cambios en la tabla `vehicles` del backend.
   - **Búsqueda Geográfica de Plazas**: El store `map.ts` y la pantalla de exploración llaman a `GET /api/spots` enviando las coordenadas del buscador. El backend utiliza consultas espaciales en **PostGIS** (`ST_DWithin` y `ST_Distance`) y retorna las plazas libres ordenadas por distancia física real con su valoración media integrada de reseñas.
   - **Creación de Alquileres**: La confirmación de reserva interactúa con `POST /api/bookings` para persistir la reserva en la tabla `bookings` y lanzar el flujo de cobros de **Stripe Connect** con Destination Charges.
   - **Mensajería**: El chat de soporte entre conductor y propietario en `DashboardScreen.vue` utiliza `POST /api/chats/:bookingId/messages` y `GET /api/chats/:bookingId/messages`, registrando las conversaciones y disparando auto-respuestas en el backend integradas con **Firebase Cloud Messaging (FCM)**.

2. **Resiliencia ante fallos (Modo Offline automático)**:
   - Todas las llamadas asíncronas de red en las tiendas Pinia están envueltas en bloques `try/catch`.
   - Si el servidor backend o la base de datos están apagados, el frontend intercepta la excepción de red, genera una advertencia en la consola (`console.warn`) y activa la **simulación offline local**.
   - Esto permite que el usuario explore el mapa, simule pagos en Stripe, registre vehículos, reciba códigos QR de garaje o chatee de forma local sin interrupciones visuales ni errores fatales, logrando una tolerancia total a fallos.

