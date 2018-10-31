import React from 'react';
import { InputNumber } from 'antd';

import './style.less';

interface InputNumberProps {
    prefixCls?: string;
    min?: number;
    max?: number;
    value?: number;
    step?: number | string;
    defaultValue?: number;
    tabIndex?: number;
    onKeyDown?: React.FormEventHandler<any>;
    onChange?: (value: number | string | undefined) => void;
    disabled?: boolean;
    size?: 'large' | 'small' | 'default';
    formatter?: (value: number | string | undefined) => string;
    parser?: (displayValue: string | undefined) => number;
    placeholder?: string;
    style?: React.CSSProperties;
    className?: string;
    name?: string;
    id?: string;
    precision?: number;
}
interface NumberProps{
    addonAfter?: string;
    attr?:InputNumberProps;
}

class Number extends React.Component<NumberProps>{
    constructor(props){
        super(props)
    }

    render(){
        const addonAfter = this.props.addonAfter;
        return <div
            style={{width: this.props.attr && this.props.attr.style && this.props.attr.style.width || 120}}
            className='ant-input-wrapper ant-input-group l-input-wrapper-container'
        >
            <InputNumber
                {...this.props.attr}
            />
            <span className='ant-input-group-addon'>{this.props.addonAfter}</span> 
        </div>
    }
}

export default Number