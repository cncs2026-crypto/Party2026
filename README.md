# 🎉 Party 2025 - Hệ Thống Quản Lý và Điều Hành Chương Trình Giải Trí

## 📋 Giới Thiệu Chung

**Party 2025** là một ứng dụng web được xây dựng trên nền tảng **Django** dùng để quản lý và điều hành các chương trình giải trí, sự kiện, và các trò chơi may mắn. Ứng dụng cung cấp giao diện trực quan, hiệu ứng đặc biệt hấp dẫn, và hệ thống quản lý dữ liệu mạnh mẽ.

---

## ✨ Tính Năng Chính

### 1. **Hệ Thống Xác Thực & Quản Lý Người Dùng**
   - Đăng nhập / Đăng ký tài khoản người dùng
   - Quản lý tài khoản và phân quyền
   - Bảo mật với Django authentication
   - Trang đăng nhập chuyên biệt (`spin_login.html`)

### 2. **Trò Chơi Vòng Quay May Mắn**
   - Giao diện vòng quay tương tác (`spin.html`)
   - Hiệu ứng hình ảnh đẹp mắt với CSS gradients
   - Quản lý vé may mắn (`ticket_manager`)
   - Theo dõi người trúng giải

### 3. **Hệ Thống Quản Lý Sân Chơi**
   - Tạo và cấu hình các sân chơi
   - Quản lý danh sách sân chơi
   - Quản lý các thể loại trò chơi
   - Theo dõi tình trạng hoạt động

### 4. **Hệ Thống Quản Lý Giải Thưởng**
   - Định nghĩa giải thưởng
   - Quản lý danh sách trúng thưởng
   - Theo dõi các trúng giải
   - Quản lý giải Game CF

### 5. **Hệ Thống Quản Lý Người Chơi**
   - Lưu trữ thông tin người chơi
   - Hỗ trợ upload dữ liệu từ file
   - Theo dõi lịch sử tham gia

### 6. **Cấu Hình Giao Diện**
   - Cấu hình logo, header, footer
   - Thay đổi màu nền và chủ đề
   - Quản lý video nền
   - Cài đặt hiệu ứng (lá rơi, pháo hoa, v.v.)
   - Lưu/tải cấu hình bằng JSON
   - Hỗ trợ nhiều phiên bản cấu hình (1.1, 1.2, 1.3, ...)

### 7. **Hiệu Ứng Đặc Biệt**
   - ✨ Hiệu ứng lá rơi (4 loại)
   - 🎆 Hiệu ứng pháo hoa (7 loại)
   - 💫 Hiệu ứng bubble
   - 🌈 Gradient màu nâng cao
   - 🎬 Hỗ trợ video nền

---

## 🏗️ Cấu Trúc Dự Án

```
Party2025/
├── _project/                    # Cấu hình Django chính
│   ├── settings.py             # Thiết lập ứng dụng
│   ├── urls.py                 # Cấu hình URL chính
│   ├── wsgi.py                 # WSGI application
│   └── asgi.py                 # ASGI application
│
├── home/                        # Ứng dụng chính Django
│   ├── views.py                # Xử lý logic yêu cầu
│   ├── urls.py                 # Cấu hình URL
│   ├── models.py               # Model dữ liệu
│   ├── admin.py                # Cấu hình admin Django
│   ├── html/                   # File HTML chuẩn
│   ├── templates/              # Template HTML (30+ file)
│   ├── static/                 # Tài nguyên tĩnh
│   │   ├── conf/              # File cấu hình JSON
│   │   ├── css/               # Stylesheet
│   │   ├── js/                # JavaScript
│   │   ├── myjs/              # Script tùy chỉnh
│   │   ├── assets/            # Hình ảnh, icon
│   │   ├── img/               # Thư viện hình ảnh
│   │   ├── video/             # Video nền
│   │   ├── dataTable/         # Thư viện DataTable
│   │   ├── FontAwesome.Pro/    # Icon Font Awesome
│   │   ├── bootstrap-5.3.3/    # Framework Bootstrap
│   │   └── spin/              # Thư viện vòng quay
│   └── migrations/             # Database migrations
│
├── api/                         # API xử lý dữ liệu
│   ├── _json.py                # Xử lý file JSON
│   ├── _loadfile.py            # Tải và lưu cấu hình
│   ├── _excel.py               # Xử lý file Excel
│   ├── _sqlite.py              # Xử lý SQLite Database
│   └── sql/
│       ├── _sqlite_.py         # SQL utilities
│       ├── TabSanChoi.sql      # Script tạo bảng
│       └── acc.txt             # Tài khoản mẫu
│
├── manage.py                    # Django CLI
├── db.sqlite3                   # Database SQLite
├── db.sqbpro                    # File SQLiteBrowser
├── install.bat                  # Script cài đặt
└── README.md                    # File này
```

---

## 🎯 Danh Sách URL & Chức Năng

| URL | Phương Thức | Chức Năng |
|-----|-------------|----------|
| `/` | GET | Trang chủ |
| `/home/` | GET | Trang chủ (đã đăng nhập) |
| `/login/` | GET | Trang đăng nhập |
| `/spin/` | GET | Giao diện vòng quay (đã đăng nhập) |
| `/login_user/` | POST | Xử lý đăng nhập |
| `/lucky/` | POST | Quản lý vé may mắn |
| `/load_conf/` | GET | Tải cấu hình |
| `/save_conf/` | GET | Lưu cấu hình |
| `/action_dbLite/` | POST | Thao tác Database |
| `/admin/` | GET/POST | Django Admin Panel |

---

## 📊 Cơ Sở Dữ Liệu

Ứng dụng sử dụng **SQLite3** với các bảng chính:

- **TabSanChoi** - Danh sách sân chơi
- **TabDsSanChoi** - Danh sách các sân chơi (cấu trúc khác)
- **TabGiaiThuong** - Danh sách giải thưởng
- **TabNguoiChoi** - Thông tin người chơi
- **TabTrungThuong** - Kết quả trúng thưởng
- **TabGameCf** - Cấu hình game hiện tại
- **_limit_** - Kiểm soát thời gian chạy

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Django 5.0** - Web framework Python
- **SQLite3** - Cơ sở dữ liệu
- **Pandas** - Xử lý dữ liệu, Excel
- **Python 3.10+** - Ngôn ngữ lập trình

### Frontend
- **HTML5** - Cấu trúc trang
- **CSS3** - Định kiểu nâng cao (Gradients, Animations)
- **JavaScript** - Tương tác giao diện
- **Bootstrap 5.3.3** - Framework CSS
- **Font Awesome Pro 5.15.4** - Icon library
- **jQuery** - DOM manipulation

### Thư Viện Hỗ Trợ
- **DataTables** - Quản lý bảng dữ liệu
- **WhiteNoise** - Serve static files
- **Spin.js** - Thư viện vòng quay

---

## 🚀 Cài Đặt & Chạy

### 1. **Cài Đặt Tự Động**
```bash
install.bat
```

### 2. **Cài Đặt Thủ Công**
```bash
pip install django pandas whitenoise
```

### 3. **Khởi Động Server**
```bash
python manage.py runserver
```

### 4. **Truy Cập Ứng Dụng**
```
http://localhost:8000
```

### 5. **Truy Cập Admin Panel**
```
http://localhost:8000/admin/
```

---

## 🔐 Tài Khoản Mặc Định

Kiểm tra file `api/sql/acc.txt` để lấy danh sách tài khoản mẫu.

---

## 📝 Tệp Cấu Hình

### File Cấu Hình JSON
Các file cấu hình được lưu tại: `home/static/conf/`

**Cấu trúc cấu hình:**
```json
{
  "ConfVal": "Tên cấu hình",
  "LogoLeft": "URL logo trái",
  "LogoRight": "URL logo phải",
  "Header": 0,
  "VideoShow": "video.mp4",
  "BgColorHeader": "#FF6B35",
  "TextHeader1": "Chào mừng",
  "TextHeader2": "Sự kiện 2025",
  "TextHeader3": "Giải thưởng lớn",
  "BgMain": "#FFFFFF",
  "BgMainMgTop": 20,
  "BgMainMgLeft": 30,
  "BgMainWidth": 80,
  "BgMainHeight": 90,
  "TabLucky": "lucky.png",
  "LeafEffect_1": true,
  "LeafEffect_2": false,
  "LeafEffect_3": true,
  "LeafEffect_4": false,
  "FireWorkEffect_1": true,
  "FireWorkEffect_2": true,
  "FireWorkEffect_3": false,
  "FireWorkEffect_4": true,
  "FireWorkEffect_5": false,
  "FireWorkEffect_6": true,
  "FireWorkEffect_7": false
}
```

### File Lưu Cấu Hình Hiện Tại
`home/static/conf/saved.inf` - Lưu tên cấu hình đang sử dụng

---

## 🎨 Hỗ Trợ Màu Sắc

Ứng dụng hỗ trợ các theme màu sắc:

```python
list_color = [
    {'class': 'yearlow_1', 'name': 'Vàng cam'},
    {'class': 'yearlow_2', 'name': 'Vàng Gold'},
    {'class': 'red_8', 'name': 'Đỏ sáng'},
    {'class': 'red_9', 'name': 'Đỏ tươi'},
    {'class': 'red_10', 'name': 'Đỏ đậm'},
    {'class': 'pink_0', 'name': 'Hồng nhạt'},
    # ... và nhiều hơn nữa
]
```

---

## 🔒 Bảo Mật

- ✅ CSRF Protection (Django)
- ✅ Authentication & Authorization
- ✅ SQL Injection Prevention (ORM Django)
- ✅ Session Management
- ✅ User Permissions (staff, superuser)

---

## 📱 Đặc Điểm Responsive

- Thiết kế responsive với Bootstrap 5
- Tích hợp DataTables cho quản lý dữ liệu
- Hỗ trợ nhiều kích thước màn hình

---

## 🐛 Khắc Phục Sự Cố

### Vấn đề: Không kết nối được database
```bash
python manage.py migrate
```

### Vấn đề: Static files không tải
```bash
python manage.py collectstatic
```

### Vấn đề: Port 8000 đang sử dụng
```bash
python manage.py runserver 8080
```

---

## 📚 Tài Liệu Tham Khảo

- [Django Documentation](https://docs.djangoproject.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Font Awesome Icons](https://fontawesome.com/)
- [jQuery API](https://api.jquery.com/)

---

## 👨‍💻 Thông Tin Phát Triển

- **Nền tảng:** Django 5.0
- **Cơ sở dữ liệu:** SQLite3
- **Phiên bản Python:** 3.10+
- **Trạng thái:** Đang phát triển

---

## 📄 Giấy Phép

Dự án được phát triển cho mục đích sử dụng nội bộ.

---

## 📞 Liên Hệ & Hỗ Trợ

Để có thêm thông tin hoặc báo cáo lỗi, vui lòng liên hệ với nhóm phát triển.

---

**Phiên bản:** 1.0 | **Ngày cập nhật:** 18/02/2026

#   P a r t y 2 0 2 6  
 # Party2026
#   P a r t y 2 0 2 6  
 