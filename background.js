let allSymbols = [];
let currentPage = 1;
let totalPages = 1; // Default value, will be updated dynamically
let scrapingInProgress = false;
let baseUrl = "";

// Function to scrape symbols from a page
function scrapeSymbols() {
  const anchors = document.querySelectorAll('a[href^="/company/"]');
  const symbols = Array.from(anchors)
    .map((anchor) => {
      const parts = anchor.getAttribute("href").split("/");
      return parts.length > 2 ? parts[2] : "";
    })
    .filter((symbol) => symbol); // Remove empty symbols
  return symbols;
}

// Function to get the total number of pages
function getTotalPages() {
  const pageInfoDiv = document.querySelector("div[data-page-info]");
  if (pageInfoDiv) {
    const pageInfoText = pageInfoDiv.innerText;
    const totalPagesMatch = pageInfoText.match(/of (\d+)/);
    if (totalPagesMatch) {
      return parseInt(totalPagesMatch[1], 10);
    }
  }
  return 1;
}

// Function to copy data to clipboard using a temporary text area
function copyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

// Function to insert a message popup
function insertMessagePopup(message, color) {
  const messageDiv = document.createElement("div");
  messageDiv.innerText = message;
  messageDiv.style.position = "fixed";
  messageDiv.style.bottom = "10px";
  messageDiv.style.right = "10px";
  messageDiv.style.backgroundColor = color;
  messageDiv.style.color = "white";
  messageDiv.style.padding = "10px";
  messageDiv.style.borderRadius = "5px";
  messageDiv.style.zIndex = "10000";
  document.body.appendChild(messageDiv);
  setTimeout(() => {
    document.body.removeChild(messageDiv);
  }, 3000); // Remove message after 3 seconds
}

// Function to replace numbers with symbols from API
async function replaceNumbersWithSymbols(symbols) {
  const updatedSymbols = await Promise.all(
    symbols.map(async (symbol) => {
      if (!isNaN(symbol)) {
        const response = await fetch(
          `https://d3odwfz2snlzhh.cloudfront.net/default/screener-exchange-token-to-symbol?exchange_token=${symbol}`
        );
        const data = await response.json();
        if (response.status === 404) {
          return "";
        }
        return data.tradingsymbol || "";
      }
      return symbol;
    })
  );
  return updatedSymbols.filter((symbol) => symbol); // Remove empty symbols
}

// Function to navigate to the next page and scrape data
function navigateAndScrape(tabId) {
  if (!scrapingInProgress) return;

  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      function: scrapeSymbols,
    },
    async (results) => {
      if (results && results[0] && results[0].result) {
        console.log("Scraped symbols:", results[0].result); // Debugging
        allSymbols.push(...results[0].result);
      }
      if (currentPage < totalPages) {
        currentPage++;
        setTimeout(() => {
          chrome.tabs.update(tabId, { url: `${baseUrl}&page=${currentPage}` });
        }, 500); // 500ms delay
      } else {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: insertMessagePopup,
          args: ["Replacing exchange tokens with symbols...", "orange"],
        });

        allSymbols = await replaceNumbersWithSymbols(allSymbols);

        const csvContent = allSymbols
          .map((symbol) => `NSE:${symbol}`)
          .join(", ");
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            function: copyToClipboard,
            args: [csvContent],
          },
          () => {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              function: insertMessagePopup,
              args: ["Symbols copied to clipboard as CSV.", "green"],
            });
          }
        );
        allSymbols = [];
        currentPage = 1;
        scrapingInProgress = false;
      }
    }
  );
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startScraping") {
    if (scrapingInProgress) return;
    scrapingInProgress = true;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      const url = new URL(activeTab.url);

      // Check if the URL contains /screens/
      if (!url.pathname.includes("/screens/")) {
        alert(
          "This script can only be run on pages containing /screens/ in the URL."
        );
        scrapingInProgress = false;
        return;
      }

      baseUrl = url.href.split("&page=")[0]; // Get base URL without page parameter

      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          function: getTotalPages,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            totalPages = results[0].result;
            console.log("Total pages:", totalPages); // Debugging
            navigateAndScrape(activeTab.id);
          }
        }
      );
    });
  }
});

// Detect tab updates and continue scraping if necessary
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    scrapingInProgress &&
    changeInfo.status === "complete" &&
    tab.url.includes("/screens/")
  ) {
    navigateAndScrape(tabId);
  }
});
