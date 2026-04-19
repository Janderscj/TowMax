import camelot
import os
import json
import re

# -----------------------------
# Cleaning helpers
# -----------------------------

def clean_value(v):
    """Strip whitespace, remove footnotes, convert to int when possible."""
    if not v or not isinstance(v, str):
        return None

    v = v.strip()

    # Remove footnote numbers like 18500² or 18500 2
    v = re.sub(r"[^0-9,.-]", "", v)

    # Remove commas
    v = v.replace(",", "")

    if v.isdigit():
        return int(v)

    return v if v else None


def split_multiline(cell):
    """Split a multi-line cell into a list of cleaned values."""
    if not cell or not isinstance(cell, str):
        return []
    parts = [clean_value(x) for x in cell.split("\n") if clean_value(x)]
    return parts


# -----------------------------
# Engine block parser
# -----------------------------

def parse_engine_block(cell):
    """
    Parse the left column:
    Engine
    Axle Ratio
    GCWR values...
    Next Axle Ratio
    GCWR values...
    """
    lines = split_multiline(cell)

    if not lines:
        return []

    engine = lines[0]  # First line is engine name
    blocks = []
    current_ratio = None
    current_gcwr = []

    for item in lines[1:]:
        if isinstance(item, str) and "." in item:  # axle ratio like "3.55"
            # Save previous block
            if current_ratio:
                blocks.append({
                    "engine": engine,
                    "axleRatio": current_ratio,
                    "gcwr": current_gcwr
                })
            current_ratio = item
            current_gcwr = []
        else:
            # GCWR value
            current_gcwr.append(item)

    # Save last block
    if current_ratio:
        blocks.append({
            "engine": engine,
            "axleRatio": current_ratio,
            "gcwr": current_gcwr
        })

    return blocks


# -----------------------------
# Table normalizer
# -----------------------------

def normalize_table(json_rows):
    """Convert the raw Camelot JSON rows into structured towing data."""
    # Remove blank rows
    rows = [row for row in json_rows if any(row.values())]

    # Header row
    header = rows[0]

    # Extract drive + wheelbase mapping from header column 1
    # SUPERCREW®
    # 4x2
    # 4x4
    # 145.4
    # 157.2
    # 145.4
    # 157.2
    header_text = header["1"]
    header_lines = [x.strip() for x in header_text.split("\n") if x.strip()]

    # Hard-coded mapping for this table structure
    drive_map = ["4x2", "4x2", "4x4", "4x4"]
    wb_map = ["145.4", "157.2", "145.4", "157.2"]

    # Data rows (skip header)
    data_rows = rows[1:]

    # Parse engine block
    engine_blocks = parse_engine_block(data_rows[0]["0"])

    # Parse trailer weight columns
    col1 = split_multiline(data_rows[0]["1"])
    col2 = split_multiline(data_rows[0]["2"])
    col4 = split_multiline(data_rows[0]["4"])

    # Combine columns (Camelot sometimes splits them)
    trailer_weights = []

    for i in range(4):
        val = None
        if i < len(col1): val = col1[i]
        if not val and i < len(col2): val = col2[i]
        if not val and i < len(col4): val = col4[i]
        trailer_weights.append(val)

    # Attach configs to each axle ratio block
    for block in engine_blocks:
        configs = []
        for i in range(4):
            configs.append({
                "drive": drive_map[i],
                "wheelbase": wb_map[i],
                "maxTow": trailer_weights[i]
            })
        block["configs"] = configs

    return engine_blocks


# -----------------------------
# Main extractor
# -----------------------------

def extract_tables(pdf_path):
    print(f"Reading: {pdf_path}")
    tables = camelot.read_pdf(pdf_path, pages='all')

    print(f"Found {len(tables)} tables")

    os.makedirs("output", exist_ok=True)

    normalized_output = []

    for i, table in enumerate(tables):
        # Save raw CSV
        csv_path = f"output/table_{i}.csv"
        table.df.to_csv(csv_path, index=False)

        # Save raw JSON
        json_path = f"output/table_{i}.json"
        raw_json = table.df.to_dict(orient="records")
        with open(json_path, "w") as f:
            json.dump(raw_json, f, indent=2)

        print(f"Saved table {i} to {csv_path} and {json_path}")

        # Try normalizing (only works on towing tables)
        try:
            cleaned = normalize_table(raw_json)
            if cleaned:
                normalized_output.extend(cleaned)
        except Exception:
            pass  # Not all tables are towing tables

    # Save final normalized dataset
    with open("output/normalized.json", "w") as f:
        json.dump(normalized_output, f, indent=2)

    print("\nNormalization complete.")
    print("Output saved to output/normalized.json")

if __name__ == "__main__":
    extract_tables("samples/2022_Ford_Trailer_Towing_Guide.pdf")
