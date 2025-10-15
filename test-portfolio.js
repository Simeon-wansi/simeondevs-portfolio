#!/usr/bin/env node

/**
 * ============================================
 * SIMEONDEVS PORTFOLIO - AUTOMATED TEST SUITE
 * ============================================
 * 
 * This script tests:
 * 1. Project structure and files
 * 2. Configuration setup
 * 3. HTML structure and script loading
 * 4. CSS files and dependencies
 * 5. JavaScript modules and functions
 * 6. Supabase integration readiness
 * 
 * Usage: node test-portfolio.js
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

// Test results tracker
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let warnings = 0;

// Helper functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(description, condition, critical = false) {
    totalTests++;
    if (condition) {
        passedTests++;
        log(`✅ ${description}`, 'green');
        return true;
    } else {
        if (critical) {
            failedTests++;
            log(`❌ ${description}`, 'red');
        } else {
            warnings++;
            log(`⚠️  ${description}`, 'yellow');
        }
        return false;
    }
}

function section(title) {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(title.toUpperCase(), 'cyan');
    log('='.repeat(60), 'cyan');
}

function fileExists(filePath) {
    return fs.existsSync(path.join(__dirname, filePath));
}

function readFile(filePath) {
    try {
        return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    } catch (error) {
        return null;
    }
}

function checkFileContent(filePath, searchString, description) {
    const content = readFile(filePath);
    if (!content) {
        return test(`${description} - File exists`, false, true);
    }
    return test(`${description}`, content.includes(searchString));
}

// ============================================
// TEST SUITE BEGINS
// ============================================

log('\n🚀 Starting SimeonDevs Portfolio Test Suite...', 'magenta');
log(`📁 Testing directory: ${__dirname}`, 'blue');
log(`⏰ Started at: ${new Date().toLocaleString()}\n`, 'blue');

// ============================================
// 1. PROJECT STRUCTURE
// ============================================
section('1. Project Structure');

const requiredFiles = [
    'index.html',
    '.gitignore',
    'vercel.json',
    'inject-env.js',
    'README.md'
];

requiredFiles.forEach(file => {
    test(`File exists: ${file}`, fileExists(file), true);
});

const requiredDirs = [
    'css',
    'js',
    'images',
    'data'
];

requiredDirs.forEach(dir => {
    test(`Directory exists: ${dir}`, fileExists(dir), true);
});

// ============================================
// 2. CSS FILES
// ============================================
section('2. CSS Files');

const cssFiles = [
    'css/theme.css',
    'css/main.css',
    'css/animations.css',
    'css/navigation.css',
    'css/hero.css',
    'css/components.css',
    'css/sections.css',
    'css/responsive.css',
    'css/matrix-theme.css',
    'css/color-variations.css',
    'css/profile-animations.css',
    'css/footer.css'
];

cssFiles.forEach(file => {
    test(`CSS file exists: ${file}`, fileExists(file));
});

// ============================================
// 3. JAVASCRIPT FILES
// ============================================
section('3. JavaScript Files');

const jsFiles = [
    'js/main.js',
    'js/supabase-client.js',
    'js/projects-supabase.js',
    'js/blog-supabase.js',
    'js/contact-supabase.js',
    'js/newsletter-supabase.js',
    'js/animations.js',
    'js/colorEngine.js',
    'js/footer.js',
    'js/env.js',
    'js/config.example.js'
];

jsFiles.forEach(file => {
    test(`JS file exists: ${file}`, fileExists(file), file.includes('supabase'));
});

// Check for config.js (should NOT exist if properly gitignored for production)
const hasConfigJs = fileExists('js/config.js');
if (hasConfigJs) {
    log('ℹ️  js/config.js exists (local development)', 'blue');
} else {
    log('ℹ️  js/config.js not found (production mode - will use env.js)', 'blue');
}

// ============================================
// 4. CONFIGURATION FILES
// ============================================
section('4. Configuration & Security');

// Check .gitignore
const gitignoreContent = readFile('.gitignore');
test('.gitignore exists', gitignoreContent !== null, true);
test('.gitignore protects js/config.js', 
    gitignoreContent && gitignoreContent.includes('js/config.js'), true);
test('.gitignore protects .env files', 
    gitignoreContent && gitignoreContent.includes('.env'), true);

// Check vercel.json
const vercelConfig = readFile('vercel.json');
test('vercel.json exists', vercelConfig !== null, true);
test('vercel.json has buildCommand', 
    vercelConfig && vercelConfig.includes('buildCommand'));
test('vercel.json has inject-env.js', 
    vercelConfig && vercelConfig.includes('inject-env.js'));

// Check inject-env.js
const injectEnv = readFile('inject-env.js');
test('inject-env.js exists', injectEnv !== null, true);
test('inject-env.js reads SUPABASE_URL', 
    injectEnv && injectEnv.includes('SUPABASE_URL'));
test('inject-env.js reads SUPABASE_ANON_KEY', 
    injectEnv && injectEnv.includes('SUPABASE_ANON_KEY'));

// Check env.js
const envJs = readFile('js/env.js');
test('js/env.js exists', envJs !== null, true);
test('js/env.js has placeholders', 
    envJs && envJs.includes('%%SUPABASE_URL%%'));

// ============================================
// 5. HTML STRUCTURE
// ============================================
section('5. HTML Structure');

const html = readFile('index.html');
test('index.html exists', html !== null, true);

if (html) {
    // Check meta tags
    test('Has charset meta tag', html.includes('charset="UTF-8"'));
    test('Has viewport meta tag', html.includes('viewport'));
    test('Has description meta tag', html.includes('meta name="description"'));
    
    // Check Supabase CDN
    test('Loads Supabase SDK from CDN', 
        html.includes('supabase-js@2') || html.includes('supabase.js'));
    
    // Check script loading order
    test('Loads env.js before other scripts', 
        html.indexOf('env.js') < html.indexOf('supabase-client.js'));
    test('Loads supabase-client.js', html.includes('supabase-client.js'));
    test('Loads main.js', html.includes('main.js'));
    test('Loads projects-supabase.js', html.includes('projects-supabase.js'));
    test('Loads blog-supabase.js', html.includes('blog-supabase.js'));
    test('Loads contact-supabase.js', html.includes('contact-supabase.js'));
    test('Loads newsletter-supabase.js', html.includes('newsletter-supabase.js'));
    
    // Check navigation
    test('Has navigation element', html.includes('<nav'));
    test('Has nav-links', html.includes('nav-links'));
    test('Has mobile menu toggle', html.includes('mobile-menu-toggle'));
    
    // Check pages
    const pages = ['home', 'projects', 'blog', 'about', 'services', 'contact'];
    pages.forEach(page => {
        test(`Has ${page} page section`, html.includes(`id="${page}"`));
    });
    
    // Check footer
    test('Has footer element', html.includes('<footer'));
    test('Has newsletter form', html.includes('newsletter-form'));
    test('Has social links', html.includes('social-link'));
}

// ============================================
// 6. JAVASCRIPT MODULES
// ============================================
section('6. JavaScript Modules');

// Check supabase-client.js
checkFileContent('js/supabase-client.js', 
    'createClient', 'Supabase client initialization');
checkFileContent('js/supabase-client.js', 
    'trackPageView', 'Page view tracking function');
checkFileContent('js/supabase-client.js', 
    'trackProjectClick', 'Project click tracking function');
checkFileContent('js/supabase-client.js', 
    'getOrCreateVisitorId', 'Visitor ID generation');

// Check projects-supabase.js
checkFileContent('js/projects-supabase.js', 
    'fetchProjects', 'Projects fetch function');
checkFileContent('js/projects-supabase.js', 
    'setupRealtimeSubscription', 'Real-time subscription setup');
checkFileContent('js/projects-supabase.js', 
    'renderProjects', 'Projects render function');
checkFileContent('js/projects-supabase.js', 
    'filterProjects', 'Projects filter function');

// Check blog-supabase.js
checkFileContent('js/blog-supabase.js', 
    'fetchBlogPosts', 'Blog posts fetch function');
checkFileContent('js/blog-supabase.js', 
    'setupBlogRealtimeSubscription', 'Blog real-time subscription');
checkFileContent('js/blog-supabase.js', 
    'showBlogPost', 'Blog post detail function');

// Check contact-supabase.js
checkFileContent('js/contact-supabase.js', 
    'handleContactFormSubmission', 'Contact form handler');
checkFileContent('js/contact-supabase.js', 
    'validateForm', 'Form validation function');

// Check newsletter-supabase.js
checkFileContent('js/newsletter-supabase.js', 
    'handleNewsletterSubmission', 'Newsletter handler');
checkFileContent('js/newsletter-supabase.js', 
    'validateEmail', 'Email validation function');

// Check main.js
checkFileContent('js/main.js', 
    'showPage', 'Page switching function');
checkFileContent('js/main.js', 
    'initializePageData', 'Page data initialization');

// ============================================
// 7. DATA FILES
// ============================================
section('7. Data Files');

test('projects.json exists', fileExists('data/projects.json'));

const projectsJson = readFile('data/projects.json');
if (projectsJson) {
    try {
        const data = JSON.parse(projectsJson);
        test('projects.json is valid JSON', true);
        test('projects.json has projects array', 
            Array.isArray(data.projects));
        test('projects.json has categories', 
            data.categories !== undefined);
    } catch (e) {
        test('projects.json is valid JSON', false, true);
    }
}

// ============================================
// 8. SECURITY CHECKS
// ============================================
section('8. Security Checks');

// Check that no credentials are hardcoded
const jsFilesToCheck = [
    'js/supabase-client.js',
    'js/main.js',
    'js/projects-supabase.js'
];

let hasHardcodedCredentials = false;
jsFilesToCheck.forEach(file => {
    const content = readFile(file);
    if (content) {
        // Check for potential hardcoded URLs
        if (content.includes('https://') && 
            content.includes('.supabase.co') && 
            !content.includes('SUPABASE_CONFIG') &&
            !content.includes('window.ENV')) {
            hasHardcodedCredentials = true;
            log(`⚠️  Potential hardcoded Supabase URL in ${file}`, 'yellow');
        }
        
        // Check for potential hardcoded keys
        if (content.includes('eyJ') && !content.includes('example')) {
            hasHardcodedCredentials = true;
            log(`⚠️  Potential hardcoded API key in ${file}`, 'yellow');
        }
    }
});

test('No hardcoded credentials found', !hasHardcodedCredentials);

// Check XSS protection
checkFileContent('js/projects-supabase.js', 
    'escapeHtml', 'XSS protection (escapeHtml function)');

// ============================================
// 9. DEPLOYMENT READINESS
// ============================================
section('9. Deployment Readiness');

test('Has vercel.json for deployment', fileExists('vercel.json'), true);
test('Has inject-env.js build script', fileExists('inject-env.js'), true);
test('Has env.js template', fileExists('js/env.js'), true);
test('Has .gitignore for security', fileExists('.gitignore'), true);
test('Has README.md for documentation', fileExists('README.md'));

// Check if project is ready for Vercel
const vercelReady = 
    fileExists('vercel.json') && 
    fileExists('inject-env.js') && 
    fileExists('js/env.js') &&
    fileExists('.gitignore');

test('Project is Vercel deployment ready', vercelReady, true);

// ============================================
// 10. RESPONSIVE DESIGN
// ============================================
section('10. Responsive Design');

checkFileContent('css/responsive.css', 
    '@media', 'Has media queries for responsive design');
checkFileContent('css/responsive.css', 
    'max-width: 768px', 'Has mobile breakpoint');
checkFileContent('css/responsive.css', 
    'max-width: 1024px', 'Has tablet breakpoint');

// ============================================
// TEST RESULTS SUMMARY
// ============================================
section('Test Results Summary');

log(`\n📊 Total Tests: ${totalTests}`, 'blue');
log(`✅ Passed: ${passedTests}`, 'green');
log(`❌ Failed: ${failedTests}`, 'red');
log(`⚠️  Warnings: ${warnings}`, 'yellow');

const successRate = ((passedTests / totalTests) * 100).toFixed(1);
log(`\n📈 Success Rate: ${successRate}%`, 'cyan');

if (failedTests === 0 && warnings === 0) {
    log('\n🎉 PERFECT! All tests passed with no warnings!', 'green');
    log('✅ Your portfolio is ready for deployment!', 'green');
} else if (failedTests === 0) {
    log('\n✅ All critical tests passed!', 'green');
    log(`⚠️  ${warnings} warnings to review (non-critical)`, 'yellow');
} else {
    log('\n⚠️  Some tests failed. Please review the issues above.', 'yellow');
    log(`❌ ${failedTests} critical issues need to be fixed`, 'red');
}

// ============================================
// RECOMMENDATIONS
// ============================================
section('Recommendations');

const recommendations = [];

if (!fileExists('js/config.js')) {
    recommendations.push('💡 Create js/config.js for local development (copy from config.example.js)');
}

if (!fileExists('README.md')) {
    recommendations.push('📝 Add README.md with setup instructions');
}

if (failedTests > 0) {
    recommendations.push('🔧 Fix critical issues marked with ❌ above');
}

if (warnings > 0) {
    recommendations.push('⚠️  Review warnings marked with ⚠️ above');
}

recommendations.push('🚀 Next step: Deploy to Vercel with environment variables');
recommendations.push('🔒 Verify .gitignore protects sensitive files before pushing to GitHub');
recommendations.push('📊 Run SQL schema in Supabase Dashboard');
recommendations.push('🧪 Test live site after deployment');

if (recommendations.length > 0) {
    log('\n📋 Action Items:', 'cyan');
    recommendations.forEach(rec => log(rec, 'blue'));
}

log(`\n⏰ Completed at: ${new Date().toLocaleString()}`, 'blue');
log('=' .repeat(60) + '\n', 'cyan');

// Exit with appropriate code
process.exit(failedTests > 0 ? 1 : 0);