/**
 * 需客户提供
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Radio, Button, message, Card, Table, Icon, Select,Modal,Tooltip,Popconfirm } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import moment from 'moment';
import CustomerPrepare from './customerPrepare';
// import InputSelectChoice from '../../../components/common/inputSelectChoice';
import SelectDictionary from '../../../components/common/selectDictionary';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import './customerOffer.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Grid = Card.Grid;
const Option = Select.Option

interface columns {
    (data?): any[];
}
interface CustomerOfferProps extends FormComponentProps {
    role?:number;
    type:1|2;
    edit: boolean;
    isNew?: boolean;
    isAdmin: boolean;
    identify: string;
    // 客户需要提供
    data?: any[];
    // 客户需要提供 数据字典
    selectDictionaryData:any[]
    // 客户需准备
    prepareData?:any[];
    callback: any;

}

interface inputSelectChoiceState {
    key?:number;
    dictName?: string;
    dictKey?: string;
    type: 0 | 1 | 2; // 0无 1 输入框 2 选择框
    list: any[];
    // dictKey: string;
    isappend?: boolean;
    appendValue?: string;
    description?: string;
    code?: string;
    index?:number;
}

interface customerOfferState {
    data:any[];
    prepareData:any[]
    modalVisible:boolean;
    inputSelectChoiceData?:inputSelectChoiceState;
    
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
    const style = { cursor: 'move' };

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
class CustomerOfferForm extends Component<CustomerOfferProps, customerOfferState> {
    cacheData:any;
    cachePrepareData:any;
    constructor(props: CustomerOfferProps) {
        super(props);
        const {
            data = [] as any,
            prepareData = [] as any,
        } = props;
    
        this.state = {
            // data: tempData,
            data:data|| [],
            modalVisible:false,
            prepareData,
            
        };
        this.cacheData = [];
        this.cachePrepareData = [];
    }

    columns: columns = (params) => {
        return [
            {
                title: params.isAdmin &&(<Tooltip placement="top" title="可拖动排序">
                        <Icon type="question-circle-o" style={{color:'#fff'}}/>
                </Tooltip>),
                dataIndex: null,
                key: 'index',
                render: (text, record, index) => {
                    return index + 1;
                }
            }, {
                title: '材料名称',
                dataIndex: 'materialsName',
                key: 'materialsName',
                render: (text, record, index) => {
                    return this.transformMaterialsName(record);
                }
                
            }, {
                title: '字段类型',
                dataIndex: null,
                key: 'materialsValue',
                render: (text, record, index) => {
                    const {
                    materialsType, // 1 输入框 2 选择框
                        materialsValue,
                        materialsList
                } = record;
                    // 
                    if (params.isAdmin) {
                        if (materialsType === 2) {
                            return <div >{this.renderSelectDom(materialsList, undefined)}</div>
                        }else if (materialsType === 3) {
                            return <div >
                            <Button >
                                <Icon type="plus" /> 
                            </Button>
                          </div>
                        } else {
                            return <div > <Input placeholder="" value="" style={{width:200}}/></div>
                        }
                    } else {
                        if (materialsType === 2) {
                            return params.edit ? this.renderSelectDom(materialsList, materialsValue) : materialsValue
                        } else {
                            return params.edit ? <Input placeholder="请填写" defaultValue={materialsValue} /> : materialsValue
                        }
                    }


                }
            }, (params.role ===1||params.role ===3)? {
                title: '操作',
                
                dataIndex: null,
                key: 'operation',
                render: (text, record, index) => {
                    // 编辑 删除
              
                
                    return (
                        
                        <div className="editable-row-operations">
                            <a onClick={() => this.handleEdit(record,index)} style={{ paddingRight: 10 }}>编辑</a>
                            <Popconfirm title="确定是否删除该条材料?" onConfirm={() => this.handleDelete(record.key)}>
                                <a href="#"> 删除</a>
                            </Popconfirm>
                        </div>
                    );
                }

            }:[]]
    }

    componentDidMount() {
        // 
    }
    shouldComponentUpdate(nextProps, nextState){
        
        if(nextState.data && !Object.is(JSON.stringify(this.cacheData),JSON.stringify(nextState.data))){
            const {
                identify,
                callback
            } = this.props;
            callback({
                key:identify,
                type:1,
                data:nextState.data
            });
            this.cacheData = nextState.data;
            // return true;
        }

        if(nextState.prepareData && !Object.is(JSON.stringify(this.cachePrepareData),JSON.stringify(nextState.prepareData))){
            const {
                identify,
                callback
            } = this.props;
            callback({
                key:identify,
                type:2,
                data:nextState.prepareData
            });
            this.cachePrepareData = nextState.prepareData;
            // return true;
        }
        return true;
        
    }
    componentWillUnmount() {
        
        this.setState({data:[],prepareData:[]})
    }
    componentWillReceiveProps(nextProps){
        const {
            data,
            prepareData
        } = nextProps;
        if(data){
            
            this.setState({data})
            
        }
        if(prepareData){
            
            this.setState({prepareData})
            
        }
    }
    // componentWillReceiveProps(nextProps, nextState){
    //     
    //     return true;
    // }
    // componentWillReceiveProps
    // handleCallback
    InputSelectChoice:any;
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
            })
        );
        
        /**回调 */
        
    }
    transformMaterialsName = (record) => {
        const {
            selectDictionaryData
        } = this.props;
        const materialsKey = record.materialsKey;
        if(materialsKey && selectDictionaryData.length>0){
            const data =  selectDictionaryData.find(function(obj, index, arr) {
                return obj.dictKey == materialsKey;
            })
            if(data){
                return data.dictName || ''
            }else{
                return record.materialsName || ''
            }
            
        }else{
            return record.materialsName || ''
        }
        
        
    }
    renderSelectDom = (list, selected) => {
        const {
            edit,
            isAdmin
        } = this.props;
        const optionDom: Array<JSX.Element> = [];
        if (Object.prototype.toString.apply(list) === '[object Array]') {
            list.map(item => {

                optionDom.push(<Option value={item} title={item}>{item}</Option>)
            })
            // isAdmin == true select不可选只读 
            return isAdmin?<Select  value="" style={{ width: 200  }} placeholder="请选择">{optionDom}</Select>:
            <Select defaultValue={selected}  style={{ width: 200 }} placeholder="请选择">{optionDom}</Select>;
        }
    }

    // 每次更新data 回调一次父组件的方法
    handleUpdateData = (data) => {
        if(data !== undefined){
            this.setState({data});
        }
        
        // const {
        //     identify,
        //     callback
        // } = this.props;
        // callback({
        //     key:identify,
        //     type:1,
        //     data,
        // });
    }
    /**
     * 添加电子信息
     */
    handleAppend = () => {
        // 
        this.setState({modalVisible:true,inputSelectChoiceData:undefined})
        

    }
    /**
     * 编辑需提供材料
     */
    handleEdit = (record,index) => {
        const {
            key,
            materialsName,
            materialsKey,
            materialsType,
            materialsList,
            materialsDescription,
            materialsCode
        } = record;
        // 格式转换给子组件
        const inputSelectChoiceData = {
            id:key||1,
            dictKey: materialsKey,
            dictName: materialsName,
            type: materialsType,
            list: materialsList,
            description: materialsDescription,
            code: materialsCode,
            index,
            
        }
        this.setState({inputSelectChoiceData,modalVisible:true})
        
    }
    /**
     * 删除需提供材料
     */
    handleDelete = (key) => {
        const {
            data
        } = this.state;
        this.handleUpdateData(data.filter(item => item.key !== key))
        
    }
    
    /**
     * 添加电子信息弹窗关闭
     */
    handleHideModal = (key) => {
        // 提交信息
        if(key==='submit'){
            
            this.InputSelectChoice.validateFields((err, values) => {
                if(err) {
                    return false;
                }
                // title: "11111", type: 2, list: Array(0)
                const {
                    dictName,
                    dictKey,
                    type,
                    description,
                    list,
                    id,
                    index,
                    code,
                } = values;
                // 验证选项 子组件验证未实现
                if(type ===2 && list && list.length<1){
                    message.error('请设置可选项');
                    return false;
                }
                // id 存在则修改当前材料else 新增
                if(id){
                    this.handleUpdateMaterials({
                        key:id,
                        index,
                        materialsName:dictName.trim(),
                        materialsKey:dictKey,
                        materialsType:type,
                        materialsDescription:description,
                        materialsCode:code,
                        materialsList:list
                    },()=>{this.setState({modalVisible:false});})
                }else{
                    this.handleAddMaterials({
                        materialsName:dictName.trim(),
                        materialsKey:dictKey,
                        materialsType:type,
                        materialsDescription:description,
                        materialsCode:code,
                        materialsList:list
                    },()=>{this.setState({modalVisible:false});})
                }
            
                
                
                // 重置组件
                this.InputSelectChoice.resetFields();
                    console.log(values);
            })
        }else{
            this.setState({modalVisible:false})
        }
        
    }
    /**添加一条材料 */
    handleAddMaterials = (material,callback?) => {
        const {
            data,
        } = this.state;

        if(material){
            
            material.key = '$'+Date.now();
            // 判断材料名称是否存在
            const isInclude = data.findIndex(function(obj, index, arr) {
                return obj.materialsName == material.materialsName;
            })
            // 不存在
            if(isInclude === -1){
                // this.setState({
                //     data: [material,...data ],
                // });
                this.handleUpdateData([...data,material ]);
                message.success('添加成功');
                callback && callback();

            }else{
                message.error(`该材料名称已存在 序号为${isInclude+1}`);
            }
            
            
        }
        
    }
    /**
     * 修改当前材料
     */
    handleUpdateMaterials = (material,callback?) => {
        const {
            data,
        } = this.state;
        if(material && material.key){
            // material.id = data.length + 1;
            // 根据id判断材料是否存在
            const isInclude = data.findIndex(function(obj, index, arr) {
                return obj.materialsName == material.materialsName;
            })
            // 根据id判断材料是否存在
            const isKey = data.findIndex(function(obj, index, arr) {
                return obj.key == material.key;
            })
            
            if(isKey !== -1 && isInclude === -1) {
                this.handleUpdateData(data.fill(material, isKey, isKey+1))
                message.success('修改成功');
                callback && callback();
            }
            else if(isInclude === material.index) {
                this.handleUpdateData(data.fill(material, isInclude, isInclude+1))
                message.success('修改成功');
                callback && callback();
            }else if(isKey !== -1 && isInclude !== -1 && isInclude !== material.index) {
                message.error(`该材料名称已存在 序号为${isInclude+1}`);
                callback && callback();
            }
            
            
            
        }
        
    }
    render() {
        const {
            edit,
            isAdmin,
            role,
            isNew,
            identify,
            type,
            callback,
            selectDictionaryData
        } = this.props;
        const {
            modalVisible,
            inputSelectChoiceData,
            
        } = this.state;
        return (
            <div>
                {
                    type === 1 && <div key="customerOffer" className="customer-offer">
                    <Card title={<div>客户需提供：{(role===1 || role ===3)&&<Button type="primary" onClick={this.handleAppend}>添加电子信息 </Button>}</div>}>
                        <Table
                            
                            rowKey={(record:any)=>record.key}
                            columns={this.columns({ edit, isAdmin,role })} 
                            dataSource={this.state.data}
                            pagination={false}
                            components={(role===1 || role ===3)?this.components:{}}
                            onRow={(record, index) => ({
                                index,
                                moveRow: this.moveRow,
                            })}
                            rowClassName={(record:any, index) => {
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
                    <Modal
                        title="客户需提供"
                        visible={modalVisible}
                        onOk={()=>{this.handleHideModal('submit')}}
                        onCancel={()=>{this.handleHideModal('')}}
                        okText="确认"
                        cancelText="取消"
                        >
                        {/* 0.0.2 版本字段改为读取数据字典 */}
                        <SelectDictionary key={Date.now()}
                            dictKey="DLHDZXX"
                            data = {inputSelectChoiceData}
                            dictionaryData = {selectDictionaryData}
                            ref={node => this.InputSelectChoice = node}
                        />
                        
                    </Modal>
                </div>
                }
                {
                    type ===2 && <CustomerPrepare 
                    role = {role}
                    edit={edit}
                    isAdmin={isAdmin}
                    identify={identify}
                    isNew = {isNew}
                    data={this.state.prepareData}
                    callback = {callback}
                    // ref={node => this.CustomerPrepare = node}
                />
                }
            </div>
            
            
        )
    }
}

export default DragDropContext(HTML5Backend)(CustomerOfferForm);