#!/usr/bin/env bash

shopt -s nullglob

for file in ch*.md; do
    chNum=$(awk 'NR==2 { gsub(/\r/, ""); print $2 }' "$file")
    if [[ -n "$chNum" ]]; then
        newname="chapter-$chNum.temp.md"

        echo "Renaming '$file' -> '$newname'"
        mv -- "$file" "$newname"
    else
        echo "Skipping '$file' (no chNum found)"
    fi
done

