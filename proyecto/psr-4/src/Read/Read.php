<?php
namespace Gonza\Proyecto\Read;
use Gonza\Proyecto\myapi\DataBase as DataBase;

class Read extends DataBase {
    public function __construct(string $db) {
        parent::__construct('root', '1001', $db);
    }

    public function contarCombustibles() {
        // Consulta SQL para contar los "sí" en cada columna
        $query = "
            SELECT 
                SUM(CASE WHEN lena = 'si' THEN 1 ELSE 0 END) AS contarLena,
                SUM(CASE WHEN gasnatural = 'si' THEN 1 ELSE 0 END) AS contarGasNatural,
                SUM(CASE WHEN lp = 'si' THEN 1 ELSE 0 END) AS contarLP
            FROM reporte
        ";
        
        $result = $this->conexion->query($query);
        
        $data = $result->fetch_assoc();
        
        return $data;
    }
    
    public function buscarMunicipio($municipio) {
        // Consulta SQL para obtener los precios del municipio
        $query = "
        SELECT precio_por_kilo, precio_por_litro
        FROM preciogas
        WHERE municipio = ?
        LIMIT 1
        ";
    
        // Preparar la consulta para evitar inyecciones SQL
        $stmt = $this->conexion->prepare($query);
        $stmt->bind_param('s', $municipio); // Vincular el parámetro
    
        $stmt->execute(); // Ejecutar la consulta
    
        $result = $stmt->get_result(); // Obtener el resultado
    
        if ($result->num_rows > 0) {
            return $result->fetch_assoc(); // Retornar los precios como un array asociativo
        } else {
            return null; // Retornar null si no se encuentra el municipio
        }
    }

}
?>