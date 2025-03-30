jackdaw2wizard = {
    "j":"t",
    "a":"h",
    "c":"e",
    "k":"f",
    "d":"i",
    "w":"v",
    "s":"b",
    "l":"o",
    "o":"x",
    "v":'n',
    "e":'g',
    "m":'w',
    "y":'z',
    "b":'a',
    "i":'r',
    "g":'d',
    "p":'s',
    "h":'j',
    "n":'u',
    "x":'m',
    "f":'p',
    "q":'q',
    "u":'c',
    "r":'k',
    "t":'l',
    "z":'y',
    " ": " "
}

wizard2jackdaw = {}

for key, val in jackdaw2wizard.items():
    wizard2jackdaw[val] = key

def j2w(str):
    new = ''
    for s in str:
        new += jackdaw2wizard[s]
    return new

def w2j(str):
    new = ''
    for s in str:
        new += wizard2jackdaw[s]
    return new

if(input('j2w (y) or w2j (n): ')[0].lower() == 'y'):
    print(j2w(input('string: ')))
else:
    print(w2j(input('string: ')))
