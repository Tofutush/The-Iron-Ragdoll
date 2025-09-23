from selenium import webdriver
from time import sleep
from datetime import datetime
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def tryToFindElement(xpath):
	count = 0
	while count < 1000:
		try:
			return driver.find_element(By.XPATH, xpath)
		except:
			count += 1
	print('tried too many times')

driver = webdriver.Chrome()
driver.get("https://toyhou.se/")

# xiyue login
# driver.find_element(By.XPATH, '/html/body/div/main/div[3]/div/div[8]').click()
# driver.find_element(By.XPATH, '/html/body/div/main/div[4]/button').click()
# driver.find_element(By.XPATH, '//*[@id="usin"]').send_keys('20225301401')
# driver.find_element(By.XPATH, '//*[@id="password"]').send_keys('qwaszx123')
# driver.find_element(By.XPATH, '/html/body/div/main/div/div/div[1]/div[2]/div/div[2]/div[2]/button').click()
# flag = True
# tryToFindElement('//*[@id="root"]/section/section/section/main/div[2]/div/div/div/div[2]/div[1]/div/div[2]/div/div[1]').click()

# toyhouse
# login
driver.find_element(By.XPATH, '//*[@id="container"]/div/div/div[3]/div[2]/a').click()
sleep(7)
driver.find_element(By.XPATH, '//*[@id="username"]').send_keys('Tofutush')
driver.find_element(By.XPATH, '//*[@id="password"]').send_keys('qwaszx123')
driver.find_element(By.XPATH, '//*[@id="login-btn"]').click()
# forum
sleep(7)
driver.find_element(By.XPATH, '//*[@id="headerContent"]/ul[1]/li[2]/a').click()
# my threads
sleep(7)
driver.find_element(By.XPATH, '//*[@id="sidebar"]/ul/li[29]/a').click()
# post
sleep(7)
driver.find_element(By.XPATH, '//*[@id="content"]/div/div[2]/table/tbody/tr[1]/td[1]/h3/a').click()
# 
count = 0
while True:
	sleep(7)
	driver.find_element(By.XPATH, '//*[@id="content"]/div/div[1]/div[1]/div[1]/a[1]').click()
	count = count + 1
	print("bumped " + str(count) + " times")
	print(datetime.now())
	sleep(60 * 30 + 7) # 30 mins & 7 secs
	driver.refresh()

while True:
	sleep(1)