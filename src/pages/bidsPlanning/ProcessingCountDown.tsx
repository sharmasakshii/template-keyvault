import ButtonComponent from 'component/forms/button';
import Heading from 'component/heading';
import Spinner from 'component/spinner'
import React, { useState, useEffect, useRef } from 'react';


const calculateTimeLeft = (endTime: any) => {
  const difference = Math.ceil((new Date(endTime).getTime() - new Date().getTime()) / 1000);
  return difference;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

const CountdownTimer = ({ endTime, handleDownLoadFile,handleShowOutputSummary, file, downloadBtnClass, handleShowInputFile, isDataMatrix }: any) => {

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft(endTime));
  let timer: any = useRef()

  useEffect(() => {
    if (calculateTimeLeft(endTime) > 0) {
      timer.current = setInterval(() => {
        setTimeLeft((prevTimeLeft: number) => {
          const newTimeLeft = prevTimeLeft - 1;
          return newTimeLeft < 0 ? 0 : newTimeLeft;
        });
      }, 1000);
    }

    return () => clearInterval(timer.current);
  }, [endTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timer.current);
    }
  }, [timeLeft, timer]);

  return (
    <div>
      {timeLeft > 0 && 
        <>
          <div className='d-flex align-items-center gap-2 mb-1'>
            <Spinner spinnerClass={"matrixLoader"} />
            <Heading level="5" content="Processing..." className="font-xxl-14 font-12 fw-medium mb-0" />
          </div>
          <Heading level="5" className="font-xxl-12 font-10 mb-0 fw-normal processCount">File will be ready for download in <span className='fw-bold'>{formatTime(timeLeft)}{' '}mins</span></Heading>
        </>
     }
     {!isDataMatrix && timeLeft<=0 && handleDownLoadFile && <div className="d-flex gap-2 align-items-center">
          <ButtonComponent
            text="Download"
            btnClass={downloadBtnClass}
            imagePath="/images/download.svg"
            onClick={() => {
              handleDownLoadFile(file);
              handleShowOutputSummary(file)
            }
            }

          />
          <ButtonComponent
            text="Preview File"
            btnClass="justify-content-center font-12 font-xxl-14  gap-1 previewFile" 
            onClick={() => handleShowOutputSummary(file)} />
          <span className="line"></span>
          <ButtonComponent
            text="View File Input "
            btnClass="justify-content-center font-12 font-xxl-14  gap-1 previewFile"
            onClick={()=>handleShowInputFile(file)}
          />
        </div>
      }
    </div>
  );
};

CountdownTimer.defaultProps = {
  downloadBtnClass: "justify-content-center font-12 font-xxl-14 gap-1 py-1  download downloadListView",
  isDataMatrix: false
}

export default CountdownTimer;
