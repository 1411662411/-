import React from 'react';
import { List, Spin, Icon, message, Tooltip, Popconfirm } from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

import './style.less';

const GET_TODAY_TODO_VISIT_CUSTOMER_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/deskToDoList`;//获取当天计划拜访客户列表
const DELETE_TODAY_TODO_VISIT_CUSTOMER_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerFollowUp/deleteNextFollowUp`;//删除当日计划跟进的客户接口

const getTodayTodoVisitCustomerList = (date) => fetchFn(GET_TODAY_TODO_VISIT_CUSTOMER_LIST_API, {type: 1, date: date.format('YYYY-MM-DD')}).then(data=>data)
const deleteTodayTodoVisitCustomer = (customerId) => fetchFn(DELETE_TODAY_TODO_VISIT_CUSTOMER_API, {customerId}).then(data=>data)

interface PlanVisitCustomerProps{
    date: moment.Moment;
    noMessage?: string;
    onlyShow?: boolean;
    onClick?: Function;
    onDelete?: Function;
}

class PlanVisitCustomer extends React.Component<PlanVisitCustomerProps,any>{
    constructor(props){
        super(props)
        this.state={
            loading:false,
            data: [],
        }
        this.getTodayTodoVisitCustomerList(props.date);
    }

    itemOnClick = (item) => {
        const {onlyShow, onClick} = this.props;
        if(!onlyShow){
            if(onClick){
                onClick(item)
            }else{
                throw new Error('PlanVisitCustomer: Function onClick is undefined')
            }
        }
        return false;
    }
    deleteTodayTodoVisitCustomer = async(id) => {
        await this.setState({loading: true});
        let res = await deleteTodayTodoVisitCustomer(id);
        if(res.status === 0){
            message.success(res.msg);
            if(this.props.onDelete){
                Promise.all([
                    this.props.onDelete(),
                    this.getTodayTodoVisitCustomerList(this.props.date),
                ])
            }else{
                this.getTodayTodoVisitCustomerList(this.props.date);
            }
        }else{
            this.setState({
                loading:false,
            })
        }
        return false;
    }

    getTodayTodoVisitCustomerList = async(date) => {
        await this.setState({loading: true});
        let res:any = await getTodayTodoVisitCustomerList(date);
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

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.date !== this.props.date){
            this.setState({loading: true})
            this.getTodayTodoVisitCustomerList(nextProps.date);
        }
        return true;
    }

    render(){
        const {loading, data} = this.state;
        const { onlyShow, noMessage, date } = this.props;
        return <div className='crm-plan-visit-customer-container custom-scroll-bar'>
        <Spin
            spinning={loading}
        >
            {data.map( item => <div className='crm-plan-visit-customer-item' style={onlyShow ? {} : {paddingRight:10}}>
                <Tooltip placement="top" title={item.cName}>
                    <div onClick={() => this.itemOnClick(item)} className='crm-plan-visit-customer-item-content' style={onlyShow ? {cursor: 'default', color: '#666'} : {cursor: 'pointer', color: '#6EB0E4'}}>{item.cName}</div>
                </Tooltip>
                {!onlyShow && <Popconfirm
                    title="确定删除该计划拜访的客户？" 
                    okText="确定" 
                    cancelText="取消"
                    onConfirm={() => this.deleteTodayTodoVisitCustomer(item.id)}
                ><span className='crm-plan-visit-customer-item-del'><Icon type="delete" /></span></Popconfirm>}
            </div>)}
            <div className='crm-plan-visit-customer-item' style={{padding: 5}}>
                {data.length === 0 ? <div className='crm-plan-visit-customer-item-no-message text-center text-small'>暂无计划拜访的客户</div> 
                                 :<div className='crm-plan-visit-customer-item-no-message text-center text-small'>没有更多计划拜访的客户了</div> }
            </div>
        </Spin>
        </div>
    }
}

export default PlanVisitCustomer;