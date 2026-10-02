// Inställningar för utlottningen. Redigera här.
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

  thanks: 'Tack! Lycka till i dragningen.',
  thanksNoEntry: 'Tack för att du var med!'
};
