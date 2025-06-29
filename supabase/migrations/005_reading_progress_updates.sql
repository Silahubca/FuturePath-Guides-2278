-- Add completed_chapters_array column to reading_progress table
ALTER TABLE reading_progress ADD COLUMN IF NOT EXISTS completed_chapters_array INTEGER[] DEFAULT '{}';

-- Update the trigger function to handle the new array column
CREATE OR REPLACE FUNCTION update_reading_progress() RETURNS TRIGGER AS $$
BEGIN
    -- Calculate completion percentage
    NEW.completion_percentage = ROUND((NEW.completed_sections::DECIMAL / NEW.total_sections) * 100);
    
    -- Update timestamp
    NEW.updated_at = NOW();
    
    -- Log activity
    INSERT INTO user_activity (user_id, action, details) VALUES (
        NEW.user_id,
        'Reading Progress Updated',
        jsonb_build_object(
            'product_id', NEW.product_id,
            'completion_percentage', NEW.completion_percentage,
            'sections_completed', NEW.completed_sections,
            'current_chapter', NEW.current_chapter
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for better performance on completed_chapters_array
CREATE INDEX IF NOT EXISTS idx_reading_progress_completed_chapters ON reading_progress USING GIN (completed_chapters_array);

-- Update existing reading progress records to have proper total_sections for ai-job-search
UPDATE reading_progress 
SET total_sections = 7 
WHERE product_id = 'ai-job-search' AND (total_sections IS NULL OR total_sections = 10);