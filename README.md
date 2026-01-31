## Prerequisites

- **Node.js**: Ensure you have Node.js installed (v14 or higher is recommended).
- **npm**: Comes with Node.js.

## Installation

1.  **Clone or Download** this repository to your local machine.
2.  **Open a terminal** and navigate to the project folder:
    ```bash
    cd /path/to/IT23763180
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
    This will install Playwright, the `xlsx` library, and other necessary packages.

4.  **Install Playwright Browsers**:
    If this is your first time using Playwright, you may need to install the browser binaries:
    ```bash
    npx playwright install
    ```

## Running Tests

The test suite is designed to read the Excel file specifics and run Positive, Negative, and UI tests automatically.

### Run All Tests
To run all tests (headless mode by default):

```bash
npm test
```
*OR*
```bash
npx playwright test
```

### Run in Headed Mode
To see the browser while the tests are running:

```bash
npx playwright test --headed
```

### Run Specific Test File
If you want to explicitly run the Excel-driven test file (though `npm test` covers this now):

```bash
npm run test:excel
```

## Viewing Reports

After the tests complete, an HTML report is generated automatically. To view the report:

```bash
npx playwright show-report
```
This will open a detailed report in your web browser showing pass/fail status, execution logs, and screenshots for every test case.

## Project Structure

- **`test-data/IT23763180_Test_Case.xlsx`**: The source of truth for all test cases.
- **`tests/excel-functional.spec.js`**: The main test script. It parses the Excel file and dynamically generates Playwright tests.
- **`test-results/`**: Contains artifacts like screenshots and reports generated during the test run.
- **`playwright.config.js`**: Configuration file for Playwright options.
