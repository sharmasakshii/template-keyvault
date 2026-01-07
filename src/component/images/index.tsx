import React from "react";
import { getImageUrl, handleProfileImage } from "utils";

interface ImageProps {
  imageName?: string;
  alt?: string;
  className?: string;
  path?: string;
  handleImageError?: any;
  handleOnClick?: any;
  testid?: string;
  tooltipTitle?: string;
  enableBtn?: boolean
}

const Image: React.FC<ImageProps> = ({
  handleImageError = handleProfileImage,
  imageName,
  alt = "pic",
  className,
  path = "",
  handleOnClick,
  testid,
  tooltipTitle = "",
  enableBtn = true
}) => {
  const getImageName = (imageName: any) =>
    imageName ? require(`../../assets/images/${imageName}`) : "";
  const image =
    <img
      src={path ? getImageUrl(path) : getImageName(imageName)}
      alt={alt}
      data-testid={testid}
      className={`pe-1 ${className}`}
      onError={handleImageError}
    />

  return (
    <>
      {enableBtn ? <button
        type="button"
        onClick={handleOnClick}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={tooltipTitle}
        className="img-btn"
      > {image}</button>
        : image}</>
  );
};

export default Image;
