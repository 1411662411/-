import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router';
import { Table, Spin, Col, Row, Input, Select, Checkbox, Modal, Tabs, Button, message, Upload, Switch } from 'antd'
import { List, Map, Iterable, fromJS } from 'immutable'
import FilterTable from '../../components/filterTable/filterTable'
import TableTitle, { Tag } from '../../components/filter'
import { getBankInfo, enableSwitch } from "../../action/businessComponents/chapterFinancialTwoAction"
import { personSourceGet } from '../../action/businessComponents/chapterListActions'
import BankInfoTab from '../../components/chapter/infos/bankInfo'
import { listBankTypeApi, addOrUpdateBankInfo, uploadApi } from '../../api/businessComponents/chapterFinancialApi'
import { fetchFn } from '../../util/fetch'
import { ROUTER_PATH } from '../../global/global'
import '../../css/page/chapterFinancialTwo.less'
import {
    accountUseString,
} from '../../components/chapter/infos/util/index';
import { AccountUse } from '../../components/chapter/infos/util/index'

// functions
const getTitle = (opts: string[], cb, accountType?) => {
    let options
    if (opts.length == 4) {
        options = opts.map((opt, index) => ({ value: (index + 1).toString(), label: opt }))
        return <Checkbox.Group options={options} onChange={cb} />
    }
    if (opts.length == 3 || accountType) {
        options = opts.map((opt, index) => (<Option value={index + 1}>{opt}</Option>))
    } else {
        options = opts.map((opt, index) => (<Option value={index}>{opt}</Option>))
    }
    return <Select onChange={cb} {...commonTitleProps}>{options}</Select>
}

// variables
const maxBankRow = 100
const Option = Select.Option
const TabPane = Tabs.TabPane
const commonTitleProps = {
    style: { width: 100 },
    placeholder: "请选择",
    getPopupContainer: triggerNode => triggerNode.parentElement || document.body
}
const kv = {
    companyName: '公司名称', accountType: '账户性质', creditCode: '信用代码证',
    passwordPayment: '密码支付器', accountManagement: '账户管理费', checkBillTime: '对账时间',
    groupBank: '是否加入集团网银', replacePayroll: '代发工资', replaceOther: '代发(报销等其他)',
    bankAccountSocial: '社保托收银行账号', bankAccountFund: '公积金托收银行账号', payMethodSocial: '社保缴纳方式',
    payMethodFund: '公积金缴纳方式'
}
const actionProps = {
    getBankInfo, personSourceGet, enableSwitch
}
interface stateProps {
    data: any[],
    dataSorted: any[],
    originalData: List<Map<string, any>>,
    total: number,
    person: any
}
interface internalState {
    loading: boolean,
    current: number,
    tags: JSX.Element[],
    companyName: string,
    entering: boolean,
    saveBtnLoading: boolean
}
export interface BankInfo {
    companyName: string,
    bankName: string,
    bankAccount: string,
    bankType: string
    area: string
    accountType: number,
    bankContact: string,
    creditCode: number,
    passwordPayment: number,
    accountManagement: number,
    checkBillTime: number,
    checkBillFrequency: string,
    usbKey: number,
    usbKeyHandler: string,
    usbKeyChecker: string,
    usbKeyKeepDep: string,
    groupBank: number,
    replacePayroll: number,
    replaceOther: number,
    bankAccountSocial: number,
    bankAccountFund: number,
    payMethodSocial: string,
    payMethodFund: string,
    len?: number
    enableStatus: number;
    id: number;
    province: string;
    city: string;
    accountUse: AccountUse;

}
export interface BankType {
    id?: number
    dictName?: string
    dictKey?: string
}

class ChapterFinancialOne extends React.Component<typeof actionProps & stateProps, internalState> {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            current: 1,
            tags: [],
            companyName: '',
            entering: false,
            saveBtnLoading: false
        }
        props.getBankInfo({
            start: 0,
            length: 20
        })
        props.personSourceGet({})
        fetch(listBankTypeApi, { credentials: 'include' })
            .then(res => {
                return res.json()
            })
            .then(value => {
                console.log(value)
                this.bankType = value.data
            })
            .catch(err => {
                console.log(err)
                throw new Error('请求银行类型出错')
            })
    }


    /** 变量 */

    filterCache: any = {}
    banks = []
    bankInfoTab
    bankType: BankType[] = []
    enteringCompanyId

    enteringCompanyName = '';

    /** 方法 */

    addFilterCache = (key, value) => {
        this.filterCache[key] = value

        // console.log(this.filterCache)
    }

    deleteFilterCache = key => {
        delete this.filterCache[key]
        if (key === 'companyName')
            this.setState({ companyName: '' })
        this.refreshTags()
        this.filterRequest()
    }

    resetFilterOptions = () => {
        this.setState({ tags: [], companyName: '' })
        this.filterCache = {}
        this.filterRequest()
    }

    refreshTags = () => {
        let tags: JSX.Element[] = []
        const tagData = this.processFilterCacheToTagData()

        for (let key in tagData) {
            tags.push(<Tag name={kv[key]} content={tagData[key]} close={() => this.deleteFilterCache(key)} />)
        }

        this.setState({ tags })
    }

    // 处理filterCache是适应tag显示
    processFilterCacheToTagData = () => {
        let tagData: any = {}
        for (let key in this.filterCache) {
            tagData[key] = this.filterCache[key]
            // 后处理
            switch (key) {
                case 'accountType':
                    tagData[key] = tagData[key] - 1 === 0 ? '一般户' : '基本户'
                    break
                // boolean
                case 'creditCode':
                case 'passwordPayment':
                case 'accountManagement':
                    tagData[key] = tagData[key] === 0 ? '无' : '有'
                    break
                case 'groupBank':
                case 'replacePayroll':
                case 'replaceOther':
                case 'bankAccountSocial':
                case 'bankAccountFund':
                    tagData[key] = tagData[key] === 0 ? '否' : '是'
                    break
                // other
                case 'checkBillTime':
                    tagData[key] = (() => {
                        switch (tagData[key]) {
                            case 1: return '月初'
                            case 2: return '月中'
                            case 3: return '月末'
                        }
                    })()
                    break
                case 'payMethodFund':
                case 'payMethodSocial':
                    const methods = tagData[key]
                    const m = methods.map(method => {
                        switch (method) {
                            case '1': return '现金'
                            case '2': return '支票'
                            case '3': return '托收'
                            case '4': return '转账'
                        }
                    })
                    tagData[key] = m.join(',')
                    break
                default:
                    break
            }
        }
        return tagData
    }

    // 处理filterCache是适应请求格式
    processFilterCache = () => ({
        companyName: this.filterCache.companyName,
        jsInfoBanks: [{
            accountType: this.filterCache.accountType,
            creditCode: this.filterCache.creditCode,
            passwordPayment: this.filterCache.passwordPayment,
            accountManagement: this.filterCache.accountManagement,
            checkBillTime: this.filterCache.checkBillTime,
            groupBank: this.filterCache.groupBank,
            replacePayroll: this.filterCache.replacePayroll,
            replaceOther: this.filterCache.replaceOther,
        }],
        jsInfoSocial: {
            bankAccount: this.filterCache.bankAccountSocial,
            payMethod: this.filterCache.payMethodSocial,
        },
        jsInfoCommonFund: {
            bankAccount: this.filterCache.bankAccountFund,
            payMethod: this.filterCache.payMethodFund,
        }
    })

    // 带着缓存数据发起请求
    filterRequest = (current = 1) => {
        this.refreshTags()
        this.props.getBankInfo({
            ...this.processFilterCache(),
            start: (current - 1) * 20,
            length: 20
        })
        this.setState({ loading: true, current })
    }

    pagination: (current: number, total: number) => any = (current, total) => {
        return {
            current,
            total: total * 5, // total/20*100出现浮点
            pageSize: 100,
            showQuickJumper: true,
            // showTotal: (total, range) => `第${Math.floor(range[0]/100) * 20 + 1}项-第${range[1]/5}项  共${total/5}项`,
            showTotal: (total, range) => {
                return `第${(this.state.current - 1) * 20 + 1}项-第${range[1] / 5}项  共${total / 5}项`
            },
            onChange: (page, pageSize) => {
                this.setState({ loading: true, current: page }) // current/page为真数  total为五倍于真数  pageSize请求时固定为20显示时固定为100
                this.props.getBankInfo({
                    ...this.processFilterCache(),
                    start: (page - 1) * 20,
                    length: 20
                })
            } // 设置每页100行 实际请求20条数据 以容纳未知条数的银行信息
        }
    }

    enterBank = (e: React.MouseEvent<HTMLAnchorElement>, rowData: any) => {
        e.preventDefault()
        const data = rowData.toJS()
        this.banks = data.jsInfoBanks
        console.log('********\n', data)
        this.setState({ entering: true })
        this.enteringCompanyId = data.id
        this.enteringCompanyName = data.companyName;
    }
    enterBankConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ saveBtnLoading: true })
        this.bankInfoTab.validateFieldsAndScroll((err, values) => {
            // if(err) {
            //     this.onChange('4', () => {
            //         this.BankInfo && this.BankInfo.validateFieldsAndScroll()
            //     });
            //     flag = true;
            // }
            // extendBank(data,values);
            if (err) {
                this.setState({ saveBtnLoading: false })
                return
            }
            values.map((value) => {
                const {
                    openTime
                } = value
                value.openTime = openTime && openTime.format('YYYY/MM/DD')
            })
            console.log(err, values)
            fetchFn(addOrUpdateBankInfo, values.map(item => ({ ...item, csId: this.enteringCompanyId })), { headers: { 'Content-Type': 'application/json' } })
                .then((res: any) => {
                    if (res.status === 0) {
                        message.success('录入成功')
                        this.setState({ entering: false, saveBtnLoading: false, loading: true })
                        this.filterRequest(this.state.current)
                    }
                    else {
                        this.setState({ saveBtnLoading: false })
                    }
                })
        })
    }
    enterBankCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ entering: false })
    }
    editBank = (targetKey, action) => {

    }
    setBankAccountSource = () => {

    }
    enableStatus = (params) => {
        this.props.enableSwitch(params);
    }
    render() {

        const { data, dataSorted, total, originalData, person } = this.props
        const { current } = this.state

        const columns = [
            {
                title: '操作',
                render: (data, rowData, index) => {
                    const btn = <a onClick={(e) => this.enterBank(e, originalData.getIn([rowData.location/* , 'jsInfoBanks' */]))}>录入</a>
                    if (rowData.len == 0) {
                        return { children: btn, props: {} }
                    } else if (rowData.len > 0) {
                        return { children: btn, props: { rowSpan: rowData.len } }
                    } else {
                        return { children: btn, props: { rowSpan: 0 } }
                    }
                },
                width: 90, fixed: true, className: 'action-column'
            },
            {
                title: '是否启用',
                render: (data, rowData, index) => {
                    return rowData.enableStatus !== -1 ? <Switch loading={rowData.enableSwitchFetching} checked={rowData.enableStatus === 0 ? true : false} onChange={() => this.enableStatus({enableStatus: rowData.enableStatus === 0 ? 1: 0, index, csId:rowData.csId, id: rowData.bankId })} /> : '/';
                },
                width: 80, fixed: true, className: 'action-column'
            },
            {
                title: '公司名称',
                render: (data, rowData, index) => {
                    if (rowData.len == 0) {
                        return { children: <Link to={`${ROUTER_PATH}/newadmin/chapter/info?id=${rowData.csId}`} >{rowData.companyName}</Link>, props: {} }
                    } else if (rowData.len > 0) {
                        return { children: <Link to={`${ROUTER_PATH}/newadmin/chapter/info?id=${rowData.csId}`} >{rowData.companyName}</Link>, props: { rowSpan: rowData.len } }
                    } else {
                        return { children: <Link to={`${ROUTER_PATH}/newadmin/chapter/info?id=${rowData.csId}`} >{rowData.companyName}</Link>, props: { rowSpan: 0 } }
                    }
                },
                key: 'companyName', dataIndex: 'companyName', width: 200, fixed: true
            },
            {
                title: '公司编码',
                render: (data, rowData, index) => {
                    if (rowData.len == 0) {
                        return { children: data, props: {} }
                    } else if (rowData.len > 0) {
                        return { children: data, props: { rowSpan: rowData.len } }
                    } else {
                        return { children: data, props: { rowSpan: 0 } }
                    }
                },
                key: 'companyCode', dataIndex: 'companyCode', width: 240,
            },

            { title: '开户银行', key: 'bankName', dataIndex: 'bankName', width: 240 },
            { title: '银行账号', key: 'bankAccount', dataIndex: 'bankAccount', width: 200 },
            {
                title: '账户用途',
                key: 'accountUse',
                dataIndex: 'accountUse',
                render: (data) => {
                    return accountUseString(data)
                },
                width: 100
            },
            { title: '银行类型', key: 'bankType', dataIndex: 'bankType', width: 200 },
            {
                title: '银行所在地区', key: 'area', width: 150,
                render: (data, rowData, index) => {
                    if(!rowData.province&& !rowData.city) {
                        return '/';
                    } 
                    return `${rowData.province} ${rowData.city}`
                },
            },
            {
                title: <FilterTable title="账户性质" ok={() => this.filterRequest()}>
                    {getTitle(['一般户', '基本户'], value => this.addFilterCache('accountType', value), 1)}
                </FilterTable>,
                key: 'accountType', dataIndex: 'accountType', width: 150
            },
            {
                title: '银行联系方式',
                render: (data) => {
                    if (data instanceof Array && data.length > 0)
                        return <div>{data.map((item) => <div>{item}</div>)}</div>
                    return data
                },
                key: 'bankContact', dataIndex: 'bankContact', width: 150
            },
            {
                title: <FilterTable title="信用代码证" ok={() => this.filterRequest()}>
                    {getTitle(['无', '有'], value => this.addFilterCache('creditCode', value))}
                </FilterTable>,
                key: 'creditCode', dataIndex: 'creditCode', width: 150
            },
            {
                title: <FilterTable title="密码支付器" ok={() => this.filterRequest()}>
                    {getTitle(['无', '有'], value => this.addFilterCache('passwordPayment', value))}
                </FilterTable>,
                key: 'passwordPayment', dataIndex: 'passwordPayment', width: 150
            },
            {
                title: <FilterTable title="账户管理费" ok={() => this.filterRequest()}>
                    {getTitle(['无', '有'], value => this.addFilterCache('accountManagement', value))}
                </FilterTable>,
                key: 'accountManagement', dataIndex: 'accountManagement', width: 150
            },
            {
                title: <FilterTable title="对账时间" ok={() => this.filterRequest()}>
                    {getTitle(['月初', '月中', '月末'], value => this.addFilterCache('checkBillTime', value))}
                </FilterTable>,
                key: 'checkBillTime', dataIndex: 'checkBillTime', width: 150
            },
            { title: '对账频率', key: 'checkBillFrequency', dataIndex: 'checkBillFrequency', width: 150 },
            { title: '是否办理U盾', key: 'usbKey', dataIndex: 'usbKey', width: 150 },
            { title: 'U盾经办人', key: 'usbKeyHandler', dataIndex: 'usbKeyHandler', width: 150 },
            { title: 'U盾复核人', key: 'usbKeyChecker', dataIndex: 'usbKeyChecker', width: 150 },
            { title: 'U盾保管部门', key: 'usbKeyKeepDep', dataIndex: 'usbKeyKeepDep', width: 150 },
            {
                title: <FilterTable title="是否加入集团网银" ok={() => this.filterRequest()}>
                    {getTitle(['否', '是'], value => this.addFilterCache('groupBank', value))}
                </FilterTable>,
                key: 'groupBank', dataIndex: 'groupBank', width: 180
            },
            {
                title: <FilterTable title="代发工资功能" ok={() => this.filterRequest()}>
                    {getTitle(['未开通', '开通'], value => this.addFilterCache('replacePayroll', value))}
                </FilterTable>,
                key: 'replacePayroll', dataIndex: 'replacePayroll', width: 150
            },
            {
                title: <FilterTable title="代发报销等功能" ok={() => this.filterRequest()}>
                    {getTitle(['未开通', '开通'], value => this.addFilterCache('replaceOther', value))}
                </FilterTable>,
                key: 'replaceOther', dataIndex: 'replaceOther', width: 150
            },
            // {
            //     title: <FilterTable title="社保托收银行账号" ok={() => this.filterRequest()}>
            //         {getTitle(['否', '是'], value => this.addFilterCache('bankAccountSocial', value))}
            //     </FilterTable>,
            //     key: 'bankAccountSocial', dataIndex: 'bankAccountSocial', width: 180
            // },
            // {
            //     title: <FilterTable title="公积金托收银行账号" ok={() => this.filterRequest()}>
            //         {getTitle(['否', '是'], value => this.addFilterCache('bankAccountFund', value))}
            //     </FilterTable>,
            //     key: 'bankAccountFund', dataIndex: 'bankAccountFund', width: 180
            // },
            {
                title: <FilterTable title="社保缴纳方式" ok={() => this.filterRequest()}>
                    {getTitle(['现金', '支票', '托收', '转账'], value => this.addFilterCache('payMethodSocial', value))}
                </FilterTable>,
                key: 'payMethodSocial', dataIndex: 'payMethodSocial', width: 200
            },
            {
                title: <FilterTable title="公积金缴纳方式" ok={() => this.filterRequest()}>
                    {getTitle(['现金', '支票', '托收', '转账'], value => this.addFilterCache('payMethodFund', value))}
                </FilterTable>,
                key: 'payMethodFund', dataIndex: 'payMethodFund', width: 200
            }

        ]

        return (
            <Spin spinning={this.state.loading}>
                {/* <Upload 
                    action={uploadApi}
                    beforeUpload={(file, fileList) => {
                        return false
                    }}>
                    <Button>上传</Button>
                </Upload> */}
                <TableTitle
                    tags={this.state.tags}
                    reset={this.resetFilterOptions}
                    filterCompany={() => this.filterRequest()}
                    companyName={this.state.companyName}
                    inputChange={
                        e => {
                            this.addFilterCache('companyName', e.target.value)
                            this.setState({ companyName: e.target.value })
                        }
                    } />
                <Table
                    columns={columns} dataSource={dataSorted} scroll={{ x: 4030, y: 500 }}
                    pagination={this.pagination(current, total)} bordered />
                <Modal
                    visible={this.state.entering}
                    title={`录入银行信息 | ${this.enteringCompanyName}`}
                    onCancel={this.enterBankCancel}
                    maskClosable={false}
                    width={800}
                    destroyOnClose={true}
                    style={{ height: 500 }}
                    footer={
                        <React.Fragment>
                            <Button type='primary' onClick={this.enterBankConfirm} loading={this.state.saveBtnLoading}>保存</Button>
                            <Button onClick={this.enterBankCancel}>取消</Button>
                        </React.Fragment>
                    }>
                    <BankInfoTab
                        className="bankInfoTab"
                        uploadApi={uploadApi}
                        edit={true}
                        data={this.banks || []}
                        setBankAccountSource={this.setBankAccountSource}
                        ref={node => this.bankInfoTab = node}
                        personSource={person}
                        bankTypes={this.bankType} />
                </Modal>
            </Spin>
        )
    }

    componentDidMount() {
        const tableDesc: any = document.querySelector('.ant-table-thead tr:first-child th')
        tableDesc.className = 'table-desc'

        // const w: HTMLElement = document.createElement('div')
        // // w.style.overflow = 'hidden'
        // const tableHeader = document.querySelector('.ant-table-scroll .ant-table-header .ant-table-fixed')
        // if (tableHeader != null) {
        //     const tableHeaderTds = tableHeader.querySelectorAll('tr:first-of-type th')
        //     if (tableHeaderTds != null) {
        //         Array.prototype.forEach.call(tableHeaderTds as any, (item) => {
        //             item.style.borderTop = '1px solid #e8e8e8'
        //         })
        //     }
        //     w.appendChild(tableHeader.cloneNode(true))
        //     tableHeader.parentNode && tableHeader.parentNode.replaceChild(w, tableHeader)
        // }
    }

    componentWillReceiveProps() {
        this.setState({ loading: false })
    }

}

function mapStateToProps(state) {
    const chapterFinancialTwo = state.get('chapterFinancialTwo')
    const chapterList = state.get('chapterList')
    return {
        data: chapterFinancialTwo.get('data').toJS(),
        dataSorted: chapterFinancialTwo.get('dataSorted').toJS(),
        originalData: chapterFinancialTwo.get('originalData'),
        total: chapterFinancialTwo.get('total'),
        person: chapterList.get('personSource')
    }
}

export default connect(mapStateToProps, { getBankInfo, personSourceGet, enableSwitch })(ChapterFinancialOne)