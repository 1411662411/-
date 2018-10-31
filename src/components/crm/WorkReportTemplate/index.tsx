import React from 'react';
import { Form, Card, Checkbox, Select, Table, Button, TimePicker, TreeSelect, Spin, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
const FormItem = Form.Item;
import moment from 'moment';

import { browserHistory } from 'react-router';
import { DOMAIN_OXT } from "../../../global/global";

import PartTitle from '../Title';
import TotalCount from './TotalCount';
import TableCard from './TableCard';
import WeekTime from '../common/WeekTime';

import { fetchFn } from '../../../util/fetch';

import './style.less';
import { spawn } from 'redux-saga/effects';

const ADD_API = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/add`; 
const addWorkReport =  (data) => fetchFn(ADD_API, data).then(data=>data);
const UPDATE_API = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/update`; 
const updateWorkReport =  (data) => fetchFn(UPDATE_API, data).then(data=>data);

interface WorkReportTemplateFormProps extends FormComponentProps{
    type: 'daily' | 'weekly';
    totalCount?: any;
    unsignedCustomerAddHead?: any[];
    company?: any[];
    position: any[];
    getPosition?: (id) => void;
    data?: any;
    idData?: any;
    id?: any;
    positionId?: any;
    positionName?: any;
    organizationId?: any;
    organizationName?: any;
    disabled: boolean | undefined;
    deadLine?: string;
    deadLineOfWeek?: number;
}

class WorkReportTemplateForm extends React.Component<WorkReportTemplateFormProps,any>{
    constructor(props:WorkReportTemplateFormProps){
        super(props)
        let error:boolean = false;
        let tableContainerWidth: any = 0;
        try {
            tableContainerWidth = document.querySelectorAll('.static-breadcrumb.ant-breadcrumb')[0].clientWidth - 32*2 - 24*2; //获取可视范围表格最长宽度
        } catch (err) {
            error = true;
        }
        this.state={
            intentionCustomer:[
                {
                    title: '未签约客户新增',
                    render:() => '客户数'
                },
            ],
            positionId: undefined,
            follow:[],
            loading: false,
            signMonad:[],
            unsignedCustomerAddHeadLength: 0,

            disabled: true,

            tableContainerWidth,
            error,
            
            cannelVisible: false,
        }
    }
    unsignedCustomerAddHeadForm:any[] = [];
    renderDynamicColumns = (data, key, forms, custom={children:'customerParamList', group: this.props.type === 'daily' ? 'nameDay' : 'nameWeek' , title: 'parameterName', name: 'method', value: 'status'}, name='name') =>{
        let columns:any[] = [];
        // let values = new Set(data[custom.value] && data[custom.value].split(','));
        data.map(item => {
            // console.log(item);
            if(item[custom.children]){
                let nameAttr = item[custom.name];
                let obj = this.renderDynamicColumns(item[custom.children], key, forms, custom, `${nameAttr}-${item[custom.group]}`);
                key = obj.key;
                columns.push(
                    {
                        title: item[custom.group],

                        key: item[custom.group],
                        children: obj.columns,
                    }
                )
            }else{
                columns.push({
                    title: item[custom.title],
                    key: item[custom.title],
                    width: 120,
                    render: (data) => this.renderCheckbox(`${name}-${item.id}`, item[custom.value] === 1)
                })
                forms.push(`${name}-${item.id}`);
                key++;
            }
        })
        return {columns,key};
    }

    renderCheckbox = (name, value:boolean, disabled=false, child?) => {
        const { getFieldDecorator } = this.props.form;
        return <FormItem
        >
        {getFieldDecorator(name, {
            valuePropName: 'checked',
            initialValue: value,
        })(
            <Checkbox disabled = {this.props.disabled || disabled}>
                {child && child}
            </Checkbox>
        )}
        </FormItem>
    }

    disabledHours = () => {
        let disabledHours:number[] = [];
        for(let i = 0; i < 17; i++ ){
            disabledHours.push(i);
        }
        return disabledHours;
    }

    submit = () => {
        this.props.form.validateFieldsAndScroll(async(err, values) => {
            if(!err){
                // console.log(values);
                this.setState({loading: true});
                let {data} = this.props;
                let unsignedCustomerAddData = data.unsignedCustomerAddData.unsignedCustomerAddData;
                let followUpByCustomerParam = data.followUpByCustomerParam.customerRelationParamsForFollowUp;
                for(let key in values){
                    let item = values[key];
                    let keys = key.split('-');
                    if(keys[0] === unsignedCustomerAddData.customerInsuredNumberOfNewUnsign.method){
                        (Object as any).values(unsignedCustomerAddData).map( obj => {
                            if(obj.nameDay === keys[1])
                                obj.customerParamList.map(o => {
                                    if(Number(keys[2]) === Number(o.id))
                                    o.status = item ? 1 : 0;
                            })
                        })
                    }
                    (Object as any).values(followUpByCustomerParam).map( obj => {
                        if(keys[0] === obj.method && obj.nameDay === keys[1])
                            obj.customerParamList.map(o => {
                                if(Number(keys[2]) === Number(o.id))
                                o.status = item ? 1 : 0;
                        })
                    })
                }
                let total = new Set(values.totalCount);
                data.totalCount.list.map(item => {
                    item.status = total.has(item.method) ? 1 : 0;
                })
                data.productList.map(item => {
                    item.status = values[item.name] ? 1 : 0;
                })
                data.followUp.list.map(item => {
                    item.status = values[item.method] ? 1: 0;
                })
                data.tomorrowPlan.list.map(item => {
                    item.status = values[item.method] ? 1: 0;
                })
                data.tomorrowWorkPoint.list.map(item => {
                    item.status = values[item.method] ? 1: 0;
                })
                data.workSummary.list.map(item => {
                    item.status = values[item.method] ? 1: 0;
                })
                // console.log(data);
                // const positionId:any = [];
                // values.positionName.map(item => {
                //     positionId.push(this.props.position.filter(position => position.dictName === item)[0].code) 
                // })
                // console.log(values);
                // console.log(this.props.type, values.remindTime.week, '**', values);
                // return ;
                let res:any ;
                if(this.props.id){
                    res = await updateWorkReport({
                        type: 0,
                        positionId: this.props.positionId,
                        organizationId: this.props.organizationId,
                        reportType: this.props.type === 'daily' ? 1 : 2,
                        richTextContent: JSON.stringify(data),
                        id: this.props.id,
                        deadLine: this.props.type === 'daily' ? values.remindTime.format('HH:mm') : values.remindTime.time.format('HH:mm'),
                        deadLineOfWeek: this.props.type === 'daily' ? undefined : values.remindTime.week,
                    })
                }else{
                    res = await addWorkReport({
                        type: 0,
                        positionId: values.positionId.join(','),
                        organizationId: values.organizationId,
                        reportType: this.props.type === 'daily' ? 1 : 2,
                        content: JSON.stringify(data),
                        deadLine: this.props.type === 'daily' ? values.remindTime.format('HH:mm') : values.remindTime.time.format('HH:mm'),
                        deadLineOfWeek: this.props.type === 'daily' ? undefined : values.remindTime.week,
                    })
                }
                if(res.status === 0){
                    message.success('保存成功', 1.5, () => {
                        browserHistory.push(`${DOMAIN_OXT}/newadmin/crm/customermanagement/workreportconfig`)
                    })
                }else{
                    this.setState({loading: false});
                }
            }
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
        const dynamicColumns = this.renderDynamicColumns((Object as any).values(data), 1, this.unsignedCustomerAddHeadForm);
        columns = [...columns, ...dynamicColumns.columns];
        return {columns, len: dynamicColumns.key};
    }
    followUpHeadForm:any[]=[];
    renderFollowUpHead(){
        const {data} = this.props;
        const { followUp, followUpByCustomerParam } = data;
        let columns:any[] = [];
        // let values = new Set(followUp.values ? followUp.values.split(',') : [])
        followUp.list.map(item => {
            columns.push({
                title: this.props.type === 'daily' ? item.nameDay : item.nameWeek,
                key: this.props.type === 'daily' ? item.nameDay : item.nameWeek,
                width: 120,
                fixed: 'left',
                render: (data) => this.renderCheckbox(item.method, Number(item.status) === 1)
            })
            this.followUpHeadForm.push(`${item.method}`);
        })
        const dynamicColumns = this.renderDynamicColumns((Object as any).values(followUpByCustomerParam.customerRelationParamsForFollowUp), followUp.list.length, this.followUpHeadForm);
        columns = [...columns, ...dynamicColumns.columns];
        return {columns, len: dynamicColumns.key};
    }
    allProductDataHeadForm:any[]=[];
    renderAllProductDataHead(){
        const {data} = this.props;
        const { allProductData, productList } = data;
        let columns:any[] = [
            {
                title: '签单产品',
                key:'checkbox',
                colSpan:0,
                width: 40,
                fixed: 'left',
                render:(data) => this.renderCheckbox(data.name, data.status === 1)
            },{
                title: '签单产品',
                key:'签单产品',
                dataIndex: 'name',
                width: 200,
                fixed: 'left',
                colSpan:2,
            }];
        // let values = new Set(allProductData.values ? allProductData.values.split(',') : [])
        allProductData.list.map(item => {
            columns.push({
                title: this.props.type === 'daily' ? item.nameDay : item.nameWeek,
                key: this.props.type === 'daily' ? item.nameDay : item.nameWeek,
                width: 150,
                render: (data) => this.renderCheckbox(data.name, data.status === 1, true)
            })
        })
        productList.map(item => {
            this.allProductDataHeadForm.push(`${item.name}`);
        })
        return {columns, len: allProductData.list.length + 2};
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
                render: (data) => this.renderCheckbox(item.method, item.status === 1)
            })
            this.tomorrowPlanHeadForm.push(item.method);
        })
        return {columns, len: tomorrowPlan.list.length};
    }

    componentDidMount(){
        if(this.state.error){
            let tableContainerWidth = document.querySelectorAll('.static-breadcrumb.ant-breadcrumb')[0].clientWidth - 32*2 - 24*2; //获取可视范围表格最长宽度
            this.setState({
                tableContainerWidth,
                error: false,
            })
        }
    }

    onCompanyChange(value){
        this.props.form.setFieldsValue({'positionId': undefined});
        if(value){
            this.props.getPosition && this.props.getPosition(value);
        }
    }

    render(){
        const { form, type, totalCount, data } = this.props;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, setFieldsValue } = form;
        const formItemLayout={
            labelCol: {
                xs: {span:0},
            },
            wrapperCol: {
            xs: { span: 24 },
            },
        }

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
        // console.log(data, totalValues);
        return <div className='crm-work-report-template-container'><Spin spinning={this.state.loading}>
        <Form
            layout="inline"
            onSubmit={this.submit}
        >
            <Card
                style={{
                    marginBottom:10,
                }}
            >
                {
                    this.props.id && <FormItem
                            label='适用分公司'
                        >
                        {this.props.organizationName}
                    </FormItem>
                }
                {
                    !this.props.id && <FormItem
                    >
                    {getFieldDecorator('organizationId', {
                        rules: [{ required: true, message: '请选择适用分公司' }],
                        initialValue: this.props.organizationId
                    })(
                        <TreeSelect
                            placeholder='选择适用分公司'
                            style={{width: 180}}
                            treeData={this.props.company || []} 
                            onChange={(value) => {
                                this.onCompanyChange(value)
                            }}
                        >
                        </TreeSelect>
                    )}
                    </FormItem>
                }
                {
                    this.props.id && <FormItem
                            label='适用职位'
                        >
                        {this.props.positionName}
                    </FormItem>
                }
                
                {
                    !this.props.id && <FormItem
                    >
                    {getFieldDecorator('positionId', {
                        rules: [{ required: true, message: '请选择适用职位',}],
                        initialValue: this.props.positionId
                    })(
                        <Select
                            placeholder='选择适用职位'
                            style={{width: 400}}
                            mode="multiple"
                        >
                            {this.props.position && this.props.position.map(item => <Select.Option value={item.code}>{item.dictName}</Select.Option>)}
                        </Select>
                    )}
                    </FormItem>
                }
            </Card>
            <Card>
                {
                    <PartTitle 
                        title='选择需要统计的信息'
                    />
                }
                {
                    <FormItem
                    >
                    {getFieldDecorator('totalCount', {
                        rules: [{ 
                            validator: (rule, value, callback) => {
                                callback()
                            }
                        }],
                        initialValue: totalValues ? totalValues : undefined,
                    })(
                        <TotalCount 
                            disabled={this.props.disabled}
                            dataSource={data.totalCount.list || []}
                            custom={{title: type === 'daily' ? 'nameDay' : 'nameWeek',value: 'method'}}
                            onClick={(current, active, values) => {
                                // console.log(current, active, values)
                            }}
                        />
                    )}
                    </FormItem>
                }
                {
                    data.unsignedCustomerAddData.unsignedCustomerAddData && <TableCard
                        title='未签约客户新增相关'
                        selectAll={(checked) => {
                            let obj = {};
                            this.unsignedCustomerAddHeadForm.map(item => {
                                obj[item] = checked;
                            })
                            setFieldsValue(obj)
                        }}
                        disabled={this.props.disabled}
                        selectDistinguish={(checked) => {
                            this.props.data.unsignedCustomerAddData.statisticsByUserId = checked ? 1 : 0;
                        }}
                        distinguishChecked={Number(this.props.data.unsignedCustomerAddData.statisticsByUserId) === 1}
                    >
                        <Table 
                            className='ant-table-wrapper-text-center'
                            bordered
                            dataSource={[{}]}
                            columns={unsignedCustomerAddHeadColumns.columns as any}
                            pagination={false}
                            scroll={{
                                x: unsignedCustomerAddHeadColumns.len * 120
                            }}
                        />
                    </TableCard>
                }
                

                <TableCard
                    title='跟进相关'
                    disabled={this.props.disabled}
                    selectAll={(checked) => {
                        let obj = {};
                        this.followUpHeadForm.map(item => {
                            obj[item] = checked;
                        })
                        setFieldsValue(obj)
                    }}
                    selectDistinguish={(checked) => {
                        this.props.data.followUp.statisticsByUserId = checked ? 1 : 0;
                        this.props.data.followUpByCustomerParam.statisticsByUserId = checked ? 1 : 0;
                    }}
                    distinguishChecked={Number(this.props.data.followUpByCustomerParam.statisticsByUserId) === 1}
                >
                    <Table 
                        className='ant-table-wrapper-text-center'
                        bordered
                        dataSource={[{}]}
                        columns={followUpHeadColumns.columns as any}
                        pagination={false}
                        scroll={{
                            x: followUpHeadColumns.len * 120
                        }}
                    />
                </TableCard>

                <TableCard
                    title='签单相关'
                    disabled={this.props.disabled}
                    distinguish={false}
                    selectAll={(checked) => {
                        let obj = {};
                        this.allProductDataHeadForm.map(item => {
                            obj[item] = checked;
                        })
                        setFieldsValue(obj)
                    }}
                >
                    {!this.state.error && <Table 
                        className='ant-table-wrapper-text-center'
                        bordered
                        style={{
                            width: this.state.tableContainerWidth > allProductDataHeadColumns.len * 150 - 60 ? allProductDataHeadColumns.len * 150 - 60 : '100%'
                        }}
                        dataSource={this.props.data.productList}
                        columns={allProductDataHeadColumns.columns as any}
                        pagination={false}
                        scroll={{
                            x: allProductDataHeadColumns.len * 150 - 60
                        }}
                    />}
                    <div className='text-small text-error'>注：激活情况与分值目前暂时手动填写，待业绩数据与SP进行对接后，系统将自动统计</div>
                </TableCard>

                <PartTitle 
                    title='选择需要填写的信息'
                />   

                <div>
                    <FormItem>
                        {getFieldDecorator(this.props.data.workSummary.list[0].method, {
                            rules: [{ 
                                validator:(rule, value, callback) =>{
                                    callback();
                                },
                            }],
                            valuePropName: 'checked',
                            initialValue: this.props.data.workSummary.list[0].status === 1 ? true : false,
                        })(
                            <Checkbox
                                disabled={this.props.disabled || false}
                            >
                            {
                                type === 'daily' ? this.props.data.workSummary.list[0].nameDay : this.props.data.workSummary.list[0].nameWeek
                            }
                            </Checkbox>
                        )}
                    </FormItem>
                </div>

                <TableCard
                    title={type === 'daily' ? '明日计划' : '下周计划'}
                    disabled={this.props.disabled}
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

                <div>
                    <FormItem>
                        {getFieldDecorator(this.props.data.tomorrowWorkPoint.list[0].method, {
                            rules: [{ 
                                validator:(rule, value, callback) =>{
                                    callback();
                                },
                            }],
                            valuePropName: 'checked',
                            initialValue: this.props.data.tomorrowWorkPoint.list[0].status === 1 ? true : false,
                        })(
                            <Checkbox
                                disabled={this.props.disabled || false}
                            >
                            {
                                type === 'daily' ? this.props.data.tomorrowWorkPoint.list[0].nameDay : this.props.data.tomorrowWorkPoint.list[0].nameWeek
                            }
                            </Checkbox>
                        )}
                    </FormItem>
                </div>

                <PartTitle 
                    title='选择提交截止时间'
                />  
                {
                    type === 'daily' ? <div>
                        <FormItem
                            label='日报的截止时间为每天的'
                        >
                            {getFieldDecorator('remindTime', {
                                rules: [{ 
                                    validator:(rule, value, callback) =>{
                                        if(!value || value == ''){
                                            callback(`请选择截止时间`);
                                        }else{
                                            callback();
                                        }
                                    },
                                }],
                                validateFirst: true,
                                initialValue: moment(this.props.deadLine || '23:59', 'HH:mm'),
                            })(
                                <TimePicker 
                                    style={{width: 150}}
                                    size='small'
                                    disabled={this.props.disabled}
                                    hideDisabledOptions
                                    format={'HH:mm'}
                                    // onChange={(q,w)=>{console.log(q,w)}}
                                    disabledHours={this.disabledHours}
                                    minuteStep={1}
                                    placeholder={'请选择截止时间'}
                                />
                            )}
                        </FormItem>
                        
                    </div> : <div>
                    <FormItem
                        label='周报的截止时间为每周的'
                    >
                        {getFieldDecorator('remindTime', {
                            rules: [{ 
                                validator:(rule, value, callback) =>{
                                    if(!value || value == ''){
                                        callback(`请选择截止时间`);
                                    }else{
                                        callback();
                                    }
                                },
                            }],
                            validateFirst: true,
                            initialValue: {time: moment(this.props.deadLine || '23:59' ,'HH:mm'), week: this.props.deadLineOfWeek || 7},
                        })(
                            <WeekTime 
                                size='small'
                                disabled={this.props.disabled}
                                weeks={[5,6,7]}
                                minuteStep={1}
                                disabledHours={this.disabledHours}
                                hideDisabledOptions
                                placeholder='请选择截至时间'
                            />
                        )}
                    </FormItem>
                </div>
                }
                {!this.props.disabled && <div className='text-center'>
                    <Button
                        onClick={this.submit}
                        style={{marginRight:10}} type='primary'>保存</Button>
                    <span
                        style={{
                            position:'relative',
                        }}
                    >
                    <Button
                        onClick={() => {
                            Modal.confirm({
                                title: '提示',
                                content: '当前模板未保存，是否确定退出',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: () =>{
                                    browserHistory.push(`${DOMAIN_OXT}/newadmin/crm/customermanagement/workreportconfig`)
                                }
                              });
                        }}
                    >取消</Button>
                    {this.props.id && <span style={{position:'absolute', left:70, top: 0, width: 240}} className='text-small'>编辑后的工作报告模板将在{this.props.type === 'daily' ? '明天' : '下周'}生效</span>}
                    </span>
                </div>}
            </Card>
        </Form>
        </Spin></div>
    }
}

const WorkReportTemplate = Form.create()(WorkReportTemplateForm);

export default WorkReportTemplate;