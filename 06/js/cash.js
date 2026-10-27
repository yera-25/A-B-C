/**
 * cash.js - Controlador Profesional de Control de Caja, Turnos y Arqueo Rápido para "Papelería A B C"
 * Entregable Oficial de la Fase 5: Sprint 2 (Módulo de Ventas y Control de Caja)
 * Optimizado para máxima agilidad operativa en mostrador.
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
    const salesSpei = document.getElementById('cash-sales-spei');
    const manualEntries = document.getElementById('cash-manual-entries');
    const manualWithdrawals = document.getElementById('cash-manual-withdrawals');
    const expectedDrawer = document.getElementById('cash-expected-drawer');
    const btnReabrir = document.getElementById('btn-reabrir-turno');
    const btnCorteZ = document.getElementById('btn-ejecutar-corte-z');

    if (!turno || turno.estado === 'CERRADO') {
        if (statusBadge) {
            statusBadge.textContent = 'TURNO CERRADO';
            statusBadge.style.color = '#d9534f';
        }
        if (btnReabrir) btnReabrir.style.display = 'inline-block';
        if (btnCorteZ) btnCorteZ.disabled = true;
        return;
    }

    if (btnReabrir) btnReabrir.style.display = 'none';
    if (btnCorteZ) btnCorteZ.disabled = false;

    if (statusBadge) {
        statusBadge.textContent = 'TURNO #1 ABIERTO';
        statusBadge.style.color = '#3a8e63';
    }
    if (cashierName) cashierName.textContent = turno.usuario || 'Gerardo Cabrera';
    if (openDate) openDate.textContent = new Date(turno.fecha_apertura).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
    if (initialFund) initialFund.textContent = `$${(turno.monto_inicial_fondo || 0).toFixed(2)}`;
    if (salesCash) salesCash.textContent = `$${(turno.total_ventas_efectivo || 0).toFixed(2)}`;
    if (salesCard) salesCard.textContent = `$${(turno.total_ventas_tarjeta || 0).toFixed(2)}`;
    if (salesSpei) salesSpei.textContent = `$${(turno.total_ventas_transferencia || 0).toFixed(2)}`;
    if (manualEntries) manualEntries.textContent = `+$${(turno.total_entradas_manuales || 0).toFixed(2)}`;
    if (manualWithdrawals) manualWithdrawals.textContent = `-$${(turno.total_salidas_manuales || 0).toFixed(2)}`;

    const totalCajonEsperado = (turno.monto_inicial_fondo || 0) + 
                               (turno.total_ventas_efectivo || 0) + 
                               (turno.total_entradas_manuales || 0) - 
                               (turno.total_salidas_manuales || 0);

    if (expectedDrawer) expectedDrawer.textContent = `$${totalCajonEsperado.toFixed(2)}`;

    calcularArqueoCierre();
    if (window.AUTH_MODULE && typeof window.AUTH_MODULE.aplicarRestriccionesRBAC === 'function') {
        window.AUTH_MODULE.aplicarRestriccionesRBAC();
    }
}

// Copiar automáticamente el monto esperado para cuadre exacto en 1 clic
function copiarMontoEsperado() {
    const expectedDisplay = document.getElementById('cash-expected-drawer');
    const inputContado = document.getElementById('input-arqueo-contado');
    if (!expectedDisplay || !inputContado) return;

    const esperado = parseFloat(expectedDisplay.textContent.replace('$', '').replace(/,/g, '')) || 0;
    inputContado.value = esperado.toFixed(2);
    calcularArqueoCierre();
    inputContado.focus();
    inputContado.select();
}

// Comparación matemática: Efectivo Físico vs. Esperado en Cajón
function calcularArqueoCierre() {
    const inputContado = document.getElementById('input-arqueo-contado');
    const diffDisplay = document.getElementById('arqueo-diferencia-display');
    const expectedDisplay = document.getElementById('cash-expected-drawer');

    if (!expectedDisplay || !inputContado || !diffDisplay) return;

    const esperado = parseFloat(expectedDisplay.textContent.replace('$', '').replace(/,/g, '')) || 0;
    const contado = parseFloat(inputContado.value) || 0;
    const diferencia = contado - esperado;

    if (Math.abs(diferencia) < 0.01) {
        diffDisplay.textContent = '$0.00 (Corte Cuadrado Exacto)';
        diffDisplay.style.color = '#3a8e63';
    } else if (diferencia > 0) {
        diffDisplay.textContent = `+$${diferencia.toFixed(2)} (Sobrante en Caja)`;
        diffDisplay.style.color = '#2563eb';
    } else {
        diffDisplay.textContent = `-$${Math.abs(diferencia).toFixed(2)} (Faltante en Caja)`;
        diffDisplay.style.color = '#d9534f';
    }
}

// Registrar Movimiento Manual de Efectivo (Entrada / Retiro)
function abrirModalMovimiento(tipo = 'ENTRADA') {
    const modal = document.getElementById('modal-movimiento-caja');
    const selectTipo = document.getElementById('mov-caja-tipo');
    const title = document.getElementById('modal-mov-title');
    if (!modal) return;

    if (selectTipo) selectTipo.value = tipo;
    if (title) title.textContent = tipo === 'ENTRADA' ? 'Registrar Entrada de Efectivo' : 'Registrar Retiro de Efectivo';
    
    document.getElementById('mov-caja-monto').value = '';
    document.getElementById('mov-caja-concepto').value = '';
    modal.classList.add('active');

    setTimeout(() => {
        const inputMonto = document.getElementById('mov-caja-monto');
        if (inputMonto) inputMonto.focus();
    }, 50);
}

async function handleMovimientoCajaSubmit(event) {
    event.preventDefault();
    const tipo = document.getElementById('mov-caja-tipo').value;
    const monto = parseFloat(document.getElementById('mov-caja-monto').value) || 0;
    const concepto = document.getElementById('mov-caja-concepto').value.trim();

    if (monto <= 0) {
        window.POS_MODULE.showToast('El monto debe ser mayor a $0.00', 'warning');
        return;
    }
    if (!concepto) {
        window.POS_MODULE.showToast('Ingrese un concepto o justificación.', 'warning');
        return;
    }

    try {
        await window.POS_DB.registrarMovimientoCaja(tipo, monto, concepto);
        window.closeAllModals();
        window.POS_MODULE.showToast(`Movimiento de ${tipo.toLowerCase()} por $${monto.toFixed(2)} registrado correctamente`, 'success');
        await renderCashDashboard();
    } catch (err) {
        window.POS_MODULE.showToast('Error al registrar movimiento: ' + err.message, 'error');
    }
}

// Cerrar Turno de Caja y Generar Comprobante Oficial de Corte Z
async function cerrarTurnoCaja() {
    if (window.AUTH_MODULE && !window.AUTH_MODULE.canPerformCashCut()) {
        alert('Acceso restringido: Los cajeros no tienen autorización para realizar cortes de caja. Esta función es exclusiva del perfil SUPERVISOR.');
        return;
    }
    const inputContado = document.getElementById('input-arqueo-contado');
    const contado = parseFloat(inputContado ? inputContado.value : NaN);

    if (isNaN(contado)) {
        alert('Por favor ingrese el total de efectivo físico contado en el cajón (o presione "Cuadre Exacto").');
        if (inputContado) inputContado.focus();
        return;
    }

    const esperadoDisplay = document.getElementById('cash-expected-drawer');
    const esperado = parseFloat(esperadoDisplay.textContent.replace('$', '').replace(/,/g, '')) || 0;
    const diferencia = contado - esperado;
    const difStr = diferencia >= 0 ? `+$${diferencia.toFixed(2)}` : `-$${Math.abs(diferencia).toFixed(2)}`;

    const confirmMsg = `¿Confirmar Cierre de Turno y Emisión de Corte Z?\n\n` +
                       `Efectivo Esperado: $${esperado.toFixed(2)}\n` +
                       `Efectivo Físico Contado: $${contado.toFixed(2)}\n` +
                       `Diferencia: ${difStr}\n\n` +
                       `Al aceptar, el turno quedará CERRADO y se generará el Comprobante de Auditoría.`;

    if (!confirm(confirmMsg)) return;

    try {
        const corte = await window.POS_DB.registrarCorteTurno(contado, {
            efectivo_contado: contado,
            fecha: new Date().toISOString()
        });

        await renderCashDashboard();
        mostrarComprobanteCorteZ(corte);
        window.POS_MODULE.showToast('Turno cerrado exitosamente. Reporte Z emitido.', 'success');
    } catch (err) {
        alert('Error al cerrar turno: ' + err.message);
    }
}

// Renderizar Vista Previa de Corte de Turno (Reporte Z)
function mostrarComprobanteCorteZ(corte) {
    const modal = document.getElementById('modal-corte-reporte-z');
    const renderZone = document.getElementById('corte-z-render-zone');
    if (!modal || !renderZone) return;

    const fechaApertura = new Date(corte.fecha_apertura).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
    const fechaCierre = new Date(corte.fecha_cierre).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });

    renderZone.innerHTML = `
        <div class="ticket-thermal-container" style="max-width: 380px; margin: 0 auto;">
            <div class="ticket-center-header">
                <img src="LOGO.jpg" alt="Papelería A B C" class="ticket-logo-img" onerror="this.style.display='none'"/>
                <div class="ticket-biz-name">Papelería A B C</div>
                <div class="ticket-biz-meta">AUDITORÍA Y CORTE DE CAJA (REPORTE Z)</div>
                <div class="ticket-biz-meta">RFC: PABC261005ABC</div>
                <div class="ticket-biz-meta">Av. Tecnológico #120, Col. Centro</div>
            </div>
            <div class="ticket-divider">================================</div>
            <div class="ticket-meta-info">
                <div><b>Folio Corte:</b> ${corte.folio_corte}</div>
                <div><b>Cajero:</b> ${corte.cajero}</div>
                <div><b>Apertura:</b> ${fechaApertura}</div>
                <div><b>Cierre:</b> ${fechaCierre}</div>
            </div>
            <div class="ticket-divider">--------------------------------</div>
            <div class="ticket-totals-section">
                <div class="ticket-row-total"><span>Fondo Inicial de Caja:</span><b>$${Number(corte.fondo_inicial).toFixed(2)}</b></div>
                <div class="ticket-row-total"><span>(+) Ventas en Efectivo:</span><span>$${Number(corte.ventas_efectivo).toFixed(2)}</span></div>
                <div class="ticket-row-total"><span>(+) Entradas Manuales:</span><span>$${Number(corte.entradas_manuales).toFixed(2)}</span></div>
                <div class="ticket-row-total"><span>(-) Retiros Manuales:</span><span>-$${Number(corte.retiros_manuales).toFixed(2)}</span></div>
                <div class="ticket-divider">--------------------------------</div>
                <div class="ticket-row-total"><span>(=) Efectivo Esperado:</span><b>$${Number(corte.esperado_cajon).toFixed(2)}</b></div>
                <div class="ticket-row-total"><span>Efectivo Físico Contado:</span><b>$${Number(corte.contado_fisico).toFixed(2)}</b></div>
                <div class="ticket-row-total ${corte.diferencia < 0 ? 'text-danger' : 'text-success'}" style="font-size: 1.05rem; font-weight: 800;">
                    <span>Diferencia:</span>
                    <span>${corte.diferencia >= 0 ? '+' : ''}$${Number(corte.diferencia).toFixed(2)}</span>
                </div>
                <div class="ticket-divider">--------------------------------</div>
                <div class="ticket-row-total"><span>Ventas con Tarjeta:</span><span>$${Number(corte.ventas_tarjeta).toFixed(2)}</span></div>
                <div class="ticket-row-total"><span>Ventas con Transferencia:</span><span>$${Number(corte.ventas_transferencia).toFixed(2)}</span></div>
                <div class="ticket-row-total main-total"><span>VENTA TOTAL DEL TURNO:</span><span>$${Number(corte.total_ventas).toFixed(2)}</span></div>
            </div>
            <div class="ticket-divider">================================</div>
            <div style="margin-top: 24px; text-align: center;">
                <div style="border-top: 1px solid #94a3b8; width: 80%; margin: 24px auto 4px auto;"></div>
                <small style="color: #64748b;">Firma de Cajero: ${corte.cajero}</small>
                <div style="border-top: 1px solid #94a3b8; width: 80%; margin: 24px auto 4px auto;"></div>
                <small style="color: #64748b;">Firma de Supervisor / Administrador</small>
            </div>
            <div class="ticket-center-footer" style="margin-top: 16px;">
                <small>Papelería A B C - Sistema POS Seguro</small>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// Reabrir nuevo turno de caja para la siguiente jornada
async function reabrirTurno() {
    const fondoStr = prompt('Ingrese el monto de fondo inicial para el nuevo turno:', '500.00');
    if (!fondoStr) return;
    const fondo = parseFloat(fondoStr);
    if (isNaN(fondo) || fondo < 0) {
        alert('Monto de fondo inválido.');
        return;
    }

    await window.POS_DB.reabrirNuevoTurno(fondo);
    await renderCashDashboard();
    window.POS_MODULE.showToast(`Nuevo turno abierto con fondo de $${fondo.toFixed(2)} MXN`, 'success');
}

window.CASH_MODULE = {
    initCash,
    renderCashDashboard,
    calcularArqueoCierre,
    copiarMontoEsperado,
    abrirModalMovimiento,
    handleMovimientoCajaSubmit,
    cerrarTurnoCaja,
    mostrarComprobanteCorteZ,
    reabrirTurno
};
