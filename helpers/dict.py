import csv
import os
import re
from collections import Counter, defaultdict

from rich.box import SIMPLE_HEAD
from rich.console import Console
from rich.table import Table
from rich.text import Text

CSV_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dictionary.csv"
)


def load_lexicon():
    with open(CSV_PATH, "r", encoding="utf-8-sig", newline="") as file:
        cleaned_file = (
            line for line in file if line.strip() and line.replace(",", "").strip()
        )
        lexicon = list(csv.DictReader(cleaned_file))
    lexicon.sort(key=lambda w: w["en"].strip("-").strip("ـ").lower())
    return lexicon


VOWELS = "a e ë i o u".split()
CONSONANTS = "b p d t k g f v h m n y w l z c s zh ch sh r j q x th dh".split()
COMPOUND_VOWELS = "aw ai ei".split()
MULTI_UNITS = COMPOUND_VOWELS + "zh ch sh th dh".split()
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
    names = [entry["en"] for entry in entries]
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


def duplicate_summary(entries):
    console = Console()
    headwords = defaultdict(list)
    for entry in entries:
        headword = entry.get("en", "").strip()
        if headword:
            headwords[headword.casefold()].append(entry)

    duplicates = {key: group for key, group in headwords.items() if len(group) > 1}
    if not duplicates:
        return

    console.print()
    console.rule("[bold yellow]Duplicate headwords[/bold yellow]")

    table = Table(box=SIMPLE_HEAD, pad_edge=False, padding=(0, 1), show_edge=False)
    table.add_column("headword", no_wrap=True)
    table.add_column("pos", no_wrap=True)
    table.add_column("definition")
    table.add_column("Arabic", no_wrap=True)

    for index, key in enumerate(sorted(duplicates)):
        if index:
            table.add_section()

        group = duplicates[key]
        positions = {entry.get("pos", "").strip() for entry in group}
        rows = {
            (
                entry.get("en", "").strip(),
                entry.get("pos", "").strip(),
                entry.get("def", "").strip(),
                entry.get("bh", "").strip(),
            )
            for entry in group
        }

        for row_index, entry in enumerate(group):
            table.add_row(
                Text(entry.get("en", "").strip(), style="yellow"),
                entry.get("pos", "").strip(),
                entry.get("def", "").strip(),
                entry.get("bh", "").strip(),
            )
    console.print(table)


if __name__ == "__main__":
    entries = load_lexicon()
    linguistic_summary(entries)
    duplicate_summary(entries)
