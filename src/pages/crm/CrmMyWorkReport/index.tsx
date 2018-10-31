import React from 'react';
import moment from 'moment';
import { Tabs, DatePicker, Button, Table, Icon, message } from 'antd';
import {browserHistory} from 'react-router';
import { DOMAIN_OXT, ROUTER_PATH } from "../../../global/global";
import { fetchFn } from '../../../util/fetch';

const GET_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/submitList`;
const getList = (data) => fetchFn(GET_LIST_API,{...data,isSelf:0}).then(data => data);

const { MonthPicker, WeekPicker } = DatePicker;
const TabPane = Tabs.TabPane;

import './style.less';

const weekString=[
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
    '周日',
];

const getWeek = (data, daily=false) => {
    let weeks:string[] = [];
    data.map((item, index) => {
        if(daily){
            weeks.push(`${weekString[index]}(${moment(item.day).format('MM月DD日')})`);
        }else{
            weeks.push(`${moment(item.weekStart).format('MM-DD')}~${moment(item.weekEnd).format('MM-DD')}(第${moment(item.weekStart).format('ww')}周)`);
        }
    })
    return weeks;
}

const getDateUnix = (date, format='YYYY-MM-DD') => {
    return moment(moment(date).format('YYYY-MM-DD')).unix();
}

const getThanToday = (data, daily=false) => {
    let len = 0;
    const today = moment(moment().format('YYYY-MM-DD')).unix();
    const toWeek = getDateUnix(moment.unix(today), 'YYYY-ww'); //  moment(moment.unix(today).format('YYYY-ww')).unix();
    data.map(item => {
        if(daily){
            if(getDateUnix(item.day) > today){
                len += 1;
            }
        }else{
            if(getDateUnix(moment.unix(getDateUnix(item.weekStart)), 'YYYY-ww') > toWeek){
                len += 1;
            }
        }
    })
    return len;
}

const getData = (week:string) => {
    return [
        {id:1,type:1},
        {id:2,type:0},
        {id:3,type:1},
    ]
}

class CrmMyWorkReport extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            columns: [] as any[],
            weeks: moment(),
            today: moment(moment().format('YYYY-MM-DD')).unix(),
            daily: true,
            loading: false,
            defaultActiveKey: '1', //默认tab值
        }
    }
    getList = async () => {
        this.setState({loading: true});
        let {weeks, daily} = this.state;
        let res:any;
        if(daily){
            let day = weeks || moment();
            res = await getList({
                year: day.format('YYYY-ww').split('-')[0],
                week: day.format('YYYY-ww').split('-')[1],
                reportType: daily ? 1 : 2,
            })
        }else{
            let day = weeks || moment();
            res = await getList({
                year: day.format('YYYY-ww').split('-')[0],
                month: day.format('YYYY-MM').split('-')[1],
                reportType: daily ? 1 : 2,
            })
        }
        if(res.status === 0){
            const week:any[] = getWeek(res.data[0].submitList, daily);
            const afterToday = getThanToday(res.data[0].submitList, daily);
            const beforeToday = week.length - afterToday; //包含今天
            let columns:any[] = [];
            // console.log(week, afterToday);
            week.map((item, index) => {
                if(index < beforeToday){
                    columns.push({
                        title: item,
                        key: item,
                        render: (data) => {
                            return this.renderTD(data.submitList[index].workReportSet, daily ? data.submitList[index].day : data.submitList[index].weekStart)
                        }
                    })
                }else if(index === beforeToday){
                    columns.push({
                        title: item,
                        key: item,
                        className:'crm-table-emp',
                        render: (data) => {
                            return {
                                children: '',
                                props: {
                                  colSpan: afterToday,
                                },
                              };
                        }
                    })
                }else{
                    columns.push({
                        title: item,
                        key: item,
                        className:'crm-table-emp',
                        render: (data) => {
                            return {
                                children: '',
                                props: {
                                  colSpan: 0,
                                },
                              };
                        }
                    })
                }
            })
            this.setState({
                columns,
                dataSource: res.data || [],
                loading: false,
            })
        }
    }

    async componentWillMount(){
        if(this.props.location.state && this.props.location.state.key){
            this.setState({
                defaultActiveKey: this.props.location.state.key+'',
            })
        }
        await this.getList()
    }

    renderTD = (type, day) => {
        const {today, daily} = this.state;
        if(!type){
            return '/'
        }
        let isDead = type.deadLine === '' ? true : false;
        if(daily){
            if(Number(type.submit) === 0){
                if(!isDead){
                    isDead = moment(type.deadLine, 'HH:mm').unix() < moment().unix() ? true : false;
                }
                if(isDead){
                    return <Icon style={{color:'#cecece'}} type="close-circle-o" />
                }
                if(today === getDateUnix(day)){
                    return <a
                        onClick={() => {
                            if(moment(type.deadLine, 'HH:mm').unix() < moment().unix()){
                                message.error('已过该报告的提交截点，提交失败');
                                return;
                            }
                            browserHistory.push({
                                pathname: `${ROUTER_PATH}/newadmin/crm/customermanagement/myworkreport/submitdaily`,
                                state: {
                                    submit: true,
                                    id: type.id,
                                    day, 
                                },
                            });
                        }}
                    >提交</a>
                }else{
                    return <Icon style={{color:'#cecece'}} type="close-circle-o" />
                }
            }else{
                return <a
                    onClick={() => {
                        browserHistory.push({
                            pathname: `${ROUTER_PATH}/newadmin/crm/customermanagement/myworkreport/submitdaily`,
                            state: {
                                submit: false, 
                                id: type.id,
                                day,
                            },
                        });
                    }}
                ><i className="crmiconfont crmicon-duigou-lv-" ></i> 查看</a>
            }
        }else{
            // console.log(type.deadLineOfWeek , Number(moment().format('e'))+1)
            if(Number(type.submit) === 0){
                if(!isDead){
                    isDead = Number(type.deadLineOfWeek) < Number(moment().format('e')) + 1 ? true : false;
                }
                if(!isDead && Number(type.deadLineOfWeek) === Number(moment().format('e')) + 1){
                    isDead = moment(type.deadLine, 'HH:mm').unix() < moment().unix() ? true : false;
                }
                if(isDead){
                    return <Icon style={{color:'#cecece'}} type="close-circle-o" />
                }
                if(moment.unix(today).format('YYYY-ww') === moment.unix(getDateUnix(day)).format('YYYY-ww')){
                    return <a
                        onClick={() => {
                            if(moment(type.deadLine, 'HH:mm').unix() < moment().unix() && Number(type.deadLineOfWeek) === Number(moment().format('e')) + 1){
                                message.error('已过该报告的提交截点，提交失败');
                                return;
                            }
                            browserHistory.push({
                                pathname: `${ROUTER_PATH}/newadmin/crm/customermanagement/myworkreport/submitweekly`,
                                state: {
                                    submit: true,
                                    id: type.id,
                                    day, 
                                },
                            });
                        }}
                    >提交</a>
                }else{
                    return <Icon style={{color:'#cecece'}} type="close-circle-o" />
                }
            }else{
                return <a
                    onClick={() => {
                        browserHistory.push({
                            pathname: `${ROUTER_PATH}/newadmin/crm/customermanagement/myworkreport/submitweekly`,
                            state: {
                                submit: false, 
                                id: type.id,
                                day, 
                            },
                        });
                    }}
                ><i className="crmiconfont crmicon-duigou-lv-" ></i> 查看</a>
            }
        }
        
    }
    onTabsChange = async(value) => { 
        this.setState({
            daily: Number(value) === 1 ? true : false,
        }, () => {
            this.getList();
        })
    }
    onWeekPickerChange = async(date, dateString) => {
        this.setState({
            weeks: date,
        })
    }

    // componentWillMount (){
    //     setTimeout(() => {
    //         onWeekPickerChange
    //     })
    // }
    render(){
        return <div className='crm-my-work-report-container'>
        <Tabs defaultActiveKey={this.state.defaultActiveKey} onChange={this.onTabsChange}>
            <TabPane tab="日报" key="1">
                <div
                    style={{marginBottom:15}}
                >
                    <WeekPicker 
                        style={{
                            width: 150,
                        }}
                        onChange={this.onWeekPickerChange}
                        placeholder="选择周" 
                    />
                    <Button disabled={this.state.loading} onClick={this.getList} style={{marginLeft:10}} type='primary'>搜索</Button>
                </div>
                {
                    !this.state.loading && <Table 
                        className='ant-table-wrapper-text-center'
                        loading={this.state.loading}
                        bordered
                        columns={this.state.columns}
                        pagination={false}
                        dataSource={this.state.dataSource}
                    />
                }
            </TabPane>
            <TabPane tab="周报" key="2">
                <div
                    style={{marginBottom:15}}
                >
                    <MonthPicker 
                        style={{
                            width: 150,
                        }}
                        placeholder="选择月" 
                        onChange={(date,dateString) => this.setState({weeks: date})}
                    />
                    <Button disabled={this.state.loading} onClick={this.getList} style={{marginLeft:10}} type='primary'>搜索</Button>
                </div>
                {
                    !this.state.loading && <Table 
                        className='ant-table-wrapper-text-center'
                        loading={this.state.loading}
                        bordered
                        pagination={false}
                        columns={this.state.columns}
                        dataSource={this.state.dataSource}
                    />
                }
            </TabPane>
        </Tabs>
        </div>
    }
}

export default CrmMyWorkReport;