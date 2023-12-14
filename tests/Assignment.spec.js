
const { test, expect } = require('@playwright/test');
import  test_data from "../test-data/data.json";
const { chromium } = require('playwright');


test('Verify data is dynamically updated in table with given json data', async () => {

  const browser = await chromium.launch()
   
  const page = await browser.newPage();
  await page.goto('https://testpages.herokuapp.com/styled/tag/dynamic-table.html')  //landing on the given url,

  const eleclick = await page.$('//div[3]//details/summary')
  await eleclick?.click()                                             //clicking table data
  const tableDataElement = await page.$('#jsondata');
  const refeshtableElement = await page.$('#refreshtable');
  if (tableDataElement) await tableDataElement.fill(JSON.stringify(test_data["data"]));  //getting data from json file and filling the element
  refeshtableElement?.click()                                                            // clicking on refresh button
  await page.waitForTimeout(3000)

  const tableSelector = '#dynamictable';
  const tableContent = await page.$eval(tableSelector, (table) => {
    const rows = Array.from(table.querySelectorAll('tr'));
    const headerCells = Array.from(rows[0].querySelectorAll('th')).map(cell => cell.textContent.trim());
    const dataRows = rows.slice(1).map((row) => {
      const cells = Array.from(row.querySelectorAll('td'));
      return cells.map((cell) => cell.textContent.trim());
    });

    return [headerCells, ...dataRows];
  });

const headerRow = Object.keys(test_data.data[0]);
const dataArray = test_data.data.map(item => Object.values(item).map(value => String(value)));
const expectedData = [headerRow, ...dataArray];

  
  expect(tableContent).toEqual(expectedData);                      //assertions
  await page.close()
});

