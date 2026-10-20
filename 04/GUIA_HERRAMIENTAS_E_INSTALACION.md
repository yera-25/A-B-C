# GUÍA DE HERRAMIENTAS RECOMENDADAS E INSTALACIÓN
## SISTEMA INTEGRAL DE ADMINISTRACIÓN Y VENTA (POS) — PAPELERÍA A B C
### FASE 4: SPRINT 1 — MÓDULO DE INVENTARIO

---

El sistema desarrollado para **Papelería A B C** ha sido diseñado bajo una arquitectura **Local Offline-First**, lo que significa que **no requiere forzosamente la instalación de servidores pesados ni bases de datos de pago** (como SQL Server, Oracle o hosting web externo). Puede ejecutarse directamente abriendo el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Brave).

Sin embargo, para garantizar una experiencia óptima de desarrollo, pruebas continuas, auditoría de datos y simulación de un entorno comercial de punto de venta, se recomiendan las siguientes herramientas complementarias:

---

## 1. HERRAMIENTA PRINCIPAL RECOMENDADA: LIVE SERVER (VISUAL STUDIO CODE)

### ¿Por qué se recomienda?
Aunque el sistema funciona abriendo directamente el archivo con doble clic (`file:///.../index.html`), el uso de **Live Server** ofrece ventajas operativas determinantes:
1. **Protocolo HTTP Local Seguro (`http://127.0.0.1:5500`):** Cumple con las políticas modernas de seguridad de los navegadores (*CORS* y aislamiento de orígenes para IndexedDB), garantizando persistencia óptima y lectura fluida de archivos CSV e imágenes.
2. **Recarga en Caliente Automática (*Live Reload*):** Cada vez que se guarde un cambio en `inventory.js`, `styles.css` o `index.html`, la pantalla del navegador se actualiza inmediatamente sin necesidad de presionar `F5`.
3. **Cero Consumo de Recursos:** No instala servicios en segundo plano ni ralentiza la computadora de mostrador de la papelería.

---

### Guía de Instalación Paso a Paso de Live Server

#### Opción A: Desde la Interfaz Gráfica de Visual Studio Code (Recomendada)
1. **Abrir Visual Studio Code.**
2. En la barra lateral izquierda, hacer clic en el ícono de **Extensiones** (o presionar la combinación de teclas `Ctrl + Shift + X`).
3. En la barra de búsqueda superior, escribir:
   ```text
   Live Server
   ```
4. Localizar la extensión desarrollada por el autor **Ritwick Dey** (con millones de descargas y calificación de 5 estrellas).
5. Hacer clic en el botón azul **"Install"** (Instalar). La instalación toma menos de 10 segundos.

#### Opción B: Vía Consola de Comandos (PowerShell / Terminal)
Si se prefiere instalar mediante línea de comandos en Windows, abrir PowerShell y ejecutar:
```powershell
code --install-extension ritwickdey.LiveServer
```

---

### ¿Cómo Usar Live Server con el Módulo de Inventario?
1. En Visual Studio Code, seleccionar **Archivo > Abrir Carpeta...** y elegir la carpeta de la entrega:
   ```text
   C:\Users\gerac\Desktop\ISA\04
   ```
2. En el explorador de archivos izquierdo, hacer **clic derecho** sobre el archivo `index.html`.
3. En el menú contextual, seleccionar **"Open with Live Server"** (o presionar el atajo `Alt + L, Alt + O`).
4. Se abrirá automáticamente el navegador predeterminado en la dirección:
   ```text
   http://127.0.0.1:5500/index.html
   ```
5. Para detener el servidor cuando no se esté utilizando, simplemente hacer clic en el botón **"Port: 5500"** ubicado en la esquina inferior derecha de la barra de estado azul de VS Code.

---

## 2. HERRAMIENTA DE AUDITORÍA DE DATOS: DBEAVER COMMUNITY EDITION (OPCIONAL)

### ¿Por qué se recomienda?
Si en fases avanzadas del proyecto de **Papelería A B C** se exportan respaldos relacionales a SQLite o se sincroniza con una base de datos central en red local, **DBeaver Community** es la herramienta líder, gratuita y de código abierto para auditar tablas, ejecutar consultas SQL y generar reportes financieros tabulares.

---

### Guía de Instalación de DBeaver en Windows

#### Opción A: Mediante el Administrador de Paquetes de Windows (winget) — *1 solo comando*
1. Abrir **PowerShell** como Administrador (`Windows + X` > *Terminal* o *PowerShell*).
2. Ejecutar el siguiente comando:
   ```powershell
   winget install dbeaver.dbeaver
   ```
3. Presionar `Y` para aceptar los términos de la licencia. El sistema descargará e instalará DBeaver automáticamente.

#### Opción B: Descarga Manual desde el Sitio Oficial
1. Ingresar en el navegador a: [https://dbeaver.io/download/](https://dbeaver.io/download/)
2. Hacer clic en el instalador **"Windows Installer (x86_64)"**.
3. Ejecutar el archivo `.exe` descargado (`dbeaver-ce-x.x.x-x86_64-setup.exe`).
4. Seguir el asistente de instalación estándar: *Siguiente > Acepto la licencia > Instalar para todos los usuarios > Finalizar*.

---

## 3. AUDITORÍA NATIVA DE BASE DE DATOS SIN DESCARGAS: DEVTOOLS DEL NAVEGADOR

Para auditar y monitorear la base de datos **IndexedDB** (`PapeleriaABC_POS_DB`) **no se necesita descargar ningún software adicional**, ya que Google Chrome y Microsoft Edge incluyen un potente visor de base de datos integrado:

### ¿Cómo inspeccionar la base de datos en tiempo real?
1. Abrir `index.html` en Google Chrome o Microsoft Edge.
2. Presionar la tecla **`F12`** (o hacer clic derecho en cualquier parte de la página y seleccionar **Inspeccionar**).
3. En el menú superior de pestañas de las herramientas de desarrollador, seleccionar **Application** (en español: **Almacenamiento** o **Aplicación**).
4. En el árbol de navegación lateral izquierdo, desplegar la sección **Storage** > **IndexedDB**.
5. Desplegar **`PapeleriaABC_POS_DB - 2`**. Aparecerán los 10 Object Stores activos:
   - `productos`: Catálogo, precios y existencias.
   - `kardex_movimientos`: Libro mayor inmutable de movimientos.
   - `entradas_mercancia`: Registro de compras y facturas de proveedores.
   - `mermas`: Bitácora legal de material dañado o caducado.
   - `marcas`: 12 marcas homologadas de papelería.
   - `categorias`: 8 categorías y familias de productos.
   - `unidades_medida`: Piezas, cajas, paquetes, cientos.
   - `proveedores`: Directorio comercial de mayoristas.
   - `configuracion_negocio`: Datos fiscales y comerciales de Papelería A B C.
   - `conversiones_empaque`: Equivalencias de empaque a piezas.
6. Al hacer clic sobre cualquier store, se despliega una cuadrícula interactiva con los registros guardados en vivo, permitiendo verificar la inmediatez de las transacciones (tiempo de respuesta `< 10 ms`).

---

## 4. INTEGRACIÓN DE PERIFÉRICOS DE PAPELERÍA (PLUG & PLAY)

El sistema está optimizado para funcionar directamente con el hardware físico de punto de venta sin instalar controladores propietarios:
- **Lector de Códigos de Barras USB / Inalámbrico:** Funciona bajo emulación de teclado (*Keyboard Wedge HID*). Al disparar el láser sobre el código de barras de un cuaderno o bolígrafo, el código se escribe automáticamente en el campo de búsqueda (`catalog-search-input`) o en el formulario de entrada, enviando la tecla Enter automáticamente.
- **Impresora Térmica de Comprobantes (58mm / 80mm):** Compatible con cualquier mini-impresora USB con controlador genérico *Generic / Text Only* o POS-58 de Windows para la emisión de vales de merma o comprobantes de entrada de almacén.
