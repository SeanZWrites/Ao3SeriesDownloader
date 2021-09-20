# Ao3 Series Downloader

A simple, open-source browser plugin that adds a 'Download Series' button in
Ao3. Works in Firefox, Chrome, and Edge.

*Note: You need to be logged into AO3 to see the Download Series button.*

## Installation Instructions
Most users will likely want to install this from the
[Chrome Web Store (for Chrome)](https://chrome.google.com/webstore/detail/ao3-series-downloader/lhdccommkdbadfgjhlccfmcpdhmepjik)
or the [Mozilla Addons Site (for
Firefox)](https://addons.mozilla.org/en-US/firefox/addon/ao3-series-downloader/).
This ensures the extension will be kept up-to-date automatically.

However, it can also be sideloaded into the browser.

### Sideloading in Chrome
Once this extension is downloaded:
  - Go to `chrome://extensions` in your browser
  - Enable developer mode by toggling the switch on the upper right.
  - Then click 'Load Unpacked', and navigate to this folder. 
  
You should see this extension appear.

### Sideloading in Edge
Sideloading in Edge is virtually identical to sideloading in Chrome, except
the extension page is located at `edge://extensions`. Once on the page,
enable developer mode, and click 'Load Unpacked'. 

Note that Edge will notify you every so often if you leave a sideloaded
extension turned on, and re-confirm that you want to leave the (developer)
extension enabled.


### Sideloading in Firefox
Firefox does not allow sideloading in normal releases, so you'll need to use
either the Developer Edition, or a nightly build. Additionally, you'll need to
re-do this process every time you load Firefox (hence why installing it from the
official store is recommended).

However, if you'd like to test the extension, or just load it without using the store:
  - Go to `about:debugging#/runtime/this-firefox`
  - Click 'Load Temporary Add-on...'
  - Navigate to where you downloaded these files, and select any file in the folder. 

The extension will be loaded into Firefox until you close the browser. 

## Acknowledgements
The icon for this extension was built using the free icons provided on
[Google Fonts](https://fonts.google.com/icons).