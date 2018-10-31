import React from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import { Card, Input, Menu, Dropdown, Icon, Button, Table, Form, Select, Radio, TreeSelect, DatePicker } from 'antd';
import TableUI from '../../../Table';
import WhiteSpace from '../../../common/WhiteSpace';
import {formatMoney} from '../../../../util/util';
import {prefixInteger} from '../../../../util/crmUtil';
import { dataSource } from '../../../financialManagement/detailTableColumn';
import AccountBankSelect from '../AccountBankSelect';
import PaymentSlip from '../PaymentSlip';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const { Option, OptGroup } = Select;

const formItemLayoutTable = {
    labelCol: {
        xs: {
            span: 0,
        },
        sm: {
            span: 0,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 24,
        },
    }
}

let id = 1; //对象初始id

const payTypes = [
    '',
    '银行转账（直接出款）',
    '银行转账（延后发起）',
    '支票（直接出款）',
    '支票（延后发起）',
]

interface OutOfMoneyProps{
    platform: 1 | 2; //请款平台 
    requestInfoId?: number; //请款单id
    id?: number;    //自身id
    parentId?: number;   //父id
    number?: number;
    parentNumber?: number;
    index?: number;
    name?: string; //出款单
    payType?: string; //支付方式
    insuredStatus?: string; //状态（参保类型）
    insuredStatusId?: string; //状态（参保类型）Id
    insuredItem?: string;    //对应收款项
    insuredItemId?: string;    //对应收款项Id
    receiverId?: number; //收款方ID
    receiverName?: string; //收款方名称
    receiverType?: string; //收款方类型
    receiverBank?: string; //开户行
    receiverAccount?: string | number; //账号
    estimateAmount?: number; //付款金额（客服预估）
    sonNum?: number; //是否有二次请款(0代表无 其他代表有几个)
    paymentRemark?: string; //打款备注
    businessRemark?: string; //业务备注
    businessPlanPayTime?: number | string; //业务计划付款截止日
    remindTime?: number | string; //提醒时间（提醒用户延后发起出款）
    [propName:string]: any;
}
class OutOfMoney{
    public platform; //请款平台
    public requestInfoId;
    public id;
    public parentId;
    public number;
    public parentNumber;
    public name;
    public payType;
    public insuredStatus;
    public insuredStatusId;
    public insuredItem;
    public insuredItemId;
    public receiverId;
    public receiverName;
    public receiverType;
    public receiverBank;
    public receiverAccount;
    public estimateAmount;
    public sonNum;
    public paymentRemark;
    public businessRemark;
    public businessPlanPayTime;
    public remindTime;
    public isLast: boolean;
    private _index;
    private _parentIndex;
    constructor(obj: OutOfMoneyProps){
        this.id = obj.id;
        if(obj.id !== undefined && obj.id !== null){
            this.number = obj.number;
        }else{
            this.number = id;
            id++;
        }
        this._index = obj.index || this.id;
        this._parentIndex = obj.parentIndex || obj.parentId;
        this.parentId = obj.parentId;
        this.platform = obj.platform;
        this.parentNumber = obj.parentNumber || obj.parentId;
        this.name = obj.name ? obj.name : obj.parentNumber ? `二次出款单 ${prefixInteger(obj.parentNumber, 2)}-${prefixInteger(obj.number, 2)}` : `出款单 ${prefixInteger(obj.number, 2)}`;
        this.payType = obj.payType || 1;
        this.insuredStatus = obj.insuredStatus;
        this.insuredItem = obj.insuredItem;
        this.receiverId = obj.receiverId;
        this.receiverName = obj.receiverName;
        this.receiverType = obj.receiverType;
        this.receiverBank = obj.receiverBank;
        this.receiverAccount = obj.receiverAccount;
        this.estimateAmount = obj.estimateAmount || 0;
        this.sonNum = obj.sonNum || 0;
        this.paymentRemark = obj.paymentRemark;
        this.businessRemark = obj.businessRemark;
        this.businessPlanPayTime = obj.businessPlanPayTime;
        this.remindTime = obj.remindTime;
        this.requestInfoId = obj.requestInfoId;
    }

    get index(){
        return this._index;
    }
    set index (index:number){
        this._index = index;
        this.name = this._parentIndex ? `二次出款单 ${prefixInteger(this._parentIndex, 2)}-${prefixInteger(this._index, 2)}` : `出款单 ${prefixInteger(this._index, 2)}`;
    }
    get parentIndex(){
        return this._parentIndex;
    }
    set parentIndex(parentIndex:number){
        this._parentIndex = parentIndex;
        this.name = `二次出款单 ${prefixInteger(this._parentIndex, 2)}-${prefixInteger(this._index, 2)}`;
    }
}

interface InformationProps{
    isSP?: boolean;  //是否为sp平台 默认为false
    isEdit?: boolean; //是否可编辑
    total?: any; //总金额
    updateParams?: any; //更新父级元素
    recipientType?: any; //收款方类型
    requestInfoId?: number; //请款单id
    paymentBillDataSource?: any; //所有的付款清单数据
    noDetailAmount?: any //无明细款项金额
    data?: any;
}
class Information extends React.Component<InformationProps,any>{
    constructor(props) {
        super(props);
        this.state={
            recipientType: undefined,
            isService: true,
            count: undefined,
            dataSource: Immutable.fromJS([]),
            isToday: true,
            status: [],
            insuredItems: [],
            payMoneys: new Map(),   //参保类型 + 对应收款项 对应的合计钱
        }
        props.paymentBillDataSource && this.getStatus(props.paymentBillDataSource.toJS());
    }

    getPayMoney = (insuredStatus, insuredItem) => { //动态获取出款单中 参保类型 + 对应收款项 所对应的合计钱
        if(!insuredStatus || !insuredItem){
            return '/';
        }
        const status = insuredStatus === '全部' ? new Set(this.state.status) : new Set(insuredStatus.split(','));
        const items = new Set(insuredItem.split(','));
        const key = `${insuredStatus}-${insuredItem}`;

        let {payMoneys} = this.state;
        if(payMoneys.has(key)){
            return payMoneys.get(key);
        }
        const {isSP} = this.props;
        const paymentBillDataSource = this.props.paymentBillDataSource.toJS();
        const arr = paymentBillDataSource.filter(item => status.has(item.status));
        let p = 0;
        paymentBillDataSource.map(item=> {
            /*
            p = item.pensionOffice || 0 + item.pensionPerson || 0 + item.medicalOffice || 0 + item.medicalPerson || 0 +
                item.unemployedOffice || 0 + item.unemployedPerson || 0 + item.birthOffice || 0
                + item.injuryOffice || 0
                + item.illnessOffice || 0
                + item.illnessPerson || 0
                + item.residualPremium || 0
                + item.overduePayment || 0;    //滞纳金
                + item.heating || 0;    //采暖费
                + item.contractOtherFee || 0;    //工本/材料费
                
            p += item.total;
            */
        });
        console.log(p);
        let money:number = 0;
        if(isSP){
            arr.forEach(item => {
                if(items.has('养老') || items.has('全部')){
                    money += item.pensionOffice || 0;    //养老单位金额
                    money += item.pensionPerson || 0;    //养老个人金额
                }
                if(items.has('医疗') || items.has('全部')){
                    money += item.medicalOffice || 0;    //医疗单位金额
                    money += item.medicalPerson || 0;    //医疗个人金额
                }
    
                if(items.has('失业') || items.has('全部')){
                    money += item.unemployedOffice || 0;    //失业单位金额
                    money += item.unemployedPerson || 0;    //失业个人金额
                }
    
                if(items.has('生育') || items.has('全部')){
                    money += item.birthOffice || 0;    //生育单位金额
                }
    
                if(items.has('工伤') || items.has('全部')){
                    money += item.injuryOffice || 0;    //工伤单位金额
                }
    
                if(items.has('大病') || items.has('全部')){
                    money += item.illnessOffice || 0;    //大病单位金额
                    money += item.illnessPerson || 0;    //大病单位金额
                }
    
                if(items.has('残保金') || items.has('全部')){
                    money += item.residualPremium || 0;    //残保金单位金额
                }
    
                if(items.has('其他') || items.has('全部')){
                    money += item.overduePayment || 0;    //滞纳金
                    money += item.heating || 0;    //采暖费
                    money += item.contractOtherFee || 0;    //工本/材料费
                }
            });

        }else{

        }

        payMoneys.set(key, money);
        this.setState({
            payMoneys,
        });
        console.log(money);
        return money;
    }

    insuredStatusOrInsuredItemOnChange = (number:number, type:'status' | 'item', value:any) => {
        let s = new Set(value);
        if(s.has('全部')){
            value = ['全部'];
        }
        let newDataSource : OutOfMoney[] = this.state.dataSource.toJS();
        newDataSource.forEach(item => {
            if(item.number === number){
                if(type === 'status'){
                    item.insuredStatus = value.sort().join(',');
                }else{
                    item.insuredItem = value.sort().join(',');
                }
                item.estimateAmount = this.getPayMoney(item.insuredStatus, item.insuredItem);
            }
        })
        // console.log(newDataSource);
        this.setState({
            dataSource: Immutable.fromJS(newDataSource),
        })
    }

    getStatus = (paymentBillDataSource) => {
        const {isSP, noDetailAmount} = this.props;
        let status:any = new Set();
        let insuredItems:any = new Set();
        paymentBillDataSource.forEach(item => {
            if(!status.has(item.status)){
                status.add(item.status);
            }
            const insuredItem = `单位：${item.fundOfficeRatio}+个人${item.fundPersonRatio}`
            if(!insuredItems.has(insuredItem) && item.fundOfficeRatio && item.fundPersonRatio){
                insuredItems.add(insuredItem);
            }
        });
        // console.log(noDetailAmount);
        // if(isSP && noDetailAmount){
        //     status.add('无明细款项');
        // }
        this.setState({
            status: [...status],
            insuredItems: [...insuredItems],
        })
    }

    getInsuredItems = () => {
        
    }
    renderRecipientType = (value) => {
        const map = {
            '1': '给服务商合并请款',
            '2': '给服务商五险请款',
            '3': '给服务商公积金请款',
            '4': '给自营户五险请款',
            '5': '给自营户公积金请款',
        };

        /**
         * 无编辑状态
         */
        if (!this.props.isEdit) {
            if (Object.prototype.hasOwnProperty.call(map, value)) {
                return <span>{map[value]}</span>;
            }
            else {
                return <span></span>;
            }
        }

        /**
         * 编辑状态
         */
        let nodes: Array<React.ReactNode> = [];
        for (const key in map) {
            // nodes.push(<Radio value={Number(key)} key={key}>{map[key]}</Radio>);
            nodes.push(<Select.Option key={key} value={Number(key)}>{map[key]}</Select.Option>);
        }
        
        return (
            <Select value={this.props.recipientType} placeholder='请选择' onChange={(recipientType) => {
                let isService = false;
                if(Number(recipientType) < 4){  //收款方类型是否为服务商
                    isService = true;
                }
                if(isService){  //如果为服务商则，默认选中1条出款单，且不可更改
                    this.onOnceOutMoneyOfNumberChange(1, true);
                }else{
                    this.onOnceOutMoneyOfNumberChange(1);//反正默认选中 /
                }
                this.setState({recipientType, isService, count: isService ? undefined : 1}, () => {
                    this.props.updateParams!({ recipientType });
                    this.props.updateParams!({ paymentNum: 1 });
                });
            }} style={{width: '100%'}} key="recipientType">
                {nodes}
            </Select>
        );
    }
    
    onOnceOutMoneyOfNumberChange = (count:number, isService?) => {  //一次请款出款单数量 发生变化时调用
        if(count === 0){    //当一次出款单数量为0时
            this.setState({
                count: undefined,
                dataSource: Immutable.fromJS([]),
            })
            return ;
        }
        const {dataSource} = this.state;
        let newDataSource : OutOfMoney[] = dataSource.toJS();
        let once:number[] = []; //保存一次出款单下标
        for(let i in newDataSource){
            if(newDataSource[i].parentNumber === null || newDataSource[i].parentNumber === undefined){
                once.push(Number(i));
            }
        }
        const onceLen:number = once.length; //一次出款单数量
        const last1Index:number = once[onceLen -1] || 0;    //最后一个一次出款单的下标
        if(onceLen > count){    //删除
            const shouldDeleteNumber = onceLen - count;   //需要删除的数量
            const last2Index = once[onceLen -1 - shouldDeleteNumber]; //获取开始删除位置的下标
            const allLast2Number = once[onceLen -1] - last2Index; //获取需要删除的数量（包含二次出款）
            newDataSource.splice(last2Index, allLast2Number);
        }
        if(onceLen < count){    //增加
            const needAddNumber = count - onceLen;  //需要新增的数量
            let highID:number = 1;  //用于保存现有出款单中最高的id
            if(onceLen !== 0){
                for(let i in newDataSource){
                    newDataSource[i].number > highID && (highID = newDataSource[i].number);
                }
            }
            let newId = highID + 1; //默认新增的出款单 id 自增 1
            for (let i = 0; i < needAddNumber; i++){
                newDataSource.splice(last1Index + i, 0, new OutOfMoney({number: newId, requestInfoId: this.props.requestInfoId, platform: this.props.isSP ? 1 : 2}));
                newId ++ ;
            }
        }
        let ids = new Map();
        let newIndex = 1;   //新的index
        newDataSource = newDataSource.map((item, index) => {    //重新生成出款单号
            if(item.parentNumber){
                if(item.parentIndex && ids.has(item.parentIndex)){
                    item.parentIndex = ids.get(item.parentIndex);
                }
            }else{
                ids.set(item.index, newIndex);
                item.index = newIndex;
                newIndex += 1;
            }
            return item;
        })
        if(newDataSource.length > 1){   //最后一条数据特殊处理  存在多条时最后一条文案
            newDataSource[newDataSource.length - 1].insuredStatus = '该请款单的剩余款项';
            newDataSource[newDataSource.length - 1].insuredItem = '该请款单的剩余款项';
            newDataSource[newDataSource.length - 1].isLast = true;
        }else if(newDataSource.length === 1){   //只有一条时 文案为/
            newDataSource[newDataSource.length - 1].insuredStatus = '/';
            newDataSource[newDataSource.length - 1].insuredItem = '/';
            newDataSource[newDataSource.length - 1].isLast = true;
        }
        if(isService){  //判断是否为直接修改收款方类型为服务商，如果是则清除所有二次请款
            newDataSource = newDataSource.filter(item => !item.parentIndex).map(item => {
                item.sonNum = 0;
                return item;
            })
        }
        this.setState({
            count,
            dataSource: Immutable.fromJS(newDataSource),
        }, () => {
            this.props.updateParams!({ paymentNum: count });
        })
    }
    onTwiceOutMoneyOfNumberChange = (parentId, number) => { //二次出款单数量发生变化时
        const {dataSource} = this.state;
        let newDataSource = dataSource.toJS();
        const parentIndex = newDataSource.find(item => item.number === parentId).index; //父节点 index 值
        const parentNumber = newDataSource.findIndex(item => item.number === parentId); //父节点下标
        const children = newDataSource.filter(item => Number(item.parentNumber) === Number(parentId));  //已有的二次出款
        const firstChildrenIndex = newDataSource.findIndex(item => item.parentNumber === parentId); //第一个二次出款下标
        const childrenLen = children.length;    //已有二次出款的数量
        if(number === 0){   //当二次出款选择无时
            if(firstChildrenIndex !== -1){  //如果存在二次出款
                newDataSource.splice(firstChildrenIndex, childrenLen);  //删除从第一个二次出款下标位置 二次出款数量 的出款单
            }
            this.setState({
                dataSource: Immutable.fromJS(newDataSource),
            })
            return ;
        }
        if(childrenLen < number){   //增加
            const shouldAddNumber = number - childrenLen;   //需要新增的数量
            let highID:number = 1;  //用于保存现有出款单中最高的id
            for(let i in newDataSource){
                newDataSource[i].number > highID && (highID = newDataSource[i].number);
            }
            let newId = highID + 1; //默认新增的出款单 id 自增 1
            for(let i = 0; i < shouldAddNumber; i++){   //添加对应数量的二次出款单
                newDataSource.splice(parentNumber + childrenLen + 1, 0, new OutOfMoney({parentNumber: parentId, number: newId, requestInfoId: this.props.requestInfoId, platform: this.props.isSP ? 1 : 2}));
                newId++;
            }
        }
        if(childrenLen > number){   //删除
            const shouldDeleteNumber = childrenLen - number; //需要删除的数量;

            newDataSource.splice(firstChildrenIndex + number, shouldDeleteNumber);
        }
        let childrenIndex = 1;
        // console.log(newDataSource);
        newDataSource = newDataSource.map((item, index) => {    //重新生成出款单号
            if(item.parentNumber === parentId){
                item.parentIndex = parentIndex;
                item.index = childrenIndex;
                childrenIndex++;
            }
            return item;
        })
        this.setState({
            dataSource: Immutable.fromJS(newDataSource), 
        })
    }

    // insuredStatusOrInsuredItemOnChange = (number, value) => {
    //     console.log(number, value);
    //     const {dataSource} = this.state;
    //     let newDataSource = dataSource.toJS();
    //     newDataSource = newDataSource.map(item => {
    //         if(item.number === number){
    //             item.insuredStatus = value;
    //         }
    //         return item
    //     })
    // }

    onBankChange = (number: number, value) => {
        let newDataSource = this.state.dataSource.toJS();
        newDataSource = newDataSource.map(item => {
            if(item.number === number){
                item.receiverName = value.title;
                item.title = value.id;
                item.receiverBank = value.title;
                item.receiverAccount = value.value;
            }
            return item
        })
        this.setState({
            dataSource: Immutable.fromJS(newDataSource),
        })
    }
    select;

    disabledDate = (current) => {
        // console.log(moment().subtract(1, 'days').format("YYYY-MM-DD HH:00:00"),'----',
        // this.state.now.format("YYYY-MM-DD HH:00:00"))
        // Can not select days before today and today
        // current && console.log(moment().endOf('day'))
        // return current && current.unix() < now;
        // return current && current.unix() < moment().unix() - 3600;
        // return current && current < this.state.now;
        // console.log(current && current.format("YYYY-MM-DD HH:mm:ss") ,
        //     this.state.isToday ? moment().format("YYYY-MM-DD HH:mm:ss") : moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss"))
        // return current && current < (this.state.clickToday ? moment() : moment().subtract(1, 'days'));
        return current && current < moment(moment().format("YYYY-MM-DD"));
        // return current && current < moment()
    }

    disabledTime = () => {
        // return current && current < moment().hour();
        if(!this.state.isToday){
            return [];
        }
        let times:number[] = [];
        for(let i = 0; i <= 24; i++){
            if(i <= moment().hour()){
                times.push(i);
            }
        }
        return times;
    }
    disabledMinutes = (selectedHour) => {
        // console.log(selectedHour);
        // return current && current < moment().hour();
        if(!this.state.isToday){
            return [];
        }
        let today = moment();
        let hour = today.format('HH');
        if(Number(hour) !== Number(selectedHour)){
            return [];
        }
        let minute = today.format('mm');
        // console.log(minute);
        let times:number[] = [];
        for(let i = 0; i <= Number(minute); i++){
            times.push(i);
        }
        // console.log(times)
        return times;
        
    }

    updateOutOfMoneyTime = (number, propName, value) => {
        let newDataSource = this.state.dataSource.toJS();
        newDataSource.map(item => {
            if(item.number === number){
                item[propName] = value;
            }
            return item;
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.paymentBillDataSource){
            this.getStatus(nextProps.paymentBillDataSource.toJS());
        }
        if(nextProps.data){
            console.log(nextProps.data.toJS());
            this.setState({
                dataSource: nextProps.data,
            })
        }
    }
    render(){
        const {isService, recipientType, dataSource, count, status, insuredItems} = this.state;
        const {isSP, isEdit, requestInfoId, noDetailAmount} = this.props;
        return <Card title="收款方信息">
            <Form>
            <TableUI 
                dataSource={[
                    {
                        label: '请款总金额',
                        value: <span style={{fontWeight: 'bold'}} className='text-error'>{
                            // formatMoney(0)
                            this.props.total || 0.00
                        }</span>
                    },
                    {
                        label:'收款方类型',
                        required: isEdit,
                        value: this.renderRecipientType(this.props.recipientType),
                    },
                    {
                        label:'一次请款出款单数量（总到分的出款次数）',
                        // required: isEdit,
                        value: !isEdit ? '2' : !recipientType ? '/' : isService ? '1' : <Select placeholder='/' value={count} onChange={this.onOnceOutMoneyOfNumberChange} style={{width: 100}} key='一次请款出款单数量（总到分的出款次数）'>
                            <Select.Option value={1}>1</Select.Option>
                            <Select.Option value={2}>2</Select.Option>
                            <Select.Option value={3}>3</Select.Option>
                            <Select.Option value={4}>4</Select.Option>
                            <Select.Option value={5}>5</Select.Option>
                            <Select.Option value={6}>6</Select.Option>
                            <Select.Option value={7}>7</Select.Option>
                            <Select.Option value={8}>8</Select.Option>
                            <Select.Option value={9}>9</Select.Option>
                            <Select.Option value={10}>10</Select.Option>
                        </Select>,
                    },
                ]}
            />
            <WhiteSpace />

            <Table 
                className='ant-table-wrapper-text-center'
                bordered
                dataSource={dataSource.toJS()}
                pagination={false}
                scroll={{
                    x: 2450
                }}
                columns={[
                    {
                        title: '出款单',
                        dataIndex: 'name',
                        width: 140,
                        fixed: 'left',
                    },
                    {
                        title: '支付方式',
                        key: 'payType',
                        width: 160,
                        render: (item) => {
                            if(!isEdit){
                                return payTypes[item.payType];
                            }
                            if(isService){
                                return <Select key={`${item.number}-money`} defaultValue={item.payType} placeholder='请选择' style={{width: '100%'}}>
                                    <Select.Option value={1}>银行转账（直接出款）</Select.Option>
                                    <Select.Option value={2}>银行转账（延后发起）</Select.Option>
                                </Select>  
                            }else{
                                if(item.parentNumber !== null && item.parentNumber !== undefined){
                                    return <Select mode='multiple' key={`${item.number}-money`} defaultValue={item.payType} placeholder='请选择' style={{width: '100%'}}>
                                        <Select.Option value={1}>银行转账（直接出款）</Select.Option>
                                        <Select.Option value={2}>银行转账（延后发起）</Select.Option>
                                        <Select.Option value={3}>支票（直接出款）</Select.Option>
                                        <Select.Option value={4}>支票（延后发起）</Select.Option>
                                    </Select>  
                                }else{
                                    return payTypes[item.payType];
                                }
                            }
                        },
                    },
                    {
                        title: '状态（参保类型）',
                        key: 'insuredStatus',
                        width: 170,
                        render: (item) => {
                            if(!isEdit){
                                return item.insuredStatus;
                            }
                            if(count < 2){
                                return '/'
                            }else if(item.isLast){
                                return item.insuredStatus;
                            }else{
                                if(item.parentNumber !== null && item.parentNumber !== undefined){  //二次请款单
                                    return <Select mode="multiple" value={item.insuredStatus ? item.insuredStatus.split(',') : undefined} onChange={(value) => this.insuredStatusOrInsuredItemOnChange(item.number, 'status', value)} key={item.number + '-type-status'}>
                                        <Select.Option value='全部'>全部</Select.Option>
                                        {
                                            status.map(item => <Select.Option value={item}>{item}</Select.Option>)
                                        }
                                        <Select.Option value='该出款单的剩余款项'>该出款单的剩余款项</Select.Option>

                                    </Select>
                                }else{  //一次请款单
                                    if(isSP){
                                        return <Select value={item.insuredStatus ? item.insuredStatus.split(',') : undefined} mode="multiple" key={item.number + '-type-status1'} onChange={(value) => this.insuredStatusOrInsuredItemOnChange(item.number, 'status', value)}>
                                                <Select.Option value={'全部'}>全部</Select.Option>
                                                {
                                                    status.map(item => <Select.Option value={item}>{item}</Select.Option>)
                                                }
                                                {   
                                                    noDetailAmount ? <Select.Option value='无明细款项金额'>无明细款项金额</Select.Option> : []
                                                    // (() => {
                                                    //     if(noDetailAmount){
                                                    //         return (<Select.Option value='无明细款项金额'>无明细款项金额</Select.Option>)
                                                    //     }
                                                    // })()
                                                }
    
                                        </Select>
                                    }else{
                                        let recipientTypeToNumber = Number(recipientType);
                                        if(recipientType === 4){
                                            return <Select value={item.insuredStatus ? item.insuredStatus.split(',') : undefined} mode="multiple" onChange={(value) => this.insuredStatusOrInsuredItemOnChange(item.number, 'status', value)}>
                                                <Select.Option value='全部'>全部</Select.Option>
                                                {
                                                    status.map(item => <Select.Option value={item}>{item}</Select.Option>)
                                                }
                                            </Select>
                                        }else if(recipientType === 5){
                                            return <Select value={item.insuredStatus ? item.insuredStatus.split(',') : undefined} mode="multiple" onChange={(value) => this.insuredStatusOrInsuredItemOnChange(item.number, 'status', value)}>
                                                <Select.Option value='全部'>全部</Select.Option>
                                                {
                                                    status.map(item => <Select.Option value={item}>{item}</Select.Option>)
                                                }
                                            </Select>
                                        }
                                    }
                                }
                            }
                        },
                    },
                    {
                        title: '对应收款项',
                        key: 'insuredItem',
                        width: 170,
                        render: (item) => {
                            if(!isEdit){
                                return item.insuredItem;
                            }
                            if(count < 2){
                                return '/'
                            }else if(item.isLast){
                                return item.insuredItem
                            }else{
                                if(item.parentNumber !== null && item.parentNumber !== undefined){  //二次请款单
                                    return <Select mode="multiple" value={item.insuredItem ? item.insuredItem.split(',') : undefined} onChange={(value) => this.insuredStatusOrInsuredItemOnChange(item.number, 'item', value)} key={item.number + '-type-status'}>
                                        <Select.Option value='全部'>全部</Select.Option>
                                        {
                                            insuredItems.map(item => <Select.Option value={item}>{item}</Select.Option>)
                                        }

                                    </Select>
                                }else{  //一次请款单
                                    let recipientTypeToNumber = Number(recipientType);
                                    if(recipientTypeToNumber === 4){    //五险
                                        return <Select mode="multiple" value={item.insuredItem ? item.insuredItem.split(',') : undefined} onChange={(value) => this.insuredStatusOrInsuredItemOnChange(item.number, 'item', value)}>
                                            <Select.Option value='全部'>全部</Select.Option>
                                            {   noDetailAmount ? <Select.Option value='无明细款项金额'>无明细款项金额</Select.Option> : []}
                                            <Select.Option value='养老'>养老</Select.Option>
                                            <Select.Option value='医疗'>医疗</Select.Option>
                                            <Select.Option value='失业'>失业</Select.Option>
                                            <Select.Option value='生育'>生育</Select.Option>
                                            <Select.Option value='工伤'>工伤</Select.Option>
                                            <Select.Option value='大病'>大病</Select.Option>
                                            <Select.Option value='残保金'>残保金</Select.Option>
                                            <Select.Option value='其他'>其他</Select.Option>
                                        </Select>
                                    }else if(recipientTypeToNumber === 5){  //公积金
                                        return <Select mode="multiple" value={item.insuredItem ? item.insuredItem.split(',') : undefined} onChange={(value) => this.insuredStatusOrInsuredItemOnChange(item.number, 'item', value)}>
                                            <Select.Option value='全部'>全部</Select.Option>
                                            {
                                                insuredItems.map(item => <Select.Option value={item}>{item}</Select.Option>)
                                            }
                                            {   noDetailAmount ? <Select.Option value='无明细款项金额'>无明细款项金额</Select.Option> : []}
                                        </Select>
                                    }
                                }
                            }
                        },
                    },
                    {
                        title: '收款方名称',
                        key: '收款方名称',
                        width: 200,
                        render: (item) => {
                            if(!isEdit){
                                return item.insuredItem;
                            }
                            if(item.parentNumber !== undefined && item.parentNumber !== null){
                                return <AccountBankSelect title={item.receiverName} onChange={(value) => {
                                    this.onBankChange(item.number, value)
                                }}/>
                            }else{
                                if(isService){
                                    return <AccountBankSelect title={item.receiverName} onChange={(value) => {
                                        this.onBankChange(item.number, value)
                                    }}/>
                                }else{
                                    return <AccountBankSelect title={item.receiverName} onChange={(value) => {
                                        this.onBankChange(item.number, value)
                                    }}/>
                                }
                            }
                        },
                    },
                    {
                        title: '开户行',
                        width: 160,
                        dataIndex: 'receiverBank',
                    },
                    {
                        title: '账号',
                        width: 160,
                        dataIndex: 'receiverAccount',
                    },
                    {
                        title: '付款金额（客服预估）',
                        dataIndex: 'estimateAmount',
                        width: 160,
                        render: (text, record) => {
                            if(text){
                                return <span className='text-error'>{formatMoney(text)}</span>;
                            }
                            return '/'
                        }
                    },
                    {
                        title: '是否有二次请款',
                        width: 220,
                        key: 'sonNum',
                        render: (item) => {
                            if(item.parentNumber || isService){
                                return '/';
                            }
                            return <div>
                                <RadioGroup onChange={(e) => {
                                    const value = e.target.value;
                                    const newDataSource = dataSource.toJS().map(i => {
                                        if(i.number === item.number){
                                            i.sonNum = Number(value) === 0 ? 0 : 2;
                                            console.log('...', i.sonNum), Number(value);
                                        }
                                        return i;
                                    })
                                    this.setState({
                                        dataSource: Immutable.fromJS(newDataSource),
                                    }, () => {
                                        this.onTwiceOutMoneyOfNumberChange(item.number, Number(value) === 0 ? 0 : 2);
                                    })
                                }} value={item.sonNum > 0 ? 1 : 0} style={{textAlign: 'left'}} key={`${item.number}-sonNum`} >
                                    <div><Radio value={1}>有
                                        <Select size='small' onChange={(value) => {
                                            const newDataSource = dataSource.toJS().map(i => {
                                                if(i.number === item.number){
                                                    i.sonNum = Number(value);
                                                }
                                                return i;
                                            })
                                            this.setState({
                                                dataSource: Immutable.fromJS(newDataSource),
                                            }, () => {
                                                this.onTwiceOutMoneyOfNumberChange(item.number, value);
                                            })
                                        }} value={item.sonNum} key={`${item.number}-sonNum-select`} style={{width: 40}}>
                                            <Select.Option value={2}>2</Select.Option>
                                            <Select.Option value={3}>3</Select.Option>
                                            <Select.Option value={4}>4</Select.Option>
                                            <Select.Option value={5}>5</Select.Option>
                                        </Select>
                                        个二次请款收款方
                                    </Radio></div>
                                    <Radio value={0}>无</Radio>
                                </RadioGroup>
                            </div>
                        },
                    },
                    {
                        title: '打款备注',
                        key: 'paymentRemark',
                        width: 220,
                        render: () => <Input />,
                    },
                    {
                        title: '业务备注',
                        key: 'paymentRemark',
                        width: 220,
                        render: () => <Input />,
                    },
                    {
                        title: '业务方计划付款截止日',
                        key: 'businessPlanPayTime',
                        width: 200,
                        render: (item) => <DatePicker 
                            showTime ={{
                                format: 'HH:mm:00',
                                disabledHours: this.disabledTime,
                                disabledMinutes: this.disabledMinutes,
                            } as any}
                            format="YYYY-MM-DD HH:mm:00" 
                            value={item.businessPlanPayTime ? moment(item.businessPlanPayTime) : undefined}
                            showToday={false}
                            allowClear={false}
                            disabledDate = {this.disabledDate}
                            onChange={(time, timeString) => {
                                let now = moment();
                                if(time && now.format("YYYY-MM-DD") == time.format("YYYY-MM-DD")){
                                    this.setState({
                                        isToday: true,
                                    })
                                }else{
                                    this.setState({
                                        isToday: false,
                                    })
                                }
                                if(time && now.format("YYYY-MM-DD") == time.format("YYYY-MM-DD") && now.hour() >= time.hour()){
                                    timeString = moment.unix(moment().unix()+3600).format("YYYY-MM-DD HH:00:00");
                                }
                                this.setState({
                                    time: timeString,
                                }, () => {
                                    console.log(time)
                                    this.updateOutOfMoneyTime(item.number, 'businessPlanPayTime', time);
                                })
                            }}
                            onOk={() => {
                                this.setState({
                                    isToday: true,
                                })
                            }}
                        />,
                    },
                    {
                        title: '提醒时间（提醒用户延后发起出款）',
                        key: 'remindTime',
                        width: 270,
                        render: (item) => <DatePicker 
                            showTime ={{
                                format: 'HH:mm:00',
                                disabledHours: this.disabledTime,
                                disabledMinutes: this.disabledMinutes,
                            } as any}
                            format="YYYY-MM-DD HH:mm:00" 
                            showToday={false}
                            allowClear={false}
                            disabledDate = {this.disabledDate}
                            value={item.remindTime ? moment(item.remindTime) : undefined}
                            onChange={(time, timeString) => {
                                let now = moment();
                                if(time && now.format("YYYY-MM-DD") == time.format("YYYY-MM-DD")){
                                    this.setState({
                                        isToday: true,
                                    })
                                }else{
                                    this.setState({
                                        isToday: false,
                                    })
                                }
                                if(time && now.format("YYYY-MM-DD") == time.format("YYYY-MM-DD") && now.hour() >= time.hour()){
                                    timeString = moment.unix(moment().unix()+3600).format("YYYY-MM-DD HH:00:00");
                                }
                                this.setState({
                                    time: timeString,
                                })
                                this.updateOutOfMoneyTime(item.number, 'remindTime', time);
                            }}
                            onOk={() => {
                                this.setState({
                                    isToday: true,
                                })
                            }}
                        />,
                    },
                ]}
            />
            </Form>
        </Card>
    }
}

export default Information;