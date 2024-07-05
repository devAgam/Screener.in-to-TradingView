document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startScraping").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "startScraping" });
  });
});
