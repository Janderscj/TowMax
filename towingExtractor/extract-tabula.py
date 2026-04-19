import tabula
import json
import os
import pandas as pd

def extract_with_tabula(pdf_path):
    print(f"Reading: {pdf_path}")

    # Extract all tables from all pages
    tables = tabula.read_pdf(
        pdf_path,
        pages="all",
        multiple_tables=True,
        lattice=True  # Try lattice first (grid-based)
    )

    print(f"Found {len(tables)} tables")

    os.makedirs("output_tabula", exist_ok=True)

    all_json = []

    for i, df in enumerate(tables):
        # Save CSV
        csv_path = f"output_tabula/table_{i}.csv"
        df.to_csv(csv_path, index=False)

        # Convert to JSON
        json_path = f"output_tabula/table_{i}.json"
        records = df.fillna("").astype(str).to_dict(orient="records")

        with open(json_path, "w") as f:
            json.dump(records, f, indent=2)

        print(f"Saved table {i} to {csv_path} and {json_path}")

        all_json.append(records)

    return all_json


if __name__ == "__main__":
    extract_with_tabula("samples/2022_Ford_Trailer_Towing_Guide.pdf")
