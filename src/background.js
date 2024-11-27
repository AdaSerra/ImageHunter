import {regex} from './utils/generic'

//ascolto richieste immagini

let imgs = []
let imgcomplete = []

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (details.type === "image" || regex.end.test(details.url)) {
        imgs.push({requestId:details.requestId,url:details.url,time:details.timeStamp})
        //console.log("Richiesta immagine intercettata:", details);
        //console.log(imgs[imgs.length-1])
      }
    },
    { urls: ["<all_urls>"] },
    []
  );


  


browser.webRequest.onHeadersReceived.addListener(
    function(details) {
        let findreq=imgs.find(obj=>obj.requestId===details.requestId)
        if (findreq && details.type === "image" || regex.end.test(details.url)) {

        let contentLength = details.responseHeaders.find(header => header.name.toLowerCase() === "content-length");
        contentLength ? findreq.contentLength = Number(contentLength.value) : "";
        
        let date= details.responseHeaders.find(header => header.name.toLowerCase() === "date");
        date ? findreq.date=date.value:"";

        let lastModif = details.responseHeaders.find(header => header.name.toLowerCase() === "last-modified");
        lastModif ? findreq.lastModif=lastModif.value:"";
        
        let type=details.responseHeaders.find(header => header.name.toLowerCase() === "content-type");
        type ? findreq.type=type.value : "";

        let ranges =details.responseHeaders.find(header => header.name.toLowerCase() === "accept-ranges");
        ranges ? findreq.ranges = ranges.value : "" ;

        findreq.time=(details.timeStamp >0 && findreq.time >0 ) ? details.timeStamp-findreq.time : 0;

        imgcomplete.push(findreq)
        let dati = [...new Map(imgcomplete.map(item => [item.url, item])).values()]


        chrome.storage.local.set({backreq:JSON.stringify(dati)})
 
       //console.log(imgcomplete[imgcomplete.length-1],imgcomplete.length, imgs.length)
       //console.log("Headers risposta ricevuti ", details)
        }

    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  );
  
  

//cache
//message preview


// background.js





  
