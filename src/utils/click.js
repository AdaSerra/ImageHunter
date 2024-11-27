//onclick functions
import {searchEngines} from './storage.js'

function saveReport(obj,filename){
    const jsonStr = JSON.stringify(obj, null, 2); 
    const blob = new Blob([jsonStr], { type: 'application/json' }); 
    const url = URL.createObjectURL(blob);

    saveFile(url,filename)

    URL.revokeObjectURL(url)
}

function saveFile(url,filename) {         
    
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = filename
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a); 
  }

  async function copyImg(url,functionMessage) {
  
    const base64String = url.replace(/^data:.+;base64,/, ''); 
    const img = new window.Image(); 
    img.src = url.startsWith('http')? url: `data:image/png;base64,${base64String}`; 
    img.crossOrigin = 'Anonymous'; 
    img.onload = () => { 
      
      const canvas = document.createElement('canvas'); 
      const ctx = canvas.getContext('2d'); 
      canvas.width = img.naturalWidth; 
      canvas.height = img.naturalHeight; 
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => { 
        const clipboardItem = new ClipboardItem({ 'image/png': blob }); 
        await navigator.clipboard.write([clipboardItem])
        .then(() => functionMessage.success("Image copied!"))
        .catch((err) => {console.error("Error: ", err);functionMessage.error("Error in copying image")}); 
          
        
       })}; 
  
      img.onerror = (error) => { console.error('Error:', error); functionMessage.error("Error in copying image") };
  }

async function searchLink(url,engine,functionMessage){
    let urlImage=url

     if (urlImage.startsWith("http")) {
        functionMessage.success("Valid url");
        if (engine =="IMGOPS") {urlImage=urlImage.replace(/^https?:\/\//, '');
          
        }
        const searchUrl = `${searchEngines[engine][0]}${encodeURIComponent(urlImage)}${searchEngines[engine][1]}`;
        window.open(searchUrl, '_blank','noopener');
     } else {
        functionMessage.error("Not valid url");
  
     } }


async function copyText(str,messageFunction) {
        try {
          const clipboardItem = new ClipboardItem({ 'text/plain': new Blob([str], { type: 'text/plain' }) });
          await navigator.clipboard.write([clipboardItem]);
          messageFunction.success("URL copied!");
        } catch (err) {
          console.error("Error: ", err);
          messageFunction.error("Error in copying URL");
        }
    }
      
function sendMessage(message) {
        //
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          browser.tabs.sendMessage(tabs[0].id, { command: message });
        });
      
      
}

export {saveReport,saveFile,copyImg,searchLink,copyText,sendMessage}