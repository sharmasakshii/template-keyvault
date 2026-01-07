import ButtonComponent from 'component/forms/button'
import Heading from 'component/heading'
import ChatListController from './chatListController'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'reactstrap'
import { cancelAllRequests } from 'utils/InterceptorApi'
import { sampleQuestions, sampleQuestionsDEMO } from 'constant'

const ChatListView = () => {

    const {
        titleList,
        isLoadingChatList,
        fetchMoreData,
        chatListData,
        navigate,
        pageNumber,
        limit,
        activeChat,
        setActiveChat,
        handleNewChat,
        isPEPCompany
    } = ChatListController();

    const selectedQuestions = isPEPCompany ? sampleQuestions : sampleQuestionsDEMO;


    return (
        <div className='ps-3 chat-sidebar'>
            <div className='mb-3'>
                <ButtonComponent imagePath="/images/chatbot/new-chat.svg"
                    text="New Chat"
                    btnClass="bg-white border-0 font-12 font-xxl-14 py-2 px-3 "
                    onClick={handleNewChat}
                />
            </div>
            <div
                id="chatListDiv"
                className="chat-sidebar"
            >
                <InfiniteScroll
                    dataLength={pageNumber * limit}
                    next={fetchMoreData}
                    hasMore={((chatListData?.data?.pagination?.total_count / limit) > pageNumber) || false}
                    loader={false}
                    scrollableTarget="chatListDiv"
                >
                    <>
                        <div className='sidebar-border mb-4'>
                            <div className={`d-flex gap-2 align-items-start cursor lh-base`}>
                                <Heading level="3" className="font-xxl-16 font-14 fw-semibold text-white" content="Sample Prompts to Guide your Decarbonization Journey" />
                            </div>

                            {selectedQuestions?.map((chat: any) => (
                                <button
                                    key={chat.id}
                                    className={`${String(activeChat) === String(chat.id) ? "activeChat" : "chatHistory"
                                        } cursor`}
                                    data-toggle="tooltip"
                                    data-placement="right"
                                    title={chat.title}
                                    onClick={() => {
                                        setActiveChat(chat.id);
                                        cancelAllRequests();
                                        navigate(`/scope3/ai-agent/sample/${chat.id}`);
                                    }}
                                >
                                    <Heading
                                        level="3"
                                        className="font-xxl-14 font-12 fw-normal text-white mb-3"
                                        content={chat.title}
                                    />
                                </button>
                            ))}

                        </div>

                        <div className='sidebar-border mb-4'>
                          <Heading level="3" className="font-xxl-16 font-14 fw-semibold text-white mb-1" content="Chat History"/>
                        {titleList.map((chat: any) => (
                            // <div className='sidebar-border mb-4' key={title?.category}>
                            //     <Heading level="3" className="font-xxl-16 font-14 fw-semibold text-white mb-1" content={title.category} />
                            //     {title.data.map((chat: any) => (
                                    <button
                                        key={chat.title_slug}
                                        className={`${String(activeChat) === String(chat.title_slug) ? "activeChat" : "chatHistory"} cursor`} data-toggle="tooltip" data-placement="right" title={chat.title}
                                        onClick={() => {
                                            setActiveChat(chat.title_slug);
                                            cancelAllRequests();
                                            navigate(`/scope3/ai-agent/${chat.title_slug}`);
                                        }}>
                                        <Heading level="3" className="font-xxl-14 font-12 fw-normal text-white mb-3" content={chat.title} />
                                    </button>
                            //     ))}
                            // </div>
                        ))}
                        </div>
                        {isLoadingChatList ?
                            <div className='d-flex justify-content-center'>
                                <Spinner spinnerClass="justify-content-center spinner py-4" />
                            </div>
                            : ""}
                    </>
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default ChatListView