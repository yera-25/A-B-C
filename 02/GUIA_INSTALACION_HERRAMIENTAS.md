# GUÍA DE INSTALACIÓN Y CONFIGURACIÓN DE HERRAMIENTAS
## Fase 2: Análisis y Modelado de Datos — Sistema POS para "Papelería A B C"
**Empresa:** Papelería A B C  
**Equipo de Desarrollo:** Gerardo Cabrera Morales | Astrid García Ramírez | Daniel Parada Gonzalez  
**Proyecto:** Sistema de Administración y Venta de Papelería A B C (Web App Local)

---

### 1. Justificación y Diagnóstico Técnico

Para el desarrollo del **Sistema POS de Papelería A B C**, el modelo de datos requiere dos entornos complementarios:
1. **Entorno de Diseño, Simulación y Validación Relacional:** Permite ejecutar scripts DDL ANSI SQL (`schema.sql`), verificar la integridad referencial de las claves primarias y foráneas, inspeccionar índices B-Tree para cumplir con el tiempo de respuesta ultrarrápido (<10ms) y visualizar el Diagrama Entidad-Relación (DER) de manera gráfica e interactiva.
2. **Entorno de Persistencia Local Offline (IndexedDB):** La arquitectura aprobada en la Fase 1 establece que la aplicación se ejecuta localmente en el navegador (`index.html`) persistiendo la información en **IndexedDB** bajo la base de datos `PapeleriaABC_POS_DB`. Por tanto, se requiere conocer cómo inspeccionar y auditar las tablas de almacenamiento (*Object Stores*) directamente en el equipo del mostrador de **Papelería A B C**.

A continuación, se presenta la herramienta más recomendable del mercado y su guía de instalación paso a paso, junto con alternativas ligeras y extensiones útiles para el entorno de desarrollo.

---

### 2. Herramienta Más Recomendable: DBeaver Community Edition

**DBeaver Community** es la herramienta universal de administración y modelado de bases de datos más recomendada para ingeniería de software. Es **100% gratuita, de código abierto**, multiplataforma (Windows, Linux, macOS) y ofrece las siguientes ventajas clave para este proyecto:
- **Generador Automático de DER:** Genera y permite exportar diagramas Entidad-Relación visuales a partir de cualquier archivo de base de datos o script DDL.
- **Soporte Nativo de SQLite sin Servidores:** Permite abrir directamente el archivo `02/papeleria_pos.db` sin necesidad de instalar servicios pesados en segundo plano como MySQL Server o PostgreSQL.
- **Editor SQL Inteligente:** Autocompletado, formateador de código, resaltado de sintaxis y visor tabular de resultados con edición en vivo.
- **Auditoría de Rendimiento:** Muestra planes de ejecución de consultas (`EXPLAIN QUERY PLAN`) para validar que las búsquedas por código de barras y SKU en **Papelería A B C** utilicen índices B-Tree de latencia mínima (<10ms).

---

#### 2.1 Guía de Instalación Paso a Paso de DBeaver en Windows

##### Opción A: Instalación Automática mediante Consola (Recomendada - 1 solo comando)
Windows 10 y 11 cuentan con el gestor de paquetes oficial `winget`. Para instalar DBeaver automáticamente:
1. Presiona `Windows + X` y selecciona **Terminal (PowerShell)**.
2. Escribe o pega el siguiente comando y presiona `Enter`:
   ```powershell
   winget install dbeaver.dbeaver
   ```
3. Acepta los términos de licencia cuando el instalador lo solicite. El sistema descargará e instalará DBeaver automáticamente.

##### Opción B: Instalación Manual mediante Asistente Gráfico
1. Abre tu navegador web e ingresa al portal oficial de descargas:
   [https://dbeaver.io/download/](https://dbeaver.io/download/)
2. En la sección **Windows**, haz clic en **Windows Installer (installer .exe)**.
3. Ejecuta el instalador descargado (ej. `dbeaver-ce-x.x.x-x86_64-setup.exe`).
4. Selecciona el idioma (Español o English) y presiona **Siguiente**.
5. En los componentes a instalar, deja marcadas las casillas predeterminadas e incluye la opción de integración en el menú contextual.
6. Haz clic en **Instalar** y, al finalizar, marca **Ejecutar DBeaver Community**.

---

#### 2.2 Guía de Uso Rápido: Conectar y Visualizar la Base de Datos de Papelería A B C

Una vez abierto DBeaver:
1. Haz clic en el ícono de **Nueva Conexión** (el enchufe con símbolo `+` en la esquina superior izquierda).
2. En la lista de motores, selecciona **SQLite** y haz clic en **Siguiente**.
3. En el campo **Path (Ruta)**, haz clic en **Navegar / Browse** y selecciona el archivo de la base de datos de esta entrega:
   `C:\Users\gerac\Desktop\ISA\02\papeleria_pos.db`
   *(Si el asistente te pide descargar los controladores JDBC de SQLite por primera vez, haz clic en **Descargar / Download**; toma menos de 5 segundos).*
4. Haz clic en **Finalizar**.
5. En el panel izquierdo de navegación de bases de datos:
   - Despliega `papeleria_pos.db` -> `Tables`.
   - Haz doble clic en la carpeta **Tables** y ve a la pestaña superior **Diagrama ER**: verás el modelo relacional completo de **Papelería A B C** con todas sus relaciones, llaves y cardinalidades.
   - Para ejecutar consultas: Presiona `Ctrl + ]` para abrir un editor SQL, pega el contenido de `02/schema.sql` o escribe consultas de prueba como:
     ```sql
     SELECT * FROM configuracion_negocio;
     SELECT * FROM vw_alertas_stock_minimo;
     SELECT * FROM vw_kardex_auditoria;
     ```

---

### 3. Alternativa Ultraligera sin Instalación: SQLiteStudio

Si prefieres una herramienta que no requiera instalación de servicios ni permisos de administrador:
- **Herramienta:** **SQLiteStudio**
- **Peso:** ~30 MB (ejecutable directo `.exe`)
- **Página de descarga:** [https://sqlitestudio.pl/](https://sqlitestudio.pl/)
- **Instalación:**
  1. Descarga el paquete `SQLiteStudio Portable (zip)`.
  2. Descomprime la carpeta en tu equipo.
  3. Ejecuta `SQLiteStudio.exe`.
  4. Menú *Base de datos* -> *Añadir una base de datos* -> Selecciona el archivo `papeleria_pos.db` -> *Conectar*.

---

### 4. Extensiones Recomendadas para Visual Studio Code

Si utilizas **Visual Studio Code** como entorno principal de programación, te recomendamos instalar las siguientes extensiones gratuitas para enriquecer tu flujo de trabajo:

| Extensión | ID de Mercado | Utilidad en el Proyecto |
|---|---|---|
| **Draw.io Integration** | `hediet.vscode-drawio` | Permite abrir, ver y editar diagramas vectoriales `.svg` y `.drawio` directamente dentro de VS Code con arrastrar y soltar. |
| **SQLite Viewer** | `qwtel.sqlite-viewer` | Permite hacer clic sobre `papeleria_pos.db` y explorar los datos en formato de tabla interactiva sin salir del editor. |
| **Live Server** | `ritwickdey.liveserver` | Levanta un servidor web local con recarga en caliente para probar la Web App (`index.html`) sin problemas de CORS al importar módulos JavaScript ES6. |
| **Mermaid Preview** | `bierner.markdown-mermaid` | Permite visualizar los diagramas de secuencia y entidad-relación escritos en lenguaje Mermaid dentro de los archivos Markdown. |

Para instalarlas, presiona `Ctrl + Shift + X` en VS Code, escribe el nombre de la extensión y presiona **Install**.

---

### 5. Herramienta Nativa para IndexedDB (Cero Instalación)

Dado que el sistema operará como una **Web App Local** en el navegador del cliente con persistencia en **IndexedDB**, no es necesario instalar software adicional para monitorear los datos en el navegador:

1. Abre tu navegador preferido (**Google Chrome** o **Microsoft Edge**).
2. Presiona la tecla `F12` (o haz clic derecho en la página -> *Inspeccionar*).
3. Dirígete a la pestaña superior **Application** (en español: **Aplicación** o **Almacenamiento**).
4. En el menú lateral izquierdo, despliega la sección **Storage** -> **IndexedDB**.
5. Al abrir la aplicación web, encontrarás `PapeleriaABC_POS_DB` con todas las 18 tablas (*Object Stores*): `configuracion_negocio`, `productos`, `ventas`, `turnos_caja`, `kardex_movimientos`, etc.
6. Podrás ver los registros en tiempo real, filtrar por índices (`codigo_barras`, `sku`, `fecha_hora`), modificar campos manualmente o vaciar almacenes para pruebas de estrés.

---

### 6. Resumen de Recomendaciones

| Necesidad | Herramienta Recomendada | Comando / Enlace |
|---|---|---|
| **Modelado, SQL y DER interactivo** | **DBeaver Community** | `winget install dbeaver.dbeaver` |
| **Visor rápido de SQLite sin instalar** | **SQLiteStudio Portable** | [sqlitestudio.pl](https://sqlitestudio.pl/) |
| **Edición gráfica de diagramas SVG** | **VS Code + Draw.io** | Extensión `hediet.vscode-drawio` |
| **Exploración de datos en tiempo real** | **Chrome / Edge DevTools** | Tecla `F12` -> Pestaña *Application* (`PapeleriaABC_POS_DB`) |
