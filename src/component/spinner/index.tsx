import React from 'react'

interface SpinnerComponentProps {
  spinnerClass?: string;
}

const Spinner: React.FC<SpinnerComponentProps> = ({ spinnerClass = "", ...arg }) => {
  return (
    <div {...arg} className={`d-flex align-items-center gap-2 ${spinnerClass}`}>
      <div className="spinner-border spinner-ui">
        <span className="visually-hidden"></span>
      </div>
    </div>
  )
}

export default Spinner