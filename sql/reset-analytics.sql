-- ============================================
-- RESET ALL PROJECT ANALYTICS TO ZERO
-- Run this in Supabase SQL Editor
-- ============================================

-- Reset all analytics fields to 0
UPDATE projects
SET 
    view_count = 0,
    github_clicks = 0,
    demo_clicks = 0,
    blog_clicks = 0,
    details_views = 0
WHERE published = true;

-- Verify the reset worked
SELECT 
    title,
    slug,
    view_count,
    github_clicks,
    demo_clicks,
    blog_clicks,
    details_views,
    created_at
FROM projects
WHERE published = true
ORDER BY featured DESC, created_at DESC;

-- Expected result: All count fields should show 0
