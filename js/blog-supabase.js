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
                handleBlogRealtimeUpdate(payload);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
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
            blogPostsData.unshift(newRecord); // Add to beginning
            renderBlogPosts();
            showNotification('New blog post published', 'success');
            break;

        case 'UPDATE':
            const updateIndex = blogPostsData.findIndex(p => p.id === newRecord.id);
            if (updateIndex !== -1) {
                blogPostsData[updateIndex] = newRecord;
                renderBlogPosts();
                showNotification('Blog post updated', 'info');
            }
            break;

        case 'DELETE':
            blogPostsData = blogPostsData.filter(p => p.id !== oldRecord.id);
            renderBlogPosts();
            showNotification('Blog post removed', 'warning');
            break;
    }
}

// ============================================
// INITIALIZE BLOG (Called on page load)
// ============================================
async function initializeBlog() {

    // Check if blog page is active
    const blogPage = document.getElementById('blog');
    if (!blogPage || !blogPage.classList.contains('active')) {
        return;
    }

    // Fetch ALL blog posts from Supabase (no limit for blog page)
    await fetchBlogPosts();

    // Render blog posts
    renderBlogPosts();

    // Setup real-time subscription
    setupBlogRealtimeSubscription();

}

// ============================================
// RENDER BLOG POSTS
// ============================================
function renderBlogPosts() {

    // CRITICAL FIX: Target blog page specifically, not homepage
    const blogGrid = document.querySelector('#blog .blog-grid');

    if (!blogGrid) {
        console.error('❌ Blog page .blog-grid container not found!');
        return;
    }

    // Verify blog page is active
    const blogPage = document.getElementById('blog');
    if (!blogPage?.classList.contains('active')) {
        console.warn('⚠️  Blog page not active, skipping render');
        return;
    }

    if (!blogPostsData || blogPostsData.length === 0) {
        blogGrid.innerHTML = `
            <div class="no-blog-message">
                <h3>No posts yet</h3>
                <p>Stay tuned for upcoming articles on AI, security, and engineering.</p>
            </div>
        `;
        return;
    }

    // Clear container
    blogGrid.innerHTML = '';

    // Render ALL blog posts (no limit - show everything)
    blogPostsData.forEach((post, index) => {
        try {
            const blogCard = createBlogCard(post, index);
            blogGrid.appendChild(blogCard);
        } catch (error) {
            console.error(`❌ Error rendering blog post ${index + 1}:`, error);
        }
    });

}

// ============================================
// CREATE BLOG CARD ELEMENT
// ============================================
function createBlogCard(post, index = 0) {
    const card = document.createElement('article');
    card.className = 'blog-card' + (post.featured ? ' is-featured' : '');
    card.style.setProperty('--i', index);
    card.onclick = () => showBlogPost(post.id);

    // Short date format: "Feb 23, 2026"
    const publishedDate = post.published_at ?
        new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) :
        'Draft';

    // Cover image or letter placeholder
    const firstLetter = escapeHtml((post.title || 'B')[0].toUpperCase());
    const imageHtml = post.cover_image
        ? `<img class="blog-card-img" src="${escapeHtml(post.cover_image)}" alt="${escapeHtml(post.title)}"
               onerror="this.closest('.blog-card-image').classList.add('no-image'); this.outerHTML='<span class=\\'blog-card-placeholder-letter\\'>${firstLetter}</span>'">`
        : `<span class="blog-card-placeholder-letter">${firstLetter}</span>`;
    const imageWrapperClass = 'blog-card-image' + (post.cover_image ? '' : ' no-image');

    // Featured badge
    const featuredBadge = post.featured ? `
        <span class="blog-featured-badge">
            <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M6 1l1.4 2.8L10.5 4l-2.25 2.2.53 3.1L6 7.75 3.22 9.3l.53-3.1L1.5 4l3.1-.2L6 1z"/>
            </svg>
            Featured
        </span>` : '';

    // Tags
    const tagsHtml = post.tags && Array.isArray(post.tags) && post.tags.length
        ? `<div class="blog-card-tags">${post.tags.slice(0, 3).map(t => `<span class="blog-card-tag">${escapeHtml(t)}</span>`).join('')}</div>`
        : '';

    // Category
    const categoryHtml = post.category
        ? `<span class="blog-card-category">${escapeHtml(post.category)}</span>`
        : '';

    // Excerpt
    const excerpt = post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 140) + '…' : '');

    card.innerHTML = `
        <div class="${imageWrapperClass}">
            ${imageHtml}
            <div class="blog-card-image-overlay"></div>
            ${featuredBadge}
        </div>
        <div class="blog-card-body">
            <div class="blog-card-meta">
                ${categoryHtml}
                <span class="blog-card-date">${publishedDate}</span>
            </div>
            <h3 class="blog-card-title">${escapeHtml(post.title)}</h3>
            <p class="blog-card-excerpt">${escapeHtml(excerpt)}</p>
            ${tagsHtml}
            <div class="blog-card-footer">
                <span class="blog-stat">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.5"/>
                        <path d="M8 5v3.5l2 2"/>
                    </svg>
                    ${post.reading_time || 5} min read
                </span>
                <span class="blog-stat">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                        <ellipse cx="8" cy="8" rx="6.5" ry="4.5"/>
                        <circle cx="8" cy="8" r="1.75" fill="currentColor" stroke="none"/>
                    </svg>
                    ${post.view_count || 0} views
                </span>
            </div>
        </div>
    `;

    return card;
}

// ============================================
// SHOW BLOG POST DETAIL
// ============================================
async function showBlogPost(blogId) {
    
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
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M10 3L5 8l5 5"/></svg>
                    Back to Articles
                </button>
                <div class="blog-meta">
                    ${blog.category ? `<span class="blog-category">${escapeHtml(blog.category)}</span>` : ''}
                    <span class="blog-date">${publishedDate}</span>
                    <span class="blog-read-time">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="13" height="13" style="vertical-align:middle;margin-right:3px"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5l2 2"/></svg>${blog.reading_time || 5} min read
                    </span>
                    <span class="blog-views">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="13" height="13" style="vertical-align:middle;margin-right:3px"><ellipse cx="8" cy="8" rx="6.5" ry="4.5"/><circle cx="8" cy="8" r="1.75" fill="currentColor" stroke="none"/></svg>${blog.view_count || 0} views
                    </span>
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
                            Twitter / X
                        </button>
                        <button class="share-btn" onclick="shareOnLinkedIn('${escapeHtml(blog.title)}', '${escapeHtml(blog.excerpt || '')}')">
                            LinkedIn
                        </button>
                        <button class="share-btn" onclick="copyToClipboard()">
                            Copy Link
                        </button>
                    </div>
                </div>

                <div class="blog-navigation">
                    <button class="nav-btn" onclick="showPreviousBlog('${blog.id}')">
                        ← Previous
                    </button>
                    <button class="nav-btn" onclick="showNextBlog('${blog.id}')">
                        Next →
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
// SHOW BLOG ERROR
// ============================================
function showBlogError() {
    const blogGrid = document.querySelector('#blog .blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = `
            <div class="blog-error-state">
                <h3>Unable to load articles</h3>
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
    }
});

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {

    // Blog initialization is now handled by main.js via initializePageData()
    // when user navigates to the blog page
});

// ============================================
// LOAD LATEST BLOG POSTS FOR HOMEPAGE
// ============================================
async function loadLatestBlogPosts() {

    try {
        const { data, error } = await supabaseClient
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(3);

        if (error) {
            console.error('❌ Error loading latest blog posts:', error);
            showLatestBlogError();
            return;
        }

        renderLatestBlogPosts(data);

    } catch (err) {
        console.error('❌ Latest blog posts fetch exception:', err);
        showLatestBlogError();
    }
}

// ============================================
// RENDER LATEST BLOG POSTS TO HOMEPAGE
// ============================================
function renderLatestBlogPosts(posts) {

    // Specifically target homepage container (NOT blog page)
    const container = document.getElementById('latestBlogGrid');

    if (!container) {
        console.error('❌ latestBlogGrid container not found!');
        return;
    }

    if (!posts || posts.length === 0) {
        container.innerHTML = `
            <div class="no-blog-message">
                <p>📝 No blog posts yet. Stay tuned for upcoming articles!</p>
            </div>
        `;
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Render each latest blog post (limited to 3 for homepage)
    posts.forEach((post, index) => {
        try {
            const card = createBlogCard(post, index);
            container.appendChild(card);
        } catch (error) {
            console.error(`❌ Error rendering latest blog post:`, error);
        }
    });

}

// ============================================
// SHOW LATEST BLOG ERROR
// ============================================
function showLatestBlogError() {
    const container = document.getElementById('latestBlogGrid');
    if (container) {
        container.innerHTML = `
            <div class="blog-error-state">
                <h3>Unable to load latest blog posts</h3>
                <p>Please check your internet connection and try again.</p>
                <button class="cta-button" onclick="loadLatestBlogPosts()">Retry</button>
            </div>
        `;
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
window.initializeBlog = initializeBlog;         // called by main.js initializePageData
window.showBlogPost = showBlogPost;             // called from blog card HTML onclick
window.shareOnTwitter = shareOnTwitter;         // called from blog detail HTML onclick
window.shareOnLinkedIn = shareOnLinkedIn;       // called from blog detail HTML onclick
window.copyToClipboard = copyToClipboard;       // called from blog detail HTML onclick
window.loadLatestBlogPosts = loadLatestBlogPosts; // called by main.js initializePageData('home')
window.showPreviousBlog = showPreviousBlog;     // called from blog detail HTML onclick
window.showNextBlog = showNextBlog;             // called from blog detail HTML onclick