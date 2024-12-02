document.addEventListener("DOMContentLoaded", () => {
    const usaGas = document.getElementById("usaGas");
    const tipoGasDiv = document.getElementById("tipoGas");
    const cantidadCilindrosDiv = document.getElementById("cantidadCilindros");
    const litrosEstacionarioDiv = document.getElementById("litrosEstacionario");
    const mensajeAhorro = document.getElementById("mensajeAhorro");
    const calcularAhorroBtn = document.getElementById("calcularAhorro");
    const form = document.getElementById("calculadoraForm");
    const resultado = document.getElementById("resultado");

    usaGas.addEventListener("change", () => {
        const usaGasValue = usaGas.value;
        tipoGasDiv.style.display = usaGasValue === "Si" ? "block" : "none";
        calcularAhorroBtn.style.display = usaGasValue === "Si" ? "block" : "none";
        cantidadCilindrosDiv.style.display = "none";
        litrosEstacionarioDiv.style.display = "none";
        mensajeAhorro.style.display = usaGasValue === "No" ? "block" : "none";
    });

    document.getElementsByName("tipoGas").forEach(radio => {
        radio.addEventListener("change", () => {
            cantidadCilindrosDiv.style.display = (radio.value === "cilindros20" || radio.value === "cilindros30") ? "block" : "none";
            litrosEstacionarioDiv.style.display = radio.value === "estacionario" ? "block" : "none";
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const formData = new FormData(form);
        fetch("calcular.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.text()) 
        .then(data => {
            console.log(data); 
            try {
                const jsonData = JSON.parse(data); 
                resultado.innerHTML = `
                    <p>Precio por ${jsonData.tipoUnidad}: $${jsonData.precio.toFixed(2)} MXN</p>
                    <p>Gasto promedio mensual: $${jsonData.gastoActual.toFixed(2)} MXN</p>
                    <p>Ahorro estimado: $${jsonData.ahorro.toFixed(2)} MXN</p>
                `;
            } catch (error) {
                console.error("Error al parsear JSON:", error);
                resultado.innerHTML = "<p>Error inesperado. Consulte la consola.</p>";
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
        });
    });
    
});
