import { Modal, ModalBody, ModalHeader } from "reactstrap";
import InputField from "component/forms/input";
import { removeSpaceOnly } from "utils";
import ButtonComponent from "component/forms/button";

const CustomModal = ({
    show,
    handleClose,
    handleInput,
    modalHeader,
    isInputBox = false,
    secondaryBtnDisabled = false,
    primaryBtnDisabled = false,
    inputPlaceholder = "",
    primaryButtonText = "",
    secondaryButtonText = "",
    primaryButtonClick,
    secondaryButtonClick,
    primaryButtonClass = "btn-deepgreenLg font-14 w-100",
    secondaryButtonclass = "btn-deepgreenLg font-14 w-100",
    inputValue,
    modalBody = "",
    modalClass = "",
    children,
    testId,
    inputTestId,
    secondaryButtonTestId,
    primaryButtonTestId
}: any) => {
    return (
        <Modal
            isOpen={show}

            toggle={handleClose}
            className={modalClass}
        >
            <ModalHeader toggle={handleClose} className="p-0 pb-2">

                <p className="modal-title">{modalHeader}</p>
            </ModalHeader>
            <ModalBody className="p-0">

                <div data-testid={testId}>
                    {children}
                    {isInputBox && <InputField
                        type="text"
                        name="folder_name"
                        Id="folder_name"
                        testid={inputTestId}
                        value={inputValue}
                        placeholder={inputPlaceholder}
                        onChange={(e: any) => handleInput(e)}
                        onKeyDown={(e: any) => removeSpaceOnly(e)}
                    />
                    }
                    {modalBody &&

                        <p className="font-18">{modalBody}</p>
                    }
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        {secondaryButtonText && <ButtonComponent
                            data-testid={secondaryButtonTestId}
                            text={secondaryButtonText}
                            disabled={secondaryBtnDisabled}
                            onClick={secondaryButtonClick}
                            btnClass={secondaryButtonclass}
                        />}
                        {primaryButtonText && <ButtonComponent
                            data-testid={primaryButtonTestId}
                            text={primaryButtonText}
                            disabled={primaryBtnDisabled}
                            onClick={primaryButtonClick}
                            btnClass={primaryButtonClass}
                        />}
                    </div>

                </div>
            </ModalBody>
        </Modal>
    );
};



export default CustomModal;
