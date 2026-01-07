import InfiniteScroll from "react-infinite-scroll-component";
import ChatSctionController from "./chatSctionController";
import Heading from "component/heading";
import ImageComponent from "component/images"
import Spinner from "component/spinner";
import ButtonComponent from "component/forms/button";
import MessageFormater from "./MessageFormater"
import { aiAgentType } from "constant";

const ChatSection = () => {

  const {
    items,
    isLoadingChatHistory,
    fetchMoreData,
    scrollContainerRef,
    isLoading,
    handleSubmitMessage,
    onKeyDownHandler,
    messages,
    messageList,
    titleSlug,
    chatHistoryData,
    pageNumber,
    textareaRef,
    handleChange,
    setQuestionType
  } = ChatSctionController()

  return (
    <div data-testid="chat-boat-view" className={` ${(!titleSlug && messageList.length === 0) ? "new-chat d-flex flex-column justify-content-center align-items-center" : ''}`}>
      {(!titleSlug && messageList.length === 0) ?
        <div>
          <div className="d-flex gap-1 align-items-center mb-4 justify-content-center">
            <ImageComponent path="/images/g-logo.svg" className="pe-0 g-logo" />
          </div>
          <h1 className="text-center font-xxl-32 font-28 fw-medium mb-4"> What can I help you with? </h1>
        </div> :
        <div
          id="scrollableDiv"
          ref={scrollContainerRef}
          className="chat-section"
        >
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={(chatHistoryData?.data?.pagination?.total_count / 4 > pageNumber) || false}
            loader={false}
            inverse={true} // This makes it scroll from bottom to top
            scrollableTarget="scrollableDiv"
          >
            <>
              {isLoadingChatHistory ? <Spinner spinnerClass="justify-content-center spinner py-4" /> : ""}
              {items?.map((chat: any) => (
                <MessageFormater chat={chat} key={chat.id} />
              ))}
              {messageList.map((chat: any) => (
                <MessageFormater chat={chat} key={chat.question_id} />
              ))}
            </>
          </InfiniteScroll>
        </div>
      }
      <form onSubmit={handleSubmitMessage} className={`${(!titleSlug && messageList.length === 0) ? "aiform" : "w-100 fixed-form"}`}>
        <div className='d-flex message-area gap-3'>
          <div className="text-areaDiv">
            <div>
              <textarea data-testid="chat-type-message" ref={textareaRef} onKeyDown={onKeyDownHandler} value={messages} onChange={handleChange} rows={1} className="text-area" placeholder="Type your message..."
              />
            </div>
          </div>
          <ButtonComponent
            text=""
            data-testid="send-message"
            type="submit"
            disabled={isLoading}
            imagePath={(messages?.length === 0 || isLoading) ? "/images/chatbot/disabled-btn.svg" : "/images/chatbot/enter.svg"}
            btnClass="btn-transparent px-0"
          />
        </div>
      </form>
      {(!titleSlug && messageList.length === 0) ?
        <div className="aicards aiform  mt-xxl-4 mt-3 pt-xxl-3">
          <div className="grid-container">
            {aiAgentType.map((item) => (
              <button data-testid={item?.type}  className={`card-outer ${item?.type === "track" ? "" : "disabled"}`} key={item.title} onClick={() =>
                item?.type === "track" ? setQuestionType(item?.type) : setQuestionType("track")
              }>
                <div className="card-inner">
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <ImageComponent path={item.image} className="pe-0 mb-2" />
                    <Heading level="6" className="font-10 font-xxl-12 fw-normal mb-2 action" content={item.action} />
                  </div>
                  <Heading level="3" className="font-16 font-xxl-20 fw-medium" content={item.title} />
                  <Heading level="6" className="font-12 font-xxl-16 fw-normal mb-0" content={item.description} />
                </div>
              </button>
            ))}
          </div>
        </div> : <></>
      }
    </div >
  );
};

export default ChatSection;