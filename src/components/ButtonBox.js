import React from 'react'
import{Tooltip,Button} from 'antd'
import { SettingOutlined,CheckCircleFilled,CheckCircleOutlined,DownloadOutlined,SaveOutlined } from '@ant-design/icons'
import {saveReport,saveFile} from '../utils/click.js'

export default function ButtonBox(props) {

    const {toggle,checkAll,list,pageInfo} =props
    
    const report={...pageInfo, images:list}
  
     
    return (
  
      <>
        <Tooltip title="Setting and Filter option"><Button onClick={() =>browser.runtime.openOptionsPage()} type="primary"className="customButton" icon={<SettingOutlined />}  shape="round"></Button></Tooltip>
        <Tooltip title={toggle? "Unselect All" : "Select All"}><Button  onClick={checkAll} type="primary" className="customButton" shape="round" icon={toggle? <CheckCircleFilled/> : <CheckCircleOutlined/>}></Button></Tooltip>
        <Tooltip title="Download Selected"><Button onClick={()=>list.filter(item=>item.checked).forEach(item=>saveFile(item.url,'image.jpg'))} type="primary" className="customButton" shape="round" icon={<DownloadOutlined/>}></Button></Tooltip>
        <Tooltip title="Save Report"><Button  onClick={()=>saveReport(report,'Report.json')}type="primary" className="customButton" shape="round" icon={<SaveOutlined/>}></Button></Tooltip>
        
      </>
    )
  }