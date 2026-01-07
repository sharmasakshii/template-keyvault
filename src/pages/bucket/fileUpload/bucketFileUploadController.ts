import { useAuth } from "auth/ProtectedRoute";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutPost, uploadBucketFile } from "store/auth/authDataSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";

export const BucketFileUploadController = () => {
    const userDetail = useAuth();
    const [showFileUploadProgress, setShowFileUploadProgress] = useState(false);

    const uploadRef = useRef<any>();
    const statusRef = useRef<any>();
    const loadTotalRef = useRef<any>();
    const progressRef = useRef<any>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { bucketFileUpload, bucketFileLoading } = useAppSelector((state: any) => state.auth);

    const UploadFile = () => {
        const userData = {
            ref: uploadRef?.current?.files?.[0],
            progressFn: ProgressHandler,
            userInfo: userDetail?.userdata?.containerName,
        };
        dispatch(uploadBucketFile(userData));
        setShowFileUploadProgress(true);
    };
    const ProgressHandler = (e: any) => {
        const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        function niceBytes(x: any) {
            let l = 0, n = parseInt(x, 10) || 0;
            while (n >= 1024 && ++l) {
                n = n / 1024;
            }
            loadTotalRef.current.innerHTML = (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
            return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
        }
        let loadedFileSize = niceBytes(e.loaded)
        let totalFileSize = niceBytes(e.total)
        loadTotalRef.current.innerHTML = `uploaded ${loadedFileSize} of ${totalFileSize}`;
        let percent = (e.loaded / e.total) * 100;
        progressRef.current.value = Math.round(percent);
        statusRef.current.innerHTML = Math.round(percent) + "% uploaded...";
    };

    useEffect(() => {
        if (bucketFileUpload) {
            if (bucketFileUpload?.status === 201) {
                SuccessHandler(bucketFileUpload?.data?.message);
                dispatch(logoutPost());
                navigate("/bucket-login")
            } else {
                ErrorHandler();
            }
        }
    }, [dispatch, navigate, bucketFileUpload]);
    const SuccessHandler = (response: any) => {
        statusRef.current.innerHTML = "";
        if(progressRef.current) {
            progressRef.current.value = 0;
        }
        setShowFileUploadProgress(false);
        toast.success(response);
    };
    const ErrorHandler = () => {
        statusRef.current.innerHTML = "upload failed!!";
        setShowFileUploadProgress(false);
    };

    const handleLogout = async () => {
        dispatch(logoutPost());
        navigate("/bucket-login")
    }
    const handleFileExplorerOpen = () => { uploadRef.current?.click() }

    return {
        userDetail,
        uploadRef,
        UploadFile,
        handleFileExplorerOpen,
        showFileUploadProgress,
        progressRef,
        statusRef,
        loadTotalRef,
        handleLogout,
        bucketFileLoading
    };
};
