// ==========================================
// Simulador interactivo: ARAPERFUL
// Entrega Final - Curso JavaScript
// Enfoque: DOM, Eventos, Storage y Librerías
// ==========================================

// 1. Clase para estandarizar productos
class Producto {
    constructor(id, nombre, precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
    }
}

// Uso de Luxon
const { DateTime } = luxon;

// 2. Base de datos de productos
let productos = [];

// Fetch asincrónico de productos
fetch("data/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data.map(p => new Producto(p.id, p.nombre, p.precio));
        mostrarProductos();
    })
    .catch(() => {
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los productos.",
            icon: "error",
            confirmButtonColor: "#9c27b0"
        });
    });

// 3. Inicialización del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// 4. Captura de elementos del DOM
const contenedorProds = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalPrecio = document.getElementById("total-precio");
const btnVaciar = document.getElementById("btn-vaciar");
const btnFinalizar = document.getElementById("btn-finalizar");
const mensajeBienvenida = document.getElementById("descripcion");
const btnPagar = document.getElementById("btn-pagar");
const divOpcionesPago = document.getElementById("opciones-pago");
const btnConfirmarPago = document.getElementById("btn-confirmar-pago");

// 5. FUNCIONES

function mostrarProductos() {
    contenedorProds.innerHTML = "";

    productos.forEach(prod => {
        const card = document.createElement("div");
        card.className = "producto-card";
        card.innerHTML = `
            <h3>${prod.nombre}</h3>
            <p>Precio: $${prod.precio}</p>
            <button id="btn-comprar-${prod.id}">Agregar</button>
        `;
        contenedorProds.appendChild(card);

        const boton = document.getElementById(`btn-comprar-${prod.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(prod.id);
        });
    });
}

function agregarAlCarrito(id) {
    const productoSeleccionado = productos.find(p => p.id === id);
    carrito.push(productoSeleccionado);
    actualizarCarrito();

    // Toastify notificación
    Toastify({
        text: `${productoSeleccionado.nombre} agregado al carrito`,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
            background: "#9c27b0",
        }
    }).showToast();
}

function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let acumulado = 0;

    carrito.forEach(prod => {
        const li = document.createElement("li");
        li.innerText = `${prod.nombre} - $${prod.precio}`;
        listaCarrito.appendChild(li);
        acumulado += prod.precio;
    });

    totalPrecio.innerText = acumulado;
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// 6. EVENTOS

btnVaciar.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem("carrito");

    Swal.fire({
        title: "Carrito vaciado",
        text: "Tu carrito fue vaciado correctamente.",
        icon: "info",
        confirmButtonColor: "#9c27b0"
    });
});

btnFinalizar.addEventListener("click", () => {
    if (carrito.length > 0) {
        mensajeBienvenida.innerText = "¡Pedido listo! Por favor, selecciona el botón Pagar debajo.";
    } else {
        Swal.fire({
            title: "Carrito vacío",
            text: "Agrega productos antes de finalizar la compra.",
            icon: "warning",
            confirmButtonColor: "#9c27b0"
        });
    }
});

btnPagar.addEventListener("click", () => {
    if (carrito.length > 0) {
        divOpcionesPago.style.display = "block";
        btnPagar.style.display = "none";
    } else {
        Swal.fire({
            title: "Carrito vacío",
            text: "Agrega productos antes de pagar.",
            icon: "warning",
            confirmButtonColor: "#9c27b0"
        });
    }
});

btnConfirmarPago.addEventListener("click", () => {
    const seleccion = document.querySelector('input[name="metodo"]:checked');

    if (seleccion) {
        const metodo = seleccion.value;
        let totalActual = parseFloat(totalPrecio.innerText);

        // Aplicar descuento si es efectivo
        if (metodo === "Efectivo") {
            totalActual = totalActual * 0.9;
        }

        const fecha = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);

        carrito = [];
        localStorage.removeItem("carrito");
        actualizarCarrito();

        divOpcionesPago.style.display = "none";
        btnPagar.style.display = "inline-block";
        seleccion.checked = false;

        Swal.fire({
            title: "¡Compra realizada!",
            text: `Pagaste $${totalActual.toFixed(2)} con ${metodo} el ${fecha}`,
            icon: "success",
            confirmButtonColor: "#9c27b0"
        });

        mensajeBienvenida.innerText = "Bienvenido a Araperful. Selecciona los productos que desees agregar al carrito.";

    } else {
        Swal.fire({
            title: "Selecciona un método de pago",
            text: "Debes elegir una opción antes de continuar.",
            icon: "warning",
            confirmButtonColor: "#9c27b0"
        });
    }
});

// 7. EJECUCIÓN INICIAL
actualizarCarrito();