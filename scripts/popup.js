// FairFound Extension - Main Popup Script

const API_BASE_URL = 'http://localhost:8000/api';
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initLeaderboardToggle();
  initCategoryFilter();
  initCompareForm();
  loadCategories();
  loadLeaderboards();
});

// Tab Navigation
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
}

// Leaderboard Toggle
function initLeaderboardToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const boards = document.querySelectorAll('.leaderboard-section');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const boardId = btn.dataset.board;
      
      toggleBtns.forEach(b => b.classList.remove('active'));
      boards.forEach(b => b.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`${boardId}-board`).classList.add('active');
    });
  });
}

// Category Filter
function initCategoryFilter() {
  const categorySelect = document.getElementById('category-select');
  categorySelect.addEventListener('change', (e) => {
    currentCategory = e.target.value;
    loadLeaderboards();
  });
}

// Load Categories
async function loadCategories() {
  const categorySelect = document.getElementById('category-select');
  
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/categories/`);
    if (response.ok) {
      const categories = await response.json();
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    } else {
      loadMockCategories(categorySelect);
    }
  } catch (error) {
    loadMockCategories(categorySelect);
  }
}

function loadMockCategories(select) {
  const mockCategories = [
    'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'Mobile Developer', 'UI/UX Designer', 'Data Scientist', 'DevOps Engineer'
  ];
  mockCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Load Leaderboards
async function loadLeaderboards() {
  const loading = document.getElementById('leaderboard-loading');
  loading.style.display = 'flex';

  const categoryParam = currentCategory !== 'all' ? `?category=${encodeURIComponent(currentCategory)}` : '';

  try {
    const [marketplaceRes, fairfoundRes] = await Promise.all([
      fetch(`${API_BASE_URL}/leaderboard/marketplace/${categoryParam}`),
      fetch(`${API_BASE_URL}/leaderboard/fairfound/${categoryParam}`)
    ]);

    let marketplaceData, fairfoundData;

    if (marketplaceRes.ok && fairfoundRes.ok) {
      marketplaceData = await marketplaceRes.json();
      fairfoundData = await fairfoundRes.json();
    } else {
      marketplaceData = getMockMarketplaceData();
      fairfoundData = getMockFairfoundData();
    }

    renderLeaderboard('marketplace-list', marketplaceData);
    renderLeaderboard('fairfound-list', fairfoundData);
  } catch (error) {
    console.error('Failed to load leaderboards:', error);
    renderLeaderboard('marketplace-list', getMockMarketplaceData());
    renderLeaderboard('fairfound-list', getMockFairfoundData());
  } finally {
    loading.style.display = 'none';
  }
}


function renderLeaderboard(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  data.forEach((item, index) => {
    const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'default';
    
    const itemEl = document.createElement('div');
    itemEl.className = 'leaderboard-item';
    itemEl.innerHTML = `
      <div class="rank ${rankClass}">${index + 1}</div>
      <div class="freelancer-info">
        <div class="freelancer-name">${item.name}</div>
        <div class="freelancer-specialty">${item.specialty}</div>
      </div>
      <div class="score">
        <div class="score-value">${item.score}</div>
        <div class="score-label">Score</div>
      </div>
    `;
    container.appendChild(itemEl);
  });
}

// Compare Form
function initCompareForm() {
  const compareBtn = document.getElementById('compare-btn');
  const url1Input = document.getElementById('freelancer1-url');
  const url2Input = document.getElementById('freelancer2-url');

  compareBtn.addEventListener('click', () => {
    const url1 = url1Input.value.trim();
    const url2 = url2Input.value.trim();

    if (!url1 || !url2) {
      showError('Please enter both profile URLs');
      return;
    }

    if (!isValidUrl(url1) || !isValidUrl(url2)) {
      showError('Please enter valid URLs');
      return;
    }

    hideError();
    compareFreelancers(url1, url2);
  });
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

async function compareFreelancers(url1, url2) {
  const loading = document.getElementById('compare-loading');
  const results = document.getElementById('comparison-results');
  
  loading.style.display = 'flex';
  results.classList.remove('active');

  try {
    const response = await fetch(`${API_BASE_URL}/compare/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url1, url2 })
    });

    let data;
    if (response.ok) {
      data = await response.json();
    } else {
      // Fallback to mock data if API unavailable
      data = getMockComparisonData(url1, url2);
    }
    
    renderComparison(data);
  } catch (error) {
    // Fallback to mock data on network error
    const data = getMockComparisonData(url1, url2);
    renderComparison(data);
    console.error('Comparison error (using mock):', error);
  } finally {
    loading.style.display = 'none';
  }
}

function renderComparison(data) {
  const results = document.getElementById('comparison-results');
  const metricsContainer = document.getElementById('metrics-comparison');
  const summaryContainer = document.getElementById('comparison-summary');
  
  // Update headers
  document.querySelector('#f1-header .avatar').textContent = data.freelancer1.name.charAt(0);
  document.querySelector('#f1-header .name').textContent = data.freelancer1.name;
  document.querySelector('#f2-header .avatar').textContent = data.freelancer2.name.charAt(0);
  document.querySelector('#f2-header .name').textContent = data.freelancer2.name;

  // Render metrics
  metricsContainer.innerHTML = '';
  data.metrics.forEach(metric => {
    const maxVal = Math.max(metric.value1, metric.value2);
    const percent1 = (metric.value1 / maxVal) * 100;
    const percent2 = (metric.value2 / maxVal) * 100;

    const row = document.createElement('div');
    row.className = 'metric-row';
    row.innerHTML = `
      <span class="metric-value left">${metric.value1}${metric.suffix || ''}</span>
      <div class="metric-bar left">
        <div class="metric-fill f1" style="width: ${percent1}%"></div>
      </div>
      <span class="metric-label">${metric.label}</span>
      <div class="metric-bar">
        <div class="metric-fill f2" style="width: ${percent2}%"></div>
      </div>
      <span class="metric-value right">${metric.value2}${metric.suffix || ''}</span>
    `;
    metricsContainer.appendChild(row);
  });

  // Render summary
  summaryContainer.innerHTML = `
    <div class="summary-title">FairFound Recommendation</div>
    <div class="winner-badge">
      <span class="winner-icon">🏆</span>
      <span>${data.winner} scores higher overall</span>
    </div>
  `;

  results.classList.add('active');
}

function showError(message) {
  const errorEl = document.getElementById('compare-error');
  const errorText = document.getElementById('error-text');
  errorText.textContent = message;
  errorEl.style.display = 'flex';
}

function hideError() {
  document.getElementById('compare-error').style.display = 'none';
}


// Mock Data Functions (Replace with actual API calls)
function getMockMarketplaceData() {
  return [
    { name: 'Sarah Johnson', specialty: 'Full Stack Developer', score: 98 },
    { name: 'Michael Chen', specialty: 'UI/UX Designer', score: 95 },
    { name: 'Emily Davis', specialty: 'Data Scientist', score: 92 },
    { name: 'James Wilson', specialty: 'Mobile Developer', score: 89 },
    { name: 'Lisa Anderson', specialty: 'DevOps Engineer', score: 87 },
    { name: 'David Brown', specialty: 'Backend Developer', score: 85 },
    { name: 'Anna Martinez', specialty: 'Frontend Developer', score: 83 },
    { name: 'Robert Taylor', specialty: 'Cloud Architect', score: 81 }
  ];
}

function getMockFairfoundData() {
  return [
    { name: 'Michael Chen', specialty: 'UI/UX Designer', score: 96 },
    { name: 'Emily Davis', specialty: 'Data Scientist', score: 94 },
    { name: 'Sarah Johnson', specialty: 'Full Stack Developer', score: 91 },
    { name: 'Lisa Anderson', specialty: 'DevOps Engineer', score: 88 },
    { name: 'Anna Martinez', specialty: 'Frontend Developer', score: 86 },
    { name: 'James Wilson', specialty: 'Mobile Developer', score: 84 },
    { name: 'Robert Taylor', specialty: 'Cloud Architect', score: 82 },
    { name: 'David Brown', specialty: 'Backend Developer', score: 79 }
  ];
}

function getMockComparisonData(url1, url2) {
  // Extract usernames from URLs for display
  const name1 = extractUsername(url1) || 'Freelancer 1';
  const name2 = extractUsername(url2) || 'Freelancer 2';

  // Generate random but consistent scores based on URL
  const score1 = 70 + (url1.length % 30);
  const score2 = 70 + (url2.length % 30);
  const winner = score1 >= score2 ? name1 : name2;

  return {
    freelancer1: { name: name1, url: url1 },
    freelancer2: { name: name2, url: url2 },
    metrics: [
      { label: 'Rating', value1: 4.5 + (url1.length % 5) / 10, value2: 4.5 + (url2.length % 5) / 10, suffix: '' },
      { label: 'Jobs Done', value1: 50 + (url1.length * 3), value2: 50 + (url2.length * 3), suffix: '' },
      { label: 'On-Time', value1: 80 + (url1.length % 20), value2: 80 + (url2.length % 20), suffix: '%' },
      { label: 'Response', value1: 1 + (url1.length % 10), value2: 1 + (url2.length % 10), suffix: 'h' },
      { label: 'Rehire Rate', value1: 60 + (url1.length % 35), value2: 60 + (url2.length % 35), suffix: '%' },
      { label: 'FairFound Score', value1: score1, value2: score2, suffix: '' }
    ],
    winner: winner
  };
}

function extractUsername(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p);
    return pathParts[pathParts.length - 1] || null;
  } catch {
    return null;
  }
}
