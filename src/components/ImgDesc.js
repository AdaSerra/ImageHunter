import React from 'react'
import {convertBytes} from '../utils/generic.js'

export default function ImgDesc(prop) {

    const {item} =prop
    return (
      <div className="imgdescription">
        <div>Type:</div>
        <div>{item.type? item.type : 'no data'}</div>
        <div>Pixel:</div>
        <div>{item.origW? item.origW+"x"+item.origH: ""}</div>
        <div>Size:</div>
        <div>{Number(item.backSize)? convertBytes(item.backSize) : Number(item.pfSize)? convertBytes(item.pfSize) : Number(item.blobSize)? convertBytes(item.blobSize)+"*":'no data'}</div>
        <div>Load:</div>
        <div>{Number(item.backDuration)||Number(item.pfDuration) ? (item.backDuration/1000 || item.pfDuration/1000).toFixed(3)+ " secs": "no data"}</div>
        <div>Date</div>
        <div>{item.lastModif?.slice(5,-13) || item.date? item.date.slice(5,-13)+ "*" :'no data'}  </div>
      </div>
    )
  }