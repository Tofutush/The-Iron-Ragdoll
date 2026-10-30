import os
import frontmatter
import json
from collections import Counter
from rich.console import Console
from rich.table import Table
from rich.text import Text
from rich.box import SIMPLE_HEAD


def sorting(w):
    return w["name"].strip("-").lower()


directory = "../tir-p/bauhinian/words/"
lexicon = []
words = os.listdir(directory)
for word in words:
    file = open(os.path.join(directory, word), "r", encoding="utf-8")
    data = frontmatter.load(file)
    name = os.path.splitext(word)[0]
    lexicon.append(
        {"name": name, "pos": data["pos"], "def": data["def"], "bh": data["bauhinian"]}
    )
lexicon.sort(key=sorting)
with open("./_data/dictionary.json", "w") as file:
    file.write(json.dumps(lexicon, indent=2))

# summaries

VOWELS = ("a", "e", "ë", "i", "o", "u")
CONSONANTS = (
    "b",
    "p",
    "d",
    "t",
    "k",
    "g",
    "f",
    "v",
    "h",
    "m",
    "n",
    "y",
    "w",
    "l",
    "z",
    "c",
    "s",
    "zh",
    "ch",
    "sh",
    "r",
    "j",
    "q",
    "x",
    "th",
    "dh",
)
COMPOUND_VOWELS = ("aw", "ai", "ei")
MULTI_UNITS = COMPOUND_VOWELS + ("zh", "ch", "sh", "th", "dh", "dr", "tr")
VOWEL_TOKENS = set(VOWELS + COMPOUND_VOWELS)


def _phonemes(word):
    """Split a Latin spelling into phonemes.

    An apostrophe is not a phoneme; it only breaks a cluster. So s'h is
    /s/+h rather than sh, and a'w is /a/+w rather than the aw compound.
    Compound vowels (aw/ai/ei) and consonant digraphs are one token each,
    while dr/tr are spelled as clusters, so they count as /d/+r and /t/+r.
    """
    word = word.strip("-").lower()
    result = []
    i = 0
    while i < len(word):
        if word[i] == "'":
            i += 1
            continue
        unit = next((u for u in MULTI_UNITS if word.startswith(u, i)), None)
        if unit is None:
            result.append(word[i])
            i += 1
        elif unit in ("dr", "tr"):
            result.extend(unit)
            i += len(unit)
        else:
            result.append(unit)
            i += len(unit)
    return result


def _bar(value, maximum, width=16):
    if not value or maximum <= 0:
        return "·"
    return "█" * max(1, round(width * value / maximum))


def _pct(value, total):
    if not total or not value:
        return "—"
    share = 100 * value / total
    return f"{share:.0f}%" if share >= 10 else f"{share:.1f}%"


def _phoneme_style(phoneme):
    return "bold cyan" if phoneme in VOWEL_TOKENS else "green"


def _distribution(rows, total, label_header, style=None, bar_width=16, maximum=None):
    table = Table(box=SIMPLE_HEAD, pad_edge=False, padding=(0, 1), show_edge=False)
    table.add_column(label_header, no_wrap=True)
    table.add_column("frequency", no_wrap=True)
    table.add_column("n", justify="right")
    table.add_column("%", justify="right")
    if maximum is None:
        maximum = max((count for _, count in rows), default=1)
    for label, count in rows:
        cell_style = style(label) if style else "green"
        table.add_row(
            Text(str(label), style=cell_style),
            Text(_bar(count, maximum, bar_width), style=cell_style),
            str(count),
            _pct(count, total),
        )
    return table


def linguistic_summary(entries):
    """Print the whole summary for a lexicon built from the word files."""
    console = Console()
    corpus = [
        {
            "name": entry["name"].strip("-"),
            "label": entry["name"],
            "suffix": entry["name"].startswith("-"),
            "prefix": entry["name"].endswith("-"),
            "phones": _phonemes(entry["name"]),
        }
        for entry in entries
    ]
    if not corpus:
        console.print(Text("Lexicon is empty; nothing to summarise.", style="red"))
        return

    roots = [w for w in corpus if not (w["suffix"] or w["prefix"])]
    affixes = [w for w in corpus if w["suffix"] or w["prefix"]]
    phonemes = [p for w in corpus for p in w["phones"]]
    counts = Counter(phonemes)
    vowels = [p for p in phonemes if p in VOWEL_TOKENS]
    consonants = [p for p in phonemes if p not in VOWEL_TOKENS]
    maximum = max(counts.values(), default=1)

    def rows(letters):
        # Every letter is shown, including ones with no occurrences.
        return sorted(
            ((letter, counts.get(letter, 0)) for letter in letters),
            key=lambda row: row[1],
            reverse=True,
        )

    console.print()
    console.rule("[bold cyan]Bauhinian phoneme frequency[/bold cyan]")
    console.print(
        f"entries: {len(corpus)} ({len(roots)} words, {len(affixes)} affixes)"
    )
    console.print(
        f"phonemes: {len(phonemes)} "
        f"({len(vowels)} vowels, {len(consonants)} consonants)"
    )

    console.print()
    console.print(Text("Vowels", style="bold cyan"))
    console.print(
        _distribution(
            rows(VOWELS + COMPOUND_VOWELS),
            len(phonemes),
            label_header="vowel",
            style=_phoneme_style,
            maximum=maximum,
        )
    )

    console.print()
    console.print(Text("Consonants", style="bold green"))
    console.print(
        _distribution(
            rows(CONSONANTS),
            len(phonemes),
            label_header="consonant",
            style=_phoneme_style,
            maximum=maximum,
        )
    )


if __name__ == "__main__":
    linguistic_summary(lexicon)
