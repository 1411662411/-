import React, { Component } from 'react';
import Immutable from 'immutable';
import Invoice from '../../businessComponents/common/invoice';
import {
    connect,
} from 'react-redux';
import {
    Card,
    Button,
    message,
} from 'antd';
import {
    invoiceEditSubmit,
} from '../../action/saleWorkbench/invoiceEditAction';


interface TStateProps {
    invoiceEditSubmitFetching: boolean,
    codeId: number | string;
    userInfo: Any.UserInfo;
}
interface TOwnProps {
    location?: any;
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}

type InvoiceEditProps = TStateProps & TOwnProps & TDispatchProps;
class InvoiceEdit extends Component<InvoiceEditProps, any> {
    params = {} as any;
    constructor(props) {
        super(props);
         const  {
            codeId,
            cId,
            contractId,
        } = this.props.location.query;
        if(codeId | contractId) {
            this.params = {
                codeId,
                cId,
                contractId,
            }
        }
        else {
            let params = sessionStorage.getItem('invoiceDetailEdit');
            if(params === null || !JSON.parse(params).codeId) {
                message.error('缺少发票相关参数');
                return;
            }
            this.params = JSON.parse(params);
        }
        // if(params === null || !JSON.parse(params).codeId ) {
        //     message.error('缺少发票号参数');
        //     return;
        // }
        // this.params = JSON.parse(params);

        // this.params = {
        //     // codeId: 2487,
        //     // cId: 1101514,
        //     cId: 1101547,
        //     contractId: 12266,
        // }
    };
    Invoice: any;
    getResult = (e) => {
        const result = this.Invoice.getWrappedInstance().getResult(e);
        this.params.codeId  = this.props.codeId;
        const {
            userInfo,
        } = this.props;
        if (result !== false) {
            const {
                bankAccount,
                bankImg,
                eMail,
                ePersonName,
                ePhone,
                invoiceType,
                openBank,
                taxAddress,
                taxCode,
                taxImg,
                taxPhone,
                taxPersonImg,
                expressInfo = {} as any,
            } = result;

            const {
                id,
                name,
                phone,
                addressId = [],
                addressName = [],
                addressDetail,
            } = expressInfo;
            const params2 = {
                postAddressId: id,
                postContacts: name,
                postTel: phone,
                postProvince: addressId[0],
                postCity: addressId[1],
                postDistrict: addressId[2],
                postProvinceName: addressName[0],
                postCityName: addressName[1],
                postDistrictName: addressName[2],
                postAddress: addressDetail,
            }
            let params:{ [props : string] : any } = {
                invoiceType,
                id: this.params.codeId,
                contractId: this.params.contractId,
                cId: this.params.cId,
                taxRegistryNumber: taxCode,
                taxRegistrationCertificateUrl: JSON.stringify(taxImg.map(({ ossKey }) => ossKey)),
                competentAuthority: taxAddress,
                taxInvoicePhone: taxPhone,
                openingBank: openBank,
                bankAccountNumber: bankAccount,
                bankLicenceUrl: JSON.stringify(bankImg.map(({ ossKey }) => ossKey)),
                createUser: `${userInfo.name}(${userInfo.employeeNumber})`,
                createId: userInfo.userId,
            }

            if (invoiceType === 3) {
                params = {
                    ...params,
                    postContacts: ePersonName,
                    postEmail: eMail,
                    postTel: ePhone,
                }
            }
            else if (invoiceType === 2) {
                params = {
                    ...params,
                    generalTaxpayerQualificationUrl: JSON.stringify(taxPersonImg.map(({ ossKey }) => ossKey)),
                    ...params2,

                }
            }
            else {
                params = {
                    ...params,
                    ...params2,

                }
            }
            this.props.dispatch(invoiceEditSubmit(params));
        }
    }
    render() {
        const {
            cname,
                codeId,
                cId,
                code,
                contractId,
        } = this.params;
        return (
            (codeId || contractId) ?
                // <Tabs activeKey="1">
                //     <TabPane key="1" tab={<div><span style={{marginRight: 50}}>{`发票信息：${params.cname ? params.cname : '' }`}</span><span>{`发票号：${params.code}`}</span></div>} style={{padding: 20}}>
                <div>
                    <Invoice ref={node => this.Invoice = node} type={2} codeId={codeId} cId={cId} contractId ={contractId}></Invoice>
                    <Button loading={this.props.invoiceEditSubmitFetching} type="primary" style={{ margin: '20px 0 0 20px', width: 100 }} onClick={e => this.getResult(e)}>提交</Button>
                </div>
                //     </TabPane>
                // </Tabs>
                :
                null

        )
    }
};
const mapStateToProps = (state: Any.Store): TStateProps => {
    const data = state.get('invoiceEdit');
    const invoiceBusinessComponents = state.get('invoiceBusinessComponents');
    const invoiceBaseInfo = invoiceBusinessComponents.get('invoiceBaseInfo');
    return {
         invoiceEditSubmitFetching: data.get('invoiceEditSubmitFetching'),
         codeId: invoiceBaseInfo.getIn(['orderInfo', 'id']),
         userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),       
    }
}
export default connect<TStateProps>(mapStateToProps)(InvoiceEdit);



