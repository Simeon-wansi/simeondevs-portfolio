// ============================================
// ENVIRONMENT VARIABLES LOADER
// Production configuration
// ============================================

(function() {
    
    // Check if config already exists (local development with config.js)
    if (window.SUPABASE_CONFIG) {
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
    
})();