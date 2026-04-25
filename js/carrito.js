let productoAEliminar = null;

document.addEventListener('DOMContentLoaded', function () {
    renderCarrito();
});


function renderCarrito() {
    const carrito = getCarrito();
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoContenido = document.getElementById('carrito-contenido');
    const carritoItems = document.getElementById('carrito-items');

    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoContenido.style.display = 'none';
        return;
    }

    carritoVacio.style.display = 'none';
    carritoContenido.style.display = 'block';

    carritoItems.innerHTML = '';

    carrito.forEach(item => {
        carritoItems.appendChild(crearItem(item));
    });

    actualizarResumen();
}

// Crear item para productos agregados al carrito
function crearItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item d-flex align-items-center mb-4 pb-3 border-bottom';

    div.innerHTML = `
        <img src="${item.imagen}" class="me-3 rounded"
             style="width: 80px; height: 80px; object-fit: cover;">

        <div class="flex-grow-1">

            <h6 class="mb-1">${item.nombre}</h6>
            <small class="text-muted">${formatPrecio(item.precio)}</small>

            <div class="d-flex align-items-center mt-2 gap-2">

                <button class="btn btn-sm btn-outline-secondary"
                        onclick="cambiarCantidad(${item.id}, ${item.cantidad - 1})">
                    <i class="fas fa-minus">-</i>
                </button>

                <span class="fw-bold">${item.cantidad}</span>

                <button class="btn btn-sm btn-outline-secondary"
                        onclick="cambiarCantidad(${item.id}, ${item.cantidad + 1})">
                    <i class="fas fa-plus">+</i>
                </button>

                <button class="btn btn-sm btn-outline-danger ms-2"
                        onclick="abrirModalEliminar(${item.id})">
                    <i class="fas fa-trash me-1">Eliminar</i>
                </button>

            </div>
        </div>

        <div class="text-end">
            <strong>${formatPrecio(item.precio * item.cantidad)}</strong>
        </div>
    `;

    return div;
}

// Cambiar cantidad
function cambiarCantidad(productoId, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        return;
    }

    updateCantidad(productoId, nuevaCantidad);
    renderCarrito();
}

// Abrir modal de confirmación para eliminar producto
function abrirModalEliminar(productoId) {
    productoAEliminar = productoId;

    const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    modal.show();
}

// Confirmar eliminación
document.addEventListener('DOMContentLoaded', function () {
    const btnConfirmar = document.getElementById('btn-confirmar-eliminar');

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', function () {
            if (productoAEliminar !== null) {
                removeFromCarrito(productoAEliminar);
                productoAEliminar = null;

                const modalElement = document.getElementById('modalConfirmacion');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();

                renderCarrito();
            }
        });
    }
});

// Resumen
function actualizarResumen() {
    const subtotal = getTotalCarrito();
    const delivery = 0;
    const total = subtotal + delivery;

    document.getElementById('subtotal').textContent = formatPrecio(subtotal);
    document.getElementById('delivery').textContent = formatPrecio(delivery);
    document.getElementById('total').textContent = formatPrecio(total);
}