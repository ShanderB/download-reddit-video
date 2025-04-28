# Redirect to Rapidsave

This browser extension allows you to quickly save Reddit posts using Rapidsave. When you click the extension button while on a Reddit page, it will automatically redirect you to Rapidsave, trigger the download, and close the tab after a few seconds.

## How to Build and Run

1. **Build the Extension**

   Use [web-ext](https://github.com/mozilla/web-ext) to build the extension package:

 ```sh
   npx web-ext build --overwrite-destination
   ```

   This will create a .zip file in the web-ext-artifacts directory.

2. **Install the Extension**

   Open your browser's extensions/add-ons page.
   Load the unpacked extension from your project directory or use the generated .zip file.

3. **How It Works**

   - When you are on a Reddit page and click the extension button:
     1. The extension checks if the current tab URL contains "reddit.com".
     2. It opens a new tab with Rapidsave, passing the Reddit post URL.
     3. Once the Rapidsave page loads, the extension automatically clicks the download button for you.
     4. The Rapidsave tab will close automatically after 5 seconds.

4. **Permissions**

   The extension requires the following permissions:

   - Access to tabs and activeTab.
   - Access to rapidsave.com to automate the download process.

5. **Icons**

   Icons are provided in the images directory for various sizes.