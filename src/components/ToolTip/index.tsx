import React from 'react';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import {List} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import Divider from 'antd/lib/divider';

import { isParent, getAbsPoint, getMousePos } from './util';

import './style.less';

interface ToolTipProps{
    trigger?: 'click' | 'hover';    //浮层显示得方式
    width?: number; //浮层宽度
    maxHeight?: number; //浮层最大高度限制
    getData: (current:number) => Array<JSX.Element | string> | undefined | null;    //获取数据的方法
    hasMore: boolean;   //是否还有更多数据
    getPopupContainer?: (node: Element) => HTMLElement; //浮层渲染父元素节点，如不设置，则默认渲染到body上
}

class ToolTip extends React.Component<ToolTipProps,any>{
    private trigger: Object;    //浮层显示得方式
    private container:HTMLDivElement;  //
    private popupContainer: Element;    //父元素节点
    private _container:HTMLDivElement | null = null; //tooltip 显示容器
    private width: number = 500;    //默认宽度
    private maxHeight: number = 360;    //默认高度
    constructor(props){
        super(props)

        this.trigger = props.trigger === 'hover' ? {    //浮层显示得方式
            onMouseEnter:this.openToolTip,
            onMouseLeave:this.hideToolTip,
        } : {onClick:this.openToolTip};

        if(props.width){    //如果设置了宽度，则覆盖默认宽度
            this.width = props.width;
        }

        if(props.maxHeight){    //如果设置了最大高度，则覆盖默认最大高度
            this.maxHeight = props.maxHeight;
        }

        this.state = {
            mousePos:{x: 9999, y: 9999},
            show: false,
        }
    }

    openToolTip = async(e) => {     //打开浮层方法
        let data = await this.props.getData(1);
        await this.setState({data});
        const offset = getAbsPoint(this.container);
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
        if(!this._container){
            const {mousePos} = this.state;
            this._container = document.createElement('div');
            this._container.className = 'lrl-tooltip-container';
            this._container.style.width = '100%';
            this._container.style.position = 'absolute';
            this._container.style.top = 0 + 'px';
            this._container.style.left = 0 + 'px';
            this.popupContainer = this.props.getPopupContainer ? this.props.getPopupContainer(this.container) : document.body;
            this.popupContainer.appendChild(this._container);
        }
        // console.log(offset, document.body.scrollHeight, scrollHeight, document.body.scrollWidth, document.body);
        ReactDOM.unstable_renderSubtreeIntoContainer(this, <ToolTips
            hasMore={this.props.hasMore} 
            data={data ? data : []} 
            width= {this.width}
            maxHeight={this.maxHeight}
            position={offset}
            scroll={{
                x: scrollTop,
                y: scrollLeft,
            }}
            triggerHeight={this.container.offsetHeight}
        />, this._container);
        this.setState({show: true});
        document.addEventListener('click',this.hideToolTip);
        return false;
    }
    hideToolTip = async(e) => {
        // this.setState({show: false, data: null});
        if(this.state.show && this._container && this.props.trigger === 'hover'){
            ReactDOM.unmountComponentAtNode(this._container);
            document.removeEventListener('click', this.hideToolTip);
            this.setState({show: false});
        }else if(this.state.show && this._container && !isParent(e.target, this._container) && !isParent(e.target, this.container)){
            ReactDOM.unmountComponentAtNode(this._container);
            document.removeEventListener('click', this.hideToolTip);
            this.setState({show: false});
        }
    }
    
    getMousePos = (e) => {
        const mousePos = getMousePos(e);
        this.setState({mousePos});
    }
    componentDidMount(){
        // document.addEventListener('click',this.hideToolTip);
    }
    componentWillUnmount(){
        document.removeEventListener('click', this.hideToolTip);
    }
    render(){
        const {
            show,
            data,
        } = this.state;
        return <div
            className='lrl-tooltip-container-trigger'
            ref={node => this.container = node as HTMLDivElement}
            onMouseMove={this.getMousePos}
            {...this.trigger}
        >
            {this.props.children}
        </div>
    }
}

class ToolTips extends React.Component<any,any>{
    private readonly length = 20;
    constructor(props){
        super(props)
        const PopupContainer = props.PopupContainer || document.body;
        this.state={
            loading: false,
            position:{
                x: 9999,
                y: 9999,
            }
        }
    }
    node: any;
    componentDidMount(){
        const {
            position,
            scroll,
            triggerHeight,
            maxHeight,
            width,
        } = this.props;
        const offsetHeight = this.node.offsetHeight;
        let newPosition:any = {
            x: position.x + 4,
            y: position.y + triggerHeight + 4,
        };
        
        if(scroll.y - position.y - triggerHeight - 20 < offsetHeight){
            newPosition.y = position.y - offsetHeight - 4;
            console.log(321, scroll.y)
        }
        if(scroll.x - position.x - width - 20 < width){
            newPosition.x = position.x - width -10;
        }
        console.log(newPosition.y, position.y);
        this.setState({
            position: newPosition,
        })
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

    handleInfiniteOnLoad = (current)=>{
        let {dataSource} = this.state;
        this.setState({
            loading: true,
        });
        this.getFollowList(current, true)
    }
    async getFollowList(current,infiniteOnLoad=false){
        let res:any = await this.props.getList(this.props.id,current);
        if(res.status === 0){
            if(infiniteOnLoad){
                this.setState({
                    dataSource: [...this.state.dataSource,...res.data.records],
                    current,
                    loading: false,
                    hasMore: Math.ceil(res.recordsTotal / this.length) > current,
                })
            }else{
                this.setState({
                    dataSource: res.data.records,
                    current,
                    loading: false,
                    hasMore: Math.ceil(res.recordsTotal / this.length) > current,
                })
            }
        }else{
            this.setState({
                current:current-1,
                loading: false,
            })
        }
    }
    triggerOnWheel = (e) => {
        console.log('triggerOnWheel', e.deltaY);
        return false;
    }
    renderList(dataSource){
        return dataSource.map(item => <div className='lrl-tooltip-container-item'>{item}</div>)
    }
    renderNoList(){
        return <div className='lrl-tooltip-container-item lrl-tooltip-container-item-noMessage'>暂无数据</div>
    }
    render(){
        const {
            data, 
            width,
        } = this.props;
        const {position} = this.state;
        const list = data.length > 0 ?
                    this.renderList(data)
                    : this.renderNoList();
        const hasMore = data > 0 && this.props.hasMore;
        return <div
            className='lrl-tooltip-content'
            ref={node => this.node = node as HTMLDivElement}
            onWheel={this.triggerOnWheel}
            style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                width,
            }}
        >
            <Animate
                transitionName="slide-up"
            >
            <InfiniteScroll
                initialLoad={false}
                pageStart={1}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!this.state.loading && hasMore}
                useWindow={false}
            >
                {
                    list
                }
                {
                    hasMore && <div className='lrl-tooltip-container-item lrl-tooltip-container-item-hasMore'>滚动加载更多</div>
                }
            </InfiniteScroll>
            </Animate>
        </div>
    }
}

export default ToolTip