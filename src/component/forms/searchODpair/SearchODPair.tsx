import React, {
  useState,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { Form } from "reactstrap";
import ImageComponent from "../../images";
import ButtonComponent from "../button";
import SelectDropdown from "../dropdown";
import { useAppDispatch, useAppSelector } from "store/redux.hooks";
import {
  laneDestinationSearch,
  laneOriginSearch,
  resetLaneOdPair,
} from "store/scopeThree/track/lane/laneDetailsSlice";

const SearchODPair = forwardRef(
  (
    {
      handleGetSearchData,
      handleResetODpair,
      handleChangeLocation,
      page,
      odParams = {},
      isDisabled,
      radiusOptions,
      radius,
      handleRadiusChange,
      showRadius = false,
      interModalPadding = false,
    }: any,
    ref
  ) => {
    const [originCity, setOriginCity] = useState<any>(null);
    const [destinationCity, setDestinationCity] = useState<any>(null);
    const [menuIsOpen1, setMenuIsOpen1] = useState(false);
    const [menuIsOpen2, setMenuIsOpen2] = useState(false);
    const searchODPairRef = useRef<any>(null);

    const {
      laneOriginData,
      laneDestinationData,
      isLaneOriginLoading,
      isLaneDestinationLoading,
    } = useAppSelector((state) => state.lane);
    const originOptions = laneOriginData?.data?.map((ele: any) => {
      return { label: ele?.origin, value: ele?.origin };
    });
    const destinationOptions = laneDestinationData?.data?.map((ele: any) => {
      return { label: ele?.dest, value: ele?.dest };
    });
    const dispatch = useAppDispatch();
    useEffect(() => {
      dispatch(resetLaneOdPair());
    }, [dispatch]);

    const handleSearchDestination = (data: any) => {
      dispatch(
        laneDestinationSearch({
          type: "dest",
          source: originCity?.value || "",
          keyword: data,
          page: page,
          ...odParams,
        })
      );
    };

    const handleSearchOrigin = (data: any) => {
      if (data) {
        dispatch(
          laneOriginSearch({
            type: "origin",
            keyword: data,
            page: page,
            ...odParams,
          })
        );
        setDestinationCity("");
      }
    };

    const searchDestination = (e: any) => {
      if (e?.value) {
        dispatch(
          laneDestinationSearch({
            type: "dest",
            source: e?.value,
            keyword: "",
            page: page,
            ...odParams,
          })
        );
      }
    };
    const handleOriginMenuChange = (event: any) => {
      event.stopPropagation();
      setMenuIsOpen1(!menuIsOpen1);
      setMenuIsOpen2(false);
    };
    const handleDestinationMenuChange = (event: any) => {
      event.stopPropagation();
      setMenuIsOpen1(false);
      setMenuIsOpen2(!menuIsOpen2);
    };

    const handleApplyFilter = () => {
      handleGetSearchData();
      handleChangeLocation(originCity?.value, destinationCity?.value);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const container = document.getElementById("search-odpair-wrapper");
        if (container && !container.contains(event.target as Node)) {
          setMenuIsOpen1(false);
          setMenuIsOpen2(false);

        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (laneDestinationData?.data?.length === 1) {
        setDestinationCity({
          label: laneDestinationData?.data[0]?.dest,
          value: laneDestinationData?.data[0]?.dest,
        });
      }
    }, [laneDestinationData]);

    const isShowRadius = showRadius && odParams?.fuel_type !== "is_intermodal"



    return (
      <div id="search-odpair-wrapper">
        <Form
          ref={searchODPairRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleApplyFilter();
          }}
        >
          <div className="select-box d-flex flex-wrap align-items-end gap-2 p-3">
            {isShowRadius && (
              <div className='radius-checkbox'>
                <SelectDropdown
                  menuPlacement="bottom"
                  aria-label="status-dropdown"

                  options={radiusOptions}
                  placeholder="Radius"
                  selectedValue={radiusOptions?.filter(
                    (el: any) => el.value === radius
                  )}
                  onChange={handleRadiusChange}
                />
              </div>
            )}
            <button
              type="button"
              className="search-icon-img p-0 border-0 cursor"
              onClick={handleOriginMenuChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleOriginMenuChange(event);
                }
              }}
            >
              {isLaneOriginLoading ? (
                <div className="dropdownSpinner">
                  <div className="spinner-border ">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : (
                <span className="height-0 d-block">
                  <ImageComponent
                    path="/images/search.svg"
                    className="pe-0 search-img"
                  />
                </span>
              )}
              <div>
                <SelectDropdown
                  aria-label="origin-dropdown"
                  disabled={isDisabled}
                  placeholder="Enter Origin"
                  isSearchable={true}
                  selectedValue={originCity}
                  menuIsOpen={menuIsOpen1}
                  onChange={(e: any) => {
                    setOriginCity(e);
                    searchDestination(e);
                    setMenuIsOpen1(false);
                  }}
                  onInputChange={(e: any) => {
                    handleSearchOrigin(e);
                  }}
                  options={originOptions}
                  customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize text-start"
                />
              </div>
            </button>
            <button
              type="button"
              className="search-icon-img p-0 border-0 cursor"
              onClick={(event) => handleDestinationMenuChange(event)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleDestinationMenuChange(event);
                }
              }}
            >
              {isLaneDestinationLoading ? (
                <div className="dropdownSpinner">
                  <div className="spinner-border ">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : (
                <span className="height-0 d-block">
                  <ImageComponent
                    path="/images/search.svg"
                    className="pe-0 search-img"
                  />
                </span>
              )}
              <div>
                <SelectDropdown
                  aria-label="destination-dropdown"
                  disabled={isDisabled}
                  placeholder="Enter Destination"
                  isSearchable={true}
                  selectedValue={destinationCity}
                  menuIsOpen={menuIsOpen2}
                  onChange={(e: any) => {
                    setDestinationCity(e);
                    setMenuIsOpen2(false);
                  }}
                  onInputChange={(e: any) => {
                    if (e.length >= 3) {
                      handleSearchDestination(e);
                    }
                  }}
                  options={destinationOptions}
                  customClass="ms-0 mt-2 mt-lg-0 searchdropdown text-capitalize text-start"
                />
              </div>
            </button>
            <div className="d-flex gap-2 filter-btns">
              <ButtonComponent
                text="Apply"
                type="submit"
                btnClass={`btn-deepgreen font-14 ${interModalPadding ? '' : 'py-2 px-4'}`}
                disabled={!(originCity?.value ?? destinationCity?.value)}
                data-testid="apply-button"
              />
              <ButtonComponent
                text="Reset"
                btnClass={`btn-deepgreen font-14 ${interModalPadding ? '' : 'py-2 px-4'}`}
                onClick={() => {
                  handleResetODpair();
                  setOriginCity(null);
                  setDestinationCity(null);
                  dispatch(resetLaneOdPair());
                }}
                disabled={!(originCity?.value ?? destinationCity?.value)}
                data-testid="reset-button"
              />
            </div>
          </div>
        </Form>
      </div>
    );
  }
);

export default SearchODPair;