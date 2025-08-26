/**
 * Google Apps Script compatibile con la struttura originale
 * Gestisce sia la logica originale che quella del feedback
 */

function doGet(e) {
  Logger.log('Request received at: ' + new Date().toISOString());
  
  try {
    if (!e.parameter || !e.parameter.data) {
      return createCorsResponse(JSON.stringify({ status: 'success', message: 'Endpoint working!' }));
    }
    
    Logger.log('Received data: ' + e.parameter.data);
    const data = JSON.parse(decodeURIComponent(e.parameter.data));
    
    if (!data.name) {
      throw new Error('Missing required field: name');
    }
    
    Logger.log('Parsed data: ' + JSON.stringify(data));

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Feedback Responses');
    if (!sheet) {
      throw new Error('Sheet "Feedback Responses" not found');
    }

    // Gestisce sia answers (stringhe) che feedbackResponses (oggetti)
    let answers = [];
    
    if (data.answers && Array.isArray(data.answers)) {
      // Usa gli answers se disponibili (formato stringa)
      answers = data.answers.slice(0, 10); // Massimo 10 risposte
    } else if (data.feedbackResponses && Array.isArray(data.feedbackResponses)) {
      // Altrimenti usa feedbackResponses
      answers = data.feedbackResponses.map(response => 
        `${response.question}: ${response.rating}/5`
      );
    }
    
    // Assicurati che ci siano esattamente 10 colonne per le risposte
    while (answers.length < 10) {
      answers.push('');
    }

    const row = [
      data.timestamp || new Date().toISOString(), // Column 1: Timestamp
      data.name || '',                            // Column 2: Name
      data.ragionesociale || '',                  // Column 3: Ragione Sociale  
      data.email || '',                           // Column 4: Email
      data.phone || '',                           // Column 5: Phone
      data.consent ? 'Yes' : 'No',                // Column 6: Consent
      data.score || 0,                            // Column 7: Score
      ...answers                                  // Columns 8-17: Answers (10 columns)
    ];

    Logger.log('Row to append (length: ' + row.length + '): ' + JSON.stringify(row));

    // Verifica il numero di colonne del foglio
    const lastColumn = sheet.getLastColumn();
    Logger.log('Spreadsheet last column: ' + lastColumn);
    if (lastColumn < 17) {
      Logger.log('Warning: Spreadsheet has fewer than 17 columns');
    }

    // Aggiungi la riga
    sheet.appendRow(row);
    Logger.log('Row successfully appended to sheet');

    // Verifica l'ultima riga scritta
    const lastRow = sheet.getLastRow();
    const writtenRow = sheet.getRange(lastRow, 1, 1, Math.min(17, lastColumn)).getValues()[0];
    Logger.log('Written row (length: ' + writtenRow.length + '): ' + JSON.stringify(writtenRow));

    return createCorsResponse(JSON.stringify({ status: 'success' }));
    
  } catch (error) {
    Logger.log('Error: ' + (error.message || error));
    return createCorsResponse(JSON.stringify({ status: 'error', message: error.message || 'Unknown error' }));
  }
}

function doPost(e) {
  return doGet(e);
}

function createCorsResponse(content) {
  const output = ContentService.createTextOutput(content);
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return output;
}

/**
 * STRUTTURA GOOGLE SHEET RICHIESTA:
 * 
 * Colonne (17 totali):
 * A: Timestamp
 * B: Nome  
 * C: Ragione Sociale
 * D: Email
 * E: Phone
 * F: Consent
 * G: Score
 * H-Q: Answers (10 colonne per le risposte)
 * 
 * ESEMPIO DATI:
 * - Timestamp: 2025-08-26T19:49:52.763Z
 * - Nome: Beniamino Torregrossa
 * - Score: 5 (media dei voti)
 * - Answers: ["L'organizzazione...: 5/5", "La location...: 5/5", ...]
 */