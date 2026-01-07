import React from 'react'

const LaneTableHeader = ({companyName}:any) => {
    return (
        <thead>
            <tr>
                <th>
                    <div className="d-flex align-items-center mb-0">
                        Lane{" "}
                    </div>
                </th>
                <th>
                    {companyName}{" "}
                    <h5 className="mb-0 font-10">
                        gCO2e / Ton-Mile of freight
                    </h5>
                </th>
                <th>
                    Industry Average
                    <h5 className="mb-0 font-10">
                        gCO2e / Ton-Mile of freight
                    </h5>
                </th>
            </tr>
        </thead>
    )
}

export default LaneTableHeader