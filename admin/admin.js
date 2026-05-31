async function saveNews(item) {
  const res = await fetch('admin/data/save-news.php', { // بدون ../ لأننا داخل admin/
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });

  const result = await res.json();
  if (result.status === 'ok') {
    alert('تم حفظ الخبر بنجاح');
  } else {
    alert('حدث خطأ أثناء الحفظ');
  }
}
