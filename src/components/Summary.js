import React from 'react';
export default function Summary(props) {

    const {unique,total} = props
    return(
      <div className="customStats">
          
      <div className="title">Image Hunter</div>
        <div className="left">
          <div className="bignumber">{unique? unique:0}</div>
          <div className="description">Unique</div>
        </div>
          <div className="right">
          <div className="bignumber">{total? total: 0}</div>
          <div className="description">Total</div>
          </div>
        
      </div>
    )
  }