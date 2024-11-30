import React from 'react'
import {Tooltip,Collapse,Popover} from 'antd'
import { InfoCircleOutlined,CaretRightFilled } from '@ant-design/icons'
import {shortUrl,convertBytes} from '../utils/generic.js'

export default function SummaryDesc(props) {

    const {sizeTotal,avgLoading,pageInfo} = props

    const title1= `from ${sizeTotal.count} images with data`
    const title2= `from ${avgLoading.count} images with data`
  
    const items=[{
      key:'1',
     label:<div className="descriptionS">Document Extra Info</div>,
     className:'customCollapse',
       
     
      children:<div className="customCollapse">
      <div><Popover title='Title' content={pageInfo.title}>{shortUrl(pageInfo.title)}</Popover></div>
      { pageInfo.desc? <div className="descriptionS" ><Popover title='Description' content={pageInfo.desc}>{shortUrl(pageInfo.desc)}</Popover></div> : <></>}  
      <div><Popover title='Url' content={pageInfo.url}>{shortUrl(pageInfo.url)}</Popover></div>
      <div>Modified:  <strong>{pageInfo.lastM}</strong></div>
      <div>Scan Time: <strong> {((pageInfo.time)/1000).toFixed(3)} secs</strong></div>
      </div>
    }]
  
  
    return(<>
      <Collapse items={items}  expandIcon={({ isActive }) =><CaretRightFilled className="descriptionS" rotate={isActive ? 90 : 0}/> } defaultActiveKey={[]}  expandIconPosition='end' className="customStats" />
      <div className="customStats">
        <div className="descriptionS">Total size (unique):   
        </div>
        <div><strong>{convertBytes(sizeTotal.sum)}  </strong> 
        <Tooltip title={title1}> {<InfoCircleOutlined />}</Tooltip></div>
      </div>
  
      <div className="customStats">
          <div className="descriptionS">Loading in (avg):      
          </div>
          <div><strong>{(avgLoading.sum/avgLoading.count/1000).toFixed(3)} secs </strong>
          <Tooltip title={title2}>{<InfoCircleOutlined />}</Tooltip></div>
      </div> </>    
    )
  }