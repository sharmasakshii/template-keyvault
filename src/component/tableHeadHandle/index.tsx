import { sortIcon } from 'utils';
import ImageComponent from "component/images/index"
interface TableProps {
    columns: { key: string; label: string; unit?: string; isSorting?: boolean, isHidden?:boolean }[];
    style?: string;
    order?: any;
    col_name?: any;
    handleClickColumn?: any;
}
const TableHead = ({ columns, style, col_name, order, handleClickColumn }: TableProps) => {
    const handleOnclick = (column: any) => {
        if (column.isSorting === true) {
            handleClickColumn(column.key)
        }
    }
    return (
        <thead>
            <tr className={style}>
                {columns.filter((item:any)=>!item.isHidden).map((column) => (
                    <th data-testid={`sort_${column.key}`} key={column.key} onClick={() => handleOnclick(column)}><div>
                        {column.label}{column.isSorting && <ImageComponent imageName={sortIcon(column.key, col_name, order)} className='pe-0'/>}
                        </div> <span> {column.unit}</span></th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHead