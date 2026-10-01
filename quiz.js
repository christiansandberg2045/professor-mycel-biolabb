// Frågor och facit för Professor Mycels Biolab. Redigera här.
//
//  id        unikt namn (bokstäver utan mellanslag)
//  title     stationens namn
//  symbol    filnamn i assets/img/symbols (utan .png)
//  question  frågan som visas i den svarta etiketten
//  options   orden i den ordning de visas
//  answer    vilket alternativ som är rätt (0 = första, 1 = andra, ...)
//  *stjärnor* runt ett ord i ett alternativ gör det extra tydligt
//  och är det som visas på symbolrutan.
//
window.QUIZ = [
  {
    id: 'kretslopp',
    title: 'Det slutna kretsloppet',
    symbol: 'terrarium',
    question: 'Vad behöver svampen för att inte torka ut?',
    options: ['TID', 'FUKT', 'SILVER'],
    answer: 1
  },
  {
    id: 'mogel',
    title: 'Mögel i skafferiet',
    symbol: 'brodskiva',
    question: 'Vad behöver möglet ur luften för att växa?',
    options: ['SYRE', 'KUL', 'ARSENIK'],
    answer: 0
  },
  {
    id: 'slemsvamp',
    title: 'Slemsvampslabyrinten',
    symbol: 'labyrint',
    question: 'Vad söker slemsvampen sig till?',
    options: ['SALT', 'LJUS', 'NÄRING'],
    answer: 2
  },
  {
    id: 'mikroskop',
    title: 'Det mikroskopiska riket',
    symbol: 'mikroskop',
    question: 'Hur sprider sig svampar?',
    options: ['SPORER', 'RÖTTER', 'FRÖN', 'MED POSTEN'],
    answer: 0
  },
  {
    id: 'zombie',
    title: 'Zombieinsekten',
    symbol: 'myra',
    question: 'Varför vill svampen att myran ska klättra upp?',
    options: [
      'FÖR ATT *HOPPA* NER IGEN',
      'FÖR ATT DET ÄR *ROLIGT*',
      'FÖR ATT MYRAN BLIR SVAMPENS *VÄRD*'
    ],
    answer: 2
  },
  {
    id: 'matglas',
    title: 'Mätglasens mönster',
    symbol: 'provror',
    question: 'Hur verkar svamparna vilja ha det för att må bra?',
    options: ['STORM', 'KAOS', 'BALANS'],
    answer: 2
  }
];
