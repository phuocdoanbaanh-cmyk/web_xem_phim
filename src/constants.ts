import { Movie } from './types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interstellar',
    originalTitle: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000',
    rating: 8.7,
    year: 2014,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: '2h 49m',
    status: 'completed',
    progress: 100,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine', 'Matt Damon'],
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    posterUrl: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=2000',
    rating: 8.8,
    year: 2024,
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    duration: '2h 46m',
    status: 'watching',
    progress: 45,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Josh Brolin'],
  },
  {
    id: '3',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000',
    rating: 8.4,
    year: 2023,
    genres: ['Biography', 'Drama', 'History'],
    duration: '3h 00m',
    status: 'plan_to_watch',
    progress: 0,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
  },
  {
    id: '4',
    title: 'Blade Runner 2049',
    originalTitle: 'Blade Runner 2049',
    description: 'A young blade runner\'s discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.',
    posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=2000',
    rating: 8.0,
    year: 2017,
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    duration: '2h 44m',
    status: 'watching',
    progress: 75,
  },
  {
    id: '5',
    title: 'Inception',
    originalTitle: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000',
    rating: 8.8,
    year: 2010,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    duration: '2h 28m',
    status: 'completed',
    progress: 100,
  },
  {
    id: '6',
    title: 'The Dark Knight',
    originalTitle: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=2000',
    rating: 9.0,
    year: 2008,
    genres: ['Action', 'Crime', 'Drama'],
    duration: '2h 32m',
    status: 'plan_to_watch',
    progress: 0,
  },
  {
    id: '7',
    title: 'The Matrix',
    originalTitle: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2000',
    rating: 8.7,
    year: 1999,
    genres: ['Action', 'Sci-Fi'],
    duration: '2h 16m',
    status: 'completed',
    progress: 100,
  },
  {
    id: '8',
    title: 'Avatar: The Way of Water',
    originalTitle: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000',
    rating: 7.6,
    year: 2022,
    genres: ['Action', 'Adventure', 'Fantasy'],
    duration: '3h 12m',
    status: 'watching',
    progress: 30,
  },
  {
    id: '9',
    title: 'Spider-Man: Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=1000',
    backdropUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=2000',
    rating: 8.6,
    year: 2023,
    genres: ['Animation', 'Action', 'Adventure'],
    duration: '2h 20m',
    status: 'plan_to_watch',
    progress: 0,
  }
];

export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
  'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

export const STATUS_OPTIONS = [
  { value: 'watching', label: 'Watching', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-yellow-500' },
  { value: 'dropped', label: 'Dropped', color: 'bg-red-500' },
  { value: 'plan_to_watch', label: 'Plan to Watch', color: 'bg-zinc-500' }
];

export const THEME_COLORS = [
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#10b981', // Emerald
];
