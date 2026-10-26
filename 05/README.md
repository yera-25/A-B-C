# PAPELERÍA A B C — SISTEMA INTEGRAL DE ADMINISTRACIÓN Y PUNTO DE VENTA (POS)
## CARPETA DE ENTREGA 05: FASE 5 — SPRINT 2 (MÓDULO DE VENTAS Y PUNTO DE VENTA POS)
### Semana 5: 26 de Octubre al 29 de Octubre de 2026

---

![Logotipo Papelería A B C](LOGO.jpg)

Bienvenido a la carpeta oficial de entrega **`05/`**, correspondiente a la **Fase 5 (Sprint 2: Punto de Venta POS)** del sistema de administración y ventas de **Papelería A B C**, en estricto cumplimiento con el cronograma maestro establecido en `Calendario.pdf`.

Esta entrega presenta el **Módulo de Ventas y Mostrador 100% funcional y operativo**, desarrollado bajo una arquitectura **Local Offline-First** (HTML5 + CSS3 + JavaScript ES6 + SQLite 3 Relacional en 3FN), con autonomía total sin conexión a Internet, latencia de escaneo y cobro inferior a 5 milisegundos y compatibilidad nativa con hardware de punto de venta (lector láser, miniprinter térmica 80mm y cajón de dinero RJ11).

---

## 1. CONTENIDO Y ESTRUCTURA DE LA ENTREGA EN `05/`

> [!NOTE]
> **Integración Progresiva y Repositorio Final:**
> Los módulos de Punto de Venta (Fase 5) e Inventario (Fase 4) se encuentran integrados armónicamente en el entregable consolidado [`ENTREGA/`](file:///C:/Users/gerac/Desktop/ISA/ENTREGA). Todas las funcionalidades desarrolladas en esta semana se encuentran sincronizadas y listas para producción en mostrador.

```
C:\Users\gerac\Desktop\ISA\05\
│
├── LOGO.jpg                                        # Logotipo oficial de Papelería A B C
├── index.html                                      # Interfaz gráfica de Mostrador POS, Inventario y Caja
├── README.md                                       # Este documento índice de la entrega 05
├── papeleria_pos.db                                # Base de datos SQLite 3 oficial (160 productos, 3FN)
├── GUIA_DESPLIEGUE_Y_OPERACION_POS.md              # Manual operativo de periféricos y mostrador
├── DOCUMENTO_FASE_5_SPRINT_2_MODULO_POS_VENTAS.md  # Memoria técnica completa en Markdown
├── DOCUMENTO_FASE_5_SPRINT_2_MODULO_POS_VENTAS.pdf # Documento formal oficial compilado (con diagramas)
│
├── database/
│   ├── papeleria_pos.db                            # Base de datos SQLite 3 para abrir en DBeaver / SQLiteStudio
│   └── papeleria_pos.sql                           # Script DDL + DML completo con 160 productos y Kárdex
│
├── flujo_venta_pos.png                             # Diagrama de flujo del Punto de Venta (Render 200 DPI)
├── flujo_venta_pos.svg                             # Diagrama vectorial editable de flujo de ventas
├── ciclo_caja_arqueo.png                           # Diagrama del ciclo de caja, conciliación y corte Z (Render 200 DPI)
├── ciclo_caja_arqueo.svg                           # Diagrama vectorial editable de ciclo de caja
│
├── assets/
│   ├── data/
│   │   └── catalog_160.json                        # Catálogo maestro de 160 productos en JSON
│   └── img/
│       └── LOGO.jpg                                # Logotipo corporativo oficial
│
├── css/
│   └── styles.css                                  # Hoja de estilos con la paleta de Papelería A B C
│
└── js/
    ├── app.js                                      # Orquestador principal, reloj en vivo y atajos F1-F10
    ├── db.js                                       # Motor Relacional SQL Local, Ventas y Cortes Z
    ├── pos.js                                      # Controlador POS: multicarrito, escaneo, mayoreo, cobro rápido y ticket
    ├── cash.js                                     # Controlador de Caja: turnos, cuadratura rápida y Reporte Z
    ├── inventory.js                                # Catálogo, filtros, alertas de stock mínimo y EAN-13
    ├── catalog_masters.js                          # Gestión CRUD de 12 Marcas y 8 Categorías de papelería
    ├── stock_movements.js                          # Registro de compras, desincorporación de mermas y Kárdex
    └── import_export.js                            # Exportación CSV con UTF-8 BOM y respaldos JSON
```

---

## 2. PUESTA EN MARCHA RÁPIDA

1. Navegue a la carpeta: `C:\Users\gerac\Desktop\ISA\05` (o [`ENTREGA/`](file:///C:/Users/gerac/Desktop/ISA/ENTREGA)).
2. Haga **doble clic** sobre el archivo `index.html`.
3. El sistema se abrirá inmediatamente en su navegador predeterminado (Google Chrome, Microsoft Edge, Brave o Firefox) con:
   * Catálogo de 160 artículos reales cargado en memoria (<5ms).
   * Turno de caja abierto con fondo inicial de **$500.00 MXN**.
   * Carrito 1 activo listo para escanear productos.

---

## 3. ATAJOS DE TECLADO OPERATIVOS PARA MOSTRADOR

| Tecla / Atajo | Acción en el Sistema |
| :---: | :--- |
| **`[F1]`** | Coloca el cursor en el buscador para escanear con la pistola láser o teclear nombre/SKU. |
| **`[F2]`** | Alterna secuencialmente al siguiente carrito de compras en espera (Carritos 1 a 5). |
| **`[F4]`** | Abre la ventana de captura rápida de fotocopias B/N ($1), color ($5) y enmicados ($15). |
| **`[F8]`** | Abre el centro de análisis e historial de ventas con KPIs, buscador por folio/artículo, filtros y exportación a CSV. |
| **`[F10]`** | Abre la ventana de cobro de ticket con selector de pago, denominaciones rápidas y cambio (foco automático en monto recibido). |
| **`[Esc]`** | Cierra cualquier ventana emergente o modal activo sin perder los datos de la venta. |

---

## 4. FUNCIONALIDADES CLAVE DEL SPRINT 2 (PUNTO DE VENTA)

1. **Lectura Instantánea y Silenciosa por Lector Láser (<5ms):** Captura continua de códigos EAN-13 sin alertas flotantes intrusivas ni pérdida de foco.
2. **Atención con 5 Carritos Simultáneos (RF-02):** Ventas en espera independientes con aislamiento total de artículos.
3. **Ergonomía de Carrito Fijo (Sticky Cart Footer):** El botón de cobro permanece anclado en la parte inferior mientras que los artículos del carrito cuentan con desplazamiento interno (`scroll`) y cabeceras congeladas.
4. **Cobro Ultra-Rápido con Enfoque Automático:** Al presionar `[F10]`, el cursor se ubica directamente en el monto recibido del cliente con selección de texto para digitación inmediata o confirmación con `Enter`.
5. **Precios Diferenciados (Menudeo vs. Mayoreo):** Activación automática (cantidad $\ge 5$) o manual con badge distintivo `[MAYOREO]`.
6. **Descuentos Comerciales Directos:** Selector rápido de 0%, 5%, 10% y 15% con recálculo automático de IVA (16%).
7. **Denominaciones Rápidas de Efectivo:** Botones de $50, $100, $200, $500, $1000 y Pago Exacto con cálculo de cambio en tiempo real.
8. **Ticket Térmico con Logotipo (RF-04):** Formato 58/80mm con RFC, datos de Papelería A B C, desglose y código de barras.
9. **Centro de Análisis de Ventas y Métricas KPI (`[F8]`):** Consola ejecutiva de 1,040 px con indicadores en vivo, búsqueda multicriterio por texto y filtros combinables por método de pago y periodo.
10. **Exportación Oficial de Ventas a CSV:** Generación y descarga directa de `ventas_del_dia_YYYY-MM-DD.csv` con codificación UTF-8 BOM para apertura directa y limpia en Microsoft Excel.
11. **Conciliación Rápida y Cuadratura de Turno (RF-08):** Eliminación de la calculadora de denominaciones individuales; cierre ágil mediante captura directa del total en gaveta y botón de 1 clic `Cuadre Exacto`.
12. **Comprobante Oficial de Corte Z:** Auditoría de fin de turno con folio consecutivo, desglose de ventas y firmas de cajero y supervisor.
13. **Kárdex Transaccional Atómico:** Asiento inmutable `VENTA_MOSTRADOR` y decremento inmediato de existencias en el catálogo.
14. **Estándar Corporativo Libre de Emojis:** Interfaz y documentación depuradas con tipografía profesional sin iconografía informal.

---

## 5. RESUMEN FINANCIERO CONSOLIDADO

* **Costo Total del Proyecto:** $197,000.00 MXN
* **Inversión Asignada a Fase 5:** **$23,600.00 MXN** (11.98%)
* **Inversión Global Acumulada:** **$108,450.00 MXN devengados** (55.05% de avance financiero)
* **Equipo de Desarrollo:** Gerardo Cabrera Morales, Astrid García Ramírez y Daniel Parada Gonzalez.
