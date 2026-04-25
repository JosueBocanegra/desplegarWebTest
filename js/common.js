// Productos disponibles (SIMULACIÓN DE BASE DE DATOS)
const productos = [
    {
        id: 1,
        nombre: "Hamburguesa Clásica",
        descripcion: "Deliciosa hamburguesa con carne de res, lechuga, tomate y salsa especial",
        precio: 15.90,
        imagen: "../imagenes/Hamburguesa_clasica.jpg",
        categoria: "Hamburguesas"
    },
    {
        id: 2,
        nombre: "Combo Familiar",
        descripcion: "2 hamburguesas, papas fritas grandes y 2 bebidas",
        precio: 35.50,
        imagen: "../imagenes/Combo_familiar.jpg",
        categoria: "Combos"
    },
    {
        id: 3,
        nombre: "Pollo Crispy",
        descripcion: "Trozos de pollo crujiente con salsa BBQ",
        precio: 18.90,
        imagen: "../imagenes/Pollo_crispy.jpg",
        categoria: "Pollo"
    },
    {
        id: 4,
        nombre: "Papas Fritas Grandes",
        descripcion: "Porción grande de papas fritas doradas",
        precio: 8.50,
        imagen: "../imagenes/Papas_fritas_grandes.jpg",
        categoria: "Complementos"
    },
    {
        id: 5,
        nombre: "Bebida Grande",
        descripcion: "Refresco de 500ml a elegir",
        precio: 5.00,
        imagen: "../imagenes/Bebida_grande.jpg",
        categoria: "Bebidas"
    },
    {
        id: 6,
        nombre: "Helado Sundae",
        descripcion: "Helado con topping de chocolate y nueces",
        precio: 12.00,
        imagen: "../imagenes/Helado_sundae.jpg",
        categoria: "Postres"
    }
];


// Zonas de delivery y sus costos
const zonasDelivery = {
    "Centro": 5.00,
    "Norte": 8.00,
    "Sur": 7.00,
    "Este": 6.50,
    "Oeste": 6.50
};


function getCarrito() {
    try {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    } catch {
        return [];
    }
}

function saveCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    updateCartCount();
}


// Carrito
function addToCarrito(productoId, cantidad = 1) {
    const carrito = getCarrito();
    const producto = productos.find(p => p.id === productoId);

    if (!producto) return;

    const item = carrito.find(i => i.id === productoId);

    if (item) {
        item.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad,
            imagen: producto.imagen
        });
    }

    saveCarrito(carrito);

    mostrarNotificacion(`${producto.nombre} agregado`, 'success');
}

function removeFromCarrito(productoId) {
    const nuevo = getCarrito().filter(item => item.id !== productoId);
    saveCarrito(nuevo);
}

function updateCantidad(productoId, cantidad) {
    const carrito = getCarrito();
    const item = carrito.find(i => i.id === productoId);

    if (!item) return;

    if (cantidad <= 0) {
        removeFromCarrito(productoId);
        return;
    }

    item.cantidad = cantidad;
    saveCarrito(carrito);
}


// Totales
function getTotalCarrito() {
    return getCarrito().reduce((t, i) => t + i.precio * i.cantidad, 0);
}

function getCantidadTotal() {
    return getCarrito().reduce((t, i) => t + i.cantidad, 0);
}


function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = getCantidadTotal();
}


// Notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {

    const notif = document.createElement('div');
    notif.className = `custom-toast ${tipo}`;

    notif.innerHTML = `
        <div class="toast-body">
            <i class="fas fa-check-circle me-2"></i>
            ${mensaje}
        </div>
    `;

    document.body.appendChild(notif);

    // Animación de entrada y salida
    setTimeout(() => notif.classList.add('show'), 100);

    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}


// Formateo de precios
function formatPrecio(precio) {
    return `S/ ${precio.toFixed(2)}`;
}


document.addEventListener('DOMContentLoaded', updateCartCount);