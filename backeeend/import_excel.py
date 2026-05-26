from sqlalchemy import create_engine
from services.preprocess import preprocess_data
import pandas as pd

engine = create_engine("sqlite:///mydatabase.db")

df = pd.read_excel("../data/Parfume.xlsx")
df = preprocess_data(df)
df.drop(["No"], axis=1, inplace=True)
df.reset_index(inplace=True)
df.rename(columns={"index":"id"}, inplace=True)

df.to_sql(
    name="perfumes",
    con=engine,
    if_exists="replace",
    index=False,
)

print("Import berhasil")
