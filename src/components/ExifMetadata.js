import React,  {useState} from 'react'
import {Modal,Button, Tooltip} from 'antd'
import { FileSearchOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
const ExifReader = require('exifreader');
import {saveReport} from '../utils/click.js'

export default function ExifMetadata(prop) {

    const {url} =prop
    const defState = {
      content:"",
      open:false
    }
    const [isModalOpen, setIsModalOpen] = useState(defState);
    
    const showModal = async() => {
      
      const description = await exifData(url); 
      setIsModalOpen({ open: true, content: description }); } 
     
  
    const handleOk = () => {
      setIsModalOpen(defState);
    };
    const handleCancel = () => {
      setIsModalOpen(defState);
    };
  
  
  
    async function exifData(url) {
      try { 
        const response = await fetch(url); 
        const arrayBuffer = await response.arrayBuffer(); 
        const tags = ExifReader.load(arrayBuffer);
        const allKeys = [ ...Object.getOwnPropertyNames(tags), ...Object.getOwnPropertySymbols(tags) ];
        const allEntries = allKeys.map(key => [key, tags[key]]);
  
        return allEntries    
       } 
        catch (error) { 
          console.error('Error :', error);
        return null
         } 
    }
    return ( <> 
    <Button icon={<FileSearchOutlined /> } onClick={showModal} variant="solid" color="default"/>
    <Modal className="exif" title={"EXIF Metadata of: "+url.slice(0,40)} open={isModalOpen.open} onOk={handleOk} onCancel={handleCancel} getContainer={()=>document.getElementById('root')} zIndex={1100} closable={false}style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} footer={[
      <Tooltip title='Save Report'><Button type='primary' className="customButton" icon={<SaveOutlined/>}onClick={()=>saveReport(isModalOpen.content,'ExifMetadata.json')}></Button></Tooltip>,
      <Button type='primary' className="customButton" icon={<CloseOutlined/>}onClick={()=>setIsModalOpen(pre=>({...pre,open:false}))}></Button>
    ]}> 
      {isModalOpen.content ?
      isModalOpen.content.map(([key,value])=>(<div key={key} style={{fontSize: "10px"}}> {key}: {(typeof(value["description"]) == "string" || typeof(value['description']) == "number" )? value["description"]: JSON.stringify(value)}</div>)):
      <div>Not valid format</div>} </Modal> 
      </>
       );
    
  }
  