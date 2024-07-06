# Scraper Extension for Stock Symbols

## Overview

This Chrome extension scrapes stock symbols from screener.in screens. It collects symbols from multiple pages, replaces exchange tokens with actual symbols from my API, and copies the final list to the clipboard in CSV format (commonly supported in charting tools). The extension also distinguishes between symbols listed on the NSE and BSE exchanges.

## Features

- **Multi-page scraping**: Automatically scrapes symbols across multiple pages.
- **Token to symbol conversion**: Replaces exchange tokens with actual symbols using an API.
- **Exchange differentiation**: Distinguishes between symbols listed on NSE and BSE.
- **Clipboard copy**: Copies the final list of symbols in CSV format to the clipboard.
- **User notifications**: Displays popup messages to inform users of the scraping progress and completion.

## Installation

1. **Clone or download the repository**:

   ```bash
   git clone https://github.com/devAgam/Screener.in-to-TradingView.git
   ```

2. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" using the toggle in the top right corner.
   - Click "Load unpacked" and select the directory where you cloned/downloaded the repository.

## Usage

1. **Navigate to the target website**:

   - Open a screen in screener.in. This is where the extension will scrape symbols.

2. **Start scraping**:

   - Click on the extension icon in the Chrome toolbar.
   - Click the "Start Scraping" button in the popup.

3. **Monitor progress**:

   - The extension will scrape symbols across all pages and display popup messages to inform you of the progress.

4. **Copy symbols**:
   - Once scraping is complete, the extension will replace exchange tokens with actual symbols and copy the list to your clipboard in CSV format.

## Code Explanation

### Background Script

The background script handles the core functionality of the extension, including scraping symbols, navigating pages, replacing exchange tokens with symbols, and copying the final list to the clipboard.

```javascript
let allSymbols = [];
let currentPage = 1;
let totalPages = 1;
let scrapingInProgress = false;
let baseUrl = "";

// Function to scrape symbols from a page
function scrapeSymbols() {
  // Implementation here...
}

// Function to get the total number of pages
function getTotalPages() {
  // Implementation here...
}

// Function to copy data to clipboard using a temporary text area
function copyToClipboard(text) {
  // Implementation here...
}

// Function to insert a message popup
function insertMessagePopup(message, color) {
  // Implementation here...
}

// Function to replace numbers with symbols from API
async function replaceNumbersWithSymbols(symbols) {
  // Implementation here...
}

// Function to navigate to the next page and scrape data
function navigateAndScrape(tabId) {
  // Implementation here...
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Implementation here...
});

// Detect tab updates and continue scraping if necessary
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Implementation here...
});
```

## API Integration

The extension uses an API to convert exchange tokens to actual stock symbols. The API endpoint is:

```
https://d3odwfz2snlzhh.cloudfront.net/default/screener-exchange-token-to-symbol
```

The extension sends a request with the `exchange_tokens` query parameter containing all numeric tokens, and receives a response with the corresponding symbols and exchanges.

Example request:

```
https://d3odwfz2snlzhh.cloudfront.net/default/screener-exchange-token-to-symbol?exchange_tokens=123,456,789
```

Example response:

```json
[
  {
    "tradingsymbol": "GUJTHEM",
    "exchange": "BSE"
  },
  {
    "tradingsymbol": "SOURCENTRL",
    "exchange": "BSE"
  }
]
```

## Development

To contribute or modify the extension, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/devAgam/Screener.in-to-TradingView.git
   ```

2. **Make changes**:

   - Modify the JavaScript files in the repository as needed.

3. **Reload the extension**:
   - After making changes, reload the extension in Chrome by navigating to `chrome://extensions/`, enabling "Developer mode", and clicking the "Reload" button for the extension.

## License

This project is licensed under the Apache v2.0 License.

## Acknowledgements

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Contact

For questions or feedback, please contact [me@devagam.com](me@devagam.com).

---

Enjoy using the Screener.in to TradingView!
