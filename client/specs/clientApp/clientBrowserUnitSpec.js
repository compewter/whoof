var webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    firefox = require('selenium-webdriver/firefox'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    // .setChromeOptions(/* ... */)
    // .setFirefoxOptions(/* ... */)
    .build();

driver.get('http://localhost:8080');
var heading = driver.findElement(By.id('heading'));
driver.wait(until.elementTextIs(heading,'Client Home Page'), 1000);
driver.quit();