// Texter och inställningar. Redigera här.

// Kort introduktion som visas när man öppnar sidan första gången
// (och när man trycker på ? uppe till höger). Finns på svenska, danska, norska och engelska.
// Första språket är standard. Besökare vars telefon är inställd på danska eller norska
// får det språket direkt, och valet av språk kommer ihåg på telefonen. Engelska väljs
// aldrig automatiskt (många svenska telefoner står på engelska) – man trycker på språket.
//   title = den stora texten, lead = frågan, more = raden under strecket.
//   board = knappen på danska/norska/engelska; den visar tavlans text på det språket (wall.js).
// Språket som väljs här styr hela appen: alla övriga texter finns i window.TEXT längre ner,
// och översättningarna av uppgifterna ligger i quiz.js. Professorns namn är Mycel (svenska,
// danska, norska) och Mycelium (engelska). Personuppgiftspolicyn översätts inte – den länkas bara.
window.INTRO = {
  sv: {
    label: 'Svenska',
    title: 'Hjälp professor Mycel att avsluta sina anteckningar.',
    lead: 'Vilka ord saknas i de sex experimenten?',
    more: 'Behöver du mer information, läs på den stora tavlan på väggen.',
    button: 'Börja'
  },
  da: {
    label: 'Dansk',
    title: 'Hjælp professor Mycel med at afslutte sine notater.',
    lead: 'Hvilke ord mangler i de seks eksperimenter?',
    more: 'Har du brug for mere information?',
    board: 'Læs på dansk',
    button: 'Start'
  },
  no: {
    label: 'Norsk',
    title: 'Hjelp professor Mycel med å avslutte notatene sine.',
    lead: 'Hvilke ord mangler i de seks eksperimentene?',
    more: 'Trenger du mer informasjon?',
    board: 'Les på norsk',
    button: 'Start'
  },
  en: {
    label: 'English',
    title: 'Help professor Mycelium complete the notes.',
    lead: 'Which words are missing in the six experiments?',
    more: 'Need more information?',
    board: 'Read in English',
    button: 'Start'
  }
};

// Utlottning och feedback.
//
window.PRIZE = {
  // Adressen till brevlådan (Apps Script, slutar på /exec).
  // Tom = ingen utlottning visas, och sidan fungerar som vanligt.
  endpoint: 'https://script.google.com/macros/s/AKfycbz6vBZ8ZM6Xf6o2hOtDT6RT9xgDpDp7HZluLaX8U2pqn6_QA82QruSvfAWm8nOk1Axn/exec',

  // Sekunder som "Alla rätt!" och korten visas innan formuläret tar över
  delaySeconds: 2,

  // Sidan med Universeums personuppgiftspolicy (länken "här" under formuläret).
  // Texterna i formuläret (rubrik, samtycke m.m.) ligger i window.TEXT längre ner.
  privacyUrl: 'https://www.universeum.se/dataskyddspolicy',

  // Feedback efter e-postsidan (visas både efter "Skicka" och efter "Nej tack").
  // Kräver att brevlådans skript är uppdaterat till den version som tar emot feedback.
  feedback: { enabled: true }
};

// Alla texter i appen på svenska, danska, norska och engelska.
// {n} och {total} ersätts med antal rätt och antal uppgifter.
// Personuppgiftspolicyn översätts inte: raden "privacy" (att adressen raderas efter dragningen)
// finns bara på svenska och lämnas tom på de andra språken. Där visas bara länken till
// Universeums policy (privacyMore + privacyLink, adressen står i PRIZE.privacyUrl).
// En tom text visas inte alls. Samtyckesraden (consent) är översatt, eftersom man måste
// förstå vad man godkänner. Låt gärna Universeums dataskyddsombud eller jurist läsa den.
window.TEXT = {
  sv: {
    kicker: 'Professor',
    name: 'Mycels biolabb',
    pageTitle: 'Professor Mycels Biolabb',
    signature: '– Professor Mycel',
    hintStart: 'Tryck på en symbol',
    hintAll: 'Alla ord valda',
    check: 'Kontrollera',
    allCorrect: 'Alla rätt!',
    wellDone: 'Bra jobbat!',
    someCorrect: '{n} av {total} rätt',
    tryAgain: 'Titta noga och byt de markerade.',
    reset: 'Börja om',
    resetConfirm: 'Tryck igen för att börja om',
    ariaChosen: 'Valt ord',
    ariaNone: 'Inget ord valt',
    ariaRight: 'Rätt',
    ariaWrong: 'Fel',
    close: 'Stäng',
    help: 'Så funkar det',
    langGroup: 'Språk',
    infoLabel: 'Info',
    noteTitle: 'Professorns anteckning',
    noteClose: 'Stäng',
    prizeTitle: 'Vinn ett årskort!',
    prizeIntro: 'Fyll i en vuxens e-postadress så har du chans att vinna ett årskort till Universeum.',
    emailLabel: 'E-postadress',
    emailPlaceholder: 'namn@exempel.se',
    consent: 'Jag är vuxen och godkänner att Universeum sparar min e-postadress för utlottningen.',
    privacy: 'Adressen används bara för utlottningen och raderas efter dragningen.',
    privacyMore: 'Läs mer om hur Universeum hanterar personuppgifter',
    privacyLink: 'här',
    send: 'Skicka',
    sending: 'Skickar…',
    skip: 'Nej tack',
    emailError: 'Kontrollera e-postadressen.',
    sendError: 'Något gick fel. Kontrollera nätet och försök igen.',
    thanks: 'Tack! Lycka till i dragningen.',
    thanksNoEntry: 'Tack för att du var med!',
    fbTitle: 'Vad tyckte du om Professor Mycels Biolabb?',
    faces: ['Inte bra', 'Okej', 'Jättebra'],
    fbComment: 'Vill du berätta mer? (frivilligt)',
    fbNote: 'Skriv inga namn eller kontaktuppgifter. Svaret sparas utan din e-postadress.',
    fbSkip: 'Hoppa över',
    fbError: 'Något gick fel. Försök igen, eller hoppa över.'
  },
  da: {
    kicker: 'Professor',
    name: 'Mycels biolab',
    pageTitle: 'Professor Mycels Biolab',
    signature: '– Professor Mycel',
    hintStart: 'Tryk på et symbol',
    hintAll: 'Alle ord er valgt',
    check: 'Tjek svarene',
    allCorrect: 'Alle rigtige!',
    wellDone: 'Godt gået!',
    someCorrect: '{n} af {total} rigtige',
    tryAgain: 'Se godt efter og skift de markerede.',
    reset: 'Start forfra',
    resetConfirm: 'Tryk igen for at starte forfra',
    ariaChosen: 'Valgt ord',
    ariaNone: 'Intet ord valgt',
    ariaRight: 'Rigtigt',
    ariaWrong: 'Forkert',
    close: 'Luk',
    help: 'Sådan fungerer det',
    langGroup: 'Sprog',
    infoLabel: 'Oversættelse',
    noteTitle: 'Professorens notater',
    noteClose: 'Luk',
    prizeTitle: 'Vind et årskort!',
    prizeIntro: 'Skriv en voksens e-mailadresse, så har du chance for at vinde et årskort til Universeum.',
    emailLabel: 'E-mailadresse',
    emailPlaceholder: 'navn@eksempel.dk',
    consent: 'Jeg er voksen og accepterer, at Universeum gemmer min e-mailadresse til lodtrækningen.',
    privacy: '', // policyn översätts inte, den länkas bara (se privacyMore/privacyLink)
    privacyMore: 'Læs mere om, hvordan Universeum behandler personoplysninger',
    privacyLink: 'her',
    send: 'Send',
    sending: 'Sender…',
    skip: 'Nej tak',
    emailError: 'Tjek e-mailadressen.',
    sendError: 'Noget gik galt. Tjek forbindelsen, og prøv igen.',
    thanks: 'Tak! Held og lykke i lodtrækningen.',
    thanksNoEntry: 'Tak fordi du var med!',
    fbTitle: 'Hvad syntes du om Professor Mycels Biolab?',
    faces: ['Ikke godt', 'Okay', 'Rigtig godt'],
    fbComment: 'Vil du fortælle mere? (valgfrit)',
    fbNote: 'Skriv ikke navne eller kontaktoplysninger. Svaret gemmes uden din e-mailadresse.',
    fbSkip: 'Spring over',
    fbError: 'Noget gik galt. Prøv igen, eller spring over.'
  },
  no: {
    kicker: 'Professor',
    name: 'Mycels biolab',
    pageTitle: 'Professor Mycels Biolab',
    signature: '– Professor Mycel',
    hintStart: 'Trykk på et symbol',
    hintAll: 'Alle ord er valgt',
    check: 'Sjekk svarene',
    allCorrect: 'Alle riktige!',
    wellDone: 'Bra jobbet!',
    someCorrect: '{n} av {total} riktige',
    tryAgain: 'Se nøye etter og bytt de markerte.',
    reset: 'Begynn på nytt',
    resetConfirm: 'Trykk igjen for å begynne på nytt',
    ariaChosen: 'Valgt ord',
    ariaNone: 'Ingen ord valgt',
    ariaRight: 'Riktig',
    ariaWrong: 'Feil',
    close: 'Lukk',
    help: 'Slik fungerer det',
    langGroup: 'Språk',
    infoLabel: 'Oversettelse',
    noteTitle: 'Professorens notater',
    noteClose: 'Lukk',
    prizeTitle: 'Vinn et årskort!',
    prizeIntro: 'Skriv inn e-postadressen til en voksen, så har du sjanse til å vinne et årskort til Universeum.',
    emailLabel: 'E-postadresse',
    emailPlaceholder: 'navn@eksempel.no',
    consent: 'Jeg er voksen og godtar at Universeum lagrer e-postadressen min til trekningen.',
    privacy: '', // policyn översätts inte, den länkas bara (se privacyMore/privacyLink)
    privacyMore: 'Les mer om hvordan Universeum behandler personopplysninger',
    privacyLink: 'her',
    send: 'Send',
    sending: 'Sender…',
    skip: 'Nei takk',
    emailError: 'Sjekk e-postadressen.',
    sendError: 'Noe gikk galt. Sjekk nettforbindelsen og prøv igjen.',
    thanks: 'Takk! Lykke til i trekningen.',
    thanksNoEntry: 'Takk for at du var med!',
    fbTitle: 'Hva syntes du om Professor Mycels Biolab?',
    faces: ['Ikke bra', 'Greit', 'Kjempebra'],
    fbComment: 'Vil du fortelle mer? (frivillig)',
    fbNote: 'Ikke skriv navn eller kontaktopplysninger. Svaret lagres uten e-postadressen din.',
    fbSkip: 'Hopp over',
    fbError: 'Noe gikk galt. Prøv igjen, eller hopp over.'
  },
  en: {
    kicker: 'Professor',
    name: "Mycelium's biolab",
    pageTitle: "Professor Mycelium's Biolab",
    signature: '– Professor Mycelium',
    hintStart: 'Tap a symbol',
    hintAll: 'All words chosen',
    check: 'Check answers',
    allCorrect: 'All correct!',
    wellDone: 'Well done!',
    someCorrect: '{n} of {total} correct',
    tryAgain: 'Look carefully and change the marked ones.',
    reset: 'Start over',
    resetConfirm: 'Tap again to start over',
    ariaChosen: 'Chosen word',
    ariaNone: 'No word chosen',
    ariaRight: 'Correct',
    ariaWrong: 'Wrong',
    close: 'Close',
    help: 'How it works',
    langGroup: 'Language',
    infoLabel: 'Translation',
    noteTitle: "The professor's notes",
    noteClose: 'Close',
    prizeTitle: 'Win an annual pass!',
    prizeIntro: "Enter an adult's e-mail address for a chance to win an annual pass to Universeum.",
    emailLabel: 'E-mail address',
    emailPlaceholder: 'name@example.com',
    consent: 'I am an adult and agree that Universeum stores my e-mail address for the prize draw.',
    privacy: '', // policyn översätts inte, den länkas bara (se privacyMore/privacyLink)
    privacyMore: 'Read more about how Universeum handles personal data',
    privacyLink: 'here',
    send: 'Send',
    sending: 'Sending…',
    skip: 'No thanks',
    emailError: 'Check the e-mail address.',
    sendError: 'Something went wrong. Check your connection and try again.',
    thanks: 'Thank you! Good luck in the draw.',
    thanksNoEntry: 'Thanks for taking part!',
    fbTitle: "What did you think of Professor Mycelium's Biolab?",
    faces: ['Not good', 'Okay', 'Great'],
    fbComment: 'Want to tell us more? (optional)',
    fbNote: 'Do not write names or contact details. Your answer is saved without your e-mail address.',
    fbSkip: 'Skip',
    fbError: 'Something went wrong. Try again, or skip.'
  }
};
