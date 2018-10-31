import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';
import { browserHistory } from 'react-router'
import {
    getInvoiceBaseInfoSubmit,
    getInvoiceBaseInfoDetail,
    getExpressInfo,
    getInvoiceWhiteExists
} from '../../api/businessComponents/invoiceApi';
import {
    INVOICE_BASE_INFO_SUBMIT_SAGA,
    INVOICE_BASE_INFO_DETAIL_SAGA,
    setInvoiceBaseInfo,
    invoiceBaseInfoFetching,
} from '../../action/businessComponents/invoiceAction';
import address from '../../components/select-city/address.json';
import { parseAddress, parseAddressName } from '../../components/select-city/util/util';

const addressMap = parseAddress(address);


function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case INVOICE_BASE_INFO_SUBMIT_SAGA: {
            yield put(invoiceBaseInfoFetching(true));
            const responeData = yield getInvoiceBaseInfoSubmit(params);
            
            let value;
            if (responeData.status === 0 || responeData.error === 0) {

                // 判断是否存在白名单
                const invoiceWhite = yield getInvoiceWhiteExists(params);
                if (invoiceWhite.status === 0 || invoiceWhite.error === 0) {
                    const invoiceWhiteExists = invoiceWhite.data;

                    const data = responeData.data;
                    // // 之前开纸质普通发票的客户，如果不在白名单里面，下一次就默认电子普通发票
                    // const invoiceType = (!invoiceWhiteExists&&data.invoiceType===1)?3:data.invoiceType;
                    value = {
                        baseInfo: {
                            //invoiceType: 2,
                            taxCode: data.taxRegistryNumber,
                            taxImg: data.taxRegistrationCertificateUrl ? data.taxRegistrationCertificateUrl.map((value) => ({
                                url: value,
                                uid: Date.now(),
                                name: '',
                                ossKey: value,
                                status: 'done',
                            })) : [],
                            taxPhone: data.taxInvoicePhone,
                            taxAddress: data.competentAuthority,
                            bankAccount: data.bankAccountNumber,
                            openBank: data.openingBank,
                            bankImg: data.bankLicenceUrl ? data.bankLicenceUrl.map((value) => ({
                                url: value,
                                uid: Date.now(),
                                name: '',
                                ossKey: value,
                                status: 'done',
                            })) : [],
                            taxPersonImg: data.generalTaxpayerQualificationUrl ? data.generalTaxpayerQualificationUrl.map((value) => ({
                                url: value,
                                uid: Date.now(),
                                name: '',
                                ossKey: value,
                                status: 'done',
                            })) : [],
                            ePersonName: data.postContacts,
                            eMail: data.postEmail,
                            ePhone: data.postTel,
                            cId: params.cId,
                            invoiceWhiteExists
                        },
                    }
                    const expressInfo = yield getExpressInfo(params);
                    if (expressInfo.status === 0 || expressInfo.errcode === 0) {
                        value.expressInfo = expressInfo.data.map((value) => ({
                            id: value.id,
                            phone: value.mobile,
                            name: value.contacts,
                            addressDetail: value.address,
                            addressId: [value.province, value.city, value.district],
                            addressName: value.cityName ? value.cityName.split(' ') : parseAddressName([value.province, value.city, value.district], addressMap),
                        }));
                        yield put(setInvoiceBaseInfo(value));
                    }
                }
                
            }



            yield put(invoiceBaseInfoFetching(false));
            // if (Number(data.error) === 0 || Number(data.status) === 0) {

            // }
            break;
        }
        case INVOICE_BASE_INFO_DETAIL_SAGA: {
            yield put(invoiceBaseInfoFetching(true));
            const type = params.type;
            delete params.type;
            const responeData = yield getInvoiceBaseInfoDetail(params);
            let value;
            if (responeData.status === 0 || responeData.error === 0) {
                // 判断是否存在白名单
                const data = responeData.data;
                const invoiceWhite = yield getInvoiceWhiteExists({cId:data.cId});
                if (invoiceWhite.status === 0 || invoiceWhite.error === 0) {
                    const invoiceWhiteExists = invoiceWhite.data;
                    // 之前开纸质普通发票的客户，如果不在白名单里面，下一次就默认电子普通发票
                    const invoiceType = (!invoiceWhiteExists&&data.invoiceType===1)?3:data.invoiceType;
                    value = {
                        baseInfo: {
                            invoiceType,
                            taxCode: data.taxRegistryNumber,
                            taxImg: data.taxRegistrationCertificateUrl ? data.taxRegistrationCertificateUrl.map((value, index) => ({
                                url: value,
                                uid: Date.now() + index,
                                name: '',
                                ossKey: value,
                                status: 'done',
                            })) : [],
                            taxPhone: data.taxInvoicePhone,
                            taxAddress: data.competentAuthority,
                            bankAccount: data.bankAccountNumber,
                            openBank: data.openingBank,
                            bankImg: data.bankLicenceUrl ? data.bankLicenceUrl.map((value, index) => ({
                                url: value,
                                uid: Date.now() + index,
                                name: '',
                                ossKey: value,
                                status: 'done',
                            })) : [],
                            taxPersonImg: data.generalTaxpayerQualificationUrl ? data.generalTaxpayerQualificationUrl.map((value, index) => ({
                                url: value,
                                uid: Date.now() + index,
                                name: '',
                                ossKey: value,
                                status: 'done',
                            })) : [],
                            ePersonName: data.postContacts,
                            eMail: data.postEmail,
                            ePhone: data.postTel,
                            eAddress: `${data.postProvinceName}${data.postCityName}${data.postDistrictName}${data.postAddress}`,
                            cId: data.cId,
                            invoiceWhiteExists
                        },
                        orderInfo: data,


                }

                console.log(value);
                if (type === 2) {
                    if(data.postAddressId) {
                        value.activeId = data.postAddressId;
                    }
                    const expressInfo = yield getExpressInfo(params);
                    if (expressInfo.status === 0 || expressInfo.errcode === 0) {
                        value.expressInfo = expressInfo.data.map((data) => ({
                            id: data.id,
                            phone: data.mobile,
                            name: data.contacts,
                            addressDetail: data.address,
                            addressId: [data.province, data.city, data.district],
                            addressName: data.cityName ? data.cityName.split(' ') : parseAddressName([data.province, data.city, data.district], addressMap),
                        }));

                        yield put(setInvoiceBaseInfo(value));
                    }
                }
            }
                yield put(setInvoiceBaseInfo(value));
            }
            yield put(invoiceBaseInfoFetching(false));
            break;
        }

    }
}

export default function* watchInvoice() {
    yield takeEvery([
        INVOICE_BASE_INFO_SUBMIT_SAGA,
        INVOICE_BASE_INFO_DETAIL_SAGA,
    ], incrementAsync);
}