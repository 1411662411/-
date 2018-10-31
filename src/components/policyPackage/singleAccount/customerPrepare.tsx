/**
 * 需客户提供
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Radio, Button, message, Card, Table, Icon, Select, Modal, Tooltip, Popconfirm,Upload } from 'antd';
import { DragDropContext, DragSource, DropTarget, DragDropContextProvider  } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import moment from 'moment';
import uploadProps from './util/uploadProps';
// import {
//     WrappedFormUtils,
//     FormComponentProps,
// } from 'antd/lib/form/Form';
import './customerPrepare.less';
import {
    DOMAIN_OXT,
} from '../../../global/global';
const uploadApi = `${DOMAIN_OXT}/api/policypackage/material/template/upload`;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;

/**
 * 附件
 */
export interface Attachment {
    uid: number;
    ossKey?: string; /* oss的key */
    name?: string;
    url?: string; /* 显示的url */
    uploadApi?: string;
}
interface columns {
    (data?): any;
}
interface CustomerPrepareProps  {
    
    isNew?:boolean;
    role?:number;
    edit: boolean;
    isAdmin: boolean;
    identify: string;
    data?: any[];
    callback: any;

}

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

let BodyRow = (props) => {
    const {
      isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    // const style = { cursor: 'move' };
    const style = { ...restProps.style, cursor: 'move' };
    let className = restProps.className;

    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'downward') {
            className += ' drop-over-downward';
        }
        if (direction === 'upward') {
            className += ' drop-over-upward';
        }
    }

    return connectDragSource(
        connectDropTarget(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
    );
const EditableInputCell = ({ editable, value, onChange }) => (
    <div>
        {
            editable
            ? <Input style={{ margin: '-5px 0' }} maxLength={100} defaultValue={value} placeholder="请填写材料名称" onChange={e => onChange(e.target.value)} />
            : value.lenght> 20?<Tooltip placement="bottomLeft" title={value}>
            <div className="show-more-tooltip">{value}</div>
            </Tooltip>:value
        }
    </div>
);
const renderOptionsDom = (data:{any})=>{
    
    const optionsDom : Array<JSX.Element> = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = data[key];
            optionsDom.push(<Option value={Number.parseInt(key)} title={data[key]}>{data[key]}</Option>) 
        }
    }
    return optionsDom
}
const EditableSelectCell = ({ editable, value, data, onChange,width,mode }) => {
    const textValue = ()=>{
        const text : Array<JSX.Element> = [];
        if(Array.isArray(value)){
            value.map(function(sub){
                text.push(data[sub]||'')
            })
        }else{
            return data[value]||'/'
        }
        return text.join(';')
    }
    return (<div>
        {editable
            ? (mode === 'multiple'?<Select defaultValue={value} mode={mode} style={{ width: width||140 }} allowClear={true}  placeholder="请选择" onChange={e => onChange(e)}>
                {
                   renderOptionsDom(data)
                }
            </Select>:<Select defaultValue={value} style={{ width: width||140 }} allowClear={true}  placeholder="请选择" onChange={e => onChange(e)}>
                {
                   renderOptionsDom(data)
                }
            </Select>)
            : textValue()
        }
    </div>
    )
}
// 
const EditableUploadCell = ({ editable, data, uploadProps, callback,id }) => (
    <div>
        {editable
            ? <Upload
                
                {...uploadProps({ 
                    listType: 'text', 
                    fileSize: 20, 
                    key:id, 
                    number: 1, 
                    // accept: ['.pdf', '.csv', '.xls', '.xlsx', '.bmp', '.png', '.gif', '.jpeg', '.jpg'] ,
                    uploadApi,
                    callback,
                    uploading : false,
                    fileList:data||[]
                })}  
                fileList={data}
                
                
                >
                <Button>
                    <Icon type="upload" /> 点击上传
                </Button>
            </Upload>
            
            : (data?data.map(item => (<a className="template-file-name" href={item.url} target="_blank">{item.name}</a>)):'')
        }
    </div>
)


const EditableTextAreaCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <TextArea style={{ margin: '-5px 0' }} rows={4} maxLength={200} placeholder="请填写特殊要求与注意事项" defaultValue={value} onChange={e => onChange(e.target.value)} />
            : <Tooltip placement="bottomLeft" title={value}>
            <div className="show-more-tooltip">{value}</div>
        </Tooltip>
        }
    </div>
);
const materialsMap = {
    // 材料要求
    materialsRequire : {
        1:'原件',
        2:'复印件',
        3:'原件和复印件'
    },// 盖章要求
    sealRequire : {
        1:'公司公章',
        2:'总公司和分公司公章',
    }, // 提交份数
    amount : {
        1:'一式一份',
        2:'一式两份',
        3:'一式三份'
    },// 用途
    purpose : {
        1:'社保开户',
        2:'公积金开户',
        3:'数字证书'
    }
}


export default class CustomerPrepareForm extends Component<CustomerPrepareProps, any> {
    cacheData:any;
    cachePrepareData:any;
    constructor(props: CustomerPrepareProps) {
        super(props);
        const {
            data = {} as any
        } = props;
        const {

        } = data;
        this.state = {
            data:data|| [],
        };
        this.cacheData = data.map(item => {
            return { ...item }
        });
        this.cachePrepareData = [];
        
    }


    componentDidMount() {

    }
    shouldComponentUpdate(nextProps, nextState){
        
        
        if(nextState.data && !Object.is(JSON.stringify(this.cachePrepareData),JSON.stringify(nextState.data))){
            const {
                identify,
                callback
            } = this.props;
            callback({
                key:identify,
                type:2,
                data:nextState.data
            });
            this.cacheData = nextState.data.map(item => {
                return { ...item }
            });
            this.cachePrepareData = nextState.data;
            // return true;
        }
        return true;
        
    }
    componentWillReceiveProps(nextProps){
        const {
            data
        } = nextProps;
        if(data){
            
            this.setState({data})
            
        }
    }
    columns: columns = (params:any) => {
        return [
            {
                title: params.isAdmin && (<Tooltip placement="top" title="可拖动排序">
                    <Icon type="question-circle-o" style={{ color: '#fff' }} />
                </Tooltip>),
                width:40,
                dataIndex: null,
                key: 'index1',
                render: (text, record, index) => {
                    return index + 1;
                }
            }, {
                title: <label className="ant-form-item-required">材料名称</label>,
                width:350,
                dataIndex: 'materialsName',
                key: 'materialsName',
                render: (text, record) => this.renderInputColumns(text, record, 'materialsName'),
            }, {
                title: <label className="ant-form-item-required">材料要求</label>,
                width:150,
                dataIndex: 'materialsRequire',
                key: 'materialsRequire',
                render: (text, record) => this.renderSelectColumns(text, record, 'materialsRequire'),
            }, {
                title: '盖章要求',
                width:150,
                dataIndex: 'sealRequire',
                key: 'sealRequire',
                render: (text, record) => this.renderSelectColumns(text, record, 'sealRequire'),
            }, {
                title: '提交份数',
                width:100,
                dataIndex: 'amount',
                key: 'amount',
                render: (text, record) => this.renderSelectColumns(text, record, 'amount',100),
            }, {
                title: <label className="ant-form-item-required">用途</label>,
                width:150,
                dataIndex: 'purpose',
                key: 'purpose',
                render: (text, record) => this.renderSelectColumns(text, record, 'purpose'),
                filterIcon: <Icon type="filter" style={{ color: '#fff' }} />,
                filters: [{
                    text: '社保开户',
                    value: '1',
                }, {
                    text: '公积金开户',
                    value: '2',
                }, {
                    text: '数字证书',
                    value: '3',
                }],
                onFilter: (value, record) => {
                    return Array.isArray(record.purpose) ? record.purpose.join('').indexOf(value) !== -1 : record.purpose == value;
                },
            }, {
                title: '特殊要求与注意事项',
                width:300,
                dataIndex: 'mark',
                key: 'mark',
                render: (text, record) => this.renderTextAreColumns(text, record, 'mark'),
            }, {
                title: '模板文件',
                width:200,
                dataIndex: 'template',
                key: 'template',
                render: (text, record) => this.renderUploadColumns(text, record, 'template'),
            },(params.role ===1||params.role ===3)? {
                title: '操作',
                width: 150,
                fixed: 'right',
                dataIndex: null,
                key: 'operation',
                render: (text, record, index) => {
                    // 编辑 删除

                    const { editable,key } = record;
                    
                    return (
                        <div className="editable-row-operations" >
                            {
                            editable ?
                                <span>
                                <a onClick={() => this.save(key,index)}>保存</a>
                                <Popconfirm title="确定要取消保存?" onConfirm={() => this.cancel(key)}>
                                    <a>取消</a>
                                </Popconfirm>
                                </span>
                                : <div><a onClick={() => this.edit(key)}>编辑</a><Popconfirm title="确定是否删除该条材料?" onConfirm={() => this.handleDelete(key)}>
                                <a href="#"> 删除</a>
                            </Popconfirm></div>
                            }
                        </div>
                       
                    );
                }
            }:{}]
    }
    components = {

        body: {
            row: BodyRow,
        },
    }
    moveRow = (dragIndex, hoverIndex) => {
        const { data } = this.state;
        const dragRow = data[dragIndex];
        // TODO 如何更新到父组件
        this.setState(
            update(this.state, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
        /**回调 */
        // const {
        //     identify,
        //     callback
        // } = this.props;
        // callback({
        //     key: identify,
        //     type:2,
        //     data
        // });
    }
    /**
     * input
     */
    renderInputColumns(text, record, column) {
        return (
            <EditableInputCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }
    /**
     * TextAre
     */
    renderTextAreColumns(text, record, column) {
        return (
            <EditableTextAreaCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }
    

    uploadProps = uploadProps.bind(this);
    

    /**
     * Upload
     */
    renderUploadColumns(text, record, column) {
        // dddd
        return (
            <EditableUploadCell
                editable={record.editable}
                data={text}
                
                uploadProps={this.uploadProps}
                id={record.key}
                callback={this.handleUploadCallback}
                
                
            />
        );
    }
    
    /**
     * select
     */
    renderSelectColumns(text, record, column,width?) {
        return (
            <EditableSelectCell
                editable={record.editable}
                value={text}
                width={width}
                mode={column=="purpose"?"multiple":"combobox"}
                data={materialsMap[column]}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }
    // handleUploadonSuccess(response, file, record, column) {
    //     
    // }
    handleUploadCallback = (key, data)=>{
        
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.template = data;
           
            this.handleUpdateData(newData)
        }
    }
    handleUploadChange(info, key, column){
        let fileList = info.fileList;

        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. read from response and show file link
        fileList = fileList.map((file) => {
            let newfile;
            if (file.response) {
                // Component will show file.url as link
                const {
                    uid,
                    name,
                } = file;
                const {
                    msg,
                    status,
                    errcode,
                    data,
                    errmsg,
                } = file.response;;
                const {
                    ossKey,
                    url,
                } = data;
                
                if (Number(status) === 0 || Number(errcode) === 0) {
                    newfile = {
                        uid,
                        name,
                        url: data.url,
                        ossKey: data.ossKey,
                        status: 'done',
                    };
                    file = Object.assign(newfile,file);
                    
                }
                
            }
            return newfile;
        });
        
        
        // 3. filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
        if (file.response) {
            
            return file.response.status === 0;
        }
        return true;
        });
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = fileList;
            this.setState({ data: newData });
        }
        
        
    }
    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            
            this.handleUpdateData(newData)
        }
    }
    edit(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.handleUpdateData(newData)
        }
    }
    save(key,index) {
        const {
            data
        } = this.state;
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        const {
            materialsName,
            materialsRequire,
            purpose,
            template,
        } = target
        if(!materialsName) {
            message.error('请填写材料名称');
            return false
        }
        if(!materialsRequire) {
            message.error('请选择材料要求');
            return false
        }
        if(!purpose) {
            message.error('请选择用途');
            return false
        }
        if(template && template[0] && template[0].status && template[0].status!=='done'){
            message.error('请检查模板文件是否上传成功');
            return false
            
        }
        
        if (target) {

            
            const isInclude = this.cacheData.findIndex(function(obj, index, arr) {
                return obj.materialsName == target.materialsName;
            })
            // 新增
            if(isInclude === -1 ){
                
                delete target.editable;
                delete target.isNew;
                this.handleUpdateData(newData)
                this.cacheData = newData.map(item => ({ ...item }));
                message.success('添加成功');
            // 编辑
            }else if(isInclude === index){
                delete target.editable;
                this.handleUpdateData(newData)
                this.cacheData = newData.map(item => ({ ...item }));
                message.success('更新成功');
                
            }else {
                message.error(`该材料名称已存在 序号为${isInclude+1}`);
            }
            
        }
    }
    cancel(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            if(target.isNew && target.key){
                this.handleDelete(target.key)
            }else{
                Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                delete target.editable;
                this.handleUpdateData(newData)
            }
            
        }
    }
    
    handleDelete = (key) => {
        const {
            data
        } = this.state;
        this.handleUpdateData(data.filter(item => item.key !== key))
    }
    handleAppend = () => {
        const {
            data,
        } = this.state;
        const material = {
            key: '$'+Date.now(),
            editable: true,
            
            isNew:true, 
        }
        // 更新date 并传递一个回调编辑的方法
        this.handleUpdateData([material,...data ]);
        
    }
    // 每次更新data 回调一次父组件的方法
    handleUpdateData = (data, func?) => {
        this.setState({data});
        // func && func()
        const {
            identify,
            callback
        } = this.props;
        
        callback({
            key:identify,
            type:2,
            // firstEdit:func?true:false,
            data,
            
        },func);
    }
    onExpandedRowsChange = (expandedRows) => {
        
    }
    render() {
        const {
            edit,
            isAdmin,
            role,
            isNew,
        } = this.props;

        return (
            
            <div key="customerPrepare" className="customer-prepare">
                {
                    (role && role>4) &&<Table
                    // bordered
                    rowKey={(record: any) => record.key}
                    columns={this.columns({ edit, isAdmin,role})}
                    dataSource={this.state.data}
                    pagination={false}
                    scroll={{ x:1440,y:'auto'}}
                 
                    
                />
                }
                {
                    (role && role<5) && <Card title={<div>客户需准备：{(role===1 || role ===3)&&<Button type="primary" onClick={this.handleAppend}>添加材料信息 </Button>}</div>}>
                    <Table
                        // bordered
                        rowKey={(record: any) => record.key}
                        columns={this.columns({ edit, isAdmin ,role})}
                        dataSource={this.state.data}
                        pagination={false}
                        scroll={{ x:1440,y:'auto'}}
                        onExpandedRowsChange={this.onExpandedRowsChange}
                        components={(role===1 || role ===3)?this.components:{}}
                        onRow={(record, index) => ({
                            index,
                            moveRow: this.moveRow,
                        })}
                        rowClassName={(record: any, index) => {
                            // 被修改过
                            if(isNew && role ===2){
                                return 'ant-table-row-update'
                            }
                            if(record._op && (record._op === 'add' || record._op === 'replace') && (role ===2)){
                                return 'ant-table-row-update'
                            }
                            return ''
                        }}
                    />
                </Card>
                }
            </div>
            
        )
    }
}
// export default function MyTagControlContext(CustomerPrepareForm) {
//     return DragDropContext(HTML5Backend)(CustomerPrepareForm);
//   }
// export default CustomerPrepareForm
// export default DragDropContext(HTML5Backend)(CustomerPrepareForm);
