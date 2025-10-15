// ============================================
// SUPABASE CLIENT CONFIGURATION
// Real-time database connection for SimeonDevs Portfolio
// ============================================

// Import Supabase (already loaded via CDN in your HTML)
const { createClient } = supabase;

// ============================================
// GET CREDENTIALS FROM SECURE SOURCES
// ============================================

// Priority order:
// 1. Local development: window.SUPABASE_CONFIG (from js/config.js)
// 2. Production: window.ENV (from js/env.js, injected by Vercel)
// 3. Fallback: Placeholder strings (won't work, but won't expose real keys)

const supabaseUrl = 
    window.SUPABASE_CONFIG?.url ||           // Local: js/config.js
    window.ENV?.SUPABASE_URL ||              // Production: Vercel env vars
    'YOUR_SUPABASE_URL';                     // Fallback (placeholder)

const supabaseAnonKey = 
    window.SUPABASE_CONFIG?.anonKey ||       // Local: js/config.js
    window.ENV?.SUPABASE_ANON_KEY ||         // Production: Vercel env vars
    'YOUR_SUPABASE_ANON_KEY';                // Fallback (placeholder)

// ============================================
// VALIDATE CONFIGURATION
// ============================================

if (supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseUrl) {
    console.error('❌ Supabase URL not configured!');
    console.error('💡 Local dev: Create js/config.js with your credentials');
    console.error('💡 Production: Set SUPABASE_URL in Vercel environment variables');
}

if (supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY' || !supabaseAnonKey) {
    console.error('❌ Supabase Anon Key not configured!');
    console.error('💡 Local dev: Create js/config.js with your credentials');
    console.error('💡 Production: Set SUPABASE_ANON_KEY in Vercel environment variables');
}

// Log configuration source (for debugging)
if (window.SUPABASE_CONFIG) {
    console.log('✅ Using local config (js/config.js)');
} else if (window.ENV?.SUPABASE_URL) {
    console.log('✅ Using environment variables (Vercel)');
} else {
    console.warn('⚠️  No configuration found - using fallback placeholders');
}

// ============================================
// INITIALIZE SUPABASE CLIENT
// ============================================

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            eventsPerSecond: 10 // Optimize for free tier
        }
    }
});

// ============================================
// UTILITY: GENERATE ANONYMOUS VISITOR ID
// Used for analytics tracking (stored in localStorage)
// ============================================
function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('simeondev_visitor_id');
    
    if (!visitorId) {
        // Generate unique ID: timestamp + random string
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('simeondev_visitor_id', visitorId);
    }
    
    return visitorId;
}

// ============================================
// ANALYTICS: TRACK PAGE VIEW
// ============================================
async function trackPageView(pageName, pagePath = window.location.pathname) {
    try {
        const { error } = await supabaseClient
            .from('page_views')
            .insert({
                page_name: pageName,
                page_path: pagePath,
                visitor_id: getOrCreateVisitorId(),
                referrer: document.referrer || null,
                user_agent: navigator.userAgent
            });
        
        if (error) {
            console.warn('Page view tracking failed:', error);
        } else {
            console.log(`📊 Page view tracked: ${pageName}`);
        }
    } catch (err) {
        console.error('Analytics error:', err);
    }
}

// ============================================
// ANALYTICS: TRACK PROJECT CLICK
// ============================================
async function trackProjectClick(projectId, clickType) {
    try {
        // Insert click record
        const { error: clickError } = await supabaseClient
            .from('project_clicks')
            .insert({
                project_id: projectId,
                click_type: clickType, // 'github', 'demo', 'details'
                visitor_id: getOrCreateVisitorId()
            });
        
        if (clickError) {
            console.warn('Click tracking failed:', clickError);
            return;
        }
        
        // Increment aggregate counter in projects table
        const counterField = clickType === 'github' ? 'github_clicks' : 
                           clickType === 'demo' ? 'demo_clicks' : null;
        
        if (counterField) {
            await supabaseClient
                .from('projects')
                .update({ [counterField]: supabaseClient.raw(`${counterField} + 1`) })
                .eq('id', projectId);
        }
        
        console.log(`📊 Project click tracked: ${clickType} on project ${projectId}`);
    } catch (err) {
        console.error('Click tracking error:', err);
    }
}

// ============================================
// ANALYTICS: TRACK BLOG POST VIEW
// ============================================
async function trackBlogPostView(blogPostId) {
    try {
        // Insert view record
        const { error: viewError } = await supabaseClient
            .from('blog_post_views')
            .insert({
                blog_post_id: blogPostId,
                visitor_id: getOrCreateVisitorId()
            });
        
        if (viewError) {
            console.warn('Blog view tracking failed:', viewError);
            return;
        }
        
        // Increment view counter
        await supabaseClient
            .from('blog_posts')
            .update({ view_count: supabaseClient.raw('view_count + 1') })
            .eq('id', blogPostId);
        
        console.log(`📊 Blog post view tracked: ${blogPostId}`);
    } catch (err) {
        console.error('Blog view tracking error:', err);
    }
}

// ============================================
// EXPORT CLIENT AND UTILITIES
// ============================================
window.supabaseClient = supabaseClient;
window.trackPageView = trackPageView;
window.trackProjectClick = trackProjectClick;
window.trackBlogPostView = trackBlogPostView;
window.getOrCreateVisitorId = getOrCreateVisitorId;

console.log('✅ Supabase client initialized');