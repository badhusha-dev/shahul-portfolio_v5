// Analytics tracking and dashboard functionality
export class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.pageViews = []
    this.events = []
    this.isTracking = false
    this.visitorId = this.getOrCreateVisitorId()
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('portfolio_visitor_id')
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('portfolio_visitor_id', visitorId)
    }
    return visitorId
  }

  startTracking() {
    this.isTracking = true
    this.trackPageView(window.location.pathname)
    this.setupEventListeners()
    this.trackScrollDepth()
    this.trackTimeOnPage()
  }

  stopTracking() {
    this.isTracking = false
  }

  trackPageView(path) {
    const pageView = {
      path,
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    
    this.pageViews.push(pageView)
    this.saveToStorage()
  }

  trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      visitorId: this.visitorId
    }
    
    this.events.push(event)
    this.saveToStorage()
  }

  trackScrollDepth() {
    let maxScrollDepth = 0
    const trackScroll = () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        this.trackEvent('scroll_depth', { depth: scrollDepth })
      }
    }
    
    window.addEventListener('scroll', trackScroll, { passive: true })
  }

  trackTimeOnPage() {
    const startTime = Date.now()
    
    const trackTime = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      this.trackEvent('time_on_page', { seconds: timeOnPage })
    }
    
    // Track time every 30 seconds
    setInterval(trackTime, 30000)
    
    // Track final time on page unload
    window.addEventListener('beforeunload', () => {
      const finalTime = Math.round((Date.now() - startTime) / 1000)
      this.trackEvent('page_exit', { timeOnPage: finalTime })
    })
  }

  setupEventListeners() {
    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const element = e.target.closest('a, button, [data-track]')
      if (element) {
        const elementType = element.tagName.toLowerCase()
        const elementText = element.textContent?.trim() || element.getAttribute('aria-label') || ''
        const elementHref = element.href || ''
        
        this.trackEvent('element_click', {
          elementType,
          elementText: elementText.substring(0, 50),
          elementHref: elementHref.substring(0, 100),
          className: element.className,
          id: element.id
        })
      }
    })

    // Track form interactions
    document.addEventListener('submit', (e) => {
      const form = e.target
      this.trackEvent('form_submit', {
        formId: form.id,
        formAction: form.action,
        formMethod: form.method
      })
    })

    // Track downloads
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[download]')
      if (link) {
        this.trackEvent('file_download', {
          fileName: link.download,
          fileUrl: link.href
        })
      }
    })
  }

  getAnalyticsData() {
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = 7 * oneDay
    const oneMonth = 30 * oneDay

    const recentPageViews = this.pageViews.filter(pv => now - pv.timestamp < oneDay)
    const recentEvents = this.events.filter(evt => now - evt.timestamp < oneDay)

    return {
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      totalPageViews: this.pageViews.length,
      recentPageViews: recentPageViews.length,
      totalEvents: this.events.length,
      recentEvents: recentEvents.length,
      sessionDuration: Math.round((now - this.startTime) / 1000),
      uniquePages: [...new Set(this.pageViews.map(pv => pv.path))].length,
      topPages: this.getTopPages(),
      topEvents: this.getTopEvents(),
      deviceInfo: this.getDeviceInfo(),
      engagementScore: this.calculateEngagementScore()
    }
  }

  getTopPages() {
    const pageCounts = {}
    this.pageViews.forEach(pv => {
      pageCounts[pv.path] = (pageCounts[pv.path] || 0) + 1
    })
    
    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }))
  }

  getTopEvents() {
    const eventCounts = {}
    this.events.forEach(evt => {
      eventCounts[evt.name] = (eventCounts[evt.name] || 0) + 1
    })
    
    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }

  getDeviceInfo() {
    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTablet = /iPad|Android(?=.*Mobile)/i.test(userAgent)
    
    return {
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      platform: navigator.platform
    }
  }

  calculateEngagementScore() {
    const scrollEvents = this.events.filter(e => e.name === 'scroll_depth')
    const maxScrollDepth = Math.max(...scrollEvents.map(e => e.properties.depth), 0)
    
    const timeEvents = this.events.filter(e => e.name === 'time_on_page')
    const totalTime = timeEvents.reduce((sum, e) => sum + e.properties.seconds, 0)
    
    const clickEvents = this.events.filter(e => e.name === 'element_click').length
    
    // Simple engagement scoring (0-100)
    const scrollScore = Math.min(maxScrollDepth, 100)
    const timeScore = Math.min(totalTime / 60, 100) // Max 100 for 100+ minutes
    const clickScore = Math.min(clickEvents * 5, 100) // Max 100 for 20+ clicks
    
    return Math.round((scrollScore + timeScore + clickScore) / 3)
  }

  saveToStorage() {
    try {
      const data = {
        pageViews: this.pageViews.slice(-100), // Keep last 100 page views
        events: this.events.slice(-200), // Keep last 200 events
        visitorId: this.visitorId,
        lastUpdated: Date.now()
      }
      localStorage.setItem('portfolio_analytics', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save analytics data:', error)
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('portfolio_analytics')
      if (data) {
        const parsed = JSON.parse(data)
        this.pageViews = parsed.pageViews || []
        this.events = parsed.events || []
        this.visitorId = parsed.visitorId || this.visitorId
      }
    } catch (error) {
      console.warn('Failed to load analytics data:', error)
    }
  }

  exportData() {
    return {
      analytics: this.getAnalyticsData(),
      rawData: {
        pageViews: this.pageViews,
        events: this.events
      }
    }
  }

  clearData() {
    this.pageViews = []
    this.events = []
    localStorage.removeItem('portfolio_analytics')
    localStorage.removeItem('portfolio_visitor_id')
  }
}

// Global analytics instance
export const analytics = new AnalyticsTracker()
