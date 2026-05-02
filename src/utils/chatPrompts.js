// Discovery prompts - logged and used to auto-populate discovery board
export const CHAT_PROMPTS = [
  {
    id: 'p1',
    question: "What's your ideal Saturday morning?",
    category: 'Lifestyle',
    icon: '☀️',
    keywords: {
      coffee: { emoji: '☕', label: 'Morning Coffee', color: 'from-amber-600 to-orange-700' },
      sleep: { emoji: '😴', label: 'Sleeping In', color: 'from-indigo-600 to-purple-700' },
      run: { emoji: '🏃', label: 'Morning Run', color: 'from-green-500 to-teal-600' },
      yoga: { emoji: '🧘', label: 'Morning Yoga', color: 'from-teal-400 to-cyan-500' },
      cook: { emoji: '🥞', label: 'Cooking Breakfast', color: 'from-orange-400 to-red-500' },
      hike: { emoji: '🥾', label: 'Hiking', color: 'from-green-600 to-emerald-700' },
      read: { emoji: '📚', label: 'Reading', color: 'from-blue-400 to-indigo-500' },
      music: { emoji: '🎵', label: 'Listening to Music', color: 'from-purple-400 to-violet-500' },
      nature: { emoji: '🌿', label: 'Being in Nature', color: 'from-green-400 to-lime-500' },
    },
  },
  {
    id: 'p2',
    question: "Tea or coffee? And what kind?",
    category: 'Food & Drink',
    icon: '☕',
    keywords: {
      tea: { emoji: '🍵', label: 'Tea Lover', color: 'from-green-400 to-teal-500' },
      coffee: { emoji: '☕', label: 'Coffee Enthusiast', color: 'from-amber-700 to-orange-800' },
      matcha: { emoji: '🍵', label: 'Matcha', color: 'from-lime-400 to-green-500' },
      latte: { emoji: '☕', label: 'Latte Art', color: 'from-amber-400 to-orange-500' },
      herbal: { emoji: '🌿', label: 'Herbal Tea', color: 'from-green-500 to-emerald-600' },
      espresso: { emoji: '☕', label: 'Espresso', color: 'from-stone-600 to-gray-700' },
      chai: { emoji: '🍵', label: 'Chai Spice', color: 'from-orange-400 to-amber-500' },
    },
  },
  {
    id: 'p3',
    question: "What's a book or movie that changed how you see the world?",
    category: 'Culture',
    icon: '📖',
    keywords: {
      book: { emoji: '📚', label: 'Avid Reader', color: 'from-blue-400 to-indigo-500' },
      film: { emoji: '🎬', label: 'Film Lover', color: 'from-red-500 to-rose-600' },
      movie: { emoji: '🎬', label: 'Movie Buff', color: 'from-red-400 to-rose-500' },
      documentary: { emoji: '🎞️', label: 'Documentaries', color: 'from-slate-500 to-gray-600' },
      novel: { emoji: '📖', label: 'Novel Enthusiast', color: 'from-amber-400 to-yellow-500' },
      scifi: { emoji: '🚀', label: 'Sci-Fi Fan', color: 'from-slate-600 to-gray-700' },
      fantasy: { emoji: '🧙', label: 'Fantasy Worlds', color: 'from-violet-500 to-purple-600' },
      philosophy: { emoji: '🧠', label: 'Philosophy', color: 'from-blue-500 to-indigo-600' },
    },
  },
  {
    id: 'p4',
    question: "If you could travel anywhere tomorrow, where would you go?",
    category: 'Travel',
    icon: '✈️',
    keywords: {
      japan: { emoji: '🗻', label: 'Japan Dreams', color: 'from-red-400 to-rose-500' },
      italy: { emoji: '🍕', label: 'Italy', color: 'from-green-400 to-red-500' },
      beach: { emoji: '🏖️', label: 'Beach Getaway', color: 'from-yellow-400 to-orange-500' },
      mountain: { emoji: '🏔️', label: 'Mountain Retreats', color: 'from-slate-500 to-gray-600' },
      paris: { emoji: '🗼', label: 'Paris', color: 'from-rose-400 to-pink-500' },
      city: { emoji: '🌆', label: 'City Explorer', color: 'from-indigo-500 to-purple-600' },
      island: { emoji: '🏝️', label: 'Island Life', color: 'from-teal-400 to-cyan-500' },
      forest: { emoji: '🌲', label: 'Forest Escapes', color: 'from-green-500 to-emerald-600' },
      space: { emoji: '🌌', label: 'Space Tourism', color: 'from-indigo-600 to-purple-700' },
      road: { emoji: '🛣️', label: 'Road Trips', color: 'from-orange-400 to-amber-500' },
    },
  },
  {
    id: 'p5',
    question: "What kind of music do you listen to when you need to feel something?",
    category: 'Music',
    icon: '🎵',
    keywords: {
      jazz: { emoji: '🎷', label: 'Jazz', color: 'from-blue-500 to-indigo-600' },
      classical: { emoji: '🎻', label: 'Classical Music', color: 'from-amber-400 to-yellow-500' },
      hiphop: { emoji: '🎤', label: 'Hip-Hop', color: 'from-yellow-400 to-orange-500' },
      indie: { emoji: '🎸', label: 'Indie Music', color: 'from-violet-400 to-purple-500' },
      electronic: { emoji: '🎛️', label: 'Electronic', color: 'from-cyan-400 to-blue-500' },
      rock: { emoji: '🤘', label: 'Rock Music', color: 'from-red-500 to-rose-600' },
      rnb: { emoji: '🎙️', label: 'R&B / Soul', color: 'from-pink-400 to-rose-500' },
      lofi: { emoji: '🎵', label: 'Lo-fi Beats', color: 'from-teal-400 to-cyan-500' },
      pop: { emoji: '🌟', label: 'Pop Music', color: 'from-pink-300 to-rose-400' },
      ambient: { emoji: '🌊', label: 'Ambient / Chill', color: 'from-blue-400 to-teal-500' },
    },
  },
  {
    id: 'p6',
    question: "What's your go-to comfort food?",
    category: 'Food',
    icon: '🍽️',
    keywords: {
      pizza: { emoji: '🍕', label: 'Pizza', color: 'from-orange-400 to-red-500' },
      ramen: { emoji: '🍜', label: 'Ramen', color: 'from-red-400 to-orange-500' },
      sushi: { emoji: '🍣', label: 'Sushi', color: 'from-pink-400 to-rose-500' },
      pasta: { emoji: '🍝', label: 'Pasta', color: 'from-yellow-400 to-amber-500' },
      tacos: { emoji: '🌮', label: 'Tacos', color: 'from-yellow-400 to-orange-500' },
      curry: { emoji: '🍛', label: 'Curry', color: 'from-orange-400 to-amber-500' },
      burger: { emoji: '🍔', label: 'Burgers', color: 'from-amber-500 to-orange-600' },
      soup: { emoji: '🍲', label: 'Soups & Stews', color: 'from-red-400 to-orange-500' },
      baking: { emoji: '🧁', label: 'Home Baking', color: 'from-pink-400 to-purple-500' },
      vegan: { emoji: '🥗', label: 'Plant-Based Food', color: 'from-green-400 to-lime-500' },
    },
  },
  {
    id: 'p7',
    question: "Night in or night out? What does your perfect evening look like?",
    category: 'Lifestyle',
    icon: '🌙',
    keywords: {
      homebody: { emoji: '🏠', label: 'Homebody', color: 'from-amber-400 to-orange-500' },
      social: { emoji: '🎉', label: 'Social Butterfly', color: 'from-pink-400 to-rose-500' },
      concert: { emoji: '🎸', label: 'Live Music', color: 'from-purple-400 to-violet-500' },
      cook: { emoji: '👨‍🍳', label: 'Cooking at Home', color: 'from-orange-400 to-red-500' },
      movie: { emoji: '🎬', label: 'Movie Nights', color: 'from-indigo-500 to-purple-600' },
      game: { emoji: '🎲', label: 'Game Nights', color: 'from-green-400 to-teal-500' },
      gallery: { emoji: '🖼️', label: 'Gallery Openings', color: 'from-violet-400 to-purple-500' },
      walk: { emoji: '🌃', label: 'Night Walks', color: 'from-indigo-600 to-blue-700' },
      star: { emoji: '🔭', label: 'Stargazing', color: 'from-indigo-500 to-purple-600' },
    },
  },
  {
    id: 'p8',
    question: "What creative skill do you wish you had or are learning?",
    category: 'Creativity',
    icon: '🎨',
    keywords: {
      paint: { emoji: '🎨', label: 'Painting', color: 'from-purple-400 to-pink-500' },
      music: { emoji: '🎹', label: 'Playing Music', color: 'from-blue-400 to-indigo-500' },
      photo: { emoji: '📷', label: 'Photography', color: 'from-slate-400 to-gray-500' },
      write: { emoji: '✍️', label: 'Creative Writing', color: 'from-amber-400 to-yellow-500' },
      code: { emoji: '💻', label: 'Coding / Dev', color: 'from-blue-400 to-cyan-500' },
      dance: { emoji: '💃', label: 'Dancing', color: 'from-pink-400 to-rose-500' },
      pottery: { emoji: '🏺', label: 'Pottery', color: 'from-amber-500 to-orange-600' },
      film: { emoji: '🎬', label: 'Film Making', color: 'from-red-500 to-rose-600' },
      design: { emoji: '✏️', label: 'Graphic Design', color: 'from-violet-400 to-purple-500' },
    },
  },
  {
    id: 'p9',
    question: "What's something most people don't know about you?",
    category: 'Deep Dive',
    icon: '🔮',
    keywords: {
      introvert: { emoji: '🤫', label: 'Secret Introvert', color: 'from-indigo-400 to-purple-500' },
      funny: { emoji: '😂', label: 'Secretly Hilarious', color: 'from-yellow-400 to-orange-500' },
      talent: { emoji: '🌟', label: 'Hidden Talent', color: 'from-amber-400 to-yellow-500' },
      travel: { emoji: '✈️', label: 'Travel Addict', color: 'from-sky-400 to-blue-500' },
      collect: { emoji: '🗂️', label: 'Collector', color: 'from-teal-400 to-cyan-500' },
      chef: { emoji: '👨‍🍳', label: 'Home Chef', color: 'from-orange-400 to-red-500' },
      nerd: { emoji: '🤓', label: 'Closet Nerd', color: 'from-blue-400 to-indigo-500' },
    },
  },
  {
    id: 'p10',
    question: "Cats or dogs? Or something else entirely?",
    category: 'Fun',
    icon: '🐾',
    keywords: {
      cat: { emoji: '🐱', label: 'Cat Person', color: 'from-orange-300 to-amber-400' },
      dog: { emoji: '🐶', label: 'Dog Person', color: 'from-yellow-400 to-amber-500' },
      bird: { emoji: '🦜', label: 'Bird Keeper', color: 'from-green-400 to-teal-500' },
      fish: { emoji: '🐠', label: 'Aquarium Lover', color: 'from-blue-400 to-cyan-500' },
      reptile: { emoji: '🦎', label: 'Reptile Fan', color: 'from-green-500 to-lime-600' },
      rabbit: { emoji: '🐰', label: 'Rabbit Parent', color: 'from-pink-300 to-rose-400' },
      neither: { emoji: '🌿', label: 'Plant Parent', color: 'from-green-400 to-emerald-500' },
    },
  },
];

// Extract discovery items from a message text using keyword matching
export function extractDiscoveries(text, prompt) {
  if (!text || !prompt) return [];
  const lower = text.toLowerCase();
  const found = [];
  if (!prompt.keywords) return found;
  for (const [key, item] of Object.entries(prompt.keywords)) {
    if (lower.includes(key)) {
      found.push(item);
    }
  }
  return found;
}

// Get a random prompt not yet used in this conversation
export function getNextPrompt(usedIds = []) {
  const unused = CHAT_PROMPTS.filter(p => !usedIds.includes(p.id));
  if (unused.length === 0) return null;
  return unused[Math.floor(Math.random() * unused.length)];
}
