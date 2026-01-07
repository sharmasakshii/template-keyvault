import React from 'react';
import ImageComponent from '../../images';
import Spinner from "../../../component/spinner"

interface ButtonComponentProps {
  text?: string;
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
  alt?: string,
  type?: "button" | "submit";
  btnClass?: string,
  loaderClass?:string,
  disabled?: boolean,
  imagePath?: string; // New prop for the image source
  children?: any;
  isLoading?: boolean;
  title?: string;
  imageTooltipTitle?: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  text = "",
  onClick,
  style,
  imagePath,
  disabled = false,
  btnClass = "primary",
  loaderClass="",
  children,
  type = "button",
  title='',
  alt, // Include the imageSrc prop
  isLoading = false,
  imageTooltipTitle,
  ...arg
}) => {
  return (
    <button title={title} type={type} {...arg} className={disabled ? 'disabled-button' : btnClass} onClick={onClick} style={style} disabled={disabled}>
      {isLoading ? <Spinner spinnerClass={`loaderBtn ${loaderClass}`} /> : <>
        {imagePath && <ImageComponent path={imagePath} alt={alt} tooltipTitle={imageTooltipTitle} />} {text}
        {children}
      </>}
    </button>
  );
};

export default ButtonComponent;