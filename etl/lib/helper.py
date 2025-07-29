import time
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import tempfile
from bs4 import BeautifulSoup

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-logging")
options.add_argument("--log-level=3")
options.add_argument("--silent")
options.add_argument("--disable-extensions")
options.add_argument("--disable-gpu")
options.add_argument("--remote-debugging-pipe")
options.add_experimental_option('excludeSwitches', ['enable-logging'])
options.add_experimental_option('useAutomationExtension', False)

def beautifulSoupFromUrl(url):
    # Suppress Selenium logging
    logging.getLogger('selenium').setLevel(logging.WARNING)
    
    # Use a unique temporary directory for user data
    temp_dir = tempfile.mkdtemp()
    options.add_argument(f"--user-data-dir={temp_dir}")

    # Create service with log suppression
    service = Service()
    service.log_path = 'NUL'  # Windows equivalent of /dev/null
    
    # Initialize the Chrome driver
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get(url)
        time.sleep(5)  # Let JS load if needed
        soup = BeautifulSoup(driver.page_source, 'html.parser')
    finally:
        driver.quit()

    return soup
