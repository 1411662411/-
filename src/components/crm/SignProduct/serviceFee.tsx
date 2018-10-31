import React from 'react';
import { browserHistory } from 'react-router'
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'react-redux';
import { 
    Spin,
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    message,
    InputNumber
} from 'antd';

import TableUi from '../../Table';
import PartTitle from '../Title';

import { DOMAIN_OXT } from "../../../global/global";
import { fetchFn } from "../../../util/fetch";
import query from '../../../util/query';

const urlId = query('id');
const getServiceFee = () => {
    return fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/product/getProductConfigurationList`, {id: urlId}).then(data => data);
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const FormItem = Form.Item;

const formItemLayout={
    labelCol: {
        xs: {span:0},
    },
    wrapperCol: {
    xs: { span: 24 },
    },
}

interface UserFormProps extends FormComponentProps {
    permissionBtns: any;
}

class ServiceFee extends React.Component<UserFormProps,any>{
    constructor(props: UserFormProps){
        super(props)
        this.state={
            loading: false,
            serviceFeeList: [], //服务费情况
            isEdit: false,
        }
    }

    /**
     * 获取服务费情况
     */
    getServiceFee = async() => {
        if(urlId){
            let res:any = await getServiceFee();
            if(res.status === 0){
                this.setState({
                    serviceFeeList: res.data,
                    loading: false,
                })
            }
        }else{
            let data = [{
                "id": '',
                "name": 'serviceFee',
                "content": '',
                "typeName": "标准服务费",
            }, {
                "id": '',
                "name": 'standardSupplementaryPaymentMonth',
                "content": '',
                "typeName": "提供标准补缴月数",
            }, {
                "id": '',
                "name": 'nonstandardServiceFee',
                "content": '',
                "typeName": "非标补缴服务费",
            }];
            this.setState({
                serviceFeeList: data,
                loading: false,
                isEdit: true,
            })
        }
    }

    async componentWillMount(){
        this.setState({loading: true});
        await this.getServiceFee();
    }

    submit=(e) => {
        e.preventDefault();
        this.props.form.validateFields(async(err, values) => {
            if(!err){
                let tempArr:any = [];
                for(let key in values){
                    tempArr.push({
                        id: key.split('-')[1],
                        content: values[key],
                        typeName: key.split('-')[0]
                    })
                }
                this.setState({loading: true});
                fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/product/updateProductConfiguration`,
                    { data: JSON.stringify(tempArr) }
                )
                .then((res: any) => {
                    this.setState({
                        loading: false,
                        isEdit: false,
                    });
                    this.getServiceFee();
                });
            }
        });
    }

    render(){
        const {
            loading,
            serviceFeeList,
            isEdit,
        } = this.state;

        const { getFieldDecorator, getFieldsError } = this.props.form;

        let tempServiceFeeListArr:any = [];
        serviceFeeList.map((item, i) => {
            tempServiceFeeListArr.push({
                label: item.typeName,
                required: true,
                isAll: false,
                value: isEdit ? <div className="service-fee-item"><FormItem
                {...formItemLayout}
            >
                {getFieldDecorator(item.name ? item.name : `${item.typeName}-${item.id}`, {
                    rules: [{
                        required: true,
                        message: `请填写${item.typeName}`
                    }],
                    initialValue: item.content,
                })(
                    item.typeName.indexOf('月数') != -1 ?
                    <InputNumber min={0} precision={0} placeholder={`请填写${item.typeName}`} style={{'width': '120px', 'margin-right': '10px'}} />
                    :
                    <InputNumber min={0} placeholder={`请填写${item.typeName}`} style={{'width': '120px', 'margin-right': '10px'}} />
                )}
            </FormItem>{item.typeName.indexOf('月数') != -1 ? <span className="fee-span">个月</span> : <span className="fee-span">元/人·月</span>}</div> : <span>{`${item.content} ${item.typeName.indexOf('月数') != -1 ? '个月' : '元/人·月'}`}</span>
            })
        })

        return <Spin
            spinning={loading}
        >
        <Form
            onSubmit={this.submit}
            className="sign-product-detail"
        >
            <PartTitle
                title='服务费情况'
                buttons={urlId && this.props.permissionBtns && this.props.permissionBtns.updateProductServiceFeeButton ? [<Button type="primary" onClick={() => {this.setState({'isEdit': true})}} disabled={isEdit}>编辑</Button>] : ''}
            />
            <TableUi 
                dataSource={tempServiceFeeListArr}
            />
            {isEdit && urlId ?
            <div className='text-center' style={{marginTop: 20}}>
                <Button htmlType='submit' disabled={hasErrors(getFieldsError()) || loading} type='primary' style={{marginRight:20}}>保存</Button>
                <Button onClick={() => {this.setState({'isEdit': false})}}>取消</Button>
            </div>
            :
            ''
            }
        </Form>
        </Spin>
    }
}

export default Form.create()(ServiceFee);