"""
Extract GloPrSM zip and copy the IJ_QFL rasters to a flat dir for
sand_predicted.py to consume.
"""

import sys
import zipfile
from pathlib import Path

import shutil

ZIP_PATH = Path("data/sand/glopsrm/GloPrSM_v1.0.0.zip")
EXTRACT_DIR = Path("data/sand/glopsrm/unpacked")
TARGET_DIR = Path("data/sand/glopsrm/IJ_QFL")


def main():
    if not ZIP_PATH.exists():
        print(f"zip not found: {ZIP_PATH}", file=sys.stderr)
        sys.exit(1)

    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"opening {ZIP_PATH} ({ZIP_PATH.stat().st_size/1e9:.2f} GB)")
    with zipfile.ZipFile(ZIP_PATH) as z:
        names = z.namelist()
        print(f"archive contains {len(names)} entries")

        # Filter to IJ_QFL rasters only (saves ~1GB of other schemes)
        ij_entries = [n for n in names if "/IJ_QFL/" in n.replace("\\", "/") and n.lower().endswith(".tif")]
        if not ij_entries:
            # Fall back: show structure so we can adjust
            print("No IJ_QFL/*.tif found. Top-level entries:")
            top = sorted({n.split("/", 1)[0] for n in names})
            for t in top[:20]:
                print(f"  {t}")
            print("\nSample .tif paths:")
            for n in names:
                if n.lower().endswith(".tif"):
                    print(f"  {n}")
                    if len([1 for x in names if x.lower().endswith(".tif")]) > 20:
                        break
            sys.exit(2)

        print(f"extracting {len(ij_entries)} IJ_QFL rasters")
        for name in ij_entries:
            z.extract(name, EXTRACT_DIR)
            print(f"  + {name}")

    # Flatten into TARGET_DIR
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    for src in EXTRACT_DIR.rglob("*.tif"):
        dst = TARGET_DIR / src.name
        shutil.copy2(src, dst)
        print(f"  flattened → {dst}")

    print(f"\nIJ_QFL raster dir: {TARGET_DIR}")
    print("files:")
    for f in sorted(TARGET_DIR.iterdir()):
        print(f"  {f.name} ({f.stat().st_size/1e6:.1f} MB)")


if __name__ == "__main__":
    main()
