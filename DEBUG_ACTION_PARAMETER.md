# 🔍 DEBUG: Tham số Action không gửi được

## 📋 Vấn đề
Khi nhấn nút Edit, tham số `Action` không được gửi tới backend, hoặc backend không nhận được.

## 🧪 Cách Debug

### 1️⃣ **Kiểm tra Frontend - Browser Console (F12)**

```javascript
// Mở Console tab, paste lệnh này:

// Test 1: Kiểm tra FormData
var formData = new FormData();
formData.append('Action', 'EDIT');
formData.append('tab_name', 'TabDsSanChoi');
formData.append('id', '1');
formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

// Log FormData entries
console.log('📋 FormData entries:');
for (var pair of formData.entries()) {
    console.log('   ' + pair[0] + ': ' + pair[1]);
}

// Test 2: Gửi test request
fetch('/action_dbLite/', {
    method: 'POST',
    body: formData,
    headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    }
}).then(response => response.json()).then(data => {
    console.log('Response:', data);
});
```

### 2️⃣ **Kiểm tra Backend - Django Console**

Khi bạn nhấn nút Edit và xem output của Django server, bạn sẽ thấy:

```
============================================================
🔍 DEBUG action_dbLite - Request received:
Request method: POST
Request POST keys: ['Action', 'tab_name', 'id', 'csrfmiddlewaretoken']
Request POST data: {'Action': 'EDIT', 'tab_name': 'TabDsSanChoi', 'id': '1', ...}
Converted data: {'Action': 'EDIT', 'tab_name': 'TabDsSanChoi', 'id': '1', ...}
============================================================
```

Nếu bạn **KHÔNG** thấy `'Action'` trong keys → Có vấn đề gửi dữ liệu từ frontend

### 3️⃣ **Kiểm tra Network - Browser DevTools**

1. Mở F12 → **Network** tab
2. Bấm nút Edit sân chơi
3. Tìm request `/action_dbLite/` (POST)
4. Click vào request
5. Xem tab **Request**:
   - Tab **Payload** hoặc **Form Data** sẽ hiển thị dữ liệu gửi đi
   - Kiểm tra xem có `Action`, `tab_name`, `id` không

**Ví dụ Request Payload:**
```
Action: EDIT
tab_name: TabDsSanChoi
id: 1
csrfmiddlewaretoken: abcd1234...
```

## ⚡ Các Khả Năng

### Khả Năng 1: FormData không được tạo đúng
```javascript
// ❌ SAIISSUE: FormData entries không được thêm
var formData = new FormData();
// Quên append...
```

**Fix:** Kiểm tra dòng code append trong `EditDsSanChoi()` - đã fix rồi

### Khả Năng 2: CSRF Token bị null
```javascript
// ❌ ERROR: querySelector trả về null
var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
// → TypeError: Cannot read property 'value' of null
```

**Fix:** Thêm null check
```javascript
var csrfElement = document.querySelector('[name=csrfmiddlewaretoken]');
var csrftoken = csrfElement ? csrfElement.value : '';
```

### Khả Năng 3: Backend không parse FormData
```python
# ❌ ISSUE: Request.POST không chứa FormData keys
data_ = request.POST
# → Empty dict hoặc missing keys
```

**Fix:** Backend đã có debug print, kiểm tra output

### Khả Năng 4: $.ajax không gửi FormData đúng
```javascript
// ❌ ISSUE: Quên contentType: false, processData: false
$.ajax({
    type: 'POST',
    url: '/action_dbLite/',
    data: formData,
    // ← MISSING: contentType: false, processData: false
});
```

**Fix:** Code đã có đầy đủ cài đặt

## 📝 Các Bước Debug Chi Tiết

### Step 1: Kiểm tra Frontend
```
1. Mở F12 Console
2. Bấm nút Edit
3. Xem logs: "📋 EditDsSanChoi - FormData entries:"
4. Kiểm tra có 4 entries: Action, tab_name, id, csrfmiddlewaretoken
```

### Step 2: Kiểm tra Network
```
1. F12 → Network tab
2. Bấm nút Edit
3. Tìm POST /action_dbLite/
4. Click → Payload tab
5. Kiểm tra dữ liệu được gửi
```

### Step 3: Kiểm tra Backend
```
1. Mở terminal Django server
2. Bấm nút Edit
3. Xem console output có debug info không
4. Kiểm tra "Request POST data:" có chứa Action không
```

### Step 4: Kiểm tra Response
```
1. Network tab → Response tab
2. Xem response JSON
3. Nếu error → Kiểm tra error message
4. Nếu data → Log dữ liệu trong success callback
```

## 🎯 Kiểm tra Step-by-Step

1. **Reload page** → Mở F12 Console → Bạn sẽ thấy các logs từ việc load trang
2. **Bấm "Quản Lý Sân Chơi"** → Modal mở, data load → Xem console
3. **Bấm nút Edit** → Xem toàn bộ logs:
   - ```📋 EditDsSanChoi - FormData entries:``` (Frontend)
   - Django console output (Backend)
   - Response logs (Frontend success callback)

## 💡 Hints

- Nếu FormData không hiển thị FormData entries → Issue ở EditDsSanChoi()
- Nếu Frontend logs OK nhưng Backend không nhận được → Issue ở $.ajax or CSRF
- Nếu Backend nhận được nhưng response lỗi → Issue ở _sqlite.py logic

## ✅ Báo Cáo Findings

Sau khi debug, hãy báo cáo:
```
1. FormData entries hiển thị đúng không? (Frontend Console)
2. Request được gửi đi không? (Network tab)
3. Backend nhận được dữ liệu không? (Django Console)
4. Response là gì? (Network → Response)
5. Error message (nếu có)?
```

Tôi sẽ giúp fix vấn đề dựa trên kết quả debug! 🚀
