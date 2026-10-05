// Texter och inställningar. Redigera här.

// Kort introduktion som visas när man öppnar sidan första gången
// (och när man trycker på ? uppe till höger). Finns på svenska, danska och norska.
// Första språket är standard. Besökare vars telefon är inställd på danska eller norska
// får det språket direkt, och valet av språk kommer ihåg på telefonen.
//   title = den stora texten, lead = frågan, more = raden under strecket.
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
    more: 'Har du brug for mere information, kan du læse på den store tavle på væggen.',
    button: 'Start'
  },
  no: {
    label: 'Norsk',
    title: 'Hjelp professor Mycel med å avslutte notatene sine.',
    lead: 'Hvilke ord mangler i de seks eksperimentene?',
    more: 'Trenger du mer informasjon, kan du lese på den store tavlen på veggen.',
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

  title: 'Vinn ett årskort!',
  intro: 'Fyll i en vuxens e-postadress så har du chans att vinna ett årskort till Universeum.',
  consent: 'Jag är vuxen och godkänner att Universeum sparar min e-postadress för utlottningen.',
  privacy: 'Adressen används bara för utlottningen och raderas efter dragningen.',
  // Raden under: "Läs mer om hur Universeum hanterar personuppgifter [här]."
  privacyMore: 'Läs mer om hur Universeum hanterar personuppgifter',
  privacyLinkText: 'här',
  privacyUrl: 'https://www.universeum.se/dataskyddspolicy',

  // Feedback efter e-postsidan (visas både efter "Skicka" och efter "Nej tack").
  // Kräver att brevlådans skript är uppdaterat till den version som tar emot feedback.
  feedback: {
    enabled: true,
    title: 'Vad tyckte du om Professor Mycels Biolabb?',
    faces: ['Inte bra', 'Okej', 'Jättebra'],
    commentLabel: 'Vill du berätta mer? (frivilligt)',
    note: 'Skriv inga namn eller kontaktuppgifter. Svaret sparas utan din e-postadress.',
    send: 'Skicka',
    skip: 'Hoppa över'
  },

  thanks: 'Tack! Lycka till i dragningen.',
  thanksNoEntry: 'Tack för att du var med!'
};
