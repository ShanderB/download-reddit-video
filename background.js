// Adds a listener for the extension icon click
chrome.browserAction.onClicked.addListener(function (tab) {
    // Checks if the URL is from Reddit
    if (!tab.url.includes("reddit.com")) {
        return;
    }
    // Encodes the current tab URL
    const url = encodeURIComponent(tab.url);
    // Builds the redirect URL for Rapidsave
    const redirectUrl = `https://rapidsave.com/info?url=${url}`;
    // Opens a new tab with the Rapidsave URL
    chrome.tabs.create({ url: redirectUrl }, function (newTab) {
        // Adds a listener to detect when the new tab finishes loading
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            // Checks if it's the correct tab and if loading is complete
            if (tabId === newTab.id && info.status === 'complete') {
                // Removes the listener to avoid multiple executions
                chrome.tabs.onUpdated.removeListener(listener);
                // Injects a script into the page to automatically click the download button
                chrome.tabs.executeScript(newTab.id, {
                    code: `
                        var btn = document.getElementsByClassName("downloadbutton")[0];
                        if(btn) btn.click();
                    `
                });
            }
        });
    });
});