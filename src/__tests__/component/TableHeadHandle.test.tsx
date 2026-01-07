

import { render, screen, fireEvent } from '@testing-library/react';
import TableHead from 'component/tableHeadHandle';
import '@testing-library/jest-dom/extend-expect';

describe('table Head Component', () => {

    it('should call render table head', () => {
        render(<TableHead columns={[{ key: "string", label: "string" }]} style="" />);
    });


});
