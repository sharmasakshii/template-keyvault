import React, { useRef, forwardRef } from "react";
import InputMask from 'react-input-mask';

import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const CustomInput = forwardRef((props: any, ref) => {
    return <InputMask
        mask="99/99/9999"
        placeholder="MM/DD/YYYY"
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        data-testid={props?.dataTestId}
    >
        {(inputProps) => <input {...inputProps} onClick={props?.onClick} ref={ref} />}
    </InputMask>;
});

const DatePicker = ({
    selectDate,
    setSelectDate,
    minDate,
    maxDate,
    dataTestId,
    onChange = () => { }
}: any) => {
    const inputRef = useRef(null);
    const handleChangeRaw = (date: any) => {
        const x = new Date(selectDate);
        const y = new Date(date.currentTarget.value);

        const newRaw: any = new Date(date.currentTarget.value);
        if (newRaw instanceof Date && !isNaN(newRaw.getTime())) {
            if (x <= y) {
                setSelectDate(newRaw);
            }
        }
    };

    return (
        <div className='select-box'>
            <ReactDatePicker
                data-testid="date-picker"
                dateFormat="MM-dd-yyyy"
                showIcon
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 48 48"
                    >
                        <mask id="ipSApplication0">
                            <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
                                <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                                <path
                                    fill="#fff"
                                    d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                                ></path>
                            </g>
                        </mask>
                        <path
                            fill="currentColor"
                            d="M0 0h48v48H0z"
                            mask="url(#ipSApplication0)"
                        ></path>
                    </svg>
                }
                selected={selectDate ? new Date(moment(selectDate).format("YYYY-MM-DD")) : null}
                onChange={(date: any) => {
                    setSelectDate(date);
                    onChange()
                }}
                customInput={<CustomInput dataTestId={dataTestId}
                    inputRef={inputRef} value={selectDate} handleChangeRaw />}
                onChangeRaw={handleChangeRaw}
                minDate={minDate ? new Date(moment(minDate).format("YYYY-MM-DD")) : null}
                maxDate={maxDate ? new Date(moment.utc(maxDate).format("YYYY-MM-DD")) : null}
            // onKeyDown={(e) => {
            //     e.preventDefault();
            // }}
            />

        </div>

    );
}

export default DatePicker