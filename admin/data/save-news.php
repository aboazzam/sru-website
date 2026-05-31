<?php
header('Content-Type: application/json; charset=utf-8');

// ملف الأخبار في نفس المجلد: main/admin/data/news.json
$file = __DIR__ . '/news.json';

// قراءة JSON القادم من جافاسكربت
$input = file_get_contents('php://input');
$newItem = json_decode($input, true);

// تحميل الأخبار الحالية
if (file_exists($file)) {
    $currentJson = file_get_contents($file);
    $current = json_decode($currentJson, true);
    if (!is_array($current)) {
        $current = [];
    }
} else {
    $current = [];
}

// إضافة الخبر الجديد
$current[] = $newItem;

// حفظ الملف (كمصفوفة فقط)
file_put_contents(
    $file,
    json_encode($current, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
);

echo json_encode(['status' => 'ok']);
