import React from 'react'
import ImageComponent from 'component/images'
import Heading from 'component/heading'
import { Progress } from 'reactstrap'
import ButtonComponent from "../../component/forms/button"
import Spinner from 'component/spinner'

const FileUploadProgress = ({ uploadingFiles, progressValue, isLoadingSaveFile, handleCancelRequest, showUploadError, fileUploadError, handleUploadAgain, handleCloseProgressModal }: any) => {
    return (

        <div className='uploadfileStatus '>
            <div className=' d-flex align-items-center gap-3'>
                <ImageComponent
                    path="/images/exportFile.svg"
                    alt="files"
                    className='pe-0'
                />
                <div>
                    <div className='fileName-Wrapper mb-2 d-flex justify-content-between gap-2 align-items-center'>
                        <Heading level="4" className="font-16 font-xxl-20 fw-normal mb-0 file-name">
                            {uploadingFiles?.name}
                            <div className="tootltip-div">
                                {uploadingFiles?.name}
                            </div>
                        </Heading>
                        <p className='fw-medium font-16 font-xxl-20 mb-0'>{progressValue}%</p>
                    </div>
                    <Progress value={progressValue} className='low_priority' />
                    {isLoadingSaveFile && <div className='d-flex align-items-center gap-2 mt-2'><Spinner />
                        <p className='mb-0 font-14'>Almost there! Metrics will be available in just few minutes.</p>
                    </div>}
                    {showUploadError && <div>
                        <Heading level="4" className="font-14 mt-2 fw-normal mb-0 text-danger">
                            {fileUploadError?.message}
                        </Heading>
                    </div>}
                </div>
            </div>
            {!showUploadError && progressValue < 100 && <div className='d-flex justify-content-end mt-4 cancelBtn'>
                <ButtonComponent imagePath="/images/crossbtn.svg" onClick={handleCancelRequest} text="Cancel" btnClass="gray-btn py-2 px-3 " />
            </div>}
            {showUploadError && <div className='d-flex justify-content-end gap-3 mt-3'>
                <ButtonComponent imagePath="/images/crossbtn.svg" text="Cancel" btnClass="gray-btn py-2 px-3 " onClick={handleCloseProgressModal} />
                <ButtonComponent text="Upload again" onClick={handleUploadAgain} btnClass="btn-deepgreen py-2 px-3  font-14 uploadAgain" />
            </div>}

        </div>
    )
}

export default FileUploadProgress