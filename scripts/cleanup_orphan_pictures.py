#!/usr/bin/env python
"""
Supprime les images dans public/*_pictures qui ne sont référencées par aucun
fichier base sous src/app/utils/entities.
"""
from pathlib import Path
import re
import sys

# Racine du projet (parent du dossier scripts)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENTITIES_DIR = PROJECT_ROOT / "src" / "app" / "utils" / "entities"
PUBLIC_DIR = PROJECT_ROOT / "public"

# Regex: capture (folder_name, filename). Gérer les deux types de guillemets pour que
# les noms avec apostrophe (ex: "JoJo's_Bizarre_Adventure.png") soient bien capturés.
PICTURES_PATH_RE_SINGLE = re.compile(
    r"'/?([a-z]+_pictures)/([^']+)'",  # chaîne entre simples quotes
    re.IGNORECASE,
)
PICTURES_PATH_RE_DOUBLE = re.compile(
    r'"/?([a-z]+_pictures)/([^"]+)"',  # chaîne entre double quotes (filename peut contenir ')
    re.IGNORECASE,
)


def collect_referenced_pictures() -> dict[str, set[str]]:
    """Parcourt tous les .ts sous entities et collecte les chemins *_pictures référencés."""
    referenced: dict[str, set[str]] = {}
    for ts_file in ENTITIES_DIR.rglob("*.ts"):
        try:
            text = ts_file.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            print(f"Warning: could not read {ts_file}: {e}", file=sys.stderr)
            continue
        for re_obj in (PICTURES_PATH_RE_SINGLE, PICTURES_PATH_RE_DOUBLE):
            for m in re_obj.finditer(text):
                folder, filename = m.group(1), m.group(2)
                if folder not in referenced:
                    referenced[folder] = set()
                referenced[folder].add(filename)
    return referenced


def main() -> None:
    if not ENTITIES_DIR.is_dir():
        raise SystemExit(f"Entities dir not found: {ENTITIES_DIR}")
    if not PUBLIC_DIR.is_dir():
        raise SystemExit(f"Public dir not found: {PUBLIC_DIR}")

    referenced = collect_referenced_pictures()

    # Sous-dossiers public qui se terminent par _pictures
    picture_dirs = [
        d for d in PUBLIC_DIR.iterdir()
        if d.is_dir() and d.name.endswith("_pictures")
    ]

    deleted_count = 0
    for folder_path in sorted(picture_dirs):
        folder_name = folder_path.name
        used = referenced.get(folder_name, set())
        all_files = [f for f in folder_path.iterdir() if f.is_file()]
        for f in all_files:
            if f.name not in used:
                try:
                    f.unlink()
                    deleted_count += 1
                    print(f"Supprimé: {folder_name}/{f.name}")
                except Exception as e:
                    print(f"Erreur suppression {f}: {e}", file=sys.stderr)

    print(f"\nTotal: {deleted_count} image(s) orpheline(s) supprimée(s).")


if __name__ == "__main__":
    main()
