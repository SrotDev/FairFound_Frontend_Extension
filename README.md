# FairFound Chrome Extension

A Chrome extension that helps clients hire freelancers and helps freelancers understand their competitive position.

## Features

### 1. Dual Leaderboards
- **Marketplace Ranking**: View rankings as displayed by the freelance platform
- **FairFound Ranking**: View rankings based on our proprietary fairness equation

### 2. Freelancer Comparison
- Compare any two freelancers by entering their profile URLs
- See side-by-side metrics comparison
- Get FairFound's recommendation based on overall analysis

## Installation (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `FairFound_Frontend_Extension` folder
5. The extension icon will appear in your toolbar

## Project Structure

```
FairFound_Frontend_Extension/
├── manifest.json        # Extension configuration
├── popup.html           # Main popup UI
├── styles/
│   └── popup.css        # Styling
├── scripts/
│   └── popup.js         # Main logic
└── icons/               # Extension icons (add your own)
```

## API Integration

The extension is set up with mock data. To connect to your backend:

1. Open `scripts/popup.js`
2. Find the `loadLeaderboards()` function and uncomment the API calls
3. Find the `compareFreelancers()` function and uncomment the API call
4. Update the API URLs to point to your FairFound backend

## Required Icons

Add these icon files to the `icons/` folder:
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)
