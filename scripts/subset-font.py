"""Build public/fonts/PortfSansVariable.woff2, a renamed subset of Pretendard Variable 1.3.9.

Pretendard is licensed under the SIL OFL 1.1 with the Reserved Font Name 'Pretendard',
so the subset ships under another name. The subset keeps KS X 1001's 2,350 Hangul syllables,
common symbol ranges and every character in the site source. Rerun it after content edits
that add new characters:

    pip install fonttools brotli
    git show eb8ba8a:public/fonts/PretendardVariable.woff2 > /tmp/PretendardVariable.woff2
    python3 scripts/subset-font.py /tmp/PretendardVariable.woff2
"""
import sys
import unicodedata
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/fonts/PortfSansVariable.woff2"
RANGES = [(0x20, 0x7E), (0xA0, 0xFF), (0x2000, 0x206F), (0x2070, 0x209F), (0x20A0, 0x20CF),
          (0x2100, 0x218F), (0x2190, 0x21FF), (0x2200, 0x22FF), (0x2460, 0x24FF), (0x2500, 0x257F),
          (0x25A0, 0x25FF), (0x2600, 0x27BF), (0x3000, 0x303F), (0x3131, 0x318E), (0x3200, 0x32FF),
          (0xFF01, 0xFF5E)]
# Names that present the font to users; copyright, trademark and license records stay as they are.
RENAMED_IDS = {1, 3, 4, 6, 16, 25}


def characters() -> str:
    chars: set[str] = set()
    for path in [*(ROOT / "src").rglob("*"), ROOT / "README.md"]:
        if path.is_file() and path.suffix in {".ts", ".tsx", ".css", ".md", ".svg"}:
            chars.update(path.read_text(encoding="utf-8"))
    # KS X 1001 syllables encode to two bytes in EUC-KR; the rest only as 8-byte jamo sequences.
    for cp in range(0xAC00, 0xD7A4):
        if len(chr(cp).encode("euc_kr")) == 2:
            chars.add(chr(cp))
    for lo, hi in RANGES:
        chars.update(chr(cp) for cp in range(lo, hi + 1))
    return "".join(sorted(c for c in chars if c.isprintable() or unicodedata.category(c) == "Zs"))


def rename(font: TTFont) -> None:
    table = font["name"]
    for record in table.names:
        if record.nameID in RENAMED_IDS or record.nameID >= 256:
            text = record.toUnicode()
            record.string = text.replace("PretendardVariable", "PortfSansVariable").replace("Pretendard", "Portf Sans")
    table.setName("Subset of Pretendard Variable 1.309 (SIL OFL 1.1), renamed under its Reserved Font Name terms.",
                  10, 3, 1, 0x409)


def main(source: str) -> None:
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.name_legacy = True
    # Keep the source timestamp so reruns without new characters produce the same file.
    font = TTFont(source, recalcTimestamp=False)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=characters())
    subsetter.subset(font)
    rename(font)
    font.flavor = "woff2"
    font.save(OUT)
    print(f"{OUT.relative_to(ROOT)}: {OUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main(sys.argv[1])
