/**
 * app.js - Orquestador del Módulo de Inventario para "Papelería A B C"
 * Sprint 1 (Fase 4 del Calendario)
 */

// ================= GESTOR UNIVERSAL DE VENTANAS EMERGENTES Y MODALES =================
function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
        modal.style.display = '';
    });
}
window.closeAllModals = closeAllModals;
window.closeModal = closeAllModals;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Reloj en vivo
    startLiveClock();

    // 2. Activar navegación de pestañas y atajos de teclado INMEDIATAMENTE
    setupTabNavigation();
    setupGlobalShortcuts();
    setupGlobalModalHandlers();

    // 3. Inicializar base de datos IndexedDB / SQL Store
    try {
        await window.POS_DB.initDB();
        console.log('[App] Base de datos PapeleriaABC_POS_DB lista para Sprint 1 de Inventario.');
    } catch (err) {
        console.error('[App] Error inicializando base de datos:', err);
    }

    // 4. Inicializar módulos protegidos individualmente
    const initModuleSafely = async (name, fn) => {
        try {
            if (fn) await fn();
        } catch (e) {
            console.error(`[App] Error inicializando módulo ${name}:`, e);
        }
    };

    if (window.INVENTORY_MODULE) {
        window.INVENTORY_MODULE.closeAllModals = closeAllModals;
        await initModuleSafely('Inventario', () => window.INVENTORY_MODULE.initInventoryModule());
    }
    if (window.MASTERS_MODULE) {
        window.MASTERS_MODULE.closeAllModals = closeAllModals;
        await initModuleSafely('Maestros', () => window.MASTERS_MODULE.initMastersModule());
    }
    if (window.MOVEMENTS_MODULE) await initModuleSafely('Movimientos', () => window.MOVEMENTS_MODULE.initMovementsModule());
});

// Manejador global de cierre de ventanas emergentes (Modales)
function setupGlobalModalHandlers() {
    // Clics en cruz (X), botones Cancelar en pie de modal y clic en fondo exterior
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-modal-close')) {
            e.preventDefault();
            closeAllModals();
            return;
        }

        const modalFooterCancelBtn = e.target.closest('.modal-dialog-footer .btn-secondary, .modal-dialog-box button[data-action="close"]');
        if (modalFooterCancelBtn) {
            e.preventDefault();
            closeAllModals();
            return;
        }

        if (e.target.classList.contains('modal-overlay')) {
            e.preventDefault();
            closeAllModals();
            return;
        }
    });
}

// Reloj en vivo
function startLiveClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    const updateTime = () => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// Enrutamiento de pestañas
function setupTabNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            navButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.app-tab-section').forEach(sec => sec.classList.remove('active'));

            btn.classList.add('active');
            const targetSec = document.getElementById(targetTab);
            if (targetSec) targetSec.classList.add('active');

            // Acciones al cambiar de pestaña
            if (targetTab === 'tab-catalogo') {
                window.INVENTORY_MODULE.reloadCatalogTable();
            } else if (targetTab === 'tab-marcas-categorias') {
                window.MASTERS_MODULE.reloadMasters();
            } else if (targetTab === 'tab-entradas' || targetTab === 'tab-mermas') {
                window.MOVEMENTS_MODULE.populateProductSelectors();
            } else if (targetTab === 'tab-kardex') {
                window.MOVEMENTS_MODULE.reloadKardexTable();
            }
        });
    });
}

// Atajos de teclado para navegación rápida de almacén
function setupGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F1') {
            e.preventDefault();
            const searchInput = document.getElementById('catalog-search-input');
            if (searchInput) searchInput.focus();
        } else if (e.key === 'F2') {
            e.preventDefault();
            window.INVENTORY_MODULE.openProductModal();
        } else if (e.key === 'Escape') {
            window.INVENTORY_MODULE.closeAllModals();
        }
    });
}
