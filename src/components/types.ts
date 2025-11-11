export interface Video {
  id: number;
  username: string;
  avatar: string;
  description: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
  isAI: boolean;
  trend?: string;
  allowCollab: boolean;
  allowRemix: boolean;
  originalAuthor?: string;
  collabWith?: string[];
  isBlocked?: boolean;
  blockReason?: string;
  hasMusic?: boolean;
  voiceSwapped?: boolean;
  boombucks?: number;
}

export interface Stream {
  id: number;
  username: string;
  avatar: string;
  title: string;
  thumbnail: string;
  viewers: number;
  category: string;
  isLive: boolean;
}

export const mockStreams: Stream[] = [
  {
    id: 1,
    username: '@neon_gamer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neon',
    title: 'Космический турнир по AI-играм 🎮',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc',
    viewers: 12453,
    category: 'Игры',
    isLive: true
  },
  {
    id: 2,
    username: '@music_ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music',
    title: 'Создаём хиты с AI в реальном времени 🎵',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    viewers: 8921,
    category: 'Музыка',
    isLive: true
  },
  {
    id: 3,
    username: '@tech_wizard',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    title: 'Собираю робота с нейросетью 🤖',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    viewers: 15234,
    category: 'Технологии',
    isLive: true
  },
  {
    id: 4,
    username: '@art_creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=art',
    title: 'Рисую мир мечты в Midjourney ✨',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    viewers: 6782,
    category: 'Творчество',
    isLive: true
  }
];

export const mockVideos: Video[] = [
  {
    id: 1,
    username: '@cosmic_creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic',
    description: 'Создал эту галактику в AI! 🌌 #streamboom #ai',
    videoUrl: 'https://cdn.poehali.dev/files/0ccaf940-5099-4e11-af1b-7d010a0505f3.jpg',
    likes: 15234,
    comments: 842,
    shares: 1203,
    isAI: true,
    trend: 'Космические визуализации',
    allowCollab: true,
    allowRemix: false,
    boombucks: 234
  },
  {
    id: 2,
    username: '@fire_artist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fire',
    description: 'Огненный танец под звездами 🔥✨',
    videoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    likes: 23451,
    comments: 1234,
    shares: 2341,
    isAI: false,
    trend: 'Танцевальные челленджи',
    allowCollab: false,
    allowRemix: false,
    hasMusic: true,
    voiceSwapped: true,
    boombucks: 567
  },
  {
    id: 3,
    username: '@ai_dreams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dreams',
    description: 'AI сгенерировал этот сюр 🤖💭 #streamboom',
    videoUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
    likes: 18756,
    comments: 967,
    shares: 1532,
    isAI: true,
    allowCollab: true,
    allowRemix: true,
    boombucks: 1205
  },
  {
    id: 4,
    username: '@remix_master',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=remix',
    description: 'Ремикс от @ai_dreams - добавил визуал! 🎨🎵 #Collab',
    videoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
    likes: 9876,
    comments: 432,
    shares: 789,
    isAI: true,
    originalAuthor: '@ai_dreams',
    allowCollab: true,
    allowRemix: false,
    boombucks: 89
  },
  {
    id: 5,
    username: '@collab_duo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=duo',
    description: 'Коллаб с @cosmic_creator 🤝✨ Вместе мы сила!',
    videoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
    likes: 14567,
    comments: 654,
    shares: 1234,
    isAI: true,
    collabWith: ['@cosmic_creator', '@collab_duo'],
    allowCollab: true,
    allowRemix: true,
    boombucks: 432
  },
  {
    id: 6,
    username: '@blocked_user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blocked',
    description: 'Запрещённый контент',
    videoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
    likes: 0,
    comments: 0,
    shares: 0,
    isAI: false,
    allowCollab: false,
    allowRemix: false,
    isBlocked: true,
    blockReason: 'Нарушение законодательства',
    boombucks: 0
  }
];
