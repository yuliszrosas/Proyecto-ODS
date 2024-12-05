$(document).ready(function () {
    // API url
	const apiUrl = 'https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/6207048676/es/0700/false/BISE/2.0/bc51cc8e-51be-7c4b-2173-50723fcb1168?type=json';
    //Constantes para la solicitud de API
	const IdIndicador = "6207019033"; // ID del indicador
    const idioma = "es";
    const datoReciente = "true";
    const fuente = "BISE";
    const version = "2.0";
    const token = "bc51cc8e-51be-7c4b-2173-50723fcb1168"; 
    const formato = "json";

	// Arrays para los años y los valores
	const years = [];
	let values1 = [];
    let labels1 = []; // Aquí se almacenarán los nombres de los estados
    let values2 = []; // Aquí se almacenarán los valores (porcentaje de cada estado)    


    // Variable globales para almacenar la instancia del gráfico
    let chartInstance; 
    let chartInstance1;
    let chartInstance2;
    let chartInstance3;

    // Constantes para graficar imagen en el canvas
    const canvas = $("#imgReferencia")[0]; 
    const ctx = canvas.getContext("2d");

    // Creamos una nueva imagen
    const img = new Image();
    img.src = "img/calentadores.jpg";
    const cardFlexContainer = $(".card-info"); 
    canvas.width = cardFlexContainer.width();  
    canvas.height = cardFlexContainer.height(); 
    $(img).on("load", function () {    // Dibujamos la imagen en el canvas cuando esté completamente cargada
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Ajustar al tamaño del canvas
    });

    //Constantes para los estados
    const estados = [
        { nombre: "Puebla", codigo: "07000002" },
        { nombre: "Jalisco", codigo: "07000014" },
        { nombre: "Nuevo León", codigo: "07000019" },
        { nombre: "Coahuila", codigo: "07000005" }, 
        { nombre: "Aguascalintes", codigo: "07000001" },
        { nombre: "Baja California", codigo: "07000002" },
        { nombre: "Baja California Sur", codigo: "07000003" },
        { nombre: "Campeche", codigo: "07000004" },
        { nombre: "Chiapas", codigo: "07000007" },
        { nombre: "Chihuahua", codigo: "07000008" },
        { nombre: "Colima", codigo: "07000006" },
        { nombre: "Guanajuato", codigo: "07000011" },
        { nombre: "Ciudad de Mexico", codigo: "07000009" },
        { nombre: "Durango", codigo: "07000010" },
        { nombre: "Guerrero", codigo: "07000012" },
        { nombre: "Hidalgo", codigo: "07000013" },
        { nombre: "Michoacán", codigo: "07000016" },
        { nombre: "Morelos", codigo: "07000017" },
        { nombre: "Edo. Mex", codigo: "07000015" },
        { nombre: "Nayarit", codigo: "07000018" },
        { nombre: "Oaxaca", codigo: "07000020" },
        { nombre: "Querétaro", codigo: "07000022" },
        { nombre: "Quintana Roo", codigo: "07000023" },
        { nombre: "San Luis Potosí", codigo: "07000024" },
        { nombre: "Sinaloa", codigo: "07000025" },
        { nombre: "Sonora", codigo: "07000026" },
        { nombre: "Tabasco", codigo: "07000027" },
        { nombre: "Tamaulipas", codigo: "07000028" },
        { nombre: "Tlaxcala", codigo: "07000029" },
        { nombre: "Yucatán", codigo: "07000031" },
        { nombre: "Veracruz", codigo: "07000030" }
    ];

    // Comportamiento para la pregunta ¿Usa gas LP en su hogar?
    $('#usaLP').change(function () {
        const usaLPValue = $(this).val();
        if (usaLPValue === 'si') {
            $('#mensajeAhorro').hide();
            $('#tipoGas').show(); 
            $('#boton').show();
        } else {
            // Mostrar el mensaje de ahorro para todos los tipos de gas
            $('#mensajeAhorro').show();
            $('#tipoGas').hide(); // Oculta el segundo formulario
            $('#cantidadCilindros').hide();
            $('#litrosEstacionario').hide();
            $('#boton').hide();
        }
    });

    // Evento para mostrar/ocultar elementos según el tipo de gas pregunta ¿Cuántos cilindros o kilos de gas LP utiliza al mes? 
    $('input[name="tipoGas"]').change(function () {
        const selectedGas = $(this).val();
        // Oculta todos los divs relacionados primero
        $('#cantidadCilindros').hide();
        $('#litrosEstacionario').hide();
        $('#mensajeAhorro').hide();
        // Muestra el div correspondiente al tipo de gas seleccionado
        if (selectedGas === 'cilindros20' || selectedGas === 'cilindros30') {
            $('#cantidadCilindros').show();
        } else if (selectedGas === 'estacionario') {
            $('#cantidadCilindros').show(); 
        }
    });

	// Mostrar la tabla de Calentadores solares en las viviendas al hacer clic en el botón
    $("#verViviendas").click(function () {
		$("#Titulo").html("<h2>Adopción de energías renovables en viviendas</h2>");
		$("#descripcion").html(`
			<small>
				En el gráfico y la tabla se presentará el porcentaje de viviendas que cuentan con calentadores solares de agua en cada estado. El eje horizontal (X) representará los estados, mientras que el eje vertical (Y) mostrará el porcentaje de viviendas con esta tecnología. Cada barra o punto en el gráfico reflejará el porcentaje específico para cada estado, permitiendo comparar visualmente la adopción de calentadores solares entre las diferentes regiones del país.
			</small>
		`);
        $("#datosCombustibles").hide();
		$("#datosSolar").show();
		$("#datosGasto").hide();
        $("#tabla").toggle();
    });

	// Mostrar la tabla de Gastos al hacer clic en el botón
	$("#verMas").click(function () {
		$("#Titulo").html("<h2>Gasto promedio trimestral en vivienda y combustibles</h2>");
		$("#descripcion").html(`
			<small>
				El gráfico y la tabla mostrarían la evolución del gasto promedio trimestral que realizan los hogares en conceptos de vivienda y combustibles, expresado en pesos. El eje horizontal (X) representaría los trimestres o años, mientras que el eje vertical (Y) mostraría el gasto promedio en pesos. Cada punto o barra en el gráfico reflejaría el gasto estimado por trimestre en función de los datos recolectados. Esto permitiría visualizar cómo ha cambiado este gasto a lo largo del tiempo, facilitando la comparación de las tendencias en diferentes periodos.
			</small>
		`);
		$("#datosCombustibles").hide();
        $("#datosSolar").hide();
		$("#datosGasto").show();
        
        $("#tabla").toggle();
    });

    // Mostrar la tabla de Gastos al hacer clic en el botón
	$("#verCombustibles").click(function () {
		$("#Titulo").html("<h2>Dependencia de combustibles fósiles en viviendas</h2>");
		$("#descripcion").html(`
			<small>
				Esta gráfica de radar muestra la distribución del consumo de diferentes tipos de combustibles (Gas LP, Leña y Gas Natural) en los 5 estados con mayor uso de estos recursos. Los datos reflejan el número de personas que utilizan cada combustible, obtenidos a partir de una encuesta realizada a los hogares de estos estados. La visualización permite comparar de manera clara las preferencias de consumo energético entre los distintos combustibles.
            </small>
		`);
        $("#datosCombustibles").show();
		$("#datosSolar").hide();
		$("#datosGasto").hide();
        $("#tabla").toggle();
    });

    // Configuración de pestañas
    $('ul.tabs li a:first').addClass('active');
    $('.secciones article').hide();
    $('.secciones article:first').show();
    $('ul.tabs li a').click(function (e) {
        e.preventDefault();
        $('ul.tabs li a').removeClass('active');
        $(this).addClass('active');
        $('.secciones article').hide();

        var activeTab = $(this).attr('href');
        $(activeTab).show();
    });
	
    // Función para construir la URL de la API
    function construirUrl(codigoEstado) {
        return `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/${IdIndicador}/${idioma}/${codigoEstado}/${datoReciente}/${fuente}/${version}/${token}?type=${formato}`;
    }

    // Obtener los datos de cada estado y generar la gráfica
    async function fetchData() {
        const tableBody = $("#dataTable");
        
        for (const estado of estados) {
            try {
                const url = construirUrl(estado.codigo);

                // Realizar una solicitud AJAX usando `fetch`
                const response = await fetch(url);
                const data = await response.json();

                 // Extraer el valor más reciente (última observación)
                const observations = data.Series[0].OBSERVATIONS;
                const latestObservation = observations[observations.length - 1]; // Última observación
                const value = parseFloat(latestObservation.OBS_VALUE);

                    // Agregar estado y valor a las listas
                labels1.push(estado.nombre); // Nombres de los estados
                values2.push(value); // Valores asociados

                // Agregar fila a la tabla
                const row = `<tr>
                                <td>${estado.nombre}</td>
                                <td>${latestObservation.TIME_PERIOD}</td>
                                <td>${value.toFixed(2)}</td>
                            </tr>`;
                tableBody.append(row);
            } catch (error) {
                console.error(`Error al obtener los datos para ${estado.nombre}:`, error);
            }
        }// Crear la gráfica con los datos obtenidos
        const ctx = $("#solarChart")[0].getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels1, // Etiquetas del eje X (nombres de los estados)
                datasets: [
                    {
                        label: "Porcentaje de viviendas con calentadores solares",
                        data: values2, // Valores del eje Y (porcentaje de cada estado)
                        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, // Color de las barras
                        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, // Color del borde
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "Porcentaje de viviendas con calentadores solares de agua por estado",
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        display: false,
                        title: {
                            display: true,
                            text: "Estados",
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Porcentaje",
                        },
                    },
                },
            },
        });
    }

	
    // Cerrar el modal cuando se haga clic en la "X"
    $('.close').click(function () {
        $('#myModal').hide();
    });

    // Cerrar el modal si se hace clic fuera de la ventana
    $(window).click(function (event) {
        if ($(event.target).is('#myModal')) {
            $('#myModal').hide();
        }
    });

		
    // Realizar una solicitud AJAX a la API usando jQuery y graficar la grafica de Gasto promedio trimestral en vivienda y combustibles 
    $.getJSON(apiUrl, function(data) {
        // Datos de la respuesta
        const series = data.Series[0].OBSERVATIONS;
        const values= [];
        // Recorrer las observaciones y extraer los datos
        $.each(series, function(index, item) {
            years.push(item.TIME_PERIOD);
            values.push(parseFloat(item.OBS_VALUE));
        });
        
        values1 = values;
        // Crear la gráfica utilizando Chart.js
        const ctx = $('#GraficaViviendas')[0].getContext('2d');
        new Chart(ctx, {
            type: 'line', // Tipo de gráfica
            data: {
                labels: years, // Etiquetas (años)
                datasets: [{
                    data: values, // Datos de los valores observados
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                    borderWidth: 3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true, // Activa el título
                        text: 'Gasto total promedio por hogar en vivienda y combustibles' // Título de la gráfica
                    },
                    legend: {
                        display: false,
                        position: 'top', // Leyenda en la parte superior
                    }
                },
                scales: {
					x: { // Configuración del eje X
						title: {
							display: true, 
							text: 'Años' 
						}
					},
					y: { // Configuración del eje Y
						title: {
							display: true, 
							text: 'Gasto en Pesos' 
						},
						beginAtZero: true 
					}
				}
            }
        });
		
        // Insertar los datos en la tabla HTML usando jQuery
        $.each(series, function(index, item) {
            const row = $('<tr></tr>');
            const yearCell = $('<td></td>').text(item.TIME_PERIOD);
            const valueCell = $('<td></td>').text(item.OBS_VALUE);
            row.append(yearCell).append(valueCell);
            $('#dataTable3').append(row);
        });
    });

    
	// Función para agregar reporte
    $('#report-form').submit( function (e) {
        e.preventDefault();    
        // Crear el objeto finalJSON con los datos del formulario
        let finalJSON = {};
        finalJSON['energia'] = $('#usaEnergia').val();
        finalJSON['estado'] = $('#estado').val();
        finalJSON['municipio'] = $('#municipio').val();
        finalJSON['lena'] = $('#usalen').val();
        finalJSON['gasnatural'] = $('#usaGas').val();
        finalJSON['lp'] = $('#usaLP').val();
        finalJSON['cantidad'] = $('#gas-amount').val(); 
        finalJSON['fecha'] = $('#fecha').val();
        console.log(finalJSON);
        // Validación de campos vacíos
        if (!validarCamposVacios(finalJSON)) {
            $('#container').html('Por favor, llena todos los campos requeridos.');
            $('#product-result').removeClass('d-none').addClass('d-block');
            return; // Detiene el envío si faltan datos
        }
        // Verificamos el tipo de gas seleccionado y multiplicamos la cantidad por 20 o 30
        let cantidadCilindros = parseInt(finalJSON['cantidad']); // Obtenemos la cantidad de cilindros
        let tipoGas = $("input[name='tipoGas']:checked").val(); // Obtenemos el valor del radio seleccionado

        if (tipoGas === 'cilindros20') {
            finalJSON['cantidadCilindros'] = $('#gas-amount').val();
            finalJSON['cantidad'] = cantidadCilindros * 20; // Multiplicamos por 20
        } else if (tipoGas === 'cilindros30') {
            finalJSON['cantidadCilindros'] = $('#gas-amount').val();
            finalJSON['cantidad'] = cantidadCilindros * 30; // Multiplicamos por 30
        } else if (tipoGas === 'estacionario') {
            finalJSON['cantidadLitros'] = $('#gas-amount').val();
            finalJSON['cantidad'] = $('#gas-amount').val(); 
        }

        let municipio = $('#municipio').val(); // Obtiene el valor del campo de búsqueda

        $.ajax({
            url: 'http://localhost/Proyecto-ODS/proyecto/psr-4/backend/searchMunicipio', 
            method: 'GET',
            data: { municipio: municipio },
            dataType: 'json',
            success: function (response) {
                // Verificar si la respuesta es JSON y parsearla si es necesario
                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }
                console.log(response); // Debugging
                if (response.precio_por_kilo && response.precio_por_litro) {
                    finalJSON['PrecioKilo'] = response.precio_por_kilo;
                    finalJSON['precioLitro'] = response.precio_por_litro;
                    console.log(finalJSON);  // Verifica el contenido de finalJSON
                    enviarReporte(finalJSON);
                } else {
                    $('#container').html('No se encontraron precios para el municipio indicado.');
                    $('#product-result').removeClass('d-none').addClass('d-block');
                }
            },
            error: function (xhr, status, error) {
                $('#container').html('Hubo un error al obtener los precios.');
                $('#product-result').removeClass('d-none').addClass('d-block');
                console.error(error);
            }
        });
    });

    //Funcion para cargar los municipios y agregarlos al formulario dependiendo del  estado seleccionado
    $(document).ready(function () {
        // Ruta al archivo JSON
        const url = "municipios.json";
        $("#estado").change(function () {
            const estadoSeleccionado = $(this).val(); // Obtener el estado seleccionado
            $("#municipio").empty().append('<option value="">Seleccione su municipio</option>'); // Limpiar municipios
            if (estadoSeleccionado) {
                // Obtener municipios desde el archivo JSON
                $.getJSON(url, function (data) {
                    const municipios = data[estadoSeleccionado];
                    if (municipios) {
                        municipios.forEach(function (municipio) {
                            $("#municipio").append(new Option(municipio, municipio));
                        });
                    }
                });
            }
        });
    });

    // Función para enviar el reporte con los datos finalJSON (incluidos los precios)
    function enviarReporte(finalJSON) {
        $.ajax({
            url: 'http://localhost/Proyecto-ODS/proyecto/psr-4/backend/procesar-reporte',
            type: 'POST',
            data: JSON.stringify(finalJSON),
            success: function (response) {
                if (typeof response === 'string') {
                    response = JSON.parse(response); // Convierte la cadena JSON en un objeto
                }
                console.log(response);
                if (response.success) {
                    $('#container').html('Reporte agregado correctamente.');
                    $('#product-result').removeClass('d-none').addClass('d-block');
                    actualizarGrafica();
                    mostrarDatosEnviados(finalJSON);
                } else {
                    $('#container').html('Reporte no agregado.');
                    $('#product-result').removeClass('d-none').addClass('d-block');
                }
                $('#tipoGas').hide(); // Oculta el segundo formulario
                $('#cantidadCilindros').hide();
                $('#report-form')[0].reset();
            },
            error: function (xhr, status, error) {
                $('#response-message').text('Hubo un error al enviar el reporte.');
                console.error(error);
            }
        });
    }

    // Nueva función para mostrar los datos enviados
    function mostrarDatosEnviados(data) {
        $('#label-estado').text($('#estado').val());
        $('#label-usaEnergia').text(data.energia || 'N/A');
        $('#label-municipio').text(data.municipio || 'N/A');
        $('#label-municipioR').text(data.municipio || 'N/A');
        $('#label-kilo').text(data.PrecioKilo || 'N/A');
        $('#label-litro').text(data.precioLitro || 'N/A');
        const combustibles = [];
        if (data.lena && data.lena.toLowerCase() === "si") combustibles.push("Leña");
        if (data.lp && data.lp.toLowerCase() === "si") combustibles.push("LP");
        if (data.gasnatural && data.gasnatural.toLowerCase() === "si") combustibles.push("Gas Natural");

        $('#label-tipoGas').text(combustibles.join(', ') || 'Ninguno');
        $('#label-cantidadCilindros').text(data.cantidadCilindros || 'N/A');
        $('#label-litrosGas').text(data.cantidadLitros || 'N/A');
        $('#label-fecha').text(data.fecha || 'N/A');
        let promedio = 0; // Inicializar variable para el promedio

        if (data.cantidadLitros > 0) {
            promedio = data.cantidadLitros * data.precioLitro; // Calcular promedio usando precio por litro
            $('#label-promedio').text(`$${promedio.toFixed(2)}`); // Mostrar con formato de moneda
        } else if (data.cantidadCilindros > 0) {
            promedio = data.cantidad * data.PrecioKilo; // Calcular promedio usando precio por cilindro
            $('#label-promedio').text(`$${promedio.toFixed(2)}`); // Mostrar con formato de moneda
        } else {
            $('#label-promedio').text('Valores no admitidos'); // Mostrar 'N/A' si no se cumple ninguna condición
        }
        if (!isNaN(promedio)) { // Verificar que el valor sea un número válido
            let ahorro = promedio * 0.6; // Calcular el 60% del promedio
            $('#label-ahorro').text(`$${ahorro.toFixed(2)}`); // Asignar el valor con formato de moneda
        } else {
            $('#label-ahorro').text('N/A'); // Mostrar "N/A" si el promedio no es válido
        }

    }

    //Funcion para validar que los cambios no esten vacios
    function validarCamposVacios(json) {
        for (let key in json) {
            if ((!json[key] || json[key].trim() === '')) {
                return false; // Si algún campo está vacío, retorna falso
            }
        }
        return true; // Si todos los campos están llenos, retorna verdadero
    }

    //Graficar al inicio y cuando se agrega un nuevo reporte
    function actualizarGrafica() {
        
        $.ajax({
            url: 'http://localhost/Proyecto-ODS/proyecto/psr-4/backend/contar-estados', // Ruta del archivo PHP que obtiene los datos
            method: 'GET',
            success: function(data) {
                console.log(data); 
                
                // Datos para la gráfica de radar
                const labels = data.map(item => item.estado); // Obtener los nombres de los estados
                const valuesLP = data.map(item => item.contarLP); // Contar "Sí" para Gas LP
                const valuesLena = data.map(item => item.contarLena); // Contar "Sí" para Leña
                const valuesGasNatural = data.map(item => item.contarGasNatural); // Contar "Sí" para Gas Natural
    
                const ctx = $('#GraficaRadar')[0].getContext('2d'); // Asegúrate de tener un canvas con id="modalChart"
                
                if (chartInstance2) {
                    chartInstance2.destroy();
                }
                chartInstance2 = new Chart(ctx, {
                    type: 'radar', // Tipo de gráfico de radar
                    data: {
                        labels: labels, // Nombres de los estados
                        datasets: [
                            {
                                label: 'Gas LP',
                                data: valuesLP, // Datos de Gas LP
                                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color de fondo
                                borderColor: 'rgba(255, 99, 132, 1)', // Color de borde
                                borderWidth: 1
                            },
                            {
                                label: 'Leña',
                                data: valuesLena, // Datos de Leña
                                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
                                borderColor: 'rgba(54, 162, 235, 1)', // Color de borde
                                borderWidth: 1
                            },
                            {
                                label: 'Gas Natural',
                                data: valuesGasNatural, // Datos de Gas Natural
                                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo
                                borderColor: 'rgba(75, 192, 192, 1)', // Color de borde
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scale: {
                            ticks: {
                                beginAtZero: true, // Asegura que las etiquetas de la escala comiencen desde 0
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Consumo de Energía por Estado' // Título de la gráfica
                            }
                        }
                    }
                });
            }
        });

        $.ajax({
            url: 'http://localhost/Proyecto-ODS/proyecto/psr-4/backend/contar-personas', 
            method: 'GET',
            success: function(data) {
                console.log(data); 
                const values = [parseInt(data.contarEnergiaSi), parseInt(data.contarEnergiaNo)];
                console.log(values); 
                const labels = ['Sí', 'No']; 
                const ctx = $('#GraficaPastel')[0].getContext('2d'); // Asegúrate de tener un canvas con id="energiaChart"
                if (chartInstance3) {
                    chartInstance3.destroy();
                }
                chartInstance3 = new Chart(ctx, {
                    type: 'doughnut', // Tipo de gráfico de pastel
                    data: {
                        labels: labels, // Etiquetas ("Sí" y "No")
                        datasets: [{
                            data: values, // Datos (número de personas que respondieron "Sí" y "No")
                            backgroundColor: [`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`], // Colores del gráfico
                            hoverBackgroundColor: [`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`],
                            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                            borderWidth: 3
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Preferencias sobre el Uso de Energías Renovables' // Título del gráfico
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        const total = values.reduce((acc, value) => acc + value, 0);
                                        console.log(total);
                                        const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                                        return `${tooltipItem.raw} personas (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    
        //Grafica comparacion de combustiles
        $.ajax({
            url: 'http://localhost/Proyecto-ODS/proyecto/psr-4/backend/contar-combustibles', // Ruta del archivo PHP que obtiene los datos
            method: 'GET',
            success: function(data) {
                console.log(data);
                const labels = ['Leña', 'Gas Natural', 'Gas LP']; // Las etiquetas de la gráfica
                const values = [parseInt(data.contarLena), parseInt(data.contarGasNatural),parseInt(data.contarLP)]; // Los valores a graficar
                const ctx = $('#combustibleChart')[0].getContext('2d');
                if (chartInstance1) {
                    chartInstance1.destroy();
                }
                chartInstance1 = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels, // Etiquetas (tipos de combustible)
                        datasets: [{
                            data: values, // Datos (número de personas que usan cada combustible)
                            backgroundColor: [`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`], // Colores para cada barra
                            borderColor: [`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true, // Activa el título
                                text: 'Dependencia de Combustibles Fosiles' // Título de la gráfica
                            },
                            legend: {
                                display: false,
                                position: 'top', // Leyenda en la parte superior
                                labels: {
                                    generateLabels: function(chart) {
                                        return chart.data.labels.map((label, index) => ({
                                            text: label, // Los textos de la leyenda
                                            fillStyle: chart.data.datasets[0].backgroundColor[index], // El color de fondo de cada barra
                                            strokeStyle: chart.data.datasets[0].borderColor[index] // El color del borde de cada barra
                                        }));
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    // Calcular el porcentaje de cada barra
                                    label: function(tooltipItem) {
                                        const total = values.reduce((acc, value) => acc + value, 0);
                                        const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                                        return `${tooltipItem.raw} personas (${percentage}%)`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                title: {
                                    display: true, 
                                    text: 'Num. Personas' // Título del eje Y
                                }
                            }
                        }
                    }
                });
                // Agregar datos a la tabla
                const tableBody = $('#dataTable2'); // Referencia al cuerpo de la tabla
                tableBody.empty(); // Limpiar la tabla antes de agregar los nuevos datos

                // Recorrer los datos y agregar las filas en la tabla
                const dataRows = [
                    { type: 'Leña', count: data.contarLena },
                    { type: 'Gas Natural', count: data.contarGasNatural },
                    { type: 'Gas LP', count: data.contarLP }
                ];

                dataRows.forEach(row => {
                    const tableRow = `<tr>
                        <td>${row.type}</td>
                        <td>${row.count}</td>
                    </tr>`;
                    tableBody.append(tableRow); // Agregar la fila a la tabla
                });
            }
        });
    }

    // Evento de clic al gráfico para abrir el modal y graficar el consumo de combstibles por estado
    $('#GraficaRadar').click(function () {
        $('#myModal').show();
        $.ajax({
            url: 'http://localhost/Proyecto-ODS/proyecto/psr-4/backend/contar-estados', // Ruta del archivo PHP que obtiene los datos
            method: 'GET',
            success: function(data) {
                console.log(data); 
                
                // Datos para la gráfica de radar
                const labels = data.map(item => item.estado); // Obtener los nombres de los estados
                const valuesLP = data.map(item => item.contarLP); // Contar "Sí" para Gas LP
                const valuesLena = data.map(item => item.contarLena); // Contar "Sí" para Leña
                const valuesGasNatural = data.map(item => item.contarGasNatural); // Contar "Sí" para Gas Natural
    
                const ctx = $('#modalChart')[0].getContext('2d'); // Asegúrate de tener un canvas con id="modalChart"
                
                if (chartInstance) {
                    chartInstance.destroy();
                }
                chartInstance = new Chart(ctx, {
                    type: 'radar', // Tipo de gráfico de radar
                    data: {
                        labels: labels, // Nombres de los estados
                        datasets: [
                            {
                                label: 'Gas LP',
                                data: valuesLP, // Datos de Gas LP
                                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color de fondo
                                borderColor: 'rgba(255, 99, 132, 1)', // Color de borde
                                borderWidth: 1
                            },
                            {
                                label: 'Leña',
                                data: valuesLena, // Datos de Leña
                                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
                                borderColor: 'rgba(54, 162, 235, 1)', // Color de borde
                                borderWidth: 1
                            },
                            {
                                label: 'Gas Natural',
                                data: valuesGasNatural, // Datos de Gas Natural
                                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo
                                borderColor: 'rgba(75, 192, 192, 1)', // Color de borde
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scale: {
                            ticks: {
                                beginAtZero: true, // Asegura que las etiquetas de la escala comiencen desde 0
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Consumo de Energía por Estado' // Título de la gráfica
                            }
                        }
                    }
                });
            }
        });
    });
    
    // Evento de clic al gráfico para abrir el modal y graficar La distribucion de Preferencias sobre el Uso de Energías Renovables
	$('#GraficaPastel').click(function () {
        $('#myModal').show();
        $.ajax({
            url: 'http://localhost/Proyecto-ODS/proyecto/psr-4/backend/contar-personas',
            method: 'GET',
            success: function(data) {
                console.log(data); 
                const values = [parseInt(data.contarEnergiaSi), parseInt(data.contarEnergiaNo)];
                const labels = ['Sí', 'No']; // Las etiquetas de la gráfica
                const ctx = $('#modalChart')[0].getContext('2d'); 
                if (chartInstance) {
                    chartInstance.destroy();
                }
                chartInstance = new Chart(ctx, {
                    type: 'doughnut', // Tipo de gráfico de pastel
                    data: {
                        labels: labels, // Etiquetas ("Sí" y "No")
                        datasets: [{
                            data: values, // Datos (número de personas que respondieron "Sí" y "No")
                            backgroundColor: [`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`], // Colores del gráfico
                            hoverBackgroundColor: [`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`],
                            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                            borderWidth: 3
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Preferencias sobre el Uso de Energías Renovables' // Título del gráfico
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        const total = values.reduce((acc, value) => acc + value, 0);
                                        const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                                        return `${tooltipItem.raw} personas (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
	}); 

    
    // Evento de clic al gráfico para abrir el modal y graficar La dependencia e combustibles
	$('#combustibleChart').click(function () {

        $('#myModal').show();
        $.ajax({
            url: 'http://localhost/Proyecto-ODS/proyecto/psr-4/backend/contar-combustibles', 
            method: 'GET',
            success: function(data) {
                console.log(data);
                const labels = ['Leña', 'Gas Natural', 'Gas LP']; // Las etiquetas de la gráfica
                const values = [parseInt(data.contarLena), parseInt(data.contarGasNatural),parseInt(data.contarLP)]; // Los valores a graficar
                const ctx = $('#modalChart')[0].getContext('2d');
                if (chartInstance) {
                    chartInstance.destroy();
                }
                chartInstance =new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels, // Etiquetas (tipos de combustible)
                        datasets: [{
                            data: values, // Datos (número de personas que usan cada combustible)
                            backgroundColor: [`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`], // Colores para cada barra
                            borderColor: [`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true, // Activa el título
                                text: 'Dependencia de Combustibles Fosiles' // Título de la gráfica
                            },
                            legend: {
                                display: false,
                                position: 'top', // Leyenda en la parte superior
                                labels: {
                                    generateLabels: function(chart) {
                                        return chart.data.labels.map((label, index) => ({
                                            text: label, // Los textos de la leyenda
                                            fillStyle: chart.data.datasets[0].backgroundColor[index], // El color de fondo de cada barra
                                            strokeStyle: chart.data.datasets[0].borderColor[index] // El color del borde de cada barra
                                        }));
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    // Calcular el porcentaje de cada barra
                                    label: function(tooltipItem) {
                                        const total = values.reduce((acc, value) => acc + value, 0);
                                        const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                                        return `${tooltipItem.raw} personas (${percentage}%)`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                title: {
                                    display: true, 
                                    text: 'Num. Personas' // Título del eje Y
                                }
                            }
                            
                        }
                    }
                });
            },
            error: function() {
                alert('Error al obtener los datos.');
            }
        });

	}); 

    // Evento de clic al gráfico para abrir el modal y graficar la grafica de Gasto promedio trimestral en vivienda y combustibles 
	$('#GraficaViviendas').click(function () {
        
        $('#myModal').show();
        // Verificar si ya existe un gráfico en el canvas
        const ctx = $('#modalChart')[0].getContext('2d');
        if (chartInstance) {
            chartInstance.destroy();
        }
        chartInstance = new Chart(ctx, {
            type: 'line', // Tipo de gráfica
            data: {
                labels: years, 
                datasets: [{
                    data: values1, // Datos de los valores observados
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                    borderWidth: 3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true, // Activa el título
                        text: 'Gasto total promedio por hogar en vivienda y combustibles' // Título de la gráfica
                    },
                    legend: {
                        display: false,
                        position: 'top', // Leyenda en la parte superior
                    }
                },
                scales: {
					x: { // Configuración del eje X
						title: {
							display: true, 
							text: 'Años' 
						}
					},
					y: { // Configuración del eje Y
						title: {
							display: true, 
							text: 'Gasto en Pesos' 
						},
						beginAtZero: true 
					}
				}
            }
        });

	}); 

    // Evento de clic al gráfico para abrir el modal y graficar la grafica de calentadores solares
    $('#solarChart').click(function () {
        $('#myModal').show();
        // Redibujar la gráfica en el modal
        var ctx = $('#modalChart')[0].getContext("2d"); // Obtener el contexto del canvas
        // Verificar si ya existe un gráfico en el canvas y destruirlo
        if (chartInstance) {
            chartInstance.destroy();
        }
        chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels1, // Etiquetas del eje X (nombres de los estados)
                datasets: [
                    {
                        label: "Porcentaje de viviendas con calentadores solares",
                        data: values2, // Valores del eje Y (porcentaje de cada estado)
                        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, // Color de las barras
                        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`, // Color del borde
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "Porcentaje de viviendas con calentadores solares de agua por estado",
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Estados",
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Porcentaje",
                        },
                    },
                },
            },
        });
    }); 

    fetchData();
    actualizarGrafica();
});
