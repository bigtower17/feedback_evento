/**
 * Google Apps Script per raccolta feedback eventi
 * 
 * ISTRUZIONI PER L'INSTALLAZIONE:
 * 1. Crea un nuovo Google Sheet chiamato "Feedback Eventi"
 * 2. Rinomina il foglio in "Feedback Responses"
 * 3. Aggiungi le seguenti intestazioni nella riga 1:
 *    A1: Timestamp
 *    B1: Nome
 *    C1: Domanda_1
 *    D1: Voto_1
 *    E1: Domanda_2
 *    F1: Voto_2
 *    ... e così via fino a Domanda_10 e Voto_10 (22 colonne totali)
 * 4. Vai su Estensioni > Apps Script
 * 5. Sostituisci il codice con questo file
 * 6. Salva e pubblica come Web App
 * 7. Copia l'URL del deployment e aggiornalo nell'app React
 */

function doPost(e) {
  Logger.log('Request received at: ' + new Date().toISOString());
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Invalid or missing POST data');
    }
    Logger.log('Received data: ' + e.postData.contents);
    const data = JSON.parse(e.postData.contents);
    
    if (!data.name) {
      throw new Error('Missing required field: name');
    }
    Logger.log('Parsed data: ' + JSON.stringify(data));

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Feedback Responses');
    if (!sheet) {
      throw new Error('Sheet "Feedback Responses" not found');
    }

    // Prepara le risposte del feedback (fino a 10 domande)
    const feedbackData = [];
    if (data.feedbackResponses && Array.isArray(data.feedbackResponses)) {
      data.feedbackResponses.forEach(response => {
        feedbackData.push(response.question || '');
        feedbackData.push(response.rating || 0);
      });
    }
    
    // Assicurati che ci siano esattamente 20 colonne per le risposte (10 domande x 2)
    while (feedbackData.length < 20) {
      feedbackData.push('');
    }

    const row = [
      data.timestamp || new Date().toISOString(), // Column 1: Timestamp
      data.name || '',                            // Column 2: Name
      ...feedbackData                             // Columns 3-22: Questions and Ratings
    ];

    Logger.log('Row to append (length: ' + row.length + '): ' + JSON.stringify(row));

    // Verifica il numero di colonne del foglio
    const lastColumn = sheet.getLastColumn();
    Logger.log('Spreadsheet last column: ' + lastColumn);
    if (lastColumn < 22) {
      Logger.log('Warning: Spreadsheet has fewer than 22 columns');
    }

    // Aggiungi la riga
    sheet.appendRow(row);
    Logger.log('Row successfully appended to sheet');

    // Verifica l'ultima riga scritta
    const lastRow = sheet.getLastRow();
    const writtenRow = sheet.getRange(lastRow, 1, 1, Math.min(22, lastColumn)).getValues()[0];
    Logger.log('Written row (length: ' + writtenRow.length + '): ' + JSON.stringify(writtenRow));

    // Risposta con headers CORS
    const output = ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    );
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return output;
    
  } catch (error) {
    Logger.log('Error: ' + (error.message || error));
    
    const errorOutput = ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.message || 'Unknown error' })
    );
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    errorOutput.setHeader('Access-Control-Allow-Origin', '*');
    errorOutput.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    errorOutput.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return errorOutput;
  }
}

function doGet(e) {
  const output = ContentService.createTextOutput('Feedback endpoint is working!');
  output.setMimeType(ContentService.MimeType.TEXT);
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return output;
}

/**
 * STRUTTURA DATI CHE ARRIVANO DALL'APP:
 * {
 *   "timestamp": "2025-01-26T12:34:56.789Z",
 *   "name": "Mario Rossi",
 *   "ragionesociale": "",
 *   "email": "",
 *   "phone": "", 
 *   "consent": false,
 *   "feedbackResponses": [
 *     {
 *       "question": "L'organizzazione generale dell'evento è stata efficace",
 *       "rating": 4
 *     },
 *     {
 *       "question": "La location scelta era adeguata e accessibile",
 *       "rating": 5
 *     },
 *     // ... altre 8 domande
 *   ]
 * }
 *
 * STRUTTURA FINALE NEL GOOGLE SHEET:
 * | Timestamp | Nome | Domanda_1 | Voto_1 | Domanda_2 | Voto_2 | ... | Domanda_10 | Voto_10 |
 * | 2025-...  | Mario| L'org...  | 4      | La loc... | 5      | ... | Nel comp...| 4       |
 */