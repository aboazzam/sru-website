<?php
// مسار ملف JSON
$file = __DIR__ . '/news.json';

// قراءة البودي القادم من JavaScript
$input = file_get_contents('php://input');
$data  = json_decode($input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'invalid json']);
    exit;
}

// إذا كان الملف موجودًا نقرأه، وإلا نبدأ بمصفوفة جديدة
if (file_exists($file)) {
    $current = json_decode(file_get_contents($file), true);
    if (!is_array($current)) {
        $current = ['news' => []];
    }
} else {
    $current = ['news' => []];
}

// نتوقّع أن يأتينا حقل "news" كمصفوفة كاملة
if (isset($data['news']) && is_array($data['news'])) {
    $current['news'] = $data['news'];
} else {
    // أو نضيف خبرًا واحدًا
    $current['news'][] = $data;
}

// كتابة الملف
file_put_contents($file, json_encode($current, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));

echo json_encode(['status' => 'ok']);
