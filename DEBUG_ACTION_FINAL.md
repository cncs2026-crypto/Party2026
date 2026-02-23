# 🔍 HƯỚNG DẪN DEBUG: Action Parameter Không Gửi

## 📋 Vấn đề
Khi bấm nút Lưu/Xóa/Sửa trong "Quản Lý Danh Sách Sân Chơi", tham số `Action` không được gửi lên backend trong payload.

## 🔧 Những Gì Đã Fix

### 1. Thêm Debug Logging vào `ActionDsSanChoi()`
```javascript
// Bây giờ log sẽ hiển thị:
console.log('📤 Sending data with Action:', data.Action);
```

### 2. Thêm Debug Logging vào `SendDataToDB()`
```javascript
// Log FormData entries:
console.log('📤 SendDataToDB - FormData entries:');
for (var pair of formData.entries()) {
    console.log('   ' + pair[0] + ': ' + pair[1]);
}
```

### 3. Thêm Debug Logging vào `LoadDsSanChoi()`
```javascript
// Log FormData entries:
console.log('📤 LoadDsSanChoi - FormData entries:');
for (var pair of formData.entries()) {
    console.log('   ' + pair[0] + ': ' + pair[1]);
}
```

## 🧪 Cách Debug

### Step 1: Mở F12 Console
```
Chrome: Ctrl+Shift+J
Firefox: Ctrl+Shift+K
Edge: F12 → Console
```

### Step 2: Reload Page
- Refresh trang: `F5` hoặc `Ctrl+R`
- Xem console output

### Step 3: Bấm "Quản Lý Sân Chơi"
- Modal sẽ mở
- Console sẽ hiển thị logs

### Step 4: Bấm nút SAVE/DELETE/EDIT
- Console sẽ hiển thị logs chi tiết
- Xem FormData entries có chứa `Action` không

## 📊 Expected Console Output

### Khi bấm nút SAVE:
```
🎯 ActionDsSanChoi(action=1)
📋 Form data: {MaSanChoi: "SC001", TenSanChoi: "Sân Chơi 1", id: ""}
💾 Lưu sân chơi mới: {...}
📤 Sending data with Action: SAVE
📤 SendDataToDB - FormData entries:
   Action: SAVE
   tab_name: TabDsSanChoi
   MaSanChoi: SC001
   TenSanChoi: Sân Chơi 1
   id: 
   csrfmiddlewaretoken: abc123...
📤 Gửi request tới: /action_dbLite/
📋 Original data: {Action: "SAVE", tab_name: "TabDsSanChoi", ...}
```

### Khi bấm nút DELETE:
```
🎯 ActionDsSanChoi(action=2)
📋 Form data: {MaSanChoi: "SC001", TenSanChoi: "Sân Chơi 1", id: "5"}
🗑️ Xóa sân chơi: 5
📤 Sending data with Action: DELETE
📤 SendDataToDB - FormData entries:
   Action: DELETE
   tab_name: TabDsSanChoi
   id: 5
   csrfmiddlewaretoken: abc123...
📤 Gửi request tới: /action_dbLite/
```

### Khi bấm nút EDIT:
```
🎯 ActionDsSanChoi(action=4)
📋 Form data: {MaSanChoi: "SC001", TenSanChoi: "Sân Chơi 1", id: "5"}
✏️ Chỉnh sửa sân chơi: 5
📤 Sending data with Action: EDIT
📤 SendDataToDB - FormData entries:
   Action: EDIT
   tab_name: TabDsSanChoi
   MaSanChoi: SC001
   TenSanChoi: Sân Chơi 1
   id: 5
   csrfmiddlewaretoken: abc123...
📤 Gửi request tới: /action_dbLite/
```

### Khi bấm nút LOAD:
```
🎯 ActionDsSanChoi(action=3)
🔄 Tải danh sách sân chơi
📤 Sending data with Action: ALL
📤 LoadDsSanChoi - FormData entries:
   Action: ALL
   tab_name: TabDsSanChoi
   csrfmiddlewaretoken: abc123...
📤 Gửi POST request tới /action_dbLite/
```

## 🔍 Backend Debug Output

Mở terminal Django server, bạn sẽ thấy:
```
============================================================
🔍 DEBUG action_dbLite - Request received:
Request method: POST
Request POST keys: ['Action', 'tab_name', 'id', 'csrfmiddlewaretoken', ...]
Request POST data: {'Action': 'DELETE', 'tab_name': 'TabDsSanChoi', 'id': '5', ...}
Converted data: {'Action': 'DELETE', 'tab_name': 'TabDsSanChoi', 'id': '5', ...}
============================================================
```

**Quan trọng:** Kiểm tra xem `'Action'` có trong `Request POST keys` không!

## 📱 Browser Network Tab

1. Mở F12 → **Network** tab
2. Bấm nút SAVE/DELETE/EDIT
3. Tìm request `/action_dbLite/` (POST)
4. Click vào request → **Payload** hoặc **Form Data** tab
5. Kiểm tra:
   - `Action`: SAVE/DELETE/EDIT/ALL
   - `tab_name`: TabDsSanChoi
   - `MaSanChoi`, `TenSanChoi`, `id` (nếu có)
   - `csrfmiddlewaretoken`

**Ví dụ Payload:**
```
Action: DELETE
tab_name: TabDsSanChoi
id: 5
csrfmiddlewaretoken: abc123xyz789
```

## ✅ Kiểm Tra Danh Sách

Khi thực hiện debug, báo cáo những điều sau:

- [ ] Frontend Console hiển thị `📤 SendDataToDB - FormData entries:` không?
- [ ] FormData entries có chứa `Action: SAVE/DELETE/EDIT/ALL` không?
- [ ] Network tab hiển thị Payload có `Action` không?
- [ ] Backend Console hiển thị debug info không?
- [ ] Backend Request POST keys có chứa `'Action'` không?
- [ ] Response là success hay error?

## 🎯 Kết Quả Mong Đợi

Sau khi fix:

### Nút SAVE sẽ:
✅ Lưu sân chơi mới vào database
✅ Hiển thị "Lưu thành công!"
✅ Reload danh sách tự động

### Nút DELETE sẽ:
✅ Xóa sân chơi khỏi database
✅ Hiển thị "Lưu thành công!"
✅ Reload danh sách tự động

### Nút EDIT sẽ:
✅ Load dữ liệu sân chơi vào form
✅ Cho phép chỉnh sửa
✅ Bấm SAVE để cập nhật

### Nút LOAD sẽ:
✅ Tải danh sách tất cả sân chơi
✅ Hiển thị trong dropdown
✅ Hiển thị trong bảng danh sách

## 💡 Tips

1. **Xóa cache browser** nếu code mới không load:
   - Ctrl+Shift+Delete → Clear browsing data

2. **Disable cache** trong DevTools khi debug:
   - F12 → Settings → Network → Disable cache (while DevTools is open)

3. **Tìm lỗi nhanh hơn:**
   - Filter console: Dùng filter icon, search "FormData" hoặc "Action"
   - Xem Error messages: Màu đỏ trong console

## 📞 Báo Cáo Issues

Nếu vẫn có vấn đề, báo cáo:
```
1. Console output (copy-paste tất cả logs liên quan)
2. Network Payload (screenshot hoặc paste)
3. Backend debug output (screenshot hoặc paste)
4. Lỗi gì hiển thị? (error message)
5. Bạn bấm nút nào? (SAVE/DELETE/EDIT/LOAD)
```

---

## 🚀 Test Ngay

1. Reload page
2. Mở F12 Console
3. Bấm "Quản Lý Sân Chơi"
4. Bấm nút SAVE/DELETE/EDIT
5. Xem console output
6. Báo cáo kết quả!

**Tôi sẽ giúp fix tiếp nếu vẫn còn issue!** 🛠️
