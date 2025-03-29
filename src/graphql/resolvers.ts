import { prisma } from '@/lib/prisma'
import { GraphQLError } from 'graphql';

// Define resolver context type
interface Context {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

// Define vote type
enum VoteType {
  UP = 'UP',
  DOWN = 'DOWN',
  NONE = 'NONE'
}

// Define reading status type
enum ReadingStatus {
  WANT_TO_READ = 'WANT_TO_READ',
  READING = 'READING',
  READ = 'READ',
  DNF = 'DNF'
}

// Define parent types for each resolver
interface Book {
  id: string;
  isbn?: string;
  isbn13?: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  coverImage?: string;
  language?: string;
  averageRating?: number;
  ratingsCount?: number;
  created_at: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  created_at: Date;
  updatedAt: Date;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author_id: string;
  book_id: string;
  created_at: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  discussion_id?: string;
  parent_id?: string;
  parent_type?: 'DISCUSSION' | 'COMMENT';
  created_at: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
}

interface ReadingList {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  user_id: string;
  created_at: Date;
  updatedAt: Date;
}

export const resolvers = {
  // Type resolvers
  User: {
    name: async (parent: User) => {
      // Fetch the profile to get the full_name
      const profile = await prisma.profiles.findUnique({
        where: { id: parent.id }
      });

      // Return full_name if available, otherwise fallback to email or a default value
      return profile?.full_name || parent.email?.split('@')[0] || 'User';
    },
    readingLists: async (parent: User) => {
      return await prisma.reading_lists.findMany({
        where: { user_id: parent.id }
      });
    },
    discussions: async (parent: User) => {
      return await prisma.discussions.findMany({
        where: { author_id: parent.id }
      });
    },
    comments: async (parent: User) => {
      return await prisma.comments.findMany({
        where: { author_id: parent.id }
      });
    },
    following: async (parent: User) => {
      const follows = await prisma.follows.findMany({
        where: { follower_id: parent.id },
        // include: { following: true }
      });
      return follows.map(follow => follow.following_id);
    },
    followers: async (parent: User) => {
      const follows = await prisma.follows.findMany({
        where: { following_id: parent.id },
        // include: { follower: true }
      });
      return follows.map(follow => follow.follower_id);
    }
  },

  Book: {
    discussions: async (parent: Book) => {
      return await prisma.discussions.findMany({
        where: { book_id: parent.id }
      });
    },
    // readingLists: async (parent: Book) => {
    //   const bookInLists = await prisma.reading_lists.findMany({
    //     where: { book_id: parent.id },
    //     include: { readingList: true }
    //   });
    //   return bookInLists.map(item => item.readingList);
    // }
  },

  Discussion: {
    author: async (parent: Discussion) => {
      return await prisma.authUser.findUnique({
        where: { id: parent.author_id }
      });
    },
    book: async (parent: Discussion) => {
      return await prisma.books.findUnique({
        where: { id: parent.book_id }
      });
    },
    comments: async (parent: Discussion) => {
      return await prisma.comments.findMany({
        where: { parent_discussion_id: parent.id }
      });
    },
    createdAt: (parent: Discussion) => {
      // Convert the Date object to ISO string for GraphQL
      return parent.created_at.toISOString();
    },
    updatedAt: (parent: Discussion) => {
      return parent.updatedAt.toISOString();
    },
    userVote: async (parent: Discussion, _: any, { user }: Context) => {
      if (!user) return null;
      const vote = await prisma.votes.findUnique({
        where: {
          user_id_discussion_id: {
            user_id: user.id,
            discussion_id: parent.id
          }
        }
      });
      return vote?.type ?? 'NONE';
    },
    replies: async (parent: Discussion) => {
      return await prisma.comments.findMany({
        where: { parent_discussion_id: parent.id }
      });
    },
  },

  Comment: {
    author: async (parent: Comment) => {
      return await prisma.authUser.findUnique({
        where: { id: parent.author_id }
      });
    },
    discussion: async (parent: Comment) => {
      return await prisma.discussions.findUnique({
        where: { id: parent.discussion_id }
      });
    },
    parent: async (parent: Comment) => {
      if (!parent.parent_id || !parent.parent_type) return null;

      return await prisma.comments.findUnique({
        where: { id: parent.parent_id }
      });
    },
    replies: async (parent: Comment) => {
      return await prisma.comments.findMany({
        where: {
          parent_comment_id: parent.id,
          parent_type: 'COMMENT'
        },
        orderBy: { created_at: 'desc' }
      });
    },
    userVote: async (parent: Comment, _: any, { user }: Context) => {
      if (!user) return null;
      const vote = await prisma.votes.findUnique({
        where: {
          user_id_comment_id: {
            user_id: user.id,
            comment_id: parent.id
          }
        }
      });
      return vote?.type ?? 'NONE';
    },
    createdAt: (parent: Discussion) => {
      // Convert the Date object to ISO string for GraphQL
      return parent.created_at.toISOString();
    },
    updatedAt: (parent: Discussion) => {
      return parent.updatedAt.toISOString();
    },
  },

  ReadingList: {
    owner: async (parent: ReadingList) => {
      return await prisma.authUser.findUnique({
        where: { id: parent.user_id }
      });
    },
    // books: async (parent: ReadingList) => {
    //   const booksInList = await prisma.reading_lists.findMany({
    //     where: { readingListId: parent.id },
    //     include: { book: true }
    //   });
    //   return booksInList.map(item => item.book);
    // }
  },
  Query: {
    // User queries
    me: async (_: any, __: any, { user }: Context) => {
      if (!user) return null;
      return await prisma.authUser.findUnique({ where: { id: user.id } });
    },

    user: async (_: any, { id }: { id: string }) => {
      return await prisma.authUser.findUnique({ where: { id } });
    },

    users: async (_: any, { limit, offset }: { limit?: number, offset?: number }) => {
      return await prisma.authUser.findMany({
        take: limit ?? undefined,
        skip: offset ?? undefined,
        orderBy: { created_at: 'desc' }
      });
    },

    // Public queries - no auth check
    books: async (_: any, { limit, offset }: { limit?: number, offset?: number }) => {
      return await prisma.books.findMany({
        take: limit ?? undefined,
        skip: offset ?? undefined,
      });
    },

    book: async (_: any, { id, isbn }: { id?: string, isbn?: string }) => {
      try {
        // Public access to book details
        if (id) {
          const book = await prisma.books.findUnique({ where: { id } });
          return book;
        } else if (isbn) {
          const book = await prisma.books.findFirst({
            where: {
              OR: [
                { isbn: { equals: isbn } },
                { isbn13: { equals: isbn } }
              ]
            }
          });
          return book;
        }
        throw new GraphQLError('You must provide either id or isbn');
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Error in book resolver:', error);
        throw new GraphQLError('An error occurred while fetching the book');
      }
    },

    searchBooks: async (_: any, { query, limit }: { query: string, limit?: number }) => {
      return await prisma.books.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { authors: { has: query } },
            { isbn: { contains: query } },
            { isbn13: { contains: query } }
          ]
        },
        take: limit ?? 20,
        orderBy: { created_at: 'desc' }
      });
    },

    // Discussion queries
    discussion: async (_: any, { id }: { id: string }) => {
      return await prisma.discussions.findUnique({ where: { id } });
    },

    discussions: async (_: any, { bookId, limit, offset }: { bookId: string, limit?: number, offset?: number }) => {
      return await prisma.discussions.findMany({
        where: { book_id: bookId },
        take: limit ?? undefined,
        skip: offset ?? undefined,
        orderBy: { created_at: 'desc' }
      });
    },

    // Comment queries
    comment: async (_: any, { id }: { id: string }) => {
      return await prisma.comments.findUnique({ where: { id } });
    },

    commentsByDiscussion: async (_: any, { discussionId, limit, offset }: { discussionId: string, limit?: number, offset?: number }) => {
      return await prisma.comments.findMany({
        where: { parent_discussion_id: discussionId },
        take: limit ?? undefined,
        skip: offset ?? undefined,
        orderBy: { created_at: 'desc' }
      });
    },

    // Reading list queries
    readingList: async (_: any, { id }: { id: string }) => {
      return await prisma.reading_lists.findUnique({
        where: { id }
      });
    },

    myReadingLists: async (_: any, __: any, { user }: Context) => {
      if (!user) return [];

      return await prisma.reading_lists.findMany({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      });
    },

    myBookStatus: async (_: any, { bookId }: { bookId: string }, { user }: Context) => {
      if (!user) return null;

      return await prisma.book_user_status.findUnique({
        where: {
          book_id_user_id: {
            book_id: bookId,
            user_id: user.id
          }
        }
      });
    },

    discussionsByUser: async (_: any, { userId, limit, offset }: { userId: string, limit?: number, offset?: number }) => {
      return await prisma.discussions.findMany({
        where: { author_id: userId },
        take: limit ?? undefined,
        skip: offset ?? undefined,
        orderBy: { created_at: 'desc' }
      });
    },
  },

  Mutation: {
    addBookToReadingList: async (_: any, { bookId }: { bookId: string }, { user }: Context) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to add books to reading lists');
      }

      // Find or create default reading list for user
      let readingList = await prisma.reading_lists.findFirst({
        where: { user_id: user.id }
      });

      if (!readingList) {
        // Create default reading list for user
        readingList = await prisma.reading_lists.create({
          data: {
            name: 'My Reading List',
            description: 'Default reading list',
            user_id: user.id,
            is_public: false
          }
        });
      }

      // Check if book exists
      const book = await prisma.books.findUnique({
        where: { id: bookId }
      });

      if (!book) {
        throw new GraphQLError('Book not found');
      }

      // Add book to reading list if not already added
      const existingBook = await prisma.book_in_reading_list.findUnique({
        where: {
          book_id_reading_list_id: {
            book_id: bookId,
            reading_list_id: readingList.id
          }
        }
      });

      if (!existingBook) {
        await prisma.book_in_reading_list.create({
          data: {
            book_id: bookId,
            reading_list_id: readingList.id
          }
        });
      }

      const updatedList = await prisma.reading_lists.findUnique({
        where: { id: readingList.id },
        include: { 
          book_in_reading_list: {
            include: {
              books: true
            }
          }
        }
      });

      if (!updatedList) {
        throw new GraphQLError('Failed to retrieve updated reading list');
      }

      return {
        ...updatedList,
        isPublic: updatedList.is_public,
        books: updatedList.book_in_reading_list.map(item => item.books)
      };
    },

    // removeBookFromReadingList: async (_: any, { bookId, readingListId }: { book_id: string, readingListId: string }, { user }: Context) => {
    //   if (!user) {
    //     throw new GraphQLError('You must be logged in to remove books from reading lists');
    //   }
    //   await prisma.reading_lists.delete({
    //     where: {
    //       book_id_readingListId: {
    //         bookId,
    //         readingListId
    //       }
    //     }
    //   });
    //   return await prisma.reading_lists.findUnique({ where: { id: readingListId } });
    // },

    // User mutations
    // updateUser: async (_: any, { name, avatar }: { name?: string, avatar?: string }, { user }: Context) => {
    //   if (!user) {
    //     throw new GraphQLError('You must be logged in to update your profile', {
    //       extensions: { code: 'UNAUTHENTICATED' }
    //     });
    //   }

    //   return await prisma.authUser.update({
    //     where: { id: user.id },
    //     data: {
    //       authUse: name ?? undefined,
    //       avatar: avatar ?? undefined
    //     }
    //   });
    // },

    // followUser: async (_: any, { userId }: { user_id: string }, { user }: Context) => {
    //   if (!user) {
    //     throw new GraphQLError('You must be logged in to follow users');
    //   }

    //   if (user.id === userId) {
    //     throw new GraphQLError('You cannot follow yourself');
    //   }

    //   // Check if the user exists
    //   const targetUser = await prisma.authUser.findUnique({ where: { id: userId } });
    //   if (!targetUser) {
    //     throw new GraphQLError('User not found');
    //   }

    //   // Add the follow relationship
    //   await prisma.follows.create({
    //     data: {
    //       follower_id: user.id,
    //       followingId: userId
    //     }
    //   });

    //   return targetUser;
    // },

    // unfollowUser: async (_: any, { userId }: { user_id: string }, { user }: Context) => {
    //   if (!user) {
    //     throw new GraphQLError('You must be logged in to unfollow users');
    //   }

    //   // Check if the user exists
    //   const targetUser = await prisma.authUser.findUnique({ where: { id: userId } });
    //   if (!targetUser) {
    //     throw new GraphQLError('User not found');
    //   }

    //   // Remove the follow relationship
    //   await prisma.follows.delete({
    //     where: {
    //       followerId_followingId: {
    //         follower_id: user.id,
    //         followingId: userId
    //       }
    //     }
    //   });

    //   return targetUser;
    // },

    // voteDiscussion: async (_: any, { id, vote }: { id: string, vote: VoteType }, { user }: Context) => {
    //   if (!user) {
    //     throw new GraphQLError('You must be logged in to vote');
    //   }
    //   const discussion = await prisma.discussions.findUnique({ where: { id } });
    //   if (!discussion) {
    //     throw new GraphQLError('Discussion not found');
    //   }

    //   const existingVote = await prisma.votes.findUnique({
    //     where: {
    //       user_id_discussion_id: {
    //         user_id: user.id,
    //         discussion_id: id
    //       }
    //     }
    //   });

    //   if (existingVote) {
    //     if (vote === VoteType.NONE) {
    //       // Delete the vote and update counts
    //       await prisma.votes.delete({
    //         where: {
    //           user_id_discussion_id: {
    //             user_id: user.id,
    //             discussion_id: id
    //           }
    //         }
    //       });
    //       await prisma.discussions.update({
    //         where: { id },
    //         data: {
    //           likes: discussion.likes! - (existingVote.type === VoteType.UP ? 1 : 0),
    //           dislikes: discussion.dislikes! - (existingVote.type === VoteType.DOWN ? 1 : 0)
    //         }
    //       });
    //     } else if (existingVote.type !== vote) {
    //       // Update vote type and counts
    //       await prisma.votes.update({
    //         where: {
    //           user_id_discussion_id: {
    //             user_id: user.id,
    //             discussion_id: id
    //           }
    //         },
    //         data: { type: vote }
    //       });
    //       if (existingVote.type === VoteType.UP && vote === VoteType.DOWN) {
    //         await prisma.discussions.update({
    //           where: { id },
    //           data: {
    //             likes: discussion.likes! - 1,
    //             dislikes: discussion.dislikes! + 1
    //           }
    //         });
    //       } else if (existingVote.type === VoteType.DOWN && vote === VoteType.UP) {
    //         await prisma.discussions.update({
    //           where: { id },
    //           data: {
    //             likes: discussion.likes! + 1,
    //             dislikes: discussion.dislikes! - 1
    //           }
    //         });
    //       }
    //     }
    //   } else if (vote !== VoteType.NONE) {
    //     // Create new vote
    //     await prisma.votes.create({
    //       data: {
    //         type: vote,
    //         user_id: user.id,
    //         discussion_id: id
    //       }
    //     });
    //     await prisma.discussions.update({
    //       where: { id },
    //       data: {
    //         likes: discussion.likes! + (vote === VoteType.UP ? 1 : 0),
    //         dislikes: discussion.dislikes! + (vote === VoteType.DOWN ? 1 : 0)
    //       }
    //     });
    //   }

    //   return await prisma.discussions.findUnique({ where: { id } });
    // },

    // Comment mutations
    createComment: async (_: any, { content, parentId, parentType }: { parentId: string, content: string, parentType: 'DISCUSSION' | 'COMMENT' }, { user }: Context) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to add a comment');
      }

      // Validate parent exists if parentId is provided
      if (parentId) {
        if (parentType === 'DISCUSSION') {
          const discussion = await prisma.discussions.findUnique({ where: { id: parentId } });
          if (!discussion) {
            throw new GraphQLError('Parent discussion not found');
          }
          return await prisma.comments.create({
            data: {
              content,
              parent_discussion_id: parentId,
              author_id: user.id,
              parent_type: parentType,
              likes: 0,
              dislikes: 0
            }
          });
        } else if (parentType === 'COMMENT') {
          const parentComment = await prisma.comments.findUnique({ where: { id: parentId } });
          if (!parentComment) {
            throw new GraphQLError('Parent comment not found');
          }
          return await prisma.comments.create({
            data: {
              content,
              parent_comment_id: parentId,
              author_id: user.id,
              parent_type: parentType,
              likes: 0,
              dislikes: 0
            }
          });
        }
      }
    },



    updateComment: async (_: any, { id, content }: { id: string, content: string }, { user }: Context) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to update a comment');
      }
      const comment = await prisma.comments.findUnique({ where: { id } });
      if (!comment) {
        throw new GraphQLError('Comment not found');
      }
      if (comment.author_id !== user.id) {
        throw new GraphQLError('You can only update your own comments');
      }
      return await prisma.comments.update({
        where: { id },
        data: { content }
      });
    },

    voteComment: async (_: any, { id, vote }: { id: string, vote: VoteType }, { user }: Context) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to vote');
      }
      const comment = await prisma.comments.findUnique({ where: { id } });
      if (!comment) {
        throw new GraphQLError('Comment not found');
      }

      const existingVote = await prisma.votes.findUnique({
        where: {
          user_id_comment_id: {
            user_id: user.id,
            comment_id: id
          }
        }
      });

      if (existingVote) {
        if (vote === VoteType.NONE) {
          await prisma.votes.delete({
            where: {
              user_id_comment_id: {
                user_id: user.id,
                comment_id: id
              }
            }
          });
        } else {
          await prisma.votes.update({
            where: {
              user_id_comment_id: {
                user_id: user.id,
                comment_id: id
              }
            },
            data: { type: vote }
          });
        }
      } else if (vote !== VoteType.NONE) {
        await prisma.votes.create({
          data: {
            type: vote,
            user_id: user.id,
            comment_id: id
          }
        });
      }

      return await prisma.comments.findUnique({ where: { id } });
    },

    // Protected mutations - require auth
    createDiscussion: async (_: any, { bookId, title, content }: { bookId: string, title: string, content: string }, { user }: Context) => {
      // Check for authentication
      if (!user) {
        throw new GraphQLError('You must be logged in to create a discussion', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Check if book exists
      const book = await prisma.books.findUnique({ where: { id: bookId } });
      if (!book) {
        throw new GraphQLError('Book not found');
      }

      return await prisma.discussions.create({
        data: {
          title,
          content,
          book_id: bookId,
          author_id: user.id,
          // author: { connect: { id: user.id } },
          // book_id: { connect: { id: bookId } },
          likes: 0,
          dislikes: 0
        }
      });
    },

    updateDiscussion: async (_: any,
      { id, title, content }: { id: string, title?: string, content?: string },
      { user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to update a discussion');
      }

      // Check if discussion exists and belongs to user
      const discussion = await prisma.discussions.findUnique({ where: { id } });
      if (!discussion) {
        throw new GraphQLError('Discussion not found');
      }

      if (discussion.author_id !== user.id) {
        throw new GraphQLError('You can only update your own discussions');
      }

      return await prisma.discussions.update({
        where: { id },
        data: {
          title: title ?? undefined,
          content: content ?? undefined
        }
      });
    },

    // Book mutations
    createBook: async (_: any,
      {
        isbn,
        isbn13,
        title,
        authors,
        publisher,
        publishedDate,
        description,
        pageCount,
        categories,
        coverImage,
        language
      }: {
        isbn: string,
        isbn13?: string,
        title: string,
        authors: string[],
        publisher?: string,
        publishedDate?: string,
        description?: string,
        pageCount?: number,
        categories?: string[],
        coverImage?: string,
        language?: string
      },
      { user }: Context
    ) => {
      // Check if book already exists
      const existingBook = await prisma.books.findFirst({
        where: {
          OR: [
            { isbn },
            { isbn13: isbn13 ?? undefined }
          ]
        }
      });

      if (existingBook) {
        return existingBook;
      }

      // Create new book
      return await prisma.books.create({
        data: {
          isbn,
          isbn13,
          title,
          authors,
          publisher,
          published_date: publishedDate,
          description,
          page_count: pageCount,
          categories: categories ?? [],
          cover_image: coverImage,
          language
        }
      });
    },
  }
}
  ;