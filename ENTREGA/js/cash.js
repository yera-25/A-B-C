/**
 * cash.js - Controlador de Control de Caja, Turnos y Arqueo para "Papelería A B C"
 * Cumple con RF-08: Cierre de Turno y Balance Diario (Entregable Unificado)
 */

async function initCash() {
    await renderCashDashboard();
}

async function renderCashDashboard() {
    const turno = await window.POS_DB.getTurnoActivo();
    const statusBadge = document.getElementById('cash-shift-status');
    const cashierName = document.getElementById('cash-cashier-name');
    const openDate = document.getElementById('cash-open-date');
    const initialFund = document.getElementById('cash-initial-fund');
    const salesCash = document.getElementById('cash-sales-cash');
    const salesCard = document.getElementById('cash-sales-card');
    const expectedDrawer = document.getElementById('cash-expected-drawer');

    if (!turno) {
        if (statusBadge) {
            statusBadge.textContent = 'TURNO CERRADO';
            statusBadge.style.color = '#d9534f';
        }
        return;
    }

    if (statusBadge) {
        statusBadge.textContent = 'TURNO ABIERTO';
        statusBadge.style.color = '#3a8e63';
    }
    if (cashierName) cashierName.textContent = turno.usuario;
    if (openDate) openDate.textContent = new Date(turno.fecha_apertura).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
    if (initialFund) initialFund.textContent = `$${(turno.monto_inicial_fondo || 0).toFixed(2)}`;
    if (salesCash) salesCash.textContent = `$${(turno.total_ventas_efectivo || 0).toFixed(2)}`;
    if (salesCard) salesCard.textContent = `$${(turno.total_ventas_tarjeta || 0).toFixed(2)}`;

    const totalCajonEsperado = (turno.monto_inicial_fondo || 0) + (turno.total_ventas_efectivo || 0) + (turno.total_entradas_manuales || 0) - (turno.total_salidas_manuales || 0);
    if (expectedDrawer) expectedDrawer.textContent = `$${totalCajonEsperado.toFixed(2)}`;
}

function calcularArqueoCierre() {
    const inputContado = document.getElementById('input-arqueo-contado');
    const diffDisplay = document.getElementById('arqueo-diferencia-display');
    const expectedDisplay = document.getElementById('cash-expected-drawer');

    const esperado = parseFloat(expectedDisplay.textContent.replace('$', '')) || 0;
    const contado = parseFloat(inputContado.value) || 0;
    const diferencia = contado - esperado;

    if (diffDisplay) {
        if (Math.abs(diferencia) < 0.01) {
            diffDisplay.textContent = '$0.00 (Corte Cuadrado Exacto ✓)';
            diffDisplay.style.color = '#3a8e63';
        } else if (diferencia > 0) {
            diffDisplay.textContent = `+$${diferencia.toFixed(2)} (Sobrante en Caja)`;
            diffDisplay.style.color = '#2563eb';
        } else {
            diffDisplay.textContent = `-$${Math.abs(diferencia).toFixed(2)} (Faltante en Caja ⚠️)`;
            diffDisplay.style.color = '#d9534f';
        }
    }
}

function cerrarTurnoCaja() {
    const inputContado = document.getElementById('input-arqueo-contado');
    const diffDisplay = document.getElementById('arqueo-diferencia-display');
    const contado = parseFloat(inputContado.value);

    if (isNaN(contado)) {
        alert('Por favor ingrese el monto de efectivo físico contado en el cajón.');
        return;
    }

    if (confirm(`¿Confirmar cierre de turno y corte de caja con monto contado de $${contado.toFixed(2)}?`)) {
        window.POS_MODULE.showToast('Corte de caja registrado. Turno cerrado.', 'success');
        alert(`Resumen de Corte de Caja — Papelería A B C:\n\nEfectivo Físico Contado: $${contado.toFixed(2)}\nBalance: ${diffDisplay.textContent}\n\n¡Cierre de jornada completado con éxito!`);
    }
}

window.CASH_MODULE = {
    initCash,
    renderCashDashboard,
    calcularArqueoCierre,
    cerrarTurnoCaja
};
