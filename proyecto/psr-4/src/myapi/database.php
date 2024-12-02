<?php
namespace Gonza\Proyecto\myapi;

abstract class DataBase {
    protected $conexion;
    protected $data; 

    public function __construct( $user, $pass, $db) {
        // Establece la conexión a la base de datos
        $this->conexion = @mysqli_connect('localhost', $user, $pass, $db);

        if(!$this->conexion) {
            die('¡Base de datos NO conextada!');
        }
    }


    public function getData() {
        return json_encode($this->data);
    }
}