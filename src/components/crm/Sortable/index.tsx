import React from 'react'
import Sortable from 'sortablejs'

import './style.less'


// className 容器类名，必须
// pull 容器是否可以拖入属性
// isCanPutIn 当元素被拖入时判断是否可以被拖入
// animation 动画时间 默认150ms
// handleClassName 可拖拽的类名，无则为子元素
// onUpdate 发生更新时调用方法
// onFilter
// 详细参数请参考 https://segmentfault.com/a/1190000008209715

class SortableDiv extends React.Component<any>{
    
    constructor(props){
        super(props)
    }
    sortable = null //sortable 容器

    bindSortable(){ //初始化sortable
        let container = document.getElementsByClassName(this.props.className)[0];
        let __this = this;
        Sortable.create(container,{
            group: {
                name: __this.props.groupName || null,
                pull: __this.props.pull || false,
                put(evt){
                    return __this.props.isCanPutIn === undefined ? true : __this.props.isCanPutIn; // set some item (has class disabled) can't put
                }
            },
            animation: __this.props.animation || 150,
            handle: __this.props.handleClassName || null, // Restricts sort start click/touch to the specified element
            filter: __this.props.filter || null, // 删除类名
            ghostClass: 'ghost',
            onFilter(evt){
                // evt.item.parentNode.removeChild(evt.item);
                // __this.props.onFilter(evt.item, evt.to)
                __this.props.onFilter(evt)
            },
            onUpdate(evt){
                __this.props.onUpdate(evt)
            },
        })
    }

    componentDidMount() {
        this.bindSortable()
    }
    
    render(){
        return (<div className={this.props.className} >
            {this.props.children}    
        </div>)
    }
}

export default SortableDiv