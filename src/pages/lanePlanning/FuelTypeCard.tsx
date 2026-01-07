import Heading from 'component/heading';
import ImageComponent from "../../component/images";
import Spinner from 'component/spinner';
import { fuelIcons, evFuelId } from "constant";

const FuelTypeCard = ({
  thresholdV,
  isCheckLaneFuelLoading,
  checkLaneFuelData,
  selectedFuelStop
}: any) => {
  return (
    <div className="mb-3 fuel-wrapper">
      <div className="d-flex gap-2 align-items-center mb-2 fuelAvalibility">
        Fuel Type Availability

        <div className="tooltip-wrapper">
          <ImageComponent
            path="/images/infoPrimary.svg"
            className="pe-0 cursor-pointer"
          />

          <div className="tooltip-box">
            Availability is determined by the threshold distance you enter.
            The threshold represents the maximum allowed gap between
            consecutive fuel stops of the selected fuel type along the lane.
          </div>
        </div>
      </div>

      <div className="cardAvalibility rounded-3">
        <Heading
          level="5"
          content={`Fuel types availability within ${thresholdV} miles threshold distance`}
          className="font-14 fw-medium mb-3"
        />

        {isCheckLaneFuelLoading ? (
          <Spinner spinnerClass="py-5 my-4 justify-content-center" />
        ) : (
          <div className="d-flex flex-column gap-2">
            {
              checkLaneFuelData?.data?.results?.filter((res: any) => res?.fuel !== '0')?.map((item: any) => (
                <div
                  key={item?.fuel}
                  className="d-flex align-items-center justify-content-between p-2 border rounded-3 bg-white"
                >
                  {item?.fuel === evFuelId ? (
                    <div className="d-flex align-items-center gap-2">
                      <ImageComponent
                        path={
                          fuelIcons['ev']
                        }
                        className="pe-0"
                      />
                      <Heading
                        level="5"
                        content={'EV'}
                        className="font-12 fw-normal mb-0"
                      />
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <ImageComponent
                        path={
                          fuelIcons[selectedFuelStop?.find(
                            (items: any) => items?.product_type_id === item?.fuel
                          )?.product_code?.toLowerCase() ?? 'default']
                        }
                        className="pe-0"
                      />
                      <Heading
                        level="5"
                        content={selectedFuelStop?.find(
                          (items: any) => items?.product_type_id === item?.fuel
                        )?.product_name}
                        className="font-12 fw-normal mb-0"
                      />
                    </div>
                  )}

                  <div>
                    {item?.isValid === 1 ? (
                      <ImageComponent
                        path={"/images/filled-tick.svg"}
                        className="pe-0"
                      />
                    ) : (
                      <ImageComponent
                        path={"/images/filled-cross.svg"}
                        className="pe-0"
                      />
                    )}
                  </div>
                </div>
              )
              )
            }

          </div>
        )}
      </div>
    </div>
  );
}

export default FuelTypeCard;
