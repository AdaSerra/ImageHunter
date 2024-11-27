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

export {regex,convertBytes,shortExt,checkBackground,checkType,correctUrl,shortUrl}
