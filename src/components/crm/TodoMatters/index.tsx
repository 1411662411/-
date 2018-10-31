import React from 'react';
import { List, Icon, message, Spin, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';

import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

import './style.less'

const LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/userTodo/list`;
const DELETE_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/userTodo/logicDelete`;
const getUserToDoList = (dateTime) => fetchFn(LIST_API, {dateTime}).then(data => data);
const deleteUserToDoById = (id) => fetchFn(DELETE_API, {id}).then(data => data);

interface TodoMattersProps{
    date: moment.Moment; //时间戳
    // noMessage?: string;     //
    onlyShow?: boolean;     //是否只是展示 若为true ,点击事件无效，不能删除
    onClick?: Function;     //行点击事件，若onlyShow = true , 点击事件无效
    onDelete?: Function;     //删除回调事件，若onlyShow = true , 点击事件无效
}

class TodoMatters extends React.Component<TodoMattersProps,any>{
    constructor(props){
        super(props)
        this.state={
            loading:false,
            data:[],
        }
    }

    getUserToDoList = async(date) => {
        await this.setState({loading: true});
        let res = await getUserToDoList(date.unix());
        if(res.status == 0){
            await this.setState({
                data: res.data ? res.data : [],
                loading: false,
            });
        }else{
            await this.setState({
                data: [],
                loading: false,
            });
        }
    }

    deleteUserToDoById = async(id) => {
        await this.setState({loading: true});
        let res = await deleteUserToDoById(id);
        if(res.status === 0){
            message.success(res.msg);
            if(this.props.onDelete){
                Promise.all([
                    this.props.onDelete(),
                    this.getUserToDoList(this.props.date),
                ])
            }else{
                this.getUserToDoList(this.props.date);
            }
        }else{
            this.setState({
                loading:false,
            })
        }
        return false;
    }

    itemOnClick = (item) => {
        const {onlyShow, onClick} = this.props;
        if(!onlyShow){
            if(onClick){
                onClick(item)
            }else{
                throw new Error('TodoMatters: Function onClick is undefined')
            }
        }
        return false;
    }
    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.date !== this.props.date){
            this.getUserToDoList(nextProps.date);
        }
        return true;
    }

    async componentWillMount(){
        const {date} = this.props;
        await this.getUserToDoList(date);
    }

    render(){
        const { onlyShow, date } = this.props;
        const { data, loading } = this.state;
        return <div className='crm-todo-matters-container custom-scroll-bar'>
        <Spin
            spinning={loading}
        >
            {data.map( item => <div className='crm-todo-matters-item' style={onlyShow ? {} : {paddingRight:18}}>
                <Tooltip placement="top" title={item.content}>
                    <div onClick={() => this.itemOnClick(item)} className='crm-todo-matters-item-content' style={onlyShow ? {cursor: 'default', color: '#666'} : {cursor: 'pointer', color: '#6EB0E4'}}>{item.content}</div>
                </Tooltip>
                {!onlyShow && <Popconfirm
                    title="确定删除该待办事项？" 
                    okText="确定" 
                    cancelText="取消"
                    onConfirm={() => this.deleteUserToDoById(item.id)}
                ><span className='crm-todo-matters-item-del'><Icon type="delete" /></span></Popconfirm>}
            </div>)}
            <div className='crm-todo-matters-item' style={{padding: 5}}>
                {data.length === 0 ? <div className='crm-todo-matters-item-no-message text-center text-small'>暂无待办事项</div> 
                                 :<div className='crm-todo-matters-item-no-message text-center text-small'>没有更多待办事项了</div> }
            </div>
        </Spin>
        </div>
    }
}

export default TodoMatters;