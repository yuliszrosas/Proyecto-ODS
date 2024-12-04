<?php
namespace Gonza\Proyecto\Create;
use Gonza\Proyecto\myapi\DataBase as DataBase;

class Create extends DataBase {
    public function __construct(string $db) {
        parent::__construct('root', '1001', $db);
    }


    public function add($report) {
        // Decodificar el JSON recibido en un array asociativo
        $data1 = json_decode($report, true);

        if (!$data1) {
            $this->data = [
                'success' => false,
                'message' => "Los datos proporcionados no son un JSON válido."
            ];
            return;
        }

        // Preparar la consulta SQL
        $query = "INSERT INTO reporte (
            energia, municipio, lena, gasnatural, lp, cantidad, precioLitro, fecha, PrecioKilo, cantidadCilindros, cantidadLitros
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // Preparar la sentencia
        $stmt = $this->conexion->prepare($query);

        if (!$stmt) {
            $this->data = [
                'success' => false,
                'message' => "Error al preparar la consulta: " . $this->conexion->error
            ];
            return;
        }

        // Vincular parámetros
        $stmt->bind_param(
            'sssssidsdid', // Tipos: int, string, double, string
            $data1['energia'],
            $data1['municipio'],
            $data1['lena'],
            $data1['gasnatural'],
            $data1['lp'],
            $data1['cantidad'],
            $data1['precioLitro'],
            $data1['fecha'],
            $data1['PrecioKilo'],//aqi
            $data1['cantidadCilindros'],
            $data1['cantidadLitros']
        );

        // Ejecutar la consulta
        if (!$stmt->execute()) {
            $this->data = [
                'success' => false,
                'message' => "Error al ejecutar la consulta: " . $stmt->error
            ];
            return;
        }

        // Cerrar la declaración
        $stmt->close();

        // Establecer los datos para su retorno
        $this->data = [
            'success' => true,
            'message' => 'report agregado correctamente.'
        ];
    }
}
?>
