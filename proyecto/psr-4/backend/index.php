<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;



use Gonza\Proyecto\Create\Create as Create;
use Gonza\Proyecto\Read\Read as Read;

require_once __DIR__ . '/../vendor/autoload.php';

// Crear la aplicación
$app = AppFactory::create();
$app->addRoutingMiddleware();
$app->setBasePath("/Proyecto-ODS/proyecto/psr-4/backend");
$app->addErrorMiddleware(true, true, true);

// Ruta POST para agregar un reporte
$app->post('/procesar-reporte', function (Request $request, Response $response, $args) {
    try {
        $reporte = $request->getBody();
        $formulario = new Create('energia');
        $formulario->add($reporte); // Agregar el producto
        $responseData = $formulario->getData();
        $response->getBody()->write(json_encode($responseData)); // Escribe el cuerpo de la respuesta con los datos en formato JSON

        return $response->withHeader('Content-Type', 'application/json'); 
    } catch (Exception $e) {
        $errorData = [
            "error" => "Error al agregar el reporte: " . $e->getMessage()
        ];
        $response->getBody()->write(json_encode($errorData));
        return $response->withHeader('Content-Type', 'application/json');
    }
});
// Definir la ruta para obtener los datos de los combustibles
$app->get('/contar-combustibles', function ($request, $response, $args) {
    $read = new Read('energia');
    $data = $read->contarCombustibles();
    $response->getBody()->write(json_encode($data));

    // Establecer el tipo de contenido a 'application/json' para la respuesta
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/hola/{nombre}', function ($request, $response, $args) {
    $response->getBody()->write("Hola, " . $args['nombre']);
    return $response;
});


$app->run();