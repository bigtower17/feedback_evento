/**
 * Google Apps Script per raccolta feedback eventi - VERSIONE CORRETTA CORS
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
 * 5. Sostituisci TUTTO il codice con questo file
 * 6. Salva il progetto
 * 7. Vai su Deploy > New Deployment
 * 8. Tipo: Web app
 * 9. Execute as: Me
 * 10. Who has access: Anyone
 * 11. Clicca Deploy
 * 12. Copia l'URL del deployment nell'app React
 */

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function doOptions(e) {
  return createCorsResponse('OPTIONS request handled');
}

function handleRequest(e) {
  try {
    Logger.log('Request received at: ' + new Date().toISOString());
    Logger.log('Request method: ' + (e.parameter ? 'GET' : 'POST'));
    
    if (!e.postData || !e.postData.contents) {
      return createCorsResponse('GET request - endpoint is working!');
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

    // Aggiungi la riga
    sheet.appendRow(row);
    Logger.log('Row successfully appended to sheet');

    return createCorsResponse(JSON.stringify({ status: 'success' }));
    
  } catch (error) {
    Logger.log('Error: ' + (error.message || error));
    return createCorsResponse(JSON.stringify({ status: 'error', message: error.message || 'Unknown error' }));
  }
}

function createCorsResponse(content) {
  const output = ContentService.createTextOutput(content);
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Headers CORS completi
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  output.setHeader('Access-Control-Max-Age', '86400');
  
  return output;
}

/**
 * STRUTTURA DATI CHE ARRIVANO DALL'APP:
 * {
 *   "timestamp": "2025-08-26T19:40:09.827Z",
 *   "name": "Beniamino Torregrossa",
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
 *       "rating": 4
 *     },
 *     // ... altre 8 domande
 *   ]
 * }
 */