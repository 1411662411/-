import React from 'react';
import { Form, Table, Menu, Dropdown, Button, Icon, Select, TreeSelect } from 'antd';
import moment from 'moment'
import { browserHistory } from 'react-router';
import { DOMAIN_OXT, ROUTER_PATH } from "../../../global/global";
import { fetchFn } from '../../../util/fetch';

import Tags from '../../../components/showcaseTags';
import FilterTableHeader from '../../../components/crm/common/FilterTableHeader';

import { getTreeData, Pagination } from '../../../util/crmUtil';

const WORK_REPORT_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/list`;
const Authority_API = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/getWorkReportSetAuthority`;
const POSITION_API = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getPositionByWorkReportSet`;
const getBranchCompanysWithLargeAreaAPI = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/getBranchCompanysWithLargeArea`;

const getAllList =  (data) => fetchFn(WORK_REPORT_LIST_API, {...data, type: 0}).then(data=>data)
const hasAuthority =  () => fetchFn(Authority_API, {}).then(data=>data)
const dictionary =  () => fetchFn(POSITION_API, {searchType:1}).then(data=>data);
const getBranchCompanysWithLargeArea =  () => fetchFn(getBranchCompanysWithLargeAreaAPI, {defaultAll: 0}).then(data=>data);

// import './style.less';

const TYPES = {
    "1": '日报',
    "2": '周报',
}

class CrmWorkReportConfig extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            selectedCriteria: new Map(),
            positions: [] as any[],
            company: [] as any[],
            list: [] as any[],
            loading: false,
            companyName: '',
            tableLoading: false,

            editAuthority: false,
            addAuthority: false,

            total: 0,
            pageSize: 20, 
            current: 1,
        }
    }
    onSearch = (name, value, title) => {
        let {selectedCriteria} = this.state;
        if(value === '' || value === undefined){
            selectedCriteria.delete(name);
        }else{
            if(name === 'reportType'){
                selectedCriteria.set(name, {name, value:`${title}：${TYPES[value]}` ,initialValue: value});
            }else if(name === 'positionId'){
                const content = this.state.positions.filter(item => item.code === value)
                selectedCriteria.set(name, {name, value:`${title}：${content[0].dictName}` ,initialValue: value});
            }else if(name === 'organizationId'){
                selectedCriteria.set(name, {name, value:`${title}：${this.state.companyName}` ,initialValue: value});''
            }else{
                selectedCriteria.set(name, {name, value:`${title}：${value}` ,initialValue: value});
            }
        }
        this.setState({selectedCriteria}, () => {
            this.getList(1, this.state.pageSize)
        });
    }

    handleMenuClick(e) {
        if(Number(e.key) === 2){
            browserHistory.push(`${DOMAIN_OXT}/newadmin/crm/customermanagement/workreportconfig/newweekly`)
        }else{
            browserHistory.push(`${DOMAIN_OXT}/newadmin/crm/customermanagement/workreportconfig/newdaily`)
        }
    }

    getList = async(current, pageSize) => {
        this.setState({tableLoading: true})
        let values = this.props.form.getFieldsValue();
        const res:any = await getAllList({
            start: (current-1) * pageSize,
            length: pageSize,
            ...values,
        })
        if(res.status === 0){
            this.setState({
                total: res.data.total,
                list: res.data.result,
                current,
                pageSize,
                tableLoading: false,
            })
        }else{
            this.setState({tableLoading: false});
        }
    }

    edit = (item, disabled = false) => {
        if(disabled){
            if(Number(item.reportType) === 2){
                browserHistory.push({
                    pathname:`${ROUTER_PATH}/newadmin/crm/customermanagement/workreportconfig/newweekly`,
                    state: {
                        id: item.id,
                        disabled: true,
                    },
                })
            }else{
                browserHistory.push({
                    pathname:`${ROUTER_PATH}/newadmin/crm/customermanagement/workreportconfig/newdaily`,
                    state: {
                        id: item.id,
                        disabled: true,
                    },
                })
            }
        }else{
            if(Number(item.reportType) === 2){
                browserHistory.push({
                    pathname:`${ROUTER_PATH}/newadmin/crm/customermanagement/workreportconfig/newweekly`,
                    state: {
                        id: item.id,
                    },
                })
            }else{
                browserHistory.push({
                    pathname:`${ROUTER_PATH}/newadmin/crm/customermanagement/workreportconfig/newdaily`,
                    state: {
                        id: item.id,
                    },
                })
            }
        }
        
        
    }

    async componentWillMount(){
        this.setState({tableLoading: true})
        const [hasAuthorityData, positions, company] = await Promise.all([
            hasAuthority(),
            dictionary(),
            getBranchCompanysWithLargeArea(),
        ])
        let editAuthority = !hasAuthorityData.data ? false : Number(hasAuthorityData.data.edit) === 1 ? true : false;
        let addAuthority = !hasAuthorityData.data ? false : Number(hasAuthorityData.data.add) === 1 ? true : false;
        this.setState({
            positions:positions.data || [],
            company: company.data,
            tableLoading: false,
            editAuthority,
            addAuthority,
        })
        await this.getList(1,20)
    }

    render(){
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, setFieldsValue } = this.props.form;
        const { positions, type, company, position, editAuthority, addAuthority } = this.state; 
        const menu = (
            <Menu onClick={this.handleMenuClick}>
              <Menu.Item key={1}>日 报</Menu.Item>
              <Menu.Item key={2}>周 报</Menu.Item>
            </Menu>
        );
        const columns = [
            {
                title: '操作',
                key: '操作',
                width: 120,
                render: (data) => {
                    return <div>
                        {editAuthority && <a onClick={() => {this.edit(data)}} style={{marginRight: 10}}>编辑</a>}
                        <a onClick={() => {this.edit(data, true)}}>查看</a>
                    </div>
                }
            },
            {
                title: <FilterTableHeader
                title='报告类型'
                name='reportType'
                form={this.props.form}
                initialValue=''
                onOk={this.onSearch}
            >
                <Select
                    style={{width: 140}}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                >
                    <Select.Option value={1}>
                        日报
                    </Select.Option>
                    <Select.Option value={2}>
                        周报
                    </Select.Option>
                    <Select.Option value={''}>
                        全部
                    </Select.Option>
                </Select>
            </FilterTableHeader>,
                dataIndex: 'reportType',
                width: 120,
                render: (data) => {
                    return Number(data) === 1 ? '日报' : '周报';
                },
            },
            {
                title: <FilterTableHeader
                    key='organizationId'
                    title='适用分公司'
                    name='organizationId'
                    form={this.props.form}
                    onOk={this.onSearch}
                    initialValue={''}
                >
                    <TreeSelect
                            placeholder='选择适用分公司'
                            style={{width: 180}}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                            treeData={getTreeData(company,'name', 'id', 'children') || []} 
                            onChange={(value, label) => {
                                this.setState({companyName: label[0]})
                            }}
                        >
                    </TreeSelect>
                </FilterTableHeader>,
                dataIndex: 'organizationName',
                render: (data) => {
                    return data || '/';
                }
            },
            {
                title: <FilterTableHeader
                    title='适用职位'
                    name='positionId'
                    form={this.props.form}
                    onOk={this.onSearch}
                    initialValue=''
                >
                    <Select
                        style={{width: 120}}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    >
                        <Select.Option value={''}>全部</Select.Option>
                        {
                            positions.map(item => <Select.Option value={item.code}>{item.dictName}</Select.Option>)
                        }
                    </Select>
                </FilterTableHeader>,
                width: 200,
                dataIndex: 'positionName',
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                width: 170,
                render: (data) => {
                    return data ? moment(data * 1000).format('YYYY-MM-DD') : '/'
                }
            },

        ];

        const pagination = new Pagination({
            size: 'small',
            onChange: this.getList,
            onShowSizeChange: this.getList,
            total: this.state.total,
            pageSize: this.state.pageSize, 
            current:this.state.current,
        })

        return <div className='crm-work-report-config-container'>
            <div
                style={{
                    position: 'relative',
                    height: 40,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 120,
                    }}
                >
                {
                    this.state.selectedCriteria.size > 0 && <Tags
                        title='已选条件'
                        dataSource={this.state.selectedCriteria.values()}
                        onClose={(item , number) => {
                            let {selectedCriteria}  = this.state;
                            this.props.form.setFieldsValue({[item.name]: ''});
                            selectedCriteria.delete(item.name);
                            this.setState({selectedCriteria}, () => {
                                this.getList(1, this.state.pageSize)
                            })
                        }}
                        closable={true}
                        color='cyan'
                        // onReset={this.tagsOnReset}
                    />
                }
                </div>
                {
                    addAuthority && <span
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 120,
                            margin: '10px 0px',
                            textAlign: 'right',
                        }}
                    >
                    <Dropdown
                        overlay={menu}
                        trigger={['click']}
                    >
                        <Button type='primary' size='small'>添加 <Icon type="down" /></Button>
                    </Dropdown>
                    </span>
                }
                
            </div>
        
        <Form>
        <Table
            className='ant-table-wrapper-text-center' 
            loading={this.state.tableLoading}
            bordered
            dataSource={this.state.list}
            columns={columns}
            pagination={pagination as any}
            // pagination={false}
            scroll={{
                y: 450,
            }}
        />
        </Form>
        
        </div>
    }
}



export default Form.create()(CrmWorkReportConfig);;