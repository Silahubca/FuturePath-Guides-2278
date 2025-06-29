-- Reading progress tracking
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  completed_sections INTEGER DEFAULT 0,
  total_sections INTEGER DEFAULT 10,
  completion_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in minutes
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on reading_progress
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Reading progress policies
CREATE POLICY "Users can manage their own reading progress" ON reading_progress FOR ALL USING (auth.uid() = user_id);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  badge_type TEXT DEFAULT 'milestone',
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON achievements FOR INSERT WITH CHECK (true);

-- User goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('career', 'business', 'financial', 'personal')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  target_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_goals
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- User goals policies
CREATE POLICY "Users can manage their own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);

-- User activity tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_activity
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- User activity policies
CREATE POLICY "Users can view their own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activity" ON user_activity FOR INSERT WITH CHECK (true);

-- Function to update reading progress
CREATE OR REPLACE FUNCTION update_reading_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate completion percentage
  NEW.completion_percentage = ROUND((NEW.completed_sections::DECIMAL / NEW.total_sections) * 100);
  
  -- Update timestamp
  NEW.updated_at = NOW();
  
  -- Log activity
  INSERT INTO user_activity (user_id, action, details)
  VALUES (
    NEW.user_id,
    'Reading Progress Updated',
    jsonb_build_object(
      'product_id', NEW.product_id,
      'completion_percentage', NEW.completion_percentage,
      'sections_completed', NEW.completed_sections
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for reading progress updates
DROP TRIGGER IF EXISTS on_reading_progress_update ON reading_progress;
CREATE TRIGGER on_reading_progress_update
  BEFORE INSERT OR UPDATE ON reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_reading_progress();

-- Function to award achievements based on progress
CREATE OR REPLACE FUNCTION check_progress_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Award completion milestones
  IF NEW.completion_percentage >= 25 AND (OLD.completion_percentage IS NULL OR OLD.completion_percentage < 25) THEN
    INSERT INTO achievements (user_id, product_id, title, description, badge_type)
    VALUES (NEW.user_id, NEW.product_id, '25% Complete', 'Completed 25% of ' || NEW.product_id, 'progress');
  END IF;
  
  IF NEW.completion_percentage >= 50 AND (OLD.completion_percentage IS NULL OR OLD.completion_percentage < 50) THEN
    INSERT INTO achievements (user_id, product_id, title, description, badge_type)
    VALUES (NEW.user_id, NEW.product_id, '50% Complete', 'Completed 50% of ' || NEW.product_id, 'progress');
  END IF;
  
  IF NEW.completion_percentage >= 75 AND (OLD.completion_percentage IS NULL OR OLD.completion_percentage < 75) THEN
    INSERT INTO achievements (user_id, product_id, title, description, badge_type)
    VALUES (NEW.user_id, NEW.product_id, '75% Complete', 'Completed 75% of ' || NEW.product_id, 'progress');
  END IF;
  
  IF NEW.completion_percentage >= 100 AND (OLD.completion_percentage IS NULL OR OLD.completion_percentage < 100) THEN
    INSERT INTO achievements (user_id, product_id, title, description, badge_type)
    VALUES (NEW.user_id, NEW.product_id, '100% Complete', 'Completed ' || NEW.product_id || '!', 'completion');
    
    -- Send notification for completion
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      '🎉 Guide Completed!',
      'Congratulations! You''ve completed ' || NEW.product_id || '. Well done!',
      'success'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for progress achievements
DROP TRIGGER IF EXISTS on_progress_achievements ON reading_progress;
CREATE TRIGGER on_progress_achievements
  AFTER UPDATE ON reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION check_progress_achievements();

-- Function to award first purchase achievement
CREATE OR REPLACE FUNCTION award_first_purchase()
RETURNS TRIGGER AS $$
DECLARE
  purchase_count INTEGER;
BEGIN
  -- Count user's purchases
  SELECT COUNT(*) INTO purchase_count
  FROM purchases
  WHERE user_id = NEW.user_id;
  
  -- Award first purchase achievement
  IF purchase_count = 1 THEN
    INSERT INTO achievements (user_id, title, description, badge_type)
    VALUES (NEW.user_id, 'First Purchase', 'Made your first purchase!', 'milestone');
  END IF;
  
  -- Award bundle master achievement for complete collection
  IF NEW.product_id = 'complete-collection' THEN
    INSERT INTO achievements (user_id, title, description, badge_type)
    VALUES (NEW.user_id, 'Bundle Master', 'Purchased the complete collection!', 'special');
  END IF;
  
  -- Initialize reading progress
  INSERT INTO reading_progress (user_id, product_id, total_sections)
  VALUES (NEW.user_id, NEW.product_id, 10)
  ON CONFLICT (user_id, product_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for purchase achievements
DROP TRIGGER IF EXISTS on_purchase_achievements ON purchases;
CREATE TRIGGER on_purchase_achievements
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION award_first_purchase();

-- Function to track goal completion achievements
CREATE OR REPLACE FUNCTION track_goal_achievements()
RETURNS TRIGGER AS $$
DECLARE
  completed_goals_count INTEGER;
BEGIN
  -- If goal was completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Count total completed goals
    SELECT COUNT(*) INTO completed_goals_count
    FROM user_goals
    WHERE user_id = NEW.user_id AND status = 'completed';
    
    -- Award achievements based on completed goals
    IF completed_goals_count = 1 THEN
      INSERT INTO achievements (user_id, title, description, badge_type)
      VALUES (NEW.user_id, 'Goal Achiever', 'Completed your first goal!', 'milestone');
    ELSIF completed_goals_count = 5 THEN
      INSERT INTO achievements (user_id, title, description, badge_type)
      VALUES (NEW.user_id, 'Goal Crusher', 'Completed 5 goals!', 'milestone');
    ELSIF completed_goals_count = 10 THEN
      INSERT INTO achievements (user_id, title, description, badge_type)
      VALUES (NEW.user_id, 'Goal Master', 'Completed 10 goals!', 'special');
    END IF;
    
    -- Send notification
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      '🎯 Goal Completed!',
      'Congratulations on completing: ' || NEW.title,
      'success'
    );
    
    -- Log activity
    INSERT INTO user_activity (user_id, action, details)
    VALUES (
      NEW.user_id,
      'Goal Completed',
      jsonb_build_object(
        'goal_title', NEW.title,
        'category', NEW.category,
        'total_completed', completed_goals_count
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for goal achievements
DROP TRIGGER IF EXISTS on_goal_achievements ON user_goals;
CREATE TRIGGER on_goal_achievements
  AFTER UPDATE ON user_goals
  FOR EACH ROW
  EXECUTE FUNCTION track_goal_achievements();

-- Insert some sample achievements for existing users (optional)
-- This will run only if there are existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users LOOP
    -- Award welcome achievement if not already awarded
    INSERT INTO achievements (user_id, title, description, badge_type)
    SELECT user_record.id, 'Welcome!', 'Welcome to FuturePath Guides!', 'welcome'
    WHERE NOT EXISTS (
      SELECT 1 FROM achievements 
      WHERE user_id = user_record.id AND title = 'Welcome!'
    );
  END LOOP;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_product ON reading_progress(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_status ON user_goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_created ON user_activity(user_id, created_at);