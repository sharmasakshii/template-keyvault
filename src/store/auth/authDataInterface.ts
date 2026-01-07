/**
 * Authentication State Interface
 */


export interface AuthDataInterface {
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    isAuthLoginLoading: boolean;
    isOtpVerifyLoading: boolean;
    message: string | null;
    loginDetails: any;
    isOtp: boolean;
    otpSuccess: boolean;
    otpError: boolean;
    bucketLoginDetails: string | null;
    bucketLoginLoading: boolean;
    bucketFileLoading: boolean;
    bucketFileUpload: string | null;
    regionalId: "",
    divisionId: "",
    scopeType: string | null,
    applicationTypeStatus: string;
    userProfile: any; // Represents the user's profile data. It can be of any type.
    resendOtpPostDto: any
    fuelStopListDto: any
}

