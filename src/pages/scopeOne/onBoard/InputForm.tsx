import SelectDropdown from "component/forms/dropdown";
import { Button, FormGroup, Input, Label } from 'reactstrap'
import Heading from 'component/heading'

const InputForm = (props: any) => {
    const {
        item,
        handleChangeInput,
        dataTestId
    } = props
    const selectIDs = item?.user_answers?.map((x: any) => x?.user_option_id || '') || []
    switch (item?.question_type) {
        case "Select":
            return (

                <SelectDropdown
                    options={item?.options?.map((x: any) => ({ label: x?.value, value: x?.option_id }))}
                    placeholder="Select industry"
                    customClass=" quarterDropdown"
                    aria-label={`${dataTestId}`}
                    onChange={(e: any) => handleChangeInput(e, item)}
                    selectedValue={item?.options?.filter((x: any) => selectIDs?.includes(x?.option_id))?.map((x: any) => ({ label: x?.value, value: x?.option_id }))}
                />
            )
        case "Radio":
            return (
                <div className='d-flex gap-2 flex-wrap'>
                    {item?.options?.map((x: any) => (
                        <Button key={x?.option_id} className={`${x?.option_id === item?.user_answers?.[0]?.user_option_id ? "active" : ""} fuel-inner cursor`}>
                            <Label>
                                <Input
                                    data-testid={`${dataTestId}-${x?.option_id}`}
                                    type="checkbox"
                                    name="fuelOptions"
                                    value={x?.option_id}
                                    onChange={(e: any) => handleChangeInput({ value: x?.option_id, label: x?.value }, item)}
                                    checked={x?.option_id === item?.user_answers?.[0]?.user_option_id}
                                />{" "}
                                {x?.value}
                            </Label>
                        </Button>

                    ))}
                </div>
            )

        case "Text":
            return (
                <FormGroup>
                    {item?.options?.map((x: any) => (
                        <Input
                            key={x?.option_id}
                            id="exampleText"
                            type="textarea"
                            data-testid={`${dataTestId}`}
                            name={x?.option_id}
                            onChange={(e: any) => handleChangeInput(e, item)}
                            value={item?.user_answers?.[0]?.answer_text}
                        />
                    ))}
                </FormGroup>
            )
        case "Checkbox":
            return (
                <>
                    {item?.options?.map((x: any) => (
                        <div key={x?.option_id} className='d-flex gap-2 mb-3'>
                            <Label>
                                <Input
                                    type="checkbox"
                                    value={x?.option_id}
                                    name={x?.value}
                                    data-testid={`${dataTestId}-${x?.option_id}`}
                                    onChange={(e: any) => handleChangeInput(e, item)}
                                    checked={selectIDs?.includes(x?.option_id)
                                    }
                                />{" "}
                            </Label>
                            <Heading
                                level="4"
                                content={x?.value}
                                className="font-xxl-16 font-14 fw-normal mb-0" />
                        </div>

                    ))}
                </>
            )
        default: return null
    }

}

export default InputForm