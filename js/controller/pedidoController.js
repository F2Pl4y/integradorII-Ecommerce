import { dominio } from './mainController.js';
window.addEventListener("load", (e) => {
    botonesPaypal();
});
/*
    Se encarga de configurar y mostrar los botones de PayPal en la interfaz de usuario.
*/
function botonesPaypal() {
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
                    console.log(detalles);
                    let tokenC = sessionStorage.getItem("access_token");
                    isSessionValid(tokenC).then((resultado) => {
                        console.log(resultado);
                        if (resultado["exito"]) {
                            const carrito =
                                localStorage.getItem("carrito") === null
                                    ? []
                                    : JSON.parse(localStorage.getItem("carrito"));
                            const direccion = document.getElementById("inputDireccion").value;
                            const total = parseFloat(localStorage.getItem("montoTotal"));
                            $.ajax({
                                type: "POST",
                                url: dominio + "detallepedido/ins/",
                                data: JSON.stringify({
                                    "direccion": direccion,
                                    "total": total,
                                    "idcliente": resultado["resultado"][0],
                                    "carrito": carrito
                                }),
                                dataType: "json",
                                contentType: "application/json",
                                success: function (data) {
                                    console.log(data);
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