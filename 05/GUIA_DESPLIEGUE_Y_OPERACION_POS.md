# GUÍA TÉCNICA DE DESPLIEGUE, PERIFÉRICOS Y OPERACIÓN DEL PUNTO DE VENTA (POS)
## PAPELERÍA A B C — FASE 5: SPRINT 2 (MÓDULO DE VENTAS OPERATIVO)

---

### 1. Requisitos del Sistema y Puesta en Marcha

El sistema para **Papelería A B C** no requiere software de servidor backend (Node, PHP, Apache o IIS) ni bases de datos cliente-servidor pesadas. Opera bajo el paradigma **Web Application Offline-First**.

* **Sistema Operativo:** Windows 10, Windows 11 o cualquier distribución moderna.
* **Navegador Recomendado:** Google Chrome, Microsoft Edge, Brave o Firefox (versiones actualizadas con soporte para ES6+ y LocalStorage).
* **Arranque Inmediato:** Dar doble clic en el archivo `index.html` (o `file:///C:/Users/gerac/Desktop/ISA/ENTREGA/index.html` / `file:///C:/Users/gerac/Desktop/ISA/05/index.html`).
* **Latencia de Carga:** Menos de 5 milisegundos gracias al motor relacional síncrono en memoria con espejo LocalStorage (`PAPELERIA_ABC_SQL_STORE_V4`).

---

### 2. Configuración de Periféricos Físicos de Mostrador

#### 2.1 Lector de Código de Barras Láser 1D/2D USB
1. Conecte el lector a cualquier puerto USB libre de la terminal de mostrador.
2. Windows reconocerá el dispositivo como un dispositivo de entrada estándar (HID Keyboard Device / Emulación Teclado).
3. Asegúrese de que el lector esté configurado con el sufijo predeterminado **CR / Enter** (la mayoría de los lectores de fábrica vienen así; si no, escanee el código de barras *"Add Enter Suffix"* del manual del fabricante).
4. Pruebe el lector en el campo de búsqueda del punto de venta (`[F1]`). Al escanear cualquier código EAN-13 del catálogo (por ejemplo, `7501006500114`), el producto se agregará automáticamente al carrito activo sin mostrar notificaciones intrusivas ni requerir el uso del ratón.

#### 2.2 Mini Impresora Térmica de Tickets (58mm / 80mm USB)
1. Instale el controlador de la impresora térmica provisto por el fabricante (controlador POS / ESC-POS).
2. Configure la impresora en Windows con los siguientes parámetros de página:
   * **Tamaño de papel:** `80mm × Receipt` o `58mm × Receipt` (según el ancho de su modelo).
   * **Márgenes:** `Ninguno` (Márgenes en 0 mm).
   * **Encabezados y pies de página:** `Desactivar` (para evitar que el navegador imprima la fecha del sistema o la URL en el ticket).
3. En la ventana de previsualización del ticket del sistema, al hacer clic en **"[Imprimir Ticket]"**, se abrirá el diálogo de impresión con las reglas `@media print` ya calibradas para papel continuo.

#### 2.3 Cajón de Dinero Automático Metálico (RJ11)
1. Conecte el cable telefónico RJ11 del cajón directamente al puerto **DK (Drawer Kickout)** ubicado en la parte trasera de la impresora térmica de tickets.
2. En las propiedades del controlador de la impresora en Windows, active la opción:
   * `Apertura de cajón: Antes de imprimir` o `Al finalizar impresión de ticket`.
3. Al confirmar cualquier cobro en efectivo, la impresora enviará el pulso eléctrico de 24V al cajón, abriendo la gaveta automáticamente para entregar el cambio.

---

### 3. Protocolo de Inicio de Jornada y Apertura de Caja

1. Al abrir el sistema por la mañana, el turno predeterminado se encuentra en estado **TURNO ABIERTO** con un fondo inicial en efectivo de **$500.00 MXN**.
2. Verifique en el encabezado que el reloj del sistema esté marcando la hora correcta y que el cajero activo sea el asignado.
3. El mostrador inicia con el **Carrito 1** activo. Puede alternar a los carritos 2, 3, 4 o 5 en cualquier momento mediante el atajo de teclado **`[F2]`**.

---

### 4. Flujo de Venta Rápida y Ergonomía de Mostrador

1. **Escaneo Fluido de Artículos:**
   * Presione `[F1]` para enfocar el buscador.
   * Escanee los códigos de barras de los productos o teclee su nombre/SKU.
   * La adición de artículos es instantánea y silenciosa (sin alertas emergentes que interrumpan el ritmo de lectura continua).
   * Si el cliente desea varios artículos del mismo tipo, use el botón `+` para incrementar la cantidad o teclee el número directamente.
2. **Diseño de Carrito Fijo con Desplazamiento Independiente:**
   * El panel del carrito cuenta con un contenedor de artículos con desplazamiento vertical (`scroll`) propio y cabeceras de tabla estáticas.
   * El pie de página del carrito que contiene los totales y el botón **"Cobrar Ticket [F10]"** permanece anclado fijamente en la parte inferior de la pantalla, sin desplazarse ni ocultarse independientemente del número de productos agregados a la cuenta.
3. **Aplicación Automática de Precios de Mayoreo:**
   * Si el cliente adquiere 5 o más piezas de un producto con tarifa mayorista registrada, el renglón activará automáticamente el badge **`[MAYOREO]`**.
   * También es posible alternar manualmente la tarifa mayorista haciendo clic sobre el botón de mayoreo en el renglón correspondiente.
4. **Servicios de Copiado / Impresiones:**
   * Presione `[F4]`.
   * Introduzca la cantidad de copias blanco/negro ($1.00), copias a color ($5.00) o enmicados ($15.00).
   * Haga clic en *"Agregar al Carrito"*.
5. **Proceso de Cobro de Alta Velocidad:**
   * Presione `[F10]`. La ventana de cobro se abrirá y el cursor se posicionará de inmediato en el campo **"Monto Recibido del Cliente"** con el valor numérico preseleccionado.
   * El cajero puede teclear el importe recibido directamente desde el teclado numérico o hacer clic en cualquiera de los botones de denominación rápida ($50, $100, $200, $500, $1000 o Exacto).
   * El cálculo del cambio se actualiza en tiempo real en color verde esmeralda.
   * Al pulsar la tecla **`Enter`** o hacer clic en *"Confirmar y Emitir Ticket"*, la transacción se consolida en la base de datos relacional y se muestra el comprobante térmico con el logotipo oficial de Papelería A B C.

---

### 5. Historial de Tickets, Métricas KPI y Exportación a CSV

1. **Acceso al Centro de Análisis de Ventas:**
   * Presione **`[F8]`** o haga clic en el botón *"Historial Tickets [F8]"* en el panel superior de mostrador.
   * Se abrirá la consola ejecutiva de 1,040 px de ancho con panel de indicadores en vivo: Total Transacciones, Ventas Cobradas, Ticket Promedio y Distribución de Pagos (Efectivo vs. Tarjeta / Transferencia).
2. **Búsqueda Avanzada y Filtrado Multicriterio:**
   * Búsqueda instantánea por folio (ej. `TICK-`), cajero o nombre de producto vendido.
   * Filtro por método de pago: Todos, Efectivo, Tarjeta o Transferencia.
   * Filtro por periodo temporal: Todo el turno, Hoy, Últimos 7 días o Últimos 30 días.
3. **Reimpresión Térmica:**
   * Cada registro del historial incluye el botón *"Reimprimir"*, el cual reabre el comprobante formal con logotipo para su emisión física.
4. **Exportación Oficial de Ventas a CSV (Excel):**
   * Haga clic en el botón **"[Exportar Ventas del Día (CSV)]"**.
   * El sistema genera y descarga automáticamente el archivo `ventas_del_dia_YYYY-MM-DD.csv` con codificación UTF-8 y marca de orden de bytes (BOM `\uFEFF`), garantizando visualización limpia de acentos, caracteres especiales y columnas formateadas al abrir en Microsoft Excel.

---

### 6. Protocolo de Arqueo Rápido y Cierre de Jornada (Corte Z)

1. Al concluir el turno de atención, diríjase a la pestaña **"Control de Caja"**.
2. **Conciliación Rápida de Efectivo:**
   * Para máxima velocidad y eficiencia operativa, el sistema no requiere el desglose individual por denominaciones de billetes y monedas.
   * El cajero simplemente cuenta el efectivo total presente en la gaveta y teclea el valor en el campo **"Efectivo Físico en Gaveta"**.
   * **Función Cuadre Exacto en 1 Clic:** Si la gaveta coincide con la recaudación del mostrador, el cajero puede pulsar el botón **"[Cuadre Exacto (Copiar Monto del Sistema)]"**, llenando el campo de inmediato con el efectivo esperado.
3. **Diagnóstico Automático de Cuadratura:**
   * **Corte Cuadrado Exacto ($0.00):** La gaveta cuadra exactamente con las transacciones registradas.
   * **Sobrante en Caja (+$XX.XX):** Existe excedente de efectivo en la gaveta.
   * **Faltante en Caja (-$XX.XX):** Discrepancia negativa que requiere justificación del cajero.
4. **Confirmación y Emisión de Corte Z:**
   * Presione el botón **"Confirmar Cierre de Turno y Emitir Corte Z"**.
   * Se emitirá el comprobante oficial de auditoría con número de folio consecutivo, desglose de ventas por método de pago, saldo inicial, movimientos de caja y recuadros de firma para el cajero y el supervisor.
   * El estado del turno cambia a `CERRADO`. Para iniciar una nueva sesión comercial, presione *"Reabrir Nuevo Turno de Caja"*.

---

### 7. Respaldos y Auditoría de la Base de Datos

* **Respaldos Instantáneos JSON:** En la barra superior de la aplicación, haga clic en el botón **"[Respaldo Rápido]"** para descargar una copia completa e instantánea de la base de datos en formato `.json`.
* **Exportación SQL Oficial:** En la sección *Carga Masiva y Respaldos* de Almacén, dispone de botones para descargar el script completo `papeleria_pos.sql` y el archivo binario SQLite 3 `papeleria_pos.db`.
* **Inspección en SGBD Externos:** Puede abrir directamente el archivo `database/papeleria_pos.db` con programas gratuitos como **DBeaver**, **SQLiteStudio** o **DB Browser for SQLite** para auditar tablas, relaciones y consultas analíticas.
