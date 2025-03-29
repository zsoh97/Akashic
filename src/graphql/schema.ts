import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
    createdAt: String!
    updatedAt: String!
    readingLists: [ReadingList!]
    discussions: [Discussion!]
    comments: [Comment!]
    following: [User!]
    followers: [User!]
  }

  type Book {
    id: ID!
    isbn: String
    isbn13: String
    title: String!
    authors: [String!]!
    publisher: String
    publishedDate: String
    description: String
    pageCount: Int
    categories: [String!]
    coverImage: String
    language: String
    averageRating: Float
    ratingsCount: Int
    createdAt: String!
    updatedAt: String!
    discussions: [Discussion!]
    readingLists: [ReadingList!]
    isInReadingList: Boolean
  }

  type Discussion {
    id: ID!
    title: String!
    content: String!
    author: User!
    book: Book!
    createdAt: String!
    updatedAt: String!
    likes: Int!
    dislikes: Int!
    comments: [Comment!]
    replies: [Comment!]
    userVote: VoteType
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    discussion: Discussion!
    parent: Comment
    parentId: ID
    replies: [Comment!]
    createdAt: String!
    updatedAt: String!
    likes: Int
    dislikes: Int
    userVote: VoteType
    user: User!
  }

  type ReadingList {
    id: ID!
    name: String!
    description: String
    owner: User!
    books: [Book!]!
    isPublic: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  enum VoteType {
    UP
    DOWN
    NONE
  }

  enum ReadingStatus {
    WANT_TO_READ
    READING
    READ
    DNF
  }

  type BookUserStatus {
    book: Book!
    user: User!
    status: ReadingStatus
    rating: Int
    review: String
    dateAdded: String!
    dateUpdated: String!
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users(limit: Int, offset: Int): [User!]!
    searchUsers(query: String!, limit: Int, offset: Int): [User!]!
    
    # Book queries
    book(id: ID, isbn: String, isbn13: String): Book
    books(limit: Int, offset: Int): [Book!]!
    searchBooks(query: String!, limit: Int): [Book!]!
    
    # Discussion queries
    discussion(id: ID!): Discussion
    discussions(bookId: ID!, limit: Int, offset: Int): [Discussion!]!
    discussionsByUser(userId: ID!, limit: Int, offset: Int): [Discussion!]!
    
    # Comment queries
    comment(id: ID!): Comment
    commentsByDiscussion(discussionId: ID!, limit: Int, offset: Int): [Comment!]!
    
    # Reading list queries
    readingList(id: ID!): ReadingList
    myReadingList: ReadingList
    publicReadingLists(limit: Int, offset: Int): [ReadingList!]!
    
    # Book status
    myBookStatus(bookId: ID!): BookUserStatus
  }

  type Mutation {
    # User mutations
    followUser(userId: ID!): User!
    unfollowUser(userId: ID!): User!
    updateUser(name: String, avatar: String): User!
    
    # Book mutations
    createBook(
      isbn: String!
      isbn13: String
      title: String!
      authors: [String!]!
      publisher: String
      publishedDate: String
      description: String
      pageCount: Int
      categories: [String!]
      coverImage: String
      language: String
    ): Book!
    
    removeBookFromReadingList(bookId: ID!): Book!
    updateBookStatus(bookId: ID!, status: ReadingStatus!, rating: Int, review: String): BookUserStatus!
    
    # Discussion mutations
    createDiscussion(bookId: ID!, title: String!, content: String!): Discussion!
    updateDiscussion(id: ID!, title: String, content: String): Discussion!
    deleteDiscussion(id: ID!): Boolean!
    voteDiscussion(id: ID!, vote: VoteType!): Discussion!
    
    # Comment mutations
    createComment(parentId: ID!, content: String!, parentType: String!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!
    voteComment(id: ID!, vote: VoteType!): Comment!
    
    # Reading list mutations
    createReadingList(name: String!, description: String, isPublic: Boolean!): ReadingList!
    addBookToReadingList(bookId: ID!): Book!
    updateReadingList(id: ID!, name: String, description: String, isPublic: Boolean): ReadingList!
    deleteReadingList(id: ID!): Boolean!
  }

  type Subscription {
    newDiscussion(bookId: ID): Discussion!
    newComment(discussionId: ID): Comment!
  }
`;