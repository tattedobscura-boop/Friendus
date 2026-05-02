// Content filter - blocks illegal, dangerous, and inappropriate terms
const BLOCKED_TERMS = [
  // Illegal substances
  'drugs', 'cocaine', 'heroin', 'meth', 'methamphetamine', 'fentanyl', 'crack', 'weed', 'marijuana',
  'cannabis', 'lsd', 'ecstasy', 'mdma', 'ketamine', 'opium', 'morphine', 'opioids', 'narcotics',
  'dmt', 'psilocybin', 'shrooms', 'mushrooms', 'acid', 'pills', 'uppers', 'downers', 'molly',

  // Violence & weapons
  'kill', 'murder', 'rape', 'assault', 'stab', 'shoot', 'gun', 'knife', 'weapon', 'bomb',
  'explosive', 'grenade', 'terrorism', 'terrorist', 'attack', 'hurt', 'harm', 'torture', 'abuse',
  'violence', 'brutal', 'gore', 'blood', 'death', 'die', 'suicide', 'self-harm', 'cutting',

  // Illegal activities
  'steal', 'theft', 'robbery', 'fraud', 'hack', 'illegal', 'crime', 'criminal', 'smuggling',
  'trafficking', 'prostitution', 'escort', 'piracy', 'counterfeit', 'scam', 'extortion',

  // Adult / inappropriate
  'sex', 'porn', 'nude', 'naked', 'adult', 'nsfw', 'erotic', 'fetish', 'xxx',
  'hookup', 'booty', 'onlyfans',

  // Hate speech
  'hate', 'racist', 'racism', 'nazi', 'supremacist', 'bigot', 'slur',

  // Dangerous activities
  'overdose', 'drunk', 'alcoholism', 'blackout', 'dangerous', 'deadly', 'lethal',

  // Profanity (basic)
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'cock', 'pussy', 'whore', 'slut',
];

export function isContentSafe(text) {
  if (!text || typeof text !== 'string') return true;
  const lower = text.toLowerCase().trim();

  for (const term of BLOCKED_TERMS) {
    // Check for whole-word or partial matches
    if (lower.includes(term)) {
      return false;
    }
  }
  return true;
}

export function getBlockedReason(text) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();
  for (const term of BLOCKED_TERMS) {
    if (lower.includes(term)) {
      return `"${term}" is not allowed on FriendUs.`;
    }
  }
  return null;
}

export function sanitizeText(text) {
  if (!text) return '';
  return text.trim().slice(0, 50); // max 50 chars per tag
}
