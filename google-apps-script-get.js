/**
 * Google Apps Script per raccolta feedback eventi - VERSIONE GET (NO CORS)
 * 
 * Questa versione usa richieste GET per evitare problemi CORS
 * I dati vengono passati come parametro URL
 */

function doGet(e) {
  try {
    Logger.log('GET Request received at: ' + new Date().toISOString());
    Logger.log('Parameters:', JSON.stringify(e.parameter));
    
    // Se non c'è il parametro 'data', è solo un test dell'endpoint
    if (!e.parameter.data) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', message: 'Endpoint is working!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse dei dati JSON dal parametro
    const data = JSON.parse(e.parameter.data);
    Logger.log('Parsed data:', JSON.stringify(data));
    
    if (!data.name) {
      throw new Error('Missing required field: name');
    }

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

    Logger.log('Row to append (length: ' + row.length + '):', JSON.stringify(row));

    // Aggiungi la riga
    sheet.appendRow(row);
    Logger.log('Row successfully appended to sheet');

    // Risposta di successo
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + (error.message || error));
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.message || 'Unknown error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // Fallback per eventuali richieste POST
  return doGet(e);
}

/**
 * COME FUNZIONA:
 * 1. L'app React invia una richiesta GET con i dati nel parametro 'data'
 * 2. Lo script riceve i dati dal parametro URL
 * 3. Parse dei dati JSON e salvataggio nel Google Sheet
 * 4. Le richieste GET non hanno problemi CORS come le POST
 * 
 * URL ESEMPIO:
 * https://script.google.com/.../exec?data={"timestamp":"...","name":"...","feedbackResponses":[...]}
 */