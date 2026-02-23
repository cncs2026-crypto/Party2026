#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test database connectivity and basic queries
"""
import sys
import os
import django

# Thêm project vào đường dẫn
sys.path.insert(0, 'c:/Users/admin/Desktop/Party2025')

# Cấu hình Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_project.settings')
django.setup()

# Import SQLITE3 class
from api._sqlite import SQLITE3

# Tạo instance
db = SQLITE3()

# Test 1: Kiểm tra xem table TabDsSanChoi có dữ liệu không
print("=" * 60)
print("TEST 1: Lấy danh sách tất cả sân chơi (TabDsSanChoi)")
print("=" * 60)
try:
    result = db.QuerySqlite(f"SELECT * FROM TabDsSanChoi", type='select')
    print(f"✅ SUCCESS: Truy vấn thành công")
    print(f"📊 Số lượng sân chơi: {len(result)}")
    if len(result) > 0:
        print(f"📝 Dữ liệu:")
        for row in result:
            print(f"   - {row}")
    else:
        print("⚠️  Không có dữ liệu trong bảng TabDsSanChoi")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

# Test 2: Kiểm tra check_limit
print("\n" + "=" * 60)
print("TEST 2: Kiểm tra hàm check_limit()")
print("=" * 60)
try:
    result = db.check_limit()
    print(f"✅ check_limit() = {result}")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

# Test 3: Thêm một sân chơi mới
print("\n" + "=" * 60)
print("TEST 3: Thêm một sân chơi mới")
print("=" * 60)
try:
    data = {
        'Action': 'SAVE',
        'MaSanChoi': 'TEST001',
        'TenSanChoi': 'Sân Chơi Test'
    }
    result = db.TabDsSanChoi(data)
    print(f"✅ SAVE thành công: {result}")
    
    # Verify data was inserted
    verify = db.QuerySqlite(f"SELECT * FROM TabDsSanChoi WHERE MaSanChoi='TEST001'", type='select')
    print(f"✅ Verification: Tìm thấy {len(verify)} bản ghi")
    if len(verify) > 0:
        print(f"   - {verify[0]}")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

# Test 4: Lấy danh sách sân chơi sau khi insert
print("\n" + "=" * 60)
print("TEST 4: Lấy danh sách sân chơi (ALL)")
print("=" * 60)
try:
    data = {'Action': 'ALL'}
    result = db.TabDsSanChoi(data)
    print(f"✅ SUCCESS: Truy vấn thành công")
    print(f"📊 Số lượng sân chơi: {len(result)}")
    if len(result) > 0:
        print(f"📝 Dữ liệu (5 cái đầu tiên):")
        for i, row in enumerate(result[:5]):
            print(f"   {i+1}. MaSanChoi={row.get('MaSanChoi')}, TenSanChoi={row.get('TenSanChoi')}")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

# Test 5: Kiểm tra xem _limit_ table
print("\n" + "=" * 60)
print("TEST 5: Kiểm tra bảng _limit_")
print("=" * 60)
try:
    result = db.QuerySqlite(f"SELECT * FROM _limit_", type='select')
    print(f"✅ SUCCESS: Truy vấn thành công")
    print(f"📊 Số lượng record: {len(result)}")
    if len(result) > 0:
        print(f"📝 Dữ liệu:")
        for row in result:
            print(f"   - {row}")
    else:
        print("⚠️  Bảng _limit_ trống")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

print("\n" + "=" * 60)
print("TEST HOÀN THÀNH")
print("=" * 60)
