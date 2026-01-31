const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.resolve(__dirname, '../test-data/IT23763180_Test_Case.xlsx');
const jsonPath = path.resolve(__dirname, '../test-data/test-cases.json');

console.log('Reading Excel:', excelPath);
const workbook = XLSX.readFile(excelPath);
const sheetName = 'IT23763180'; // Hardcoded as per previous code/inspection
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
    console.error(`Sheet ${sheetName} not found! Available sheets: ${workbook.SheetNames.join(', ')}`);
    process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const testCases = {
    positiveTests: [],
    negativeTests: [],
    uiTests: []
};

// Skip header row
const rows = data.slice(1);

const cleanText = (text) => {
    if (!text) return '';
    return text.toString().replace(/^•\s*/, '').trim();
};

rows.forEach((row, index) => {
    const id = row[0];
    if (!id) return; // Skip empty rows

    // Parse category from Column 8
    // • Greeting / request / response
    // • Simple sentence
    // • S (≤30 characters)
    // • Accuracy validation
    const categoryRaw = row[8] || '';
    const categoryLines = categoryRaw.split('\n').map(l => cleanText(l)).filter(l => l);

    const category = {
        inputType: categoryLines[0] || '',
        sentenceFocus: categoryLines[1] || '',
        qualityFocus: categoryLines[3] || '' // Skip the length line at index 2
    };

    // If qualityFocus is missing (e.g. fewer lines), try to fallback reasonably or leave empty
    if (!category.qualityFocus && categoryLines.length === 3) {
        // Maybe there is no length line? Let's check logic. 
        // If only 3 lines, maybe index 2 is qualityFocus.
        // But for Pos_Fun_0001 we saw 4 lines.
        // Let's assume the structure is consistent for Positive tests.
        // For Negative tests, the category might be different.
    }

    // Construct base object
    const testCase = {
        id: id,
        name: row[1],
        lengthType: row[2],
        input: row[3],
        expectedOutput: row[4],
        category: category
    };

    if (id.startsWith('Pos_Fun_')) {
        testCases.positiveTests.push(testCase);
    } else if (id.startsWith('Neg_Fun_')) {
        // Negative tests often have 'expectedIssue' in the JSON.
        // Based on previous JSON, expectedIssue was same as expectedOutput.
        testCase.expectedIssue = row[4];

        // Negative tests category in JSON:
        // inputType: "Typographical error handling"
        // sentenceFocus: "Simple sentence"
        // qualityFocus: "Robustness validation"
        // Let's rely on Excel column 8 if valid, otherwise we accept what we parsed.
        // It's possible the Excel has different text for negative tests in Col 8.

        testCases.negativeTests.push(testCase);
    } else if (id.startsWith('Pos_UI_') || id.startsWith('Neg_UI_')) {
        // UI tests have description
        testCase.description = row[1]; // Use name as description based on inspection
        testCases.uiTests.push(testCase);
    }
});

console.log(`Parsed ${testCases.positiveTests.length} positive, ${testCases.negativeTests.length} negative, ${testCases.uiTests.length} UI tests.`);

fs.writeFileSync(jsonPath, JSON.stringify(testCases, null, 2));
console.log('Updated:', jsonPath);
