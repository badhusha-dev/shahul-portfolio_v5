<template>
  <div class="project-showcase">
    <!-- Search and Filter Controls -->
    <div class="showcase-controls">
      <div class="search-container">
        <div class="search-input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search projects..." 
            class="search-input"
            @input="filterProjects"
          >
          <button v-if="searchQuery" @click="clearSearch" class="clear-search">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
        <div class="filter-controls">
        <div class="filter-group">
          <label class="filter-label">Category:</label>
          <select v-model="selectedCategory" @change="filterProjects" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
        <div class="filter-group">
          <label class="filter-label">Technology:</label>
          <select v-model="selectedTechnology" @change="filterProjects" class="filter-select">
              <option value="">All Technologies</option>
              <option v-for="tech in technologies" :key="tech" :value="tech">
                {{ tech }}
              </option>
            </select>
          </div>
        
        <div class="filter-group">
          <label class="filter-label">Sort by:</label>
          <select v-model="sortBy" @change="sortProjects" class="filter-select">
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="category">Category</option>
            <option value="complexity">Complexity</option>
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
        
    <!-- Project Statistics -->
    <div class="project-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-project-diagram"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ filteredProjects.length }}</div>
          <div class="stat-label">Projects Found</div>
      </div>
    </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-code"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ uniqueTechnologies.length }}</div>
          <div class="stat-label">Technologies Used</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tags"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ categories.length }}</div>
          <div class="stat-label">Categories</div>
        </div>
      </div>
    </div>
    
    <!-- Projects Grid/List -->
    <div :class="['projects-container', viewMode]">
      <transition-group name="project-fade" tag="div" class="projects-wrapper">
        <div 
          v-for="project in paginatedProjects" 
            :key="project.id"
          class="project-item"
            @click="openProjectModal(project)"
          >
          <div class="project-card">
            <div class="project-image">
              <img :src="project.image" :alt="project.title" loading="lazy">
              <div class="project-overlay">
                <div class="overlay-content">
                  <h4>{{ project.title }}</h4>
                  <p>{{ project.shortDescription }}</p>
                  <div class="project-tech-preview">
                    <span 
                      v-for="tech in project.technologies.slice(0, 3)" 
                      :key="tech" 
                      class="tech-badge"
                    >
                      {{ tech }}
                    </span>
                    <span v-if="project.technologies.length > 3" class="tech-more">
                      +{{ project.technologies.length - 3 }}
                    </span>
                </div>
              </div>
              </div>
              <div class="project-status" :class="project.status">
                {{ project.status }}
              </div>
            </div>
            
            <div class="project-content">
              <div class="project-header">
                <h3 class="project-title">{{ project.title }}</h3>
                <div class="project-category">{{ project.category }}</div>
              </div>
              
              <p class="project-description">{{ project.shortDescription }}</p>
              
              <div class="project-tech">
                <span 
                  v-for="tech in project.technologies.slice(0, 4)" 
                  :key="tech" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
                <span v-if="project.technologies.length > 4" class="tech-more">
                  +{{ project.technologies.length - 4 }} more
                </span>
              </div>
              
              <div class="project-meta">
                <div class="project-date">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(project.date) }}
                </div>
                <div class="project-complexity">
                  <i class="fas fa-signal"></i>
                  {{ project.complexity }}
              </div>
            </div>
            
              <div class="project-actions">
                <button @click.stop="openProjectModal(project)" class="btn-view">
                  <i class="fas fa-eye"></i>
                  View Details
                </button>
                <a 
                  v-if="project.liveUrl" 
                  :href="project.liveUrl" 
                  target="_blank" 
                  class="btn-live"
                  @click.stop
                >
                  <i class="fas fa-external-link-alt"></i>
                  Live Demo
                </a>
                <a 
                  v-if="project.githubUrl" 
                  :href="project.githubUrl" 
                  target="_blank" 
                  class="btn-github"
                  @click.stop
                >
                  <i class="fab fa-github"></i>
                  Code
                </a>
              </div>
            </div>
          </div>
        </div>
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

    <!-- Project Modal -->
    <div v-if="selectedProject" class="project-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button @click="closeModal" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="modal-header">
          <img :src="selectedProject.image" :alt="selectedProject.title" class="modal-image">
          <div class="modal-info">
            <h2>{{ selectedProject.title }}</h2>
            <p class="modal-category">{{ selectedProject.category }}</p>
            <div class="modal-status" :class="selectedProject.status">
                {{ selectedProject.status }}
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="modal-description">
            <h3>Description</h3>
            <p>{{ selectedProject.description }}</p>
          </div>
          
          <div class="modal-features">
            <h3>Key Features</h3>
            <ul>
              <li v-for="feature in selectedProject.features" :key="feature">
                <i class="fas fa-check"></i>
                {{ feature }}
              </li>
            </ul>
            </div>
            
          <div class="modal-technologies">
            <h3>Technologies Used</h3>
              <div class="tech-grid">
                <span 
                  v-for="tech in selectedProject.technologies" 
                  :key="tech" 
                class="tech-item"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
          <div class="modal-challenges">
            <h3>Challenges & Solutions</h3>
            <div class="challenge-item" v-for="challenge in selectedProject.challenges" :key="challenge.title">
              <h4>{{ challenge.title }}</h4>
              <p>{{ challenge.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="modal-links">
            <a 
              v-if="selectedProject.liveUrl" 
              :href="selectedProject.liveUrl" 
              target="_blank" 
              class="btn btn-primary"
            >
              <i class="fas fa-external-link-alt"></i>
              Live Demo
            </a>
            <a 
              v-if="selectedProject.githubUrl" 
              :href="selectedProject.githubUrl" 
              target="_blank" 
              class="btn btn-outline-primary"
            >
              <i class="fab fa-github"></i>
              View Code
            </a>
          </div>
          <div class="modal-meta">
            <span class="modal-date">
              <i class="fas fa-calendar"></i>
              {{ formatDate(selectedProject.date) }}
            </span>
            <span class="modal-complexity">
              <i class="fas fa-signal"></i>
              {{ selectedProject.complexity }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projects } from '../data/projects.js'

export default {
  name: 'ProjectShowcase',
  data() {
    return {
      projects: projects,
      filteredProjects: projects,
      searchQuery: '',
      selectedCategory: '',
      selectedTechnology: '',
      sortBy: 'name',
      viewMode: 'grid',
      currentPage: 1,
      itemsPerPage: 6,
      selectedProject: null
    }
  },
  computed: {
    categories() {
      return [...new Set(this.projects.map(p => p.category))].sort()
    },
    technologies() {
      const allTechs = this.projects.flatMap(p => p.technologies)
      return [...new Set(allTechs)].sort()
    },
    uniqueTechnologies() {
      return this.technologies
    },
    totalPages() {
      return Math.ceil(this.filteredProjects.length / this.itemsPerPage)
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
    paginatedProjects() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredProjects.slice(start, end)
    }
  },
  methods: {
    filterProjects() {
      let filtered = this.projects
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(project => 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query))
        )
      }
      
      // Category filter
      if (this.selectedCategory) {
        filtered = filtered.filter(project => project.category === this.selectedCategory)
      }
      
      // Technology filter
      if (this.selectedTechnology) {
        filtered = filtered.filter(project => 
          project.technologies.includes(this.selectedTechnology)
        )
      }
      
      this.filteredProjects = filtered
      this.currentPage = 1
    },
    
    sortProjects() {
      this.filteredProjects.sort((a, b) => {
        switch (this.sortBy) {
          case 'name':
            return a.title.localeCompare(b.title)
          case 'date':
            return new Date(b.date) - new Date(a.date)
          case 'category':
            return a.category.localeCompare(b.category)
          case 'complexity':
            const complexityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 }
            return complexityOrder[a.complexity] - complexityOrder[b.complexity]
          default:
            return 0
        }
      })
    },
    
    clearSearch() {
      this.searchQuery = ''
      this.filterProjects()
    },
    
    openProjectModal(project) {
      this.selectedProject = project
      document.body.style.overflow = 'hidden'
    },
    
    closeModal() {
      this.selectedProject = null
      document.body.style.overflow = 'auto'
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  
  mounted() {
    this.filterProjects()
  }
}
</script>

<style scoped>
.project-showcase {
  padding: 2rem 0;
}

/* Controls */
.showcase-controls {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 0;
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

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
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

/* Statistics */
.project-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--secondary-color);
  font-weight: 500;
}

/* Projects Container */
.projects-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  justify-items: stretch;
  align-items: stretch;
  max-width: 1200px;
  margin: 0 auto;
}

.projects-container.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-item:hover {
  transform: translateY(-5px);
}

.project-card {
  background: var(--card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.project-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.project-overlay {
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

.project-item:hover .project-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 1rem;
}

.overlay-content h4 {
  margin-bottom: 0.5rem;
  color: white;
}

.project-tech-preview {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.tech-badge {
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.tech-more {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.project-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.project-status.completed {
  background: #28a745;
  color: white;
}

.project-status.in-progress {
  background: #ffc107;
  color: #000;
}

.project-status.planned {
  background: #6c757d;
  color: white;
}

.project-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.project-category {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-description {
  color: var(--secondary-color);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.project-tech {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tech-tag {
  background: rgba(0, 123, 255, 0.1);
  color: var(--primary-color);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.project-date,
.project-complexity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-view,
.btn-live,
.btn-github {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-view {
  background: var(--primary-color);
  color: white;
}

.btn-live {
  background: #28a745;
  color: white;
}

.btn-github {
  background: #333;
  color: white;
}

.btn-view:hover,
.btn-live:hover,
.btn-github:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
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

/* Modal */
.project-modal {
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
  max-width: 800px;
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

.modal-header {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 15px;
}

.modal-info h2 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.modal-category {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 1rem;
}

.modal-status {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
}

.modal-body {
  padding: 2rem;
}

.modal-body h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.modal-description p {
  color: var(--secondary-color);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-features ul {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.modal-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.modal-features i {
  color: #28a745;
}

.tech-grid {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.tech-item {
  background: rgba(0, 123, 255, 0.1);
  color: var(--primary-color);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
}

.challenge-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.challenge-item h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.challenge-item p {
  color: var(--secondary-color);
  margin: 0;
}

.modal-footer {
  padding: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-links {
  display: flex;
  gap: 1rem;
}

.modal-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.modal-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Transitions */
.project-fade-enter-active,
.project-fade-leave-active {
  transition: all 0.3s ease;
}

.project-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.project-fade-leave-to {
    opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 1200px) {
  .projects-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .showcase-controls {
    padding: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .view-toggle {
    margin-left: 0;
    justify-content: center;
  }
  
  .projects-container.grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 100%;
  }
  
  .project-card {
    max-width: 100%;
  }
  
  .search-input-wrapper {
    max-width: 100%;
  }
  
  .project-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
  
  .modal-header {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-image {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-links {
    justify-content: center;
  }
}
</style>