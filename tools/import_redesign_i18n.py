"""Builds the redesign pages' translations from the designer's dictionaries.

Reads redesign/i18n/tr1.py ... tr12.py (rows of (en, fr, es, zh, ja, ko); later
files win, matching redesign/scripts/build_i18n.py) and writes one JSON file
per locale to src/pages/redesign/i18n/<locale>.json, keyed by the English text.

Keys starting with "#" are rich blocks: their value is a list of text
segments, one per text node of the English markup (see useTx().seg).

Run after changing a tr*.py file:
    python3 tools/import_redesign_i18n.py
"""
import importlib.util
import json
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.join(ROOT, "redesign", "i18n")
OUT = os.path.join(ROOT, "src", "pages", "redesign", "i18n")
LANGS = ["fr", "es", "zh", "ja", "ko"]


def load(name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(SRC, name + ".py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.T


rows = [r for i in range(1, 13) for r in load(f"tr{i}")]
full = {lang: {} for lang in LANGS}
for row in rows:
    assert len(row) == 6, (row[0], len(row))
    for i, lang in enumerate(LANGS):
        value = row[i + 1]
        if isinstance(value, dict):
            value = {str(k): v for k, v in value.items()}
        full[lang][row[0]] = value

os.makedirs(OUT, exist_ok=True)
for lang in LANGS:
    path = os.path.join(OUT, lang + ".json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(full[lang], f, ensure_ascii=False, indent=0, sort_keys=True)
        f.write("\n")
    print(lang, len(full[lang]), "keys")
