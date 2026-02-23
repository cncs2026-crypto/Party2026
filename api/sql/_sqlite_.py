import sqlite3

from pathlib import Path

class SQLITE3(object):
    def __init__(self):
        self.db_name='D:/Party2025/api/sql/db.sqlite3'

    def dict_factory(self,cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

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
            return True
        except Exception as ex:
            print(query)
            print(str(ex))
            return False

    def QuerySqlite(self,query,type='select'):
        if type=='select':
            return self.SelectSqlite(query)
        else: return self.ExcuteSqlite(query)

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
                query=f"""INSERT INTO {tab_name}(Ticket,Money,Recipient,Status) VALUES('{data['Ticket']}','{data['Money']}','{data['Recipient']}','{data['Status']}'); """
                type='exec'
            elif action=='UPDATE': 
                query=f"""UPDATE {tab_name} SET Ticket='{data['Ticket']}',Money='{data['Money']}',Recipient='{data['Recipient']}',Status='{data['Status']}' WHERE  id={data['id']} """
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                query=f"""SELECT * FROM {tab_name} WHERE id={data['id']} ;"""
            elif action=='DELETE':
                query=f"DELETE FROM {tab_name} WHERE id={data['id']} ;"
                type='exec'

            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)

    # Bảng giải thưởng
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
                        TenSanChoi TEXT  NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type='exec'
            elif action=='INSERT':
                query=f"""INSERT INTO {tab_name}(MaSanChoi,TenSanChoi) VALUES('{data['MaSanChoi']}','{data['TenSanChoi']}'); """
                type='exec'
            elif action=='UPDATE': 
                query=f"""UPDATE {tab_name} SET MaSanChoi='{data['MaSanChoi']}',TenSanChoi='{data['TenSanChoi']}' WHERE  id={data['id']} """
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                query=f"""SELECT * FROM {tab_name} WHERE id={data['id']} ;"""
            elif action=='DELETE':
                query=f"DELETE FROM {tab_name} WHERE id={data['id']} ;"
                type='exec'

            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)

    # Bảng Sân Chơi
    def TabGiaiThuong(self,data={},type='select',tab_name='TabGiaiThuong'):
        #try:
            action=data['Action']
            # action='CREATE'
            query=""
            if action=='CREATE':
                query=f"""
                    CREATE TABLE {tab_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        MaGiai TEXT NOT NULL,
                        TenGiai TEXT  NULL,
                        QuaTang TEXT  NULL,
                        GiaTien TEXT  NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type='exec'
            elif action=='INSERT':
                query=f"""INSERT INTO {tab_name}(MaGiai,TenGiai,QuaTang,GiaTien) VALUES('{data['MaGiai']}','{data['TenGiai']}','{data['QuaTang']}','{data['GiaTien']}'); """
                type='exec'
            elif action=='UPDATE': 
                query=f"""UPDATE {tab_name} SET MaGiai='{data['MaGiai']}',TenGiai='{data['TenGiai']}',QuaTang='{data['QuaTang']}',GiaTien='{data['GiaTien']}' WHERE  id={data['id']} """
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                query=f"""SELECT * FROM {tab_name} WHERE id={data['id']} ;"""
            elif action=='DELETE':
                query=f"DELETE FROM {tab_name} WHERE id={data['id']} ;"
                type='exec'

            if query=="": return []
            return self.QuerySqlite(query=query,type=type)
        # except Exception as ex:
        #     return str(ex)

    # Bảng Danh sách nhân viên quay thưởng
    def TabNguoiChoi(self,data={},type='select',tab_name='TabNguoiChoi'):
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
                        MaDuThuong TEXT  NULL,
                        DsMaGiai TEXT  NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type='exec'
            elif action=='INSERT':
                query=f"""INSERT INTO {tab_name}(MaNhanVien,TenNhanVien,MaDuThuong,DsMaGiai) VALUES('{data['MaNhanVien']}','{data['TenNhanVien']}','{data['MaDuThuong']}','{data['DsMaGiai']}'); """
                type='exec'
            elif action=='UPDATE': 
                query=f"""UPDATE {tab_name} SET MaNhanVien='{data['MaNhanVien']}',TenNhanVien='{data['TenNhanVien']}',MaDuThuong='{data['MaDuThuong']}',DsMaGiai='{data['DsMaGiai']}' WHERE  id={data['id']} """
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                query=f"""SELECT * FROM {tab_name} WHERE id={data['id']} ;"""
            elif action=='DELETE':
                query=f"DELETE FROM {tab_name} WHERE id={data['id']} ;"
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
                        MaDuThuong TEXT  NULL,
                        MaGiai TEXT  NULL,
                        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """
                type='exec'
            elif action=='INSERT':
                query=f"""INSERT INTO {tab_name}(MaNhanVien,MaDuThuong,MaGiai) VALUES('{data['MaNhanVien']}','{data['TenNhanVien']}','{data['MaDuThuong']}'); """
                type='exec'
            elif action=='UPDATE': 
                query=f"""UPDATE {tab_name} SET MaNhanVien='{data['MaNhanVien']}',MaDuThuong='{data['MaDuThuong']}',MaGiai='{data['MaGiai']}' WHERE  id={data['id']} ;"""
                type='exec'
            elif action=='ALL':
                query=f"""SELECT * FROM {tab_name} ;"""
            elif action=='SELECT':
                query=f"""SELECT * FROM {tab_name} WHERE id={data['id']} ;"""
            elif action=='DELETE':
                query=f"DELETE FROM {tab_name} WHERE id={data['id']} ;"
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
_sqlt3.TabSanChoi({'Action':'CREATE'})
_sqlt3.TabGiaiThuong({'Action':'CREATE'})
_sqlt3.TabNguoiChoi({'Action':'CREATE'})
_sqlt3.TabTrungThuong({'Action':'CREATE'})
