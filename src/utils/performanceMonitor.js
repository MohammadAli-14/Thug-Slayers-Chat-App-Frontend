class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTime = performance.now();
  }

  startMeasurement(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  endMeasurement(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      
      // Log slow operations
      if (metric.duration > 100) { // 100ms threshold
        console.warn(`⏱️ Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`);
      }
    }
  }

  getMetric(name) {
    return this.metrics.get(name);
  }

  getAllMetrics() {
    return Array.from(this.metrics.entries()).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  clear() {
    this.metrics.clear();
  }

  // Monitor React re-renders
  static monitorComponentRenders(componentName) {
    let renderCount = 0;
    
    return function monitor() {
      renderCount++;
      if (renderCount > 10) {
        console.warn(`🔄 ${componentName} has re-rendered ${renderCount} times. Consider optimization.`);
      }
      return renderCount;
    };
  }

  // Network performance monitoring
  static monitorNetwork() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(...args) {
      const start = performance.now();
      try {
        const response = await originalFetch.apply(this, args);
        const end = performance.now();
        
        console.log(`🌐 Network request: ${args[0]} took ${(end - start).toFixed(2)}ms`);
        return response;
      } catch (error) {
        const end = performance.now();
        console.error(`🌐 Network error: ${args[0]} failed after ${(end - start).toFixed(2)}ms`, error);
        throw error;
      }
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React performance hook
export const usePerformance = (componentName) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    if (renderCount.current > 15) {
      console.warn(`⚠️ ${componentName} has re-rendered ${renderCount.current} times`);
    }
  });
  
  return renderCount.current;
};