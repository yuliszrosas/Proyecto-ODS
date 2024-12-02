document.addEventListener("DOMContentLoaded", () => {
    const estadoSelect = document.getElementById("estado");
    const municipioSelect = document.getElementById("municipio");

    //cargar municipios cuando se selecciona un estado
    estadoSelect.addEventListener("change", () => {
        const estadoSeleccionado = estadoSelect.value;

        // limpiar 
        municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';

        if (estadoSeleccionado) {
            // Cargar el archivo JSON
            fetch("municipios.json")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al cargar el archivo JSON");
                    }
                    return response.json();
                })
                .then(data => {
                    // obtener municipios del estado seleccionado
                    const municipios = data[estadoSeleccionado] || [];

                    // llenar el menu de los municipios
                    municipios.forEach(municipio => {
                        const option = document.createElement("option");
                        option.value = municipio;
                        option.textContent = municipio;
                        municipioSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Error al cargar municipios:", error);
                });
        }
    });
});
