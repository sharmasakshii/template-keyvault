// Import necessary modules and functions from external files
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import { addNewMessage, getSearchChatHistory, removeSearchChatHistory } from "store/scopeThree/chatbot/chatBotSlice";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

/**
 * A custom hook that contains all the states and functions for the LocalFreightController
 */
const SearchBarController = () => {
    // Define dispatch and navigate functions
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [query, setQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Get relevant data from Redux store using selector hooks
    const {
        searchChatHistory,
        searchChatHistoryLoading,
    } = useAppSelector((state: any) => state.chatBot);


    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setQuery(e.target.value);
        setIsDropdownOpen(true);
        dispatch(getSearchChatHistory({ search: e.target.value }))
       
    };
    // Handle search selection
    const handleSearch = (search: string): void => {
        setQuery(search);
        setIsDropdownOpen(false);
    };

    // Handle outside click to close dropdown
    const handleClickOutside = (event: MouseEvent): void => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
        ) {
            setIsDropdownOpen(false);
        }
    };

    // Trigger search when button is clicked
    const handleButtonClick = async (e:any) => {
        e.preventDefault()
        if(query.length > 0){
            dispatch(addNewMessage({
                message: query,
                isNew: true
            })).finally(()=>{
                setQuery("");
                navigate(`/scope3/ai-agent/${uuidv4()}`);
            })
        }
    };

    // Add and clean up event listener for outside click
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onRemoveSearch = async (id: any) => {
        await dispatch(
            removeSearchChatHistory({
                "chatId": id
            }))
        await dispatch(getSearchChatHistory({ search: query }))
    }

    // Effect to fetch lane reduction detail graph data
    // Return all the states and functions
    return {
        query,
        inputRef,
        handleChange,
        handleButtonClick,
        isDropdownOpen,
        onRemoveSearch,
        dropdownRef,
        handleSearch,
        searchChatHistory,
        searchChatHistoryLoading,
        isFocused, setIsFocused
    };
};

export default SearchBarController;
