/**
 * Google Apps Script FINALE - Versione semplificata che funziona
 * 
 * IMPORTANTE: 
 * 1. Nel Google Sheet, crea il foglio "Feedback Responses"
 * 2. Aggiungi le intestazioni: Timestamp, Nome, Domanda_1, Voto_1, etc.
 * 3. Sostituisci TUTTO il codice con questo
 * 4. Salva e pubblica come Web App (Execute as: Me, Access: Anyone)
 */

function doGet(e) {
  // Imposta sempre i headers CORS per tutte le risposte
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  try {
    // Se non ci sono parametri, è solo un test
    if (!e.parameter || !e.parameter.data) {
      return createResponse({ status: 'success', message: 'Endpoint working!' }, headers);
    }
    
    // Parse dei dati
    const data = JSON.parse(decodeURIComponent(e.parameter.data));
    
    if (!data.name) {
      throw new Error('Nome richiesto');
    }
    
    // Accesso al foglio
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Feedback Responses');
    if (!sheet) {
      throw new Error('Foglio "Feedback Responses" non trovato');
    }
    
    // Prepara i dati per il foglio
    const row = [
      data.timestamp || new Date().toISOString(),
      data.name || ''
    ];
    
    // Aggiungi le risposte del feedback
    if (data.feedbackResponses && Array.isArray(data.feedbackResponses)) {
      data.feedbackResponses.forEach(response => {
        row.push(response.question || '');
        row.push(response.rating || 0);
      });
    }
    
    // Inserisci la riga
    sheet.appendRow(row);
    
    return createResponse({ status: 'success', message: 'Dati salvati con successo!' }, headers);
    
  } catch (error) {
    return createResponse({ status: 'error', message: error.message }, headers);
  }
}

function doPost(e) {
  // Redirecta le POST alle GET per compatibilità
  return doGet(e);
}

function createResponse(data, headers) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Applica tutti gli headers CORS
  if (headers) {
    Object.keys(headers).forEach(key => {
      output.setHeader(key, headers[key]);
    });
  }
  
  return output;
}