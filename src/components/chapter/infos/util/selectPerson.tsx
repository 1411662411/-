import React, { Component } from 'react';
import {List, Map} from 'immutable';
import {
    Select,
} from 'antd';
import { SelectProps } from 'antd/lib/select/index';
const Option = Select.Option;

export type PersonSource = List<Map<keyof {
    userInfo: string;
    id: number | string;
}, any>>

interface SelectPersonProps extends SelectProps {
    source: PersonSource;
}


class SelectPerson extends Component<SelectPersonProps, {}> {
    constructor(props) {
        super(props);
    }
    selectProps = () => {
        return {
            ...this.props,
            filterOption: (inputValue: string, option) => {
                console.log('***', inputValue)
                if (inputValue && inputValue.length < 2) {
                    return true
                }
                // const child = option.props.children as string
                const employeeNumber = option.props['data-employeeNumber'] as string
                const name = option.props['data-name']
                console.log('***', employeeNumber, name)
                return name.indexOf(inputValue) > -1 || employeeNumber.indexOf(inputValue) > -1
            },
        }
    }
    render() {
        return (
            <Select {...this.selectProps()} >
                {
                    this.props.source.toJS().map(
                        (value, index) => 
                            <Option 
                                value={value.id} 
                                data-name-info={value.userInfo} 
                                data-name={value.name} 
                                data-phone={value.phone}
                                data-employeeNumber={value.employeeNumber}
                            >
                                {value.userInfo}
                            </Option>)
                }
            </Select>
        )
    }
}
export default SelectPerson;