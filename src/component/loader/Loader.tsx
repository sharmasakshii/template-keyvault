import React from 'react'

const Loader = ({isLoading, testID=""}:any) => {

    let loader = false
    isLoading?.forEach((elem:any)=>{
        if(elem===true){
            loader= elem
        }
    })
if(loader){
  return (
     <div data-testid={testID} className='overlayLoader'>
        <div className="spinner-border">
          <span className="visually-hidden"></span>
        </div>
      </div>
  )
}else{
    return <div></div>
}}

export default Loader