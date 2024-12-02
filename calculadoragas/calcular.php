<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root','vianey24', 'combustibles');

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión"]));
}

$estado = $_POST['estado'];
$municipio = $_POST['municipio'];
$tipoGas = $_POST['tipoGas'];
$cantidad = intval($_POST['numCilindros'] ?? $_POST['litrosGas']);

$query = "SELECT precio_por_kilo, precio_por_litro FROM preciogas WHERE estado = ? AND municipio = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $estado, $municipio);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

$precio = ($tipoGas === "estacionario") ? $result['precio_por_litro'] : $result['precio_por_kilo'];
$totalConsumo = 0;

if ($tipoGas === 'cilindros20') {
    $cantidad = intval($_POST['numCilindros']); // Toma cantidad para cilindros de 20
    $totalConsumo = $cantidad * 20;
} elseif ($tipoGas === 'cilindros30') {
    $cantidad = intval($_POST['numCilindros']); // Toma cantidad para cilindros de 30
    $totalConsumo = $cantidad * 30;
} elseif ($tipoGas === 'estacionario') {
    $cantidad = intval($_POST['litrosGas']); // Cantidad para litros de gas estacionario
    $totalConsumo = $cantidad; 
} else {
    $totalConsumo = 0; // Caso de error o sin datos
}

$gastoActual = $totalConsumo * $precio;
$ahorro = $gastoActual * 0.6;

echo json_encode([
    "tipoUnidad" => ($tipoGas === "estacionario" ? "litro" : "kilo"),
    "precio" => $precio,
    "gastoActual" => $gastoActual,
    "ahorro" => $ahorro
]);

$conn->close();
?>
