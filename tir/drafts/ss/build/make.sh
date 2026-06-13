#!/bin/bash

for f in $(ls ../chapter-*.md | sort -V); do
	echo -e "\n\n# $(basename $f .md | sed 's/-/ /g' | sed 's/\b\w/\u&/g')\n\n$(sed '1s/^---$//; 1,/^---$/d' $f)"
done > merged.md
pandoc authornotes.md merged.md end.md -o "Spy School.epub" --metadata-file metadata.yml --split-level 1 --toc --css empty.css
# PDF
pandoc merged.md -o temp.typ --metadata-file metadata.yml --toc -t typst
echo "$(cat start.typst && cat temp.typ && cat end.typst)" > temp.typ
typst compile temp.typ "Spy School.pdf" --font-path font
rm temp.typ
rm merged.md

