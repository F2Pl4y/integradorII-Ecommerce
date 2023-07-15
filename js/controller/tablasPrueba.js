import { dominio } from './mainController.js';
document.addEventListener('DOMContentLoaded', function () {
    // Realizar la llamada AJAX
    isSessionValid()
        .then((resultado) => {
            $.ajax({
                type: "GET",
                url: `${dominio}valoresFactura/${resultado.resultado[0]}/`,
                dataType: "json",
                success: function (response) {
                    // Verificar la respuesta y pintar las tablas
                    if (typeof response === 'object' && response !== null) {
                        let detallesTabla = response.resultado.detallesTabla;
                        detallesTabla.forEach(function (detalle, index) {
                            let section = document.createElement('section');
                            section.classList.add('section-hijo');

                            let tabla = pintarTabla(detalle, index + 1, response.resultado.detallesTabla[index].CodPedido);
                            section.appendChild(tabla);
                            document.getElementById('contenedor-tablas').appendChild(section);
                        });
                    }
                    // Botón para desplegar todas las tablas
                    let btnDesplegarTodo = document.createElement('button');
                    btnDesplegarTodo.classList.add('btn', 'btn-primary');
                    btnDesplegarTodo.textContent = 'Desplegar todo';
                    btnDesplegarTodo.addEventListener('click', function () {
                        let tablas = document.querySelectorAll('.tabla-expansible');
                        tablas.forEach(function (tabla) {
                            tabla.classList.remove('oculto');
                            tabla.classList.remove('mostrar');
                        });
                    });

                    // Botón para ocultar todas las tablas
                    let btnOcultarTodo = document.createElement('button');
                    btnOcultarTodo.classList.add('btn', 'btn-secondary');
                    btnOcultarTodo.textContent = 'Ocultar todo';
                    btnOcultarTodo.addEventListener('click', function () {
                        let tablas = document.querySelectorAll('.tabla-expansible');
                        tablas.forEach(function (tabla) {
                            tabla.classList.remove('mostrar');
                            tabla.classList.add('oculto');
                        });
                    });

                    // Agregar los botones al contenedor deseado en tu HTML
                    let contenedorBotones = document.createElement('div');
                    contenedorBotones.style.width = '70%';
                    contenedorBotones.style.height = '12vh';
                    contenedorBotones.style.overflowY = 'auto';
                    contenedorBotones.style.margin = '0 auto';
                    contenedorBotones.style.display = 'flex';
                    contenedorBotones.style.justifyContent = 'center';
                    contenedorBotones.style.alignItems = 'center';

                    contenedorBotones.appendChild(btnDesplegarTodo);
                    contenedorBotones.appendChild(btnOcultarTodo);

                    document.body.insertBefore(contenedorBotones, document.getElementById('contenedor-tablas'));
                },
                error: function (xhr, status, error) {
                    console.log(xhr, "\n", status, "\n", error) // Manejo de errores
                }
            });
        }).catch((error) => {
            console.log("Error: ", error);
        });

    // Otras funciones y código adicional

    function pintarTabla(detalle, index, codPedido) {
        let contenido = '';

        let section = document.createElement('section');
        section.classList.add('section-hijo');

        let btnGuardarPDF = document.createElement('button');
        btnGuardarPDF.classList.add('btn', 'btn-success');
        btnGuardarPDF.textContent = 'Descargar';
        btnGuardarPDF.id = `btnGuardarPDF-${index}`; // Asignar un id único al botón
        btnGuardarPDF.addEventListener('click', function () {
            guardarPDF(codPedido, index);
        });
        section.appendChild(btnGuardarPDF);

        let fila = `<tr>`;
        fila += `<td>${detalle.direccion}</td>`;
        fila += `<td>${detalle.fecha}</td>`;
        fila += `<td>${detalle.horarioPedido}</td>`;
        fila += `<td>${detalle.estadoPedido}</td>`;
        fila += `</tr>`;
        contenido += fila;

        let tabla = document.createElement('table');
        tabla.id = `tabla-expansible-${index}`;
        tabla.classList.add('tabla-expansible');
        tabla.classList.add('oculto'); // Ocultar la tabla por defecto

        let thead = document.createElement('thead');
        thead.classList.add('table-dark');
        let tr = document.createElement('tr');
        tr.innerHTML =
            `<th>Dirección</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Estado</th>`;
        thead.appendChild(tr);

        let tbody = document.createElement('tbody');
        tbody.classList.add('table-info');
        tbody.innerHTML = contenido;

        tabla.appendChild(thead);
        tabla.appendChild(tbody);

        // Agregar evento click a los botones dentro de la tabla
        tabla.querySelectorAll('button').forEach(function (button) {
            button.addEventListener('click', function () {
                guardarPDF(codPedido, index);
            });
        });

        let button = document.createElement('button');
        button.classList.add('btn', 'btn-info');
        button.textContent = `Mostrar`;
        button.textContent = `Pedido ${detalle.fecha}: ` + `Mostrar`;

        button.addEventListener('click', function () {
            tabla.classList.toggle('oculto');
            if (tabla.classList.contains('oculto')) {
                button.textContent = `Pedido ${detalle.fecha}: ` + `Mostrar`;
            } else {
                button.textContent = `Pedido ${detalle.fecha}: ` + `Ocultar`;
            }
        });

        let nombreTabla = document.createElement('span');
        nombreTabla.addEventListener('click', function () {
            tabla.classList.toggle('oculto');
            if (tabla.classList.contains('oculto')) {
                button.textContent = `Pedido ${detalle.fecha}: ` + `Mostrar`;
            } else {
                button.textContent = `Pedido ${detalle.fecha}: ` + `Ocultar`;
            }
        });

        section.appendChild(nombreTabla);
        section.appendChild(button);
        section.appendChild(tabla);

        return section;
    }

    function guardarPDF(codPedido, index) {
        if (typeof codPedido === 'undefined' || codPedido === null) {
            console.error("El valor de codPedido no está definido.");
            return;
        }
        const btnGuardarPDF = document.getElementById(`btnGuardarPDF-${index}`);
        btnGuardarPDF.disabled = true;

        // Restablecer el documento doc
        var doc = new jsPDF();

        // Configuración de la tabla
        var cellPadding = 5;
        var lineHeight = 10;

        // Calcular el tamaño total de la tabla y la posición centrada
        var tableHeight;

        // Función para dibujar la tabla
        function drawTable(headers, data, x, y, width, height) {
            doc.setFontSize(14);
            doc.setFontStyle('bold');

            var headerX = x;
            var headerY = y;

            for (var i = 0; i < headers.length; i++) {
                // Dibujar el borde de la cabecera
                doc.rect(headerX, headerY, width, height);

                var textX = headerX + width / 2;
                var textY = headerY + height / 2;
                var textOptions = { align: 'center', baseline: 'middle' };

                doc.text(headers[i], textX, textY, textOptions);
                headerX += width;
            };

            doc.setFontStyle('normal');
            doc.setFontSize(10);
            y += height;

            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                for (var j = 0; j < row.length; j++) {
                    doc.rect(x + j * width, y + i * height, width, height);

                    var textX = x + j * width + width / 2;
                    var textY = y + i * height + height / 2;
                    var textOptions = { align: 'center', baseline: 'middle' };

                    doc.text(row[j].toString(), textX, textY, textOptions);
                };
            };
        };

        isSessionValid().then((resultado) => {
            // Obtener los datos de la API utilizando AJAX
            $.ajax({
                type: "GET",
                // url: `${dominioV}PDF/sel/${resultado.resultado[4]}/`,
                url: `${dominio}PDF/sel/${codPedido}/`,
                dataType: "json",
                contentType: 'application/json',
                success: function (response) {
                    // Obtener los datos del objeto de respuesta
                    var apiData = response.resultado;

                    // Verificar que apiData sea un objeto (diccionario)
                    if (typeof apiData === 'object' && apiData !== null) {
                        // Datos de la tabla obtenidos de la API

                        var headers = ['Producto', 'Precio Unitario', 'Cantidad', 'Subtotal'];
                        // Procesar los datos de la API en el formato necesario para la tabla
                        var data = [];
                        for (var i = 0; i < apiData.detalles.length; i++) {
                            var item = apiData.detalles[i];
                            data.push([item.nombre, item.pUnitario, item.cantidad, item.subTotal]);
                        };

                        // Calcular el tamaño de celda más grande en los datos
                        var maxCellWidth = headers.reduce((maxWidth, header) => {
                            var headerWidth = doc.getStringUnitWidth(header) * lineHeight + cellPadding * 2;
                            return Math.max(maxWidth, headerWidth);
                        }, 0);
                        data.forEach((row) => {
                            row.forEach((cell) => {
                                var cellWidth = doc.getStringUnitWidth(cell) * lineHeight + cellPadding * 2;
                                maxCellWidth = Math.max(maxCellWidth, cellWidth);
                            });
                        });

                        // Calcular el tamaño total de la tabla
                        tableWidth = Math.min(maxCellWidth * headers.length, doc.internal.pageSize.getWidth() * 0.9);
                        tableHeight = (data.length + 1) * lineHeight; // Incrementar en 1 la altura de la tabla

                        // Calcular la posición de la tabla centrada en la página
                        tableX = (doc.internal.pageSize.getWidth() - tableWidth) / 2;
                        tableY = (doc.internal.pageSize.getHeight() - tableHeight) / 2;

                        // Llamar a la función para dibujar la tabla
                        drawTable(headers, data, tableX, tableY, tableWidth / headers.length, lineHeight);

                        // Agregar la tabla "Monto Total"
                        var montoTotalHeaders = ['Monto Total'];
                        var montoTotalData = [[apiData.total[0].toString()]];

                        var maxCellWidthMT = montoTotalHeaders.reduce((maxWidth, header) => {
                            var headerWidth = doc.getStringUnitWidth(header) * lineHeight + cellPadding * 2;
                            return Math.max(maxWidth, headerWidth);
                        }, 0);
                        montoTotalData.forEach((row) => {
                            row.forEach((cell) => {
                                var cellWidth = doc.getStringUnitWidth(cell) * lineHeight + cellPadding * 2;
                                maxCellWidthMT = Math.max(maxCellWidthMT, cellWidth);
                            });
                        });

                        var montoTotalWidth = Math.min(maxCellWidthMT * montoTotalHeaders.length, doc.internal.pageSize.getWidth() * 0.9);
                        var montoTotalX = (doc.internal.pageSize.getWidth() - montoTotalWidth) / 2;
                        var montoTotalY = tableY + tableHeight + lineHeight; // Posición debajo de la tabla anterior

                        drawTable(montoTotalHeaders, montoTotalData, montoTotalX, montoTotalY, montoTotalWidth / montoTotalHeaders.length, lineHeight);

                        // Agregar el título del documento
                        var title = "Paco's Bill";
                        doc.setFontSize(32);
                        doc.setFontStyle('bold');
                        doc.text(title, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

                        // Agregar la fecha, número del ticket y direccion
                        var fecha = response.horaBoleta.toString();
                        var numeroTicket = `${response.numBoleta}`;
                        var direccion = apiData.total[1].toString();
                        var ruc = apiData.total[4].toString();
                        var ubicacionEmpresa = apiData.total[5].toString();
                        var SUNAT = `representacion impresa de la boleta de venta electronica. Esta puede ser consultada en https:www.ejemplFactura.com.pe Autorizado mediante la resolucion de intendencia Nro 0180050000833/SUNAT`;

                        // Configuración de la tabla
                        var tableX = 50; // Posición X de la tabla
                        var headerMargin = 5; // Margen adicional para el ancho de la cabecera

                        // Ajustar las coordenadas de la tabla y las cabeceras
                        var tableY = 50; // Posición Y de la tabla

                        // Obtener el ancho y alto del texto de las cabeceras
                        doc.setFontSize(12);
                        doc.setFontStyle('bold');
                        var fechaDimensions = doc.getTextDimensions('Fecha');
                        var numeroTicketDimensions = doc.getTextDimensions('Número de Ticket');
                        var direccionDimensions = doc.getTextDimensions('Dirección');
                        var ubicacionDimensions = doc.getTextDimensions('Ubicación');
                        var rucDimensions = doc.getTextDimensions('RUC');

                        // Calcular el alto deseado para las celdas
                        var cellHeight = Math.max(fechaDimensions.h, numeroTicketDimensions.h, direccionDimensions.h) + headerMargin;

                        // Calcular el ancho deseado para las celdas basado en el texto más largo de cada columna
                        var fechaWidth = fechaDimensions.w + headerMargin;
                        var numeroTicketWidth = numeroTicketDimensions.w + headerMargin;
                        var direccionWidth = direccionDimensions.w + headerMargin;
                        var ubicacionWidth = ubicacionDimensions.w + headerMargin;
                        var rucWidth = rucDimensions.w + headerMargin;
                        var cellWidth = Math.max(fechaWidth, numeroTicketWidth, direccionWidth, ubicacionWidth, rucWidth) * 1.5;

                        // Ajustar el ancho de la página
                        var pageWidth = doc.internal.pageSize.getWidth();

                        // Calcular la posición X para centrar horizontalmente
                        var tableWidth = cellWidth * 2; // Ancho de la tabla
                        var tableX = (pageWidth - tableWidth) / 2; // Posición X de la tabla centrada

                        // Dibujar los bordes de la tabla y pintar las celdas
                        doc.setDrawColor(0); // Color negro
                        doc.setLineWidth(0); // Grosor del borde


                        // Dibujar la cabecera de la tabla
                        doc.setFontSize(12);
                        doc.setFontStyle('bold');
                        doc.text('Fecha', tableX + headerMargin, tableY + cellHeight * 0.5, { align: 'left', maxWidth: cellWidth - headerMargin });
                        doc.text('Número de Ticket', tableX + headerMargin, tableY + cellHeight * 1.5, { align: 'left', maxWidth: cellWidth - headerMargin });
                        doc.text('Dirección', tableX + headerMargin, tableY + cellHeight * 2.5, { align: 'left', maxWidth: cellWidth - headerMargin });
                        doc.text('RUC', tableX + headerMargin, tableY + cellHeight * 3.5, { align: 'left', maxWidth: cellWidth - headerMargin });
                        doc.text('Ubicación', tableX + headerMargin, tableY + cellHeight * 4.5, { align: 'left', maxWidth: cellWidth - headerMargin });

                        // Dibujar los datos de la tabla
                        doc.setFontStyle('normal');
                        doc.text(fecha, tableX + cellWidth, tableY + cellHeight * 0.5, { align: 'left', maxWidth: cellWidth });
                        doc.text(numeroTicket, tableX + cellWidth, tableY + cellHeight * 1.5, { align: 'left', maxWidth: cellWidth });
                        doc.text(direccion, tableX + cellWidth, tableY + cellHeight * 2.5, { align: 'left', maxWidth: cellWidth });
                        doc.text(ruc, tableX + cellWidth, tableY + cellHeight * 3.5, { align: 'left', maxWidth: cellWidth });
                        doc.text(ubicacionEmpresa, tableX + cellWidth, tableY + cellHeight * 4.5, { align: 'left', maxWidth: cellWidth });
                        doc.setFontSize(10);
                        doc.text(SUNAT, tableX + cellWidth, tableY + cellHeight * 5.5, { align: 'center', maxWidth: cellWidth * 3 });

                        // Función para centrar el texto en una celda de la tabla
                        function centerText(text, x, y, width, height) {
                            var textWidth = doc.getTextWidth(text);
                            var textHeight = doc.getTextDimensions(text).h;
                            var textX = x + (width - textWidth) / 2;
                            var textY = y + (height - textHeight) / 2;
                            doc.text(text, textX, textY);
                        }

                        // Agregar el logo de la empresa
                        var logo = new Image();
                        logo.src = '../images/Cartel1.jpg'; // Reemplaza con la ruta correcta de la imagen
                        // boleta foto
                        var logoX = 10;
                        var logoY = 10;
                        var logoWidth = 30;
                        var logoHeight = 30;

                        // Agregar la imagen al documento PDF
                        doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight);

                        btnGuardarPDF.disabled = false;
                        // Agregar el código QR
                        var qrImage = new Image();
                        qrImage.src = `data:image/png;base64, ${apiData.codigoQR}`; // Ruta base64 del código QR

                        // Ajustar el tamaño del código QR
                        var qrWidth = 50;
                        var qrHeight = 50;

                        // Calcular la posición del código QR en la parte superior derecha del PDF
                        var qrX = doc.internal.pageSize.getWidth() - qrWidth - 10; // Ajustar el valor de 10 según sea necesario
                        var qrY = 10; // Ajustar el valor según sea necesario

                        // Agregar el código QR al documento PDF
                        doc.addImage(qrImage, qrX, qrY, qrWidth, qrHeight);


                        // Guardar el PDF
                        doc.save(`Boleta#${response.numBoleta}.pdf`);
                    }
                    else {
                        console.error("La respuesta de la API no es un diccionario válido.");
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr, "\n", status, "\n", error); // Manejo de errores
                }
            });
        })
            .catch((error) => {
                console.log("Error: ", error);
            });
    };

    function regresar() {
        const regresarLogin = document.getElementById('regresar');
        regresarLogin.classList.add('btn', 'btn-info');
        regresarLogin.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../index.html';
        })
    }
    regresar();
});
