yanggan = ["甲", "丙", "戊", "庚", "壬"]
yinggan = ["乙", "丁", "己", "辛", "癸"]
yangzhi = ["子", "寅", "辰", "午", "申", "戌"]
yingzhi = ["丑", "卯", "巳", "未", "酉", "亥"]

for z in yanggan:
    for x in yingzhi:
        print(z + x)
for z in yinggan:
    for x in yangzhi:
        print(z + x)
