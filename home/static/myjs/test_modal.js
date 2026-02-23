// Script này sẽ chạy ngay khi page load để kiểm tra
console.group('🔍 KIỂM TRA MODAL INCLUDE');

// Kiểm tra xem Modal_DsSanChoi có tồn tại không
if ($('#Modal_DsSanChoi').length > 0) {
    console.log('✓ Modal_DsSanChoi tồn tại trong DOM');
} else {
    console.error('❌ LỖI: Modal_DsSanChoi KHÔNG tồn tại!');
    console.warn('Kiểm tra: Có include modal.html trong start.html không?');
}

// Kiểm tra select MaSanChoi
if ($('#MaSanChoi').length > 0) {
    console.log('✓ Select #MaSanChoi tồn tại');
} else {
    console.error('❌ LỖI: Select #MaSanChoi KHÔNG tồn tại!');
}

// Kiểm tra CSRF token
var csrftoken = $('[name=csrfmiddlewaretoken]').val();
if (csrftoken) {
    console.log('✓ CSRF Token tồn tại');
} else {
    console.warn('⚠️ CSRF Token KHÔNG tìm thấy!');
}

// Kiểm tra sanChoi.js đã load không
if (typeof LoadDsSanChoi === 'function') {
    console.log('✓ LoadDsSanChoi function tồn tại');
} else {
    console.error('❌ LỖI: LoadDsSanChoi function KHÔNG tồn tại!');
}

console.groupEnd();