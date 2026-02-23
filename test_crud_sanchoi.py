#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test CRUD operations for TabDsSanChoi
Kiểm tra CREATE, READ, UPDATE, DELETE hoạt động đúng không
"""
import sys
import os
import django
from datetime import datetime

sys.path.insert(0, 'c:/Users/admin/Desktop/Party2025')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_project.settings')
django.setup()

from api._sqlite import SQLITE3

db = SQLITE3()

print("=" * 70)
print("🧪 TEST CRUD OPERATIONS CHO TabDsSanChoi")
print("=" * 70)

# TEST 1: ALL - Lấy danh sách
print("\n📌 TEST 1: Lấy danh sách tất cả sân chơi (ALL)")
print("-" * 70)
try:
    data = {'Action': 'ALL'}
    result = db.TabDsSanChoi(data)
    print(f"✅ SUCCESS: Truy vấn thành công")
    print(f"📊 Số lượng sân chơi: {len(result)}")
    if len(result) > 0:
        print(f"📝 5 cái đầu tiên:")
        for i, row in enumerate(result[:5], 1):
            print(f"   {i}. ID={row.get('id')}, MaSanChoi={row.get('MaSanChoi')}, TenSanChoi={row.get('TenSanChoi')}")
    else:
        print("⚠️  Bảng trống - sẽ test thêm dữ liệu")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

# TEST 2: SAVE - Thêm mới
print("\n📌 TEST 2: Thêm mới sân chơi (SAVE)")
print("-" * 70)
test_ma = f"TEST_{datetime.now().strftime('%H%M%S')}"
test_name = f"Sân Chơi Test - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

try:
    data = {
        'Action': 'SAVE',
        'MaSanChoi': test_ma,
        'TenSanChoi': test_name
    }
    result = db.TabDsSanChoi(data)
    print(f"✅ SAVE thành công")
    print(f"📋 Response: {result}")
    
    # Verify
    verify = db.QuerySqlite(f"SELECT * FROM TabDsSanChoi WHERE MaSanChoi='{test_ma}'", type='select')
    if len(verify) > 0:
        print(f"✅ Verification: Tìm thấy {len(verify)} bản ghi")
        print(f"   - ID={verify[0].get('id')}, MaSanChoi={verify[0].get('MaSanChoi')}, TenSanChoi={verify[0].get('TenSanChoi')}")
        test_id = verify[0].get('id')
    else:
        print(f"❌ Verification failed: Không tìm thấy dữ liệu vừa thêm")
        test_id = None
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    test_id = None

# TEST 3: SELECT - Lấy một bản ghi
if test_id:
    print("\n📌 TEST 3: Lấy một bản ghi cụ thể (SELECT)")
    print("-" * 70)
    try:
        data = {
            'Action': 'SELECT',
            'id': test_id
        }
        result = db.TabDsSanChoi(data)
        print(f"✅ SELECT thành công")
        print(f"📋 Dữ liệu: {result}")
        if len(result) > 0:
            print(f"   - ID={result[0].get('id')}, MaSanChoi={result[0].get('MaSanChoi')}, TenSanChoi={result[0].get('TenSanChoi')}")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

# TEST 4: DELETE - Xóa bản ghi
if test_id:
    print("\n📌 TEST 4: Xóa bản ghi (DELETE)")
    print("-" * 70)
    try:
        data = {
            'Action': 'DELETE',
            'id': test_id
        }
        result = db.TabDsSanChoi(data)
        print(f"✅ DELETE thành công")
        print(f"📋 Response: {result}")
        
        # Verify
        verify = db.QuerySqlite(f"SELECT * FROM TabDsSanChoi WHERE id={test_id}", type='select')
        if len(verify) == 0:
            print(f"✅ Verification: Bản ghi đã bị xóa")
        else:
            print(f"❌ Verification failed: Bản ghi vẫn tồn tại")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

# TEST 5: EDIT - Load data để edit
print("\n📌 TEST 5: Load data để edit (EDIT)")
print("-" * 70)
try:
    # Lấy ID đầu tiên
    all_data = db.TabDsSanChoi({'Action': 'ALL'})
    if len(all_data) > 0:
        first_id = all_data[0].get('id')
        data = {
            'Action': 'EDIT',
            'id': first_id
        }
        result = db.TabDsSanChoi(data)
        print(f"✅ EDIT load thành công")
        print(f"📋 Dữ liệu: {result}")
        if len(result) > 0:
            print(f"   - ID={result[0].get('id')}, MaSanChoi={result[0].get('MaSanChoi')}, TenSanChoi={result[0].get('TenSanChoi')}")
    else:
        print("⚠️  Không có dữ liệu để test EDIT")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

# TEST 6: Check database state
print("\n📌 TEST 6: Kiểm tra trạng thái database")
print("-" * 70)
try:
    result = db.QuerySqlite(f"SELECT COUNT(*) as count FROM TabDsSanChoi", type='select')
    if len(result) > 0:
        count = result[0].get('count', 0)
        print(f"✅ Tổng số sân chơi trong database: {count}")
    
    result = db.QuerySqlite(f"SELECT COUNT(*) as count FROM _limit_", type='select')
    if len(result) > 0:
        count = result[0].get('count', 0)
        print(f"✅ Tổng số records trong bảng _limit_: {count}")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

print("\n" + "=" * 70)
print("✅ TEST HOÀN THÀNH")
print("=" * 70)
print("\n📌 Kết luận:")
print("   ✓ Nếu tất cả test đều SUCCESS → Tính năng CRUD hoạt động đúng")
print("   ✓ Nếu có ERROR → Kiểm tra message lỗi và database")
print("   ✓ Mở F12 Console trong browser để xem chi tiết request/response")
