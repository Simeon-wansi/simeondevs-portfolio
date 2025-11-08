# Supabase Database Setup for Minimalist Project Cards

## Database Functions for Analytics

Run these SQL commands in your **Supabase SQL Editor** to create the necessary database functions:

### Function 1: Increment Project Details Views

This function increments the `details_views` counter when a user opens a project modal.

```sql
-- ============================================
-- INCREMENT PROJECT DETAILS VIEWS
-- ============================================

CREATE OR REPLACE FUNCTION increment_project_details_views(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects
    SET details_views = COALESCE(details_views, 0) + 1
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION increment_project_details_views(UUID) TO anon, authenticated;
```

### Function 2: Increment Project Clicks

This function increments click counters for various project links (GitHub, Demo, Blog).

```sql
-- ============================================
-- INCREMENT PROJECT CLICKS
-- ============================================

CREATE OR REPLACE FUNCTION increment_project_clicks(
    project_id UUID,
    click_field TEXT
)
RETURNS void AS $$
BEGIN
    -- Dynamically update the specified click field
    EXECUTE format(
        'UPDATE projects SET %I = COALESCE(%I, 0) + 1 WHERE id = $1',
        click_field,
        click_field
    ) USING project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION increment_project_clicks(UUID, TEXT) TO anon, authenticated;
```

---

## Verify Installation

After running the SQL commands, verify that the functions were created:

```sql
-- List all functions related to projects
SELECT
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%project%';
```

Expected output:
- `increment_project_details_views` | FUNCTION | void
- `increment_project_clicks` | FUNCTION | void

---

## Test the Functions

You can test the functions manually:

### Test 1: Increment Details Views

```sql
-- Replace 'YOUR_PROJECT_ID' with an actual project ID from your database
SELECT increment_project_details_views('YOUR_PROJECT_ID');

-- Verify the increment
SELECT id, title, details_views
FROM projects
WHERE id = 'YOUR_PROJECT_ID';
```

### Test 2: Increment Click Counters

```sql
-- Test GitHub clicks
SELECT increment_project_clicks('YOUR_PROJECT_ID', 'github_clicks');

-- Test Demo clicks
SELECT increment_project_clicks('YOUR_PROJECT_ID', 'demo_clicks');

-- Test Blog clicks
SELECT increment_project_clicks('YOUR_PROJECT_ID', 'blog_clicks');

-- Verify all increments
SELECT
    id,
    title,
    github_clicks,
    demo_clicks,
    blog_clicks
FROM projects
WHERE id = 'YOUR_PROJECT_ID';
```

---

## Database Fields Required

Make sure your `projects` table has all these fields (as mentioned in CLAUDE.md):

### Existing Fields
- id (UUID)
- title (TEXT)
- slug (TEXT)
- description (TEXT)
- image_url (TEXT)
- demo_url (TEXT)
- github_url (TEXT)
- technologies (TEXT[])
- category (TEXT)
- status (TEXT)
- featured (BOOLEAN)
- published (BOOLEAN)
- completed_date (TIMESTAMP)
- view_count (INTEGER)
- github_clicks (INTEGER)
- demo_clicks (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### New Fields for Minimalist Cards
- tagline (TEXT) - One-liner for cards
- primary_tech (TEXT) - Main technology

### New Fields for Rich Modal
- full_description (TEXT) - Detailed description
- thumbnail_url (TEXT) - Smaller image
- preview_gif_url (TEXT) - Animated preview
- video_url (TEXT) - Demo video
- gallery_urls (TEXT[]) - Array of images
- key_metrics (JSONB) - Key metrics object
- highlights (TEXT[]) - Array of highlights
- challenges (TEXT) - Challenges faced
- solutions (TEXT) - Solutions implemented
- results (TEXT) - Results achieved
- lessons_learned (TEXT[]) - Array of lessons

### New Metadata
- tags (TEXT[]) - Array of tags
- blog_post_url (TEXT)
- case_study_url (TEXT)
- start_date (TIMESTAMP)
- project_duration (TEXT)
- team_size (INTEGER)
- role (TEXT)
- collaborators (TEXT[]) - Array of collaborators

### New AI Scores
- complexity_score (INTEGER) - 0-100
- innovation_score (INTEGER) - 0-100
- business_impact_score (INTEGER) - 0-100

### New Analytics
- blog_clicks (INTEGER)
- details_views (INTEGER)

---

## Add Missing Fields (if needed)

If some fields are missing from your database, run this SQL to add them:

```sql
-- Add new fields for minimalist cards
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS primary_tech TEXT;

-- Add new fields for rich modal
ALTER TABLE projects ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS preview_gif_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS key_metrics JSONB;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS highlights TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenges TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solutions TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS results TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS lessons_learned TEXT[];

-- Add new metadata fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS blog_post_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date TIMESTAMP;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_duration TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_size INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS collaborators TEXT[];

-- Add AI scores
ALTER TABLE projects ADD COLUMN IF NOT EXISTS complexity_score INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS innovation_score INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS business_impact_score INTEGER;

-- Add new analytics
ALTER TABLE projects ADD COLUMN IF NOT EXISTS blog_clicks INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS details_views INTEGER DEFAULT 0;

-- Set default values for existing projects
UPDATE projects SET
    blog_clicks = 0 WHERE blog_clicks IS NULL;
UPDATE projects SET
    details_views = 0 WHERE details_views IS NULL;
```

---

## Troubleshooting

### Function Not Found Error
If you get "function does not exist" errors:
1. Make sure you ran the SQL in the correct database
2. Verify the function was created (see "Verify Installation" above)
3. Check that permissions were granted

### Permission Denied Error
If you get permission errors:
1. Make sure you ran the `GRANT EXECUTE` commands
2. Verify your RLS (Row Level Security) policies allow updates

### Field Missing Error
If you get "column does not exist" errors:
1. Run the "Add Missing Fields" SQL above
2. Verify fields were added using Supabase Table Editor

---

## Next Steps

After setting up the database:

1. ✅ Run the two function creation SQL commands
2. ✅ Verify functions were created successfully
3. ✅ Test the functions with sample project IDs
4. ✅ Add any missing fields to your projects table
5. ✅ Test the frontend by clicking project cards
6. ✅ Check browser console for any errors
7. ✅ Verify analytics are incrementing correctly

---

## Support

If you encounter any issues:
- Check Supabase logs for error details
- Verify your Supabase project URL and anon key are correct
- Make sure RLS policies allow the operations
- Test with a simple query first before using the functions
