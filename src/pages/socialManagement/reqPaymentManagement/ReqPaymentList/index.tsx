import React from 'react';
import {Form, Row, Col, Icon, Input, Button, DatePicker, Select, Table} from 'antd';

import { FormComponentProps } from 'antd/lib/form';

import WhiteSpace from '../../../../components/common/WhiteSpace';

import {Pagination} from '../../../../util/crmUtil';

const {RangePicker, MonthPicker} = DatePicker;
const FormItem = Form.Item;

interface TesProps{
    children: () => string;
}
class Tes extends React.Component<TesProps,any>{
    constructor(props) {
        super(props);
        
    }
    static a = 123;
    b=321;
    componentDidMount(){
        console.log(new Array());
    }
    render(){
        return this.props.children()
    }
}
class ReqPaymentList extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state={
            total: 0,
            current: 0,
            pageSize: 0,
        }
    }
    
    getList = (current, pageSize) => {

    }
    render(){
        const pagination = new Pagination({
            onChange:this.getList,
            onShowSizeChange: this.getList,
            total: this.state.total,
            current: this.state.current,
            pageSize: this.state.pageSize,
            size: 'small',
        })
        return <div>
            <SearchForm  onSearch={(values) =>{ console.log(2)}}  />
            <WhiteSpace />
            <Table 
                pagination={pagination as any}
                columns={[
                    {
                        title:'请款单号',
                        key: '请款单号',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'请款平台',
                        key: '请款平台',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'创建时间',
                        key: '创建时间',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'收款方类型',
                        key: '收款方类型',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'收款方名称',
                        key: '收款方名称',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'请款单类型',
                        key: '请款单类型',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'请款总金额',
                        key: '请款总金额',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'已支付金额',
                        key: '已支付金额',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'未支付金额',
                        key: '未支付金额',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'社保缴费月（操作月）',
                        key: '社保缴费月（操作月）',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'审批经手人',
                        key: '审批经手人',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'审批状态',
                        key: '审批状态',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'支付状态',
                        key: '支付状态',
                        render: () => {
                            return '/'
                        }
                    },
                    {
                        title:'操作',
                        key: '操作',
                        render: () => {
                            return '查看'
                        }
                    },
                ]}
                dataSource={[{}]}
                bordered
                className='ant-table-wrapper-text-center'
            />
        </div>
    }
}

interface SearchProps extends FormComponentProps{
    onSearch: (values) => void;
}
class Search extends React.Component<SearchProps, any>{   //分别代表 属性和状态 SearchProps就是props any就是states   
    constructor(props:SearchProps) {
        super(props);
        
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let values = this.props.form.getFieldsValue();   //    获取搜索条件 子传父亲
        console.log(values);
        this.props.onSearch(values)
    }
    
    public render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Form layout="inline">
                <FormItem
                    label="请款单号"
                >
                    {getFieldDecorator('danhao', {
                        rules: [
                            {}
                        ],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                    label="创建时间"
                >
                    {getFieldDecorator('time', {
                        rules: [
                            {}
                        ],
                    })(
                        <RangePicker />
                    )}
                </FormItem>

                <FormItem
                    label="收款方名称"
                >
                    {getFieldDecorator('shoukuanfang', {
                        rules: [
                            {}
                        ],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                    label="社保缴费月（操作月）"
                >
                    {getFieldDecorator('caozuoyue', {
                        rules: [
                            {}
                        ],
                    })(
                        <MonthPicker placeholder='请选择' />
                    )}
                </FormItem>

                <FormItem
                    label="请款总金额"
                >
                    {getFieldDecorator('total', {
                        rules: [
                            {}
                        ],
                    })(
                        <Input.Group compact>
                            <Input style={{ width: 100, textAlign: 'center' }} placeholder="请输入" />
                            <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                            <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="请输入" />
                        </Input.Group>
                    )}
                </FormItem>

                <FormItem
                    label="审批状态"
                >
                    {getFieldDecorator('shenpi', {
                        rules: [
                            {}
                        ],
                    })(
                        <Select style={{width: 100}}>
                            <Select.Option key='0'>全部</Select.Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    label="支付状态"
                >
                    {getFieldDecorator('paystatus', {
                        rules: [
                            {}
                        ],
                    })(
                        <Select style={{width: 100}}>
                            <Select.Option key='0'>全部</Select.Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem><Button onClick={this.handleSubmit.bind(this)} type='primary'>搜索</Button></FormItem>
                
            </Form>
        );
    }
}

const SearchForm = Form.create()(Search)

export default ReqPaymentList