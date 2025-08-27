export interface FeedbackQuestion {
  questionText: string;
  category?: string;
}

export const questions: FeedbackQuestion[] = [
  {
    questionText: 'L\'organizzazione generale dell\'evento è stata efficace',
    category: 'Organizzazione'
  },
  {
    questionText: 'La location scelta era adeguata e accessibile',
    category: 'Organizzazione'
  },
  {
    questionText: 'Il programma dell\'evento era chiaro e ben strutturato',
    category: 'Programma'
  },
  {
    questionText: 'I contenuti presentati erano interessanti e rilevanti',
    category: 'Contenuti'
  },
  {
    questionText: 'I relatori erano preparati e coinvolgenti',
    category: 'Relatori'
  },
  {
    questionText: 'Sei stato soddisfatto delle occasioni di incontro e confronto con gli altri partecipanti?',
    category: 'Networking'
  },
  {
    questionText: 'Il catering e i servizi offerti erano di qualità',
    category: 'Servizi'
  },
  {
    questionText: 'La durata dell\'evento era appropriata',
    category: 'Programma'
  },
  {
    questionText: 'Consiglierei questo evento ad altri colleghi/amici',
    category: 'Generale'
  },
  {
    questionText: 'Nel complesso, sono soddisfatto dell\'evento',
    category: 'Generale'
  }
];