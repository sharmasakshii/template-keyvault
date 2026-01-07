import React from 'react';
import { getImageUrl } from 'utils';
interface LogoProps {
    path: string;
    name: string;
    active?: string;
}

const Logo: React.FC<LogoProps> = ({ path, name = "", active = "" }) => {
    return (
        <>{
            path ? (
                <div key={name} className="logo-icon-name-wrapper carrier-comparisionImg w-auto gap-2 d-flex align-items-center border-0 border-right-green me-0 pb-2 pe-4 pt-0">
                
                    <img
                        src={path && getImageUrl(path)}
                        alt="logo"
                        className=" profileimgWrap"
                    />
                </div>
            ) : (
                <div key={name} className="logo-icon-name-wrapper border-0 border-right-green me-0 d-flex align-items-center p-2">
                    <div
                        className={`${active}`}
                    />
                    <div className='imgTxtWrap'>
                        <span className="logo-icon-name">
                            {name?.substring(0, 2)}
                        </span>
                    </div>

                </div>
            )
        }

        </>
    );
};

export default Logo;

