-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create a profiles table that extends the auth.users table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.email, '', '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create books table
CREATE TABLE public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  isbn TEXT UNIQUE,
  isbn13 TEXT UNIQUE,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  publisher TEXT,
  published_date TEXT,
  description TEXT,
  page_count INTEGER,
  categories TEXT[],
  cover_image TEXT,
  language TEXT,
  average_rating FLOAT DEFAULT 0,
  ratings_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on books
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view books
CREATE POLICY "Anyone can view books" 
  ON public.books 
  FOR SELECT 
  USING (true);

-- Create discussions table
CREATE TABLE public.discussions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  book_id UUID REFERENCES public.books(id) NOT NULL,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on discussions
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view discussions
CREATE POLICY "Anyone can view discussions" 
  ON public.discussions 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to create discussions
CREATE POLICY "Authenticated users can create discussions" 
  ON public.discussions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Create policy to allow users to update their own discussions
CREATE POLICY "Users can update their own discussions" 
  ON public.discussions 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Create policy to allow users to delete their own discussions
CREATE POLICY "Users can delete their own discussions" 
  ON public.discussions 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  parent_id UUID NOT NULL,
  parent_type TEXT NOT NULL CHECK (parent_type IN ('DISCUSSION', 'COMMENT')),
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT valid_parent_reference CHECK (
    (parent_type = 'DISCUSSION' AND EXISTS (SELECT 1 FROM public.discussions WHERE id = parent_id)) OR
    (parent_type = 'COMMENT' AND EXISTS (SELECT 1 FROM public.comments WHERE id = parent_id))
  )
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view comments
CREATE POLICY "Anyone can view comments" 
  ON public.comments 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to create comments
CREATE POLICY "Authenticated users can create comments" 
  ON public.comments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Create policy to allow users to update their own comments
CREATE POLICY "Users can update their own comments" 
  ON public.comments 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Create policy to allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" 
  ON public.comments 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Create votes table
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  discussion_id UUID REFERENCES public.discussions(id),
  comment_id UUID REFERENCES public.comments(id),
  type TEXT NOT NULL CHECK (type IN ('UP', 'DOWN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT one_target_only CHECK (
    (discussion_id IS NULL AND comment_id IS NOT NULL) OR
    (discussion_id IS NOT NULL AND comment_id IS NULL)
  ),
  CONSTRAINT unique_discussion_vote UNIQUE (user_id, discussion_id),
  CONSTRAINT unique_comment_vote UNIQUE (user_id, comment_id)
);

-- Enable RLS on votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own votes
CREATE POLICY "Users can view their own votes" 
  ON public.votes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to create votes
CREATE POLICY "Authenticated users can create votes" 
  ON public.votes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own votes
CREATE POLICY "Users can update their own votes" 
  ON public.votes 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own votes
CREATE POLICY "Users can delete their own votes" 
  ON public.votes 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create reading lists table
CREATE TABLE public.reading_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on reading lists
ALTER TABLE public.reading_lists ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view public reading lists
CREATE POLICY "Anyone can view public reading lists" 
  ON public.reading_lists 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

-- Create policy to allow authenticated users to create reading lists
CREATE POLICY "Authenticated users can create reading lists" 
  ON public.reading_lists 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own reading lists
CREATE POLICY "Users can update their own reading lists" 
  ON public.reading_lists 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own reading lists
CREATE POLICY "Users can delete their own reading lists" 
  ON public.reading_lists 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create books in reading lists table
CREATE TABLE public.book_in_reading_list (
  book_id UUID REFERENCES public.books(id) NOT NULL,
  reading_list_id UUID REFERENCES public.reading_lists(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (book_id, reading_list_id)
);

-- Enable RLS on books in reading lists
ALTER TABLE public.book_in_reading_list ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view books in public reading lists
CREATE POLICY "Anyone can view books in public reading lists" 
  ON public.book_in_reading_list 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.reading_lists
      WHERE id = reading_list_id AND (is_public = true OR user_id = auth.uid())
    )
  );

-- Create policy to allow users to add books to their own reading lists
CREATE POLICY "Users can add books to their own reading lists" 
  ON public.book_in_reading_list 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reading_lists
      WHERE id = reading_list_id AND user_id = auth.uid()
    )
  );

-- Create policy to allow users to remove books from their own reading lists
CREATE POLICY "Users can remove books from their own reading lists" 
  ON public.book_in_reading_list 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.reading_lists
      WHERE id = reading_list_id AND user_id = auth.uid()
    )
  );

-- Create book user status table
CREATE TABLE public.book_user_status (
  book_id UUID REFERENCES public.books(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('WANT_TO_READ', 'READING', 'READ', 'DNF')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (book_id, user_id)
);

-- Enable RLS on book user status
ALTER TABLE public.book_user_status ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own book status
CREATE POLICY "Users can view their own book status" 
  ON public.book_user_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to create book status
CREATE POLICY "Authenticated users can create book status" 
  ON public.book_user_status 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own book status
CREATE POLICY "Users can update their own book status" 
  ON public.book_user_status 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create follows table
CREATE TABLE public.follows (
  follower_id UUID REFERENCES public.profiles(id) NOT NULL,
  following_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Enable RLS on follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view follows
CREATE POLICY "Anyone can view follows" 
  ON public.follows 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to create follows
CREATE POLICY "Authenticated users can create follows" 
  ON public.follows 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

-- Create policy to allow users to delete their own follows
CREATE POLICY "Users can delete their own follows" 
  ON public.follows 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = follower_id);