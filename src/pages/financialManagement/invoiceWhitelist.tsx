/**
 * Created by yangws on 2018/7/18.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import * as actions from '../../action/financialManagement/invoiceWhitelistAction';
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
    invoiceWhitelistSaga: actions.invoiceWhitelistSaga,
    invoiceWhitelistEditSaga: actions.invoiceWhitelistEditSaga,
    invoiceWhitelistDeleteSaga: actions.invoiceWhitelistDeleteSaga,
    
}
import UploadFile from '../../businessComponents/common/uploadFile';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import '../../css/socialManagement/blacklistManagement';
import InvoiceWhiteFrom from '../../components/financialManagement/invoiceWhiteFrom';
import Tags from '../../components/showcaseTags';
import FilterTableHeader from '../../components/crm/common/FilterTableHeader';
import SelectClient from '../../components/common/selectClient'
interface TOwnProps  {
    role: 1|2; //角色 1财务 2薪酬管理
}
interface TStateProps {
    dataSource: any[];
    total: number;
    userInfo:  any;
    fetching: boolean;
}


type TDispatchProps = typeof actionCreators;

interface invoiceWhitelistProps extends TOwnProps, TDispatchProps, TStateProps, FormComponentProps {
    
}
interface columns {
    (data?): [any];
}



class InvoiceWhitelist extends React.Component<invoiceWhitelistProps, any> {
    sessionStorageSearchParams: any;
    searchInput: any;
    BlacklistEditFrom:any;
    constructor(props: invoiceWhitelistProps) {
        super(props);
        this.sessionStorageSearchParams = null//JSON.parse(sessionStorage.getItem('INVOICES_LIST_SESSIONSTORAGE')!);
        this.state = {
            searchParams: {
                name: '',
                ...PAGINATION_PARAMS,
                ...this.sessionStorageSearchParams,

            },
            id:'',
            fromTitle:"白名单",
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
        this.setState({isPermission: codes.has('TIANWU_financial_invoicewhitelist')});

        this.props.invoiceWhitelistSaga({
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
            this.props.invoiceWhitelistSaga({
                ...this.setSearchParamState({currentPage:1}),
            });
        });
    }
    
    handleDelete = (id) => {
        // this.
        this.setState({confirmLoading:true})
        this.props.invoiceWhitelistDeleteSaga({
            id,
            userId:this.props.userInfo.userId,
            callback:()=>{
                this.props.invoiceWhitelistSaga({...this.setSearchParamState({})})
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
        let values = this.props.form.getFieldsValue();
        values = {...searchParams,...values}
        const {
            currentPage,
            pageSize,
        } = searchParams;
        const setCurrentPage = (currentPage) => {

            this.setSearchParamState({ 'currentPage': currentPage })
        }
        return statePaginationConfig({ ...values, currentPage, total, pageSize }, this.props.invoiceWhitelistSaga,null, setCurrentPage)
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
            this.props.invoiceWhitelistEditSaga({
                ...values,
                userId:this.props.userInfo.userId,
                callback:()=>{
                    this.props.invoiceWhitelistSaga({...this.setSearchParamState({currentPage:1})})
                    this.setState({confirmLoading:false,visible:false,id: '',blacklist: {}})
                    this.BlacklistEditFrom.resetFields();
                },
                closeLoading:()=> {
                    this.setState({confirmLoading:false})
                }
            })
        })
    }
    uploadFileFail = (responeData) => {
        const data = responeData.data || {};
        Modal.info({
            title: '本次导入结果',
            content: (
              <div style={{color:'#999'}}>
                <p>成功导入数据<span style={{color:'#52c41a',fontWeight:'bold',padding:'0 5px'}}>{data.successCount}</span>条</p>
                <p>导入失败数据<span style={{color:'#f5222d',fontWeight:'bold',padding:'0 5px'}}>{data.failCount}</span>条(可<a href={data.url} target="_blank">点击此处</a>查看失败原因)</p>
              </div>
            ),
            onOk() {},
          });
    }
    // onSearch = (name, value, title) => {
    handleClientChange = (value) => {
       let {selectedCriteria} = this.state;
        const {
            searchParams
        } = this.state;
        if(value === '' || value === undefined){
            selectedCriteria.delete('cName');
        }else{
            selectedCriteria.set('cName', {name, value:`客户名称：${value.text}` ,initialValue: value.text});
        }
        this.setSearchParamState({ 'cName': value.text,'cdddId': value.value })
        this.setState({selectedCriteria}, () => {
            this.props.invoiceWhitelistSaga({
                ...this.setSearchParamState({}),
            });
        });
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
        const uploadApi =  `${DOMAIN_OXT}/api/invoice-white-fileinput`;
        const uploadProps = {
            name: 'file',
            action: uploadApi,
            data:{createUser:this.props.userInfo.userId},
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
            onChange:(info) =>{
                if (info.file.status !== 'uploading') {

                    const parmas = {
                        ossKey: info.file.response.data.ossKey,
                        uuid: info.file.response.data.uuid,
                    }
                    return new Promise((resolve, reject) => {
                        fetchFn(`${DOMAIN_OXT}/apiv2_/order/invoice/white/import-process`, parmas, undefined).then(data => data).then((data: any) => {
                            if (data.status == 0 && data.errcode == 0 && data.data) {
                                
                                this.props.invoiceWhitelistSaga({
                                    ...this.setSearchParamState({}),
                                    
                                });

                            } else {
                                notification.error({
                                    type: 'error',
                                    message: '提醒',
                                    description: data.msg || data.errmsg,
            
                                });
                            }
                            this.setState({ uploadTask: false});

                        });
                    })


                }
            }
            // onChange:({file,fileList}) =>{
            //     if (file.status !== 'uploading') {
            //         const data = file.response;
            //         if(data && data.status === 0){
                        
            //             this.props.invoiceWhitelistSaga({
            //                 ...this.setSearchParamState({}),
                            
            //             });
                        
            //         }else{
            //             notification.error({
            //                 type: 'error',
            //                 message: '提醒',
            //                 description: data.msg || data.errmsg,
    
            //             });
                        
            //         }
            //         console.log(file, fileList);
            //         this.setState({ uploadTask: false});
            //     }
            // }
            
        };

        const columns = [
            {
                title: <FilterTableHeader
                    title='客户名称'
                    name='cName'
                    form={this.props.form}
                    initialValue=''
                    onOk={this.onSearch}
                >
                    {/* <SelectClient placeholder="请输入客户名称" callback={this.handleClientChange} ></SelectClient> */}
                    <Input
                    placeholder="请输入客户名称"
                    />
                </FilterTableHeader>,
                dataIndex: 'cName',
                width: 180,
                render: (data) => {
                    return data || '/'
                },
            },
            {
                title: '备注',
                dataIndex: 'remark',
                width: 200,
                render: (data) => {
                    const style = {
                        whiteSpace: 'nowrap',
                        width: '180px',
                        overflow: 'hidden' as 'hidden',
                        display: 'block',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                    }
                    if(data && data.length > 18){
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data }</span>
                            </Tooltip>
                        )
                    }else{
                        return data || '/'
                    }
                    
                },
            },
            {
                title: '业务审批人',
                dataIndex: 'businessApprover',
                width:100,
                key: 'businessApprover',
                render: (data) => {
                    return data || '/'
                }
            },
            {
                title: '财务审批人',
                dataIndex: 'financeApprover',
                width:100,
                key: 'financeApprover',
                render: (data) => {
                    return data || '/'
                }
            },
            {
                title: <FilterTableHeader
                    title='前道客服'
                    name='adviserName'
                    form={this.props.form}
                    initialValue=''
                    onOk={this.onSearch}
                >
                    <Input
                    placeholder="前道客服查询"
                    />
                </FilterTableHeader>,
                dataIndex: 'adviserName',
                width:150,
                key: 'adviserName',
                render: (data) => {
                    return data || '/'
                }
            },
            {
                title: <FilterTableHeader
                    title='分公司'
                    name='organizationName'
                    form={this.props.form}
                    initialValue=''
                    onOk={this.onSearch}
                >
                    <Input
                    placeholder="分公司查询"
                    />
                </FilterTableHeader>,
                dataIndex: 'organizationName',
                width:180,
                key: 'organizationName',
                render: (data) => {
                    return this.renderTooltip(data,15)
                }
            },
            
            {
                title: '操作',
                dataIndex: null,
                width:150,
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
                        {/* <Upload  {...uploadProps } disabled={uploadTask} style={{marginRight:15,marginLeft:15}}>
                            <Button type="primary" icon="cloud-upload" loading={uploadTask}>
                                {uploadTask ? '导入中...' : '导入'}
                            </Button>
                        </Upload> */}
                        <UploadFile
                            uploadUrl={`${DOMAIN_OXT}/api/invoice-white-fileinput`}
                            pollData={{
                                topic: 3,
                                createUser: this.props.userInfo.userId,
                                userName: this.props.userInfo.userName,
                            }}
                            accept={['.xls', '.xlsx']}
                            uploadData={{
                                createUser: this.props.userInfo.userId,
                                userName: this.props.userInfo.userName,
                            }}
                            success={() => {
                                this.props.invoiceWhitelistSaga({
                                    ...this.setSearchParamState({}),
                                    
                                });   
                            }}
                            fail={this.uploadFileFail}
                            pollUrl={`${DOMAIN_OXT}/apiv2_/order/invoice/white/import-process`}>
                            <Button type="primary" icon="cloud-upload" style={{marginRight:15,marginLeft:15}}>导入</Button>
                        </UploadFile>
                        <a href={`//betadev.joyomm.com/dist/assets/template/发票白名单模板.xlsx`}  >下载导入模板</a>
                        <a style={{float:'right'}} onClick={()=>{browserHistory.push(`${DOMAIN_OXT}/newadmin/financial/invoice/whitelist/importrecords`)}}  >导入历史记录</a>
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
                                    this.props.invoiceWhitelistSaga({
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
                        maskClosable={false}
                    >
                        <InvoiceWhiteFrom key={id} id={id}  dataSource={blacklist} ref={node => this.BlacklistEditFrom = node} />
                    </Modal>
                        

                    

                </div>

            </QueueAnim>
        )
    }

}
const mapStateToProps = (state:any, ownProps: TOwnProps): TStateProps => {

    const data = state.get('invoiceWhitelistReducer');
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


// /newadmin/financial/invoice/whitelist
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(InvoiceWhitelist));
