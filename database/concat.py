import pandas as pd
import glob
from pathlib import Path

DATA_DIR = Path("C:/Sully/fdb/database")
full_path = str(DATA_DIR)
all_files = glob.glob(full_path + "/*.csv")
df = pd.concat((pd.read_csv(f) for f in all_files), ignore_index=True)

df.to_csv("combined_foods.csv", index = False)
