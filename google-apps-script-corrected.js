/**
 * Google Apps Script CORRETTO - setHeaders invece di setHeader
 */

function doGet(e) {
  try {
    // Se non ci sono parametri, è solo un test
    if (!e.parameter || !e.parameter.data) {
      const output = ContentService.createTextOutput(
        JSON.stringify({ status: 'success', message: 'Endpoint working!' })
      );
      output.setMimeType(ContentService.MimeType.JSON);
      return output;
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
    
    const output = ContentService.createTextOutput(
      JSON.stringify({ status: 'success', message: 'Dati salvati con successo!' })
    );
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
    
  } catch (error) {
    const output = ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.message })
    );
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

function doPost(e) {
  // Redirecta le POST alle GET per compatibilità
  return doGet(e);
}