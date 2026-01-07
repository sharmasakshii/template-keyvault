import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Heading from '../../component/heading';

describe('Heading Component', () => {
    it('renders the correct heading level', () => {
        const { container } = render(<Heading level={2} />);
        expect(container.querySelector('h2')).toBeInTheDocument();
    });

    it('renders content, spanText, and paragraphText', () => {
        const { getByText } = render(
            <Heading level={3} content="Heading Content" spanText="Span Text" paragraphText="Paragraph Text" />
        );

        expect(getByText('Heading Content')).toBeInTheDocument();
        expect(getByText('Span Text')).toBeInTheDocument();
        expect(getByText('Paragraph Text')).toBeInTheDocument();
    });

    // Add more test cases as needed
});