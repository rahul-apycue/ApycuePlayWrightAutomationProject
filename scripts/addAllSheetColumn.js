/**
 * addAllSheetColumn.js  — One-time setup script
 *
 * Task 1: Inserts "All Sheet - Test Case ID" as col C in "🤖 Automation Test Cases"
 *         Fills each row with the original TC ID (NH-HS-001, TC_BO_001, etc.)
 *         mapped from the spec file comment above each test.
 *
 * Task 3: In "📋 All Tests" sheet, finds NH-HS-001 through NH-HS-020 rows and
 *         sets Is-Automate? = "Yes" + highlights those cells green.
 *
 * Run ONCE: node scripts/addAllSheetColumn.js
 * After running, update syncSheet.js and updateResults.js use the new column layout.
 */

const { google } = require('googleapis');
const fs   = require('fs');
const path = require('path');

const SHEET_ID      = '1VFrXQQW3NlHUUrQl2Yi6QvYe6_44Bc1xbS8u3pU1Lqs';
const AUTO_SHEET    = '🤖 Automation Test Cases';
const ALL_SHEET     = '📋 All Tests';
const CREDS         = require('C:/Users/rahul/Downloads/playwrighttestsheet-361dae63531f.json');
const TESTS_DIR     = path.join(__dirname, '../tests');

// ── Parse spec files → build mapping TC_NO_XXXX → original TC ID ──────────
function buildTcMapping() {
    const mapping = {};   // TC_NO_0001 → 'TC_BO_001'

    const specFiles = fs.readdirSync(TESTS_DIR)
        .filter(f => f.endsWith('.spec.ts'))
        .map(f => path.join(TESTS_DIR, f));

    for (const file of specFiles) {
        const lines = fs.readFileSync(file, 'utf8').split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Match: // ========== TC_BO_001 ===... or // ========== NH-HS-001 ===...
            const origIdMatch = line.match(/\/\/\s*={3,}\s+((?:TC_[A-Z]+_\d+|NH-[A-Z]+-\d+))\s+={3,}/);
            if (!origIdMatch) continue;

            const origId = origIdMatch[1].trim();

            // Look forward up to 5 lines for TC_NO_XXXX in a test() declaration
            for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
                const tcMatch = lines[j].match(/TC_NO_(\d+)/);
                if (tcMatch) {
                    const tcNo = `TC_NO_${tcMatch[1].padStart(4, '0')}`;
                    if (!mapping[tcNo]) {   // first match wins
                        mapping[tcNo] = origId;
                    }
                    break;
                }
            }
        }
    }

    return mapping;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
    const auth = new google.auth.GoogleAuth({
        credentials: CREDS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // ── Get sheet IDs ──────────────────────────────────────────────────────
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const autoSheetMeta = meta.data.sheets.find(s => s.properties.title === AUTO_SHEET);
    const allSheetMeta  = meta.data.sheets.find(s => s.properties.title === ALL_SHEET);
    const autoSheetId   = autoSheetMeta.properties.sheetId;
    const allSheetId    = allSheetMeta.properties.sheetId;

    // ══════════════════════════════════════════════════════════════════════
    // TASK 1 — Insert col C "All Sheet - Test Case ID" in Automation sheet
    // ══════════════════════════════════════════════════════════════════════
    console.log('\n── Task 1: Inserting new column C in', AUTO_SHEET, '──');

    // Step 1a: Insert blank column at index 2 (col C, 0-based)
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
            requests: [{
                insertDimension: {
                    range: {
                        sheetId:    autoSheetId,
                        dimension:  'COLUMNS',
                        startIndex: 2,   // col C (0-based)
                        endIndex:   3,
                    },
                    inheritFromBefore: false,
                }
            }]
        }
    });
    console.log('  Blank column C inserted.');

    // Step 1b: Write header to C1
    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${AUTO_SHEET}!C1`,
        valueInputOption: 'RAW',
        requestBody: { values: [['All Sheet - Test Case ID']] },
    });

    // Step 1c: Format header cell (dark blue, white text, bold — same as other headers)
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
            requests: [{
                repeatCell: {
                    range: {
                        sheetId:          autoSheetId,
                        startRowIndex:    0,
                        endRowIndex:      1,
                        startColumnIndex: 2,
                        endColumnIndex:   3,
                    },
                    cell: {
                        userEnteredFormat: {
                            backgroundColor: { red: 0.122, green: 0.29, blue: 0.529 },
                            textFormat: {
                                bold:            true,
                                foregroundColor: { red: 1, green: 1, blue: 1 },
                                fontSize:        10,
                            },
                            horizontalAlignment: 'CENTER',
                            verticalAlignment:   'MIDDLE',
                            wrapStrategy:        'WRAP',
                        }
                    },
                    fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
                }
            }]
        }
    });
    console.log('  Header "All Sheet - Test Case ID" written to C1.');

    // Step 1d: Build TC_NO → orig ID mapping
    const mapping = buildTcMapping();
    console.log(`  Mapping built: ${Object.keys(mapping).length} TC_NO entries found.`);
    // Show sample
    const sample = Object.entries(mapping).slice(0, 5).map(([k, v]) => `${k}→${v}`).join(', ');
    console.log(`  Sample: ${sample}`);

    // Step 1e: Read col B (TC_NO) from sheet rows
    const sheetRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${AUTO_SHEET}!B2:B5000`,
    });
    const tcRows = sheetRes.data.values || [];
    console.log(`  Sheet rows found: ${tcRows.length}`);

    // Step 1f: Build values for col C
    const colCValues = tcRows.map(row => {
        const tcNo = (row[0] || '').trim();
        return [mapping[tcNo] || ''];
    });

    // Step 1g: Write col C values in one batch
    if (colCValues.length > 0) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${AUTO_SHEET}!C2:C${colCValues.length + 1}`,
            valueInputOption: 'RAW',
            requestBody: { values: colCValues },
        });
        const filled = colCValues.filter(r => r[0]).length;
        console.log(`  Filled ${filled} of ${colCValues.length} rows with original TC IDs.`);
    }

    // ══════════════════════════════════════════════════════════════════════
    // TASK 3 — Update NH-HS-001..NH-HS-020 in "📋 All Tests" sheet
    // ══════════════════════════════════════════════════════════════════════
    console.log('\n── Task 3: Updating NH-HS-001..NH-HS-020 in', ALL_SHEET, '──');

    // Read header row first (row 4 = index 3 → contains column names)
    const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${ALL_SHEET}!A4:Z4`,
    });
    const headers = (headerRes.data.values || [[]])[0];
    console.log('  Header row:', headers.join(' | '));

    // Find "Is-Automate?" / "Is Automated" / similar column
    const isAutoColIdx = headers.findIndex(h =>
        /automat/i.test(h) || /is.auto/i.test(h)
    );
    const statusColIdx = headers.findIndex(h =>
        /status/i.test(h) && !/automat/i.test(h)
    );

    console.log(`  Is-Automate col index: ${isAutoColIdx} (col ${colLetter(isAutoColIdx)})`);
    console.log(`  Status col index: ${statusColIdx} (col ${colLetter(statusColIdx)})`);

    // Read data rows (starting row 5 = index 4)
    const allDataRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${ALL_SHEET}!A5:Z2000`,
    });
    const allRows = allDataRes.data.values || [];

    // Find rows with TC IDs matching NH-HS-001 through NH-HS-020
    const nhIds = new Set();
    for (let n = 1; n <= 20; n++) {
        nhIds.add(`NH-HS-${String(n).padStart(3, '0')}`);
    }

    const valueUpdates  = [];
    const formatUpdates = [];

    allRows.forEach((row, i) => {
        const tcId = (row[1] || '').trim();   // col B = Test-Case-ID
        if (!nhIds.has(tcId)) return;

        const sheetRow    = i + 5;    // 1-indexed (data starts row 5)
        const sheetRowIdx = i + 4;    // 0-based

        // Update Is-Automate? to "Yes"
        if (isAutoColIdx >= 0) {
            const colLet = colLetter(isAutoColIdx);
            valueUpdates.push({
                range: `${ALL_SHEET}!${colLet}${sheetRow}`,
                values: [['Yes']],
            });
        }

        // Highlight the Sr No (col A) and Test-Case-ID (col B) cells green + bold
        formatUpdates.push({
            repeatCell: {
                range: {
                    sheetId:          allSheetId,
                    startRowIndex:    sheetRowIdx,
                    endRowIndex:      sheetRowIdx + 1,
                    startColumnIndex: 0,
                    endColumnIndex:   2,
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.714, green: 0.914, blue: 0.714 },
                        textFormat: { bold: true },
                    }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
            }
        });

        console.log(`  ${tcId} → row ${sheetRow} updated`);
    });

    if (valueUpdates.length > 0) {
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SHEET_ID,
            requestBody: {
                valueInputOption: 'RAW',
                data: valueUpdates,
            }
        });
    }

    if (formatUpdates.length > 0) {
        const BATCH = 200;
        for (let i = 0; i < formatUpdates.length; i += BATCH) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SHEET_ID,
                requestBody: { requests: formatUpdates.slice(i, i + BATCH) },
            });
        }
    }

    console.log(`\n✅ Done!`);
    console.log(`   Task 1: "All Sheet - Test Case ID" column added to "${AUTO_SHEET}"`);
    console.log(`   Task 3: ${valueUpdates.length} NH-HS rows updated in "${ALL_SHEET}"`);
    console.log(`\n⚠️  IMPORTANT: syncSheet.js and updateResults.js have been updated`);
    console.log(`   to use the new 12-column layout. Do NOT run addAllSheetColumn.js again.`);
    console.log(`\n   Open: https://docs.google.com/spreadsheets/d/${SHEET_ID}`);
}

// Convert 0-based column index to letter (0=A, 1=B, 2=C, ...)
function colLetter(idx) {
    if (idx < 0) return '?';
    let letter = '';
    let n = idx;
    while (n >= 0) {
        letter = String.fromCharCode(65 + (n % 26)) + letter;
        n = Math.floor(n / 26) - 1;
    }
    return letter;
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });