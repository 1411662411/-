import React from 'react';
import { Card, DatePicker, Radio, Form, Input, message } from 'antd';
import TableUI from '../../Table';
import NumberUI from '../../common/InputNumber';
import ScrollNumber from 'antd/lib/badge/ScrollNumber';

const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
class PaymentInfo extends React.Component<any,any>{
    constructor(props) {
        super(props);
        this.state={
            dataSource: [],
        }
    }

    renderFormItem = (label, name, initialValue, component, length=100) => {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const formItemLayout={
            labelCol: {
                xs: {span:0},
            },
            wrapperCol: {
            xs: { span: 24 },
            },
        }
        return <Form.Item
            {...formItemLayout}
            label={label}
        >
            {getFieldDecorator(name, {
                // normalize:(value) => {
                //     return value.trim();
                // },
                rules: [{ 
                    validator:(rule, value, callback) =>{
                        if(name === 'socialNature' || name === 'existNoDetail'){
                            this.onChange();
                        }
                        callback();
                    },
                    required: false,
                }],
                validateFirst: true,
                initialValue,
            })(
                component
            )}
        </Form.Item>
    }

    dataSource = [
        [
            {
                label: '社保缴费月（操作月）',
                value: this.renderFormItem('社保缴费月（操作月）', 'socialMonth', undefined, <MonthPicker />),
            },
            {
                label: '社保业务请款性质',
                value: this.renderFormItem('社保业务请款性质', 'socialNature', 1, <RadioGroup>
                    <Radio value={1}>实付请款</Radio>
                    <Radio value={2}>预付请款</Radio>
                </RadioGroup>),
            },
            {
                label: '是否为内部员工的请款',
                value: this.renderFormItem('是否为内部员工的请款', 'isT', 0, <RadioGroup>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                </RadioGroup>),
            },
        ],
        [
            {
                label: '社保缴费月（操作月）',
                value: this.renderFormItem('社保缴费月（操作月）', 'socialMonth', undefined, <MonthPicker />),
            },
            {
                label: '社保业务请款性质',
                value: this.renderFormItem('社保业务请款性质', 'socialNature', 2, <RadioGroup>
                    <Radio value={1}>实付请款</Radio>
                    <Radio value={2}>预付请款</Radio>
                </RadioGroup>),
            },
            {
                label: '预请款中是否存在无明细的请款款项',
                value: this.renderFormItem('预请款中是否存在无明细的请款款项', 'existNoDetail', 0, <RadioGroup>
                    <Radio value={1} key="1"><span className='text-error'>存在无明细款项</span></Radio>
                    <Radio value={0} key="0">不存在无明细款项</Radio>
                </RadioGroup>),
            },
        ],
        [
            {
                label: '社保缴费月（操作月）',
                value: this.renderFormItem('社保缴费月（操作月）', 'socialMonth', undefined, <MonthPicker />),
            },
            {
                label: '社保业务请款性质',
                value: this.renderFormItem('社保业务请款性质', 'socialNature', 2, <RadioGroup>
                    <Radio value={1}>实付请款</Radio>
                    <Radio value={2}>预付请款</Radio>
                </RadioGroup>),
            },
            {
                label: '预请款中是否存在无明细的请款款项',
                value: this.renderFormItem('预请款中是否存在无明细的请款款项', 'existNoDetail', 1, <RadioGroup>
                    <Radio value={1} key="1"><span className='text-error'>存在无明细款项</span></Radio>
                    <Radio value={0} key="0">不存在无明细款项</Radio>
                </RadioGroup>),
            },
            {
                label: '无明细款项金额',
                value: this.renderFormItem('无明细款项金额', 'noDetailAmount', 0, <NumberUI 
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
                        }else{
                        }
                    },
                }}
                addonAfter='元'
            />),
            },
            {
                label: '无明细款项备注说明',
                value: this.renderFormItem('无明细款项备注说明', 'noDetailRemark', '', <Input.TextArea 
                    rows={3}
                /> ),
            },
        ],

    ];

    onChange = () => {
        const {form} = this.props;
        const socialNature = form.getFieldValue('socialNature');
        let dataSource:any ;
        if(Number(socialNature) === 2){
            const existNoDetail = form.getFieldValue('existNoDetail');
            if(Number(existNoDetail) === 1){
                dataSource = this.dataSource[2];
            }else{
                dataSource = this.dataSource[1];
            }
        }else{
            dataSource = this.dataSource[0];
        }
        console.log(2);
        this.setState({
            dataSource,
        })
    }
    
    componentDidMount(){
        this.onChange();
    }
    public render() {
        const {form} = this.props;
        const {dataSource} = this.state;
        return <Card>
        <TableUI 
            dataSource={dataSource}
            colgroup={[15,35,20,30]}
        />
    </Card>
    }
}

export default PaymentInfo;