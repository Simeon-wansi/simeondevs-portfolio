// ============================================
// ENVIRONMENT VARIABLES LOADER
// This file gets modified during Vercel build
// Placeholders are replaced with actual values
// ============================================

(function() {
    console.log('🔧 Loading environment configuration...');
    
    // Check if config already exists (local development with config.js)
    if (window.SUPABASE_CONFIG) {
        console.log('✅ Using local config.js for development');
        return;
    }
    
    // Production: Use environment variables injected during build
    const supabaseUrl = '%%SUPABASE_URL%%';
    const supabaseAnonKey = '%%SUPABASE_ANON_KEY%%';
    
    // Validate that placeholders were replaced
    if (supabaseUrl.includes('%%') || supabaseAnonKey.includes('%%')) {
        console.error('❌ ERROR: Environment variables not injected!');
        console.error('   This usually means the build script did not run.');
        console.error('   Check Vercel build logs for errors.');
        
        // Show user-friendly error
        if (typeof showGlobalError === 'function') {
            showGlobalError('Configuration error. Please contact site administrator.');
        }
        return;
    }
    
    // Set global config
    window.SUPABASE_CONFIG = {
        url: supabaseUrl,
        anonKey: supabaseAnonKey
    };
    
    console.log('✅ Environment variables loaded from Vercel');
    console.log('   Supabase URL:', supabaseUrl.substring(0, 30) + '...');
})();