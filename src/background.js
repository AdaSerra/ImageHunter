import { regex } from './utils/generic.js'

//listening imgs requesting

let imgs = []
let imgcomplete = []

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.type === "image" || regex.end.test(details.url)) {
      imgs.push({ requestId: details.requestId, url: details.url, time: details.timeStamp })

    }
  },
  { urls: ["<all_urls>"] },
  []
);



browser.webRequest.onHeadersReceived.addListener(
  function (details) {
    let findreq = imgs.find(obj => obj.requestId === details.requestId)
    if (findreq && details.type === "image" || regex.end.test(details.url)) {

      let contentLength = details.responseHeaders.find(header => header.name.toLowerCase() === "content-length");
      contentLength ? findreq.contentLength = Number(contentLength.value) : "";

      let date = details.responseHeaders.find(header => header.name.toLowerCase() === "date");
      date ? findreq.date = date.value : "";

      let lastModif = details.responseHeaders.find(header => header.name.toLowerCase() === "last-modified");
      lastModif ? findreq.lastModif = lastModif.value : "";

      let type = details.responseHeaders.find(header => header.name.toLowerCase() === "content-type");
      type ? findreq.type = type.value : "";

      let ranges = details.responseHeaders.find(header => header.name.toLowerCase() === "accept-ranges");
      ranges ? findreq.ranges = ranges.value : "";

      findreq.time = details.timeStamp - findreq.time < 1000_000?  details.timeStamp - findreq.time : "no data";

      imgcomplete.push(findreq)
      let dati = [...new Map(imgcomplete.map(item => [item.url, item])).values()]


      chrome.storage.local.set({ backreq: JSON.stringify(dati) })

    }

  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);










