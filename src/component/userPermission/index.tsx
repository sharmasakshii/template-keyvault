
import Heading from 'component/heading'
import { Row, Col } from "reactstrap";
import ImageComponent from "../images";
import { routeKey } from 'constant';


export const UserPermission = ({ permissionDetail }: any) => {
    return (
        <>
            {permissionDetail?.map((item: any) => (
                <div key={item?.title}>
                    {
                        item?.slug !== routeKey.ApplicationAccess ? (
                            <div className="mb-3">
                                <Row>
                                    <Col sm={4}>
                                        <div className="font-14 font-xxl-16 fw-semibold">
                                            {item?.title}:{" "}
                                        </div>
                                    </Col>
                                    <Col sm={8} className="ps-sm-0">
                                        <div className="d-flex flex-wrap gap-2">
                                            {item?.child?.filter((dto: any) => dto?.isChecked)?.length > 0 ? item?.child?.filter((dto: any) => dto?.isChecked)?.map((res: any) =>
                                                <div className="font-14 font-xxl-16" key={res?.id}>
                                                    <ImageComponent
                                                        path="/images/uploaded.svg"
                                                        className="img-fluid pe-1 pb-1"
                                                    />
                                                    {res?.title}
                                                </div>

                                            ) : "N/A"}
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                        ) : (
                            <div>
                                <Heading
                                    level="5"
                                    content={`${item?.title}:`}
                                    className="font-14 font-xxl-16 fw-semibold mb-2"
                                />
                                {item?.child?.map((res: any) => (
                                    <Row className="mb-2" key={res?.id}>
                                        <Col sm={4}>
                                            <div className="font-14 font-xxl-16">{res?.title}</div>
                                        </Col>
                                        <Col sm={8} className="ps-sm-0">
                                            {res?.child?.filter((dto: any) => dto?.isChecked)?.length > 0 ? res?.child?.filter((dto: any) => dto?.isChecked)?.map((result: any) => (
                                                <span className="font-14 font-xxl-16" key={result?.id}>
                                                    {" "}
                                                    <ImageComponent
                                                        path="/images/uploaded.svg"
                                                        className="img-fluid pe-1 pb-1"
                                                    />
                                                    {result?.title}
                                                </span>
                                            )) : "N/A"}
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        )
                    }
                </div>
            ))}
        </>
    )
}
