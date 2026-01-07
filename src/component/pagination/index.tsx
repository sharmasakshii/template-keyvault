import React, { useEffect } from 'react';
import SelectDropdown from "component/forms/dropdown";
import { getPaginationOptions, numberOnly } from 'utils';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { pageSizeList, cardViewPageSizeList } from 'constant';
import { Input } from "reactstrap";
import ButtonComponent from 'component/forms/button';
import { toast } from 'react-toastify';

const Pagination = ({ currentPage = 1, isShowPageSize = true, cardType = false, pageSize = 10, pageSizeListDto = pageSizeList, handlePageSizeChange, total = 10, handlePageChange, pageSelectDisabled = false }: any) => {
    const [pageNumber, setPageNumber] = React.useState(currentPage);
    const paginationOption = getPaginationOptions(cardType ? cardViewPageSizeList : pageSizeListDto);

    useEffect(() => {
        setPageNumber(currentPage)
    }, [currentPage, pageSize])

    return (
        <div className="mt-3 px-sm-3 lane-pagination">
            <nav
                aria-label="Page navigation example"
                className=" d-flex flex-wrap gap-2 justify-content-sm-end justify-content-center align-items-center select-box"
            >
                {(total > 0 && isShowPageSize) && (
                    <SelectDropdown
                        aria-label="pagination-dropdown"
                        menuPlacement="top"
                        options={paginationOption}
                        disabled={pageSelectDisabled}
                        placeholder="Pages"
                        customClass="paginationDropdown"
                        selectedValue={pageSize}
                        onChange={(e: any) => {
                            handlePageSizeChange(e);
                        }}
                    />)}
                <div className="mb-0 ms-1 d-flex flex-wrap justify-content-sm-end justify-content-center gap-3 align-items-center" data-testid="pagination">
                    <PaginationControl
                        page={currentPage}
                        between={3}
                        total={total}
                        limit={pageSize?.value}
                        changePage={(page) => {
                            handlePageChange(page);
                        }}
                        ellipsis={1}
                    />
                    {total > 0 && <div className='d-flex gap-1 align-items-center font-14'>Page <Input
                        type="text"
                        name="name"
                        id="name"
                        className='pagination-input'
                        placeholder=""
                        onChange={(e: any) => {
                            setPageNumber(e.target.value)
                        }}
                        value={pageNumber}
                        onKeyDown={(e: any) => numberOnly(e)}
                    />
                        <ButtonComponent
                            text="Go"
                            btnClass="btn-transparent fw-semibold font-16 py-2 px-2"
                            onClick={() => {
                                if (Math.ceil(total / pageSize?.value) >= Number.parseInt(pageNumber) && 0 < Number.parseInt(pageNumber)) {
                                    handlePageChange(Number.parseInt(pageNumber));
                                } else {
                                    toast.error("Invalid Page Number")
                                }
                            }}

                        />
                    </div>
                    }
                </div>
            </nav>
        </div>
    );
};

export default Pagination;