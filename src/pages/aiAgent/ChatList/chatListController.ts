import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addNewMessage, getChatListApi, resetChatList } from "store/scopeThree/chatbot/chatBotSlice";
import { useAppDispatch, useAppSelector } from "store/redux.hooks"
import { cancelAllRequests } from "utils/InterceptorApi";
import { isCompanyEnable } from "utils";
import { companySlug } from "constant";

const ChatListController = () => {
    const limit = 15;
    const { titleSlug = null } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [titleList, setTitleList] = useState<any>([])
    const [pageNumber, setPageNumber] = useState(1);
    const [activeChat, setActiveChat] = useState(titleSlug);
    const [isFetching, setIsFetching] = useState(false);
 const { loginDetails } = useAppSelector((state: any) => state.auth);

    const isPEPCompany = isCompanyEnable(loginDetails?.data, [companySlug?.pep]);
    const { isNewChat, isLoadingChatList, chatListData } = useAppSelector((state) => state.chatBot);
    
    useEffect(() => {
        if(!isFetching){
            setTitleList([])
            dispatch(resetChatList())
            dispatch(getChatListApi({
                page: 1,
                page_size: limit
            })).finally(()=>{
                setIsFetching(true);
            })
        }
    }, [dispatch]);

    useEffect(() => {
        if (!isNewChat?.message || !isNewChat?.isNew || !titleSlug || !isFetching) return;
        setActiveChat(titleSlug);
        setTitleList((prev: any) => {
            const newChat = { title_slug: titleSlug, title: 'New Chat', date: new Date().toISOString() };
    
            const todayExists = prev.some((item: any) => item.category === "Today");

            return todayExists
                ? prev.map((item: any) =>
                      item.category === "Today"
                          ? { ...item, data: [newChat, ...item.data] }
                          : item
                  )
                : [{ category: "Today", data: [newChat] }, ...prev];
        });
    }, [isNewChat, titleSlug, isFetching]);

    useEffect(() => {
        if (isFetching && chatListData?.data?.list?.length > 0) {
            // setTitleList((prev: any) => categorizeData(chatListData.data.list, prev))
            setTitleList((prev: any) => ([...prev,...chatListData.data.list]))
        }
    }, [chatListData, isFetching])

    const fetchMoreData = () => {
        setPageNumber((prevPage) => {
            const nextPage = prevPage + 1;
            dispatch(getChatListApi({
                page: nextPage,
                page_size: limit
            }))
            return nextPage;
        });
    };
    
    const handleNewChat = () =>{
        cancelAllRequests();
        dispatch(addNewMessage({
            message: "",
            isNew:false
        }));
        setActiveChat(null);            
        navigate("/scope3/ai-agent");
    }

    return {
        titleList,
        isLoadingChatList,
        fetchMoreData,
        chatListData,
        navigate,
        pageNumber,
        limit,
        activeChat, setActiveChat,
        handleNewChat,
        isPEPCompany
    }
}

export default ChatListController