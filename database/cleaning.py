from __future__ import annotations
from pathlib import Path
import re
import pandas as pd

DATASETS_DIR = Path("fdb/datasets")
OUT_DIR = Path("fdb/database")
OUT_DIR.mkdir(parents=True, exist_ok=True)

FILE_NAMES = [
    "nutrition.xlsx"
]

KJ_TO_KCAL = 1 / 4.184


# -------------------------
# helpers
# -------------------------
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


def read_csv_robust(path: Path) -> pd.DataFrame:
    for enc in ("utf-8", "utf-8-sig", "cp1252", "latin1"):
        try:
            return pd.read_csv(path, encoding=enc)
        except UnicodeDecodeError:
            continue
    return pd.read_csv(path, encoding="utf-8", errors="replace")


def choose_sheet(path: Path) -> str | int:
    xls = pd.ExcelFile(path, engine="openpyxl")
    names = xls.sheet_names
    scored: list[tuple[int, str]] = []
    for s in names:
        ns = norm(s)
        score = 0
        if "per 100" in ns or "100 g" in ns or "100g" in ns:
            score += 5
        if "solids" in ns or "liquids" in ns:
            score += 2
        if "content" in ns:
            score -= 2
        scored.append((score, s))
    scored.sort(reverse=True, key=lambda x: x[0])
    return scored[0][1] if scored else 0


def find_header_row_excel(path: Path, sheet_name: str, scan_rows: int = 50) -> int:
    preview = pd.read_excel(path, sheet_name=sheet_name, engine="openpyxl", header=None, nrows=scan_rows)

    # Look for the row that contains a strong signal like "food name"
    needle = "food name"
    for r in range(preview.shape[0]):
        row_vals = [norm(v) for v in preview.iloc[r].tolist()]
        if any(needle in v for v in row_vals):
            return r

    # Otherwise score by number of nutrition-related tokens
    targets = ["food", "name", "energy", "cal", "protein", "fat", "carb", "fiber", "fibre"]
    best_r, best_score = 0, -1
    for r in range(preview.shape[0]):
        text = " | ".join(norm(v) for v in preview.iloc[r].tolist())
        score = sum(1 for t in targets if t in text)
        if score > best_score:
            best_score = score
            best_r = r
    return best_r


def find_col_any(df: pd.DataFrame, keyword_sets: list[list[str]]) -> str | None:
    """
    keyword_sets: e.g. [["food", "name"], ["product", "name"]]
    Returns first column matching ANY keyword set where ALL keywords are substrings of the column name.
    """
    cols = list(df.columns)
    ncols = [norm(c) for c in cols]

    for keywords in keyword_sets:
        for col, ncol in zip(cols, ncols):
            if all(k in ncol for k in keywords):
                return col
    return None


# -------------------------
# column finders
# -------------------------
def find_food_name_col(df: pd.DataFrame) -> str | None:
    return find_col_any(df, [
        ["food name"],
        ["food", "name"],
        ["food"],
        ["product", "name"],
        ["item", "name"],
        ["description"],
        ["name"],
    ])


def energy_to_kcal_series(df: pd.DataFrame) -> pd.Series | None:
    # Already kcal/calories?
    kcal_col = find_col_any(df, [
        ["calories"],
        ["kcal"],
        ["energy", "kcal"],
        ["energy", "(kcal)"],
    ])
    if kcal_col:
        return df[kcal_col].map(to_num)

    # kJ -> kcal
    kj_col = find_col_any(df, [
        ["energy", "kj"],
        ["energy", "(kj)"],
        # AFCD-style exact labels
        ["energy", "with", "dietary", "fibre"],
        ["energy", "without", "dietary", "fibre"],
        ["energy", "with", "dietary", "fiber"],
        ["energy", "without", "dietary", "fiber"],
    ])
    if kj_col:
        return df[kj_col].map(to_num).map(lambda v: v * KJ_TO_KCAL if v is not None else None)

    return None


def protein_series(df: pd.DataFrame) -> pd.Series | None:
    col = find_col_any(df, [["protein"]])
    return df[col].map(to_num) if col else None


def fat_series(df: pd.DataFrame) -> pd.Series | None:
    col = find_col_any(df, [
        ["fat", "total"],
        ["total", "fat"],
        ["fat"],
        ["lipid"],
    ])
    return df[col].map(to_num) if col else None


def fibre_series(df: pd.DataFrame) -> pd.Series | None:
    col = find_col_any(df, [
        ["total", "dietary", "fibre"],
        ["total", "dietary", "fiber"],
        ["dietary", "fibre"],
        ["dietary", "fiber"],
        ["fibre"],
        ["fiber"],
    ])
    return df[col].map(to_num) if col else None


def carbs_series(df: pd.DataFrame) -> pd.Series | None:
    # Try direct carbs columns
    col = find_col_any(df, [
        ["carbohydrate", "by", "difference"],
        ["available", "carbohydrate"],
        ["total", "carbohydrate"],
        ["carbohydrate"],
        ["carbohydrates"],
        ["carbs"],
        ["carb"],
    ])
    if col:
        return df[col].map(to_num)

    # Some datasets use "Sugars" but that is NOT total carbs; don't substitute.
    return None


# -------------------------
# reading
# -------------------------
def read_any(path: Path) -> tuple[pd.DataFrame, dict]:
    meta = {"file": path.name, "sheet": None, "header_row": None}
    suf = path.suffix.lower()

    if suf in (".xlsx", ".xls"):
        sheet = choose_sheet(path)
        header_row = find_header_row_excel(path, sheet)
        meta["sheet"] = sheet
        meta["header_row"] = header_row
        df = pd.read_excel(path, sheet_name=sheet, engine="openpyxl", header=header_row)
        return df, meta

    if suf == ".csv":
        df = read_csv_robust(path)
        return df, meta

    raise ValueError(f"Unsupported file type: {path}")


# -------------------------
# standardize
# -------------------------
def standardize_file(path: Path) -> Path:
    df, meta = read_any(path)

    food_col = find_food_name_col(df)
    if not food_col:
        raise RuntimeError(f"Could not find a food/name column. Columns sample: {df.columns.tolist()[:30]}")

    kcal = energy_to_kcal_series(df)
    if kcal is None:
        raise RuntimeError("Could not find calories/kcal or energy(kJ).")

    out = pd.DataFrame({
        "food_name": df[food_col].astype(str).str.strip(),
        "calories": kcal,
        "protein_g": protein_series(df),
        "fat_g": fat_series(df),
        "carbs_g": carbs_series(df),
        "fibre_g": fibre_series(df),
    })

    # Clean
    out["food_name"] = out["food_name"].str.replace(r"\s+", " ", regex=True)
    out = out[out["food_name"].notna() & (out["food_name"] != "")]
    out = out[out[["calories", "protein_g", "fat_g", "carbs_g", "fibre_g"]].notna().any(axis=1)]

    out_path = OUT_DIR / f"{path.stem}_standardized.csv"
    out.to_csv(out_path, index=False)

    print(f"\n✅ {path.name}")
    if meta["sheet"] is not None:
        print(f"   sheet={meta['sheet']!r}, header_row={meta['header_row']} (0-index)")
    print(f"   picked food column: {food_col!r}")
    print(f"   -> {out_path}")
    print(out.head(5))

    return out_path


def main():
    for name in FILE_NAMES:
        p = DATASETS_DIR / name
        if not p.exists():
            print(f"⚠️ Missing: {p}")
            continue
        try:
            standardize_file(p)
        except Exception as e:
            print(f"\n❌ Failed on {p.name}: {e}")


if __name__ == "__main__":
    main()
