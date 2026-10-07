/**
 * =============================================================================
 * SISTEMA POS PARA "PAPELERÍA A B C" — MODELO DE PERSISTENCIA LOCAL (INDEXEDDB)
 * Fase 2: Análisis y Modelado de Datos
 * Negocio: Papelería A B C
 * Equipo: Gerardo Cabrera Morales, Astrid García Ramírez, Daniel Parada Gonzalez
 * =============================================================================
 * 
 * Implementación del esquema de base de datos relacional 3FN adaptado a IndexedDB
 * (usando el estándar Dexie.js o la API nativa de IndexedDB).
 * Cumple con RNF-01 (<10ms latencia) y RNF-04 (>500MB capacidad offline).
 */

const DB_NAME = 'PapeleriaABC_POS_DB';
const DB_VERSION = 2;

/**
 * Definición del Esquema de Object Stores e Índices para Papelería A B C
 * Sintaxis compatible con Dexie.js y mapeo nativo:
 * - ++id : Clave primaria autoincremental
 * - campo : Índice simple B-Tree
 * - &campo : Índice único (Unique)
 * - *campo : MultiEntry index (arrays/tags)
 * - [c1+c2] : Índice compuesto
 */
export const dbSchema = {
    // 0. Identidad y Configuración Institucional de Papelería A B C
    configuracion_negocio: '++id_config, nombre_comercial, rfc',

    // 1. Roles y Permisos
    roles: '++id_rol, &nombre, created_at',

    // 2. Usuarios del Sistema POS
    usuarios: '++id_usuario, id_rol, &username, activo, created_at',

    // 3. Categorías de Papelería
    categorias: '++id_categoria, &nombre, activo',

    // 4. Marcas Comerciales
    marcas: '++id_marca, &nombre, activo',

    // 5. Unidades de Comercialización
    unidades_medida: '++id_unidad, &clave, nombre',

    // 6. Proveedores
    proveedores: '++id_proveedor, razon_social, &rfc, telefono, activo',

    // 7. Productos e Insumos (Catálogo Maestro Papelería A B C)
    // Índices estratégicos para búsqueda instantánea <10ms en mostrador
    productos: '++id_producto, &codigo_barras, &sku, nombre, id_categoria, id_marca, id_unidad, stock_actual, stock_minimo, es_servicio, permite_desglose, activo',

    // 8. Reglas de Desglose Empaque a Pieza (RF-05 / CU-02)
    conversiones_empaque: '++id_conversion, id_producto_empaque, id_producto_pieza, [id_producto_empaque+id_producto_pieza], activo',

    // 9. Relación Insumos por Servicio de Copiado Papelería A B C (RF-03)
    servicios_insumos: '++id_servicio_insumo, id_servicio, id_producto_insumo, activo',

    // 10. Clientes (Mostrador, Escuelas, Mayoristas)
    clientes: '++id_cliente, nombre_razon_social, &rfc_curp, tipo_cliente, activo',

    // 11. Turnos y Control de Caja (RF-08)
    turnos_caja: '++id_turno, id_usuario, fecha_apertura, fecha_cierre, estado',

    // 12. Movimientos de Caja Chica
    movimientos_caja: '++id_mov_caja, id_turno, id_usuario, tipo, fecha_hora',

    // 13. Ventas (Cabecera POS con multicarrito 1 a 5)
    ventas: '++id_venta, &folio_ticket, fecha_hora, id_turno, id_usuario, id_cliente, numero_carrito, estado',

    // 14. Detalle de Ventas
    detalle_ventas: '++id_detalle, id_venta, id_producto, tipo_item',

    // 15. Kardex de Movimientos (RF-07 - Auditoría de existencias)
    kardex_movimientos: '++id_kardex, fecha_hora, id_producto, tipo_movimiento, id_usuario, [id_producto+fecha_hora]',

    // 16. Compras / Entradas de Mercancía
    compras: '++id_compra, folio_factura, id_proveedor, id_usuario, fecha_compra, estado',

    // 17. Detalle de Compras
    detalle_compras: '++id_detalle_compra, id_compra, id_producto'
};

/**
 * Datos Iniciales de Identidad Institucional
 */
export const defaultBusinessConfig = {
    nombre_comercial: 'Papelería A B C',
    razon_social: 'Papelería A B C S.A. de C.V.',
    rfc: 'ABC850101XYZ',
    direccion: 'Av. Principal #45, Col. Centro, C.P. 06000',
    telefono: '555-987-6543',
    email: 'contacto@papeleria-abc.com',
    sitio_web: 'www.papeleria-abc.com',
    logo_url: 'LOGO.jpg',
    leyenda_ticket: '¡Gracias por su compra en Papelería A B C! Calidad y surtido escolar y de oficina.'
};

/**
 * Inicializador de Base de Datos Nativa IndexedDB (Sin dependencias externas)
 * Permite ejecutar el sistema abriendo directamente index.html en Chrome/Edge/Firefox
 */
export function openNativeDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Creación de Object Stores e Índices
            Object.entries(dbSchema).forEach(([storeName, schemaDef]) => {
                if (!db.objectStoreNames.contains(storeName)) {
                    const fields = schemaDef.split(',').map(s => s.trim());
                    const keyDef = fields[0];
                    let keyOptions = {};

                    if (keyDef.startsWith('++')) {
                        keyOptions = { keyPath: keyDef.replace('++', ''), autoIncrement: true };
                    } else {
                        keyOptions = { keyPath: keyDef };
                    }

                    const store = db.createObjectStore(storeName, keyOptions);

                    // Crear índices secundarios
                    fields.slice(1).forEach(idx => {
                        let isUnique = false;
                        let fieldName = idx;

                        if (idx.startsWith('&')) {
                            isUnique = true;
                            fieldName = idx.substring(1);
                        }

                        if (fieldName.startsWith('[') && fieldName.endsWith(']')) {
                            // Índice compuesto
                            const compoundFields = fieldName.slice(1, -1).split('+').map(f => f.trim());
                            store.createIndex(fieldName, compoundFields, { unique: isUnique });
                        } else {
                            store.createIndex(fieldName, fieldName, { unique: isUnique });
                        }
                    });
                }
            });
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            // Verificar si configuracion_negocio tiene el registro de Papelería A B C
            const tx = db.transaction(['configuracion_negocio'], 'readwrite');
            const store = tx.objectStore('configuracion_negocio');
            const countReq = store.count();
            countReq.onsuccess = () => {
                if (countReq.result === 0) {
                    store.add(defaultBusinessConfig);
                }
            };
            resolve(db);
        };

        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * Métodos de Operación Transaccional para la Web App Local de Papelería A B C
 */
export const DBService = {
    /**
     * Búsqueda in-memory por código de barras (<10ms) (RF-01)
     */
    async buscarPorCodigoBarras(db, codigo) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['productos'], 'readonly');
            const store = tx.objectStore('productos');
            const index = store.index('codigo_barras');
            const request = index.get(codigo);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Registro de Venta Atómica con Descuento de Stock y Kardex (RF-01, RF-07)
     */
    async registrarVentaCompleta(db, ventaData, itemsDetalle, usuarioId, turnoId) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['ventas', 'detalle_ventas', 'productos', 'kardex_movimientos'], 'readwrite');
            
            tx.oncomplete = () => resolve({ success: true, folio: ventaData.folio_ticket });
            tx.onerror = () => reject(tx.error);

            const ventasStore = tx.objectStore('ventas');
            const detalleStore = tx.objectStore('detalle_ventas');
            const prodStore = tx.objectStore('productos');
            const kardexStore = tx.objectStore('kardex_movimientos');

            // 1. Guardar Cabecera de Venta
            const ventaReq = ventasStore.add({
                ...ventaData,
                id_turno: turnoId,
                id_usuario: usuarioId,
                fecha_hora: new Date().toISOString()
            });

            ventaReq.onsuccess = (e) => {
                const idVentaGenerado = e.target.result;

                // 2. Procesar cada renglón del ticket de Papelería A B C
                itemsDetalle.forEach(item => {
                    detalleStore.add({
                        id_venta: idVentaGenerado,
                        id_producto: item.id_producto,
                        tipo_item: item.tipo_item || 'PRODUCTO',
                        cantidad: item.cantidad,
                        precio_unitario: item.precio_unitario,
                        subtotal_linea: item.cantidad * item.precio_unitario
                    });

                    // 3. Si no es servicio, descontar inventario y registrar en Kardex
                    if (!item.es_servicio) {
                        const prodReq = prodStore.get(item.id_producto);
                        prodReq.onsuccess = () => {
                            const prod = prodReq.result;
                            if (prod) {
                                const stockAnterior = prod.stock_actual;
                                const stockPosterior = stockAnterior - item.cantidad;
                                prod.stock_actual = stockPosterior;
                                prodStore.put(prod);

                                kardexStore.add({
                                    fecha_hora: new Date().toISOString(),
                                    id_producto: item.id_producto,
                                    tipo_movimiento: 'VENTA',
                                    cantidad: item.cantidad,
                                    stock_anterior: stockAnterior,
                                    stock_posterior: stockPosterior,
                                    costo_unitario: prod.precio_compra,
                                    referencia_tipo: 'VENTA',
                                    referencia_id: idVentaGenerado,
                                    motivo_detalle: `Venta POS Folio ${ventaData.folio_ticket} - Papelería A B C`,
                                    id_usuario: usuarioId
                                });
                            }
                        };
                    }
                });
            };
        });
    },

    /**
     * Rutina de Conversión de Empaque a Pieza (RF-05 / CU-02)
     */
    async ejecutarDesgloseEmpaque(db, idProductoEmpaque, cantidadCajas, reglaConversion, usuarioId) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['productos', 'kardex_movimientos'], 'readwrite');
            tx.oncomplete = () => resolve({ success: true });
            tx.onerror = () => reject(tx.error);

            const prodStore = tx.objectStore('productos');
            const kardexStore = tx.objectStore('kardex_movimientos');

            // Descontar empaque
            const getCaja = prodStore.get(idProductoEmpaque);
            getCaja.onsuccess = () => {
                const caja = getCaja.result;
                const stockAntCaja = caja.stock_actual;
                caja.stock_actual -= cantidadCajas;
                prodStore.put(caja);

                kardexStore.add({
                    fecha_hora: new Date().toISOString(),
                    id_producto: idProductoEmpaque,
                    tipo_movimiento: 'DESGLOSE_EMPAQUE_SALIDA',
                    cantidad: cantidadCajas,
                    stock_anterior: stockAntCaja,
                    stock_posterior: caja.stock_actual,
                    costo_unitario: caja.precio_compra,
                    referencia_tipo: 'DESGLOSE',
                    motivo_detalle: `Desglose de ${cantidadCajas} empaques a piezas sueltas (Papelería A B C)`,
                    id_usuario: usuarioId
                });
            };

            // Incrementar piezas sueltas
            const totalPiezasNuevas = cantidadCajas * reglaConversion.piezas_por_empaque;
            const getPieza = prodStore.get(reglaConversion.id_producto_pieza);
            getPieza.onsuccess = () => {
                const pieza = getPieza.result;
                const stockAntPieza = pieza.stock_actual;
                pieza.stock_actual += totalPiezasNuevas;
                prodStore.put(pieza);

                kardexStore.add({
                    fecha_hora: new Date().toISOString(),
                    id_producto: reglaConversion.id_producto_pieza,
                    tipo_movimiento: 'DESGLOSE_PIEZA_ENTRADA',
                    cantidad: totalPiezasNuevas,
                    stock_anterior: stockAntPieza,
                    stock_posterior: pieza.stock_actual,
                    costo_unitario: reglaConversion.costo_prorrateado,
                    referencia_tipo: 'DESGLOSE',
                    motivo_detalle: `Ingreso por desglose de caja (+${totalPiezasNuevas} pzas en Papelería A B C)`,
                    id_usuario: usuarioId
                });
            };
        });
    }
};
