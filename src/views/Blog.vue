<template>
  <div class="blog-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header text-center py-5">
        <h1 class="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">
          <span class="title-gradient">Blog & Articles</span>
        </h1>
        <p class="lead animate__animated animate__fadeInUp animate__delay-1s">
          Insights, tutorials, and thoughts on technology, development, and industry trends
        </p>
      </div>

      <!-- Blog Controls -->
      <div class="blog-controls">
        <div class="search-section">
          <div class="search-input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search articles..." 
              class="search-input"
              @input="filterArticles"
            >
            <button v-if="searchQuery" @click="clearSearch" class="clear-search">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div class="filter-section">
          <div class="filter-group">
            <label class="filter-label">Category:</label>
            <select v-model="selectedCategory" @change="filterArticles" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Sort by:</label>
            <select v-model="sortBy" @change="sortArticles" class="filter-select">
              <option value="date">Latest</option>
              <option value="title">Title</option>
              <option value="views">Most Popular</option>
              <option value="readingTime">Reading Time</option>
            </select>
          </div>
          
          <div class="view-toggle">
            <button 
              @click="viewMode = 'grid'" 
              :class="{ active: viewMode === 'grid' }"
              class="view-btn"
              title="Grid View"
            >
              <i class="fas fa-th"></i>
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="{ active: viewMode === 'list' }"
              class="view-btn"
              title="List View"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Featured Article -->
      <div v-if="featuredArticle && !searchQuery" class="featured-article">
        <div class="featured-card">
          <div class="featured-image">
            <img :src="featuredArticle.image" :alt="featuredArticle.title">
            <div class="featured-badge">
              <i class="fas fa-star"></i>
              Featured
            </div>
          </div>
          <div class="featured-content">
            <div class="featured-meta">
              <span class="article-category">{{ featuredArticle.category }}</span>
              <span class="article-date">{{ formatDate(featuredArticle.date) }}</span>
              <span class="article-reading-time">{{ featuredArticle.readingTime }} min read</span>
            </div>
            <h2 class="featured-title">{{ featuredArticle.title }}</h2>
            <p class="featured-excerpt">{{ featuredArticle.excerpt }}</p>
            <div class="featured-tags">
              <span 
                v-for="tag in featuredArticle.tags" 
                :key="tag" 
                class="article-tag"
              >
                {{ tag }}
              </span>
            </div>
            <button @click="openArticle(featuredArticle)" class="read-more-btn">
              Read Full Article
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Articles Grid/List -->
      <div :class="['articles-container', viewMode]">
        <transition-group name="article-fade" tag="div" class="articles-wrapper">
          <article 
            v-for="article in paginatedArticles" 
            :key="article.id"
            class="article-item"
            @click="openArticle(article)"
          >
            <div class="article-card">
              <div class="article-image">
                <img :src="article.image" :alt="article.title" loading="lazy">
                <div class="article-overlay">
                  <div class="overlay-content">
                    <h3>{{ article.title }}</h3>
                    <p>{{ article.excerpt }}</p>
                    <div class="overlay-meta">
                      <span class="reading-time">{{ article.readingTime }} min</span>
                      <span class="views">{{ article.views }} views</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="article-content">
                <div class="article-header">
                  <div class="article-meta">
                    <span class="article-category">{{ article.category }}</span>
                    <span class="article-date">{{ formatDate(article.date) }}</span>
                  </div>
                  <div class="article-stats">
                    <span class="article-views">
                      <i class="fas fa-eye"></i>
                      {{ article.views }}
                    </span>
                    <span class="article-likes">
                      <i class="fas fa-heart"></i>
                      {{ article.likes }}
                    </span>
                  </div>
                </div>
                
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-excerpt">{{ article.excerpt }}</p>
                
                <div class="article-tags">
                  <span 
                    v-for="tag in article.tags.slice(0, 3)" 
                    :key="tag" 
                    class="article-tag"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="article.tags.length > 3" class="tag-more">
                    +{{ article.tags.length - 3 }} more
                  </span>
                </div>
                
                <div class="article-footer">
                  <div class="article-author">
                    <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar">
                    <div class="author-info">
                      <span class="author-name">{{ article.author.name }}</span>
                      <span class="author-title">{{ article.author.title }}</span>
                    </div>
                  </div>
                  <button class="read-btn">
                    Read More
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </transition-group>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            :class="{ active: currentPage === page }"
            class="page-number"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Newsletter Signup -->
      <div class="newsletter-section">
        <div class="newsletter-card">
          <div class="newsletter-content">
            <h3>
              <i class="fas fa-envelope me-2"></i>
              Stay Updated
            </h3>
            <p>Get the latest articles and insights delivered to your inbox</p>
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <div class="form-group">
                <input
                  v-model="newsletterEmail"
                  type="email"
                  placeholder="Enter your email address"
                  class="newsletter-input"
                  required
                >
                <button type="submit" class="newsletter-btn" :disabled="isSubscribing">
                  <span v-if="!isSubscribing">Subscribe</span>
                  <span v-else>
                    <i class="fas fa-spinner fa-spin"></i>
                    Subscribing...
                  </span>
                </button>
              </div>
            </form>
            <div v-if="newsletterMessage" class="newsletter-message" :class="newsletterMessage.type">
              {{ newsletterMessage.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- Article Modal -->
      <div v-if="selectedArticle" class="article-modal" @click="closeArticle">
        <div class="modal-content" @click.stop>
          <button @click="closeArticle" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="article-header-modal">
            <div class="article-image-modal">
              <img :src="selectedArticle.image" :alt="selectedArticle.title">
            </div>
            <div class="article-info-modal">
              <div class="article-meta-modal">
                <span class="category">{{ selectedArticle.category }}</span>
                <span class="date">{{ formatDate(selectedArticle.date) }}</span>
                <span class="reading-time">{{ selectedArticle.readingTime }} min read</span>
              </div>
              <h1 class="article-title-modal">{{ selectedArticle.title }}</h1>
              <p class="article-excerpt-modal">{{ selectedArticle.excerpt }}</p>
              <div class="article-author-modal">
                <img :src="selectedArticle.author.avatar" :alt="selectedArticle.author.name">
                <div class="author-details">
                  <span class="author-name">{{ selectedArticle.author.name }}</span>
                  <span class="author-title">{{ selectedArticle.author.title }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-body-modal">
            <div class="article-content-modal" v-html="renderMarkdown(selectedArticle.content)"></div>
            
            <div class="article-tags-modal">
              <h4>Tags:</h4>
              <div class="tags-list">
                <span 
                  v-for="tag in selectedArticle.tags" 
                  :key="tag" 
                  class="article-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <div class="article-actions">
              <button @click="likeArticle" class="action-btn like-btn" :class="{ liked: isLiked }">
                <i class="fas fa-heart"></i>
                {{ selectedArticle.likes }} Likes
              </button>
              <button @click="shareArticle" class="action-btn share-btn">
                <i class="fas fa-share"></i>
                Share
              </button>
              <button @click="bookmarkArticle" class="action-btn bookmark-btn" :class="{ bookmarked: isBookmarked }">
                <i class="fas fa-bookmark"></i>
                Bookmark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { blogPosts } from '../data/blog.js'

export default {
  name: 'Blog',
  data() {
    return {
      articles: blogPosts,
      filteredArticles: blogPosts,
      searchQuery: '',
      selectedCategory: '',
      sortBy: 'date',
      viewMode: 'grid',
      currentPage: 1,
      itemsPerPage: 6,
      selectedArticle: null,
      newsletterEmail: '',
      isSubscribing: false,
      newsletterMessage: null,
      isLiked: false,
      isBookmarked: false
    }
  },
  computed: {
    categories() {
      return [...new Set(this.articles.map(article => article.category))].sort()
    },
    featuredArticle() {
      return this.articles.find(article => article.featured) || this.articles[0]
    },
    totalPages() {
      return Math.ceil(this.filteredArticles.length / this.itemsPerPage)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, start + 4)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredArticles.slice(start, end)
    }
  },
  methods: {
    filterArticles() {
      let filtered = this.articles
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      // Category filter
      if (this.selectedCategory) {
        filtered = filtered.filter(article => article.category === this.selectedCategory)
      }
      
      this.filteredArticles = filtered
      this.currentPage = 1
    },
    
    sortArticles() {
      this.filteredArticles.sort((a, b) => {
        switch (this.sortBy) {
          case 'date':
            return new Date(b.date) - new Date(a.date)
          case 'title':
            return a.title.localeCompare(b.title)
          case 'views':
            return b.views - a.views
          case 'readingTime':
            return a.readingTime - b.readingTime
          default:
            return 0
        }
      })
    },
    
    clearSearch() {
      this.searchQuery = ''
      this.filterArticles()
    },
    
    openArticle(article) {
      this.selectedArticle = article
      document.body.style.overflow = 'hidden'
      // Increment view count
      article.views++
    },
    
    closeArticle() {
      this.selectedArticle = null
      document.body.style.overflow = 'auto'
    },
    
    renderMarkdown(content) {
      // Simple markdown rendering - in production, use a proper markdown parser
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|l])/gm, '<p>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    async subscribeNewsletter() {
      this.isSubscribing = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        this.newsletterMessage = {
          type: 'success',
          text: 'Successfully subscribed to newsletter!'
        }
        
        this.newsletterEmail = ''
        
        setTimeout(() => {
          this.newsletterMessage = null
        }, 5000)
        
      } catch (error) {
        this.newsletterMessage = {
          type: 'error',
          text: 'Failed to subscribe. Please try again.'
        }
      } finally {
        this.isSubscribing = false
      }
    },
    
    likeArticle() {
      this.isLiked = !this.isLiked
      if (this.isLiked) {
        this.selectedArticle.likes++
      } else {
        this.selectedArticle.likes--
      }
    },
    
    shareArticle() {
      if (navigator.share) {
        navigator.share({
          title: this.selectedArticle.title,
          text: this.selectedArticle.excerpt,
          url: window.location.href
        })
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        alert('Article link copied to clipboard!')
      }
    },
    
    bookmarkArticle() {
      this.isBookmarked = !this.isBookmarked
      // In a real app, save to localStorage or send to server
    }
  },
  
  mounted() {
    this.filterArticles()
  }
}
</script>

<style scoped>
.blog-page {
  padding-top: 100px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-color) 0%, var(--secondary-bg) 100%);
}

.title-gradient {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color), var(--primary-color));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Blog Controls */
.blog-controls {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 45px 12px 45px;
  border: 2px solid var(--border-color);
  border-radius: 25px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--secondary-color);
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: var(--secondary-color);
  color: white;
}

.filter-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.view-btn {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.view-btn:hover:not(.active) {
  background: var(--secondary-bg);
  border-color: var(--secondary-color);
}

/* Featured Article */
.featured-article {
  margin-bottom: 3rem;
}

.featured-card {
  display: flex;
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.featured-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.featured-image {
  position: relative;
  flex: 1;
  min-height: 300px;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.featured-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.article-category {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-date,
.article-reading-time {
  color: var(--secondary-color);
}

.featured-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.featured-excerpt {
  color: var(--secondary-color);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.featured-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.article-tag {
  background: rgba(0, 123, 255, 0.1);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.read-more-btn {
  align-self: flex-start;
  padding: 12px 24px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.read-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

/* Articles Container */
.articles-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.articles-container.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-item:hover {
  transform: translateY(-5px);
}

.article-card {
  background: var(--card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
}

.article-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.article-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.article-item:hover .article-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 1rem;
}

.overlay-content h3 {
  margin-bottom: 0.5rem;
  color: white;
}

.overlay-meta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  font-size: 0.8rem;
}

.article-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.article-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--secondary-color);
}

.article-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.article-excerpt {
  color: var(--secondary-color);
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tag-more {
  background: rgba(108, 117, 125, 0.1);
  color: var(--secondary-color);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color);
}

.author-title {
  font-size: 0.8rem;
  color: var(--secondary-color);
}

.read-btn {
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.read-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0;
}

.page-btn {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-number:hover:not(.active) {
  background: var(--secondary-bg);
}

/* Newsletter */
.newsletter-section {
  margin-top: 4rem;
}

.newsletter-card {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  color: white;
}

.newsletter-content h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.newsletter-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.newsletter-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  gap: 1rem;
}

.newsletter-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-color);
}

.newsletter-input:focus {
  outline: none;
  background: white;
}

.newsletter-btn {
  padding: 12px 24px;
  background: white;
  color: var(--primary-color);
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.newsletter-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.newsletter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.newsletter-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  font-weight: 500;
}

.newsletter-message.success {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.newsletter-message.error {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

/* Article Modal */
.article-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.8);
}

.article-header-modal {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.article-image-modal {
  flex: 1;
  min-height: 300px;
}

.article-image-modal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.article-info-modal {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-meta-modal {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.article-title-modal {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.article-excerpt-modal {
  color: var(--secondary-color);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.article-author-modal {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.article-author-modal img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 500;
  color: var(--text-color);
}

.author-title {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.article-body-modal {
  padding: 2rem;
}

.article-content-modal {
  color: var(--text-color);
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.article-content-modal h1,
.article-content-modal h2,
.article-content-modal h3 {
  color: var(--text-color);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.article-content-modal p {
  margin-bottom: 1rem;
}

.article-content-modal code {
  background: var(--secondary-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.article-content-modal ul {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-content-modal li {
  margin-bottom: 0.5rem;
}

.article-tags-modal {
  margin-bottom: 2rem;
}

.article-tags-modal h4 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.tags-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.article-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  border: 2px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn:hover {
  background: var(--secondary-bg);
  border-color: var(--secondary-color);
}

.action-btn.liked {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.action-btn.bookmarked {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Transitions */
.article-fade-enter-active,
.article-fade-leave-active {
  transition: all 0.3s ease;
}

.article-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.article-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-toggle {
    margin-left: 0;
    justify-content: center;
  }
  
  .featured-card {
    flex-direction: column;
  }
  
  .articles-container.grid {
    grid-template-columns: 1fr;
  }
  
  .article-header-modal {
    flex-direction: column;
  }
  
  .article-title-modal {
    font-size: 2rem;
  }
  
  .form-group {
    flex-direction: column;
  }
  
  .article-actions {
    flex-direction: column;
  }
}
</style>