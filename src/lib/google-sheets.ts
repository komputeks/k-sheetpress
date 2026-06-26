import { google } from 'googleapis';

/**
 * Returns an authenticated JWT object using the service account credentials.
 * Shared between Sheets and Drive clients.
 */
function getAuth() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  );

  if (!privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('Google Service Account credentials not configured. Make sure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are set.');
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });
}

/**
 * Returns an authenticated Google Sheets API client using the service account.
 */
export function getGoogleSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

/**
 * Returns an authenticated Google Drive API client using the service account.
 */
export function getGoogleDriveClient() {
  const auth = getAuth();
  return google.drive({ version: 'v3', auth });
}

/** Column headers for the K-SheetPress spreadsheet */
export const SHEET_COLUMNS = [
  'post_id',
  'post_title',
  'post_slug',
  'cat1',
  'cat2',
  'post_description',
  'post_excerpt',
  'post_content',
  'post_tags',
  'post_status',
  'post_likes',
  'post_comments_count',
  'featured_image',
  'created_at',
  'updated_at',
] as const;

export type SheetColumn = (typeof SHEET_COLUMNS)[number];

/**
 * Initializes a user's Google Sheet with the required column headers and a sample row.
 * Renames the spreadsheet to "K-SheetPress - {username}"
 */
export async function initializeSheet(
  spreadsheetId: string,
  username: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const sheets = getGoogleSheetsClient();
    const drive = getGoogleDriveClient();

    // Rename the spreadsheet via Drive API
    await drive.files.update({
      fileId: spreadsheetId,
      requestBody: { name: `K-SheetPress - ${username}` },
    });

    // Clear existing content on the first row
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'A1:O1',
    });

    // Add column headers
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [SHEET_COLUMNS.map(String)],
      },
    });

    // Add a sample row
    const sampleRow = [
      'sample-001',
      'Welcome to K-SheetPress',
      'welcome-to-k-sheetpress',
      'getting-started',
      'tutorials',
      'Your first post managed through Google Sheets and Supabase',
      'A quick introduction to K-SheetPress',
      '# Welcome to K-SheetPress\n\nThis is your first post. Edit it in Google Sheets or right here in the editor!\n\n## Features\n- Bi-directional sync with Google Sheets\n- Markdown support\n- Category-based permalink structure\n- Real-time updates\n\nHappy writing!',
      'welcome,k-sheetpress,tutorial',
      'published',
      '0',
      '0',
      '',
      new Date().toISOString(),
      new Date().toISOString(),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A2',
      valueInputOption: 'RAW',
      requestBody: { values: [sampleRow] },
    });

    // Bold the header row and format
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: { startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: {
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  backgroundColor: { red: 0.05, green: 0.55, blue: 0.9 },
                },
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor)',
            },
          },
        ],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Sheet initialization error:', error);
    const message = error instanceof Error ? error.message : 'Failed to initialize sheet';

    // Provide more helpful error messages
    if (message.includes('404') || message.includes('not found')) {
      return {
        success: false,
        error: 'Spreadsheet not found. Make sure you shared it with the service account email as Editor.',
      };
    }
    if (message.includes('403') || message.includes('forbidden') || message.includes('permission')) {
      return {
        success: false,
        error: 'Permission denied. Make sure you shared the spreadsheet with the service account email as Editor.',
      };
    }

    return { success: false, error: message };
  }
}

/**
 * Reads all rows from a user's Google Sheet and returns them as objects.
 */
export async function readSheetRows(spreadsheetId: string) {
  const sheets = getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A:O',
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return []; // Skip header row

  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    SHEET_COLUMNS.forEach((col, i) => {
      obj[col] = row[i] || '';
    });
    return obj;
  });
}

/**
 * Writes a single row to the Google Sheet (appends at the end).
 */
export async function appendSheetRow(
  spreadsheetId: string,
  rowData: Record<string, string>
) {
  const sheets = getGoogleSheetsClient();
  const values = SHEET_COLUMNS.map((col) => rowData[col] || '');

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'A:O',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [values] },
  });
}

/**
 * Updates a specific row in the Google Sheet by post_id.
 */
export async function updateSheetRow(
  spreadsheetId: string,
  postId: string,
  rowData: Record<string, string>
) {
  const sheets = getGoogleSheetsClient();

  // Find the row with matching post_id
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A:O',
  });

  const rows = response.data.values;
  if (!rows) return false;

  const rowIndex = rows.findIndex((row) => row[0] === postId);
  if (rowIndex === -1) {
    // Row not found, append instead
    await appendSheetRow(spreadsheetId, rowData);
    return true;
  }

  const values = SHEET_COLUMNS.map((col) => rowData[col] || '');
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `A${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: { values: [values] },
  });

  return true;
}

/**
 * Deletes a row from the Google Sheet by post_id.
 */
export async function deleteSheetRow(
  spreadsheetId: string,
  postId: string
) {
  const sheets = getGoogleSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A:O',
  });

  const rows = response.data.values;
  if (!rows) return false;

  const rowIndex = rows.findIndex((row) => row[0] === postId);
  if (rowIndex === -1) return false;

  // Clear the row content
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `A${rowIndex + 1}:O${rowIndex + 1}`,
  });

  return true;
}
