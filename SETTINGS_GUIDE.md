# 📋 Hướng Dẫn Modal Cài Đặt Chung

## ✨ Tính Năng

Modal "Cài Đặt Chung" cho phép người dùng tùy chỉnh:

### 1. **Hiệu Ứng Đặc Biệt** ✨
   - ❄️ **Tuyết Rơi**: Hiệu ứng tuyết rơi xuống (Mặc định: BẬT)
   - 🎆 **Pháo Hoa**: Hiệu ứng pháo hoa tương tác
   - 🎈 **Bong Bóng**: Hiệu ứng bong bóng bay lên
   - 🌈 **Cầu Vồng**: Hiệu ứng nền cầu vồng động
   - ⭐ **Mưa Sao**: Hiệu ứng sao rơi xuống
   - ✨ **Hạt Tử**: Hiệu ứng hạt tử bay lơ lửng

### 2. **Hình Nền** 🖼️
   
#### **Tab 1: Video**
   - Chọn từ danh sách video có sẵn
   - Hiển thị thumbnail preview
   - Video sẽ hiển thị ở background chính
   - Ví dụ:
     - 📹 Nền Tết 1
     - 📹 Nền Tết 2

#### **Tab 2: Hình Ảnh**
   - Chọn từ danh sách hình ảnh có sẵn
   - Hiển thị ảnh nền có sẵn
   - Ví dụ:
     - 🖼️ Hình Nền 1 (bg_tet_0.jpg)
     - 🖼️ Hình Nền 2 (bg_tet_1.jpg)

#### **Tab 3: Tải Lên**
   - Upload hình ảnh mới (JPG, PNG, GIF, WebP)
   - Tối đa 5MB/file
   - Hỗ trợ tải nhiều file cùng lúc
   - Hiển thị tiến độ upload
   - Hình ảnh được lưu và có thể chọn sau

## 📁 Cấu Trúc File

### Files Chính:
```
home/
├── templates/
│   └── modal.html          # Modal cài đặt (lines 880-1069)
├── static/
│   ├── css/
│   │   └── style.css       # CSS styling cho modal & effects
│   └── spin/
│       └── settings.js     # JavaScript quản lý settings
└── templates/
    └── spin.html           # Load settings.js script
```

### Data Storage:
- **LocalStorage**: `lottery_settings` (JSON format)
- Cấu trúc:
  ```json
  {
    "effects": {
      "snow": true,
      "fireworks": false,
      "bubbles": false,
      "rainbow": false,
      "stars": false,
      "particles": false
    },
    "background": {
      "type": "video",
      "id": "vd-bgtet-1",
      "path": "/static/video/vd-bgtet-1.mp4"
    }
  }
  ```

## 🎯 Cách Sử Dụng

### Mở Modal:
1. Nhấn vào icon ⚙️ (Cài đặt chung) trong menu sidebar
2. Hoặc click vào "Cài đặt chung" từ menu chính

### Chọn Hiệu Ứng:
1. Tích/Bỏ tích checkbox cho từng hiệu ứng
2. Checkbox được lưu ngay khi tích/bỏ tích
3. Hiệu ứng được áp dụng realtime

### Chọn Hình Nền:
1. **Video**:
   - Click vào video thumbnail để chọn
   - Video sẽ được áp dụng ngay
   - Có checkmark ✓ khi được chọn

2. **Hình Ảnh**:
   - Click vào ảnh thumbnail để chọn
   - Ảnh sẽ được áp dụng ngay
   - Có checkmark ✓ khi được chọn

3. **Tải Lên**:
   - Chọn file từ máy tính
   - Nhấn "Tải Lên"
   - Chờ hiển thị tiến độ
   - Ảnh mới sẽ xuất hiện trong tab "Hình Ảnh"

### Lưu Cài Đặt:
- Nhấn nút "💾 Lưu Cài Đặt" để lưu tất cả
- Cài đặt sẽ được ghi vào localStorage
- Sẽ được khôi phục khi truy cập lại

### Đặt Lại Mặc Định:
- Nhấn "🔄 Đặt Lại Mặc Định"
- Xác nhận lựa chọn
- Tất cả sẽ trở về setting ban đầu

## 🔧 Hàm JavaScript Chính

### Khởi Tạo:
```javascript
InitializeSettings()        // Khởi tạo modal khi mở
```

### Hiệu Ứng:
```javascript
EnableEffect(effect)        // Bật hiệu ứng
DisableEffect(effect)       // Tắt hiệu ứng
ApplySettings(settings)     // Áp dụng cài đặt
```

### Hình Nền:
```javascript
SelectBackgroundVideo(id, path)    // Chọn video
SelectBackgroundImage(id, path)    // Chọn ảnh
UploadBackgroundImage()            // Tải ảnh lên
ApplyVideoBackground(path)         // Áp dụng video
ApplyImageBackground(path)         // Áp dụng ảnh
```

### Storage:
```javascript
GetSettingsFromStorage()    // Lấy cài đặt từ localStorage
SaveSettingsToStorage(s)    // Lưu cài đặt vào localStorage
GetDefaultSettings()        // Lấy cài đặt mặc định
```

## 📝 CSS Classes

- `.effect-rainbow`: Class cho hiệu ứng cầu vồng
- `.effect-fireworks`: Class cho hiệu ứng pháo hoa
- `.bg-item`: Style cho video/image thumbnail
- `.bg-item.active`: Khi được chọn (có checkmark)
- `.form-check-lg`: Style checkbox lớn

## 🚀 Tính Năng Nâng Cao

### Thêm Video Mới:
Sửa mảng `AVAILABLE_VIDEOS` trong `settings.js`:
```javascript
const AVAILABLE_VIDEOS = [
    { id: 'vd-bgtet-1', name: 'Nền Tết 1', path: '/static/video/vd-bgtet-1.mp4', thumb: '/static/img/thumbnail/vd-bgtet-1.jpg' },
    { id: 'vd-bgtet-2', name: 'Nền Tết 2', path: '/static/video/vd-bgtet-2.mp4', thumb: '/static/img/thumbnail/vd-bgtet-2.jpg' },
    // Thêm dòng mới ở đây
];
```

### Thêm Hình Ảnh Mới:
Sửa mảng `AVAILABLE_IMAGES` trong `settings.js`:
```javascript
const AVAILABLE_IMAGES = [
    { id: 'img-bg-1', name: 'Hình Nền 1', path: '/static/img/bg_tet/bg_tet_0.jpg', thumb: '/static/img/bg_tet/bg_tet_0.jpg' },
    { id: 'img-bg-2', name: 'Hình Nền 2', path: '/static/img/bg_tet/bg_tet_1.jpg', thumb: '/static/img/bg_tet/bg_tet_1.jpg' },
    // Thêm dòng mới ở đây
];
```

### Thêm Hiệu Ứng Mới:
1. Thêm vào mảng `AVAILABLE_EFFECTS`:
```javascript
newEffect: {
    name: 'Tên Hiệu Ứng',
    element: '#element-id',
    icon: '🎨'
}
```

2. Thêm vào form HTML:
```html
<div class="col-md-6">
    <div class="form-check form-switch form-check-lg">
        <input class="form-check-input effect-checkbox" type="checkbox" id="effect_neweffect" name="effect_neweffect" data-effect="neweffect">
        <label class="form-check-label" for="effect_neweffect">
            <strong>🎨 Tên Hiệu Ứng</strong>
            <br>
            <small class="text-muted">Mô tả hiệu ứng</small>
        </label>
    </div>
</div>
```

3. Implement trong hàm `EnableEffect()` và `DisableEffect()`

## 🎨 Styling

### Màu sắc chủ đạo:
- Primary: `#0d6efd` (Blue)
- Success: `#28a745` (Green)
- Warning: `#ffc107` (Orange)
- Info: `#0dcaf0` (Cyan)

### Gradient Effects:
- Green gradient: `linear-gradient(135deg, #28a745 0%, #20c997 100%)`
- Blue gradient: `linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)`

## ⚠️ Lưu Ý Quan Trọng

1. **Path Hình/Video**: Phải chính xác, đặt trong thư mục `/static/`
2. **localStorage**: Được lưu per browser, không được backup tự động
3. **Responsive**: Modal responsive trên mobile, tablet, desktop
4. **Performance**: Các hiệu ứng CSS có thể ảnh hưởng performance trên device yếu

## 🐛 Troubleshooting

### Hiệu ứng không hiển thị:
- Kiểm tra console (F12) có lỗi
- Kiểm tra element ID có tồn tại
- Kiểm tra CSS có conflict

### Hình nền không thay đổi:
- Kiểm tra path file có chính xác
- Kiểm tra file có tồn tại (status 200)
- Clear cache và reload

### localStorage bị xóa:
- Dữ liệu sẽ reset về default
- Người dùng cần setting lại

---

**Version**: 1.0  
**Last Updated**: 2026-02-20  
**Author**: Lottery Wheel System
