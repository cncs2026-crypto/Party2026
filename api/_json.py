import json


def read_json(file_path):
    # Đường dẫn tới file JSON
    # file_path = "data.json"
    # Đọc nội dung file JSON
    data=[]
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)  # Đọc và chuyển đổi dữ liệu từ JSON thành dict
            print("Nội dung file JSON:")
            #print(json.dumps(data, indent=4, ensure_ascii=False))  # Hiển thị nội dung với format đẹp mắt
    except FileNotFoundError:
        print(f"Không tìm thấy file: {file_path}")
    except json.JSONDecodeError:
        print("File không phải là JSON hợp lệ.")
    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")

    return data


