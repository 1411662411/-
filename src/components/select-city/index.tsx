import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PostionContainer from './PostionContainer';
import './index.css';
import {
    parseAddress,
    parseAddressName,
    throttle,
    transform as transformFn,
} from './util/util';
import Input from 'antd/lib/input/index';
import Spin from 'antd/lib/spin/index';
import {
    fetchFn,
} from '../../util/fetch';


/**
 * 参数集合
 */
// selectCityParams = {
// deepMap: [{name: '省',},{name: '市',},{name: '区',}],
// // deepMap: [{name: '省'},{name: '市'},{name: '区'}],
// popupStyle: {
//     width: 350,
//     zIndex: 99,
// }, /* 弹窗样式 */
// searchApi: apiConfig.queryCityData, /* 模糊搜索api */
// //address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
// addressApi: apiConfig.getCityData, /* fetch api方式城市基本数据 */
// style: {
//     width: 150,
// }, /* input 的样式 */
// onChange(selectVal, selectName, code) {  /* 选择到最后一层的回调 */
//     console.log('change', selectVal, selectName, code)
// },
// onSelect(selectVal, selectName, code) { /* 每层选择的回调，除了， 除了最后一层调用onChange */
//     console.log('select', selectVal, selectName, code)
// },
// }


interface SelectCityProps {
    code?: any;
    params: {
        deepMap: Array<{name: string; value?: number}>;
        // deepMap: [{name: '省'},{name: '市'},{name: '区'}],
        popupStyle?: {
            width: number;
            zIndex: number;
        }; /* 弹窗样式 */
        searchApi?: string; /* 模糊搜索api */
        address?: any;/* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
        addressApi?: string; /* fetch api方式城市基本数据 */
        addressFetchData?: any; /* fetch api方式城市请求参数 */
        /* input 的样式 */
        style?: {
            width: number;
        };
        onChange?: (selectVal, selectName, code) => void; /* 选择到最后一层的回调 */
        onSelect?: (selectVal, selectName, code) => void; /* 每层选择的回调，除了， 除了最后一层调用onChange */
        placeholder?: string;
        /**
         * 兼容旧的数据版本
         */
        transform?: boolean;

        pointParentNode?: true,//是否指向父节点
    }
    className?: string;
    onChange?: (value) => void;
}

interface SelectCityState {
    show: boolean,
    input: {
        left: number;
        top: number;
        width: string | number;
    },
    index: number;
    valIndex: number;
    selectVal: number[];
    // selectName: l > 0 ? /* 根据默认值解析中文名称 */ parseAddressName(selectVal, this.addressMap) : [],
    selectName: string[];
    searching: boolean;
    searchName: string;
    searchDataSource: Object[];
    loading: boolean;
    addressMap: Map<any, any>[];
    addressLoading: boolean;
        
}

export default class SelectCity extends React.Component<SelectCityProps, SelectCityState> {
    /**
     * 用户选中的缓存便于还原
     */
    _cache = {
        searchName: '',
    }
    constructor(props) {
        super(props);
        const code = this.props.code;
        const params = this.props.params;
        const {
            deepMap,
            onChange,
            address,
            addressApi,
            transform,
        } = params;
        let addressMap: Map<string, any>[] = [];
        if (address) {
            addressMap = parseAddress(transform ? transformFn(address): address);
        }
        // if (address === undefined) {
        //     throw new Error('缺少参数address');
        // }
        // this.addressMap = parseAddress(address);
        /* 构建默认数据的选中值 */
        let selectVal:Array<any> = [];

        deepMap.forEach((v, i) => {
            let value = v.value;
            if (value !== undefined) {
                selectVal.push(value);
            }
        });

        let selectValLength = selectVal.length;

        const state = {
            show: false,
            input: {
                left: -99999,
                top: -99999,
                width: '100%'
            },
            index: selectValLength > 0 ? selectValLength - 1 : 0,
            valIndex: selectValLength > 0 ? selectValLength - 2 : 0,
            selectVal: selectValLength > 0 ? /* selectVal默认值 */ selectVal : [],
            // selectName: l > 0 ? /* 根据默认值解析中文名称 */ parseAddressName(selectVal, this.addressMap) : [],
            selectName: addressMap.length > 0 && selectValLength > 0 ? parseAddressName(selectVal, addressMap) : [],
            searching: false,
            searchName: '',
            searchDataSource: [],
            loading: true,
            addressMap,
            addressLoading: !address ||　address.length <= 0,
        }
        this.state = state;

        if ((!address || address.length <= 0) && addressApi) {
            this.getAddress();
        }
        else {
            if (selectValLength === deepMap.length && typeof onChange === 'function') {
                onChange(selectVal, state.selectName, code);
            }
        }

    }
    getAddress = async () => {
        const {
            addressApi,
            deepMap,
            onChange,
            addressFetchData={},
            transform,
        } = this.props.params;
        const code = this.props.code;
        const {
            type
        } = addressFetchData;
        const {
            selectVal,
            selectName,
        } = this.state;
        
        const data:any = await fetchFn(addressApi, { type: type?type:1 });
        if (data.status === 0) {
            /**
             * transform 兼容旧数据
             */
            const addressMap = parseAddress(transform ? transformFn(data.data) : data.data);
            const selectValLength = selectVal.length;
            
            let tempSelectName = selectValLength > 0 ? /* 根据默认值解析中文名称 */ parseAddressName(selectVal, addressMap) : []
            this.setState({
                addressLoading: false,

                addressMap,
                selectName: tempSelectName,
            });

            if (selectValLength === deepMap.length && typeof onChange === 'function') {
                onChange(selectVal, tempSelectName, code);
            }

        }
    }
    fireEvent(element, event) {
        if ((document as any).createEventObject) {
            // IE浏览器支持fireEvent方法
            const evt = (document as any).createEventObject();
            return element.fireEvent('on' + event, evt)
        }
        else {
            // 其他标准浏览器使用dispatchEvent方法
            const evt = document.createEvent('HTMLEvents');
            // initEvent接受3个参数：
            // 事件类型，是否冒泡，是否阻止浏览器的默认行为
            evt.initEvent(event, true, true);
            element.dispatchEvent(evt);
        }
    };
    show(e) {
        /* 阻止冒泡 */
        e.nativeEvent.stopImmediatePropagation();
        this.fireEvent(document, 'click');
        this.setState({
            show: true,
            input: this.input(e), //将 event 传入 input 方法，以便支持城市多选
        });
    }
    hide = () => {
        this.setState({
            show: false
        });
    }
    getOffsetRect(node) {
        const box = node.getBoundingClientRect();
        const body = document.body;
        const docElem = document.documentElement;

        /**
         * 获取页面的scrollTop,scrollLeft(兼容性写法)
         */
        const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        const clientTop = docElem.clientTop || body.clientTop;
        const clientLeft = docElem.clientLeft || body.clientLeft;
        const top = box.top + scrollTop - clientTop;
        const left = box.left + scrollLeft - clientLeft;
        return {
            //Math.round 兼容火狐浏览器bug
            top: Math.round(top),
            left: Math.round(left)
        }
    }
    inputCity: Input;
    input = (evt?) => { //新增参数 evt ， 若传值则取evt相对位置
        let params = this.props.params;
        let input = this.inputCity.input;
        let style = params.popupStyle;

        const {
            pointParentNode,
        } = params;
        const {
            left,
            top,
        } = this.getOffsetRect(evt.target || input);
        let h = evt ? evt.target.offsetHeight : input.offsetHeight;
        return {
            left: pointParentNode === true ? 0 : left,
            top: pointParentNode === true ? 30 : top + h,
            width: style && style.width ? style.width : input.offsetWidth
        }
    }
    addContainer(){
        const {
            params,
            code = 1,
        } = this.props;

        const {
            pointParentNode,
        } = params;
        
        this._container = document.createElement('div');
        this._container.className = `postionContainer`;
        if(pointParentNode === true){
            
            document.getElementsByClassName(`select-city${code}`)[0].appendChild(this._container);
        }else{
            document.body.appendChild(this._container);
        }
        
    }
    _container:HTMLElement;
    componentDidMount() {
        this.addContainer();
        // this._container = document.createElement('div');
        // document.body.appendChild(this._container);
        /* 挂载document的hide */
        document.addEventListener('click', this.hide);
    }
    // componentWillReceiveProps(nextProps) {
    // // Should be a controlled component.
    //     if ('value' in nextProps) {
    //     const value = nextProps.value;
    //     this.setState(value);
    //     }
    // }
    postionContainerProps = () => {
        const {
            addressMap,
            input,
            show,
            searching,
            loading,
            searchDataSource,
            selectName,
            selectVal,
            index,
            valIndex,
        } = this.state;
        const {
            params,
        } = this.props;
        return {
            setInputValue:  this.setInputValue,
            matchQ: this._cache.searchName,
            changeState: (params) => this.changeState(params),
            addressMap,
            params,
            input,
            show,
            searching,
            searchDataSource,
            selectName,
            selectVal,
            index,
            valIndex,
            loading,
        }
    }
    renderComponent = () => {
        // ReactDOM.unstable_renderSubtreeIntoContainer(this, <PostionContainer {...this.postionContainerProps()} />, this._container);
        if(!this._container){
            this.addContainer();
        }
        const {
            code,
        } = this.props;
        const {
            show,
        } = this.state;
        if(show){
            ReactDOM.unstable_renderSubtreeIntoContainer(this, <PostionContainer {...this.postionContainerProps()} />, this._container);
        }else{
            
            ReactDOM.unmountComponentAtNode(this._container);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevState.addressLoading  === false) {
            this.renderComponent();
        }
        
    }
    componentWillUnmount() {
        /* 卸载document的hide */
        document.removeEventListener('click', this.hide);

        /**
         * 卸载_container
         */
        if (this._container) {
            const container = this._container;
            ReactDOM.unmountComponentAtNode(container);
            container.parentNode!.removeChild(container);
            // this._container = null;
        }
    }

    /**
     * 触发antd的form验证事件
     */
    triggerChange = (changedValue) => {
        const {
            onChange,
        } = this.props;
        if (onChange) {
            onChange(changedValue);
        }
    }
    
    changeState(params) {
        const props = this.props;
        const code = props.code;
        const {
            onChange,
            onSelect,
            deepMap,
        } = props.params;
        

        /**
         * [max 最大联动的层级]
         */
        let max = deepMap.length;


        let { index, selectVal, valIndex } = params;


        /* index不能大于max */
        if (index >= max) {
            params.index = max - 1;
            params.valIndex = max - 2;
            this.hide();
        }

        if (selectVal) {
            params.selectName = parseAddressName(selectVal, this.state.addressMap);
        }

        const trigger = params.trigger;
        delete params.trigger;
    
        /* 更新state */
        this.setState(params);

        /* onSelect */
        if (trigger && index !== max && typeof onSelect === 'function') {
            onSelect(selectVal, params.selectName, code);
        }

        /* onChange */
        if (index === max && typeof onChange === 'function') {
            onChange(selectVal, params.selectName, code);
        }
        this.triggerChange({selectVal, selectName: params.selectName});
    }
    clear = () => {
        const { code, params } = this.props;
        const onChange = params.onChange;
        this.setState({
            searching: false,
            searchName: '',
            selectVal: [],
            selectName: [],
            index: 0,
            valIndex: 0,
        });
        typeof onChange === 'function' && onChange([], [], code);
        this.triggerChange({selectVal: [], selectName: []});
    }
    onChange(e) {
        const searchName = e.target.value.trim();

        if (this.state.searchDataSource.length <= 0) {
            this._cache.searchName = searchName;
        }
        this.setState({
            searching: searchName !== '',
            searchName,
            selectVal: [],
            selectName: [],
            index: 0,
            valIndex: 0,
            show: true,
        });


        /**
         * 节流阀
         */
        throttle(async () => {
            if (searchName === '') return;
            this.setState({
                loading: true,
            });
            this._cache.searchName = searchName;
            let data:any = await this.getSearchResult({
                region: searchName,
            });
            this.setState({
                searchDataSource: data && data.data && data.data.records ? data.data.records : [],
                loading: false,
            })
        }, 300)();
    }
    getSearchResult = (searchParams) => {
        const {
            params,
        } = this.props;
        const data = {
            ...searchParams,
            start: 0,
            length: 999,
        };
        const searchApi = params.searchApi;
        return fetchFn(searchApi, data);
    }
    setInputValue = (selectVal, selectName, trigger = true) => {
        const { code, params } = this.props;
        const onChange = params.onChange;
        
        this.setState({
            index: selectVal.length,
            valIndex: selectVal.length,
            selectVal,
            selectName,
            searchName: selectName.join(' '),
            show: false,
        });
        if(trigger){
            typeof onChange === 'function' && onChange(selectVal, selectName, code);
            this.triggerChange({selectVal, selectName: selectName});
        }
        
    }
    resetInputValue = (selectVal, selectName, trigger = true) => {
        const { code, params } = this.props;
        const onChange = params.onChange;

        this.setState({
            index: selectVal.length,
            valIndex: selectVal.length,
            selectVal,
            selectName,
            searchName: selectName.join(' '),
            show: false,
        });
        if (trigger) {
            typeof onChange === 'function' && onChange(selectVal, selectName, code);
            this.triggerChange({ selectVal, selectName: selectName });
        }

    }
    getData() {
        return {
            ids: this.state.selectVal,
            names: this.state.selectName
        }
    }
    inputCityProps = () => {
        
        const {
            searching,
            searchName,
            selectName,
        } = this.state;
        const {
            style,
            placeholder,
            searchApi,
        } = this.props.params;
        let props:any = {
            // className: "city-input",
            ref: (node) => this.inputCity = node,
            onClick: (e) => this.show(e),
            placeholder: placeholder || "支持中文/拼音/简拼",
            style: style,
        }

        searchApi !== undefined ? props.onChange = (e) => this.onChange(e) : props.readOnly = true;

        searching ? props.value = searchName : props.value = selectName.join(' ');

        return props;
    }
    render() {
        const style:any = this.props.params.style || {};
        const {
            addressLoading,
            addressMap,
            show,
        } = this.state;
        return (
            <div className="select-city" style={{ width: style!.width || '100%', zIndex: 999 ,...style,}}>
                {
                    addressLoading ?
                        <div style={{width: style.width, display: 'inline-block'}}>
                            <Spin spinning={addressLoading} >
                                <div className="input-city-wrap" style={{ width: style!.width || '100%' }}>
                                    <Input {...this.inputCityProps() }  />
                                </div>
                            </Spin>
                        </div>
                        :
                        <div>
                            <div className="input-city-wrap" style={{ width: style!.width || '100%' }}>
                                <Input {...this.inputCityProps() }  />
                               
                                <span className="allow-clear" onClick={() => this.clear()}>x</span>
                            </div>

                        </div>
                }

            </div>
        )
    }
}





