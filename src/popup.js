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
import './css/popup.css'
message.config({maxCount:1})

//main component

function App() {

  //state for storage fro, background, option and content scripts
  const [back,setBack] =useState(null)
  const [option, setOption] =useState(null)
  const [content,setContent] = useState(null)

  //state for list,showing result, checking all imgs and loading button
  const [list,setList] =useState(null);
  const [toggle,setToggle] = useState(false)
  const [show,setShow] = useState(false)
  const [loading, setLoading] = useState(false);
 
  const [messageApi, contextHolder] = message.useMessage();


  //put image in selected and toggle all images

 
  const changeChecked = (index) => {
        setList((prevList) => {
          const newList = {
            ...prevList,
            filtred: prevList.filtred.map((item, i) => 
              index === i ? { ...item, checked: !item.checked } : item
            )
          };
      
          newList.filtred[index].checked ? messageApi.info("Image selected!") : message.info("Image unselected");
      
          chrome.storage.local.set({ list: JSON.stringify(newList) });
      
          return newList;
        });
      };
      
    const checkAll = () => {
        setList((prevList) => {
          const newList = {
            ...prevList,
            filtred:list.filtred.map(item=> ({...item, checked:!toggle }))
          };
      
          setToggle(!toggle);
          toggle? messageApi.info("All images unselected!") : message.info("All images selected!")
      
          chrome.storage.local.set({ list: JSON.stringify(newList) });
      
          return newList;
        });
      };



  //useEffect initial state and handling change
  
  useEffect(() => { 
    getDataFromLocalStorage('content',setContent,content)

    browser.storage.onChanged.addListener(wrapHandleStorage('local','content',setContent));
    
    return () => {
      browser.storage.onChanged.removeListener(wrapHandleStorage('local','content',setContent))
    }
  
  },   
    []);
  
  useEffect(() => { 
    getDataFromLocalStorage('back',setBack,back)
    
    browser.storage.onChanged.addListener(wrapHandleStorage('local','back',setBack));
    return () => {
      browser.storage.onChanged.removeListener(wrapHandleStorage('local','back',setBack))
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
    getDataFromLocalStorage('list',setList,list);
   
  },[])
  
  useEffect(()=>{
    getDataFromLocalStorage('back',setBack,back);
    
  if (!list && content && back && option) {
    
    let imgsUnique = [...new Map(content.imgs.map(item => [item.url, item])).values()]
    
    let dati = imgsUnique.map(item => {
      
      let result =checkBackground(item.url,back);
      
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
    
    if (option.width[0] == 0 && option.width[1] ==2500) {}
    else if (option.width[1] == 2500) {filterDati=filterDati.filter(obj => option.width[0] <= obj.origW)}
    else {filterDati=filterDati.filter(obj => option.width[0] <= obj.origW && obj.origW <=option.width[1])}
    
    if (option.height[0] == 0 && option.height[1] ==2500) {}
    else if (option.height[1] == 2500) {filterDati=filterDati.filter(obj => option.height[0] <= obj.origW)}
    else {filterDati=filterDati.filter(obj => option.height[0] <= obj.origW && obj.origW <=option.height[1])}
    
      
    if(option.size[0] == 0 && (option.size[1] == 1024 || option.size[1] ==1024*1024 || option.size[1] ==1024*1024*1024))  
    {filterDati=filterDati}
    
    else if (option.size[1] == 1024 || option.size[1] ==1024*1024 || option.size[1] ==1024*1024*1024)
    {filterDati=filterDati.filter(obj=>{
      const pfIsNumber = typeof obj.pfSize =='number' && option.size[0] < obj.pfSize; 
      const bcIsNumber = typeof obj.backSize == 'number'  && option.size[0] < obj.backSize; 
      const blIsNumber = typeof obj.blobSize == 'number'  && option.size[0] < obj.blobSize; 
      return pfIsNumber || bcIsNumber || blIsNumber})}
    else 
    {filterDati=filterDati.filter(obj => {
      const pfIsNumber = typeof obj.pfSize =='number' && option.size[0] < obj.pfSize && obj.pfSize<option.size[1] ; 
      const bcIsNumber = typeof obj.backSize == 'number'  && option.size[0] < obj.backSize && obj.backSize < option.size[1]; 
      const blIsNumber = typeof obj.blobSize == 'number'  && option.size[0] < obj.blobSize && obj.blobSize < option.size[1]; 
      return pfIsNumber || bcIsNumber || blIsNumber})}

  
  
    setList({
      pageInfo:{
        title:content.title,
        url:content.url,
        desc:content.desc,
        time:content.time,
        size:content.size,
        lastM:content.lastM

      },
      unfiltred:dati,
      filtred:filterDati,
     });
      
      setLoading(false)
      chrome.storage.local.set({ list: JSON.stringify(list) })
   
    }
  } ,[content,option])


  useEffect(()=>{
    if (list) {setShow(true)}
  },[list])
   
  useEffect(()=>{
    list?.filtred.every(item =>item.checked ===true) ? setToggle(true) : setToggle(false)
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
          <Summary total={content?.imgs.length} unique={list?.unfiltred?.length}/>
          <div className="buttonBox">
            <div className='left'> <Button type="primary"  onClick={()=>{setLoading(true);sendMessage('start');setList(null)}} block={true} loading={loading}danger>{loading? "Loading":"Analyze"}</Button></div>
            <div className='right'> <Button type="primary"   block={true}disabled={list?false:true } onClick={list?()=>setShow(prevValue=>!prevValue):null}>{show? "Hide" : "Show"} </Button></div>
          </div>

       {show && <>
        <SummaryDesc sizeTotal={sizeTotal|| {sum:0,count:0} } avgLoading={avgLoading|| {sum:0,count:0}} pageInfo={list?.pageInfo || {title:"",url:"",size:0,time:0} }/>
        <div className="buttonBox">
        <ButtonBox toggle={toggle} checkAll={checkAll} list={list?.filtred || []} pageInfo={list?.pageInfo || {title:"",url:"",size:0,time:0}}/></div> </> }
        </div>
        {show  && list?.filtred &&
        <div id="list"><List dati={list?.filtred} engine={option?.engine} updateChecked={changeChecked} messageApi={messageApi}/></div>}
        {show &&
        <FilterStats len={list?.filtred?.length ||0 } sizeFilter={sizeTotalFilter || {sum:0,count:0}} sizeChecked={sizeTotalChecked|| {sum:0,count:0}}/>}
       
      </ConfigProvider>
    )



}

 
  const root = ReactDOM.createRoot(document.getElementById("root"));
 root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
 );



