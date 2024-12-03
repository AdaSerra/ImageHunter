import { regex,svgToBase64,base64ToBlob,createCanvasAndGenerateBlob } from "./utils/generic";

let performanceMetrics = [];


recordPerfomanceTiming();

// perfomance

function recordPerfomanceTiming() {

  const resourceEntries = performance.getEntriesByType("resource");

  const resourceTimings = resourceEntries.filter(entry => entry instanceof PerformanceResourceTiming);
  const resourceTimingimg = resourceTimings.filter(entry => entry.initiatorType === 'img' || entry.contentType?.startsWith("image") || regex['end'].test(entry.name))

  resourceTimingimg.forEach(resource => {

    performanceMetrics.push(resource.toJSON());

  });

}

// find name/url in permormanceobject

function getMetricsByName(name) {

  const result = performanceMetrics.find(metric => metric.name == name)
  if (result) {
    //console.log("TROVATO",result)
    return result
  }
  else { return "" }
}




// find all images

async function findImage() {
  const pageInfo = {
    time: Date.now(),
    title: document.title,
    url: window.location.href,
    lastM: document.lastModified,

  }

  const htmlContent = document.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const metaDesc = document.querySelector('meta[name="description"]');

  pageInfo.size = blob.size;
  pageInfo.desc = metaDesc ? metaDesc.getAttribute('content') : '';


  //background images

  const backgroundImages = [];
  const allElements = document.querySelectorAll('*');

  allElements.forEach(async (element) => {
    const backgroundImage = window.getComputedStyle(element).backgroundImage;
    
    if (backgroundImage && backgroundImage.includes("http") ) {
     
      let metrics = getMetricsByName(backgroundImage.slice(5, -2))
      let data = await createCanvasAndGenerateBlob(backgroundImage.slice(5, -2))
      backgroundImages.push({
        url: backgroundImage.slice(5, -2),

        alt: element.alt || "",
        origW: element.naturalWidth || data[4],
        origH: element.naturalHeight || data[5],
        txt: element.textContent,

        type: metrics.contentType || data[0],
        pfDuration: metrics.duration,

        pfSize: metrics.encodedBodySize,

        blobSize: data[1]
      })

    }
  });


  //source picture
  const pictureImages = [];
  const pictureElements = document.querySelectorAll('picture source');

  pictureElements.forEach(element => {
    
    const srcset = element.getAttribute('srcset');
    if (srcset) {

      const sources = srcset.split(',');
      const urls = sources.map(source => source.trim().split(' ')[0]);

      urls.forEach(async (url) => {
        let metrics = getMetricsByName(url);
        let data = await createCanvasAndGenerateBlob(url)

        pictureImages.push({
          url: url,
          alt: element.alt ? element.alt : "",
          origW: data[4],
          origH: data[5],
          txt: element.textContent,
          type: element.type || metrics.contentType || data[0],
          pfDuration: metrics.duration,
          pfSize: metrics.encodedBodySize,
          blobSize: data[1]

        })

      })


    }
  });

  //simply tag img

  const imgs = document.getElementsByTagName('img');

  let found = []

  for (var i = 0; i < imgs.length; i++) {

    let data = await createCanvasAndGenerateBlob(imgs[i].src)
   
    let metrics = getMetricsByName(imgs[i].src)
    
    found.push({

      url: imgs[i].src || imgs[i].href || "",
      alt: imgs[i].alt || "",
      origW: imgs[i].naturalWidth || data[2] || 0,
      origH: imgs[i].naturalHeight || data[3] || 0,
      txt: imgs[i].textContent,
      type: metrics.contentType || data[0],
      pfDuration: metrics.duration,
      //trasnferSize:metrics.transferSize,
      pfSize: metrics.encodedBodySize,
      blobSize: data[1]
    })
    
  }

  //svg
  const svg = document.getElementsByTagName('svg')
  let svgImages=[]
  for (let i = 0; i<svg.length; i++){
   
    const svgString=svgToBase64(svg[i].outerHTML);
    const blob = base64ToBlob(svgString.slice(26), 'image/svg+xml'); 
    //const data = await createCanvasAndGenerateBlob(svg[i].outerHTML)  ;
    
    
    svgImages.push({
      url:"data:image/svg+xml,"+svg[i].outerHTML,
      alt:"svg",
      origW:svg[i].width.baseVal.value,
      origH:svg[i].height.baseVal.value,
      type:"svg",
      pfDuration:"",
      pfSize:"",
      txt:"",
      blobSize:blob.size,

    })
    
  }

  //concat arrays
  let totalfound = found.concat(backgroundImages).concat(pictureImages).concat(svgImages);
  totalfound = totalfound.filter(obj => obj.url)

  pageInfo.imgs = totalfound
  pageInfo.time = Date.now() - pageInfo.time

  chrome.storage.local.set({ imgs: JSON.stringify(pageInfo) })


}


//messagge listener

chrome.runtime.onMessage.addListener((message) => {
  if (message.command === 'start') { findImage() }
})
