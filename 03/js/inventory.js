/**
 * inventory.js - Controlador de Almacén, Desglose de Empaques y Kardex para "Papelería A B C"
 * Cumple con:
 * - RF-05: Desglose inteligente de empaque a piezas con actualización atómica
 * - RF-07: Trazabilidad inmutable de movimientos en Kardex
 * - Alertas visuales de stock mínimo
 */

let allInventoryProducts = [];
let selectedPackageProduct = null;

async function initInventory() {
    await reloadInventoryTable();
    setupInventoryFilters();
}

async function reloadInventoryTable() {
    allInventoryProducts = await window.POS_DB.getProductos();
    renderInventoryTable(allInventoryProducts);
}

function renderInventoryTable(products) {
    const tbody = document.getElementById('inventory-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    products.forEach(p => {
        const isLowStock = !p.es_servicio && p.stock_actual <= p.stock_minimo;
        const tr = document.createElement('tr');
        if (isLowStock) tr.className = 'low-stock-row';

        tr.innerHTML = `
            <td><code>${p.codigo_barras}</code></td>
            <td><b>${escapeHTML(p.nombre)}</b><br/><small class="text-muted">${p.sku}</small></td>
            <td><span class="badge-cat">${p.categoria_nombre}</span></td>
            <td class="text-right">$${p.precio_compra.toFixed(2)}</td>
            <td class="text-right font-bold">$${p.precio_venta_menudeo.toFixed(2)}</td>
            <td class="text-center">
                <span class="stock-badge ${isLowStock ? 'stock-danger' : 'stock-ok'}">
                    ${p.es_servicio ? 'Infinito' : `${p.stock_actual} ${p.unidad}`}
                </span>
                ${isLowStock ? `<div class="low-stock-alert">⚠️ Mín: ${p.stock_minimo}</div>` : ''}
            </td>
            <td class="text-center">
                ${p.permite_desglose ? `
                    <button class="btn-action-unbox" onclick="window.INVENTORY_MODULE.openUnboxModal(${p.id_producto})">
                        📦 Desglosar Caja
                    </button>
                ` : '<span class="text-muted">—</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function setupInventoryFilters() {
    const searchInput = document.getElementById('inv-search-input');
    const catSelect = document.getElementById('inv-category-filter');

    const filterFunction = () => {
        const term = (searchInput ? searchInput.value.trim().toLowerCase() : '');
        const cat = (catSelect ? catSelect.value : '');

        const filtered = allInventoryProducts.filter(p => {
            const matchesText = p.nombre.toLowerCase().includes(term) ||
                                p.codigo_barras.includes(term) ||
                                p.sku.toLowerCase().includes(term);
            const matchesCat = cat === '' || p.id_categoria.toString() === cat;
            return matchesText && matchesCat;
        });

        renderInventoryTable(filtered);
    };

    if (searchInput) searchInput.addEventListener('input', filterFunction);
    if (catSelect) catSelect.addEventListener('change', filterFunction);
}

// -------------------------------------------------------------
// DESGLOSE DE CAJA A PIEZA (RF-05)
// -------------------------------------------------------------
function openUnboxModal(idProducto) {
    const prod = allInventoryProducts.find(p => p.id_producto === idProducto);
    if (!prod) return;

    selectedPackageProduct = prod;
    const modal = document.getElementById('modal-unbox');
    if (!modal) return;

    document.getElementById('unbox-package-name').textContent = prod.nombre;
    document.getElementById('unbox-current-stock').textContent = `${prod.stock_actual} ${prod.unidad}(s)`;
    
    // Reglas de conversión esperadas
    let ratio = 12;
    let piezaNombre = 'Piezas sueltas';
    if (prod.sku.includes('500')) {
        ratio = 500;
        piezaNombre = 'Hojas sueltas';
    }

    document.getElementById('unbox-conversion-preview').innerHTML = `
        1 ${prod.unidad} generará <b>+${ratio}</b> ${piezaNombre}.
    `;

    const inputCant = document.getElementById('unbox-qty-input');
    inputCant.value = '1';
    inputCant.max = prod.stock_actual;

    modal.classList.add('active');
}

async function confirmarDesglose() {
    if (!selectedPackageProduct) return;

    const inputCant = document.getElementById('unbox-qty-input');
    const cantCajas = parseInt(inputCant.value) || 1;

    try {
        const res = await window.POS_DB.ejecutarDesgloseEmpaque(selectedPackageProduct.id_producto, cantCajas);
        window.POS_MODULE.closeAllModals();
        window.POS_MODULE.showToast(res.mensaje, 'success');
        await reloadInventoryTable();
        await window.POS_MODULE.reloadCatalog();
    } catch (err) {
        alert(err.message);
    }
}

// -------------------------------------------------------------
// AUDITORÍA KARDEX (RF-07)
// -------------------------------------------------------------
async function openKardexModal() {
    const modal = document.getElementById('modal-kardex');
    const tbody = document.getElementById('kardex-table-tbody');
    if (!modal || !tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" class="text-center">Cargando movimientos...</td></tr>';
    modal.classList.add('active');

    const log = await window.POS_DB.getHistorialKardex();
    tbody.innerHTML = '';

    if (log.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay movimientos registrados aún. Realice ventas o desgloses para auditar.</td></tr>';
        return;
    }

    log.forEach(m => {
        const fecha = new Date(m.fecha_hora).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><small>${fecha}</small></td>
            <td><b>${escapeHTML(m.nombre_producto)}</b></td>
            <td><span class="badge-mov ${m.tipo_movimiento.toLowerCase()}">${m.tipo_movimiento}</span></td>
            <td class="text-center font-bold">${m.cantidad}</td>
            <td class="text-center text-muted">${m.stock_anterior}</td>
            <td class="text-center font-bold text-navy">${m.stock_posterior}</td>
            <td><small class="text-muted">${escapeHTML(m.referencia || '—')}</small></td>
        `;
        tbody.appendChild(tr);
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

// Exponer en window
window.INVENTORY_MODULE = {
    initInventory,
    reloadInventoryTable,
    openUnboxModal,
    confirmarDesglose,
    openKardexModal
};
