

from django.urls import path
from . import views as v


urlpatterns = [
    path('',v.index_page),
    path('home/',v.home_page),
    path('login/',v.login_spin),
    path('spin/',v.spin_page),
    path('login_user/',v.login_user),
    path('lucky/',v.ticket_manager),
    path('load_conf/',v.load_config),
    path('save_conf/',v.save_config),
    path('action_dbLite/',v.action_dbLite),#thêm danh sách người chơi
    path('test_formdata/',v.test_formdata),#test FormData & Action parameter
    path('get_videos/',v.get_videos),#lấy danh sách video
    path('get_images/',v.get_images),#lấy danh sách ảnh
    path('get_spin_backgrounds/',v.get_spin_backgrounds),#lấy danh sách nền vòng quay
]

