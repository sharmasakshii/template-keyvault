import React from 'react'
import UserActivityController from './userActivityController'
import InfiniteScroll from "react-infinite-scroll-component";
import moment from 'moment';
import ImageComponent from "../../../component/images";
import { capitalizeText } from 'utils';

const activityStatusDetail = (activity: any) => activity === "1" ? "activated" : "deactivated"

const activityStatus: { [key: string]: string } = {
    "0": "Inactive",
    "1": "Activate",
    "2": "Deactivate"
}

const getProfileUpdateColName: { [key: string]: string } = {
    email: "email address",
    first_name: "first name",
    last_name: "last name",
    region_id: "region",
    phone_number: "phone number",
    division_id: "division"
}

const activityMessageContent = (prop: any) => {
    let message
    if (prop.old && !prop.new) {
        message = "removed"
    }
    else if (!prop.old && prop.new) {
        message = prop?.column_name === "region_id" ? "assigned" : "added"
    }
    else if (prop.old && prop.new) {
        message = "updated"
    }
    return message
}

const activityMessage = (activity: any, singleUserDetail: any) => {
    let message: any = ""
    let valueNew: string = ""
    let valueold: string = ""
    const userName = activity?.adminDetail?.length ? activity?.adminDetail : singleUserDetail?.data?.userDetail?.name

    const profileName = activity?.adminDetail?.length ? <b>{singleUserDetail?.data?.userDetail?.name}</b> : "profile"

    if (activity?.trigger_type === "insert") {
        return {
            message: <span><b>{activity?.adminDetail}</b> created the <b>{singleUserDetail?.data?.userDetail?.name}</b> and assigned role</span>,
            valueNew: activity?.newRole,
            valueold: "New user"
        }
    }
    if (activity?.column_name === "status") {
        message = <span><b>{capitalizeText(userName)}</b>  {activityStatusDetail(activity?.new)} the {profileName}</span>;
        valueNew = activityStatus[activity?.new]
        valueold = activityStatus[activity?.old]
    }
    else if (activity?.column_name === "role") {
        message = <span><b>{capitalizeText(activity?.adminDetail)}</b> updated <b>{singleUserDetail?.data?.userDetail?.name}</b> profile and {activityMessageContent(activity)} role</span>;
        valueNew = activity?.newRole
        valueold = activity.oldRole
    }
    else if (activity?.column_name === "division_id") {
        message = <span><b>{capitalizeText(userName)}</b> {activity?.adminDetail && "updated"}   <b>{activity?.adminDetail && singleUserDetail?.data?.userDetail?.name}</b> {activity?.adminDetail && "profile and"}      {activityMessageContent(activity)}{" "}
            {getProfileUpdateColName[activity?.column_name] || activity?.column_name}
        </span>;
        valueNew =
            activity?.column_name === "division_id" ? activity?.newDivision : activity?.new
        valueold = activity?.column_name === "division_id" ? activity?.oldDivision : activity?.old
    }
    else {
        message = <span><b>{capitalizeText(userName)}</b> {activity?.adminDetail && "updated"}   <b>{activity?.adminDetail && singleUserDetail?.data?.userDetail?.name}</b> {activity?.adminDetail && "profile and"}      {activityMessageContent(activity)}{" "}
            {getProfileUpdateColName[activity?.column_name] || activity?.column_name}
        </span>;
        valueNew =
            activity?.column_name === "region_id" ? activity?.newRegion : activity?.new
        valueold = activity?.column_name === "region_id" ? activity?.oldRegion : activity?.old
    
    }
    return {
        message: message,
        valueNew: valueNew,
        valueold: valueold
    }
}

const UserActivityView = () => {

    const {
        userActivityData,
        isUserActivityLoading,
        fetchMoreData,
        hasMoreData,
        singleUserDetail
    } = UserActivityController()
    return (
        <div className="activity"
            id="scrollableDiv"
            data-testid="user-activity"
        >
            {userActivityData?.activityData?.length > 0 ? <InfiniteScroll
                dataLength={userActivityData?.activityData?.length}
                next={fetchMoreData}
                hasMore={hasMoreData}
                //you can create a spinner component which will be
                //displayed when the Items are being loaded
                loader={isUserActivityLoading ? <div className="mt-3 d-flex justify-content-center align-items-center" data-testid="user-activity-loading-div">
                    <div className="spinner-border  spinner-ui">
                        <span className="visually-hidden"></span>
                    </div>
                </div> : ""}
                scrollableTarget="scrollableDiv"
            > <>
                    {userActivityData?.activityData?.length > 0 ? userActivityData?.activityData?.map((activity: any) => {
                        return (
                            <div key={activity?.id} className="d-flex align-items-center justify-content-between item">
                                <div>
                                    <span className='font-16'>
                                        {activityMessage(activity, singleUserDetail)?.message}
                                    </span>{" "}
                                    <span className="font-16 date">{moment(activity?.updated_on).format('MMM-DD-YYYY h:mm A')}</span>
                                </div>
                                {(activity?.column_name !== "image" && activity?.column_name !== "password") &&
                                    <div className="d-flex gap-3 align-items-center">
                                        {activityMessage(activity, singleUserDetail)?.valueold && <> <div className="stOne state">{activityMessage(activity, singleUserDetail)?.valueold}</div>
                                            {activityMessage(activity, singleUserDetail)?.valueNew && <ImageComponent
                                                path="/images/rightarrow2.svg"
                                                className="img-fluid pe-0"
                                            />}</>}
                                        {activityMessage(activity, singleUserDetail)?.valueNew && <div className="stTwo state">{activityMessage(activity, singleUserDetail)?.valueNew}</div>}
                                    </div>
                                }
                            </div>
                        )
                    }) : <p className="text-center font-16">No activity found</p>}
                </>
            </InfiniteScroll> : <div className="mt-3 d-flex justify-content-center align-items-center" data-testid="user-activity-loading-div">
                <div className="spinner-border  spinner-ui">
                    <span className="visually-hidden"></span>
                </div>
            </div>}
        </div>
    )
}

export default UserActivityView