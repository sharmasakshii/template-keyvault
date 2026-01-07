import React from 'react';
import ImageComponent from "component/images";

const GraphStatusBar = ({database,condition,content}: any) => {

    return database ? <div className={`${condition ? "model-overview-up" : "model-overview-down"} p-2 bottom-card`}>
      <h6 className="mb-0 d-flex align-items-center fw-normal">
        <span><ImageComponent path={`/images/${condition?"up.svg":"down.svg"}`} /></span> 
        {content?.split("/status/")?.join(condition ? "lower" : "higher")}
      </h6>
    </div> : <></>}
   ;

export default GraphStatusBar;