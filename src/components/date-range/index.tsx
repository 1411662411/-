import React, { Component } from 'react';
import { DatePicker, Checkbox } from 'antd';
import moment, { Moment } from 'moment';
interface DateRangeProps {
    /**
     * 是否有长期
     */
    hasLong?: boolean;
    startPlaceholder?: string;
    endPlaceholder?: string;
    size?: 'large' | 'small' | 'default';
    format?: any;
    showTime?: boolean;
    onChange?: (value) => void;
    value?: [Moment, Moment] | any[],
}
interface DateRangeState {
    value: [Moment, Moment] | any[],
    endOpen: boolean;
}

export default class DateRange extends React.Component<DateRangeProps, DateRangeState> {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || [],
            endOpen: false,
        };
    }
    disabledStartDate = (startValue) => {
        const endValue = this.state.value[1];
        if (endValue === true || !startValue || !endValue) {
            return false;
        }
        return moment(startValue.format('YYYY-MM-DD')).valueOf() >= moment(endValue.format('YYYY-MM-DD')).valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.value[0];
        if (!endValue || !startValue) {
            return false;
        }
        return moment(endValue.format('YYYY-MM-DD')).valueOf() <= moment(startValue.format('YYYY-MM-DD')).valueOf();
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    onStartChange = (value) => {
        // this.onChange('startValue', value);
        const newValue = [value, this.state.value[1]];
        this.setState({
            value: newValue,
        });
        this.triggerChange(newValue);
    }
    onEndChange = (value) => {
        // this.onChange('endValue', value);
        const newValue = [this.state.value[0], value];
        this.setState({
            value: newValue,
        });
        this.triggerChange(newValue);
    }
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    commonProps = () => {
        const {
            format = 'YYYY-MM-DD',
            showTime = false,
            size = 'default',
        } = this.props;
        let props = {
            format,
            showTime,
            size,
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
    /**
     * 长期勾选
     */
    hasLongChange = (e) => {
        if (e.target.checked === true) {
            this.onChange('endValue', true);
            this.setState({
                value: [this.state.value[0], true],
            });
            this.triggerChange([this.state.value[0], true]);
        }
        else {
            this.setState({
                value: [this.state.value[0]],
            });
            this.triggerChange([this.state.value[0]]);
        }
    }
    render() {
        const { value, endOpen } = this.state;
        const {
            startPlaceholder,
            endPlaceholder,
            size,
            format,
            hasLong,
        } = this.props;
        return (
            <div>
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    value={value[0]}
                    placeholder={startPlaceholder || '开始时间'}
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                    {...this.commonProps() }
                />
                {value[1] !== true && <span style={{ margin: '0 10px' }}>至</span>}
                {value[1] !== true && <DatePicker
                    disabledDate={this.disabledEndDate}
                    value={value[1]}
                    placeholder={endPlaceholder || '结束时间'}
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                    {...this.commonProps() }
                />}
                {hasLong && <Checkbox checked={value[1] === true} onChange={this.hasLongChange} style={{ marginLeft: 10 }}>长期</Checkbox>}
            </div>
        );
    }
}