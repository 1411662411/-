import React from 'react';
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';
import {DOMAIN_OXT} from "../../../global/global";
import { Table, Modal, Input, Form, Icon, Button, Divider, Select, Tag, Row, Col, Alert, Popconfirm, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Immutable from 'immutable';
import moment from 'moment';
import { eachUpdateIn } from '../../../util/immutableUtil';


import { hasErrors } from '../../../util/antdCommon';

import TableUI from '../../../components/Table';
import SelectCity from '../../../components/select-city';
import { Organizations } from '../../../components/common/organizationsUi';
import Tags from '../../../components/showcaseTags';

import { fetchFn } from '../../../util/fetch';
import { isParent } from '../../../util/crmUtil';
const SOLE_LIST_API = `${DOMAIN_OXT}/apiv2_/policy/singleton/list`; //单立户管理列表接口
const UPDATE_BY_IDS_API = `${DOMAIN_OXT}/apiv2_/policy/singleton/updateByIds`; //更新社保托收日期接口
const OPEN_API = `${DOMAIN_OXT}/apiv2_/policy/singletonSocialInfo/openAnAccountSuccess`; //开户完成接口
const GET_ORAGNIZATION_API = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/getOrganizationByLogin`; //获取组织架构信息
const getSoleList = (data) => {
    return fetchFn(SOLE_LIST_API, data).then(data => data);
}
const updateByIds = (data) => {
    return fetchFn(UPDATE_BY_IDS_API, data).then(data => data);
}
const openAnAccountSuccess = (data) => {
    return fetchFn(OPEN_API, data).then(data => data);
}
const getOrganizationByLogin = () => { //获取组织架构信息
    return fetchFn(GET_ORAGNIZATION_API, {}).then(data => data);
}

const FormItem = Form.Item;

import './style.less';
class SoleManagement extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state={
            current:1,
            scrollY: 560,
            pageSize: 20,
            total: 0,
            dataSource: [],
            loading: false,
            selectedRowKeys: [], // Check here to configure the default column
            ids: '', //已选ids
            selectedRowKeysLen: 0, //已选数量
            collectionDateOfSocialVisible: false, //设置社保托收日期显隐
            setCollectionDateOfSocial:'',   //设置社保托收日期
            inputErr: false,
            PopconfirmVisible: false,

            collectionDate: undefined,
            SocialCpfModalVisible: false, //开户完成弹窗是否显示
            SocialCpfModalKey:0, //开户完成弹窗key值
            selectedCriteriaClosable: true,  // 已选条件是否可以删除，当一个条件被删除时，其它条件不可删除
            queryOrganizationsAndUsers: {} as any,
            ownUserWithOrganization: {} as any,
            getOrganizationByPosition: {} as any,
            selectedCriteria:new Map(), //已选条件
            SelectCityKey: 1, //政策包选择器 key

            customerNameVisible: false, //公司名称 搜素框显隐
            policyIdVisible: false, //政策包id 搜素框显隐
            socialNeedStatusVisible: false, //社保是否需要开户 搜素框显隐
            socialOpenStatusVisible: false, //社保是否已开户 搜素框显隐
            socialCollectionDateVisible: false,  //社保托收日期 搜素框显隐
            fundNeedStatusVisible: false,   //公积金是否需要开户 搜素框显隐
            fundOpenStatusVisible: false,   //公积金是否已开户 搜素框显隐
            fundCollectionDateVisible: false,   //公积金托收日期 搜素框显隐
            advisorIdVisible: false,    //社保顾问id 搜素框显隐
            salesIdVisible: false,  //所属销售 搜素框显隐

            searchSelectedCriteria: Immutable.fromJS({
                customerName:'', //公司名称
                policyName: '',    //政策包id
                socialNeedStatus: '',  //社保是否需要开户
                socialOpenStatus: '',  //社保是否已开户
                socialCollectionDate: '',  //社保托收日期
                fundNeedStatus: '',  //公积金是否需要开户
                fundOpenStatus: '',  //公积金是否已开户
                fundCollectionDate: '',  //公积金托收日期
                advisorName: '',  //社保顾问id
                salesName: '',   //所属销售
            }),

            cacheSearchData: Immutable.fromJS({
                customerName:'', //公司名称
                policyId: [],    //政策包id
                socialNeedStatus: '',  //社保是否需要开户
                socialOpenStatus: '',  //社保是否已开户
                socialCollectionDate: '',  //社保托收日期
                fundNeedStatus: '',  //公积金是否需要开户
                fundOpenStatus: '',  //公积金是否已开户
                fundCollectionDate: '',  //公积金托收日期
                advisorId: '',  //社保顾问id
                salesId: '',   //所属销售
            }),

            searchData: Immutable.fromJS({
                customerName:'', //公司名称
                policyId: [],    //政策包id
                socialNeedStatus: '',  //社保是否需要开户
                socialOpenStatus: '',  //社保是否已开户
                socialCollectionDate: '',  //社保托收日期
                fundNeedStatus: '',  //公积金是否需要开户
                fundOpenStatus: '',  //公积金是否已开户
                fundCollectionDate: '',  //公积金托收日期
                advisorId: '',  //社保顾问id
                salesId: '',   //所属销售
            }),

            openType: 0, //完成开户  1社保 2公积金
            singletonSocialInfoId: 0, //社保户主键
            singletonId: 0, //单立户主键
        }
    }
    searchInput:any;
    setCacheSearchData = (data) => {
        return new Promise((resolve, reject) => {
            this.setState(({ cacheSearchData }) => ({
                cacheSearchData: eachUpdateIn(cacheSearchData, data)
            }),() => {
                resolve()
            });
        })
    }
    setSearchData = (data) => {
        return new Promise((resolve, reject) => {
            this.setState(({ searchData }) => ({
                searchData: eachUpdateIn(searchData, data)
            }),() => {
                resolve()
            });
        })
    }
    setSearchSelectedCriteria = (data) => {
        return new Promise((resolve, reject) => {
            this.setState(({ searchSelectedCriteria }) => ({
                searchSelectedCriteria: eachUpdateIn(searchSelectedCriteria, data)
            }),() => {
                resolve()
            });
        })
    }
    onInputChange = (key, value) => {
        this.setSearchData({'customerName': value});
    }
    onSearch = async(key?, name?, value?, value2?) => { //value:searchData  value2:searchSelectedCriteria
        this.setState({
            loading: true, 
            selectedCriteriaClosable: false,
        });
        key && this.setState({[key]:false});
        const searchData = this.state.searchData.toJS();
        let {selectedCriteria} = this.state;
        // console.log(key, name, value, value2, searchData[value])
        
        if(name && typeof searchData[value] === 'string' && searchData[value].trim() === ''){
            await Promise.all([
                this.setSearchData({[value]: ''}),
                this.setCacheSearchData({[value]: ''}),
            ]);
            // this.setState({
            //     loading: false,
            //     selectedCriteriaClosable: true,
            // });
            // return;
        }
        if(name && Array.isArray(searchData[value]) && searchData[value].length === 0){
            await Promise.all([
                this.setSearchData({[value]: ''}),
                this.setCacheSearchData({[value]: ''}),
            ]);
            // this.setState({
            //     loading: false,
            //     selectedCriteriaClosable: true,
            // });
            // return;
        }
        const searchSelectedCriteria = this.state.searchSelectedCriteria.toJS();
        const {current, pageSize} = this.state;
        await this.getSoleList(current, pageSize);
        // console.log(value2, '****', searchSelectedCriteria[value2], searchData[value])
        // console.log(searchData[value].length !== 0);
        name !== undefined 
        && ((Array.isArray(searchData[value]) && searchData[value].length !== 0) 
        || (typeof searchData[value] === 'string' && searchData[value].trim() !== '') 
        || (typeof searchData[value] === 'number'))
        ? selectedCriteria.set(name,{
            value:`${name}：${searchSelectedCriteria[value2]}`,
            key:value,
            name:name,
        }) : selectedCriteria.delete(name);
        this.setState({
            loading: false,
            selectedCriteria,
            selectedCriteriaClosable: true,
        });
    }
    tagsOnReset = async() => {
        let selectedCriteria = this.state.selectedCriteria;
        selectedCriteria.clear();
        this.setState({
            searchData: Immutable.fromJS({
                customerName:'', //公司名称
                policyId: '',    //政策包id
                socialNeedStatus: '',  //社保是否需要开户
                socialOpenStatus: '',  //社保是否已开户
                socialCollectionDate: '',  //社保托收日期
                fundNeedStatus: '',  //公积金是否需要开户
                fundOpenStatus: '',  //公积金是否已开户
                fundCollectionDate: '',  //公积金托收日期
                advisorId: '',  //社保顾问id
                salesId: '',   //所属销售
            }),

            searchSelectedCriteria: Immutable.fromJS({
                customerName:'', //公司名称
                policyName: '',    //政策包id
                socialNeedStatus: '',  //社保是否需要开户
                socialOpenStatus: '',  //社保是否已开户
                socialCollectionDate: '',  //社保托收日期
                fundNeedStatus: '',  //公积金是否需要开户
                fundOpenStatus: '',  //公积金是否已开户
                fundCollectionDate: '',  //公积金托收日期
                advisorName: '',  //社保顾问id
                salesName: '',   //所属销售
            }),

            cacheSearchData: Immutable.fromJS({
                customerName:'', //公司名称
                policyId: '',    //政策包id
                socialNeedStatus: '',  //社保是否需要开户
                socialOpenStatus: '',  //社保是否已开户
                socialCollectionDate: '',  //社保托收日期
                fundNeedStatus: '',  //公积金是否需要开户
                fundOpenStatus: '',  //公积金是否已开户
                fundCollectionDate: '',  //公积金托收日期
                advisorId: '',  //社保顾问id
                salesId: '',   //所属销售
            }),
            SelectCityKey: 0,
            selectedCriteria,
        }, () => {
            this.onSearch();
        })
    }
    selectedCriteriaOnClose = async(item, index) => {  //已选条件删除时触发
        this.setState({selectedCriteriaClosable: false}); //设置tag不可删除
        let { selectedCriteria } = this.state;
        await Promise.all([
            this.setSearchData({[item.key]: item.key === 'policyId' ? [] : ''}),
            this.setCacheSearchData({[item.key]: item.key === 'policyId' ? [] : ''}),
        ]); 
        selectedCriteria.delete(item.name);
        if(item.key === 'policyId'){
            this.setState({SelectCityKey: this.state.SelectCityKey+1})
        }
        this.setState({selectedCriteria});
        this.onSearch();
    }
    onFilterDropdownVisibleChange = async(key, name, visible) => {
        if(!visible){
            const {searchData} = this.state;
            await this.setCacheSearchData({[name]: searchData.toJS()[name]});
            if(name === 'policyId'){
                this.setState({SelectCityKey: this.state.SelectCityKey+1})
            }   
        }
        this.setState({
            [key]: visible,
        });
    }
    getSoleList= async(current, pageSize=this.state.pageSize)=>{
        // const { pageSize } = this.state;
        this.setState({
            loading: true, 
            ids: '', //已选ids
            selectedRowKeysLen: 0, //已选数量
            collectionDateOfSocialVisible: false, //设置社保托收日期显隐
            setCollectionDateOfSocial:'',   //设置社保托收日期
            selectedRowKeys: [],
        });
        const {searchData} = this.state;
        let response:any = await getSoleList({
            start: (current-1) * pageSize,
            length: pageSize,
            ...searchData.toJS(),
            policyId: searchData.toJS().policyId.length > 0 ? searchData.toJS().policyId[searchData.toJS().policyId.length -1] : '',
        })
        if(response.status === 0){
            await this.setState({
                dataSource: response.data ? response.data.result || [] : [],
                current,
                pageSize,
                total: response.data ? response.data.total ? response.data.total : 0 : 0,
                loading: false,
            })
        }else{
            this.setState({loading: false});
        }
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
        let ids:any = [];
        let selectedRowKeysLen = selectedRowKeys.length;
        for(let i=0; i < selectedRowKeysLen; i++){
            ids.push(selectedRows[i].id)
        }
        ids = ids.join(',');
        this.setState({ 
            selectedRowKeys, 
            ids,
            selectedRowKeysLen,
            collectionDateOfSocialVisible: selectedRowKeysLen > 0 ? true : false,
        });
    }
    updateByIds = async() => {
        this.setState({loading: true});
        const { ids, setCollectionDateOfSocial, collectionDateOfSocialVisible } = this.state;
        if(setCollectionDateOfSocial.trim() == ''){
            this.setState({inputErr: true, loading: false, setCollectionDateOfSocial: ''});
            return false;
        }
        this.setState({PopconfirmVisible: false});  //设置社保托收日期气泡显隐
        const res:any = await updateByIds({ids,socialCollectionDate: setCollectionDateOfSocial});
        // console.log(res);
        this.setState({
            loading: false, 
            // ids: '', //已选ids
            // selectedRowKeysLen: 0, //已选数量
            // collectionDateOfSocialVisible: false, //设置社保托收日期显隐
            // setCollectionDateOfSocial:'',   //设置社保托收日期
            // selectedRowKeys: [],
        });
        if(res.status === 0){
            message.success('操作成功');
            this.onSearch();
        }
    }
    async componentWillMount(){
        this.setState({loading: true});
        let byLogin = await getOrganizationByLogin();
        document.querySelectorAll('.ant-breadcrumb > span')[0].innerHTML= `单立户管理${byLogin.data ? ` _ ${byLogin.data.name}` : ''}`;
        // console.log(byLogin)
        
        await this.getSoleList(1, this.state.pageSize);
        // console.log(this.props.userInfo)
        let [
            queryOrganizationsAndUsers, 
            getOrganizationByPosition, 
            // ownUserWithOrganization,
        ]= await Promise.all([
            fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/organization/queryOrganizationsAndUsers`, {}),
            fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/organization/getOrganizationByPosition`, {}),
            // fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/account/getUserWithOrganization`, {id: this.props.userInfo.userId}),
        ]);
        this.setState({
            queryOrganizationsAndUsers,
            getOrganizationByPosition,
            // ownUserWithOrganization,
        })
        // console.log(queryOrganizationsAndUsers, getOrganizationByPosition, ownUserWithOrganization)
    }
    closeSomeModal = (e) => {
        if(this.state.PopconfirmVisible && e.target.id !== 'open-setCollectionDateOfSocial' && !!!isParent(e.target, document.querySelectorAll('.ant-popover')[0])){ //页面中点击 不在 设置社保托收日期气泡框区域时，关闭气泡框并重置数据
            this.setState({PopconfirmVisible: false, setCollectionDateOfSocial: ''});
        }
    }
    componentDidMount(){
        const scrollY = window.innerHeight * 0.6;
        this.setState({scrollY});
        document.addEventListener('click', this.closeSomeModal);
    }
    renderSearchButton(key, name, value, value2){
        return <div style={{marginTop: 5, textAlign: 'right'}}>
            <Button size='small' style={{}} type="primary" onClick={async() => {
                const {cacheSearchData} = this.state;
                await this.setSearchData({[value]: cacheSearchData.toJS()[value]});
                this.onSearch(key, name, value, value2);
            }}>确定</Button>
        </div>
    }
    renderFilterIcon(filtered){
        return <Icon type="filter" style={{ color: filtered ? '#108ee9' : '#fff', verticalAlign: 'initial' }} />
    }
    render(){
        const { 
            selectedRowKeys, 
            SocialCpfModalVisible, 
            dataSource, 
            tableWidth,
            searchData,
            cacheSearchData,
            queryOrganizationsAndUsers,
            ownUserWithOrganization,
            SelectCityKey,

            selectedRowKeysLen, //已选数量
            collectionDateOfSocialVisible, //设置社保托收日期显隐
            setCollectionDateOfSocial,   //设置社保托收日期
            inputErr,

            openType, //完成开户  1社保 2公积金
            singletonSocialInfoId, //社保户主键
            singletonId, //单立户主键
        } = this.state;
        const {
            customerName,
            socialNeedStatus,
            socialOpenStatus,
            fundNeedStatus,
            fundOpenStatus,
            fundCollectionDate,
            socialCollectionDate,
            advisorId,
            salesId,
            policyId,
        } = cacheSearchData.toJS();
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            // onSelection: this.onSelectChange,
        };
        const hasErr = inputErr ? {borderColor: '#e4393c'} : {};
        const columns:any[] = [
            {
                title: '操作',
                key: '操作',
                width: 200,
                fixed: "left", 
                render: (data)=>{
                     return <div style={{textAlign:'left'}}>
                        {
                            data.socialInfoButton === 1 ? <a target='_blank' href={`${DOMAIN_OXT}/newadmin/social/solemanagement/socialsecurityinformation?singletonSocialInfoId=${data.socialInfoId}&customerName=${data.customerInfo.customerName}`}>社保户信息</a> : ''
                        }
                        {
                            data.status === 0 ? <a style={{marginLeft: 10}} target='_blank' href={`${DOMAIN_OXT}/newadmin/social/solemanagement/open?listId=${data.id}&customerId=${data.customerInfo.customerId}&customerName=${data.customerInfo.customerName}&socialInfoId=${data.socialInfoId}`}>发送征询函</a> :
                            data.status === 1 ? <a style={{marginLeft: 10}} target='_blank' href={`${DOMAIN_OXT}/newadmin/social/solemanagement/open?accountInfoId=${data.accountInfoId}&listId=${data.id}&customerId=${data.customerInfo.customerId}&customerName=${data.customerInfo.customerName}&socialInfoId=${data.socialInfoId}`}>重新发送征询函</a> :
                            data.status === 2 ? <a style={{marginLeft: 10}} target='_blank' href={`${DOMAIN_OXT}/newadmin/social/solemanagement/detail?accountInfoId=${data.accountInfoId}&isEdit=true&socialInfoId=${data.socialInfoId}&customerName=${data.customerInfo.customerName}`}>征询函 <i style={{color: '#FC5C00'}} className='crmiconfont crmicon-new'></i></a> :
                            ''
                        }
                     </div>;
                }
            },
            {
                title: '公司名称',
                key: '公司名称',
                fixed: "left",
                width: 240,
                render: (data) => {
                    return data.customerInfo.customerName;
                },
                filterDropdown: (
                    <div style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                      <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="公司名称"
                        value={customerName}
                        onBlur={(e:any) => {
                            Promise.all([
                                this.setCacheSearchData({'customerName': e.target.value.trim()}),
                                this.setSearchSelectedCriteria({'customerName': e.target.value.trim()}),
                            ])
                        }}
                        onChange={(e) => {
                            Promise.all([
                                this.setCacheSearchData({'customerName': e.target.value}),
                                this.setSearchSelectedCriteria({'customerName': e.target.value}),
                            ])
                        }}
                        // onPressEnter={() => this.onSearch('customerNameVisible', '公司名称', 'customerName', 'customerName')}
                        suffix={customerName ? <Icon style={{cursor:'pointer'}} type="close-circle" onClick={() => {
                            Promise.all([
                                this.setCacheSearchData({'customerName': ''}),
                                this.setSearchSelectedCriteria({'customerName': ''}),
                            ])
                        }} /> : null} 
                        // style={{width: 150, marginRight: 5}}
                      />
                      {this.renderSearchButton('customerNameVisible', '公司名称', 'customerName', 'customerName')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(customerName !== ''),
                filterDropdownVisible: this.state.customerNameVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('customerNameVisible', 'customerName', visible);
                },
            },
            {
                title: '签单产品',
                key: '签单产品',
                width: 240,
                render: (data) => {
                    return data.contractInfo ? <div>
                        {data.contractInfo.productName}
                        <div>
                            {data.contractInfo.startTimeString ? moment(data.contractInfo.startTimeString).format('YYYY-MM-DD') : '/'}
                            &nbsp;至&nbsp;
                            {data.contractInfo.endTimeString ? moment(data.contractInfo.endTimeString).format('YYYY-MM-DD') : '/'}
                        </div>
                    </div> : '/';
                }
            },
            {
                title: '政策包',
                key: '政策包',
                width: 140,
                render: (data) => {
                    return data.policyName || '/';
                },
                filterDropdown: (
                    <div style={{padding: 5, background: '#fff', position: 'relative'}} className="custom-filter-dropdown select-city1">
                      <SelectCity 
                        key={SelectCityKey}
                        params={{
                            deepMap:[
                                {name: '省', value: policyId && policyId.length >=1 ? policyId[0] : undefined},
                                {name: '市', value: policyId && policyId.length >=2 ? policyId[1] : undefined},
                                {name: '区', value: policyId && policyId.length >=3 ? policyId[2] : undefined},
                            ],
                            popupStyle: {
                                width: 350,
                                zIndex: 99999,
                            }, /* 弹窗样式 */
                            placeholder: '请选择政策包',
                            addressApi:`${DOMAIN_OXT}/apiv2_/policy/singleton/areas/getcityjson`,
                            transform:true,
                            // address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
                            style: {
                                width: 200,
                            }, /* input 的样式 */
                            pointParentNode: true, //渲染再父节点
                            onChange:(selectVal, selectName, code) => {
                                // console.log(selectVal, selectName, code)
                                Promise.all([
                                    this.setCacheSearchData({'policyId': selectVal}),
                                    this.setSearchSelectedCriteria({'policyName': selectName.join(' ')}),
                                ])
                            }
                        }}
                        code={1}
                      />
                      {this.renderSearchButton('policyIdVisible', '政策包', 'policyId', 'policyName')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(policyId.length !== 0),
                filterDropdownVisible: this.state.policyIdVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('policyIdVisible', 'policyId', visible);
                },
            },
            {
                title: '社保是否需要开户',
                key: '社保是否需要开户',
                width: 160,
                render: (data) => {
                    return data.socialNeedStatus === 0 ? '不需要' :
                           data.socialNeedStatus === 1 ? <div> 需要 {(data.accountInfoId && data.status === 3) && <Divider type="vertical" />}{(data.accountInfoId && data.status === 3) && <a target='_blank' href={`${DOMAIN_OXT}/newadmin/social/solemanagement/detail?accountInfoId=${data.accountInfoId}&isEdit=false`}>开户信息</a>} </div> : 
                           '/';
                        //    data.socialNeedStatus === 2 ? '暂不需要' : '/';
        
                },
                filterDropdown: (
                    <div id='custom-filter-dropdown-socialNeedStatus' style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                        <Select
                            value={socialNeedStatus}
                            style={{width: 140}}
                            onSelect={(value, text) => {
                                Promise.all([
                                    this.setCacheSearchData({'socialNeedStatus': value}),
                                    this.setSearchSelectedCriteria({'socialNeedStatus': text.props.children}),
                                ])
                            }}
                            getPopupContainer={() => document.getElementById('custom-filter-dropdown-socialNeedStatus') as HTMLElement}
                        >
                            <Select.Option value={1}>
                                需要
                            </Select.Option>
                            <Select.Option value={0}>
                                不需要
                            </Select.Option>
                            <Select.Option value={''}>
                                全部
                            </Select.Option>
                        </Select>
                        {this.renderSearchButton('socialNeedStatusVisible', '社保是否需要开户', 'socialNeedStatus', 'socialNeedStatus')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(socialNeedStatus !== ''),
                filterDropdownVisible: this.state.socialNeedStatusVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('socialNeedStatusVisible', 'socialNeedStatus', visible);
                },
            },
            {
                title: '社保是否已开户',
                key: '社保是否已开户',
                width: 140,
                render: (data) => {
                    return data.socialOpenStatus === 1 ? '已开户' : 
                        data.socialOpenStatus === 0 ? data.status === 3 ? <div>未开户 <Divider type="vertical" /> <a onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                            openType: 1, //完成开户  1社保 2公积金
                            singletonSocialInfoId: data.socialInfoId, //社保户主键
                            singletonId: data.id, //单立户主键
                            collectionDate: data.socialCollectionDate,
                            SocialCpfModalKey: this.state.SocialCpfModalKey + 1,
                        }, () => {
                            this.setState({SocialCpfModalVisible: true});
                        })
                    }}>开户完成</a> </div> : '未开户' : '/';
                },
                filterDropdown: (
                    <div id='custom-filter-dropdown-socialOpenStatus' style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                        <Select
                            value={socialOpenStatus}
                            style={{width: 140}}
                            onSelect={(value, text) => {
                                Promise.all([
                                    this.setCacheSearchData({'socialOpenStatus': value}),
                                    this.setSearchSelectedCriteria({'socialOpenStatus': text.props.children}),
                                ])
                            }}
                            getPopupContainer={() => document.getElementById('custom-filter-dropdown-socialOpenStatus') as HTMLElement}
                        >
                            <Select.Option value={0}>
                                未开户
                            </Select.Option>
                            <Select.Option value={1}>
                                已开户
                            </Select.Option>
                            <Select.Option value={''}>
                                全部
                            </Select.Option>
                        </Select>
                        {this.renderSearchButton('socialOpenStatusVisible', '社保是否已开户', 'socialOpenStatus', 'socialOpenStatus')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(socialOpenStatus !== ''),
                filterDropdownVisible: this.state.socialOpenStatusVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('socialOpenStatusVisible', 'socialOpenStatus', visible);
                },
            },
            {
                title: '社保托收日期（每月）',
                key: 'socialCollectionDate',
                dataIndex: 'socialCollectionDate',
                width: 200,
                render: (text) => {
                    return text || '/'
                },
                filterDropdown: (
                    <div style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                      <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="社保托收日期（每月）"
                        value={socialCollectionDate}
                        onBlur={(e:any) => {
                            Promise.all([
                                this.setCacheSearchData({'socialCollectionDate': e.target.value.trim()}),
                                this.setSearchSelectedCriteria({'socialCollectionDate': e.target.value.trim()}),
                            ])
                        }}
                        onChange={(e) => {
                            Promise.all([
                                this.setCacheSearchData({'socialCollectionDate': e.target.value}),
                                this.setSearchSelectedCriteria({'socialCollectionDate': e.target.value}),
                            ])
                        }}
                        suffix={socialCollectionDate ? <Icon style={{cursor:'pointer'}} type="close-circle" onClick={() => {
                            Promise.all([
                                this.setCacheSearchData({'socialCollectionDate': ''}),
                                this.setSearchSelectedCriteria({'socialCollectionDate': ''}),
                            ])
                        }} /> : null} 
                        // onPressEnter={() => this.onSearch('socialCollectionDateVisible', '社保托收日期（每月）', 'socialCollectionDate', 'socialCollectionDate')}
                        style={{width: 150, marginRight: 5}}
                      />
                      {this.renderSearchButton('socialCollectionDateVisible', '社保托收日期（每月）', 'socialCollectionDate', 'socialCollectionDate')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(socialCollectionDate !== ''),
                filterDropdownVisible: this.state.socialCollectionDateVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('socialCollectionDateVisible', 'socialCollectionDate', visible);
                },
            },
            {
                title: '公积金是否需要开户',
                key: '公积金是否需要开户',
                width: 170,
                render: (data) => {
                    return data.fundNeedStatus === 0 ? '不需要' :
                           data.fundNeedStatus === 1 ? <div> 需要 {(data.accountInfoId && data.status === 3) && <Divider type="vertical" />}{(data.accountInfoId && data.status === 3) && <a target='_blank' href={`${DOMAIN_OXT}/newadmin/social/solemanagement/detail?accountInfoId=${data.accountInfoId}&isEdit=false`}>开户信息</a>} </div> :
                           data.fundNeedStatus === 2 ? '暂不需要' : '/';
                },
                filterDropdown: (
                    <div id='custom-filter-dropdown-fundNeedStatus' style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                        <Select
                            value={fundNeedStatus}
                            style={{width: 140}}
                            onSelect={(value, text) => {
                                Promise.all([
                                    this.setCacheSearchData({'fundNeedStatus': value}),
                                    this.setSearchSelectedCriteria({'fundNeedStatus': text.props.children}),
                                ])
                            }}
                            getPopupContainer={() => document.getElementById('custom-filter-dropdown-fundNeedStatus') as HTMLElement}
                        >
                            <Select.Option value={1}>
                                需要
                            </Select.Option>
                            <Select.Option value={0}>
                                不需要
                            </Select.Option>
                            <Select.Option value={''}>
                                全部
                            </Select.Option>
                        </Select>
                        {this.renderSearchButton('fundNeedStatusVisible', '公积金是否需要开户', 'fundNeedStatus', 'fundNeedStatus')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(fundNeedStatus !== ''),
                filterDropdownVisible: this.state.fundNeedStatusVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('fundNeedStatusVisible', 'fundNeedStatus', visible);
                },
            },
            {
                title: '公积金是否已开户',
                key: '公积金是否已开户',
                width: 160,
                render: (data) => {
                    return data.fundOpenStatus === 1 ? '已开户' : 
                        data.fundOpenStatus === 0 ? data.status === 3 ? <div>未开户 {data.fundNeedStatus !== 2 && <Divider type="vertical" />}{data.fundNeedStatus !== 2 && <a onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                            openType: 2, //完成开户  1社保 2公积金
                            singletonSocialInfoId: data.socialInfoId, //社保户主键
                            singletonId: data.id, //单立户主键
                            collectionDate: data.fundCollectionDate,
                            SocialCpfModalKey: this.state.SocialCpfModalKey + 1,
                        }, () => {
                            this.setState({SocialCpfModalVisible: true});
                        })
                    }}>开户完成</a> }  </div> : '未开户' : '/';
                },
                filterDropdown: (
                    <div id='custom-filter-dropdown-fundOpenStatus' style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                        <Select
                            value={fundOpenStatus}
                            style={{width: 140}}
                            onSelect={(value, text) => {
                                Promise.all([
                                    this.setCacheSearchData({'fundOpenStatus': value}),
                                    this.setSearchSelectedCriteria({'fundOpenStatus': text.props.children}),
                                ])
                            }}
                            getPopupContainer={() => document.getElementById('custom-filter-dropdown-fundOpenStatus') as HTMLElement}
                        >
                            <Select.Option value={0}>
                                未开户
                            </Select.Option>
                            <Select.Option value={1}>
                                已开户
                            </Select.Option>
                            <Select.Option value={''}>
                                全部
                            </Select.Option>
                        </Select>
                        {this.renderSearchButton('fundOpenStatusVisible', '公积金是否已开户', 'fundOpenStatus', 'fundOpenStatus')}
                    </div>
                ),
                filtered: true,
                filterIcon: this.renderFilterIcon(fundOpenStatus !== ''),
                filterDropdownVisible: this.state.fundOpenStatusVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('fundOpenStatusVisible', 'fundOpenStatus', visible);
                },
            },
            {
                title: '公积金托收日期（每月）',
                key: '公积金托收日期（每月）',
                width: 200,
                dataIndex: 'fundCollectionDate',
                render: (text) => {
                    return text || '/'
                },
                filterDropdown: (
                    <div style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                      <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="公积金托收日期（每月）"
                        value={fundCollectionDate}
                        onBlur={(e:any) => {
                            Promise.all([
                                this.setCacheSearchData({'fundCollectionDate': e.target.value.trim()}),
                                this.setSearchSelectedCriteria({'fundCollectionDate': e.target.value.trim()}),
                            ])
                        }}
                        onChange={(e) => {
                            Promise.all([
                                this.setCacheSearchData({'fundCollectionDate': e.target.value}),
                                this.setSearchSelectedCriteria({'fundCollectionDate': e.target.value}),
                            ])
                        }}
                        suffix={fundCollectionDate ? <Icon style={{cursor:'pointer'}} type="close-circle" onClick={() => {
                            Promise.all([
                                this.setCacheSearchData({'fundCollectionDate': ''}),
                                this.setSearchSelectedCriteria({'fundCollectionDate': ''}),
                            ])
                        }} /> : null} 
                        // onPressEnter={this.onSearch}
                        style={{width: 170, marginRight: 5}}
                      />
                      {this.renderSearchButton('fundCollectionDateVisible', '公积金托收日期（每月）', 'fundCollectionDate', 'fundCollectionDate')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(fundCollectionDate !== ''),
                filterDropdownVisible: this.state.fundCollectionDateVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('fundCollectionDateVisible', 'fundCollectionDate', visible);
                },
            },
            {
                title: '客户业务联系人',
                key: '客户业务联系人',
                width: 200,
                render: (data) => {
                    return `${data.customerInfo.contactName || ''} / ${data.customerInfo.contactPhone || ''}`;
                }
            },
            {
                title: '社保顾问',
                key: '社保顾问',
                width: 220,
                render: (data) => {
                    return <div>{data.customerInfo.advisorName ? `${data.customerInfo.advisorName}(${data.customerInfo.advisorEmployeeNumber})` : '/'} {data.customerInfo.advisorJobStatus === 0 && <i style={{color: '#FC5C00'}} className='crmiconfont crmicon-lizhi-copy'></i>} </div>;
                },
                filterDropdown: (
                    <div style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                      {
                          this.state.advisorIdVisible && <Organizations
                          needAll={false}
                          initValue={advisorId}
                          onSelect={(value,option,data) => {
                              if(data[value]){
                                const {name, id, userName} = data[value];
                                Promise.all([
                                    this.setCacheSearchData({'advisorId': id}),
                                    this.setSearchSelectedCriteria({'advisorName': `${name}(${userName})`}),
                                ])
                              }  
                          }}
                          dataSource={queryOrganizationsAndUsers.data && queryOrganizationsAndUsers.data[0]}>
                      </Organizations>
                      }
                      {this.renderSearchButton('advisorIdVisible', '社保顾问', 'advisorId', 'advisorName')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(advisorId !== ''),
                filterDropdownVisible: this.state.advisorIdVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('advisorIdVisible', 'advisorId', visible);
                },
            },
            {
                title: '所属销售',
                key: '所属销售',
                width: 250,
                render: (data) => {
                    return <span>{data.customerInfo.salesName ? `${data.customerInfo.salesName}(${data.customerInfo.salesEmployeeNumber})` : ''} / {data.customerInfo.salesPhone || ''} {data.customerInfo.salesJobStatus === 0 && <i style={{color: '#FC5C00'}} className='crmiconfont crmicon-lizhi-copy'></i>}</span>;
                },
                filterDropdown: (
                    <div style={{padding: 10, background: '#fff'}} className="custom-filter-dropdown">
                      {
                        this.state.salesIdVisible && <Organizations
                            needAll={false}
                            initValue={salesId}
                            onSelect={(value,option,data) => {
                                if(data[value]){
                                    const {name, id, userName} = data[value];
                                    Promise.all([
                                        this.setCacheSearchData({'salesId': id}),
                                        this.setSearchSelectedCriteria({'salesName': `${name}(${userName})`}),
                                    ])
                                }
                            }}
                            dataSource={queryOrganizationsAndUsers.data && queryOrganizationsAndUsers.data[0]}>
                        </Organizations>
                      }
                      {this.renderSearchButton('salesIdVisible', '所属销售', 'salesId', 'salesName')}
                    </div>
                ),
                filterIcon: this.renderFilterIcon(salesId !== ''),
                filterDropdownVisible: this.state.salesIdVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.onFilterDropdownVisibleChange('salesIdVisible', 'salesId', visible);
                },
            }
        ];
        const pagination = {
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            showSizeChanger: true,
            showQuickJumper: true,
            // size: "small",
            pageSizeOptions:['10','20','30','50','100'],
            onChange: this.getSoleList,
            onShowSizeChange: this.getSoleList,
        };
        return <QueueAnim><div className='sole-management-container'>

            {
                this.state.selectedCriteria.size > 0 && <Tags
                    title='已选条件'
                    dataSource={this.state.selectedCriteria.values()}
                    onClose={this.selectedCriteriaOnClose}
                    closable={this.state.selectedCriteriaClosable}
                    color='cyan'
                    reset={this.state.selectedCriteria.size > 4 ? <div onClick={this.state.selectedCriteriaClosable && this.tagsOnReset} className='ant-tag'>重置</div> : false}
                    // onReset={this.tagsOnReset}
                />
            }

            {
                collectionDateOfSocialVisible && <Alert style={{margin: '10px 0'}} message={ <span><Icon style={{color: '#1890ff', marginRight: 10}} type="info-circle" />
                    已选择<span style={{color: '#1890ff', margin: '0 5px'}}>{selectedRowKeysLen}</span>项 
                    <Popconfirm
                        overlayClassName='no-icon-popconfirm'
                        title={<div>社保托收日期（每月）：<Input 
                            value={setCollectionDateOfSocial} 
                            onChange={(e) => this.setState({setCollectionDateOfSocial: e.target.value, inputErr: e.target.value === ''})} 
                            onBlur={(e:any) => this.setState({setCollectionDateOfSocial: e.target.value.trim(), inputErr: e.target.value.trim() === ''})} 
                            style={{width: 80, ...hasErr}}
                        /></div>}
                        onCancel={() => this.setState({setCollectionDateOfSocial: '', PopconfirmVisible: false})}
                        onConfirm={this.updateByIds}
                        visible={this.state.PopconfirmVisible}
                    ><a id='open-setCollectionDateOfSocial' onClick={(e) => {
                        e.preventDefault();
                        this.setState({PopconfirmVisible: true})
                    }} style={{marginLeft:10}}>设置社保托收日期</a></Popconfirm></span>} type="info"
                /> 
            }

            <Table 
                className='ant-table-wrapper-text-center'
                bordered={true}
                columns={columns}
                dataSource={dataSource}
                loading={this.state.loading}
                rowSelection={rowSelection}
                scroll={{x: 2550, y: this.state.scrollY}}
                pagination={{
                    ...pagination, 
                    total: this.state.total,
                    pageSize: this.state.pageSize, 
                    current:this.state.current,
                  }}
            />
            
            <SocialCpfModal 
                visible={SocialCpfModalVisible} 
                type={openType} 
                key={this.state.SocialCpfModalKey}
                singletonSocialInfoId={singletonSocialInfoId} //社保户主键
                singletonId={singletonId} //单立户主键
                onCancel={():void=>{this.setState({SocialCpfModalVisible: false})}} 
                onOk={() => {
                    this.setState({SocialCpfModalVisible: false}, () => {
                        this.onSearch();
                    })}
                }
            />
        </div></QueueAnim>   
    }
}

interface SocialCpfModalProps extends FormComponentProps{
    visible: boolean;
    type: number;
    singletonSocialInfoId: any;
    singletonId: any;
    onCancel: ()=>void;
    onOk: ()=>void;
    collectionDate?: string | null | undefined;
}
class SocialCpfModalForm extends React.Component<SocialCpfModalProps, any>{
    constructor(props:SocialCpfModalProps){
        super(props)
        this.state={
            loading: false,
            openType:props.type, //开户类型 1社保开户 2公积金开户
            singletonSocialInfoId: props.singletonSocialInfoId, //社保户主键
            singletonId: props.singletonId,    //单立户主键
            title: '',
            registrationNumberOfSocial:'', //社保登记证号
            loginPasswordOfSocial:'', //社保一证通登录密码
            loginCommandOfSocial:'',    //社保一证通登录口令
            bookingNumberOfSocial:'',   //社保业务约号密码
            collectionDateOfSocial:'',  //社保托收日期（每月）
            collectionBankOfSocial:'',  //社保托收银行
            corporateAccountOfSocial:'',    //银行对公帐号

            managementDepartmentOfFund:'',  //公积金隶属管理部
            employerCodeOfFund:'',  //公积金单位编号
            loginPasswordOfFund:'', //公积金一证通数字证书登录密码
            collectionDateOfFund:'',    //公积金托收日期（每月）
            collectionBankOfFund:'',    //公积金托收银行
            corporateAccountOfFund: '', //银行对公账号
        }
    }
    submit(){
        this.props.form.validateFields(async(err, values) => {
            this.setState({loading: true});
            // console.log(err)
            if (!err) {
                const {type, singletonSocialInfoId, singletonId} = this.props;
                // console.log({openType, singletonSocialInfoId, singletonId, ...values})
                let res:any = await openAnAccountSuccess({openType: type, singletonSocialInfoId, singletonId, ...values});
                if(res.status === 0){
                    message.success(res.msg || '操作成功');
                    this.props.onOk();
                }else{

                }
                this.setState({loading: false});
            }else{
                this.setState({loading: false});
            }
        });
    }
    renderFormItem(getFieldDecorator, label, name, initialValue, length=100){
        const formItemLayout={
            labelCol: {
                xs: {span:0},
            },
            wrapperCol: {
            xs: { span: 24 },
            },
        }
        return <FormItem
            {...formItemLayout}
            label={label}
        >
            {getFieldDecorator(name, {
                rules: [{ 
                    validator:(rule, value, callback) =>{
                        if(!value || value == ''){
                            callback(`请填写${label}`);
                        }else if(value.length > length){
                            callback(`${label}最多允许输入${length}个字`);
                        }else{
                            callback();
                        }
                    },
                    required: true,
                }],
                validateFirst: true,
                initialValue,
            })(
                <Input />
            )}
        </FormItem>
    }
    renderSocial(getFieldDecorator){
        const {
            registrationNumberOfSocial, //社保登记证号
            loginPasswordOfSocial, //社保一证通登录密码
            loginCommandOfSocial,    //社保一证通登录口令
            bookingNumberOfSocial,   //社保业务约号密码
            collectionDateOfSocial,  //社保托收日期（每月）
            collectionBankOfSocial,  //社保托收银行
            corporateAccountOfSocial,    //银行对公帐号
        } = this.state;
        return <TableUI 
            dataSource={[
                {
                    label: '社保登记证号',
                    value: this.renderFormItem(getFieldDecorator, '社保登记证号', 'registrationNumberOfSocial', registrationNumberOfSocial),
                    required: true,
                    isAll: true,
                },
                {
                    label: '社保一证通登录密码',
                    value: this.renderFormItem(getFieldDecorator, '社保一证通登录密码', 'loginPasswordOfSocial', loginPasswordOfSocial),
                    required: true,
                    isAll: true,
                },
                {
                    label: '社保一证通登录口令',
                    value: this.renderFormItem(getFieldDecorator, '社保一证通登录口令', 'loginCommandOfSocial', loginCommandOfSocial),
                    required: true,
                    isAll: true,
                },
                {
                    label: '社保业务约号密码',
                    value: this.renderFormItem(getFieldDecorator, '社保业务约号密码', 'bookingNumberOfSocial', bookingNumberOfSocial),
                    required: true,
                    isAll: true,
                },
                {
                    label: '社保托收日期（每月）',
                    value: this.renderFormItem(getFieldDecorator, '社保托收日期（每月）', 'collectionDateOfSocial', collectionDateOfSocial, 20),
                    required: true,
                    isAll: true,
                },
                {
                    label: '社保托收银行',
                    value: this.renderFormItem(getFieldDecorator, '社保托收银行', 'collectionBankOfSocial', collectionBankOfSocial),
                    required: true,
                    isAll: true,
                },
                {
                    label: '银行对公帐号',
                    value: this.renderFormItem(getFieldDecorator, '银行对公帐号', 'corporateAccountOfSocial', corporateAccountOfSocial),
                    required: true,
                    isAll: true,
                },
            ]}
            colgroup={[40, 60]}
        />
    }
    renderCpf(getFieldDecorator){
        const {
            managementDepartmentOfFund,  //公积金隶属管理部
            employerCodeOfFund,  //公积金单位编号
            loginPasswordOfFund, //公积金一证通数字证书登录密码
            collectionDateOfFund,    //公积金托收日期（每月）
            collectionBankOfFund,    //公积金托收银行
            corporateAccountOfFund, //银行对公账号
        } = this.state;
        return <TableUI 
        dataSource={[
            {
                label: '公积金隶属管理部',
                value: this.renderFormItem(getFieldDecorator, '公积金隶属管理部', 'managementDepartmentOfFund', managementDepartmentOfFund),
                required: true,
                isAll: true,
            },
            {
                label: '公积金单位编号',
                value: this.renderFormItem(getFieldDecorator, '公积金单位编号', 'employerCodeOfFund', employerCodeOfFund),
                required: true,
                isAll: true,
            },
            {
                label: '公积金一证通数字证书登录密码',
                value: this.renderFormItem(getFieldDecorator, '公积金一证通数字证书登录密码', 'loginPasswordOfFund', loginPasswordOfFund),
                required: true,
                isAll: true,
            },
            {
                label: '公积金托收日期（每月）',
                value: this.renderFormItem(getFieldDecorator, '公积金托收日期（每月）', 'collectionDateOfFund', collectionDateOfFund, 20),
                required: true,
                isAll: true,
            },
            {
                label: '公积金托收银行',
                value: this.renderFormItem(getFieldDecorator, '公积金托收银行', 'collectionBankOfFund', collectionBankOfFund),
                required: true,
                isAll: true,
            },
            {
                label: '银行对公帐号',
                value: this.renderFormItem(getFieldDecorator, '银行对公帐号', 'corporateAccountOfFund', corporateAccountOfFund),
                required: true,
                isAll: true,
            },
        ]}
        colgroup={[40, 60]}
    />
    }
    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.type !== this.props.type){
            if(Number(nextProps.type) === 1){
                this.setState({title: '社保开户完成', collectionDateOfSocial: nextProps.collectionDate || ''});
            }else{
                this.setState({title: '公积金开户完成', collectionDateOfFund: nextProps.collectionDate || ''})
            }
        }
        return true;
    }
    componentWillMount(){
        const { type, collectionDate } = this.props;
        if(Number(type) === 1){
            this.setState({title: '社保开户完成', collectionDateOfSocial: collectionDate || ''});
        }else{

            this.setState({title: '公积金开户完成', collectionDateOfFund: collectionDate || ''})
        }
    }
    render(){
        const {
            title,
        } = this.state;
        const {
            type,
        } = this.props;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const content = Number(type) === 1 ? this.renderSocial(getFieldDecorator) : Number(type) === 2 ? this.renderCpf(getFieldDecorator) : null;
        return !!!this.props.visible ? null : 
        
        <Modal
            visible={this.props.visible}
            title={title}
            confirmLoading={this.state.loading}
            destroyOnClose={true}
            onCancel={() =>{this.props.onCancel()}}
            onOk={() => {this.submit()}}
        >
        <Form
            onSubmit={this.submit}
        >
                {content}
        </Form>
        </Modal>
    }
}
const SocialCpfModal = Form.create()(SocialCpfModalForm);

const mapStateToProps = (state,ownProps) => ({
    userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
})

export default connect(mapStateToProps)(SoleManagement);