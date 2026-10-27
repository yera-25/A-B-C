# PAPELERÍA A B C — SISTEMA POS & INVENTARIO LOCAL
## ENTREGABLE OFICIAL DE LA FASE 6: SPRINT 3 (REPORTES Y SEGURIDAD)

---

### Resumen Ejecutivo de la Fase 6
* **Establecimiento:** Papelería A B C (Papelería escolar, técnica y de oficina).
* **Periodo Oficial:** Semana 6 (02 de Noviembre al 05 de Noviembre de 2026).
* **Hito Contractual:** Sprint 3 — Reportes Analíticos Financieros + Control de Acceso RBAC con Cifrado SHA-256.
* **Presupuesto Fase 6:** $21,100.00 MXN (10.71% del costo total).
* **Acumulado Devengado:** $129,550.00 MXN de $197,000.00 MXN (65.76% de avance financiero).
* **Equipo de Desarrollo:** Gerardo Cabrera Morales (Líder Técnico), Astrid García Ramírez (QA/DBA), Daniel Parada Gonzalez (Seguridad).
* **Política de Interfaz:** Cumplimiento estricto del estándar corporativo de Cero Emojis.

---

### Perfiles del Sistema y Control de Acceso (RBAC)

Al abrir la página `index.html`, la interfaz se bloquea y se presenta de forma mandatoria el portal de autenticación segura. No es posible acceder sin autenticarse mediante uno de los 3 perfiles oficiales:

| Perfil Oficial | Usuario (*Login*) | Contraseña | Responsable | Funciones Asignadas y Segregación de Tareas |
| :--- | :---: | :---: | :--- | :--- |
| **ADMINISTRADOR** | `admin` | `admin123` | Gerardo Cabrera Morales | **Destinado a la administración de perfiles y contraseñas.** Al iniciar sesión, abre automáticamente el panel de perfiles. Crea y edita usuarios, asigna roles, activa/suspende cuentas y restablece contraseñas con SHA-256 + salt de 16 bytes. Control maestro institucional. |
| **SUPERVISOR** | `supervisor` | `super123` | Astrid García Ramírez | **Altas de catálogo y realización de cortes de caja.** Facultado para dar de alta productos (`Nuevo Producto [F2]`), categorías y marcas en inventario, y **ejecutar cortes de caja Z** (cierre de turno). Acceso a Mostrador POS y Reportes Analíticos. *Restricción:* Sin acceso a gestión de perfiles ni claves. |
| **USUARIO (CAJERO)** | `usuario` | `usuario123` | Daniel Parada Gonzalez | **Operación en Mostrador Punto de Venta (POS).** Cobro ágil de tickets, escaneo de códigos de barra y consulta básica de existencias (*Modo Solo Consulta*). *Restricciones estrictas:* **No puede dar de alta productos, no puede dar de alta categorías ni marcas, y no puede hacer cortes de caja (solo el supervisor).** Pestañas de Reportes y Configuración ocultas. *(Admite también `cajero` / `caja123`).* |

---

### Funcionalidades Destacadas del Entregable
1. **Portal de Login Bloqueante:** Diálogo modal obligatorio al cargar la página con tarjetas de acceso rápido en un solo clic y botón *"Cerrar Sesión"* en el encabezado superior.
2. **Cifrado Criptográfico SHA-256 + Salt:** Web Crypto API con algoritmo RFC 6234 de respaldo y salting dinámico por cuenta.
3. **Consola de Reportes Analíticos (RF-06):** Franja de KPIs en vivo (Ventas Netas, Utilidad Bruta, Margen %, Ticket Promedio, Canales de Cobro).
4. **Filtros Temporales Dinámicos:** Hoy, Ayer, Últimos 7 Días, Mes Actual, Todo el Historial y rango personalizado Desde - Hasta.
5. **Balance Diario y Ranking Top 15:** Conciliación fiscal por jornada y ranking de productos más vendidos con margen comercial.
6. **Exportación Oficial a CSV:** 4 reportes descargables en CSV con codificación UTF-8 BOM (`\uFEFF`) para compatibilidad directa con Microsoft Excel.

---

### Estructura de Archivos del Entregable
```
ENTREGA/
├── index.html                                        # Aplicación POS & Inventario SPA
├── LOGO.jpg                                          # Logotipo oficial Papelería A B C
├── README.md                                         # Ficha técnica y guía de inicio
├── GUIA_DESPLIEGUE_Y_OPERACION_REPORTES_SEGURIDAD.md # Manual técnico y operativo de roles
├── DOCUMENTO_FASE_6_SPRINT_3_REPORTES_Y_SEGURIDAD.md # Documento descriptivo formal
├── DOCUMENTO_FASE_6_SPRINT_3_REPORTES_Y_SEGURIDAD.pdf# Documento oficial de entrega (5 páginas)
├── arquitectura_seguridad_rbac.png                   # Diagrama oficial de seguridad RBAC (200 DPI)
├── flujo_reportes_analitica.png                      # Diagrama oficial de reportes analíticos (200 DPI)
├── js/
│   ├── app.js                                        # Orquestador global y manejador de modales
│   ├── auth.js                                       # Seguridad, SHA-256, 3 perfiles RBAC y login
│   ├── pos.js                                        # Terminal Mostrador Punto de Venta
│   ├── inventory.js                                  # Control de existencias y adaptación por perfil
│   ├── catalog_masters.js                            # Marcas y categorías (exclusivo supervisor/admin)
│   ├── cash.js                                       # Control de turnos y corte de caja Z exclusivo
│   ├── reports.js                                    # Consola de analítica financiera y exportador CSV
│   ├── stock_movements.js                            # Entradas, mermas y kárdex auditable
│   ├── import_export.js                              # Carga masiva y respaldos JSON
│   └── db.js                                         # Motor relacional SQLite 3FN y persistencia
├── css/
│   └── styles.css                                    # Estilos institucionales y badges de roles
└── database/
    ├── papeleria_pos.sql                             # DDL relacional 3FN
    └── papeleria_pos.db                              # Base de datos SQLite
```
