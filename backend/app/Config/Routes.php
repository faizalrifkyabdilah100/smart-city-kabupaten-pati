<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
// API Routes
// API Routes
$routes->group('api', function($routes) {
    // 1. Login Route
    $routes->match(['POST', 'OPTIONS'], 'login', 'AuthController::login');

    // 2. CRUD User Route
    // Kita pakai 'resource' untuk otomatis bikin rute standar REST API
    $routes->resource('users', ['controller' => 'UserController']);
    
    // TAPI, kita harus manual handle OPTIONS untuk edit & delete user (Preflight check)
    // Format: api/users/(id)
    $routes->options('users/(:any)', function() {
        // Biar Filter CORS yang nangani (matiin request disini)
        die();
    });
    $routes->options('users', function() {
        die();
    });
});


