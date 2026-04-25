document.addEventListener('DOMContentLoaded', () => {
    renderProductos();
});


function renderProductos() {
    const container = document.getElementById('productos-container');
    if (!container) return;

    container.innerHTML = '';

    productos.forEach(producto => {
        container.appendChild(crearCardProducto(producto));
    });
}


// Crear la card de producto
function crearCardProducto(producto) {
    const div = document.createElement('div');
    div.className = 'col-md-6 col-lg-4';

    div.innerHTML = `
        <div class="card product-card h-100">

            <div class="product-img-container">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-img">
            </div>

            <div class="card-body d-flex flex-column">

                <h5 class="card-title">${producto.nombre}</h5>

                <p class="card-text text-muted small">
                    ${producto.descripcion}
                </p>

                <div class="mt-auto">

                    <p class="product-price mb-3">
                        ${formatPrecio(producto.precio)}
                    </p>

                    <div class="d-flex align-items-center gap-2">

                        <input 
                            type="number" 
                            class="form-control form-control-sm qty-input" 
                            value="1" 
                            min="1"
                            id="qty-${producto.id}"
                        >

                        <button 
                            class="btn btn-primary flex-fill"
                            onclick="agregarAlCarrito(${producto.id})"
                        >
                            <i class="fas fa-cart-plus me-1"></i>
                            Agregar
                        </button>

                    </div>

                </div>

            </div>
        </div>
    `;

    return div;
}


// Agregar al carrito
function agregarAlCarrito(productoId) {
    const input = document.getElementById(`qty-${productoId}`);
    let cantidad = parseInt(input.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        cantidad = 1;
        input.value = 1;
    }

    addToCarrito(productoId, cantidad);

    mostrarFeedback(input);
}


function mostrarFeedback(input) {
    input.classList.add('is-valid');

    setTimeout(() => {
        input.classList.remove('is-valid');
    }, 800);
}