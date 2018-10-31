import React from 'react';
import { Select } from 'antd';
import {SelectProps} from 'antd/lib/select';
const { Option, OptGroup } = Select;

interface SelectGroupProps extends SelectProps{
    dataSource: any[];
    configure: {
        key: string; //显示对应字段 
        value: string;  //option value对应字段
        children: string;   //子集 对应字段
    }
}

class SelectGroup extends React.Component<SelectGroupProps, any>{
    constructor(props){
        super(props);
    }

    renderOptGroup = () => {
        const { dataSource, configure } = this.props;
        const { key, value, children } = configure;
        let arr:JSX.Element[] = [];
        for(let i=0, len = dataSource.length; i < len; i++){
            arr.push(<OptGroup label={dataSource[i][key]}>
            {
                dataSource[i][children].map(item => <Option key={item[value]} value={item[value]}>{item[key]}</Option>)
            }
            </OptGroup>)
        }
        return arr;
    }

    render(){
        return <Select {...this.props}>
            {this.renderOptGroup()}
        </Select>
    }
}

export default SelectGroup;