import React from 'react';
import { Row, Col, Calendar, Select, Tabs, Menu, Dropdown, Button, Icon, message, DatePicker, Spin } from 'antd';
import moment from 'moment';

import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

import TodoMatters from '../TodoMatters';
import AddTodoMatters from '../TodoMatters/AddTodoMatters';
import PlanVisitCustomer from '../PlanVisitCustomer';
import AddPlanVisitCustomer from '../PlanVisitCustomer/AddPlanVisitCustomer';

import './style.less';

const GET_POINTER_OF_CALENDAR_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/userTodo/dataOfCalendar`; //获取当月有计划的天
const GET_TABS_NUMBER_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/userTodo/numOfCalendarTab`; //获取当天tabs上计数

const getPointerOfCalendar = (dateTime) => fetchFn(GET_POINTER_OF_CALENDAR_API, {dateTime}).then(data=>data)
const getTabsNumber = (dateTime) => fetchFn(GET_TABS_NUMBER_API, {dateTime}).then(data=>data)


class CrmCalendar extends React.Component<any,any>{
    constructor(props){
        super(props);
        this.state={
            loading: false,

            today: moment(),
            date: moment(),
            showList: true,
            addType: null,

            todoNum: 0, //待办事项计数
            followUpPlanNum: 0, //待跟进客户计数
            pointerOfCalendar: new Set(), //当月又待办事项的时间戳数组

            todoMattersItem: null,  //保存待办事项编辑对象
            nextFollowUpsItem: null,    //保存下次跟进计划编辑对象

            activeKey: '1',     //当前激活 tab 面板的 key
        }
    }

    onPanelChange = async(date, mode?) => {
        this.setState({loading: true});
        await this.setState({
            date,
            showList: true,
            addType: '',
            nextFollowUpsItem: null,
            todoMattersItem: null,
        }, async() => {
            await this.dateOnChange()
            this.setState({loading: false});
        })
        // console.log(date, mode);
        // console.log(moment(date).unix())
    }
    addHandleMenuClick = (e) => {  //添加待办或跟进计划
        this.setState({
            addType: Number(e.key),
            showList: false,
        });
    }
    dateOnChange = async() => {
        return Promise.all([
            this.getTabsNumber(),
            this.getPointerOfCalendar(),
        ])
    }

    getTabsNumber = async() => {
        const {date} = this.state;
        let res:any = await getTabsNumber(date.unix());
        if(res.status === 0){
            const {todoNum, followUpPlanNum} = res.data;
            await this.setState({
                todoNum, 
                followUpPlanNum,
            })
        }
    }
    getPointerOfCalendar = async() => {
        const {date} = this.state;
        let res:any = await getPointerOfCalendar(date.unix());
        if(res.status === 0){
            let {data} = res;
            if(data === null || data === 'null'){
                await this.setState({
                    pointerOfCalendar: new Set(),
                })
                return 
            }
            let newData = data.split(',').map(item => moment(Number(item)*1000).format('YYYY-MM-DD'))
            await this.setState({
                pointerOfCalendar: new Set(newData),
            })
        }
    }

    todoMattersItemOnclick = async(item) => { //待办事项点击触发编辑事件
        this.setState({showList: false,todoMattersItem:item}, () => {
            this.setState({
                addType: 2,
            })
        })
    }
    nextFollowUpsItemOnclick = async(item) => { //下次跟进计划点击触发编辑事件
        this.setState({showList: false,nextFollowUpsItem:item}, () => {
            this.setState({
                addType: 1,
            })
        })
    }

    async componentWillMount(){
        if(this.props.type === 'none'){
            
        }else{
            this.setState({loading: true});
            await this.getPointerOfCalendar();
            await this.getTabsNumber();
            this.setState({loading: false});
        }
    }

    render(){
        const {
            today,
            loading,
            date,
            showList,
            addType,
            todoNum,    //待办事项计数
            followUpPlanNum,    //待跟进客户计数
            pointerOfCalendar,  //当月有事项的时间戳set

            todoMattersItem, //待办事项编辑对象
            nextFollowUpsItem, //下次跟进计划编辑对象

            activeKey, //当前激活 tab 面板的 key
        } = this.state;
        const menu = (
            <Menu onClick={this.addHandleMenuClick}>
              <Menu.Item key={1}>下次跟进计划</Menu.Item>
              <Menu.Item key={2}>待办事项</Menu.Item>
            </Menu>
        ); 
        const onlyShow = moment(date.format('YYYY-MM-DD')) < moment(today.format('YYYY-MM-DD')); 
        return <Spin
            spinning={loading}
        ><Row className='crm-work-calendar'>
            <Col span={12} style={{borderRight: '1px solid #d9d9d9', padding: 10, paddingTop: 0, height: 370}}>
                <Calendar 
                    mode='month' 
                    fullscreen={false} 
                    onPanelChange={this.onPanelChange} 
                    onSelect={this.onPanelChange} 
                    dateCellRender={(value) => {
                        return pointerOfCalendar.has(value.format('YYYY-MM-DD')) ? <span className='has-something' style={{display:'inline-block', width: 4, height: 4, background: '#FE6D00', borderRadius: 2}}></span> : null;
                    }}
                />   
                <div style={{paddingLeft: 20, marginTop: 10}} className='text-small'><span style={{marginBottom: 3, marginRight: 4}} className='has-something'></span>当日有计划拜访的客户或待办事项</div>
            </Col>
            <Col span={12} style={{padding: 10, paddingTop: 0}}>
                <div 
                className='crm-work-calendar-buttons'    
                style={{
                    padding: '11px 16px 11px 0',
                    textAlign: 'right',
                }}>
                    <span style={{float: 'left', height: 24, lineHeight: '24px'}}> {date.format('YYYY 年 MM 月 DD 日')} </span>
                    {
                    showList && !onlyShow && <Dropdown trigger={['click']} overlay={menu}>
                        <Button size='small' style={{ marginLeft: 8, color: '#44c7ad', borderColor: '#44c7ad' }}>
                            添加 <Icon type="down" />
                        </Button>
                    </Dropdown>
                    }
                </div>
                {
                    showList ? <Tabs
                        tabPosition='top'
                        activeKey={activeKey}
                        onChange={(activeKey) => this.setState({activeKey})}
                    >
                        <Tabs.TabPane tab={`计划拜访的客户（${followUpPlanNum}）`} key="1">
                            <PlanVisitCustomer
                                date={date}
                                onlyShow={onlyShow}
                                onClick={this.nextFollowUpsItemOnclick}
                                onDelete={async() => {
                                    await this.dateOnChange()
                                }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={`待办事项（${todoNum}）`} key="2">
                            <TodoMatters
                                date={date}
                                onlyShow={onlyShow}
                                onClick={this.todoMattersItemOnclick}
                                onDelete={async() => {
                                    await this.dateOnChange()
                                }}
                            />
                        </Tabs.TabPane>
                        {/* <Tabs.TabPane tab="已跟进的客户" key="3">Content of tab 1</Tabs.TabPane> */}
                    </Tabs> 
                    : addType === 1 ? 
                    <AddPlanVisitCustomer
                        date={date}
                        onOk={async() => {
                            this.setState({
                                showList: true,
                                addType: '',
                                nextFollowUpsItem: null,
                                activeKey: '1',
                            })
                            await this.dateOnChange()
                        }}
                        onCannel={() => {
                            this.setState({
                                showList: true,
                                addType: '',
                                nextFollowUpsItem: null,
                                activeKey: '1',
                            })
                        }}
                        nextFollowUpContent={nextFollowUpsItem ? nextFollowUpsItem.nextFollowUpContent : undefined}
                        customerId={nextFollowUpsItem ? nextFollowUpsItem.id : undefined}
                        nextFollowUpTime={nextFollowUpsItem ? nextFollowUpsItem.nextFollowUpTime : undefined}
                    /> : 
                    addType === 2 ? 
                    <AddTodoMatters
                        date={date}
                        onOk={async() => {
                            this.setState({
                                showList: true,
                                addType: '',
                                todoMattersItem: null,
                                activeKey: '2',
                            })
                            await this.dateOnChange()
                        }}
                        onCannel={() => {
                            this.setState({
                                showList: true,
                                addType: '',
                                todoMattersItem: null,
                                activeKey: '2',
                            })
                        }}
                        isRemind={ todoMattersItem ? todoMattersItem.isRemind : undefined }
                        remindTime={ todoMattersItem ? todoMattersItem.remindTime : null }
                        todoTime={ todoMattersItem ? todoMattersItem.todoTime : null }
                        id={ todoMattersItem ? todoMattersItem.id : null }
                        content={ todoMattersItem ? todoMattersItem.content : null }
                    /> : ''
                }
                
            </Col>
        </Row></Spin>
    }
}

export default CrmCalendar