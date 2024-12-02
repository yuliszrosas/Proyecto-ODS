$(document).ready(function () {

	const IdIndicador = "6207019033"; // ID del indicador
    const idioma = "es";
    const datoReciente = "true";
    const fuente = "BISE";
    const version = "2.0";
    const token = "bc51cc8e-51be-7c4b-2173-50723fcb1168"; // Reemplaza con tu token válido
    const formato = "json";
	// Arrays para los años y los valores
	const years = [];
	const values = [];
    const datasets = [];
	//const apiUrl = 'https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/6207048676/es/0700/false/BISE/2.0/bc51cc8e-51be-7c4b-2173-50723fcb1168?type=json';

    // Lista de estados con sus códigos geográficos
    const estados = [
        { nombre: "Puebla", codigo: "07000002" },
        { nombre: "Jalisco", codigo: "07000014" }
        //{ nombre: "Nuevo León", codigo: "07000019" },
        //{ nombre: "Chiapas", codigo: "07000007" } // Agrega más estados según sea necesario
    ];

	// Mostrar la tabla de Calentadores solares al hacer clic en el botón
    $("#verViviendas").click(function () {
		$("#Titulo").html("<h2>Adopción de energías renovables en viviendas</h2>");
		$("#descripcion").html(`
			<small>
				En el gráfico y la tabla se presentará el porcentaje de viviendas que cuentan con calentadores solares de agua en cada estado. El eje horizontal (X) representará los estados, mientras que el eje vertical (Y) mostrará el porcentaje de viviendas con esta tecnología. Cada barra o punto en el gráfico reflejará el porcentaje específico para cada estado, permitiendo comparar visualmente la adopción de calentadores solares entre las diferentes regiones del país.
			</small>
		`);
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
		$("#datosSolar").hide();
		$("#datosGasto").show();
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

                // Extraer datos de las observaciones
                const observations = data.Series[0].OBSERVATIONS;
                const years = [];
                const values = [];

                observations.forEach(item => {
                    years.push(item.TIME_PERIOD);
                    values.push(parseFloat(item.OBS_VALUE));

                    // Agregar fila a la tabla
                    const row = `<tr>
                                    <td>${estado.nombre}</td>
                                    <td>${item.TIME_PERIOD}</td>
                                    <td>${parseFloat(item.OBS_VALUE).toFixed(2)}</td>
                                  </tr>`;
                    tableBody.append(row);
                });

                // Crear un dataset para este estado
                datasets.push({
                    label: estado.nombre,
                    data: values,
                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                    borderWidth: 1
                });
            } catch (error) {
                console.error(`Error al obtener los datos para ${estado.nombre}:`, error);
            }
        }

        // Crear la gráfica con los datos obtenidos
        const ctx = $("#solarChart")[0].getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: estados.map(e => e.nombre), // Mostrar nombres de estados como etiquetas
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Porcentaje"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Estados"
                        }
                    }
                }
            }
        });
    }

    // Evento de clic al gráfico para abrir el modal
    $('#solarChart').click(function () {
        $('#myModal').show();
        // Redibujar la gráfica en el modal
        var modalChart = $('#modalChart')[0].getContext("2d"); // Obtener el contexto del canvas

        new Chart(modalChart, {
            type: "bar",
            data: {
                labels: estados.map(e => e.nombre), // Mostrar nombres de estados como etiquetas
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Porcentaje"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Estados"
                        }
                    }
                }
            }
        });
    }); 
	

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

	// Evento de clic al gráfico para abrir el modal
	$('#GraficaViviendas').click(function () {
		// Mostrar el modal
        $('#myModal').show();

        const ctx = $('#modalChart')[0].getContext('2d');
        new Chart(ctx, {
            type: 'line', // Tipo de gráfica
            data: {
                labels: years, 
                datasets: [{
                    label: 'Gasto total promediopor hogar en vivienda y combustibles ',
                    data: values, // Datos de los valores observados
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
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
	

    // Realizar una solicitud AJAX a la API usando jQuery
    $.getJSON(apiUrl, function(data) {
        // Datos de la respuesta
        const series = data.Series[0].OBSERVATIONS;

        // Recorrer las observaciones y extraer los datos
        $.each(series, function(index, item) {
            years.push(item.TIME_PERIOD);
            values.push(parseFloat(item.OBS_VALUE));
        });

        // Crear la gráfica utilizando Chart.js
        const ctx = $('#GraficaViviendas')[0].getContext('2d');
        new Chart(ctx, {
            type: 'line', // Tipo de gráfica
            data: {
                labels: years, // Etiquetas (años)
                datasets: [{
                    label: 'Gasto total promediopor hogar en vivienda y combustibles ',
                    data: values, // Datos de los valores observados
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
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

    // Ejecutar la función
    //fetchData();

	// Función para agregar reporte
    $('#report-form').submit( function (e) {
        e.preventDefault();    
        let finalJSON = {};
        finalJSON['miembros'] = $('#num-miembros').val();
        finalJSON['energia'] = $('#usaEnergia').val();
        finalJSON['municipio'] = $('#municipio').val();
        finalJSON['lena'] = $('#usalen').val();
        finalJSON['natural'] = $('#usaGas').val();
        finalJSON['lp'] = $('#usaLP').val();
        finalJSON['cantidad'] = $('#gas-amount').val();
        finalJSON['costo'] = $('#gas-cost').val();
		finalJSON['fecha'] = $('#fecha').val();
        console.log(finalJSON);


        // Verifica que todos los campos obligatorios estén llenos
        if (!validarJSON(finalJSON)) {
            //$('#container').html('Por favor, llena todos los campos requeridos.');
            //$('#product-result').removeClass('d-none').addClass('d-block');
            return; // Detiene el envío si faltan datos
        }
    });
});