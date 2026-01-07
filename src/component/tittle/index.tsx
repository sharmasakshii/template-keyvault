import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { updatePageTitle } from "store/commonData/commonSlice"
import { useAppDispatch } from "store/redux.hooks";

const TitleComponent = ({ title = 'GreenSight', pageHeading='' }: any) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(updatePageTitle(pageHeading))
    }, [dispatch, pageHeading])
    return (<Helmet><title>{`GreenSight | ${title}`}</title></Helmet>)
}

export default TitleComponent