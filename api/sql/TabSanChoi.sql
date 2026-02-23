
--=================================================================

-- Bảng Danh sách Sân chơi
-- Mỗi sân chơi là 1 lượt mới hoàn toàn
TabSanChoi
id
MaSanChoi
TenSanChoi
NgayTao


CREATE TABLE TabSanChoi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    MaSanChoi TEXT NOT NULL,
    TenSanChoi TEXT  NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);

--Bảng cấu hình sân chơi
CREATE TABLE TabSanChoi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    MaSanChoi TEXT NOT NULL,
    MaGiai TEXT  NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);


--=================================================================
--Bảng Giải thưởng
-- TabGiaiThuong
id
MaGiai
TenGiai
QuaTang
GiaTien
NgayTao

CREATE TABLE TabGiaiThuong (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    MaGiai TEXT NOT NULL,
    TenGiai TEXT  NULL,
    QuaTang TEXT NULL,
    GiaTien TEXT NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);


--=================================================================
--Bảng Danh sách Đã trúng và lấy giải
id
MaNhanVien
MaDuThuong
MaGiai
NgayTao

CREATE TABLE TabGiaiThuong (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    MaNhanVien TEXT NOT NULL,
    MaDuThuong TEXT  NULL,
    MaGiai TEXT NULL,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);




-- Chèn dữ liệu vào bảng Ds Giải
DELETE FROM TabDsGiai ;

INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT001','Giải Đặc Biệt');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT002','Giải Nhất');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT003','Giải Nhì');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT004','Giải Ba');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT005','Giải Tư');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT006','Giải Năm');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT007','Giải Sáu');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT008','Giải Bảy');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT009','Giải Tám');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT010','Giải Chín');
INSERT INTO TabDsGiai(MaGiai,TenGiai)VALUES('GT011','Giải Khuyến Khích');


