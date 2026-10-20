# NOTA TÉCNICA DE INTEGRACIÓN Y RECONCILIACIÓN DE INTERFAZ GRÁFICA (UI/UX)
## FASE 4: SPRINT 1 — MÓDULO DE INVENTARIO
### PAPELERÍA A B C — DOCUMENTO PARA EL CLIENTE FINAL

---

| **Metadato** | **Detalle de la Nota** |
| :--- | :--- |
| **Cliente / Organización:** | **Papelería A B C** |
| **Documento Referenciado:** | `DOCUMENTO_FASE_4_SPRINT_1_MODULO_INVENTARIO.pdf` / `md` |
| **Carpeta Origen:** | `04/` (Semana 4: 19 al 22 de Octubre de 2026) |
| **Objetivo del Documento:** | Explicar al cliente final la integración del módulo transaccional de inventario desarrollado en esta semana dentro del shell maestro de punto de venta (POS) en la carpeta consolidada `ENTREGA/`. |
| **Destinatarios:** | Dirección General, Propietario de Papelería A B C y Evaluadores del Proyecto. |

---

## 1. OBJETIVO CONTRACTUAL DE LA FASE 4

En la **Semana 4**, el objetivo contractual estipulado en `Calendario.pdf` fue la entrega del **"Módulo de Inventario funcional"**. 

Para cumplir y verificar exhaustivamente este hito, el equipo técnico desarrolló en la carpeta `04/` una suite completa compuesta por:
* Programación del catálogo con semáforo cromático de stock crítico.
* Registro de compras a proveedores con actualización automática de costo ponderado.
* Control formal de mermas con justificación obligatoria y bloqueo si la cantidad supera el inventario físico.
* Kardex auditable inmutable con trazabilidad total.
* Carga masiva en CSV (BOM Excel) y respaldo local snapshot JSON en 1-clic.

Para aislar las pruebas de laboratorio de almacén durante esta semana, la interfaz de `04/index.html` organizó estas 6 herramientas en pestañas dedicadas de almacén.

---

## 2. INTEGRACIÓN CON EL SISTEMA MAESTRO EN `ENTREGA/`

Para responder a las observaciones del cliente sobre la coherencia visual con la propuesta de mostrador presentada en la **Fase 3**, se implementó la carpeta raíz [`ENTREGA/`](file:///C:/Users/gerac/Desktop/ISA/ENTREGA).

En este repositorio unificado:
1. **El Módulo de Inventario opera dentro del Shell Global:** La pestaña principal `📦 Almacén e Inventario` contiene ahora el motor funcional íntegro de la Fase 4 con sub-pestañas ergonómicas.
2. **Integración con Mostrador POS:** El punto de venta de 5 carritos concurrentes consume en tiempo real el catálogo de inventario. Al cobrar cualquier ticket, el sistema:
   * Descuenta inmediatamente las unidades vendidas en la tabla de productos.
   * Genera el asiento contable correspondiente en el `kardex_movimientos` con el folio del ticket y fecha ISO.
   * Si el stock de un cuaderno o bolígrafo cae por debajo del stock mínimo tras la venta, el semáforo rojo se activa inmediatamente en el panel de inventario.
3. **Integración con Control de Caja:** Los montos de las ventas cobradas se imputan automáticamente al turno de caja abierto, cuadrando el arqueo de cierre de jornada.

---

## 3. VALOR ENTREGADO AL CLIENTE FINAL

Con este esquema de desarrollo:
* Las carpetas semanales (`01/`, `02/`, `03/`, `04/`) preservan intacta la evidencia documental, financiera ($21,200.00 MXN en Fase 4 / $87,000.00 MXN acumulados) y técnica de cada hito contractual.
* La carpeta [`ENTREGA/`](file:///C:/Users/gerac/Desktop/ISA/ENTREGA) proporciona al cliente el software operativo listo para usarse en el mostrador de **Papelería A B C**.

---

*Papelería A B C — Compromiso con la excelencia funcional, operativa y documental.*
