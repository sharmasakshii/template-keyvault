import React from 'react'

const CarrierTableHeader = () => {
  return (
    <thead>
      <tr>
        <th>
            Carrier
        </th>
        <th>
          Emissions Intensity
          <h5 className="mb-0 font-10">
            gCO2e / Ton-Mile of freight
          </h5>
        </th>
        <th>Total Shipments</th>
        <th>
          Total Emissions
          <h5 className="mb-0 font-10">tCO2e</h5>
        </th>
      </tr>
    </thead>
  )
}

export default CarrierTableHeader