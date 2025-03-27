export const queryKeys = {
  books: {
    all: ['books'] as const,
    detail: (id: string) => ['books', id] as const,
    user: ['books', 'user'] as const,
  },
  user: {
    all: ['user'] as const,
    settings: ['user', 'settings'] as const,
  }
} as const 