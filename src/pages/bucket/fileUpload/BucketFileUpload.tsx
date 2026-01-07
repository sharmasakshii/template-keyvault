import { BucketFileUploadController } from "./bucketFileUploadController";
import TitleComponent from "component/tittle";
import ImageComponent from "../../../component/images"

export const BucketFileUpload = () => {
  const {
    userDetail,
    uploadRef,
    handleFileExplorerOpen,
    UploadFile,
    showFileUploadProgress,
    progressRef,
    statusRef,
    loadTotalRef,
    handleLogout,
    bucketFileLoading
  } = BucketFileUploadController();
  return (
    <section className="login bucketLogin" data-testid="bucket-upload">
      <TitleComponent title={"Bucket-upload"} />
      <div className="container-fluid px-0">
        <div className="row gx-0 align-items-center h100vh justify-content-center">
          <div className="col-11 col-lg-8 col-xl-7 col-xxl-6 align-items-center justify-content-center">
            <div className="right-side-wrapper bucketloginWrap mx-auto w-100 my-3">
              <h4 className="login-heading font-30 font-lg-40 fw-medium mb-3">
                Welcome to {userDetail?.userdata?.Company?.name} Bucket File
                Upload
              </h4>
              <p className="fw-normal mb-4 font-20">Please upload file.</p>
              <div className="d-flex justify-content-center align-items-center">
                <button
                  type="button"
                  data-testid="file-explorer"
                  onClick={handleFileExplorerOpen}
                  className="upload-btn px-4 py-1 d-flex justify-content-center align-items-center">
                  <span className="me-2">
                    {" "}
                    <ImageComponent path="/images/login/upload.svg" className="pe-0" />
                  </span>
                  {' '} Upload</button>
              </div>
              <input
                type="file"
                name="file"
                ref={uploadRef}
                data-testid="file-input-list"
                onChange={UploadFile}
                className="d-none"
              />
              {showFileUploadProgress && (
                <div>
                  <progress ref={progressRef} data-testid="progress-bar" value="0" max="100" />
                </div>
              )}
              <p ref={statusRef}  data-testid="status-text"></p>
              <p ref={loadTotalRef} data-testid="load-total-text"></p>
              <button
                onClick={handleLogout}
                type="button"
                data-testid="logout"
                disabled={bucketFileLoading}
                className="upload-btn px-4 py-1 d-flex justify-content-center align-items-center my-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
