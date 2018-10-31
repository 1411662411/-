import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Table,
    Form,
    Input,
    Select,
    Button,
    Icon,
    Modal,
    message,
    Tooltip,
    DatePicker,
    Popconfirm,
    Tabs,
    
} from 'antd';
import {
    Link,
} from 'react-router';
import SelectCity from '../../components/select-city/index';
// import address from '../../components/select-city/address2.json';
import * as actions from '../../action/businessComponents/policyPackage/singleAccountAction';
import {
    PAGINATION_PARAMS,
    DOMAIN_OXT,
    ROUTER_PATH,
} from '../../global/global';
import { Map, List, fromJS } from 'immutable';


import './singleAccountList.less';
import {
    statePaginationConfig,
} from '../../util/pagination';
import moment from 'moment';


const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

const actionCreators = {
    singleaccountListSaga: actions.singleaccountListSaga,
    singleaccountUpordownpolicySaga: actions.singleaccountUpordownpolicySaga,
    singleaccountUpdateVettedSaga: actions.singleaccountUpdateVettedSaga
}
interface columns {
    (data?): [any];
}
interface TStateProps {
    data: List<Map<any, any>>;
    fetching: boolean;
    total: number;
}
interface TOwnProps {
    /** 
     * 权限控制 1: '我的政策包' 2: '被驳回政策包' 3: '政策包管理' 4: '政策包审核' 5: '未审核政策包'
     */
    type: 1 | 2 | 3 | 4;
}
type TDispatchProps = typeof actionCreators;
type singleAccountListProps = TStateProps & TDispatchProps & TOwnProps;

interface singleAccountListState {
    type: number;
    cityId?: number;
    areaId?: number;
    provinceId?: number;
    effectiveTime?: string;
    pageSize: number;
    currentPage: number;
    
}
// 审核状态
const vettedMap = {
    0: '待审核',
    1: '已通过',
    2: '已驳回',
    3: '未提交',
}

const typeListMap = {
    1: '我的政策包',
    2: '被驳回政策包',
    3: '政策包管理',
    4: '政策包审核',
    5: '未审核政策包'
}

class SingleAccountList extends React.Component<singleAccountListProps, singleAccountListState> {
    sessionStorageType:any;
    constructor(props) {
        super(props);
        this.sessionStorageType = sessionStorage.getItem('SINGLEACCOUNTLISTSESSIONSTORAGETYPE');
        this.state = {
            type : props.type,
            ...PAGINATION_PARAMS,
        }
    }
    componentWillMount() {
        this.search(this.state.type);
    }
    componentWillUnmount() {
        
        sessionStorage.setItem('SINGLEACCOUNTLISTSESSIONSTORAGETYPE',this.sessionStorageType)
    }
    columns: columns = (params) => {
        return [
            {
                title: '序号',
                dataIndex: null,
                key: 'index',
                render: (text, record, index) => {
                    return index + 1;
                }
            }, {
                title: '省',
                dataIndex: 'provinceName',
                key: 'provinceName',
            }, {
                title: '市',
                dataIndex: 'cityName',
                key: 'cityName',
                
            }, {
                title: '政策包名',
                dataIndex: 'areaName',
                key: 'areaName',
                
            },  (params.type===3 ||params.type===4)?{
                title: '提交人',
                dataIndex: 'createUser',
                key: 'createUser',
                
            }:{}, (params.type===4 ||params.type===5)?{
                title: '审核状态',
                dataIndex: 'vetted',
                key: 'vetted',
                render: (text, record, index) => (vettedMap[text])
                
            }:{},(params.type===1 ||params.type===3)?{
                title: '上线状态',
                dataIndex: 'isOnline',
                key: 'isOnline',
                render: (text, record, index) => (text===1?'已上线':'未上线')
                
            }:{}, {
                title: params.type===4?'提交时间':'更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                render: (data, record, index) =>{
                    return  data?moment(data).format('YYYY/MM/DD HH:mm:ss'):'/';
                }
                
            },{
                title: '生效时间',
                dataIndex: 'effectiveTime',
                key: 'effectiveTime',
                render: (data, record, index) =>{
                    return  data?moment(data).format('YYYY/MM/DD'):'/';
                }
                
            }, {
                title: '操作',
                dataIndex: null,
                key: 'operation',
                render: (text, record, index) => {
                    // 编辑 删除
              
                    // 1：政策包审核 2： 被驳回政策包 3：政策包管理 4：我的政策包
                    const {
                        id,
                        vetted, //待审核 vetted :0  暂存 vetted :3
                        isOnline,
                    } = text;
                    const type = params.type;
                   
                    return (
                        
                        <div className="editable-row-operations">
                            {type ===3 && <Popconfirm title={`确定是否${isOnline===0?'上线':'下线'}`} onConfirm={() => this.handleUpdateIsOnline(id,isOnline===1?0:1)}><a>{`${isOnline===0?'上线':'下线'}`}</a></Popconfirm>}
                            {(type ===4 ) && <Link to={`${ROUTER_PATH}/newadmin/singleaccount/audit?id=${id}`}>审核</Link>}
                            
                            {type ===5 && <Popconfirm title={`确定是否${vetted===3?'提交审核':'撤销审核'}`} onConfirm={() => this.handleUpdateVetted(id,vetted===3?2:1)}><a>{`${vetted===3?'提交':'撤销'}`}</a></Popconfirm>}
                            {(type ===1 || type ===2 || (type ===5 &&vetted===3)) && <Link to={`${ROUTER_PATH}/newadmin/singleaccount/edit?id=${id}`}>编辑</Link>}
                            <Link to={`${ROUTER_PATH}/newadmin/singleaccount/info?id=${id}`}>查看</Link>
                            
                        </div>
                    );
                }

            }
        ]
    }
    
         
    
    searchParams = () => {
        const {
            cityId,
            areaId,
            provinceId,
            pageSize,
            effectiveTime,
            currentPage,
            type
        } = this.state;
        return {
            type,
            cityId,
            areaId,
            provinceId,
            effectiveTime,
            pageSize,
            currentPage,
            
        }
    }
    search = (key?) => {
        if(key){
            this.props.singleaccountListSaga({
                ...this.searchParams(),
                type:key
            });
        }else {
            this.props.singleaccountListSaga({
                ...this.searchParams(),
                
            });
        }
        
    }
    handleUpdateIsOnline  = (id,isOnline) => {
        const callback = ()=> {
            this.search();
        }
        this.props.singleaccountUpordownpolicySaga({ policyId:id,type:isOnline,callback});
    }
    handleUpdateVetted = (id,vetted) => {
        const callback = ()=> {
            this.search();
        }
        this.props.singleaccountUpdateVettedSaga({ policyId:id,type:vetted,callback});
    }
    pagination = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            total,
        } = this.props;
        return statePaginationConfig({
            currentPage,
            pageSize,
            total,
        },
            (newParams) => this.props.singleaccountListSaga({ ...this.searchParams(), ...newParams, }),
            null,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            },
        )
    }
    /**
     * selectCityParams
     * @param param {Object} 参数
     */
    selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
        
        return {
            deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder: '请选择政策包',
            addressApi:`${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/getcities`,
            transform:true,
            // address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 200,
            }, /* input 的样式 */
            onChange:(selectVal, selectName, code)=>{
               
                this.setState({
                    provinceId:selectVal[0] || undefined,
                    cityId:selectVal[1] || undefined,
                    areaId:selectVal[2] || undefined,
                    
                })
                

            },
            onSelect:(selectVal, selectName, code)=> { /* 每层选择的回调，除了， 除了最后一层调用onChange */
                
                this.setState({
                    provinceId:selectVal[0] || undefined,
                    cityId:selectVal[1] || undefined,
                    areaId:selectVal[2] || undefined,
                    
                })
                
                
            },

            
        }
    }
    handleTabsChange = (key) => {
        key = Number.parseInt(key)
        this.setState({type:key})
        
        this.search(key);
        this.sessionStorageType = key;
        
    }
    render() {
        const {
            data,
            fetching,
            
        } = this.props;
        const {
            type,
            cityId,
            areaId,
            provinceId,
        } = this.state; 
        // 政策包审核 2： 被驳回政策包 3：政策包管理 4：我的政策包
        const typeMap = ()=> {
            let arr: any[] | null = [];
            for (const key in typeListMap) {
                if (typeListMap.hasOwnProperty(key)) {
                    if(type == 1 || type ===2 || type ===5){
                        if(key == '1' || key =='2' || key =='5'){
                            arr.push({key,value:typeListMap[key]})
                        }
                        
                    }
                    if(type == 3 || type ===4){
                        if(key == '3' || key =='4'){
                            arr.push({key,value:typeListMap[key]})
                        }
                        
                    }
                    
                }
            }
            return arr;
        }
        const listMap = typeMap() || [];
        
        return (
            <div className="singleAccountList">
                <Form layout="inline">
                    <FormItem label="政策包">
                        <SelectCity params={this.selectCityParams(undefined)}> </SelectCity>
                    </FormItem>
                    <FormItem label="生效时间">
                        <DatePicker format="YYYY-MM-DD" onChange={(date, dateString)=>{
                            this.setState({effectiveTime:dateString})
                            
                        }}/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={() => this.search()}>搜索</Button>
                    </FormItem>
                    
                </Form>
                <Tabs onChange={this.handleTabsChange} className="single-account-list-tabs">
                    {
                        listMap.map(item=>{
                            return (<TabPane tab={item.value} key={item.key}>
                                <Table
                                    className="single-account-list"
                                    loading={fetching}
                                    rowKey={(record: any) => record.id}
                                    pagination={this.pagination()}
                                    dataSource={data.toJS()}
                                    columns={this.columns({type})}
                                    
                                    
                                >
                                </Table>
                            </TabPane>)
                            
                        })
                    }
                    
                    
                </Tabs>

                
                
            </div>
        )
    }
}

const mapStateToProps = (state:any, ownProps: TOwnProps): TStateProps => {
    const data = state.get('singleAccountReducer');
    return {
        data: data.get('data'),
        fetching: data.get('fetching'),
        total: data.get('total'),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleAccountList);