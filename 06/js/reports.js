/**
 * reports.js - Módulo de Reportes, Analítica Comercial y Exportación Ejecutiva
 * Papelería A B C — Fase 6: Sprint 3 (Reportes y Seguridad | RF-06 / RF-07 / RF-08)
 * 
 * Funcionalidades:
 * 1. Filtros avanzados por rango temporal (Hoy, Ayer, 7 Días, Mes Actual, Todo, Personalizado).
 * 2. Filtros por Categoría de Producto y Método de Pago (Efectivo, Tarjeta, SPEI).
 * 3. Indicadores Financieros Clave (KPIs):
 *    - Ventas Brutas, Descuentos Totales, Ventas Netas, Utilidad Bruta Estimada y Margen %.
 * 4. Reporte de Balance Diario y Conciliación Financiera con Gráfica de Tendencia.
 * 5. Reporte de Ranking de Productos Más Vendidos (Top Artículos por Volumen y Utilidad).
 * 6. Reporte de Distribución de Ventas por Categoría y Familia.
 * 7. Exportación oficial de todos los resúmenes a CSV delimitado por comas con UTF-8 BOM (\uFEFF) para Excel.
 */

let filtroActual = {
    periodo: '7DIAS',
    fechaInicio: null,
    fechaFin: null,
    categoria: 'TODAS',
    metodoPago: 'TODOS'
};

let cacheReporteVentas = [];

// -----------------------------------------------------------------------------
// 1. INICIALIZACIÓN DEL MÓDULO DE REPORTES
// -----------------------------------------------------------------------------

async function initReportsModule() {
    console.log('[Reports] Inicializando módulo de reportes y analítica...');
    configurarFechasPorDefecto();
    await cargarCategoriasEnFiltro();
    await cargarReportes();
}

function configurarFechasPorDefecto() {
    setFiltroPeriodo('7DIAS', false);
}

async function cargarCategoriasEnFiltro() {
    const select = document.getElementById('report-filtro-categoria');
    if (!select) return;

    const categorias = await window.POS_DB.getCategorias();
    let options = '<option value="TODAS">Todas las Categorías</option>';
    (categorias || []).forEach(c => {
        options += `<option value="${c.id_categoria}">${escapeHTML(c.nombre)}</option>`;
    });
    select.innerHTML = options;
}

// -----------------------------------------------------------------------------
// 2. CONTROL DE FILTROS TEMPORALES Y CRITERIOS
// -----------------------------------------------------------------------------

function setFiltroPeriodo(tipo, recargar = true) {
    filtroActual.periodo = tipo;

    const hoy = new Date();
    const toISODate = d => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const inputInicio = document.getElementById('report-fecha-inicio');
    const inputFin = document.getElementById('report-fecha-fin');

    // Desmarcar todos los botones de periodo rápido
    document.querySelectorAll('.btn-periodo-rapido').forEach(b => b.classList.remove('active'));
    const btnActivo = document.querySelector(`.btn-periodo-rapido[data-periodo="${tipo}"]`);
    if (btnActivo) btnActivo.classList.add('active');

    if (tipo === 'HOY') {
        filtroActual.fechaInicio = toISODate(hoy);
        filtroActual.fechaFin = toISODate(hoy);
    } else if (tipo === 'AYER') {
        const ayer = new Date();
        ayer.setDate(hoy.getDate() - 1);
        filtroActual.fechaInicio = toISODate(ayer);
        filtroActual.fechaFin = toISODate(ayer);
    } else if (tipo === '7DIAS') {
        const sieteDias = new Date();
        sieteDias.setDate(hoy.getDate() - 6);
        filtroActual.fechaInicio = toISODate(sieteDias);
        filtroActual.fechaFin = toISODate(hoy);
    } else if (tipo === 'MES') {
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        filtroActual.fechaInicio = toISODate(inicioMes);
        filtroActual.fechaFin = toISODate(hoy);
    } else if (tipo === 'TODO') {
        filtroActual.fechaInicio = null;
        filtroActual.fechaFin = null;
    }

    if (inputInicio && filtroActual.fechaInicio) inputInicio.value = filtroActual.fechaInicio;
    if (inputFin && filtroActual.fechaFin) inputFin.value = filtroActual.fechaFin;

    if (recargar) {
        cargarReportes();
    }
}

function handleCustomDateChange() {
    const inputInicio = document.getElementById('report-fecha-inicio');
    const inputFin = document.getElementById('report-fecha-fin');

    if (inputInicio && inputInicio.value) {
        filtroActual.fechaInicio = inputInicio.value;
    }
    if (inputFin && inputFin.value) {
        filtroActual.fechaFin = inputFin.value;
    }

    filtroActual.periodo = 'CUSTOM';
    document.querySelectorAll('.btn-periodo-rapido').forEach(b => b.classList.remove('active'));

    cargarReportes();
}

function handleFiltrosAdicionalesChange() {
    const selCat = document.getElementById('report-filtro-categoria');
    const selMet = document.getElementById('report-filtro-metodo');

    if (selCat) filtroActual.categoria = selCat.value;
    if (selMet) filtroActual.metodoPago = selMet.value;

    cargarReportes();
}

// -----------------------------------------------------------------------------
// 3. MOTOR ANALÍTICO Y CÁLCULO DE MÉTRICAS
// -----------------------------------------------------------------------------

async function cargarReportes() {
    // 1. Obtener todas las ventas y catálogo maestro
    const [todasLasVentas, productos] = await Promise.all([
        window.POS_DB.getHistorialVentas(),
        window.POS_DB.getProductosCompletos()
    ]);

    const prodCostMap = new Map((productos || []).map(p => [p.id_producto, p.precio_compra || 0]));
    const prodCatMap = new Map((productos || []).map(p => [p.id_producto, p.id_categoria || 0]));
    const prodCatNombreMap = new Map((productos || []).map(p => [p.id_producto, p.categoria_nombre || 'General']));

    // 2. Filtrar ventas por rango de fecha, método y categoría
    const ventasFiltradas = todasLasVentas.filter(v => {
        if (!v.fecha_hora) return false;
        const fechaStr = v.fecha_hora.slice(0, 10);

        if (filtroActual.fechaInicio && fechaStr < filtroActual.fechaInicio) return false;
        if (filtroActual.fechaFin && fechaStr > filtroActual.fechaFin) return false;

        if (filtroActual.metodoPago !== 'TODOS' && v.metodo_pago !== filtroActual.metodoPago) {
            return false;
        }

        if (filtroActual.categoria !== 'TODAS') {
            const catIdNum = parseInt(filtroActual.categoria, 10);
            const tieneItemCat = (v.items || []).some(it => prodCatMap.get(it.id_producto) === catIdNum);
            if (!tieneItemCat) return false;
        }

        return true;
    });

    cacheReporteVentas = ventasFiltradas;

    // 3. Calcular métricas financieras consolidadas
    let totalBruto = 0;
    let totalDescuentos = 0;
    let totalNeto = 0;
    let totalIva = 0;
    let totalCosto = 0;
    let articulosVendidos = 0;

    let totalEfectivo = 0;
    let totalTarjeta = 0;
    let totalSpei = 0;

    const productoStats = new Map(); // id -> { id, nombre, categoria, unidades, ingreso, costo, utilidad }
    const categoriaStats = new Map(); // catNombre -> { nombre, unidades, total }
    const diarioStats = new Map(); // YYYY-MM-DD -> { fecha, transacciones, bruto, desc, neto, iva, costo, efvo, tarj, spei }

    ventasFiltradas.forEach(v => {
        const fechaKey = v.fecha_hora.slice(0, 10);
        totalBruto += Number(v.total_bruto || v.total || 0);
        totalDescuentos += Number(v.descuento || 0);
        totalNeto += Number(v.total || 0);
        totalIva += Number(v.iva || 0);

        if (v.metodo_pago === 'EFECTIVO') totalEfectivo += Number(v.total || 0);
        else if (v.metodo_pago === 'TARJETA') totalTarjeta += Number(v.total || 0);
        else if (v.metodo_pago === 'TRANSFERENCIA') totalSpei += Number(v.total || 0);

        if (!diarioStats.has(fechaKey)) {
            diarioStats.set(fechaKey, {
                fecha: fechaKey,
                transacciones: 0,
                bruto: 0,
                descuento: 0,
                neto: 0,
                iva: 0,
                costo: 0,
                efectivo: 0,
                tarjeta: 0,
                spei: 0
            });
        }
        const dia = diarioStats.get(fechaKey);
        dia.transacciones += 1;
        dia.bruto += Number(v.total_bruto || v.total || 0);
        dia.descuento += Number(v.descuento || 0);
        dia.neto += Number(v.total || 0);
        dia.iva += Number(v.iva || 0);

        if (v.metodo_pago === 'EFECTIVO') dia.efectivo += Number(v.total || 0);
        else if (v.metodo_pago === 'TARJETA') dia.tarjeta += Number(v.total || 0);
        else if (v.metodo_pago === 'TRANSFERENCIA') dia.spei += Number(v.total || 0);

        (v.items || []).forEach(it => {
            articulosVendidos += Number(it.cantidad || 0);
            const costUnit = prodCostMap.get(it.id_producto) || 0;
            const costLine = Number(it.cantidad || 0) * costUnit;
            totalCosto += costLine;
            dia.costo += costLine;

            // Stats de producto
            const pId = it.id_producto || it.nombre;
            if (!productoStats.has(pId)) {
                productoStats.set(pId, {
                    id_producto: it.id_producto,
                    nombre: it.nombre,
                    categoria: prodCatNombreMap.get(it.id_producto) || (it.es_servicio ? 'Servicios' : 'General'),
                    unidades: 0,
                    ingreso: 0,
                    costo: 0,
                    utilidad: 0
                });
            }
            const pStat = productoStats.get(pId);
            pStat.unidades += Number(it.cantidad || 0);
            pStat.ingreso += Number(it.subtotal || 0);
            pStat.costo += costLine;
            pStat.utilidad = pStat.ingreso - pStat.costo;

            // Stats de categoría
            const catNombre = prodCatNombreMap.get(it.id_producto) || (it.es_servicio ? 'Servicios' : 'General');
            if (!categoriaStats.has(catNombre)) {
                categoriaStats.set(catNombre, {
                    nombre: catNombre,
                    unidades: 0,
                    total: 0
                });
            }
            const cStat = categoriaStats.get(catNombre);
            cStat.unidades += Number(it.cantidad || 0);
            cStat.total += Number(it.subtotal || 0);
        });
    });

    const utilidadBruta = totalNeto - totalCosto;
    const margenPorcentaje = totalNeto > 0 ? (utilidadBruta / totalNeto) * 100 : 0;
    const ticketPromedio = ventasFiltradas.length > 0 ? totalNeto / ventasFiltradas.length : 0;

    // 4. Renderizar KPIs
    renderKPIs({
        transacciones: ventasFiltradas.length,
        articulosVendidos,
        totalBruto,
        totalDescuentos,
        totalNeto,
        totalIva,
        totalCosto,
        utilidadBruta,
        margenPorcentaje,
        ticketPromedio,
        totalEfectivo,
        totalTarjeta,
        totalSpei
    });

    // 5. Renderizar tablas y visualizadores
    renderReporteBalanceDiario(Array.from(diarioStats.values()).sort((a, b) => b.fecha.localeCompare(a.fecha)), totalNeto);
    renderReporteTopProductos(Array.from(productoStats.values()).sort((a, b) => b.unidades - a.unidades), totalNeto);
    renderReporteVentasCategoria(Array.from(categoriaStats.values()).sort((a, b) => b.total - a.total), totalNeto);
    renderReporteTransacciones(ventasFiltradas);
}

// -----------------------------------------------------------------------------
// 4. RENDERIZADO VISUAL DE INDICADORES (KPIS)
// -----------------------------------------------------------------------------

function renderKPIs(kpis) {
    const formatMoney = n => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const elTotal = document.getElementById('kpi-ventas-totales');
    if (elTotal) elTotal.textContent = formatMoney(kpis.totalNeto);

    const elTrans = document.getElementById('kpi-transacciones');
    if (elTrans) elTrans.textContent = `${kpis.transacciones} ventas (${kpis.articulosVendidos} pzas)`;

    const elUtilidad = document.getElementById('kpi-utilidad-bruta');
    if (elUtilidad) elUtilidad.textContent = formatMoney(kpis.utilidadBruta);

    const elMargen = document.getElementById('kpi-margen-pct');
    if (elMargen) elMargen.textContent = `Margen: ${kpis.margenPorcentaje.toFixed(1)}%`;

    const elTicketAvg = document.getElementById('kpi-ticket-promedio');
    if (elTicketAvg) elTicketAvg.textContent = formatMoney(kpis.ticketPromedio);

    const elMix = document.getElementById('kpi-mezcla-pagos');
    if (elMix) {
        elMix.innerHTML = `
            <span style="color: var(--color-emerald);">Efvo: ${formatMoney(kpis.totalEfectivo)}</span> | 
            <span style="color: #0284c7;">Tarj: ${formatMoney(kpis.totalTarjeta)}</span> | 
            <span style="color: #7c3aed;">SPEI: ${formatMoney(kpis.totalSpei)}</span>
        `;
    }
}

// -----------------------------------------------------------------------------
// 5. RENDERIZADO DE TABLAS Y GRÁFICAS
// -----------------------------------------------------------------------------

function renderReporteBalanceDiario(dias, maxTotal) {
    const tbody = document.getElementById('tabla-balance-diario-tbody');
    if (!tbody) return;

    if (dias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="padding: 20px; color: var(--color-slate-light);">No hay registros de ventas para el periodo seleccionado.</td></tr>';
        return;
    }

    const formatMoney = n => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const maxDia = Math.max(...dias.map(d => d.neto), 1);

    tbody.innerHTML = dias.map(d => {
        const utilDia = d.neto - d.costo;
        const barWidth = Math.min(100, Math.round((d.neto / maxDia) * 100));

        return `
            <tr>
                <td><b>${d.fecha}</b></td>
                <td class="text-center">${d.transacciones}</td>
                <td class="text-right" style="color: var(--color-slate-light);">${formatMoney(d.bruto)}</td>
                <td class="text-right" style="color: #d9534f;">${d.descuento > 0 ? '-' + formatMoney(d.descuento) : '$0.00'}</td>
                <td class="text-right font-bold" style="color: var(--color-emerald);">${formatMoney(d.neto)}</td>
                <td class="text-right">${formatMoney(utilDia)}</td>
                <td style="font-size: 0.74rem;">
                    E: ${formatMoney(d.efectivo)}<br/>
                    T: ${formatMoney(d.tarjeta)} | S: ${formatMoney(d.spei)}
                </td>
                <td style="vertical-align: middle; width: 130px;">
                    <div style="background: #e2e8f0; border-radius: 4px; height: 12px; width: 100%; overflow: hidden;">
                        <div style="background: var(--color-primary); height: 100%; width: ${barWidth}%;"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderReporteTopProductos(productos, totalFacturado) {
    const tbody = document.getElementById('tabla-top-productos-tbody');
    if (!tbody) return;

    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 20px; color: var(--color-slate-light);">Sin datos de productos vendidos en este rango.</td></tr>';
        return;
    }

    const formatMoney = n => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const maxUnidades = Math.max(...productos.map(p => p.unidades), 1);

    tbody.innerHTML = productos.slice(0, 15).map((p, index) => {
        const barWidth = Math.min(100, Math.round((p.unidades / maxUnidades) * 100));
        const pctFacturacion = totalFacturado > 0 ? ((p.ingreso / totalFacturado) * 100).toFixed(1) : '0.0';

        return `
            <tr>
                <td class="text-center font-bold" style="color: var(--color-primary);">#${index + 1}</td>
                <td>
                    <b>${escapeHTML(p.nombre)}</b>
                    <small style="display: block; color: var(--color-slate-light); font-size: 0.72rem;">${escapeHTML(p.categoria)}</small>
                </td>
                <td class="text-center font-bold" style="font-size: 0.95rem;">${p.unidades}</td>
                <td class="text-right font-bold" style="color: var(--color-emerald);">${formatMoney(p.ingreso)}</td>
                <td class="text-right" style="color: var(--color-slate-light);">${formatMoney(p.costo)}</td>
                <td class="text-right font-bold" style="color: #0284c7;">${formatMoney(p.utilidad)}</td>
                <td style="vertical-align: middle; width: 140px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <div style="background: #e2e8f0; border-radius: 4px; height: 10px; flex: 1; overflow: hidden;">
                            <div style="background: var(--color-emerald); height: 100%; width: ${barWidth}%;"></div>
                        </div>
                        <small style="font-size: 0.7rem; font-weight: bold; width: 35px;">${pctFacturacion}%</small>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderReporteVentasCategoria(categorias, totalFacturado) {
    const tbody = document.getElementById('tabla-ventas-categoria-tbody');
    if (!tbody) return;

    if (categorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding: 20px; color: var(--color-slate-light);">Sin ventas por categoría.</td></tr>';
        return;
    }

    const formatMoney = n => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const maxTotal = Math.max(...categorias.map(c => c.total), 1);

    tbody.innerHTML = categorias.map(c => {
        const barWidth = Math.min(100, Math.round((c.total / maxTotal) * 100));
        const pctTotal = totalFacturado > 0 ? ((c.total / totalFacturado) * 100).toFixed(1) : '0.0';

        return `
            <tr>
                <td><b>${escapeHTML(c.nombre)}</b></td>
                <td class="text-center font-bold">${c.unidades} pzas</td>
                <td class="text-right font-bold" style="color: var(--color-emerald);">${formatMoney(c.total)}</td>
                <td style="vertical-align: middle; width: 180px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="background: #e2e8f0; border-radius: 4px; height: 12px; flex: 1; overflow: hidden;">
                            <div style="background: #0284c7; height: 100%; width: ${barWidth}%;"></div>
                        </div>
                        <span style="font-size: 0.75rem; font-weight: 800; width: 45px;">${pctTotal}%</span>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderReporteTransacciones(ventas) {
    const tbody = document.getElementById('tabla-transacciones-tbody');
    if (!tbody) return;

    if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="padding: 20px; color: var(--color-slate-light);">No se encontraron transacciones en el periodo.</td></tr>';
        return;
    }

    const formatMoney = n => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    tbody.innerHTML = ventas.slice(0, 50).map(v => {
        const fechaFormat = new Date(v.fecha_hora).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
        const itemsResumen = (v.items || []).map(it => `${it.cantidad}x ${it.nombre}`).join(', ');

        return `
            <tr>
                <td><b>${v.folio_ticket || ('TICK-' + String(v.id_venta).padStart(5, '0'))}</b></td>
                <td>${fechaFormat}</td>
                <td>${escapeHTML(v.cajero || 'Cajero')}</td>
                <td><span class="meta-chip">${v.metodo_pago}</span></td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHTML(itemsResumen)}">
                    ${escapeHTML(itemsResumen)}
                </td>
                <td class="text-right font-bold" style="color: var(--color-emerald);">${formatMoney(v.total)}</td>
                <td class="text-center">
                    <button type="button" class="btn-table-action" style="background: #0284c7; color: white;" onclick="window.POS_MODULE.reimprimirTicket('${v.folio_ticket || v.id_venta}')">
                        Ticket
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// -----------------------------------------------------------------------------
// 6. EXPORTACIÓN OFICIAL DE REPORTES A CSV (EXCEL COMPLIANT)
// -----------------------------------------------------------------------------

function descargarArchivoCSV(nombreArchivo, filas) {
    const csvContent = '\uFEFF' + filas.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportarBalanceCSV() {
    if (!cacheReporteVentas || cacheReporteVentas.length === 0) {
        alert('No hay datos en el reporte actual para exportar.');
        return;
    }

    const filas = [
        ['PAPELERIA A B C - REPORTE DE BALANCE DIARIO Y CONCILIACION FINANCIERA'],
        ['Fecha de Generacion:', new Date().toLocaleString('es-MX')],
        ['Periodo Filtrado:', filtroActual.periodo, 'Desde:', filtroActual.fechaInicio || 'Inicio', 'Hasta:', filtroActual.fechaFin || 'Fin'],
        ['Metodo Pago:', filtroActual.metodoPago, 'Categoria:', filtroActual.categoria],
        []
    ];

    filas.push(['Fecha', 'Transacciones', 'Ventas Brutas ($)', 'Descuentos ($)', 'Ventas Netas ($)', 'IVA Trasladado 16% ($)', 'Costo Mercancia ($)', 'Utilidad Bruta ($)', 'Efectivo ($)', 'Tarjeta ($)', 'SPEI ($)']);

    const diarioMap = new Map();
    cacheReporteVentas.forEach(v => {
        const f = v.fecha_hora.slice(0, 10);
        if (!diarioMap.has(f)) {
            diarioMap.set(f, { fecha: f, trans: 0, bruto: 0, desc: 0, neto: 0, iva: 0, costo: 0, efvo: 0, tarj: 0, spei: 0 });
        }
        const d = diarioMap.get(f);
        d.trans += 1;
        d.bruto += Number(v.total_bruto || v.total || 0);
        d.desc += Number(v.descuento || 0);
        d.neto += Number(v.total || 0);
        d.iva += Number(v.iva || 0);
        if (v.metodo_pago === 'EFECTIVO') d.efvo += Number(v.total || 0);
        else if (v.metodo_pago === 'TARJETA') d.tarj += Number(v.total || 0);
        else if (v.metodo_pago === 'TRANSFERENCIA') d.spei += Number(v.total || 0);
    });

    Array.from(diarioMap.values()).sort((a, b) => b.fecha.localeCompare(a.fecha)).forEach(d => {
        filas.push([
            d.fecha,
            d.trans,
            d.bruto.toFixed(2),
            d.desc.toFixed(2),
            d.neto.toFixed(2),
            d.iva.toFixed(2),
            d.costo.toFixed(2),
            (d.neto - d.costo).toFixed(2),
            d.efvo.toFixed(2),
            d.tarj.toFixed(2),
            d.spei.toFixed(2)
        ]);
    });

    const fechaHoy = new Date().toISOString().slice(0, 10);
    descargarArchivoCSV(`reporte_balance_diario_${fechaHoy}.csv`, filas);
}

async function exportarTopProductosCSV() {
    const productos = await window.POS_DB.getProductosCompletos();
    const prodCostMap = new Map(productos.map(p => [p.id_producto, p.precio_compra || 0]));
    const prodCatMap = new Map(productos.map(p => [p.id_producto, p.categoria_nombre || 'General']));

    const productoStats = new Map();
    cacheReporteVentas.forEach(v => {
        (v.items || []).forEach(it => {
            const pId = it.id_producto || it.nombre;
            if (!productoStats.has(pId)) {
                productoStats.set(pId, {
                    id: it.id_producto,
                    nombre: it.nombre,
                    categoria: prodCatMap.get(it.id_producto) || (it.es_servicio ? 'Servicios' : 'General'),
                    unidades: 0,
                    ingreso: 0,
                    costo: 0
                });
            }
            const p = productoStats.get(pId);
            p.unidades += Number(it.cantidad || 0);
            p.ingreso += Number(it.subtotal || 0);
            p.costo += Number(it.cantidad || 0) * (prodCostMap.get(it.id_producto) || 0);
        });
    });

    const filas = [
        ['PAPELERIA A B C - RANKING DE PRODUCTOS MAS VENDIDOS (TOP PRODUCTOS)'],
        ['Fecha de Generacion:', new Date().toLocaleString('es-MX')],
        ['Total Articulos Vendidos:', Array.from(productoStats.values()).reduce((s, p) => s + p.unidades, 0)],
        []
    ];

    filas.push(['Posicion', 'Nombre del Articulo', 'Categoria', 'Unidades Vendidas', 'Ingresos Generados ($)', 'Costo Total ($)', 'Utilidad Bruta ($)', 'Margen Rentabilidad (%)']);

    const sorted = Array.from(productoStats.values()).sort((a, b) => b.unidades - a.unidades);
    sorted.forEach((p, idx) => {
        const util = p.ingreso - p.costo;
        const mg = p.ingreso > 0 ? ((util / p.ingreso) * 100).toFixed(1) + '%' : '0.0%';
        filas.push([
            idx + 1,
            p.nombre,
            p.categoria,
            p.unidades,
            p.ingreso.toFixed(2),
            p.costo.toFixed(2),
            util.toFixed(2),
            mg
        ]);
    });

    const fechaHoy = new Date().toISOString().slice(0, 10);
    descargarArchivoCSV(`reporte_top_productos_${fechaHoy}.csv`, filas);
}

function exportarVentasCategoriaCSV() {
    const categoriaStats = new Map();
    cacheReporteVentas.forEach(v => {
        (v.items || []).forEach(it => {
            const cat = it.es_servicio ? 'Servicios y Copias' : 'General';
            if (!categoriaStats.has(cat)) {
                categoriaStats.set(cat, { nombre: cat, unidades: 0, total: 0 });
            }
            const c = categoriaStats.get(cat);
            c.unidades += Number(it.cantidad || 0);
            c.total += Number(it.subtotal || 0);
        });
    });

    const filas = [
        ['PAPELERIA A B C - VENTAS CONSOLIDADAS POR CATEGORIA'],
        ['Fecha de Generacion:', new Date().toLocaleString('es-MX')],
        []
    ];
    filas.push(['Categoria Comercial', 'Unidades Vendidas', 'Importe Facturado ($ MXN)', '% de Participacion']);

    const totalGlobal = Array.from(categoriaStats.values()).reduce((s, c) => s + c.total, 0);
    Array.from(categoriaStats.values()).sort((a, b) => b.total - a.total).forEach(c => {
        const pct = totalGlobal > 0 ? ((c.total / totalGlobal) * 100).toFixed(1) + '%' : '0.0%';
        filas.push([c.nombre, c.unidades, c.total.toFixed(2), pct]);
    });

    const fechaHoy = new Date().toISOString().slice(0, 10);
    descargarArchivoCSV(`reporte_ventas_categoria_${fechaHoy}.csv`, filas);
}

function exportarTransaccionesDetalladasCSV() {
    if (!cacheReporteVentas || cacheReporteVentas.length === 0) {
        alert('No hay transacciones para exportar.');
        return;
    }

    const filas = [
        ['PAPELERIA A B C - HISTORIAL DETALLADO DE TRANSACCIONES DE VENTA'],
        ['Fecha de Generacion:', new Date().toLocaleString('es-MX')],
        ['Total Ventas Exportadas:', cacheReporteVentas.length],
        []
    ];

    filas.push(['Folio Ticket', 'Fecha y Hora', 'Cajero', 'Metodo de Pago', 'Articulos Vendidos', 'Subtotal ($)', 'IVA 16% ($)', 'Total Cobrado ($)', 'Monto Recibido ($)', 'Cambio ($)']);

    cacheReporteVentas.forEach(v => {
        const itemsStr = (v.items || []).map(it => `${it.cantidad}x ${it.nombre}`).join(' | ');
        filas.push([
            v.folio_ticket || ('TICK-' + String(v.id_venta).padStart(5, '0')),
            v.fecha_hora,
            v.cajero || 'Cajero',
            v.metodo_pago,
            itemsStr,
            Number(v.subtotal || 0).toFixed(2),
            Number(v.iva || 0).toFixed(2),
            Number(v.total || 0).toFixed(2),
            Number(v.monto_recibido || v.total || 0).toFixed(2),
            Number(v.cambio || 0).toFixed(2)
        ]);
    });

    const fechaHoy = new Date().toISOString().slice(0, 10);
    descargarArchivoCSV(`reporte_transacciones_detalladas_${fechaHoy}.csv`, filas);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// -----------------------------------------------------------------------------
// EXPORTACIÓN DE API GLOBAL
// -----------------------------------------------------------------------------
window.REPORTS_MODULE = {
    initReportsModule,
    cargarReportes,
    setFiltroPeriodo,
    handleCustomDateChange,
    handleFiltrosAdicionalesChange,
    exportarBalanceCSV,
    exportarTopProductosCSV,
    exportarVentasCategoriaCSV,
    exportarTransaccionesDetalladasCSV
};
