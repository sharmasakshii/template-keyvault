import Heading from 'component/heading';
import TableBodyLoad from 'component/tableBodyHandle';
import { Col } from 'reactstrap';
import { formatNumber } from "utils";

const ExpensiveLanesTable = (props: any) => {
    const { title, laneData, isloading } = props
    return (
        <Col lg="6">
            <div className='mainGrayCards lanesTableBid h-100'>
                <div className='headingLine p-3 border-bottom'>
                    <Heading level="5" content={title} className="font-18 font-xxl-20 fw-semibold mb-0" />
                </div>
                <div className='p-3 pt-0 px-0'>
                    <div className="static-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Lane
                                    </th>
                                    <th>
                                        Highest Bid (SCAC)
                                    </th>
                                    <th>
                                        Average Bid
                                    </th>
                                    <th className='w-auto'>
                                        Lowest Bid (SCAC)
                                    </th>
                                </tr>
                            </thead>
                            <TableBodyLoad isLoading={isloading} isData={laneData?.length > 0} colSpan={4} noDataMsg="No Data Found" >
                                <tbody>
                                    {laneData?.map((item: any) => (
                                        <tr key={item?.lane_name}>
                                            <td>
                                                <Heading
                                                    level="5"
                                                    className="font-14 font-xxl-16 fw-normal mb-0 file-name">
                                                    {item?.lane_name.split("_").join(" to ")}
                                                    <div className='tootltip-div'>
                                                        {item?.lane_name.split("_").join(" to ")}
                                                    </div>
                                                </Heading>
                                            </td>
                                            <td>
                                                ${formatNumber(
                                                    true,
                                                    item?.max_rpm,
                                                    2
                                                )} ({item?.carrier_max})
                                            </td>
                                            <td>
                                                ${formatNumber(
                                                    true,
                                                    item?.avg_rpm,
                                                    2
                                                )}
                                            </td>
                                            <td className='w-auto'>
                                                ${formatNumber(
                                                    true,
                                                    item?.min_rpm,
                                                    2
                                                )} ({item?.carrier_min})
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </TableBodyLoad>
                        </table>
                    </div>
                </div>
            </div>
        </Col>
    )

}
export default ExpensiveLanesTable