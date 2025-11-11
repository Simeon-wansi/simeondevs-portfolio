// ============================================
// ENVIRONMENT VARIABLES LOADER
// Production configuration
// ============================================

(function() {
    console.log('🔧 Loading environment configuration...');
    
    // Check if config already exists (local development with config.js)
    if (window.SUPABASE_CONFIG) {
        console.log('✅ Using local config.js for development');
        return;
    }
    
    // Production: Use hardcoded values (public anon key is safe to expose)
    const supabaseUrl = 'https://eupbdsihwpptnxuyauuo.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cGJkc2lod3BwdG54dXlhdXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODE3NzIsImV4cCI6MjA3MjU1Nzc3Mn0.uVJpDIapM1f12_ubKg35EmAHDAv6W79ikjxaJ-fx-js';
    
    // Set global config
    window.SUPABASE_CONFIG = {
        url: supabaseUrl,
        anonKey: supabaseAnonKey
    };
    
    console.log('✅ Environment variables loaded');
    console.log('   Supabase URL:', supabaseUrl.substring(0, 30) + '...');
})();