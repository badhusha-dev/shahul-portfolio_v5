<template>
  <div class="project-showcase">
    <!-- Project Controls -->
    <div class="project-controls">
      <div class="filter-section">
        <h4>Filter Projects</h4>
        <div class="filter-controls">
          <div class="category-filter">
            <select v-model="selectedCategory" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="status-filter">
            <select v-model="selectedStatus" class="filter-select">
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
          
          <div class="tech-filter">
            <select v-model="selectedTech" class="filter-select">
              <option value="">All Technologies</option>
              <option v-for="tech in technologies" :key="tech" :value="tech">
                {{ tech }}
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="view-controls">
        <div class="view-toggle">
          <button 
            v-for="view in viewModes" 
            :key="view.id"
            @click="currentView = view.id"
            class="view-btn"
            :class="{ active: currentView === view.id }"
          >
            <i :class="view.icon"></i>
            {{ view.label }}
          </button>
        </div>
        
        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Project Content -->
    <div class="project-content">
      <!-- Grid View -->
      <div v-if="currentView === 'grid'" class="grid-view">
        <div class="project-grid">
          <div 
            v-for="(project, index) in filteredProjects" 
            :key="project.id"
            class="project-card"
            :style="{ animationDelay: (index * 0.1) + 's' }"
            @click="openProjectModal(project)"
          >
            <div class="card-image">
              <img :src="project.image" :alt="project.title" />
              <div class="image-overlay">
                <div class="overlay-content">
                  <button class="preview-btn" @click.stop="previewProject(project)">
                    <i class="fas fa-play"></i>
                  </button>
                  <button class="code-btn" @click.stop="viewCode(project)">
                    <i class="fas fa-code"></i>
                  </button>
                </div>
              </div>
              <div class="status-badge" :class="project.status.toLowerCase().replace(' ', '-')">
                {{ project.status }}
              </div>
            </div>
            
            <div class="card-content">
              <div class="card-header">
                <h5>{{ project.title }}</h5>
                <span class="project-category">{{ project.category }}</span>
              </div>
              
              <p class="project-description">{{ project.description }}</p>
              
              <div class="project-technologies">
                <span 
                  v-for="tech in project.technologies.slice(0, 4)" 
                  :key="tech" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
                <span v-if="project.technologies.length > 4" class="tech-more">
                  +{{ project.technologies.length - 4 }}
                </span>
              </div>
              
              <div class="project-meta">
                <div class="meta-item">
                  <i class="fas fa-calendar"></i>
                  <span>{{ formatDate(project.date) }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ project.duration }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="project-links">
                <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" class="project-link">
                  <i class="fas fa-external-link-alt"></i>
                  Live Demo
                </a>
                <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="project-link">
                  <i class="fab fa-github"></i>
                  Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="currentView === 'list'" class="list-view">
        <div class="project-list">
          <div 
            v-for="(project, index) in filteredProjects" 
            :key="project.id"
            class="list-item"
            :style="{ animationDelay: (index * 0.1) + 's' }"
            @click="openProjectModal(project)"
          >
            <div class="list-image">
              <img :src="project.image" :alt="project.title" />
              <div class="status-badge" :class="project.status.toLowerCase().replace(' ', '-')">
                {{ project.status }}
              </div>
            </div>
            
            <div class="list-content">
              <div class="list-header">
                <h5>{{ project.title }}</h5>
                <span class="project-category">{{ project.category }}</span>
                <span class="project-date">{{ formatDate(project.date) }}</span>
              </div>
              
              <p class="list-description">{{ project.description }}</p>
              
              <div class="list-technologies">
                <span 
                  v-for="tech in project.technologies.slice(0, 6)" 
                  :key="tech" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <div class="list-actions">
              <button class="action-btn" @click.stop="previewProject(project)" title="Preview">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn" @click.stop="viewCode(project)" title="View Code">
                <i class="fas fa-code"></i>
              </button>
              <button class="action-btn" @click.stop="openProjectModal(project)" title="Details">
                <i class="fas fa-info-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gallery View -->
      <div v-else-if="currentView === 'gallery'" class="gallery-view">
        <div class="gallery-container">
          <div 
            v-for="(project, index) in filteredProjects" 
            :key="project.id"
            class="gallery-item"
            :style="{ animationDelay: (index * 0.1) + 's' }"
            @click="openProjectModal(project)"
          >
            <div class="gallery-image">
              <img :src="project.image" :alt="project.title" />
              <div class="gallery-overlay">
                <h5>{{ project.title }}</h5>
                <p>{{ project.category }}</p>
                <div class="gallery-tech">
                  <span 
                    v-for="tech in project.technologies.slice(0, 3)" 
                    :key="tech" 
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Detail Modal -->
    <div v-if="selectedProject" class="modal-overlay" @click="closeProjectModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="project-header">
            <h3>{{ selectedProject.title }}</h3>
            <div class="project-badges">
              <span class="status-badge" :class="selectedProject.status.toLowerCase().replace(' ', '-')">
                {{ selectedProject.status }}
              </span>
              <span class="category-badge">{{ selectedProject.category }}</span>
            </div>
          </div>
          <button @click="closeProjectModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="project-image-large">
            <img :src="selectedProject.image" :alt="selectedProject.title" />
            <div class="image-actions">
              <button v-if="selectedProject.demoUrl" @click="openDemo(selectedProject)" class="demo-btn">
                <i class="fas fa-play"></i>
                View Demo
              </button>
              <button v-if="selectedProject.githubUrl" @click="openGithub(selectedProject)" class="github-btn">
                <i class="fab fa-github"></i>
                View Code
              </button>
            </div>
          </div>
          
          <div class="project-details">
            <div class="detail-section">
              <h5>Description</h5>
              <p>{{ selectedProject.description }}</p>
            </div>
            
            <div class="detail-section">
              <h5>Technologies Used</h5>
              <div class="tech-grid">
                <span 
                  v-for="tech in selectedProject.technologies" 
                  :key="tech" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <div class="detail-section">
              <h5>Key Features</h5>
              <ul>
                <li v-for="feature in selectedProject.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>
            </div>
            
            <div class="detail-section">
              <h5>Project Information</h5>
              <div class="project-info">
                <div class="info-item">
                  <i class="fas fa-calendar"></i>
                  <span>Started: {{ formatDate(selectedProject.date) }}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-clock"></i>
                  <span>Duration: {{ selectedProject.duration }}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-user"></i>
                  <span>Role: {{ selectedProject.role }}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-users"></i>
                  <span>Team Size: {{ selectedProject.teamSize }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="selectedProject.challenges" class="detail-section">
              <h5>Challenges & Solutions</h5>
              <div class="challenges">
                <div v-for="challenge in selectedProject.challenges" :key="challenge.challenge" class="challenge-item">
                  <h6>Challenge:</h6>
                  <p>{{ challenge.challenge }}</p>
                  <h6>Solution:</h6>
                  <p>{{ challenge.solution }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeProjectModal" class="btn btn-secondary">
            Close
          </button>
          <button v-if="selectedProject.demoUrl" @click="openDemo(selectedProject)" class="btn btn-primary">
            <i class="fas fa-external-link-alt me-2"></i>
            View Live Demo
          </button>
        </div>
      </div>
    </div>

    <!-- Code Viewer Modal -->
    <div v-if="showCodeViewer" class="modal-overlay" @click="closeCodeViewer">
      <div class="code-viewer" @click.stop>
        <div class="code-header">
          <h4>{{ codeProject?.title }} - Code Snippets</h4>
          <button @click="closeCodeViewer" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="code-content">
          <div class="code-tabs">
            <button 
              v-for="(snippet, index) in codeProject?.codeSnippets" 
              :key="index"
              @click="activeCodeTab = index"
              class="code-tab"
              :class="{ active: activeCodeTab === index }"
            >
              {{ snippet.language }}
            </button>
          </div>
          
          <div class="code-display">
            <pre><code>{{ getActiveCodeSnippet() }}</code></pre>
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
      projects,
      currentView: 'grid',
      selectedCategory: '',
      selectedStatus: '',
      selectedTech: '',
      sortBy: 'date',
      selectedProject: null,
      showCodeViewer: false,
      codeProject: null,
      activeCodeTab: 0,
      viewModes: [
        { id: 'grid', label: 'Grid', icon: 'fas fa-th' },
        { id: 'list', label: 'List', icon: 'fas fa-list' },
        { id: 'gallery', label: 'Gallery', icon: 'fas fa-images' }
      ]
    }
  },
  computed: {
    categories() {
      return [...new Set(this.projects.map(project => project.category))]
    },
    technologies() {
      const allTechs = this.projects.flatMap(project => project.technologies)
      return [...new Set(allTechs)].sort()
    },
    filteredProjects() {
      let filtered = this.projects
      
      // Apply filters
      if (this.selectedCategory) {
        filtered = filtered.filter(project => project.category === this.selectedCategory)
      }
      
      if (this.selectedStatus) {
        filtered = filtered.filter(project => project.status === this.selectedStatus)
      }
      
      if (this.selectedTech) {
        filtered = filtered.filter(project => project.technologies.includes(this.selectedTech))
      }
      
      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        switch (this.sortBy) {
          case 'date':
            return new Date(b.date) - new Date(a.date)
          case 'name':
            return a.title.localeCompare(b.title)
          case 'status':
            return a.status.localeCompare(b.status)
          case 'category':
            return a.category.localeCompare(b.category)
          default:
            return 0
        }
      })
      
      return filtered
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      })
    },
    
    openProjectModal(project) {
      this.selectedProject = project
    },
    
    closeProjectModal() {
      this.selectedProject = null
    },
    
    previewProject(project) {
      if (project.demoUrl) {
        window.open(project.demoUrl, '_blank')
      }
    },
    
    viewCode(project) {
      if (project.codeSnippets) {
        this.codeProject = project
        this.activeCodeTab = 0
        this.showCodeViewer = true
      }
    },
    
    closeCodeViewer() {
      this.showCodeViewer = false
      this.codeProject = null
    },
    
    getActiveCodeSnippet() {
      if (this.codeProject && this.codeProject.codeSnippets) {
        return this.codeProject.codeSnippets[this.activeCodeTab]?.code || ''
      }
      return ''
    },
    
    openDemo(project) {
      if (project.demoUrl) {
        window.open(project.demoUrl, '_blank')
      }
    },
    
    openGithub(project) {
      if (project.githubUrl) {
        window.open(project.githubUrl, '_blank')
      }
    }
  }
}
</script>

<style scoped>
.project-showcase {
  padding: 40px 0;
}

.project-controls {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.filter-section h4 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.filter-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  min-width: 150px;
}

.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.view-toggle {
  display: flex;
  gap: 10px;
}

.view-btn {
  padding: 10px 20px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn:hover {
  border-color: var(--primary-color);
  background: rgba(0, 123, 255, 0.1);
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.sort-select {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
}

/* Grid View */
.grid-view {
  padding: 20px 0;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.project-card {
  background: var(--card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  gap: 15px;
}

.preview-btn,
.code-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.preview-btn:hover,
.code-btn:hover {
  background: var(--dark-color);
  transform: scale(1.1);
}

.status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.status-badge.completed {
  background: #28a745;
}

.status-badge.in-progress {
  background: #ffc107;
  color: #000;
}

.status-badge.planned {
  background: #6c757d;
}

.card-content {
  padding: 25px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.card-header h5 {
  margin-bottom: 5px;
  color: var(--text-color);
  font-weight: 600;
}

.project-category {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-description {
  margin-bottom: 20px;
  color: var(--text-color);
  line-height: 1.6;
}

.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tech-tag {
  background: rgba(0, 123, 255, 0.1);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tech-more {
  background: var(--secondary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.meta-item i {
  color: var(--primary-color);
}

.card-footer {
  padding: 0 25px 25px;
}

.project-links {
  display: flex;
  gap: 15px;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.project-link:hover {
  background: var(--dark-color);
  transform: translateY(-2px);
}

/* List View */
.list-view {
  padding: 20px 0;
}

.project-list {
  background: var(--card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.list-item {
  display: flex;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.list-item:hover {
  background: rgba(0, 123, 255, 0.05);
}

.list-item:last-child {
  border-bottom: none;
}

.list-image {
  position: relative;
  width: 120px;
  height: 80px;
  margin-right: 25px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.list-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-content {
  flex: 1;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.list-header h5 {
  margin: 0;
  color: var(--text-color);
}

.project-date {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.list-description {
  margin-bottom: 15px;
  color: var(--text-color);
  line-height: 1.6;
}

.list-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.list-actions {
  display: flex;
  gap: 10px;
  margin-left: 20px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  background: var(--body-bg);
  color: var(--text-color);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

/* Gallery View */
.gallery-view {
  padding: 20px 0;
}

.gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.gallery-item {
  position: relative;
  height: 250px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  transform: translateY(0);
}

.gallery-overlay h5 {
  margin-bottom: 5px;
}

.gallery-overlay p {
  margin-bottom: 10px;
  opacity: 0.8;
}

.gallery-tech {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.gallery-tech .tech-tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 15px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 30px 30px 20px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.project-header h3 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.project-badges {
  display: flex;
  gap: 10px;
}

.category-badge {
  background: var(--info-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: var(--secondary-color);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 30px;
}

.project-image-large {
  position: relative;
  margin-bottom: 30px;
  border-radius: 15px;
  overflow: hidden;
}

.project-image-large img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.demo-btn,
.github-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.demo-btn {
  background: var(--primary-color);
  color: white;
}

.github-btn {
  background: var(--dark-color);
  color: white;
}

.demo-btn:hover,
.github-btn:hover {
  transform: translateY(-2px);
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.detail-section h5 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.detail-section p {
  color: var(--text-color);
  line-height: 1.6;
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.detail-section ul {
  margin: 0;
  padding-left: 20px;
}

.detail-section li {
  margin-bottom: 8px;
  color: var(--text-color);
}

.project-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
}

.info-item i {
  color: var(--primary-color);
}

.challenges {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.challenge-item {
  background: rgba(0, 123, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
}

.challenge-item h6 {
  margin-bottom: 8px;
  color: var(--primary-color);
}

.challenge-item p {
  margin-bottom: 15px;
  color: var(--text-color);
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

/* Code Viewer */
.code-viewer {
  background: var(--card-bg);
  border-radius: 15px;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.code-header {
  padding: 20px 30px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-header h4 {
  margin: 0;
  color: var(--text-color);
}

.code-content {
  height: 60vh;
  display: flex;
  flex-direction: column;
}

.code-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.code-tab {
  padding: 15px 25px;
  border: none;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.code-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.code-display {
  flex: 1;
  overflow: auto;
  background: #1e1e1e;
  color: #d4d4d4;
}

.code-display pre {
  margin: 0;
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .project-controls {
    padding: 20px;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .view-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .project-grid {
    grid-template-columns: 1fr;
  }
  
  .list-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .list-image {
    width: 100%;
    height: 150px;
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .list-actions {
    margin-left: 0;
    justify-content: center;
  }
  
  .gallery-container {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 10px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 20px;
  }
  
  .project-info {
    grid-template-columns: 1fr;
  }
  
  .image-actions {
    position: static;
    margin-top: 15px;
    justify-content: center;
  }
}
</style>
