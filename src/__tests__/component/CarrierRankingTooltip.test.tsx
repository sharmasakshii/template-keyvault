import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import RankingTooltip from "../../component/carrierRankingTooltip";

describe('RankingTooltip Component', () => {
  it('renders without crashing', () => {
    const item = {
      SmartwayData: [
        { year: 2021, ranking: 1 },
        // Add more data as needed for testing different cases
      ],
    };

    render(<RankingTooltip item={item} />);
  });

  it('renders "No rank available" when no SmartwayData is present', () => {
    const item = {
      SmartwayData: [],
    };

    const { getByText } = render(<RankingTooltip item={item} />);
    expect(getByText('No rank available')).toBeInTheDocument();
  });

  // Add more test cases as needed
});