// Texten från den stora tavlan på väggen, översatt. Visas när man trycker på knappen
// "Läs tavlan" i introduktionen (finns inte på svenska – där är originalet på väggen).
//
//  title          rubriken överst
//  welcomeTitle   rubriken i instruktionsrutan (vänstra delen av tavlan)
//  welcome        stycken i instruktionsrutan
//  warning        den röda varningsetiketten
//  notesTitle     rubriken på professorns anteckningssida (högra delen av tavlan)
//  notes          stycken före raderna med symboler
//  lines          [symbol, text]  –  {4} och {6} blir en tom rad för ordet (antal bokstäver på svenska)
//  notesEnd       stycken efter raderna
window.WALL = {
  da: {
    title: 'Professor Mycels sidste notater:',
    welcomeTitle: 'Velkommen til Professor Mycels Biolab',
    welcome: [
      'Professor Mycel prøvede at forstå svampene – hvordan de lever, vokser, spreder sig og samspiller med andre organismer.',
      'Men noget er gået galt.',
      'Eksperimenterne står stadig tilbage, men flere ord er forsvundet fra notaterne.',
      'Besøg de seks eksperimenter. Læs Mycels ledetråde. Se godt efter. Kun ét er rigtigt.',
      'Løft lugen med det rigtige symbol og find det ord, der mangler i professorens notater.'
    ],
    warning: 'Rør ikke ved noget andet. Eksperimenterne kører stadig…',
    notesTitle: 'Svampene… de er overalt!',
    notes: [
      'Jeg tror, at jeg kan forstå dem.',
      'Jeg vil så gerne opdage, at de er løsningen på fremtidens problemer med mad, medicin og energi…',
      'Jo mere jeg undersøger, jo sværere bliver det.',
      'Og jeg har mistet ordene.',
      'Men jeg observerer og ser, at de danner mycel, et net af tråde.',
      'De nedbryder, bygger op, samarbejder og påvirker deres omgivelser på mærkelige måder…'
    ],
    lines: [
      ['terrarium', 'uden {4} dør de.'],
      ['brodskiva', 'uden {4} klarer de sig ikke.'],
      ['labyrint', 'uden {6} – ingen vækst.'],
      ['mikroskop', 'med {6} spredes de med vinden.'],
      ['myra', 'I en {4} kan de styre og overleve.'],
      ['provror', 'OG uden {6} bliver det kaos!']
    ],
    notesEnd: [
      'Det er sent. De vokser i rørene. De hvisker i krukkerne. Jeg tror, at de ved mere om mig, end jeg ved om dem…',
      'HJÆLP MIG!'
    ]
  },
  no: {
    title: 'Professor Mycels siste notater:',
    welcomeTitle: 'Velkommen til Professor Mycels Biolab',
    welcome: [
      'Professor Mycel prøvde å forstå soppene – hvordan de lever, vokser, sprer seg og samspiller med andre organismer.',
      'Men noe har gått galt.',
      'Eksperimentene står fortsatt igjen, men flere ord har forsvunnet fra notatene.',
      'Besøk de seks eksperimentene. Les Mycels ledetråder. Se nøye etter. Bare ett er riktig.',
      'Løft luken med riktig symbol og finn ordet som mangler i professorens notater.'
    ],
    warning: 'Ikke rør noe annet. Eksperimentene pågår fortsatt…',
    notesTitle: 'Soppene… de er overalt!',
    notes: [
      'Jeg tror at jeg kan forstå dem.',
      'Jeg vil så gjerne oppdage at de er løsningen på framtidens problemer med mat, medisin og energi…',
      'Jo mer jeg undersøker, desto vanskeligere blir det.',
      'Og jeg har mistet ordene.',
      'Men jeg observerer og ser at de danner mycel, et nett av tråder.',
      'De bryter ned, bygger opp, samarbeider og påvirker omgivelsene sine på merkelige måter…'
    ],
    lines: [
      ['terrarium', 'uten {4} dør de.'],
      ['brodskiva', 'uten {4} klarer de seg ikke.'],
      ['labyrint', 'uten {6} – ingen vekst.'],
      ['mikroskop', 'med {6} spres de med vinden.'],
      ['myra', 'I en {4} kan de styre og overleve.'],
      ['provror', 'OG uten {6} blir det kaos!']
    ],
    notesEnd: [
      'Det er sent. De vokser i rørene. De hvisker i krukkene. Jeg tror at de vet mer om meg enn jeg vet om dem…',
      'HJELP MEG!'
    ]
  },
  en: {
    title: "Professor Mycelium's last notes:",
    welcomeTitle: "Welcome to Professor Mycelium's Biolab",
    welcome: [
      'Professor Mycelium tried to understand the fungi – how they live, grow, spread and interact with other organisms.',
      'But something has gone wrong.',
      'The experiments are still here, but several words have vanished from the notes.',
      "Visit the six experiments. Read Mycelium's clues. Look carefully. Only one is right.",
      "Lift the hatch with the right symbol and find the word that is missing in the professor's notes."
    ],
    warning: 'Do not touch anything else. The experiments are still running…',
    notesTitle: 'The fungi… they are everywhere!',
    notes: [
      'I think I can understand them.',
      "I so want to discover that they are the solution to the future's problems with food, medicine, energy…",
      'The more I investigate, the harder it gets.',
      'And I have lost the words.',
      'But I observe and see that they form mycelium, a network of threads.',
      'They break down, build up, cooperate and affect their surroundings in strange ways…'
    ],
    lines: [
      ['terrarium', 'without {4} they die.'],
      ['brodskiva', 'without {4} they do not survive.'],
      ['labyrint', 'without {6} – no growth.'],
      ['mikroskop', 'with {6} they spread on the wind.'],
      ['myra', 'In a {4} they can steer and survive.'],
      ['provror', 'AND without {6} there is chaos!']
    ],
    notesEnd: [
      'It is getting late. They are growing in the tubes. They whisper in the jars. I think they know more about me than I know about them…',
      'HELP ME!'
    ]
  }
};
