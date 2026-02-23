import os

from pathlib import Path
from . import _json

list_color=[
    {'class':'yearlow_1','name':'Vàng cam'},
    {'class':'yearlow_2','name':'Vàng Gold'},
    {'class':'yearlow_3','name':'Vàng Cam Gradient hình elip'},
    {'class':'yearlow_4','name':'Vàng cam Gradient với hiệu ứng bóng mờ '},
    {'class':'yearlow_5','name':'Vàng cam Gradient mềm mại '},
    {'class':'yearlow_6','name':'Vàng cam Gradient xuyên tâm '},
    {'class':'yearlow_7','name':'Đỏ vàng Gradient  '},
    {'class':'yearlow_8','name':'Vàng cam  '},
    {'class':'red_8','name':'Đỏ sáng'},
    {'class':'red_9','name':'Đỏ tươi'},
    {'class':'red_10','name':'Đỏ đậm'},
    {'class':'pink_0','name':'Hồng nhạt'},
    {'class':'pink_1','name':'Hồng nhạt'},

]


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
path_com=str(BASE_DIR)+'/home/static/'

#đọc cấu hình
def read_config(conf_name):
    conf=_json.read_json(path_com+f'conf/{conf_name}.json')
    return conf

#lấy cầu hình đã lưu
def get_confsave():
    ConfName=''
    with open(path_com+'conf/saved.inf', "r", encoding="utf-8") as file:
                ConfName = file.read()  # Đọc toàn bộ nội dung file
    return ConfName

#lưu cấu hình
def save_conf(data):
    conf_name=data['ConfName']
    # print(data)
    text="[{"

    text+=f"""
        "ConfVal": "{data['ConfVal']}",
        "LogoLeft":"{data['LogoLeft']}",
        "LogoRight": "{data['LogoRight']}",
        "Header": {data['Header']},
        "VideoShow": "{data['VideoShow']}",
        "BgColorHeader": "{data['BgColorHeader']}",
        "TextHeader1": "{data['TextHeader1']}",
        "TextHeader2": "{data['TextHeader2']}",
        "TextHeader3": "{data['TextHeader3']}",
        "BgMain": "{data['BgMain']}",
        "BgMainMgTop": {data['BgMainMgTop']},
        "BgMainMgLeft": {data['BgMainMgLeft']},
        "BgMainWidth": {data['BgMainWidth']},
        "BgMainHeight": {data['BgMainHeight']},
        "TabLucky": "{data['TabLucky']}",

        "LeafEffect_1": {data['LeafEffect_1']},
        "LeafEffect_2": {data['LeafEffect_2']},
        "LeafEffect_3": {data['LeafEffect_3']},
        "LeafEffect_4": {data['LeafEffect_4']},
        "FireWorkEffect_1": {data['FireWorkEffect_1']},
        "FireWorkEffect_2": {data['FireWorkEffect_2']},
        "FireWorkEffect_3": {data['FireWorkEffect_3']},
        "FireWorkEffect_4": {data['FireWorkEffect_4']},
        "FireWorkEffect_5": {data['FireWorkEffect_5']},
        "FireWorkEffect_6": {data['FireWorkEffect_6']},
        "FireWorkEffect_7": {data['FireWorkEffect_7']}

    """
    text+="}]"
    with open(path_com+f'conf/{conf_name}.json',mode='w+',encoding='utf-8') as w:        
        w.write(text)
    with open(path_com+'conf/saved.inf',mode='w+',encoding='utf-8') as w:
        w.write(conf_name)
    print(f"Đã lưu cấu hình {conf_name}")
    return True


def get_listf(data={}):
    ConfName=''
    conf=''
    try:
        ConfName=data['ConfName']
    except:pass

    #Lấy thông tin lưu
    if ConfName=='':
        ConfName =get_confsave()
        #Lấy thông tin cấu hình của đã lưu
        if ConfName!='':
            try:
                conf=_json.read_json(path_com+f'conf/'+ConfName+'.json')
            except: pass
        else: return []
    else: conf=_json.read_json(path_com+f'conf/'+ConfName+'.json')

    # print(ConfName)

    ls_conf=os.listdir(path_com+'conf/')
    ls_confs=[]

    for item in ls_conf:
        #print(item)
        
        if 'conf' in str(item):
            cf=read_config(item[:-5])
            #print(cf)
            if len(cf)>0: 
                #print(cf)
                ls_confs.append({'cfgname':item[0: -5] ,'cfg':cf[0]})

    ls_vi=os.listdir(path_com+'video')
    ls_bg=os.listdir(path_com+'img/bg_tet')
    ls_logo=os.listdir(path_com+'img/icon/left')
    ls_logo2=os.listdir(path_com+'img/icon/right')

    return {
        'ls_vi':ls_vi,
        'ls_bg':ls_bg,
        'ls_logo':ls_logo,
        'ls_logo2':ls_logo2,
        'ls_color':list_color,
        'ls_conf':ls_conf,
        'ls_confs':ls_confs,
        'conf':conf,
        'ConfName':ConfName
    }

#print(get_listf())

