enum HttpStatusMessage {
    UNAUTHORIZED = "Session timeout, please login again",
    NOT_FOUND = "No Record Found!",
    INTERNAL_SERVER_ERROR = "Oops! Something went wrong",
    NOT_ACCESS = "You are not authorized to access this end point",
    INVALID_PARAMS = "Invalid parameters"
}

export default HttpStatusMessage;