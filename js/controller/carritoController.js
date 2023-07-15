const ordenCarrito = 0;
var montoTotal = 100;

window.addEventListener("load", (e) => {
    listarCarrito();
    actualizarCantidadCarrito();
    actualizarMontoVista();
});

function eliminarElementCarrito(idPlatillo) {
    let carrito = localStorage.getItem("carrito") === null ? [] : JSON.parse(localStorage.getItem("carrito"));
    const carritoFiltrado = carrito.filter(elemento => elemento[0] !== idPlatillo);
    localStorage.setItem("carrito", JSON.stringify(carritoFiltrado));
    miniAlerta("error", "Producto eliminado correctamente");
    actualizarCantidadCarrito();
    listarCarrito();
}

async function platilloGet(idPlatillo) {
    const response_1 = await new Promise(function (resolve, reject) {
        fetch(`${dominio}/platillo/get/${idPlatillo}/`)
            .then(function (response) {
                if (response.ok) {
                    resolve(response);
                } else {
                    reject(new Error("Error: " + response.status));
                }
            })
            .catch(function (error) {
                reject(error);
            });
    });
    return response_1.json();
}

function buscarElementCarrito(nombreBuscar) {
    const carrito = localStorage.getItem("carrito") === null ? [] : JSON.parse(localStorage.getItem("carrito"));
    let indice = 0;
    nombreBuscar = parseInt(nombreBuscar);
    for (const element of carrito) {
        if (element[0] === nombreBuscar) {
            return indice;
        }
        indice++;
    }
    return false;
}

async function listarCarrito() {
    const carrito = localStorage.getItem("carrito") === null ? [] : JSON.parse(localStorage.getItem("carrito"));
    let contenido = '';
    for (let i = 0; i < carrito.length; i++) {
        const element = carrito[i];
        let platillo = await platilloGet(element[0]);
        const cantidad = element[1];
        contenido += `<div class="box">`;
        contenido += `<button onclick="eliminarElementCarrito(${platillo.resultado.CodigoPlatillo})" class="fas fa-times"></button>`;
        contenido += `<img src="${dominio}/platillo/foto/${platillo.resultado.CodigoPlatillo}/" alt="" />`;
        contenido += `<div class="content">`;
        contenido += `<p>${platillo.resultado.NombrePlatillo}</span></p>`;
        contenido += `<form action="" method="post">`;
        contenido += `<input type="hidden" class="idPlatillo" name="qty" value="${platillo.resultado.CodigoPlatillo}"/>`;
        contenido += `<input type="number" class="qty inputPlatillo" name="qty" min="1" value="${cantidad}" max="100" />`;
        contenido += `<button type="button" class="fas fa-edit btnUpdateCarrito" name="update_qty"></button>`;
        contenido += `</form>`;
        contenido += `</div>`;
        contenido += `</div>`;
    }
    $("#listaCarrito").html(contenido);
    actualizarCantidadCarrito();
    actualizarCarrito();
    actualizarMontoVista();
}

async function obtenerMontoTotal() {
    const carrito = localStorage.getItem("carrito") === null ? [] : JSON.parse(localStorage.getItem("carrito"));
    const respuesta = await new Promise(function (resolve, reject) {
        fetch(`${dominio}platillo/total/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carrito)
        }).then(function (response) {
            if (response.ok) {
                resolve(response);
            } else {
                reject(new Error("Error: " + response.status));
            }
        })
            .catch(function (error) {
                reject(error);
            });
    });
    return respuesta.json();
}

async function actualizarMontoVista() {
    const monto = await obtenerMontoTotal();
    $('#montoTotal').html('Monto total: S/' + monto["resultado"]);
    localStorage.setItem("montoTotal", monto["resultado"]);
    checkSession();
}

function actualizarCantidadCarrito() {
    const carrito = localStorage.getItem("carrito") === null ? [] : JSON.parse(localStorage.getItem("carrito"));
    let cantidad = 0;
    carrito.forEach(element => cantidad += element[1]);
    $('#cantidadCarrito').html(cantidad);
}

function actualizarCarrito() {
    const btnsUpdateCarrito = document.querySelectorAll(".btnUpdateCarrito");
    const idPlatillos = document.querySelectorAll(".idPlatillo");
    const inputsPlatillo = document.querySelectorAll(".inputPlatillo");
    const carrito = localStorage.getItem("carrito") === null ? [] : JSON.parse(localStorage.getItem("carrito"));
    for (let i = 0; i < btnsUpdateCarrito.length; i++) {
        const btn = btnsUpdateCarrito[i];
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const idPlatillo = idPlatillos[i].value;
            console.log("Platillo" + typeof idPlatillo);
            const cantidad = inputsPlatillo[i].value;
            const indice = buscarElementCarrito(idPlatillo);
            carrito[indice][1] = parseInt(cantidad);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            miniAlerta("success", "Producto actualizado en el carrito");
            listarCarrito();
        });
    }
}