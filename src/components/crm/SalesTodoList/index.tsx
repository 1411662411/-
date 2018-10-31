import React from 'react'
import { List } from 'antd'
import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

import './style.less'
import noMsg from '../../../images/no-msg.png'
import AVisited from './aVisited'

class SalesTodoList extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            resData: []
        }
    }

    componentWillMount(){
        if(this.props.type === 'none'){
            const cardTitle = this.props.cardTitle == 1 ? '今日' : '本周';
            const defaultDate = {data:{data:[
                {
                    'cName': `这是你${cardTitle}的拜访客户` 
                },
                {
                    'cName': `这是你${cardTitle}的拜访客户` 
                },
                {
                    'cName': `这是你${cardTitle}的拜访客户` 
                },
                {
                    'cName': `这是你${cardTitle}的拜访客户` 
                },
                {
                    'cName': `这是你${cardTitle}的拜访客户` 
                },
                {
                    'cName': `这是你${cardTitle}的拜访客户` 
                }
            ]}}
            this.setState({
                resData: defaultDate
            })
        }else{
            const type = this.props.cardTitle;
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customer/deskToDoList`, {type: type})
            .then(data => {
                this.setState({
                    resData: data
                })
            });
        }
    }
    
    render() {
        const { cardTitle } = this.props;
        // if(this.state.resData.length === 0){
        //     return false;
        // }
        const {resData} = this.state;
        const salesTodayTodoList = resData.data ? resData.data.data : [];
        return (
            <div className="sales-todo-list">
                {
                    !salesTodayTodoList || salesTodayTodoList.length === 0 ? <div className='text-center' style={{paddingTop:20}}>
                        <span style={{'display': 'block', 'color': '#999'}}>{cardTitle == 1 ? '今日' : '本周'}没有拜访计划，快去制定计划吧！ </span>
                        <img src={noMsg} alt=""/>
                    </div>
                :
                <div>
                    <h3>{cardTitle == 1 ? '今日' : '本周'}计划拜访的客户（{this.props.type === 'none' ? 'm' : this.state.resData.data.num}）</h3>
                    <div className="sales-todo-list-cnt">
                        <List
                        size="small"
                        dataSource={salesTodayTodoList}
                        renderItem={item => (<List.Item><AVisited item={item} /></List.Item>)}
                        />
                    </div>
                    {salesTodayTodoList.length > 9 ? '' : <div style={{color: '#999'}} className='no-more text-center'>~没有更多{cardTitle == 1 ? '今日' : '本周'}拜访客户了</div>}
                </div>
                }
            </div>
        )
    }
}

export default SalesTodoList