/**
 * app.js - Orquestador Principal de la Web App Local para "Papelería A B C"
 * Administra el enrutamiento SPA, reloj en vivo y respaldos 1-clic (RNF-06)
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Iniciar reloj del encabezado
    startLiveClock();

    // 2. Inicializar IndexedDB
    try {
        await window.POS_DB.initDB();
        console.log('Persistencia IndexedDB de Papelería A B C lista.');
    } catch (err) {
        console.error('Error inicializando base de datos:', err);
    }

    // 3. Inicializar Módulos de la Aplicación
    await window.POS_MODULE.initPOS();
    await window.INVENTORY_MODULE.initInventory();
    await window.CASH_MODULE.initCash();
    await loadConfigInfo();

    // 4. Configurar Navegación por Pestañas
    setupTabNavigation();

    // 5. Configurar Respaldo en 1 Clic
    setupBackupHandlers();
});

// Reloj en tiempo real
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

// Navegación SPA por pestañas
function setupTabNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Quitar clase activa a todos los botones y secciones
            navButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.app-tab-section').forEach(sec => sec.classList.remove('active'));

            // Activar botón y sección seleccionada
            btn.classList.add('active');
            const targetSec = document.getElementById(targetTab);
            if (targetSec) targetSec.classList.add('active');

            // Si es mostrador, dar foco al escáner
            if (targetTab === 'tab-pos') {
                const searchInp = document.getElementById('barcode-search-input');
                if (searchInp) searchInp.focus();
            } else if (targetTab === 'tab-inventario') {
                window.INVENTORY_MODULE.reloadInventoryTable();
            } else if (targetTab === 'tab-caja') {
                window.CASH_MODULE.renderCashDashboard();
            }
        });
    });
}

// Cargar información de configuración
async function loadConfigInfo() {
    const config = await window.POS_DB.getConfiguracion();
    const nameEl = document.getElementById('cfg-nombre-comercial');
    const rfcEl = document.getElementById('cfg-rfc');
    const dirEl = document.getElementById('cfg-direccion');
    const telEl = document.getElementById('cfg-telefono');
    const leyEl = document.getElementById('cfg-leyenda');

    if (nameEl) nameEl.textContent = config.nombre_comercial;
    if (rfcEl) rfcEl.textContent = config.rfc;
    if (dirEl) dirEl.textContent = config.direccion;
    if (telEl) telEl.textContent = config.telefono;
    if (leyEl) leyEl.textContent = config.leyenda_ticket;
}

// Configurar Respaldos en 1 Clic (RNF-06)
function setupBackupHandlers() {
    const btnExport = document.getElementById('btn-export-backup');
    if (btnExport) {
        btnExport.addEventListener('click', async () => {
            try {
                const jsonStr = await window.POS_DB.exportarRespaldoJSON();
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const fechaStr = new Date().toISOString().slice(0, 10);
                a.href = url;
                a.download = `Respaldo_Papeleria_ABC_${fechaStr}.json`;
                a.click();
                URL.revokeObjectURL(url);
                window.POS_MODULE.showToast('Respaldo descargado exitosamente (1-Clic)', 'success');
            } catch (err) {
                console.error(err);
                window.POS_MODULE.showToast('Error al generar respaldo: ' + err.message, 'error');
            }
        });
    }

    const btnPrintTicket = document.getElementById('btn-imprimir-ticket-modal');
    if (btnPrintTicket) {
        btnPrintTicket.addEventListener('click', () => {
            window.print();
        });
    }
}
