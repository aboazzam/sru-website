<?php
header('Content-Type: application/json; charset=utf-8');

// news.json بجانب هذا الملف
$file = __DIR__ . '/news.json';

// قراءة JSON القادم
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// نتوقع أن يكون بالشكل: { news: [...] }
if (!isset($data['news']) || !is_array($data['news'])) {
    echo json_encode(['status' => 'error', 'message' => 'invalid format']);
    exit;
}

$current = $data['news']; // المصفوفة نفسها

file_put_contents(
    $file,
    json_encode($current, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
);

echo json_encode(['status' => 'ok']);
