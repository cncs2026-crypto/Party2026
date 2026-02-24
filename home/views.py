from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt    #Bỏ qua csrftocken
from django.http import JsonResponse
from api._loadfile import get_listf,save_conf,get_confsave
from api._json import read_json
from api._sqlite import _sqlt3
import pandas as pd
import json
import os
import uuid
from pathlib import Path

from django.http import JsonResponse,HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.db.models.query_utils import Q
from django.contrib.auth import authenticate,login
from django.contrib.auth.models import User
from django.contrib.auth import logout

# Create your views here.
def load_config(request):
    data=request.GET
    #print(request.method)
    return JsonResponse({'data':get_listf(data=data)},status=200)


def save_config(request):
    data=request.GET
    save=save_conf(data)
    return JsonResponse({'data':save},status=200)

def index_page(request):
    return render(request,'index.html')

@login_required(login_url='/login/')
def home_page(request):
    list_data=get_listf({'ConfName':get_confsave()})
    #print(list_data)
    return render(request,'start.html',list_data)

def login_spin(request):
    return render(request,'spin_login.html')

@login_required(login_url='/login/')
def spin_page(request):
    return render(request,'spin.html')

@csrf_exempt
def login_user(request):
    data=request.POST
    user=data['UserName']
    passw=data['Password']
    #3.Kiểm tra tài khoản đã tồn tại trên sqllite chưa
    if User.objects.filter(username=user).exists():  
        print("Tài khoản đã tồn tại  !")
        #đang nhập     
        my_user= authenticate(request, username=user, password= passw)
        login_=login(request, my_user, backend='django.contrib.auth.backends.ModelBackend')  
        return HttpResponseRedirect('/spin/')
    else:
        return HttpResponse("<h1>Tài khoản hoặc mật khẩu không đúng hoặc đã hết hạn sử dụng</h1><hr><a href='/login/'>Quay lại</a>")

def register_user(request):
    data=request.POST
    user=data['UserName']
    passw=data['Password']
    if User.objects.filter(username=user).exists():  
        return HttpResponse("<h1>Tài khoản đã tồn tại</h1><hr><a href='/login/'>Quay lại</a>")

    create_user(user=user,passw=passw)
    user = User.objects.get(username=user)  
    return HttpResponse("<h1>Tạo tài khoản thành công</h1><hr><a href='/login/'>Quay lại</a>")


def create_user(user='',email='',passw='',fullname=''):
    try:
        user=str(user).upper()
        if user=='': return False
        if passw=='':passw=user
        if email=='':email=f'{user}@foxconn.com'
        if fullname=='':fullname=user
        usersave=User.objects.create_user(user,email,passw,last_name=fullname,is_staff=True) 
        usersave.save()
        return True
    except Exception as ex:
        print(str(ex))
        return False


@csrf_exempt
def ticket_manager(request):
    data=request.POST
    print(data)
    sql=_sqlt3.TicketManager(data=data)
    return JsonResponse({'data':sql},status=200)


#Thao tác cơ sở dữ liệu
@csrf_exempt
def action_dbLite(request):
    try:
        if request.method !='POST':
            return JsonResponse({'message':'Cần sử dụng phương thức POST'},status=400)
        
        data_=request.POST
        data=_sqlt3.removeMultiDict(data_)
        upload={}
        
        # DEBUG: Log all data received
        print('='*60)
        print('🔍 DEBUG action_dbLite - Request received:')
        print(f'Request method: {request.method}')
        print(f'Request POST keys: {list(request.POST.keys())}')
        print(f'Request POST data: {dict(request.POST)}')
        print(f'Converted data: {data}')
        print('='*60)
        
        # Handle image upload for gifts
        if data.get('Action') == 'SAVE_IMAGE':
            print('🎁 Processing SAVE_IMAGE action...')
            
            # Check if file exists
            if 'gift_image' not in request.FILES:
                print('❌ No file uploaded')
                return JsonResponse({'error': 'No file uploaded'}, status=400)
            
            file = request.FILES['gift_image']
            print(f'📁 File received: {file.name}, Size: {file.size}')
            
            # Validate file type
            allowed_extensions = ['jpg', 'jpeg', 'png']
            file_ext = file.name.split('.')[-1].lower()
            if file_ext not in allowed_extensions:
                print(f'❌ Invalid file type: {file_ext}')
                return JsonResponse({'error': f'Invalid file type. Allowed: {", ".join(allowed_extensions)}'}, status=400)
            
            # Validate file size (max 5MB)
            max_size = 5 * 1024 * 1024  # 5MB
            if file.size > max_size:
                print(f'❌ File too large: {file.size} bytes')
                return JsonResponse({'error': f'File too large. Max size: 5MB'}, status=400)
            
            # Create uploads directory if it doesn't exist
            upload_dir = os.path.join(os.path.dirname(__file__), 'static', 'spin', 'images')
            os.makedirs(upload_dir, exist_ok=True)
            print(f'📁 Upload directory: {upload_dir}')
            
            # Generate unique filename
            file_uuid = str(uuid.uuid4())
            filename = f'{file_uuid}.{file_ext}'
            file_path = os.path.join(upload_dir, filename)
            print(f'💾 Saving to: {file_path}')
            
            # Save file
            try:
                with open(file_path, 'wb') as f:
                    for chunk in file.chunks():
                        f.write(chunk)
                print(f'✅ File saved successfully')
            except Exception as ex:
                print(f'❌ Error saving file: {str(ex)}')
                return JsonResponse({'error': f'Error saving file: {str(ex)}'}, status=400)
            
            # Update database
            try:
                gift_id = data.get('id', '')
                ma_qua_tang = data.get('MaQuaTang', '')
                
                print(f'🗄️ Updating database - ID: {gift_id}, MaQuaTang: {ma_qua_tang}, Filename: {filename}')
                
                # Build update query
                update_data = {
                    'Action': 'UPDATE_IMAGE',
                    'id': gift_id,
                    'tab_name': data.get('tab_name', 'TabGiaiThuong'),
                    'HinhAnh': filename,
                    'MaQuaTang': ma_qua_tang
                }
                
                # Call database update
                result = _sqlt3.TabGiaiThuong(update_data)
                print(f'✅ Database updated: {result}')
                
                return JsonResponse({'filename': filename}, status=200)
            except Exception as ex:
                print(f'❌ Error updating database: {str(ex)}')
                return JsonResponse({'error': f'Error updating database: {str(ex)}'}, status=400)
        
        def check_exist(data):
            dt=data.copy()   
            dt.update({'Action':'CHECK_EXIST'})        
            check=_sqlt3.ActionSqlite(dt)

            if check['check_emp']==1:return JsonResponse({'error':f"Mã nhân viên [{dt['MaNhanVien']}] đã tồn tại"},status=400)
            if check['check_ticket']==1:return JsonResponse({'error':f"Mã dự thưởng [{dt['MaDuThuong']}] đã tồn tại"},status=400)
            return True
        
        action=data['Action']
        if action in ['CHECK_LICENSE', 'SAVE_TICKET_OK', 'SAVE_LIST_TICKET_OK']:
            account = ''
            if hasattr(request, 'user') and request.user.is_authenticated:
                account = str(request.user.username or '').upper()
            data.update({'LicenseAccount': account})

        if 'EXCEL' in action:
            #Lấy danh sách mã nhân viên từ file excel
            file= request.FILES['listfile']
            sheet_name='Sheet1'
            excel=pd.read_excel(file,sheet_name=[sheet_name],header=0,converters={'MaDuThuong':str,'MaNhanVien':str})
            dt=excel.get(sheet_name)
            data_json=dt.to_json(orient='records')

            #Chuyển về json
            upload=json.loads(data_json)
            # print(upload)
            #kiểm tra dữ liệu trùng lặp trước khi thêm
            if action=='ADD_EXCEL':
                for item in upload:
                    dt=item
                    item.update({'MaSanChoi':data['MaSanChoi'],'tab_name':data['tab_name']})
                    check=check_exist(item)
                    if  check !=True:return check
        elif action=='ADD_EMP':
            check=check_exist(data)
            if  check !=True:return check

        tab=_sqlt3.ActionSqlite(data,upload)

        if isinstance(tab, dict) and tab.get('ok') is False:
            return JsonResponse({'error': tab.get('message', 'License không hợp lệ')}, status=400)

        if isinstance(tab, list) and len(tab) > 0 and isinstance(tab[0], dict) and 'error' in tab[0]:
            return JsonResponse({'error': tab[0].get('error', 'Có lỗi dữ liệu')}, status=400)

        return JsonResponse({'data':tab},status=200)
    except Exception as ex:
        return JsonResponse({'error':str(ex)},status=400)

def test_formdata(request):
    """Test page for FormData & Action parameter debugging"""
    return render(request,'test_formdata.html')

@csrf_exempt
def get_videos(request):
    """Lấy danh sách video từ thư mục home/static/video"""
    try:
        video_dir = os.path.join(os.path.dirname(__file__), 'static', 'video')
        videos = []
        
        if os.path.exists(video_dir):
            # Lấy tất cả file video
            video_files = [f for f in os.listdir(video_dir) if f.lower().endswith(('.mp4', '.webm', '.ogv', '.mov'))]
            video_files.sort()
            
            for idx, filename in enumerate(video_files, 1):
                video_path = os.path.join(video_dir, filename)
                videos.append({
                    'id': f'vd-{idx}',
                    'name': filename.replace('.mp4', '').replace('.webm', '').replace('.ogv', '').replace('.mov', ''),
                    'path': f'/static/video/{filename}',
                    'thumb': f'/static/video/{filename}'  # Video thumbnail (playback preview)
                })
        
        return JsonResponse({
            'success': True,
            'videos': videos,
            'count': len(videos)
        }, status=200)
    except Exception as ex:
        return JsonResponse({
            'success': False,
            'error': str(ex)
        }, status=400)

@csrf_exempt
def get_images(request):
    """Lấy danh sách hình ảnh từ thư mục home/static/img/bg_tet"""
    try:
        image_dir = os.path.join(os.path.dirname(__file__), 'static', 'img', 'bg_tet')
        images = []
        
        if os.path.exists(image_dir):
            # Lấy tất cả file ảnh
            image_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
            image_files.sort()
            
            for idx, filename in enumerate(image_files, 1):
                image_path = os.path.join(image_dir, filename)
                images.append({
                    'id': f'img-{idx}',
                    'name': filename.replace('.jpg', '').replace('.jpeg', '').replace('.png', '').replace('.gif', '').replace('.webp', ''),
                    'path': f'/static/img/bg_tet/{filename}',
                    'thumb': f'/static/img/bg_tet/{filename}'
                })
        
        return JsonResponse({
            'success': True,
            'images': images,
            'count': len(images)
        }, status=200)
    except Exception as ex:
        return JsonResponse({
            'success': False,
            'error': str(ex)
        }, status=400)

@csrf_exempt
def get_spin_backgrounds(request):
    """Lấy danh sách nền vòng quay từ thư mục home/static/spin/img_spin"""
    try:
        spin_bg_dir = os.path.join(os.path.dirname(__file__), 'static', 'spin', 'img_spin')
        images = []

        if os.path.exists(spin_bg_dir):
            image_files = [f for f in os.listdir(spin_bg_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'))]
            image_files.sort()

            for idx, filename in enumerate(image_files, 1):
                images.append({
                    'id': f'spin-bg-{idx}',
                    'name': os.path.splitext(filename)[0],
                    'file': filename,
                    'path': f'/static/spin/img_spin/{filename}',
                    'thumb': f'/static/spin/img_spin/{filename}'
                })

        return JsonResponse({
            'success': True,
            'images': images,
            'count': len(images)
        }, status=200)
    except Exception as ex:
        return JsonResponse({
            'success': False,
            'error': str(ex)
        }, status=400)

