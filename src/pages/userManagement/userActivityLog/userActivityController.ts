import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/redux.hooks'
import { getUserActivity } from 'store/user/userSlice'
import { normalizedList } from 'utils'

const UserActivityController = () => {

    const pageSize = 10
    const [userActivityData, setUserActivityData] = useState<any>([])
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [hasMoreData, setHasMoreData] = useState<boolean>(false)
    const params = useParams();
    const dispatch = useAppDispatch();

    const { singleUserDetail, isUserActivityLoading, userActivityDetail } = useAppSelector((state: any) => state.user);

    useEffect(() => {
        dispatch(getUserActivity({
            user_id: params?.userId,
            page_number: 1,
            page_size: pageSize
        },))
    }, [dispatch, params])

    useEffect(() => {
        if (userActivityDetail?.data?.activityData) {

            if (userActivityDetail?.data?.pagination?.page === 1) {
                setUserActivityData({
                    activityData: userActivityDetail.data.activityData
                })
                setPageNumber(1)
            } else {
                setUserActivityData((prevData: any) => ({
                    ...prevData, // Change this to `prevData`
                    activityData: [...(normalizedList(prevData?.activityData)), ...userActivityDetail.data.activityData]
                }));
            }
        }
        if (userActivityDetail?.data?.pagination?.total_count) {
            const value1 = userActivityDetail.data.pagination.total_count;
            const value2 = pageSize * userActivityDetail?.data?.pagination?.page;
            // Perform subtraction
            const result = value1 - value2;
            // Check if result is negative
            setHasMoreData(result > 0)
        }
    }, [userActivityDetail])

    const fetchMoreData = () => {
        setPageNumber(pageNumber + 1)
        dispatch(getUserActivity({
            user_id: params?.userId,
            page_number: pageNumber + 1,
            page_size: pageSize
        },))
    }

    return {
        userActivityData,
        isUserActivityLoading,
        fetchMoreData,
        hasMoreData,
        singleUserDetail
    }
}

export default UserActivityController