import React from 'react'
import {Tooltip,Collapse} from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import {shortUrl,convertBytes} from '../utils/generic.js'

export default function SummaryDesc(props) {

    const {sizeTotal,avgLoading,pageInfo} = props

    const title1= `from ${sizeTotal.count} images with data`
    const title2= `from ${avgLoading.count} images with data`
  
    const items=[{
      key:'1',
     label:<div>Document extra info</div>,
       
     
      children:<div className="customCollapse">
      <div><Tooltip title='Title'>{shortUrl(pageInfo.title)}</Tooltip></div>
      { pageInfo.desc? <div className="descriptionS" ><Tooltip title='Description'>{shortUrl(pageInfo.desc)}</Tooltip></div> : <></>}  
      <div><Tooltip title='Url'>{shortUrl(pageInfo.url)}</Tooltip></div>
      <div>Last modify: {pageInfo.lastM}</div>
      <div>Time Analyze: {((pageInfo.time)/1000).toFixed(3)} secs</div>
      </div>
    }]
  
  
    return(<>
      <Collapse items={items}  accordion={true} destroyInactivePanel={true} defaultActiveKey={[]} ghost={true} expandIconPosition='end' className="customStats" />
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