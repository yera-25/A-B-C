<div align="center">
  <img src="LOGO.jpg" alt="Logotipo Oficial Papelería A B C" width="260"/>
  <h1>ENTREGA 02 — FASE 2: ANÁLISIS Y MODELADO DE DATOS</h1>
  <h3>Sistema POS para "Papelería A B C" (Web App Local)</h3>
</div>

**Empresa / Negocio:** Papelería A B C  
**Identidad Visual:** Logotipo Oficial Integrado (`LOGO.jpg`)  
**Materia:** Ingeniería de Software  
**Equipo de Desarrollo:** Gerardo Cabrera Morales | Astrid García Ramírez | Daniel Parada Gonzalez  
**Fecha de Entrega Oficial:** Semana 2 (Fase 2 del Calendario)

---

### 1. Resumen Ejecutivo de la Entrega

Esta carpeta contiene la totalidad de los entregables técnicos y de diseño correspondientes a la **Fase 2: Análisis y Modelado de Datos** del **Calendario de Actividades**, dando continuidad y cumplimiento formal a los requerimientos especificados en la **Fase 1** (RF-01 a RF-08 y RNF-01 a RNF-06), personalizados con la marca e identidad visual de **Papelería A B C**:

- **Identidad Institucional y Marca (`LOGO.jpg`):** Integración formal del logotipo comercial (lápiz para "A", cuaderno para "B" y tijeras para "C") con su paleta cromática en los diagramas de ingeniería, encabezados de ticket, pantallas de la aplicación y tabla de configuración (`configuracion_negocio`).
- **Diseño Relacional y Persistencia Local:** Modelado de 18 entidades organizadas en dominios funcionales (Identidad de Papelería A B C, Catálogo y Artículos, Ventas y POS, Caja y Seguridad, Inventario y Kardex).
- **Normalización Estricta hasta 3FN:** Descomposición formal desde la tabla plana sin normalizar (0FN) pasando por 1FN y 2FN hasta Tercera Forma Normal (3FN), erradicando redundancias y anomalías operativas.
- **Diccionario de Datos Exhaustivo:** Especificación campo por campo de tipos, longitudes, restricciones de dominio (PK, FK, UK, CHECK), valores predeterminados y reglas de negocio para cada entidad.
- **Entregable Oficial del Calendario (DER):** Diagrama Entidad-Relación físico/lógico en formato vectorial escalable SVG y renderizado en PNG de alta resolución con membrete institucional de Papelería A B C.
- **Modelado Dinámico UML:** Diagrama de Casos de Uso general del sistema y Diagramas de Secuencia clave para venta rápida con lector de barras, deducción de existencias en Kardex y desglose de empaques.
- **Implementación Ejecutable y Persistencia Híbrida:** Script SQL ANSI validado (`schema.sql`) con datos semilla de catálogo de papelería, base de datos SQLite precompilada (`papeleria_pos.db`) y módulo para persistencia local en navegador mediante IndexedDB (`schema_indexeddb.js` con base de datos `PapeleriaABC_POS_DB`).
- **Guía de Instalación de Herramientas:** Manual didáctico paso a paso para la instalación y configuración de **DBeaver Community** (herramienta principal recomendada), alternativas portables y extensiones de desarrollo en VS Code.

---

### 2. Matriz de Cumplimiento de la Fase 2 (Calendario vs. Entregables)

| Punto Marcado en el Calendario | Estado | Archivos Correspondientes |
|---|:---:|---|
| **Diseño de la base de datos: artículos, ventas e inventario** | **100% CUMPLIDO** | [schema.sql](file:///C:/Users/gerac/Desktop/ISA/02/schema.sql)<br>[papeleria_pos.db](file:///C:/Users/gerac/Desktop/ISA/02/papeleria_pos.db)<br>[schema_indexeddb.js](file:///C:/Users/gerac/Desktop/ISA/02/schema_indexeddb.js) |
| **Normalización hasta 3FN y elaboración del Diccionario de Datos** | **100% CUMPLIDO** | [DOCUMENTO_FASE_2_ANALISIS_Y_MODELADO_DE_DATOS.md](file:///C:/Users/gerac/Desktop/ISA/02/DOCUMENTO_FASE_2_ANALISIS_Y_MODELADO_DE_DATOS.md)<br>[DOCUMENTO_FASE_2_ANALISIS_Y_MODELADO_DE_DATOS.pdf](file:///C:/Users/gerac/Desktop/ISA/02/DOCUMENTO_FASE_2_ANALISIS_Y_MODELADO_DE_DATOS.pdf) |
| **Diagrama de Casos de Uso y diagramas de secuencia clave** | **100% CUMPLIDO** | [diagramas_casos_de_uso.svg](file:///C:/Users/gerac/Desktop/ISA/02/diagramas_casos_de_uso.svg)<br>[diagramas_casos_de_uso.png](file:///C:/Users/gerac/Desktop/ISA/02/diagramas_casos_de_uso.png)<br>[diagramas_secuencia.svg](file:///C:/Users/gerac/Desktop/ISA/02/diagramas_secuencia.svg)<br>[diagramas_secuencia.png](file:///C:/Users/gerac/Desktop/ISA/02/diagramas_secuencia.png) |
| **ENTREGABLE · Diagrama Entidad-Relación (DER)** | **100% CUMPLIDO** | [diagrama_entidad_relacion.svg](file:///C:/Users/gerac/Desktop/ISA/02/diagrama_entidad_relacion.svg)<br>[diagrama_entidad_relacion.png](file:///C:/Users/gerac/Desktop/ISA/02/diagrama_entidad_relacion.png) |
| **Identidad Visual Corporativa (LOGO.jpg)** | **100% CUMPLIDO** | [LOGO.jpg](file:///C:/Users/gerac/Desktop/ISA/02/LOGO.jpg) (Incrustado en DER, UML, DB y PDF) |
| **Guía de instalación de herramientas recomendadas** | **100% CUMPLIDO** | [GUIA_INSTALACION_HERRAMIENTAS.md](file:///C:/Users/gerac/Desktop/ISA/02/GUIA_INSTALACION_HERRAMIENTAS.md) |

---

### 3. Índice Detallado de Archivos en la Carpeta `02`

```text
ISA/
└── 02/
    ├── LOGO.jpg                                          # Logotipo e imagen institucional oficial de Papelería A B C
    ├── DOCUMENTO_FASE_2_ANALISIS_Y_MODELADO_DE_DATOS.pdf  # Documento técnico formal de entrega (7 páginas con portada, diagramas y firmas)
    ├── DOCUMENTO_FASE_2_ANALISIS_Y_MODELADO_DE_DATOS.md   # Especificación técnica completa en formato Markdown con diagramas
    ├── diagrama_entidad_relacion.svg                     # ENTREGABLE: Diagrama ER vectorial escalable con membrete y logo
    ├── diagrama_entidad_relacion.png                     # ENTREGABLE: Diagrama ER en imagen de alta resolución (3500x2417 px)
    ├── diagramas_casos_de_uso.svg                        # Diagrama UML de Casos de Uso del sistema completo (vectorial con logo)
    ├── diagramas_casos_de_uso.png                        # Diagrama UML de Casos de Uso (imagen alta resolución)
    ├── diagramas_secuencia.svg                           # Diagramas UML de Secuencia para Venta POS y Desglose Kardex (vectorial con logo)
    ├── diagramas_secuencia.png                           # Diagramas UML de Secuencia (imagen alta resolución)
    ├── schema.sql                                        # Script DDL ANSI SQL con 18 tablas 3FN, índices, vistas y datos de Papelería A B C
    ├── papeleria_pos.db                                  # Base de datos local SQLite precompilada con catálogo y configuración
    ├── schema_indexeddb.js                               # Mapeo del esquema para IndexedDB (PapeleriaABC_POS_DB)
    ├── GUIA_INSTALACION_HERRAMIENTAS.md                  # Guía paso a paso de instalación de DBeaver, SQLiteStudio y extensiones
    └── README.md                                         # Índice general de la entrega 02 (este archivo)
```

---

### 4. Guía Rápida de Inspección y Uso

1. **Visualizar el Diagrama Entidad-Relación:**
   - Abre directamente el archivo [diagrama_entidad_relacion.png](file:///C:/Users/gerac/Desktop/ISA/02/diagrama_entidad_relacion.png) en cualquier visor de imágenes de Windows o navegador web, o abre [diagrama_entidad_relacion.svg](file:///C:/Users/gerac/Desktop/ISA/02/diagrama_entidad_relacion.svg) para zoom infinito sin pérdida de resolución.
2. **Consultar el Documento Formal de la Fase 2:**
   - Abre el archivo PDF listo para impresión o defensa académica: [DOCUMENTO_FASE_2_ANALISIS_Y_MODELADO_DE_DATOS.pdf](file:///C:/Users/gerac/Desktop/ISA/02/DOCUMENTO_FASE_2_ANALISIS_Y_MODELADO_DE_DATOS.pdf).
3. **Explorar y Ejecutar la Base de Datos:**
   - Abre [papeleria_pos.db](file:///C:/Users/gerac/Desktop/ISA/02/papeleria_pos.db) utilizando **DBeaver Community** o **SQLiteStudio** siguiendo las instrucciones en [GUIA_INSTALACION_HERRAMIENTAS.md](file:///C:/Users/gerac/Desktop/ISA/02/GUIA_INSTALACION_HERRAMIENTAS.md).
   - O bien, importa [schema.sql](file:///C:/Users/gerac/Desktop/ISA/02/schema.sql) en cualquier motor relacional (SQLite, PostgreSQL, MySQL/MariaDB).
4. **Inspeccionar la Persistencia de la Web App Local:**
   - El archivo [schema_indexeddb.js](file:///C:/Users/gerac/Desktop/ISA/02/schema_indexeddb.js) se integrará directamente en la **Fase 3** para la interacción nativa con la memoria y almacenamiento del navegador web bajo `PapeleriaABC_POS_DB`.
