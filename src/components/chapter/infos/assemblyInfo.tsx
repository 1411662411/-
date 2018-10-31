import React, { Component } from 'react';
import CompanyInfo from './companyInfo';
import CentralTax from './centraltaxInfo';
import LandTax from './landtaxInfo';
import BankInfo from './bankInfo';
import SocialInfo from './socialInfo';
import FundInfo from './fundInfo';
import IannualInspectInfo from './iannualInspectInfo';
import ContactInfo from './contactInfo';
import HumanInfo from './humanInfo';
import LaborInfo from './laborInfo';
import Record from '../../../businessComponents/chapter/chapterHandleRecord';
import {
    DOMAIN_OXT,
} from '../../../global/global';
import getRegExp from '../../../util/regExp';
import unique from '../../../util/unique';

import {
    FormComponentProps,
    WrappedFormUtils,
} from 'antd/lib/form/Form';
import { PersonSource } from './util/selectPerson';
import moment from 'moment';
import {
    Button,
    Tabs,
    Card,
    Icon,
    Collapse
} from 'antd';
import Immutable from 'immutable';
const api = `${DOMAIN_OXT}/apiv4_/v1/sppayu/upload/file`;
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel


/**
 * 扩展公司基本信息
 */
const extendCompany = (data, values) => {
    values.fundingTime = values.fundingTime && values.fundingTime.format('YYYY/MM/DD');
    // 注册地址期限
    values.registerDeadlineStart = values.registerDeadline && values.registerDeadline[0] && values.registerDeadline[0].format('YYYY/MM/DD');
    if (values.registerDeadline && values.registerDeadline[1] === true) {
        values.registerDeadlineLong = true;
    }
    else {
        values.registerDeadlineEnd = values.registerDeadline && values.registerDeadline[1] && values.registerDeadline[1].format('YYYY/MM/DD');
    }
    // 营业期限
    values.businessDeadlineStart = values.businessDeadline && values.businessDeadline[0] && values.businessDeadline[0].format('YYYY/MM/DD');
    if (values.businessDeadline && values.businessDeadline[1] === true) {
        values.businessDeadlineLong = true;
    }
    else {
        values.businessDeadlineEnd = values.businessDeadline && values.businessDeadline[1] && values.businessDeadline[1].format('YYYY/MM/DD');
    }

    delete values.registerDeadline;
    delete values.businessDeadline;

    data.jsInfoCompanyBasic = values;
    return data;
}


/**
 * 扩展国税信息
 */
const extendCentralTax = (data, values) => {
    const {
        taxFirstTime,
        taxCaTerm,
        taxVpndTerm,
    } = values;
    values.taxFirstTime = taxFirstTime && taxFirstTime.format('YYYY/MM/DD');

    values.taxCaTermStart = taxCaTerm && taxCaTerm[0] && taxCaTerm[0].format('YYYY/MM/DD');
    values.taxCaTermEnd = taxCaTerm && taxCaTerm[1] && taxCaTerm[1].format('YYYY/MM/DD');

    values.taxVpndTermStart = taxVpndTerm && taxVpndTerm[0] && taxVpndTerm[0].format('YYYY/MM/DD');
    values.taxVpndTermEnd = taxVpndTerm && taxVpndTerm[1] && taxVpndTerm[1].format('YYYY/MM/DD');

    delete values.taxCaTerm;
    delete values.taxVpndTerm;
    data.jsInfoNationalTax = values;
    return data;
}

/**
 * 扩展地税信息
 */
const extendLandTax = (data, values) => {
    const {
        taxFirstTime,
        taxCaTerm,
        taxVpndTerm,
    } = values;
    values.taxFirstTime = taxFirstTime && taxFirstTime.format('YYYY/MM/DD');

    values.taxCaTermStart = taxCaTerm && taxCaTerm[0] && taxCaTerm[0].format('YYYY/MM/DD');
    values.taxCaTermEnd = taxCaTerm && taxCaTerm[1] && taxCaTerm[1].format('YYYY/MM/DD');

    delete values.taxCaTerm;
    data.jsInfoLandTax = values;
    return data;
}

/**
 * 扩展银行信息
 */
const extendBank = (data, values) => {
    values.map((value) => {
        const {
            openTime
        } = value;
        value.openTime = openTime && openTime.format('YYYY/MM/DD');
    });
    data.jsInfoBanks = values;

    return data;
}


/**
 * 扩展社保五险信息
 */
const extendSocial = (data, values) => {
    const {
        firstCutTime,
        openTime,
        socialBureauAddress
    } = values;
    values.firstCutTime = firstCutTime && firstCutTime.format('YYYY/MM/DD');

    values.openTime = openTime && openTime.format('YYYY/MM/DD');

    data.jsInfoSocial = values;

    return data;
}

/**
 * 扩展公积金信息
 */
const extendFund = (data, values) => {
    const {
        firstCutTime,
        openTime,
        socialBureauAddress
    } = values;
    values.firstCutTime = firstCutTime && firstCutTime.format('YYYY/MM/DD');

    values.openTime = openTime && openTime.format('YYYY/MM/DD');


    data.jsInfoCommonFund = values;

    return data;
}

/**
 * 扩展联系人信息
 */
const extendContact = (data, values) => {
    const {
        officeDeadline
    } = values;

    values.officeDeadline1 = officeDeadline && officeDeadline[0] && officeDeadline[0].format('YYYY/MM/DD');
    values.officeDeadline2 = officeDeadline && officeDeadline[1] && officeDeadline[1].format('YYYY/MM/DD');

    delete values.officeDeadline;

    data.jsInfoContact = values;

    return data;
}

/**
 * 扩展人力资源服务许可证
 */
const extendHuman = (data, values) => {
    const {
        issueDate,
        deadline,
        address,
        annualSurvey,
    } = values;
    values.issueDate = issueDate && issueDate.format('YYYY/MM/DD');
    values.deadline = deadline && deadline.format('YYYY/MM/DD');
    values.annualSurveyStart = annualSurvey && annualSurvey[0];
    values.annualSurveyEnd = annualSurvey && annualSurvey[1];
    delete values.annualSurvey;
    data.jsInfoHuman = values;

    return data;
}

/**
 * 劳务派遣许可证
 */
const extendLabor = (data, values) => {
    const {
        issueDate,
        deadline,
        address
    } = values;
    values.issueDate = issueDate && issueDate.format('YYYY/MM/DD');
    values.deadlineStart = deadline && deadline[0] && deadline[0].format('YYYY/MM/DD');
    values.deadlineEnd = deadline && deadline[1] && deadline[1].format('YYYY/MM/DD');
    delete values.deadline;
    data.jsInfoLabor = values;

    return data;
}




export interface AssemblyInfoProps {
    className?: string;
    edit?: boolean;
    personSource?: PersonSource;
    data: Immutable.Map<any, any>;
    csId?: string | number;
    /**
     * 1 公司基本信息
     * 2 国税信息
     * 3 地税信息
     * 4 银行账户信息
     * 5 社保五险信息
     * 6 公积金信息
     * 7 工商年检
     * 8 联系人
     * 9 人力资源服务许可证
     * 10 劳务派遣许可证 
     */
    panes?: (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)[];
}

interface AssemblyInfoState {
    activeKey: string;
    bankAccountSource: any[];
    fitAlls: Immutable.Map<keyof {
        companyInfo: boolean;
        centralTax: boolean;
        landTax: boolean;
        bankInfo: boolean;
        socialInfo: boolean;
        fundInfo: boolean;
        iannualInspectInfo: boolean;
        contactInfo: boolean;
        laborInfo: boolean;
        humanInfo: boolean;
    }, boolean>
}

/**
 * 除去空数据， null, undefined , []
 * @param {Object} 参数
 */
const filterEmpty = (data) => {
    for (let key in data) {
        const value = data[key];
        if ((Array.isArray(value) && value.length === 0) || value === undefined || value === null || value === '') {
            delete data[key];
        }
    }
    return data;
}

/**
 * 除去空数据， null, undefined , []
 * @param {Object} 参数
 */
const filterSelectCity = (data) => {
    for (let key in data) {
        const value = data[key];
        if (Object.prototype.hasOwnProperty.call(value, 'selectVal') && value.selectVal && value.selectVal.length <= 0) {
            delete data[key];
        }
    }
    return data;
}

/**
 * 检查是否满足全部填写
 * @param {Object} 数据源
 * @param {Number} 阈值
 */
const checkFitAll = (data: any, thresholdValue: number) => {
    data = filterSelectCity(filterEmpty(data));
    let number = 0;
    for (let key in data) {
        number++;
    }
    console.log(data, number, thresholdValue)
    /**
     * 大于阈值
     */
    if (number >= thresholdValue) {
        return true;
    }
    return false;
}

export default class AssemblyInfo extends Component<AssemblyInfoProps, AssemblyInfoState> {
    constructor(props) {
        super(props);

        /**
         * 初始化默认银行数据
         */
        const data = this.props.data.toJS();

        let bankAccountSource: any[] = [];
        const jsInfoBanks = data.jsInfoBanks
        if (jsInfoBanks && jsInfoBanks.length > 0) {
            jsInfoBanks.forEach((value) => {
                if (value.bankAccount) {
                    bankAccountSource.push(value.bankAccount);
                }
            });
        }
        const {
            panes,
        } = this.props;
        this.state = {
            bankAccountSource,
            activeKey: Array.isArray(panes) && panes.length > 0 ? panes[0].toString() : '1',
            fitAlls: Immutable.fromJS({
                companyInfo: data.jsInfoCompanyBasic && data.jsInfoCompanyBasic.fitAll,
                centralTax: data.jsInfoNationalTax && data.jsInfoNationalTax.fitAll,
                landTax: data.jsInfoLandTax && data.jsInfoLandTax.fitAll,
                bankInfo: data.banksFitAll,
                socialInfo: data.jsInfoSocial && data.jsInfoSocial.fitAll,
                fundInfo: data.jsInfoCommonFund && data.jsInfoCommonFund.fitAll,
                iannualInspectInfo: data.jsInfoIndustry && data.jsInfoIndustry.fitAll,
                contactInfo: data.jsInfoContact && data.jsInfoContact.fitAll,
                laborInfo: data.jsInfoLabor && data.jsInfoLabor.fitAll,
                humanInfo: data.jsInfoHuman && data.jsInfoHuman.fitAll,
            })
        }
    }
    CompanyInfo: any;
    CentralTax: any;
    LandTax: any;
    BankInfo: BankInfo | null;
    SocialInfo: any;
    FundInfo: any;
    IannualInspectInfo: any;
    ContactInfo: any;
    LaborInfo: any;
    HumanInfo: any;

    getResult = (e) => {
        let flag = false;

        let data = {} as any;
        const {
            panes,
        } = this.props;

        !flag && (!panes || Array.isArray(panes) && panes.includes(1) ) && this.CompanyInfo.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('1', this.CompanyInfo.validateFieldsAndScroll);
                flag = true;
            }
            extendCompany(data, values);

            console.log(data);
            //console.log(err, values);
        })

        !flag && (!panes || Array.isArray(panes) && panes.includes(2) ) && this.CentralTax && this.CentralTax.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('2', this.CentralTax.validateFieldsAndScroll);
                flag = true;
            }

            extendCentralTax(data, values);
            console.log(err, values);
        });

        !flag && (!panes || Array.isArray(panes) && panes.includes(3) ) && this.LandTax && this.LandTax.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('3', this.LandTax.validateFieldsAndScroll);
                flag = true;
            }
            extendLandTax(data, values);
            //console.log(err, values);
        });

        !flag && (!panes || Array.isArray(panes) && panes.includes(4) ) && this.BankInfo && this.BankInfo.validateFieldsAndScroll((err, values) => {
            if(err) {
                this.onChange('4', () => {
                    this.BankInfo && this.BankInfo.validateFieldsAndScroll()
                });
                flag = true;
            }
            extendBank(data,values);
            console.log(err, values);
        });

        !flag && (!panes || Array.isArray(panes) && panes.includes(5) ) && this.SocialInfo && this.SocialInfo.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('5', this.SocialInfo.validateFieldsAndScroll);
                flag = true;
            }
            extendSocial(data, values);
            console.log(err, values);
        });


        !flag && (!panes || Array.isArray(panes) && panes.includes(6) ) && this.FundInfo && this.FundInfo.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('6', this.FundInfo.validateFieldsAndScroll);
                flag = true;
            }
            extendFund(data, values);
            console.log(err, values);
        });

        !flag && (!panes || Array.isArray(panes) && panes.includes(7) ) && this.IannualInspectInfo && this.IannualInspectInfo.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('7', this.IannualInspectInfo.validateFieldsAndScroll);
                flag = true;
            }
            data.jsInfoIndustry = values;
            console.log(err, values);
        });


        !flag && (!panes || Array.isArray(panes) && panes.includes(8) ) && this.ContactInfo && this.ContactInfo.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('8', this.ContactInfo.validateFieldsAndScroll);
                flag = true;
            }
            extendContact(data, values);
            console.log(err, values);
        });

        !flag && (!panes || Array.isArray(panes) && panes.includes(9) ) && this.HumanInfo && this.HumanInfo.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('9', this.HumanInfo.validateFieldsAndScroll);
                flag = true;
            }
            extendHuman(data, values);
            console.log(err, values);
        });

        !flag && (!panes || Array.isArray(panes) && panes.includes(10) ) && this.LaborInfo && this.LaborInfo.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.onChange('10', this.LaborInfo.validateFieldsAndScroll);
                flag = true;
            }
            extendLabor(data, values);
            console.log(err, values);
        });
        if (!flag) {
            return data;
        }
        return false;
    }
    checkFitAlls(activeKey) {
        let fitAlls = this.state.fitAlls;
        switch (activeKey) {
            case '1': {
                this.CompanyInfo.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        fitAlls = fitAlls.update('companyInfo', () => false);
                    }
                    else {
                        fitAlls = fitAlls.update('companyInfo', () => checkFitAll(extendCompany({}, values).jsInfoCompanyBasic, 20));
                    }
                })
                break;
            }
            case '2': {
                this.CentralTax.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        fitAlls = fitAlls.update('centralTax', () => false);
                    }
                    else {
                        fitAlls = fitAlls.update('centralTax', () => checkFitAll(extendCentralTax({}, values).jsInfoNationalTax, 16));
                    }
                })
                break;
            }
            case '3': {
                this.LandTax.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        fitAlls = fitAlls.update('landTax', () => checkFitAll(extendLandTax({}, values).jsInfoLandTax, 20));
                    }
                })
                break;
            }
            case '4': {
                this.BankInfo && this.BankInfo.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        fitAlls = fitAlls.update('bankInfo', () => false);
                    }
                    else {
                        const data = extendBank({}, values).jsInfoBanks;
                        let fitAll = true;
                        for (let value of data) {
                            const {
                                payPettyCash,
                                usbKey,
                            } = value;
                            let thresholdValue = 31;
                            if (payPettyCash === 1 && usbKey === 1) {
                                thresholdValue = thresholdValue + 1 + 4;
                            }
                            else if (payPettyCash === 1) {
                                thresholdValue = thresholdValue + 1;
                            }
                            else if (usbKey === 1) {
                                thresholdValue = thresholdValue + 4;
                            }
                            if (!checkFitAll(value, thresholdValue)) {
                                fitAll = false;
                                break;
                            }
                        }
                        fitAlls = fitAlls.update('bankInfo', () => fitAll);
                    }
                })
                break;
            }
            case '5': {
                this.SocialInfo.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        fitAlls = fitAlls.update('socialInfo', () => false);
                    }
                    else {
                        fitAlls = fitAlls.update('socialInfo', () => checkFitAll(extendSocial({}, values).jsInfoSocial, values.dealMethod !== 1 ? 13 : 16));
                    }
                })
                break;
            }
            case '6': {
                this.FundInfo.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        fitAlls = fitAlls.update('fundInfo', () => false);
                    }
                    else {
                        fitAlls = fitAlls.update('fundInfo', () => checkFitAll(extendFund({}, values).jsInfoCommonFund, values.dealMethod !== 1 ? 12 : 15));
                    }
                })
                break;
            }
            case '7': {
                this.IannualInspectInfo.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        fitAlls = fitAlls.update('iannualInspectInfo', () => false);
                    }
                    else {
                        fitAlls = fitAlls.update('iannualInspectInfo', () => checkFitAll(values, 5));
                    }
                })
                break;
            }
            case '8': {
                this.ContactInfo.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        fitAlls = fitAlls.update('contactInfo', () => false);
                    }
                    else {
                        fitAlls = fitAlls.update('contactInfo', () => checkFitAll(extendContact({}, values).jsInfoContact, 8));
                    }
                })
                break;
            }
            case '9': {
                this.HumanInfo.validateFieldsAndScroll((err, values) => {
                    if (err) {
                        fitAlls = fitAlls.update('humanInfo', () => false);
                    }
                    else {
                        fitAlls = fitAlls.update('humanInfo', () => checkFitAll(extendHuman({}, values).jsInfoHuman, 14));
                    }
                })
                break;
            }
            case '10': {
                this.LaborInfo.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        fitAlls = fitAlls.update('laborInfo', () => checkFitAll(extendLabor({}, values).jsInfoLabor, 14));
                    }
                })
                break;
            }

            default: fitAlls

        }
        console.log(fitAlls.toJS())
        return fitAlls;
    }
    onChange = (activeKey, callback?) => {
        const nowActiveKey = this.state.activeKey;
        const fitAlls = this.checkFitAlls(nowActiveKey);

        this.setState({
            activeKey,
            fitAlls,
        }, () => {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
    /**
     * 联动设置SocialInfo的BankAccount字段
     */
    shouldSetSocialInfoBankAccount = (arr) => {
        const value = this.SocialInfo.getFieldValue('bankAccount')
        const value2 = this.FundInfo.getFieldValue('bankAccount')
        if (!arr || arr.length <= 0 || Array.isArray(arr) && arr.indexOf(value) < 0) {
            this.SocialInfo.setFieldsValue({ bankAccount: undefined })
        }
        if (!arr || arr.length <= 0 || Array.isArray(arr) && arr.indexOf(value2) < 0) {
            this.FundInfo.setFieldsValue({ bankAccount: undefined })
        }
    }
    /**
     * 设置银行账号数据
     */
    setBankAccountSource = () => {
        let arr: any[] = [];
        const regx = getRegExp('number');
        const result = this.BankInfo && this.BankInfo.validateFieldsAndScroll();
        result && result.values.forEach(({ bankAccount }) => {
            if (regx.test(bankAccount)) {
                arr.push(bankAccount);
            }
        });
        arr = unique(arr);
        console.log(arr);
        this.setState({
            bankAccountSource: arr,
        }, () => this.shouldSetSocialInfoBankAccount(arr));
    }
    tabPanes = () => {
        const {
            activeKey,
            bankAccountSource,
            fitAlls,
        } = this.state;
        let {
            className,
            edit,
            personSource = Immutable.fromJS([]),
            data,
            panes,
        } = this.props;
        const defaultData = data.toJS();
        const tabPaneMap = {
            1: <TabPane tab={<span>公司基本信息{fitAlls.get('companyInfo') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="1" forceRender={true}>
                <CompanyInfo
                    uploadApi={api}
                    edit={edit}
                    data={defaultData.jsInfoCompanyBasic || { companyName: defaultData.companyName }}
                    personSource={personSource}
                    ref={node => this.CompanyInfo = node}
                />
            </TabPane>,
            2: <TabPane tab={<span>国税信息{fitAlls.get('centralTax') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="2" forceRender={true}>
                <CentralTax
                    uploadApi={api}
                    edit={edit}
                    data={defaultData.jsInfoNationalTax || {}}
                    ref={node => this.CentralTax = node}
                />
            </TabPane>,

            3: <TabPane tab={<span>地税信息{fitAlls.get('landTax') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="3" forceRender={true}>
                <LandTax
                    uploadApi={api}
                    edit={edit}
                    data={defaultData.jsInfoLandTax || {}}
                    ref={node => this.LandTax = node}
                />
            </TabPane>,
            4: <TabPane tab={<span>银行账户信息{fitAlls.get('bankInfo') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="4" forceRender={true}>
                <BankInfo
                    edit={edit}
                    uploadApi={api}
                    data={defaultData.jsInfoBanks || {}}
                    setBankAccountSource={this.setBankAccountSource}
                    ref={node => this.BankInfo = node}
                    personSource={personSource}
                />
            </TabPane>,
            5: <TabPane tab={<span>社保五险信息{fitAlls.get('socialInfo') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="5" forceRender={true}>
                <SocialInfo
                    edit={edit}
                    uploadApi={api}
                    data={defaultData.jsInfoSocial || {}}
                    bankAccountSource={bankAccountSource}
                    bankData={defaultData.jsInfoBanks.filter(bank => bank.enableStatus === 0)}
                    ref={node => this.SocialInfo = node}
                    personSource={personSource}
                />
            </TabPane>,
            6: <TabPane tab={<span>公积金信息{fitAlls.get('fundInfo') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="6" forceRender={true}>
                <FundInfo
                    edit={edit}
                    uploadApi={api}
                    data={defaultData.jsInfoCommonFund || {}}
                    bankAccountSource={bankAccountSource}
                    bankData={defaultData.jsInfoBanks.filter(bank => bank.enableStatus === 0)}
                    ref={node => this.FundInfo = node}
                    personSource={personSource}
                />
            </TabPane>,
            7: <TabPane tab={<span>工商年检{fitAlls.get('iannualInspectInfo') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="7" forceRender={true}>
                <IannualInspectInfo
                    edit={edit}
                    data={defaultData.jsInfoIndustry || {}}
                    uploadApi={api}
                    ref={node => this.IannualInspectInfo = node}
                    personSource={personSource}
                />
            </TabPane>,
            8: <TabPane tab={<span>联系人{fitAlls.get('contactInfo') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="8" forceRender={true}>
                <ContactInfo
                    edit={edit}
                    data={defaultData.jsInfoContact || {}}
                    uploadApi={api}
                    personSource={personSource}
                    ref={node => this.ContactInfo = node}
                />
            </TabPane>,
            9: <TabPane tab={<span>人力资源服务许可证{fitAlls.get('humanInfo') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="9" forceRender={true}>
                <HumanInfo
                    edit={edit}
                    uploadApi={api}
                    data={defaultData.jsInfoHuman || {}}
                    ref={node => this.HumanInfo = node}
                    personSource={personSource}
                />
            </TabPane>,
            10: <TabPane tab={<span>劳务派遣许可证{fitAlls.get('laborInfo') && <Icon type="check-circle" style={{ color: '#22baa0', marginLeft: 5 }} />}</span>} key="10" forceRender={true}>
                <LaborInfo
                    edit={edit}
                    uploadApi={api}
                    data={defaultData.jsInfoLabor || {}}
                    ref={node => this.LaborInfo = node}
                    personSource={personSource}
                />
            </TabPane>,
        }
        if(panes) {
            return panes.map(value => tabPaneMap[value])
        }
        else {
            const arr:JSX.Element[] = [];
            for(let key in tabPaneMap) {
                arr.push(tabPaneMap[key]);
            }
            return arr;
        }
    }
    render() {
        const {
            activeKey,
            bankAccountSource,
            fitAlls,
        } = this.state;
        let {
            className,
            edit,
            personSource = Immutable.fromJS([]),
            data,
            csId,
        } = this.props;
        const defaultData = data.toJS();
        return (
            <div>
                {edit ? <Tabs tabPosition="left" activeKey={activeKey} onChange={this.onChange} className={`${className} assembly-info`}>
                    {this.tabPanes()}
                </Tabs>
                    :
                    <div>
                        <Collapse defaultActiveKey={['CompanyInfo']}>
                            <i id='CompanyInfo' />
                            <Panel header='公司基本信息' key='CompanyInfo'>
                                <CompanyInfo
                                    edit={edit}
                                    data={defaultData.jsInfoCompanyBasic || {}}
                                    ref={node => this.CompanyInfo = node}
                                />
                            </Panel>
                            <i id='CentralTax' />
                            <Panel header='国税信息' key='CentralTax'>
                                <CentralTax
                                    edit={edit}
                                    data={defaultData.jsInfoNationalTax || {}}
                                    ref={node => this.CentralTax = node}
                                />
                            </Panel>
                            <i id='LandTax' />
                            <Panel header='地税信息' key='LandTax'>
                                <LandTax
                                    edit={edit}
                                    data={defaultData.jsInfoLandTax || {}}
                                    ref={node => this.LandTax = node}
                                />
                            </Panel>
                            <i id='BankInfo' />
                            <Panel header='银行账户信息' key='BankInfo'>
                                <BankInfo
                                    edit={edit}
                                    data={defaultData.jsInfoBanks || {}}
                                    ref={node => this.BankInfo = node}
                                />
                            </Panel>
                            <i id='SocialInfo' />
                            <Panel header='社保五险信息' key='SocialInfo'>
                                <SocialInfo
                                    edit={edit}
                                    data={defaultData.jsInfoSocial || {}}
                                    ref={node => this.SocialInfo = node}
                                />
                            </Panel>
                            <i id='FundInfo' />
                            <Panel header='公积金信息' key='FundInfo'>
                                <FundInfo
                                    edit={edit}
                                    data={defaultData.jsInfoCommonFund || {}}
                                    ref={node => this.FundInfo = node}
                                />
                            </Panel>
                            <i id='IannualInspectInfo' />
                            <Panel header='工商年检' key='IannualInspectInfo'>
                                <IannualInspectInfo
                                    edit={edit}
                                    data={defaultData.jsInfoIndustry || {}}
                                    ref={node => this.IannualInspectInfo = node}
                                />
                            </Panel>
                            <i id='ContactInfo' />
                            <Panel header='联系人' key='ContactInfo'>
                                <ContactInfo
                                    edit={edit}
                                    data={defaultData.jsInfoContact || {}}
                                    ref={node => this.ContactInfo = node}
                                />
                            </Panel>
                            <i id='HumanInfo' />
                            <Panel header='人力资源服务许可证' key='HumanInfo'>
                                <HumanInfo
                                    edit={edit}
                                    data={defaultData.jsInfoHuman || {}}
                                    ref={node => this.HumanInfo = node}
                                />
                            </Panel>
                            <i id='LaborInfo' />
                            <Panel header='劳务派遣许可证' key='LaborInfo'>
                                <LaborInfo
                                    edit={edit}
                                    data={defaultData.jsInfoLabor || {}}
                                    ref={node => this.LaborInfo = node}
                                />
                            </Panel>
                            <i id='Record' />
                            <Panel header='操作日志' key='Record'>
                                <Record csId={csId || ''}/>
                            </Panel>
                        </Collapse>
                    </div>

                }
            </div>
        )
    }
}