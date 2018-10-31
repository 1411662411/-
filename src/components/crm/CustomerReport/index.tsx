import React from 'react'
import { Modal, Form, Radio, Select, Input, Button, Tag, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form';

import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';
import { Organizations } from '../../common/organizationsUi';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option, OptGroup } = Select;

import avaterImg from '../../../images/avater-03.png'
import './style.less'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

interface UserFormProps extends FormComponentProps {
    visible: boolean;
    toggleReportVisible: Function;
    auditDidSuccessCallback: Function;
    modalNumber: number;
    resItem: any;
    isReject: boolean;
}
class CustomerReport extends React.Component<UserFormProps, any>{
    constructor(props: UserFormProps) {
        super(props)
        this.state = {
            isShowSign: false,
            queryOrganizationsAndUsers: null,
            customerdatas: null,
            notDivideReportHandlerList: null,
            getOrganizationByPosition: null,
            chageUsers: null,
            tags: [],
            reportUserName: '',
            radioSignType: '',
            iconLoading: false
        }
    }

    componentWillMount(){
        if(this.props.visible && this.props.resItem){
            fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/organization/queryOrganizationsAndUsers`, {})
            .then(data => {
                this.setState({
                    queryOrganizationsAndUsers: data
                })
            });
            fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/organization/getOrganizationByPosition`, {})
            .then(data => {
                this.setState({
                    getOrganizationByPosition: data
                })
            });
            fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/customer/getCustomerdatas`, {customerId: this.props.resItem.customerId})
            .then((res:any) => {
                let cityId = res.data.cityId;
                this.setState({
                    customerdatas: res.data
                })
                fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/customerReport/notDivideReportHandlerList`, {cityId: cityId})
                .then(data => {
                    this.setState({
                        notDivideReportHandlerList: data,
                        chageUsers: data
                    })
                });
            });
        }
    }

    arryToString(values){
        let tempArr:any = [];
        values.map((value, index) => {
            tempArr.push(value.id);
        })
        return tempArr.join(',');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.reportType == 2 && !this.state.radioSignType){
                    message.error('请选择签约类型');
                    return false;
                }
                this.setState({
                    iconLoading: true
                })
                fetchFn(
                    `${DOMAIN_OXT}/apiv2_/crm/api/module/customerReport/startUpReport`,
                    {
                        customerId: this.props.resItem.customerId ? this.props.resItem.customerId : '',//客户id
                        cName: this.state.customerdatas.cName, //企业名称
                        customerAddress: `${this.state.customerdatas.provinceName}${this.state.customerdatas.cityName}`, //客户所在地
                        provinceId: this.state.customerdatas.provinceId,
                        cityId: this.state.customerdatas.cityId,
                        reportType: values.reportType, //报备类型
                        signingType: this.state.radioSignType, //签约类型
                        reportUserId: values.reportTo, //报备对象id
                        reportUserName: this.state.reportUserName, //报备对象name
                        carboncopyUserId: this.arryToString(this.state.tags), //抄送对象
                        reportSubmitSource: 0,//销售
                        rejectReportId: this.props.resItem.reportId ? this.props.resItem.reportId : '',//被驳回重新发起报备
                        reportReason: values.reportRemark //报备理由
                    }
                )
                .then(data => {
                    this.props.toggleReportVisible()
                    this.props.auditDidSuccessCallback()
                });
            }
        });
    }

    radioReportTypeChange(value) {
        if(Number(value) === 2){
            this.setState({
                isShowSign: true,
                chageUsers: this.state.getOrganizationByPosition
            })
        }else{
            this.setState({
                isShowSign: false,
                chageUsers: this.state.notDivideReportHandlerList
            })
        }
    }
    radioSignTypeChange(value){
        this.setState({
            radioSignType: value
        })
    }

    in_array(needle, haystack) {
        let i = 0, n = haystack.length;
      
        for (;i < n;++i)
          if (haystack[i].employeeNumber == needle.employeeNumber)
            return true;

        return false;
    }

    handleCopyToUserChange (value, option, valueMap) {
        if(valueMap[value]){
            let {id, name, employeeNumber} = valueMap[value];
            let userInfo = {
                id,
                name,
                employeeNumber
            };
            let tempData:any = this.state.tags;
            if(!this.in_array(userInfo, tempData)){
                tempData.push(userInfo)
                this.setState({
                    tags: tempData
                })
            }
        }
    }

    handleReportToUserChange(value, option, valueMap) {
        if(valueMap[value]){
            let {name} = valueMap[value];
            this.setState({
                reportUserName: name
            })
        }
    }

    handleTagClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    render() {
        if(!this.state.customerdatas || !this.state.queryOrganizationsAndUsers || !this.state.notDivideReportHandlerList){
            return false;
        }
        const {
            isShowSign,
            queryOrganizationsAndUsers,
            customerdatas,
            notDivideReportHandlerList,
            chageUsers,
            tags,
         } = this.state;
        const { getFieldDecorator, getFieldsError } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { visible } = this.props;

        return visible ? <Modal
            key={this.props.modalNumber}
            visible={visible}
            width={680}
            footer={null}
            title={'发起报备'}
            onCancel={(e) => { this.props.toggleReportVisible() }}
        >
            <Form onSubmit={this.handleSubmit}>
                <div className="report-dialog-wrap">
                    <div className="init-bg-wrap">
                        <img src={avaterImg} className="org-icon" alt="" />
                        <dl>
                            <dt>同学：</dt>
                            <dd>1. 报备时，请根据客户所在地报备给对应分公司的总经理或大区总。</dd>
                            <dd>2. 报备通过后，如果修改客户所在地的省市，或对客户进行转移、释放等操作，则报备记录会被作废，请谨慎操作。</dd>
                        </dl>
                        {
                            this.props.isReject && <dl>
                            <dd>被驳回原因：{this.props.resItem.rejectReason}</dd>
                        </dl>
                        }
                    </div>
                    <div className="report-info-box">
                        <Form layout={'inline'}>
                            <FormItem
                                label="报备客户"
                                style={{'margin-left': 89, 'width': 320}}
                            >
                                {customerdatas.cName}
                            </FormItem>
                            <FormItem
                                label="报备给分公司："
                            >
                                {customerdatas.provinceName} {customerdatas.cityName}
                            </FormItem>
                        </Form>

                        <FormItem
                            {...formItemLayout}
                            label='报备类型'
                            style={{'margin-bottom': 0}}
                        >
                            {getFieldDecorator('reportType', {
                                rules: [{
                                    required: true,
                                    message: '请选择报备类型',
                                }],
                                initialValue: '1'
                            })(
                                <Radio.Group
                                    size={'small'}
                                    style={{ display: 'inline-block' }}
                                    onChange={(e) => { this.radioReportTypeChange(e.target.value) }}
                                >
                                    <Radio value="1">异地报备</Radio>
                                    <Radio value="2">金柚宝特价报备</Radio>
                                </Radio.Group>
                                )}
                        </FormItem>
                        {isShowSign ? 
                        <FormItem
                            {...formItemLayout}
                            label='签约类型'
                            required={true}
                            style={{'margin-bottom': 0}}
                        >
                            <Radio.Group
                                size={'small'}
                                style={{ display: 'inline-block' }}
                                onChange={(e) => { this.radioSignTypeChange(e.target.value) }}
                            >
                                <Radio value="1">新签</Radio>
                                <Radio value="3">改签</Radio>
                            </Radio.Group>
                        </FormItem>
                        : ''}
                        <FormItem
                            {...formItemLayout}
                            required={true}
                            label='报备给审批人'
                        >
                            {getFieldDecorator('reportTo', {
                                    rules: [{
                                        required: true,
                                        message: '请选择审批人',
                                    }],
                                })(
                                <Organizations
                                    needAll={false}
                                    initValue={''}
                                    onSelect={(e,option,valueMap) => this.handleReportToUserChange(e,option,valueMap)}
                                    dataSource={chageUsers.data.data ? chageUsers.data.data[0] : chageUsers.data[0]}>
                                </Organizations>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='抄送给'
                            className="copy-to"
                        >
                            <Organizations
                                needAll={false}
                                initValue={''}
                                onSelect={(e,option,valueMap) =>this.handleCopyToUserChange(e, option,valueMap)}
                                dataSource={queryOrganizationsAndUsers.data[0]}>
                            </Organizations>
                            <span>（所有报备将默认抄送给业管部的所有同事、发起人的上级主管、发起人所在分公司总经理及大区总）</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='&nbsp;'
                            className="tags-wrap"
                        >
                            <div className="selectTags">
                                {tags.map((tag, index) => {
                                const tagElem = (
                                    <Tag color="green" key={tag.employeeNumber} closable={true} afterClose={() => this.handleTagClose(tag)}>
                                    {tag.name}({tag.employeeNumber})
                                    </Tag>
                                );
                                return tagElem;
                                })}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='报备理由'
                        >
                            {getFieldDecorator('reportRemark', {
                                rules: [{
                                    required: true,
                                    message: '请选择报备理由',
                                }],
                            })(
                                <TextArea rows={4} maxLength={300} />
                                )}
                        </FormItem>
                    </div>
                    <FormItem
                        {...formItemLayout}
                        colon={false}
                        label=' '
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError())}
                            loading={this.state.iconLoading}
                        >
                            提交
                    </Button>
                        <Button
                            style={{ marginLeft: 20 }}
                            onClick={() => { this.props.toggleReportVisible() }}
                        >
                            取消
                    </Button>
                    </FormItem>
                </div>
            </Form>
        </Modal> : null
    }
}
const CustomerReportForm = Form.create()(CustomerReport);

export default CustomerReportForm