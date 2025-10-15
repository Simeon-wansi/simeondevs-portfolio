// ============================================
// BLOG POSTS - SUPABASE INTEGRATION
// Real-time blog management with analytics
// ============================================

let blogPostsData = []; // Will be populated from Supabase
let blogRealtimeSubscription = null; // Store subscription for cleanup

// ============================================
// FETCH BLOG POSTS FROM SUPABASE
// ============================================
async function fetchBlogPosts() {
    console.log('🔄 Fetching blog posts from Supabase...');
    
    try {
        const { data, error } = await supabaseClient
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });
        
        if (error) {
            console.error('❌ Error fetching blog posts:', error);
            showBlogError();
            return [];
        }
        
        console.log(`✅ Fetched ${data.length} blog posts from Supabase`);
        blogPostsData = data;
        return data;
        
    } catch (err) {
        console.error('❌ Blog fetch exception:', err);
        showBlogError();
        return [];
    }
}

// ============================================
// SETUP REAL-TIME SUBSCRIPTION FOR BLOG
// ============================================
function setupBlogRealtimeSubscription() {
    console.log('⚡ Setting up real-time subscription for blog posts...');
    
    blogRealtimeSubscription = supabaseClient
        .channel('blog-posts-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'blog_posts',
                filter: 'status=eq.published'
            },
            (payload) => {
                console.log('⚡ Blog real-time update received:', payload);
                handleBlogRealtimeUpdate(payload);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('✅ Blog real-time subscription active');
            }
        });
}

// ============================================
// HANDLE REAL-TIME BLOG UPDATES
// ============================================
async function handleBlogRealtimeUpdate(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
        case 'INSERT':
            console.log('➕ New blog post published:', newRecord);
            blogPostsData.unshift(newRecord); // Add to beginning
            renderBlogPosts();
            showNotification('New blog post published! 📝', 'success');
            break;
            
        case 'UPDATE':
            console.log('🔄 Blog post updated:', newRecord);
            const updateIndex = blogPostsData.findIndex(p => p.id === newRecord.id);
            if (updateIndex !== -1) {
                blogPostsData[updateIndex] = newRecord;
                renderBlogPosts();
                showNotification('Blog post updated! ✏️', 'info');
            }
            break;
            
        case 'DELETE':
            console.log('🗑️ Blog post deleted:', oldRecord);
            blogPostsData = blogPostsData.filter(p => p.id !== oldRecord.id);
            renderBlogPosts();
            showNotification('Blog post removed! 🗑️', 'warning');
            break;
    }
}

// ============================================
// INITIALIZE BLOG (Called on page load)
// ============================================
async function initializeBlog() {
    console.log('🚀 Initializing blog module...');
    
    // Fetch blog posts from Supabase
    await fetchBlogPosts();
    
    // Render blog posts
    renderBlogPosts();
    
    // Setup real-time subscription
    setupBlogRealtimeSubscription();
    
    console.log('✅ Blog module initialized');
}

// ============================================
// RENDER BLOG POSTS
// ============================================
function renderBlogPosts() {
    console.log('🔄 Rendering blog posts...');
    
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) {
        console.warn('⚠️  Blog grid container not found');
        return;
    }
    
    if (!blogPostsData || blogPostsData.length === 0) {
        blogGrid.innerHTML = `
            <div class="no-blog-message">
                <h3>📝 No blog posts yet!</h3>
                <p>Stay tuned for upcoming articles on AI, cybersecurity, and web development.</p>
            </div>
        `;
        return;
    }
    
    // Clear container
    blogGrid.innerHTML = '';
    
    // Render blog cards (limit to 6 on blog listing page)
    const displayPosts = blogPostsData.slice(0, 6);
    
    displayPosts.forEach((post, index) => {
        try {
            const blogCard = createBlogCard(post);
            blogGrid.appendChild(blogCard);
        } catch (error) {
            console.error(`❌ Error rendering blog post ${index + 1}:`, error);
        }
    });
    
    console.log(`✅ Rendered ${displayPosts.length} blog posts`);
}

// ============================================
// CREATE BLOG CARD ELEMENT
// ============================================
function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    
    // Format date
    const publishedDate = post.published_at ? 
        new Date(post.published_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : 
        'Draft';
    
    // Format tags
    const tagsHtml = post.tags && Array.isArray(post.tags) ? 
        post.tags.slice(0, 3).map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('') : 
        '';
    
    card.innerHTML = `
        <div class="blog-header">
            <div class="blog-date">${publishedDate}</div>
            ${post.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
            <h3>${escapeHtml(post.title)}</h3>
            ${tagsHtml ? `<div class="blog-tags">${tagsHtml}</div>` : ''}
        </div>
        <div class="blog-excerpt">
            <p>${escapeHtml(post.excerpt || post.content.substring(0, 150) + '...')}</p>
        </div>
        <div class="blog-footer">
            <span class="blog-reading-time">⏱️ ${post.reading_time || 5} min read</span>
            <span class="blog-views">👁️ ${post.view_count || 0} views</span>
        </div>
        <a href="#" class="blog-link" onclick="showBlogPost('${post.id}'); return false;">
            Read More →
        </a>
    `;
    
    return card;
}

// ============================================
// SHOW BLOG POST DETAIL
// ============================================
async function showBlogPost(blogId) {
    console.log(`🔄 Showing blog post: ${blogId}`);
    
    // Track blog view
    await trackBlogPostView(blogId);
    
    const blog = blogPostsData.find(b => b.id === blogId);
    if (!blog) {
        console.error(`❌ Blog post with ID ${blogId} not found`);
        showNotification('Blog post not found', 'error');
        return;
    }
    
    // Increment view count in database
    try {
        await supabaseClient
            .from('blog_posts')
            .update({ view_count: supabaseClient.raw('view_count + 1') })
            .eq('id', blogId);
    } catch (err) {
        console.warn('Blog view count update failed:', err);
    }
    
    // Create or update blog detail view
    createBlogDetailView(blog);
    
    // Hide all other pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.opacity = '0';
    });
    
    // Show blog detail page
    setTimeout(() => {
        const blogDetailPage = document.getElementById('blog-detail');
        if (blogDetailPage) {
            blogDetailPage.classList.add('active');
            blogDetailPage.style.opacity = '1';
            
            // Update navigation state
            updateNavigationState('blog');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 150);
}

// ============================================
// CREATE BLOG DETAIL VIEW
// ============================================
function createBlogDetailView(blog) {
    // Remove existing blog detail page if it exists
    const existingPage = document.getElementById('blog-detail');
    if (existingPage) {
        existingPage.remove();
    }
    
    // Format date
    const publishedDate = blog.published_at ? 
        new Date(blog.published_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : 
        'Draft';
    
    // Format tags
    const tagsHtml = blog.tags && Array.isArray(blog.tags) ? 
        blog.tags.map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('') : 
        '';
    
    // Create new blog detail page
    const blogDetailPage = document.createElement('div');
    blogDetailPage.id = 'blog-detail';
    blogDetailPage.className = 'page';
    
    blogDetailPage.innerHTML = `
        <div class="container">
            <div class="blog-detail-header">
                <button class="back-button" onclick="showPage('blog')">
                    ← Back to Blog
                </button>
                <div class="blog-meta">
                    ${blog.category ? `<span class="blog-category">${escapeHtml(blog.category)}</span>` : ''}
                    <span class="blog-date">${publishedDate}</span>
                    <span class="blog-read-time">⏱️ ${blog.reading_time || 5} min read</span>
                    <span class="blog-views">👁️ ${blog.view_count || 0} views</span>
                </div>
                <h1 class="blog-title">${escapeHtml(blog.title)}</h1>
                ${tagsHtml ? `<div class="blog-tags">${tagsHtml}</div>` : ''}
            </div>
            
            <article class="blog-content">
                ${blog.content}
            </article>
            
            <div class="blog-footer">
                <div class="blog-share">
                    <h3>Share this article</h3>
                    <div class="share-buttons">
                        <button class="share-btn" onclick="shareOnTwitter('${escapeHtml(blog.title)}', '${escapeHtml(blog.excerpt || '')}')">
                            🐦 Twitter
                        </button>
                        <button class="share-btn" onclick="shareOnLinkedIn('${escapeHtml(blog.title)}', '${escapeHtml(blog.excerpt || '')}')">
                            💼 LinkedIn
                        </button>
                        <button class="share-btn" onclick="copyToClipboard()">
                            📋 Copy Link
                        </button>
                    </div>
                </div>
                
                <div class="blog-navigation">
                    <button class="nav-btn" onclick="showPreviousBlog('${blog.id}')">
                        ← Previous Post
                    </button>
                    <button class="nav-btn" onclick="showNextBlog('${blog.id}')">
                        Next Post →
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.querySelector('main').appendChild(blogDetailPage);
    
    // Add syntax highlighting for code blocks
    highlightCodeBlocks();
}

// ============================================
// NAVIGATION BETWEEN BLOG POSTS
// ============================================
function showPreviousBlog(currentId) {
    const currentIndex = blogPostsData.findIndex(b => b.id === currentId);
    if (currentIndex > 0) {
        showBlogPost(blogPostsData[currentIndex - 1].id);
    } else {
        showNotification('This is the first blog post', 'info');
    }
}

function showNextBlog(currentId) {
    const currentIndex = blogPostsData.findIndex(b => b.id === currentId);
    if (currentIndex < blogPostsData.length - 1) {
        showBlogPost(blogPostsData[currentIndex + 1].id);
    } else {
        showNotification('This is the latest blog post', 'info');
    }
}

// ============================================
// SOCIAL SHARING FUNCTIONS
// ============================================
function shareOnTwitter(title, excerpt) {
    const text = encodeURIComponent(`${title} - ${excerpt}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareOnLinkedIn(title, excerpt) {
    const url = encodeURIComponent(window.location.href);
    const title_encoded = encodeURIComponent(title);
    const summary = encodeURIComponent(excerpt);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title_encoded}&summary=${summary}`, '_blank');
}

function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Link copied to clipboard! 📋', 'success');
    }).catch(err => {
        console.error('Failed to copy link:', err);
        showNotification('Failed to copy link', 'error');
    });
}

// ============================================
// HIGHLIGHT CODE BLOCKS (Simple implementation)
// ============================================
function highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        block.classList.add('highlighted');
    });
}

// ============================================
// UPDATE NAVIGATION STATE
// ============================================
function updateNavigationState(activePageId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(activePageId)) {
            link.classList.add('active');
        }
    });
}

// ============================================
// SHOW BLOG ERROR
// ============================================
function showBlogError() {
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Unable to load blog posts</h3>
                <p>Please check your internet connection and try again.</p>
                <button class="cta-button" onclick="initializeBlog()">Retry</button>
            </div>
        `;
    }
}

// ============================================
// UTILITY: ESCAPE HTML
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================
window.addEventListener('beforeunload', () => {
    if (blogRealtimeSubscription) {
        supabaseClient.removeChannel(blogRealtimeSubscription);
        console.log('🔌 Blog real-time subscription cleaned up');
    }
});

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Blog Supabase module loaded');
    
    // Initialize blog when blog page is visited
    const blogPage = document.getElementById('blog');
    if (blogPage) {
        // Set up observer to initialize when blog page becomes active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    initializeBlog();
                    observer.disconnect(); // Initialize only once
                }
            });
        });
        
        observer.observe(blogPage, { attributes: true, attributeFilter: ['class'] });
        
        // Also initialize if already active
        if (blogPage.classList.contains('active')) {
            initializeBlog();
        }
    }
});

// ============================================
// EXPORT FUNCTIONS
// ============================================
window.initializeBlog = initializeBlog;
window.showBlogPost = showBlogPost;
window.fetchBlogPosts = fetchBlogPosts;
window.shareOnTwitter = shareOnTwitter;
window.shareOnLinkedIn = shareOnLinkedIn;
window.copyToClipboard = copyToClipboard;