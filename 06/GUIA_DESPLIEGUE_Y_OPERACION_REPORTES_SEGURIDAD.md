# GUÍA TÉCNICA DE DESPLIEGUE, SEGURIDAD (RBAC) Y OPERACIÓN DE REPORTES
## PAPELERÍA A B C — FASE 6: SPRINT 3 (REPORTES Y SEGURIDAD)

---

### 1. Requisitos del Sistema y Puesta en Marcha

El sistema para **Papelería A B C** opera bajo la arquitectura **Web Application Offline-First** con motor relacional síncrono en memoria y persistencia automática en LocalStorage. No requiere servidores externos (Node, Apache, PHP ni IIS) ni bases de datos cliente-servidor pesadas.

* **Sistema Operativo:** Windows 10, Windows 11 o cualquier distribución moderna.
* **Navegador Recomendado:** Google Chrome, Microsoft Edge, Brave o Mozilla Firefox (con soporte para ES6+, Web Crypto API y LocalStorage).
* **Arranque Inmediato:** Dar doble clic en el archivo `index.html` dentro de la carpeta `ENTREGA/` o `06/`.
* **Latencia de Carga:** Menor a 5 milisegundos gracias al motor relacional local `PAPELERIA_ABC_SQL_STORE_V6`.

---

### 2. Portal de Acceso Obligatorio y los 3 Perfiles del Sistema (RBAC)

Al abrir `index.html` en el navegador, la interfaz se bloquea automáticamente y se despliega el portal mandatorio de inicio de sesión. No es posible acceder sin identificarse mediante uno de los tres perfiles oficiales:

| Perfil Oficial | Usuario (*Login*) | Contraseña | Responsable | Funciones Asignadas y Delimitación Reglamentaria |
| :--- | :---: | :---: | :--- | :--- |
| **ADMINISTRADOR** | `admin` | `admin123` | Gerardo Cabrera Morales | **Destinado a la administración de perfiles y contraseñas.** Al ingresar, abre automáticamente la consola de usuarios. Gestiona cuentas, asigna roles, activa/suspende usuarios y restablece contraseñas con cifrado SHA-256 + salt de 16 bytes. Acceso maestro institucional. |
| **SUPERVISOR** | `supervisor` | `super123` | Astrid García Ramírez | **Altas en catálogo y realización de cortes de caja.** Facultado para dar de alta productos, marcas y categorías en inventario, y **ejecutar cortes de caja Z** (cierre de turno). Acceso a Mostrador POS y Reportes Analíticos. *Restricción:* No tiene acceso a la gestión de perfiles ni contraseñas. |
| **USUARIO (CAJERO)** | `usuario` | `usuario123` | Daniel Parada Gonzalez | **Operación en Mostrador Punto de Venta (POS).** Cobro ágil de tickets, escaneo de códigos de barra y consulta básica de existencias y precios al menudeo (*Modo Solo Consulta*). *Restricciones estrictas:* **No puede dar de alta productos, no puede dar de alta categorías ni marcas, y no puede hacer cortes de caja (solo el supervisor).** Pestañas de Reportes y Configuración ocultas. *(Admite también `cajero` / `caja123`).* |

---

### 3. Operación Paso a Paso de la Seguridad y Autenticación

#### 3.1 Ingreso Rápido para Evaluación Docente
1. En el diálogo modal de login, observe las tres tarjetas de demostración rápida:
   * Haga clic en **`[Ingresar como Administrador]`** para evaluar la administración de perfiles y contraseñas.
   * Haga clic en **`[Ingresar como Supervisor]`** para evaluar altas en catálogo y emisión de corte de caja Z.
   * Haga clic en **`[Ingresar como Usuario / Cajero]`** para evaluar la terminal POS y verificar las restricciones.
2. Si prefiere ingresar manualmente, teclee el usuario y contraseña en los campos inferiores y pulse *"Iniciar Sesión Segura"*.

#### 3.2 Cambio de Perfil y Cierre de Sesión
* **Cambiar Perfil:** Haga clic en el botón *"Cambiar Perfil"* en el encabezado superior derecho para alternar entre roles sin perder el estado de la aplicación.
* **Cerrar Sesión:** Haga clic en el botón *"Cerrar Sesión"* (rojo) en el encabezado. La sesión en memoria se destruye y la interfaz vuelve a bloquearse inmediatamente requiriendo un nuevo inicio de sesión.

---

### 4. Operación del Centro de Reportes y Analítica Financiera

1. Inicie sesión como **Administrador** o **Supervisor** y seleccione la pestaña **"Reportes y Analítica"**.
2. **Filtros Temporales Rápidos:**
   * Presione **Hoy**, **Ayer**, **Últimos 7 Días**, **Mes Actual** o **Todo el Historial** para recalcular las métricas instantáneamente.
   * O seleccione fechas específicas en los campos **Desde** y **Hasta**.
3. **Filtros por Categoría y Método de Cobro:**
   * Seleccione una categoría en el desplegable para enfocar el análisis en una familia específica (ej. *Cuadernos y Libretas*).
   * Filtre por canal de cobro (*Efectivo*, *Tarjeta*, *SPEI*).
4. **Lectura de KPIs Financieros:**
   * **Ventas Netas:** Facturación total tras descuentos comerciales.
   * **Utilidad Bruta:** Margen financiero real ($Venta - Costo\ Adquisición$).
   * **Margen %:** Rentabilidad porcentual obtenida en el periodo.
   * **Ticket Promedio:** Importe promedio por transacción.
5. **Paneles Especializados:**
   * **Balance Diario:** Desglose transaccional por jornada con mezcla de métodos y gráfica de tendencia.
   * **Top 15 Productos Más Vendidos:** Ranking de artículos con piezas vendidas, facturación, costo acumulado y barras de contribución relativa.
   * **Ventas por Categoría:** Participación porcentual de cada familia de papelería.
   * **Transacciones Detalladas:** Bitácora individual de tickets con acceso a reimpresión térmica.

---

### 5. Exportación de Resúmenes a CSV para Microsoft Excel

Cada panel cuenta con su botón de exportación dedicado en la barra superior:
* **`[Exportar Balance (.CSV)]`:** Genera `reporte_balance_diario_YYYY-MM-DD.csv`.
* **`[Exportar Top Productos (.CSV)]`:** Genera `reporte_top_productos_YYYY-MM-DD.csv`.
* **`[Exportar Por Categoría (.CSV)]`:** Genera `reporte_ventas_categoria_YYYY-MM-DD.csv`.
* **`[Exportar Detalle (.CSV)]`:** Genera `reporte_transacciones_detalladas_YYYY-MM-DD.csv`.

> [!NOTE]
> **Compatibilidad con Microsoft Excel:** Todos los archivos CSV se exportan con la marca de orden de bytes UTF-8 BOM (`\uFEFF`), asegurando que al abrir los archivos directamente en Microsoft Excel, los acentos, caracteres en español (`ñ`, `á`, `é`, `í`, `ó`, `ú`) y columnas numéricas se presenten de forma ordenada sin requerir pasos manuales de importación.
