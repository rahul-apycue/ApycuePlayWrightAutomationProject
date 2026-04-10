/**
 * syncSheet.js
 * Reads all spec files, extracts test case details,
 * and syncs them into the "🤖 Automation Test Cases" Google Sheet.
 *
 * Run: node scripts/syncSheet.js
 */

const { google } = require('googleapis');
const fs   = require('fs');
const path = require('path');

const SHEET_ID   = '1VFrXQQW3NlHUUrQl2Yi6QvYe6_44Bc1xbS8u3pU1Lqs';
const SHEET_NAME = '🤖 Automation Test Cases';
const CREDS      = require('C:/Users/rahul/Downloads/playwrighttestsheet-361dae63531f.json');
const TESTS_DIR  = path.join(__dirname, '../tests');

// ─── PARSER ────────────────────────────────────────────────────────────────

function parseSpecFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const results  = [];

    // Split into lines for line-by-line parsing
    const lines = content.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Detect test() declaration
        const testMatch = line.match(/^\s*test\('(TC_NO_\d+):\s*(.+?)'\s*,/);
        if (!testMatch) { i++; continue; }

        const tcNo    = testMatch[1];          // e.g. TC_NO_0001
        const title   = testMatch[2].trim();   // test description

        // Look back up to 10 lines for Priority comment AND original TC ID
        let priority = 'Medium';
        let origTcId = '';
        for (let back = 1; back <= 10; back++) {
            const prev = lines[i - back] || '';
            const priMatch = prev.match(/\/\/\s*Priority\s*=\s*(.+)/);
            if (priMatch) { priority = priMatch[1].trim(); }
            // e.g. // ========== NH-HS-001 ===... or // ========== TC_BO_001 ===...
            const origMatch = prev.match(/\/\/\s*={3,}\s+((?:TC_[A-Z]+_\d+|NH-[A-Z]+-\d+))\s+={3,}/);
            if (origMatch && !origTcId) { origTcId = origMatch[1].trim(); }
        }

        // Collect all test.step() calls inside this test block
        const steps = [];
        let depth = 0;
        let started = false;
        let j = i;

        while (j < lines.length) {
            const l = lines[j];
            if (!started && l.includes('{')) { started = true; }
            if (started) {
                const opens  = (l.match(/\{/g) || []).length;
                const closes = (l.match(/\}/g) || []).length;
                depth += opens - closes;

                const stepMatch = l.match(/await test\.step\('(.+?)'/);
                if (stepMatch) steps.push(stepMatch[1].trim());

                if (started && depth <= 0) break;
            }
            j++;
        }

        // Build expected result = last step text (usually "Verify ...")
        const expectedResult = steps.filter(s => /verify|assert|check|confirm|should/i.test(s)).pop()
            || steps[steps.length - 1]
            || title;

        // Build execution steps as numbered list
        const executionSteps = steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');

        results.push({
            tcNo,
            title,
            priority,
            origTcId,
            executionSteps,
            expectedResult,
            fileName,
        });

        i = j + 1;
    }

    return results;
}

function extractTcNumber(tcNo) {
    const m = tcNo.match(/TC_NO_(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
}

// ─── MAP priority label → display value ────────────────────────────────────

function normalizePriority(p) {
    const map = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
    return map[p.toLowerCase()] || p;
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

async function main() {
    // 1. Parse all spec files
    const specFiles = fs.readdirSync(TESTS_DIR)
        .filter(f => f.endsWith('.spec.ts'))
        .map(f => path.join(TESTS_DIR, f));

    let allTests = [];
    for (const file of specFiles) {
        const tests = parseSpecFile(file);
        console.log(`  ${path.basename(file)}: ${tests.length} tests found`);
        allTests = allTests.concat(tests);
    }

    // 2. Sort by TC_NO number
    allTests.sort((a, b) => extractTcNumber(a.tcNo) - extractTcNumber(b.tcNo));
    console.log(`\nTotal tests extracted: ${allTests.length}`);

    // 3. Connect to Google Sheets
    const auth = new google.auth.GoogleAuth({
        credentials: CREDS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // 4. Clear existing data (keep header row)
    await sheets.spreadsheets.values.clear({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A2:L10000`,
    });
    console.log('Cleared old data from sheet');

    // 5. Build rows (12 columns after addAllSheetColumn.js inserted col C)
    const rows = allTests.map((t, idx) => [
        idx + 1,                          // A: Sr No
        t.tcNo,                           // B: Test Case ID
        t.origTcId || '',                 // C: All Sheet - Test Case ID
        t.title,                          // D: Test Case Title
        t.executionSteps,                 // E: Execution Steps
        t.expectedResult,                 // F: Expected Result
        '',                               // G: Actual Result
        normalizePriority(t.priority),    // H: Priority
        'Not Run',                        // I: Status / Result
        'Yes',                            // J: Is Automated
        '',                               // K: Attachment
        '',                               // L: Remark
    ]);

    // 6. Write rows to sheet in batches of 100
    const BATCH = 100;
    for (let start = 0; start < rows.length; start += BATCH) {
        const batch = rows.slice(start, start + BATCH);
        const startRow = start + 2; // row 1 is header
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A${startRow}:L${startRow + batch.length - 1}`,
            valueInputOption: 'RAW',
            requestBody: { values: batch },
        });
        console.log(`  Written rows ${startRow} → ${startRow + batch.length - 1}`);
    }

    // 7. Apply conditional formatting for Status col I (idx 8) and Priority col H (idx 7)
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetMeta = meta.data.sheets.find(s => s.properties.title === SHEET_NAME);
    const sheetId   = sheetMeta.properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
            requests: [
                // "Pass" → green  (col I = index 8)
                {
                    addConditionalFormatRule: {
                        rule: {
                            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 10000, startColumnIndex: 8, endColumnIndex: 9 }],
                            booleanRule: {
                                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Pass' }] },
                                format: { backgroundColor: { red: 0.714, green: 0.914, blue: 0.714 }, textFormat: { bold: true } }
                            }
                        },
                        index: 0
                    }
                },
                // "Fail" → red  (col I = index 8)
                {
                    addConditionalFormatRule: {
                        rule: {
                            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 10000, startColumnIndex: 8, endColumnIndex: 9 }],
                            booleanRule: {
                                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Fail' }] },
                                format: { backgroundColor: { red: 0.957, green: 0.714, blue: 0.714 }, textFormat: { bold: true } }
                            }
                        },
                        index: 1
                    }
                },
                // "Not Run" → light grey  (col I = index 8)
                {
                    addConditionalFormatRule: {
                        rule: {
                            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 10000, startColumnIndex: 8, endColumnIndex: 9 }],
                            booleanRule: {
                                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Not Run' }] },
                                format: { backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 } }
                            }
                        },
                        index: 2
                    }
                },
                // "In Progress" → yellow  (col I = index 8)
                {
                    addConditionalFormatRule: {
                        rule: {
                            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 10000, startColumnIndex: 8, endColumnIndex: 9 }],
                            booleanRule: {
                                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'In Progress' }] },
                                format: { backgroundColor: { red: 1, green: 0.949, blue: 0.8 }, textFormat: { bold: true } }
                            }
                        },
                        index: 3
                    }
                },
                // "Blocked" → orange  (col I = index 8)
                {
                    addConditionalFormatRule: {
                        rule: {
                            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 10000, startColumnIndex: 8, endColumnIndex: 9 }],
                            booleanRule: {
                                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Blocked' }] },
                                format: { backgroundColor: { red: 1, green: 0.8, blue: 0.6 }, textFormat: { bold: true } }
                            }
                        },
                        index: 4
                    }
                },
                // Priority Critical → red text  (col H = index 7)
                {
                    addConditionalFormatRule: {
                        rule: {
                            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 10000, startColumnIndex: 7, endColumnIndex: 8 }],
                            booleanRule: {
                                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Critical' }] },
                                format: { textFormat: { bold: true, foregroundColor: { red: 0.8, green: 0.1, blue: 0.1 } } }
                            }
                        },
                        index: 5
                    }
                },
                // Priority High → orange text  (col H = index 7)
                {
                    addConditionalFormatRule: {
                        rule: {
                            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 10000, startColumnIndex: 7, endColumnIndex: 8 }],
                            booleanRule: {
                                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'High' }] },
                                format: { textFormat: { bold: true, foregroundColor: { red: 0.9, green: 0.5, blue: 0.0 } } }
                            }
                        },
                        index: 6
                    }
                },
            ]
        }
    });

    console.log('\nConditional formatting applied!');
    console.log(`\n✅ Sheet synced successfully — ${allTests.length} test cases written.`);
    console.log(`   Open: https://docs.google.com/spreadsheets/d/${SHEET_ID}`);
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});