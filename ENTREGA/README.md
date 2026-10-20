# PAPELERÍA A B C — SISTEMA INTEGRAL DE ADMINISTRACIÓN Y PUNTO DE VENTA (POS)
## ENTREGABLE FINAL FUNCIONAL Y PROGRESIVO (`ENTREGA/`)
### Consolidado Acumulado: Fases 1 a 4 (Semana 4: 19 al 22 de Octubre de 2026)

---

![Logotipo Papelería A B C](LOGO.jpg)

Bienvenido a la carpeta **`ENTREGA/`**. Este directorio representa el **núcleo consolidado y acumulativo** del proyecto de software para **Papelería A B C**. 

A diferencia de las carpetas semanales individuales (`01/`, `02/`, `03/`, `04/`), las cuales contienen la documentación formal, memorias técnicas, diagramas de ingeniería y actas destinadas a los clientes finales y auditores, la carpeta **`ENTREGA/`** aloja el **código fuente funcional unificado** que evoluciona progresivamente con cada entrega semanal, priorizando la operatividad real, la fluidez de mostrador y la integridad contable.

---

## 1. CONCILIACIÓN DE INTERFAZ Y ARQUITECTURA UNIFICADA

En esta entrega se resolvieron las discrepancias identificadas entre la propuesta de diseño y prototipado visual de la **Fase 3** y la especialización transaccional del módulo de inventario de la **Fase 4**:

1. **Estructura Maestra de Navegación Global (Prototipada en Fase 3):**
   Se preservó el shell institucional superior que da acceso directo a las cuatro grandes áreas del negocio:
   * **`🛒 Mostrador POS`:** Punto de venta de alta velocidad con 5 carritos de compra concurrentes.
   * **`📦 Almacén e Inventario`:** Centro de control de existencias, compras, mermas y auditoría.
   * **`💵 Control de Caja`:** Gestión de turnos, fondo inicial y arqueo de cierre de jornada.
   * **`⚙️ Configuración`:** Parámetros fiscales, comerciales y administración local de base de datos.
2. **Integración Completa del Módulo de Inventario (Programado en Fase 4):**
   Dentro de la pestaña **`📦 Almacén e Inventario`**, se integró el motor transaccional completo desarrollado en la Fase 4 mediante un sistema de sub-pestañas reactivas:
   * **Catálogo y Existencias:** Monitoreo con semáforo de stock crítico, búsqueda instantánea, alta/edición con generador EAN-13 y alertas de reorden.
   * **Marcas y Categorías:** Maestros homologados de 12 marcas papeleras y 8 categorías comerciales.
   * **Entradas / Reabastecimiento:** Captura de compras a mayoristas con cálculo de inversión y actualización inmediata de existencias.
   * **Control de Mermas:** Desincorporación justificada de producto dañado con **bloqueo estricto si la baja excede el stock actual**.
   * **Kardex Auditable:** Libro mayor inmutable que registra cada entrada, merma y venta con marca temporal ISO 8601.
   * **Carga Masiva y Respaldos:** Exportación/importación en CSV (compatible con Microsoft Excel con BOM UTF-8) y volcado total snapshot en JSON en 1-clic.
3. **Conexión Transaccional Bidireccional (POS ⟷ Inventario ⟷ Kardex):**
   En este entregable unificado, **cada venta cobrada en el Mostrador POS afecta inmediatamente la base de datos real `PapeleriaABC_POS_DB`**:
   * Descuenta las existencias físicas de los productos vendidos.
   * Registra automáticamente un asiento inmutable en el store `kardex_movimientos` con el tipo `VENTA_MOSTRADOR`.
   * Suma el ingreso en efectivo o tarjeta al turno de caja activo para el arqueo de corte.

---

## 2. ESTRUCTURA DE ARCHIVOS EN `ENTREGA/`

```
C:\Users\gerac\Desktop\ISA\ENTREGA\
│
├── LOGO.jpg                        # Logotipo oficial de Papelería A B C
├── index.html                      # Interfaz unificada del sistema (SPA Reactiva)
├── README.md                       # Este documento técnico del entregable consolidado
├── papeleria_pos.db                # Base de datos relacional SQLite 3 (160 productos, 3FN)
│
├── database/
│   ├── papeleria_pos.db            # Base de datos SQLite 3 ejecutable en DBeaver / SQLiteStudio
│   └── papeleria_pos.sql           # Script SQL completo DDL (CREATE TABLE) y DML (INSERT 160 productos)
│
├── assets/
│   ├── data/
│   │   └── catalog_160.json        # Catálogo maestro de 160 productos en formato JSON
│   └── img/
│       └── LOGO.jpg                # Copia de respaldo para impresión de tickets térmicos
│
├── css/
│   └── styles.css                  # Hoja de estilos unificada (Paleta Navy #152c4a y Esmeralda #3a8e63)
│
└── js/
    ├── app.js                      # Orquestador global, reloj en vivo y sincronización de vistas
    ├── db.js                       # Motor Relacional SQL Local & Persistencia Híbrida (160 Productos inmediatos)
    ├── pos.js                      # Lógica de 5 carritos, lector de barras, copias y cobro
    ├── inventory.js                # Catálogo de 160 productos, filtros, semáforo stock y modal EAN-13
    ├── catalog_masters.js          # CRUD de Marcas (12) y Categorías (8)
    ├── stock_movements.js          # Formularios de compras, mermas y visualizador de Kardex
    ├── import_export.js            # Importador/Exportador CSV Excel y respaldo JSON snapshot
    └── cash.js                     # Control de turnos de caja, fondo de apertura y arqueo
```

---

## 3. PUESTA EN MARCHA Y EJECUCIÓN DEL SISTEMA

El sistema unificado no requiere conexión a Internet ni instalación de servidores:
1. Abra la carpeta `C:\Users\gerac\Desktop\ISA\ENTREGA`.
2. Haga doble clic sobre el archivo **`index.html`**.
3. El sistema se abrirá en su navegador (Chrome, Edge, Firefox o Brave) completamente funcional con **160 productos reales precargados del catálogo comercial** (4,509 unidades en anaquel valoradas en $64,451.00 MXN a costo y $106,763.50 MXN a venta al público), un turno de caja abierto con $500.00 MXN de fondo y la base de datos lista. Cuenta además con el botón directo **"Sincronizar Catálogo (160 Arts.)"** en el almacén para restablecer o recargar la base en 1 clic.

---

## 4. GUÍA DE ATAJOS DE TECLADO RÁPIDOS

Diseñados para operar con máxima agilidad en mostrador sin tocar el ratón:

| Atajo | Contexto | Acción en el Sistema |
| :---: | :---: | :--- |
| **`[F1]`** | Mostrador POS | Foco inmediato en el lector de códigos de barras / buscador de artículos. |
| **`[F1]`** | Almacén | Foco en el buscador del catálogo general de existencias. |
| **`[F2]`** | Mostrador POS | Alterna secuencialmente al siguiente carrito de compra (de 1 a 5). |
| **`[F2]`** | Almacén | Despliega el modal para dar de alta un **Nuevo Producto**. |
| **`[F4]`** | Mostrador POS | Abre el cotizador rápido de **Copias e Impresiones**. |
| **`[F10]`** | Mostrador POS | Abre la ventana de **Cobro y Liquidación de Ticket**. |
| **`[Esc]`** | General | Cierra cualquier modal activo o cancela la operación en curso. |

---

## 5. TRAZABILIDAD CON LAS CARPETAS SEMANALES

Para consultar los documentos formales de entrega, presupuestos económicos, diagramas de diseño y actas firmadas destinadas a los clientes finales y evaluadores:
* [`Carpeta 01/`](file:///C:/Users/gerac/Desktop/ISA/01) — Requerimientos de Software y Análisis Funcional.
* [`Carpeta 02/`](file:///C:/Users/gerac/Desktop/ISA/02) — Arquitectura de Persistencia, Modelo Entidad-Relación y SQLite.
* [`Carpeta 03/`](file:///C:/Users/gerac/Desktop/ISA/03) — Prototipado de Interfaz de Usuario (UI/UX) y Wireframes.
* [`Carpeta 04/`](file:///C:/Users/gerac/Desktop/ISA/04) — Sprint 1: Módulo de Inventario Funcional, Kardex, Entradas y Mermas.

---

*Papelería A B C — Entregable Unificado y Progresivo en constante evolución semanal.*
