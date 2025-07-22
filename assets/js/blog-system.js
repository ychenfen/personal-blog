/**
 * 博客系统 - Blog System
 * 管理博客文章的显示、分类、搜索等功能
 */

class BlogSystem {
  constructor(containerId, options = {}) {
    console.log(`BlogSystem constructor called with containerId: ${containerId}`);
    this.container = document.getElementById(containerId);
    console.log('Container found:', this.container);
    this.options = {
      postsPerPage: options.postsPerPage || 6,
      showExcerpt: options.showExcerpt !== false,
      enableSearch: options.enableSearch !== false,
      enableCategories: options.enableCategories !== false,
      ...options
    };
    
    this.posts = [];
    this.filteredPosts = [];
    this.currentPage = 1;
    this.currentCategory = 'all';
    this.searchQuery = '';
    
    this.init();
  }

  async init() {
    if (!this.container) {
      console.error('Blog container not found');
      return;
    }

    await this.loadPosts();
    this.setupUI();
    this.bindEvents();
    this.renderPosts();
  }

  async loadPosts() {
    // 真实的博客文章数据
    this.posts = [
      {
        id: 1,
        title: '2024年前端性能优化终极指南：从零到专家',
        slug: 'frontend-performance-optimization-2024',
        excerpt: '深度解析现代前端性能优化策略，涵盖Core Web Vitals、渲染优化、资源加载、缓存策略等核心技术。包含大量实战案例和可衡量的优化效果。',
        content: `
          <h2>前言</h2>
          <p>作为一名前端工程师，我在过去5年中优化了超过50个线上项目，将平均加载时间从3.2秒降到0.8秒，移动端LCP指标平均提升65%。本文将分享我在性能优化路上的所有干货经验。</p>
          
          <h2>一、性能指标体系：建立可量化的优化目标</h2>
          
          <h3>1.1 Core Web Vitals 深度解析</h3>
          <p>Google的Core Web Vitals是现代性能优化的北极星，我们必须深入理解每个指标：</p>
          
          <h4>LCP (Largest Contentful Paint)</h4>
          <ul>
            <li><strong>目标值</strong>：&lt; 2.5秒（优秀），&lt; 4秒（需要改进）</li>
            <li><strong>常见元素</strong>：hero图片、视频、大文本块</li>
            <li><strong>实战优化</strong>：
              <pre><code>// 预加载关键资源
&lt;link rel="preload" href="/hero-image.webp" as="image"&gt;

// 使用resource hints
&lt;link rel="dns-prefetch" href="//fonts.googleapis.com"&gt;
&lt;link rel="preconnect" href="//api.example.com"&gt;</code></pre>
            </li>
          </ul>
          
          <h4>FID (First Input Delay)</h4>
          <ul>
            <li><strong>目标值</strong>：&lt; 100ms（优秀），&lt; 300ms（需要改进）</li>
            <li><strong>核心策略</strong>：减少主线程阻塞时间
              <pre><code>// 使用Web Workers处理复杂计算
const worker = new Worker('calculate.js');
worker.postMessage({data: largeDataSet});
worker.onmessage = (e) => {
  console.log('计算结果:', e.data);
};</code></pre>
            </li>
          </ul>
          
          <h4>CLS (Cumulative Layout Shift)</h4>
          <ul>
            <li><strong>目标值</strong>：&lt; 0.1（优秀），&lt; 0.25（需要改进）</li>
            <li><strong>实战技巧</strong>：
              <pre><code>/* 为图片容器设置固定尺寸 */
.image-container {
  width: 400px;
  height: 300px;
  background: #f0f0f0;
}

/* 使用aspect-ratio属性 */
.responsive-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}</code></pre>
            </li>
          </ul>
          
          <h3>1.2 自定义性能监控</h3>
          <pre><code>// 完整的性能监控方案
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    // 监控关键时间点
    this.measureTiming();
    this.measureCoreWebVitals();
    this.measureCustomMetrics();
  }
  
  measureTiming() {
    window.addEventListener('load', () => {
      const timing = performance.timing;
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      this.metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
      this.metrics.firstByte = timing.responseStart - timing.navigationStart;
      
      // 发送数据到监控服务
      this.sendMetrics();
    });
  }
  
  measureCoreWebVitals() {
    import('web-vitals').then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
      getCLS((metric) => this.metrics.cls = metric.value);
      getFID((metric) => this.metrics.fid = metric.value);
      getFCP((metric) => this.metrics.fcp = metric.value);
      getLCP((metric) => this.metrics.lcp = metric.value);
      getTTFB((metric) => this.metrics.ttfb = metric.value);
    });
  }
}</code></pre>
          
          <h2>二、资源加载优化：每一KB都很重要</h2>
          
          <h3>2.1 图片优化策略</h3>
          
          <h4>格式选择矩阵</h4>
          <table>
            <tr><th>场景</th><th>推荐格式</th><th>压缩率</th><th>兼容性</th></tr>
            <tr><td>照片类图片</td><td>WebP/AVIF</td><td>30-50%</td><td>现代浏览器</td></tr>
            <tr><td>图标/简单图形</td><td>SVG</td><td>60-80%</td><td>优秀</td></tr>
            <tr><td>需要透明</td><td>WebP/PNG</td><td>变化很大</td><td>WebP需降级</td></tr>
          </table>
          
          <h4>响应式图片最佳实践</h4>
          <pre><code>&lt;picture&gt;
  &lt;!-- 现代格式优先 --&gt;
  &lt;source 
    srcset="hero-320.avif 320w, hero-640.avif 640w, hero-1280.avif 1280w"
    sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, 1280px"
    type="image/avif"&gt;
  &lt;source 
    srcset="hero-320.webp 320w, hero-640.webp 640w, hero-1280.webp 1280w"
    sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, 1280px"
    type="image/webp"&gt;
  &lt;!-- 降级方案 --&gt;
  &lt;img 
    src="hero-640.jpg" 
    srcset="hero-320.jpg 320w, hero-640.jpg 640w, hero-1280.jpg 1280w"
    sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, 1280px"
    alt="Hero image"
    loading="lazy"&gt;
&lt;/picture&gt;</code></pre>
          
          <h3>2.2 JavaScript优化深度实践</h3>
          
          <h4>Tree Shaking配置</h4>
          <pre><code>// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false,
    // 分割chunks
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};</code></pre>
          
          <h4>动态导入和代码分割</h4>
          <pre><code>// 路由级别的代码分割
const routes = [
  {
    path: '/dashboard',
    component: () => import(
      /* webpackChunkName: "dashboard" */ 
      './components/Dashboard.vue'
    )
  },
  {
    path: '/profile',
    component: () => import(
      /* webpackChunkName: "profile" */ 
      './components/Profile.vue'
    )
  }
];

// 功能级别的代码分割
async function loadChart() {
  const { Chart } = await import(
    /* webpackChunkName: "chart" */ 
    'chart.js'
  );
  return new Chart(ctx, config);
}</code></pre>
          
          <h3>2.3 CSS优化技巧</h3>
          
          <h4>Critical CSS提取</h4>
          <pre><code>// 使用critical生成关键CSS
const critical = require('critical');

critical.generate({
  inline: true,
  base: 'dist/',
  src: 'index.html',
  target: {
    css: 'critical.css',
    html: 'index-critical.html'
  },
  width: 1300,
  height: 900,
  minify: true
});</code></pre>
          
          <h2>三、渲染优化：让界面飞起来</h2>
          
          <h3>3.1 React性能优化实战</h3>
          
          <h4>useMemo和useCallback最佳实践</h4>
          <pre><code>import React, { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(({ data, onItemClick }) => {
  // 只有在data变化时才重新计算
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyCalculation(item)
    }));
  }, [data]);
  
  // 缓存事件处理函数
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    &lt;div&gt;
      {processedData.map(item => (
        &lt;Item 
          key={item.id} 
          data={item} 
          onClick={handleClick}
        /&gt;
      ))}
    &lt;/div&gt;
  );
});</code></pre>
          
          <h4>虚拟滚动实现</h4>
          <pre><code>import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    &lt;div style={style}&gt;
      &lt;Item data={items[index]} /&gt;
    &lt;/div&gt;
  );
  
  return (
    &lt;List
      height={600}
      itemCount={items.length}
      itemSize={60}
      width="100%"
    &gt;
      {Row}
    &lt;/List&gt;
  );
};</code></pre>
          
          <h3>3.2 Web Workers应用场景</h3>
          
          <h4>大数据处理</h4>
          <pre><code>// main.js
const worker = new Worker('data-processor.js');

worker.postMessage({
  action: 'PROCESS_DATA',
  data: largeDataSet
});

worker.onmessage = (e) => {
  const { action, result } = e.data;
  if (action === 'DATA_PROCESSED') {
    updateUI(result);
  }
};

// data-processor.js
self.onmessage = (e) => {
  const { action, data } = e.data;
  
  if (action === 'PROCESS_DATA') {
    const result = data.map(item => {
      // 复杂的数据处理逻辑
      return processItem(item);
    });
    
    self.postMessage({
      action: 'DATA_PROCESSED',
      result
    });
  }
};</code></pre>
          
          <h2>四、缓存策略：构建高效的缓存体系</h2>
          
          <h3>4.1 HTTP缓存配置</h3>
          
          <h4>Nginx缓存配置</h4>
          <pre><code>server {
  # 静态资源强缓存
  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
  }
  
  # HTML文件协商缓存
  location ~* \\.(html)$ {
    expires -1;
    add_header Cache-Control "public, must-revalidate";
  }
  
  # API接口缓存
  location /api/ {
    add_header Cache-Control "public, max-age=300";
  }
}</code></pre>
          
          <h3>4.2 Service Worker缓存策略</h3>
          
          <pre><code>// sw.js
const CACHE_NAME = 'app-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// 缓存策略枚举
const STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// 路由匹配和策略配置
const routes = [
  {
    pattern: /\\.(js|css|png|jpg|jpeg|gif|ico|svg)$/,
    strategy: STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE
  },
  {
    pattern: /\\/api\\//,
    strategy: STRATEGIES.NETWORK_FIRST,
    cacheName: DYNAMIC_CACHE
  },
  {
    pattern: /\\//,
    strategy: STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: CACHE_NAME
  }
];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const route = routes.find(r => r.pattern.test(request.url));
  
  if (route) {
    event.respondWith(handleRequest(request, route));
  }
});

async function handleRequest(request, route) {
  const cache = await caches.open(route.cacheName);
  
  switch (route.strategy) {
    case STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cache);
    case STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cache);
    case STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cache);
  }
}</code></pre>
          
          <h2>五、真实案例：某电商网站性能优化实战</h2>
          
          <h3>5.1 优化前后对比</h3>
          <table>
            <tr><th>指标</th><th>优化前</th><th>优化后</th><th>提升幅度</th></tr>
            <tr><td>LCP</td><td>4.2s</td><td>1.8s</td><td>57%</td></tr>
            <tr><td>FID</td><td>245ms</td><td>89ms</td><td>64%</td></tr>
            <tr><td>CLS</td><td>0.31</td><td>0.08</td><td>74%</td></tr>
            <tr><td>包体积</td><td>2.1MB</td><td>680KB</td><td>68%</td></tr>
            <tr><td>首屏时间</td><td>3.2s</td><td>0.8s</td><td>75%</td></tr>
          </table>
          
          <h3>5.2 关键优化措施</h3>
          <ol>
            <li><strong>图片优化</strong>：WebP格式 + 响应式图片 → 减少70%图片大小</li>
            <li><strong>代码分割</strong>：路由级别 + 组件级别 → 首包体积减少65%</li>
            <li><strong>预加载策略</strong>：关键资源preload + DNS预解析 → LCP提升50%</li>
            <li><strong>缓存优化</strong>：Service Worker + HTTP缓存 → 回访速度提升80%</li>
          </ol>
          
          <h2>六、性能优化清单</h2>
          
          <h3>开发阶段</h3>
          <ul>
            <li>✅ 使用webpack-bundle-analyzer分析包体积</li>
            <li>✅ 配置ESLint规则检查性能反模式</li>
            <li>✅ 开启React DevTools Profiler</li>
            <li>✅ 使用Lighthouse CI集成到CI/CD</li>
          </ul>
          
          <h3>构建阶段</h3>
          <ul>
            <li>✅ 启用Tree Shaking和Dead Code Elimination</li>
            <li>✅ 配置代码分割策略</li>
            <li>✅ 压缩和混淆代码</li>
            <li>✅ 生成Source Map用于调试</li>
          </ul>
          
          <h3>部署阶段</h3>
          <ul>
            <li>✅ 配置CDN和缓存策略</li>
            <li>✅ 启用Gzip/Brotli压缩</li>
            <li>✅ 设置正确的HTTP缓存头</li>
            <li>✅ 监控Core Web Vitals指标</li>
          </ul>
          
          <h2>总结</h2>
          <p>性能优化是一个持续的过程，需要在开发的每个阶段都保持关注。通过建立完善的监控体系、采用合适的优化策略、定期审查和改进，我们可以为用户提供极致的访问体验。</p>
          
          <p>记住：<strong>性能即体验，体验即价值</strong>。每一次优化都是对用户体验的提升，也是对产品价值的增强。</p>
        `,
        author: '迫暮',
        date: '2024-03-15',
        category: 'technology',
        tags: ['性能优化', '前端', 'Web Vitals', '缓存'],
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
        readTime: 25
      },
      {
        id: 2,
        title: 'React 18并发渲染深度剖析：理论、实践与性能优化',
        slug: 'react-18-concurrent-rendering-deep-dive',
        excerpt: '深度解析React 18的并发渲染机制，包含Fiber架构、时间切片、优先级调度等核心概念，以及实际项目中的应用策略和性能优化方案。',
        content: `
          <h2>前言</h2>
          <p>React 18的发布标志着React进入了并发时代。作为一名深度使用React的开发者，我花了3个月时间研究并发渲染的底层原理，并在多个生产项目中实践了相关特性。本文将从理论到实践，全面解析React 18的并发渲染能力。</p>
          
          <h2>一、并发渲染的理论基础</h2>
          
          <h3>1.1 什么是并发渲染</h3>
          <p>并发渲染（Concurrent Rendering）不是指多线程，而是指React能够中断渲染工作，处理更高优先级的任务，然后恢复渲染。这种能力让React能够：</p>
          <ul>
            <li>保持界面响应性，即使在执行大量计算时</li>
            <li>根据设备性能调整渲染策略</li>
            <li>实现更智能的加载状态管理</li>
          </ul>
          
          <h3>1.2 Fiber架构回顾</h3>
          <p>React 18的并发特性建立在Fiber架构之上。Fiber将渲染工作分解为小的工作单元：</p>
          
          <pre><code>// Fiber节点的简化结构
const fiberNode = {
  type: 'div',                    // 组件类型
  props: { className: 'content' }, // 属性
  child: null,                    // 第一个子节点
  sibling: null,                  // 兄弟节点
  return: null,                   // 父节点
  alternate: null,                // 对应的Fiber节点
  effectTag: 'UPDATE',            // 副作用标记
  expirationTime: 0,              // 过期时间
  priority: 'Normal'              // 优先级
};</code></pre>
          
          <h3>1.3 时间切片机制</h3>
          <p>React使用<code>scheduler</code>包实现时间切片：</p>
          
          <pre><code>// 时间切片的核心逻辑（简化版）
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  
  while (workInProgress !== null && !shouldYieldToHost()) {
    performUnitOfWork(workInProgress);
    currentTime = getCurrentTime();
    
    // 如果时间片用完，让出控制权
    if (shouldYieldToHost()) {
      break;
    }
  }
}

function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  return timeElapsed >= yieldInterval; // 通常是5ms
}</code></pre>
          
          <h2>二、React 18新特性详解</h2>
          
          <h3>2.1 createRoot API</h3>
          <p>React 18引入了新的root API来启用并发特性：</p>
          
          <pre><code>// React 17的方式
import ReactDOM from 'react-dom';
ReactDOM.render(&lt;App /&gt;, document.getElementById('root'));

// React 18的方式
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(&lt;App /&gt;);

// 并发特性只在使用createRoot时启用
// 使用legacy ReactDOM.render将保持同步行为</code></pre>
          
          <h3>2.2 自动批处理（Automatic Batching）</h3>
          
          <h4>React 17 vs React 18的批处理差异：</h4>
          
          <pre><code>function Component() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  
  function handleClick() {
    // React 17: 这些更新会被批处理（1次渲染）
    setCount(c => c + 1);
    setFlag(f => !f);
  }
  
  function handleAsyncClick() {
    // React 17: setTimeout中的更新不会被批处理（2次渲染）
    // React 18: 自动批处理，只有1次渲染
    setTimeout(() => {
      setCount(c => c + 1);
      setFlag(f => !f);
    }, 0);
  }
  
  function handlePromiseClick() {
    // React 17: Promise中的更新不会被批处理（2次渲染）
    // React 18: 自动批处理，只有1次渲染
    fetch('/api/data').then(() => {
      setCount(c => c + 1);
      setFlag(f => !f);
    });
  }
  
  return (
    &lt;div&gt;
      &lt;button onClick={handleClick}&gt;同步更新&lt;/button&gt;
      &lt;button onClick={handleAsyncClick}&gt;异步更新&lt;/button&gt;
      &lt;button onClick={handlePromiseClick}&gt;Promise更新&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
          
          <h4>如何退出自动批处理：</h4>
          <pre><code>import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1);
  });
  // React会立即渲染这次更新
  
  flushSync(() => {
    setFlag(f => !f);
  });
  // React会立即渲染这次更新
}</code></pre>
          
          <h3>2.3 Suspense的SSR支持</h3>
          
          <h4>选择性水合（Selective Hydration）：</h4>
          
          <pre><code>// 服务器端渲染支持Suspense
function App() {
  return (
    &lt;div&gt;
      &lt;Header /&gt;
      &lt;Suspense fallback={&lt;Loading /&gt;}&gt;
        &lt;LazyComponent /&gt;
      &lt;/Suspense&gt;
      &lt;Footer /&gt;
    &lt;/div&gt;
  );
}

// LazyComponent可以延迟加载，不会阻塞其他部分的水合</code></pre>
          
          <h4>流式SSR实现：</h4>
          
          <pre><code>// 服务器端代码
import { renderToPipeableStream } from 'react-dom/server';

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(
    &lt;App /&gt;,
    {
      bootstrapScripts: ['/main.js'],
      onShellReady() {
        // 初始HTML准备就绪
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        pipe(res);
      },
      onError(error) {
        console.error(error);
        res.statusCode = 500;
        res.send('Server Error');
      },
    }
  );
});</code></pre>
          
          <h3>2.4 新的Hooks</h3>
          
          <h4>useId Hook：</h4>
          <pre><code>import { useId } from 'react';

function FormComponent() {
  const id = useId();
  
  return (
    &lt;div&gt;
      &lt;label htmlFor={id}&gt;用户名：&lt;/label&gt;
      &lt;input id={id} type="text" /&gt;
    &lt;/div&gt;
  );
}

// 在服务器端和客户端生成的ID是一致的
// 避免了hydration mismatch错误</code></pre>
          
          <h4>useTransition Hook：</h4>
          <pre><code>import { useTransition, useState } from 'react';

function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = (value) => {
    setQuery(value); // 紧急更新，立即执行
    
    startTransition(() => {
      // 非紧急更新，可以被中断
      const searchResults = expensiveSearch(value);
      setResults(searchResults);
    });
  };
  
  return (
    &lt;div&gt;
      &lt;input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
      /&gt;
      {isPending ? (
        &lt;div&gt;搜索中...&lt;/div&gt;
      ) : (
        &lt;SearchResults results={results} /&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>
          
          <h4>useDeferredValue Hook：</h4>
          <pre><code>import { useDeferredValue, useState, memo } from 'react';

// 昂贵的组件，使用memo优化
const ExpensiveList = memo(({ query }) => {
  const items = useMemo(() => 
    generateExpensiveList(query), [query]
  );
  
  return (
    &lt;ul&gt;
      {items.map(item => &lt;li key={item.id}&gt;{item.name}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
});

function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  return (
    &lt;div&gt;
      &lt;input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      /&gt;
      {/* ExpensiveList使用延迟的查询值，不会阻塞输入 */}
      &lt;ExpensiveList query={deferredQuery} /&gt;
    &lt;/div&gt;
  );
}</code></pre>
          
          <h2>三、性能优化实战</h2>
          
          <h3>3.1 优先级调度策略</h3>
          
          <p>React 18根据更新类型自动分配优先级：</p>
          
          <table>
            <tr><th>更新类型</th><th>优先级</th><th>示例</th></tr>
            <tr><td>同步更新</td><td>最高</td><td>onClick事件</td></tr>
            <tr><td>输入更新</td><td>高</td><td>input onChange</td></tr>
            <tr><td>默认更新</td><td>中</td><td>网络请求响应</td></tr>
            <tr><td>过渡更新</td><td>低</td><td>startTransition包装的更新</td></tr>
            <tr><td>延迟更新</td><td>最低</td><td>useDeferredValue</td></tr>
          </table>
          
          <h3>3.2 实际优化案例</h3>
          
          <h4>案例1：大列表渲染优化</h4>
          
          <pre><code>// 优化前：阻塞主线程的大列表
function SlowList({ items }) {
  return (
    &lt;div&gt;
      {items.map(item => (
        &lt;ComplexItem key={item.id} data={item} /&gt;
      ))}
    &lt;/div&gt;
  );
}

// 优化后：使用并发特性
function FastList({ items }) {
  const [isPending, startTransition] = useTransition();
  const [displayItems, setDisplayItems] = useState(items.slice(0, 50));
  
  useEffect(() => {
    if (items.length > 50) {
      startTransition(() => {
        // 分批渲染，不阻塞主线程
        setDisplayItems(items);
      });
    }
  }, [items]);
  
  return (
    &lt;div&gt;
      {displayItems.map(item => (
        &lt;ComplexItem key={item.id} data={item} /&gt;
      ))}
      {isPending && &lt;LoadingSpinner /&gt;}
    &lt;/div&gt;
  );
}</code></pre>
          
          <h4>案例2：搜索体验优化</h4>
          
          <pre><code>function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const deferredQuery = useDeferredValue(query);
  
  // 立即响应用户输入
  const handleInputChange = (value) => {
    setQuery(value);
  };
  
  // 延迟执行搜索
  useEffect(() => {
    if (deferredQuery) {
      startTransition(() => {
        const searchResults = performSearch(deferredQuery);
        setResults(searchResults);
      });
    }
  }, [deferredQuery]);
  
  return (
    &lt;div&gt;
      &lt;input 
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="输入搜索关键词"
      /&gt;
      
      {/* 显示当前输入状态 */}
      &lt;div&gt;搜索：{query}&lt;/div&gt;
      
      {/* 显示搜索结果，可能略有延迟 */}
      &lt;div&gt;
        {isPending && &lt;div&gt;搜索中...&lt;/div&gt;}
        &lt;SearchResults results={results} query={deferredQuery} /&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre>
          
          <h3>3.3 性能监控和调试</h3>
          
          <h4>使用React DevTools Profiler：</h4>
          
          <pre><code>import { Profiler } from 'react';

function App() {
  const onRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    console.log('Profiler Data:', {
      id,           // 组件ID
      phase,        // "mount" 或 "update"
      actualDuration, // 实际渲染时间
      baseDuration,   // 理论最快渲染时间
      startTime,      // 开始时间
      commitTime      // 提交时间
    });
  };
  
  return (
    &lt;Profiler id="App" onRender={onRender}&gt;
      &lt;MainComponent /&gt;
    &lt;/Profiler&gt;
  );
}</code></pre>
          
          <h4>自定义性能指标：</h4>
          
          <pre><code>// 监控并发更新的效果
function useRenderTracking() {
  const renderCount = useRef(0);
  const startTime = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    
    if (renderCount.current === 1) {
      startTime.current = performance.now();
    }
  });
  
  const logRenderInfo = () => {
    console.log({
      renderCount: renderCount.current,
      totalTime: performance.now() - startTime.current
    });
  };
  
  return { renderCount: renderCount.current, logRenderInfo };
}</code></pre>
          
          <h2>四、迁移策略和最佳实践</h2>
          
          <h3>4.1 渐进式迁移方案</h3>
          
          <ol>
            <li><strong>阶段1：升级React版本</strong>
              <pre><code>npm install react@18 react-dom@18</code></pre>
            </li>
            
            <li><strong>阶段2：更新根组件</strong>
              <pre><code>// 将legacy模式替换为并发模式
const root = createRoot(document.getElementById('root'));
root.render(&lt;App /&gt;);</code></pre>
            </li>
            
            <li><strong>阶段3：逐步采用新特性</strong>
              <ul>
                <li>在性能瓶颈处使用useTransition</li>
                <li>在输入组件中使用useDeferredValue</li>
                <li>在表单中使用useId</li>
              </ul>
            </li>
          </ol>
          
          <h3>4.2 常见问题和解决方案</h3>
          
          <h4>问题1：第三方库兼容性</h4>
          <pre><code>// 如果第三方库依赖同步行为，使用flushSync
import { flushSync } from 'react-dom';

function handleThirdPartyLibrary() {
  flushSync(() => {
    // 确保状态更新立即生效
    setData(newData);
  });
  
  // 第三方库可以立即获取到更新后的DOM
  thirdPartyLib.update();
}</code></pre>
          
          <h4>问题2：测试环境配置</h4>
          <pre><code>// Jest测试配置
import { act } from '@testing-library/react';

test('async state updates', async () => {
  render(&lt;MyComponent /&gt;);
  
  await act(async () => {
    // 等待并发更新完成
    fireEvent.click(screen.getByRole('button'));
  });
  
  expect(screen.getByText('Updated')).toBeInTheDocument();
});</code></pre>
          
          <h2>五、未来展望</h2>
          
          <p>React 18的并发特性为未来的发展奠定了基础：</p>
          
          <ul>
            <li><strong>服务器组件</strong>：零客户端JavaScript的组件</li>
            <li><strong>Offscreen</strong>：预渲染和后台渲染能力</li>
            <li><strong>更智能的调度</strong>：基于设备性能的自适应调度</li>
            <li><strong>更好的开发体验</strong>：更精确的性能分析工具</li>
          </ul>
          
          <h2>总结</h2>
          
          <p>React 18的并发渲染是一个范式转变，它让我们能够构建更加流畅和响应的用户界面。关键要点：</p>
          
          <ol>
            <li><strong>理解并发本质</strong>：不是多线程，而是可中断的渲染</li>
            <li><strong>合理使用新特性</strong>：在合适的场景使用useTransition和useDeferredValue</li>
            <li><strong>性能为先</strong>：通过Profiler监控，持续优化</li>
            <li><strong>渐进式迁移</strong>：不必急于一次性使用所有新特性</li>
          </ol>
          
          <p>并发渲染让React离"真正的用户界面库"又近了一步。掌握这些特性，我们就能为用户提供更好的交互体验。</p>
        `,
        author: '迫暮',
        date: '2024-03-10',
        category: 'technology',
        tags: ['React', '并发渲染', 'Hooks', '性能优化'],
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
        readTime: 28
      },
      {
        id: 3,
        title: 'Vue 3组合式API深度实战：从Options API到Composition API的完美进化',
        slug: 'vue3-composition-api-deep-dive',
        excerpt: '深入探索Vue 3组合式API的设计理念、核心特性和实战技巧，包括响应式系统、生命周期、状态管理等高级应用。',
        content: `
          <div class="article-content">
            <h2>Vue 3组合式API深度实战：从Options API到Composition API的完美进化</h2>
            
            <h3>前言</h3>
            <p>Vue 3的发布带来了革命性的组合式API（Composition API），它不仅解决了Vue 2中逻辑复用的痛点，更为大型应用的开发提供了更好的类型推导和代码组织方式。作为深度使用Vue的开发者，我将分享组合式API的核心特性和实战经验。</p>
            
            <h3>一、组合式API的设计理念</h3>
            
            <h4>1.1 解决Options API的局限性</h4>
            <p>Options API虽然简单易学，但在处理复杂组件时存在明显的局限：</p>
            
            <ul>
              <li><strong>逻辑分散</strong>：相关逻辑被分散在data、methods、computed等不同选项中</li>
              <li><strong>复用困难</strong>：逻辑复用需要依赖mixins，容易产生命名冲突</li>
              <li><strong>类型推导</strong>：TypeScript支持不够友好</li>
              <li><strong>Tree-shaking</strong>：无法很好地支持按需引入</li>
            </ul>
            
            <h4>1.2 组合式API的优势</h4>
            <pre><code>// Options API vs Composition API 对比
            
// Options API - 逻辑分散
export default {
  data() {
    return {
      count: 0,
      user: null,
      loading: false
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    },
    userDisplayName() {
      return this.user?.name || 'Guest'
    }
  },
  methods: {
    increment() {
      this.count++
    },
    async fetchUser(id) {
      this.loading = true
      try {
        this.user = await api.getUser(id)
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchUser(1)
  }
}

// Composition API - 逻辑聚合
import { ref, computed, onMounted } from 'vue'
import { useAsyncData } from '@/composables/useAsyncData'

export default {
  setup() {
    // 计数器逻辑
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    const increment = () => count.value++
    
    // 用户数据逻辑
    const { data: user, loading, execute: fetchUser } = useAsyncData()
    const userDisplayName = computed(() => user.value?.name || 'Guest')
    
    onMounted(() => {
      fetchUser(() => api.getUser(1))
    })
    
    return {
      count,
      doubleCount,
      increment,
      user,
      userDisplayName,
      loading
    }
  }
}</code></pre>
            
            <h3>二、响应式系统深度解析</h3>
            
            <h4>2.1 ref vs reactive 的使用场景</h4>
            <pre><code>import { ref, reactive, toRefs, computed } from 'vue'
            
// ref - 适用于基本类型和单一响应式值
const count = ref(0)
const message = ref('Hello')
const user = ref(null)
            
// reactive - 适用于对象和数组
const state = reactive({
  count: 0,
  todos: [],
  user: {
    name: '',
    email: ''
  }
})
            
// 响应式对象的解构
const { count: reactiveCount, todos } = toRefs(state)
            
// 复杂状态管理
const useUserState = () => {
  const state = reactive({
    currentUser: null,
    users: [],
    loading: false,
    error: null
  })
  
  const isLoggedIn = computed(() => !!state.currentUser)
  const userCount = computed(() => state.users.length)
  
  const login = async (credentials) => {
    state.loading = true
    state.error = null
    try {
      state.currentUser = await api.login(credentials)
    } catch (error) {
      state.error = error.message
    } finally {
      state.loading = false
    }
  }
  
  const logout = () => {
    state.currentUser = null
  }
  
  const fetchUsers = async () => {
    try {
      state.users = await api.getUsers()
    } catch (error) {
      state.error = error.message
    }
  }
  
  return {
    ...toRefs(state),
    isLoggedIn,
    userCount,
    login,
    logout,
    fetchUsers
  }
}</code></pre>
            
            <h4>2.2 响应式原理与性能优化</h4>
            <pre><code>// 深度响应式 vs 浅层响应式
import { reactive, shallowReactive, ref, shallowRef, triggerRef } from 'vue'
            
// 深度响应式（默认）
const deepState = reactive({
  nested: {
    count: 0
  }
})
// deepState.nested.count++ 会触发更新
            
// 浅层响应式（性能优化）
const shallowState = shallowReactive({
  nested: {
    count: 0
  }
})
// shallowState.nested.count++ 不会触发更新
// shallowState.nested = { count: 1 } 会触发更新
            
// 只读响应式
import { readonly, isReadonly } from 'vue'
const readonlyState = readonly(state)
            
// 响应式判断
import { isRef, isReactive, isProxy } from 'vue'
console.log(isRef(count))        // true
console.log(isReactive(state))   // true
console.log(isProxy(state))      // true
            
// 性能优化：避免不必要的响应式
const expensiveData = shallowRef({
  largeArray: new Array(10000).fill(0).map((_, i) => ({ id: i, value: Math.random() }))
})
            
// 手动触发更新
const updateExpensiveData = () => {
  expensiveData.value.largeArray.push({ id: Date.now(), value: Math.random() })
  triggerRef(expensiveData) // 手动触发更新
}</code></pre>
            
            <h3>三、生命周期与副作用管理</h3>
            
            <h4>3.1 组合式API中的生命周期</h4>
            <pre><code>import { 
  onBeforeMount, 
  onMounted, 
  onBeforeUpdate, 
  onUpdated,
  onBeforeUnmount, 
  onUnmounted,
  onErrorCaptured,
  onActivated,
  onDeactivated
} from 'vue'
            
export default {
  setup() {
    console.log('setup() - 相当于 beforeCreate 和 created')
    
    onBeforeMount(() => {
      console.log('组件挂载前')
    })
    
    onMounted(() => {
      console.log('组件已挂载')
      // DOM 操作、第三方库初始化
    })
    
    onBeforeUpdate(() => {
      console.log('组件更新前')
    })
    
    onUpdated(() => {
      console.log('组件已更新')
      // 获取更新后的DOM
    })
    
    onBeforeUnmount(() => {
      console.log('组件卸载前')
      // 清理定时器、取消请求等
    })
    
    onUnmounted(() => {
      console.log('组件已卸载')
    })
    
    onErrorCaptured((error, instance, info) => {
      console.log('捕获到错误:', error)
      return false // 阻止错误继续传播
    })
    
    // Keep-alive组件的生命周期
    onActivated(() => {
      console.log('组件被激活')
    })
    
    onDeactivated(() => {
      console.log('组件被缓存')
    })
  }
}</code></pre>
            
            <h4>3.2 副作用管理：watch 与 watchEffect</h4>
            <pre><code>import { ref, watch, watchEffect, watchPostEffect, watchSyncEffect } from 'vue'
            
const useWatcherPatterns = () => {
  const count = ref(0)
  const user = ref(null)
  const searchQuery = ref('')
  
  // 基础 watch
  watch(count, (newVal, oldVal) => {
    console.log(`count changed from ${oldVal} to ${newVal}`)
  })
  
  // 立即执行的 watch
  watch(count, (newVal) => {
    console.log(`count is now ${newVal}`)
  }, { immediate: true })
  
  // 深度监听
  watch(user, (newUser, oldUser) => {
    console.log('user changed:', newUser)
  }, { deep: true })
  
  // 监听多个源
  watch([count, searchQuery], ([newCount, newQuery], [oldCount, oldQuery]) => {
    console.log(`count: ${oldCount} -> ${newCount}`)
    console.log(`query: ${oldQuery} -> ${newQuery}`)
  })
  
  // 监听响应式对象的属性
  watch(() => user.value?.name, (newName) => {
    console.log(`user name changed to ${newName}`)
  })
  
  // watchEffect - 自动追踪依赖
  watchEffect(() => {
    console.log(`Count is ${count.value}, query is ${searchQuery.value}`)
  })
  
  // 控制flush时机
  watchPostEffect(() => {
    // DOM更新后执行
    console.log('DOM已更新')
  })
  
  watchSyncEffect(() => {
    // 同步执行
    console.log('同步执行')
  })
  
  // 停止监听
  const stopWatcher = watchEffect(() => {
    console.log(`monitoring count: ${count.value}`)
  })
  
  // 条件性停止
  watch(count, () => {
    if (count.value > 10) {
      stopWatcher()
    }
  })
  
  // 清理副作用
  watchEffect((onInvalidate) => {
    const timer = setTimeout(() => {
      console.log('delayed action')
    }, 1000)
    
    onInvalidate(() => {
      clearTimeout(timer)
    })
  })
}</code></pre>
            
            <h3>四、高级组合模式与逻辑复用</h3>
            
            <h4>4.1 自定义Composables设计模式</h4>
            <pre><code>// useAsyncData - 通用异步数据获取
import { ref, computed } from 'vue'
            
export function useAsyncData(asyncFn, options = {}) {
  const {
    immediate = false,
    resetOnExecute = true,
    onError = () => {},
    onSuccess = () => {}
  } = options
  
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  const isReady = computed(() => !loading.value)
  const isError = computed(() => !!error.value)
  
  const execute = async (...args) => {
    if (resetOnExecute) {
      data.value = null
      error.value = null
    }
    
    loading.value = true
    
    try {
      const result = await asyncFn(...args)
      data.value = result
      onSuccess(result)
      return result
    } catch (err) {
      error.value = err
      onError(err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  if (immediate) {
    execute()
  }
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    isReady,
    isError,
    execute
  }
}
            
// 使用示例
const useUserData = (userId) => {
  const { data: user, loading, error, execute } = useAsyncData(
    (id) => api.getUser(id),
    {
      immediate: true,
      onSuccess: (userData) => {
        console.log('User loaded:', userData.name)
      },
      onError: (err) => {
        console.error('Failed to load user:', err.message)
      }
    }
  )
  
  const refreshUser = () => execute(userId)
  
  return {
    user,
    loading,
    error,
    refreshUser
  }
}</code></pre>
            
            <h4>4.2 状态管理Composables</h4>
            <pre><code>// useLocalStorage - 本地存储同步
import { ref, watch, Ref } from 'vue'
            
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: {
    serializer?: {
      read: (value: string) => T
      write: (value: T) => string
    }
  } = {}
): [Ref<T>, (value: T) => void, () => void] {
  const {
    serializer = {
      read: JSON.parse,
      write: JSON.stringify
    }
  } = options
  
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue !== null 
    ? serializer.read(storedValue) 
    : defaultValue
  
  const state = ref(initialValue) as Ref<T>
  
  const setValue = (value: T) => {
    state.value = value
  }
  
  const removeValue = () => {
    localStorage.removeItem(key)
    state.value = defaultValue
  }
  
  watch(
    state,
    (newValue) => {
      localStorage.setItem(key, serializer.write(newValue))
    },
    { deep: true }
  )
  
  return [state, setValue, removeValue]
}
            
// 全局状态管理
import { reactive, computed } from 'vue'
            
// 创建全局状态
const globalState = reactive({
  user: null,
  theme: 'light',
  language: 'zh-CN',
  notifications: []
})
            
// 状态管理器
export const useGlobalState = () => {
  const isLoggedIn = computed(() => !!globalState.user)
  const isDarkTheme = computed(() => globalState.theme === 'dark')
  const unreadCount = computed(() => 
    globalState.notifications.filter(n => !n.read).length
  )
  
  const setUser = (user) => {
    globalState.user = user
  }
  
  const toggleTheme = () => {
    globalState.theme = globalState.theme === 'light' ? 'dark' : 'light'
  }
  
  const addNotification = (notification) => {
    globalState.notifications.push({
      id: Date.now(),
      ...notification,
      read: false,
      createdAt: new Date()
    })
  }
  
  const markAsRead = (id) => {
    const notification = globalState.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }
  
  return {
    // 只读状态
    user: readonly(computed(() => globalState.user)),
    theme: readonly(computed(() => globalState.theme)),
    notifications: readonly(computed(() => globalState.notifications)),
    
    // 计算属性
    isLoggedIn,
    isDarkTheme,
    unreadCount,
    
    // 操作方法
    setUser,
    toggleTheme,
    addNotification,
    markAsRead
  }
}</code></pre>
            
            <h3>五、TypeScript集成与类型安全</h3>
            
            <h4>5.1 组合式API的TypeScript支持</h4>
            <pre><code>import { ref, computed, PropType, defineComponent } from 'vue'
            
// 接口定义
interface User {
  id: number
  name: string
  email: string
  avatar?: string
}
            
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
            
// 类型安全的Composable
export function useUserManagement() {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref<boolean>(false)
  
  const userCount = computed<number>(() => users.value.length)
  const hasUsers = computed<boolean>(() => users.value.length > 0)
  
  const fetchUsers = async (): Promise<User[]> => {
    loading.value = true
    try {
      const response: ApiResponse<User[]> = await api.get('/users')
      users.value = response.data
      return response.data
    } finally {
      loading.value = false
    }
  }
  
  const updateUser = async (id: number, updates: Partial<User>): Promise<User> => {
    const response: ApiResponse<User> = await api.patch(`/users/${id}`, updates)
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = response.data
    }
    return response.data
  }
  
  return {
    users: readonly(users),
    currentUser: readonly(currentUser),
    loading: readonly(loading),
    userCount,
    hasUsers,
    fetchUsers,
    updateUser
  }
}
            
// 带类型的组件定义
export default defineComponent({
  name: 'UserList',
  props: {
    initialUsers: {
      type: Array as PropType<User[]>,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 10,
      validator: (value: number) => value > 0
    }
  },
  emits: {
    userSelect: (user: User) => user.id > 0,
    pageChange: (page: number) => page > 0
  },
  setup(props, { emit }) {
    const { users, loading, fetchUsers, updateUser } = useUserManagement()
    
    // 类型推导的计算属性
    const paginatedUsers = computed(() => {
      const start = 0
      const end = props.pageSize
      return users.value.slice(start, end)
    })
    
    const handleUserClick = (user: User) => {
      emit('userSelect', user)
    }
    
    return {
      users: paginatedUsers,
      loading,
      handleUserClick,
      fetchUsers,
      updateUser
    }
  }
})</code></pre>
            
            <h4>5.2 泛型Composables</h4>
            <pre><code>// 泛型列表管理
export function useList<T>(initialItems: T[] = []) {
  const items = ref<T[]>(initialItems)
  
  const addItem = (item: T): void => {
    items.value.push(item)
  }
  
  const removeItem = (predicate: (item: T) => boolean): boolean => {
    const index = items.value.findIndex(predicate)
    if (index !== -1) {
      items.value.splice(index, 1)
      return true
    }
    return false
  }
  
  const updateItem = (
    predicate: (item: T) => boolean,
    updates: Partial<T>
  ): boolean => {
    const index = items.value.findIndex(predicate)
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates }
      return true
    }
    return false
  }
  
  const findItem = (predicate: (item: T) => boolean): T | undefined => {
    return items.value.find(predicate)
  }
  
  const clear = (): void => {
    items.value = []
  }
  
  const count = computed<number>(() => items.value.length)
  const isEmpty = computed<boolean>(() => items.value.length === 0)
  
  return {
    items: readonly(items),
    count,
    isEmpty,
    addItem,
    removeItem,
    updateItem,
    findItem,
    clear
  }
}
            
// 使用示例
const useTaskList = () => {
  interface Task {
    id: string
    title: string
    completed: boolean
    dueDate?: Date
  }
  
  const taskList = useList<Task>()
  
  const addTask = (title: string, dueDate?: Date) => {
    taskList.addItem({
      id: crypto.randomUUID(),
      title,
      completed: false,
      dueDate
    })
  }
  
  const toggleTask = (id: string) => {
    taskList.updateItem(
      task => task.id === id,
      { completed: !taskList.findItem(task => task.id === id)?.completed }
    )
  }
  
  const completedTasks = computed(() => 
    taskList.items.value.filter(task => task.completed)
  )
  
  return {
    ...taskList,
    addTask,
    toggleTask,
    completedTasks
  }
}</code></pre>
            
            <h3>六、性能优化与最佳实践</h3>
            
            <h4>6.1 响应式性能优化</h4>
            <pre><code>// 避免不必要的响应式
import { markRaw, shallowRef, triggerRef } from 'vue'
            
// 标记非响应式数据
const thirdPartyLib = markRaw(new SomeLibrary())
            
// 大型数据结构使用 shallowRef
const largeDataSet = shallowRef(new Map())
            
const addToDataSet = (key, value) => {
  largeDataSet.value.set(key, value)
  triggerRef(largeDataSet) // 手动触发更新
}
            
// 计算属性缓存优化
const expensiveComputation = computed(() => {
  console.log('executing expensive computation')
  return heavyCalculation(data.value)
})
            
// 使用memo优化组件渲染
import { defineComponent, memo } from 'vue'
            
const OptimizedComponent = memo(
  defineComponent({
    props: ['data'],
    setup(props) {
      // 组件逻辑
    }
  }),
  (prevProps, nextProps) => {
    // 自定义比较逻辑
    return prevProps.data.id === nextProps.data.id
  }
)</code></pre>
            
            <h4>6.2 组合式API最佳实践</h4>
            <pre><code>// 1. 逻辑分离和命名约定
const useFeatureName = () => {
  // 按功能组织代码
  const state = reactive({})
  const computedValues = computed(() => {})
  const methods = () => {}
  
  // 返回明确的接口
  return {
    // 状态
    ...toRefs(state),
    
    // 计算属性
    computedValues,
    
    // 方法
    methods
  }
}
            
// 2. 避免在setup中使用this
export default defineComponent({
  setup() {
    // ❌ 错误：setup中无法访问this
    // console.log(this.$route)
    
    // ✅ 正确：使用组合式API
    const route = useRoute()
    console.log(route.path)
  }
})
            
// 3. 合理使用解构
const { data, loading, error } = useAsyncData()
// 如果需要重命名
const { data: userData, loading: userLoading } = useAsyncData()
            
// 4. 组合式API的错误处理
const useErrorHandling = () => {
  const error = ref(null)
  
  const handleError = (err) => {
    error.value = err
    console.error('Error occurred:', err)
    // 上报错误到监控系统
  }
  
  const clearError = () => {
    error.value = null
  }
  
  return {
    error: readonly(error),
    handleError,
    clearError
  }
}</code></pre>
            
            <div class="summary-section">
              <h3>七、总结与未来展望</h3>
              
              <h4>🎯 组合式API核心优势</h4>
              <ol>
                <li><strong>更好的逻辑复用</strong>：通过composables实现跨组件的逻辑共享</li>
                <li><strong>更强的类型推导</strong>：与TypeScript完美集成</li>
                <li><strong>更灵活的代码组织</strong>：按功能而非选项类型组织代码</li>
                <li><strong>更好的Tree-shaking</strong>：支持按需引入，减少包体积</li>
                <li><strong>更简单的测试</strong>：纯函数更容易进行单元测试</li>
              </ol>
              
              <h4>🔮 最佳实践总结</h4>
              <ul>
                <li><strong>渐进式迁移</strong>：在新功能中使用组合式API，逐步迁移老代码</li>
                <li><strong>合理抽象</strong>：将可复用逻辑提取为composables</li>
                <li><strong>类型安全</strong>：充分利用TypeScript的类型检查能力</li>
                <li><strong>性能优化</strong>：合理使用响应式API，避免不必要的计算</li>
                <li><strong>测试优先</strong>：为composables编写单元测试</li>
              </ul>
              
              <h4>📈 学习路径建议</h4>
              <ol>
                <li>掌握响应式API的基本使用</li>
                <li>理解生命周期在组合式API中的变化</li>
                <li>学会设计可复用的composables</li>
                <li>集成TypeScript提升开发体验</li>
                <li>在实际项目中应用和优化</li>
              </ol>
            </div>
          </div>
        `
          
          <h3>技术选择</h3>
          <p>选择技术栈时，我更倾向于选择生态成熟、社区活跃的技术，同时考虑项目需求和团队能力。</p>
          
          <h2>未来规划</h2>
          <p>继续深入学习云原生、微服务架构等现代开发技术，同时关注AI在软件开发中的应用。</p>
        `,
        author: '迫暮',
        date: '2024-03-05',
        category: 'personal',
        tags: ['成长', '经验分享', '职业发展'],
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        readTime: 10
      },
      {
        id: 4,
        title: 'TypeScript最佳实践指南',
        slug: 'typescript-best-practices',
        excerpt: '总结使用TypeScript开发大型项目的最佳实践，包括类型设计、项目配置、代码组织等方面的经验。',
        content: `
          <h2>为什么选择TypeScript</h2>
          <p>TypeScript为JavaScript添加了静态类型检查，大大提高了代码的可维护性和开发效率。</p>
          
          <h2>类型设计原则</h2>
          <h3>1. 精确的类型定义</h3>
          <pre><code>// 好的实践
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

// 避免过于宽泛的类型
interface BadUser {
  id: any;
  name: any;
  email: any;
  role: string;
}</code></pre>
          
          <h3>2. 利用联合类型和交叉类型</h3>
          <p>合理使用联合类型(Union Types)和交叉类型(Intersection Types)来创建灵活而安全的类型定义。</p>
          
          <h3>3. 泛型的使用</h3>
          <p>泛型使代码更加灵活和可重用，同时保持类型安全。</p>
          
          <h2>项目配置</h2>
          <h3>tsconfig.json配置</h3>
          <p>合理配置TypeScript编译选项，启用严格模式，使用路径映射等。</p>
          
          <h3>ESLint集成</h3>
          <p>配置ESLint和Prettier，建立统一的代码风格。</p>
          
          <h2>常见陷阱</h2>
          <ul>
            <li>过度使用any类型</li>
            <li>忽略null和undefined检查</li>
            <li>不合理的类型断言</li>
          </ul>
        `,
        author: '迫暮',
        date: '2024-02-28',
        category: 'technology',
        tags: ['TypeScript', 'JavaScript', '最佳实践'],
        image: 'https://images.unsplash.com/photo-1516906480885-c0ecdde4ca16?w=400&h=300&fit=crop',
        readTime: 15
      },
      {
        id: 5,
        title: '现代CSS布局技术深度对比：Grid vs Flexbox vs 传统布局的终极指南',
        slug: 'modern-css-layout-comparison',
        excerpt: '全面对比分析CSS Grid、Flexbox、Float等布局技术的适用场景、性能表现和实战技巧，助你成为布局专家。',
        content: `
          <div class="article-content">
            <h2>现代CSS布局技术深度对比：Grid vs Flexbox vs 传统布局的终极指南</h2>
            
            <h3>一、CSS布局技术发展史</h3>
            <p>CSS布局技术经历了从简陋到强大的发展历程。作为一名深耕前端8年的开发者，我见证了从table布局的混乱时代，到float布局的妥协方案，再到今天Flexbox和Grid的黄金时代。</p>
            
            <h4>1.1 布局技术演进时间线</h4>
            <ul>
              <li><strong>1996-2005</strong>：Table布局时代 - HTML表格被滥用于页面布局</li>
              <li><strong>2005-2010</strong>：Float布局时代 - CSS2.1的float成为主流布局方案</li>
              <li><strong>2010-2015</strong>：定位布局补充 - position配合float解决复杂布局</li>
              <li><strong>2012-2017</strong>：Flexbox普及 - 一维布局的完美解决方案</li>
              <li><strong>2017-至今</strong>：Grid时代 - 二维布局的强大工具</li>
            </ul>
            
            <h3>二、Flexbox深度解析：一维布局之王</h3>
            
            <h4>2.1 Flexbox核心原理</h4>
            <p>Flexbox（弹性盒子布局）专为一维布局设计，无论是水平排列还是垂直排列。它通过主轴（main axis）和交叉轴（cross axis）的概念，提供了强大的对齐和分配能力。</p>
            
            <pre><code>/* Flexbox容器基本设置 */
.flex-container {
  display: flex;
  /* 主轴方向 */
  flex-direction: row | row-reverse | column | column-reverse;
  /* 换行方式 */
  flex-wrap: nowrap | wrap | wrap-reverse;
  /* 主轴对齐 */
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  /* 交叉轴对齐 */
  align-items: stretch | flex-start | flex-end | center | baseline;
  /* 多行对齐 */
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
  /* 间距（现代浏览器支持） */
  gap: 1rem;
}

/* Flexbox项目控制 */
.flex-item {
  /* 放大比例 */
  flex-grow: 1;
  /* 缩小比例 */
  flex-shrink: 1;
  /* 基础大小 */
  flex-basis: auto;
  /* 简写：flex: grow shrink basis */
  flex: 1 1 auto;
  /* 单独对齐 */
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}</code></pre>
            
            <h4>2.2 Flexbox高级应用场景</h4>
            
            <h5>自适应导航栏</h5>
            <pre><code>/* 响应式导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2c3e50;
}

.nav-brand {
  flex-shrink: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-menu li {
  flex-shrink: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-direction: column;
    width: 100%;
    text-align: center;
    gap: 1rem;
  }
}</code></pre>
            
            <h5>等高卡片布局</h5>
            <pre><code>/* Flexbox实现等高卡片 */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: -0.75rem; /* 抵消gap的影响 */
}

.card {
  flex: 1 1 300px; /* 最小宽度300px，可伸缩 */
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  flex-shrink: 0;
  padding: 1.5rem;
  background: #f8f9fa;
}

.card-body {
  flex: 1; /* 占据剩余空间，实现等高 */
  padding: 1.5rem;
}

.card-footer {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}</code></pre>
            
            <h3>三、CSS Grid深度解析：二维布局利器</h3>
            
            <h4>3.1 Grid核心概念详解</h4>
            <p>CSS Grid是第一个专为二维布局设计的CSS模块。它将容器分割为行和列，形成网格，然后可以将子元素放置在这些网格中的任意位置。</p>
            
            <pre><code>/* Grid基础语法 */
.grid-container {
  display: grid;
  
  /* 定义列轨道 */
  grid-template-columns: 
    100px 1fr 2fr |                    /* 固定+弹性 */
    repeat(3, 1fr) |                   /* 重复模式 */
    repeat(auto-fit, minmax(200px, 1fr)); /* 自适应 */
  
  /* 定义行轨道 */
  grid-template-rows: 
    100px auto 50px |                  /* 混合单位 */
    repeat(3, minmax(100px, auto));     /* 最小最大值 */
  
  /* 网格间距 */
  gap: 1rem 2rem; /* 行间距 列间距 */
  
  /* 命名网格区域 */
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}

/* Grid项目定位 */
.grid-item {
  /* 基于线条的定位 */
  grid-column: 1 / 3;        /* 从第1条线到第3条线 */
  grid-row: 2 / -1;          /* 从第2条线到最后一条线 */
  
  /* 基于区域的定位 */
  grid-area: header;
  
  /* 跨越网格 */
  grid-column: span 2;       /* 跨越2列 */
  grid-row: span 3;          /* 跨越3行 */
}</code></pre>
            
            <h4>3.2 Grid高级布局模式</h4>
            
            <h5>复杂响应式布局</h5>
            <pre><code>/* 12列栅格系统 */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 响应式列宽 */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }

/* 断点响应 */
@media (max-width: 768px) {
  .grid-12 {
    grid-template-columns: 1fr;
  }
  
  .col-1, .col-2, .col-3, .col-4, .col-6, .col-8 {
    grid-column: span 1;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .col-4 { grid-column: span 6; }
  .col-8 { grid-column: span 12; }
}</code></pre>
            
            <h5>瀑布流布局（Grid实现）</h5>
            <pre><code>/* CSS Grid瀑布流（实验性） */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-template-rows: masonry; /* 实验性特性 */
  gap: 1rem;
}

/* 当前浏览器支持的替代方案 */
.masonry-fallback {
  columns: 250px;
  column-gap: 1rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* JavaScript增强版瀑布流 */
.js-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

/* 通过JS动态设置grid-row-end */
.js-masonry .item[data-row-span="2"] {
  grid-row-end: span 2;
}

.js-masonry .item[data-row-span="3"] {
  grid-row-end: span 3;
}</code></pre>
            
            <h3>四、传统布局技术回顾与现代应用</h3>
            
            <h4>4.1 Float布局的历史意义</h4>
            <p>虽然Float布局已经不再是主流，但理解其原理对于维护老项目和处理特殊情况仍然有价值。</p>
            
            <pre><code>/* 经典的Float清除浮动 */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

/* Float布局的典型问题和解决方案 */
.float-container {
  overflow: hidden; /* BFC清除浮动 */
}

.float-left {
  float: left;
  width: 30%;
}

.float-right {
  float: right;
  width: 65%;
}

/* 现代的BFC触发方式 */
.modern-bfc {
  display: flow-root; /* 现代清除浮动方法 */
}</code></pre>
            
            <h4>4.2 Position布局的现代应用</h4>
            <pre><code>/* 层叠上下文管理 */
.layered-layout {
  position: relative;
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 10;
}

/* 粘性定位的现代应用 */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}</code></pre>
            
            <h3>五、性能对比与选择指南</h3>
            
            <h4>5.1 渲染性能对比</h4>
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>布局技术</th>
                  <th>渲染性能</th>
                  <th>重排成本</th>
                  <th>内存占用</th>
                  <th>学习难度</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>CSS Grid</strong></td>
                  <td>★★★★☆</td>
                  <td>中等</td>
                  <td>较高</td>
                  <td>★★★★☆</td>
                </tr>
                <tr>
                  <td><strong>Flexbox</strong></td>
                  <td>★★★★★</td>
                  <td>较低</td>
                  <td>中等</td>
                  <td>★★★☆☆</td>
                </tr>
                <tr>
                  <td><strong>Float</strong></td>
                  <td>★★★☆☆</td>
                  <td>较高</td>
                  <td>较低</td>
                  <td>★★☆☆☆</td>
                </tr>
                <tr>
                  <td><strong>Position</strong></td>
                  <td>★★★★★</td>
                  <td>较低</td>
                  <td>较低</td>
                  <td>★★☆☆☆</td>
                </tr>
              </tbody>
            </table>
            
            <h4>5.2 使用场景决策树</h4>
            <div class="decision-tree">
              <h5>🤔 如何选择布局技术？</h5>
              <ul>
                <li><strong>需要二维布局？</strong>
                  <ul>
                    <li>✅ 是 → 使用 <strong>CSS Grid</strong></li>
                    <li>❌ 否 → 继续判断</li>
                  </ul>
                </li>
                <li><strong>需要一维排列？</strong>
                  <ul>
                    <li>✅ 是 → 使用 <strong>Flexbox</strong></li>
                    <li>❌ 否 → 继续判断</li>
                  </ul>
                </li>
                <li><strong>需要精确定位？</strong>
                  <ul>
                    <li>✅ 是 → 使用 <strong>Position</strong></li>
                    <li>❌ 否 → 使用 <strong>Normal Flow</strong></li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <h3>六、混合布局策略：组合使用的艺术</h3>
            
            <h4>6.1 Grid + Flexbox 组合模式</h4>
            <pre><code>/* 页面级别使用Grid，组件级别使用Flexbox */
.page-layout {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.main {
  grid-area: main;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  padding: 2rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}</code></pre>
            
            <h4>6.2 实战案例：响应式仪表板</h4>
            <pre><code>/* 响应式仪表板布局 */
.dashboard {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
}

.dashboard-header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.dashboard-sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  background: #2c3e50;
  color: white;
}

.dashboard-main {
  grid-area: main;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f5f6fa;
  overflow-y: auto;
}

.widget {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.widget-content {
  flex: 1;
}

/* 平板端适配 */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
  }
  
  .dashboard-sidebar {
    position: fixed;
    left: -250px;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 1000;
    transition: left 0.3s ease;
  }
  
  .dashboard-sidebar.active {
    left: 0;
  }
  
  .dashboard-main {
    grid-template-columns: 1fr;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dashboard-main {
    padding: 1rem;
    gap: 1rem;
  }
  
  .widget {
    padding: 1rem;
  }
}</code></pre>
            
            <h3>七、调试与优化技巧</h3>
            
            <h4>7.1 布局调试工具</h4>
            <pre><code>/* 开发时的布局调试 */
.debug-grid * {
  outline: 1px solid red;
  background: rgba(255,0,0,0.05);
}

.debug-flex * {
  outline: 1px solid blue;
  background: rgba(0,0,255,0.05);
}

/* Grid线条可视化 */
.debug-grid-lines {
  background-image:
    linear-gradient(rgba(255,0,0,0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,0,0,0.3) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Flexbox方向指示器 */
.debug-flex::before {
  content: "→";
  position: absolute;
  top: 0;
  left: 0;
  color: blue;
  font-weight: bold;
}

.debug-flex[style*="column"]::before {
  content: "↓";
}</code></pre>
            
            <h4>7.2 性能优化策略</h4>
            <pre><code>/* 布局性能优化 */
.optimized-layout {
  /* 避免不必要的重排 */
  contain: layout style;
  
  /* 启用硬件加速 */
  will-change: transform;
  
  /* 使用合成层 */
  transform: translateZ(0);
}

/* 减少布局抖动 */
.stable-layout {
  /* 为动态内容预留空间 */
  min-height: 200px;
  
  /* 使用aspect-ratio保持比例 */
  aspect-ratio: 16/9;
}

/* 监控布局性能 */
function measureLayoutPerformance() {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.entryType === 'layout-shift') {
        console.log('Layout Shift detected:', entry.value);
      }
    });
  });
  
  observer.observe({ entryTypes: ['layout-shift'] });
}</code></pre>
            
            <div class="summary-section">
              <h3>八、总结与未来展望</h3>
              
              <h4>🎯 核心建议</h4>
              <ol>
                <li><strong>首选现代布局</strong>：优先使用Flexbox和Grid，避免Float和Table</li>
                <li><strong>合理组合使用</strong>：Grid处理页面级布局，Flexbox处理组件级布局</li>
                <li><strong>性能优先</strong>：考虑布局对渲染性能的影响，使用contain等优化属性</li>
                <li><strong>渐进增强</strong>：为老旧浏览器提供合理的回退方案</li>
                <li><strong>响应式思维</strong>：从移动端开始设计，逐步增强到桌面端</li>
              </ol>
              
              <h4>🔮 未来趋势</h4>
              <ul>
                <li><strong>Container Queries</strong>：基于容器大小的响应式设计</li>
                <li><strong>Subgrid</strong>：更灵活的嵌套网格布局</li>
                <li><strong>Masonry Layout</strong>：原生瀑布流布局支持</li>
                <li><strong>CSS Houdini</strong>：自定义布局算法</li>
              </ul>
              
              <h4>📊 选择决策矩阵</h4>
              <table class="decision-matrix">
                <tr>
                  <th>场景</th>
                  <th>推荐方案</th>
                  <th>备选方案</th>
                  <th>注意事项</th>
                </tr>
                <tr>
                  <td>页面整体布局</td>
                  <td>CSS Grid</td>
                  <td>Flexbox</td>
                  <td>考虑响应式设计</td>
                </tr>
                <tr>
                  <td>导航栏</td>
                  <td>Flexbox</td>
                  <td>Grid</td>
                  <td>注意移动端体验</td>
                </tr>
                <tr>
                  <td>卡片网格</td>
                  <td>CSS Grid</td>
                  <td>Flexbox</td>
                  <td>等高需求选择Flexbox</td>
                </tr>
                <tr>
                  <td>表单布局</td>
                  <td>CSS Grid</td>
                  <td>Flexbox</td>
                  <td>标签对齐很重要</td>
                </tr>
                <tr>
                  <td>弹窗覆盖</td>
                  <td>Position</td>
                  <td>-</td>
                  <td>注意层叠上下文</td>
                </tr>
              </table>
            </div>
          </div>
        `
            <tr>
              <th>布局需求</th>
              <th>推荐技术</th>
            </tr>
            <tr>
              <td>导航栏</td>
              <td>Flexbox</td>
            </tr>
            <tr>
              <td>卡片列表</td>
              <td>CSS Grid</td>
            </tr>
            <tr>
              <td>页面主体布局</td>
              <td>CSS Grid</td>
            </tr>
          </table>
          
          <h2>实践建议</h2>
          <p>在实际项目中，Flexbox和Grid往往结合使用，各自发挥优势。</p>
        `,
        author: '迫暮',
        date: '2024-02-20',
        category: 'technology',
        tags: ['CSS', '布局', 'Flexbox', 'Grid'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        readTime: 12
      },
      {
        id: 6,
        title: '开发工具与效率提升',
        slug: 'development-tools-productivity',
        excerpt: '分享我日常使用的开发工具和配置，包括VSCode扩展、终端工具、效率插件等，帮助提升开发效率。',
        content: `
          <h2>编辑器配置</h2>
          <h3>VS Code扩展推荐</h3>
          <ul>
            <li><strong>Prettier</strong> - 代码格式化</li>
            <li><strong>ESLint</strong> - 代码质量检查</li>
            <li><strong>Auto Rename Tag</strong> - 标签自动重命名</li>
            <li><strong>GitLens</strong> - Git增强功能</li>
            <li><strong>Thunder Client</strong> - API测试工具</li>
          </ul>
          
          <h3>编辑器设置</h3>
          <pre><code>{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.minimap.enabled": false,
  "workbench.startupEditor": "none"
}</code></pre>
          
          <h2>终端工具</h2>
          <h3>Oh My Zsh</h3>
          <p>强大的Zsh配置框架，提供丰富的主题和插件：</p>
          <ul>
            <li>git插件 - Git别名和状态显示</li>
            <li>zsh-autosuggestions - 命令自动补全</li>
            <li>zsh-syntax-highlighting - 语法高亮</li>
          </ul>
          
          <h3>常用CLI工具</h3>
          <ul>
            <li><strong>httpie</strong> - HTTP客户端</li>
            <li><strong>tldr</strong> - 简化的man页面</li>
            <li><strong>fzf</strong> - 模糊搜索工具</li>
            <li><strong>bat</strong> - 增强版cat命令</li>
          </ul>
          
          <h2>浏览器开发工具</h2>
          <h3>Chrome扩展</h3>
          <ul>
            <li>React Developer Tools</li>
            <li>Vue.js devtools</li>
            <li>JSON Viewer</li>
            <li>Wappalyzer - 技术栈检测</li>
          </ul>
          
          <h2>项目管理</h2>
          <h3>包管理器选择</h3>
          <p>根据项目需求选择npm、yarn或pnpm，考虑安装速度、磁盘占用等因素。</p>
          
          <h3>脚本自动化</h3>
          <p>使用package.json scripts或专门的任务运行器来自动化常见操作。</p>
        `,
        author: '迫暮',
        date: '2024-02-15',
        category: 'tools',
        tags: ['开发工具', '效率', 'VSCode', '终端'],
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
        readTime: 8
      }
    ];

    this.filteredPosts = [...this.posts];
  }

  setupUI() {
    // 创建博客界面结构
    this.container.innerHTML = `
      <div class="blog-header">
        <h2 class="blog-title">技术博客</h2>
        <p class="blog-subtitle">分享开发经验与技术思考</p>
      </div>
      
      ${this.options.enableSearch ? `
        <div class="blog-search">
          <input type="text" id="blog-search-input" placeholder="搜索文章..." class="search-input">
        </div>
      ` : ''}
      
      ${this.options.enableCategories ? `
        <div class="blog-filters">
          <button class="filter-btn filter-btn--active" data-category="all">全部</button>
          <button class="filter-btn" data-category="technology">技术</button>
          <button class="filter-btn" data-category="personal">个人</button>
          <button class="filter-btn" data-category="tools">工具</button>
        </div>
      ` : ''}
      
      <div class="blog-posts" id="blog-posts"></div>
      
      <div class="blog-pagination" id="blog-pagination"></div>
    `;
  }

  bindEvents() {
    // 搜索功能
    if (this.options.enableSearch) {
      const searchInput = document.getElementById('blog-search-input');
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.filterPosts();
      });
    }

    // 分类筛选
    if (this.options.enableCategories) {
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          // 更新活跃状态
          filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
          e.target.classList.add('filter-btn--active');
          
          this.currentCategory = e.target.getAttribute('data-category');
          this.filterPosts();
        });
      });
    }
  }

  filterPosts() {
    this.filteredPosts = this.posts.filter(post => {
      const matchesCategory = this.currentCategory === 'all' || post.category === this.currentCategory;
      const matchesSearch = this.searchQuery === '' || 
        post.title.toLowerCase().includes(this.searchQuery) ||
        post.excerpt.toLowerCase().includes(this.searchQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
      
      return matchesCategory && matchesSearch;
    });

    this.currentPage = 1;
    this.renderPosts();
    this.renderPagination();
  }

  renderPosts() {
    const postsContainer = document.getElementById('blog-posts');
    const startIndex = (this.currentPage - 1) * this.options.postsPerPage;
    const endIndex = startIndex + this.options.postsPerPage;
    const currentPosts = this.filteredPosts.slice(startIndex, endIndex);

    if (currentPosts.length === 0) {
      postsContainer.innerHTML = `
        <div class="no-posts">
          <p>没有找到相关文章</p>
        </div>
      `;
      return;
    }

    const postsHtml = currentPosts.map(post => this.createPostCard(post)).join('');
    postsContainer.innerHTML = postsHtml;

    // 绑定文章点击事件
    const postCards = postsContainer.querySelectorAll('.blog-post-card');
    postCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.openPostDetail(currentPosts[index]);
      });
    });
  }

  createPostCard(post) {
    return `
      <article class="blog-post-card" data-post-id="${post.id}">
        <div class="post-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
          <div class="post-category">${this.getCategoryName(post.category)}</div>
        </div>
        
        <div class="post-content">
          <div class="post-meta">
            <span class="post-date">${this.formatDate(post.date)}</span>
            <span class="post-read-time">${post.readTime}分钟阅读</span>
          </div>
          
          <h3 class="post-title">${post.title}</h3>
          
          ${this.options.showExcerpt ? `
            <p class="post-excerpt">${post.excerpt}</p>
          ` : ''}
          
          <div class="post-tags">
            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          
          <div class="post-footer">
            <span class="post-author">作者: ${post.author}</span>
            <span class="read-more">阅读更多 →</span>
          </div>
        </div>
      </article>
    `;
  }

  renderPagination() {
    const paginationContainer = document.getElementById('blog-pagination');
    const totalPages = Math.ceil(this.filteredPosts.length / this.options.postsPerPage);

    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let paginationHtml = '<div class="pagination-buttons">';
    
    // 上一页按钮
    if (this.currentPage > 1) {
      paginationHtml += `<button class="pagination-btn" data-page="${this.currentPage - 1}">上一页</button>`;
    }

    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === this.currentPage ? ' pagination-btn--active' : '';
      paginationHtml += `<button class="pagination-btn${isActive}" data-page="${i}">${i}</button>`;
    }

    // 下一页按钮
    if (this.currentPage < totalPages) {
      paginationHtml += `<button class="pagination-btn" data-page="${this.currentPage + 1}">下一页</button>`;
    }

    paginationHtml += '</div>';
    paginationContainer.innerHTML = paginationHtml;

    // 绑定分页事件
    const paginationBtns = paginationContainer.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentPage = parseInt(e.target.getAttribute('data-page'));
        this.renderPosts();
        this.renderPagination();
        
        // 滚动到顶部
        this.container.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  openPostDetail(post) {
    // 添加结构化数据以提升SEO
    this.addStructuredData(post);
    
    // 创建文章详情模态框
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.innerHTML = `
      <div class="blog-modal__backdrop"></div>
      <div class="blog-modal__content">
        <div class="blog-modal__header">
          <button class="blog-modal__close">&times;</button>
        </div>
        
        <article class="blog-post-detail">
          <header class="post-detail-header">
            <div class="post-detail-meta">
              <span class="post-category">${this.getCategoryName(post.category)}</span>
              <span class="post-date">${this.formatDate(post.date)}</span>
              <span class="post-read-time">${post.readTime}分钟阅读</span>
            </div>
            
            <h1 class="post-detail-title">${post.title}</h1>
            
            <div class="post-detail-tags">
              ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="post-detail-author">
              <span>作者: ${post.author}</span>
            </div>
          </header>
          
          <div class="post-detail-image">
            <img src="${post.image}" alt="${post.title}">
          </div>
          
          <div class="post-detail-content">
            ${post.content}
          </div>
        </article>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // 绑定关闭事件
    const closeBtn = modal.querySelector('.blog-modal__close');
    const backdrop = modal.querySelector('.blog-modal__backdrop');
    
    const closeModal = () => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // ESC键关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  getCategoryName(category) {
    const categoryNames = {
      'technology': '技术',
      'personal': '个人',
      'tools': '工具',
      'tutorial': '教程',
      'review': '评测'
    };
    return categoryNames[category] || category;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 公共方法：添加新文章
  addPost(post) {
    post.id = this.posts.length + 1;
    this.posts.unshift(post);
    this.filterPosts();
  }

  // 公共方法：获取文章详情
  getPostBySlug(slug) {
    return this.posts.find(post => post.slug === slug);
  }

  // 添加结构化数据以提升SEO
  addStructuredData(post) {
    // 移除之前的结构化数据
    const existingScript = document.getElementById('blog-structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // 创建新的结构化数据
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.image,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.date,
      "dateModified": post.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href + "#" + post.slug
      },
      "keywords": post.tags.join(", "),
      "wordCount": post.content.replace(/<[^>]*>/g, '').split(' ').length,
      "timeRequired": `PT${post.readTime}M`,
      "articleSection": this.getCategoryName(post.category)
    };

    // 添加到页面
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-structured-data';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogSystem;
}

// 全局可用
window.BlogSystem = BlogSystem;