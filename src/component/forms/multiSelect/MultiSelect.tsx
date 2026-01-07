import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Select, { components } from "react-select";
import ImageComponent from "../../images";
import Heading from "component/heading";
import { useLocation } from "react-router-dom";

export type OptionType = {
  value: number | string;
  label: string;
  product_name: string;
  product_code: string;
};

const Option = (optionProps: any) => {
  const { data, selectProps, isSelected, innerRef, innerProps } = optionProps;
  const isSelectAll = data?.value === "__select_all__";
  const scope = selectProps.scope;
  if (isSelectAll && scope !== "scope3") return null;

  const allOptions = selectProps.options.filter(
    (opt: any) => opt.value !== "__select_all__"
  );
  const selectedValues = Array.isArray(selectProps.value)
    ? selectProps.value
    : [];
  const selectedBySelectAll = selectProps.selectedBySelectAll || [];

  const allSelected = allOptions.every((opt: any) =>
    selectedValues.some((sel: any) => sel.value === opt.value)
  );

  const handleSelectAll = () => {
    if (allSelected) {
      selectProps.setSelectedBySelectAll([]);
      selectProps.onChange([]);
    } else {
      const updatedSelection = allOptions
        .filter(
          (opt: any) =>
            !selectedValues.some((sel: any) => sel.value === opt.value)
        )
        .concat(selectedValues);
      selectProps.setSelectedBySelectAll(allOptions);
      selectProps.onChange(updatedSelection);
    }
  };

  const handleChange = () => {
    optionProps.selectOption(data);
    if (selectedBySelectAll.some((opt: any) => opt.value === data.value)) {
      const updated = selectedBySelectAll.filter(
        (opt: any) => opt.value !== data.value
      );
      selectProps.setSelectedBySelectAll(updated);
    }
  };

  const { onKeyDown, ...restInnerProps } = innerProps;

  if (isSelectAll) {
    return (
      <button
        ref={innerRef}
        className="cursor btn-transparent border-0 w-100 d-flex align-items-center px-2 py-1"
        tabIndex={-1}
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelectAll();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelectAll();
        }}
        onKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <input
          className="checkbox-color form-check-input"
          type="checkbox"
          checked={allSelected}
          readOnly
        />
        <span className="ms-1">{data.label}</span>
      </button>
    );
  }

  return (
    <div ref={innerRef} className="cursor d-flex align-items-center px-2 py-1">
      <button
        {...restInnerProps}
        className="d-flex align-items-center w-100 cursor m-0 border-0 p-0 bg-transparent"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleChange();
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            handleChange();
          }
        }}
      >
        <input
          className="checkbox-color form-check-input"
          type="checkbox"
          checked={isSelected}
          readOnly
        />
        <span className="ms-1 text-start">{data.label}</span>
      </button>
    </div>
  );
};

// ---- Chip Component ----
const Chip = ({
  option,
  removeOption,
}: {
  option: any;
  removeOption: (opt: any) => void;
}) => {
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    removeOption(option);
  };

  return (
    <span className="px-2 py-1 rounded-pill bg-success-subtle d-flex align-items-center">
      {option.label ?? option.product_name}
      <button
        type="button"
        className="ms-1 border-0 bg-transparent"
        onMouseDown={handleRemove}
      >
        ×
      </button>
    </span>
  );
};

// ---- Value Container ----
const ValueContainer = (props: any) => {
  const {
    getValue,
    selectProps,
    handleClearSelection,
    handleClearSelectSelection,
    disableClear,
    clearMessage = "",
    placeHolder = "",
    children,
  } = props;

  const selectedValues = getValue() || [];
  const selectedCount = selectedValues.length;
  const inputValue = selectProps.inputValue;
  const showAsChips = selectProps.showChips;

  return (
    <components.ValueContainer {...props} className="custom-value-container">
      <div className="d-flex align-items-center w-100 position-relative cursor">
        {children[1]}
        {!inputValue && (
          <div className="w-100 d-flex align-items-center justify-content-between">
            {(() => {
              if (selectedCount > 0) {
                if (showAsChips) {
                  return (
                    <div className="d-flex flex-wrap gap-1">
                      {selectedValues.slice(0, 3).map((opt: any) => (
                        <Chip
                          key={opt.value ?? opt.id}
                          option={opt}
                          removeOption={handleClearSelectSelection}
                        />
                      ))}
                      {selectedCount > 3 && (
                        <span className="px-2 py-1 rounded-pill bg-success-subtle d-flex align-items-center">
                          +{selectedCount - 3}
                        </span>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <>
                      <Heading level="6" className="font-12 mb-0">
                        {clearMessage}
                      </Heading>
                      <button
                        disabled={disableClear}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleClearSelection();
                        }}
                        className="d-flex gap-1 crossBtn cursor"
                      >
                        {selectedCount}
                        {!disableClear && (
                          <ImageComponent
                            path="/images/crossbtn.svg"
                            className="pe-0"
                          />
                        )}
                      </button>
                    </>
                  );
                }
              } else {
                return (
                  <Heading
                    level="6"
                    className="font-12 mb-0 pe-none"
                    style={{ pointerEvents: "none" }}
                  >
                    {placeHolder}
                  </Heading>
                );
              }
            })()}
          </div>
        )}
      </div>
    </components.ValueContainer>
  );
};


// ---- Main MultiSelect ----
const MultiSelect = ({
  handleClearSelection,
  handleClearSelectSelection,
  selectedOptions,
  clearMessage,
  placeHolder,
  onInputChange,
  isSearchable = false,
  disableClear = false,
  options = [],
  onChange,
  ...props
}: any) => {
  const location = useLocation();
  const scope = useMemo(() => {
    const pathParts = location.pathname.split("/");
    return pathParts[1];
  }, [location.pathname]);
 
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectedBySelectAll, setSelectedBySelectAll] = useState<any[]>([]);
  const selectRef = useRef<any>(null);

  const enhancedOptions = useMemo(
    () => [{ label: "Select All", value: "__select_all__" }, ...options],
    [options]
  );
  const customComponents = useMemo(
    () => ({
      Option: (optionProps: any) =>
        Option({
          ...optionProps,
          selectProps: {
            ...optionProps.selectProps,
            selectedBySelectAll,
            setSelectedBySelectAll,
            selectedOptions,
            scope,
          },
        }),
      ValueContainer: (valueProps: any) =>
        ValueContainer({
          handleClearSelection,
          handleClearSelectSelection,
          disableClear,
          clearMessage,
          placeHolder,
          ...valueProps,
        }),
    }),
    [
      selectedBySelectAll,
      selectedOptions,
      scope,
      handleClearSelection,
      handleClearSelectSelection,
      disableClear,
      clearMessage,
      placeHolder,
    ]
  );
 
  const handleMenuOpen = useCallback(() => setMenuIsOpen(true), []);
  const handleMenuClose = useCallback(() => setMenuIsOpen(false), []);
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setMenuIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 
  return (
    <div ref={selectRef} className="d-dropdown">
      <Select
        data-testid="multi-carrier-dropdown"
        {...props}
        value={selectedOptions}
        onChange={(val: any) => onChange(val)}
        options={enhancedOptions}
        isMulti
        tabSelectsValue={false}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        hideSelectedOptions={false}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => handleMenuOpen()}
        onMenuClose={() => handleMenuClose()}
        isSearchable={isSearchable}
        onInputChange={onInputChange}
        getOptionValue={(opt: any) =>
          (opt?.value ?? opt?.id)?.toString?.() ?? String(opt)
        }
        components={customComponents}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.stopPropagation();
            setMenuIsOpen(false);
          }
        }}
      />
    </div>
  );
};

export default MultiSelect;