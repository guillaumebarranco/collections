#!/usr/bin/env python
from pathlib import Path

try:
    from PIL import Image
except Exception as exc:  # pragma: no cover
    raise SystemExit(
        "Pillow est requis. Installe-le avec: python -m pip install pillow"
    ) from exc


MAX_SIZE_KB = 300
MIN_HEIGHT_PX = 400

FORMATS = {".jpg", ".jpeg", ".png", ".webp"}


def save_image(img: Image.Image, path: Path, fmt: str, quality: int | None) -> None:
    params: dict = {}
    if fmt in {"JPEG", "JPG"}:
        params["quality"] = quality or 85
        params["optimize"] = True
        params["progressive"] = True
        img = img.convert("RGB")
    elif fmt == "WEBP":
        params["quality"] = quality or 80
        params["method"] = 6
    elif fmt == "PNG":
        params["optimize"] = True
        params["compress_level"] = 9
    img.save(path, format=fmt, **params)


def optimize_image(path: Path) -> tuple[int, int]:
    before = path.stat().st_size
    with Image.open(path) as img:
        fmt = img.format or path.suffix.replace(".", "").upper()
        save_image(img, path, fmt, quality=85)
    after = path.stat().st_size

    if after > MAX_SIZE_KB * 1024:
        with Image.open(path) as img:
            width, height = img.size
            target_height = height
            while after > MAX_SIZE_KB * 1024 and target_height > MIN_HEIGHT_PX:
                target_height = max(MIN_HEIGHT_PX, int(target_height * 0.9))
                target_width = int(width * (target_height / height))
                resized = img.resize((target_width, target_height), Image.LANCZOS)
                save_image(resized, path, fmt, quality=82)
                after = path.stat().st_size
                width, height = target_width, target_height

    return before, after


def main() -> None:
    public_dir = Path(__file__).resolve().parents[1] / "public"
    if not public_dir.exists():
        raise SystemExit("Dossier public introuvable.")

    candidates: list[Path] = []
    for path in public_dir.rglob("*"):
        if not path.is_file():
            continue
        in_pictures = any(part.endswith("_pictures") for part in path.parts)
        in_badges = "badges" in path.parts
        if not (in_pictures or in_badges):
            continue
        if path.suffix.lower() not in FORMATS:
            continue
        if path.stat().st_size > MAX_SIZE_KB * 1024:
            candidates.append(path)

    candidates.sort(key=lambda p: p.stat().st_size, reverse=True)
    if not candidates:
        print("Aucune image > 500 Ko.")
        return

    print(f"Images à optimiser: {len(candidates)}")
    for path in candidates:
        before, after = optimize_image(path)
        print(f"{before/1024:.1f}KB -> {after/1024:.1f}KB\t{path}")


if __name__ == "__main__":
    main()
