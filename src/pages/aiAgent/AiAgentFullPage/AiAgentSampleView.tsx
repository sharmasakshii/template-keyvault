import ButtonComponent from 'component/forms/button'
import Heading from 'component/heading'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { openSidebar } from 'store/commonData/commonSlice'
import { useAppDispatch, useAppSelector } from 'store/redux.hooks'
import ImageComponent from "component/images"
import InfiniteScroll from 'react-infinite-scroll-component'
import { companySlug, sampleQuestions, sampleQuestionsDEMO } from 'constant'
import MessageFormater from '../ChatSection/MessageFormater'
import { isCompanyEnable } from 'utils'

const AiAgentSampleView = () => {
    const { titleSlug } = useParams()
    const { isSidebarOpen } = useAppSelector((state: any) => state.commonData)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { loginDetails } = useAppSelector((state: any) => state.auth);

    const isPEPCompany = isCompanyEnable(loginDetails?.data, [companySlug?.pep]);

    return (
        <section className='ai-agentScreen p-md-3 px-1 pb-md-0 pb-4'>

            <div className='border-bottom d-flex gap-3 align-itmes-center mb-3 pb-3 main-heading pt-md-0 pt-3'>
                <div className="d-flex gap-2 align-items-center">
                    <div>
                        <ButtonComponent onClick={() => dispatch(openSidebar(!isSidebarOpen))} imagePath="/images/hamburger.svg" btnClass={`${isSidebarOpen ? "d-none" : "close-btn-sidebar p-0 border-0"} btn-transparent`} />
                    </div>
                </div>
                <ImageComponent path="/images/chatbot/stars.svg" className='pe-0' />
                <Heading level="3" className="font-20 font-xxl-24 fw-medium mb-0" content="GreenSight Decarbonization Agent" />
            </div>
            <div className='px-md-3 px-0'>
                <ButtonComponent
                    text="Back to dashboard"
                    onClick={() => navigate("/scope3/sustainable")}
                    imagePath="/images/chatbot/backBtn.svg"
                    btnClass="font-xxl-16 font-14 fw-medium back-btn"
                />
                <div className=''>
                    <div
                        id="scrollableDiv"
                        className="chat-section"
                    >
                        <InfiniteScroll
                            dataLength={isPEPCompany ? sampleQuestions.length : sampleQuestionsDEMO.length}
                            next={() => { }}
                            hasMore={false}
                            loader={false}
                            inverse={true} // This makes it scroll from bottom to top
                            scrollableTarget="scrollableDiv"
                        >
                            {isPEPCompany
                                ? sampleQuestions
                                    ?.filter((el: any) => el.id === titleSlug)
                                    ?.map((chat: any) => <MessageFormater chat={chat} key={chat.id} />)
                                : sampleQuestionsDEMO
                                    ?.filter((el: any) => el.id === titleSlug)
                                    ?.map((chat: any) => <MessageFormater chat={chat} key={chat.id} />)}

                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AiAgentSampleView