import React from 'react';
import Logo from '.';
import { Link } from 'react-router-dom';
import { routeKey } from "constant"
import { isPermissionChecked } from 'utils';
import { useAppSelector } from "store/redux.hooks"; // Import custom Redux hooks


interface LinkLogoProps {
    url: string;
    data: any;
}

const LinkLogo: React.FC<LinkLogoProps> = ({ url, data }) => {
    const { loginDetails } = useAppSelector((state) => state.auth);
    const permissionsDto = loginDetails?.data?.userdata?.permissionsData || []
    return (
        <>
            {isPermissionChecked(permissionsDto, routeKey?.Segmentation)?.isChecked ?
                (<Link to={url} data-testid="linkView">
                    <Logo
                        path={data?.carrier_logo}
                        name={data?.carrier_name}
                    />
                </Link>) : (
                    <Logo
                        path={data?.carrier_logo}
                        name={data?.carrier_name}
                    />
                )}
        </>

    );
};


export default LinkLogo;

