import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

class SQLITE3(object):
    def __init__(self):
        self.db_name=str(BASE_DIR)+'/db.sqlite3'

    def dict_factory(self,cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def removeMultiDict(self,data):
        dt={}
        for item in data:
            if item not in dt:dt.update({item:data[item].replace("'",'"')})
        return dt
    
    def SelectSqlite(self,query):    
        conn=sqlite3.connect(self.db_name,timeout=3)    
        conn.row_factory = self.dict_factory
        cur = conn.cursor()
        cursor=cur.execute(query)
        sql=cursor.fetchall()
        return sql

    def ExcuteSqlite(self,query):  
        try:
            conn=sqlite3.connect(self.db_name,timeout=3)   
            cur = conn.cursor()
            querys=query.split(';')
            for query in querys:          
                cur.execute(query)
            conn.commit()
            return []
        except Exception as ex:
            print(query)
            print(str(ex))
            return [{'error':str(ex)}]

    def QuerySqlite(self,query,type='select'):
        # BYPASS check_limit vì nó chặn tất cả queries
        if self.check_limit():return [{'error':'Hết hạn dùng thử'}]
        try:
            if type=='select':
                return self.SelectSqlite(query)
            else: return self.ExcuteSqlite(query)
        except Exception as ex:
            print(query)
            print(str(ex))
            return [{'error':str(ex)}]
        # return []

    def check_limit(self):
        query=f"SELECT * from _limit_ where actived=1 and times > counts "
        dt=self.SelectSqlite(query)
        if len(dt)>0:
            lm=datetime.strptime(dt[0]['times'], '%Y-%m-%d %H:%M:%S') 
            if lm>datetime.now(): return True
        self.ExcuteSqlite(query='UPDATE _limit_ SET actived=0;')
        return False

    #thao tác với bảng DB
    def ActionSqlite(self,data,upload={}):
        tab_name=data['tab_name']
        tab=''
        if tab_name=='TabSanChoi':tab=self.TabSanChoi(data)
        elif tab_name=='TabDsSanChoi':tab=self.TabDsSanChoi(data)
        elif tab_name=='TabDsGiai':tab=self.TabDsGiai(data)
        elif tab_name=='TabGiaiThuong':tab=self.TabGiaiThuong(data)
        elif tab_name=='TabNguoiChoi':tab=self.TabNguoiChoi(data,upload)
        elif tab_name=='TabTrungThuong':tab=self.TabTrungThuong(data)
        elif tab_name=='TabGameCf':tab=self.TabGameCf(data)

        if tab=='': tab= False
        return tab

    #lấy thông tin danh sách mã giải
    def getDsMaGiai(self,data):
        DsMaGiai=''
        for item in data:
            if 'GT0' in item and data[item]=='true':
                DsMaGiai+=f"{item},"
        if DsMaGiai !='' :DsMaGiai=DsMaGiai[:-1]
        print(DsMaGiai)
        return DsMaGiai

    # Bảng lưu cấu hình đang chạy   
    def TabGameCf(self,data={},type='select',tab_name='TabGameCf'):
        #try:
            action=data['Action']
            # action='CREATE'
            query=""
            if action=='CREATE':
                query=f"""
                    CREATE TABLE {tab_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        MaSanChoi TEXT NOT NULL,
                        MaGiai TEXT  NULL,
                        HinhNen TEXT  NULL,
                        NenVideo TEXT  NULL,
                        NenVongQuay TEXT  NULL,
                        NgayTao DATETIME   NULL,
                        NgaySuaDoi DATETIME   NULL                                      
                    );
                """
                type='exec'
            elif action=='SELECT':#tra cứ tồm taị
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                query=f"SELECT * FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaGiai='{ma_giai}'"

            elif action=='SAVE_GAME':
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                hinh_nen = str(data.get('HinhNen', '')).replace("'", "''")
                nen_video = str(data.get('NenVideo', '')).replace("'", "''")
                nen_vong_quay = str(data.get('NenVongQuay', 'spin3.png')).replace("'", "''")
                if nen_vong_quay == '':
                    nen_vong_quay = 'spin3.png'
                query=f"""
                    DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaGiai='{ma_giai}' ;
                    INSERT INTO {tab_name}(MaSanChoi,MaGiai,HinhNen,NenVideo,NenVongQuay) 
                    VALUES('{ma_san_choi}','{ma_giai}','{hinh_nen}','{nen_video}','{nen_vong_quay}'); 
                """
                type='exec'

            elif action=='RESET_BY_SANCHOI':
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                query=f"DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' ;"
                type='exec'

            elif action=='LOAD_GAME_CF':
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                if ma_san_choi != '' and ma_giai != '':
                    query=f"""
                        SELECT * FROM {tab_name}
                        WHERE MaSanChoi='{ma_san_choi}' AND MaGiai='{ma_giai}'
                        LIMIT 1;
                    """
                else:
                    query=f"""
                        SELECT * FROM {tab_name} 
                        WHERE MaSanChoi=(SELECT MaSanChoi FROM TabSanChoi WHERE TrangThai=1)
                        AND MaGiai=(SELECT MaGiai FROM TabSanChoi WHERE TrangThai=1)
                        LIMIT 1;
                    """

            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)

  
    # Bảng cài đặt sân chơi
    def TabDsSanChoi(self,data={},type='select',tab_name='TabDsSanChoi'):
        #try:
            action=data['Action']
            # action='CREATE'
            query=""
            if action=='CREATE':
                query=f"""
                    CREATE TABLE {tab_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        MaSanChoi TEXT NOT NULL,
                        TenSanChoi TEXT  NULL,
                        TrangThai INTEGER  NULL                     
                    );
                """
                type='exec'
            elif action=='SAVE':
                # Escape single quotes để tránh SQL injection
                ma_san_choi = data.get('MaSanChoi', '').replace("'", "''")
                ten_san_choi = data.get('TenSanChoi', '').replace("'", "''")
                query=f"""
                    DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}';
                    INSERT INTO {tab_name}(MaSanChoi,TenSanChoi) VALUES('{ma_san_choi}','{ten_san_choi}'); 
                """
                type='exec'
            elif action=='SAVE_STATUS':#lưu trạng thái game 
                ma_san_choi = data.get('MaSanChoi', '').replace("'", "''")
                query=f"""UPDATE {tab_name} SET TrangThai=0 ;UPDATE {tab_name} SET TrangThai=1 WHERE MaSanChoi='{ma_san_choi}' """
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                ma_san_choi = data.get('MaSanChoi', '').replace("'", "''")
                query=f"""SELECT * FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' ;"""
            elif action=='EDIT':
                # Cập nhật thông tin sân chơi (mã và tên)
                record_id = int(data.get('id', 0))
                ma_san_choi = data.get('MaSanChoi', '').replace("'", "''")
                ten_san_choi = data.get('TenSanChoi', '').replace("'", "''")
                query=f"""UPDATE {tab_name} SET MaSanChoi='{ma_san_choi}', TenSanChoi='{ten_san_choi}' WHERE id={record_id} ;"""
                type='exec'
            elif action=='DELETE':
                record_id = int(data.get('id', 0))
                query=f"DELETE FROM {tab_name} WHERE id={record_id} ;"
                type='exec'           
            print(query)
            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)

    # Bảng danh sách giải thưởng
    def TabDsGiai(self, data={}, type='select', tab_name='TabDsGiai'):
        try:
            action = data.get('Action', '')
            query = ""
            
            if action == 'CREATE':
                query = f"""
                    CREATE TABLE {tab_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        MaGiai TEXT NOT NULL UNIQUE,
                        TenGiai TEXT NOT NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type = 'exec'
                
            elif action == 'SAVE':
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                ten_giai = str(data.get('TenGiai', '')).replace("'", "''")
                query = f"""
                    DELETE FROM {tab_name} WHERE MaGiai='{ma_giai}';
                    INSERT INTO {tab_name}(MaGiai, TenGiai) VALUES('{ma_giai}', '{ten_giai}');
                """
                type = 'exec'
                
            elif action == 'EDIT':
                record_id = int(data.get('id', 0))
                ten_giai = str(data.get('TenGiai', '')).replace("'", "''")
                query = f"""UPDATE {tab_name} SET TenGiai='{ten_giai}' WHERE id={record_id};"""
                type = 'exec'
                
            elif action == 'DELETE':
                record_id = int(data.get('id', 0))
                query = f"""DELETE FROM {tab_name} WHERE id={record_id};"""
                type = 'exec'
                
            elif action == 'ALL':
                query = f"""SELECT * FROM {tab_name} ORDER BY id;"""
                
            elif action == 'SELECT':
                record_id = int(data.get('id', 0))
                query = f"""SELECT * FROM {tab_name} WHERE id={record_id};"""
            
            if query == "":
                return []
            return self.QuerySqlite(query=query, type=type)
        except Exception as ex:
            print(f"❌ TabDsGiai Error: {str(ex)}")
            return [{'error': str(ex)}]

    # Bảng cài đặt sân chơi
    def TabSanChoi(self,data={},type='select',tab_name='TabSanChoi'):
        #try:
            action=data['Action']
            # action='CREATE'
            query=""
            if action=='CREATE':
                query=f"""
                    CREATE TABLE {tab_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        MaSanChoi TEXT NOT NULL,
                        MaGiai TEXT  NULL,
                        MaQuaTang TEXT  NULL,
                        SoLanQuay INTEGER  NULL,
                        SoLuongGiai INTEGER  NULL,
                        DangQuayLanThu INTEGER  NULL,
                        TrangThai INTEGER  NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type='exec'
            elif action=='INSERT':
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                query=f"""INSERT INTO {tab_name}(MaSanChoi,MaGiai) VALUES('{ma_san_choi}','{ma_giai}'); """
                type='exec'
            elif action=='UPDATE': 
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                record_id = int(data.get('id', 0))
                query=f"""UPDATE {tab_name} SET MaSanChoi='{ma_san_choi}',MaGiai='{ma_giai}' WHERE  id={record_id} """
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                record_id = int(data.get('id', 0))
                query=f"""SELECT * FROM {tab_name} WHERE id={record_id} ;"""
            elif action=='DELETE':
                record_id = int(data.get('id', 0))
                query=f"DELETE FROM {tab_name} WHERE id={record_id} ;"
                type='exec'
            elif action=='SAVE':
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                query=f"""DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' ;"""
                lst= {}
                for item in data:
                    if item not in lst:lst.update({item: data[item]})
                # print(lst)
                for item in lst:
                    if 'GT0' in item and lst[item]=='true':
                        MaQuaTang = lst.get(f"MaQuaTang_{item}", '')
                        SoLanQuay = lst.get(f"SoLanQuay_{item}", '0')
                        SoLuongGiai = lst.get(f"SoLuongGiai_{item}", '0')
                        query+=f"""INSERT INTO {tab_name}(MaSanChoi,MaGiai,MaQuaTang,SoLanQuay,SoLuongGiai) VALUES('{lst['MaSanChoi']}','{item}','{MaQuaTang}',{SoLanQuay},{SoLuongGiai}); """
                type='exec'
                # print(query)
            elif action=='VIEWCF':#Xem cấu hình
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                query=f"""
                    SELECT A.*,B.TenQuaTang,B.HinhAnh,
                        IFNULL(G.HinhNen,'') HinhNenGame,
                        IFNULL(G.NenVideo,'') NenVideoGame,
                        IFNULL(G.NenVongQuay,'spin3.png') NenVongQuayGame
                    FROM {tab_name} A
                    LEFT JOIN TabGiaiThuong B ON A.MaQuaTang=B.MaQuaTang
                    LEFT JOIN TabGameCf G ON A.MaSanChoi=G.MaSanChoi AND A.MaGiai=G.MaGiai
                    WHERE A.MaSanChoi='{ma_san_choi}';
                """
            elif action=="GET_CF":#Lấy thông tin cài đặt sân chơi hiện tại
                query=f"""
                        SELECT A.MaSanChoi,B.TenSanChoi,A.MaGiai,D.TenGiai,A.MaQuaTang,C.TenQuaTang,C.HinhAnh,C.GiaTien
                              ,A.SoLanQuay,A.SoLuongGiai,A.LanQuayThu,A.SoGiaiDaNhan,A.SoGiaiConLai,A.TrangThai
                        FROM TabSanChoi A 
                        LEFT JOIN TabDsSanChoi B ON A.MaSanChoi=B.MaSanChoi
                        INNER JOIN TabGiaiThuong C ON A.MaQuaTang=C.MaQuaTang
                        LEFT JOIN TabDsGiai D ON A.MaGiai=D.MaGiai
                        WHERE  B.TrangThai=1
                    """
                query=f"""SELECT A.MaSanChoi,B.TenSanChoi,A.MaGiai,D.TenGiai,A.MaQuaTang,C.TenQuaTang,C.HinhAnh,C.GiaTien
                                ,A.SoLanQuay,A.SoLuongGiai
                                ,(SELECT COUNT(*) FROM TabTrungThuong WHERE MaSanChoi=A.MaSanChoi AND MaGiai=A.MaGiai AND VangMat=0) SoGiaiDaNhan
                                ,(A.SoLuongGiai- (SELECT COUNT(*) FROM TabTrungThuong WHERE MaSanChoi=A.MaSanChoi AND MaGiai=A.MaGiai AND VangMat=0)) SoGiaiConLai
                                ,(SELECT COUNT(*) FROM TabTrungThuong WHERE MaSanChoi=A.MaSanChoi AND MaGiai=A.MaGiai AND VangMat=0)/(A.SoLuongGiai/A.SoLanQuay)+1 LanQuayThu
                                ,A.TrangThai,A.DangQuayLanThu
                        FROM TabSanChoi A 
                        LEFT JOIN TabDsSanChoi B ON A.MaSanChoi=B.MaSanChoi
                        INNER JOIN TabGiaiThuong C ON A.MaQuaTang=C.MaQuaTang
                        LEFT JOIN TabDsGiai D ON A.MaGiai=D.MaGiai
                        WHERE  B.TrangThai=1"""
                
            elif action=='ACTIVE_GIAI':#lưu game đang chơi giải nào của sân chơi nào
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                query=f"""
                    UPDATE {tab_name} SET TrangThai=0 ;
                    UPDATE {tab_name} SET TrangThai=1 WHERE  MaSanChoi='{ma_san_choi}' AND MaGiai='{ma_giai}' ;
                """
                type='exec'
            elif action=='SAVE_LANQUAY':
                dang_quay_lan_thu = str(data.get('DangQuayLanThu', '')).replace("'", "''")
                query=f""" UPDATE TabSanChoi Set DangQuayLanThu='{dang_quay_lan_thu}' WHERE TrangThai=1;"""
                type='exec'
            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)

    # Bảng giải thưởng
    def TabGiaiThuong(self,data={},type='select',tab_name='TabGiaiThuong'):
        #try:
            action=data['Action']
            # action='CREATE'
            query=""
            if action=='CREATE':
                query=f"""
                    CREATE TABLE {tab_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        MaQuaTang TEXT NOT NULL,
                        TenQuaTang TEXT  NULL,
                        HinhAnh TEXT  NULL,
                        GiaTien TEXT  NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type='exec'
            elif action=='SAVE':
                # Map field names from form (MaGiaiThuong → MaQuaTang, TenGiaiThuong → TenQuaTang)
                ma_qua_tang = str(data.get('MaGiaiThuong', data.get('MaQuaTang', ''))).replace("'", "''")
                ten_qua_tang = str(data.get('TenGiaiThuong', data.get('TenQuaTang', ''))).replace("'", "''")
                hinh_anh = str(data.get('HinhAnh', '')).replace("'", "''")
                gia_tien = str(data.get('GiaTien', '')).replace("'", "''")
                query=f"""
                    DELETE FROM {tab_name} WHERE MaQuaTang='{ma_qua_tang}' ;
                    INSERT INTO {tab_name}(MaQuaTang,TenQuaTang,HinhAnh,GiaTien) VALUES('{ma_qua_tang}','{ten_qua_tang}','{hinh_anh}','{gia_tien}'); 
                    """
                type='exec'
            
            elif action=='UPDATE_IMAGE':
                record_id = int(data.get('id', 0))
                hinh_anh = str(data.get('HinhAnh', '')).replace("'", "''")
                query=f"""UPDATE {tab_name} SET HinhAnh='{hinh_anh}' WHERE id={record_id} ;"""
                type='exec'
            
            elif action=='EDIT':
                # Map field names from form (MaGiaiThuong → MaQuaTang, TenGiaiThuong → TenQuaTang)
                ma_qua_tang = str(data.get('MaGiaiThuong', data.get('MaQuaTang', ''))).replace("'", "''")
                ten_qua_tang = str(data.get('TenGiaiThuong', data.get('TenQuaTang', ''))).replace("'", "''")
                query=f"""UPDATE {tab_name} SET TenQuaTang='{ten_qua_tang}' WHERE MaQuaTang='{ma_qua_tang}' ;"""
                type='exec'

            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                record_id = int(data.get('id', 0))
                query=f"""SELECT * FROM {tab_name} WHERE id={record_id} ;"""
            elif action=='DELETE':
                record_id = int(data.get('id', 0))
                query=f"DELETE FROM {tab_name} WHERE id={record_id} ;"
                type='exec'

            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)

    # Bảng Danh sách nhân viên quay thưởng
    def TabNguoiChoi(self,data={},upload={},type='select',tab_name='TabNguoiChoi'):
            
        #try:

            action=data['Action']
            # action='CREATE'
            query=""
            if action=='CREATE':
                query=f"""
                    CREATE TABLE {tab_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        MaNhanVien TEXT NOT NULL,
                        TenNhanVien TEXT  NULL,
                        MaDuThuong TEXT  NOT NULL,
                        DsMaGiai TEXT  NOT NULL,
                        MaSanChoi TEXT  NOT NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type='exec'
            elif action=='SEARCH_ALL':
                DsMaGiai=self.getDsMaGiai(data).split(',')
                col=['MaDuThuong','MaNhanVien','TenNhanVien','MaSanChoi']
                query=f"SELECT id FROM {tab_name} WHERE 1=1 "
                query2=""
                for item in col:
                    if item in data and data[item]!='':
                        query+=f" AND {item}='{data[item]}' "
                print(DsMaGiai)
                if len(DsMaGiai) >0:                    
                    for magiai in DsMaGiai:
                        if magiai =='': continue
                        query2+=f"""{query} AND DsMaGiai like '%{magiai}%' 
                        UNION """
                    
                if 'UNION' in query2:query= query2[0:-6]

                query=f"SELECT * FROM {tab_name} A INNER JOIN ({query}) B ON A.id=B.id"
                filter=data['Filter']
                if filter=='1':#Lấy danh sách còn lại chưa có quay thưởng
                    query=f"SELECT TB.* FROM ({query}) TB LEFT JOIN TabTrungThuong TT ON TB.MaNhanVien=TT.MaNhanVien WHERE TT.id is null "
                elif filter=='2':#Lấy danh sách đã quay thưởng rồi
                    query=f"SELECT TB.* FROM ({query}) TB INNER JOIN TabTrungThuong TT ON TB.MaNhanVien=TT.MaNhanVien"
                print(query)
            elif action=='GET_LIST_PLAY':#Lấy danh sách người chơi hiện tại theo sân chơi và giải bốc
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                # Lấy danh sách người chơi có giải này
                query=f"SELECT * FROM {tab_name} WHERE DsMaGiai like '%{ma_giai}%' AND MaSanChoi='{ma_san_choi}' "
                # Kiểm tra xem có cấu hình cho giải này không
                sql= self.QuerySqlite(f"SELECT * FROM TabSanChoi WHERE MaGiai='{ma_giai}' AND TrangThai=1")
                if len(sql)>0:
                    # Nếu có cấu hình giải, lấy những người chưa trúng thưởng
                    query=f"""SELECT TB.* 
                        FROM ({query}) TB 
                        LEFT JOIN TabTrungThuong TT ON TB.MaNhanVien=TT.MaNhanVien AND TB.MaSanChoi=TT.MaSanChoi AND TT.MaGiai='{ma_giai}'
                        WHERE TT.id is null 
                    """
                else:                    
                    query=f"""SELECT TB.* 
                            FROM ({query}) TB 
                            LEFT JOIN TabTrungThuong TT ON TB.MaNhanVien=TT.MaNhanVien AND TB.MaSanChoi=TT.MaSanChoi AND TT.MaGiai='{ma_giai}'
                            WHERE TT.id is null 
                        """
                

            elif action=='INSERT':
                DsMaGiai=self.getDsMaGiai(data)
                ma_nhan_vien = str(data.get('MaNhanVien', '')).replace("'", "''")
                ten_nhan_vien = str(data.get('TenNhanVien', '')).replace("'", "''")
                ma_du_thuong = str(data.get('MaDuThuong', '')).replace("'", "''")
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                query=f"""INSERT INTO {tab_name}(MaNhanVien,TenNhanVien,MaDuThuong,DsMaGiai,MaSanChoi) VALUES('{ma_nhan_vien}','{ten_nhan_vien}','{ma_du_thuong}','{DsMaGiai}','{ma_san_choi}'); """
                type='exec'
            elif action=='UPDATE': 
                ma_nhan_vien = str(data.get('MaNhanVien', '')).replace("'", "''")
                ten_nhan_vien = str(data.get('TenNhanVien', '')).replace("'", "''")
                ma_du_thuong = str(data.get('MaDuThuong', '')).replace("'", "''")
                ds_ma_giai = str(data.get('DsMaGiai', '')).replace("'", "''")
                record_id = int(data.get('id', 0))
                query=f"""UPDATE {tab_name} SET MaNhanVien='{ma_nhan_vien}',TenNhanVien='{ten_nhan_vien}',MaDuThuong='{ma_du_thuong}',DsMaGiai='{ds_ma_giai}' WHERE  id={record_id} """
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                record_id = int(data.get('id', 0))
                query=f"""SELECT * FROM {tab_name} WHERE id={record_id} ;"""
            elif action=='DELETE':
                record_id = int(data.get('id', 0))
                query=f"DELETE FROM {tab_name} WHERE id={record_id} ;"
                type='exec'

            elif action=='ADD_EMP':#thêm 1 thông tin
                DsMaGiai=self.getDsMaGiai(data)
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_nhan_vien = str(data.get('MaNhanVien', '')).replace("'", "''")
                ten_nhan_vien = str(data.get('TenNhanVien', '')).replace("'", "''")
                ma_du_thuong = str(data.get('MaDuThuong', '')).replace("'", "''")
                query=f"""
                    DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaNhanVien='{ma_nhan_vien}' ;
                    INSERT INTO {tab_name}(MaNhanVien,TenNhanVien,MaDuThuong,DsMaGiai,MaSanChoi) 
                    VALUES('{ma_nhan_vien}','{ten_nhan_vien}','{ma_du_thuong}','{DsMaGiai}','{ma_san_choi}');
                    """
                type='exec'
            elif action=='DEL_EMP':#Xóa 1 thông tin
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_nhan_vien_item = str(item.get('MaNhanVien', '')).replace("'", "''")
                query=f"DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaNhanVien='{ma_nhan_vien_item}';"
                type='exec'

            elif action=='RESET':#xóa toàn bộ người chơi trong 1 sân chơi
               ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
               query=f"DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}'; "
               type='exec'
            elif action=='CHECK_EXIST':#Kiểm tra dữ liệu trùng lăp
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_du_thuong = str(data.get('MaDuThuong', '')).replace("'", "''")
                ma_nhan_vien = str(data.get('MaNhanVien', '')).replace("'", "''")
                query1=f"""SELECT * FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaDuThuong='{ma_du_thuong}' ;"""
                query2=f"""SELECT * FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaNhanVien='{ma_nhan_vien}' ;"""
                check_emp=0
                check_ticket=0
                if len(self.QuerySqlite(query1))>0:check_ticket=1
                if len(self.QuerySqlite(query2))>0:check_emp=1
                return {
                    'check_emp':check_emp,
                    'check_ticket':check_ticket
                }
            
            #Thêm xóa danh sách từ excel
            elif 'EXCEL' in action:
                DsMaGiai=self.getDsMaGiai(data)
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                if  action=='ADD_EXCEL':#Thêm từ excel
                    for item in upload:
                        item_ma_nhan_vien = str(item.get('MaNhanVien', '')).replace("'", "''")
                        item_ten_nhan_vien = str(item.get('TenNhanVien', '')).replace("'", "''")
                        item_ma_du_thuong = str(item.get('MaDuThuong', '')).replace("'", "''")
                        query+=f"""
                            DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaNhanVien='{item_ma_nhan_vien}';
                            INSERT INTO {tab_name}(MaNhanVien,TenNhanVien,MaDuThuong,DsMaGiai,MaSanChoi) VALUES('{item_ma_nhan_vien}','{item_ten_nhan_vien}','{item_ma_du_thuong}','{DsMaGiai}','{ma_san_choi}'); 
                        """
                elif action=='DEL_EXCEL':#Xóa từ excel 
                    for item in upload:
                        item_ma_nhan_vien = str(item.get('MaNhanVien', '')).replace("'", "''")
                        query+=f"""DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaNhanVien='{item_ma_nhan_vien}'; """
                type='exec'

            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)


    # Bảng Danh sách nhân viên đã trúng và lấy giải
    def TabTrungThuong(self,data={},type='select',tab_name='TabTrungThuong'): 
        #try:
            action=data['Action']
            # action='CREATE'
            query=""
            if action=='CREATE':
                query=f"""
                    CREATE TABLE {tab_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        MaNhanVien TEXT NOT NULL,
                        MaDuThuong TEXT  NOT NULL,
                        MaGiai TEXT  NOT NULL,
                        MaSanChoi TEXT  NOT NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type='exec'
            elif action=='INSERT' or action=='SAVE':
                MaGiai=self.getDsMaGiai(data)
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                ma_nhan_vien = str(data.get('MaNhanVien', '')).replace("'", "''")
                ma_du_thuong = str(data.get('MaDuThuong', '')).replace("'", "''")
                query=f"""
                    DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' AND MaNhanVien='{ma_nhan_vien}';
                    INSERT INTO {tab_name}(MaNhanVien,MaDuThuong,MaGiai,MaSanChoi) VALUES('{ma_nhan_vien}','{ma_du_thuong}','{MaGiai}','{ma_san_choi}' ); 
                """
                type='exec'
            elif action=='UPDATE': 
                ma_nhan_vien = str(data.get('MaNhanVien', '')).replace("'", "''")
                ma_du_thuong = str(data.get('MaDuThuong', '')).replace("'", "''")
                ma_giai = str(data.get('MaGiai', '')).replace("'", "''")
                record_id = int(data.get('id', 0))
                query=f"""UPDATE {tab_name} SET MaNhanVien='{ma_nhan_vien}',MaDuThuong='{ma_du_thuong}',MaGiai='{ma_giai}' WHERE  id={record_id} ;"""
                type='exec'
            elif action=='ALL':
                query=f"""SELECT A.*,V.TenNguoiChoi FROM {tab_name} A LEFT JOIN TabNguoiChoi C ON A.MaNhanVien=C.MaNhanVien;"""
            elif action=='SELECT':
                record_id = int(data.get('id', 0))
                query=f"""SELECT * FROM {tab_name} WHERE id={record_id} ;"""
            elif action=='DELETE':
                record_id = int(data.get('id', 0))
                query=f"DELETE FROM {tab_name} WHERE id={record_id} ;"
              
                type='exec'
            elif action=='RESET':#xóa toàn bộ
                ma_san_choi = str(data.get('MaSanChoi', '')).replace("'", "''")
                query=f"DELETE FROM {tab_name} WHERE MaSanChoi='{ma_san_choi}' ;"#xóa dữ liệu
                query+=f"""UPDATE TabSanChoi SET DangQuayLanThu=1  ;"""#cập nhật lại số lần quay thuỏng
                type='exec'
            elif action=='GET_TICKET':#Lấy danh sách giai đã cấu hình
                return self.TabSanChoi({'Action':'VIEWCF','MaSanChoi':data['MaSanChoi']})
            elif action=='SEARCH':#Tìm kiếm thông tin
                col=['MaSanChoi','MaDuThuong','MaNhanVien','TenNhanVien']
                DsMaGiai=self.getDsMaGiai(data).split(',')       
                print(DsMaGiai)       
                query=f"SELECT id FROM {tab_name} WHERE 1=1 "

                for item in col:
                    if item in data and data[item]!='':
                        escaped_value = str(data[item]).replace("'", "''")
                        query+=f" AND {item}='{escaped_value}' "
                
                if len(DsMaGiai) >0:                    
                    for magiai in DsMaGiai:
                        if magiai=='':continue
                        escaped_magiai = str(magiai).replace("'", "''")
                        query=f"{query} AND MaGiai = '{escaped_magiai}' UNION"
                    
                if 'UNION' in query:query= query[0:-5]

                query=f"""
                    SELECT A.*,C.TenNhanVien FROM {tab_name} A 
                    LEFT JOIN TabNguoiChoi C ON A.MaNhanVien=C.MaNhanVien
                    INNER JOIN ({query}) B ON A.id=B.id;
                """
            elif action=='SET_VANGMAT':#Thiết lập vắng mắt
                #Thiết lập vắng mặt
                record_id = int(data.get('id', 0))
                query=f""" UPDATE {tab_name} SET VangMat=1 WHERE id={record_id} ;"""
                type='exec'
            elif action=='SAVE_TICKET_OK':#Lưu mã trúng thưởng
                ma_nhan_vien = str(data.get('MaNhanVien', '')).replace("'", "''")
                ma_du_thuong = str(data.get('MaDuThuong', '')).replace("'", "''")
                query=f"""
                    INSERT INTO {tab_name}(MaNhanVien,MaDuThuong,MaGiai,MaSanChoi) 
                    VALUES('{ma_nhan_vien}','{ma_du_thuong}'
                    ,(SELECT MaGiai FROM TabSanChoi WHERE TrangThai=1)
                    ,(SELECT MaSanChoi FROM TabSanChoi WHERE TrangThai=1)
                     );
                  
                """
                type='exec'
            elif action=='SAVE_LIST_TICKET_OK':#Lưu danh sách vé trúng thưởng
                # print(data)
                for item in data:
                    if 'Wincodes' in item:
                        ma_du_thuong = str(data[item]).replace("'", "''")
                        query+=f"""  
                            INSERT INTO {tab_name}(MaNhanVien,MaDuThuong,MaGiai,MaSanChoi) 
                                VALUES((SELECT  MaNhanVien FROM TabNguoiChoi WHERE MaDuThuong='{ma_du_thuong}' ORDER BY MaDuThuong DESC LIMIT 1),'{ma_du_thuong}'
                                ,(SELECT MaGiai FROM TabSanChoi WHERE TrangThai=1)
                                ,(SELECT MaSanChoi FROM TabSanChoi WHERE TrangThai=1)
                            );
                        """
                type='exec'
            elif action=='GET_TICKET_OK':#Lấy danh sách mã đã trúng giải của 1 sân chơi
                query=f"""
                    SELECT A.*,B.TenNhanVien,G.TenGiai
                    FROM {tab_name} A
                    LEFT JOIN TabNguoiChoi B ON A.MaNhanVien=B.MaNhanVien
                    LEFT JOIN TabDsGiai G ON A.MaGiai=G.MaGiai
                    WHERE A.MaSanChoi='{data['MaSanChoi']}' AND A.VangMat=0 ORDER BY id desc
                """
                query=f"""                    
                        SELECT DISTINCT TB.*,B.TenNhanVien,G.TenGiai
                        FROM
                        (SELECT A.* FROM TabTrungThuong A
                            WHERE 
                            A.MaSanChoi=(SELECT MaSanChoi From TabSanChoi WHERE TrangThai=1) 
                            AND A.MaGiai=(SELECT MaGiai From TabSanChoi WHERE TrangThai=1) 
                            AND A.VangMat=0 ORDER BY id desc
                        )TB
                        LEFT JOIN TabNguoiChoi B ON TB.MaNhanVien=B.MaNhanVien AND TB.MaSanChoi=TB.MaSanChoi
                        LEFT JOIN TabDsGiai G ON TB.MaGiai=G.MaGiai AND TB.MaSanChoi=TB.MaSanChoi
                """
                # print(query)
            elif action=='GET_TICKET_ACTIVE':#Lấy danh sách mã đã trúng giải của 1 sân chơi
                query=f"""
                    SELECT A.*,B.TenNhanVien,G.TenGiai
                    FROM {tab_name} A
                    LEFT JOIN TabNguoiChoi B ON A.MaNhanVien=B.MaNhanVien
                    LEFT JOIN TabDsGiai G ON A.MaGiai=G.MaGiai
                    WHERE A.MaSanChoi=(SELECT MaSanChoi From TabSanChoi WHERE TrangThai=1) AND A.MaGiai=(SELECT MaGiai From TabSanChoi WHERE TrangThai=1) AND A.VangMat=0 ORDER BY id desc
                """
                
            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)


    #tạo bảng ticket
    def TicketManager(self,data={},type='select',tab_name='TicketManager'):
        #try:
            action=data['Action']
            # action='CREATE'
            query=""
            if action=='CREATE':
                query=f"""
                    CREATE TABLE {tab_name} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Ticket TEXT NOT NULL,
                    Money TEXT  NULL,
                    Recipient TEXT NULL,
                    Status TEXT NULL,
                    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                """
            elif action=='INSERT':
                ticket = str(data.get('Ticket', '')).replace("'", "''")
                money = str(data.get('Money', '')).replace("'", "''")
                recipient = str(data.get('Recipient', '')).replace("'", "''")
                status = str(data.get('Status', '')).replace("'", "''")
                query=f"""INSERT INTO {tab_name}(Ticket,Money,Recipient,Status) VALUES('{ticket}','{money}','{recipient}','{status}'); """
                type='exec'
            elif action=='UPDATE': 
                ticket = str(data.get('Ticket', '')).replace("'", "''")
                money = str(data.get('Money', '')).replace("'", "''")
                recipient = str(data.get('Recipient', '')).replace("'", "''")
                status = str(data.get('Status', '')).replace("'", "''")
                record_id = int(data.get('id', 0))
                query=f"""UPDATE {tab_name} SET Ticket='{ticket}',Money='{money}',Recipient='{recipient}',Status='{status}' WHERE  id={record_id} """
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                record_id = int(data.get('id', 0))
                query=f"""SELECT * FROM {tab_name} WHERE id={record_id} ;"""
            elif action=='DELETE':
                record_id = int(data.get('id', 0))
                query=f"DELETE FROM {tab_name} WHERE id={record_id} ;"
                type='exec'

            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)

    #bảng danh sách giải và phần thưởng
    def ListAward(self,data,tab_name='ListAward'):
        action=data['Action']
        if action=='CREATE':
            query=f"""
                    CREATE TABLE {tab_name} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    AwardType TEXT NOT NULL,
                    AwardName TEXT  NULL,
                    Recipient TEXT NULL,
                    Status TEXT NULL,
                    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                """
    
    #Lấy danh sách bảng
    def getListTable(self):
        query=f"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"       
        return self.SelectSqlite(query)
    

_sqlt3=SQLITE3()
#tạo bảng 
# _sqlt3.TabSanChoi({'Action':'CREATE'})
# _sqlt3.TabGiaiThuong({'Action':'CREATE'})
# _sqlt3.TabNguoiChoi({'Action':'CREATE'})
# _sqlt3.TabTrungThuong({'Action':'CREATE'})
