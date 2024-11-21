<?php

$filename = 'domain.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle adding a new domain
    $data = file_get_contents('php://input');
    $decodedData = json_decode($data, true);
    $newDomain = $decodedData['domain'];

    if (file_exists($filename)) {
        $domains = json_decode(file_get_contents($filename), true);
    } else {
        $domains = [];
    }

    if (!in_array($newDomain, $domains)) {
        $domains[] = $newDomain;
        file_put_contents($filename, json_encode($domains));
    }

    echo json_encode($domains);
} else {
    // Handle retrieving all domains
    if (file_exists($filename)) {
        $domains = json_decode(file_get_contents($filename), true);
        echo json_encode($domains);
    } else {
        echo json_encode([]);
    }
}
