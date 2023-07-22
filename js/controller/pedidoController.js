window.addEventListener("load", (e) => {
    botonesPaypal();
});

export function botonesPaypal() {
    paypal
        .Buttons({
            style: {
                color: "blue",
                shape: "pill",
                label: "pay",
            },
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: localStorage.getItem("montoTotal"),
                            },
                        },
                    ],
                });
            },
            onApprove: function (data, actions) {
                actions.order.capture().then(function (detalles) {
                    let tokenC = sessionStorage.getItem("access_token");
                    isSessionValid(tokenC).then((resultado) => {
                        if (resultado["exito"]) {
                            const carrito =
                                localStorage.getItem("carrito") === null
                                    ? []
                                    : JSON.parse(localStorage.getItem("carrito"));
                            const direccion = document.getElementById("inputDireccion").value;
                            const total = parseFloat(localStorage.getItem("montoTotal"));
                            $.ajax({
                                type: "POST",
                                url: dominioFun() + "detallepedido/ins/",
                                data: JSON.stringify({
                                    "direccion": direccion,
                                    "total": total,
                                    "idcliente": resultado["resultado"][0],
                                    "carrito": carrito
                                }),
                                dataType: "json",
                                contentType: "application/json",
                                success: function (data) {
                                    mensajeValidacion(data["resultado"], data["exito"]);
                                    if (data["exito"]) {
                                        localStorage.setItem("carrito", JSON.stringify([]));
                                        localStorage.setItem("montoTotal", 0);
                                        listarCarrito();
                                        actualizarMontoVista();
                                    }
                                },
                            });
                        }
                    });
                });
            },
            onCancel: function (data) {
                mensajeValidacion("Compra cancelada", false);
            },
            onError(err) {
                mensajeValidacion("Hubo un error en la compra", false);
            }
        })
        .render("#paypal-button-container");
}
import { dominioFun, mensajeValidacion } from './mainController.js';
import { isSessionValid } from './validadorCli.js';
import { listarCarrito, actualizarMontoVista } from './carritoController.js';