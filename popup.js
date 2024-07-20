document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startScraping").addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "startScraping" });
  });
});
