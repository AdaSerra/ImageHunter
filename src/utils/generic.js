// generic functions

const regex ={
  end:/\.(avif|bmp|gif|ico|jpe?g|png|svg|tiff|webp)$/i,
  indot:/\.(avif|bmp|gif|ico|jpe?g|png|svg|tiff|webp)/i,
  in:/(avif|bmp|gif|ico|jpe?g|png|svg|tiff|webp)/i
}


function convertBytes(bytes) {
  if (Number(bytes)) {
      if (bytes > 1024 * 1024) {
    const MB = bytes / (1024 * 1024)
    return MB.toFixed(2) + " Mb"
  }
  else if (bytes > 1024) {
    const KB = bytes / (1024)
    return KB.toFixed(2) + " Kb"
  }
  else {
    return bytes + " Bytes"
  }
  }
else {
  return "no data"
}
}

function shortExt (str) {
  if (typeof str === 'string') {
    str=str.replace("image/","").replace(".","");
    if (str==="jpeg") {return "jpg"}
    if (str==="svg+xml") {return "svg"}
    return str
  }
  else {return null}
}

function checkBackground(url,array) {
  let result
  if (array) { result = array.find(req => req.url == url) 
      if (result) {
     
    return [result.contentLength, result.time, result.lastModif, result.type,result.date]

  }
  else {
    return ["no data", null, "no data", null,null]
  }
  }
  else {
    
    return ["no data", null, "no data", null,null]
  }
}

function checkType(str) {
  
  const match = str.match(regex.end);
  if (match) {
   
    return match[0];
    
  }
  return false;
}

function correctUrl(str) { 

const match = str.match(regex.indot); 
if (match) { return str.substring(0, match.index + match[0].length); } 
return str; }


function shortUrl(url) {
  if(url) { 
    if (url.length > 38) {
    const p1 = url.slice(0,18);
    const p2= url.slice(-15)
    return p1+'...'+p2
  } else { return url}
} 
  else { return ""}
}


function fileName(url) { 
  if (url.startsWith('http'))
   {return url.substring(url.lastIndexOf('/') + 1); }
  else {return "base64 string"}
}

function svgToBase64(str) {
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'image/svg+xml');
  const svgElement = doc.documentElement;
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const base64Data = btoa(svgData);
  return `data:image/svg+xml;base64,${base64Data}`
  
}

function base64ToBlob(base64, contentType = '', sliceSize = 512) { 
  const byteCharacters = atob(base64); 
  const byteArrays = []; 
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) { 
    const slice = byteCharacters.slice(offset, offset + sliceSize); 
    const byteNumbers = new Array(slice.length); 
    for (let i = 0; i < slice.length; i++) { 
      byteNumbers[i] = slice.charCodeAt(i); } 
      const byteArray = new Uint8Array(byteNumbers); 
      byteArrays.push(byteArray); } 
    return new Blob(byteArrays, { type: contentType }); }

function createCanvas(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img?.width || img?.width?.baseVal?.value 
  canvas.height = img?.height || img?.height?.baseVal?.value 
  ctx.drawImage(img, 0, 0);
  return canvas
}


async function createCanvasAndGenerateBlob(imageUrl) {

  let result
  try {

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.src = imageUrl;
 
    await new Promise((resolve, reject) => {
      
      img.onload = resolve;
      
      img.onerror = reject;
      
    });

    const canvas= createCanvas(img)

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          
          resolve(blob);
        } else {
          reject(new Error('Error'));
        }
      });
    });

    const blobType = blob.type;
    const blobSize = blob.size;

    result = [blobType, blobSize, canvas.width, canvas.height, img.naturalWidth, img.naturalHeight];
  } catch (err) {
    
    console.error('Error in blob generating:', err);
    result = ['', ''];
  }

  return result
}

export {regex,convertBytes,shortExt,checkBackground,checkType,correctUrl,shortUrl,fileName,svgToBase64,base64ToBlob,createCanvas,createCanvasAndGenerateBlob}
