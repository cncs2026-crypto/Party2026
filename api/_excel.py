import pandas as pd


def CsvToDt():
    # Đọc tệp CSV
    df = pd.read_csv('data.csv')

    # Hiển thị 5 dòng đầu tiên
    print(df.head())