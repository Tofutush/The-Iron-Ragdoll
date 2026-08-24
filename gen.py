import random

vow = ["a", "e", "i", "o", "u"]
con = [
    "b",
    "p",
    "d",
    "t",
    "g",
    "k",
    "v",
    "f",
    "m",
    "n",
    "y",
    "w",
    "l",
    "j",
    "q",
    "x",
    "z",
    "c",
    "s",
    "zh",
    "ch",
    "sh",
]

final = "a'e'i'o'u"
for z in vow:
    for x in con:
        if not x in ["y", "w", "l"]:
            final += "'" + z + x
for z in con:
    for x in vow:
        final += z + x
        for c in con:
            if not c in ["y", "w", "l"]:
                final += z + x + c
print(final)

# for z in range(50):
#     length = random.randint(1, 4)
#     word = ""
#     for z in range(length):
#         kind = random.randint(1, 9)
#         if kind == 1:
#             word += vow[random.randint(0, len(vow) - 1)]
#         elif kind == 2 or kind == 3 or kind == 4:
#             word += con[random.randint(0, len(con) - 1)]
#             word += vow[random.randint(0, len(vow) - 1)]
#         elif kind == 5 or kind == 6:
#             word += vow[random.randint(0, len(vow) - 1)]
#             letter = con[random.randint(0, len(con) - 1)]
#             while letter in ["y", "w", "l"]:
#                 letter = con[random.randint(0, len(con) - 1)]
#             word += letter
#         else:
#             word += con[random.randint(0, len(con) - 1)]
#             word += vow[random.randint(0, len(vow) - 1)]
#             letter = con[random.randint(0, len(con) - 1)]
#             while letter in ["y", "w", "l"]:
#                 letter = con[random.randint(0, len(con) - 1)]
#             word += letter
#         if z != length - 1:
#             word += "'"
#     print(word)
