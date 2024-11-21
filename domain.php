<?php

// Set the file to store domains
$filePath = 'domains.txt';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $domain = trim($_POST['domain']);

    // Validate and save the domain
    if (!empty($domain)) {
        $domains = file_exists($filePath) ? file($filePath, FILE_IGNORE_NEW_LINES) : [];
        if (!in_array($domain, $domains)) {
            file_put_contents($filePath, $domain . PHP_EOL, FILE_APPEND);
        }
    }
    header("Location: index.html"); // Redirect back to the form
    exit;
}

// Output the saved domains as JSON for JavaScript to use
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json');
    if (file_exists($filePath)) {
        echo json_encode(file($filePath, FILE_IGNORE_NEW_LINES));
    } else {
        echo json_encode([]);
    }
}
