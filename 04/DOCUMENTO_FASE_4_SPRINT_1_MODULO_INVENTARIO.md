# SISTEMA INTEGRAL DE ADMINISTRACIÓN Y PUNTO DE VENTA (POS)
## ENTREGABLE OFICIAL DE LA FASE 4: SPRINT 1 — MÓDULO DE INVENTARIO
### PAPELERÍA A B C

---

| **Metadato Institucional** | **Detalle de la Entrega Técnica** |
| :--- | :--- |
| **Organización / Establecimiento:** | **Papelería A B C** |
| **Identidad Corporativa:** | Paleta oficial Azul Marino (`#152c4a`), Verde Esmeralda (`#3a8e63`), Rojo Alertas (`#d9534f`), Blanco/Gris Neutro (`#f8fafc`). Logotipo oficial integrado (`LOGO.jpg`). |
| **Fase del Calendario:** | **Fase 4: Sprint 1 (Semana 4: 19 de Octubre al 22 de Octubre de 2026)** |
| **Hito Contractual:** | **Sprint 1: Módulo de Inventario** |
| **Entregable Oficial Exigido:** | **Módulo de Inventario funcional** con programación de productos, marcas y categorías, control de stock mínimo, registro de entradas y mermas, y conexión funcional a base de datos con validaciones estrictas. |
| **Modalidad de Arquitectura:** | Web Application Local Offline-First (HTML5 + CSS3 + ES6 + IndexedDB `PapeleriaABC_POS_DB` v2). Autonomía total sin conexión a Internet y latencia de respuesta `< 10 ms`. |
| **Presupuesto Económico Fase 4:** | **$21,200.00 MXN** (Desglosado en MOD para 3 desarrolladores, insumos directos y contingencia). |
| **Inversión Global Acumulada:** | **$87,000.00 MXN devengados** de un costo total del proyecto de **$197,000.00 MXN** (44.16% de avance financiero). |
| **Equipo Desarrollador:** | **Gerardo Cabrera Morales** (Líder Técnico & Fullstack)<br>**Astrid García Ramírez** (Analista de Datos & QA)<br>**Daniel Parada Gonzalez** (Arquitecto de Persistencia & UI/UX) |

---

## 1. RESUMEN EJECUTIVO Y ALCANCE DEL SPRINT 1

En estricto apego al cronograma maestro establecido en el `Calendario.pdf` del proyecto para **Papelería A B C**, la **Fase 4 (Sprint 1: Módulo de Inventario)** representa la culminación del primer núcleo funcional del sistema de administración y ventas.

El Módulo de Inventario desarrollado opera como una solución integral que resuelve de raíz las debilidades operativas tradicionales en comercios de papelería física: la falta de visibilidad en existencias críticas, el descontrol en la rotura o merma de material escolar, la inconsistencia entre compras a mayoristas y piezas exhibidas en mostrador, y la vulnerabilidad ante pérdidas de red.

### Objetivos Clave Alcanzados en el Sprint:
1. **Catálogo Maestro Normalizado:** Programación completa de la entidad `productos`, vinculada relacionalmente con 12 marcas líderes de la industria papelera y 8 categorías de artículos, permitiendo búsquedas instantáneas por código de barras (EAN-13), clave interna SKU o coincidencia textual.
2. **Control Inteligente de Stock Mínimo (RF-03):** Algoritmo automatizado que compara dinámicamente las existencias físicas contra el umbral de reorden configurado para cada producto, disparando alertas cromáticas inmediatas (semáforo rojo `#fff1f2` y pastillas de alerta) en el panel principal y contadores KPI en el encabezado.
3. **Registro Transaccional de Entradas de Mercancía (RF-04):** Módulo para capturar compras a distribuidores mayoristas (Scribe, Bic, Dixon, etc.), asociando número de factura/remisión, costo de adquisición unitario, y actualizando en una sola transacción atómica el stock disponible y el costo contable.
4. **Registro Riguroso de Mermas y Bajas (RF-04):** Sistema de desincorporación formal de inventario para artículos dañados, defectuosos de origen, caducados (tintas y adhesivos) o faltantes en auditoría, exigiendo validación de existencia física previa, justificación obligatoria y responsable de turno.
5. **Kardex Auditable e Inmutable (RF-07):** Libro mayor de movimientos que registra cronológicamente cada variación de existencias (entradas, ventas, mermas o inventarios iniciales), garantizando la cuadratura matemática:
   $$\text{Stock Actual} = \text{Inventario Inicial} + \sum \text{Entradas} - \sum \text{Ventas} - \sum \text{Mermas}$$
6. **Intercambio Masivo y Respaldo Snapshot (RF-06 / RNF-06):** Motor de importación/exportación de catálogos en formato CSV compatible con Microsoft Excel (con marca de orden de bytes UTF-8 BOM) y generador de respaldos íntegros de la base de datos en formato JSON en 1 solo clic.

---

## 2. DESGLOSE ECONÓMICO Y PRESUPUESTO FINANCIERO

El costo global asignado al desarrollo del **Sistema Integral de Administración y Venta para Papelería A B C** asciende a **$197,000.00 MXN**. A continuación se detalla la inversión aplicada específicamente a la **Fase 4 (Sprint 1 - Módulo de Inventario)**, así como el acumulado histórico de las 4 fases ejecutadas a la fecha.

### 2.1 Presupuesto Detallado de la Fase 4 ($21,200.00 MXN)

#### A. Mano de Obra Directa (MOD) — Equipo de 3 Desarrolladores
La Fase 4 requirió una dedicación intensiva de **75 horas hombre distribuidas equitativamente** entre los tres ingenieros del equipo:

| Desarrollador / Rol | Horas | Tarifa / Hora | Subtotal MOD | Responsabilidades Específicas en Fase 4 |
| :--- | :---: | :---: | :---: | :--- |
| **Gerardo Cabrera Morales**<br>*Líder Técnico & Fullstack* | 25 hrs | $260.00 MXN | $6,500.00 MXN | Arquitectura de la SPA, programación del motor de catálogo (`inventory.js`), generador de EAN-13, filtros reactivos, orquestador (`app.js`) y atajos de teclado. |
| **Daniel Parada Gonzalez**<br>*Arquitecto de Persistencia & UI/UX* | 25 hrs | $240.00 MXN | $6,000.00 MXN | Modelado de transacciones atómicas en IndexedDB (`db.js`), CRUD de Marcas y Categorías (`catalog_masters.js`), diseño CSS conforme a la identidad institucional de Papelería A B C. |
| **Astrid García Ramírez**<br>*Analista de Datos & QA* | 25 hrs | $230.00 MXN | $5,750.00 MXN | Programación de movimientos (`stock_movements.js`), validaciones de mermas y entradas, lógica de Kardex auditable, motor CSV/JSON (`import_export.js`) y pruebas de estrés. |
| **SUBTOTAL MANO DE OBRA DIRECTA:** | **75 hrs** | — | **$18,250.00 MXN** | *(86.08% del presupuesto de la Fase 4)* |

#### B. Materiales e Insumos Directos de Desarrollo y Pruebas
| Concepto / Recurso | Cantidad / Unidad | Costo Unitario | Subtotal Insumos | Justificación Técnica |
| :--- | :---: | :---: | :---: | :--- |
| **Etiquetas térmicas adhesivas** | 2 millares | $175.00 MXN | $350.00 MXN | Pruebas de lectura y contraste de códigos de barras EAN-13 generados por el sistema con lector láser USB. |
| **Rollos de papel térmico (58mm)** | 5 rollos | $50.00 MXN | $250.00 MXN | Calibración de salida física de vales de merma y comprobantes de recepción de compras en mini-impresora POS. |
| **Papelería física para auditoría** | 1 kit | $350.00 MXN | $350.00 MXN | Hojas de control, formatos de conteo ciego de mostrador y carpetas de evidencia para validación de almacén. |
| **SUBTOTAL MATERIALES E INSUMOS:** | — | — | **$950.00 MXN** | *(4.48% del presupuesto de la Fase 4)* |

#### C. Costos Indirectos de Desarrollo y Fondo de Contingencia
| Rubro Indirecto | Asignación Fase 4 | Justificación Operativa |
| :--- | :---: | :--- |
| **Energía, Red Local y Amortización** | $1,200.00 MXN | Consumo eléctrico del laboratorio local, red Gigabit LAN de prueba y desgaste de equipo de cómputo de desarrollo. |
| **Fondo de Contingencia y Aseguramiento** | $800.00 MXN | Reserva para ajustes de homologación de catálogo, resolución de colisiones en importación masiva y validaciones adicionales. |
| **SUBTOTAL COSTOS INDIRECTOS:** | **$2,000.00 MXN** | *(9.43% del presupuesto de la Fase 4)* |

$$\mathbf{TOTAL\ FASE\ 4\ (SPRINT\ 1\ INVENTARIO):\ \$21,200.00\ MXN}$$

---

### 2.2 Balance y Estado Acumulado del Presupuesto Global ($197,000.00 MXN)

Con la entrega y aprobación de esta Fase 4, el estado financiero acumulado del proyecto de Papelería A B C se consolida como sigue:

| Fase del Calendario | Etapa / Módulo | Costo Presupuestado | Costo Ejecutado | Estado Contractual | % del Total |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **Fase 1** | Requerimientos y Análisis del Sistema | $18,400.00 MXN | $18,400.00 MXN | **Completada (100%)** | 9.34% |
| **Fase 2** | Arquitectura y Diseño de UI/UX | $24,800.00 MXN | $24,800.00 MXN | **Completada (100%)** | 12.59% |
| **Fase 3** | Base de Datos y Persistencia Local | $22,600.00 MXN | $22,600.00 MXN | **Completada (100%)** | 11.47% |
| **Fase 4** | **Sprint 1: Módulo de Inventario** | **$21,200.00 MXN** | **$21,200.00 MXN** | **Completada (100%)** | **10.76%** |
| *Fase 5* | *Sprint 2: Ventas y Punto de Venta (POS)* | *$28,500.00 MXN* | *$0.00 MXN* | *Pendiente (Semana 5)* | *14.47%* |
| *Fase 6* | *Sprint 3: Reportes, Finanzas y Métricas* | *$23,000.00 MXN* | *$0.00 MXN* | *Pendiente (Semana 6)* | *11.68%* |
| *Fase 7* | *Pruebas de Integración, Carga y Seguridad* | *$19,500.00 MXN* | *$0.00 MXN* | *Pendiente (Semana 7)* | *9.90%* |
| *Fase 8* | *Despliegue Local, Manuales y Capacitación* | *$18,000.00 MXN* | *$0.00 MXN* | *Pendiente (Semana 8)* | *9.14%* |
| *Fase 9* | *Garantía, Puesta en Marcha y Soporte* | *$21,000.00 MXN* | *$0.00 MXN* | *Pendiente (Semana 9)* | *10.66%* |
| **TOTALES:** | **PROYECTO COMPLETO PAPELERÍA A B C** | **$197,000.00 MXN** | **$87,000.00 MXN** | **44.16% DEVENGADO** | **100.0%** |

---

## 3. ARQUITECTURA TÉCNICA DEL MÓDULO DE INVENTARIO

El módulo ha sido concebido bajo una arquitectura desacoplada de 4 capas lógicas, garantizando tiempos de carga y respuesta de la base de datos de menos de 10 milisegundos sin requerir servidores externos ni servicios de hosting costosos.

```
+-----------------------------------------------------------------------------------+
|               CAPA 1: PRESENTACIÓN Y VISTAS DE USUARIO (SPA HTML5)                |
|  [Catálogo & Stock]  [Marcas/Categorías]  [Entradas/Compras]  [Mermas]  [Kardex]  |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|                CAPA 2: LÓGICA DE NEGOCIO Y CONTROLADORES ES6                      |
|  - inventory.js        : Búsqueda reactiva, alertas stock, generador EAN-13       |
|  - catalog_masters.js  : Normalización de 12 marcas y 8 categorías de papelería   |
|  - stock_movements.js  : Transacciones de entrada, límites de merma, desglose    |
|  - import_export.js    : Serializador CSV con BOM Excel y snapshot JSON 1-clic    |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|     CAPA 3: PERSISTENCIA RELACIONAL SQL Y MOTOR HÍBRIDO (SQLite 3 / Local SQL)    |
|  Base: "papeleria_pos.db" | 16 Tablas Normalizadas en 3FN | 160 Productos Reales  |
|  productos | marcas | categorias | unidades | entradas | mermas | kardex ...      |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|                  CAPA 4: ENTORNO FÍSICO Y PERIFÉRICOS POS                         |
|  - Lector Código Barras USB  - Impresora Térmica 58mm  - Respaldo a Memoria USB   |
+-----------------------------------------------------------------------------------+
```

### 3.1 Estructura de Archivos del Módulo en `04/`
```
C:\Users\gerac\Desktop\ISA\04\
├── LOGO.jpg                                                (Logotipo oficial en raíz de entrega)
├── index.html                                              (Interfaz principal de usuario SPA)
├── README.md                                               (Guía de inicio rápido y atajos)
├── papeleria_pos.db                                        (Base de datos SQLite 3 oficial con 160 productos)
├── GUIA_HERRAMIENTAS_E_INSTALACION.md                      (Manual de Live Server y DBeaver)
├── DOCUMENTO_FASE_4_SPRINT_1_MODULO_INVENTARIO.md          (Este documento formal exhaustivo)
├── DOCUMENTO_FASE_4_SPRINT_1_MODULO_INVENTARIO.pdf         (Versión PDF oficial compilada)
├── database/
│   ├── papeleria_pos.db                                    (Base de datos SQLite 3 para DBeaver / SQLiteStudio)
│   └── papeleria_pos.sql                                   (Script SQL DDL + DML con 160 productos)
├── diagrama_modulo_inventario.svg                          (Vectorial de arquitectura del módulo)
├── diagrama_modulo_inventario.png                          (Render de alta resolución a 200 DPI)
├── flujo_entradas_mermas.svg                               (Vectorial de flujos de stock y kardex)
├── flujo_entradas_mermas.png                               (Render de alta resolución a 200 DPI)
├── assets/
│   ├── data/
│   │   └── catalog_160.json                                (Catálogo maestro de 160 productos en JSON)
│   └── img/
│       └── LOGO.jpg                                        (Copia de respaldo en assets)
├── css/
│   └── styles.css                                          (Estilos completos, variables y temas)
└── js/
    ├── app.js                                              (Orquestador, reloj y atajos globales)
    ├── catalog_masters.js                                  (Gestor de marcas, categorías y unidades)
    ├── db.js                                               (Motor Relacional SQL Local y Persistencia Híbrida)
    ├── import_export.js                                    (Exportación/Importación CSV, JSON y SQL)
    ├── inventory.js                                        (Catálogo de productos y validaciones)
    └── stock_movements.js                                  (Entradas, mermas y kardex auditable)
```

---

## 4. PROGRAMACIÓN DE CATÁLOGOS MAESTROS Y PRODUCTOS

### 4.1 Normalización de Marcas Homologadas (12 Marcas Oficiales)
Para evitar inconsistencias tipográficas como *"escribe"*, *"SCRIBE"* o *"Scribe Mex"*, el módulo incorpora un maestro de marcas inmutable en su clave principal:

1. **Scribe** (México — Cuadernos profesionales, hojas bond y blocks)
2. **Bic** (Francia / México — Bolígrafos cristal, lápices de grafito y correctores)
3. **Dixon** (Estados Unidos / México — Lápices Ticonderoga, gomas de migajón y colores)
4. **Factis** (España — Gomas de borrar plásticas no abrasivas)
5. **Barrilito** (México — Tijeras escolares, grapas y reglas de plástico)
6. **Pritt** (Alemania — Lápices adhesivos de barra libre de solventes)
7. **Crayola** (Estados Unidos — Crayones de cera lavables y plumones de agua)
8. **Maped** (Francia — Juegos de geometría, sacapuntas con depósito y tijeras)
9. **Pilot** (Japón — Marcadores permanentes y bolígrafos de gel premium)
10. **Paper Mate** (Estados Unidos — Bolígrafos Kilométrico y portaminas)
11. **Baco** (México — Clips metálicos, broches de archivo y compases)
12. **Berol** (México — Lápices de color Prismacolor y plastilinas)

### 4.2 Categorías y Familias de Papelería (8 Categorías)
1. **Cuadernos y Libretas:** Cuadernos profesionales de espiral, cosidos, francesa y blocks.
2. **Escritura e Instrumentos:** Bolígrafos, lápices de grafito, marcatextos, plumones y gises.
3. **Adhesivos y Pegamentos:** Lápices adhesivos, pegamento blanco escolar y silicón líquido.
4. **Papeles y Cartulinas:** Hojas bond carta/oficio, cartulinas bristol, papel lustre y crepé.
5. **Geometría y Corte:** Juegos de geometría, reglas metálicas, tijeras y compases.
6. **Arte y Manualidades:** Crayones, acuarelas, pinceles, plastilina y foamy.
7. **Organización y Archivo:** Folders manila, broches baco, registradores y clips.
8. **Servicios y Copias:** Fotocopias blanco/negro, color, impresiones e engargolados (artículos con stock infinito).

### 4.3 Catálogo Maestro y Llenado Exhaustivo de la Base de Datos (160 Artículos Reales)

En cumplimiento estricto con los requerimientos operativos de un establecimiento de papelería en marcha comercial ("Papelería A B C"), la base de datos local IndexedDB (`PapeleriaABC_POS_DB`) ha sido poblada en su totalidad con un **catálogo exhaustivo de 160 productos reales**, cubriendo las 8 categorías comerciales y las 12 marcas oficiales normalizadas.

Cada producto cuenta con especificaciones completas: código de barras estándar mexicano EAN-13 (`750...`), clave SKU estructurada y mnemotécnica, unidad de medida oficial (PZA, CAJA, PAQ, CTO, MTR), costo de compra mayorista, precio de venta al menudeo, precio de venta al mayoreo, existencias iniciales reales y umbrales de stock mínimo configurados para auditoría y reabastecimiento continuo.

#### Resumen Cuantitativo y Valoración del Inventario Poblado

| Métrica de Almacén e Inventario | Valor Registrado en la Base de Datos | Observaciones Operativas |
| :--- | :---: | :--- |
| **Total de Artículos Registrados:** | **160 productos** | Distribuidos en 8 categorías y 12 marcas líderes. |
| **Artículos Físicos en Existencia:** | **149 artículos** | Sujetos a control estricto de Kardex y mermas. |
| **Servicios Digitales y de Copiado:** | **11 servicios** | Stock infinito (9,999) sin afectación de merma física. |
| **Unidades Físicas Totales en Anaquel:** | **4,509 unidades** | Sumatoria total de piezas, paquetes y cajas en tienda. |
| **Valoración Total del Inventario a Costo:** | **$64,451.00 MXN** | Inversión real en inventario de adquisición mayorista. |
| **Valoración Potencial a Precio Menudeo:** | **$106,763.50 MXN** | Ingreso total estimado en venta al público de mostrador. |
| **Utilidad Bruta Proyectada:** | **$42,312.50 MXN** | **Margen comercial bruto ponderado del 39.63%**. |
| **Artículos en Alerta de Stock Crítico:** | **2 artículos** | Pritt 22g (8/10) y Tijera Barrilito (4/6) para pruebas. |

#### Distribución de Artículos por Familia y Categoría

| ID | Nombre de la Categoría | Total Artículos | Marcas Principales Asociadas | Ejemplos Representativos |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Cuadernos y Libretas** | 18 | Scribe | Profesional Raya, C5, C7, Cosido, Dibujo, Doble Espiral, Forma Francesa/Italiana, Block Cuadro/Marquilla. |
| **2** | **Escritura e Instrumentos** | 37 | Bic, Dixon, Pilot, Paper Mate, Factis | Bolígrafos Cristal (Azul, Negro, Rojo, Verde), Bic 4 Colores, Ticonderoga HB/2B, Kilométrico, Plumones Pilot. |
| **3** | **Adhesivos y Pegamentos** | 18 | Pritt, Barrilito | Pritt Barra 11g/22g/42g, Pegamento Blanco 850, Silicón Líquido/Barra, Cinta Diurex, Cinta Canela, Masking Tape. |
| **4** | **Papeles y Cartulinas** | 18 | Scribe | Resmas Bond Carta/Oficio 75g/90g, Cartulinas Bristol colores, Papel Lustre, Crepé, China, América, Cascarón. |
| **5** | **Geometría y Corte** | 19 | Barrilito, Maped, Baco | Juegos Geometría Flexibles 5 pzas, Reglas Metálicas 30cm, Escuadras, Tijeras Escolares, Cúteres y Exactos. |
| **6** | **Arte y Manualidades** | 19 | Crayola, Berol | Crayones Cera 12/24 pzas, Plastilinas en barra Berol, Acuarelas Lavables 12 colores, Pinceles, Foamy y Diamantina. |
| **7** | **Organización y Archivo** | 20 | Baco, Barrilito | Folders Manila Carta/Oficio, Broches Baco 8cm, Clips Estándar/Mariposa, Registradores Lefort, Protectores de Hojas. |
| **8** | **Servicios y Copias** | 11 | Genérico / Papelería A B C | Copias Carta/Oficio B/N y Color, Impresión Láser, Enmicados Carta/Doble Carta, Engargolados, Escaneo y Planos. |

#### Muestra Representativa del Catálogo Maestro Pre-Cargado

| Código EAN-13 | SKU | Artículo Comercial | Categoría | Marca | Unidad | Costo | Venta Menudeo | Venta Mayoreo | Stock | Mín. |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `7501024500123` | `SC-CUAD-RAYA` | Cuaderno Profesional Raya 100 Hojas Scribe | Cuadernos | Scribe | PZA | $22.50 | $35.00 | $32.00 | 45 | 10 |
| `7501024500130` | `SC-CUAD-CUA5` | Cuaderno Profesional Cuadro Chico 5mm Scribe | Cuadernos | Scribe | PZA | $22.50 | $35.00 | $32.00 | 50 | 10 |
| `7501024500185` | `SC-BLOCK-MARQ` | Block de Dibujo Marquilla 50 Hojas Espiral Scribe | Cuadernos | Scribe | PZA | $36.00 | $55.00 | $48.00 | 20 | 5 |
| `7501030101015` | `BIC-CRIS-AZUL` | Bolígrafo Punto Mediano Cristal Azul Bic | Escritura | Bic | PZA | $4.20 | $8.00 | $6.50 | 120 | 25 |
| `7501030101022` | `BIC-CRIS-NEGR` | Bolígrafo Punto Mediano Cristal Negro Bic | Escritura | Bic | PZA | $4.20 | $8.00 | $6.50 | 95 | 25 |
| `7501017001005` | `DIXON-LAP-NO2` | Lápiz de Grafito HB No. 2 Ticonderoga Dixon | Escritura | Dixon | PZA | $3.80 | $7.00 | $6.00 | 60 | 15 |
| `7501008000451` | `PRITT-ADH-22G` | Lápiz Adhesivo Barra 22g Pritt Original | Adhesivos | Pritt | PZA | $18.50 | $32.00 | $28.00 | 8 | 10 |
| `7501008000475` | `PRITT-PEG-BLAN` | Pegamento Blanco Escolar 110g Pritt Lavable | Adhesivos | Pritt | PZA | $14.50 | $25.00 | $22.00 | 35 | 8 |
| `7501024500307` | `SC-RESM-BOND-C` | Resma Papel Bond Carta 500 Hojas 75g Scribe | Papeles | Scribe | PAQ | $82.00 | $120.00 | $110.00 | 30 | 8 |
| `7501056302008` | `BARR-TIJ-ESC` | Tijera Escolar Punta Roma 5 Pulgadas Barrilito | Geometría | Barrilito | PZA | $12.00 | $22.00 | $19.00 | 4 | 6 |
| `7501042300055` | `MAPED-GEO-15` | Juego de Geometría Flexible 5 Pzas Maped Twist | Geometría | Maped | PZA | $28.00 | $48.00 | $42.00 | 15 | 5 |
| `7501004000100` | `CRAY-CRAY-12PZ` | Crayones de Cera Estándar 12 Colores Crayola | Arte | Crayola | PZA | $16.00 | $28.00 | $24.00 | 25 | 6 |
| `7501083000108` | `BEROL-PLAST-10` | Plastilina Escolar Barra 180g Varios Colores Berol | Arte | Berol | PZA | $8.50 | $15.00 | $12.50 | 40 | 10 |
| `7501054000104` | `BACO-FOLD-MC` | Folder Manila Tamaño Carta con Pestaña Baco | Archivo | Baco | PZA | $1.80 | $4.00 | $3.20 | 150 | 30 |
| `7501054000258` | `BACO-BROC-8CM` | Caja Broches para Archivo 8cm 50 Juegos Baco | Archivo | Baco | CAJA | $42.00 | $68.00 | $60.00 | 18 | 4 |
| `7501099900010` | `SERV-COPIA-BN` | Fotocopia Tamaño Carta B/N (Servicio) | Servicios | Genérico | PZA | $0.20 | $1.00 | $0.80 | 9999 | 0 |
| `7501099900027` | `SERV-COPIA-COL` | Fotocopia Tamaño Carta Color Láser (Servicio) | Servicios | Genérico | PZA | $1.50 | $5.00 | $4.00 | 9999 | 0 |
| `7501099900058` | `SERV-ENGAR-CH` | Engargolado Arillo Espiral Plástico Chico (1-50h) | Servicios | Genérico | PZA | $8.00 | $25.00 | $20.00 | 9999 | 0 |

> [!NOTE] 
> La totalidad de los 160 artículos se encuentra disponible para exportación inmediata en formato Microsoft Excel (.CSV con BOM UTF-8) mediante el botón **"Exportar Catálogo Actual (.CSV)"** ubicado en la sub-pestaña *Carga Masiva y Respaldos*. Asimismo, la persistencia se encuentra sincronizada automáticamente mediante la versión 3 de IndexedDB (`PapeleriaABC_POS_DB`).

---

## 5. CONTROL DE STOCK MÍNIMO Y VALIDACIONES DE NEGOCIO

El Módulo de Inventario implementa un conjunto exhaustivo de validaciones tanto en la capa de interfaz (`inventory.js`) como en el almacenamiento físico (`db.js`), asegurando la integridad de los datos financieros y físicos:

### 5.1 Reglas y Validaciones de Integridad
1. **Unicidad de Código de Barras y SKU:** El sistema impide el registro o modificación de un artículo si su código de barras o clave SKU ya existe en la base de datos para otro producto diferente.
2. **Restricción de No Negatividad:** Tanto los costos de adquisición como los precios de venta al menudeo/mayoreo y las cantidades de existencia deben ser números positivos válidos.
3. **Alerta de Margen Comercial Inverso:** Si un operador intenta capturar un precio de venta al menudeo inferior al costo de compra, el sistema emite una confirmación de advertencia para prevenir pérdidas financieras involuntarias.
4. **Semáforo y Alerta de Stock Crítico:** La condición:
   $$\text{Alerta Activa} \iff (\text{Stock Actual} \le \text{Stock Mínimo}) \land (\text{es\_servicio} = \text{false})$$
   tiñe la fila del artículo en color rojo claro (`.row-danger-stock`), añade una etiqueta visual `⚠️ Mínimo: X` y suma al contador de stock crítico del dashboard general.

---

## 6. REGISTRO TRANSACCIONAL DE ENTRADAS Y MERMAS

### 6.1 Flujo A: Entrada de Mercancía / Reabastecimiento
Cuando se recibe un embarque de proveedor:
1. El usuario selecciona el producto en la pestaña **"Entradas / Compras"**.
2. El sistema precarga automáticamente el costo unitario de la última compra y la unidad de medida.
3. Se ingresa la cantidad recibida, el proveedor mayorista y el folio de factura o remisión.
4. El sistema calcula en tiempo real la inversión total acumulada.
5. Al hacer clic en **"Confirmar y Asentar Entrada en Kardex"**, se ejecuta una transacción atómica que:
   - Incrementa el campo `stock_actual` del producto.
   - Actualiza el `precio_compra` ponderado.
   - Inserta el registro en el Object Store `entradas_mercancia`.
   - Inserta un movimiento tipo `ENTRADA_COMPRA` en el `kardex_movimientos` con el stock previo y posterior resultante.

### 6.2 Flujo B: Registro y Control de Mermas / Bajas
En una papelería física es indispensable registrar el material inservible para que no altere la contabilidad ni oculte robos:
1. El usuario ingresa a la pestaña **"Registro de Mermas"**.
2. Al seleccionar el artículo, la interfaz consulta y muestra de forma reactiva el `stock_actual` disponible para baja.
3. **Validación Infranqueable de Disponibilidad:** El sistema bloquea cualquier intento de merma cuya cantidad sea mayor a las existencias físicas registradas.
4. Se debe elegir un motivo del catálogo oficial:
   - *Daño físico o rotura en exhibición de mostrador.*
   - *Defecto de fabricación o tinta seca de fábrica.*
   - *Caducidad o deterioro de adhesivos y pegamentos.*
   - *Ajuste por faltante en conteo físico de auditoría.*
   - *Consumo interno administrativo de la papelería.*
5. Es obligatorio redactar una justificación técnica detallada y registrar al responsable autorizado.
6. La transacción en base de datos descuenta el stock, inserta en el store `mermas` y genera el asiento `MERMA_BAJA` en el Kardex.

---

## 7. KARDEX AUDITABLE (LIBRO MAYOR DE MOVIMIENTOS - RF-07)

El Object Store `kardex_movimientos` funge como una bitácora inmutable donde cada registro queda sellado con:
- `id_movimiento`: Clave numérica secuencial autoincrementable.
- `id_producto`: Identificador foráneo del artículo afectado.
- `fecha_hora`: Marca temporal ISO 8601 exacta con milisegundos.
- `tipo_movimiento`: `INVENTARIO_INICIAL`, `ENTRADA_COMPRA`, `VENTA_MOSTRADOR`, `MERMA_BAJA` o `DESGLOSE_CAJA`.
- `cantidad`: Delta de piezas modificadas (positiva en compras, negativa en ventas/mermas).
- `stock_anterior`: Existencia en anaquel un instante antes de la transacción.
- `stock_posterior`: Existencia resultante en anaquel post-transacción.
- `referencia`: Número de factura, motivo de merma o folio de venta.
- `usuario`: Operador responsable del movimiento.

En la pestaña **"Kardex Auditable"**, los administradores de Papelería A B C pueden auditar el historial completo con filtros combinados por producto o tipo de transacción.

---

## 8. CARGA MASIVA, EXPORTACIÓN Y TOLERANCIA A FALLOS (RF-06 / RNF-06)

Para facilitar la transición desde hojas de cálculo previas de la papelería:
1. **Exportación a CSV con BOM UTF-8:** Al hacer clic en **"Exportar Catálogo Actual (.CSV)"**, el sistema genera un archivo con cabeceras estándar y antepone el byte de orden de marcas `\uFEFF`, garantizando que acentos, eñes y caracteres especiales se abran sin distorsiones en cualquier versión de Microsoft Excel en Windows.
2. **Plantilla Modelo:** Permite descargar un formato CSV limpio con columnas validadas para captura masiva externa.
3. **Importador Masivo:** Analiza línea por línea el archivo subido, valida las columnas obligatorias e inyecta los artículos directamente al almacén local.
4. **Respaldo Local JSON en 1-Clic:** La función `exportarRespaldoJSON()` realiza un volcado completo de los 10 Object Stores en una sola transacción `readonly` y descarga un archivo `.json` fechado (`Respaldo_Inventario_Papeleria_ABC_AAAA-MM-DD.json`), asegurando la restitución total del negocio en caso de formateo del equipo de mostrador.

---

## 9. HERRAMIENTAS RECOMENDADAS Y GUÍA DE INSTALACIÓN

Para el despliegue y auditoría óptima del sistema en la estación de trabajo de la papelería, se recomiendan las siguientes herramientas:

### Herramienta 1: Live Server (Extensión para Visual Studio Code) — *Altamente Recomendada*
- **Finalidad:** Permite levantar un servidor web local liviano en el puerto `5500` con recarga automática (*Hot Reload*) al guardar cualquier cambio en los archivos de la entrega.
- **Guía de Instalación Rápida:**
  1. Abrir Visual Studio Code.
  2. Presionar el atajo `Ctrl + Shift + X` para abrir el panel de Extensiones.
  3. Escribir en la barra de búsqueda: `Live Server` (autor: *Ritwick Dey*).
  4. Hacer clic en el botón azul **"Install"**.
  5. Para ejecutar la entrega: Abrir la carpeta `C:\Users\gerac\Desktop\ISA\04`, hacer clic derecho sobre `index.html` y seleccionar **"Open with Live Server"**.

### Herramienta 2: DBeaver Community o SQLiteStudio (Auditoría de Datos) — *Opcional*
- **Finalidad:** En caso de que en fases posteriores se configure un puente de sincronización a bases de datos relacionales SQLite / PostgreSQL locales.
- **Instalación vía consola de Windows (PowerShell):**
  ```powershell
  winget install dbeaver.dbeaver
  ```

### Herramienta 3: Inspección Nativa de IndexedDB (Google Chrome / Microsoft Edge)
- No requiere ninguna descarga ni instalación adicional.
- **Instrucciones:**
  1. Abrir `04/index.html` en el navegador.
  2. Presionar la tecla `F12` para abrir las Herramientas de Desarrollador.
  3. Ir a la pestaña **"Application"** (o **"Almacenamiento"**).
  4. En el panel izquierdo, desplegar la sección **IndexedDB** -> **`PapeleriaABC_POS_DB`**.
  5. Se pueden auditar en vivo las 10 tablas u Object Stores con todos sus registros en tiempo real.

---

## 10. ACTA DE ENTREGA, APROBACIÓN Y FIRMAS DE LA FASE 4

Habiéndose completado satisfactoriamente los requerimientos establecidos para la **Fase 4 (Sprint 1: Módulo de Inventario)** del `Calendario.pdf`, se emite la presente acta de conformidad para constancia del avance del proyecto de **Papelería A B C**:

$$\begin{array}{ccc}
\rule{60mm}{0.5pt} & \rule{60mm}{0.5pt} & \rule{60mm}{0.5pt} \\
\textbf{Ing. Gerardo Cabrera Morales} & \textbf{Ing. Astrid García Ramírez} & \textbf{Ing. Daniel Parada Gonzalez} \\
\text{Líder Técnico \& Fullstack} & \text{Analista de Datos \& QA} & \text{Arquitecto de Persistencia \& UI/UX} \\
\text{Papelería A B C} & \text{Papelería A B C} & \text{Papelería A B C}
\end{array}$$

$$\begin{array}{c}
\rule{90mm}{0.5pt} \\
\textbf{Aprobación de la Dirección General / Propietario} \\
\text{Papelería A B C} \\
\text{Fecha de Conformidad: 22 de Octubre de 2026}
\end{array}$$
