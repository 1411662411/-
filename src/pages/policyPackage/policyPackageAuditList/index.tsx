import React from 'react';
import {Link, browserHistory} from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { Table, Radio, Spin } from 'antd';

import { fetchFn } from '../../../util/fetch';
import {DOMAIN_OXT, ROUTER_PATH} from "../../../global/global";
const API = `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/vetted-list`; 
const getList = (data) => {
    return fetchFn(API, data).then(data => data);
}

const demo = [
    {
        createTime: 11111,
        creatUser: 11111,
        vetted: 1,
        customerRemarkVetted: 1,
        provinceName: 11111,
        cityName: 11111,
        districtName: 11111,
        id: 11111,
    }
]
interface PolicyPackageAuditListState{
    value: number, //radio 值 用于记录所选条件
    customerRemarkVetted: '' | 0 | 1 | 2,
    vetted: '' | 0 | 1 | 2,
    current: number,  
    pageSize: number,
    total: number,
    loading: boolean,
    dataSource: any[],
    isRemarkVetted: boolean,
    pathname: string;
}
class PolicyPackageAuditList extends React.Component<any,PolicyPackageAuditListState>{
    constructor(props){
        super(props);
        this.state = {
            value: 0,
            customerRemarkVetted: '',
            vetted: '',
            current: 1, 
            pageSize: 20,
            total: 0,
            loading: false,

            dataSource: [],
            isRemarkVetted: false,
            pathname: '',
        }
    }

    getList = async(current, pageSize) => {
        this.setState({loading: true});
        const { customerRemarkVetted, vetted, isRemarkVetted } = this.state;
        let res:any = await getList({
            role: isRemarkVetted ? 3 : 2,
            start: (current-1) * pageSize,
            length: pageSize,
            customerRemarkVetted,
            vetted,
        });
        if(res.status === 0){
            this.setState({
                loading: false,
                total: res.recordsTotal,
                current,
                pageSize,
                dataSource: res.data || [],
            })
        }else{
            this.setState({loading: false});
        }
    }

    async componentWillMount(){
        let pathname = location.pathname;
        // console.log(pathname, `${ROUTER_PATH}/newadmin/social/materials/audit`);
        if(pathname === `${ROUTER_PATH}/newadmin/social/materials/audit`){
            this.setState({
                isRemarkVetted: false,
                pathname,
            }, async() => {
                await this.getList(1,20);
            })
        }else{
            this.setState({
                isRemarkVetted: true,
                pathname,
            }, async() => {
                await this.getList(1,20);
            })
        }
    }
    shouldComponentUpdate(nextProps,nextState){
        let pathname = location.pathname;
        if(pathname !== this.state.pathname){
            if(pathname === `${ROUTER_PATH}/newadmin/social/materials/audit`){
                this.setState({
                    isRemarkVetted: false,
                    pathname,
                    value: 0,
                    customerRemarkVetted: '',
                    vetted: '',
                    current: 1, 
                    pageSize: 20,
                    total: 0,
                    dataSource: [],
                }, async() => {
                    await this.getList(1,20);
                })
            }else{
                this.setState({
                    isRemarkVetted: true,
                    pathname,
                    value: 0,
                    customerRemarkVetted: '',
                    vetted: '',
                    current: 1, 
                    pageSize: 20,
                    total: 0,
                    dataSource: [],
                }, async() => {
                    await this.getList(1,20);
                })
            }
        }
        return true;
    }
    onChange = (e) => {
        const { current, pageSize } = this.state;
        switch(e.target.value){
            case 0: {
                this.setState({customerRemarkVetted: '',vetted: '',}, async() => {
                    await this.getList(current, pageSize)
                });
                break;
            }
            case 1: {
                this.setState({customerRemarkVetted: '',vetted: 0,}, async() => {
                    await this.getList(current, pageSize)
                });
                break;
            }
            case 2: {
                this.setState({customerRemarkVetted: 1,vetted: '',}, async() => {
                    await this.getList(current, pageSize)
                });
                break;
            }
        }
        this.setState({value: e.target.value});
        
    }

    render(){
        const columns = [
            {
                title: '省',
                key: '省',
                // width: 80,
                render: (data) => {
                    return data.provinceName;
                }
            },
            {
                title: '市',
                key: '市',
                // width: 80,
                render: (data) => {
                    return data.cityName;
                }
            },
            {
                title: '政策包名',
                key: '政策包名',
                // width: 80,
                render: (data) => {
                    return data.districtName;
                }
            },
            {
                title: '申请时间',
                key: '申请时间',
                // width: 80,
                render: (data) => {
                    return data.createTime;
                }
            },
            {
                title: '申请人',
                key: '申请人',
                // width: 80,
                render: (data) => {
                    return data.creatUser;
                }
            },
            {
                title: '审批状态',
                key: '审批状态',
                // width: 80,
                render: (data) => {
                    return data.vetted === 0 ? '待审批' : 
                        data.vetted === 1 ? '审批通过' : 
                        data.vetted === 2 ? '审批驳回' : 
                        data.vetted === 3 ? '免审' : '/';
                }
            },
            {
                title: '文案审批状态',
                key: '文案审批状态',
                // width: 80,
                render: (data) => {
                    return data.customerRemarkVetted === 0 ? '/' : 
                        data.customerRemarkVetted === 1 ? '待审批' : 
                        data.customerRemarkVetted === 2 ? '审批通过' : 
                        data.customerRemarkVetted === 3 ? '免审' : '/';
                }
            },
            {
                title: '操作',
                key: '操作',
                // width: 80,
                render: (data) => {
                    if(this.state.isRemarkVetted){
                        return data.customerRemarkVetted === 1 ? <a onClick={(e) => {
                            e.preventDefault();
                            browserHistory.push({
                                pathname: `${ROUTER_PATH}/newadmin/social/materials/auditvetted/detail`,
                                query: {
                                    policyId:data.historyId,
                                    role: 3 
                                },
                            });
                        }}>文案审批</a> : '/'
                    }else{
                        return data.vetted === 0 ? <a onClick={(e) => {
                            e.preventDefault();
                            browserHistory.push({
                                pathname: `${ROUTER_PATH}/newadmin/social/materials/audit/detail`,
                                query: {
                                    policyId:data.historyId,
                                    role: 2 
                                },
                            });
                        }}>审批</a> : '/';
                    }
                }
            },
        ];
        const pagination = {
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            showSizeChanger: true,
            showQuickJumper: true,
            // size: "small",
            pageSizeOptions:['20','30','50','100'],
            onChange: this.getList,
            onShowSizeChange: this.getList,
        };
        // console.log(this.state.scrollY)
        return <QueueAnim><div><Spin
            spinning={this.state.loading}
        >
            <div style={{textAlign: 'right', marginBottom: 15}}>
                <Radio.Group onChange={this.onChange} value={this.state.value}>
                    <Radio value={0}>全部</Radio>
                    <Radio value={1}>只显示待审批</Radio>
                    <Radio value={2}>只显示文案待审批</Radio>
                </Radio.Group>
            </div>
            <Table 
                className='ant-table-wrapper-text-center'
                bordered={true}
                dataSource={this.state.dataSource}
                columns={columns}
                pagination= {{
                    ...pagination, 
                    total: this.state.total,
                    pageSize: this.state.pageSize, 
                    current:this.state.current,
                }}
            /> 
        </Spin></div></QueueAnim> 
    }
}
export default PolicyPackageAuditList;
