import React from 'react';
import {Input, Icon} from 'antd';

import addressDefault from '../select-city/address.json';
import SelectCity from '../select-city';

import './index.less';

interface valueProps{
    selectVal: number[];
    selectName: string[];
}
interface SelectCityTagsProps{
    deepMap?: Array<{name: string; value?: number}>;
    address?: any;/* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
    addressApi?: string; /* fetch api方式城市基本数据 */
    addressFetchData?: any; /* fetch api方式城市请求参数 */

    onChange?: (value) => void; /* 城市选择发生变化时调用的方法  value[{selectVal, selectName, code}] */

    value?: Array<valueProps>;
}

/**
 * 多选城市组件 原城市组件嵌套一层
 */
class SelectCityTags extends React.Component<SelectCityTagsProps, any>{
    constructor(props) {
        super(props);
        this.state={
            value: new Map(),
            cityKey: 0,
        }
    }


    private city; //城市组件ref   

    private selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {  //默认城市组件配置
        const {deepMap, address, addressApi, addressFetchData} = this.props;
        return {
            // deepMap: [{name: '省',value: selectVal.length?'省':''},{name: '市',value: '市'},{name: '区',value: '区'}],
            deepMap: deepMap || [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder: '请选择政策包',
            transform: true,
            addressApi, 
            addressFetchData,
            address: address || addressDefault, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 200,
                display: 'none',    //将原城市组件隐藏
            }, /* input 的样式 */
            onChange: this.onCityChange,
        }
    }

    /**
     * 当城市组件选择完城市后，将选择的值添加至value，利用 selectVal 拼成 *-*-* 字段作为每个选中城市的唯一标识
     * 如 props 中有 onChange 方法则将值传出
     */
    private onCityChange = (selectVal, selectName, code) => {   
        const {value, cityKey} = this.state;
        const values = [...value.values()];
        let newValue = new Map();
        values.forEach(item => {
            newValue.set(item.selectVal.join('-'), item);
        })

        newValue.set(selectVal.join('-'), {selectVal, selectName});

        this.setState({
            value: newValue,
            cityKey: cityKey+1,
        }, () => {
            this.props.onChange && this.props.onChange([...newValue.values()]);
        })

        // if(this.props.onChange){
        //     this.setState({
        //         cityKey: cityKey+1,
        //     })
        //     this.props.onChange([...newValue.values()]);
        // }else{
        //     this.setState({
        //         value: newValue,
        //         cityKey: cityKey+1,
        //     })
        // }
        
    }

     /**
     * code 选中城市的唯一标识
     * 当点击删除时，通过 code 删除所选中的城市
     */
    private delete = (code) => {
        const {value} = this.state;
        const values = [...value.values()];
        let newValue = new Map();
        values.forEach(item => {
            newValue.set(item.selectVal.join('-'), item);
        })
        newValue.delete(code);
        this.setState({
            value: newValue,
        }, () => {
            this.props.onChange && this.props.onChange([...newValue.values()]);
        })
        // if(this.props.onChange){
        //     this.props.onChange([...newValue.values()]);
        // }else{
        //     this.setState({
        //         value: newValue,
        //     })
        // }
    }

    /**
     * 
     * @param nextProps 更新的 props
     * 当 props 中 value 发生变化时，则更新 state 中的 value 值
     */
    componentWillReceiveProps(nextProps){
        if('value' in nextProps && nextProps.value){
            const {value} = nextProps;
            let newValue = new Map();
            value.forEach(item => {
                newValue.set(item.selectVal.join('-'), item);
            });
            this.setState({
                value: newValue,
            })
        }
    }

   

    public render() {
        const {value, cityKey} = this.state;
        return ([
            <div 
                className='ant-input lrl-city-select-tags-container' 
                onClick={(e) => {
                    this.city.show(e);
                }} 
            >
                {
                    value.size > 0 && <Tags 
                        data={value} 
                        delete={this.delete}
                    />
                }
            </div>,
            <SelectCity key={`city-select-tags-${cityKey}`} ref={node => this.city = node} params={this.selectCityParams()}></SelectCity>
        ]);
    }
}


interface TagsProps{
    data: any;
    delete: (code) => void;
}
/**
 * 城市多选 tag
 */
class Tags extends React.Component<TagsProps, any>{
    constructor(props) {
        super(props);
    }
    
    // fireEvent(element, event) {
    //     if ((document as any).createEventObject) {
    //         // IE浏览器支持fireEvent方法
    //         const evt = (document as any).createEventObject();
    //         return element.fireEvent('on' + event, evt)
    //     }
    //     else {
    //         // 其他标准浏览器使用dispatchEvent方法
    //         const evt = document.createEvent('HTMLEvents');
    //         // initEvent接受3个参数：
    //         // 事件类型，是否冒泡，是否阻止浏览器的默认行为
    //         evt.initEvent(event, true, true);
    //         element.dispatchEvent(evt);
    //     }
    // };
    preventDefault(evt){    //
        evt.preventDefault();
        evt.stopPropagation();
    }

    close = (evt, code) => {
        this.preventDefault(evt);
        this.props.delete(code);
    }

    renderTag(code, obj){
        return <li
            className='lrl-city-select-tag'
            contentEditable={false}
            onClick={this.preventDefault}
        >
            <div>{obj.selectName.join('-')}</div>
            <span
                onClick={(evt) => {
                    this.close(evt, code);
                }}
            ><Icon type="close" /></span>
        </li>
    }

    public render() {
        const {data} = this.props;
        return <ul className='lrl-city-select-tags-container-content'>
            {
                Array.from(data.keys()).map(item => {
                    return this.renderTag(item, data.get(item))
                })
            }
        </ul>
    }
}

export default SelectCityTags;