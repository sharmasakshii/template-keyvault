import Spinner from 'component/spinner';
import React from 'react'

interface TableLoadComponentProps {
  children?: any;
  isLoading?: boolean;
  isData?: any;
  colSpan?: number;
  noDataMsg?: string;
  loaderTestId?: string;
  noDataTestId?: string;
}

const TableBodyLoad: React.FC<TableLoadComponentProps> = ({ isLoading, isData, children, colSpan, noDataMsg = "No Data Found", loaderTestId="", noDataTestId="" }: any) => {

  if (isLoading) {
    return (<tbody>
      <tr>
        <td colSpan={colSpan}>
          <Spinner data-testid={loaderTestId} spinnerClass='justify-content-center' />
        </td>
      </tr>
    </tbody>)
  }

  if (!isData) {
    return (<tbody>
      <tr data-testid={noDataTestId}>
        <td colSpan={colSpan} className='text-center'>{noDataMsg}</td>
      </tr>
    </tbody>)
  }
  return (children)
}

export default TableBodyLoad