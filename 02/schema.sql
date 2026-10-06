-- =============================================================================
-- SISTEMA POS PARA "PAPELERÍA A B C" - SCRIPT DDL Y DATOS SEMILLA (FASE 2)
-- Base de Datos Normalizada en 3FN (Tercera Forma Normal)
-- Compatible con: SQLite 3, PostgreSQL 14+, MySQL 8.0+ / MariaDB
-- Negocio: Papelería A B C
-- Equipo: Gerardo Cabrera Morales, Astrid García Ramírez, Daniel Parada Gonzalez
-- =============================================================================

-- Habilitar integridad referencial para motores que lo requieran (ej. SQLite)
PRAGMA foreign_keys = ON;

-- -----------------------------------------------------------------------------
-- 1. IDENTIDAD DEL NEGOCIO Y CONFIGURACIÓN (PAPELERÍA A B C)
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS movimientos_caja;
DROP TABLE IF EXISTS turnos_caja;
DROP TABLE IF EXISTS servicios_insumos;
DROP TABLE IF EXISTS conversiones_empaque;
DROP TABLE IF EXISTS kardex_movimientos;
DROP TABLE IF EXISTS detalle_compras;
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS unidades_medida;
DROP TABLE IF EXISTS marcas;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS configuracion_negocio;

-- TABLA: configuracion_negocio
-- Parámetros e identidad institucional de la Papelería A B C para tickets y encabezados
CREATE TABLE configuracion_negocio (
    id_config INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_comercial VARCHAR(100) NOT NULL DEFAULT 'Papelería A B C',
    razon_social VARCHAR(150) NULL DEFAULT 'Papelería A B C S.A. de C.V.',
    rfc VARCHAR(13) NULL DEFAULT 'ABC850101XYZ',
    direccion TEXT NULL DEFAULT 'Av. Principal #45, Col. Centro',
    telefono VARCHAR(20) NULL DEFAULT '555-987-6543',
    email VARCHAR(100) NULL DEFAULT 'contacto@papeleria-abc.com',
    sitio_web VARCHAR(100) NULL DEFAULT 'www.papeleria-abc.com',
    logo_url VARCHAR(255) NULL DEFAULT 'LOGO.jpg',
    leyenda_ticket VARCHAR(255) NULL DEFAULT '¡Gracias por su compra en Papelería A B C! Visítenos pronto.',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. MÓDULO DE SEGURIDAD, USUARIOS Y ROLES
-- -----------------------------------------------------------------------------

-- TABLA: roles
-- Define los perfiles y niveles de autorización dentro del sistema local de Papelería A B C
CREATE TABLE roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    permisos_json TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: usuarios
-- Cuentas de acceso para cajeros, administradores y almacenistas de Papelería A B C
CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_rol INTEGER NOT NULL,
    nombre_completo VARCHAR(120) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    pin_cajero VARCHAR(6) NULL,
    activo BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- -----------------------------------------------------------------------------
-- 3. MÓDULO DE CATÁLOGO Y ESTRUCTURA DE ARTÍCULOS
-- -----------------------------------------------------------------------------

-- TABLA: categorias
-- Agrupación lógica de artículos y servicios de Papelería A B C
CREATE TABLE categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL,
    activo BOOLEAN NOT NULL DEFAULT 1
);

-- TABLA: marcas
-- Marcas y fabricantes comerciales en catálogo
CREATE TABLE marcas (
    id_marca INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT 1
);

-- TABLA: unidades_medida
-- Unidades de comercialización (Pieza, Caja, Paquete, Metro, Servicio, etc.)
CREATE TABLE unidades_medida (
    id_unidad INTEGER PRIMARY KEY AUTOINCREMENT,
    clave VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    permite_decimales BOOLEAN NOT NULL DEFAULT 0
);

-- TABLA: proveedores
-- Distribuidores mayoristas de papelería y suministros
CREATE TABLE proveedores (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    razon_social VARCHAR(150) NOT NULL,
    rfc VARCHAR(13) NULL UNIQUE,
    contacto_nombre VARCHAR(100) NULL,
    telefono VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    direccion TEXT NULL,
    activo BOOLEAN NOT NULL DEFAULT 1
);

-- TABLA: productos
-- Maestro de artículos, insumos y servicios de Papelería A B C (RF-01, RF-03, RF-05)
CREATE TABLE productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_barras VARCHAR(50) NOT NULL UNIQUE,
    sku VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    id_categoria INTEGER NOT NULL,
    id_marca INTEGER NOT NULL,
    id_unidad INTEGER NOT NULL,
    id_proveedor_habitual INTEGER NULL,
    precio_compra DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    precio_venta_menudeo DECIMAL(10,2) NOT NULL,
    precio_venta_mayoreo DECIMAL(10,2) NOT NULL,
    cantidad_mayoreo DECIMAL(10,2) NOT NULL DEFAULT 3.00,
    stock_actual DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_minimo DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    stock_maximo DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    ubicacion_anaquel VARCHAR(50) NULL,
    es_servicio BOOLEAN NOT NULL DEFAULT 0,
    permite_desglose BOOLEAN NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_marca) REFERENCES marcas(id_marca) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_unidad) REFERENCES unidades_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_proveedor_habitual) REFERENCES proveedores(id_proveedor) ON UPDATE CASCADE ON DELETE SET NULL,
    CHECK (precio_compra >= 0),
    CHECK (precio_venta_menudeo >= 0),
    CHECK (precio_venta_mayoreo >= 0),
    CHECK (stock_minimo >= 0)
);

-- Índices de búsqueda ultrarrápida (<10ms) en memoria / SQLite (RF-01)
CREATE INDEX idx_productos_codigo_barras ON productos(codigo_barras);
CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(id_categoria);

-- TABLA: conversiones_empaque
-- Soporta el desglose inteligente de empaque a piezas sueltas (RF-05 / CU-02)
-- Ejemplo en Papelería A B C: 1 Caja Bolígrafos Bic (12 piezas) -> Descuenta 1 caja e incrementa 12 plumas sueltas
CREATE TABLE conversiones_empaque (
    id_conversion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto_empaque INTEGER NOT NULL,
    id_producto_pieza INTEGER NOT NULL,
    piezas_por_empaque DECIMAL(10,2) NOT NULL,
    costo_prorrateado DECIMAL(10,2) NULL,
    activo BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto_empaque) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_producto_pieza) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE,
    CHECK (piezas_por_empaque > 1),
    UNIQUE (id_producto_empaque, id_producto_pieza)
);

-- TABLA: servicios_insumos
-- Modela los insumos descontados en servicios de fotocopiado y plastificado (RF-03)
-- Ejemplo en Papelería A B C: 1 Copia Carta B/N descuenta 1 Hoja Papel Bond Carta del inventario
CREATE TABLE servicios_insumos (
    id_servicio_insumo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_servicio INTEGER NOT NULL,
    id_producto_insumo INTEGER NOT NULL,
    cantidad_consumida DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
    activo BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_servicio) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_producto_insumo) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (cantidad_consumida > 0)
);

-- -----------------------------------------------------------------------------
-- 4. MÓDULO DE CLIENTES Y CONTROL DE CAJA
-- -----------------------------------------------------------------------------

-- TABLA: clientes
-- Clientes de mostrador, mayoristas y convenios escolares de Papelería A B C
CREATE TABLE clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_razon_social VARCHAR(150) NOT NULL,
    rfc_curp VARCHAR(18) NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    direccion TEXT NULL,
    tipo_cliente VARCHAR(30) NOT NULL DEFAULT 'MOSTRADOR', -- MOSTRADOR, FRECUENTE, MAYORISTA, ESCUELA
    descuento_predeterminado_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    activo BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: turnos_caja
-- Control de turnos, apertura, corte y balance diario en Papelería A B C (RF-08)
CREATE TABLE turnos_caja (
    id_turno INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    fecha_apertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fondo_inicial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fecha_cierre DATETIME NULL,
    total_ventas_efectivo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_ventas_tarjeta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_ventas_transferencia DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_entradas_caja DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_retiros_caja DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_esperado DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_real_arqueo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    diferencia DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(20) NOT NULL DEFAULT 'ABIERTO', -- ABIERTO, CERRADO
    observaciones TEXT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (fondo_inicial >= 0)
);

-- TABLA: movimientos_caja
-- Gastos menores de caja chica, pagos a proveedores menores o morralla
CREATE TABLE movimientos_caja (
    id_mov_caja INTEGER PRIMARY KEY AUTOINCREMENT,
    id_turno INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    tipo VARCHAR(25) NOT NULL, -- ENTRADA_FONDO, RETIRO_PARCIAL, GASTO_CAJA_CHICA
    monto DECIMAL(10,2) NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_turno) REFERENCES turnos_caja(id_turno) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (monto > 0)
);

-- -----------------------------------------------------------------------------
-- 5. MÓDULO DE VENTAS Y PUNTO DE VENTA (POS)
-- -----------------------------------------------------------------------------

-- TABLA: ventas
-- Cabecera de venta con soporte para carritos simultáneos (RF-02) y ticket (RF-04)
CREATE TABLE ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    folio_ticket VARCHAR(30) NOT NULL UNIQUE,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_turno INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
    numero_carrito INTEGER NOT NULL DEFAULT 1, -- Soporte para hasta 5 carritos simultáneos (RF-02)
    subtotal DECIMAL(10,2) NOT NULL,
    descuento_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    iva_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(30) NOT NULL DEFAULT 'EFECTIVO', -- EFECTIVO, TARJETA, TRANSFERENCIA, MIXTO
    efectivo_recibido DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cambio_devuelto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(20) NOT NULL DEFAULT 'PAGADA', -- PAGADA, CANCELADA, EN_ESPERA
    motivo_cancelacion VARCHAR(255) NULL,
    FOREIGN KEY (id_turno) REFERENCES turnos_caja(id_turno) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (numero_carrito BETWEEN 1 AND 5),
    CHECK (total >= 0)
);

CREATE INDEX idx_ventas_fecha ON ventas(fecha_hora);
CREATE INDEX idx_ventas_folio ON ventas(folio_ticket);
CREATE INDEX idx_ventas_turno ON ventas(id_turno);

-- TABLA: detalle_ventas
-- Artículos vendidos por ticket con desglose de precios y descuentos
CREATE TABLE detalle_ventas (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    tipo_item VARCHAR(20) NOT NULL DEFAULT 'PRODUCTO', -- PRODUCTO, SERVICIO_COPIAS
    tipo_precio VARCHAR(20) NOT NULL DEFAULT 'MENUDEO', -- MENUDEO, MAYOREO, ESPECIAL
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_linea DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal_linea DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (cantidad > 0),
    CHECK (precio_unitario >= 0)
);

CREATE INDEX idx_detalle_ventas_venta ON detalle_ventas(id_venta);
CREATE INDEX idx_detalle_ventas_producto ON detalle_ventas(id_producto);

-- -----------------------------------------------------------------------------
-- 6. MÓDULO DE INVENTARIO, KARDEX Y COMPRAS
-- -----------------------------------------------------------------------------

-- TABLA: kardex_movimientos
-- Historial completo y auditable de entradas, salidas, mermas y ajustes (RF-07)
CREATE TABLE kardex_movimientos (
    id_kardex INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_producto INTEGER NOT NULL,
    tipo_movimiento VARCHAR(35) NOT NULL, 
    -- Tipos: VENTA, CANCELACION_VENTA, COMPRA, MERMA_DANO, CONSUMO_INTERNO_PAPELERIA, 
    --        DESGLOSE_EMPAQUE_SALIDA, DESGLOSE_PIEZA_ENTRADA, AJUSTE_INVENTARIO_FISICO
    cantidad DECIMAL(10,2) NOT NULL,
    stock_anterior DECIMAL(10,2) NOT NULL,
    stock_posterior DECIMAL(10,2) NOT NULL,
    costo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    referencia_tipo VARCHAR(30) NULL, -- VENTA, COMPRA, DESGLOSE, CORTE, MANUAL
    referencia_id INTEGER NULL,
    motivo_detalle VARCHAR(255) NULL,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_kardex_producto_fecha ON kardex_movimientos(id_producto, fecha_hora);
CREATE INDEX idx_kardex_tipo ON kardex_movimientos(tipo_movimiento);

-- TABLA: compras
-- Registro de recepción de mercancía de distribuidores para Papelería A B C
CREATE TABLE compras (
    id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    folio_factura VARCHAR(50) NOT NULL,
    id_proveedor INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    iva DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(20) NOT NULL DEFAULT 'RECIBIDA', -- RECIBIDA, CANCELADA
    observaciones TEXT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (total >= 0)
);

-- TABLA: detalle_compras
-- Líneas de producto recibidas en cada orden de compra
CREATE TABLE detalle_compras (
    id_detalle_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    id_compra INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    costo_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (cantidad > 0),
    CHECK (costo_unitario >= 0)
);

-- -----------------------------------------------------------------------------
-- 7. VISTAS ANALÍTICAS Y DE MONITOREO DEL NEGOCIO
-- -----------------------------------------------------------------------------

-- VISTA: Alertas de Stock Bajo (Papelería A B C)
CREATE VIEW vw_alertas_stock_minimo AS
SELECT 
    p.id_producto,
    p.codigo_barras,
    p.sku,
    p.nombre AS producto,
    c.nombre AS categoria,
    p.stock_actual,
    p.stock_minimo,
    (p.stock_minimo - p.stock_actual) AS faltante_sugerido,
    prov.razon_social AS proveedor_habitual,
    prov.telefono AS telefono_proveedor
FROM productos p
INNER JOIN categorias c ON p.id_categoria = c.id_categoria
LEFT JOIN proveedores prov ON p.id_proveedor_habitual = prov.id_proveedor
WHERE p.activo = 1 
  AND p.es_servicio = 0 
  AND p.stock_actual <= p.stock_minimo;

-- VISTA: Resumen Diario de Ventas por Turno (Cierre de Caja Papelería A B C)
CREATE VIEW vw_resumen_cierre_turnos AS
SELECT 
    t.id_turno,
    u.nombre_completo AS cajero,
    t.fecha_apertura,
    t.fecha_cierre,
    t.fondo_inicial,
    t.total_ventas_efectivo,
    t.total_ventas_tarjeta,
    t.total_ventas_transferencia,
    (t.total_ventas_efectivo + t.total_ventas_tarjeta + t.total_ventas_transferencia) AS gran_total_ventas,
    t.total_esperado,
    t.total_real_arqueo,
    t.diferencia,
    t.estado
FROM turnos_caja t
INNER JOIN usuarios u ON t.id_usuario = u.id_usuario;

-- VISTA: Auditoría de Kardex con Información de Producto y Usuario
CREATE VIEW vw_kardex_auditoria AS
SELECT 
    k.id_kardex,
    k.fecha_hora,
    p.codigo_barras,
    p.nombre AS producto,
    k.tipo_movimiento,
    k.cantidad,
    k.stock_anterior,
    k.stock_posterior,
    k.costo_unitario,
    k.referencia_tipo,
    k.referencia_id,
    k.motivo_detalle,
    u.username AS usuario_responsable
FROM kardex_movimientos k
INNER JOIN productos p ON k.id_producto = p.id_producto
INNER JOIN usuarios u ON k.id_usuario = u.id_usuario;

-- -----------------------------------------------------------------------------
-- 8. DATOS SEMILLA (SEED DATA) REALISTAS — PAPELERÍA A B C
-- -----------------------------------------------------------------------------

-- Identidad de la Empresa: Papelería A B C
INSERT INTO configuracion_negocio (
    id_config, nombre_comercial, razon_social, rfc, direccion, telefono, email, sitio_web, logo_url, leyenda_ticket
) VALUES (
    1, 
    'Papelería A B C', 
    'Papelería A B C S.A. de C.V.', 
    'ABC850101XYZ', 
    'Av. Principal #45, Col. Centro, C.P. 06000', 
    '555-987-6543', 
    'contacto@papeleria-abc.com', 
    'www.papeleria-abc.com', 
    'LOGO.jpg',
    '¡Gracias por su compra en Papelería A B C! Calidad y servicio para su escuela y oficina.'
);

-- Roles
INSERT INTO roles (id_rol, nombre, descripcion, permisos_json) VALUES 
(1, 'ADMINISTRADOR', 'Acceso total en Papelería A B C: inventario, configuración, corte de caja y auditoría', '{"all": true}'),
(2, 'CAJERO', 'Punto de venta POS en mostrador, emisión de tickets y consulta de catálogo', '{"ventas": true, "consulta": true}'),
(3, 'ALMACENISTA', 'Control de stock en bodega, desglose de empaques, compras y kardex', '{"inventario": true, "desglose": true}');

-- Usuarios iniciales
INSERT INTO usuarios (id_usuario, id_rol, nombre_completo, username, password_hash, pin_cajero, activo) VALUES 
(1, 1, 'Gerardo Cabrera Morales', 'admin', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '1234', 1),
(2, 2, 'Astrid García Ramírez', 'cajera1', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '4321', 1),
(3, 3, 'Daniel Parada Gonzalez', 'almacen1', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '9999', 1);

-- Categorías
INSERT INTO categorias (id_categoria, nombre, descripcion) VALUES 
(1, 'Escritura y Corrección', 'Bolígrafos, lápices, plumones, correctores y borradores'),
(2, 'Cuadernos y Papel', 'Cuadernos profesionales, libretas, hojas sueltas y paquetes'),
(3, 'Adhesivos y Pegamentos', 'Lápices adhesivos, pegamento líquido, cintas y silicón'),
(4, 'Geometría y Dibujo', 'Juegos de geometría, reglas, compases, cartulinas y colores'),
(5, 'Servicios de Copiado', 'Fotocopiado B/N, color, impresiones, escaneo y engargolados'),
(6, 'Oficina y Archivo', 'Carpetas, broches baco, grapas, tijeras y calculadoras');

-- Marcas
INSERT INTO marcas (id_marca, nombre) VALUES 
(1, 'Bic'),
(2, 'Scribe'),
(3, 'Pelikan'),
(4, 'Pritt'),
(5, 'Maped'),
(6, 'Barrilito'),
(7, 'Dixon'),
(8, 'Genérico / Propio ABC');

-- Unidades de Medida
INSERT INTO unidades_medida (id_unidad, clave, nombre, permite_decimales) VALUES 
(1, 'PZA', 'Pieza', 0),
(2, 'CJA', 'Caja', 0),
(3, 'PQT', 'Paquete', 0),
(4, 'MTO', 'Metro', 1),
(5, 'SRV', 'Servicio', 0);

-- Proveedores
INSERT INTO proveedores (id_proveedor, razon_social, rfc, contacto_nombre, telefono, email, direccion) VALUES 
(1, 'Distribuidora Papelera Lumen S.A.', 'DPL850101XYZ', 'Lic. Roberto Morales', '5551234567', 'pedidos@lumen.mx', 'Av. Insurgentes Sur 1200, CDMX'),
(2, 'Grupo Papelero Scribe S.A. de C.V.', 'GPS920315ABC', 'Ing. Martha Salinas', '5559876543', 'ventas@scribe.com.mx', 'Calzada México-Tacuba 450, CDMX'),
(3, 'Comercializadora Pelikan México', 'CPM880720KL4', 'Carlos Mendoza', '5554321098', 'atencion@pelikan.mx', 'Parque Industrial Tlalnepantla, Edomex');

-- Clientes
INSERT INTO clientes (id_cliente, nombre_razon_social, rfc_curp, telefono, email, tipo_cliente, descuento_predeterminado_pct) VALUES 
(1, 'Público General Mostrador', 'XAXX010101000', '5500000000', 'mostrador@papeleria-abc.com', 'MOSTRADOR', 0.00),
(2, 'Escuela Primaria Benito Juárez', 'EPB750401H01', '5557778899', 'direccion@primariabenito.edu.mx', 'ESCUELA', 10.00),
(3, 'Despacho Contable García y Asoc.', 'DCG120901M10', '5556661122', 'contacto@despachogarcia.com', 'MAYORISTA', 5.00);

-- Catálogo de Productos y Servicios de Papelería A B C
INSERT INTO productos (
    id_producto, codigo_barras, sku, nombre, descripcion, id_categoria, id_marca, id_unidad, id_proveedor_habitual,
    precio_compra, precio_venta_menudeo, precio_venta_mayoreo, cantidad_mayoreo, stock_actual, stock_minimo, stock_maximo,
    ubicacion_anaquel, es_servicio, permite_desglose, activo
) VALUES 
-- 1. Bolígrafo suelto
(1, '750100110001', 'BIC-CRIS-AZU-PZA', 'Bolígrafo Bic Cristal Azul (Pieza)', 'Bolígrafo punto mediano 1.0mm tinta azul', 1, 1, 1, 1, 4.50, 7.50, 6.00, 5.00, 85.00, 20.00, 300.00, 'Pasillo 1 - Bote A1', 0, 0, 1),

-- 2. Bolígrafo caja x 12 (Empaque desglozable)
(2, '750100110012', 'BIC-CRIS-AZU-CJA', 'Caja Bolígrafo Bic Cristal Azul x 12 pzas', 'Caja cerrada con 12 piezas de bolígrafos Bic azul', 1, 1, 2, 1, 48.00, 78.00, 68.00, 2.00, 12.00, 3.00, 40.00, 'Almacén Estante C2', 0, 1, 1),

-- 3. Cuaderno profesional Scribe
(3, '750100220001', 'SCR-PROF-CUA-100', 'Cuaderno Profesional Scribe Cuadro Grande 100 Hojas', 'Cuaderno espiral espiral doble 100 hojas cuadro 7mm', 2, 2, 1, 2, 28.00, 42.00, 36.00, 3.00, 45.00, 15.00, 150.00, 'Pasillo 2 - Anaquel B1', 0, 0, 1),

-- 4. Lápiz adhesivo Pritt
(4, '750100330001', 'PRI-ADH-11G', 'Lápiz Adhesivo Pritt 11g', 'Pegamento en barra lavable no tóxico 11 gramos', 3, 4, 1, 3, 14.50, 22.00, 18.50, 4.00, 32.00, 10.00, 80.00, 'Pasillo 1 - Vitrina C3', 0, 0, 1),

-- 5. Paquete de Hojas Bond (Insumo y venta empaque)
(5, '750100440500', 'PAP-BOND-PQT-500', 'Paquete Hoja Bond Carta 75g x 500 Hojas', 'Paquete cerrado papel bond ultra blanco 500 hojas', 2, 8, 3, 1, 75.00, 115.00, 102.00, 3.00, 18.00, 5.00, 50.00, 'Almacén Base 1', 0, 1, 1),

-- 6. Hoja Bond Carta Suelta (Insumo copias y venta menudeo)
(6, '750100440001', 'PAP-BOND-HJA-SUEL', 'Hoja Papel Bond Carta 75g (Pieza suelta)', 'Hoja suelta para copias e impresiones', 2, 8, 1, 1, 0.15, 0.50, 0.35, 20.00, 1200.00, 300.00, 5000.00, 'Área Copiado Charola 1', 0, 0, 1),

-- 7. Tijera Escolar Barrilito
(7, '750100550001', 'BAR-TIJ-ESC-5P', 'Tijeras Escolares Barrilito Punta Roma 5 Pulgadas', 'Tijera acero inoxidable infantil punta roma', 6, 6, 1, 1, 16.00, 26.00, 22.00, 3.00, 14.00, 5.00, 40.00, 'Pasillo 3 - Anaquel A2', 0, 0, 1),

-- 8. Goma de borrar Pelikan
(8, '750100660001', 'PEL-GOM-WS30', 'Goma de Borrar Pelikan WS-30 Miga de Pan', 'Goma suave para lápiz grafito no mancha', 1, 3, 1, 3, 5.00, 9.00, 7.50, 5.00, 60.00, 15.00, 120.00, 'Pasillo 1 - Bote Goma', 0, 0, 1),

-- 9. SERVICIO: Copia Fotostática Carta B/N
(9, 'SRV-COP-BN-CAR', 'SRV-COP-BN-CAR', 'Servicio Fotocopiado Carta B/N - Papelería A B C', 'Copia fotostática blanco y negro tamaño carta', 5, 8, 5, NULL, 0.20, 1.00, 0.70, 50.00, 9999.00, 0.00, 9999.00, 'Mostrador POS', 1, 0, 1),

-- 10. SERVICIO: Copia / Impresión Carta Color
(10, 'SRV-IMP-COL-CAR', 'SRV-IMP-COL-CAR', 'Servicio Impresión / Copia Carta Color - Papelería A B C', 'Impresión láser o inyección a color tamaño carta', 5, 8, 5, NULL, 1.20, 5.00, 4.00, 20.00, 9999.00, 0.00, 9999.00, 'Mostrador POS', 1, 0, 1);

-- Reglas de Conversión (Desglose Caja a Pieza RF-05)
INSERT INTO conversiones_empaque (id_conversion, id_producto_empaque, id_producto_pieza, piezas_por_empaque, costo_prorrateado) VALUES 
(1, 2, 1, 12.00, 4.00), -- 1 Caja Bic (id 2) equivale a 12 plumas sueltas (id 1)
(2, 5, 6, 500.00, 0.15); -- 1 Paquete 500 hojas (id 5) equivale a 500 hojas sueltas (id 6)

-- Reglas de Servicios e Insumos vinculados (RF-03)
INSERT INTO servicios_insumos (id_servicio_insumo, id_servicio, id_producto_insumo, cantidad_consumida) VALUES 
(1, 9, 6, 1.0000), -- 1 Copia Carta B/N descuenta 1 Hoja suelta (id 6)
(2, 10, 6, 1.0000); -- 1 Impresión Color Carta descuenta 1 Hoja suelta (id 6)

-- Turno Inicial de Demostración
INSERT INTO turnos_caja (
    id_turno, id_usuario, fecha_apertura, fondo_inicial, fecha_cierre, total_ventas_efectivo,
    total_ventas_tarjeta, total_esperado, total_real_arqueo, diferencia, estado, observaciones
) VALUES 
(1, 2, '2026-10-05 08:00:00', 500.00, NULL, 345.50, 120.00, 965.50, 0.00, 0.00, 'ABIERTO', 'Turno matutino en operación - Papelería A B C');

-- Kardex Inicial de Auditoría
INSERT INTO kardex_movimientos (
    fecha_hora, id_producto, tipo_movimiento, cantidad, stock_anterior, stock_posterior, costo_unitario, referencia_tipo, motivo_detalle, id_usuario
) VALUES 
('2026-10-05 07:30:00', 1, 'INVENTARIO_INICIAL', 85.00, 0.00, 85.00, 4.50, 'INVENTARIO', 'Carga inicial del sistema Papelería A B C', 1),
('2026-10-05 07:30:00', 2, 'INVENTARIO_INICIAL', 12.00, 0.00, 12.00, 48.00, 'INVENTARIO', 'Carga inicial del sistema Papelería A B C', 1),
('2026-10-05 07:30:00', 3, 'INVENTARIO_INICIAL', 45.00, 0.00, 45.00, 28.00, 'INVENTARIO', 'Carga inicial del sistema Papelería A B C', 1),
('2026-10-05 07:30:00', 5, 'INVENTARIO_INICIAL', 18.00, 0.00, 18.00, 75.00, 'INVENTARIO', 'Carga inicial del sistema Papelería A B C', 1),
('2026-10-05 07:30:00', 6, 'INVENTARIO_INICIAL', 1200.00, 0.00, 1200.00, 0.15, 'INVENTARIO', 'Carga inicial del sistema Papelería A B C', 1);
