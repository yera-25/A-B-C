/**
 * pos.js - Controlador de Punto de Venta (Mostrador) para "Papelería A B C"
 * Entregable Unificado
 * Soporta:
 * - 5 Carritos de compra simultáneos (RF-02)
 * - Búsqueda in-memory y lector de barras <10ms (RF-01)
 * - Deducción de servicios de copiado (RF-03)
 * - Emisión de tickets térmicos con logotipo oficial (RF-04)
 * - Afectación inmediata de stock y asiento en Kardex auditable (RF-07)
 * - Atajos de teclado para velocidad de mostrador (RNF-05)
 */

const MAX_CARTS = 5;
let carts = Array.from({ length: MAX_CARTS }, () => []);
let activeCartIndex = 0;
let currentProductsCatalog = [];

// Inicializar Módulo POS
async function initPOS() {
    await reloadCatalog();
    renderCartTabs();
    renderActiveCart();
    setupEventListeners();
    setupKeyboardShortcuts();
}

// Cargar catálogo en memoria para búsqueda ultra-rápida (<10ms)
async function reloadCatalog() {
    currentProductsCatalog = await window.POS_DB.getProductosCompletos();

    // Salvaguarda reactiva: si el catálogo viene vacío, forzar sincronización de 160 artículos
    if ((!currentProductsCatalog || currentProductsCatalog.length === 0) && window.POS_DB.recargarCatalogoCompleto160) {
        console.warn('[POS] Catálogo no detectado. Forzando sincronización de 160 productos...');
        await window.POS_DB.recargarCatalogoCompleto160(true);
        currentProductsCatalog = await window.POS_DB.getProductosCompletos();
    }

    renderQuickProductsGrid(currentProductsCatalog);
}

// Renderizar las pestañas de los 5 carritos simultáneos
function renderCartTabs() {
    const tabsContainer = document.getElementById('cart-tabs-container');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';
    carts.forEach((cart, idx) => {
        const itemCount = cart.reduce((acc, it) => acc + it.cantidad, 0);
        const cartTotal = cart.reduce((acc, it) => acc + it.subtotal, 0);

        const tabBtn = document.createElement('button');
        tabBtn.className = `cart-tab-btn ${idx === activeCartIndex ? 'active' : ''} ${itemCount > 0 ? 'has-items' : ''}`;
        tabBtn.innerHTML = `
            <span class="tab-icon">🛒 Carrito ${idx + 1}</span>
            <span class="tab-badge">${itemCount}</span>
            ${itemCount > 0 ? `<span class="tab-total">$${cartTotal.toFixed(2)}</span>` : ''}
        `;
        tabBtn.onclick = () => switchCart(idx);
        tabsContainer.appendChild(tabBtn);
    });
}

// Cambiar de carrito activo
function switchCart(index) {
    if (index >= 0 && index < MAX_CARTS) {
        activeCartIndex = index;
        renderCartTabs();
        renderActiveCart();
        focusScanner();
    }
}

// Alternar secuencialmente al siguiente carrito (Atajo F2 en POS)
function cycleNextCart() {
    const nextIdx = (activeCartIndex + 1) % MAX_CARTS;
    switchCart(nextIdx);
    showToast(`Cambiado a Carrito ${nextIdx + 1}`, 'info');
}

// Agregar producto al carrito activo
function addToCart(producto, cantidad = 1) {
    const cart = carts[activeCartIndex];
    const existingIndex = cart.findIndex(it => it.id_producto === producto.id_producto);

    // Validar disponibilidad si no es servicio
    if (!producto.es_servicio) {
        const cantActualEnCarrito = existingIndex >= 0 ? cart[existingIndex].cantidad : 0;
        if (cantActualEnCarrito + cantidad > producto.stock_actual) {
            showToast(`Stock insuficiente de "${producto.nombre}". Existencia: ${producto.stock_actual}`, 'warning');
            return;
        }
    }

    if (existingIndex >= 0) {
        cart[existingIndex].cantidad += cantidad;
        cart[existingIndex].subtotal = cart[existingIndex].cantidad * cart[existingIndex].precio_unitario;
    } else {
        cart.push({
            id_producto: producto.id_producto,
            codigo_barras: producto.codigo_barras,
            sku: producto.sku,
            nombre: producto.nombre,
            unidad: producto.unidad_nombre || 'Pza',
            precio_unitario: producto.precio_venta_menudeo,
            cantidad: cantidad,
            subtotal: producto.precio_venta_menudeo * cantidad,
            es_servicio: producto.es_servicio
        });
    }

    renderCartTabs();
    renderActiveCart();
    showToast(`+${cantidad} ${producto.nombre}`, 'success');
}

// Renderizar la tabla del carrito activo
function renderActiveCart() {
    const tbody = document.getElementById('cart-items-tbody');
    const emptyState = document.getElementById('cart-empty-state');
    const tableContainer = document.getElementById('cart-table-wrapper');
    const cart = carts[activeCartIndex];

    if (!tbody) return;

    if (cart.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (tableContainer) tableContainer.style.display = 'none';
        tbody.innerHTML = '';
        updateTotalsDisplay(0, 0, 0);
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';

    tbody.innerHTML = '';
    let totalBruto = 0;

    cart.forEach((item, index) => {
        totalBruto += item.subtotal;
        const tr = document.createElement('tr');
        tr.className = item.es_servicio ? 'service-item-row' : '';
        tr.innerHTML = `
            <td>
                <div class="cart-item-title">${escapeHTML(item.nombre)}</div>
                <div class="cart-item-meta">${item.sku} | ${item.es_servicio ? 'Servicio' : item.unidad}</div>
            </td>
            <td class="text-center">
                <div class="qty-control">
                    <button class="btn-qty" onclick="updateItemQty(${index}, -1)">-</button>
                    <span class="qty-val">${item.cantidad}</span>
                    <button class="btn-qty" onclick="updateItemQty(${index}, 1)">+</button>
                </div>
            </td>
            <td class="text-right">$${item.precio_unitario.toFixed(2)}</td>
            <td class="text-right font-bold text-navy">$${item.subtotal.toFixed(2)}</td>
            <td class="text-center">
                <button class="btn-del-item" title="Eliminar renglón" onclick="removeItemFromCart(${index})">✕</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Desglose de totales con IVA 16% incluido
    const subtotal = totalBruto / 1.16;
    const iva = totalBruto - subtotal;
    updateTotalsDisplay(subtotal, iva, totalBruto);
}

// Modificar cantidad de un renglón
function updateItemQty(index, delta) {
    const cart = carts[activeCartIndex];
    if (!cart[index]) return;

    const nuevoValor = cart[index].cantidad + delta;
    if (nuevoValor <= 0) {
        removeItemFromCart(index);
        return;
    }

    // Validar stock si es físico
    if (!cart[index].es_servicio) {
        const prodMaestro = currentProductsCatalog.find(p => p.id_producto === cart[index].id_producto);
        if (prodMaestro && nuevoValor > prodMaestro.stock_actual) {
            showToast(`Máximo stock disponible: ${prodMaestro.stock_actual}`, 'warning');
            return;
        }
    }

    cart[index].cantidad = nuevoValor;
    cart[index].subtotal = cart[index].cantidad * cart[index].precio_unitario;

    renderCartTabs();
    renderActiveCart();
}

// Eliminar un renglón del carrito activo
function removeItemFromCart(index) {
    const cart = carts[activeCartIndex];
    if (cart[index]) {
        cart.splice(index, 1);
        renderCartTabs();
        renderActiveCart();
    }
}

// Limpiar todo el carrito activo
function clearActiveCart() {
    if (carts[activeCartIndex].length === 0) return;
    if (confirm(`¿Vaciar todos los artículos del Carrito ${activeCartIndex + 1}?`)) {
        carts[activeCartIndex] = [];
        renderCartTabs();
        renderActiveCart();
        showToast(`Carrito ${activeCartIndex + 1} vaciado`, 'info');
        focusScanner();
    }
}

// Actualizar valores numéricos en el panel derecho de cobro
function updateTotalsDisplay(subtotal, iva, total) {
    const elSub = document.getElementById('calc-subtotal');
    const elIva = document.getElementById('calc-iva');
    const elTot = document.getElementById('calc-total');

    if (elSub) elSub.textContent = `$${subtotal.toFixed(2)}`;
    if (elIva) elIva.textContent = `$${iva.toFixed(2)}`;
    if (elTot) elTot.textContent = `$${total.toFixed(2)}`;
}

// Renderizar cuadrícula visual de artículos rápidos en mostrador
function renderQuickProductsGrid(productos) {
    const grid = document.getElementById('quick-products-grid');
    if (!grid) return;

    grid.innerHTML = '';
    productos.slice(0, 15).forEach(p => {
        const card = document.createElement('div');
        card.className = `quick-product-card ${p.es_servicio ? 'service-card' : ''}`;
        card.innerHTML = `
            <div class="card-tag">${p.es_servicio ? 'SER' : (p.unidad_nombre || 'PZA')}</div>
            <div class="card-name">${escapeHTML(p.nombre)}</div>
            <div class="card-bottom">
                <span class="card-stock">${p.es_servicio ? '♾️' : `Stock: ${p.stock_actual}`}</span>
                <span class="card-price">$${p.precio_venta_menudeo.toFixed(2)}</span>
            </div>
        `;
        card.onclick = () => addToCart(p, 1);
        grid.appendChild(card);
    });
}

// Procesar búsqueda en tiempo real e input de lector de barras (<10ms)
function setupEventListeners() {
    const searchInput = document.getElementById('barcode-search-input');
    const searchDropdown = document.getElementById('search-dropdown-results');

    if (searchInput) {
        // Al presionar Enter (típico de pistola de código de barras)
        searchInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const term = searchInput.value.trim();
                if (!term) return;

                // 1. Buscar coincidencia exacta por código de barras
                const exacto = await window.POS_DB.buscarProductoPorCodigo(term);
                if (exacto) {
                    addToCart(exacto, 1);
                    searchInput.value = '';
                    if (searchDropdown) searchDropdown.style.display = 'none';
                    return;
                }

                // 2. Si no es código exacto, buscar primer resultado
                const filtrados = currentProductsCatalog.filter(p =>
                    p.nombre.toLowerCase().includes(term.toLowerCase()) ||
                    p.sku.toLowerCase().includes(term.toLowerCase())
                );

                if (filtrados.length === 1) {
                    addToCart(filtrados[0], 1);
                    searchInput.value = '';
                    if (searchDropdown) searchDropdown.style.display = 'none';
                } else if (filtrados.length > 1) {
                    renderSearchDropdown(filtrados);
                } else {
                    showToast(`Artículo no encontrado para "${term}"`, 'warning');
                }
            }
        });

        // Autocompletado mientras se teclea
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (query.length >= 2) {
                const resultados = currentProductsCatalog.filter(p =>
                    p.nombre.toLowerCase().includes(query) ||
                    p.codigo_barras.includes(query) ||
                    p.sku.toLowerCase().includes(query)
                ).slice(0, 8);
                renderSearchDropdown(resultados);
            } else {
                if (searchDropdown) searchDropdown.style.display = 'none';
            }
        });
    }

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#barcode-search-container')) {
            if (searchDropdown) searchDropdown.style.display = 'none';
        }
    });
}

// Renderizar lista desplegable de resultados instantáneos
function renderSearchDropdown(items) {
    const dropdown = document.getElementById('search-dropdown-results');
    const searchInput = document.getElementById('barcode-search-input');
    if (!dropdown) return;

    if (items.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    dropdown.innerHTML = '';
    items.forEach(p => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'dropdown-item';
        itemDiv.innerHTML = `
            <div class="dd-title">${escapeHTML(p.nombre)}</div>
            <div class="dd-meta">
                <span>SKU: ${p.sku} | ${p.categoria_nombre}</span>
                <span class="dd-price">$${p.precio_venta_menudeo.toFixed(2)}</span>
            </div>
        `;
        itemDiv.onclick = () => {
            addToCart(p, 1);
            if (searchInput) searchInput.value = '';
            dropdown.style.display = 'none';
            focusScanner();
        };
        dropdown.appendChild(itemDiv);
    });

    dropdown.style.display = 'block';
}

// Configurar Atajos de Teclado Profesionales para Mostrador
function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        // Evitar interceptar si estamos escribiendo en inputs de modales
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

        if (e.key === 'F1') {
            e.preventDefault();
            const activeTab = document.querySelector('.app-tab-section.active');
            if (activeTab && activeTab.id === 'tab-inventario') {
                const invSearch = document.getElementById('catalog-search-input');
                if (invSearch) invSearch.focus();
            } else {
                focusScanner();
            }
        } else if (e.key === 'F2') {
            e.preventDefault();
            const activeTab = document.querySelector('.app-tab-section.active');
            if (activeTab && activeTab.id === 'tab-inventario') {
                window.INVENTORY_MODULE.openProductModal();
            } else {
                cycleNextCart();
            }
        } else if (e.key === 'F4') {
            e.preventDefault();
            openCopiasModal();
        } else if (e.key === 'F10') {
            e.preventDefault();
            openCheckoutModal();
        } else if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function focusScanner() {
    const searchInput = document.getElementById('barcode-search-input');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

// -------------------------------------------------------------
// MODAL DE COBRO Y EMISIÓN DE TICKET (RF-04)
// -------------------------------------------------------------
function openCheckoutModal() {
    const cart = carts[activeCartIndex];
    if (cart.length === 0) {
        showToast('El carrito está vacío. Agregue artículos antes de cobrar.', 'warning');
        return;
    }

    const modal = document.getElementById('modal-checkout');
    if (!modal) return;

    const total = cart.reduce((acc, it) => acc + it.subtotal, 0);
    document.getElementById('modal-checkout-total').textContent = `$${total.toFixed(2)}`;

    const efectivoInput = document.getElementById('checkout-efectivo-recibido');
    if (efectivoInput) {
        efectivoInput.value = total.toFixed(2);
        efectivoInput.focus();
        efectivoInput.select();
    }

    calcularCambio(total);
    modal.classList.add('active');
}

function calcularCambio(total = null) {
    if (total === null) {
        const cart = carts[activeCartIndex];
        total = cart.reduce((acc, it) => acc + it.subtotal, 0);
    }

    const efectivoInput = document.getElementById('checkout-efectivo-recibido');
    const cambioDisplay = document.getElementById('checkout-cambio-devuelto');
    const btnConfirmar = document.getElementById('btn-confirmar-cobro');

    const recibido = parseFloat(efectivoInput.value) || 0;
    const cambio = recibido - total;

    if (cambioDisplay) {
        cambioDisplay.textContent = `$${Math.max(0, cambio).toFixed(2)}`;
        if (cambio < 0) {
            cambioDisplay.style.color = '#d9534f';
            if (btnConfirmar) btnConfirmar.disabled = true;
        } else {
            cambioDisplay.style.color = '#3a8e63';
            if (btnConfirmar) btnConfirmar.disabled = false;
        }
    }
}

// Confirmar venta e imprimir ticket con logotipo institucional
async function confirmarVenta() {
    const cart = carts[activeCartIndex];
    if (cart.length === 0) return;

    const total = cart.reduce((acc, it) => acc + it.subtotal, 0);
    const subtotal = total / 1.16;
    const iva = total - subtotal;
    const efectivoInput = document.getElementById('checkout-efectivo-recibido');
    const metodoPago = document.getElementById('checkout-metodo-pago').value;
    const recibido = parseFloat(efectivoInput.value) || total;
    const cambio = Math.max(0, recibido - total);

    const ventaData = {
        subtotal: subtotal,
        iva: iva,
        total: total,
        metodo_pago: metodoPago,
        monto_recibido: recibido,
        cambio: cambio,
        items: cart,
        cajero: 'Gerardo Cabrera Morales'
    };

    try {
        const folioVenta = await window.POS_DB.registrarVentaConKardex(ventaData);
        closeAllModals();
        showToast(`¡Venta Ticket #${folioVenta} completada exitosamente!`, 'success');

        // Mostrar ticket para impresión térmica (RF-04)
        mostrarTicketImpresion(folioVenta, new Date().toISOString(), cart, ventaData);

        // Vaciar el carrito completado
        carts[activeCartIndex] = [];
        renderCartTabs();
        renderActiveCart();

        // Actualizar catálogos y almacén
        await reloadCatalog();
        if (window.INVENTORY_MODULE) await window.INVENTORY_MODULE.reloadCatalogTable();
        if (window.CASH_MODULE) await window.CASH_MODULE.renderCashDashboard();
    } catch (err) {
        console.error(err);
        showToast('Error al procesar la transacción de venta: ' + err.message, 'error');
    }
}

// Renderizar Vista Previa de Ticket Térmico con Marca "Papelería A B C"
function mostrarTicketImpresion(folio, fecha, items, datosVenta) {
    const modal = document.getElementById('modal-ticket-preview');
    const ticketContent = document.getElementById('ticket-render-zone');
    if (!modal || !ticketContent) return;

    const fechaFormat = new Date(fecha).toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    let itemsHtml = '';
    items.forEach(it => {
        itemsHtml += `
            <div class="ticket-row-item">
                <span class="ti-desc">${it.cantidad}x ${escapeHTML(it.nombre)}</span>
                <span class="ti-price">$${it.subtotal.toFixed(2)}</span>
            </div>
        `;
    });

    ticketContent.innerHTML = `
        <div class="ticket-thermal-container">
            <div class="ticket-center-header">
                <img src="LOGO.jpg" alt="Papelería A B C" class="ticket-logo-img"/>
                <div class="ticket-biz-name">Papelería A B C</div>
                <div class="ticket-biz-meta">Sistema POS & Inventario Local</div>
                <div class="ticket-biz-meta">RFC: PABC261005ABC</div>
                <div class="ticket-biz-meta">Av. Tecnológico #120, Col. Centro</div>
                <div class="ticket-biz-meta">Tel: 442-123-4567</div>
            </div>
            <div class="ticket-divider">================================</div>
            <div class="ticket-meta-info">
                <div><b>Folio:</b> #${folio}</div>
                <div><b>Fecha:</b> ${fechaFormat}</div>
                <div><b>Atendió:</b> ${datosVenta.cajero}</div>
                <div><b>Carrito:</b> #${activeCartIndex + 1}</div>
            </div>
            <div class="ticket-divider">--------------------------------</div>
            <div class="ticket-items-list">
                ${itemsHtml}
            </div>
            <div class="ticket-divider">--------------------------------</div>
            <div class="ticket-totals-section">
                <div class="ticket-row-total"><span>Subtotal:</span><span>$${datosVenta.subtotal.toFixed(2)}</span></div>
                <div class="ticket-row-total"><span>IVA (16%):</span><span>$${datosVenta.iva.toFixed(2)}</span></div>
                <div class="ticket-row-total main-total"><span>TOTAL:</span><span>$${datosVenta.total.toFixed(2)}</span></div>
                <div class="ticket-row-total"><span>Pago (${datosVenta.metodo_pago}):</span><span>$${datosVenta.monto_recibido.toFixed(2)}</span></div>
                <div class="ticket-row-total"><span>Cambio:</span><span>$${datosVenta.cambio.toFixed(2)}</span></div>
            </div>
            <div class="ticket-divider">================================</div>
            <div class="ticket-center-footer">
                <p>¡Gracias por su compra en Papelería A B C!</p>
                <small>Comprobante Simplificado de Venta</small>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// -------------------------------------------------------------
// MODAL DE SERVICIOS RÁPIDOS DE COPIADO (RF-03)
// -------------------------------------------------------------
function openCopiasModal() {
    const modal = document.getElementById('modal-servicios-copias');
    if (!modal) return;

    document.getElementById('input-cant-copias-bn').value = '';
    document.getElementById('input-cant-copias-color').value = '';
    document.getElementById('input-cant-enmicados').value = '';

    modal.classList.add('active');
}

function agregarServiciosAlCarrito() {
    const cantBN = parseInt(document.getElementById('input-cant-copias-bn').value) || 0;
    const cantCol = parseInt(document.getElementById('input-cant-copias-color').value) || 0;
    const cantEnm = parseInt(document.getElementById('input-cant-enmicados').value) || 0;

    let agregados = 0;

    if (cantBN > 0) {
        const prod = currentProductsCatalog.find(p => p.sku === 'SERV-COPIA-BN');
        if (prod) { addToCart(prod, cantBN); agregados++; }
    }
    if (cantCol > 0) {
        const prod = currentProductsCatalog.find(p => p.sku === 'SERV-COPIA-COL');
        if (prod) { addToCart(prod, cantCol); agregados++; }
    }

    if (agregados > 0) {
        closeAllModals();
        showToast('Servicios de copiado agregados al carrito', 'success');
    } else {
        showToast('Ingrese al menos una cantidad de servicio.', 'warning');
    }
}

// Utilerías UI
function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    focusScanner();
}

function showToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${tipo}`;
    toast.innerHTML = `<span>${escapeHTML(mensaje)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

window.POS_MODULE = {
    initPOS,
    reloadCatalog,
    addToCart,
    switchCart,
    cycleNextCart,
    clearActiveCart,
    openCheckoutModal,
    calcularCambio,
    confirmarVenta,
    openCopiasModal,
    agregarServiciosAlCarrito,
    closeAllModals,
    focusScanner,
    showToast
};
