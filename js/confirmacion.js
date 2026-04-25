document.addEventListener('DOMContentLoaded', () => {
    initConfirmacion();
});


function initConfirmacion() {
    const pedido = getPedido();

    if (!pedido) {
        redirigirCatalogo();
        return;
    }

    renderCliente(pedido);
    renderProductos(pedido);
    renderTotales(pedido);
    renderExtras(pedido);

    mostrarMensajeExito();
}


// Obtener pedido
function getPedido() {
    try {
        return JSON.parse(localStorage.getItem('ultimoPedido'));
    } catch {
        return null;
    }
}


// Redireccion segura al catalogo si no hay pedido registrado
function redirigirCatalogo() {
    mostrarNotificacion('No hay pedido registrado', 'error');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}


// Cliente
function renderCliente(pedido) {
    setText('cliente-nombre', pedido.cliente.nombre);
    setText('cliente-telefono', pedido.cliente.telefono);
    setText('cliente-direccion', pedido.cliente.direccion);
    setText('cliente-zona', `Zona: ${pedido.cliente.zona}`);
}


// Productos
function renderProductos(pedido) {
    const container = document.getElementById('productos-confirmacion');
    if (!container) return;

    container.innerHTML = '';

    pedido.productos.forEach(item => {
        const div = document.createElement('div');
        div.className = 'confirm-item';

        div.innerHTML = `
            <div>
                <strong>${item.nombre}</strong>
                <small class="text-muted ms-2">x${item.cantidad}</small>
            </div>
            <span>${formatPrecio(item.precio * item.cantidad)}</span>
        `;

        container.appendChild(div);
    });
}


// Totales
function renderTotales(pedido) {
    setText('subtotal-confirmacion', formatPrecio(pedido.totales.subtotal));
    setText('delivery-confirmacion', formatPrecio(pedido.totales.delivery));
    setText('total-confirmacion', formatPrecio(pedido.totales.total));
}


// Metodo de pago y tiempo estimado
function renderExtras(pedido) {

    const metodo = pedido.pago.metodo === 'tarjeta'
        ? 'Tarjeta de Crédito/Débito'
        : 'Efectivo';

    setText('metodo-pago', metodo);
    setText('tiempo-entrega', pedido.tiempoEstimado);
}


function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}


// Mensaje de exito al confirmar pedido
function mostrarMensajeExito() {
    setTimeout(() => {
        mostrarNotificacion('¡Pedido confirmado! En camino', 'success');
    }, 800);
}


// Imprimir confirmacion
function imprimirConfirmacion() {
    window.print();
}