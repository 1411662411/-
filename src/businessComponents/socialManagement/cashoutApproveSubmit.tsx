import * as React from 'react';
import { browserHistory, Link } from 'react-router';
import { ROUTER_PATH, WSS, DOMAIN_OXT } from '../../global/global';
import {
    connect,
} from 'react-redux';
import * as moment from 'moment';
import * as Immutable from 'immutable'
import { eachUpdateIn } from '../../util/immutableUtil';
import { formatMoney } from '../../util/util';
import bankType from '../../components/selectBankType/bankType.json';
// import { CreateWebSocket } from '../../util/createWebsocket';
import {
    accAdd,
} from '../../util/math';
import {
    Tabs,
    Form,
    Input,
    Card,
    Button,
    Cascader,
    Row,
    notification,
    message,
    Modal,
    Alert,
} from 'antd';
import * as columns from '../../components/common/columns/index';
import {
    uploading,
    getRecipientSelectSource,
    getPaymentschedule,
    getAdvancedetails,
    getPaymentbill,
    recipientsourceloading,
    getApproved,
    submitApprove,
    deleteUploadRecord,
    exceptionModal,
    submitfetching,
} from '../../action/businessComponents/cashoutApproveSubmitAction';
import {
    SocialInfo,
    RecipientInfo,
    Paymentschedule,
    Paymentbill,
    CashoutApproveRecords,
} from '../../components/common/cashoutApproveUi';
const TextArea = Input.TextArea;
// import createWebsocket, { CreateWebSocket } from '../../util/createWebsocket';
import CreatePoll, { CreatePollInterface } from '../../util/createPoll';
const TabPane = Tabs.TabPane;
const bankTypeData = bankType.data
/**
 * 上次任务轮询 API
 */
const pollApi = `${DOMAIN_OXT}/apiv4_/v1/sppayu/schedule/get`;




interface TStateProps {
    task: { /* 上传文件的任务标识 */
        task1: boolean,
        task2: boolean,
        task3: boolean,
        toJS(): any;
        get(params): any;
    },
    recipientSourceLoading: boolean;
    paymentscheduleDataSource: any;
    advancedetailsDataSource: any;
    paymentbillDataSource: any;
    paymentscheduleTotal: any;
    paymentbillTotal: any;
    paymentbillFetching: boolean;
    advancedetailsFetching: boolean;
    paymentscheduleFetching: boolean;
    advancedetailsTotal: any;
    // paymentscheduleTotal: number | string | object;
    // paymentbillTotal: number | string | object;
    // advancedetailsTotal: number | string | object;
    recipientSelectSource: any;
    approvalPersonSource: any;
    userInfo?: any;
    submitFetching?: boolean;
    exceptionModal?: any;
    
}
interface TOwnProps {
    resubmit?: boolean;
    orderCode?: number | string;
    defaultValue?: any;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type CashoutApproveSubmitProps = TStateProps & TOwnProps & TDispatchProps;


interface polls {
    poll1?: CreatePollInterface;
    poll2?: CreatePollInterface;
    poll3?: CreatePollInterface;
}

class CashoutApproveSubmit extends React.Component<CashoutApproveSubmitProps, any> {
    /**
     * wss长连接对象
     */
    // private wss: wss = {}
    // wss1Timer;
    // wss2Timer;
    // wss3Timer;


    /**
     * poll 轮询
     */
    private polls: polls = {}
    constructor(props) {
        super(props);
        const initialState = {
            params: Immutable.fromJS({
                socialMonth: '', /* 社保缴费月（操作月）*/
                socialNature: '', /* 社保请款性质 */
                recipientType: '', /* 收款方类型 */
                recipientName: '', /* 收款方名称 */
                deadline: '', /* 本次请款付款截止时间 */
                billStatus: 1, /* 付款清单（客户维度）的状态 */
                remark: '', /* 备注 */
                approvalPerson: [], /* 审批人 */
                openBank: '/',
                account: '/',
                bankType:'',
                cityName:'/',
                orderStatus: 2, /* 订单状态 */

                existNoDetail: 1, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
                noDetailAmount: 0 as number, /** 无明细款项金额 */
                noDetailRemark: '', /** 无明细款项备注*/
                total:0, /* 付款账单 总计*/
            }),
        };
        const {
            defaultValue,
            dispatch,
            resubmit
        } = this.props;
        if (resubmit) {
            this.state = {
                params: initialState.params.mergeDeep(defaultValue.params)
            }
            const recipientSelectType = Number(this.state.params.get('recipientType')) < 4 ? 'one' : 'two';
           
            dispatch(getRecipientSelectSource({ recipientSelectType }));
        }
        else {
            this.state = initialState;
        }

        /**
         * 已经取消
         */
        const orderStatus = this.state.params.get('orderStatus');
        if (orderStatus === 3) {
            dispatch(exceptionModal({
                visible: true,
                message: '该请款单已经取消',
                redirectUrl: `${ROUTER_PATH}/newadmin/social/cashout/approve/details`,
            }));
        }
        /**
         * 已经提交
         */
        else if (orderStatus === 0) {
            dispatch(exceptionModal({
                visible: true,
                message: '该订单已经重新提交',
                redirectUrl: `${ROUTER_PATH}/newadmin/social/cashout/approve/details`,
            }));
        }
    }
    componentWillMount() {
        const {
            // createWss,
            props,
            polls,
            // wss,
        } = this;
        const {
            dispatch,
            userInfo,
            orderCode,
        } = props;
        /**
         * 提交审批人source
         */
        dispatch(getApproved({}));

        /* 付款清单（客户维度） */
        dispatch(getPaymentschedule({ type: 1, code: orderCode }));

        polls.poll1 = new CreatePoll({ url: pollApi });
        this.poll(1, { topic: 1, });


        // this.wss1Timer = setTimeout(() => {
        //     wss.wss1 = createWss(`${WSS}/ws/sppay/file/schedule?user=${userInfo.userId}&type=1`, {
        //         index: 1,
        //         title: '付款清单（客户维度）',
        //         uploading: this.uploading
        //     });
        // }, 3000)



        /* 付款账单（人月次维度明细表） */
        dispatch(getPaymentbill({ type: 3, code: orderCode }));
        polls.poll3 = new CreatePoll({ url: pollApi });
        this.poll(3, { topic: 1, });
        // this.wss2Timer = setTimeout(() => {
        //     wss.wss3 = createWss(`${WSS}/ws/sppay/file/schedule?user=${userInfo.userId}&type=3`, {
        //         index: 3,
        //         title: '付款账单（人月次维度明细表）',
        //         uploading: this.uploading
        //     });
        // }, 3000)


        /* 获取垫款明细 */
        if (this.state.params.get('billStatus') === 2) {
            dispatch(getAdvancedetails({ type: 2, code: orderCode }));
            polls.poll2 = new CreatePoll({ url: pollApi });
            this.poll(2, { topic: 1, });
            // wss.wss2 && wss.wss2.close()
            // this.wss3Timer = setTimeout(() => {
            //     wss.wss2 = createWss(`${WSS}/ws/sppay/file/schedule?user=${userInfo.userId}&type=2`, {
            //         index: 2, title: '垫款明细', uploading: this.uploading
            //     });
            // }, 3000)

        }
    }
    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        dispatch(submitfetching(false));
        dispatch(exceptionModal({
            visible: false,
        }));
        /* 销毁wss对象 */
        // const {
        //     wss1,
        //     wss2,
        //     wss3
        // } = this.wss;

        // clearTimeout(this.wss1Timer);
        // clearTimeout(this.wss2Timer);
        // clearTimeout(this.wss3Timer); 
        // wss1 && wss1.close();
        // wss2 && wss2.close();
        // wss3 && wss3.close();
    }
    // shouldComponentUpdate(nextProps = {}, nextState = {}) {
    //     const thisProps = this.props || {}, thisState = this.state || {};
    //     if (Object.keys(thisProps).length !== Object.keys(nextProps).length || Object.keys(thisState).length !== Object.keys(nextState).length) {
    //         return true;
    //     }

    //     for (const key in nextProps) {
    //         if (!Immutable.is(thisProps[key], nextProps[key])) {
    //             return true;
    //         }
    //     }

    //     for (const key in nextState) {
    //         if (thisState[key] !== nextState[key] || !Immutable.is(thisState[key], nextState[key])) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    /**
     * 对轮询业务的封装
     */
    poll = (index: number, data: any, triggerStart?: boolean) => {
        const {
            userInfo,
        } = this.props;
        const instancePoll: CreatePollInterface = this.polls[`poll${index}`];

        if (!(instancePoll instanceof CreatePoll)) {
            throw new Error(`没有实例化轮询对象 $poll{index}`);
        }

        const {
            guid,
            code,
        } = data;
        delete data.guid;
        delete data.code;
        /**
         * triggerStart 是否要触发启动轮询的fetch请求
         */
        if (triggerStart === true) {
            instancePoll.start({ guid, userId: userInfo.userId, code, type: index, })
                .then((responeData) => {
                    instancePoll.poll({ userId: userInfo.userId, ...data, type: index, guid, }, (responeData) => responeData.data.loadingSwitch === true, (responeData) => {
                        this.pollCallback(responeData, index);
                    });
                }, (responeData) => {
                    // message.error(data.msg || '导入任务失败');
                });
        }
        else {
            instancePoll.poll({ userId: userInfo.userId, ...data, type: index, guid }, (responeData) => responeData.data.loadingSwitch === true, (responeData) => {
                this.pollCallback(responeData, index);
            });
        }
    }
    /**
     * 轮询的回掉
     */
    pollCallback = (data, index: number) => {
        const {
            dispatch,
            task,
            orderCode,
        } = this.props;
        const {
            loadingSwitch,
            schedule,
            detail,
        } = data.data;
        if (loadingSwitch !== undefined && task.get(`task${index}`) !== !loadingSwitch) {
            this.uploading({
                [`task${index}`]: !loadingSwitch,
            });
        }

        let title: String;
        switch (index) {
            case 1:
                title = '付款清单（客户维度）';
                break;
            case 2:
                title = '垫款明细';
                break;
            case 3:
                title = '付款账单（人月次维度明细表）';
                break;
            default:
                title = '';
        }

        if (schedule === 100) {
            /**
             * 控制上传状态...
             */

            notification.success({
                type: "success",
                message: title,
                description: '导入成功',
            });
            if (index === 1) {
                dispatch(getPaymentschedule({ type: 1, code: orderCode, }));
            }
            if (index === 2) {
                dispatch(getAdvancedetails({ type: 2, code: orderCode, }));
            }
            if (index === 3) {
                dispatch(getPaymentbill({ type: 3, code: orderCode, }));
            }
        }
        if (schedule === -1) {
            notification.error({
                type: 'error',
                message: title,
                description: detail || '导入失败',
            });
        }
    }
    uploading = (params) => {
        this.props.dispatch(uploading(params))
    }

    // createWss: createWss = (url, params) => {
    //     const {
    //         index,
    //         title,
    //         uploading,
    //         uuid,
    //     } = params;
    //     const wss = new createWebsocket({
    //         url,
    //         onmessage: ({ data }) => {
    //             data = JSON.parse(data);
    //             const {
    //                 dispatch,
    //                 task,
    //             } = this.props;
    //             const {
    //                 loadingSwitch,
    //                 schedule,
    //                 detail,
    //             } = data;

    //             if (loadingSwitch !== undefined && task.get(`task${index}`) !== !loadingSwitch) {
    //                 uploading({
    //                     [`task${index}`]: !loadingSwitch,
    //                 });
    //             }

    //             if (schedule === 100) {
    //                 /**
    //                  * 控制上传状态...
    //                  */

    //                 notification.success!({
    //                     message: title,
    //                     description: '导入成功',
    //                 });
    //                 if (index === 1) {
    //                     dispatch(getPaymentschedule({ type: 1 }));
    //                 }
    //                 if (index === 2) {
    //                     dispatch(getAdvancedetails({ type: 2 }));
    //                 }
    //                 if (index === 3) {
    //                     dispatch(getPaymentbill({ type: 3 }));
    //                 }
    //             }
    //             if (schedule === -1) {
    //                 notification.error!({
    //                     message: title,
    //                     description: detail || '导入失败',
    //                 });
    //             }
    //         },
    //         onerror: () => {
    //             notification.error!({
    //                 message: title,
    //                 description: '查询导入任务失败',
    //             });
    //             /**
    //              * 关闭加载...
    //              */
    //             uploading({
    //                 [`task${index}`]: false,
    //             });
    //         }
    //     });
    //     return wss;
    // }
    onTabClick = (key) => {
        if (Number(key) === 2) {
            Modal.confirm({
                title: '提示',
                content: (
                    <div>
                        你将离开“提交请款审批”页，未提交的请款信息将会被清空（导入的数据除外），是否继续？
                    </div>
                ),
                onOk: () => {
                     browserHistory.push(`${ROUTER_PATH}/newadmin/social/cashout/approve/list`);
                   
                },
                okText: '确定',
                cancelText: '取消',
               
            });

        }
        return false;
    }
    updateParams = (data) => {
        const {
            dispatch,
            userInfo,
            orderCode,
        } = this.props;

        /* 获取垫款明细 */
        if (Object.prototype.hasOwnProperty.call(data, 'billStatus')) {
            // this.wss.wss2 && 　this.wss.wss2.close()
            // if (data.billStatus === 2) {
            //     dispatch(uploading({
            //         task2: true,
            //     }));
            //     this.wss.wss2 = this.createWss(`${WSS}/ws/sppay/file/schedule?user=${userInfo.userId}&type=2`, {
            //         index: 2, title: '垫款明细', uploading: this.uploading
            //     });
            // }
            this.polls.poll2 = new CreatePoll({ url: pollApi, });
            this.poll(2, { topic: 1, });
            dispatch(getAdvancedetails({ type: 2, code: orderCode }));
        }
        this.setState(({ params }) => ({
            params: eachUpdateIn(params, data)
        }));
    }
    cascaderProps = ({ value, options }) => {
        let props: any = {
            className: "cascader",
            options,
            placeholder: "请选择",
            showSearch: true,
            onChange: value => this.updateParams({ approvalPerson: value }),
        };
        if (value) {
            props.value = value;
        }
        return props;
    }
    approveSubmit = () => {
        const listTotal = (this.Paymentschedule, this.Paymentschedule && this.Paymentschedule.totalCalc())//付款清单（客户维度）总计
        const billTotal = (this.Paymentbill, this.Paymentbill && this.Paymentbill.totalCalc())//付款账单（人月次维度明细表）总计
        // 校验是否相等
       
        const {
            task,
            dispatch,
            recipientSourceLoading,
            paymentscheduleDataSource,
            paymentbillDataSource,
            advancedetailsDataSource,
            paymentscheduleTotal,
            advancedetailsTotal,
            paymentbillTotal,
            orderCode,
        } = this.props;
        const {
            task1,
            task2,
            task3,
        } = task.toJS();
        const {
            socialMonth, /* 社保缴费月（操作月） */
            socialNature, /* 社保请款性质 */
            recipientType, /* 收款方类型 */
            recipientName, /* 收款方名称 */
            recipientId, /* 收款方Id */
            deadline, /* 本次请款付款截止时间 */
            billStatus, /* 付款清单（客户维度）的状态 */
            approvalPerson, /* 审批人 */
            openBank,
            account,
            bankType,
            cityName,

            existNoDetail, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
            noDetailAmount, /** 无明细款项金额 */
            noDetailRemark, /** 无明细款项备注*/
        } = this.state.params.toJS();

        const remark = this.remark.textAreaRef.value;

        if (socialMonth === '') {
            message.error('请选择社保缴费月');
            return;
        }
        if (socialNature === '') {
            message.error('请选择社保业务请款性质');
            return;
        }
        if(socialNature === 2){
            if(existNoDetail !== 1 && existNoDetail !== 0){
                message.error('请选择预请款中是否存在无明细的请款款项');
                return;
            }
            if(existNoDetail === 1){
                if(!noDetailAmount || noDetailAmount == 0){
                    message.error('请填写无明细款项金额');
                    return;
                }else if(noDetailAmount > 100000000){
                    message.error('无明细款项金额不能超过1亿');
                    return;
                }
                if(!noDetailRemark || noDetailRemark == ''){
                    message.error('请填写无明细款项备注');
                    return;
                }else if(noDetailRemark.trim().length > 300){
                    message.error('无明细款项备注最多可以输入300字');
                    return;
                }
            }
        }
        if (recipientType === '') {
            message.error('请选择收款方类型');
            return;
        }
        if (recipientName === '') {
            message.error('请选择收款方名称');
            return;
        }
        if (deadline === '') {
            message.error('请选择本次请款付款截止时间');
            return;
        }
        if (task1 === true) {
            message.error('付款清单（客户维度）导入中，请稍等');
            return;
        }

        if (existNoDetail !== 1 && paymentscheduleDataSource.size <= 0) {
            message.error('请导入付款清单（客户维度）');
            return;
        }
        if (existNoDetail !== 1 && billStatus === 2) {
            if (task2 === true) {
                message.error('垫款明细导入中，请稍等');
                return;
            }
            if (advancedetailsDataSource.size <= 0) {
                message.error('请导入垫款明细');
                return;
            }
        }
        if (task3 === true) {
            message.error('付款清单（客户维度）导入中，请稍等');
            return;
        }
        if (existNoDetail !== 1 && paymentbillDataSource.size <= 0) {
            message.error('请导入付款账单（人月次维度明细表）');
            return;
        }
        if (String.prototype.trim.call(remark).replace(/\n/g, '').length > 500) {
            message.error('请款备注需控制在500字以内');
            return;
        }
        if (approvalPerson.length <= 0) {
            message.error('请选择提交给审批人');
            return;
        }
        let province='';
        let city = ''
        if (cityName !== '' || cityName!=='/'){
            province = cityName.split(' ')[0]
            city = cityName.split(' ')[1]
        }
        if (!!!province || !!!city || province == '/' || city == '/'){
            province = ''
            city = ''
        }
        let banTypeABC 
       
        if (!bankType||bankType=='/'){
            banTypeABC = ''
        }else{
            for (let i = 0; i < bankTypeData.length; i++) {
                if (bankTypeData[i].id == bankType) {
                
                    banTypeABC = bankTypeData[i].dictName;
                    break
                }
            }
            banTypeABC = banTypeABC.split('-')[1]
        }
        
        const params: any = {
            socialPaymentMonth: socialMonth,
            socialPayType: socialNature,
            payeeType: recipientType,
            serviceId: recipientId,
            payeeName: recipientName,
            openBank,
            account,
            requestCutOffTime: deadline,
            billStatus,
            remark,
            bankType: banTypeABC,
            province,
            city,
            organizationId: approvalPerson.length >= 1 ? approvalPerson[0] : null,
            operatorId: approvalPerson.length >= 2 ? approvalPerson[1] : null,

            existNoDetail: Number(socialNature) === 2 ? existNoDetail : null, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
            noDetailAmount: Number(socialNature) === 2 ? noDetailAmount : null, /** 无明细款项金额 */
            noDetailRemark: Number(socialNature) === 2 ? noDetailRemark : null, /** 无明细款项备注*/
        }

        /**
         * 修改请款单需要code
         */
        if (orderCode) {
            params.code = orderCode;
        }

        /**
         * 提交审批
         */
        // debugger
        // console.log(params)
        dispatch(submitApprove(params));
    }
    clearData = (index) => {
        const {
            orderCode,
        } = this.props;
        this.props.dispatch(deleteUploadRecord({ type: index,orderCode:orderCode||'' }));
    }
    goDetails = (redirectUrl) => {
        const params = { params: { orderCode: this.props.orderCode } };
        sessionStorage.setItem('cashoutApproveDetail', JSON.stringify(params));
        browserHistory.push(redirectUrl);
    }
    totalCalc = () => { //计算收款方信息所需字段请款总金额
        const {
            params,
        } = this.state;
        const {
            paymentscheduleTotal,
            advancedetailsTotal,
            paymentbillTotal,
        } = this.props;
        const {
            billStatus,
            noDetailAmount,
        } = params.toJS()
        let money:number = 0;
        money = accAdd(paymentbillTotal.get('total') || 0, noDetailAmount);
        return formatMoney(money, 2, '');
    }
    remark;
    Paymentschedule;
    Paymentbill;
    render() {
        const {
            task,
            dispatch,
            recipientSourceLoading,
            paymentscheduleDataSource,
            paymentbillDataSource,
            advancedetailsDataSource,
            paymentscheduleTotal,
            advancedetailsTotal,
            paymentbillTotal,
            resubmit,
            orderCode,
            defaultValue,
            recipientSelectSource,
            userInfo,
            approvalPersonSource,
            submitFetching,
            exceptionModal,
            paymentbillFetching,
            advancedetailsFetching,
            paymentscheduleFetching,
        } = this.props;
        
        const recordUrl = resubmit ? `${ROUTER_PATH}/newadmin/social/cashout/import/recordformodify` : `${ROUTER_PATH}/newadmin/social/cashout/import/record`;
        const {
            params,
            personInfoShow,
        } = this.state;
        // const {
        //     wss1,
        //     wss2,
        //     wss3,
        // } = this.wss
        const {
            socialMonth, /* 社保缴费月（操作月） */
            socialNature, /* 社保请款性质 */
            recipientType, /* 收款方类型 */
            recipientName, /* 收款方名称 */
            recipientId, /* 收款方Id */
            bankAccount,
            deadline, /* 本次请款付款截止时间 */
            billStatus, /* 付款清单（客户维度）的状态 */
            remark, /* 备注 */
            approvalPerson, /* 审批人 */
            rejectReasonData,
            recordsDataSource,
            openBank, /* 开户行 */
            account, /* 开户账号 */
            bankType,
            cityName,
            orderStatus,

            existNoDetail, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
            noDetailAmount, /** 无明细款项金额 */
            noDetailRemark, /** 无明细款项备注*/
        } = params.toJS();
        const {
            visible,
            message,
            redirectUrl,
        } = exceptionModal.toJS();
        const {
            task1,
            task2,
            task3,
        } = task.toJS();
        const rejectReasonDataProps = rejectReasonData ? { rejectReasonData } : {};
        let approvalPersonDate = approvalPersonSource.toJS();
        // 请款单提交只能给 客服经理 或 客服总监
        if(approvalPersonDate.length>0){
            var customerManager = approvalPersonDate.find(function(value, index, arr) {
                return value.label == "客服经理";
            });
            // 客服总监
            var customerDirector = approvalPersonDate.find(function(value, index, arr) {
                return value.label == "客服总监";
            })
            approvalPersonDate = [customerManager,customerDirector]
        }

        
        return (
            <div key="cashoutApproveSubmit">
                <Modal
                    title="提醒"
                    visible={visible}
                    closable={false}
                    footer={<Button type="primary" onClick={e => this.goDetails(redirectUrl)}>确定</Button>}
                >
                    <Alert message={message} type="warning">
                    </Alert>
                </Modal>
                <Tabs onTabClick={(key) => { this.onTabClick(key) }} animated={false} activeKey="1">
                    <TabPane tab={!resubmit ? "提交请款审批" : `请款单：${orderCode}`} key="1" style={{ padding: '10px' }}>
                        <SocialInfo
                            updateParams={this.updateParams}
                            socialMonth={socialMonth}
                            socialNature={socialNature}
                            recipientType={recipientType}
                            getRecipientSelectSource={(params) => dispatch(getRecipientSelectSource(params))}
                            isEdit={true}
                            cacheRecipientSelectSource={recipientSelectSource}

                            existNoDetail={existNoDetail}
                            noDetailAmount={noDetailAmount}
                            noDetailRemark={noDetailRemark}

                            {...rejectReasonDataProps}
                        />
                        <Paymentschedule
                            ref={node => this.Paymentschedule = node}
                            billStatus={billStatus}
                            updateParams={this.updateParams}
                            paymentscheduleDataSource={paymentscheduleDataSource}
                            advancedetailsDataSource={advancedetailsDataSource}
                            uploading={this.uploading}
                            paymentscheduleTotal={paymentscheduleTotal}
                            advancedetailsTotal={advancedetailsTotal}
                            isEdit={true}
                            clearData={this.clearData}
                            recordUrl={recordUrl}
                            poll={this.poll}
                            task1={task1}
                            task2={task2}
                            orderCode={orderCode}
                            tableloading1={paymentscheduleFetching}
                            tableloading2={advancedetailsFetching}
                        />
                        {/*wsss={
                                [{
                                    loading: task1,
                                    url: `${WSS}/ws/sppay/file/schedule?user=${userInfo.userId}&type=1`
                                },
                                {
                                    loading: task2,
                                    url: `${WSS}/ws/sppay/file/schedule?user=${userInfo.userId}&type=2`
                                }]
                            }*/}
                        <Paymentbill
                            ref={node => this.Paymentbill = node}
                            paymentbillDataSource={paymentbillDataSource}
                            uploading={this.uploading}
                            paymentbillTotal={paymentbillTotal}
                            isEdit={true}
                            clearData={this.clearData}
                            recordUrl={recordUrl}
                            poll={this.poll}
                            task3={task3}
                            tableloading={paymentbillFetching}
                            orderCode={orderCode}

                        />
                        <RecipientInfo
                            deadline={deadline}
                            recipientId={recipientId}
                            recipientSourceLoading={recipientSourceLoading}
                            recipientType={recipientType}
                            updateParams={this.updateParams}
                            cacheRecipientSelectSource={recipientSelectSource}
                            isEdit={true}
                            openBank={openBank}
                            account={account}
                            bankType={bankType}
                            cityName={cityName}
                            getRecipientSelectSource={(params) => dispatch(getRecipientSelectSource(params))}
                            total={this.totalCalc()}
                        />
                        {/*wsss={[{
                                loading: task3,

                                url: `${WSS}/ws/sppay/file/schedule?user=${userInfo.userId}&type=3`
                            }]}*/}
                        {
                            resubmit && <CashoutApproveRecords
                                dataSource={recordsDataSource}
                            />
                        }

                        <Card key="card-5" title="请款备注">
                            <div>
                                <TextArea className="remark-textarea" maxLength={180} style={{ height: 100, marginTop: 20, marginBottom: 20 }}  defaultValue={remark} ref={node => this.remark = node} />
                            提交给审批人：
                                <Cascader {...this.cascaderProps({ value: approvalPerson, options: approvalPersonDate }) } style={{ width: 300 }} />
                            </div>
                            
                        </Card>
                        <Row type="flex" justify="center">
                            <Button className="submit" type="primary" loading={submitFetching} onClick={(e) => this.approveSubmit()} style={{ marginTop: 20 }}>
                                确认并提交
                                </Button>
                        </Row>
                    </TabPane>
                    {
                        !resubmit &&
                        <TabPane tab="请款单列表" key="2">
                        </TabPane>
                    }
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state:Any.Store, ownProps: TOwnProps):TStateProps => {
    const data = state.get('cashoutApproveSubmit');
    return {
        task: data.get('task'),
        recipientSourceLoading: data.get('recipientSourceLoading'),
        paymentscheduleDataSource: data.get('paymentscheduleDataSource'),
        advancedetailsDataSource: data.get('advancedetailsDataSource'),
        paymentbillDataSource: data.get('paymentbillDataSource'),
        paymentscheduleTotal: data.get('paymentscheduleTotal'),
        advancedetailsTotal: data.get('advancedetailsTotal'),
        paymentbillTotal: data.get('paymentbillTotal'),
        recipientSelectSource: data.get('recipientSelectSource'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
        approvalPersonSource: data.get('approvalPersonSource'),
        submitFetching: data.get('submitFetching'),
        exceptionModal: data.get('exceptionModal'),
        paymentbillFetching: data.get('paymentbillFetching'),
        advancedetailsFetching: data.get('advancedetailsFetching'),
        paymentscheduleFetching: data.get('paymentscheduleFetching'),
    }
};


export default connect(mapStateToProps)(CashoutApproveSubmit);
