window.addEventListener('load', (e) => {
    categoriaSel();
    platilloSel();
});

window.platilloSel = platilloSel;
export function platilloSel(idCategoria = null) {
    const url = idCategoria === null ? `${dominioFun()}platillo/sel/` : `${dominioFun()}platillo/sel/${idCategoria}/`;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            let idCategoriaGlobal = idCategoria;
            let contenido = '';
            if (data["exito"] === true) {
                $.each(data["resultado"], function (llave, valor) {
                    let template = `<div class="box">`;
                    template += `<div class="price">S/<span>${valor["Precio"]}</span></div>`;
                    template += `<img src="${dominioFun()}platillo/foto/${valor["CodigoPlatillo"]}/" alt="" />`;
                    template += `<div class="name">${valor["NombrePlatillo"]}</div>`;
                    template += `<form action="" method="post">`;
                    template += `<input type="hidden" value="${valor["CodigoPlatillo"]}" min="1" max="100" value="1" class="qty inputCodigos" name="qty" />`;
                    template += `<input type="number" min="1" max="100" value="1" class="qty inputCarrito" name="qty" />`;
                    template += `<input type="submit" value="Agregar" name="add_to_cart" class="btn btnAgregarPlatillo" />`;
                    template += `</form>`;
                    template += `</div>`;
                    contenido += template;
                });
            }
            $('#menuContainer').html(contenido);
            agregarPlatilloCarrito();
        }
    });
}

export function categoriaSel() {
    $.ajax({
        type: "GET",
        url: `${dominioFun()}categoria/sel/`,
        dataType: "json",
        success: function (data) {
            let contenido = '<li><button onclick="platilloSel()" class="btn">Todos</button></li>';
            if (data["exito"] === true) {
                $.each(data["resultado"], function (llave, valor) {
                    let template = `<li><button class="btn" onclick="platilloSel(${valor["IDCategoria"]})">${valor["NomCategoria"]}</button></li>`;
                    contenido += template;
                });
                $('#listaCargo').html(contenido);
            }
        }
    });
}

/**
 * Permite agregar un producto al carrito
 *
 * @param
 * @returns
 */
function agregarPlatilloCarrito() {
    const btnsAgregarPlatillo = document.querySelectorAll('.btnAgregarPlatillo');
    const inputsCarrito = document.querySelectorAll('.inputCarrito');
    const inputsCodigos = document.querySelectorAll('.inputCodigos');
    for (let i = 0; i < btnsAgregarPlatillo.length; i++) {
        const btnAgregarPlatillo = btnsAgregarPlatillo[i];
        const inputCarrito = inputsCarrito[i];
        const inputCodigo = inputsCodigos[i];
        btnAgregarPlatillo.addEventListener('click', (e) => {
            e.preventDefault();
            const carrito = localStorage.getItem("carrito") === null ? [] : JSON.parse(localStorage.getItem("carrito"));

            const validador = buscarElementCarrito(inputCodigo.value);
            if (typeof validador === 'number') {
                carrito[validador][1] = carrito[validador][1] + parseInt(inputCarrito.value);
            } else {
                carrito.push([
                    parseInt(inputCodigo.value),
                    parseInt(inputCarrito.value)
                ]);
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            const mensaje = typeof validador === 'number' ? "Producto actualizado en el carrito" : "Producto registrado al carrito"
            miniAlerta("success", mensaje);
            listarCarrito();
            actualizarMontoVista();
        })

    }
}
import { dominioFun, miniAlerta } from './mainController.js';
import { buscarElementCarrito, listarCarrito, actualizarMontoVista } from './carritoController.js';