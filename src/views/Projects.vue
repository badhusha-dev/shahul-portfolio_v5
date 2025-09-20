<template>
  <div class="projects-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header text-center py-5">
        <h1 class="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">
          <span class="title-gradient">My Projects</span>
        </h1>
        <p class="lead animate__animated animate__fadeInUp animate__delay-1s">
          A comprehensive showcase of my recent work, side projects, and technical achievements
        </p>
        <div class="header-stats animate__animated animate__fadeInUp animate__delay-2s">
          <div class="stat-item">
            <div class="stat-number">{{ projects.length }}+</div>
            <div class="stat-label">Projects</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ uniqueTechnologies.length }}+</div>
            <div class="stat-label">Technologies</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ categories.length }}+</div>
            <div class="stat-label">Categories</div>
          </div>
        </div>
      </div>

      <!-- Enhanced Project Showcase -->
      <ProjectShowcase />
    </div>
  </div>
</template>

<script>
import ProjectShowcase from '../components/ProjectShowcase.vue'
import { projects } from '../data/projects.js'

export default {
  name: 'Projects',
  components: {
    ProjectShowcase
  },
  data() {
    return {
      projects: projects
    }
  },
  computed: {
    categories() {
      return [...new Set(this.projects.map(p => p.category))].sort()
    },
    uniqueTechnologies() {
      const allTechs = this.projects.flatMap(p => p.technologies)
      return [...new Set(allTechs)].sort()
    }
  }
}
</script>

<style scoped>
.projects-page {
  padding-top: 100px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--body-bg) 0%, var(--secondary-bg) 100%);
  color: var(--text-color);
}

.page-header {
  margin-bottom: 3rem;
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

.header-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  min-width: 120px;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  color: var(--secondary-color);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .header-stats {
    gap: 1rem;
  }
  
  .stat-item {
    min-width: 100px;
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .header-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-item {
    width: 200px;
  }
}
</style>