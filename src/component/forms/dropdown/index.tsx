import Select from "react-select";
import ImageComponent from "../../images/index";
import { useState } from "react";

// Separate the custom components configuration
const getCustomComponents = () => ({
  DropdownIndicator: (props: any) => (
    <div {...props.innerRef} className="pe-2 ps-2 cursor stopEvent">
      {<ImageComponent path="/images/select-icon.svg" className="pe-0" />}
    </div>
  ),
});

const customComponents = getCustomComponents();

const Dropdown = ({
  id = "exampleSelect",
  name = "select",
  options,
  onChange,
  disabled = false,
  placeholder,
  selectedValue,
  customClass = "",
  focusPoint = null,
  menuIsOpen,
  isSearchable = false,
  isClearable = false,
  onInputChange,
  menuPlacement = "auto",
  isMulti = false,
  inputValue,
  ...arg
}: any) => {
  // Get custom components outside of render logic

  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      {isFocused ? <div className={`overlay`}></div> : <></>}
      <div>
        <Select
          ref={focusPoint}
          menuIsOpen={menuIsOpen}
          id={id}
          name={name}
          value={selectedValue}
          placeholder={placeholder}
          options={options}
          isMulti={isMulti}
          inputValue={inputValue}
          // onFocus={()=>setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          isSearchable={isSearchable}
          components={customComponents}
          className={`custom-select ${customClass}`}
          onChange={onChange}
          selectionLimit={2}
          {...arg}
          onInputChange={onInputChange}
          isDisabled={disabled}
          menuPlacement={menuPlacement}
          isClearable={isClearable}
        />
      </div>
    </>
  );
};


export default Dropdown;
