import json
import os
import re
from collections import Counter

import frontmatter
from rich.box import SIMPLE_HEAD
from rich.console import Console
from rich.table import Table
from rich.text import Text

directory = "../tir-p/bauhinian/words/"
lexicon = []
for word in os.listdir(directory):
    with open(os.path.join(directory, word), "r", encoding="utf-8") as file:
        data = frontmatter.load(file)
    lexicon.append(
        {
            "name": os.path.splitext(word)[0],
            "pos": data["pos"],
            "def": data["def"],
            "bh": data["bauhinian"],
        }
    )
lexicon.sort(key=lambda w: w["name"].strip("-").lower())
with open("./_data/dictionary.json", "w") as file:
    json.dump(lexicon, file, indent=2)


VOWELS = "a e ë i o u".split()
CONSONANTS = "b p d t k g f v h m n y w l z c s zh ch sh r j q x th dh".split()
COMPOUND_VOWELS = "aw ai ei".split()
MULTI_UNITS = COMPOUND_VOWELS + "zh ch sh th dh dr tr".split()
PHONEME_PATTERN = "|".join(MULTI_UNITS) + "|."


def _phonemes(word):
    tokens = re.findall(PHONEME_PATTERN, word.strip("-").lower())
    result = []
    for token in tokens:
        if token != "'":
            result.extend(token if token in ("dr", "tr") else [token])
    return result


def _bar(value, maximum, width):
    return "·" if not value else "█" * max(1, round(width * value / maximum))


def _pct(value, total):
    if not value:
        return "—"
    share = 100 * value / total
    return f"{share:.0f}%" if share >= 10 else f"{share:.1f}%"


def _distribution(rows, total, label, color, width):
    table = Table(box=SIMPLE_HEAD, pad_edge=False, padding=(0, 1), show_edge=False)
    table.add_column(label, no_wrap=True)
    table.add_column("frequency", no_wrap=True)
    table.add_column("n", justify="right")
    table.add_column("%", justify="right")
    maximum = max((count for _, count in rows), default=1)
    for value, count in rows:
        table.add_row(
            Text(value, style=color),
            Text(_bar(count, maximum, width), style=color),
            str(count),
            _pct(count, total),
        )
    return table


def linguistic_summary(entries):
    console = Console()
    names = [entry["name"] for entry in entries]
    if not names:
        console.print("Lexicon is empty.")
        return

    phonemes = [p for name in names for p in _phonemes(name)]
    counts = Counter(phonemes)
    total = len(phonemes)
    affixes = sum(name.startswith("-") or name.endswith("-") for name in names)

    def rows(letters):
        return sorted(
            ((letter, counts.get(letter, 0)) for letter in letters),
            key=lambda row: row[1],
            reverse=True,
        )

    console.print()
    console.rule("[bold cyan]Bauhinian phoneme frequency[/bold cyan]")
    console.print(
        f"entries: {len(names)} ({len(names) - affixes} words, {affixes} affixes)"
    )
    for title, label, color, letters in (
        ("Vowels", "vowel", "cyan", VOWELS + COMPOUND_VOWELS),
        ("Consonants", "consonant", "green", CONSONANTS),
    ):
        console.print()
        console.print(Text(title, style=f"bold {color}"))
        console.print(
            _distribution(
                rows(letters),
                total,
                label,
                color,
                max(20, console.width - len(label) - 16),
            )
        )


if __name__ == "__main__":
    linguistic_summary(lexicon)
