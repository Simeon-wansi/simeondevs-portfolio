#!/usr/bin/env node
// ============================================
// ENVIRONMENT VARIABLE INJECTOR FOR VERCEL
// Replaces placeholders in env.js with actual values
// ============================================

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting environment variable injection...');

// Read environment variables from Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Validate that environment variables exist
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ERROR: Environment variables not set!');
    console.error('   Missing:', {
        SUPABASE_URL: supabaseUrl ? '✅' : '❌',
        SUPABASE_ANON_KEY: supabaseAnonKey ? '✅' : '❌'
    });
    console.error('\n💡 Solution: Set environment variables in Vercel dashboard');
    console.error('   Vercel Dashboard → Settings → Environment Variables');
    process.exit(1);
}

console.log('✅ Environment variables found');
console.log('   SUPABASE_URL:', supabaseUrl.substring(0, 30) + '...');
console.log('   SUPABASE_ANON_KEY:', supabaseAnonKey.substring(0, 20) + '...');

// Path to env.js file
const envFilePath = path.join(__dirname, 'js', 'env.js');

// Check if env.js exists
if (!fs.existsSync(envFilePath)) {
    console.error('❌ ERROR: js/env.js not found!');
    console.error('   Expected path:', envFilePath);
    process.exit(1);
}

console.log('📄 Reading js/env.js...');

// Read env.js template
let envContent = fs.readFileSync(envFilePath, 'utf8');

console.log('🔄 Replacing placeholders...');

// Replace placeholders with actual values
envContent = envContent
    .replace('%%SUPABASE_URL%%', supabaseUrl)
    .replace('%%SUPABASE_ANON_KEY%%', supabaseAnonKey);

// Write back to file
fs.writeFileSync(envFilePath, envContent, 'utf8');

console.log('✅ Environment variables injected successfully!');
console.log('📝 Updated file:', envFilePath);
console.log('🚀 Ready for deployment!\n');