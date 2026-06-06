from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
from sqlalchemy import create_engine
import os
import numpy as np

app = FastAPI()

# تنظیم CORS برای اتصال بدون مشکل به React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # در حالت تولید آدرس Vercel را اینجا بگذارید
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_FILE = os.path.join(BASE_DIR, "consultant-database.sqlite")
engine = create_engine(f"sqlite:///{SQLITE_FILE}")

# مسیر دریافت داده‌های جداول
@app.get("/{table_name}/{seasen}")
async def get_table_data(table_name: str, seasen: str):
    allowed_tables = ["tablea1403", "tablea1404"]
    allowed_seasen = ["befor", "monthly", "special", "after", "support"]

    if table_name not in allowed_tables:
        raise HTTPException(status_code=400, detail="نام جدول نامعتبر است")

    if seasen not in allowed_seasen:
        raise HTTPException(status_code=400, detail="مقدار seasen نامعتبر است")

    try:
        query = f"SELECT * FROM {table_name} WHERE type_s = :seasen"
        df = pd.read_sql(query, engine, params={"seasen": seasen})

        # تمیزکاری داده‌ها
        df = df.replace({np.nan: None})
        for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
            df[col] = df[col].astype(str)

        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# مسیر محاسبات صورت وضعیت
@app.get("/Billpage")
async def get_billpage():
    try:
        df = pd.read_sql("SELECT * FROM contractor_bill", engine)
        df = df.replace({np.nan: None})
        for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
            df[col] = df[col].astype(str)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# مسیر دانلود اکسل
@app.get("/download-excel")
async def download_excel():
    file_path = os.path.join(BASE_DIR, "a.xlsx")
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename="a.xlsx", media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    raise HTTPException(status_code=404, detail="فایل اکسل یافت نشد")

# اجرای برنامه با تنظیم پورت پویا برای سرور
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
#py -m uvicorn index:app --host 127.0.0.1 --port 5000 --reload

