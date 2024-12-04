//onclick functions that not change state of component
import {searchEngines} from './storage.js'
import { svgToBase64,createCanvas } from './generic.js';

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
    
    const img = new Image()
  


    if (url.startsWith('http')) 
      { img.src = url;
        
       } 



    else if (url.startsWith('data:image/svg+xml,<svg')) //case url = data:image/svg+xml,<svg....</svg>
      
      { 
        const svgString=base64String.slice(19);
              
        img.src = svgToBase64(svgString) //'data:image/svg+xml;base64,' + btoa(svgData);
        
      }
    else { img.src = `data:image/png;base64,${base64String}`;
 
     }
    
    img.crossOrigin = 'Anonymous'; 
    img.onload = () => { 
   
      const canvas =createCanvas(img)
      canvas.toBlob(async (blob) => { 
        let clipboardItem
        clipboardItem = new ClipboardItem({ 'image/png': blob }); 
        
        await navigator.clipboard.write([clipboardItem])
        .then(() => functionMessage.success("Image copied!"))
        .catch((err) => {console.error("Error: ", err);}); 
          
        
       }, 'image/png')}; 
       img.src=img.src
      img.onerror = (error) => { console.error('Error:', error);functionMessage.error("Format not supported")  };
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