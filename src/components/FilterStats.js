import React from 'react'
import {convertBytes} from '../utils/generic.js'

export default function FilterStats(props) {
    const {len, sizeFilter, sizeChecked} =props
     
      if (sizeChecked.count>0) {
        return  (
          <div className="filterStats">
            Selected Image(s): <strong>{sizeChecked.count} </strong>  | Total Size: <strong>{convertBytes(sizeChecked.size)}</strong> 
            
          </div> 
        )
      }
      else {
        return (
          <div className="filterStats">
         
          Filtered Image(s): <strong>{len} </strong>  | Total Size: <strong>{convertBytes(sizeFilter.sum)}</strong> 
       </div> 
        )
      }
      
    }
    