//function for handling storage

const defaultOption= {
    extensions:["ALL","avif","bmp", "gif", "ico", "jpg", "png", "svg", "tiff", "webp"],
    width:[0,2500],
    height:[0,2500],
    size:[0,1024*1024],
    engine:"GOOGLE LENS"
   
  };

const searchEngines = {"GOOGLE": ["https://www.google.com/searchbyimage?sbisrc=4chanx&image_url=", "&safe=off"],
  "GOOGLE LENS": ["https://lens.google.com/uploadbyurl?url=", ""],
   "YANDEX": ["https://yandex.ru/images/touch/search?rpt=imageview&url=", ""],
   "BING": ["https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIVSP&sbisrc=UrlPaste&q=imgurl:", ""],
   "TINEYE": ["https://www.tineye.com/search/?url=", ""],
   "IQDB": ["https://iqdb.org/?url=", ""],
   "SAUCEANO": ["https://saucenao.com/search.php?db=999&url=", ""],
   "IMGOPS": ["https://imgops.com/", ""],
   
   }


async function getDataFromLocalStorage(key,nameFunction) {
    try {
      const result = await browser.storage.local.get([key]);
       result? nameFunction(JSON.parse(result[key])) : null;         
        }
    
    catch (error) {
      console.error('Error local storage:', error);
    }
  }

async function getOption() {

  try { 
   const result = await browser.storage.sync.get('option'); 

   return result? JSON.parse(result.option) : defaultOption
  }
   

   catch (error) { 
     console.error('Error sync storage', error); 
     return defaultOption; } };


function wrapHandleStorage(nameArea,key,nameFunction){
  return function(changes,area){
    if(area===nameArea) {
      if(changes[key]) {
        const newValue = JSON.parse(changes[key].newValue);
        nameFunction(newValue)
      }
    }

  }
}



    
export  {defaultOption,searchEngines,getDataFromLocalStorage,getOption,wrapHandleStorage}