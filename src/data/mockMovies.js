// Mock movie data for prototype
export const mockMovies = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    posterUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    backdropUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 600,
    year: 2008,
    genre: 'Animation'
  },
  {
    id: '2',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    posterUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    backdropUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 600,
    year: 2008,
    genre: 'Animation'
  },
  {
    id: '3',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    posterUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    backdropUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 600,
    year: 2008,
    genre: 'Animation'
  },
  {
    id: '4',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    posterUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    backdropUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 600,
    year: 2008,
    genre: 'Animation'
  },
  {
    id: '5',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    posterUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    backdropUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 600,
    year: 2008,
    genre: 'Animation'
  },
  {
    id: '6',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    posterUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    backdropUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: 600,
    year: 2008,
    genre: 'Animation'
  }
]

export function getMovieById(id) {
  return mockMovies.find(movie => movie.id === id)
}

export function getAllMovies() {
  return mockMovies
}

