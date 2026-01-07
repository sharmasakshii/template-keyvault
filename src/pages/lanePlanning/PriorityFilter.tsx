import { FormGroup, Input, Label } from "reactstrap";


const PriorityFilter = ({ priority, setPriority }: any) => {
    return (
        <>
            <FormGroup check  >
                <Input data-testid="emission-id" type="checkbox" name="emission" checked={priority["emission"]} onChange={() => setPriority((pre: any) => ({ ...pre, emission: !priority["emission"] }))} />
                <Label check>Emissions</Label>
            </FormGroup>
            <FormGroup check>
                <Input data-testid="time-id" type="checkbox" checked={priority["time"]} onChange={() => setPriority((pre: any) => ({ ...pre, time: !priority["time"] }))} />
                <Label check>Time</Label>
            </FormGroup>
            <FormGroup check>
                <Input data-testid="cost-id" type="checkbox" checked={priority["cost"]} onChange={() => setPriority((pre: any) => ({ ...pre, cost: !priority["cost"] }))} />
                <Label check>Cost</Label>
            </FormGroup>
            <FormGroup check>
                <Input data-testid="distance-id" type="checkbox" checked={priority["distance"]} onChange={() => setPriority((pre: any) => ({ ...pre, distance: !priority["distance"] }))} />
                <Label check>Distance</Label>
            </FormGroup>
            <p data-testid="priority-errors" className="dangerTxt">{!Object.values(priority).some(value => value) && "Please select atleast one priority."}</p>
        </>
    )
}

export default PriorityFilter