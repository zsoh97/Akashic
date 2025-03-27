-- Drop existing comments table
DROP TABLE IF EXISTS public.comments CASCADE;

-- Create comments table with proper foreign key constraints
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  parent_discussion_id UUID REFERENCES public.discussions(id),
  parent_comment_id UUID REFERENCES public.comments(id),
  parent_type TEXT NOT NULL CHECK (parent_type IN ('DISCUSSION', 'COMMENT')),
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  -- Ensure exactly one parent reference is set based on parent_type
  CONSTRAINT parent_reference_check CHECK (
    (parent_type = 'DISCUSSION' AND parent_discussion_id IS NOT NULL AND parent_comment_id IS NULL) OR
    (parent_type = 'COMMENT' AND parent_comment_id IS NOT NULL AND parent_discussion_id IS NULL)
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