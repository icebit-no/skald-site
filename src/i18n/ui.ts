import type { Lang } from './languages';

// Every text a visitor reads, in nynorsk and in bokmål with the same keys. The hero's words are Skald's
// docs/design.md, section Site, as the hero sketch has them in both languages.
const nn = {
  title: 'Skald – Du snakkar. Skalden skriv.',
  description:
    'Hald inne ein tast, snakk norsk, slepp. Teksten står der markøren er. Talemodellar frå Nasjonalbiblioteket, rett på maskina di. Gratis og open kjeldekode.',
  languageNav: 'Språk',

  tag1: 'Du snakkar.',
  tag2: 'Skalden skriv.',
  sub: 'Hald inne ein tast, snakk norsk, slepp. Teksten står der markøren er. Talemodellar frå Nasjonalbiblioteket, rett på maskina di. Gratis og open kjeldekode.',
  scene:
    'Linosnitt: eit langskip med råsegl og skjold langs ripa på ein mørk fjord. Skalden står i stamnen, og røysta hans stig opp, blir til nordlys og endar som ei rad med runer.',
  skaldFor: (system: string) => `Skald for ${system}`,
  firstReleaseComing: 'Første versjon kjem snart',
  sourceOnGitHub: 'Kjeldekode på GitHub',

  pointsHeading: 'Kva Skald gjer',
  points: [
    {
      heading: 'Kan norsk',
      text: 'Skald skriv med talemodellane til Nasjonalbiblioteket, som er trena på norsk tale frå NRK, Stortinget og lydbøker. Teksten kan stå på bokmål eller nynorsk; du vel sjølv.',
    },
    {
      heading: 'Held tett',
      text: 'Lyden blir verande på maskina di. Skald sender ingenting nokon stad: ingen skyteneste, inga sporing. Nettet blir brukt berre til å laste ned talemodellen og sjå etter ein ny versjon.',
    },
    {
      heading: 'Lærer orda dine',
      text: 'Namn og faguttrykk legg du i ordskatten, så kjenner modellen dei att. Skriv han eit ord feil på same måten kvar gong, lagar du ei retting: «mercha» blir «merget» før teksten blir sett inn.',
    },
  ],

  modelsHeading: 'Talemodellane',
  modelsIntro:
    'NB-Whisper er Whisper frå OpenAI, trena vidare av Nasjonalbiblioteket på norsk tale. Skald brukar NB-Whisper Large, som skriv færrast feil. NB-ASR Bokfink, den nyaste modellen til Nasjonalbiblioteket, kjem som eit val, merkt beta.',
  modelsCaption: 'Feil per 100 ord på FLEURS, lågare er betre',
  modelColumn: 'Modell',
  errorsColumn: 'Feil per 100 ord',
  madeBy: 'Laga av',
  defaultInSkald: 'Standard i Skald',
  betaInSkald: 'Val i Skald, beta',
  notMeasuredYet: 'Ikkje målt på same måten enno',
  modelsNoteBefore: 'Tala er frå',
  modelsNotePaper: 'artikkelen til Nasjonalbiblioteket om NB-Whisper',
  modelsNoteAfter:
    ', målte på same måten for kvar modell på FLEURS, ei open samling med opplesne setningar. Bokfink er berre målt på dei eigne testsetta til Nasjonalbiblioteket, så han står utan stolpe til han er målt på same måten.',
  creditBefore: 'Talemodellane er laga av',
  creditAfter:
    'og delte under Apache 2.0-lisensen. Skald lastar ned modellen frå Hugging Face første gongen appen startar.',

  agentsHeading: 'For KI-agentar',
  agentsIntroBefore: 'Alt du kan stille inn i Skald, kan ein agent stille inn med kommandoen',
  agentsIntroAfter:
    ': rettingar, ordskatten, mikrofonar, talemodell og innstillingar. Kvar kommando svarar med JSON når han får',
  agentsYouSay: 'Du skriv:',
  agentsExchange: 'Skald skreiv «mercha», det skal vere «merget».',
  agentsAgentRuns: 'Agenten køyrer:',
  agentsSkillAfter: 'legg inn ein skill for Claude Code som lærer agenten kommandoane, og',
  agentsMcpAfter: 'gir dei same kommandoane som MCP-verktøy.',
  commandsCaption: 'Kommandoane',
  commands: [
    ['skald last, skald history', 'Den siste teksten, eller dei fem siste'],
    ['skald fix list|add|remove', 'Rettingar'],
    ['skald vocab list|add|remove|sentence', 'Ordskatten, og setninga han opnar med'],
    ['skald config get|set', 'Tasten, bokmål eller nynorsk, utsjånaden på overlegget, lydar og meir'],
    ['skald mic list|use|order', 'Mikrofonane og rekkjefølgja deira'],
    ['skald model list|use', 'Talemodellane, og kva for nokre som er lasta ned'],
    ['skald transcribe <fil.wav>', 'Gjer ei lydfil om til tekst, så agenten kan prøve ei retting'],
    ['skald bench <mappe>', 'Køyr eit testsett gjennom oppsetta og tel feila'],
    ['skald skill install|uninstall', 'Legg inn eller tek ut skillen for Claude'],
    ['skald mcp', 'Dei same kommandoane som MCP-verktøy'],
  ],

  installHeading: 'Installer',
  installNotYet: 'Første versjon er ikkje ute enno. Han kjem snart, og då verkar kommandoane under.',
  installFollow: 'Følg med på GitHub',
  withHomebrew: 'Med Homebrew:',
  withWinget: 'Med winget:',
  orWithScoop: 'Eller med Scoop:',
  fromAur: 'Frå AUR:',
  orBuild: 'Eller bygg Skald frå kjeldekoden.',

  sagaHeading: 'Sagaen',
  sagaIntro: 'Det som er nytt i kvar versjon.',
  sagaNone: 'Ingen versjonar enno. Den første kjem snart.',
  sagaAllOnGitHub: 'Versjonane på GitHub',
  sagaPrerelease: 'Førehandsversjon',
  sagaReadOnGitHub: 'Les på GitHub',

  footerFree: 'Skald er gratis og open kjeldekode under MIT-lisensen.',
  footerSkaldSource: 'Kjeldekoden til Skald',
  footerSiteSource: 'Kjeldekoden til denne sida',
  footerModels: 'Talemodellar frå Nasjonalbiblioteket (Apache 2.0).',
  footerFonts: 'Skrifter: Eczar, Alegreya Sans, Noto Sans Runic og IBM Plex Mono (SIL Open Font License).',
  footerNoTracking: 'Ingen sporing, ingen informasjonskapslar.',

  notFoundTitle: 'Fann ikkje sida',
  notFoundText: 'Adressa finst ikkje på skald.icebit.app.',
  notFoundHome: 'Til framsida',
};

type Texts = typeof nn;

const nb: Texts = {
  title: 'Skald – Du snakker. Skalden skriver.',
  description:
    'Hold inne en tast, snakk norsk, slipp. Teksten står der markøren er. Talemodeller fra Nasjonalbiblioteket, rett på maskinen din. Gratis og åpen kildekode.',
  languageNav: 'Språk',

  tag1: 'Du snakker.',
  tag2: 'Skalden skriver.',
  sub: 'Hold inne en tast, snakk norsk, slipp. Teksten står der markøren er. Talemodeller fra Nasjonalbiblioteket, rett på maskinen din. Gratis og åpen kildekode.',
  scene:
    'Linosnitt: et langskip med råseil og skjold langs ripa på en mørk fjord. Skalden står i stavnen, og stemmen hans stiger opp, blir til nordlys og ender som en rad med runer.',
  skaldFor: (system: string) => `Skald for ${system}`,
  firstReleaseComing: 'Første versjon kommer snart',
  sourceOnGitHub: 'Kildekode på GitHub',

  pointsHeading: 'Hva Skald gjør',
  points: [
    {
      heading: 'Kan norsk',
      text: 'Skald skriver med talemodellene til Nasjonalbiblioteket, som er trent på norsk tale fra NRK, Stortinget og lydbøker. Teksten kan stå på bokmål eller nynorsk; du velger selv.',
    },
    {
      heading: 'Holder tett',
      text: 'Lyden blir på maskinen din. Skald sender ingenting noe sted: ingen skytjeneste, ingen sporing. Nettet brukes bare til å laste ned talemodellen og se etter en ny versjon.',
    },
    {
      heading: 'Lærer ordene dine',
      text: 'Navn og faguttrykk legger du i ordskatten, så kjenner modellen dem igjen. Skriver den et ord feil på samme måte hver gang, lager du en retting: «mercha» blir «merget» før teksten settes inn.',
    },
  ],

  modelsHeading: 'Talemodellene',
  modelsIntro:
    'NB-Whisper er Whisper fra OpenAI, trent videre av Nasjonalbiblioteket på norsk tale. Skald bruker NB-Whisper Large, som skriver færrest feil. NB-ASR Bokfink, Nasjonalbibliotekets nyeste modell, kommer som et valg, merket beta.',
  modelsCaption: 'Feil per 100 ord på FLEURS, lavere er bedre',
  modelColumn: 'Modell',
  errorsColumn: 'Feil per 100 ord',
  madeBy: 'Laget av',
  defaultInSkald: 'Standard i Skald',
  betaInSkald: 'Valg i Skald, beta',
  notMeasuredYet: 'Ikke målt på samme måte ennå',
  modelsNoteBefore: 'Tallene er fra',
  modelsNotePaper: 'Nasjonalbibliotekets artikkel om NB-Whisper',
  modelsNoteAfter:
    ', målt på samme måte for hver modell på FLEURS, en åpen samling med opplest tale. Bokfink er bare målt på Nasjonalbibliotekets egne testsett, så den står uten stolpe til den er målt på samme måte.',
  creditBefore: 'Talemodellene er laget av',
  creditAfter:
    'og delt under Apache 2.0-lisensen. Skald laster ned modellen fra Hugging Face første gang appen starter.',

  agentsHeading: 'For KI-agenter',
  agentsIntroBefore: 'Alt du kan stille inn i Skald, kan en agent stille inn med kommandoen',
  agentsIntroAfter:
    ': rettinger, ordskatten, mikrofoner, talemodell og innstillinger. Hver kommando svarer med JSON når den får',
  agentsYouSay: 'Du skriver:',
  agentsExchange: 'Skald skrev «mercha», det skal være «merget».',
  agentsAgentRuns: 'Agenten kjører:',
  agentsSkillAfter: 'legger inn en skill for Claude Code som lærer agenten kommandoene, og',
  agentsMcpAfter: 'gir de samme kommandoene som MCP-verktøy.',
  commandsCaption: 'Kommandoene',
  commands: [
    ['skald last, skald history', 'Den siste teksten, eller de fem siste'],
    ['skald fix list|add|remove', 'Rettinger'],
    ['skald vocab list|add|remove|sentence', 'Ordskatten, og setningen den åpner med'],
    ['skald config get|set', 'Tasten, bokmål eller nynorsk, utseendet på overlegget, lyder og mer'],
    ['skald mic list|use|order', 'Mikrofonene og rekkefølgen deres'],
    ['skald model list|use', 'Talemodellene, og hvilke som er lastet ned'],
    ['skald transcribe <fil.wav>', 'Gjør en lydfil om til tekst, så agenten kan prøve en retting'],
    ['skald bench <mappe>', 'Kjør et testsett gjennom oppsettene og tell feilene'],
    ['skald skill install|uninstall', 'Legger inn eller tar ut skillen for Claude'],
    ['skald mcp', 'De samme kommandoene som MCP-verktøy'],
  ],

  installHeading: 'Installer',
  installNotYet: 'Første versjon er ikke ute ennå. Den kommer snart, og da virker kommandoene under.',
  installFollow: 'Følg med på GitHub',
  withHomebrew: 'Med Homebrew:',
  withWinget: 'Med winget:',
  orWithScoop: 'Eller med Scoop:',
  fromAur: 'Fra AUR:',
  orBuild: 'Eller bygg Skald fra kildekoden.',

  sagaHeading: 'Sagaen',
  sagaIntro: 'Det som er nytt i hver versjon.',
  sagaNone: 'Ingen versjoner ennå. Den første kommer snart.',
  sagaAllOnGitHub: 'Versjonene på GitHub',
  sagaPrerelease: 'Forhåndsversjon',
  sagaReadOnGitHub: 'Les på GitHub',

  footerFree: 'Skald er gratis og åpen kildekode under MIT-lisensen.',
  footerSkaldSource: 'Kildekoden til Skald',
  footerSiteSource: 'Kildekoden til denne siden',
  footerModels: 'Talemodeller fra Nasjonalbiblioteket (Apache 2.0).',
  footerFonts: 'Skrifter: Eczar, Alegreya Sans, Noto Sans Runic og IBM Plex Mono (SIL Open Font License).',
  footerNoTracking: 'Ingen sporing, ingen informasjonskapsler.',

  notFoundTitle: 'Fant ikke siden',
  notFoundText: 'Adressen finnes ikke på skald.icebit.app.',
  notFoundHome: 'Til forsiden',
};

const texts: Record<Lang, Texts> = { nn, nb };

export const t = (lang: Lang): Texts => texts[lang];
