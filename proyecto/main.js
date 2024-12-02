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
		$("#datosSolar").show();
		$("#datosGasto").hide();
        $("#tabla").toggle();
    });
	// Mostrar la tabla de Gastos al hacer clic en el botón
	$("#verMas").click(function () {
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
	
});
