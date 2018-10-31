/**
 * Created by yangws on 2018/4/02.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';

import { Map, List, fromJS } from 'immutable';
import { fetchFn } from '../../util/fetch';
import { ROUTER_PATH, WSS, DOMAIN_OXT,STATIC_DOMAIN } from '../../global/global';

import {
    Form,
    Select,
    Input,
    Alert,
    Spin,
    Divider,
    message,
    Button,
    Modal,
    Upload,
    Row,
    Col,
    DatePicker,
    notification,
    Card,
    Menu,
    Dropdown,
    Icon,
    Table,
    Tooltip
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;



interface TStateProps {

}
interface TOwnProps  {
    dataSource: any;
    userInfo: any;
    location: any;
}



type AdjustableBaseImportProps = TOwnProps & TStateProps ;

class AdjustableBaseImport extends Component<AdjustableBaseImportProps,any> {
    constructor(props: AdjustableBaseImportProps) {
        super(props);
        this.state = {
            data:{},
            
            uploadTask: false,
            submitLoading: false,
            allowSubmit: false
        }
    }
    componentWillMount() {
        
    }
    componentWillUnmount() {
        // this.handleLeave();
    }
    
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    
    /**
     * 点击提交
     */
    handleSubmit = async () => {
        const {
            data,
            allowSubmit
        } = this.state;
        this.setState({ submitLoading: true })
        const excelDataKey = data.excelDataKey;
        const list = data.list;
        if(!list || list.length===0 ) {
            message.error('请选导入的账单')
            this.setState({submitLoading: false})
            return false
        }
        if(!allowSubmit) {
            message.error('导入的账单内容格式有误')
            this.setState({submitLoading: false})
            return false;
        }
        
        const d:any = await fetchFn(`${DOMAIN_OXT}/apiv2_/social/sp-adjust-base/submit-confirm`, { excelDataKey });
        if (d.status === 0) {
            if(d.data && d.data){
                
                message.success('导入成功')
            }
            
        }
        this.setState({submitLoading: false,data:{}})
        // 验证form
        // /social/sp-adjust-base/submit-confirm 
        
    }
 
    dropdownMenu = (taskloading) => {
        const {
            data
        } = this.state;
        // 存在记录且不在上传中的时候可以点击清空
        const disabled = (data && data.list && data.list.length>0 && !taskloading)?false:true
        return (
            <Menu>
                
                <Menu.Item key="0" disabled={disabled}>
                    <span onClick={e => { if (taskloading || disabled) { return; }; this.dropdownClearData() }}>清除数据</span>
                </Menu.Item>
               
                <Menu.Item key="2">
                    <a href={`${STATIC_DOMAIN}/dist/assets/template/调基月份补充.xlsx`}  >下载导入模板</a>
                </Menu.Item>
            </Menu>
        )
    }
    dropdownClearData = () => {
        Modal.confirm({
            title: '提示',
            content: (
                <div>
                    是否确认清除该数据？
                </div>
            ),
            onOk: () => {
                
            this.setState({data:{}})
            },
            okText: '确定',
            cancelText: '取消',
        });
    }
    columns:any =()=> [
        {
            title: '序号',
            key: 'id',
            render: (text, record, index) => index + 1,
        },{
            title: '失败原因',
            dataIndex: 'errMsg',
            key: 'errMsg',
            render:(data)=>{
                return <span style={{color:'red'}}>{data}</span>
                // const style = {
                //     whiteSpace: 'nowrap',
                //     width: '180px',
                //     color: 'red',
                //     overflow: 'hidden' as 'hidden',
                //     display: 'block',
                //     textOverflow: 'ellipsis',
                //     cursor: 'pointer',
                // }
                // return (
                //     <Tooltip placement="bottomLeft" title={data}>
                //         <div style={style}>{data}</div>
                //     </Tooltip>
    
                // );
            }
            
        },{
            title: '姓名',
            dataIndex: 'userSocialName',
            key: 'userSocialName',
        },{
            title: '身份证号码',
            dataIndex: 'cert',
            key: 'cert',
        },{
            title: '客户名称',
            dataIndex: 'cname',
            key: 'cname',
        },{
            title: '社保缴纳月',
            dataIndex: 'socialMonth',
            key: 'socialMonth',
        },{
            title: '公积金缴纳月',
            dataIndex: 'fundMonth',
            key: 'fundMonth',
        }


    ]
    tableProps = () => {
        const data = this.state.data
        const dataSource = data && data.list || [];
        
        let columns = this.columns();
        
        // 没有错误信息下移除列
        if(!data || (data && !data.isError)){
            columns.splice(1, 1);
        }
        let props: any = {
            rowKey:　record => record.id,
            columns,
            pagination: {
                defaultPageSize: 100,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                pageSizeOptions: [100, 200, 300, 400],
            },
            bordered:true,
            
            ...this.props,
            dataSource,
        }
        return props;
    }
    render() {
       
        const {
            uploadTask,
            submitLoading,
            data
        } = this.state;
        
        const formItemLayout ={

        }
        const api = `${DOMAIN_OXT}/api/sp/transfer-tianwu`;//进度
        
        
        const uploadProps = {
            name: 'file',
            action: api,
            data:{createUser:this.props.userInfo.userName},
            headers: {
                authorization: 'authorization-text',
                
            },
            className: "del-list",
            beforeUpload: (file) => {
                file.status = 'uploading';
                this.setState({ uploadTask: true });
                if(data && data.length>0){
                    notification.error({
                        type: 'error',
                        message: '提醒',
                        description: '请先清空已导入的数据',

                    });
                    this.setState({ uploadTask: false })
                    return false
                }
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
                        
                       
                        const excelDataKey = data.data.excelDataKey || '';
                        if(!excelDataKey || data.data.isError){
                            this.setState({allowSubmit:false})
                        }else{
                            this.setState({allowSubmit:true})
                        }
                        this.setState({ data:data.data});
                    }else{
                        notification.error({
                            type: 'error',
                            message: '提醒',
                            description: data.msg,
    
                        });
                    }
                    console.log(file, fileList);
                    this.setState({ uploadTask: false});
                }
            }
            
        };
        function disabledDate(current) {
            // Can not select days before today and today
            return current && current < moment().subtract(1, 'days').endOf('day');;
          }
        
        return (<div key="AdjustableBaseImport">
            <Upload  {...uploadProps } disabled={uploadTask}>
                <Button type="primary" icon="cloud-upload" loading={uploadTask}>
                    {uploadTask ? '导入中...' : '导入'}
                </Button>
            </Upload>
            <Dropdown overlay={this.dropdownMenu(uploadTask)} trigger={['click']} >
                <a className="ant-dropdown-link dropdown-menu" href="#" style={{ marginLeft: 8}}>
                    更多操作 <Icon type="down" />
                </a>
            </Dropdown>
            
            
            
            
            
            {
                (data && data.list && data.list.length>0) ? <div className="bill-footer">
                    <Table className="adjustable-base-import-table" {...this.tableProps() } style={{marginTop:20,marginBottom:20}}/>
                    <Button type="primary" disabled={submitLoading} loading={submitLoading} onClick={this.handleSubmit}>确定导入</Button>
                    {/* <Button disabled={submitLoading} onClick={()=>{history.back();}} style={{marginLeft:10}}>取消</Button> */}
                
                </div>:<Card style={{marginTop:20,lineHeight:'250px',textAlign:'center',background:'#f2f4f5'}}>暂无导入内容</Card>
            }
            

            
        </div>)
    }
}

const mapStateToProps = (state: any, ownProps: TOwnProps): TStateProps => {
    const data = state.get('AdjustableBaseImportReducer');
    return {
        
        
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

// /newadmin/businessmanagement/adjustableimport
export default connect(mapStateToProps)(AdjustableBaseImport);