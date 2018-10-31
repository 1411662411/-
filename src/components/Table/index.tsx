import React from 'react';

import './style.less';

interface TableColumns{
    label: string;
    value: any;
    required?: boolean;
    isAll?: boolean;
}

interface TableProps{
    dataSource: TableColumns[];
    colgroup?: number[]; //数组之和应为100
}

class Table extends React.Component<TableProps>{
    constructor(props){
        super(props);
    }
    componentWillMount(){
        if(this.props.colgroup){
            if(eval(this.props.colgroup.join('+')) !== 100){
                console.error('colgroup 数组之和应为100！')
            }   
        }
    }
    renderColumns(){
        let trs:any = [];
        const dataSource = this.props.dataSource;
        for(let i = 0, len = dataSource.length; i < len; i++){
            const item = dataSource[i];
            if(item.isAll){
                trs.push(<tr>
                    <td>{item.required ? <span className='l-table-required'>*</span> : ''}{item.label}{item.label && '：'}</td>
                    <td colSpan={3}>{item.value}</td>
                </tr>)
            }else{
                const nextItem = dataSource[i+1];
                trs.push(<tr>
                    <td>{item.required ? <span className='l-table-required'>*</span> : ''}{item.label}{item.label && '：'}</td>
                    <td>{item.value}</td>
                    <td>{nextItem && !nextItem.isAll && nextItem.required ? <span className='l-table-required'>*</span> : '' }{nextItem && !nextItem.isAll ? `${nextItem.label}${nextItem.label && '：'}` : ''}</td>
                    <td>{nextItem && !nextItem.isAll ? nextItem.value : ''}</td>
                    </tr>)
                    nextItem && !nextItem.isAll && i++;
                }
        }
        return trs;
    }

    render(){

        const columns = this.renderColumns();
        const arr = this.props.colgroup || [15, 35, 15, 35];
        const colgroup = arr.map(item => <colgroup style={{ width: `${item}%` }}></colgroup>);
        return <table className='l-table-container'>
            {
                colgroup
            }
        <tbody>
            {columns}
            {/* <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
            <tr>
                <td>1</td>
                <td colSpan={3}>2</td>
            </tr> */}
            
        </tbody></table>
    }
}

export default Table