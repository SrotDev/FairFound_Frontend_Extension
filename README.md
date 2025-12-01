# FairFound Chrome Extension

A Chrome extension that helps clients hire freelancers and helps freelancers understand their competitive position through dual leaderboards and side-by-side comparisons.

## Features

### 1. Dual Leaderboards
- **Marketplace Ranking**: View rankings as displayed by freelance platforms
- **FairFound Ranking**: View rankings based on our proprietary fairness equation that considers multiple factors beyond just ratings
- **Category Filtering**: Filter leaderboards by freelancer specialty (Full Stack Developer, UI/UX Designer, Data Scientist, etc.)

### 2. Freelancer Comparison
- Compare any two freelancers by entering their profile URLs
- Side-by-side metrics comparison including:
  - Rating
  - Jobs Completed
  - On-Time Delivery %
  - Response Time
  - Rehire Rate
  - FairFound Score
- Get FairFound's recommendation on which freelancer scores higher overall

## Installation (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `FairFound_Frontend_Extension` folder
5. The extension icon will appear in your toolbar
6. Click the icon to open the side panel

## Project Structure

```
FairFound_Frontend_Extension/
├── manifest.json          # Chrome extension configuration (Manifest V3)
├── popup.html             # Main UI markup
├── styles/
│   └── popup.css          # Dark theme styling
├── scripts/
│   ├── popup.js           # Main application logic
│   └── background.js      # Service worker for side panel
└── icons/                 # Extension icons (SVG)
    ├── icon16.svg
    ├── icon48.svg
    └── icon128.svg
```

## Configuration

### API Connection
The extension connects to the FairFound backend API. Update the API URL in `scripts/popup.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

For production, change this to your deployed backend URL.

### Permissions
The extension requires these Chrome permissions:
- `activeTab`: Access to the current tab
- `storage`: Store user preferences
- `sidePanel`: Display as a side panel (stays open while browsing)

## Usage

### Viewing Leaderboards
1. Click the FairFound extension icon to open the side panel
2. Select a category from the dropdown (or leave as "All Categories")
3. Toggle between "Marketplace Ranking" and "FairFound Ranking"
4. View the top 20 freelancers in each ranking

### Comparing Freelancers
1. Switch to the "Compare" tab
2. Enter the first freelancer's profile URL (e.g., `https://fairfound.com/freelancer/john-doe`)
3. Enter the second freelancer's profile URL
4. Click "Compare Now"
5. View the side-by-side comparison and FairFound's recommendation

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard/categories/` | Get available categories |
| GET | `/api/leaderboard/marketplace/` | Marketplace rankings |
| GET | `/api/leaderboard/fairfound/` | FairFound rankings |
| POST | `/api/compare/` | Compare two freelancers |

## Tech Stack

- HTML5 / CSS3
- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- Side Panel API

## Browser Support

- Google Chrome 114+ (Side Panel API requirement)
- Microsoft Edge 114+ (Chromium-based)

## Development

### Making Changes
1. Edit files in the extension folder
2. Go to `chrome://extensions/`
3. Click the refresh icon on the FairFound extension card
4. Changes will be applied immediately

### Testing Without Backend
The extension includes mock data fallbacks. If the backend API is unavailable, it will display sample data for demonstration purposes.

## License

Proprietary - FairFound Project
