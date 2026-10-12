<div align="center">
  <img src="LOGO.jpg" alt="Logotipo Oficial Papelería A B C" width="260"/>
  <h1>ENTREGA 03 — FASE 3: ARQUITECTURA Y PROTOTIPADO UI</h1>
  <h3>Sistema POS para "Papelería A B C" (Web App Local)</h3>
</div>

**Empresa / Negocio:** Papelería A B C  
**Identidad Visual:** Logotipo Oficial Integrado (`LOGO.jpg`)  
**Materia:** Ingeniería de Software  
**Equipo de Desarrollo:** Gerardo Cabrera Morales | Astrid García Ramírez | Daniel Parada Gonzalez  
**Fecha de Entrega Oficial:** Semana 3 (12 Oct - 15 Oct 2026, según Calendario)  
**Presupuesto Asignado a la Fase 3:** **$21,050.00 MXN** (Presupuesto Global del Proyecto: **$197,000.00 MXN**)

---

### 1. Resumen Ejecutivo de la Entrega

Esta carpeta contiene la totalidad de los entregables técnicos, de diseño y de código fuente correspondientes a la **Fase 3: Arquitectura y Prototipado UI** del **Calendario de Actividades**, materializando la **Estructura Base del Proyecto** para la empresa **Papelería A B C**:

- **Arquitectura de Software Autónoma en 4 Capas:** Patrón desacoplado (Presentación HTML5/CSS3, Lógica de Negocio ES6, Persistencia Local IndexedDB y Periféricos POS) con tiempo de respuesta inferior a 10 ms (RNF-01) y operación 100% offline (RNF-02).
- **Prototipo de Mostrador / Punto de Venta (POS):**
  - Búsqueda in-memory por código de barras EAN-13 / SKU con autocompletado en menos de 10 ms (RF-01).
  - Venta multitarea con **5 Carritos de compra simultáneos** independientes (RF-02) alternables con la tecla `[F2]`.
  - Módulo rápido de fotocopiado e impresiones que deduce hojas bond consumidas (RF-03).
  - Generación de comprobante térmico de 80mm con membrete y logotipo oficial de Papelería A B C (RF-04).
  - Navegación 100% por atajos de teclado ergonómicos (`[F1]`, `[F2]`, `[F4]`, `[F10]`, `[Esc]`) (RNF-05).
- **Prototipo de Almacén e Inventario:**
  - Tabla de existencias con filtros por categoría y semáforo de alerta de stock mínimo.
  - **Desglose inteligente de empaques a piezas sueltas (RF-05 / CU-02):** Modal interactivo que convierte cajas a piezas (ej. 1 caja de bolígrafos Bic $\to$ 12 piezas) actualizando el Kardex de manera atómica.
  - **Auditoría visual de Kardex (RF-07):** Registro histórico inmutable de ventas, compras, mermas, desgloses y consumos de insumos.
- **Prototipo de Control de Caja y Turnos (RF-08):**
  - Registro de fondo de apertura, ventas en efectivo vs tarjeta y calculadora de arqueo físico con detección de balance cuadrado, sobrante o faltante.
- **Respaldo en 1-Clic (RNF-06):**
  - Descarga instantánea de toda la base de datos `PapeleriaABC_POS_DB` en formato JSON sin conexión a Internet.
- **Entorno Compartido y Ejecución Directa:**
  - Código fuente listo para abrir directamente en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Firefox) con **cero instalación de servidores**.
- **Presupuesto Financiero Auditado:**
  - Imputación formal de **$21,050.00 MXN** (75 hrs de ingeniería de los 3 desarrolladores a $18,250.00 MXN, servicios de sincronización cloud $800.00 MXN e indirectos $2,000.00 MXN).

---

### 2. Matriz de Cumplimiento de la Fase 3 (Calendario vs. Entregables)

| Punto Marcado en el Calendario | Estado | Archivos Correspondientes |
|---|:---:|---|
| **Definición de arquitectura de la aplicación** | **100% CUMPLIDO** | [diagrama_arquitectura.svg](file:///C:/Users/gerac/Desktop/ISA/03/diagrama_arquitectura.svg)<br>[diagrama_arquitectura.png](file:///C:/Users/gerac/Desktop/ISA/03/diagrama_arquitectura.png)<br>[DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.pdf](file:///C:/Users/gerac/Desktop/ISA/03/DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.pdf) |
| **Diseño de interfaces y prototipos para mostrador y almacén** | **100% CUMPLIDO** | [wireframe_prototipos_ui.svg](file:///C:/Users/gerac/Desktop/ISA/03/wireframe_prototipos_ui.svg)<br>[wireframe_prototipos_ui.png](file:///C:/Users/gerac/Desktop/ISA/03/wireframe_prototipos_ui.png)<br>[index.html](file:///C:/Users/gerac/Desktop/ISA/03/index.html)<br>[styles.css](file:///C:/Users/gerac/Desktop/ISA/03/css/styles.css) |
| **Configuración del entorno de desarrollo compartido** | **100% CUMPLIDO** | [DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.md](file:///C:/Users/gerac/Desktop/ISA/03/DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.md)<br>[README.md](file:///C:/Users/gerac/Desktop/ISA/03/README.md) |
| **ENTREGABLE · Estructura base del proyecto** | **100% CUMPLIDO** | [03/](file:///C:/Users/gerac/Desktop/ISA/03) (Código funcional HTML5 + CSS3 + ES6 + IndexedDB) |
| **Identidad Visual Corporativa (LOGO.jpg)** | **100% CUMPLIDO** | [LOGO.jpg](file:///C:/Users/gerac/Desktop/ISA/03/LOGO.jpg) (Incrustado en header, tickets, DER y diagramas) |
| **Costes y Presupuesto Económico ($21,050 MXN / $197,000 MXN)** | **100% CUMPLIDO** | [PRESUPUESTO_Y_ANALISIS_ECONOMICO_GLOBAL.md](file:///C:/Users/gerac/Desktop/ISA/PRESUPUESTO_Y_ANALISIS_ECONOMICO_GLOBAL.md)<br>[DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.pdf](file:///C:/Users/gerac/Desktop/ISA/03/DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.pdf#page=5) |

---

### 3. Índice Detallado de Archivos en la Carpeta `03`

```text
ISA/
└── 03/
    ├── index.html                                        # Aplicación Web Local SPA ejecutable (Mostrador, Almacén, Caja)
    ├── LOGO.jpg                                          # Logotipo institucional oficial de Papelería A B C
    ├── assets/
    │   └── img/
    │       └── LOGO.jpg                                  # Logotipo para rutas relativas del frontend y tickets
    ├── css/
    │   └── styles.css                                    # Hoja de estilos (paleta oficial, diseño responsivo, impresión 80mm)
    ├── js/
    │   ├── db.js                                         # Capa IndexedDB (PapeleriaABC_POS_DB), transacciones ACID y catálogo semilla
    │   ├── pos.js                                        # Controlador de Mostrador: 5 carritos, lector de barras, atajos y ticket
    │   ├── inventory.js                                  # Controlador de Almacén: alertas de stock, desglose de cajas y Kardex
    │   ├── cash.js                                       # Controlador de Caja: turnos, fondo inicial y balance de arqueo
    │   └── app.js                                        # Orquestador SPA: pestañas, reloj en vivo y respaldo JSON 1-clic
    ├── diagrama_arquitectura.png                         # ENTREGABLE: Diagrama de Arquitectura de 4 Capas (3200x2000 px)
    ├── diagrama_arquitectura.svg                         # Diagrama de Arquitectura vectorial con logotipo
    ├── wireframe_prototipos_ui.png                       # ENTREGABLE: Wireframes de Mostrador y Almacén (3200x2000 px)
    ├── wireframe_prototipos_ui.svg                       # Wireframes de UI vectorial con logotipo
    ├── DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.pdf # Documento formal de entrega académica y técnica (5 páginas)
    ├── DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.md  # Especificación técnica completa en formato Markdown
    └── README.md                                         # Índice y guía de la entrega 03 (este archivo)
```

---

### 4. Guía Rápida de Uso y Pruebas en el Navegador

1. **Abrir la Aplicación:**
   - Haz doble clic sobre [index.html](file:///C:/Users/gerac/Desktop/ISA/03/index.html) en tu navegador web (Google Chrome, Microsoft Edge o Firefox).
   - El sistema inicializará automáticamente la base de datos `PapeleriaABC_POS_DB` y sembrará el catálogo inicial en IndexedDB.
2. **Probar el Escaneo y Búsqueda (<10ms):**
   - En la barra de búsqueda, teclea `7501000100135` (código del bolígrafo Bic) y presiona `Enter`, o escribe `cuaderno`. Se agregará automáticamente al Carrito 1.
3. **Probar los 5 Carritos Simultáneos (RF-02):**
   - Presiona `[F2]` o haz clic en las pestañas `Carrito 2`, `Carrito 3`, etc. Agrega artículos en cada uno de ellos y observa cómo cada carrito mantiene su cuenta e importe independiente.
4. **Probar el Cobro de Copias con Deducción de Insumos (RF-03):**
   - Presiona `[F4]` para abrir el modal de servicios de copiado. Ingresa `5` copias B/N y presiona "+ Agregar al Carrito".
5. **Cobrar y Emitir Ticket Térmico con Membrete (RF-04):**
   - Presiona `[F10]` para abrir el modal de cobro. Ingresa el efectivo recibido y confirma la venta. Se desplegará el ticket térmico con el logotipo `LOGO.jpg`, folio y lemas de Papelería A B C.
6. **Probar el Desglose de Caja a Pieza (RF-05):**
   - Ve a la pestaña **Almacén e Inventario**.
   - En el producto *Caja Bolígrafo Bic Cristal Azul (12 pzas)*, haz clic en **📦 Desglosar Caja**.
   - Confirma el desglose de 1 caja. Observa cómo el stock de cajas disminuye en 1 y el de piezas sueltas aumenta en +12.
7. **Consultar la Auditoría de Kardex (RF-07):**
   - En Almacén, haz clic en **📜 Auditoría Kardex** para visualizar el historial cronológico de todas las ventas y desgloses realizados.
8. **Descargar Respaldo 1-Clic (RNF-06):**
   - Presiona el botón verde **💾 Respaldo 1-Clic** en el encabezado superior para descargar el archivo JSON con toda la base de datos.

---

### 5. Atajos de Teclado del Mostrador (RNF-05)

| Tecla de Atajo | Acción en el Sistema |
|:---:|---|
| **`F1`** | Dar foco inmediato al buscador / escáner de código de barras |
| **`F2`** | Alternar secuencialmente entre los **5 Carritos simultáneos** |
| **`F4`** | Abrir modal de cobro rápido de copias e impresiones |
| **`F10`** | Abrir modal de cobro y finalización de ticket |
| **`Esc`** | Cerrar cualquier modal activo o vaciar carrito |

---

### 6. Enlaces Directos a los Entregables

- **Aplicación Web Local Ejecutable:** [index.html](file:///C:/Users/gerac/Desktop/ISA/03/index.html)
- **Documento Técnico Formal (PDF de 5 Páginas con Portada y Logo):**  
  [DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.pdf](file:///C:/Users/gerac/Desktop/ISA/03/DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.pdf)
- **Especificación Completa en Markdown:**  
  [DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.md](file:///C:/Users/gerac/Desktop/ISA/03/DOCUMENTO_FASE_3_ARQUITECTURA_Y_PROTOTIPADO_UI.md)
- **Diagrama de Arquitectura de 4 Capas:**  
  [diagrama_arquitectura.png](file:///C:/Users/gerac/Desktop/ISA/03/diagrama_arquitectura.png) | [diagrama_arquitectura.svg](file:///C:/Users/gerac/Desktop/ISA/03/diagrama_arquitectura.svg)
- **Wireframes y Prototipos de Mostrador y Almacén:**  
  [wireframe_prototipos_ui.png](file:///C:/Users/gerac/Desktop/ISA/03/wireframe_prototipos_ui.png) | [wireframe_prototipos_ui.svg](file:///C:/Users/gerac/Desktop/ISA/03/wireframe_prototipos_ui.svg)
