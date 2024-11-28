import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import  {Button, ConfigProvider,message} from 'antd'
import {getOption,getDataFromLocalStorage,wrapHandleStorage} from './utils/storage.js'
import {regex,shortExt,checkBackground,checkType,correctUrl} from './utils/generic.js'
import {sendMessage} from './utils/click'
import Summary from './components/Summary.js'
import SummaryDesc from './components/SummaryDesc.js'
import List from './components/List.js'
import ButtonBox from './components/ButtonBox.js'
import FilterStats from './components/FilterStats.js'
 
message.config({maxCount:1})

//main component

function App() {

  //state for images from content.js, background, option 
  const [backreq,setBackreq] =useState(null)
  const [option, setOption] =useState(null)
  const [imgs,setImgs] = useState(null)

  //state for list,showing result, checking all imgs and loading button
  const [list,setList] =useState(null);
  const [toggle,setToggle] = useState(false)
  const [show,setShow] = useState(false)
  const [loading, setLoading] = useState(false);
 
  const [messageApi, contextHolder] = message.useMessage();

  const changeChecked =(url)=>{
    
    setList({...list,
      filtred:list.filtred.map(item=>item.url==url ? {...item, checked:!item.checked} : item)});
      list.filtred.some(item => item.url === url && item.checked) ? messageApi.info("Image unselected!") : message.info("Image selected");
  }

  const checkAll = () =>{
    
    setList({...list,
      filtred:list.filtred.map(item=> ({...item, checked:!toggle }))
    });
   
    setToggle(!toggle);
    toggle? messageApi.info("All images unselected!") : message.info("All images selected!")
   
  }
  
 

  //useEffect initial state and handling change

  
  useEffect(() => { 
    getDataFromLocalStorage('imgs',setImgs,imgs)

    browser.storage.onChanged.addListener(wrapHandleStorage('local','imgs',setImgs));
    
    return () => {
      browser.storage.onChanged.removeListener(wrapHandleStorage('local','imgs',setImgs))
    }
  
  },   
    []);
  
  useEffect(() => { 
    getDataFromLocalStorage('backreq',setBackreq,backreq)
    
    browser.storage.onChanged.addListener(wrapHandleStorage('local','backreq',setBackreq));
    return () => {
      browser.storage.onChanged.removeListener(wrapHandleStorage('local','backreq',setBackreq))
    }
   }, 
      []);

  useEffect(()=>{
    async function fetchData() {
      const initialOption = await getOption()
      setOption(initialOption)
    };
    fetchData()
   
    browser.storage.onChanged.addListener(wrapHandleStorage('sync','option',setOption));
    return() => browser.storage.onChanged.removeListener(wrapHandleStorage('sync','option',setOption))
  },[])

  //managing array imgs founded, background request info added end data filtred from options preferences 
  
  useEffect(()=>{
    getDataFromLocalStorage('backreq',setBackreq,backreq);
    

  if (imgs && backreq && option) {
    
    
    let imgsUnique = [...new Map(imgs.imgs.map(item => [item.url, item])).values()]
    
    let dati = imgsUnique.map(item => {
      
      let result =checkBackground(item.url,backreq);
      

      return {
        ...item,
        url: regex['end'].test(item.url)? item.url : correctUrl(item.url) ,
        type: shortExt(checkType(item.url)) || shortExt(checkType(correctUrl(item.url)))||shortExt(item.type) || shortExt(result[3]) || "unknown",
        //duration:item.duration !=0? item.duration: result[1],
        backDuration:result[1],
        lastModif:result[2],
        date:result[4],
        //size:item.bodySize !=0? item.bodySize:result[0],
        backSize:result[0],
        checked:false    
        
      }
     
    })

    //filtering array from options preferences
    
    dati = dati.filter(obj=>regex['in'].test(obj.type)) //remove not image type
    
    
    let filterDati= option.extensions[0] ==="ALL" ? dati : dati.filter(obj=>
      option.extensions.some(str=>obj.type.includes(str)))
    
    
    filterDati=option.width == 2500 ? filterDati: filterDati.filter(obj => obj.origW <= option.width) 
    
    filterDati= option.height ==2500 ? filterDati: filterDati.filter(obj => obj.origH <= option.height)
  

    filterDati = option.size == 1024 || option.size ==1024*1024 || option.size ==1024*1024*1024 ? filterDati :
    filterDati.filter(obj => {const pfIsNumber = typeof obj.pfSize =='number' && obj.pfSize<option.size; const bcIsNumber = typeof obj.backSize == 'number' && obj.backSize < option.size; const blIsNumber = typeof obj.blobSize == 'number' && obj.blobSize < option.size; return pfIsNumber || bcIsNumber || blIsNumber})
  

  // some stats

  let sizeTotal= dati.reduce((accumulutar,currentValue)=>{
    if(Number(currentValue.backSize)|| Number(currentValue.pfSize)) {
      accumulutar.sum= accumulutar.sum + Number(currentValue.backSize || currentValue.pfSize)
      accumulutar.count +=1
    }
    
    return accumulutar},{sum:0,count:0})

    let sizeTotalFilter= filterDati?.reduce((accumulutar,currentValue)=>{
      if(Number(currentValue.backSize)|| Number(currentValue.pfSize)) {
        accumulutar.sum= accumulutar.sum + Number(currentValue.backSize || currentValue.pfSize)
        accumulutar.count +=1
      }
      
      return accumulutar},{sum:0,count:0})
  


    let avgLoading= dati.reduce((accumulutar,currentValue)=>{
      if(Number(currentValue.backDuration) && currentValue.backDuration < 1000_000) {
        accumulutar.sum+=currentValue.backDuration;
        accumulutar.count +=1
      }
      
      return accumulutar},{sum:0,count:0})

   
    setList({
      pageInfo:{
        title:imgs.title,
        url:imgs.url,
        desc:imgs.desc,
        time:imgs.time,
        size:imgs.size,
        lastM:imgs.lastM

      },
      unfiltred:dati,
      filtred:filterDati,
      stats:{
        imgTotal:imgs.imgs.length,
        imgUnique:dati.length,
        imgFilter:filterDati.length,
        sizeTotal:sizeTotal,
        sizeTotalFilter:sizeTotalFilter,
        avgLoading:avgLoading
    }});
      
      setLoading(false)
      
   
    }
  } ,[imgs,option])


  useEffect(()=>{
    if (list) {setShow(true)}
  },[list])


   

  //some stats
    

    let sizeTotal= list?.unfiltred.reduce((accumulutar,currentValue)=>{
    if(Number(currentValue.backSize)|| Number(currentValue.pfSize)) {
      accumulutar.sum= accumulutar.sum + Number(currentValue.backSize || currentValue.pfSize)
      accumulutar.count +=1
    }
    
    return accumulutar},{sum:0,count:0})

    let sizeTotalFilter= list?.filtred?.reduce((accumulutar,currentValue)=>{
      if(Number(currentValue.backSize)|| Number(currentValue.pfSize)) {
        accumulutar.sum= accumulutar.sum + Number(currentValue.backSize || currentValue.pfSize)
        accumulutar.count +=1
      }
      
      return accumulutar},{sum:0,count:0})
  


    let avgLoading= list?.unfiltred.reduce((accumulutar,currentValue)=>{
      if(Number(currentValue.backDuration) && currentValue.backDuration < 1000_000) {
        accumulutar.sum+=currentValue.backDuration;
        accumulutar.count +=1
      }
      
      return accumulutar},{sum:0,count:0})
  
     
    let sizeTotalChecked = list?.filtred?.reduce((acc, item) => {
      if (item.checked) {
        acc.size += Number(item.backSize) || Number(item.pfSize) || Number(item.blobSize) || 0;
       
        acc.count++;
      }
      return acc;
    }, { size: 0, count: 0 });
    
       
    //final rendering


    return (
      <ConfigProvider 
      theme={{
        token: {
          colorBgMask:"black",
         colorPrimaryHover:"black",
         colorPrimary:"rgb(0,83,222)"
    
        },
        components:{
          Collapse: {headerPadding:"0px",contentPadding:"0px"},
          Button:{
            defaultActiveColor:"black"
          }
        }
        
      }}>
      {contextHolder}
     
        <div className="summary">
          <Summary total={list?.stats?.imgTotal} unique={list?.stats?.imgUnique}/>
          <div className="buttonBox">
            <div className='left'> <Button type="primary"  onClick={()=>{setLoading(true);sendMessage('start')}} block={true} loading={loading}danger>{loading? "Loading":"Analyze"}</Button></div>
            <div className='right'> <Button type="primary"   block={true}disabled={list?false:true } onClick={list?()=>setShow(prevValue=>!prevValue):null}>{show? "Hide" : "Show"} </Button></div>
          </div>

       {show && <>
        <SummaryDesc sizeTotal={list?.stats.sizeTotal|| {sum:0,count:0} } avgLoading={list?.stats.avgLoading|| {sum:0,count:0}} pageInfo={list?.pageInfo || {title:"",url:"",size:0,time:0} }/>
        <div className="buttonBox">
        <ButtonBox toggle={toggle} checkAll={checkAll} list={list?.filtred || []} pageInfo={list?.pageInfo || {title:"",url:"",size:0,time:0}}/></div> </> }
        </div>
        {show  && list?.filtred &&
        <div id="list"><List dati={list?.filtred} engine={option.engine} updateChecked={changeChecked} messageApi={messageApi}/></div>}
        {show &&
        <FilterStats len={list.stats.imgFilter ||0 } sizeFilter={list.stats.sizeTotalFilter || {sum:0,count:0}} sizeChecked={sizeTotalChecked}/>}
       
      </ConfigProvider>
    )



}

 
  const root = ReactDOM.createRoot(document.getElementById("root"));
 root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
 );



