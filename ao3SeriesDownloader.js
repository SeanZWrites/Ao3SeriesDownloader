const parser = new DOMParser()

async function downloadSeries(e, storyFormat='HTML') {
    e.preventDefault()
    let seriesName = document.querySelector("h2").textContent.trim()
    console.log(`Downloading series ${seriesName}`)
    
    // let the download link text serve as an indicator
    let downloadSeriesLink = document.getElementById("downloadSeriesLink")
    downloadSeriesLink.click() // effectively collapses the download sub-menu

    downloadSeriesLink.text = "Downloading..."

    // find all stories on this page
    storyLinks = findAllStoryLinks()
    console.log(`Found ${storyLinks.length} stories`)

    for (let index = 0; index < storyLinks.length; index++) {
        console.log(`Downloading story ${index+1} of ${storyLinks.length}`)

        downloadSeriesLink.text = `Downloading (${index+1}/${storyLinks.length})`
        let downloadResult = await downloadStory(storyLinks[index], storyFormat)

        if (!downloadResult) {
            alert("Download failed, please check the console log and see if there were any errors")
            break;
        };
    }

    downloadSeriesLink.text = "Download Series"
   
}

function findAllStoryLinks() {
    let storyLinks = Array.from(document.querySelectorAll("li.work.blurb h4.heading a:first-child"))

    return storyLinks.map((item) => new URL(item.href, window.location.origin))
}

async function downloadStory(storyUrl, storyFormat = 'HTML'){
    let resp = await fetch(storyUrl)
    if (!resp.ok) throw new Error(`Failed to fetch story with url: ${storyUrl}`)

    let body = await resp.text()
    let doc = parser.parseFromString(body, 'text/html')

    let downloadLinks = Array.from(doc.querySelectorAll("li.download > ul a"))
    let downloadLinksInFormat = downloadLinks.filter(x => x.text === storyFormat)

    if (downloadLinksInFormat.length < 1) throw new Error(`Failed to find download link for format ${storyFormat}`)

    let downloadLink = downloadLinksInFormat[0]

    let storyDownloadURL = new URL(downloadLink.href, window.location.origin)
    let storyTitle = doc.querySelector("h2.title.heading").textContent.trim()
    let storyFilename = decodeURIComponent(getFilenameFromURL(storyDownloadURL)) //chrome auto-decodes this, firefox will not

    // we don't want to hammer AO3 with multiple downloads at once. So instead we use callbacks
    // and the messaging system to wait for the download to complete.
    console.log(`Downloading story: ${storyTitle}`)
    let downloadCompletionPromise = new Promise(resolve => {
        chrome.runtime.sendMessage({
            url: storyDownloadURL.href, //firefox does not allow you to pass the URL object
            filename: storyFilename
        },
        (response) => resolve(response)
        )
    })

    let downloadResult = await downloadCompletionPromise
    if (downloadResult === "complete") {
        console.log("download completed successfully")
        return true
    }
    else {
        console.log("something went wrong")
        return false
    }

}

function getFilenameFromURL(url) {
    let pathname = url.pathname
    let pathParts = pathname.split('/')
    return pathParts[pathParts.length - 1]
}

function addDownloadButton() {
    // create the download button on the series page
    let navList = document.querySelector("#main ul.navigation.actions")
    let downloadSeriesButton = document.createElement("li")
    downloadSeriesButton.setAttribute("class", "download")

    // create the hidden sub-menu that prompts what type of format to download
    let downloadTypeMenu = document.createElement('ul')
    downloadTypeMenu.setAttribute("class", "expandable secondary hidden")

    // add the link element to the download button, which toggles the 
    // hidden menu. 
    let downloadSeriesLink = document.createElement("a")
    downloadSeriesLink.setAttribute("href", "#")
    downloadSeriesLink.id = "downloadSeriesLink"
    downloadSeriesLink.setAttribute("class", "collapsed")
    downloadSeriesLink.text = "Download Series"
    downloadSeriesLink.onclick = (e) => {
        e.preventDefault();
        downloadTypeMenu.classList.toggle("hidden")

        downloadSeriesLink.classList.toggle("collapsed")
        downloadSeriesLink.classList.toggle("expanded")
    }

    // build the elements of the sub-menu
    let downloadTypes = ['AZW3', 'EPUB', 'MOBI', 'PDF', 'HTML']
    downloadTypes.forEach(item => {
        let listItem = document.createElement("li")
        listItem.style.padding = "5px"

        let link = document.createElement('a')
        link.setAttribute('href', '#')
        link.onclick = (event) => downloadSeries(event, item)
        link.text = item
        
        listItem.append(link)
        downloadTypeMenu.append(listItem)
    })

    downloadSeriesButton.append(downloadSeriesLink)
    downloadSeriesButton.append(downloadTypeMenu)
    navList.append(downloadSeriesButton)
}

let downloadLink = addDownloadButton()
