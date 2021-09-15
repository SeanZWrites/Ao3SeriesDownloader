// see https://stackoverflow.com/questions/42995426/trying-to-use-chrome-downloads-its-undefined-for-some-reason
// you cannot call chrome methods from content scripts, so they must be handled by a background worker

// chrome will throw a runtime error 
// (The message port was closed before a response was received)
// if an async listener function doesn't return true and you try
// try to use sendResponse. 
// 
// So to make it return true, we'll do everything we
// would in a callback in another method, and return true
// immediately
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    downloadAndWaitForCompletion(request)
        .then((result) => sendResponse(result))

    return true //indicate we are doing an async call in this handler
});


async function downloadAndWaitForCompletion(request)
{
    let downloadId = await startDownload(request.url, request.filename)
    console.log("started download id " + downloadId)

    await waitForDownloadComplete(downloadId)
    console.log("finished download id " + downloadId)

    let downloadState = await getDownloadState(downloadId)
    console.log("download state is " + downloadState)

    return downloadState
}

function startDownload(url, filename) {
    return new Promise(resolve => {
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: false
        }, 
        (downloadId) => resolve(downloadId))
    })
}

function waitForDownloadComplete(downloadId) {
    return new Promise(async (resolve) => {

        // check if the download is already complete
        if (await isDownloadDone(downloadId)) {
            console.log("download is already complete")
            resolve(null)
            return
        }

        // if it's not, we need to setup event handling
        chrome.downloads.onChanged.addListener(async (downloadDelta) => {
            if (downloadDelta.id === downloadId) {
                // check that the download finished
                if (await isDownloadDone(downloadId)) {
                    console.log("download complete, signaling and removing listener")
                    resolve(null)
                    chrome.downloads.onChanged.removeListener(arguments.callee)
                }
            }
        })
    })
}

async function isDownloadDone(downloadId) {
    let downloadState = await getDownloadState(downloadId)
    if (downloadState === "complete" || downloadState === "interrupted") {
        return true
    }
    else return false
}

function getDownloadState(downloadId) {
    return new Promise(resolve => {
        chrome.downloads.search({id: downloadId},
            (downloadItemsArray) => {
                if (downloadItemsArray.length !== 1) throw new Error("Got the wrong number of items for this download id (should be unique)")
        
                resolve(downloadItemsArray[0].state)
            })
    })
    
}