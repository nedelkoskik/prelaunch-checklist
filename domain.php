<?php

$filename = 'domains.json';

// Handle POST request to save domain
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $domain = $data['domain'];

    if ($domain) {
        $domains = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];
        if (!in_array($domain, $domains)) {
            $domains[] = $domain;
            file_put_contents($filename, json_encode($domains));
        }
    }
    exit;
}

// Handle GET request to retrieve domains
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($filename)) {
        echo file_get_contents($filename);
    } else {
        echo json_encode([]);
    }
    exit;
}
