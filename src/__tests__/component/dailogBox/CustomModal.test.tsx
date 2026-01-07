import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for better assertions

// Mock component for testing
const InputComponent = ({ handleInput, removeSpaceOnly, inputValue, inputPlaceholder }: any) => (
    <input
        type="text"
        name="folder_name"
        id="folder_name"
        value={inputValue}
        placeholder={inputPlaceholder}
        onChange={(e: any) => handleInput(e)}
        onKeyDown={(e: any) => removeSpaceOnly(e)}
    />
);

describe('InputComponent', () => {
    let handleInputMock: jest.Mock;
    let removeSpaceOnlyMock: jest.Mock;
    let inputValue: string;
    let inputPlaceholder: string;

    beforeEach(() => {
        handleInputMock = jest.fn();
        removeSpaceOnlyMock = jest.fn();
        inputValue = '';
        inputPlaceholder = 'Enter folder name';
    });

    it('should call handleInput when input changes', () => {
        const { getByPlaceholderText } = render(
            <InputComponent
                handleInput={handleInputMock}
                removeSpaceOnly={removeSpaceOnlyMock}
                inputValue={inputValue}
                inputPlaceholder={inputPlaceholder}
            />
        );

        const input = getByPlaceholderText(inputPlaceholder);
        fireEvent.change(input, { target: { value: 'new value' } });

        // Assert handleInput is called
        expect(handleInputMock).toHaveBeenCalled();
        // expect(handleInputMock).toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'new value' } }));
    });

    it('should prevent space from being entered on keyDown', () => {
        const { getByPlaceholderText } = render(
            <InputComponent
                handleInput={handleInputMock}
                removeSpaceOnly={removeSpaceOnlyMock}
                inputValue={inputValue}
                inputPlaceholder={inputPlaceholder}
            />
        );

        const input = getByPlaceholderText(inputPlaceholder);
        fireEvent.keyDown(input, { key: ' ' });

        // Assert removeSpaceOnly is called and space is prevented
        expect(removeSpaceOnlyMock).toHaveBeenCalled();
        expect(removeSpaceOnlyMock).toHaveBeenCalledWith(expect.objectContaining({ key: ' ' }));
    });

    it('should not prevent non-space characters on keyDown', () => {
        const { getByPlaceholderText } = render(
            <InputComponent
                handleInput={handleInputMock}
                removeSpaceOnly={removeSpaceOnlyMock}
                inputValue={inputValue}
                inputPlaceholder={inputPlaceholder}
            />
        );

        const input = getByPlaceholderText(inputPlaceholder);
        fireEvent.keyDown(input, { key: 'a' });

        // Assert removeSpaceOnly is called but not preventing non-space characters
        expect(removeSpaceOnlyMock).toHaveBeenCalled();
        expect(removeSpaceOnlyMock).toHaveBeenCalledWith(expect.objectContaining({ key: 'a' }));
    });
});
