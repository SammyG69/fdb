# clean_this_file.py
# For files like your screenshot: columns are ingr, id, cal/g, fat(g), carb(g), protein(g)
# Output: food_name, calories, fat_g, protein_g, carbs_g (optionally fibre_g if it exists)

from pathlib import Path
import re
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[2]
IN_PATH = BASE_DIR / "fdb" / "datasets" / "nutrition5k_dataset_metadata_ingredients_metadata.csv"
OUT_PATH = BASE_DIR / "fdb" / "database" / "nutrition5k_ingredients_standardized.csv"
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

def norm(s: str) -> str:
    s = str(s).strip().lower()
    s = re.sub(r"\s+", " ", s)
    return s

def to_num(x):
    if pd.isna(x):
        return None
    if isinstance(x, (int, float)):
        return float(x)
    s = str(x).strip().replace(",", "")
    s = re.sub(r"[^0-9.\-]", "", s)
    if s in ("", ".", "-", "-."):
        return None
    try:
        return float(s)
    except ValueError:
        return None

def find_col_any(df: pd.DataFrame, keyword_sets: list[list[str]]) -> str | None:
    cols = list(df.columns)
    ncols = [norm(c) for c in cols]
    for keys in keyword_sets:
        for col, ncol in zip(cols, ncols):
            if all(k in ncol for k in keys):
                return col
    return None

# --- read ---
df = pd.read_csv(IN_PATH)

# --- map columns ---
name_col = find_col_any(df, [["ingr"], ["ingredient"], ["name"]])
cal_col  = find_col_any(df, [["cal/g"], ["cal"], ["kcal"], ["calories"]])
fat_col  = find_col_any(df, [["fat(g)"], ["fat"]])
carb_col = find_col_any(df, [["carb(g)"], ["carb"], ["carbs"], ["carbohydrate"]])
prot_col = find_col_any(df, [["protein(g)"], ["protein"]])
fibre_col = find_col_any(df, [["fibre"], ["fiber"]])  # may not exist

if not name_col:
    raise RuntimeError(f"Couldn't find ingredient/name column. Columns: {df.columns.tolist()}")
if not cal_col:
    raise RuntimeError(f"Couldn't find calories column. Columns: {df.columns.tolist()}")

# IMPORTANT:
# Your file appears to be "per gram" (cal/g etc). Convert to per 100g.
scale = 100.0

out = pd.DataFrame({
    "food_name": df[name_col].astype(str).str.strip(),
    "calories": df[cal_col].map(to_num).map(lambda v: v * scale if v is not None else None),
    "fat_g": df[fat_col].map(to_num).map(lambda v: v * scale if v is not None else None) if fat_col else None,
    "protein_g": df[prot_col].map(to_num).map(lambda v: v * scale if v is not None else None) if prot_col else None,
    "carbs_g": df[carb_col].map(to_num).map(lambda v: v * scale if v is not None else None) if carb_col else None,
})

if fibre_col:
    out["fibre_g"] = df[fibre_col].map(to_num).map(lambda v: v * scale if v is not None else None)
else:
    out["fibre_g"] = 0.0

# clean
out["food_name"] = out["food_name"].str.replace(r"\s+", " ", regex=True)
out = out[out["food_name"].notna() & (out["food_name"] != "")]
out = out[out[["calories", "fat_g", "protein_g", "carbs_g"]].notna().any(axis=1)]

out.to_csv(OUT_PATH, index=False)
print(f"✅ Saved: {OUT_PATH.resolve()}")
print(out.head(10))
