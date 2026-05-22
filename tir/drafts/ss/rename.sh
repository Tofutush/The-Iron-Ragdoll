#!/bin/bash

for file in chapter-*.md; do
    [ -e "$file" ] || continue
    chNum=$(sed -n '/^---$/,/^---$/p' "$file" | \
            sed 's/\r$//' | \
            grep -E '^chNum: ' | \
            sed 's/^chNum: //' | \
            sed 's/\r$//')
    if [ -z "$chNum" ]; then
        echo "$file has no chNum"
        continue
    fi
    new_name="chapter-${chNum}.temp.md"
    mv "$file" "$new_name"
    echo "rename $file to $new_name"
done
for file in chapter-*.temp.md; do
	mv "$file" "${file%.temp.md}.md"
done

