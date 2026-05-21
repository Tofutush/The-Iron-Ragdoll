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
    new_name="chapter-${chNum}.md"
    if [ "$file" = "$new_name" ]; then
        echo "$file is correct"
        continue
    fi
    if [ -e "$new_name" ]; then
        echo "$new_name exist, $file skipped"
        continue
    fi
    # mv "$file" "$new_name"
    echo "rename $file to $new_name"
done
echo "done"

