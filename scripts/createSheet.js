const { google } = require('googleapis');
const SHEET_ID = '1VFrXQQW3NlHUUrQl2Yi6QvYe6_44Bc1xbS8u3pU1Lqs';
const CREDS = require('C:/Users/rahul/Downloads/playwrighttestsheet-361dae63531f.json');

async function main() {
    const auth = new google.auth.GoogleAuth({
        credentials: CREDS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Step 1: Create new sheet tab
    const addSheet = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
            requests: [{
                addSheet: {
                    properties: {
                        title: '🤖 Automation Test Cases',
                        gridProperties: { rowCount: 1000, columnCount: 11 }
                    }
                }
            }]
        }
    });

    const newSheetId = addSheet.data.replies[0].addSheet.properties.sheetId;
    console.log('New sheet created. ID:', newSheetId);

    // Step 2: Add headers
    const headers = [
        'Sr No', 'Test Case ID', 'Test Case Title', 'Execution Steps',
        'Expected Result', 'Actual Result', 'Priority', 'Status / Result',
        'Is Automated', 'Attachment', 'Remark'
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: '🤖 Automation Test Cases!A1:K1',
        valueInputOption: 'RAW',
        requestBody: { values: [headers] }
    });
    console.log('Headers added');

    // Step 3: Apply all formatting in one batchUpdate
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
            requests: [
                // Freeze row 1 and first 2 columns
                {
                    updateSheetProperties: {
                        properties: {
                            sheetId: newSheetId,
                            gridProperties: {
                                frozenRowCount: 1,
                                frozenColumnCount: 2
                            }
                        },
                        fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount'
                    }
                },
                // Header row - dark blue background, white bold text
                {
                    repeatCell: {
                        range: { sheetId: newSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 11 },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 0.153, green: 0.306, blue: 0.612 },
                                textFormat: {
                                    bold: true,
                                    fontSize: 11,
                                    foregroundColor: { red: 1, green: 1, blue: 1 }
                                },
                                horizontalAlignment: 'CENTER',
                                verticalAlignment: 'MIDDLE',
                                wrapStrategy: 'WRAP'
                            }
                        },
                        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)'
                    }
                },
                // Header row height 45px
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'ROWS', startIndex: 0, endIndex: 1 },
                        properties: { pixelSize: 45 },
                        fields: 'pixelSize'
                    }
                },
                // Col A - Sr No (60px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 },
                        properties: { pixelSize: 60 },
                        fields: 'pixelSize'
                    }
                },
                // Col B - Test Case ID (130px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 },
                        properties: { pixelSize: 130 },
                        fields: 'pixelSize'
                    }
                },
                // Col C - Test Case Title (280px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 },
                        properties: { pixelSize: 280 },
                        fields: 'pixelSize'
                    }
                },
                // Col D - Execution Steps (280px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 },
                        properties: { pixelSize: 280 },
                        fields: 'pixelSize'
                    }
                },
                // Col E - Expected Result (220px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 },
                        properties: { pixelSize: 220 },
                        fields: 'pixelSize'
                    }
                },
                // Col F - Actual Result (220px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 },
                        properties: { pixelSize: 220 },
                        fields: 'pixelSize'
                    }
                },
                // Col G - Priority (90px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 6, endIndex: 7 },
                        properties: { pixelSize: 90 },
                        fields: 'pixelSize'
                    }
                },
                // Col H - Status / Result (120px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 7, endIndex: 8 },
                        properties: { pixelSize: 120 },
                        fields: 'pixelSize'
                    }
                },
                // Col I - Is Automated (110px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 8, endIndex: 9 },
                        properties: { pixelSize: 110 },
                        fields: 'pixelSize'
                    }
                },
                // Col J - Attachment (110px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 9, endIndex: 10 },
                        properties: { pixelSize: 110 },
                        fields: 'pixelSize'
                    }
                },
                // Col K - Remark (180px)
                {
                    updateDimensionProperties: {
                        range: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 10, endIndex: 11 },
                        properties: { pixelSize: 180 },
                        fields: 'pixelSize'
                    }
                },
                // Data rows - light blue background, wrap text
                {
                    repeatCell: {
                        range: { sheetId: newSheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: 11 },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 0.949, green: 0.961, blue: 0.988 },
                                textFormat: { fontSize: 10 },
                                verticalAlignment: 'MIDDLE',
                                wrapStrategy: 'WRAP'
                            }
                        },
                        fields: 'userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)'
                    }
                },
                // Borders for all cells
                {
                    updateBorders: {
                        range: { sheetId: newSheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: 11 },
                        top:    { style: 'SOLID', width: 1, color: { red: 0.7, green: 0.7, blue: 0.7 } },
                        bottom: { style: 'SOLID', width: 1, color: { red: 0.7, green: 0.7, blue: 0.7 } },
                        left:   { style: 'SOLID', width: 1, color: { red: 0.7, green: 0.7, blue: 0.7 } },
                        right:  { style: 'SOLID', width: 1, color: { red: 0.7, green: 0.7, blue: 0.7 } },
                        innerHorizontal: { style: 'SOLID', width: 1, color: { red: 0.85, green: 0.85, blue: 0.85 } },
                        innerVertical:   { style: 'SOLID', width: 1, color: { red: 0.85, green: 0.85, blue: 0.85 } }
                    }
                },
                // Center align Sr No (A)
                {
                    repeatCell: {
                        range: { sheetId: newSheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: 1 },
                        cell: { userEnteredFormat: { horizontalAlignment: 'CENTER' } },
                        fields: 'userEnteredFormat.horizontalAlignment'
                    }
                },
                // Center align Priority, Status, Is Automated (G, H, I)
                {
                    repeatCell: {
                        range: { sheetId: newSheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 6, endColumnIndex: 9 },
                        cell: { userEnteredFormat: { horizontalAlignment: 'CENTER' } },
                        fields: 'userEnteredFormat.horizontalAlignment'
                    }
                }
            ]
        }
    });

    console.log('All formatting applied!');
    console.log('Done! Open your sheet to see the new tab.');
}

main().catch(console.error);