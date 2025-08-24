<?php

return [
    /*
    |--------------------------------------------------------------------------
    | cPanel Hosting Configuration
    |--------------------------------------------------------------------------
    | 
    | Configuration specific to cPanel shared hosting environment
    |
    */

    'paths' => [
        'public' => env('CPANEL_PUBLIC_PATH', '/public_html'),
        'storage' => env('CPANEL_STORAGE_PATH', '/storage'),
        'logs' => env('CPANEL_LOG_PATH', '/storage/logs'),
    ],

    'database' => [
        'prefix' => env('CPANEL_DB_PREFIX', ''),
        'connection_timeout' => env('CPANEL_DB_TIMEOUT', 30),
        'max_connections' => env('CPANEL_DB_MAX_CONN', 10),
    ],

    'email' => [
        'verify_ssl' => env('CPANEL_MAIL_VERIFY_SSL', false),
        'timeout' => env('CPANEL_MAIL_TIMEOUT', 30),
    ],

    'optimization' => [
        'cache_views' => env('CPANEL_CACHE_VIEWS', true),
        'cache_routes' => env('CPANEL_CACHE_ROUTES', true),
        'cache_config' => env('CPANEL_CACHE_CONFIG', true),
        'optimize_autoloader' => env('CPANEL_OPTIMIZE_AUTOLOADER', true),
    ],

    'security' => [
        'hide_server_info' => env('CPANEL_HIDE_SERVER_INFO', true),
        'force_https' => env('CPANEL_FORCE_HTTPS', true),
        'strict_transport_security' => env('CPANEL_HSTS', true),
    ],
];