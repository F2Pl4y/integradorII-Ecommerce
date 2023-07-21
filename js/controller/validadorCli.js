import { dominioFun, mensajeValidacion } from './mainController.js';

export function isSessionValid() {
    const token = sessionStorage.getItem("access_token");
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `${dominioFun()}secureCli`,
            dataType: "json",
            headers: {
                Authorization: "Token " + token,
            },
            success: function (response) {
                resolve(response);
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}

// Función para verificar si el usuario ha iniciado sesión
export function checkSession() {
    let tokenC = sessionStorage.getItem("access_token");
    isSessionValid(tokenC)
        .then((resultado) => {
            const btnCuenta = document.getElementById('user-btn');
            const contenedorPaypalBotones = document.getElementById('paypal-button-container');
            const direccionPedido = document.getElementById('direccionPedido');
            if (resultado["exito"]) {
                btnCuenta.setAttribute("data-toggle", "modal");
                btnCuenta.setAttribute("data-target", "#cuenta");
                $('#nombreCliente').html(resultado["resultado"][3]);
                $('#correoCliente').html(resultado["resultado"][1]);
                $('#dniCliente').html(resultado["resultado"][2]);
                $('#TelefonoCliente').html(resultado["resultado"][4]);
                document.querySelector('#user-btn').onclick = () => { }
                contenedorPaypalBotones.style.display = localStorage.getItem("montoTotal") !== "0" ? "Block" : "None";
                direccionPedido.style.display = localStorage.getItem("montoTotal") !== "0" ? "Block" : "None";
            } else {
                document.querySelector('#user-btn').onclick = () => {
                    account.classList.add('active');
                    $("#txtCorreoClienteLog").val('');
                    $("#txtPasswordClienteLog").val('');
                }
                btnCuenta.removeAttribute("data-toggle");
                btnCuenta.removeAttribute("data-target");
                contenedorPaypalBotones.style.display = "None";
                direccionPedido.style.display = "None";
            }

        })
        .catch((error) => {

        });
}

window.addEventListener("load", (e) => {
    iniciarSesion();
    cerrarSesion();
    checkSession();
});

function cerrarSesion() {
    if (window.location.pathname === "/index.html") {
        const btnCerrarSesion = document.getElementById('btnCerrarSesion');
        btnCerrarSesion.addEventListener('click', (e) => {
            sessionStorage.removeItem("access_token");
            checkSession();
            $('#cuenta').modal('hide');
            mensajeValidacion("Cerró sesión correctamente", true);
        });
    }
}

function iniciarSesion() {
    if (window.location.pathname === "/index.html") {
        const btnLogin = document.getElementById("btnLogin");
        btnLogin.addEventListener("click", (e) => {
            e.preventDefault();
            var correo = $("#txtCorreoClienteLog").val();
            var password = $("#txtPasswordClienteLog").val();

            $.ajax({
                url: `${dominioFun()}cliente/loginCli/`,
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    CorreoCliente: correo,
                    PasswordCliente: password,
                }),
                success: function (response) {
                    if (response["estado"]) {
                        sessionStorage.setItem("access_token", response["mensaje"]);
                        checkSession();
                        mensajeValidacion("Inició sesión correctamente", true);
                        const ventanaCuenta = document.querySelector('.user-account');
                        ventanaCuenta.classList.remove("active");
                    } else {
                        mensajeValidacion("Correo o contraseña incorrecta", response["estado"]);
                    }
                }
            });
        });
    }
}
