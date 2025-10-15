// ============================================
// SUPABASE CONFIGURATION TEMPLATE
// Copy this file to config.js and add your credentials
// NEVER commit config.js to GitHub!
// ============================================

const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here'
};

// Export for use in supabase-client.js
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
