// Frågor och facit för Professor Mycels Biolabb. Redigera här.
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
//  i18n      översättningar per språk (da, no, en). Texten används när besökaren har valt
//            det språket. Saknas ett språk visas svenska.
//    title     rubriken (den svenska rubriken visas i parentes under)
//    question  frågan (bara översättningen visas)
//    options   alternativen, i SAMMA ordning som options ovan. Det svenska ordet visas i
//              parentes efter, så att man kan matcha det mot ordet under luckan.
//    note      professorns anteckning, som en lista med stycken. Visas när man trycker på i.
//
window.QUIZ = [
  {
    id: 'kretslopp',
    title: 'Det slutna kretsloppet',
    symbol: 'terrarium',
    question: 'Vad behöver svampen för att inte torka ut?',
    options: ['TID', 'FUKT', 'SILVER'],
    answer: 1,
    i18n: {
      da: {
        title: 'Det lukkede kredsløb',
        question: 'Hvad skal svampen have for ikke at tørre ud?',
        options: ['TID', 'FUGT', 'SØLV'],
        note: ['Jeg ser noget vigtigt.', 'Det lille system tørrer aldrig ud.', 'Måske har mine svampe også brug for …']
      },
      no: {
        title: 'Det lukkede kretsløpet',
        question: 'Hva trenger soppen for ikke å tørke ut?',
        options: ['TID', 'FUKT', 'SØLV'],
        note: ['Jeg ser noe viktig.', 'Det lille systemet tørker aldri ut.', 'Kanskje soppene mine også trenger …']
      },
      en: {
        title: 'The Closed Cycle',
        question: "What does the fungus need so it doesn't dry out?",
        options: ['TIME', 'MOISTURE', 'SILVER'],
        note: ['I see something important.', 'The little system never dries out.', 'Maybe my fungi also need …']
      }
    }
  },
  {
    id: 'mogel',
    title: 'Mögel i skafferiet',
    symbol: 'brodskiva',
    question: 'Vad behöver möglet ur luften för att växa?',
    options: ['SYRE', 'SÅPBUBBLOR', 'ARSENIK'],
    answer: 0,
    i18n: {
      da: {
        title: 'Skimmel i spisekammeret',
        question: 'Hvad har skimmelsvampen brug for fra luften for at vokse?',
        options: ['ILT', 'SÆBEBOBLER', 'ARSEN'],
        note: [
          'Samme brød. Samme temperatur. Samme tid.',
          'Alligevel vokser den grønne skimmel forskelligt.',
          'Jeg ændrede kun luften omkring dem.',
          'Hvad er det i luften, som de fleste af mine skimmelsvampe har brug for?'
        ]
      },
      no: {
        title: 'Mugg i spiskammeret',
        question: 'Hva trenger muggsoppen fra luften for å vokse?',
        options: ['OKSYGEN', 'SÅPEBOBLER', 'ARSEN'],
        note: [
          'Samme brød. Samme temperatur. Samme tid.',
          'Likevel vokser den grønne muggen ulikt.',
          'Jeg endret bare luften rundt dem.',
          'Hva er det i luften som de fleste av muggsoppene mine trenger?'
        ]
      },
      en: {
        title: 'Mold in the Pantry',
        question: 'What does mold need from the air to grow?',
        options: ['OXYGEN', 'SOAP BUBBLES', 'ARSENIC'],
        note: [
          'Same bread. Same temperature. Same time.',
          'Yet the green mold grows better on some than on others.',
          'I only changed the air around them.',
          'What is it in the air that most of my molds need?'
        ]
      }
    }
  },
  {
    id: 'slemsvamp',
    title: 'Slemsvampslabyrinten',
    symbol: 'labyrint',
    question: 'Vad söker slemsvampen sig till?',
    options: ['SALTKARET', 'LJUS', 'NÄRING'],
    answer: 2,
    i18n: {
      da: {
        title: 'Slimsvampelabyrinten',
        question: 'Hvad søger slimsvampen hen imod?',
        options: ['SALTKARRET', 'LYS', 'NÆRING'],
        note: [
          'Ingen svamp. Ingen hjerne. Ingen mund. Ingen øjne.',
          'Alligevel finder den og vælger en vej …',
          'altid den, der fører til …'
        ]
      },
      no: {
        title: 'Slimsopplabyrinten',
        question: 'Hva søker slimsoppen seg til?',
        options: ['SALTKARET', 'LYS', 'NÆRING'],
        note: [
          'Ingen sopp. Ingen hjerne. Ingen munn. Ingen øyne.',
          'Likevel finner den og velger en vei …',
          'alltid den som fører til …'
        ]
      },
      en: {
        title: 'The Slime Mold Maze',
        question: 'What does the slime mold move towards?',
        options: ['THE SALT SHAKER', 'LIGHT', 'NUTRIENTS'],
        note: [
          'No fungus. No brain. No mouth. No eyes.',
          'Yet it finds and chooses a path …',
          'always the one that leads to …'
        ]
      }
    }
  },
  {
    id: 'mikroskop',
    title: 'Det mikroskopiska riket',
    symbol: 'mikroskop',
    question: 'Hur sprider sig svampar?',
    options: ['SPORER', 'RÖTTERNA', 'FRÖN', 'BREVBÄRAREN'],
    answer: 0,
    i18n: {
      da: {
        title: 'Det mikroskopiske rige',
        question: 'Hvordan spreder svampe sig?',
        options: ['SPORER', 'RØDDERNE', 'FRØ', 'POSTBUDDET'],
        note: [
          'Med det blotte øje ser jeg næsten ingenting.',
          'Men under linsen skjuler sig det, der spreder svampene videre.'
        ]
      },
      no: {
        title: 'Det mikroskopiske riket',
        question: 'Hvordan sprer sopp seg?',
        options: ['SPORER', 'RØTTENE', 'FRØ', 'POSTBUDET'],
        note: [
          'Med det blotte øye ser jeg nesten ingenting.',
          'Men under linsen skjuler det seg noe som sprer soppene videre.'
        ]
      },
      en: {
        title: 'The Microscopic Kingdom',
        question: 'How do fungi spread?',
        options: ['SPORES', 'THE ROOTS', 'SEEDS', 'THE MAIL CARRIER'],
        note: [
          'With the naked eye I see almost nothing.',
          'But under the lens hides what spreads the fungi onward.'
        ]
      }
    }
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
    answer: 2,
    i18n: {
      da: {
        title: 'Zombieinsektet',
        question: 'Hvorfor vil svampen have, at myren skal kravle op?',
        options: [
          'FOR AT *HOPPE* NED IGEN',
          'FORDI DET ER *SJOVT*',
          'FORDI MYREN BLIVER SVAMPENS *VÆRT*'
        ],
        note: [
          'Jeg studerer svampe. Men noget er mærkeligt.',
          'Jeg så en myre, der kravlede op ad et græsstrå.',
          'Den må have været syg, for oppe på strået døde myren, og ud af den voksede en svamp.',
          'Det så ud, som om svampen styrede myren opad,',
          'MEN HVORFOR?'
        ]
      },
      no: {
        title: 'Zombieinsektet',
        question: 'Hvorfor vil soppen at mauren skal klatre opp?',
        options: [
          'FOR Å *HOPPE* NED IGJEN',
          'FORDI DET ER *MORSOMT*',
          'FORDI MAUREN BLIR SOPPENS *VERT*'
        ],
        note: [
          'Jeg studerer sopp. Men noe er merkelig.',
          'Jeg så en maur som klatret opp et gresstrå.',
          'Den må ha vært syk, for oppe på strået døde mauren, og ut av den vokste det en sopp.',
          'Det så ut som soppen styrte mauren oppover,',
          'MEN HVORFOR?'
        ]
      },
      en: {
        title: 'The Zombie Insect',
        question: 'Why does the fungus want the ant to climb up?',
        options: [
          'TO *JUMP* DOWN AGAIN',
          'BECAUSE IT IS *FUN*',
          "BECAUSE THE ANT BECOMES THE FUNGUS'S *HOST*"
        ],
        note: [
          'I study fungi. But something is strange.',
          'I saw an ant climbing up a blade of grass.',
          'It must have been sick, because up on the blade the ant died and a fungus grew out of it.',
          'It looked like the fungus was steering the ant upwards,',
          'BUT WHY?'
        ]
      }
    }
  },
  {
    id: 'matglas',
    title: 'Mätglasens mönster',
    symbol: 'provror',
    question: 'Hur verkar svamparna vilja ha det för att må bra?',
    options: ['STORM', 'KAOS', 'BALANS'],
    answer: 2,
    i18n: {
      da: {
        title: 'Måleglassets mønster',
        question: 'Hvordan ser svampene ud til at ville have det for at trives?',
        options: ['STORM', 'KAOS', 'BALANCE'],
        note: [
          'JEG LEDER EFTER MØNSTRE…',
          'Jeg gav dem mad.',
          'Jeg gav dem vand.',
          'Jeg gav dem luft.',
          'Men det var ikke nok bare at have meget af én ting.',
          'DET VIRKER, SOM OM DER BEHØVES LIGE MEGET AF ALT.',
          'Måske skal svampenes liv også være i…'
        ]
      },
      no: {
        title: 'Målglassets mønster',
        question: 'Hvordan ser det ut til at soppene vil ha det for å trives?',
        options: ['STORM', 'KAOS', 'BALANSE'],
        note: [
          'JEG LETER ETTER MØNSTRE…',
          'Jeg ga dem mat.',
          'Jeg ga dem vann.',
          'Jeg ga dem luft.',
          'Men det holdt ikke å bare ha mye av én ting.',
          'DET SER UT TIL AT DET TRENGS LIKE MYE AV ALT.',
          'Kanskje må også soppenes liv være i…'
        ]
      },
      en: {
        title: 'The Pattern in the Measuring Glasses',
        question: 'How do the fungi seem to want things to be in order to thrive?',
        options: ['STORM', 'CHAOS', 'BALANCE'],
        note: [
          'I AM LOOKING FOR PATTERNS…',
          'I gave them food.',
          'I gave them water.',
          'I gave them air.',
          'But it was not enough to just have a lot of one thing.',
          'IT SEEMS WE NEED JUST AS MUCH OF EVERYTHING.',
          'Maybe the lives of the fungi must also be in…'
        ]
      }
    }
  }
];
