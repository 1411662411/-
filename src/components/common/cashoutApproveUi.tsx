import * as React from 'react';
import * as moment from 'moment';
import * as Immutable from 'immutable';
import {
    PaymentscheduleTable,
    PaymentbillsTable,
    AdvanceTable,
} from '../../components/common/tables/paymentBillTable';
import '../../css/components/cashoutApproveUi';
import { browserHistory, Link } from 'react-router';
import { DOMAIN_OXT } from '../../global/global';
import {formatMoney} from '../../util/util';
// import { CreateWebSocket } from '../../util/createWebsocket';
import {
    accAdd,
} from '../../util/math';
import {
    Tabs,
    Form,
    Input,
    Radio,
    DatePicker,
    Card,
    Select,
    Icon,
    Button,
    Table,
    Cascader,
    Row,
    Modal,
    Upload,
    message,
    notification,
    Spin,
    Menu,
    Dropdown,
    Alert,
    Col,
    InputNumber,
} from 'antd';
import {
    FormComponentProps,
} from 'antd/lib/form/Form'

import TableUI from '../Table';
import NumberUI from './InputNumber';
import WhiteSpace from '../../components/common/WhiteSpace';

moment.locale('zh-cn');
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
const TextArea = Input.TextArea;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 2,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    }
}
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


const modalFormItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 5,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 19,
        },
    }
}
// interface wss {
//     loading: boolean,
//     wss: CreateWebSocket,
//     url: string;
// }

/**
 * 上传props
 */
interface uploadPropsParams {
    // wss: wss;
    index: number;
    data?: any;
    poll: (index: number, data: any, triggerStart?: boolean) => void;
    uploading: (any) => void;
    orderCode?: string | number;
}

interface styleObj {
    background?: string;
}

const uploadProps = (params: uploadPropsParams) => {
    let {
        index,
        uploading,
        // wss,
        orderCode,
        poll,
    } = params;
    return {
        name: 'file',
        action: `${DOMAIN_OXT}/apiv4_/v1/sppayu/upload/file/${index}/`,
        showUploadList: false,
        accept: '.csv,.xlsx',
        beforeUpload: (file) => {
            const types = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            const isLt8M = file.size / 1024 / 1024 < 8;
            if (!isLt8M) {
                message.error('导入的文件大小需控制在 8M以内');
                return false;
            }
            // console.log(file.type);
            if (types.indexOf(file.type) === -1) {
                message.error('导入格式错误，请上传 *.csv *.xlsx 文件');
                return false;
            }
            /**
             * 设置加载中
             */
            uploading({
                [`task${index}`]: true,
            });
            return true;
        },
        onChange: (info) => {
            const file = info.file;
            const errormsg = `${file.name} 上传失败.`;
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
            if (file.status === 'done') {
                const response = file.response;
                let {
                    status,
                    errcode,
                    msg = errormsg,
                    uuid,
                    res,
                } = response;


                uuid = {
                    guid: uuid,
                }
                if (orderCode) {
                    uuid.code = orderCode;
                }

                // uuid = JSON.stringify(uuid);

                if ((Number(status) === 0 || Number(errcode) === 0) && res !== 'fail') { //241sp 增加判断 res=fail 时，禁止上传
                    poll(index, { ...uuid, topic: 2 }, true)
                    // wss.wss.send(uuid);
                }
                else {
                    notification.error({
                        type: 'error',
                        message: title,
                        description: msg,
                    });
                    uploading({
                        [`task${index}`]: false,
                    });
                }
            }
            else if (file.status === 'error') {
                notification.error({
                    type: 'error',
                    message: title,
                    description: errormsg,
                });
                uploading({
                    [`task${index}`]: false,
                });
            }
        },
    }
};

interface rejectReasonData {
    reason: string;
    files: [
        {
            name: string;
            link: string;
        }
    ]
}
interface rejectReason {
    (data: rejectReasonData): React.ReactNode;
}


interface RejectReasonProps {
    rejectReasonData: rejectReasonData;
    closable?: boolean;
}
const range = (start, end) => {
    const result: Array<number> = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}
/**
 * 驳回原因
 */
export class RejectReason extends React.Component<RejectReasonProps, any> {
    constructor(props) {
        super(props);
    }
    rejectReason: rejectReason = (data) => {
        const {
            reason,
            files,
        } = data;

        const props: any = {
            showIcon: true,
            type: 'error',
            message: <span>驳回原因：{reason}</span>,
            description: <div>
                {files.map(({ name, link }, index) => <div key={index}><a href={link} target="_blank"><Icon type="file" />点击下载附件{(index + 1)}: {name}</a></div>)}
            </div>,
            closable: this.props.closable || false,
        }
        return <Alert  {...props} />
    }
    render() {
        const rejectReasonData = this.props.rejectReasonData
        return (
            <div>
                {rejectReasonData && this.rejectReason(rejectReasonData)}
            </div>
        )
    }
}

interface SocialInfoProps {
    updateParams?: (any) => void;
    socialMonth: any;
    socialNature: number;
    recipientType: number | string;
    cacheRecipientSelectSource?: any;
    getRecipientSelectSource?: (any) => void;
    submitPerson?: string;
    submitPersonPhone?: string | number;
    isEdit?: boolean;
    rejectReasonData?: rejectReasonData;
    existNoDetail?: 1 | 0, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
    noDetailAmount?:any, /** 无明细款项金额 */
    noDetailRemark?: string, /** 无明细款项备注*/
    ownStaffRequest?: number, /** 是否为内部员工*/
}


/**
 * 社保信息
 */
export class SocialInfo extends React.Component<SocialInfoProps, any> {
    constructor(props) {
        super(props);
    }

    recipientTypeChange = (value) => {
        const {
            updateParams,
            getRecipientSelectSource,
            cacheRecipientSelectSource,
            recipientType,
        } = this.props;

        /**
         * 同一类型不用改变 "收款方名称，开户行，账号"
         */
        if (recipientType <= 3 && value <= 3) {
            updateParams!({ recipientType: value, });
        }
        else {
            updateParams!({ recipientType: value, recipientName: '', recipientId: '', openBank: '/', account: '/' });
        }
        

        /**
         * 分2种source
         */
        const recipientSelectType = Number(value) < 4 ? 'one' : 'two';

        
        /* 不存在缓存 */
        if (recipientSelectType === 'one' && cacheRecipientSelectSource.get(recipientSelectType).size <= 0) {
            getRecipientSelectSource!({ recipientSelectType, enableStatus: 0 });
        }
        if(recipientSelectType === 'two') {
            if(value === 4) {
                getRecipientSelectSource!({ recipientSelectType,  branchTypeIn: '1,2', enableStatus: 0 });
            }
            else {
                getRecipientSelectSource!({ recipientSelectType, branchTypeIn: '1,3', enableStatus: 0 });
            }
        }
    }
    monthPickerProps = (params?) => {
        const {
            date,
            name,
        } = params;
        let props: {
            style: any;
            onChange(x: any, y: any): void;
            value?: moment.Moment;
        } = {
                style: { width: 200 },
                onChange: (data, timeString) => this.props.updateParams!({
                    [name]: timeString
                }),
            }
        if (date) {
            props.value = moment(date);
        }
        return props;
    }
    rednerRecipientType = (value) => {
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
            <Select key="recipientType" value={value} onChange={(e: any) => this.recipientTypeChange(e)}>
                {nodes}
            </Select>
        );
    }
    mapRecipientTypeToName = (value) => {
        switch (value) {
            case 1:
                return '给服务商合并请款';
            case 2:
                return '给服务商五险请款';
            case 3:
                return '给服务商公积金请款';
            case 4:
                return '给自营户五险请款';
            case 5:
                return '给自营户五险请款';
            default:
                throw new Error('沒有相对应收款方类型')
        }
    }

    render() {
        const {
            updateParams,
            socialMonth,
            socialNature,
            recipientType,
            isEdit,
            submitPerson,
            submitPersonPhone,
            rejectReasonData,

            existNoDetail, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
            noDetailAmount, /** 无明细款项金额 */
            noDetailRemark, /** 无明细款项备注*/
            ownStaffRequest, /**是否为内部员工 */
        } = this.props;
        
        return (
            <div key='socialInfo' className="cashoutApprove">
                <Card className="card" key="card-1">
                    <div>
                        {
                            rejectReasonData && <div style={{ marginBottom: 20 }}>
                                <RejectReason rejectReasonData={rejectReasonData} />
                            </div>
                        }

                        <Form className="form-1" key="form-1">
                        {   //当用户选择“社保业务请款性质!=预付请款”时，不显示字段“预请款中是否存在无明细的请款款项”；
                            isEdit && Number(socialNature) !== 2 && <TableUI 
                            dataSource={[
                            {
                                label: '社保缴费月（操作月）',
                                required: true,
                                value: <FormItem
                                {...formItemLayoutTable}
                                label="社保缴费月（操作月）"
                            >
                                <MonthPicker {...this.monthPickerProps({ date: socialMonth, name: 'socialMonth' }) } />
                            </FormItem>
                            },
                            {
                                label: '社保业务请款性质',
                                required: true,
                                value: <FormItem
                                {...formItemLayoutTable}
                                label="社保业务请款性质"
                            >
                                <RadioGroup key="socialNature" value={socialNature} onChange={(e: any) => updateParams!({ 
                                    socialNature: e.target.value, 
                                    existNoDetail: 1,
                                    noDetailAmount: 0,
                                    noDetailRemark: '',
                                    })}>
                                    <Radio value={1} key="1">实付请款</Radio>
                                    <Radio value={2} key="2">预付请款</Radio>
                                </RadioGroup>
                            </FormItem>
                            },
                            {
                                label: '是否为内部员工的请款',
                                required: true,
                                value: <FormItem
                                {...formItemLayoutTable}
                                label="是否为内部员工的请款"
                            >
                                <RadioGroup key="ownStaffRequest" value={ownStaffRequest} onChange={(e: any) => updateParams!({ 
                                    ownStaffRequest: e.target.value, 
                                    socialNature: 1, 
                                    existNoDetail: 1,
                                    noDetailAmount: 0,
                                    noDetailRemark: '',
                                    })}>
                                    <Radio value={1} key="1">是</Radio>
                                    <Radio value={0} key="2">否</Radio>
                                </RadioGroup>
                            </FormItem>
                            },
                            ]}
                            />
                        }
                        {   //当用户选择“社保业务请款性质=预付请款”时，显示字段“预请款中是否存在无明细的请款款项”；
                            isEdit && Number(socialNature) === 2 && Number(existNoDetail) !== 1 && <TableUI 
                            dataSource={[
                            {
                                label: '社保缴费月（操作月）',
                                required: true,
                                value: <FormItem
                                {...formItemLayoutTable}
                                label="社保缴费月（操作月）"
                            >
                                <MonthPicker {...this.monthPickerProps({ date: socialMonth, name: 'socialMonth' }) } />
                            </FormItem>
                            },
                            {
                                label: '社保业务请款性质',
                                required: true,
                                value: <FormItem
                                {...formItemLayoutTable}
                                label="社保业务请款性质"
                                
                            >
                                <RadioGroup key="socialNature" value={socialNature} onChange={(e: any) => updateParams!({ 
                                    socialNature: e.target.value, 
                                    existNoDetail: 1,
                                    noDetailAmount: 0,
                                    noDetailRemark: '',
                                    })}>
                                    <Radio value={1} key="1">实付请款</Radio>
                                    <Radio value={2} key="2">预付请款</Radio>
                                </RadioGroup>
                            </FormItem>
                            },
                            {
                                label: '预请款中是否存在无明细的请款款项',
                                required: true,
                                value: <FormItem
                                    {...formItemLayoutTable}
                                    label="预请款中是否存在无明细的请款款项"
                                >
                                    <RadioGroup key="existNoDetail" value={existNoDetail} onChange={(e: any) => updateParams!({ existNoDetail: e.target.value })}>
                                        <Radio value={1} key="1"><span className='text-error'>存在无明细款项</span></Radio>
                                        <Radio value={0} key="0">不存在无明细款项</Radio>
                                    </RadioGroup>
                                </FormItem>
                            },
                            ]}
                            />
                        }
                        {   //当用户选择“社保业务请款性质=预付请款” && 当“预请款中是否存在无明细的请款款项=存在无明细款项”时，显示字段“无明细款项金额”、“无明细款项备注说明”
                            isEdit && Number(socialNature) === 2 && Number(existNoDetail) === 1 && <TableUI 
                            dataSource={[
                            {
                                label: '社保缴费月（操作月）',
                                required: true,
                                value: <FormItem
                                {...formItemLayoutTable}
                                label="社保缴费月（操作月）"
                            >
                                <MonthPicker {...this.monthPickerProps({ date: socialMonth, name: 'socialMonth' }) } />
                            </FormItem>
                            },
                            {
                                label: '社保业务请款性质',
                                required: true,
                                value: <FormItem
                                {...formItemLayoutTable}
                                label="社保业务请款性质"
                            >
                                <RadioGroup key="socialNature" value={socialNature} onChange={(e: any) => updateParams!({ 
                                    socialNature: e.target.value,
                                    existNoDetail: 1,
                                    noDetailAmount: 0,
                                    noDetailRemark: '',
                                    })}>
                                    <Radio value={1} key="1">实付请款</Radio>
                                    <Radio value={2} key="2">预付请款</Radio>
                                </RadioGroup>
                            </FormItem>
                            },
                            {
                                label: '预请款中是否存在无明细的请款款项',
                                required: true,
                                value: <FormItem
                                    {...formItemLayoutTable}
                                    label="预请款中是否存在无明细的请款款项"
                                >
                                    <RadioGroup key="existNoDetail" value={existNoDetail} onChange={(e: any) => updateParams!({ existNoDetail: e.target.value })}>
                                        <Radio value={1} key="1"><span className='text-error'>存在无明细款项</span></Radio>
                                        <Radio value={0} key="0">不存在无明细款项</Radio>
                                    </RadioGroup>
                                </FormItem>
                            },
                            {
                                label: '无明细款项金额',
                                required: true,
                                value: <FormItem
                                    {...formItemLayoutTable}
                                    label="无明细款项金额"
                                >
                                    <NumberUI 
                                        attr = {{
                                            min:0,
                                            precision:2,
                                            style:{width:150},
                                            formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                            parser:(value:any):any => value.replace(/\$\s?|(,*)/g, ''),
                                            onChange:(e: any) => {
                                                // console.log(e, Number(e))
                                                if(e > 100000000){
                                                    message.error('无明细款项金额不能超过1亿')
                                                    updateParams!({ noDetailAmount: noDetailAmount })
                                                }else{
                                                    updateParams!({ noDetailAmount: e })
                                                }
                                            },
                                            value:noDetailAmount,
                                        }}
                                        addonAfter='元'
                                    />
                                </FormItem>
                            },
                            {
                                label: '无明细款项备注说明',
                                required: true,
                                isAll: true,
                                value: <FormItem
                                    {...formItemLayoutTable}
                                    label="无明细款项备注说明"
                                >
                                    <Input.TextArea 
                                        rows={3} 
                                        value={noDetailRemark} 
                                        onChange={(e: any) => {
                                            let value = e.target.value;
                                            if(value.length > 300){
                                                message.error('无明细款项备注说明最多可以输入300字')
                                                updateParams!({ noDetailRemark })
                                            }else{
                                                updateParams!({ noDetailRemark: value })
                                            }
                                            
                                        }}
                                    /> 
                                </FormItem>
                            }
                            ]}
                            />
                        }
                        {
                            !isEdit && Number(socialNature) === 2 &&  Number(existNoDetail) === 1 && <TableUI 
                            dataSource={[{
                                label: '请款提交人',
                                isAll: true,
                                value: <span>{submitPerson}/{submitPersonPhone}</span>
                            },
                            {
                                label: '社保缴费月（操作月）',
                                value: <span>{socialMonth}</span>
                            },
                            {
                                label: '社保业务请款性质',
                                value: <span>
                                        {
                                            socialNature === 1 ? '实付请款' : '预付请款'
                                        }
                                    </span>
                            },
                            {
                                label: '预请款中是否存在无明细的请款款项',
                                value: <span className='text-error'>存在无明细款项</span>,
                            },
                            {
                                label: '无明细款项金额',
                                value: <span>
                                        <span className='text-error'>{noDetailAmount} 元</span>
                                    </span>
                            },
                            {
                                label: '无明细款项备注说明',
                                isAll: true,
                                value: <span>
                                        {
                                            noDetailRemark === '' ? '/' : noDetailRemark
                                        }
                                    </span>
                            }
                            // {
                            //     label:'收款方类型',
                            //     value:<FormItem
                            //         {...formItemLayoutTable}
                            //         label="收款方类型"
                            //     >
                            //         {this.rednerRecipientType(recipientType)}
                            //     </FormItem>
                            // },
                            ]}
                            />
                        }
                        {
                            !isEdit && Number(socialNature) === 2 && Number(existNoDetail) !== 1 && <TableUI 
                            dataSource={[{
                                label: '请款提交人',
                                isAll: true,
                                value: <span>{submitPerson}/{submitPersonPhone}</span>
                            },
                            {
                                label: '社保缴费月（操作月）',
                                value: <span>{socialMonth}</span>
                            },
                            {
                                label: '社保业务请款性质',
                                value: <span>
                                        {
                                            socialNature === 1 ? '实付请款' : '预付请款'
                                        }
                                    </span>
                            },
                            {
                                label: '预请款中是否存在无明细的请款款项',
                                value: '不存在无明细款项',
                            },
                            // {
                            //     label:'收款方类型',
                            //     value:<FormItem
                            //         {...formItemLayoutTable}
                            //         label="收款方类型"
                            //     >
                            //         {this.rednerRecipientType(recipientType)}
                            //     </FormItem>
                            // },
                            ]}
                            />
                        }
                        {
                            !isEdit && Number(socialNature) !== 2 && <TableUI 
                            dataSource={[{
                                label: '请款提交人',
                                isAll: true,
                                value: <span>{submitPerson}/{submitPersonPhone}</span>
                            },
                            {
                                label: '社保缴费月（操作月）',
                                value: <span>{socialMonth}</span>
                            },
                            {
                                label: '社保业务请款性质',
                                value: <span>
                                        {
                                            socialNature === 1 ? '实付请款' : '预付请款'
                                        }
                                    </span>
                            },
                            // {
                            //     label: '预请款中是否存在无明细的请款款项',
                            //     value: '不存在无明细款项',
                            // },
                            // {
                            //     label:'收款方类型',
                            //     value:<FormItem
                            //         {...formItemLayoutTable}
                            //         label="收款方类型"
                            //     >
                            //         {this.rednerRecipientType(recipientType)}
                            //     </FormItem>
                            // },
                            ]}
                            />
                        }
                        </Form>
                    </div>

                </Card>
            </div>
        )

    }
}



interface RecipientInfoProps {
    recipientSourceLoading?: boolean;
    updateParams?: (any) => void;
    isEdit?: boolean;
    deadline: number;
    recipientName?: string;
    recipientId?: string | number;
    recipientType: number | string;
    cacheRecipientSelectSource?: any;
    openBank: string;
    account: string;
    bankType?:any;
    cityName?:any;
    getRecipientSelectSource?: (any) => void;
    total?:number | string;
}

/**
 * 收款方信息
 */
export class RecipientInfo extends React.Component<RecipientInfoProps, any> {
    constructor(props) {
        super(props);
    }
    recipientNameProps = ({ value, recipientSelectSource }) => {
        let props: any = {
            showSearch: true,
            placeholder: "请选择",
            style: { width: 400 },
            optionFilterProp: "children",
            filterOption: (input, option: any) => {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            onSelect: (value, option) => {
                const props = option.props;
                const openBank = props['data-bank'] || '/';
                const account = props['data-account'] || '/';
                const bankType = props['data-bankType']||'/';
                const cityName = props['data-cityName']||'/';
                this.props.updateParams!({ recipientName: option.props.children, recipientId: value, openBank, account, bankType, cityName });
            }
        };
        if (value && recipientSelectSource.length > 0) {
            props.value = value;
        }
        if(value === '') {
            props.key = Date.now();
        }
        return props;
    }

    datePickerProps = (params?) => {
        const {
            date,
            name,
        } = params;

        let props: {
            style: any;
            showTime: any;
            disabledTime: any;
            format: string;
            onChange(x: any, y: any): void;
            value?: moment.Moment;
            dateRender(x: any, y: any): any;
        } = {
                style: { width: 200 },
                showTime: { defaultValue: moment('17:00', 'HH:mm') },
                disabledTime: () => ({
                    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24],
                    disabledMinutes: () => range(1, 60),
                    disabledSeconds: () => range(1, 60),
                }),
                format: "YYYY-MM-DD HH:mm",
                onChange: (data, timeString) => {
                    this.props.updateParams!({
                        [name]: timeString
                    })
                },
                dateRender: (current) => {
                    const style: styleObj = {};
                    if (current.day() === 6 || current.day() === 0) {
                        style.background = '#e8e8e8';
                    }
                    return (
                        <div className="ant-calendar-date" style={style}>
                            {current.date()}
                        </div>
                    );
                }
            }
        if (date) {
            props.value = moment(date);
        }
        return props;
    }

    /**
     * v241增加收款方类型
     */
    rednerRecipientType = (value) => {
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
            <Select key="recipientType" value={value} onChange={(e: any) => this.recipientTypeChange(e)}>
                {nodes}
            </Select>
        );
    }
    recipientTypeChange = (value) => {
        const {
            updateParams,
            getRecipientSelectSource,
            cacheRecipientSelectSource,
            recipientType,
        } = this.props;

        /**
         * 同一类型不用改变 "收款方名称，开户行，账号"
         */
        if (recipientType <= 3 && value <= 3) {
            updateParams!({ recipientType: value, });
        }
        else {
            updateParams!({ recipientType: value, recipientName: '', recipientId: '', openBank: '/', account: '/' });
        }
        

        /**
         * 分2种source
         */
        const recipientSelectType = Number(value) < 4 ? 'one' : 'two';

        
        /* 不存在缓存 */
        if (recipientSelectType === 'one' && cacheRecipientSelectSource.get(recipientSelectType).size <= 0) {
            getRecipientSelectSource!({ recipientSelectType, enableStatus: 0 });
        }
        if(recipientSelectType === 'two') {
            if(value === 4) {
                getRecipientSelectSource!({ recipientSelectType,  branchTypeIn: '1,2', enableStatus: 0 });
            }
            else {
                getRecipientSelectSource!({ recipientSelectType, branchTypeIn: '1,3', enableStatus: 0 });
            }
        }
    }

    render() {
        const {
            updateParams,
            recipientSourceLoading,
            deadline,
            recipientType,
            recipientName,
            recipientId,
            isEdit,
            cacheRecipientSelectSource,
            account,
            openBank,
            bankType,
            cityName,
            total,
        } = this.props;
        // console.log(cacheRecipientSelectSource.toJS())
        // bankType: bankType,
        //     cityName: cityName
        // const bankType = cacheRecipientSelectSource.toJS().bankType
        // const cityName = cacheRecipientSelectSource.toJS().cityName
   
        // const province = cityName.split(' ');
        // console.log(province)
        const recipientSelectType = recipientType !== '' && (Number(recipientType) < 4 ? 'one' : 'two');
        const recipientSelectSource = recipientSelectType && cacheRecipientSelectSource ? cacheRecipientSelectSource.get(recipientSelectType).toJS() : [];
    
        return (
            <div key='recipientInfo' className="cashoutApprove">
                <Card className="card" key="card-2" title='收款方信息'>
                    <Form className="form-1" key="form-2">
                        <TableUI 
                            dataSource={[
                                {
                                    label: '请款总金额',
                                    value: <span style={{fontWeight: 'bold'}} className='text-error'>{total || 0}</span>
                                },
                                {
                                    label:'收款方类型',
                                    required: isEdit,
                                    value:<FormItem
                                        {...formItemLayoutTable}
                                        label="收款方类型"
                                    >
                                        {this.rednerRecipientType(recipientType)}
                                    </FormItem>
                                },
                                {
                                    label:'收款方名称',
                                    required: isEdit,
                                    value:<FormItem
                                        {...formItemLayoutTable}
                                        label="收款方名称"
                                    >
                                        {
                                            isEdit ?
                                                <Spin spinning={recipientSourceLoading} className="recipient-source-loading">
                                                    <Select key={recipientSelectType} {...this.recipientNameProps({ value: recipientId, recipientSelectSource, }) } >
                                                        {recipientSelectSource.map((item, index) => <Option data-bank={item.bank} data-bankType={item.bankType} data-cityName={item.cityName} data-account={item.account} key={index} value={item.value}>{item.name}</Option>)}
                                                    </Select>
                                                </Spin>
                                                :
                                                <span>{recipientName}</span>
                                        }
            
                                    </FormItem>
                                },
                                {
                                    label: '开户行',
                                    value: <FormItem
                                        {...formItemLayoutTable}
                                        label="开户行"
                                    >
                                        <span>{openBank}</span>
                                    </FormItem>
                                },
                                {
                                    label: '账号',
                                    value: <FormItem
                                        {...formItemLayoutTable}
                                        label="账号"
                                    >
                                        <span>{account}</span>
                                    </FormItem>
                                },
                                {
                                    label: '客服计划付款截止日',
                                    required: isEdit,
                                    value: <FormItem
                                        {...formItemLayoutTable}
                                        label="客服计划付款截止日"
                                    >
                                        {
                                            isEdit ?
                                                <DatePicker 
                                                {...this.datePickerProps({ date: deadline, name: 'deadline' }) }  />
                                                :
                                                <span>{moment(deadline * 1000).format('YYYY-MM-DD HH:mm')}</span>
                                        }
            
                                    </FormItem>
                                },
                            ]}
                        />
                        
                        
                        
                    </Form>
                </Card>
            </div>
        )

    }
}

export interface PayeeInfoProps {
    uiType: number;
    recipientName?: string;
    recipientType?: number;
    recipientId?: string | number;
    openBank?: string;
    account?: string;
    promiseDeadline?: string;
    cashoutDeadline?: number;
    secondCashout?: number;
    secondCashoutNameSource?: Immutable.List<{ name: string, id: number }>;
    financePlanPayTime?:any;
    secondCashoutInfo?: Immutable.Map<string, any>;
    getSecondCashoutInfo?: (params) => void;
    form?: any;
    edit?: boolean;
}
interface PayeeInfoState {
    secondCashout: number,
    secondCashoutRemark: string;
    secondCashoutOpenBank: string;
    secondCashoutAccount: string | number;
}

class PayeeInfoForm extends React.Component<PayeeInfoProps & FormComponentProps, PayeeInfoState> {
    constructor(props) {
        super(props);
        const {
            secondCashout,
        } = props;
        this.state = {
            secondCashout: secondCashout !== undefined ? secondCashout : -1,
            secondCashoutRemark: '',
            secondCashoutOpenBank: '',
            secondCashoutAccount: '',
        }
    }
    // recipientNameProps = ({ value, recipientSelectSource }) => {
    //     let props: any = {
    //         showSearch: true,
    //         placeholder: "请选择",
    //         style: { width: 400 },
    //         optionFilterProp: "children",
    //         filterOption: (input, option: any) => {
    //             return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    //         },
    //         onSelect: (value, option) => {
    //             const props = option.props;
    //             const openBank = props['data-bank'] || '/';
    //             const account = props['data-account'] || '/';
    //             this.props.updateParams!({ recipientName: option.props.children, recipientId: value, openBank, account, });
    //         }
    //     };
    //     if (value && recipientSelectSource.length > 0) {
    //         props.value = value;
    //     }
    //     return props;
    // }

    // datePickerProps = (params?) => {
    //     const {
    //         date,
    //         name,
    //     } = params;

    //     let props: {
    //         style: any;
    //         showTime: any;
    //         disabledTime: any;
    //         format: string;
    //         onChange(x: any, y: any): void;
    //         value?: moment.Moment;
    //     } = {
    //             style: { width: 200 },
    //             showTime: { defaultValue: moment('17:00', 'HH:mm') },
    //             disabledTime: () => ({
    //                 disabledHours: () => [0,1,2,3,4,5,6,7,8,19,20,21,22,23,24],
    //                 disabledMinutes: () => range(1, 60),
    //                 disabledSeconds: () => range(1, 60),
    //             }),
    //             format: "YYYY-MM-DD HH:mm",
    //             onChange: (data, timeString) => {
    //                 this.props.updateParams!({
    //                     [name]: timeString
    //                 })
    //             }
    //         }
    //     if (date) {
    //         props.value = moment(date);
    //     }
    //     return props;
    // }
    datePickerTimeProps = () => {

        let props: any = {
            style: { width: 200 },
            showTime: { defaultValue: moment('17:00', 'HH:mm') },
            disabledTime: () => ({
                disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24],
                disabledMinutes: () => range(1, 60),
                disabledSeconds: () => range(1, 60),
            }),
            disabledDate: (current) => {
                return !(current && current.valueOf() < moment().add(30, 'days').valueOf() && current.valueOf() > moment().subtract(30, 'days').valueOf());
            },
            format: "YYYY-MM-DD HH:mm",
        }
        return props;
    }
    secondCashoutChange = (e) => {

        this.setState({
            secondCashout: e.target.value
        });

    }
    secondCashoutNameSourceChange = (value) => {
        const {
            getSecondCashoutInfo,
        } = this.props;
        if (getSecondCashoutInfo && Object.prototype.toString.call(getSecondCashoutInfo).slice(8, -1) === 'Function') {
            getSecondCashoutInfo({ id: value });
        }
    }
    render() {
        const {
            form,
            uiType,
            recipientName,
            recipientType,
            openBank,
            account,
            secondCashoutNameSource,
            promiseDeadline,
            cashoutDeadline,
            edit,
            secondCashoutInfo,
            financePlanPayTime,
        } = this.props;
        
        let {
            secondCashout,
            // secondCashoutRemark,
            // secondCashoutOpenBank,
            // secondCashoutAccount,
        } = this.state;
        secondCashout = this.props.secondCashout !== undefined ? this.props.secondCashout : secondCashout;
        let secondCashoutRemark;
        let secondCashoutOpenBank;
        let secondCashoutAccount;
        let secondCashoutPayeeId;
        let secondCashoutPayeeName;
        if (secondCashoutInfo && secondCashoutInfo.size > 0) {
            let secondCashoutInfoJs = secondCashoutInfo.toJS();
            secondCashoutRemark = secondCashoutInfoJs.secondCashoutRemark;
            secondCashoutOpenBank = secondCashoutInfoJs.secondCashoutOpenBank;
            secondCashoutAccount = secondCashoutInfoJs.secondCashoutAccount;
            secondCashoutPayeeId = secondCashoutInfoJs.secondCashoutPayeeId;
            secondCashoutPayeeName = secondCashoutInfoJs.secondCashoutPayeeName;
        }

        const { getFieldDecorator } = form;
        // const {
        //     updateParams,
        //     recipientSourceLoading,
        //     deadline,
        //     recipientType,
        //     recipientName,
        //     recipientId,
        //     isEdit,
        //     cacheRecipientSelectSource,
        //     account,
        //     openBank,
        // } = this.props;
        // const recipientSelectType = recipientType !== '' && (Number(recipientType) < 4 ? 'one' : 'two');
        // const recipientSelectSource = recipientSelectType && cacheRecipientSelectSource ? cacheRecipientSelectSource.get(recipientSelectType).toJS() : [];
        return (
            <div key='PayeeInfo' className="cashoutApprove">
                <Card className="card" key="card-2" title='收款方信息'>
                    <Form className="form-payee-info">
                        <table className="table-payee-info">
                            <colgroup style={{ width: '15%' }}></colgroup>
                            <colgroup style={{ width: '35%' }}></colgroup>
                            <colgroup style={{ width: '15%' }}></colgroup>
                            <colgroup style={{ width: '35%' }}></colgroup>
                            {
                                uiType === 1 &&
                                <tr>
                                    <td>
                                        收款方名称：
                                    </td>
                                    <td>
                                        <FormItem
                                            key="recipientName"
                                        >
                                            {
                                                getFieldDecorator('recipientName', {
                                                    initialValue: recipientName
                                                })(
                                                    <span>{recipientName}</span>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                    <td>
                                        打款给：
                                    </td>
                                    <td>
                                        <FormItem
                                            key="recipientType"
                                        >
                                            {
                                                getFieldDecorator('recipientType', {
                                                    initialValue: recipientType
                                                })(
                                                    <span>{recipientType === 1 ? '分公司' : '服务商'}</span>
                                                    )
                                            }
                                        </FormItem>
                                    </td>
                                </tr>
                            }
                            <tr>
                                <td>
                                    开户行：
                                </td>
                                <td>
                                    {
                                        uiType === 1 &&
                                        <FormItem
                                            key="openBank"
                                        >
                                            {
                                                getFieldDecorator('openBank', {
                                                    initialValue: openBank
                                                })(
                                                    <span>{openBank}</span>
                                                    )
                                            }
                                        </FormItem>
                                    }
                                </td>
                                <td>
                                    账号：
                                </td>
                                <td>
                                    {
                                        uiType === 1 &&
                                        <FormItem
                                            key="account"
                                        >
                                            {
                                                getFieldDecorator('account', {
                                                    initialValue: account
                                                })(
                                                    <span>{account}</span>
                                                    )
                                            }
                                        </FormItem>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>是否有二次请款：</td>
                                <td>
                                    <FormItem
                                        key="secondCashout"
                                    >
                                        {
                                            getFieldDecorator('secondCashout', {
                                                initialValue: secondCashout,
                                                rules: [
                                                    { required: true, message: '请选择是否有二次请款', },
                                                ],
                                            })(
                                                edit === true ?
                                                    <RadioGroup value={secondCashout} onChange={e => this.secondCashoutChange(e)}>
                                                        <Radio value={1}>是</Radio>
                                                        <Radio value={0}>否</Radio>
                                                    </RadioGroup>
                                                    :
                                                    <span>{secondCashout === 1 ? '是' : '否'}</span>
                                                )
                                        }
                                    </FormItem>
                                </td>
                                {/* <td>财务计划支付时间：</td>
                                <td>
                                    <FormItem
                                        key="financePlanPayTime"
                                    >
                                        {
                                            getFieldDecorator('financePlanPayTime', {
                                                initialValue: financePlanPayTime ? moment(financePlanPayTime) : '',
                                                rules: [
                                                    { required: true, message: '财务计划支付时间', },
                                                ],
                                            })(
                                                edit === true ?
                                                    <DatePicker {...this.datePickerTimeProps() } />
                                                    :
                                                    <span>
                                                    {financePlanPayTime ? moment(financePlanPayTime * 1000).format('YYYY-MM-DD HH:mm') : ''}
                                                    </span>
                                                )
                                        }
                                    </FormItem>
                                </td> */}
                                <td></td>
                                <td></td>
                            </tr>
                            {secondCashout === 1 && <tr>
                                <td>
                                    二次请款收款方姓名：
                                </td>
                                <td>
                                    <FormItem
                                        key="secondCashout"
                                    >
                                        {
                                            edit === true ?
                                                getFieldDecorator('secondCashoutPayeeId', {
                                                    initialValue: secondCashoutPayeeId,
                                                    rules: [
                                                        { required: true, message: '请选择二次请款收款方姓名', },
                                                    ],
                                                })(
                                                    <Select placeholder="请选择" onChange={(value) => this.secondCashoutNameSourceChange(value)}>
                                                        {secondCashoutNameSource && secondCashoutNameSource.toJS().map(({ name, id }) => <Option value={id}>{name}</Option>)}
                                                    </Select>

                                                    )
                                                :
                                                getFieldDecorator('secondCashoutPayeeId', {
                                                    initialValue: secondCashoutPayeeId,
                                                })(
                                                    <span>{secondCashoutPayeeName}</span>
                                                    )
                                        }
                                    </FormItem>
                                </td>
                                <td>
                                    二次请款收款方备注：
                                        </td>
                                <td>
                                    <FormItem
                                        key="secondCashoutRemark"
                                    >
                                        {
                                            getFieldDecorator('secondCashoutRemark', {
                                                initialValue: secondCashoutRemark
                                            })(
                                                <span>{secondCashoutRemark || '/'}</span>
                                                )
                                        }
                                    </FormItem>
                                </td>
                            </tr>}
                            {secondCashout === 1 && <tr>
                                <td>
                                    二次请款收款方开户行：
                                        </td>
                                <td>
                                    <FormItem
                                        key="secondCashoutOpenBank"
                                    >
                                        {
                                            getFieldDecorator('secondCashoutOpenBank', {
                                                initialValue: secondCashoutOpenBank
                                            })(
                                                <span>{secondCashoutOpenBank || '/'}</span>
                                                )
                                        }
                                    </FormItem>
                                </td>
                                <td>
                                    二次请款收款方账号：
                                        </td>
                                <td>
                                    <FormItem
                                        key="secondCashoutAccount"
                                    >
                                        {
                                            getFieldDecorator('secondCashoutAccount', {
                                                initialValue: secondCashoutAccount
                                            })(
                                                <span>{secondCashoutAccount || '/'}</span>
                                                )
                                        }
                                    </FormItem>
                                </td>
                            </tr>}
                            {uiType === 1 && <tr>
                                <td>
                                    客服对外约定付款截止日：
                                </td>
                                <td>
                                    <FormItem
                                        key="promiseDeadline"
                                    >
                                        {
                                            getFieldDecorator('promiseDeadline', {
                                                initialValue: moment(promiseDeadline)
                                            })(
                                                <span>{promiseDeadline}</span>
                                                )
                                        }
                                    </FormItem>
                                </td>
                                <td>
                                    客服计划付款截止日：
                                </td>
                                <td>
                                    <FormItem
                                        key="cashoutDeadline"
                                    >
                                        {
                                            getFieldDecorator('cashoutDeadline', {
                                                initialValue: cashoutDeadline ? moment(cashoutDeadline) : '',
                                                rules: [
                                                    { required: true, message: '请选择本次请款付款截至日期', },
                                                ],
                                            })(
                                                edit === true ?
                                                    <DatePicker {...this.datePickerTimeProps() } />
                                                    :
                                                    <span>
                                                        {cashoutDeadline ? moment(cashoutDeadline * 1000).format('YYYY-MM-DD HH:mm') : ''}
                                                    </span>
                                                )
                                        }
                                    </FormItem>
                                </td>

                            </tr>}
                        </table>
                    </Form>
                </Card>
            </div>
        )

    }
}
const PayeeInfoCreatForm = Form.create({
    mapPropsToFields: (props) => {
        
    }
})(PayeeInfoForm);
/**
 * 收款方信息
 */
export class PayeeInfo extends React.Component<PayeeInfoProps, any> {
    constructor(props) {
        super(props);
    }
    payeeInfoCreatForm;
    validate = () => {
        let result;
        this.payeeInfoCreatForm.validateFieldsAndScroll((err, values) => {
            if (err) {
                result = false;
            }
            else {
                result = values;
            }
            return;
        });
        return result;
    }
    render() {
        return <PayeeInfoCreatForm {...this.props} ref={node => this.payeeInfoCreatForm = node} />
    }
}




interface PaymentscheduleProps {
    billStatus: number;
    updateParams?: (any) => void;
    paymentscheduleDataSource: any;
    advancedetailsDataSource?: any;
    isEdit?: boolean;
    uploading?: any;
    paymentscheduleTotal: any;
    advancedetailsTotal?: any;
    // wsss?: Array<wss>;
    poll?: (index: number, data: any, triggerStart?: boolean) => void;
    clearData?: any;
    recordUrl?: any;
    orderCode?: string | number;
    task1?: boolean;
    task2?: boolean;
    tableloading1?: boolean;
    tableloading2?: boolean;              
}

/**
 * 付款清单
 */
export class Paymentschedule extends React.Component<PaymentscheduleProps, any> {
    constructor(props) {
        super(props);
    }
    billStatusChange = (e) => {
        const value = e.target.value;
        const {
            updateParams,
            // wsss,
            task1,
            clearData,
        } = this.props;
        // const {
        //     loading
        // } = wsss![1];
        if (value === 1) {
            if (task1) {
                Modal.info({
                    title: '提示',
                    content: (
                        <div>
                            当前有正在导入的垫款明细，请等待导入完成后再进行操作
                        </div>
                    ),
                    okText: '我知道了',
                });
                return;
            }

            Modal.confirm({
                title: '提示',
                content: (
                    <div>
                        如选择无垫款，则已上传的垫款明细数据将会被清除，是否继续？
                    </div>
                ),
                onOk: () => {
                    updateParams!({
                        billStatus: value
                    });
                    clearData(2);
                },
                okText: '确定',
                cancelText: '取消',
            });
        }
        else {
            updateParams!({
                billStatus: value
            });
        }
    }
    dropdownClearData = (callback) => {
        Modal.confirm({
            title: '提示',
            content: (
                <div>
                    是否确认清除该数据？
                </div>
            ),
            onOk: () => {
                callback();
            },
            okText: '确定',
            cancelText: '取消',
        });
    }
    dropdownMenu = ({ index, taskloading, clearData }) => {
        return (
            <Menu>
                <Menu.Item key="0" disabled={taskloading}>
                    <span onClick={e => { if (taskloading) { return; }; this.dropdownClearData(() => clearData(index)) }}>清除数据</span>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link to={this.props.recordUrl}>查看导入记录</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <a href={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/downloadTemplate?type=${index}`}  >下载导入模板</a>
                </Menu.Item>
            </Menu>
        )
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     nextProps = nextProps || {};
    //     nextState = nextState || {};
    //     const thisProps = this.props || {};
    //     const thisState = this.state || {};
    //     const is = Immutable.is;
    //     if (
    //         Object.keys(thisProps).length !== Object.keys(nextProps).length
    //         ||
    //         Object.keys(thisState).length !== Object.keys(nextState).length) {
    //         return true;
    //     }
    //     for (const key in nextProps) {
    //         if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
    //             return true;
    //         }
    //     }
    //     for (const key in nextState) {
    //         if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    /**计算total */
    totalCalc = () => {
        const {
            billStatus,
            paymentscheduleTotal,
            advancedetailsTotal,
        } = this.props;
        if (billStatus === 1) {
            return formatMoney(paymentscheduleTotal.get('total'), 2, '');
        }
        else {
            return formatMoney(accAdd(paymentscheduleTotal.get('total') || 0, advancedetailsTotal.get('total') || 0), 2, '');
        }

    }
    
    render() {
        const {
            isEdit,
            billStatus,
            paymentscheduleDataSource,
            advancedetailsDataSource,
            uploading,
            paymentscheduleTotal,
            advancedetailsTotal,
            clearData,
            task1,
            task2,
            // wsss,
            poll,
            orderCode,
            tableloading1,
            tableloading2,
        } = this.props;
        // const wss1 = wsss && wsss[0];
        // const wss2 = wsss && wsss[1];
        let total = this.totalCalc();
        
        return (
            <div key='paymentschedule' className="cashoutApprove">
                <Card className="card" key="card-3" title="付款清单（客户维度）">
                    <div>
                        {
                            isEdit ?
                                <RadioGroup key="billStatus" value={billStatus} className="radio-group" onChange={(e) => this.billStatusChange(e)}>
                                    <RadioButton value={1} key="1" >无垫款</RadioButton>
                                    <RadioButton value={2} key="2">有垫款</RadioButton>
                                </RadioGroup>
                                :
                                <span className='billStatus'>{billStatus === 1 ? '无垫款' : '有垫款'}</span>
                        }

                        <section className="table-wrap" key="section-1">
                            <PaymentscheduleTable
                                dataSource={paymentscheduleDataSource}
                                key="PaymentscheduleTable-1"
                                total={paymentscheduleTotal}
                                tableloading={tableloading1}
                                keyid="PaymentscheduleTable-1"
                                title={
                                    () => <header className="title">
                                        <h4>付款清单（客户维度）</h4>
                                        {
                                            isEdit && <span>
                                                <Upload  {...uploadProps({ poll: poll!, index: 1, uploading, orderCode, }) } disabled={task1}>
                                                    <Button type="primary" icon="cloud-upload" loading={task1}>
                                                        {task1 === true ? '导入中...（客户维度）' : '导入（客户维度）'}
                                                    </Button>
                                                </Upload>
                                                <Dropdown overlay={this.dropdownMenu({ index: 1, taskloading: task1, clearData })} trigger={['click']}>
                                                    <a className="ant-dropdown-link dropdown-menu" href="#">
                                                        更多操作 <Icon type="down" />
                                                    </a>
                                                </Dropdown>
                                            </span>
                                        }
                                    </header>
                                } />
                        </section>
                        {
                            billStatus === 2 && <section className="table-wrap" key="section-2">
                                <AdvanceTable
                                    key="PaymentscheduleTable-2"
                                    dataSource={advancedetailsDataSource}
                                    total={advancedetailsTotal}
                                    tableloading={tableloading2}
                                    keyid="PaymentscheduleTable-2"
                                    title={() =>
                                        <header className="title">
                                            <h4>垫款明细</h4>
                                            {
                                                isEdit && <span>
                                                    <Upload  {...uploadProps({ poll: poll!, index: 2, uploading, orderCode }) } disabled={task2}>
                                                        <Button type="primary" icon="cloud-upload" loading={task2}>
                                                            {task2 === true ? '导入中...（垫款明细）' : '导入（垫款明细）'}
                                                        </Button>
                                                    </Upload>
                                                    <Dropdown overlay={this.dropdownMenu({ index: 2, taskloading: task2, clearData })} trigger={['click']}>
                                                        <a className="ant-dropdown-link dropdown-menu" href="#">
                                                            更多操作 <Icon type="down" />
                                                        </a>
                                                    </Dropdown>
                                                </span>
                                            }
                                        </header>
                                    } />
                            </section>
                        }
                        <Row type="flex" justify="end">
                            <span className="price-total">
                                总计：<strong >¥&nbsp;{total}</strong>
                            </span>
                        </Row>
                    </div>

                </Card>
            </div>
        )

    }
}


interface PaymentbillProps {
    paymentbillDataSource: any;
    isEdit?: boolean;
    uploading?: (any) => void;
    paymentbillTotal: any;
    // wsss?: Array<wss>;
    poll?: (index: number, data: any, triggerStart?: boolean) => void;
    task3?: boolean;
    tableloading?: boolean;
    clearData?: any;
    recordUrl?: string;
    orderCode?: string | number;
}
/**
 * 付款账单
 */
export class Paymentbill extends React.Component<PaymentbillProps, any> {
    constructor(props) {
        super(props);
    }
    dropdownClearData = (callback) => {
        Modal.confirm({
            title: '提示',
            content: (
                <div>
                    是否确认清除该数据？
                </div>
            ),
            onOk: () => {
                callback();
            },
            okText: '确定',
            cancelText: '取消',
        });
    }
    dropdownMenu = ({ index, taskloading, clearData }) => {
        return (
            <Menu>
                <Menu.Item key="0" disabled={taskloading}>
                    <span onClick={e => { if (taskloading) { return; }; this.dropdownClearData(() => clearData(index)) }}>清除数据</span>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link to={this.props.recordUrl!}>查看导入记录</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <a href={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/downloadTemplate?type=${index}`}  >下载导入模板</a>
                </Menu.Item>
            </Menu>
        )
    }
    totalCalc = () => {
        const {
            paymentbillTotal,
        } = this.props;
       
        return formatMoney(paymentbillTotal.get('total'), 2, '');
        
    }
    render() {
        const {
            paymentbillDataSource,
            uploading,
            isEdit,
            paymentbillTotal,
            // wsss,
            poll,
            clearData,
            orderCode,
            task3,
            tableloading,
        } = this.props;
        // const wss3 = wsss && wsss[0];
        return (
            <div key='paymentbill' className="cashoutApprove">
                <Card className="card" key="card-4" title="付款账单（人月次维度明细表）">
                    <div>
                        <section className="table-wrap" key="section-1">
                            <PaymentbillsTable
                                dataSource={paymentbillDataSource}
                                tableloading={tableloading}
                                total={paymentbillTotal}
                                title={
                                    () => <header className="title">
                                        <h4></h4>
                                        {
                                            isEdit && <span>
                                                <Upload  {...uploadProps({ poll: poll!, index: 3, uploading: uploading!, orderCode, }) } disabled={task3}>
                                                    <Button type="primary" icon="cloud-upload" loading={task3}>
                                                        {task3 === true ? '导入中...（人月次维度明细表）' : '导入（人月次维度明细表）'}
                                                    </Button>
                                                </Upload>
                                                <Dropdown overlay={this.dropdownMenu({ index: 3, taskloading: task3, clearData })} trigger={['click']}>
                                                    <a className="ant-dropdown-link dropdown-menu" href="#">
                                                        更多操作 <Icon type="down" />
                                                    </a>
                                                </Dropdown>
                                            </span>
                                        }
                                    </header>
                                } />
                        </section>
                        <Row type="flex" justify="end">
                            <span className="price-total">
                                总计：<strong>¥&nbsp;{formatMoney(paymentbillTotal.get('total'),2,'')}</strong>
                            </span>
                        </Row>
                    </div>
                </Card>
            </div>
        )
    }
}


interface CashoutApproveRecordsProps {
    dataSource: any;
}
interface CashoutApproveRecordsStates {
    rejectReasonData: rejectReasonData | any;
    prove: string;
    visible: boolean;
    proveVisible: boolean;
}
/**
 * 请款记录
 */
export class CashoutApproveRecords extends React.Component<CashoutApproveRecordsProps, CashoutApproveRecordsStates> {
    constructor(props) {
        super(props);
        this.state = {
            rejectReasonData: '',
            prove: '',
            proveVisible: false,
            visible: false,
        }
    }
    columns = [
        {
            title: '时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
            render: (text) => moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '操作人',
            dataIndex: 'userDetail',
            key: 'userDetail',
            width: 200,
            render: (text, records, index) => {
                return (records.hasShow ? <a href="" onClick={e => { e.preventDefault(); this.personInfo(text) }}>{text.name}（{text.positionString}）</a> : <span>{text.positionString}</span>)

            },
        },
        {
            title: '操作内容',
            key: 'hanldContent',
            render: (text, records, index) => {
                const {
                    verifyStatus,
                    operatorContent,
                    jsSpAccessoryFileList,
                    jsSpPayDetail,
                    rejectReason,
                } = records;
                if (verifyStatus === 2) {
                    const rejectReasonData: rejectReasonData = {
                        reason: rejectReason,
                        files: jsSpAccessoryFileList.map(({ name, url }) => (
                            {
                                name,
                                link: url,
                            }
                        )),
                    }

                    return (<span>
                        {operatorContent}<a href="" onClick={e => this.rejectReason(e, rejectReasonData)}>查看驳回原因</a>
                    </span>)
                }
                else if (verifyStatus === 3) {
                    return (<span>
                        {operatorContent}{jsSpAccessoryFileList[0].url && <a href="" onClick={e => this.showProve(e, jsSpAccessoryFileList[0].url)}>查看打款证明图片</a>}
                    </span>)
                }
                else if (verifyStatus === 4) {
                    return (<span>
                        {operatorContent}  {jsSpAccessoryFileList[0].url && <a href="" onClick={e => this.showProve(e, jsSpAccessoryFileList[0].url)}>查看打款证明图片</a>}
                    </span>)
                }
                else {
                    return (<span>
                        {operatorContent}
                    </span>)
                }
            }
        }
    ]
    personInfo = (userDetail) => {
        Modal.info({
            width: 520,
            okText: "我知道了",
            title: `${userDetail.userName} | JY${userDetail.employeeNumber}`,
            iconType:"none",
            content: <div>
                <Row>
                    <Col span={12} key="1">
                        <FormItem {...modalFormItemLayout} label="手机">
                            {userDetail.phone}
                        </FormItem>
                    </Col>
                    <Col span={12} key="2">
                        <FormItem {...modalFormItemLayout} label="邮箱">
                            {userDetail.email}
                        </FormItem>
                    </Col>
                    <Col span={12} key="3">
                        <FormItem {...modalFormItemLayout} label="职位">
                            {userDetail.positionString}
                        </FormItem>
                    </Col>
                    <Col span={12} key="4">
                        <FormItem {...modalFormItemLayout} label="部门">
                            {userDetail.organizationName}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        })
    }
    rejectReason = (e, rejectReasonData) => {
        e.preventDefault();
        this.setState({
            rejectReasonData,
            visible: true,
        });
    }
    showProve = (e, url) => {
        e.preventDefault();
        this.setState({
            prove: url,
            proveVisible: true,
        });
    }
    hideProve = () => {
        this.setState({
            proveVisible: false,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const {
            dataSource,
        } = this.props;
        const {
            visible,
            rejectReasonData,
            prove,
            proveVisible,
        } = this.state;
        return (
            <div key='cashoutApproveRecords' className="cashoutApprove">
                <Card className="card" key="card-5" title="请款记录">
                    <Table
                        columns={this.columns}
                        dataSource={dataSource}
                        pagination={false}
                        scroll={{ y: 300 }}
                        className="overflow-x-scroll"
                    />
                </Card>
                <Modal
                    key="rejectReasonData"
                    visible={this.state.visible}
                    closable={false}
                    footer={(<Button type="primary" onClick={this.handleCancel}>我知道了</Button>)}
                >
                    <RejectReason rejectReasonData={rejectReasonData} />
                </Modal>
                <Modal
                    width={700}
                    key="prove"
                    visible={this.state.proveVisible}
                    closable={false}
                    footer={(<Button type="primary" onClick={this.hideProve}>我知道了</Button>)}
                >
                    <img alt="打款证明图片" style={{ width: '100%' }} src={prove} />
                </Modal>
            </div>
        )
    }
}


interface ApprovalCommentsProps {
    approvalPersonDataSource: any; /* 审批人 */
    role: number; /* 角色控制，1 ：业务 2：财务, 3: CEO */
    values?: {
        payTime?: string | number /* 计划支付时间 */
        advancedMoney?: string | number /* 垫款金额 */
        userInfo?: any /**当前登录人信息 */
    }
    form?: any;
    loading: boolean;
    submit: (e) => void;
}
interface ApprovalCommentsState {
    approvalStatus: number;
}
/**
 * 审批意见
 */

class ApprovalCommentsForm extends React.Component<ApprovalCommentsProps & FormComponentProps, ApprovalCommentsState> {
    static defaultProps = {
        values: {},
    }
    constructor(props:ApprovalCommentsProps & FormComponentProps) {
        super(props)
        this.state = {
            approvalStatus: -1, /*审批意见， 1：通过，2：驳回 */
        };
    }
    private roleParams = {
        1: {
            button1: '确认并提交',
            button2: '确定并提交'
        },
        2: {
            button1: '确认并提交给 CEO 审批',
            button2: '确定并提交',
            button3: '确认并提交给 CSO 审批',
        },
        3: {
            button1: '确认并提交给财务付款',
            button2: '确定并提交',
            button3: '确认并提交给 CEO 审批',
        },
    }
    cascaderProps: (params: { value?: any; options: any }) => any = ({ value, options }) => {
        let props: any = {
            className: "cascader",
            options,
            placeholder: "请选择",
            showSearch: true,
            
        };
        if (value) {
            props.value = value;
        }
        return props;
    }
    cascaderCheck = (rule, value, callback) => {
        if (!value || (value && value.length <= 0)) {
            return callback('请选择下一位审批人');
        }
        callback()
    }
    rejectReasonCheck = (rule, value, callback) => {
        if (!value || !value.trim()) {
            return callback('请填写驳回原因');
        }
        if (value.length > 500) {
            return callback('请款驳回原因需控制在500字以内');
        }
        callback();
    }
    remarkCheck = (rule, value, callback) => {
        if (value && value.trim().length > 500) {
            return callback('备注控制在500字以内');
        }
        callback();
    }
    paytimeProps = () => {
        let props: {
            style: any;
            // showTime: any;
            // disabledTime: any;
            disabledDate: any;
            format: string;
            value?: moment.Moment;
        } = {
                style: { width: 200 },

                format: 'YYYY-MM-DD',
                // showTime: { defaultValue: moment('00:00', 'HH:mm') },
                // disabledTime: () => ({
                //     disabledMinutes: () => range(1, 60),
                //     disabledSeconds: () => range(1, 60),
                // }),
                disabledDate: (current) => {
                    return (current && new Date(current.format('YYYY-MM-DD')).getTime() < new Date(moment().format('YYYY-MM-DD')).getTime());
                }
            }
        return props;
    };

    normFile = (e, c) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    /* 上传文件的缓存 */
    private fileList = [];
    attachmentUploadProps = (_self) => {
        const form = this.props.form;
        const props: any = {
            name: "file",
            action: `${DOMAIN_OXT}/apiv4_/v1/sppayu/upload/file`,
            accept: '.xls,.xlsx,.csv,.jpg,.jpeg,.bmp,.gif,.png',
            listType: "text",
            beforeUpload: (file) => {
                const attachmentLength = this.props.form.getFieldValue('attachment');
                if (attachmentLength && attachmentLength.length >= 10) {
                    message.error('上传图片数量限制为10张');
                    return false;
                }
                const types = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/bmp', 'image/png', 'image/gif', 'image/jpeg',];
                const isLt8M = file.size / 1024 / 1024 < 8;
                if (!isLt8M) {
                    message.error('上传的附件大小不超过8Mb');
                    return false;
                }
                if (types.indexOf(file.type) === -1) {
                    message.error('上传的附件格式支持 .jpg、.jpeg、.bmp、.gif、.png、.xls、.xlsx');
                    return false;
                }
            },
            onRemove: (file) => {
                const deleteUid = file.uid;
                const copyFileList = Object.assign([], _self.fileList);
                let deletIndex: number | null = null;
                // for (let [index, { uid }] of copyFileList) {
                //     if (uid === deleteUid) {
                //         deletIndex = index;
                //         break;
                //     }
                // }
                for (let i = 0, l = copyFileList.length; i < l; i++) {
                    let uid = copyFileList[i].uid;
                    if (uid === deleteUid) {
                        deletIndex = i;
                        break;
                    }
                }
                if (deletIndex !== null) {
                    copyFileList.splice(deletIndex, 1);
                    _self.fileList = copyFileList;
                    return true;
                }
                return false;
            },
            onSuccess: (response, file) => {
                const {
                    uid,
                    name,
                } = file;
                const {
                    msg,
                    status,
                    errcode,
                    errmsg,
                    data,
                } = response;
                const {
                    ossKey
                } = data;
                if (Number(status === 0) || Number(errcode === 0)) {
                    const file = {
                        uid,
                        name,
                        status: 'done',
                        ossKey: ossKey,
                    };
                    _self.fileList.push(file);
                }
                else {
                    const file = {
                        uid,
                        name,
                        status: 'error',
                        response: errmsg,
                    };
                    _self.fileList.push(file);
                }
                this.props.form.setFields({
                    attachment: {
                        value: _self.fileList,
                    },
                });
            },
        }
        return props
    }
    selectRole = () => {
        const {
            approvalPersonDataSource,
            role,
            values,
            form,
            loading,
            submit,
        } = this.props;
        const {
            approvalStatus,
        } = this.state
        const { getFieldDecorator } = form;
        const { payTime,advancedMoney,userInfo } = values!;
        const button = this.roleParams[role];
        let buttonText = approvalStatus !== 2 ? button.button1 : button.button2;
        /**
         * 审批通过
         */
        if(approvalStatus == 1 || approvalStatus == -1){
            /**
             * 如果该请款单的“垫款金额=0”，则“提交给下一位审批人”为：CEO 
             * 如果该请款单的“垫款金额≠0”，则“提交给下一位审批人”为：CSO
             */
            if(role ==2){
                buttonText = advancedMoney ? button.button3 : button.button1;
            }
    
            if(role == 3) { 
                /**
                 * CSO 提交给下一位审批人”为：CEO 
                 * CEO 提交给下一位审批人”为：财务
                 */
                const positionString = userInfo.positionString;
                buttonText = positionString == 'CSO'? button.button3 : button.button1;
            }
        }
       
        const ApprovalStatusFormItem = <FormItem
            key="approvalStatus"
            {...formItemLayout}
            label="审批意见"
        >
            {
                getFieldDecorator('approvalStatus', {
                    rules: [
                        { required: true, message: '请选择审批意见', },
                    ],
                })(
                    <RadioGroup onChange={(e: any) => this.setState({ approvalStatus: e.target.value })}>
                        <Radio value={1}>通过</Radio>
                        <Radio value={2}>驳回</Radio>
                    </RadioGroup>
                    )
            }
        </FormItem>
        const approvalPersonDataHandle =()=>{
            let approvalPersonDate = approvalPersonDataSource.toJS();
            if(approvalPersonDate.length>0){
                /* 1 ：业务 2：财务, 3: CEO */
               
                switch (role) {
                    case 1:
                        // 请款单审批只能给 客服经理 或 客服总监 或财务部
                        // 客服经理 
                        var customerManager = approvalPersonDate.find(function(value, index, arr) {
                            return value.label == "客服经理";
                        });
                        // 客服总监
                        var customerDirector = approvalPersonDate.find(function(value, index, arr) {
                            return value.label == "客服总监";
                        })
                        // 财务部
                        var finance = approvalPersonDate.find(function(value, index, arr) {
                            return value.label == "财务部";
                        })
                        return [customerManager,customerDirector,finance];
                    case 2:
                        /**
                         * 如果该请款单的“垫款金额=0”，则“提交给下一位审批人”为：CEO 
                         * 如果该请款单的“垫款金额≠0”，则“提交给下一位审批人”为：CSO
                         */
                        if(advancedMoney){
                            return [approvalPersonDate.find(function(value, index, arr) {
                                return value.label == "CSO";
                            })]
                           
                        }else{
                            return [approvalPersonDate.find(function(value, index, arr) {
                                return value.label == "CEO";
                            })]
                        }
                    case 3:
                        // 提交给下一位审批人”为：CEO
                        return [approvalPersonDate.find(function(value, index, arr) {
                            return value.label == "CEO";
                        })]
                    default:
                        return approvalPersonDate;
                }
                
            }
            return approvalPersonDate;
            
        }

        /* 1 ：业务 2：财务, 3: CEO */
        return (
            <div>
                <Form className="form-1" key="form-1">
                    {ApprovalStatusFormItem}
                    {
                        role === 1 && approvalStatus === 1 &&
                        <FormItem
                            key="approvalPerson"
                            {...formItemLayout}
                            label="提交给下一位审批人"
                        >
                            {
                                getFieldDecorator('approvalPerson', {
                                    rules: [
                                        { required: true, validator: this.cascaderCheck },
                                    ],
                                })(
                                    <Cascader {...this.cascaderProps({ options: approvalPersonDataHandle() }) } style={{ width: 300 }} />
                                    )
                            }
                        </FormItem>
                    }
                    {
                        role !== 1 && approvalStatus === 1 &&
                        <FormItem
                            key="paytime"
                            {...formItemLayout}
                            label="财务计划支付时间"
                        >
                            {
                                getFieldDecorator('paytime', {
                                    rules: [
                                        { required: true, message: '请选择计划支付时间', },
                                    ],
                                    initialValue: payTime ? moment(Number(payTime) * 1000) : '',
                                })(

                                    <DatePicker {...this.paytimeProps() } />
                                    )
                            }
                        </FormItem>
                    }
                    {
                        approvalStatus === 1 &&
                        <FormItem
                            key="remark"
                            {...formItemLayout}
                            label="备注"
                        >
                            {
                                getFieldDecorator('remark', {
                                    rules: [
                                        { validator: this.remarkCheck },
                                    ],
                                })(
                                    <TextArea />
                                    )
                            }
                        </FormItem>
                    }
                    {
                        approvalStatus === 2 &&
                        <FormItem
                            key="rejectReason"
                            {...formItemLayout}
                            label="驳回原因"
                        >
                            {
                                getFieldDecorator('rejectReason', {
                                    rules: [
                                        { required: true, validator: this.rejectReasonCheck },
                                    ],
                                })(
                                    <TextArea />
                                    )
                            }
                        </FormItem>
                    }
                    {
                        role === 2 && approvalStatus === 2 &&
                        <FormItem
                            key="attachment"
                            {...formItemLayout}
                            label="附件"
                            extra="最多允许上传10个附件，上传的附件格式支持 .jpg、.jpeg、.bmp、.gif、.png、.xls、.xlsx，大小不超过8Mb"
                        >
                            {getFieldDecorator('attachment', {
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normFile,
                                initialValue: [],
                            })(
                                <Upload {...this.attachmentUploadProps(this) }>
                                    <Button>
                                        <Icon type="upload" /> 上传附件
                                </Button>
                                </Upload>
                                )}
                        </FormItem>
                    }
                </Form>
                <Row type="flex" justify="center">
                    <Button className="submit" type="primary" loading={loading} onClick={(e) => !loading&&submit(e)} style={{ marginTop: 20 }}>
                        {buttonText}
                    </Button>
                </Row>
            </div>


        )
    }
    render() {
        const form = this.selectRole()
        return (
            <div key="selectRoleForm">
                {form}
            </div>
        )
    }
}
const ApprovalCommentsFormReactNode = Form.create<ApprovalCommentsProps>()(ApprovalCommentsForm) as any;
export class ApprovalComments extends React.Component<ApprovalCommentsProps, ApprovalCommentsState> {
    constructor(props) {
        super(props);
    }
    approvalCommentsFormReactNode;
    validate = () => {
        let result = false;
        this.approvalCommentsFormReactNode.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            const {
                attachment
            } = values;
            if (attachment) {
                for (let { status } of attachment.values()) {
                    if (status === 'error') {
                        return;
                    }
                }
                // for (let i = 0, l = attachment.length; i < l; i++) {
                //     let status = attachment[i].status;
                //     if (status === 'error') {
                //         return;
                //     }
                // }
            }
            result = values;
        });
        return result;
    }
    render() {
        const {
            role,
            approvalPersonDataSource,
            values,
            submit,
            loading,
        } = this.props;
        return (
            <div key="ApprovalComments" className="cashoutApprove">
                <ApprovalCommentsFormReactNode
                    approvalPersonDataSource={approvalPersonDataSource}
                    role={role}
                    values={values}
                    ref={node => this.approvalCommentsFormReactNode = node}
                    submit={submit}
                    loading={loading}
                />
            </div>
        )
    }
}


