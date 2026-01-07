import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { addNewMessage, getChatHistory, resetHistory } from "store/scopeThree/chatbot/chatBotSlice"
import commonService from "store/commonData/commonService"
import { useAppDispatch, useAppSelector } from "store/redux.hooks"
import { v4 as uuidv4 } from 'uuid';
import { generalAnswers } from "constant"

const CryptoJS = require("crypto-js");

const ChatSctionController = () => {
    const { titleSlug = "" } = useParams();
    const limit = 4
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [title, setTitle] = useState(titleSlug)
    const [items, setItems] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState('');
    const [messageList, setMessageList] = useState<any>([])
    const [pageNumber, setPageNumber] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [questionType, setQuestionType] = useState('track');
    const textareaRef = useRef(null);

    const scrollContainerRef: any = useRef(null);
    const { loginDetails } = useAppSelector((state) => state.auth);
    const { chatHistoryData, isLoadingChatHistory, isNewChat } = useAppSelector((state) => state.chatBot);

    useEffect(() => {
        setItems([])
        setMessageList([])
        dispatch(resetHistory())
        if (titleSlug) {
            setTitle(titleSlug)
        }
        if (titleSlug && !isNewChat?.isNew) {
            dispatch(getChatHistory({
                title_slug: titleSlug,
                page: 1,
                page_size: limit
            }))?.unwrap().then(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
                }
            }).catch((error) => {
                if (error?.data?.chat_not_found) {
                    navigate("/scope3/ai-agent")
                }
            })
        }
        setIsFetching(true)
    }, [dispatch, titleSlug]);

    useEffect(() => {
        if (isFetching && isNewChat?.message && isNewChat?.isNew && title) {
            const query = isNewChat?.message
            sendMessage(query);
        }
    }, [isNewChat, title, isFetching])

    useEffect(() => {
        if (isFetching && chatHistoryData?.data?.list?.length > 0 && title) {
            setItems((prev: any) => [...chatHistoryData.data.list, ...prev]);
        }
    }, [chatHistoryData, title, isFetching])

    const fetchMoreData = () => {
        setPageNumber((prevPage) => {
            const nextPage = prevPage + 1;
            dispatch(getChatHistory({
                title_slug: titleSlug,
                page: nextPage,
                page_size: limit
            }));
            return nextPage;
        });
    };

    const sendMessage = async (query: string) => {
        if (query.trim() === '') return;
        setIsLoading(true);
        setMessages('');

        const randomId: string = uuidv4();

        setMessageList((prev: any) => [
            ...prev,
            { question_id: randomId, question: query, response: "" }
        ]);

        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
        startStreaming(query, title, randomId, questionType)

        if (isNewChat?.message) {
            dispatch(addNewMessage({
                ...isNewChat, message: "", isNew: false
            }))
        }
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };

    const handleSubmitMessage = async (e: any) => {
        e.preventDefault()
        if (!titleSlug) {
            await dispatch(addNewMessage({
                message: messages, isNew: true
            })
            )
            navigate(`/scope3/ai-agent/${uuidv4()}`);
        } else {
            const textarea: any = textareaRef.current;
            if (textarea) {
                textarea.style.height = "auto"; // Reset height
            }
            sendMessage(messages)
        }
    }

    const onKeyDownHandler = (e: any) => {
        if (!isLoading) {
            if (e.keyCode === 13) {
                handleSubmitMessage(e);
            }
        }
    };


    const handleChange = (e: any) => {
        setMessages(e.target.value)
        adjustHeight();
    };

    const adjustHeight = () => {
        const textarea: any = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // Reset height
            textarea.style.height = Math.min(textarea.scrollHeight, 60) + "px"; // Max height
        }
    };


    const updateMessageList = (
        setMessageList: any,
        randomId: string,
        updates: (el: any) => any
    ) => {
        setMessageList((prev: any) =>
            prev.map((el: any) =>
                el.question_id === randomId ? { ...el, ...updates(el) } : el
            )
        );
    };

    function getSecureRandomIndex(max: number): number {
        const array = new Uint32Array(1);
        window.crypto?.getRandomValues(array);
        return array[0] % max;
    }

    const simulateTyping = async (
        updateMessage: (updates: (el: any) => any) => void,
        randomAnswer: string
    ): Promise<void> => {
        const words = randomAnswer.split(" ");
        const wordsPerInterval = 2;
        let wordIndex = 0;

        const appendChunk = (chunk: string) => {
            updateMessage((prev: any) => ({
                response: (prev.response ?? "") + chunk,
            }));
        };

        const finishTyping = (interval: NodeJS.Timeout, resolve: () => void) => {
            clearInterval(interval);
            updateMessage(() => ({ isLoading: true }));
            resolve();
        };

        return new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                if (wordIndex < words.length) {
                    const chunk =
                        words.slice(wordIndex, wordIndex + wordsPerInterval).join(" ") + " ";
                    appendChunk(chunk);
                    wordIndex += wordsPerInterval;
                } else {
                    finishTyping(interval, resolve);
                }
            }, 300);
        });
    };

    const startStreaming = async (
        query: string,
        title: string,
        randomId: string,
        questionType: string
    ) => {
        const token = loginDetails?.data?.token;
        const randomAnswer =
            generalAnswers[getSecureRandomIndex(generalAnswers.length)];

        const updateMessage = (updates: (el: any) => any) =>
            updateMessageList(setMessageList, randomId, updates);

        await simulateTyping(updateMessage, randomAnswer);

        try {
            const responseStream: any = await commonService.sendMessageBotApi({
                query,
                randomId,
                questionType,
                title,
                token,
            });

            const isStreaming = responseStream.headers
                .get("content-type")
                ?.startsWith("text/event-stream");

            const reader = responseStream.body.getReader();
            const decoder = new TextDecoder();
            const key = CryptoJS.SHA256(process.env.REACT_APP_EN_KEY);

            while (true) {
                const { done, value } = await reader.read();
                const chunk = decoder.decode(value ?? new Uint8Array(), {
                    stream: true,
                });

                const decryptedData = CryptoJS.AES.decrypt(chunk, key, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7,
                }).toString(CryptoJS.enc.Utf8);

                if (done) {
                    updateMessage(() => ({ isLoading: false }));
                    break;
                }

                updateMessage((prev: any) => ({
                    response: isStreaming
                        ? (prev.response ?? "") + decryptedData
                        : decryptedData,
                }));
            }

            setIsLoading(false);
        } catch (error: any) {
            updateMessage(() => ({
                response: error?.response?.data?.message ?? error?.message,
                response_type: "error",
                isLoading: false,
            }));

            setIsLoading(false);
            toast.error("Something went wrong.");
        }
    };

    return {
        items,
        isLoadingChatHistory,
        fetchMoreData,
        scrollContainerRef,
        isLoading,
        handleSubmitMessage,
        onKeyDownHandler,
        messages, setMessages,
        messageList,
        titleSlug,
        chatHistoryData,
        pageNumber,
        textareaRef,
        handleChange,
        setQuestionType
    }
}

export default ChatSctionController