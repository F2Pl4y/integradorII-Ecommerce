export function dominioFun() {
    // return 'http://127.0.0.1:5000/';
    return 'https://f3rn4nd021py.pythonanywhere.com/';
}
const expresiones = {
    nombreCargo: /^[\w,\s]{5,30}$/,
    dinero: /^\d+(.(\d{1,2})?)?$/,
    correo: /^([a-zA-Z0-9_.+-]{1,}@[\w-]+\.+[a-zA-Z0-9-.]+){1,240}$/,
    dni: /^\d{8}$/,
    nombreCliente: /^[\w,\s]{1,100}$/,
    /*Password con mínimo 8 caracteres de los cuales un caracter al menos debe ser un caracter especial y un número al menos y sin espacios*/
    password: /^(?=.+[\W])(?=.+\d).{8,}$/,
    /*Aclarando que es número peruano y que si se puede acepta o no +51*/
    telefono: /^(\+51|\+51 |51|51 )?\d{9}$/,
    direccion: /^[\wáéíóúÁÉÍÓÚñÑ\s]{1,150}$/
}

const evaluarClienteNuevo = {
    CorreoCliente: false,
    DniCliente: false,
    NomCliente: false,
    PasswordCliente: false,
    telefonoCliente: false
}

window.addEventListener('load', (e) => {
    evaluarCampos();
});

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

export function mensajeValidacion(mensaje, validacion) {
    const config = {
        title: validacion ? 'Exito' : 'Error',
        text: mensaje,
        icon: validacion ? 'success' : 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#c83434'
    }
    Swal.fire(config);
}


export function miniAlerta(icono, mensaje) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: icono,
        title: mensaje
    })
}

function evaluarCampos() {
    if (window.location.pathname === "/index.html") {
        const txtCorreoCliente = document.getElementById('txtCorreoCliente');
        const iconoCorreoCliente = document.querySelector('#txtCorreoCliente+.icono');
        const txtDNI = document.getElementById('txtDNI');
        const iconoDNI = document.querySelector('#txtDNI+.icono');
        const txtNomCliente = document.getElementById('txtNomCliente');
        const iconoNomCliente = document.querySelector('#txtNomCliente+.icono');
        const txtPasswordCliente = document.getElementById('txtPasswordCliente');
        const iconoPassword = document.querySelector('#txtPasswordCliente+.icono');
        const txtTelefonoCliente = document.getElementById('txtTelefonoCliente');
        const iconoTelefonoCliente = document.querySelector('#txtTelefonoCliente+.icono');


        txtCorreoCliente.addEventListener('keyup', (e) => {
            const comprobarCorreo = expresiones["correo"].test(txtCorreoCliente.value);
            evaluarClienteNuevo["CorreoCliente"] = comprobarCorreo;
            inputCheck(iconoCorreoCliente, txtCorreoCliente, comprobarCorreo);
        });

        txtDNI.addEventListener('keyup', (e) => {
            const comprobarDNI = expresiones["dni"].test(txtDNI.value);
            evaluarClienteNuevo["DniCliente"] = comprobarDNI;
            inputCheck(iconoDNI, txtDNI, comprobarDNI);
        });

        txtNomCliente.addEventListener('keyup', (e) => {
            const comprobarNomCliente = expresiones["nombreCliente"].test(txtNomCliente.value);
            evaluarClienteNuevo["NomCliente"] = comprobarNomCliente;
            inputCheck(iconoNomCliente, txtNomCliente, comprobarNomCliente);
        });

        txtPasswordCliente.addEventListener('keyup', (e) => {
            const comprobarPassword = expresiones["password"].test(txtPasswordCliente.value);
            evaluarClienteNuevo["PasswordCliente"] = comprobarPassword;
            inputCheck(iconoPassword, txtPasswordCliente, comprobarPassword);
        });

        txtTelefonoCliente.addEventListener('keyup', (e) => {
            const comprobarTelefonoCliente = expresiones["telefono"].test(txtTelefonoCliente.value);
            evaluarClienteNuevo["telefonoCliente"] = comprobarTelefonoCliente;
            inputCheck(iconoTelefonoCliente, txtTelefonoCliente, comprobarTelefonoCliente);
        });
    }
}

function limpiarCampoFormulario() {
    $('#txtCorreoCliente').val('');
    $('#txtCorreoCliente').removeClass('positivo');
    $('#txtCorreoCliente').removeClass('negativo');
    $('#txtCorreoCliente+.icono').html('');
    $('#txtCorreoCliente+.icono').removeClass('positivo');
    $('#txtCorreoCliente+.icono').removeClass('negativo');

    $('#txtDNI').val('');
    $('#txtDNI').removeClass('positivo');
    $('#txtDNI').removeClass('negativo');
    $('#txtDNI+.icono').html('');
    $('#txtDNI+.icono').removeClass('positivo');
    $('#txtDNI+.icono').removeClass('negativo');

    $('#txtNomCliente').val('');
    $('#txtNomCliente').removeClass('positivo');
    $('#txtNomCliente').removeClass('negativo');
    $('#txtNomCliente+.icono').html('');
    $('#txtNomCliente+.icono').removeClass('positivo');
    $('#txtNomCliente+.icono').removeClass('negativo');

    $('#txtPasswordCliente').val('');
    $('#txtPasswordCliente').removeClass('positivo');
    $('#txtPasswordCliente').removeClass('negativo');
    $('#txtPasswordCliente+.icono').html('');
    $('#txtPasswordCliente+.icono').removeClass('positivo');
    $('#txtPasswordCliente+.icono').removeClass('negativo');

    $('#txtTelefonoCliente').val('');
    $('#txtTelefonoCliente').removeClass('positivo');
    $('#txtTelefonoCliente').removeClass('negativo');
    $('#txtTelefonoCliente+.icono').html('');
    $('#txtTelefonoCliente+.icono').removeClass('positivo');
    $('#txtTelefonoCliente+.icono').removeClass('negativo');
}
