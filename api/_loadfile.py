import os
import json
import sqlite3

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
DB_PATH = str(BASE_DIR / 'db.sqlite3')

CONFIG_FIELDS = [
    'ConfVal', 'LogoLeft', 'LogoRight', 'Header', 'VideoShow', 'BgColorHeader',
    'TextHeader1', 'TextHeader2', 'TextHeader3', 'BgMain', 'BgMainMgTop',
    'BgMainMgLeft', 'BgMainWidth', 'BgMainHeight', 'TabLucky',
    'LeafEffect_1', 'LeafEffect_2', 'LeafEffect_3', 'LeafEffect_4',
    'FireWorkEffect_1', 'FireWorkEffect_2', 'FireWorkEffect_3',
    'FireWorkEffect_4', 'FireWorkEffect_5', 'FireWorkEffect_6', 'FireWorkEffect_7'
]

DEFAULT_CONF = {
    'ConfVal': 'Cấu hình mặc định',
    'LogoLeft': '',
    'LogoRight': '',
    'Header': 1,
    'VideoShow': '',
    'BgColorHeader': '',
    'TextHeader1': '',
    'TextHeader2': '',
    'TextHeader3': '',
    'BgMain': '',
    'BgMainMgTop': 0,
    'BgMainMgLeft': 0,
    'BgMainWidth': 1,
    'BgMainHeight': 1,
    'TabLucky': '0',
    'LeafEffect_1': False,
    'LeafEffect_2': False,
    'LeafEffect_3': False,
    'LeafEffect_4': False,
    'FireWorkEffect_1': False,
    'FireWorkEffect_2': False,
    'FireWorkEffect_3': False,
    'FireWorkEffect_4': False,
    'FireWorkEffect_5': False,
    'FireWorkEffect_6': False,
    'FireWorkEffect_7': False,
}

def _db_conn():
    conn = sqlite3.connect(DB_PATH, timeout=5)
    conn.row_factory = sqlite3.Row
    return conn

def _to_bool(val):
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return int(val) == 1
    if isinstance(val, str):
        v = val.strip().lower()
        return v in ['1', 'true', 'yes', 'on']
    return False

def _normalize_conf(data):
    conf = DEFAULT_CONF.copy()
    if not isinstance(data, dict):
        return conf

    for field in CONFIG_FIELDS:
        if field in data:
            conf[field] = data.get(field)

    bool_fields = [
        'LeafEffect_1', 'LeafEffect_2', 'LeafEffect_3', 'LeafEffect_4',
        'FireWorkEffect_1', 'FireWorkEffect_2', 'FireWorkEffect_3',
        'FireWorkEffect_4', 'FireWorkEffect_5', 'FireWorkEffect_6', 'FireWorkEffect_7'
    ]
    for field in bool_fields:
        conf[field] = _to_bool(conf.get(field))

    int_fields = ['Header', 'BgMainMgTop', 'BgMainMgLeft']
    float_fields = ['BgMainWidth', 'BgMainHeight']

    for field in int_fields:
        try:
            conf[field] = int(conf.get(field, 0))
        except Exception:
            conf[field] = DEFAULT_CONF[field]

    for field in float_fields:
        try:
            conf[field] = float(conf.get(field, 1))
        except Exception:
            conf[field] = DEFAULT_CONF[field]

    conf['TabLucky'] = str(conf.get('TabLucky', '0'))
    return conf

def _ensure_config_table():
    with _db_conn() as conn:
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS AppConfig (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ConfName TEXT NOT NULL UNIQUE,
                ConfVal TEXT NULL,
                ConfigJson TEXT NOT NULL,
                IsActive INTEGER NOT NULL DEFAULT 0,
                CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            '''
        )
        conn.commit()

def _read_conf_from_db(conf_name):
    if str(conf_name or '').strip() == '':
        return []
    with _db_conn() as conn:
        row = conn.execute(
            'SELECT ConfigJson FROM AppConfig WHERE ConfName=? LIMIT 1',
            (str(conf_name).strip(),)
        ).fetchone()
    if not row:
        return []
    try:
        cfg = json.loads(row['ConfigJson'])
        return [_normalize_conf(cfg)]
    except Exception:
        return []

def _list_confs_from_db():
    with _db_conn() as conn:
        rows = conn.execute(
            'SELECT ConfName, ConfigJson FROM AppConfig ORDER BY UpdatedAt DESC, id DESC'
        ).fetchall()

    ls_confs = []
    for row in rows:
        try:
            cfg = _normalize_conf(json.loads(row['ConfigJson']))
            ls_confs.append({'cfgname': row['ConfName'], 'cfg': cfg})
        except Exception:
            continue
    return ls_confs

def _upsert_conf_to_db(conf_name, conf):
    conf_name = str(conf_name or '').strip()
    if conf_name == '':
        conf_name = 'conf_1.1'

    conf = _normalize_conf(conf)
    conf_json = json.dumps(conf, ensure_ascii=False)

    with _db_conn() as conn:
        conn.execute('UPDATE AppConfig SET IsActive=0')
        conn.execute(
            '''
            INSERT INTO AppConfig (ConfName, ConfVal, ConfigJson, IsActive, UpdatedAt)
            VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
            ON CONFLICT(ConfName) DO UPDATE SET
                ConfVal=excluded.ConfVal,
                ConfigJson=excluded.ConfigJson,
                IsActive=1,
                UpdatedAt=CURRENT_TIMESTAMP
            ''',
            (conf_name, str(conf.get('ConfVal', conf_name)), conf_json)
        )
        conn.commit()

def _bootstrap_db_from_files_if_needed():
    _ensure_config_table()
    with _db_conn() as conn:
        count = conn.execute('SELECT COUNT(1) AS c FROM AppConfig').fetchone()['c']
    if count and int(count) > 0:
        return

    conf_dir = Path(path_com) / 'conf'
    if not conf_dir.exists():
        _upsert_conf_to_db('conf_1.1', DEFAULT_CONF)
        return

    for file_path in sorted(conf_dir.glob('conf*.json')):
        try:
            dt = _json.read_json(str(file_path))
            if isinstance(dt, list) and len(dt) > 0 and isinstance(dt[0], dict):
                _upsert_conf_to_db(file_path.stem, dt[0])
        except Exception:
            continue

    with _db_conn() as conn:
        count_after = conn.execute('SELECT COUNT(1) AS c FROM AppConfig').fetchone()['c']
    if int(count_after) <= 0:
        _upsert_conf_to_db('conf_1.1', DEFAULT_CONF)

#đọc cấu hình
def read_config(conf_name):
    _ensure_config_table()
    conf = _read_conf_from_db(conf_name)
    if len(conf) > 0:
        return conf

    # fallback file cũ
    try:
        conf = _json.read_json(path_com + f'conf/{conf_name}.json')
        if isinstance(conf, list) and len(conf) > 0:
            return [_normalize_conf(conf[0])]
    except Exception:
        pass
    return []

#lấy cầu hình đã lưu
def get_confsave():
    _ensure_config_table()
    with _db_conn() as conn:
        row = conn.execute(
            'SELECT ConfName FROM AppConfig WHERE IsActive=1 ORDER BY UpdatedAt DESC, id DESC LIMIT 1'
        ).fetchone()
        if row:
            return row['ConfName']

        row = conn.execute(
            'SELECT ConfName FROM AppConfig ORDER BY UpdatedAt DESC, id DESC LIMIT 1'
        ).fetchone()
        if row:
            return row['ConfName']

    # fallback file cũ
    try:
        with open(path_com + 'conf/saved.inf', "r", encoding="utf-8") as file:
            return file.read().strip()
    except Exception:
        return ''

#lưu cấu hình
def save_conf(data):
    _ensure_config_table()
    conf_name = str(data.get('ConfName', 'conf_1.1')).strip() or 'conf_1.1'
    conf = _normalize_conf(data)
    _upsert_conf_to_db(conf_name, conf)
    print(f"Đã lưu cấu hình DB {conf_name}")
    return True


def get_listf(data={}):
    _ensure_config_table()
    ConfName=''
    conf=''
    try:
        ConfName=data['ConfName']
    except:pass

    #Lấy thông tin lưu
    if ConfName=='':
        ConfName =get_confsave()
        if ConfName!='':
            conf = read_config(ConfName)
        else:
            conf = [DEFAULT_CONF.copy()]
    else:
        conf = read_config(ConfName)

    if not isinstance(conf, list) or len(conf) <= 0:
        conf = [DEFAULT_CONF.copy()]

    # print(ConfName)

    # Danh sách cấu hình lấy từ DB
    ls_confs = _list_confs_from_db()
    ls_conf = [f"{item['cfgname']}.json" for item in ls_confs]

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

_bootstrap_db_from_files_if_needed()

