/**
 * updateResults.js
 *
 * Runs after every Playwright test execution.
 * Creates a NEW TAB inside the existing spreadsheet each time with:
 *   - Tab name = "Run YYYY-MM-DD HH:MM:SS"
 *   - All test cases with results
 *   - Columns: SrNo, TestCaseID, AllSheetTCID, Title, Steps, Expected,
 *              Actual, Priority, Status, IsAutomated, Attachment, Remark, RunTimestamp
 *   - Color formatting per status
 *
 * Run: node scripts/updateResults.js
 * Or:  npm run test:and:sync
 */

const { google } = require('googleapis');
const fs   = require('fs');
const path = require('path');

const SHEET_ID     = '1VFrXQQW3NlHUUrQl2Yi6QvYe6_44Bc1xbS8u3pU1Lqs';
const CREDS        = require('C:/Users/rahul/Downloads/playwrighttestsheet-361dae63531f.json');
const RESULTS_FILE = path.join(__dirname, '../test-results/results.json');
const TESTS_DIR    = path.join(__dirname, '../tests');

const HEADERS = [
    'Sr No',
    'Test Case ID',
    'All Sheet - Test Case ID',
    'Test Case Title',
    'Execution Steps',
    'Expected Result',
    'Actual Result',
    'Priority',
    'Status / Result',
    'Is Automated',
    'Attachment',
    'Remark',
    'Run Timestamp',
];

// ── Parse Playwright JSON report ───────────────────────────────────────────
function parseResults(jsonPath) {
    if (!fs.existsSync(jsonPath)) {
        console.error(`Results file not found: ${jsonPath}`);
        console.error('Run tests first: npm run test:chrome');
        process.exit(1);
    }

    const data    = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const results = {};

    function walkSuites(suites) {
        for (const suite of suites || []) {
            for (const spec of suite.specs || []) {
                const match = spec.title.match(/TC_NO_(\d+)/);
                if (!match) continue;
                const tcNo = `TC_NO_${match[1].padStart(4, '0')}`;

                for (const test of spec.tests || []) {
                    for (const result of test.results || []) {
                        const existing = results[tcNo];
                        const status   = normalizeStatus(result.status);
                        if (!existing || statusPriority(status) > statusPriority(existing.status)) {
                            results[tcNo] = { status, error: extractError(result.error) };
                        }
                    }
                }
            }
            walkSuites(suite.suites);
        }
    }

    walkSuites(data.suites);
    return results;
}

function normalizeStatus(s) {
    if (s === 'passed')   return 'Pass';
    if (s === 'failed')   return 'Fail';
    if (s === 'timedOut') return 'Fail';
    if (s === 'skipped')  return 'Skip';
    return 'Not Run';
}

function statusPriority(s) {
    return { Fail: 3, Skip: 2, Pass: 1, 'Not Run': 0 }[s] || 0;
}

function extractError(error) {
    if (!error) return '';
    let msg = (error.message || error.value || '').replace(/\x1B\[[0-9;]*m/g, '').trim();
    return msg.split('\n').slice(0, 3).join(' | ').substring(0, 500);
}

// ── Parse spec files ───────────────────────────────────────────────────────
function parseSpecFiles() {
    const specFiles = fs.readdirSync(TESTS_DIR)
        .filter(f => f.endsWith('.spec.ts'))
        .map(f => path.join(TESTS_DIR, f));

    const allTests = [];

    for (const file of specFiles) {
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        let i = 0;

        while (i < lines.length) {
            const line      = lines[i];
            const testMatch = line.match(/^\s*test\('(TC_NO_\d+):\s*(.+?)'\s*,/);
            if (!testMatch) { i++; continue; }

            const tcNo  = testMatch[1];
            const title = testMatch[2].trim();

            let priority = 'Medium';
            let origTcId = '';
            for (let back = 1; back <= 10; back++) {
                const prev      = lines[i - back] || '';
                const priMatch  = prev.match(/\/\/\s*Priority\s*=\s*(.+)/);
                const origMatch = prev.match(/\/\/\s*={3,}\s+((?:TC_[A-Z]+_\d+|NH-[A-Z]+-\d+))\s+={3,}/);
                if (priMatch  && priority === 'Medium') priority = priMatch[1].trim();
                if (origMatch && !origTcId)             origTcId = origMatch[1].trim();
            }

            const steps = [];
            let depth = 0, started = false, j = i;
            while (j < lines.length) {
                const l = lines[j];
                if (!started && l.includes('{')) started = true;
                if (started) {
                    depth += (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
                    const stepMatch = l.match(/await test\.step\('(.+?)'/);
                    if (stepMatch) steps.push(stepMatch[1].trim());
                    if (started && depth <= 0) break;
                }
                j++;
            }

            const expectedResult = steps.filter(s => /verify|assert|check|confirm|should/i.test(s)).pop()
                || steps[steps.length - 1] || title;
            const executionSteps = steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');

            allTests.push({ tcNo, title, priority, origTcId, executionSteps, expectedResult });
            i = j + 1;
        }
    }

    allTests.sort((a, b) => {
        const n = t => parseInt((t.tcNo.match(/(\d+)$/) || [0, 0])[1], 10);
        return n(a) - n(b);
    });

    return allTests;
}

function normalizePriority(p) {
    return { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' }[p.toLowerCase()] || p;
}

function statusColor(status) {
    return {
        Pass:      { red: 0.714, green: 0.914, blue: 0.714 },
        Fail:      { red: 0.957, green: 0.714, blue: 0.714 },
        Skip:      { red: 0.9,   green: 0.9,   blue: 0.9   },
        'Not Run': { red: 0.949, green: 0.961, blue: 0.988 },
    }[status] || { red: 1, green: 1, blue: 1 };
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
    const now = new Date();
    const runTimestamp = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
    });

    // Tab name: "Run DD/MM/YYYY, HH:MM:SS" → sanitized to valid sheet name
    const tabName = `Run ${runTimestamp.replace(/[\/,]/g, '-').replace(/\s+/g, ' ').trim()}`;

    console.log('Run timestamp:', runTimestamp);
    console.log('New tab name: ', tabName);

    const results  = parseResults(RESULTS_FILE);
    const allTests = parseSpecFiles();
    console.log(`Tests parsed from spec files: ${allTests.length}`);

    const passed  = Object.values(results).filter(r => r.status === 'Pass').length;
    const failed  = Object.values(results).filter(r => r.status === 'Fail').length;
    const skipped = Object.values(results).filter(r => r.status === 'Skip').length;
    console.log(`Results — Pass: ${passed} | Fail: ${failed} | Skip: ${skipped}`);

    // ── Auth (Sheets only — no Drive needed) ──────────────────────────────
    const auth = new google.auth.GoogleAuth({
        credentials: CREDS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // ── Add new tab to existing spreadsheet ───────────────────────────────
    console.log(`\nAdding new tab "${tabName}" to existing spreadsheet...`);
    const addRes = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
            requests: [{
                addSheet: {
                    properties: {
                        title:           tabName,
                        gridProperties:  { frozenRowCount: 1, frozenColumnCount: 2 },
                    }
                }
            }]
        }
    });

    const newTabId = addRes.data.replies[0].addSheet.properties.sheetId;
    console.log(`  Tab created (sheetId: ${newTabId})`);

    // ── Write header ───────────────────────────────────────────────────────
    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `'${tabName}'!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [HEADERS] },
    });

    // ── Build and write data rows ──────────────────────────────────────────
    const rows = allTests.map((t, idx) => {
        const result       = results[t.tcNo] || {};
        const status       = result.status || 'Not Run';
        const actualResult = status === 'Fail' ? (result.error || 'Test failed')
                           : status === 'Pass' ? 'As expected' : '';
        const remark       = status === 'Fail'
            ? `FAILED: ${result.error || 'See Playwright report for details'}` : '';

        return [
            idx + 1,
            t.tcNo,
            t.origTcId || '',
            t.title,
            t.executionSteps,
            t.expectedResult,
            actualResult,
            normalizePriority(t.priority),
            status,
            'Yes',
            '',
            remark,
            runTimestamp,
        ];
    });

    const BATCH = 100;
    for (let start = 0; start < rows.length; start += BATCH) {
        const batch    = rows.slice(start, start + BATCH);
        const startRow = start + 2;
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `'${tabName}'!A${startRow}:M${startRow + batch.length - 1}`,
            valueInputOption: 'RAW',
            requestBody: { values: batch },
        });
    }
    console.log(`  ${rows.length} rows written.`);

    // ── Formatting ─────────────────────────────────────────────────────────
    const formatRequests = [];

    // Header row styling
    formatRequests.push({
        repeatCell: {
            range: { sheetId: newTabId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
            cell: {
                userEnteredFormat: {
                    backgroundColor:     { red: 0.122, green: 0.29, blue: 0.529 },
                    textFormat:          { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 }, fontSize: 10 },
                    horizontalAlignment: 'CENTER',
                    verticalAlignment:   'MIDDLE',
                    wrapStrategy:        'WRAP',
                }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
        }
    });

    // Per-row status color
    rows.forEach((row, i) => {
        const status      = row[8];
        const sheetRowIdx = i + 1;
        const bgColor     = statusColor(status);

        formatRequests.push({
            repeatCell: {
                range: { sheetId: newTabId, startRowIndex: sheetRowIdx, endRowIndex: sheetRowIdx + 1, startColumnIndex: 8, endColumnIndex: 9 },
                cell: {
                    userEnteredFormat: {
                        backgroundColor:     bgColor,
                        textFormat:          { bold: status !== 'Not Run' },
                        horizontalAlignment: 'CENTER',
                    }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            }
        });

        if (status === 'Pass' || status === 'Fail') {
            const rowBg = status === 'Pass'
                ? { red: 0.94, green: 1,    blue: 0.94 }
                : { red: 1,    green: 0.94, blue: 0.94 };
            formatRequests.push({
                repeatCell: {
                    range: { sheetId: newTabId, startRowIndex: sheetRowIdx, endRowIndex: sheetRowIdx + 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
                    cell: { userEnteredFormat: { backgroundColor: rowBg } },
                    fields: 'userEnteredFormat.backgroundColor',
                }
            });
        }
    });

    // Column widths
    [50, 110, 130, 250, 300, 200, 200, 80, 90, 90, 80, 250, 160].forEach((w, idx) => {
        formatRequests.push({
            updateDimensionProperties: {
                range: { sheetId: newTabId, dimension: 'COLUMNS', startIndex: idx, endIndex: idx + 1 },
                properties: { pixelSize: w },
                fields: 'pixelSize',
            }
        });
    });

    const FORMAT_BATCH = 100;
    for (let i = 0; i < formatRequests.length; i += FORMAT_BATCH) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SHEET_ID,
            requestBody: { requests: formatRequests.slice(i, i + FORMAT_BATCH) },
        });
    }

    console.log(`\n✅ Done!`);
    console.log(`   Pass: ${passed} | Fail: ${failed} | Skip: ${skipped} | Total: ${allTests.length}`);
    console.log(`   Timestamp: ${runTimestamp}`);
    console.log(`   Open: https://docs.google.com/spreadsheets/d/${SHEET_ID}`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });