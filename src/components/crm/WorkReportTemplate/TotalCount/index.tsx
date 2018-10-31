import React from 'react';
import {Icon} from 'antd';

import './style.less'
interface columns{
    title: string;
    value: string;
    [options: string]: any;
}

interface TotalCountProps{
    dataSource: Array<object>;
    custom?:  columns;
    disabled?: boolean;
    defaultValue?: Array<number|string>; //对应value值
    value?:Array<number|string>
    onChange?:(obj) => void;
    onClick: (current: string|number, active:boolean, checked:Array<number|string>) => void
}

class TotalCount extends React.Component<TotalCountProps,any>{
    constructor(props){
        super(props)
        this.state = {
            dataSource: props.dataSource || [],
            custom: props.custom || {title:'title', value: 'value'},
            value: new Set(props.value || props.defaultValue || []),
        }
    }

    onClick = (current, active) => {
        let { value } = this.state;
        if(active){
            value.add(current);
        }else{
            value.delete(current);
        }
        this.setState({value}, () => {
            this.props.onClick && this.props.onClick(current, active, Array.from(value));
            this.props.onChange && this.props.onChange(Array.from(value));
        })
    }

    componentWillReceiveProps(nextProps){
        // Should be a controlled component.
        if ('value' in nextProps) {
            // console.log(nextProps.value);
            const value = nextProps.value;
            this.setState(new Set(value));
        }
        // if(nextProps.value !== this.props.value){
        //     this.setState({value: new Set(nextProps.value)})
        // }
    }

    render(){
        const {
            dataSource,
            custom,
            value,
        } = this.state;
        return <div>
            {
                dataSource.map(item => {
                    return <CardCheck 
                        disabled={this.props.disabled || false}
                        title={item[custom.title]}
                        value={item[custom.value]}
                        checked={value.has(item[custom.value])}
                        onClick={this.onClick}
                    />
                })
            }
        </div>
    }
}

interface CardCheckProps{
    title: string;
    value: number | string;
    disabled: boolean;
    checked?: boolean;
    onClick: (value: number | string, active: boolean) => void
}
class CardCheck extends React.Component<CardCheckProps,any>{
    constructor(props){
        super(props)
        this.state={
            checked:props.checked
        }
    }
    render(){
        const {checked} = this.state;
        const {value, title, onClick} = this.props;
        return <div 
            style={{
                cursor: this.props.disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
                if(!this.props.disabled){
                    this.setState({checked:!checked})
                    onClick(value, !checked);
                }
            }} className={`crm-work-report-total-count-item ${checked ? 'crm-work-report-total-count-item-checked' : ''}`}>
            <div className='crm-work-report-total-count-item-check'> <Icon type="check" /> </div>
            {title}
        </div>
    }
}

export default TotalCount;