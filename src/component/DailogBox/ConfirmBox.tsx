import { Modal, ModalBody, ModalHeader } from "reactstrap";
import ButtonComponent from "../forms/button/index";

const ConfirmBox = ({
    show,
    handleClose,
    modalHeader,
    secondaryBtnDisabled,
    primaryBtnDisabled,
    primaryButtonText,
    secondaryButtonText,
    primaryButtonClick,
    secondaryButtonClick,
    primaryButtonClass,
    secondaryButtonclass,
    primaryButtonTextDataTestId,
    secondaryButtonTextDataTestId
}: any) => {
    return (
        <Modal
            isOpen={show}
            toggle={handleClose}
            className="dataManagement"
            data-testid="toggle-close"
        >
            <ModalHeader toggle={handleClose} data-testid="toggle-header-close" className="p-0 pb-2">
                <p className="modal-title">{modalHeader}</p>
            </ModalHeader>
            <ModalBody className="p-0">
                <div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        {secondaryButtonText && <ButtonComponent

                            text={secondaryButtonText}
                            disabled={secondaryBtnDisabled}
                            onClick={secondaryButtonClick}
                            btnClass={secondaryButtonclass}
                            data-testid={secondaryButtonTextDataTestId}
                        />}
                        {primaryButtonText && <ButtonComponent
                            text={primaryButtonText}
                            disabled={primaryBtnDisabled}
                            onClick={primaryButtonClick}
                            btnClass={primaryButtonClass}
                            data-testid={primaryButtonTextDataTestId}
                        />}
                    </div>

                </div>
            </ModalBody>
        </Modal>
    );
};

ConfirmBox.defaultProps = {
    secondaryBtnDisabled: false,
    primaryBtnDisabled: false,
    primaryButtonText: "",
    secondaryButtonText: "",
    primaryButtonClass: "btn-deepgreenLg font-14 w-100",
    secondaryButtonclass: "btn-deepgreenLg font-14 w-100"
};

export default ConfirmBox;
