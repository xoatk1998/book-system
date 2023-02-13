export const testGlobal = {
  author: "author",
  title: "title",
  isbn: 234,
  userId: "1",
  recordId: "id",
  user: {
    userId: "1",
    username: "admin",
  },
  newAuthor: "Gin",
  pagination: {
    page: 1,
    perPage: 10,
  },
  book: {
    author: "author",
    title: "title",
    isbn: 234,
    userId: "1",
    id: "id"
  },
  createBookData: {
    author: "author",
    title: "title",
    isbn: 234,
  },
};

export const PinoLoggerMock = {
  error: jest.fn(),
  info: jest.fn(),
};
