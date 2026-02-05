<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
// API Routes
$routes->group('api', function($routes) {
    // Route accepts POST and OPTIONS (uppercase) for proper routing
    $routes->match(['POST', 'OPTIONS'], 'login', 'AuthController::login');
});


