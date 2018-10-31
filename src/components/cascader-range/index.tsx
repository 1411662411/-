import React, { Component } from 'react';
import { Cascader } from 'antd';
import moment, { Moment } from 'moment';
interface CascaderRangeProps {
    placeholder?: string;
    size?: 'large' | 'small' | 'default';
    options: [any[], any[]];
    onChange?: (value) => void;
    value?: [any[], any[]];
    style?: React.CSSProperties;
}
interface CascaderRangeState {
    value: [any[], any[]];
}

export default class CascaderRange extends React.Component<CascaderRangeProps, CascaderRangeState> {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || [[], []],
        };
    }
    commonProps = (type) => {
        const {
            // size = 'large',
            placeholder = '请选择',
            options,
            style,
        } = this.props;
        let props = {
            // size,
            placeholder,
            options: options[type],
            value: this.state.value[type],
            style,
        }
        return props;
    }
    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            /**
             * todo
             * 需优化
             */
            const value = nextProps.value;
            this.setState({ value });
        }
    }
    /**
     * 表单验证插件调用
     */
    triggerChange = (changedValue) => {
        const {
            onChange,
        } = this.props;
        if (onChange) {
            onChange(changedValue);
        }
    }
    startOnChange = (value: any[]) => {
        const newValue = [value, this.state.value[1]] as CascaderRangeProps['options'];
        this.setState({
            value: newValue,
        });
        this.triggerChange(newValue);
    }
    endOnChange = (value: any[]) => {
        const newValue = [this.state.value[0], value, ] as CascaderRangeProps['options'];
        this.setState({
            value: newValue,
        });
        this.triggerChange(newValue);
    }
    render() {
        const { value} = this.state;
        const start = value[0];
        const end = value[1];
        return (
            <div>
                <Cascader {...this.commonProps(0)} onChange={this.startOnChange} />
                <span style={{ margin: '0 10px' }}>至</span>
                <Cascader {...this.commonProps(1)} onChange={this.endOnChange} />
            </div>
        );
    }
}