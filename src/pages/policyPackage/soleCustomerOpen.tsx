import React from 'react';
import QueueAnim from 'rc-queue-anim';
import {DOMAIN_OXT} from "../../global/global";
import { Form, Radio, Input, Select, Button, Spin, message } from 'antd';
import * as _ from 'lodash';
import '../../css/socialManagement/soleCustomerOpen'

import TableUI from '../../components/Table';
import SelectCity from '../../components/select-city/index';
import address from '../../components/select-city/address2.json';

import { fetchFn } from '../../util/fetch';
import query from '../../util/query';
import { browserHistory } from 'react-router';

const FormItem = Form.Item;

import MaterialsTable from '../../components/socialManagement/soleConsulting/materialsTable';
import EditCustomerOffer from '../../components/policyPackage/singleAccount/editCustomerOffer';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const socialInsuranceMap = {
    1:'已开户',
    2:'未开户需要开户'
}
const accumulationFundMap = {
    1:'已开户',
    2:'未开户需要开户',
    3:'未开户暂不开户'
}
const materialsMap = {
    'social2_fund2':1,
    'social2_fund1':2,
    'social2_fund3':3,
    'social1_fund3':4,
    'social1_fund2':5,
    'social1_fund1':6,
}

const materialsMapToString = {
    '1':{
        socialInsurance: 2,
        accumulationFund: 2,
    },
    '2':{
        socialInsurance: 2,
        accumulationFund: 1,
    },
    '3':{
        socialInsurance: 2,
        accumulationFund: 3,
    },
    '4':{
        socialInsurance: 1,
        accumulationFund: 3,
    },
    '5':{
        socialInsurance: 1,
        accumulationFund: 2,
    },
    '6':{
        socialInsurance: 1,
        accumulationFund: 1,
    },
}

const compare =(property)=>{
    return function(a,b){
        // 未设置index 排后面
        var value1 = a[property] ;
        var value2 = b[property] ;
        return value1 - value2;
    }
}
const TableFormItemLayout = {
    labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
};

const validatorSelectCity = (rule, value, callback, thirdCity = true) => {
    if(value === undefined) {
        return callback();
    }
    let {
        selectVal = [],
        selectName = []
    } = value;

    // 过滤undefined成员
    selectVal = selectVal.filter(item => !!item)
    selectName = selectName.filter(item => !!item)

    // thirdCity不是必选时 选择数小于2报错
    if((!thirdCity && selectName.length < 2)) {
        callback('请选择政策包');
    } else if (thirdCity && selectName.length < 3) {
        callback('请选择政策包');
    } else {
        callback()
    }
}
class SoleCustomerOpen extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state={
            loading: false,
            isShowFirst: true,
            isShowSecond: false,
            isShowThird: false,
            provinceId: undefined,
            cityId: undefined,
            areaId: undefined,
            cityName: null,
            //cityIds: null,
            socialInsuranceVal: null,
            accumulationFundVal: null,
            customerOffer: null,
            customerPrepare: null,
            forThirdData: {},
            thirdData: null,
            nextKey: 0,
        }
    }

    insuranceCitySelect:any;

    componentDidMount(){
        if(query('accountInfoId') && query('accountInfoId') != 'null'){
            fetchFn(`${DOMAIN_OXT}/apiv2_/policy/singleton/sendconsultation/resend`, {
                id: query('accountInfoId')
            })
            .then((res: any) => {
                if(res.errcode == 0){
                    const insuredType = materialsMapToString[res.data.insuredType];
                    this.setState({
                        areaId: res.data.policyId,
                        cityName: res.data.policyName,
                        //cityIds: res.data.policyIds,
                        socialInsuranceVal: insuredType.socialInsurance.toString(),
                        accumulationFundVal: insuredType.accumulationFund.toString(),
                    })
                    fetchFn(`${DOMAIN_OXT}/apiv2_/policy/singleton/areas/getPolicyIds`, {
                        areaId: res.data.policyId
                    })
                    .then((data: any) => {
                        if(data.errcode == 0){
                            this.insuranceCitySelect.setInputValue(data.data, res.data.policyName.split(' '), false);
                            this.props.form.setFieldsValue({
                                policity: {
                                    selectVal: data.data,
                                    selectName: res.data.policyName.split(' ')
                                }
                            });
                        }
                    })
                }
            });
        }
    }

    /**
     * selectCityParams
     * @param param {Object} 参数
     */
    selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
        return {
            deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder: '请选择',
            addressApi:`${DOMAIN_OXT}/apiv2_/policy/singleton/areas/getcityjson`,
            //transform:true,
            //address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 200,
            }, /* input 的样式 */
            onChange:(selectVal, selectName, code)=>{
                this.props.form.resetFields(['socialInsurance', 'accumulationFund']);
                this.setState({
                    provinceId:selectVal[0] || undefined,
                    cityId:selectVal[1] || undefined,
                    areaId:selectVal[2] || undefined,
                    socialInsuranceVal: null,
                    accumulationFundVal: null,
                    cityName: selectName.join(' '),
                    //cityIds: selectVal.join(','),
                })
            },
            onSelect:(selectVal, selectName, code)=> { /* 每层选择的回调，除了， 除了最后一层调用onChange */
                this.props.form.resetFields(['socialInsurance', 'accumulationFund']);
                this.setState({
                    provinceId:selectVal[0] || undefined,
                    cityId:selectVal[1] || undefined,
                    areaId:selectVal[2] || undefined,
                    socialInsuranceVal: null,
                    accumulationFundVal: null,
                    cityName: selectName.join(' '),
                    //cityIds: selectVal.join(','),
                })
            },
        }
    }

    formatData = (data) => {
        let materialsData = data ? data : null;
        if(Object.prototype.toString.apply(materialsData) ==="[object Object]"){
            // 客户需提供
            const offerObj = data.customerOffer||'{}';
            // 客户需准备
            const prepareObj = data.customerPrepare||'{}';

            const offerArr = _.values(_.omit(offerObj,'_op')).sort(compare('index'));
            const prepareArr = _.values(_.omit(prepareObj,'_op')).sort(compare('index'));

            this.setState({
                customerOffer: offerObj,
                customerPrepare: prepareArr,
            })
        }
    }

    EditCustomerOffer:any;

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    socialInsurance,
                    accumulationFund
                } = values;
                const categoryKey = `social${socialInsurance}_fund${accumulationFund}`;
                this.setState({
                    socialInsuranceVal: socialInsurance,
                    accumulationFundVal: accumulationFund,
                    loading: true,
                })

                fetchFn(
                    `${DOMAIN_OXT}/apiv2_/policy/singleton/sendconsultation/accountmaterial`,
                    {
                        customerId: Number(query('customerId')),//客户id
                        //customerName: query('customerName'), //企业名称
                        insuredType: materialsMap[categoryKey], //参保类型
                        policyName: this.state.cityName,
                        //policyIds: this.state.cityIds,
                        policyId: this.state.areaId, //政策包id
                    },
                )
                .then(data => {
                    if(data.errcode === 0 || data.status === 0){
                        this.setState({
                            loading: false,
                            isShowFirst: false,
                            isShowSecond: true,
                            nextKey: this.state.nextKey + 1,
                            forThirdData: {
                                customerOffer: data.data.customerOffer,
                                customerPrepare: data.data.customerPrepare,
                                //customerEmail: data.data.customerEmail
                            }
                        })
                        this.formatData(data.data);
                        document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link')[0].innerHTML = `请审阅以下邮件内容，确定后将发送给：${query('customerName')}`;
                        window.scrollTo(0,0);
                    }else{
                        this.setState({
                            loading: false,
                        })
                    }
                });
            }
        });
    }

    goSecond = () => {
        this.setState({
            isShowFirst: false,
            isShowSecond: true,
            isShowThird: false,
        })
    }

    goFirst = () => {
        this.setState({
            isShowFirst: true,
            isShowSecond: false,
            socialInsuranceVal: null,
            accumulationFundVal: null,
            nextKey: this.state.nextKey + 1,
            customerOffer: null,
            customerPrepare: null,
        })
        this.insuranceCitySelect.setInputValue([], [], false);
        this.props.form.resetFields(['policity']);
        document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link')[0].innerHTML = '客户开户情况';
        window.scrollTo(0,0);
    }

    goThird = () => {
        const {
            socialInsuranceVal,
            accumulationFundVal
        } = this.state;
        const categoryKey = `social${socialInsuranceVal}_fund${accumulationFundVal}`;
        this.setState({
            loading: true,
        })

        fetchFn(
            `${DOMAIN_OXT}/apiv2_/policy/singleton/sendconsultation/preview`,
            {
                singletonId: Number(query('listId')),
                customerId: Number(query('customerId')),//客户id
                //customerName: query('customerName'), //企业名称
                socialInfoId: Number(query('socialInfoId')),//社保信息ID
                //customerEmail: this.state.forThirdData.customerEmail,//客户email
                insuredType: materialsMap[categoryKey], //参保类型
                customerOffer: JSON.stringify(this.state.forThirdData.customerOffer),
                customerPrepare: JSON.stringify(this.state.forThirdData.customerPrepare),
                policyName: this.state.cityName,
                //policyIds: this.state.cityIds,
                policyId: this.state.areaId, //政策包id
                id: query('accountInfoId') && query('accountInfoId') != 'null' ? query('accountInfoId') : null,
            },
        )
        .then(data => {
            if(data.errcode === 0 || data.status === 0){
                this.setState({
                    loading: false,
                    isShowFirst: false,
                    isShowSecond: false,
                    isShowThird: true,
                    thirdData: data.data
                })

                document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link')[0].innerHTML = `预览email内容`;
                window.scrollTo(0,0);
            }else{
                this.setState({
                    loading: false,
                })
            }
        });
    }

    sendMailHandle = () => {
        const {
            thirdData
        } = this.state;
        this.setState({
            loading: true,
        })
        
        fetchFn(
            `${DOMAIN_OXT}/apiv2_/policy/singleton/send/email`,{
                id: thirdData.id,
                customerName: query('customerName')
            },
        )
        .then(data => {
            if(data.errcode === 0 || data.status === 0){

                fetchFn(
                    `${DOMAIN_OXT}/apiv2_/policy/singleton/sendconsultation/changestatus2build`,{id: thirdData.id,},
                )
                .then(data => {
                    if(data.errcode === 0 || data.status === 0){
                        this.setState({
                            loading: false,
                        })
        
                        window.location.href = `${DOMAIN_OXT}/newadmin/social/solemanagement`;
                    }else{
                        this.setState({
                            loading: false,
                        })
                    }
                });
            }else{
                this.setState({
                    loading: false,
                })
            }
        });
    }

    render(){
        const {
            loading,
            isShowFirst,
            isShowSecond,
            isShowThird,
            cityName,
            //cityIds,
            socialInsuranceVal,
            accumulationFundVal,
        } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const { getFieldDecorator, getFieldsError } = this.props.form;

        return <QueueAnim>
        <Spin spinning={loading}>
        <div className='sole-customer-open-cnt'>
        {isShowFirst ?
            <div>
            <Form onSubmit={this.handleSubmit}>
                <div className="sole-card">
                    <div className="sole-card-title">
                        <span>请选择客户开户情况</span>
                    </div>
                    <FormItem
                        {...formItemLayout}
                        required={true}
                        label='客户对应政策包'
                    >
                        {getFieldDecorator('policity', {
                            rules: [{
                                validator: (rule, value, callback) => validatorSelectCity(rule, value, callback, true)
                            }],
                            initialValue: ''
                        })(
                            <SelectCity params={this.selectCityParams(undefined)} ref={node => this.insuranceCitySelect = node} />
                            
                        )}
                    </FormItem>
                </div>

                <div className="sole-card">
                    <div className="sole-card-title">
                        <span>社保账户情况与诉求</span>
                    </div>
                    <FormItem
                        {...formItemLayout}
                        label='社保账户'
                    >
                        {getFieldDecorator('socialInsurance', {
                            rules: [{
                                required: true,
                                message: '请选择社保账户情况与诉求',
                            }],
                            initialValue: socialInsuranceVal
                        })(
                            <Radio.Group
                                size={'small'}
                                style={{ display: 'inline-block' }}
                                //onChange={(e) => { this.radioSignTypeChange(e.target.value) }}
                            >
                                <Radio value="1">已开户</Radio>
                                <Radio value="2">未开户需要开户</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </div>

                <div className="sole-card">
                    <div className="sole-card-title">
                        <span>公积金账户情况与诉求</span>
                    </div>
                    <FormItem
                        {...formItemLayout}
                        label='公积金账户'
                    >
                        {getFieldDecorator('accumulationFund', {
                            rules: [{
                                required: true,
                                message: '请选择公积金账户情况与诉求',
                            }],
                            initialValue: accumulationFundVal
                        })(
                            <Radio.Group
                                size={'small'}
                                style={{ display: 'inline-block' }}
                                //onChange={(e) => { this.radioSignTypeChange(e.target.value) }}
                            >
                                <Radio value="1">已开户</Radio>
                                <Radio value="2">未开户需要开户</Radio>
                                <Radio value="3">未开户暂不开户</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        colon={false}
                        label=' '
                    >
                        <Button
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError())}
                            type="primary"
                        >
                            下一步
                        </Button>
                    </FormItem>
                </div>
            </Form>
            </div>
             : ''}
            {isShowSecond ?
            <div>
                <h2>单立户客户征询函</h2>

                <p className="second-info">参保地：{cityName} 社保账户：{socialInsuranceMap[socialInsuranceVal]} 公积金账户：{accumulationFundMap[accumulationFundVal]}</p>

                <h5 className="sub-title">1、填写电子申报相关信息</h5>

                {this.state.customerOffer && <EditCustomerOffer key={this.state.nextKey} data={this.state.customerOffer} type={2} ref={node => this.EditCustomerOffer = node }></EditCustomerOffer>}

                <h5 className="sub-title">2、尽快准备好以下材料<span style={{'color': '#f60'}}>（请务必按照现场办理要求进行准备）：</span></h5>

                <MaterialsTable isEmail={false} customerPrepare={this.state.customerPrepare} />

                <Button type="primary" onClick={this.goThird}>预览email内容</Button>
                <Button style={{'margin-left': '30px'}} onClick={this.goFirst}>上一步</Button>
            </div>
            : ''}

            {isShowThird ?
            <div className="sole-emial-info">
                <h3>单立户开户征询函【重要】 </h3>
                <table>
                    <tbody>
                        <tr>
                            <td className="sole-emial-td">
                                <em>亲，</em>
                                <p>感谢您选择金柚网的社保管理服务。后续金柚网的社保管家将会与您取得联系，请保持手机畅通。</p>
                                <p>
                                    根据之前的沟通，<strong>所在参保地：</strong>{cityName} <strong>社保账户：</strong>{socialInsuranceMap[socialInsuranceVal]} <strong>公积金账户：</strong>{accumulationFundMap[accumulationFundVal]}
                                    <br/>现在您需要：
                                </p>

                                <h5 className="sub-title">1、填写电子申报相关信息</h5>
                                <span>
                                    <a className="link-to" href={`${DOMAIN_OXT}/authority/${this.state.thirdData.id}?customerName=${query('customerName')}`} target="_blank">立即填写</a>
                                    {/* <span style={{'color': '#BCBCBC'}}>若点击没有反应可以直接复制链接：<br/>{DOMAIN_OXT}/authority/{this.state.thirdData.id}</span> */}
                                </span>    
                                <h5 className="sub-title">2、尽快准备好以下材料<span style={{'color': '#f60'}}>（请务必按照现场办理要求进行准备）：</span></h5>
                                <MaterialsTable isEmail={true} customerPrepare={this.state.customerPrepare} />
                                <p>
                                    再次感谢您对金柚网的信赖和选择。<br/>
                                    金柚网将致力于提高您的用户体验，努力为您的选择提供更高的品质服务。<br/>
                                    祝您事业蒸蒸日上。
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="email-foot">
                    有任何问题，欢迎您随时：
                    <br/> 1. 发email给<a href="mailto:service@joyowo.com">service@joyowo.com</a>
                    <br/> 2. 致电客服电话：<span style={{'color': '#22BAA0'}}>400-005-7107</span>
                </div>

                <Button type="primary" onClick={this.sendMailHandle}>确定并发送email给客户</Button>
                <Button style={{'margin-left': '30px'}} onClick={this.goSecond}>上一步</Button>
            </div>
            : ''}
        </div>
        </Spin>
        </QueueAnim>
    }
}
const SoleCustomerOpenForm = Form.create()(SoleCustomerOpen);

export default SoleCustomerOpenForm;