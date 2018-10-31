/**
 * Created by yangws on 2018/6/22.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import * as actions from '../../action/socialManagement/blacklistManagementAction';
import { statePaginationConfig } from '../../util/pagination';
import { fetchFn } from '../../util/fetch';
import { ROUTER_PATH, WSS, DOMAIN_OXT, PHP_DOMAIN,PAGINATION_PARAMS,STATIC_DOMAIN} from '../../global/global';
import query from '../../util/query';
import {
    Button,
    Select,
    Input,
    Table,
    Row,
    Col,
    Radio,
    DatePicker,
    Form,
    message,
    Modal,
    Alert,
    Spin,
    InputNumber,
    Badge,
    Collapse,
    Icon,
    Tooltip,
    Divider,
    Upload,
    notification,
    Popconfirm
} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const actionCreators = {
    blacklistSaga: actions.blacklistSaga,
    blacklistEditSaga: actions.blacklistEditSaga,
    
}
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import '../../css/socialManagement/blacklistManagement';
import BlacklistEditFrom from '../../components/socialManagement/blacklistEditFrom';
import Tags from '../../components/showcaseTags';
import FilterTableHeader from '../../components/crm/common/FilterTableHeader';
interface TOwnProps  {
    role: 1|2; //角色 1社保顾问 2薪酬管理
}
interface TStateProps {
    dataSource: any[];
    total: number;
    userInfo:  any;
    fetching: boolean;
}


type TDispatchProps = typeof actionCreators;

interface blacklistManagementProps extends TOwnProps, TDispatchProps, TStateProps, FormComponentProps {
    
}
interface columns {
    (data?): [any];
}



class BlacklistManagement extends React.Component<blacklistManagementProps, any> {
    sessionStorageSearchParams: any;
    searchInput: any;
    BlacklistEditFrom:any;
    constructor(props: blacklistManagementProps) {
        super(props);
        this.sessionStorageSearchParams = null//JSON.parse(sessionStorage.getItem('INVOICES_LIST_SESSIONSTORAGE')!);
        this.state = {
            searchParams: {
                name: '',
                ...PAGINATION_PARAMS,
                ...this.sessionStorageSearchParams,

            },
            id:'',
            fromTitle:"黑名单",
            visible:false,
            blacklist:{},
            uploadTask: false,
            confirmLoading:false,
            selectedCriteria: new Map(),
            isPermission: false,
      
        }
    }
    componentWillMount() {
        const codes = new Set(JSON.parse(sessionStorage.getItem('codes') as any));
        this.setState({isPermission: codes.has('TIANWU_social_blacklistManagement_menu')});

        this.props.blacklistSaga({
            ...this.setSearchParamState({}),
        });
    }

    onSearch = (name, value, title) => {

        let {selectedCriteria} = this.state;
        const {
            searchParams
        } = this.state;
        if(value === '' || value === undefined){
            selectedCriteria.delete(name);
        }else{
            selectedCriteria.set(name, {name, value:`${title}：${value}` ,initialValue: value});
        }
        this.setState({selectedCriteria}, () => {
            this.props.blacklistSaga({
                ...this.setSearchParamState({}),
            });
        });
    }

    handleDelete = (id) => {
        // this.
        this.setState({confirmLoading:true})
        this.props.blacklistEditSaga({
            id,
            isValid:0,
            userId:this.props.userInfo.userId,
            callback:()=>{
                this.props.blacklistSaga({})
                this.setState({confirmLoading:false,visible:false})
            },
            closeLoading:()=> {
                this.setState({confirmLoading:false})
            }
        })
    }
    

    renderTooltip = (text,len = 10) => {
        
        if(text){
            const style = {
                whiteSpace: 'nowrap',
                width: `${len*15}px`,
                color: 'green',
                overflow: 'hidden' as 'hidden',
                display: 'block',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
            }
            return text.length>len?(
                <Tooltip placement="bottomLeft" title={text}>
                    <div style={style}>{text}</div>
                </Tooltip>
    
            ):text;
        }
        return '/';
    }
    
    // pagination = () => {
    //     const {
    //         currentPage,
    //         pageSize,
    //     } = this.state.searchParams;
    //     const {
    //         total,
    //     } = this.props;
    //     return statePaginationConfig({
    //         currentPage,
    //         pageSize,
    //         total,
    //     },
    //         (newParams) => this.props.blacklistSaga({ ...this.setSearchParamState({}), ...newParams, }),
    //         null,
    //         (currentPage, pageSize) => {
    //             this.setSearchParamState({
    //                 currentPage,
    //                 pageSize
    //             });
    //         },
    //     )
    // }
    pagination = () => {
        const {
            total,
        } = this.props;
        const { searchParams } = this.state;
        const {
            currentPage,
            pageSize,
        } = searchParams;
        const setCurrentPage = (currentPage) => {

            this.setSearchParamState({ 'currentPage': currentPage })
        }
        return statePaginationConfig({ ...searchParams, currentPage, total, pageSize }, this.props.blacklistSaga,null, setCurrentPage)
    }
    // 更新搜索条件state
    setSearchParamState = (param) => {
        let values = this.props.form.getFieldsValue();
        const { searchParams } = this.state;
        const newSearchParams = {
            ...searchParams,
            ...param
        }
        this.setState({searchParams: newSearchParams})
        return {...newSearchParams, ...values};
    }
    
    handleBlacklistFrom = (id?) => {
        if(id){
            const { 
                dataSource
            } = this.props;
            this.setState({
                id,
                fromTitle:'编辑',
                blacklist: dataSource.find(function(value, index, arr) {
                    return value.id === id;
                })
                
            })
            
        }else{
            this.setState({
                fromTitle:'新增',
                blacklist: {}
            })
        }
        this.setState({visible:true})
    }
    handleEditCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
          id: '',
          blacklist: {}
        });
    }
    
    handleBlacklistSubmit = () => {
        
        
        this.BlacklistEditFrom.validateFieldsAndScroll((err, values) => {
            if(err) return false;
            this.setState({confirmLoading:true})
            this.props.blacklistEditSaga({
                ...values,
                userId:this.props.userInfo.userId,
                callback:()=>{
                    this.props.blacklistSaga({})
                    this.setState({confirmLoading:false,visible:false,id: '',blacklist: {}})
                    this.BlacklistEditFrom.resetFields();
                },
                closeLoading:()=> {
                    this.setState({confirmLoading:false})
                }
            })
        })
    }
    render() {
        const { dataSource,
            fetching
        } = this.props;
        const {
            searchParams,
            uploadTask,
            blacklist,
            id,
            fromTitle,
            visible,
            confirmLoading
        } = this.state;
        const uploadApi =  `${DOMAIN_OXT}/api/social/usersocial/blacklist-import`;
        const uploadProps = {
            name: 'file',
            action: uploadApi,
            data:{userId:this.props.userInfo.userId},
            headers: {
                authorization: 'authorization-text',
                
            },
            className: "del-list",
            beforeUpload: (file) => {
                file.status = 'uploading';
                this.setState({ uploadTask: true });
                
                if (file.name.split('.').pop() == 'xls' || file.name.split('.').pop() == 'xlsx') {
                    return true;
                } else {
                    this.setState({ uploadTask: false })
                    notification.error({
                        type: 'error',
                        message: '提醒',
                        description: '导入格式错误,请上传.xls或.xlsx文件',

                    });
                    return false
                }

            },
            onChange:({file,fileList}) =>{
                if (file.status !== 'uploading') {
                    const data = file.response;
                    if(data && data.status === 0){
                        
                        this.props.blacklistSaga({
                            ...this.setSearchParamState({}),
                            
                        });
                        
                    }else{
                        notification.error({
                            type: 'error',
                            message: '提醒',
                            description: data.msg || data.errmsg,
    
                        });
                        
                    }
                    console.log(file, fileList);
                    this.setState({ uploadTask: false});
                }
            }
            
        };

        const columns = [
            {
                title: <FilterTableHeader
                    title='姓名'
                    name='name'
                    form={this.props.form}
                    initialValue=''
                    onOk={this.onSearch}
                >
                    <Input
                    placeholder="姓名查询"
                    />
                </FilterTableHeader>,
                fixed:'left',
                dataIndex: 'name',
                width: 100,
                render: (data) => {
                    return data || '/'
                },
            },
            {
                title: <FilterTableHeader
                    title='身份证号'
                    name='certificateNumber'
                    form={this.props.form}
                    initialValue=''
                    onOk={this.onSearch}
                >
                    <Input
                        placeholder="身份证号查询"
                    />
                </FilterTableHeader>,
                fixed:'left',
                dataIndex: 'certificateNumber',
                width: 160,
                render: (data) => {
                    return data || '/'
                },
            },
            {
                title: '是否已参保',
                dataIndex: 'isSocial',
                width:100,
                key: 'isSocial',
                render: (data) => {
                    return data || '/'
                }
            },
            {
                title: '参保城市',
                dataIndex: 'cityName',
                width:100,
                key: 'cityName',
                render: (data) => {
                    return data || '/'
                }
            },
            {
                title: '参保平台',
                dataIndex: 'socialPlatform',
                width:150,
                key: 'socialPlatform',
                render: (data) => {
                    return data || '/'
                }
            },
            {
                title: '风险说明',
                dataIndex: 'riskDescription',
                width:250,
                key: 'riskDescription',
                render: (data) => {
                    return this.renderTooltip(data,15)
                }
            },
            {
                title: '处理方式',
                dataIndex: 'dealMethod',
                width:400,
                key: 'dealMethod',
                render: (data) => {
                    return this.renderTooltip(data,25)
                }
            },
            {
                title: '信息获取',
                dataIndex: 'informationAchieve',
                width:170,
                key: 'informationAchieve',
                render: (data) => {
                    return this.renderTooltip(data,10)
                }
            },
            {
                title: '数据来源',
                dataIndex: 'dataSource',
                width:170,
                key: 'dataSource',
                render: (data) => {
                    return this.renderTooltip(data,10)
                }
            },
            {
                title: '更新人(姓名/工号/部门)',
                dataIndex: 'updater',
                width:200,
                key: 'updater',
                render: (data) => {
                    return data || '/'
                }
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                width:150,
                key: 'updateTime',
                render: (data) => {
                    return data ? moment(data*1000).format('YYYY-MM-DD HH:mm') : '/'
                }
            },
            {
                title: '操作',
                dataIndex: null,
                width:150,
                fixed:'right',
                key: 'operation',
                render: (data, record, index) => {
                    const id = data.id;
                    
                    return this.state.isPermission ? (<div>
                        <a onClick={() => { this.handleBlacklistFrom(id) }}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定是否删除?"
                            onConfirm={() => this.handleDelete(id)}
                        >
                            <a>删除</a>
                        
                        </Popconfirm>
                        
                        
                    </div>) : null
    
                },
            },
        ]
       
        return (
            <QueueAnim>
                <div key="orderList" className="wrapper-content">
                    {this.state.isPermission ? <Row style={{paddingBottom:15}}>
                        <Button type="primary" onClick={()=>{this.handleBlacklistFrom()}}>新增</Button>
                        <Upload  {...uploadProps } disabled={uploadTask} style={{marginRight:15,marginLeft:15}}>
                            <Button type="primary" icon="cloud-upload" loading={uploadTask}>
                                {uploadTask ? '导入中...' : '导入'}
                            </Button>
                        </Upload>
                        <a href={`${STATIC_DOMAIN}/dist/assets/template/黑名单模板.xlsx`}  >下载导入模板</a>
                    </Row>: ''}
                    {
                        this.state.selectedCriteria.size > 0 && <Tags
                            title='已选条件'
                            dataSource={this.state.selectedCriteria.values()}
                            onClose={(item , number) => {
                                let {selectedCriteria}  = this.state;
                                this.props.form.setFieldsValue({[item.name]: ''});
                                selectedCriteria.delete(item.name);
                                this.setState({selectedCriteria}, () => {
                                    this.props.blacklistSaga({
                                        ...this.setSearchParamState({}),
                                    });
                                })
                            }}
                            closable={true}
                            color='cyan'
                            // onReset={this.tagsOnReset}
                        />
                    }
                    <div className="search-result-list">
                        <QueueAnim type="bottom" delay="300">
                        <Form>
                            <Table columns={columns as any}
                                bordered
                                rowKey={(record: any) => record.id}
                                dataSource={dataSource}
                                loading={fetching}
                                scroll={{ y: window.innerHeight*0.6,x: 2100 }}
                                pagination={this.pagination()}
                            />
                        </Form>
                        </QueueAnim>
                    </div>
                    <Modal
                        title={fromTitle}
                        visible={visible}
                        confirmLoading={confirmLoading}
                        onOk={()=>{this.handleBlacklistSubmit()}}
                        onCancel={this.handleEditCancel}
                    >
                        <BlacklistEditFrom key={id} id={id}  dataSource={blacklist} ref={node => this.BlacklistEditFrom = node} />
                    </Modal>
                        

                    

                </div>

            </QueueAnim>
        )
    }

}
const mapStateToProps = (state:any, ownProps: TOwnProps): TStateProps => {

    const data = state.get('blacklistManagementReducer');
    return {
        dataSource: data.get('dataSource').toJS(),
        total: data.get('total'),
        fetching: data.get('fetching'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}


// /newadmin/social/blacklistManagement
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BlacklistManagement));
