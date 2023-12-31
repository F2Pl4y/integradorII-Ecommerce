function registrarLosClientes() {
    const btnRegistarCliente = document.getElementById('btnRegistarCliente');
    btnRegistarCliente.addEventListener('click', (e) => {
        e.preventDefault();

        if (evaluarClienteNuevo["CorreoCliente"] && evaluarClienteNuevo["DniCliente"] && evaluarClienteNuevo["NomCliente"] && evaluarClienteNuevo["PasswordCliente"] && evaluarClienteNuevo["telefonoCliente"]) {
            clienteIns();
        } else {
            mensajeValidacion('Existen campos que no se han completado correctamente, por favor revisar el formulario', false);
        }
    })
}

window.addEventListener('load', (e) => {
    registrarLosClientes();
});

// Codigo Para Evaluar Restricciones



// RECORDAR QUE ESTO DEBE IR EN UN JS APARTE
function inputCheck(icono, input, boolean) {
    if (boolean) {
        icono.classList.add("positivo");
        icono.classList.remove("negativo");
        icono.innerHTML = `<i class='bx bx-check'></i>`;
        input.classList.add("positivo");
        input.classList.remove("negativo");
    } else {
        icono.classList.add("negativo");
        icono.classList.remove("positivo");
        icono.innerHTML = `<i class='bx bx-x' ></i>`;
        input.classList.add("negativo");
        input.classList.remove("positivo");
    }
}
// FIN DE RECORDAMIENTO

// Fin de codigo de restricciones/Validaciones
// Funcion Para Registrar Nuevos Clientes

function clienteIns() {
    const registrosclientes = new FormData();
    registrosclientes.append("txtCorreoCliente", $('#txtCorreoCliente').val());
    registrosclientes.append("txtDNI", $('#txtDNI').val());
    registrosclientes.append("txtNomCliente", $('#txtNomCliente').val());
    registrosclientes.append("txtPasswordCliente", $('#txtPasswordCliente').val());
    registrosclientes.append("txtTelefonoCliente", $('#txtTelefonoCliente').val());
    $.ajax({
        type: "POST",
        url: dominioFun() + "cliente/ins/",
        data: registrosclientes,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if (data["exito"]) {
                limpiarCampoFormulario();
            }
        }

    });

}
import { dominioFun, evaluarClienteNuevo, mensajeValidacion, limpiarCampoFormulario } from './mainController.js';