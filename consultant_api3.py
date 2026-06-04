from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from sqlalchemy import create_engine
import os
import numpy as np
from flask import send_from_directory

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_FILE = os.path.join(BASE_DIR, "consultant-database.sqlite")
engine = create_engine(f"sqlite:///{SQLITE_FILE}")

@app.route("/<table_name>/<seasen>")
def get_table_data(table_name, seasen):
    allowed_tables = ["tablea1403", "tablea1404"]
    allowed_seasen = ["befor", "monthly", "special", "after", "support"]

    if table_name not in allowed_tables:
        return jsonify({"error": "نام جدول نامعتبر است"}), 400

    if seasen not in allowed_seasen:
        return jsonify({"error": "مقدار seasen نامعتبر است"}), 400

    query = f"SELECT * FROM {table_name} WHERE type_s = :seasen"
    df = pd.read_sql(query, engine, params={"seasen": seasen})

    # حذف NaN
    df = df.replace({np.nan: None})

    # فقط datetime → string شود
    for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
        df[col] = df[col].astype(str)

    # هیچ ستون عددی تبدیل به string نشود ❗❗❗
    return jsonify(df.to_dict(orient="records"))


# -----------  محاسبات صورت وضعیت پیمانکاران- ----------
@app.route("/Billpage")
def get_Billpage():
    df = pd.read_sql("SELECT * FROM contractor_bill", engine)

    df = df.replace({np.nan: None})

    for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
        df[col] = df[col].astype(str)

    return jsonify(df.to_dict(orient="records"))


#   ------------------------ excel download  -----------


@app.route("/download-excel")
def download_excel():
    return send_from_directory(BASE_DIR, "a.xlsx", as_attachment=True)


# ----------- اجرای برنامه -----------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
