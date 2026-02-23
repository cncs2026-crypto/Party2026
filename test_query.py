#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
sys.path.insert(0, 'C:\\Users\\admin\\Desktop\\Party2025')

from api._sqlite import SQLITE3

# Khởi tạo database
db = SQLITE3()

# Test data
test_data = {
    'Action': 'GET_LIST_PLAY',
    'MaGiai': 'GT001',  # Giải Đặc Biệt
    'MaSanChoi': 'SC001'  # Sân chơi
}

print("=" * 60)
print("TEST: Lấy danh sách người chơi cho Giải Đặc Biệt")
print("=" * 60)
print(f"Input: {test_data}")
print()

# Gọi hàm TabNguoiChoi
result = db.TabNguoiChoi(test_data)

print("RESULT:")
print(f"Tổng số người: {len(result)}")
print()

if len(result) > 0:
    print("✅ Có dữ liệu!")
    for i, person in enumerate(result[:5], 1):  # Show 5 cái đầu
        print(f"{i}. {person}")
else:
    print("❌ Không có dữ liệu!")
    print("\n--- Debug: Kiểm tra dữ liệu trong TabNguoiChoi ---")
    
    # Check TabNguoiChoi
    all_people = db.SelectSqlite("SELECT * FROM TabNguoiChoi LIMIT 5")
    print(f"TabNguoiChoi (5 dòng đầu): {len(all_people)} records")
    if all_people:
        print(all_people[0])
    
    # Check TabTrungThuong
    winners = db.SelectSqlite("SELECT * FROM TabTrungThuong LIMIT 5")
    print(f"\nTabTrungThuong (5 dòng đầu): {len(winners)} records")
    if winners:
        print(winners[0])
    
    # Check TabSanChoi
    sanChoi = db.SelectSqlite("SELECT * FROM TabSanChoi WHERE MaGiai='GT001' AND TrangThai=1")
    print(f"\nTabSanChoi (GT001 active): {len(sanChoi)} records")
    if sanChoi:
        print(sanChoi)

print("\n" + "=" * 60)
