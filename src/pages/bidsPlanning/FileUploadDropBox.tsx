import Heading from 'component/heading'
import React from 'react'
import { Col, Row } from 'reactstrap'
import ImageComponent from 'component/images'
import ButtonComponent from 'component/forms/button'
import FileUploadProgress from './FileUploadProgress'
import { instructions } from 'constant'
import Spinner from 'component/spinner'

const BidPlanningDropBox = ({ isDragActive, getRootProps, handleUploadButtonClick, showFileUploadProgress, uploadingFiles, progressValue, showUploadError, isLoadingSaveFile, handleCancelRequest, handleSampleFileDownload, handleCloseProgressModal, handleUploadAgain, bidFileList, isAnalysingFile }: any) => {

    return (
        <div className='bidsPlanning-UploadWrapper'>
            <div className='bidsplanning-innerWrapper p-3'>
                <Heading level="4" content="Upload your bid file" className="font-20 font-xxl-24 fw-medium mb-3" />
                <Row className='g-3'>
                    <Col lg="6">
                        <div className={`p-4 uploadFile-wrapper text-center mb-4 ${isDragActive ? "active" : ""}`} {...getRootProps({
                            onClick: (event: any) => event.stopPropagation(),
                        })}>
                            <ImageComponent
                                path="/images/multipleFilesIcon.svg"
                                alt="files"
                                className='pe-0 mb-3'
                            />
                            <Heading level="4" className="font-20 font-xxl-24 fw-medium mb-3 border-none">
                                Drag and drop or <span className='cursor'><ButtonComponent
                                    text="browse"
                                    btnClass="font-24 font-xxl-28 fw-medium browser px-0"
                                    onClick={handleUploadButtonClick}
                                /></span> your files
                            </Heading>
                            <Heading level="6" className="fw-normal font-xxl-20 font-16" >
                                Excel files only
                            </Heading>
                        </div>
                        {isAnalysingFile && <div className='uploadfileStatus w-100 justify-content-center px-4 align-items-center gap-3'>
                            <Spinner />
                            <p className='font-xxl-16 font-14 mb-0'>Analysing the file data...</p>
                        </div>
                        }
                        {(bidFileList?.data?.length === 0) && showFileUploadProgress && <FileUploadProgress uploadingFiles={uploadingFiles} progressValue={progressValue} isLoadingSaveFile={isLoadingSaveFile} showUploadError={showUploadError} handleCancelRequest={handleCancelRequest} handleCloseProgressModal={handleCloseProgressModal} handleUploadAgain={handleUploadAgain} />}
                    </Col>
                    <Col lg="6">
                        <div className='sampleFile-bg mb-4 d-flex justify-content-between gap-2 align-items-center'>
                            <div>
                                <Heading level="6" className="fw-medium font-xxl-18 font-16" >
                                    <ImageComponent
                                        path="/images/Excel.svg"
                                        alt="files"
                                        className='pe-2'
                                    />File Template
                                </Heading>
                                <p className='font-xxl-16 font-14 mb-0'>You can download the sample file and use it to upload data in correct format.</p>
                            </div>
                            <ButtonComponent
                                text="Sample File"
                                btnClass="btn-deepgreen font-14 font-xxl-18 fw-medium py-2" onClick={handleSampleFileDownload} />
                        </div>
                        <div>
                            <Heading level="4" content="Instructions:-" className="font-20 font-xxl-24 fw-medium mb-2" />
                            {instructions.map((instruction: any) =>
                                <div key={instruction.text} className='d-flex gap-2 mb-xxl-3 mb-2'>
                                    <ImageComponent path={instruction?.fileicon} className='icon-pdf' />
                                    <p className='mb-0 font-xxl-14 font-12'>{instruction?.text}</p>
                                </div>)}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default BidPlanningDropBox