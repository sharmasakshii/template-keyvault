import React from "react";
import ImageComponent from "component/images/index";
import ButtonComponent from "component/forms/button";
import "scss/aiAgent/_index.scss";
import SearchBarController from "./searchBarController";
import { DebounceInput } from "react-debounce-input";
import Spinner from "component/spinner";

const SearchBar: React.FC = () => {
    const {
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
        isFocused,
         setIsFocused
    } = SearchBarController()

    return (<>
        {isFocused ? <div className={`overlay`}>
        </div> : <></>}

        <div className={`search-container mb-3 position-relative`} style={{zIndex: isFocused ? 99 : 1}} >
            {/* Search Input */}
            <form className="d-flex gap-2 position-relative " onSubmit={handleButtonClick}>
                <div className="search-bar d-flex align-items-center">
                    <div className="d-flex align-items-center w-100">
                        <ImageComponent path="/images/chatbot/ai-agent.svg" className="pe-0" />
                        <DebounceInput
                            inputRef={inputRef}
                            type="text"
                            onFocus={()=>setIsFocused(true)}
                            onBlur={()=>setIsFocused(false)}
                            data-testid="role-search-input"
                            debounceTimeout={300}
                            placeholder="GreenSight decarbonization agent. Ask me a question."
                            className="form-control search-input"
                            value={query}
                            onChange={handleChange}
                        />
                    </div>

                </div>
                <ButtonComponent
                    text=""
                    type="submit"
                    btnClass="btn-transparent px-0"
                    imagePath={query?.length === 0 ? "/images/chatbot/disabled-btn.svg" : "/images/chatbot/enter.svg"}
                    disabled={query?.length === 0}
                />
            </form>
            {/* Dropdown */}
            {isDropdownOpen && (
                <div ref={dropdownRef} className="search-dropdown">
                    <div className="dropdown-header">Recent Searches</div>
                    {searchChatHistoryLoading && <Spinner spinnerClass='py-3 justify-content-center' />}
                    {searchChatHistory?.data.map((search: any) => (
                        <div key={search?.question} className="dropdown-item d-flex justify-content-between">
                            <button type="button" className="d-flex align-items-center p-0 border-0 bg-transparent" onClick={() => handleSearch(search?.question)}>
                                <ImageComponent path="/images/chatbot/old-search.svg" />
                                <span className="question">{search?.question}</span>
                            </button>
                            <ButtonComponent
                                imagePath="/images/chatbot/cross.svg"
                                btnClass="pe-0 btn-transparent"
                                onClick={() => onRemoveSearch(search?.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    </>
    );
};

export default SearchBar;
