/**
 * Created by yangws on 2017/7/5.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import * as moment from 'moment';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {
    Button,
    Select,
    Input,
    Table,
    Row,
    Col,
    Form,
    message,
    Modal,
    Alert,
    Spin,
    Card,
    Popconfirm,
} from 'antd';
const confirm = Modal.confirm;
import { Link } from 'react-router';
import { statePaginationConfig } from '../../util/pagination';
import { DOMAIN_OXT } from '../../global/global';
import {
    FormComponentProps,
} from 'antd/lib/form/Form';
import {
    mailsetSaga,
    userByOrganizationsSaga,
    fetching,

} from '../../action/financialManagement/mailsetAction';
import { Organizations } from '../../components/common/organizationsUi';

interface MailSetProps {
    dispatch?: any;
    dataSource: any;
    userByOrganizationsData: any;
    fetching: boolean;
}
interface columns {
    data?: [any];
}


class MailSet extends React.Component<MailSetProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            businessType: 0,
            id: null,
            dataSource: [],
            updateData:{
                userName:'',
                userId:'',
                mail:''
            },
            singeData:{
                id:'',
                businessType:'',
                userNameData:{
                editable:true,
                    value:{
                        userName:'',
                        userId:'',
                    },
                },
                mailData:{
                    editable:true,
                    value:'',
                }

            }
        }
    }
    cacheData = null;
    dataSource = [];


    columns: any = (param) => {
        return [{
            title: '姓名',
            width:'25%',
            className:'text-align-center',
            dataIndex: null,
            render: (data, record, index) => this.renderColumns(data, 'userNameData', data.userNameData.value),
        }, {
            title: '邮箱',
            width:'25%',
            className:'text-align-center',
            dataIndex: 'mail',
            render: (data, record, index) => {
                // 
                // return param[index].mail
                return data||'/'
            },
        }, {
            title: '手机',
            width:'25%',
            className:'text-align-center',
            dataIndex: 'phone',
            render: (data, record, index) => {
                // 
                // return param[index].mail
                return data||'/'
            },
        }, {
            title: '操作',
            width:'25%',
            className:'text-align-center',
            dataIndex: null,
            render: (data, record, index) => {
                // const tmpData = param.data[index];
                
                const {id,userNameData,key} = data;
                const { editable } = userNameData;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                    <a onClick={() => this.editDone(id,data, 'save')} style={{ paddingRight: 10 }}>保存</a>
                                    {id?<Popconfirm title="放弃编辑?" onConfirm={() => this.editDone(id,data, 'cancel')}>
                                        <a>取消</a>
                                    </Popconfirm>:<Popconfirm title="放弃新增?" onConfirm={() => this.addRemoveEdit(key)}>
                                        <a>取消</a>
                                    </Popconfirm>}
                                    
                                </span>
                                :
                                <span>
                                    <a onClick={() => this.edit(id)} style={{ paddingRight: 10 }}>编辑</a>
                                    <a onClick={() => this.del(id)}>删除</a>
                                </span>
                        }
                    </div>
                );
            },
        }]
    }
    // 函数在进入状态之前调用
    componentWillMount() {
        // 查看邮件设置
        this.handleSearchData();
        this.props.dispatch(userByOrganizationsSaga({}));
    }
    // 已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource) {
            this.setState({ dataSource: nextProps.dataSource.toJS() });
        }
    }
    handleSearchData () {
        this.props.dispatch(mailsetSaga({ type: 'query' }));
    }
   
    handleUserChange (param,value, option) {
        const {updateData} = this.state;
        const dataSource = this.props.userByOrganizationsData.toJS()[0]['employees'] as any[];
        let useerInfo = {};
        for(let {userName,email, phone, id} of dataSource) {
            if(id === value) {
                useerInfo = {
                    userName,
                    mail: email,
                    phone,
                }
                break;
            }
        }
        // const userName = option.props['data-username'];
        // const mail = option.props['data-mail'];
        // const phone = option.props['data-phone'];
        const data = {
            ...updateData,
            userId:value,
            ...useerInfo,
        }
        this.setState({updateData:data})
        this.handeleSetDataSource(param,data)
        // this.handeleSetMail(id,mail)
    }
    handleMailChange (value) {
        const {updateData} = this.state;
        this.setState({updateData:{
            ...updateData,
            mail:value
        }})
    }
    handleResetUpdateData () {
        this.setState({updateData:{}})
    }
    handeleSetMail (id,value) {
        const {dataSource} = this.state;
        dataSource.map(function (item) {
            if(item.id===id){
                item.mail = value;
                // item.phone = value;
            }
        })
        this.setState({ dataSource });
    }
    handeleSetDataSource (param,data) {
        const {dataSource} = this.state;
        let singeData = {}
        dataSource.map(function (item) {
            if((item.id&&item.id===param.id) || (param.key&&item.key===param.key)){
                item.mail = data.mail;
                item.phone = data.phone;;
            }
        })
        this.setState({ dataSource });
    }
    renderColumns(data, key, text) {
        // this.setState({dataSource:data})
        const {
            userByOrganizationsData,
        } = this.props;
        const id = data.id;
        const param = id?{id}:{key:data.key}
        const newUserByOrganizationsData = userByOrganizationsData.toJS();
        const { editable, status } = data[key];
        if (typeof editable === 'undefined') {
            return text;
        }
        
        // 
        // return (<EditableCell
        //     editable={editable}
        //     newUserByOrganizationsData={newUserByOrganizationsData[0]}
        //     type={key}
        //     value={text}
        //     onSave={value => this.handleSave(key, data, value)}
        //     onChange={value => this.handleChange(key, data, value)}
        //     status={status}
        // />);
        return (
            <div>
                {
                    editable ?
                        <div>
                            {
                                key==='userNameData'?<Organizations
                                initValue={text.userName}
                                needAll={false}
                                onSelect={(e,option) =>this.handleUserChange(param,e,option)}
                                dataSource={newUserByOrganizationsData[0]}>
                            </Organizations>:<Input defaultValue={text.mail} onChange={(e:any) => this.handleMailChange(e.target.value)}/>
                            }
                        </div>
                        :
                        <div className="editable-row-text">
                            {key==='userNameData'?(text.userName.toString() || ' '):(text.mail.toString() || '/')}
                        </div>
                }
            </div>
        )

    }
 


    
    del(id) {
        confirm({
            title: '你还要继续吗？',
            content: '删除后，该员工将无法收到提醒邮件',
            okText:'继续',
            onOk:()=> {
                this.props.dispatch(mailsetSaga({ type: 'del',id,callback:()=>{this.handleSearchData()}}))
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }
    handleEditData(id,isEdit) {
        const { dataSource } = this.state;
        
        dataSource.map(function (item) {
            if(item.id===id){
                Object.keys(item).forEach((key) => {
                    if (item[key] && typeof item[key].editable !== 'undefined') {
                        item[key].editable = isEdit;
                    }
                    
                })
            }
        })
        this.setState({ dataSource });
    }
    edit(id) {
        if(!this.cacheData){
            this.cacheData = this.state.dataSource;
        }
        
        this.handleEditData(id,true);
  
    }
    editDone(id,data, type) {
        const { dataSource,updateData } = this.state;
        // 
        if(type=='cancel'){
            this.handlerResetDataSource(id);
        }
        if(type =='save'){
            const {dispatch} = this.props;
            const {id,businessType}= data;
            const {mail,userId} = updateData;
            if(!userId && id){
                this.handleEditData(id,false);
                return false;
            }
            if(!userId && !id){
                message.error('请选择提醒人员');
                return false;
            }
            // 
            if(!this.handlerRepeatCheck(businessType)){
                message.error('该人员已存在，请勿重复添加');
                return false;
            }
            // 该人员已存在，请勿重复添加
   
            const param = {...updateData,callback:()=>{
                this.handleSearchData();
                
            }}
            id?dispatch(mailsetSaga({ type: 'edit', ...param,id})):dispatch(mailsetSaga({ type: 'save', ...param,businessType}))
        }
        this.handleResetUpdateData();

        

     
        this.setState({ dataSource }, () => {
            dataSource.map(function (item) {
                if(item.id===id){
                    Object.keys(item).forEach((key) => {
                        if (item[key] && typeof item[key].editable !== 'undefined') {
                            delete item[key].status;
                        }
                    });
                }
            })
            
        });
        // 删除后，该员工将无法收到提醒邮件，你还要继续吗？
    }
    // 检测人员重复添加
    handlerRepeatCheck(type){
        let flag = true;
        const { dataSource,updateData } = this.state;
        const {userId} =updateData;
        dataSource.map(function (item) {
            if(item.businessType===type && item.userId===userId){
                flag= false;
            }
        })
        return flag
    }
    handlerResetDataSource (id){
        const { dataSource } = this.state;
        dataSource.map(function (item) {
            if(item.id===id){
                item.mail = item.mailData.value;
                item.phone = item.phoneData.value;
            }
        })
        this.setState({ dataSource });
        this.handleEditData(id,false);
    }
    addRemoveEdit = (key) => {
        const {dataSource} = this.state;
        dataSource.map((item,i) => {
            if(item.key ===key) {
                const data = [...dataSource];
                data.splice(i,1);
                this.setState({ dataSource:data });
            }
        })
            
    }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    handleAdd = (type) => {
        const { dataSource } = this.state;
        this.cacheData = this.state.dataSource;
        const newData = {
            key:Date.now(),
            businessType:type,
            userNameData:{
                editable:true,
                value:{
                    userName:'',
                    userId:'',
                },
            },
            mailData:{
                editable:false,
                value:{
                    mail:'/',
                },
            }
        };
        
        this.setState({
            dataSource: [...dataSource, newData],
        });
    }
    render() {
        const {
            fetching,
            userByOrganizationsData,
        } = this.props;
        const newUserByOrganizationsData = userByOrganizationsData.toJS();
        const {
            dataSource
        } = this.state;
        // const tableDate1 = [];
        // const tableDate1 = [];
        // 1:天吴请款审批邮件提醒人员;2:天吴社保款付款邮件提醒人员;3: SP 请款审批邮件提醒人员;4:SP 社保款付款邮件提醒人员;5:确认到款邮件提醒人员
        const [tableDate1, tableDate2, tableDate3, tableDate4, tableDate5, tableDate6]: Array<any> = [[], [], [], [], [], []];
        dataSource.map((item) => {
            switch (item.businessType) {
                case 1: {
                    tableDate1.push(item);
                    break;
                }
                case 2: {
                    tableDate2.push(item);
                    break;
                }
                case 3: {
                    tableDate3.push(item);
                    break;
                }
                case 4: {
                    tableDate4.push(item);
                    break;
                }
                case 5: {
                    tableDate5.push(item);
                    break;
                }
                case 6: {
                    tableDate6.push(item);
                    break;
                }
            }
        })
        const columns = this.columns(dataSource);
        return (
            <QueueAnim>
                <Spin tip="Loading..." spinning={fetching}>
                <Card title="天吴请款审批邮件提醒人员" style={{ width: '50%', marginBottom: 10 }}>
                    <div>
                        <Table columns={columns}
                            style={{ paddingBottom: 10 }}
                            bordered
                            dataSource={tableDate1}
                            loading={false}
                            pagination={false}
                        />
                        <Button onClick={()=>{this.handleAdd(1)}}>添加</Button>
                    </div>
                </Card>
                <Card title="天吴社保款付款邮件提醒人员" style={{ width: '50%', marginBottom: 10 }}>
                    <div>
                        <Table columns={columns}
                            style={{ paddingBottom: 10 }}
                            bordered
                            dataSource={tableDate2}
                            loading={false}
                            pagination={false}
                        />
                        <Button onClick={()=>{this.handleAdd(2)}}>添加</Button>
                    </div>
                </Card>

                <Card title="SP 请款审批邮件提醒人员" style={{ width: '50%', marginBottom: 10 }}>
                    <div>
                        <Table columns={columns}
                            style={{ paddingBottom: 10 }}
                            bordered
                            dataSource={tableDate3}
                            loading={false}
                            pagination={false}
                        />
                        <Button onClick={()=>{this.handleAdd(3)}}>添加</Button>
                    </div>
                    
                </Card>
                <Card title="SP 社保款付款邮件提醒人员" style={{ width: '50%', marginBottom: 10 }}>
                    <div>   
                        <Table columns={columns}
                        style={{ paddingBottom: 10 }}
                        bordered
                        dataSource={tableDate4}
                        loading={false}
                        pagination={false}
                    />
                    <Button onClick={()=>{this.handleAdd(4)}}>添加</Button>
                    </div>
                    
                </Card>
                <Card title="确认到款邮件提醒人员" style={{ width: '50%', marginBottom: 10 }}>
                    <div>
                        <Table columns={columns}
                        style={{ paddingBottom: 10 }}
                        bordered
                        dataSource={tableDate5}
                        loading={false}
                        pagination={false}
                    />
                    <Button onClick={()=>{this.handleAdd(5)}}>添加</Button>
                    </div>
                    
                </Card>
                <Card title="分公司核销邮件提醒人员" style={{ width: '50%', marginBottom: 10 }}>
                    <div>
                        <Table columns={columns}
                        style={{ paddingBottom: 10 }}
                        bordered
                        dataSource={tableDate6}
                        loading={false}
                        pagination={false}
                    />
                    <Button onClick={()=>{this.handleAdd(6)}}>添加</Button>
                    </div>
                    
                </Card>
                </Spin>
            </QueueAnim>
        )
    }

}




function mapStateToProps(state:Any.Store) {
    const data = state.get('mailsetReducer');
    return {
        dataSource: data.get('dataSource'),
        userByOrganizationsData: data.get('userByOrganizationsData'),
        fetching: data.get('fetching'),
    }
}
export default connect(mapStateToProps)(MailSet)