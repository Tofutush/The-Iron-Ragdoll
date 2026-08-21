import os
import frontmatter
import json


def sorting(w):
    return w["pos"]


directory = "../tir-p/bauhinian/words/"
lexicon = []
words = os.listdir(directory)
for word in words:
    file = open(os.path.join(directory, word))
    data = frontmatter.load(file)
    name = os.path.splitext(word)[0]
    lexicon.append({"name": name, "pos": data["pos"], "def": data["def"]})
lexicon.sort(key=sorting)
with open("./_data/dictionary.json", "w") as file:
    file.write(json.dumps(lexicon, indent=2))
