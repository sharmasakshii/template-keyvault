import ButtonComponent from 'component/forms/button'
import Heading from 'component/heading'
import ImageComponent from "component/images"
import "scss/aiAgent/_index.scss";
import ChatSection from '../ChatSection/ChatSectionView';
import { useNavigate } from 'react-router-dom';
import { openSidebar } from "store/commonData/commonSlice";
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';

const AiAgentFullPageView = () => {
    const { isSidebarOpen } = useAppSelector((state: any) => state.commonData)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    return (
        <section className='ai-agentScreen p-md-3 px-1 pb-md-0 pb-4'>

            <div className='border-bottom d-flex gap-3 align-itmes-center mb-3 pb-3 main-heading pt-md-0 pt-3'>
                <div className="d-flex gap-2 align-items-center">
                    <div>
                        <ButtonComponent onClick={() => dispatch(openSidebar(!isSidebarOpen))} imagePath="/images/hamburger.svg" btnClass={`${isSidebarOpen ? "d-none" : "close-btn-sidebar p-0 border-0"} btn-transparent`} />
                    </div>
                </div>
                <ImageComponent path="/images/chatbot/stars.svg" className='pe-0' />
                <Heading  level="3" className="font-20 font-xxl-24 fw-medium mb-0" content="GreenSight Decarbonization Agent" />
            </div>
            <div className='px-md-3 px-0'>
                <ButtonComponent
                    text="Back to dashboard"
                    onClick={() => navigate("/scope3/sustainable")}
                    imagePath="/images/chatbot/backBtn.svg"
                    btnClass="font-xxl-16 font-14 fw-medium back-btn"
                />
                <div className=''>
                    <ChatSection />
                </div>
            </div>

        </section>
    )
}

export default AiAgentFullPageView