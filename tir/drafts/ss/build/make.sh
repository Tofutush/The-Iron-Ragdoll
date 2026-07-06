#!/bin/bash

for f in $(ls ../chapter-*.md | sort -V); do
	num="$(basename $f .md | sed 's/^.*-//g')"
	if [ $num -gt 1 ]; then
		prev=$(( $num - 1 ))
		# echo -e "\n\n![](chapter-$prev.png)"
		echo -e "\n\n![](chapter.png)"
	fi
	echo -e "\n\n# Chapter $num\n\n$(sed '1s/^---$//; 1,/^---$/d' $f)"
done > merged.md
pandoc authornotes.md merged.md end.md -o "Spy School.epub" --metadata-file metadata.yml --split-level 1 --toc --css empty.css
# PDF
pandoc merged.md -o temp.typ --metadata-file metadata.yml --toc -t typst
echo "$(cat start.typst && cat temp.typ && cat end.typst)" > temp.typ
typst compile temp.typ "Spy School.pdf"
rm temp.typ
rm merged.md

