import React, {useState} from 'react'
import {Image,Button,Tooltip,Popover,Skeleton} from 'antd'
import {CopyOutlined,SnippetsOutlined,DownloadOutlined,CheckCircleFilled,CheckCircleOutlined,SearchOutlined,QuestionCircleOutlined} from '@ant-design/icons'
import {copyImg,copyText,saveFile,searchLink} from '../utils/click.js'
import {shortUrl,fileName} from '../utils/generic.js'
import ExifMetadata from './ExifMetadata.js'
import ImgDesc from './ImgDesc.js'

export default function List(props) {

    const {dati,engine,updateChecked,messageApi} = props
 
    const [visible, setVisible] = useState(false); 
    const [currentImage, setCurrentImage] = useState(null);
    const [err,setErr] = useState([])
   
    const currentList = dati?.map(
      item =>({src:item.url,
      alt:item.text? item.text : item.alt || "",
      checked:item.checked}) )
  
    const handlePreview = (src) => { 
      setCurrentImage(src); setVisible(true); };

    const handleImageError = (index) => { setErr((prev) => [...prev, index]); };

       
    if (dati.length > 0 ) {
    return ( 
      
      <ul>
        <Image.PreviewGroup items={currentList}  preview={{ 
          visible: visible,
         
           onVisibleChange: (vis) => setVisible(vis),
          // getContainer:()=>{const root= document.getElementById('rootRender')},
          rootClassName:"customRootRender",
           toolbarRender: (originalNode,info) => ( 
            
           <> {originalNode} 
            <div className="customRender">
            
           
           <Tooltip title="Copy Image" placement="bottom"  overlayClassName='customTooltip'><Button icon={<CopyOutlined  />} onClick={()=>copyImg(info.image.url,messageApi)}  color="default" variant="solid"/></Tooltip> 
           <Tooltip title="Copy Url"  placement="bottom"   overlayClassName='customTooltip'><Button icon={<SnippetsOutlined  />} onClick={()=>copyText(info.image.url,messageApi)}  color="default" variant="solid"/></Tooltip> 
           <Tooltip title="Save"  placement="bottom"   overlayClassName='customTooltip'><Button icon ={<DownloadOutlined />} onClick = {() =>saveFile(info.image.url,'image.jpg')}  color="default" variant="solid"/></Tooltip>
           <Tooltip title={currentList[info.current].checked? "Unselect" : "Select"}  placement="bottom"  overlayClassName='customTooltip'><Button icon={currentList[info.current].checked? <CheckCircleFilled/> : <CheckCircleOutlined/>} onClick={()=>updateChecked(info.current)} color="default" variant="solid"></Button></Tooltip>
          <ExifMetadata url={info.image.url}/>
           <Tooltip title={`Search with ${engine}`}   overlayClassName='customTooltip' placement="bottom"><Button icon ={<SearchOutlined />} disabled={info.image.url.startsWith("https")? false : true} onClick = {()=>searchLink(info.image.url,engine,messageApi)}  color="default" variant="solid"/></Tooltip>
           <Tooltip title="View Metadata with jimpl.com"  placement="bottom"  overlayClassName='customTooltip'><Button icon={<QuestionCircleOutlined />} disabled={info.image.url.startsWith("https")? false : true} onClick={()=>window.open(`https://jimpl.com/?url=${encodeURIComponent(info.image.url)}`,'_blank')}  color="default" variant="solid"/></Tooltip>
           </div>      
           
           </> ),
           imageRender:(originalNode,info) => (
            <><div className="customTitle">
            <div >{shortUrl(fileName(currentList[info.current].src))}</div>
            {currentList[info.current].alt?.length <40 ? 
            <div > {currentList[info.current].alt} </div> :
            <div ><Popover content={currentList[info.current].alt} placement="bottom">{shortUrl(currentList[info.current].alt)} </Popover></div>
            }</div>
            {originalNode}     
            </>
           )                       
           }} >
            
        {dati.map((item, index) => (
            
          
  
          <li key={index} className="container">
  
            
            <div className="left">
              {err.includes(index)? (<Skeleton.Image className="customImg" />) : ( <Image width={100} height={100} className="customImg" src={item.url} alt={item.alt}  onClick={()=>{handlePreview(item)}} onError={() => handleImageError(index)}  />)}
            </div>
            <div className="right">
            <div className="mask">
              
              <Tooltip title={item.checked? "Unselect" : "Select"} arrow={false} placement='left' overlayInnerStyle={{fontSize : "11px"}}><Button icon={item.checked? <CheckCircleFilled/> : <CheckCircleOutlined/>} className="customButton" onClick={()=>updateChecked(index)}></Button></Tooltip>
              <Tooltip title={`Search with ${engine}`} arrow={false} placement='left' overlayInnerStyle={{fontSize : "11px"}}><Button icon={<SearchOutlined/> } disabled={item.url.startsWith("https")? false : true} className="customButton" onClick={()=>searchLink(item.url,engine,messageApi)}/></Tooltip>
              <Tooltip title="Save" placement='left' arrow={false} overlayInnerStyle={{fontSize : "11px"}}><Button icon={<DownloadOutlined/> } className="customButton" onClick={()=>saveFile(item.url,'image.jpg')}/></Tooltip>
              
            </div>
              <ImgDesc item={item} />
              </div>
           
          
           
  
          </li>
  
        ))}
      </Image.PreviewGroup>
      </ul>
      
    )}
  else
   {
    return (
      <div className='title'>No images with these options...</div>
    )
   }
  }
  