import React from 'react';
import {Popover, Tree, Input} from 'antd';
const TreeNode = Tree.TreeNode;

import {isParent} from '../../../../util/crmUtil';

import './index.less';

const setTreeKey = (data, _key:string = '0') => {
    return data.map(item => {
        item.key = `${_key}-${item.parentId}-${item.id}`;
        if(item.children && item.children.length > 0){
            item.children = setTreeKey(item.children, `${_key}-${item.parentId}`);
        }
        return item;
    })
}

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
};

const getOneDimensionalArr = (data, children='children') => {
    let arr:any[] = [];
    data.map(item => {
        arr.push(item);
        if(item[children] && item[children].length > 0){
            arr = [...arr, ...getOneDimensionalArr(item[children])];
        }
    })
    return arr;
}

let gData = [
    {
        title:'123',
        value:'123',
        id: '1',
        parentId: 0,
    },
    {
        title:'223',
        value:'223',
        id: '2',
        parentId: 0,
        children:[
            {title: '444', value: '444', id: 9, parentId: 2}
        ]
    },
    {
        title:'223',
        value:'223',
        id: '3',
        parentId: 0,
        children:[
            {title: '444', value: '444', id: 10, parentId: 3}
        ]
    },
    {
        title:'223',
        value:'223',
        id: '4',
        parentId: 0,
        children:[
            {title: '444', value: '444', id: 8, parentId: 4}
        ]
    },
    {
        title:'223',
        value:'223',
        id: '5',
        parentId: 0,
        children:[
            {title: '444', value: '444', id: 7, parentId: 5}
        ]
    },
    {
        title:'323',
        value:'323',
        id: '6',
        parentId: 0,
    },
];
gData = setTreeKey(gData);

let dataList = getOneDimensionalArr(gData);

interface AccountBankSelectProps{
    title: any; //显示的文字
    onChange: (value: any) => void; //点击选项后调用的方法
}
class AccountBankSelect extends React.Component<AccountBankSelectProps,any>{
    constructor(props) {
        super(props);
        this.state={
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            visible: false,
        }
    }

    onSelect = (selectedKeys, evt) => {
        const selectValue = dataList.filter(item => item.key === selectedKeys[0])[0];   //通过key查找到选中的元素
        // console.log(selectValue, selectedKeys, evt);
        this.props.onChange(selectValue);
        this.setState({visible: false}, () => {
            this.documentOnClick(false);
        })
    }

    quickSearch = (e) => {  //快速查找
        const value = e.target.value;
        const expandedKeys = dataList.map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData);
          }
          return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
    }
    onExpand = (expandedKeys) => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    }

    container:any;

    closePopover = (e) => { //关闭浮层
        if(!!!isParent(e.target, this.container)){
            this.setState({
                visible: false,
            }, () => {
                this.documentOnClick(false);
            })
        }
    }

    documentOnClick(bool: boolean){ //添加/删除 全局关闭浮层事件
        if(bool){
            document.addEventListener('click', this.closePopover);
        }else{
            document.removeEventListener('click', this.closePopover);
        }
    }
    componentDidMount(){
        // this.documentOnClick(true);
    }
    componentWillUnmount(){
        this.documentOnClick(false);
    }
    renderContent = () => {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const loop = data => data.map((item) => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
                </span>
            ) : <span>{item.title}</span>;
            if (item.children) {
                return (
                <TreeNode disabled key={item.key} title={title}>
                    {loop(item.children)}
                </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} />;
        });
        return <div ref={node => this.container = node}>
            <Input.Search style={{ marginBottom: 8 }} placeholder="快速查找" onChange={this.quickSearch} />
            <div 
                className='custom-scroll-bar'
                style={{
                    maxHeight: 220,
                    overflowY: 'auto',
                }}
            >
            <Tree
                expandedKeys={expandedKeys}
                selectedKeys={[]}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                autoExpandParent={autoExpandParent}
            >
            {loop(gData)}
            </Tree>
            </div>
      </div>
    }
    render(){
        return <Popover
            content={this.renderContent()}
            placement='bottom'
            trigger='click'
            visible={this.state.visible}
        >
            <a className='text-line-bottom' onClick={() => this.setState({visible: !this.state.visible}, () => {
                this.documentOnClick(true);
            })}>{this.props.title || '请选择'}</a>
        </Popover>
    }
}

export default AccountBankSelect;