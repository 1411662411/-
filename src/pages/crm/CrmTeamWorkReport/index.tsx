import React from 'react';
import moment from 'moment';
import { Tabs, DatePicker, Button, Table, Icon, TreeSelect, Select } from 'antd';
import {browserHistory} from 'react-router';
import { DOMAIN_OXT, ROUTER_PATH } from "../../../global/global";
import { fetchFn } from '../../../util/fetch';
import { getTreeData, Pagination } from '../../../util/crmUtil';

const GET_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/submitList`;
const getBranchCompanysWithLargeAreaAPI = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/getBranchCompanysWithLargeArea`;
const USER_API = `${DOMAIN_OXT}/apiv2_/permission/v1/account/getSimpleUserByOrganization`;
const getList = (data) => fetchFn(GET_LIST_API,{...data,isSelf: 1}).then(data => data);
const getBranchCompanysWithLargeArea =  () => fetchFn(getBranchCompanysWithLargeAreaAPI, {defaultAll: 0}).then(data=>data);
const getSimpleUserByOrganization =  () => fetchFn(USER_API, {}).then(data=>data);


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
    tableContainerWidth:any;
    constructor(props){
        super(props)

        let error:boolean = false;
        let tableContainerWidth: any;
        try {
            tableContainerWidth = document.querySelectorAll('.static-breadcrumb.ant-breadcrumb')[0].clientWidth - 32*2 - 24*2; //获取可视范围表格最长宽度
        } catch (err) {
            error = true;
        }
        this.state={
            tableContainerWidth: error ? 0 : tableContainerWidth,
            columns: [
                {
                    title: '所在大区丨分公司',
                    dataIndex: 'regionAndBranchCompany',
                },
                {
                    title: '所在团队',
                    dataIndex: 'teamName',
                },
                {
                    title: '姓名丨工号',
                    dataIndex: 'nameAndEmployeeNumber',
                },
            ] as any[],
            weeks: moment(),
            today: moment(moment().format('YYYY-MM-DD')).unix(),
            daily: true,
            loading: false,
            organizationId: undefined,
            subordinateId: undefined,
            current:1,
            pageSize: 20,
            total: 20,
            error,
        }
    }

    getList = async (current, pageSize) => {
        this.setState({loading: true});
        let {weeks, daily, organizationId, subordinateId} = this.state;
        let res:any;
        let thead:any;
        if(daily){
            let day = weeks || moment();
            res = await getList({
                year: day.format('YYYY-ww').split('-')[0],
                week: day.format('YYYY-ww').split('-')[1],
                reportType: daily ? 1 : 2,
                organizationId,
                subordinateId,
                // start: (current - 1) * pageSize,
                // length: pageSize,
            });
        }else{
            let day = weeks || moment();
            res = await getList({
                year: day.format('YYYY-MM').split('-')[0],
                month: day.format('YYYY-MM').split('-')[1],
                reportType: daily ? 1 : 2,
                organizationId,
                subordinateId,
                // start: (current - 1) * pageSize,
                // length: pageSize,
            });
        }
        if(res.status === 0 && res.data.length > 0){
            const week:any[] = getWeek(res.data[0].submitList, daily);
            const afterToday = getThanToday(res.data[0].submitList, daily);
            const beforeToday = week.length - afterToday; //包含今天
            let columns:any[] = [
                {
                    title: '所在大区丨分公司',
                    dataIndex: 'regionAndBranchCompany',
                    width: 260,
                    render:(text) => text || '/'
                },
                {
                    title: '所在团队',
                    dataIndex: 'teamName',
                    width: 140,
                },
                {
                    title: '姓名丨工号',
                    dataIndex: 'nameAndEmployeeNumber',
                    width: 150
                },
            ];
            // console.log(week, afterToday);
            week.map((item, index) => {
                if(index < beforeToday){
                    columns.push({
                        title: item,
                        key: item,
                        width: 160,
                        render: (data) => {
                            return this.renderTD(data.submitList[index].workReportSet, daily ? data.submitList[index].day : data.submitList[index].weekStart)
                        }
                    })
                }else if(index === beforeToday){
                    columns.push({
                        title: item,
                        key: item,
                        width: 160,
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
                        width: 160,
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
        }else{
            this.setState({
                dataSource: [],
                loading: false,
            })
        }
    }

    async componentWillMount(){
        const [
            users,
            company,
        ]:any = await Promise.all([
            getSimpleUserByOrganization(),
            getBranchCompanysWithLargeArea(),
        ])
        this.setState({
            users: users.data || [],
            company: company.data || [],
        })
        await this.getList(1, 20)
    }

    componentDidMount(){
        if(this.state.error){
            this.tableContainerWidth = document.querySelectorAll('.static-breadcrumb.ant-breadcrumb')[0].clientWidth - 32*2 - 24*2; //获取可视范围表格最长宽度
            this.setState({
                tableContainerWidth: this.tableContainerWidth,
                error: false,
            })
        }
    }

    renderTD = (type, day) => {
        const {today, daily} = this.state;
        if(!type){
            return '/'
        }
        if(daily){
            if(Number(type.submit) === 0){
            //     if(today === getDateUnix(day)){
            //         return <a
            //             onClick={() => {
            //                 browserHistory.push({
            //                     pathname: `${ROUTER_PATH}/newadmin/crm/customermanagement/myworkreport/submitdaily`,
            //                     state: {
            //                         submit: true,
            //                         id: type.id,
            //                         day, 
            //                     },
            //                 });
            //             }}
            //         >提交</a>
            //     }else{
                    return <Icon style={{color:'#cecece'}} type="close-circle-o" />
                // }
            }else{
                return <a
                    onClick={() => {
                        browserHistory.push({
                            pathname: `${ROUTER_PATH}/newadmin/crm/customermanagement/teamworkreport/daily`,
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
            if(Number(type.submit) === 0){
                // if(moment.unix(today).format('YYYY-ww') === moment.unix(getDateUnix(day)).format('YYYY-ww')){
                //     return <a
                //         onClick={() => {
                //             browserHistory.push({
                //                 pathname: `${ROUTER_PATH}/newadmin/crm/customermanagement/myworkreport/submitweekly`,
                //                 state: {
                //                     submit: true,
                //                     id: type.id,
                //                     day, 
                //                 },
                //             });
                //         }}
                //     >提交</a>
                // }else{
                    return <Icon style={{color:'#cecece'}} type="close-circle-o" />
                // }
            }else{
                return <a
                    onClick={() => {
                        browserHistory.push({
                            pathname: `${ROUTER_PATH}/newadmin/crm/customermanagement/teamworkreport/weekly`,
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
    onTabsChange = (value) => {
        this.setState({
            daily: Number(value) === 1 ? true : false,
            organizationId: undefined,
            subordinateId: undefined,
        }, () => {
            this.getList(1, 20);
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
        const {company, daily} = this.state;

        const usersOptions:any[] = [];
        this.state.users && (Object as any).values(this.state.users).map((item,index)=> {
            usersOptions.push(<Select.Option key={`daily-${index}`} value={item.id}>{item.name}</Select.Option>)
        });
        
        const pagination = new Pagination({
            onChange:this.getList,
            onShowSizeChange: this.getList,
            total: this.state.total,
            current: this.state.current,
            pageSize: this.state.pageSize,
        })
        // console.log(this.state.tableContainerWidth)
        return <div className='crm-team-work-report-container'>
        <Tabs defaultActiveKey="1" onChange={this.onTabsChange}>
            <TabPane tab="日报" key="1">
            <div
                style={{marginBottom:15}}
            >
                <TreeSelect
                    placeholder='选择分公司'
                    style={{width: 180}}
                    value={this.state.organizationId}
                    treeData={getTreeData(company || [],'name', 'id', 'children')} 
                    onChange={(organizationId) => {
                        this.setState({
                            organizationId,
                        })
                    }}
                >
                </TreeSelect>

                <Select
                    placeholder='选择销售'
                    showSearch
                    optionFilterProp='children'
                    optionLabelProp='children'
                    style={{width: 140, margin: '0 10px'}}
                    value={this.state.subordinateId}
                    onChange={(subordinateId) => {
                        this.setState({
                            subordinateId,
                        })
                    }}
                >
                    {usersOptions}
                </Select>

                <WeekPicker 
                    style={{
                    width: 150,
                    }}
                    value={this.state.weeks}
                    onChange={this.onWeekPickerChange}
                    placeholder="选择周" 
                />
                <Button disabled={this.state.loading} onClick={() => {
                    this.getList(this.state.current, this.state.pageSize)
                }} style={{margin:'0 10px'}} type='primary'>搜索</Button>

                <Button disabled={this.state.loading} onClick={() => {
                    this.setState({
                        organizationId: undefined,
                        subordinateId: undefined,
                        weeks: moment(),
                    }, () => {
                        this.getList(this.state.current, this.state.pageSize)
                    })
                }}>重置</Button>
            </div>
                {!this.state.error && !this.state.loading && <Table 
                    className='ant-table-wrapper-text-center'
                    loading={this.state.loading}
                    bordered
                    columns={this.state.columns}
                    pagination={false}
                    style={{
                        width: this.state.tableContainerWidth > 1670 ? 1690 : '100%'
                    }}
                    // pagination={pagination as any}
                    dataSource={this.state.dataSource}
                    scroll={{
                        x: 1670,
                        y: 450,
                    }}
                />}
            </TabPane>
            <TabPane tab="周报" key="2">
                <div
                    style={{marginBottom:15}}
                >
                    <TreeSelect
                        placeholder='选择分公司'
                        style={{width: 180}}
                        value={this.state.organizationId}
                        treeData={getTreeData(company || [],'name', 'id', 'children')} 
                        onChange={(organizationId) => {
                            this.setState({
                                organizationId,
                            })
                        }}
                    >
                    </TreeSelect>

                    <Select
                        placeholder='选择销售'
                        showSearch
                        optionFilterProp='children'
                        optionLabelProp='children'
                        value={this.state.subordinateId}
                        style={{width: 120, margin: '0 10px'}}
                        onChange={(subordinateId) => {
                            this.setState({
                                subordinateId,
                            })
                        }}
                    >
                        {usersOptions}
                    </Select>
                    <MonthPicker 
                        style={{
                            width: 150,
                        }}
                        value={this.state.weeks}
                        placeholder="选择月" 
                        onChange={(date,dateString) => this.setState({weeks: date})}
                    />
                    <Button disabled={this.state.loading} onClick={() => {  
                        this.getList(this.state.current, this.state.pageSize)
                    }} style={{margin:'0 10px'}} type='primary'>搜索</Button>
                    <Button disabled={this.state.loading} onClick={() => {
                        this.setState({
                            organizationId: undefined,
                            subordinateId: undefined,
                            weeks: moment(),
                        }, () => {
                            this.getList(this.state.current, this.state.pageSize)
                        })
                    }}>重置</Button>
                </div>
                {!this.state.error && !this.state.loading && <Table 
                    className='ant-table-wrapper-text-center'
                    loading={this.state.loading}
                    bordered
                    pagination={false}
                    style={{
                        width: this.state.tableContainerWidth > 1350 ? 1370 : '100%'
                    }}
                    // pagination={pagination as any}
                    columns={this.state.columns}
                    dataSource={this.state.dataSource}
                    scroll={{
                        x: 1350,
                        y: 450,
                    }}
                />}
            </TabPane>
        </Tabs>
        </div>
    }
}

export default CrmMyWorkReport;