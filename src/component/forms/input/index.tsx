import { FormGroup, Label, Input } from "reactstrap";
const InputField = ({ type, name, Id, placeholder, label, onChange, value, onKeyDown, disabled=false, checked, onClick, testid, onBlur }: any) => {
    return (
        <FormGroup>
            <Label for={Id}>{label}</Label>
            <Input type={type} name={name} id={Id} checked={checked} onClick={onClick} placeholder={placeholder} disabled={disabled} data-testid={testid} onChange={onChange} value={value} onKeyDown={onKeyDown} onBlur={onBlur} />
        </FormGroup>
    )
}

export default InputField