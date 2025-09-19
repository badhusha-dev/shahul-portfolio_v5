<template>
  <div class="analytics-dashboard" v-if="showDashboard">
    <div class="dashboard-header">
      <h3 class="dashboard-title">
        <i class="fas fa-chart-line me-2"></i>
        Portfolio Analytics
      </h3>
      <div class="dashboard-controls">
        <button @click="refreshData" class="btn btn-sm btn-outline-primary me-2">
          <i class="fas fa-sync-alt"></i>
        </button>
        <button @click="exportData" class="btn btn-sm btn-outline-success me-2">
          <i class="fas fa-download"></i>
        </button>
        <button @click="toggleDashboard" class="btn btn-sm btn-outline-secondary">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Overview Cards -->
      <div class="row mb-4">
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-eye text-primary"></i>
            </div>
            <div class="stat-content">
              <h4>{{ analyticsData.totalPageViews }}</h4>
              <p>Total Page Views</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-mouse-pointer text-success"></i>
            </div>
            <div class="stat-content">
              <h4>{{ analyticsData.totalEvents }}</h4>
              <p>Total Interactions</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-clock text-warning"></i>
            </div>
            <div class="stat-content">
              <h4>{{ formatDuration(analyticsData.sessionDuration) }}</h4>
              <p>Session Duration</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-star text-info"></i>
            </div>
            <div class="stat-content">
              <h4>{{ analyticsData.engagementScore }}%</h4>
              <p>Engagement Score</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row mb-4">
        <div class="col-lg-6 mb-4">
          <div class="chart-card">
            <h5 class="chart-title">Top Pages</h5>
            <div class="chart-content">
              <div v-for="page in analyticsData.topPages" :key="page.path" class="page-item">
                <div class="page-info">
                  <span class="page-path">{{ page.path }}</span>
                  <span class="page-count">{{ page.count }} views</span>
                </div>
                <div class="progress">
                  <div 
                    class="progress-bar" 
                    :style="{ width: (page.count / analyticsData.topPages[0].count * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-4">
          <div class="chart-card">
            <h5 class="chart-title">Top Events</h5>
            <div class="chart-content">
              <div v-for="event in analyticsData.topEvents" :key="event.name" class="event-item">
                <div class="event-info">
                  <span class="event-name">{{ event.name }}</span>
                  <span class="event-count">{{ event.count }} times</span>
                </div>
                <div class="progress">
                  <div 
                    class="progress-bar bg-success" 
                    :style="{ width: (event.count / analyticsData.topEvents[0].count * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Device Info -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="chart-card">
            <h5 class="chart-title">Device Information</h5>
            <div class="device-info">
              <div class="row">
                <div class="col-md-4">
                  <div class="device-stat">
                    <i class="fas fa-desktop text-primary"></i>
                    <span>{{ analyticsData.deviceInfo.isDesktop ? 'Desktop' : analyticsData.deviceInfo.isTablet ? 'Tablet' : 'Mobile' }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="device-stat">
                    <i class="fas fa-expand-arrows-alt text-success"></i>
                    <span>{{ analyticsData.deviceInfo.screenResolution }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="device-stat">
                    <i class="fas fa-globe text-warning"></i>
                    <span>{{ analyticsData.deviceInfo.language }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-time Activity -->
      <div class="row">
        <div class="col-12">
          <div class="chart-card">
            <h5 class="chart-title">Recent Activity</h5>
            <div class="activity-feed">
              <div v-for="event in recentActivity" :key="event.id" class="activity-item">
                <div class="activity-icon">
                  <i :class="getEventIcon(event.type)" :style="{ color: getEventColor(event.type) }"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{ event.description }}</div>
                  <div class="activity-time">{{ formatTime(event.timestamp) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { analytics } from '../utils/analytics.js'

export default {
  name: 'AnalyticsDashboard',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      analyticsData: {},
      recentActivity: [],
      showDashboard: this.show,
      refreshInterval: null
    }
  },
  mounted() {
    this.loadAnalyticsData()
    this.startRealTimeUpdates()
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    loadAnalyticsData() {
      this.analyticsData = analytics.getAnalyticsData()
      this.generateRecentActivity()
    },
    
    refreshData() {
      this.loadAnalyticsData()
    },
    
    startRealTimeUpdates() {
      this.refreshInterval = setInterval(() => {
        this.loadAnalyticsData()
      }, 5000) // Update every 5 seconds
    },
    
    generateRecentActivity() {
      const events = analytics.events.slice(-10).reverse()
      this.recentActivity = events.map(event => ({
        id: event.timestamp,
        type: event.name,
        description: this.getEventDescription(event),
        timestamp: event.timestamp
      }))
    },
    
    getEventDescription(event) {
      switch (event.name) {
        case 'page_view':
          return `Visited ${event.properties.path}`
        case 'element_click':
          return `Clicked ${event.properties.elementType}: ${event.properties.elementText}`
        case 'scroll_depth':
          return `Scrolled to ${event.properties.depth}%`
        case 'time_on_page':
          return `Spent ${event.properties.seconds}s on page`
        case 'form_submit':
          return `Submitted form: ${event.properties.formId}`
        case 'file_download':
          return `Downloaded: ${event.properties.fileName}`
        default:
          return `Performed ${event.name}`
      }
    },
    
    getEventIcon(type) {
      const icons = {
        'page_view': 'fas fa-eye',
        'element_click': 'fas fa-mouse-pointer',
        'scroll_depth': 'fas fa-arrows-alt-v',
        'time_on_page': 'fas fa-clock',
        'form_submit': 'fas fa-paper-plane',
        'file_download': 'fas fa-download'
      }
      return icons[type] || 'fas fa-circle'
    },
    
    getEventColor(type) {
      const colors = {
        'page_view': '#007bff',
        'element_click': '#28a745',
        'scroll_depth': '#ffc107',
        'time_on_page': '#17a2b8',
        'form_submit': '#dc3545',
        'file_download': '#6f42c1'
      }
      return colors[type] || '#6c757d'
    },
    
    formatDuration(seconds) {
      if (seconds < 60) return `${seconds}s`
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}m ${remainingSeconds}s`
    },
    
    formatTime(timestamp) {
      const now = Date.now()
      const diff = now - timestamp
      
      if (diff < 60000) return 'Just now'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
      return new Date(timestamp).toLocaleDateString()
    },
    
    exportData() {
      const data = analytics.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `portfolio-analytics-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    
    toggleDashboard() {
      this.showDashboard = false
      this.$emit('close')
    }
  },
  watch: {
    show(newVal) {
      this.showDashboard = newVal
      if (newVal) {
        this.loadAnalyticsData()
      }
    }
  }
}
</script>

<style scoped>
.analytics-dashboard {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  margin: 0;
  color: var(--text-color);
}

.dashboard-controls {
  display: flex;
  gap: 10px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.stat-content h4 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text-color);
}

.stat-content p {
  margin: 0;
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.chart-title {
  margin-bottom: 20px;
  color: var(--text-color);
  font-weight: 600;
}

.page-item, .event-item {
  margin-bottom: 15px;
}

.page-info, .event-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.page-path, .event-name {
  font-weight: 500;
  color: var(--text-color);
}

.page-count, .event-count {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.progress {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.device-info {
  padding: 20px 0;
}

.device-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(0, 123, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 10px;
}

.device-stat i {
  font-size: 1.2rem;
}

.activity-feed {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 123, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 5px;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 10px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
