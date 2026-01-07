import { useTranslation } from 'react-i18next';
import ImageComponent from '../../component/images';
import { sortIcon, formatUnit } from 'utils';

const LaneTableHeading = ({ handleChange, column, order, emissionIntensity, totalShipments, totalEmissions, shipmentCount, configConstants }: any) => {
  const { t } = useTranslation()
  return (
    <thead>
      <tr>
        <th>
          <div>{t('carrierTitle')}</div>
        </th>
        <th data-testid={emissionIntensity} onClick={() => handleChange("intensity")}>
          <div className="d-flex">
            <div>
              <div className="d-flex align-items-center">
                {t('emissionIntensityHeading')}
              </div>
              <h6>
                {`*gCO2e / Ton-${formatUnit(configConstants?.data?.default_distance_unit)} of freight`}
              </h6>
            </div>

            <span className="pe-auto"><ImageComponent imageName={`${sortIcon("intensity", column, order)}`} /></span>
          </div>


        </th>
        <th data-testid={totalShipments} className="pointer " onClick={() => handleChange("shipment_count")}>
          <div className="d-flex">
            {t('totalShipmentHeading')}
            <span><ImageComponent imageName={`${sortIcon("shipment_count", column, order)}`} /></span>
          </div>
        </th>
        <th data-testid={totalEmissions} onClick={() => handleChange("emissions")} >
          <div className="d-flex">
            <div>
              <div className="d-flex align-items-center">
                {t('totalEmissionHeading')}
              </div>
              <h6>tCO2e</h6>
            </div>
            <span ><ImageComponent imageName={`${sortIcon("emissions", column, order)}`} /></span>
          </div>
        </th>
        <th data-testid={shipmentCount} className="d-flex" onClick={() => handleChange("shipment_counts")}>
          <div className="d-flex align-items-center" >
            Share of Tonnage
            <br />
            Shipped on this Lane
          </div>
          <span ><ImageComponent imageName={`${sortIcon("shipment_counts", column, order)}`} />
          </span>
        </th>
      </tr>
    </thead>
  )
}

export default LaneTableHeading