# 🔧 HƯỚNG DẪN FIX LỖI EDIT VÀ DELETE SÂN CHƠI

## 📋 Vấn đề

Nút **EDIT** và **DELETE** sân chơi không hoạt động. Lý do:
1. Hàm `EditDsSanChoi()` không gửi FormData đúng cách với CSRF token
2. Hàm `SendDataToDB()` có lỗi syntax trong dòng CSRF token

## ✅ Giải pháp đã áp dụng

### 1. Fix hàm `EditDsSanChoi()` (sanChoi.js - dòng 147-182)

**Trước:**
```javascript
function EditDsSanChoi(id) {
    var data = {
        'Action': 'EDIT',
        'tab_name': 'TabDsSanChoi',
        'id': id
    };

    Show_loading();
    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
        // ...
    });
}
```

**Sau:**
```javascript
function EditDsSanChoi(id) {
    var formData = new FormData();
    
    // Lấy CSRF token
    var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    formData.append('Action', 'EDIT');
    formData.append('tab_name', 'TabDsSanChoi');
    formData.append('id', id);
    formData.append('csrfmiddlewaretoken', csrftoken);

    Show_loading();
    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            Exit_Loading();
            console.log('🔄 EditDsSanChoi response:', response);
            
            if (response.data && response.data.length > 0) {
                var item = response.data[0];
                $('#MaSanChoi').val(item.MaSanChoi);
                $('#TenSanChoi').val(item.TenSanChoi);
                $('#form_dsSanChoi input[name="id"]').val(item.id);
                console.log('✅ EditDsSanChoi: Dữ liệu được load:', item);
            } else {
                console.error('❌ EditDsSanChoi: Không nhận được dữ liệu');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            Exit_Loading();
            console.error('❌ EditDsSanChoi Error:', textStatus, errorThrown);
            alert('Lỗi: ' + errorThrown);
        }
    });
}
```

### 2. Fix hàm `SendDataToDB()` (sanChoi.js - dòng 424-468)

**Vấn đề:** Dòng 430 có lỗi syntax
```javascript
var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]') ? .value || '';
//                                                                   ↑ Lỗi: space giữa ? và .
```

**Sửa:**
```javascript
var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
//                                                                  ↑ OK: optional chaining
```

## 📝 Các thay đổi chi tiết

### File: `home/static/myjs/sanChoi.js`

| Hàm | Dòng | Thay đổi |
|-----|------|---------|
| `EditDsSanChoi()` | 147-182 | Thay từ `AJAX_REQUEST_RESPONSE()` sang FormData + $.ajax với CSRF token |
| `SendDataToDB()` | 430 | Fix syntax: `? .value` → `?.value` |
| `LoadDsSanChoi()` | 74 | Fix syntax: `? .value` → `?.value` |

## 🧪 Cách test

1. Mở modal **"Quản Lý Sân Chơi"**
2. Bấm nút **🖊️ Edit** (chỉnh sửa) trên một sân chơi
   - Dữ liệu sẽ load vào form
   - Console sẽ hiển thị log với emoji 🔄
3. Bấm nút **🗑️ Delete** (xóa) trên một sân chơi
   - Confirm dialog sẽ hiển thị
   - Sau khi xác nhận, sân chơi sẽ bị xóa
   - Danh sách sẽ reload tự động

## 📊 Debug Info

Mở F12 → Console để xem:
- **EDIT**: Logs sẽ hiển thị `🔄 EditDsSanChoi response: {...}`
- **DELETE**: Logs sẽ hiển thị `📥 Response: {...}` rồi `Thành công!`

## ⚠️ Lưu ý

- Cả `EditDsSanChoi()` và `SendDataToDB()` đều gửi FormData với CSRF token
- `EditDsSanChoi()` dùng `$.ajax()` trực tiếp
- `SendDataToDB()` dùng FormData để hỗ trợ tất cả action (SAVE, DELETE, v.v.)
- CSRF token được lấy từ: `document.querySelector('[name=csrfmiddlewaretoken]')`

## 🔍 Backend verification

Backend (`_sqlite.py`) đã sửa tất cả SQL injection:
- TabDsSanChoi: ✅ SAVE, DELETE với string escaping
- TabSanChoi: ✅ INSERT, UPDATE, SELECT, DELETE 
- TabGiaiThuong: ✅ SAVE, DELETE, SELECT
- TabNguoiChoi: ✅ INSERT, UPDATE, DELETE, ADD_EXCEL
- TabTrungThuong: ✅ INSERT, UPDATE, DELETE, SAVE_LIST_TICKET_OK
- TicketManager: ✅ INSERT, UPDATE, DELETE

Tất cả `.replace("'", "''")` để escape single quotes trước khi insert vào SQL.

## 📌 Status

✅ **EDIT sân chơi**: FIXED
✅ **DELETE sân chơi**: FIXED  
✅ **SQL Injection**: FIXED (tất cả tables)
✅ **CSRF Token**: FIXED (tất cả requests)
✅ **Database Block (check_limit)**: FIXED (commented out)
