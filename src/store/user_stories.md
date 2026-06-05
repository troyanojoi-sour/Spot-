# Historias de Usuario (Frontend) - Spot

Este documento detalla las Historias de Usuario que describen el comportamiento y los criterios de aceptación de la plataforma **Spot** de alquiler de parking privado, separando los flujos de **Conductor** y **Propietario**.

---

## 🚗 Flujo del Conductor (Quiero aparcar)

### VUE-01: Búsqueda de Plazas con Autocompletado (Nominatim)
- **Historia**: Como conductor, quiero escribir una dirección en España para centrar el mapa y visualizar las plazas libres cercanas.
- **Criterios de Aceptación**:
  - El buscador ofrece sugerencias automáticas de España utilizando la API pública de Nominatim de OpenStreetMap.
  - La consulta se realiza tras 450ms de inactividad de escritura (debounce) para no sobrecargar el servidor.
  - Al hacer clic en una sugerencia, el mapa se centra en las coordenadas correspondientes y actualiza la lista de plazas disponibles de forma automática.

### VUE-02: Mapa Interactivo y Marcadores de Precio (Leaflet)
- **Historia**: Como conductor, quiero ver un mapa visual con los costes por hora de los parkings para elegir el que mejor se adapte a mi presupuesto.
- **Criterios de Aceptación**:
  - Los marcadores del mapa renderizan el precio de la plaza (ej. `2,00 €`).
  - Al seleccionar un pin, este cambia a color dorado para destacar.
  - Al pulsar en un marcador, se abre un popup informativo con título, dirección, estrellas y el botón "Ver detalles" para navegar a su ficha.
  - Al arrastrar o hacer zoom en el mapa (`moveend`), se recalculan las plazas mostradas limitándolas a las coordenadas visibles en el viewport.

### VUE-03: Botón de Geolocalización (GPS)
- **Historia**: Como conductor, quiero pulsar un botón de GPS para centrar el mapa instantáneamente en mi posición actual y ver parkings cerca de mí.
- **Criterios de Aceptación**:
  - Al hacer clic en el botón GPS, solicita permisos nativos de geolocalización.
  - Dibuja un círculo azul que representa el radio de precisión y añade un pulso animado en las coordenadas obtenidas.
  - Si el usuario se encuentra fuera del rango de Bilbao, simula una posición en Bilbao centro con una desviación aleatoria para que el prototipo muestre los parkings de prueba de forma consistente.

### VUE-04: Filtros de Selección y Búsqueda
- **Historia**: Como conductor, quiero filtrar los parkings por precio máximo, características (cubierta, puerta automática, cargador) y dimensiones de mi coche para no rentar plazas incompatibles.
- **Criterios de Aceptación**:
  - El panel lateral de filtros permite configurar:
    - Tipos de plaza (checkboxes múltiples).
    - Deslizador de precio máximo por hora (de 0,50 € a 3,00 €+).
    - Tamaño del vehículo (Moto, Coche, Furgoneta).
  - Si el tamaño es "Furgoneta", se ocultan automáticamente las plazas con restricciones (ej. Lersundi Kalea).
  - Los cambios se aplican de manera reactiva y es posible vaciar los filtros mediante el botón "Limpiar".

### VUE-05: Gestión de Vehículos ("Mi Garaje")
- **Historia**: Como conductor, quiero registrar mis coches en un garaje virtual para seleccionar cuál usaré al realizar mis reservas de parking.
- **Criterios de Aceptación**:
  - El usuario puede visualizar su garaje y registrar vehículos especificando marca, modelo, matrícula y tamaño.
  - Al realizar un pago en la pasarela de Stripe, puede seleccionar el vehículo en un menú desplegable o registrar uno nuevo inline.
  - La matrícula seleccionada se graba en el historial de reservas y se asocia al código QR activo.

### VUE-06: Pasarela de Pago Stripe y Generación de QR de Acceso
- **Historia**: Como conductor, quiero pagar mi reserva de forma segura e introducir mi tarjeta de crédito para recibir mi pase de garaje digital.
- **Criterios de Aceptación**:
  - El checkout integra un formulario de tarjeta simulado de Stripe con validaciones y formateador de espaciados automáticos para números, fecha de expiración y CVC.
  - Al pagar correctamente, se graba la reserva en Pinia con estado "active", se calcula la hora límite de expiración (+4 horas) y se muestra el pase digital.
  - El pase muestra un código de acceso único y un código QR interactivo con un lector simulado.

### VUE-07: Temporizador y Alertas Push de Expiración (FCM)
- **Historia**: Como conductor con una plaza alquilada, quiero ver un temporizador con el tiempo restante y recibir una notificación de alerta 15 minutos antes de expirar para evitar recargos.
- **Criterios de Aceptación**:
  - La reserva activa ejecuta un bucle de cuenta atrás en tiempo real con formato `HHh MMm SSs`.
  - El usuario puede otorgar permisos de notificación de escritorio en el navegador.
  - Dispone de un botón de pruebas de FCM que dispara una notificación nativa simulando los últimos 15 minutos. Al clicar el banner, redirige al pase digital.

### VUE-08: Historial de Reservas y Cancelación
- **Historia**: Como conductor, quiero consultar mis reservas y cancelar las que tenga activas si cambian mis planes de viaje.
- **Criterios de Aceptación**:
  - El panel de control lista las reservas ordenadas por fecha con etiquetas semánticas: "Activa", "Cancelada" y "Expirada".
  - Las reservas activas permiten ver su QR o cancelarse liberando la plaza.
  - El historial se actualiza de forma reactiva y persiste a través de la memoria local.

### VUE-09: Sistema de Facturación Española (IVA 21%)
- **Historia**: Como conductor, quiero descargar o imprimir facturas simplificadas que desglosen el 21% de IVA español y la tasa de servicio de Spot para justificar mis gastos.
- **Criterios de Aceptación**:
  - El historial de pagos en el panel permite abrir un desglose impositivo para cada transacción realizada.
  - La factura calcula la Base Imponible (tarifa / 1.21), el IVA repercutido (21%), la comisión de Spot (0.56 €) y los datos fiscales del emisor y cliente.
  - Dispone de un botón "Imprimir Factura" que abre el gestor de impresión del sistema operativo, formateando la hoja con CSS `@media print` para ocultar botones e interfaces no deseadas.

### VUE-10: Valoraciones e Historial de Reseñas
- **Historia**: Como conductor, quiero valorar con estrellas y comentarios mi estancia en parkings expirados para orientar a otros usuarios.
- **Criterios de Aceptación**:
  - Las reservas expiradas muestran el botón "Dejar valoración" si aún no han sido reseñadas.
  - El modal de reseña ofrece un selector interactivo de 5 estrellas con micro-animaciones en hover y descripciones textuales asociadas (ej. "Excelente ¡Perfecta!").
  - Al enviar la opinión, se recalcula reactivamente la puntuación media y contador de reseñas del parking y se inhabilita el botón de valoración para esa reserva.

### VUE-11: Chat en Vivo con Propietarios
- **Historia**: Como conductor, quiero chatear con los dueños de los parkings para coordinar la entrega de llaves o el acceso peatonal.
- **Criterios de Aceptación**:
  - En la pestaña "Mensajes", se listan los chats abiertos con fotos y últimos mensajes.
  - Al escribir y enviar, el texto se añade al feed en caliente.
  - Tras 1.5 segundos, se simula una respuesta del propietario que lanza una alerta push para una mayor inmersión.

---

## 🔑 Flujo del Propietario (Quiero alquilar)

### VUE-12: Registro con Rol Dual
- **Historia**: Como propietario, quiero seleccionar mi rol al registrarme para acceder a las herramientas de monetización y publicación de parkings.
- **Criterios de Aceptación**:
  - La pantalla de registro permite conmutar entre "Conductor" y "Propietario".
  - Si se registra como propietario, es redirigido directamente al panel de publicación para rellenar los datos de su plaza de garaje.

### VUE-13: Publicación de Plazas de Parking
- **Historia**: Como propietario, quiero rellenar un formulario con los datos de mi plaza (nombre, barrio, dirección exacta, precio y servicios) para publicarla en el mapa de Spot.
- **Criterios de Aceptación**:
  - El formulario de publicación incluye entradas obligatorias y selectores de barrios de Bilbao.
  - Permite configurar el tamaño apto de vehículo y seleccionar servicios (vigilancia, cargador eléctrico, puerta automática, etc.).
  - Al publicar, calcula de manera automatizada coordenadas geográficas con variaciones aleatorias dentro del barrio seleccionado y añade la plaza a la lista pública de Pinia.
  - Emite una notificación de confirmación al usuario propietario.

### VUE-14: Calendario de Disponibilidad del Propietario
- **Historia**: Como propietario, quiero limitar el alquiler de mi plaza a determinados días de la semana y horas para poder usarla yo mismo cuando la necesite.
- **Criterios de Aceptación**:
  - El panel de publicación dispone de selectores de hora de inicio, hora de fin y un checklist interactivo de días de la semana (L, M, X, J, V, S, D).
  - Las franjas horarias que ven los conductores al reservar la plaza en su ficha de detalle (DetailScreen) están restringidas por este calendario.

### VUE-15: Retirada de Plazas y Control de Ingresos
- **Historia**: Como propietario, quiero ver mis estadísticas de ingresos mensuales y poder retirar mis plazas de forma temporal.
- **Criterios de Aceptación**:
  - El panel lateral de propietario detalla los ingresos estimados en Euros del mes activo, las horas alquiladas y la cantidad de reservas procesadas.
  - Muestra un listado con las plazas del propietario que están activas en Spot.
  - Al pulsar en "Retirar", elimina la plaza de Pinia y del mapa de exploración de forma reactiva.

---

## 🌐 Conexión al Backend e Integración de Resiliencia Offline

### BACKEND-01: Arquitectura Híbrida y Resiliencia de Red (Offline Resilience)
- **Historia**: Como usuario, quiero que la aplicación funcione perfectamente tanto en modo conectado (llamando a la base de datos central PostgreSQL) como en modo offline (utilizando simulación local en localStorage), garantizando que nunca se interrumpa el servicio por fallas de conexión o caídas del servidor.
- **Criterios de Aceptación**:
  - Todas las peticiones de autenticación, garaje, mapas, reservas y chats intentan consultar primero los endpoints REST del backend (`http://localhost:5000/api`).
  - Si el servidor backend no responde (ej. `TypeError: Failed to fetch` o error 500), las tiendas Pinia capturan el error de forma segura, imprimen un `console.warn` informando del modo offline activo y ejecutan el comportamiento simulado local.
  - Los datos locales y las sesiones de usuario se persisten en `localStorage` de forma consistente, permitiendo reanudar la experiencia fluida sin dependencias externas obligatorias.

### BACKEND-02: Gestión de Sesión y Garaje Sincronizados
- **Historia**: Como conductor, quiero que mis vehículos y datos de perfil se guarden en una base de datos central y se sincronicen localmente.
- **Criterios de Aceptación**:
  - El inicio de sesión y registro interactúan con `POST /api/auth/login` y `POST /api/auth/register`, registrando el usuario en la tabla `users` e inyectando un token y un ID único (`usr_...`).
  - Las operaciones de añadir y borrar coches se comunican con `POST /api/vehicles` y `DELETE /api/vehicles/:id` para persistir la flota en la tabla `vehicles` de PostgreSQL.
  - Al iniciar la app, si el usuario está autenticado, sus reservas se sincronizan en segundo plano consultando `GET /api/bookings?userId=...`.

### BACKEND-03: Consulta Espacial PostGIS y Historial de Reseñas
- **Historia**: Como conductor, quiero que la lista de plazas cargadas en el mapa se consulte dinámicamente desde el backend calculando distancias geográficas reales.
- **Criterios de Aceptación**:
  - Al cargar la pantalla de exploración, se ejecuta `GET /api/spots` enviando latitud, longitud y filtros. El backend realiza una consulta espacial con PostGIS (`ST_DWithin` y `ST_Distance`) devolviendo las plazas ordenadas por cercanía.
  - El backend calcula de manera agregada (`AVG(reviews.rating)`) la puntuación de estrellas y el volumen de reseñas de cada plaza para mostrarlas actualizadas en el mapa de exploración.

### BACKEND-04: Chat en Vivo con Persistencia de Mensajes
- **Historia**: Como conductor, quiero que mis mensajes se registren en la base de datos y que las respuestas simuladas se sincronicen de forma segura.
- **Criterios de Aceptación**:
  - Al enviar un mensaje, se realiza un `POST /api/chats/:bookingId/messages` que almacena el texto en la tabla `chat_messages`.
  - El backend ejecuta una auto-respuesta del propietario en la base de datos a los 1.5s y la asocia al token FCM. El cliente del frontend recarga el feed llamando de forma asíncrona a `GET /api/chats/:bookingId/messages`.

