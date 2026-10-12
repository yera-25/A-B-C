/**
 * db.js - Capa de Persistencia Local IndexedDB para "Papelería A B C"
 * Base de Datos: PapeleriaABC_POS_DB (v1)
 * Diseñado para latencia < 10ms, operación 100% offline y soporte ACID
 */

const DB_NAME = 'PapeleriaABC_POS_DB';
const DB_VERSION = 1;

let dbInstance = null;

// Catálogo semilla inicial de Papelería A B C
const SEED_CONFIG = {
    id_config: 1,
    nombre_comercial: 'Papelería A B C',
    razon_social: 'Papelería A B C S.A. de C.V.',
    rfc: 'PABC261005ABC',
    direccion: 'Av. Tecnológico #120, Col. Centro, C.P. 76000',
    telefono: '442-123-4567',
    email: 'contacto@papeleria-abc.mx',
    logo_url: 'assets/img/LOGO.jpg',
    leyenda_ticket: '¡Gracias por su compra en Papelería A B C! Calidad y servicio para su escuela y oficina.'
};

const SEED_CATEGORIAS = [
    { id_categoria: 1, nombre: 'Escolar y Escritura', descripcion: 'Lápices, plumas, gomas, sacapuntas y reglas' },
    { id_categoria: 2, nombre: 'Papeles y Cuadernos', descripcion: 'Cuadernos profesionales, libretas, hojas bond y cartulinas' },
    { id_categoria: 3, nombre: 'Manualidades y Adhesivos', descripcion: 'Tijeras, pegamentos, silicones, plastilina y foamy' },
    { id_categoria: 4, nombre: 'Oficina y Archivo', descripcion: 'Folders, clips, grapas, marcadores y correctores' },
    { id_categoria: 5, nombre: 'Servicios de Copiado', descripcion: 'Copias, impresiones láser, enmicados y engargolados' }
];

const SEED_PRODUCTOS = [
    // 1. Artículos que permiten desglose (Empaque -> Piezas)
    {
        id_producto: 1,
        codigo_barras: '7501000100128',
        sku: 'BIC-AZ-C12',
        nombre: 'Caja Bolígrafo Bic Cristal Azul (12 pzas)',
        id_categoria: 1,
        precio_compra: 45.00,
        precio_venta_menudeo: 65.00,
        precio_venta_mayoreo: 60.00,
        stock_actual: 15,
        stock_minimo: 3,
        es_servicio: false,
        permite_desglose: true,
        unidad: 'Caja'
    },
    {
        id_producto: 2,
        codigo_barras: '7501000100135',
        sku: 'BIC-AZ-PZA',
        nombre: 'Bolígrafo Bic Cristal Azul Suelto (1 pza)',
        id_categoria: 1,
        precio_compra: 3.75,
        precio_venta_menudeo: 7.00,
        precio_venta_mayoreo: 6.00,
        stock_actual: 34,
        stock_minimo: 12,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 3,
        codigo_barras: '7501000100203',
        sku: 'PAP-SC-500',
        nombre: 'Paquete Hojas Blancas Bond Carta Scribe (500 Hojas)',
        id_categoria: 2,
        precio_compra: 85.00,
        precio_venta_menudeo: 120.00,
        precio_venta_mayoreo: 110.00,
        stock_actual: 22,
        stock_minimo: 5,
        es_servicio: false,
        permite_desglose: true,
        unidad: 'Paquete'
    },
    {
        id_producto: 4,
        codigo_barras: '7501000100210',
        sku: 'PAP-SC-SUEL',
        nombre: 'Hoja Blanca Bond Carta Suelta (Insumo / Venta)',
        id_categoria: 2,
        precio_compra: 0.17,
        precio_venta_menudeo: 0.50,
        precio_venta_mayoreo: 0.35,
        stock_actual: 380,
        stock_minimo: 100,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Hoja'
    },
    // 2. Artículos escolares regulares
    {
        id_producto: 5,
        codigo_barras: '7501000100319',
        sku: 'CUA-SC-100R',
        nombre: 'Cuaderno Profesional Scribe Raya 100 Hojas',
        id_categoria: 2,
        precio_compra: 22.00,
        precio_venta_menudeo: 35.00,
        precio_venta_mayoreo: 30.00,
        stock_actual: 45,
        stock_minimo: 10,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 6,
        codigo_barras: '7501000100326',
        sku: 'CUA-SC-100C',
        nombre: 'Cuaderno Profesional Scribe Cuadro Grande 100 Hojas',
        id_categoria: 2,
        precio_compra: 22.00,
        precio_venta_menudeo: 35.00,
        precio_venta_mayoreo: 30.00,
        stock_actual: 50,
        stock_minimo: 10,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 7,
        codigo_barras: '7501000100418',
        sku: 'LAP-DIX-NO2',
        nombre: 'Lápiz de Grafito Dixon Ticonderoga #2',
        id_categoria: 1,
        precio_compra: 4.50,
        precio_venta_menudeo: 8.50,
        precio_venta_mayoreo: 7.00,
        stock_actual: 68,
        stock_minimo: 15,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 8,
        codigo_barras: '7501000100425',
        sku: 'GOM-FAC-M20',
        nombre: 'Goma de Borrar Factis M20 Migajón',
        id_categoria: 1,
        precio_compra: 3.50,
        precio_venta_menudeo: 7.00,
        precio_venta_mayoreo: 6.00,
        stock_actual: 40,
        stock_minimo: 8,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 9,
        codigo_barras: '7501000100517',
        sku: 'TIJ-BAR-13C',
        nombre: 'Tijeras Escolares Barrilito Punta Roma 13cm',
        id_categoria: 3,
        precio_compra: 14.00,
        precio_venta_menudeo: 24.00,
        precio_venta_mayoreo: 20.00,
        stock_actual: 25,
        stock_minimo: 6,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 10,
        codigo_barras: '7501000100524',
        sku: 'PEG-PRI-21G',
        nombre: 'Lápiz Adhesivo Pritt 21g',
        id_categoria: 3,
        precio_compra: 18.50,
        precio_venta_menudeo: 30.00,
        precio_venta_mayoreo: 26.00,
        stock_actual: 32,
        stock_minimo: 8,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 11,
        codigo_barras: '7501000100616',
        sku: 'PLU-CRA-12C',
        nombre: 'Plumones Crayola Lavables Delgados 12 Colores',
        id_categoria: 1,
        precio_compra: 48.00,
        precio_venta_menudeo: 75.00,
        precio_venta_mayoreo: 68.00,
        stock_actual: 18,
        stock_minimo: 4,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Caja'
    },
    {
        id_producto: 12,
        codigo_barras: '7501000100623',
        sku: 'COL-MAP-24C',
        nombre: 'Colores de Madera Maped Color Peps 24 pzas',
        id_categoria: 1,
        precio_compra: 78.00,
        precio_venta_menudeo: 115.00,
        precio_venta_mayoreo: 105.00,
        stock_actual: 14,
        stock_minimo: 3,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Caja'
    },
    {
        id_producto: 13,
        codigo_barras: '7501000100715',
        sku: 'REG-PLA-30C',
        nombre: 'Regla de Plástico Transparente 30cm Mae',
        id_categoria: 1,
        precio_compra: 4.00,
        precio_venta_menudeo: 9.00,
        precio_venta_mayoreo: 7.50,
        stock_actual: 35,
        stock_minimo: 10,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 14,
        codigo_barras: '7501000100722',
        sku: 'SAC-MET-MAP',
        nombre: 'Sacapuntas Metálico Individual Maped',
        id_categoria: 1,
        precio_compra: 5.50,
        precio_venta_menudeo: 11.00,
        precio_venta_mayoreo: 9.00,
        stock_actual: 42,
        stock_minimo: 12,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 15,
        codigo_barras: '7501000100814',
        sku: 'FOL-MAN-CTA',
        nombre: 'Folder Manila Tamaño Carta (Pieza)',
        id_categoria: 4,
        precio_compra: 1.80,
        precio_venta_menudeo: 4.50,
        precio_venta_mayoreo: 3.50,
        stock_actual: 75,
        stock_minimo: 20,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    {
        id_producto: 16,
        codigo_barras: '7501000100821',
        sku: 'MIC-TER-CTA',
        nombre: 'Mica Térmica para Enmicar Carta (Insumo)',
        id_categoria: 4,
        precio_compra: 3.00,
        precio_venta_menudeo: 6.00,
        precio_venta_mayoreo: 5.00,
        stock_actual: 80,
        stock_minimo: 15,
        es_servicio: false,
        permite_desglose: false,
        unidad: 'Pieza'
    },
    // 3. Servicios (RF-03: copias, impresiones, enmicados)
    {
        id_producto: 17,
        codigo_barras: '7501000100913',
        sku: 'SRV-COP-BN',
        nombre: 'Servicio: Copia Fotostática B/N Carta',
        id_categoria: 5,
        precio_compra: 0.25,
        precio_venta_menudeo: 1.50,
        precio_venta_mayoreo: 1.00,
        stock_actual: 9999,
        stock_minimo: 0,
        es_servicio: true,
        permite_desglose: false,
        unidad: 'Servicio'
    },
    {
        id_producto: 18,
        codigo_barras: '7501000100920',
        sku: 'SRV-IMP-COL',
        nombre: 'Servicio: Impresión Láser Color Carta',
        id_categoria: 5,
        precio_compra: 1.20,
        precio_venta_menudeo: 6.00,
        precio_venta_mayoreo: 4.50,
        stock_actual: 9999,
        stock_minimo: 0,
        es_servicio: true,
        permite_desglose: false,
        unidad: 'Servicio'
    },
    {
        id_producto: 19,
        codigo_barras: '7501000100937',
        sku: 'SRV-ENM-CTA',
        nombre: 'Servicio: Enmicado Térmico Tamaño Carta',
        id_categoria: 5,
        precio_compra: 3.50,
        precio_venta_menudeo: 18.00,
        precio_venta_mayoreo: 15.00,
        stock_actual: 9999,
        stock_minimo: 0,
        es_servicio: true,
        permite_desglose: false,
        unidad: 'Servicio'
    }
];

const SEED_CONVERSIONES = [
    {
        id_conversion: 1,
        id_producto_empaque: 1, // Caja Bolígrafo Bic x12
        id_producto_pieza: 2,   // Bolígrafo Bic Suelto
        factor_multiplicador: 12,
        descripcion: '1 Caja de Bolígrafos Bic genera 12 piezas individuales'
    },
    {
        id_conversion: 2,
        id_producto_empaque: 3, // Paquete Hojas 500
        id_producto_pieza: 4,   // Hoja suelta
        factor_multiplicador: 500,
        descripcion: '1 Paquete de 500 hojas bond genera 500 hojas individuales'
    }
];

const SEED_SERVICIOS_INSUMOS = [
    {
        id_servicio_insumo: 1,
        id_servicio: 17, // Copia B/N
        id_insumo: 4,    // Hoja Blanca Bond Carta Suelta
        cantidad_consumida: 1.00
    },
    {
        id_servicio_insumo: 2,
        id_servicio: 18, // Impresión Color
        id_insumo: 4,    // Hoja Blanca Bond Carta Suelta
        cantidad_consumida: 1.00
    },
    {
        id_servicio_insumo: 3,
        id_servicio: 19, // Enmicado Carta
        id_insumo: 16,   // Mica Térmica
        cantidad_consumida: 1.00
    }
];

// Helper: Abrir o inicializar conexión a IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // 1. Configuración del Negocio
            if (!db.objectStoreNames.contains('configuracion_negocio')) {
                db.createObjectStore('configuracion_negocio', { keyPath: 'id_config' });
            }

            // 2. Categorías
            if (!db.objectStoreNames.contains('categorias')) {
                const store = db.createObjectStore('categorias', { keyPath: 'id_categoria', autoIncrement: true });
                store.createIndex('nombre', 'nombre', { unique: false });
            }

            // 3. Productos (Catálogo nuclear)
            if (!db.objectStoreNames.contains('productos')) {
                const store = db.createObjectStore('productos', { keyPath: 'id_producto', autoIncrement: true });
                store.createIndex('codigo_barras', 'codigo_barras', { unique: true });
                store.createIndex('sku', 'sku', { unique: true });
                store.createIndex('nombre', 'nombre', { unique: false });
                store.createIndex('id_categoria', 'id_categoria', { unique: false });
            }

            // 4. Ventas
            if (!db.objectStoreNames.contains('ventas')) {
                const store = db.createObjectStore('ventas', { keyPath: 'id_venta', autoIncrement: true });
                store.createIndex('folio_ticket', 'folio_ticket', { unique: true });
                store.createIndex('fecha_hora', 'fecha_hora', { unique: false });
                store.createIndex('id_turno', 'id_turno', { unique: false });
            }

            // 5. Detalle de Ventas
            if (!db.objectStoreNames.contains('detalle_ventas')) {
                const store = db.createObjectStore('detalle_ventas', { keyPath: 'id_detalle', autoIncrement: true });
                store.createIndex('id_venta', 'id_venta', { unique: false });
                store.createIndex('id_producto', 'id_producto', { unique: false });
            }

            // 6. Turnos de Caja
            if (!db.objectStoreNames.contains('turnos_caja')) {
                const store = db.createObjectStore('turnos_caja', { keyPath: 'id_turno', autoIncrement: true });
                store.createIndex('estado', 'estado', { unique: false });
            }

            // 7. Movimientos de Caja
            if (!db.objectStoreNames.contains('movimientos_caja')) {
                const store = db.createObjectStore('movimientos_caja', { keyPath: 'id_movimiento', autoIncrement: true });
                store.createIndex('id_turno', 'id_turno', { unique: false });
            }

            // 8. Kardex de Movimientos
            if (!db.objectStoreNames.contains('kardex_movimientos')) {
                const store = db.createObjectStore('kardex_movimientos', { keyPath: 'id_kardex', autoIncrement: true });
                store.createIndex('id_producto', 'id_producto', { unique: false });
                store.createIndex('fecha_hora', 'fecha_hora', { unique: false });
                store.createIndex('tipo_movimiento', 'tipo_movimiento', { unique: false });
            }

            // 9. Conversiones de Empaque
            if (!db.objectStoreNames.contains('conversiones_empaque')) {
                const store = db.createObjectStore('conversiones_empaque', { keyPath: 'id_conversion', autoIncrement: true });
                store.createIndex('id_producto_empaque', 'id_producto_empaque', { unique: false });
            }

            // 10. Servicios e Insumos
            if (!db.objectStoreNames.contains('servicios_insumos')) {
                const store = db.createObjectStore('servicios_insumos', { keyPath: 'id_servicio_insumo', autoIncrement: true });
                store.createIndex('id_servicio', 'id_servicio', { unique: false });
            }
        };

        request.onsuccess = async (event) => {
            dbInstance = event.target.result;
            await seedInitialData(dbInstance);
            resolve(dbInstance);
        };

        request.onerror = (event) => {
            console.error('Error al abrir IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Poblar datos semilla si la base de datos está vacía
async function seedInitialData(db) {
    return new Promise((resolve) => {
        const tx = db.transaction(['configuracion_negocio', 'categorias', 'productos', 'conversiones_empaque', 'servicios_insumos', 'turnos_caja'], 'readwrite');
        
        const configStore = tx.objectStore('configuracion_negocio');
        const countReq = configStore.count();

        countReq.onsuccess = () => {
            if (countReq.result === 0) {
                console.log('Sembrando datos maestros de Papelería A B C...');
                // 1. Config
                configStore.add(SEED_CONFIG);

                // 2. Categorías
                const catStore = tx.objectStore('categorias');
                SEED_CATEGORIAS.forEach(c => catStore.add(c));

                // 3. Productos
                const prodStore = tx.objectStore('productos');
                SEED_PRODUCTOS.forEach(p => prodStore.add(p));

                // 4. Conversiones
                const convStore = tx.objectStore('conversiones_empaque');
                SEED_CONVERSIONES.forEach(cv => convStore.add(cv));

                // 5. Insumos Servicios
                const srvStore = tx.objectStore('servicios_insumos');
                SEED_SERVICIOS_INSUMOS.forEach(si => srvStore.add(si));

                // 6. Turno Inicial Activo
                const turnoStore = tx.objectStore('turnos_caja');
                turnoStore.add({
                    id_turno: 1,
                    usuario: 'Gerardo Cabrera Morales',
                    fecha_apertura: new Date().toISOString(),
                    monto_inicial_fondo: 500.00,
                    total_ventas_efectivo: 0.00,
                    total_ventas_tarjeta: 0.00,
                    total_entradas_manuales: 0.00,
                    total_salidas_manuales: 0.00,
                    estado: 'ABIERTO'
                });
            }
            resolve();
        };

        tx.onerror = () => resolve();
    });
}

// -------------------------------------------------------------
// OPERACIONES DE NEGOCIO Y PERSISTENCIA
// -------------------------------------------------------------

// Obtener Configuración Institucional
async function getConfiguracion() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['configuracion_negocio'], 'readonly');
        const req = tx.objectStore('configuracion_negocio').get(1);
        req.onsuccess = () => resolve(req.result || SEED_CONFIG);
        req.onerror = () => reject(req.error);
    });
}

// Obtener Todos los Productos con su Nombre de Categoría
async function getProductos() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['productos', 'categorias'], 'readonly');
        const prodReq = tx.objectStore('productos').getAll();
        const catReq = tx.objectStore('categorias').getAll();

        tx.oncomplete = () => {
            const categoriasMap = {};
            catReq.result.forEach(c => { categoriasMap[c.id_categoria] = c.nombre; });

            const prods = prodReq.result.map(p => ({
                ...p,
                categoria_nombre: categoriasMap[p.id_categoria] || 'General'
            }));
            resolve(prods);
        };
        tx.onerror = () => reject(tx.error);
    });
}

// Búsqueda In-Memory / Indexada por Código de Barras (<10ms)
async function buscarProductoPorCodigo(codigo) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['productos'], 'readonly');
        const store = tx.objectStore('productos');
        const index = store.index('codigo_barras');
        const req = index.get(codigo.trim());

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
}

// Registrar Transacción Completa de Venta (ACID)
async function registrarVentaTransaccional(ventaData, items) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction([
            'ventas',
            'detalle_ventas',
            'productos',
            'kardex_movimientos',
            'turnos_caja',
            'servicios_insumos'
        ], 'readwrite');

        const ventaStore = tx.objectStore('ventas');
        const detalleStore = tx.objectStore('detalle_ventas');
        const prodStore = tx.objectStore('productos');
        const kardexStore = tx.objectStore('kardex_movimientos');
        const turnoStore = tx.objectStore('turnos_caja');
        const srvInsumoStore = tx.objectStore('servicios_insumos');

        const fechaNow = new Date().toISOString();
        const folio = 'TICK-' + Date.now().toString().slice(-6);

        const nuevaVenta = {
            folio_ticket: folio,
            fecha_hora: fechaNow,
            id_turno: ventaData.id_turno || 1,
            usuario: ventaData.usuario || 'Gerardo Cabrera',
            numero_carrito: ventaData.numero_carrito || 1,
            subtotal: ventaData.subtotal,
            iva: ventaData.iva,
            total: ventaData.total,
            metodo_pago: ventaData.metodo_pago,
            efectivo_recibido: ventaData.efectivo_recibido,
            cambio_devuelto: ventaData.cambio_devuelto
        };

        const vReq = ventaStore.add(nuevaVenta);

        vReq.onsuccess = (e) => {
            const idVenta = e.target.result;

            // Procesar cada renglón de la venta
            items.forEach(item => {
                detalleStore.add({
                    id_venta: idVenta,
                    id_producto: item.id_producto,
                    nombre_producto: item.nombre,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.subtotal
                });

                // Si es un producto físico, descontar stock directo y registrar Kardex
                if (!item.es_servicio) {
                    const getPReq = prodStore.get(item.id_producto);
                    getPReq.onsuccess = () => {
                        const prod = getPReq.result;
                        if (prod) {
                            const stockAnt = prod.stock_actual;
                            prod.stock_actual = Math.max(0, prod.stock_actual - item.cantidad);
                            prodStore.put(prod);

                            kardexStore.add({
                                fecha_hora: fechaNow,
                                id_producto: prod.id_producto,
                                nombre_producto: prod.nombre,
                                tipo_movimiento: 'VENTA',
                                cantidad: item.cantidad,
                                stock_anterior: stockAnt,
                                stock_posterior: prod.stock_actual,
                                referencia: `Venta ${folio}`
                            });
                        }
                    };
                } else {
                    // Si es servicio (RF-03), descontar insumos vinculados
                    const srvIdx = srvInsumoStore.index('id_servicio');
                    const insReq = srvIdx.getAll(item.id_producto);
                    insReq.onsuccess = () => {
                        const insumos = insReq.result;
                        insumos.forEach(ins => {
                            const cantTotalDeducir = ins.cantidad_consumida * item.cantidad;
                            const getInsumoReq = prodStore.get(ins.id_insumo);
                            getInsumoReq.onsuccess = () => {
                                const insumoProd = getInsumoReq.result;
                                if (insumoProd) {
                                    const stockAnt = insumoProd.stock_actual;
                                    insumoProd.stock_actual = Math.max(0, insumoProd.stock_actual - cantTotalDeducir);
                                    prodStore.put(insumoProd);

                                    kardexStore.add({
                                        fecha_hora: fechaNow,
                                        id_producto: insumoProd.id_producto,
                                        nombre_producto: insumoProd.nombre,
                                        tipo_movimiento: 'CONSUMO_SERVICIO',
                                        cantidad: cantTotalDeducir,
                                        stock_anterior: stockAnt,
                                        stock_posterior: insumoProd.stock_actual,
                                        referencia: `Insumo en ${item.nombre} (${folio})`
                                    });
                                }
                            };
                        });
                    };
                }
            });

            // Actualizar saldo del turno de caja
            const tReq = turnoStore.get(nuevaVenta.id_turno);
            tReq.onsuccess = () => {
                const turno = tReq.result;
                if (turno) {
                    if (nuevaVenta.metodo_pago === 'EFECTIVO') {
                        turno.total_ventas_efectivo = (turno.total_ventas_efectivo || 0) + nuevaVenta.total;
                    } else {
                        turno.total_ventas_tarjeta = (turno.total_ventas_tarjeta || 0) + nuevaVenta.total;
                    }
                    turnoStore.put(turno);
                }
            };
        };

        tx.oncomplete = () => {
            resolve({
                exito: true,
                folio: folio,
                fecha: fechaNow,
                total: ventaData.total
            });
        };

        tx.onerror = () => {
            console.error('Error en transacción de venta:', tx.error);
            reject(tx.error);
        };
    });
}

// Ejecutar Desglose de Caja a Pieza (RF-05 / CU-02)
async function ejecutarDesgloseEmpaque(idProductoEmpaque, cantidadCajas = 1) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['productos', 'conversiones_empaque', 'kardex_movimientos'], 'readwrite');
        const prodStore = tx.objectStore('productos');
        const convStore = tx.objectStore('conversiones_empaque');
        const kardexStore = tx.objectStore('kardex_movimientos');

        const convIdx = convStore.index('id_producto_empaque');
        const convReq = convIdx.get(idProductoEmpaque);

        convReq.onsuccess = () => {
            const conversion = convReq.result;
            if (!conversion) {
                reject(new Error('No existe regla de conversión configurada para este producto empaque.'));
                return;
            }

            const getEmpaqueReq = prodStore.get(conversion.id_producto_empaque);
            const getPiezaReq = prodStore.get(conversion.id_producto_pieza);

            let empaqueProd = null;
            let piezaProd = null;

            getEmpaqueReq.onsuccess = () => {
                empaqueProd = getEmpaqueReq.result;
                if (empaqueProd.stock_actual < cantidadCajas) {
                    reject(new Error(`Stock insuficiente: sólo hay ${empaqueProd.stock_actual} cajas disponibles.`));
                    return;
                }

                getPiezaReq.onsuccess = () => {
                    piezaProd = getPiezaReq.result;
                    const piezasAGenerar = conversion.factor_multiplicador * cantidadCajas;
                    const fechaNow = new Date().toISOString();

                    // 1. Descontar caja
                    const stockEmpaqueAnt = empaqueProd.stock_actual;
                    empaqueProd.stock_actual -= cantidadCajas;
                    prodStore.put(empaqueProd);

                    kardexStore.add({
                        fecha_hora: fechaNow,
                        id_producto: empaqueProd.id_producto,
                        nombre_producto: empaqueProd.nombre,
                        tipo_movimiento: 'DESGLOSE_EMPAQUE_SALIDA',
                        cantidad: cantidadCajas,
                        stock_anterior: stockEmpaqueAnt,
                        stock_posterior: empaqueProd.stock_actual,
                        referencia: `Desglose de ${cantidadCajas} caja(s) a ${piezasAGenerar} pzas`
                    });

                    // 2. Aumentar piezas sueltas
                    const stockPiezaAnt = piezaProd.stock_actual;
                    piezaProd.stock_actual += piezasAGenerar;
                    prodStore.put(piezaProd);

                    kardexStore.add({
                        fecha_hora: fechaNow,
                        id_producto: piezaProd.id_producto,
                        nombre_producto: piezaProd.nombre,
                        tipo_movimiento: 'DESGLOSE_PIEZA_ENTRADA',
                        cantidad: piezasAGenerar,
                        stock_anterior: stockPiezaAnt,
                        stock_posterior: piezaProd.stock_actual,
                        referencia: `Ingreso por desglose de ${empaqueProd.nombre}`
                    });
                };
            };
        };

        tx.oncomplete = () => {
            resolve({
                exito: true,
                mensaje: `Desglose exitoso: se convirtieron ${cantidadCajas} empaque(s) en piezas sueltas.`
            });
        };

        tx.onerror = () => reject(tx.error);
    });
}

// Consultar Historial de Movimientos Kardex (RF-07)
async function getHistorialKardex() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['kardex_movimientos'], 'readonly');
        const store = tx.objectStore('kardex_movimientos');
        const req = store.getAll();

        req.onsuccess = () => {
            const log = req.result.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
            resolve(log);
        };
        req.onerror = () => reject(req.error);
    });
}

// Obtener Turno Activo de Caja (RF-08)
async function getTurnoActivo() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['turnos_caja'], 'readonly');
        const store = tx.objectStore('turnos_caja');
        const idx = store.index('estado');
        const req = idx.get('ABIERTO');

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
}

// Exportar Base de Datos Completa a JSON (Respaldo en 1 Clic - RNF-06)
async function exportarRespaldoJSON() {
    const db = await initDB();
    const stores = ['configuracion_negocio', 'categorias', 'productos', 'ventas', 'detalle_ventas', 'turnos_caja', 'kardex_movimientos', 'conversiones_empaque', 'servicios_insumos'];
    const backupData = {
        sistema: 'Sistema POS Papelería A B C',
        fecha_respaldo: new Date().toISOString(),
        version_db: DB_VERSION,
        data: {}
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(stores, 'readonly');
        stores.forEach(sName => {
            const req = tx.objectStore(sName).getAll();
            req.onsuccess = () => { backupData.data[sName] = req.result; };
        });

        tx.oncomplete = () => resolve(JSON.stringify(backupData, null, 2));
        tx.onerror = () => reject(tx.error);
    });
}

// Exponer en el objeto global para acceso directo desde módulos
window.POS_DB = {
    initDB,
    getConfiguracion,
    getProductos,
    buscarProductoPorCodigo,
    registrarVentaTransaccional,
    ejecutarDesgloseEmpaque,
    getHistorialKardex,
    getTurnoActivo,
    exportarRespaldoJSON
};
