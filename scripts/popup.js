// FairFound Extension - Main Popup Script

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initLeaderboardToggle();
  initCompareForm();
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

// Load Leaderboards
async function loadLeaderboards() {
  const loading = document.getElementById('leaderboard-loading');
  loading.style.display = 'flex';

  try {
    // TODO: Replace with actual API calls
    // const marketplaceData = await fetch('API_URL/leaderboard/marketplace');
    // const fairfoundData = await fetch('API_URL/leaderboard/fairfound');
    
    // Mock data for demonstration
    const marketplaceData = getMockMarketplaceData();
    const fairfoundData = getMockFairfoundData();

    renderLeaderboard('marketplace-list', marketplaceData);
    renderLeaderboard('fairfound-list', fairfoundData);
  } catch (error) {
    console.error('Failed to load leaderboards:', error);
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
    // TODO: Replace with actual API call
    // const response = await fetch('API_URL/compare', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ url1, url2 })
    // });
    // const data = await response.json();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock comparison data
    const data = getMockComparisonData(url1, url2);
    renderComparison(data);
  } catch (error) {
    showError('Failed to compare freelancers. Please try again.');
    console.error('Comparison error:', error);
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

  return {
    freelancer1: { name: name1, url: url1 },
    freelancer2: { name: name2, url: url2 },
    metrics: [
      { label: 'Rating', value1: 4.8, value2: 4.6, suffix: '' },
      { label: 'Jobs Done', value1: 156, value2: 203, suffix: '' },
      { label: 'On-Time', value1: 94, value2: 89, suffix: '%' },
      { label: 'Response', value1: 2, value2: 4, suffix: 'h' },
      { label: 'Rehire Rate', value1: 78, value2: 82, suffix: '%' },
      { label: 'FairFound Score', value1: 87, value2: 84, suffix: '' }
    ],
    winner: name1
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
