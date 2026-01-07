import React from 'react';
interface ErrorMessaageProps {
    touched?: boolean;
    errors?: string;
    testId?: string;
}

const ErrorMessaage: React.FC<ErrorMessaageProps> = ({ touched, errors, testId }) => {

    return (
        <>
            {touched &&
                errors && (
                    <span
                    data-testid={testId}
                        className="text-danger font-12"
                    >
                        {errors}
                    </span>
                )}
        </>
    );
};

export default ErrorMessaage;

