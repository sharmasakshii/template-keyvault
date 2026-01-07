import InputField from 'component/forms/input';
import Heading from "component/heading";
import { Accordion } from 'react-bootstrap';
import { isApplicationTypeChecked } from "utils";
import { routeKey } from "constant"

const PermissionView = (props: any) => {
    const { moduleListDto, handleChangePremission, showErrorMessage } = props;

    const renderChild = (child: any, parentSlug?: string) => {
        return (
            <div className='d-flex align-items-center gap-2 forms'>
                <InputField
                    type="checkbox"
                    name="check-box"
                    Id="check-box"
                    testid={`role-permission-child-1-checkbox-${child?.slug}`}
                    checked={child?.isChecked}
                    onChange={(e: any) => handleChangePremission(e, child?.id, child?.parent_id)}
                    disabled={isApplicationTypeChecked(moduleListDto, routeKey.AdministratorAccess)}
                />
                <Heading level="5" content={child?.title} className="font-16 fw-normal mb-0" />
            </div>
        );
    };

    const renderSubChild = (res: any, parentSlug?: string) => {
        if (!res?.child?.length) return null;
        return (
            <div className='d-flex flex-wrap gap-5 align-items-center ps-4 mb-4 pb-2'>
                {res.child.map((dto: any) => renderChild(dto, res.slug))}
            </div>
        );
    };

    const renderItem = (iteam: any) => {
        const isApplicationAccess = iteam.slug === routeKey.ApplicationAccess;
        return (
            <Accordion.Item key={iteam?.title} eventKey={iteam?.id?.toString()} className='mb-3'>
                <Accordion.Header>
                    <div className='d-flex gap-2 forms'>
                        <InputField
                            type="checkbox"
                            name="check-box"
                            Id="check-box"
                            testid={`role-permission-checkbox-${iteam?.slug}`}
                            checked={iteam?.isChecked}
                            onChange={(e: any) => {
                                e.stopPropagation();
                                handleChangePremission(
                                    e,
                                    iteam?.id,
                                    iteam?.parent_id,
                                    iteam.slug === routeKey.AdministratorAccess ? routeKey.ApplicationAccess : null
                                );
                            }}
                            disabled={[routeKey.ApplicationAccess, routeKey.Scope1].includes(iteam.slug) &&
                                isApplicationTypeChecked(moduleListDto, routeKey.AdministratorAccess)
                            }
                            onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                        />
                        <Heading level="5" content={iteam?.title} className="font-18 fw-medium mb-0" />
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <div className={`align-items-center gap-5 row-gap-4 flex-wrap ${isApplicationAccess ? '' : 'd-flex'}`}>
                        {iteam.child?.map((res: any) => (
                            <div key={res.id}>
                                <div className='d-flex align-items-center gap-2 forms mb-3'>
                                    <InputField
                                        type="checkbox"
                                        name="check-box"
                                        Id="check-box"
                                        checked={res?.isChecked}
                                        testid={`role-permission-administrator-checkbox-${res?.slug}`}
                                        onChange={(e: any) =>
                                            handleChangePremission(
                                                e,
                                                res?.id,
                                                res?.parent_id,
                                                iteam.slug === routeKey.AdministratorAccess ? iteam.slug : null
                                            )
                                        }
                                        disabled={isApplicationAccess ? false : isApplicationTypeChecked(moduleListDto, routeKey.AdministratorAccess)}
                                    />
                                    <Heading level="5" content={res?.title} className="font-16 fw-medium mb-0" />
                                </div>
                                {isApplicationAccess && renderSubChild(res)}
                            </div>
                        ))}
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        );
    };

    return (
        <>
            <Heading level="5" content="Permissions" className="font-20 fw-semibold mb-3" />
            {moduleListDto?.length > 0 && (
                <Accordion
                    data-testid="role-permission-screen"
                    defaultActiveKey={moduleListDto.map((_: any, index: any) => index.toString())}
                >
                    {moduleListDto.map(renderItem)}
                </Accordion>
            )}
            {showErrorMessage && (
                <span className="text-danger font-14">
                    Please select atleast one permission access
                </span>
            )}
        </>
    );
};


export default PermissionView
