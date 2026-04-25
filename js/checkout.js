let deliveryCosto = 0;

document.addEventListener('DOMContentLoaded', function () {
    initCheckout();
});


function initCheckout() {
    renderResumenPedido();
    initMetodoPago();

    const zonaSelect = document.getElementById('zona');
    if (zonaSelect) {
        zonaSelect.addEventListener('change', calcularDelivery);
    }
}


function mostrarModal(mensaje, tipo = 'info') {

    const titulo = document.getElementById('modalTitulo');
    const texto = document.getElementById('modalTexto');

    let icono = 'fa-info-circle';
    let color = 'text-primary';

    if (tipo === 'error') {
        icono = 'fa-exclamation-circle';
        color = 'text-danger';
    }

    if (tipo === 'success') {
        icono = 'fa-check-circle';
        color = 'text-success';
    }

    titulo.innerHTML = `<i class="fas ${icono} me-2 ${color}"></i>Mensaje`;
    texto.textContent = mensaje;

    const modal = new bootstrap.Modal(document.getElementById('modalMensaje'));
    modal.show();
}


// Método de pago
function initMetodoPago() {
    const radios = document.querySelectorAll('input[name="metodoPago"]');
    const tarjetaFields = document.getElementById('tarjeta-fields');

    radios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'tarjeta') {
                tarjetaFields.style.display = 'block';
            } else {
                tarjetaFields.style.display = 'none';
            }
        });
    });
}


// Resumen del pedido
function renderResumenPedido() {
    const carrito = getCarrito();
    const contenedor = document.getElementById('resumen-items');

    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <p class="text-muted text-center">No hay productos</p>
        `;
        return;
    }

    carrito.forEach(item => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between mb-2';

        div.innerHTML = `
            <span>${item.nombre} x${item.cantidad}</span>
            <span>${formatPrecio(item.precio * item.cantidad)}</span>
        `;

        contenedor.appendChild(div);
    });

    actualizarTotales();
}


// Delivery
function calcularDelivery() {
    const zonaSelect = document.getElementById('zona');
    if (!zonaSelect) return;

    const zona = zonaSelect.value;

    if (!zona) {
        deliveryCosto = 0;
    } else {
        deliveryCosto = zonasDelivery[zona] || 0;
    }

    actualizarTotales();
}


// Totales
function actualizarTotales() {
    const subtotal = getTotalCarrito();
    const total = subtotal + deliveryCosto;

    document.getElementById('subtotal').textContent = formatPrecio(subtotal);
    document.getElementById('delivery').textContent = formatPrecio(deliveryCosto);
    document.getElementById('total').textContent = formatPrecio(total);
}


// Validar formulario
function validarFormulario() {

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const zona = document.getElementById('zona').value;
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked');

    if (!nombre || !telefono || !direccion || !zona) {
        mostrarModal('Completa todos los campos obligatorios', 'error');
        return false;
    }

    if (!metodoPago) {
        mostrarModal('Selecciona un método de pago', 'error');
        return false;
    }

    if (metodoPago.value === 'tarjeta') {
        const numero = document.getElementById('numero-tarjeta')?.value.trim();
        const fecha = document.getElementById('fecha-exp')?.value.trim();
        const cvv = document.getElementById('cvv')?.value.trim();

        if (!numero || !fecha || !cvv) {
            mostrarModal('Completa los datos de la tarjeta', 'error');
            return false;
        }
    }

    return true;
}


// Confirmar pedido
function confirmarPedido() {

    const carrito = getCarrito();

    if (carrito.length === 0) {
        mostrarModal('El carrito está vacío', 'error');
        return;
    }

    if (!validarFormulario()) return;

    const pedido = {
        cliente: {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            zona: document.getElementById('zona').value,
            referencia: document.getElementById('referencia').value
        },
        productos: carrito,
        pago: {
            metodo: document.querySelector('input[name="metodoPago"]:checked').value
        },
        totales: {
            subtotal: getTotalCarrito(),
            delivery: deliveryCosto,
            total: getTotalCarrito() + deliveryCosto
        },
        fecha: new Date().toISOString(),
        tiempoEstimado: '30-45 minutos'
    };

    localStorage.setItem('ultimoPedido', JSON.stringify(pedido));
    localStorage.removeItem('carrito');

    mostrarModal('Pedido confirmado correctamente', 'success');

    setTimeout(() => {
        window.location.href = 'confirmacion.html';
    }, 1500);
}