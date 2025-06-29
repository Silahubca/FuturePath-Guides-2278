-- Bookmarks table for chapter bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  chapter_index INTEGER NOT NULL,
  chapter_title TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Bookmarks policies
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Highlights table for text highlighting
CREATE TABLE IF NOT EXISTS highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  chapter_index INTEGER NOT NULL,
  start_position INTEGER NOT NULL,
  end_position INTEGER NOT NULL,
  highlighted_text TEXT NOT NULL,
  color TEXT DEFAULT 'yellow',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on highlights
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

-- Highlights policies
CREATE POLICY "Users can manage their own highlights" ON highlights FOR ALL USING (auth.uid() = user_id);

-- Add current_chapter to reading_progress table
ALTER TABLE reading_progress ADD COLUMN IF NOT EXISTS current_chapter INTEGER DEFAULT 0;

-- User notes table for chapter-specific notes
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  chapter_index INTEGER NOT NULL,
  note_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_notes
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- User notes policies
CREATE POLICY "Users can manage their own notes" ON user_notes FOR ALL USING (auth.uid() = user_id);

-- Reading sessions table to track time spent
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  chapter_index INTEGER NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on reading_sessions
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Reading sessions policies
CREATE POLICY "Users can manage their own reading sessions" ON reading_sessions FOR ALL USING (auth.uid() = user_id);

-- Function to calculate total reading time
CREATE OR REPLACE FUNCTION calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Update time_spent in reading_progress when session ends
  IF NEW.session_end IS NOT NULL AND NEW.duration_minutes IS NOT NULL THEN
    UPDATE reading_progress 
    SET time_spent = time_spent + NEW.duration_minutes,
        updated_at = NOW()
    WHERE user_id = NEW.user_id AND product_id = NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for reading time calculation
DROP TRIGGER IF EXISTS on_reading_session_end ON reading_sessions;
CREATE TRIGGER on_reading_session_end
  AFTER UPDATE ON reading_sessions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_reading_time();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_product ON bookmarks(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_highlights_user_product ON highlights(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_product ON user_notes(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_product ON reading_sessions(user_id, product_id);