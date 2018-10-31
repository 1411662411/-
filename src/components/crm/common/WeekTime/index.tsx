import React from 'react';
import {TimePicker, Select} from 'antd';
import moment from 'moment';

interface valueProps{
    week:number;
    time:moment.Moment;
}
type day = 1|2|3|4|5|6|7;
interface WeekTimeProps{
    weeks?: Array<day> //1-7 默认全部显示
    disabled?: boolean;
    disabledHours?: ()=>number[];
    size?: 'large' | 'default' | 'small';
    value?:valueProps;
    onChange?: (value)=>void;
    format?: string;
    minuteStep?: number;
    placeholder?: string;
    hideDisabledOptions?: boolean;    
}
const WEEK = [
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
    '周日',
]
class WeekTime extends React.Component<WeekTimeProps, any>{
    constructor(props){
        super(props);
        const value = props.value || {};
        this.state = {
            weeks: Array.from(new Set(props.weeks)) || [1,2,3,4,5,6,7],
            value:{
                week: value.week || 5,
                time: value.time || moment('22:00','HH:mm'),
            }
        }
    }

    disabledHours = () => {
        let disabledHours:number[] = [];
        // for(let i = 0; i < 18; i++ ){
        //     disabledHours.push(i);
        // }
        return disabledHours;
    }

    onchangeSelect = (week) => {
        let {value} = this.state;
        this.setState({
            value:{
                ...value,
                week,
            },
        }, () => {
            this.props.onChange && this.props.onChange({...value, week});
        })
    }
    onchangeTime = (time: moment.Moment, timeString: string) => {
        // console.log(time, timeString);
        let {value} = this.state;
        this.setState({
            value:{
                ...value,
                time,
            }
        }, () => {
            // console.log( Object.assign({},value,{time: moment(date)}))
            this.props.onChange && this.props.onChange({...value, time});
        })
    }
    componentWillReceiveProps(nextProps){
        // Should be a controlled component.
        if ('value' in nextProps && nextProps.value !== this.props.value && nextProps.value) {
            const value = nextProps.value;
            this.setState(value);

        }
        // if(nextProps.value !== this.props.value){
        //     this.setState({value: new Set(nextProps.value)})
        // }
    }

    render(){
        const {disabledHours, size, minuteStep, placeholder, format, hideDisabledOptions} = this.props;
        const {weeks, } = this.state;
        const {week, time} = this.state.value;
        const options = weeks.map(item => <Select.Option key={item} value={item}>{WEEK[item-1]}</Select.Option>)
        return <div>
            <Select
                style={{width:120}}
                disabled={this.props.disabled || false}
                size={size || 'default'}
                value={week}
                onChange={this.onchangeSelect}
            >
                {options}
            </Select>
            <TimePicker 
                style={{width: 150, marginLeft:10}}
                disabled={this.props.disabled || false}
                value={time}
                size={size || 'default'}
                hideDisabledOptions = {hideDisabledOptions === true}
                format={format || 'HH:mm'}
                onChange={this.onchangeTime}
                disabledHours={disabledHours || this.disabledHours}
                minuteStep={minuteStep || 1}
                placeholder={placeholder || '请选择时间'}
            />
        </div>
    }
}

export default WeekTime;