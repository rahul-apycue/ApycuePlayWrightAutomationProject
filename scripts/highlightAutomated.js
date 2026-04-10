/**
 * highlightAutomated.js  —  Task 1
 *
 * Reads all spec files, collects every TC_XX_XXX id referenced in comments,
 * then highlights the Sr No + Test-Case-ID cells in "📋 All Tests" sheet
 * with a green background so it's clear which tests are automated.
 *
 * Run: node scripts/highlightAutomated.js
 */

const { google } = require('googleapis');
const fs   = require('fs');
const path = require('path');

const SHEET_ID   = '1VFrXQQW3NlHUUrQl2Yi6QvYe6_44Bc1xbS8u3pU1Lqs';
const SHEET_NAME = '📋 All Tests';
const CREDS      = require('C:/Users/rahul/Downloads/playwrighttestsheet-361dae63531f.json');
const TESTS_DIR  = path.join(__dirname, '../tests');

// ── 1. Collect all TC_XX_XXX IDs that have automation scripts ──────────────
function getAutomatedTcIds() {
    const ids = new Set();
    const specFiles = fs.readdirSync(TESTS_DIR).filter(f => f.endsWith('.spec.ts'));
    for (const file of specFiles) {
        const content = fs.readFileSync(path.join(TESTS_DIR, file), 'utf8');
        const matches = content.match(/TC_[A-Z]+_\d+/g) || [];
        matches.forEach(id => ids.add(id));
    }
    return ids;
}

async function main() {
    const automatedIds = getAutomatedTcIds();
    console.log(`Automated TC IDs found in scripts: ${automatedIds.size}`);

    const auth = new google.auth.GoogleAuth({
        credentials: CREDS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // ── 2. Get sheet metadata (sheetId) ────────────────────────────────────
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetMeta = meta.data.sheets.find(s => s.properties.title === SHEET_NAME);
    const sheetId   = sheetMeta.properties.sheetId;

    // ── 3. Read all data rows (sheet data starts at row 5 → index 4) ───────
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A5:B2000`,
    });
    const rows = res.data.values || [];
    console.log(`Total rows in sheet: ${rows.length}`);

    // ── 4. Find matching row indices ────────────────────────────────────────
    const automatedRowIndices = [];   // 0-based sheet row index
    const normalRowIndices    = [];

    rows.forEach((row, i) => {
        const tcId = (row[1] || '').trim();
        const sheetRowIndex = i + 4; // row 5 in sheet = index 4
        if (tcId && automatedIds.has(tcId)) {
            automatedRowIndices.push(sheetRowIndex);
        } else if (tcId) {
            normalRowIndices.push(sheetRowIndex);
        }
    });

    console.log(`Rows to highlight (automated): ${automatedRowIndices.length}`);

    if (automatedRowIndices.length === 0) {
        console.log('No matching rows found.');
        return;
    }

    // ── 5. Build batchUpdate requests ──────────────────────────────────────
    //   Highlight: green background + bold for automated rows (cols A & B)
    //   Reset:     white background for non-automated rows
    const requests = [];

    // Green highlight for automated rows
    for (const rowIdx of automatedRowIndices) {
        requests.push({
            repeatCell: {
                range: {
                    sheetId,
                    startRowIndex: rowIdx,
                    endRowIndex:   rowIdx + 1,
                    startColumnIndex: 0,
                    endColumnIndex:   2,
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.714, green: 0.914, blue: 0.714 }, // green
                        textFormat: { bold: true },
                    }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
            }
        });
    }

    // Reset non-automated rows to default (light blue — matches sheet theme)
    for (const rowIdx of normalRowIndices) {
        requests.push({
            repeatCell: {
                range: {
                    sheetId,
                    startRowIndex: rowIdx,
                    endRowIndex:   rowIdx + 1,
                    startColumnIndex: 0,
                    endColumnIndex:   2,
                },
                cell: {
                    userEnteredFormat: {
                        backgroundColor: { red: 0.949, green: 0.961, blue: 0.988 }, // light blue
                        textFormat: { bold: false },
                    }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
            }
        });
    }

    // ── 6. Send in batches of 200 requests ─────────────────────────────────
    const BATCH = 200;
    for (let i = 0; i < requests.length; i += BATCH) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SHEET_ID,
            requestBody: { requests: requests.slice(i, i + BATCH) },
        });
        console.log(`  Formatting batch ${Math.floor(i/BATCH)+1} done`);
    }

    console.log(`\n✅ Done! ${automatedRowIndices.length} rows highlighted green in "${SHEET_NAME}".`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });