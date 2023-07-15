import { dominio } from './mainController.js';
/*
    Se encarga de verificar si la sesión de un cliente es válida 
    consultando en el servidor.
*/
function isSessionValid() {
    const token = sessionStorage.getItem("access_token");
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `${dominio}/secureCli`,
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
function checkSession() {
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

/*
    Se encarga de cerrar la sesión de un cliente cuando se hace clic 
    en el botón correspondiente en la interfaz de usuario.
*/
function cerrarSesion() {
    if (window.location.pathname === "/index.html") {

        const btnCerrarSesion = document.getElementById('btnCerrarSesion');
        btnCerrarSesion.addEventListener('click', (e) => {
            sessionStorage.removeItem("access_token");
            checkSession();
            $('#cuenta').modal('hide');
        });
    }
}

/*
    Se encarga de iniciar la sesión de un cliente cuando se hace clic 
    en el botón correspondiente en la interfaz de usuario.
*/
function iniciarSesion() {
    if (window.location.pathname === "/index.html") {
        evaluarCampos();
        const btnLogin = document.getElementById("btnLogin");
        btnLogin.addEventListener("click", (e) => {
            e.preventDefault();
            var correo = $("#txtCorreoClienteLog").val();
            var password = $("#txtPasswordClienteLog").val();

            $.ajax({
                url: `${dominio}/cliente/loginCli/`,
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