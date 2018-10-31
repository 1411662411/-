import React from 'react';
import { Form, Card, Checkbox, Select, Table, Button, TimePicker, InputNumber, Alert, message, Modal, Spin } from 'antd';
import BraftEditor from 'braft-editor';
import { FormComponentProps } from 'antd/lib/form';
const FormItem = Form.Item;
import moment from 'moment';

import PartTitle from '../../Title';
import TotalCount from '.././TotalCount/TotalCountShow';
import TableCard from '.././TableCard';
import WeekTime from '../../common/WeekTime';
import TableUi from '../../../Table';

import { browserHistory } from 'react-router';
import { DOMAIN_OXT } from "../../../../global/global";
import { fetchFn } from '../../../../util/fetch';

const UPDATE_API = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/update`; 
const updateWorkReport =  (data) => fetchFn(UPDATE_API, {...data, submit: 1, type: 1,}).then(data=>data);

import './style.less';

interface SubmitWorkReportTemplateFormProps extends FormComponentProps{
    type: 'daily' | 'weekly';  //提交报告类型 daily日报 weekly周报
    submit: boolean;    //true 提交； false 查看；
    day: string;    //显示日期
    totalCount?: any;   // 已废弃
    unsignedCustomerAddHead?: any[];// 已废弃
    data?: any;     // 数据对象，结构啊，后端返回的，较复杂
    id?: any;       //报告id
    positionId?: any;   //当前登陆人职位id
    positionName?: any; //当前登陆人职位名称
    organizationId?: any;   //公司id
    organizationName?: any;     //公司名称
    disabled: boolean | undefined;      //是否禁用
    deadLine: string;
    deadLineOfWeek: number;
}

const WEEK = [
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
    '周日',
]

class SubmitWorkReportTemplateForm extends React.Component<SubmitWorkReportTemplateFormProps,any>{
    isSale:boolean; //当前登陆人是否为销售
    constructor(props:SubmitWorkReportTemplateFormProps){
        super(props);
        let salesDate:any[] = [];
        let count:any = {};
        let products = props.data.productList.filter(item => Number(item.status) === 1); //签单产品对象

        let followUpShow = false;   //是否显示跟进相关
        let allProductDataShow = false; //是否显示签单产品
        let tomorrowPlanShow = false;   //是否显示明日计划
        let tomorrowWorkPointShow = false;  //是否显示明日重点
        let totalCountShow = false; //是否显示统计
        let unsignedCustomerAddDataShow = false;    //是否显示未签约客户新增相关
        let workSummaryShow = false;    //是否显示今日总结
        this.isSale = Number(props.positionId) < 6 ? false : true; //判断当前登陆人是销售还是主管及以上职位 
        
        let error:boolean = false;
        try {
            this.tableContainerWidth = document.querySelectorAll('.static-breadcrumb.ant-breadcrumb')[0].clientWidth - 32*2 - 24*2; //获取可视范围表格最长宽度
        } catch (err) {
            error = true;
        }

        props.data.followUp.list.map((item) => {    //判断是否显示跟进相关
            if(Number(item.status) === 1){
                followUpShow = true;
                return ;
            }
        })
        if(!followUpShow){//判断是否显示跟进相关
           (Object as any).values( props.data.followUpByCustomerParam.customerRelationParamsForFollowUp).map((item) => {
                item.customerParamList.map(key => {
                    if(Number(key.status) === 1){
                        followUpShow = true;
                        return ;
                    }
                })
            })
        }

        props.data.productList && props.data.productList.map(item => {  //判断是否显示签单产品
            if(Number(item.status) === 1){
                allProductDataShow = true;
                return;
            }
        })

        props.data.tomorrowPlan.list.map(item => {  //判断是否显示明日计划
            if(Number(item.status) === 1){
                tomorrowPlanShow = true;
                return ;
            }
        })
        
        props.data.tomorrowWorkPoint.list.map(item => {     //判断是否显示明日重点
            if(Number(item.status) === 1){
                tomorrowWorkPointShow = true;
                return ;
            }
        })

        props.data.totalCount.list.map(item => {    //判断是否显示统计
            if(Number(item.status) === 1){
                totalCountShow = true;
                return ;
            }
        });
        
        (Object as any).values(props.data.unsignedCustomerAddData.unsignedCustomerAddData).map(item => {    //判断是否显示未签约客户新增相关
            item.customerParamList.map(key => {
                if(Number(key.status) === 1){
                    unsignedCustomerAddDataShow = true;
                    return ;
                }
            })
        })

        props.data.workSummary.list.map(item => {   //判断是否显示今日总结
            if(Number(item.status) === 1){
                workSummaryShow = true;
                return ;
            }
        })

        let allShow = true;     //是否全部都不显示模块
        if(!followUpShow && !allProductDataShow && !tomorrowPlanShow && !tomorrowWorkPointShow && !totalCountShow && !unsignedCustomerAddDataShow && !workSummaryShow){
            allShow = false;
        }

        props.data.salesList.map(item => { //重构所有销售列表
            salesDate.push({
                name: item.name,
                teamName: item.teamName,
                saleId: item.id,
            })
        })
        this.countP = {name: '合计', saleId: 'count'};
        // props.data.allProductData && props.data.allProductData.list.map(item => { //将签单相关加入销售列表
        //     item.values && item.values.map(value => {
        //         salesDate.map(sale => {
        //             if(sale.saleId === value.userId){
        //                 sale[`${item.method}-${value.productId}`] = value.count;
        //             }
        //         })
        //     })
        // })

        allProductDataShow && this.setSaleDataWithValues(products, 'allProductData', true);     //将产品数据赋值到products
        followUpShow && this.setSaleDataWithValues(salesDate, 'followUp');  //将跟进相关数据赋值到salesDate
        followUpShow && this.setSaleDataWithValueList(salesDate, 'followUpByCustomerParam', 'customerRelationParamsForFollowUp');   //将跟进相关数据赋值到salesDate
        unsignedCustomerAddDataShow && this.setSaleDataWithValueList(salesDate, 'unsignedCustomerAddData');     //将未签约新增相关数据赋值到salesDate
        
        // props.data.unsignedCustomerAddData && props.data.unsignedCustomerAddData.unsignedCustomerAddData && (Object as any).values(props.data.unsignedCustomerAddData.unsignedCustomerAddData).map(item => {
        //     let method = item.method;
        //     item.valueList && item.valueList.map(value => {
        //         salesDate.map(sale => {
        //             if(sale.saleId === value.userId){
        //                 value.unsignCustomerDataList.map(i => {
        //                     sale[`${method}-${i.id}`] = i.count;
        //                 })
        //             }
        //         })
        //     })
        // })

        salesDate.map(sale => {
            (Object as any).keys(sale).map(key => {
                if(key !== 'name' && key !== 'teamName' && key !== 'saleId'){
                    count[key] = 0;
                }
            })
        })

        // salesDate.map(sale => {
        //     (Object as any).keys(sale).map(key => {
        //         if(key !== 'name' && key !== 'teamName' && key !== 'saleId' && key !== '合计'){
        //             count[key] += sale[key];
        //         }
        //     })
        // });
        // (Object as any).keys(count).map(key => {
        //     const keyArr = key.split('-');
        //     if(keyArr[0] === 'countPhoneNum' && keyArr[1] && `${count[key]}` !== 'NaN'){
        //         this.countPhoneNum += Number(count[key]);
        //     }
        // })
        count.countPhoneNum = this.countPhoneNum;
        count.name = '合计';
        count.saleId = 'count';
        salesDate.push(count);
        this.setSaleDataTotalWithUnsign(salesDate); //获取未签约新增相关合计数据
        this.setSaleDataTotalWithFollowUp(salesDate);   //获取跟进相关合计数据
        this.setSaleDataTotalWithFollowUpByCustomerParam(salesDate);    //获取跟进相关合计数据
        let methods = new Set();
        allProductDataShow && props.data.allProductData.list.map(item => {
            methods.add(item.method);
        })
        allProductDataShow && products.map(item => {
            (Object as any).keys(count).map(key => {
                const keyArr = key.split('-');
                // console.log(key, methods.has(keyArr[0]) , Number(keyArr[1]) === item.id)
                if(methods.has(keyArr[0]) && Number(keyArr[1]) === item.id){
                    item[key] = count[key];
                }
            })
        });
        
        allProductDataShow && products.push(this.countP);   //将产品合计加入products
        // console.log(salesDate);
        this.state={
            intentionCustomer:[
                {
                    title: '未签约客户新增',
                    render:() => '客户数'
                },
            ],
            follow:[],
            signMonad:[],
            salesDate,
            products,
            owner: props.data.salesList ? props.data.salesList[0] : {},

            workSummary: props.data.workSummary ? props.data.workSummary.list[0].values[0] ? props.data.workSummary.list[0].values[0] : '' : '',
            tomorrowWorkPoint: props.data.tomorrowWorkPoint ? props.data.tomorrowWorkPoint.list[0].values[0] ? props.data.tomorrowWorkPoint.list[0].values[0] : '' : '',

            followUpShow,
            allProductDataShow,
            tomorrowPlanShow,
            tomorrowWorkPointShow,
            totalCountShow,
            unsignedCustomerAddDataShow,
            workSummaryShow,

            allShow,

            editModalVisible: false,
            confirmLoading: false,

            tableContainerWidth: error ? 0 :this.tableContainerWidth,

            loading: false,

            error,

            clickSubmit: false,
        }
    }
    tableContainerWidth:any;    //可视区域表格最大宽度
    countPhoneNum:any = 0;
    countP:any; //产品合计
    hasProduct(id){
        const isHas = this.props.data.productList.filter(item => Number(item.status) === 1 && Number(item.id) === Number(id));
        return isHas.length === 1 ;
    }
    setSaleDataWithValues(salesDate, container, count=false) {
        this.props.data[container] && this.props.data[container].list.map(item => {
            if(count || Number(item.status) === 1){
                if(count && item.method){
                    this.countP[item.method] = 0;
                }
                if(count){
                    item.productRelationDataTotal && item.productRelationDataTotal.map(value =>{
                        if(count && item.method && this.hasProduct(value.productId)){
                            this.countP[item.method] = (this.countP[item.method]*10 + value.count*10) / 10;
                        }
                        salesDate.map(sale => {
                            if(sale.id === value.productId){
                                sale[`${item.method}-${value.productId}`] = value.count;
                            }
                        })
                    })
                }else{
                    item.values && item.values.map(value =>{
                        salesDate.map(sale => {
                            if(sale.saleId === value.userId){
                                sale[`${item.method}-${value.userId}`] = value.count;
                            }
                        })
                    })
                }
                
            }
        })
    }
    setSaleDataWithValueList(salesDate, container, container2?) {
        
        this.props.data[container] && this.props.data[container][container2 || container] && (Object as any).values(this.props.data[container][container2 || container]).map(item => {
            let method = item.method;
            let group = this.props.type === 'daily' ? item.nameDay : item.nameWeek;
            item.followUpValueList && item.followUpValueList.map(value => {
                salesDate.map(sale => {
                    if(sale.saleId === value.userId){
                        value.list && value.list.map(i => {
                            sale[`${method}-${group}-${i.id}`] = i.count;
                        })
                    }
                })
            })
            item.unsignValueList && item.unsignValueList.map(value => {
                salesDate.map(sale => {
                    if(sale.saleId === value.userId){
                        value.unsignCustomerDataList && value.unsignCustomerDataList.map(i => {
                            sale[`${method}-${group}-${i.id}`] = i.count;
                        })
                    }
                })
            })
        })
    }
    setSaleDataTotalWithUnsign(salesDate){
        let countIndex = salesDate.length - 1;
        (Object as any).values(this.props.data.unsignedCustomerAddData.unsignedCustomerAddData).map(item => {
            let group = this.props.type === 'daily' ? item.nameDay : item.nameWeek;
            item.unsignTotal && item.unsignTotal.unsignCustomerDataList.map(i => {
                salesDate[countIndex][`${item.method}-${group}-${i.id}`] = i.count;
            })
        })
    }
    setSaleDataTotalWithFollowUp(salesDate){
        let countIndex = salesDate.length - 1;
        this.props.data.followUp.list.map(item => {
            let group = this.props.type === 'daily' ? item.nameDay : item.nameWeek;
            item.followUpDataTotal && (salesDate[countIndex][`${item.method}`] = item.followUpDataTotal.count);
        })
    }
    setSaleDataTotalWithFollowUpByCustomerParam(salesDate){
        let countIndex = salesDate.length - 1;
        (Object as any).values(this.props.data.followUpByCustomerParam.customerRelationParamsForFollowUp).map(item => {
            let group = this.props.type === 'daily' ? item.nameDay : item.nameWeek;
            item.followUpTotal && item.followUpTotal.list.map(i => {
                salesDate[countIndex][`${item.method}-${group}-${i.id}`] = i.count;
            })
        })
    }


    renderNumberInput = (name, value:number|string, onChange?, decimal?) => {   //渲染输入框
        const {submit} = this.props;
        if(!submit || !this.isSale){    //如果是查看页 或者 非销售 则直接返回数据
            return value || 0
        }
        const { getFieldDecorator } = this.props.form;
        return <FormItem
        >
        {getFieldDecorator(name, {
            initialValue: value,
            rules:[
                {
                    validator:(rules, value, callback) => {
                        !this.state.clickSubmit && onChange && onChange(name);
                        callback();
                    }
                }
            ]
        })(
            <InputNumber
                size='small'
                step={decimal ? decimal : 1}
                min={0}
                precision={decimal ? 1 : 0}
            />
        )}
        </FormItem>
    }

    disabledHours = () => {
        let disabledHours:number[] = [];
        for(let i = 0; i < 18; i++ ){
            disabledHours.push(i);
        }
        return disabledHours;
    }
    unsignedCustomerAddHeadForm:any[] = [];

    /**
     * 自定义渲染表头
     * data 数据
     * key 已有长度
     * forms 
     * custom   配置项
     * name 
     */
    renderDynamicColumns = (data, key, forms, edit=true, custom={children:'customerParamList', group: this.props.type === 'daily' ? 'nameDay' : 'nameWeek' , title: 'parameterName', name: 'method', value: 'status'}, name='name') =>{
        let columns:any[] = [];
        // let values = new Set(data[custom.value] && data[custom.value].split(','));
        data.map(item => {
            // console.log(item);
            if(item[custom.children]){
                let hasChild = false;
                item[custom.children].map(item => {
                    if(Number(item.status) === 1){
                        hasChild = true;
                    }
                })
                if(hasChild){
                    let nameAttr = item[custom.name];
                    let obj = this.renderDynamicColumns(item[custom.children], key, forms, edit, custom, `${nameAttr}-${item[custom.group]}`);
                    key = obj.key;
                    columns.push(
                        {
                            title: item[custom.group],
    
                            key: item[custom.group],
                            children: obj.columns,
                        }
                    )
                }
            }else{
                if(Number(item.status) === 1){
                    columns.push({
                        title: item[custom.title],
                        key: item[custom.title],
                        width: 120,
                        render: (data) => {
                            if(edit){
                                return this.renderNumberInput(`${name}-${item.id}`, data[`${name}-${item.id}`]);
                            }else{
                                return data[`${name}-${item.id}`] || 0;
                            }
                        }
                    })
                    forms.push(`${name}-${item.id}`);
                    key++;
                }
            }
        })
        return {columns,key};
    }

    submit = () => {    //表单提交
        
        const {day, deadLine, type} = this.props;
        const now = moment();
        if(type === 'daily'){
            const deadTime = moment(`${day} ${deadLine}`, 'YYYY-MM-DD HH:mm');
            if(deadTime.unix() < now.unix()){
                message.error('已过该报告的提交截点，提交失败');
                return;
            }
        }

        if(type === 'weekly'){
            const {deadLineOfWeek} = this.props; 
            const deadTime = moment(`${now.format('YYYY-MM-DD')} ${deadLine}`, 'YYYY-MM-DD HH:mm');
            if(Number(now.format('e')) > deadLineOfWeek -1){
                message.error('已过该报告的提交截点，提交失败');
                return;
            }else if(Number(now.format('e')) === deadLineOfWeek -1 && deadTime.unix() < now.unix()){
                message.error('已过该报告的提交截点，提交失败');
                return;
            }
        }

        this.setState({
            clickSubmit: true,
        }, () => {
            this.props.form.validateFieldsAndScroll(async(err, values) => {
                if(!err){
                    const {owner, workSummary, tomorrowWorkPoint} = this.state; 
                    if(workSummary.length > 2000){
                        message.error('工作总结过长')
                        this.setState({loading: false, clickSubmit: false});
                        return ;
                    }
                    if(tomorrowWorkPoint.length > 2000){
                        message.error('工作重点过长')
                        this.setState({loading: false, clickSubmit: false});
                        return ;
                    }
                    const {
                        followUpShow,
                        allProductDataShow,
                        tomorrowPlanShow,
                        tomorrowWorkPointShow,
                        totalCountShow,
                        unsignedCustomerAddDataShow,
                        workSummaryShow,
                    } = this.state;

                    this.setState({loading: true});
                    let {data} = this.props;
                    let unsignedCustomerAddData = data.unsignedCustomerAddData.unsignedCustomerAddData;
                    let followUpByCustomerParam = data.followUpByCustomerParam.customerRelationParamsForFollowUp;
    
                    allProductDataShow && data.allProductData.list.map(item => {
                        if(item.method !== 'countSignNumByProduct' && item.method !== 'countSignNumOfMonthByProduct'){
                            item.values = [];
                        }
                        for(let key in values){
                            const keys = key.split('-');
                            if(keys[0] === item.method){
                                item.values.push({count: values[key] || 0 , productId: Number(keys[1]), userId: owner.id});
                            }
                        }
                    })
                    this.isSale && tomorrowPlanShow && data.tomorrowPlan.list.map(item => {
                        item.values[0].count = values[item.method] !== undefined ? values[item.method] : item.values[0].count;
                        item.tomorrowPlan.count = values[item.method] !== undefined ? values[item.method] : item.tomorrowPlan.count;
                    })
    
                    if(followUpShow && this.isSale)
                    for(let key in values){
                        const keys = key.split('-');
                        if(keys[0] === 'countPhoneNum'){
                            let before:any = 0;
                            if((data.followUp.statisticsByUserId) === 1 && Number(keys[1]) === Number(this.state.owner.id)){
                                // let keys = (Object as any).keys()
                                let index = data.followUp.list[0].values.filter(item => Number(item.userId) === Number(keys[1]))
                                if(index.length === 0){
                                    data.followUp.list[0].values.push({count: values[key], userId:Number(keys[1])});
                                }else{
                                    data.followUp.list[0].values.map(item => {
                                        if(Number(item.userId) === Number(keys[1])){
                                            before = item.count;
                                            item.count = values[key];
                                        }
                                    })
                                }
                            }else if(data.followUp.statisticsByUserId === 0){
                                data.followUp.list[0].values[0] = {
                                    count: values[key],
                                    userId: owner.id,
                                }
                            }
                            !data.followUp.list[0].followUpDataTotal && (data.followUp.list[0].followUpDataTotal={count:0, userId:0});
                            data.followUp.list[0].followUpDataTotal.count = data.followUp.list[0].followUpDataTotal.count - Number(before) + Number(values[key]);
                            data.followUp.list[0].followUpDataTotal.userId = Number(keys[1]);
                        }
                    }
    
                    tomorrowWorkPointShow && (data.tomorrowWorkPoint.list[0].values[0] = tomorrowWorkPoint);
                    workSummaryShow && (data.workSummary.list[0].values[0] = workSummary);
    
                    // console.log(values,data);
                    // return;
    
                    let res:any ;
                    if(this.props.submit){
                        res = await updateWorkReport({
                            positionId: this.props.positionId,
                            organizationId: this.props.organizationId,
                            reportType: this.props.type === 'daily' ? 1 : 2,
                            richTextContent: JSON.stringify(data),
                            id: this.props.id,
                        })
                    }
    
                    if(res.status === 0){
                        // browserHistory.push(`${DOMAIN_OXT}/newadmin/crm/customermanagement/myworkreport`)
                        message.success('提交成功', 1.5, () => {
                            browserHistory.goBack();
                        })
                    }else{
                        this.setState({loading: false, clickSubmit: false});
                    }
                }
            })
        })
        
    }

    renderUnsignedCustomerAddHead(data){
        let columns:any[] = [{
            title: '未签约客户新增',
            key:'未签约客户新增',
            width: 120,
            fixed: 'left',
            render:() => '客户数'
        }];
        let key = 1;
        if(Number(this.props.data.unsignedCustomerAddData.statisticsByUserId) === 1){
            columns = [
                {
                    title: '所在团队',
                    key:'所在团队',
                    width: 120,
                    fixed: 'left',
                    render:(data,i,index) => {
                        if(index !== this.state.salesDate.length-1){
                            return data.teamName || '/'
                        }else{
                            return {
                                children: data.name,
                                props:{
                                    colSpan: 2,
                                }
                            }
                        }
                    }
                },
                {
                    title: '员工',
                    key:'员工',
                    width: 120,
                    fixed: 'left',
                    render:(data,d,index) => {
                        if(index !== this.state.salesDate.length-1){
                            return data.name || '/'
                        }else{
                            return {
                                children:'',
                                props:{
                                    colSpan: 0,
                                }
                            }
                        }
                    }
                },
                {
                    title: '未签约客户新增',
                    key:'未签约客户新增',
                    width: 120,
                    fixed: 'left',
                    render:() => '客户数'
                },
            ];
            key = 3;
        }
        const dynamicColumns = this.renderDynamicColumns((Object as any).values(data), key, this.unsignedCustomerAddHeadForm, false);
        columns = [...columns, ...dynamicColumns.columns];
        return {columns, len: dynamicColumns.key};
    }
    followUpHeadForm:any[]=[];
    renderFollowUpHead(){
        const {data} = this.props;
        const { followUp, followUpByCustomerParam } = data;
        let columns:any[] = [];
        let key = 0;
        if(Number(followUp.statisticsByUserId) === 1){
            columns = [
                {
                    title: '所在团队',
                    key:'所在团队',
                    width: 120,
                    fixed: 'left',
                    render:(data,i,index) => {
                        if(index !== this.state.salesDate.length-1){
                            return data.teamName || '/'
                        }else{
                            return {
                                children: data.name,
                                props:{
                                    colSpan: 2,
                                }
                            }
                        }
                    }
                },
                {
                    title: '员工',
                    key:'员工',
                    width: 120,
                    fixed: 'left',
                    render:(data,d,index) => {
                        if(index !== this.state.salesDate.length-1){
                            return data.name || '/'
                        }else{
                            return {
                                children:'',
                                props:{
                                    colSpan: 0,
                                }
                            }
                        }
                    }
                },
            ]
            key = 2;
        }
        // let values = new Set(followUp.values ? followUp.values.split(',') : [])
        followUp.list.map(item => {
            if(Number(item.status) === 1){
                columns.push({
                    title: this.props.type === 'daily' ? item.nameDay : item.nameWeek,
                    key: this.props.type === 'daily' ? item.nameDay : item.nameWeek,
                    width: 120,
                    fixed: 'left',
                    render: (data) => {
                        if(item.method === 'countPhoneNum' && this.props.type === 'daily'){
                            if(data.name !== '合计' && data.saleId === this.state.owner.id){
                                return this.renderNumberInput(`${item.method}-${data.saleId}`, data[`${item.method}-${data.saleId}`], (name) => {
                                    this.calculationPhoneNum(name)});
                            }else{
                                if(data.name === '合计'){
                                    return Number(followUp.statisticsByUserId) !== 1 ? this.renderNumberInput(item.method, data[item.method], (name) => {
                                        this.calculationPhoneNum(name)}) : data[item.method] || 0;
                                }
                                return data[`${item.method}-${data.saleId}`] || 0;
                            }
                                    
                        }else{
                            return data.name === '合计' ? data[item.method] || 0 : data[`${item.method}-${data.saleId}`] || 0;
                        }
                    }
                })
                this.followUpHeadForm.push(`${item.method}`);
                key++;
            }
        })
        const K = key;
        const dynamicColumns = this.renderDynamicColumns((Object as any).values(followUpByCustomerParam.customerRelationParamsForFollowUp), key, this.followUpHeadForm, false);
        columns = [...columns, ...dynamicColumns.columns];
        for(let i = 0; i < K; i++){
            columns[i].fixed = this.state.tableContainerWidth < dynamicColumns.key * 120 ? 'left' : false;
        }
        return {columns, len: dynamicColumns.key};
    }
    allProductDataHeadForm:any[]=[];
    
    renderAllProductDataHead(){
        const {data} = this.props;
        const { allProductData, productList } = data;
        let columns:any[] = [{
                title: '签单产品',
                key:'签单产品',
                dataIndex: 'name',
                width: 280,
                fixed: 'left',
            }];
        // let values = new Set(allProductData.values ? allProductData.values.split(',') : [])
        allProductData.list.map(item => {
            // if(Number(item.status === 1)){
                let title = this.props.type === 'daily' ? item.nameDay : item.nameWeek;
                columns.push({
                    title,
                    key: title,
                    width: 140,
                    render: (data) => {
                        if(data.name === '合计'){
                            
                            return data[item.method] || 0;
                        }
                        if(this.props.type !== 'daily' || title === '今日已签约数量' || title === '本月累计已签约数量' || title === '本周已签约数量' || title === '本月累计已激活合同数量' || title === '本月累计已激活人数' || title === '本月累计分值'){
                            return data[`${item.method}-${data.id}`] || 0;
                        }else{
                            if(item.method === 'countPointByProduct'){
                                return this.renderNumberInput(`${item.method}-${data.id}`, data[`${item.method}-${data.id}`], (name) => {
                                    this.calculationNum(name);
                                }, 0.1);
                            }else{
                                return this.renderNumberInput(`${item.method}-${data.id}`, data[`${item.method}-${data.id}`], (name) => {
                                    this.calculationNum(name);
                                });
                            }
                        }
                    }
                })
            // }
        })
        productList.map(item => {
            this.allProductDataHeadForm.push(`${item.name}`);
        })
        columns[0].fixed = this.state.tableContainerWidth < (allProductData.list.length + 2) * 140 ? 'left' : false;
        return {columns, len: allProductData.list.length + 2};
    }
    calculationPhoneNum = (name) => {
        let values = this.props.form.getFieldsValue();
        const attr = name.split('-')[0];
        let { salesDate } = this.state;
        let count = 0;
        if(Number(this.props.data.followUp.statisticsByUserId) === 1){
            salesDate.map(item => {
                if(Number(item.saleId) === Number(name.split('-')[1])){
                    item[name] = values[name];
                }
                if(item[`${attr}-${item.saleId}`])
                count += Number(item[`${attr}-${item.saleId}`]);
            })
        }else{
            const id = this.state.owner.id;
            salesDate.map(item => {
                if(Number(item.saleId) === Number(id)){
                    item[`${attr}-${id}`] = values[name];
                }
                if(item[`${attr}-${item.saleId}`])
                count += Number(item[`${attr}-${item.saleId}`]);
            })
        }
        
        salesDate[salesDate.length - 1][attr] = count;
        // console.log('1', salesDate)
        this.setState({salesDate})
    }
    calculationNum = async(name) => { //签单相关 计算合计
        if(this.state.clickSubmit){
            return ;
        }
        // console.log(name);
        let values = this.props.form.getFieldsValue(); 
        const attr = name.split('-')[0];
        const productId = name.split('-')[1];
        let before:any;
        let after:any;
        this.props.data.allProductData.list.map(item => {
            if(item.method === attr){ //修改今日激活合同数量
                item.values.map(value => {
                    // console.log('/*', Number(value.productId) === Number(productId) && value.userId === this.state.owner.id ,'*/')
                    if(Number(value.productId) === Number(productId) && value.userId === this.state.owner.id){
                        before = value.count;
                        value.count = values[name] || 0;
                        after = value.count;
                        this.props.data.allProductData.list.map(item => {
                            if(attr === 'countActivitedContractNumByProduct' && item.method === 'countActivitedContractNumOfMonthByProduct'){    //修改本月激活合同数量
                                item.productRelationDataTotal.map(value => {
                                    if(Number(value.productId) === Number(productId)){
                                        value.count = (value.count*10 - before*10 + after*10) / 10;
                                    }
                                })
                            }
                
                            if(attr === 'countActivitedPersonNumByProduct' && item.method === 'countActivitedPersonNumOfMonthByProduct'){    //修改本月激活人数
                                item.productRelationDataTotal.map(value => {
                                    if(Number(value.productId) === Number(productId)){
                                        value.count = (value.count*10 - before*10 + after*10) / 10;
                                    }
                                })
                            }
                
                            if(attr === 'countPointByProduct' && item.method === 'countPointOfMonthByProduct'){    //修改本月分值
                                item.productRelationDataTotal.map(value => {
                                    if(Number(value.productId) === Number(productId)){
                                        console.log('before', before, 'after', after)
                                        value.count = (value.count*10 - before*10 + after*10) / 10;
                                    }
                                })
                            }
                        })
                    }
                })
                item.productRelationDataTotal.map(value => {
                    if(Number(value.productId) === Number(productId)){
                        value.count = (value.count*10 - before*10 + after*10) / 10;
                    }
                })

            }
            

        })
        let products = this.props.data.productList.filter(item => Number(item.status) === 1); //签单产品对象
        await this.setSaleDataWithValues(products, 'allProductData', true);
        products.push(this.countP)
        this.setState({
            products,
        })
        // console.log(attr);
        // let count = 0;
        // (Object as any).keys(values).map(key => {
        //     if(key.split('-')[0] === attr){
                
        //         if(values[key]){
        //             if(attr === 'countPointByProduct' || attr === 'countPointOfMonthByProduct'){
        //                 let num = count*10 + values[key]*10;
        //                 count = num / 10;
        //             }else{
        //                 count += values[key];
        //             }
        //         }
        //     }
        // })
        // this.countP[attr] = count;

    }

    tomorrowPlanHeadForm:any[]=[];
    renderTomorrowPlanHead(){
        const {data} = this.props;
        const { tomorrowPlan } = data;
        let columns:any[] = [];
        // let values = new Set(allProductData.values ? allProductData.values.split(',') : [])
        tomorrowPlan.list.map(item => {
            columns.push({
                title: this.props.type === 'daily' ? item.nameDay : item.nameWeek,
                key: this.props.type === 'daily' ? item.nameDay : item.nameWeek,
                width: 120,
                render: (data) => this.renderNumberInput(item.method, item.tomorrowPlan.count)
            })
            this.tomorrowPlanHeadForm.push(item.method);
        })
        return {columns, len: tomorrowPlan.list.length};
    }

    tomorrowChange = (html) => {    //明日计划
        // console.log('tomorrow', html)
        this.setState({tomorrowWorkPoint: html})
    }
    todayChange = (html) => {   //今日重点
        // console.log('today', html)
        this.setState({workSummary: html})
    }

    onClickRow = (record) => { //签单相关点击行操作，仅针对主管及以上职位
        if(this.isSale || !this.props.submit || this.props.type !== 'daily'){ //如果是销售或者是查看页或者是周报，则直接return，不进行后续操作
            return ;
        }
        let countActivitedContractNumByProduct:any;
        let countActivitedPersonNumByProduct:any;
        let countPointByProduct:any;
        this.props.data.allProductData.list.map(item => {
            if(item.method === 'countActivitedContractNumByProduct'){
                item.values.map(value => {
                    if(value.productId === record.id && value.userId === this.state.owner.id){
                        countActivitedContractNumByProduct = value.count || 0;
                    }
                })
            }
            if(item.method === 'countActivitedPersonNumByProduct'){
                item.values.map(value => {
                    if(value.productId === record.id && value.userId === this.state.owner.id){
                        countActivitedPersonNumByProduct = value.count || 0;
                    }
                })
            }
            if(item.method === 'countPointByProduct'){
                item.values.map(value => {
                    if(value.productId === record.id && value.userId === this.state.owner.id){
                        countPointByProduct = value.count || 0;
                    }
                })
            }
        })
        this.setState({
            editProduct: record.name,
            editProductId: record.id,
            countActivitedContractNumByProduct,
            countActivitedPersonNumByProduct,
            countPointByProduct,
            countActivitedContractNumByProductBefore: countActivitedContractNumByProduct || 0,
            countActivitedPersonNumByProductBefore: countActivitedPersonNumByProduct || 0,
            countPointByProductBefore: countPointByProduct || 0,
            editModalVisible: true,
        })
    }
    editModalOnOk = async() => {    //主管及以上编辑自己产品相关数据时，点击确定后保存相关数据
        this.setState({confirmLoading: true});
        const {
            countActivitedContractNumByProduct,
            countActivitedPersonNumByProduct,
            countPointByProduct,
            countActivitedContractNumByProductBefore,
            countActivitedPersonNumByProductBefore,
            countPointByProductBefore,
            editProductId,
        } = this.state;
        this.props.data.allProductData.list.map(item => {
            if(item.method === 'countActivitedContractNumByProduct'){ //修改今日激活合同数量
                item.values.map(value => {
                    if(value.productId === editProductId && value.userId === this.state.owner.id){
                        value.count = countActivitedContractNumByProduct || 0;
                    }
                })
                item.productRelationDataTotal.map(value => {
                    if(value.productId === editProductId){
                        value.count = value.count - countActivitedContractNumByProductBefore + countActivitedContractNumByProduct;
                    }
                })
            }
            if(item.method === 'countActivitedContractNumOfMonthByProduct'){    //修改本月激活合同数量
                item.productRelationDataTotal.map(value => {
                    if(value.productId === editProductId){
                        value.count = value.count - countActivitedContractNumByProductBefore + countActivitedContractNumByProduct;
                    }
                })
            }


            if(item.method === 'countActivitedPersonNumByProduct'){     //修改今日激活人数
                item.values.map(value => {
                    if(value.productId === editProductId && value.userId === this.state.owner.id){
                        value.count = countActivitedPersonNumByProduct || 0;
                    }
                })
                item.productRelationDataTotal.map(value => {
                    if(value.productId === editProductId){
                        value.count = value.count - countActivitedPersonNumByProductBefore + countActivitedPersonNumByProduct;
                    }
                })
            }
            if(item.method === 'countActivitedPersonNumOfMonthByProduct'){    //修改本月激活人数
                item.productRelationDataTotal.map(value => {
                    if(value.productId === editProductId){
                        value.count = value.count - countActivitedPersonNumByProductBefore + countActivitedPersonNumByProduct;
                    }
                })
            }


            if(item.method === 'countPointByProduct'){  //修改今日分值
                item.values.map(value => {
                    if(value.productId === editProductId && value.userId === this.state.owner.id){
                        value.count = countPointByProduct || 0;
                    }
                })
                item.productRelationDataTotal.map(value => {
                    if(value.productId === editProductId){
                        value.count = value.count - countPointByProductBefore + countPointByProduct;
                    }
                })
            }
            if(item.method === 'countPointOfMonthByProduct'){    //修改本月分值
                item.productRelationDataTotal.map(value => {
                    if(value.productId === editProductId){
                        value.count = value.count - countPointByProductBefore + countPointByProduct;
                    }
                })
            }


        })
        let products = this.props.data.productList.filter(item => Number(item.status) === 1); //签单产品对象
        await this.setSaleDataWithValues(products, 'allProductData', true);
        products.push(this.countP)
        this.setState({
            confirmLoading: false,
            editModalVisible: false,
            products,
        })
    }

    getWeek(week){
        if(!week){
            week = 5;
        }
        return WEEK[week-1];
    }

    componentDidMount(){
        if(this.state.error){
            this.tableContainerWidth = document.querySelectorAll('.static-breadcrumb.ant-breadcrumb')[0].clientWidth - 32*2 - 24*2; //获取可视范围表格最长宽度
            this.setState({
                tableContainerWidth: this.tableContainerWidth,
            })
        }
    }

    render(){
        const { form, type, data } = this.props;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, setFieldsValue } = form;
        const {
            followUpShow,
            allProductDataShow,
            tomorrowPlanShow,
            tomorrowWorkPointShow,
            totalCountShow,
            unsignedCustomerAddDataShow,
            workSummaryShow,
            allShow,
        } = this.state;
        const formItemLayout={
            labelCol: {
                xs: {span:0},
            },
            wrapperCol: {
            xs: { span: 24 },
            },
        }
        // console.log(data);
        console.log(data, this.state.salesDate, this.state.products);
        const unsignedCustomerAddHeadColumns = this.renderUnsignedCustomerAddHead(data.unsignedCustomerAddData.unsignedCustomerAddData);
        const followUpHeadColumns = this.renderFollowUpHead();
        const allProductDataHeadColumns = this.renderAllProductDataHead();
        const tomorrowPlanHeadColumns = this.renderTomorrowPlanHead();
        const totalValues:any[] = [];
        data.totalCount.list.map(item => {
            if(item.status === 1){
                totalValues.push(item.method)
            }
        });

        const editorProps = {
            placeholder: '请填写内容',
            contentFormat: 'html',
            initialContent: '',
            height: 150,
            media: {
                // allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
                image: false, // 开启图片插入功能
                video: false, // 开启视频插入功能
                audio: false, // 开启音频插入功能
                //uploadFn: uploadFn, // 指定上传函数
                //validateFn: validateFn, //指定图片大小校验函数
                // 如果以上三个值皆为false，则不允许插入任何外部媒体，也不会显示插入外部媒体的入口
                externalMedias: {
                    image: false,
                    audio: false,
                    video: false
                }
            },
            colors: [
                '#FFFFFF', '#000000', '#999999', '#666666', '#dd3333', '#FF6600', '#22baa0', '#3366cc',
            ],
            controls: [
                'undo', 'font-size', 'text-color', 'bold',
            ],
        }
        return <div className='crm-work-report-template-submit-container'><Spin spinning={this.state.loading}>
        <Modal
            title='编辑我的激活数据'
            visible={this.state.editModalVisible}
            destroyOnClose={true}
            onCancel={() => {
                this.setState({
                    editModalVisible: false,
                })
            }}
            confirmLoading={this.state.confirmLoading}
            onOk={this.editModalOnOk}
        >
            <TableUi
                dataSource={[
                    {
                        label: '签单产品',
                        value: this.state.editProduct,
                        isAll: true,
                    },
                    {
                        label: this.props.type === 'daily' ? '（本人）今日已激活合同数量' : '（本人）本周已激活合同数量',
                        value: <InputNumber
                            size='small'
                            step={1}
                            min={0}
                            precision={0}
                            onChange={(countActivitedContractNumByProduct) => {this.setState({countActivitedContractNumByProduct})}}
                            value={this.state.countActivitedContractNumByProduct}
                        />,
                        isAll: true,
                        
                    },
                    {
                        label: this.props.type === 'daily' ? '（本人）今日已激活人数' : '（本人）本周已激活人数',
                        value: <InputNumber
                            size='small'
                            step={1}
                            min={0}
                            precision={0}
                            onChange={(countActivitedPersonNumByProduct) => {this.setState({countActivitedPersonNumByProduct})}}
                            value={this.state.countActivitedPersonNumByProduct}
                        />,
                        isAll: true,
                    },
                    {
                        label: this.props.type === 'daily' ? '（本人）今日分值' : '（本人）本周分值',
                        value: <InputNumber
                            size='small'
                            step={0.1}
                            min={0}
                            precision={1}
                            onChange={(countPointByProduct) => {this.setState({countPointByProduct})}}
                            value={this.state.countPointByProduct}
                        />,
                        isAll: true,
                    },
                ]}
                colgroup={[50, 50]}
            ></TableUi>
            <div style={{
                color:'#FF6000',
                marginTop: 10,
                paddingLeft: 4,
            }}>
                <div>注：</div>
                <div>1、列表中显示的为：我的激活数据+下属团队的激活数据；</div>
                <div>2、在该弹窗中，可对我的激活数据进行编辑，下属团队的总激活数据不变；</div>
            </div>
        </Modal>
        <Form
            layout="inline"
            onSubmit={this.submit}
        >
            <Card
                style={{
                    marginBottom:10,
                }}
            >
                <div>
                    <span style={{display: 'inline-block', marginRight: 20}}>报告日期：<span>{this.props.day}</span></span>
                    <span>发送给：<span>{data.reportUser.name}（{data.reportUser.employeeNumber}）</span></span>
                    <span className='rt text-green'>
                        {this.props.type=='daily' ? '日报' : '周报'}提交截止时间：<span>
                            {this.props.type=='daily' ? this.props.day : this.getWeek(this.props.deadLineOfWeek)} {this.props.deadLine}
                        </span>
                    </span>
                </div>
            </Card>
            <Card>
                {
                    totalCountShow && data.totalCount.list && data.totalCount.list.map(item => {
                        if(item.status === 1){
                            return <TotalCount number={item.totalCount || 0} content={this.props.type=='daily' ? item.nameDay : item.nameWeek}/>
                        }
                    })
                }
                

                {
                    unsignedCustomerAddDataShow && data.unsignedCustomerAddData.unsignedCustomerAddData && <TableCard
                        title='未签约客户新增相关'
                        hasAll={false}
                        distinguish={false}
                    >
                        <Table 
                            className='ant-table-wrapper-text-center'
                            bordered
                            style={{width: unsignedCustomerAddHeadColumns.len * 120 > this.state.tableContainerWidth ? '100%' : unsignedCustomerAddHeadColumns.len * 120  + 20}}
                            dataSource={Number(data.unsignedCustomerAddData.statisticsByUserId) === 1 ? this.state.salesDate : [this.state.salesDate[this.state.salesDate.length-1]]}
                            columns={unsignedCustomerAddHeadColumns.columns as any}
                            pagination={false}
                            scroll={{
                                x: unsignedCustomerAddHeadColumns.len * 120 > this.state.tableContainerWidth ? unsignedCustomerAddHeadColumns.len * 120 : undefined,
                                y: 450,
                            }}
                        />
                    </TableCard>
                }

                {
                    followUpShow && (data.followUp || data.followUpByCustomerParam) && <TableCard
                        title='跟进相关'
                        hasAll={false}
                        distinguish={false}
                    >
                        <Table 
                            className='ant-table-wrapper-text-center'
                            bordered
                            style={{width: followUpHeadColumns.len * 120 > this.state.tableContainerWidth ? '100%' : followUpHeadColumns.len * 120 + 20}}
                            dataSource={Number(data.followUp.statisticsByUserId) === 1 ? this.state.salesDate : [this.state.salesDate[this.state.salesDate.length-1]]}
                            columns={followUpHeadColumns.columns as any}
                            pagination={false}
                            scroll={{
                                x: followUpHeadColumns.len * 120 > this.state.tableContainerWidth ? followUpHeadColumns.len * 120 : undefined,
                                y: 450,
                            }}
                        />
                    </TableCard>
                }

                {
                    allProductDataShow && data.productList && data.allProductData && <TableCard
                        title='签单相关'
                        disabled={this.props.disabled}
                        hasAll={false}
                        distinguish={false}
                        selectAll={(checked) => {
                            let obj = {};
                            this.allProductDataHeadForm.map(item => {
                                obj[item] = checked;
                            })
                            setFieldsValue(obj)
                        }}
                    >
                    <Table 
                        className='ant-table-wrapper-text-center'
                        bordered
                        style={{width: allProductDataHeadColumns.len * 140 > this.state.tableContainerWidth ? '100%' : allProductDataHeadColumns.len * 140 + 20}}
                        dataSource={this.state.products}
                        columns={allProductDataHeadColumns.columns as any}
                        pagination={false}
                        onRow={(record) => {
                            return {
                              onClick: () => {this.onClickRow(record)},       // 点击行
                              onMouseEnter: () => {},  // 鼠标移入行
                            };
                          }}
                        scroll={{
                            x: allProductDataHeadColumns.len * 140 > this.state.tableContainerWidth ? allProductDataHeadColumns.len * 140 : undefined,
                            y: 450,
                        }}
                    />
                    <div className='text-small text-error'>注：激活情况与分值目前暂时手动填写，待业绩数据与SP进行对接后，系统将自动统计</div>
                </TableCard>
                }

                {
                    workSummaryShow && data.workSummary && <TableCard
                        title={type === 'daily' ? '今日工作总结' : '本周工作总结'}
                        hasAll={false}
                        distinguish={false}
                    >
                        <div style={{
                            border: '1px solid #eee',
                            padding: this.props.submit ? 0 : 10,
                        }} className='edit-container'>
                            {
                                this.props.submit ? <BraftEditor 
                                    {...editorProps}
                                    onChange={this.todayChange}
                                /> : <span dangerouslySetInnerHTML={{ __html: this.state.workSummary }}></span>
                            }
                        </div>
                    </TableCard>
                }

                {
                    tomorrowPlanShow && data.tomorrowPlan && <TableCard
                        title={type === 'daily' ? '明日计划' : '下周计划'}
                        disabled={this.props.disabled}
                        hasAll={false}
                        distinguish={false}
                        selectAll={(checked) => {
                            let obj = {};
                            this.tomorrowPlanHeadForm.map(item => {
                                obj[item] = checked;
                            })
                            setFieldsValue(obj)
                        }}
                    >
                        <Table 
                            className='ant-table-wrapper-text-center'
                            bordered
                            dataSource={[{}]}
                            columns={tomorrowPlanHeadColumns.columns as any}
                            pagination={false}
                            scroll={{
                                x: tomorrowPlanHeadColumns.len * 120
                            }}
                        />

                    </TableCard>
                }

                {
                    tomorrowWorkPointShow && data.tomorrowWorkPoint && <TableCard
                        title={type === 'daily' ? '明日工作重点' : '下周工作重点'}
                        hasAll={false}
                        distinguish={false}
                    >
                        <div style={{
                            border: '1px solid #eee',
                            padding: this.props.submit ? 0 : 10,
                        }} className='edit-container'>
                            {
                                this.props.submit ? <BraftEditor 
                                    {...editorProps}
                                    onChange={this.tomorrowChange}
                                /> : <span dangerouslySetInnerHTML={{ __html: this.state.tomorrowWorkPoint }}></span>
                            }
                        </div>
                    </TableCard>
                }
                
                {
                    this.props.submit && <div className='text-center'>
                        <Button disabled={this.state.clickSubmit} onClick={this.submit} style={{marginRight:10}} type='primary'>提交</Button>
                        <Button disabled={this.state.clickSubmit} onClick={() => {browserHistory.goBack();}}>取消</Button>
                    </div>
                }
                {
                    // !allShow && <Alert message="同学，还未设置工作报告模板，请联系你的上级主管设置报告模板" type="warning" />
                }
            </Card>
        </Form>
        </Spin></div>
    }
}

const SubmitWorkReportTemplate = Form.create()(SubmitWorkReportTemplateForm);

export default SubmitWorkReportTemplate;