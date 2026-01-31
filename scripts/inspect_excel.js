
const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.resolve(__dirname, '../test-data/IT23763180_Test_Case.xlsx');
console.log('Reading file:', excelPath);

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0]; // Assume first sheet
console.log('Sheet Name:', sheetName);

const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });


// Log headers nicely
const header = data[0];
console.log('--- Headers ---');
header.forEach((h, i) => console.log(`${i}: ${h}`));

// Log first data row nicely
const row = data[1];
console.log('--- First Row ---');
row.forEach((v, i) => console.log(`${i}: ${v}`));

