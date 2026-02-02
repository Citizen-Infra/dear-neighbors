import { signal } from '@preact/signals';

export const uiLanguage = signal(localStorage.getItem('dn_ui_language') || 'en');

export function setUiLanguage(val) {
  uiLanguage.value = val;
  localStorage.setItem('dn_ui_language', val);
}

const translations = {
  en: {
    // TopBar
    'topbar.title': 'Dear Neighbors',
    'topbar.chooseLocation': 'Choose location',
    'topbar.allTopics': 'all topics',
    'topbar.topicCount': '{count} topic{s}',
    'topbar.signIn': 'Sign in',
    'topbar.signOut': 'Sign out',

    // Settings
    'settings.title': 'Settings',
    'settings.location': 'Location',
    'settings.country': 'Country',
    'settings.selectCountry': 'Select country...',
    'settings.city': 'City',
    'settings.selectCity': 'Select city...',
    'settings.neighborhood': 'Neighborhood',
    'settings.allNeighborhoods': 'All neighborhoods',
    'settings.topics': 'Topics',
    'settings.clearAll': 'Clear all',
    'settings.allTopicsHint': 'All topics shown. Tap to filter.',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    'settings.participation': 'Participation Opportunities',
    'settings.participationHint': 'Show participation opportunities alongside links.',
    'settings.interfaceLanguage': 'Interface Language',
    'settings.contentFilter': 'Content Language Filter',
    'settings.contentFilterHint': 'Show only content matching your interface language.',
    'settings.account': 'Account',
    'settings.signedInAs': 'Signed in as',

    // LinksFeed
    'links.title': 'Community Links',
    'links.hot': 'Hot',
    'links.top': 'Top',
    'links.new': 'New',
    'links.week': 'Week',
    'links.year': 'Year',
    'links.all': 'All',
    'links.share': '+ Share a link',
    'links.loading': 'Loading links...',
    'links.empty': 'No links shared yet. Be the first to share something with your neighbors!',
    'links.loadMore': 'Load more',
    'links.loadingMore': 'Loading...',

    // SubmitLinkForm
    'submit.url': 'URL',
    'submit.title': 'Title',
    'submit.description': 'Description (optional)',
    'submit.cancel': 'Cancel',
    'submit.share': 'Share',
    'submit.sharing': 'Sharing...',
    'submit.fetching': 'Fetching page info...',
    'submit.language': 'Language',

    // SessionsPanel
    'sessions.title': 'Participate',
    'sessions.loading': 'Loading sessions...',
    'sessions.empty': 'No participation opportunities found for this neighborhood and topics.',
    'sessions.happeningNow': 'Happening Now',
    'sessions.comingUp': 'Coming Up',
    'sessions.recentlyCompleted': 'Recently Completed',
    'sessions.live': 'Live',
    'sessions.upcoming': 'Upcoming',
    'sessions.done': 'Done',

    // AuthModal
    'auth.title': 'Sign in to Dear Neighbors',
    'auth.description': 'Sign in to share links and upvote posts from your neighbors.',
    'auth.placeholder': 'your@email.com',
    'auth.send': 'Send magic link',
    'auth.sending': 'Sending...',
    'auth.checkEmail': 'Check your email for a magic link!',
    'auth.spamHint': 'Not seeing it? Check your spam folder.',
    'auth.close': 'Close',
    'auth.tooMany': 'Too many attempts. Please wait a few minutes before trying again.',
    'auth.failed': 'Failed to send magic link. Please try again.',

    // Onboarding
    'onboarding.welcome': 'Welcome to Dear Neighbors',
    'onboarding.subtitle': 'Pick your city and language to get started',
    'onboarding.selectCountry': 'Select your country',
    'onboarding.selectCity': 'Select your city',
    'onboarding.languageStep': 'Choose your language',
    'onboarding.accountStep': 'Sign in (optional)',
    'onboarding.skipSignIn': 'Continue without signing in',
    'onboarding.getStarted': 'Get Started',

    // Welcome
    'welcome.title': 'Welcome to Dear Neighbors',
    'welcome.description': 'Open Settings (gear icon) to pick your country and city to get started.',
    'welcome.loading': 'Loading...',

    // PopupForm
    'popup.title': 'Dear Neighbors',
    'popup.shareTitle': 'Share with Neighbors',
    'popup.signInDesc': 'Sign in to share links with your neighbors.',
    'popup.url': 'URL',
    'popup.titleField': 'Title',
    'popup.descriptionField': 'Description',
    'popup.optional': '(optional)',
    'popup.descPlaceholder': 'Why is this relevant?',
    'popup.country': 'Country',
    'popup.selectCountry': 'Select country...',
    'popup.city': 'City',
    'popup.selectCity': 'Select city...',
    'popup.neighborhood': 'Neighborhood',
    'popup.allNeighborhoods': 'All neighborhoods',
    'popup.topics': 'Topics',
    'popup.language': 'Language',
    'popup.share': 'Share',
    'popup.sharing': 'Sharing...',
    'popup.success': 'Shared with neighbors!',
    'popup.loading': 'Loading...',
    'popup.send': 'Send magic link',
    'popup.sending': 'Sending...',
    'popup.checkEmail': 'Check your email for a magic link!',
    'popup.spamHint': 'Not seeing it? Check your spam folder.',

    // Environment badges
    'env.aqi': 'AQI',
    'env.uv': 'UV',
    'env.aqi.good': 'Good',
    'env.aqi.fair': 'Fair',
    'env.aqi.moderate': 'Moderate',
    'env.aqi.poor': 'Poor',
    'env.aqi.veryPoor': 'Very poor',
    'env.uv.low': 'Low',
    'env.uv.moderate': 'Moderate',
    'env.uv.high': 'High',
    'env.uv.veryHigh': 'Very high',
    'env.uv.extreme': 'Extreme',
  },
  sr: {
    // TopBar
    'topbar.title': 'Dragi susedi',
    'topbar.chooseLocation': 'Izaberite lokaciju',
    'topbar.allTopics': 'sve teme',
    'topbar.topicCount': '{count} tema',
    'topbar.signIn': 'Prijava',
    'topbar.signOut': 'Odjava',

    // Settings
    'settings.title': 'Podešavanja',
    'settings.location': 'Lokacija',
    'settings.country': 'Država',
    'settings.selectCountry': 'Izaberite državu...',
    'settings.city': 'Grad',
    'settings.selectCity': 'Izaberite grad...',
    'settings.neighborhood': 'Naselje',
    'settings.allNeighborhoods': 'Sva naselja',
    'settings.topics': 'Teme',
    'settings.clearAll': 'Obriši sve',
    'settings.allTopicsHint': 'Prikazane su sve teme. Dodirnite za filtriranje.',
    'settings.theme': 'Tema',
    'settings.light': 'Svetla',
    'settings.dark': 'Tamna',
    'settings.system': 'Sistem',
    'settings.participation': 'Mogućnosti učešća',
    'settings.participationHint': 'Prikaži mogućnosti učešća uz linkove.',
    'settings.interfaceLanguage': 'Jezik interfejsa',
    'settings.contentFilter': 'Filter jezika sadržaja',
    'settings.contentFilterHint': 'Prikaži samo sadržaj na jeziku interfejsa.',
    'settings.account': 'Nalog',
    'settings.signedInAs': 'Prijavljeni kao',

    // LinksFeed
    'links.title': 'Linkovi zajednice',
    'links.hot': 'Popularno',
    'links.top': 'Najbolje',
    'links.new': 'Novo',
    'links.week': 'Nedelja',
    'links.year': 'Godina',
    'links.all': 'Sve',
    'links.share': '+ Podeli link',
    'links.loading': 'Učitavanje linkova...',
    'links.empty': 'Još nema podeljenih linkova. Budite prvi koji deli nešto sa komšijama!',
    'links.loadMore': 'Učitaj još',
    'links.loadingMore': 'Učitavanje...',

    // SubmitLinkForm
    'submit.url': 'URL',
    'submit.title': 'Naslov',
    'submit.description': 'Opis (opciono)',
    'submit.cancel': 'Otkaži',
    'submit.share': 'Podeli',
    'submit.sharing': 'Deljenje...',
    'submit.fetching': 'Preuzimanje podataka o stranici...',
    'submit.language': 'Jezik',

    // SessionsPanel
    'sessions.title': 'Učestvujte',
    'sessions.loading': 'Učitavanje sesija...',
    'sessions.empty': 'Nema mogućnosti učešća za ovo naselje i teme.',
    'sessions.happeningNow': 'U toku',
    'sessions.comingUp': 'Uskoro',
    'sessions.recentlyCompleted': 'Nedavno završeno',
    'sessions.live': 'Uživo',
    'sessions.upcoming': 'Uskoro',
    'sessions.done': 'Završeno',

    // AuthModal
    'auth.title': 'Prijavite se na Dragi susedi',
    'auth.description': 'Prijavite se da delite linkove i glasate za objave vaših komšija.',
    'auth.placeholder': 'vaš@email.com',
    'auth.send': 'Pošalji magični link',
    'auth.sending': 'Slanje...',
    'auth.checkEmail': 'Proverite email za magični link!',
    'auth.spamHint': 'Ne vidite? Proverite spam folder.',
    'auth.close': 'Zatvori',
    'auth.tooMany': 'Previše pokušaja. Sačekajte nekoliko minuta pre nego što pokušate ponovo.',
    'auth.failed': 'Slanje magičnog linka nije uspelo. Pokušajte ponovo.',

    // Onboarding
    'onboarding.welcome': 'Dobrodošli na Dragi susedi',
    'onboarding.subtitle': 'Izaberite grad i jezik da započnete',
    'onboarding.selectCountry': 'Izaberite državu',
    'onboarding.selectCity': 'Izaberite grad',
    'onboarding.languageStep': 'Izaberite jezik',
    'onboarding.accountStep': 'Prijava (opciono)',
    'onboarding.skipSignIn': 'Nastavi bez prijave',
    'onboarding.getStarted': 'Započni',

    // Welcome
    'welcome.title': 'Dobrodošli na Dragi susedi',
    'welcome.description': 'Otvorite Podešavanja (ikona zupčanika) da izaberete državu i grad.',
    'welcome.loading': 'Učitavanje...',

    // PopupForm
    'popup.title': 'Dragi susedi',
    'popup.shareTitle': 'Podelite sa komšijama',
    'popup.signInDesc': 'Prijavite se da delite linkove sa komšijama.',
    'popup.url': 'URL',
    'popup.titleField': 'Naslov',
    'popup.descriptionField': 'Opis',
    'popup.optional': '(opciono)',
    'popup.descPlaceholder': 'Zašto je ovo relevantno?',
    'popup.country': 'Država',
    'popup.selectCountry': 'Izaberite državu...',
    'popup.city': 'Grad',
    'popup.selectCity': 'Izaberite grad...',
    'popup.neighborhood': 'Naselje',
    'popup.allNeighborhoods': 'Sva naselja',
    'popup.topics': 'Teme',
    'popup.language': 'Jezik',
    'popup.share': 'Podeli',
    'popup.sharing': 'Deljenje...',
    'popup.success': 'Podeljeno sa komšijama!',
    'popup.loading': 'Učitavanje...',
    'popup.send': 'Pošalji magični link',
    'popup.sending': 'Slanje...',
    'popup.checkEmail': 'Proverite email za magični link!',
    'popup.spamHint': 'Ne vidite? Proverite spam folder.',

    // Environment badges
    'env.aqi': 'AQI',
    'env.uv': 'UV',
    'env.aqi.good': 'Dobar',
    'env.aqi.fair': 'Prihvatljiv',
    'env.aqi.moderate': 'Umeren',
    'env.aqi.poor': 'Loš',
    'env.aqi.veryPoor': 'Veoma loš',
    'env.uv.low': 'Nizak',
    'env.uv.moderate': 'Umeren',
    'env.uv.high': 'Visok',
    'env.uv.veryHigh': 'Veoma visok',
    'env.uv.extreme': 'Ekstremno',
  },
};

export function t(key, params) {
  const lang = uiLanguage.value;
  let str = translations[lang]?.[key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, v);
    }
  }
  return str;
}
