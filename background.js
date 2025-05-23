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
        let clicked = false;
        let attempts = 0;
        const maxAttempts = 15;

        // Sets up an interval to repeatedly try to click the download button
        const intervalId = setInterval(() => {
            // Stops trying if already clicked or max attempts reached
            if (clicked || attempts >= maxAttempts) {
                clearInterval(intervalId);
                return;
            }
            attempts++;

            // Injects code into the Rapidsave page to check for warnings and click the download button
            chrome.tabs.executeScript(newTab.id, {
                code: `
                    (function () {
                        // Checks if there is a warning (like "please wait")
                        const warningEl = document.getElementById("JdYY6");
                        if (warningEl && warningEl.innerHTML.trim() !== "") {
                            return "wait";
                        } else {
                            // Tries to find and click the download button
                            const btn = document.getElementsByClassName("downloadbutton")[0];
                            if (btn) {
                                btn.click();
                                return "clicked";
                            } else {
                                return "no_button";
                            }
                        }
                    })();
                `
            }, function (results) {
                // Handles errors from script injection
                if (chrome.runtime.lastError) {
                    return;
                }

                const result = results && results[0];

                // If the button was clicked, stop the interval
                if (result === "clicked") {
                    clicked = true;
                    clearInterval(intervalId);
                }
            });
        }, 1000);

        // Function called when a new download starts
        function onDownload(downloadItem) {
            clearInterval(intervalId); // Stop trying to click the button
            // Closes the Rapidsave tab as soon as the download begins
            chrome.tabs.remove(newTab.id);
            // Removes the listener to prevent multiple executions
            chrome.downloads.onCreated.removeListener(onDownload);
        }
        // Adds the listener to detect when the download starts
        chrome.downloads.onCreated.addListener(onDownload);
    });
});