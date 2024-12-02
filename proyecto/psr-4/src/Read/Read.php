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

}
?>