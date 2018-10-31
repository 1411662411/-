import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Spin, Col, Row, Input, Select, DatePicker, Cascader, Popover, Modal, Button } from 'antd'
import FilterTable from '../../components/filterTable/filterTable'
import TableTitle, { Tag } from '../../components/filter'
import { Link } from 'react-router';
import { getCompanyInfo, entry } from '../../action/businessComponents/chapterFinancialOneAction'
import chapterFinancialOne from "../../reducers/businessComponents/chapterFinancialOneReducer";
import '../../css/page/chapterFinancialOne.less'
import { ROUTER_PATH } from '../../global/global'
import ChapterInfoEnter from '../../businessComponents/chapter/chapterInfoEnter';

// functions
const getTitle = (type, cb, descBool?: string[]) => {
    switch (type) {
        case 0:
            return <Select onChange={cb} {...commonTitleProps}>
                <Option value={0}>{descBool && descBool[0]}</Option>
                <Option value={1}>{descBool && descBool[1]}</Option>
            </Select>
        case 1:
            return <div>
                <DatePicker onChange={value => cb(value, 0)} style={{ width: 150 }} getCalendarContainer={triggerNode => triggerNode.parentElement || document.body} />
                {/*<MonthPicker onChange={value => cb(value, 1)} style={{width: 100, marginLeft: 2}} getCalendarContainer={ triggerNode => triggerNode.parentElement || document.body }/>*/}
            </div>
        case 2:
            return <RangePicker onChange={cb} style={{ width: 240 }} getCalendarContainer={triggerNode => triggerNode.parentElement || document.body} />
        case 3:
            return <Cascader onChange={cb} options={cascaderOptions()} placeholder="请选择" getPopupContainer={triggerNode => (triggerNode ? triggerNode.parentElement : document.body) || document.body} />
        default:
            break
    }
}
const renderTaxPerson = data => (
    <div>
        <div>{data[0] ? `专管员：${data[0]}` : '专管员：无'}</div>
        <Popover content={<div>{data[1].map(item => <p>{item}</p>)}</div>} title="电话">
            {
                data[1].length > 0
                    ? <div>
                        <span>{`电话：${data[1][0]}等`}</span>
                        <span style={{ color: '#22baa0', cursor: 'pointer' }}>{`共${data[1].length}个`}</span>
                    </div>
                    : '电话：无'
            }
        </Popover>
    </div>
)
const renderLink = (data) => {
    if (data !== '/')
        return <a style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 130 }}
            href={data} target="_blank">{data}</a>
    return data
}

// variables
const Option = Select.Option
const cascaderOptions = () => {
    let opt: any[] = []
    for (let i = 1; i <= 2; i++) {
        if (i == 1) {
            let m: any[] = []
            for (let j = 1; j <= 31; j++) {
                m.push({ value: j.toString(), label: `${j}日` })
            }
            opt.push({ value: i.toString(), label: '每月', children: m })
        } else {
            let m: any[] = []
            for (let j = 1; j <= 12; j++) {
                let d: any[] = []
                switch (j) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        for (let z = 1; z <= 31; z++) {
                            d.push({ value: z.toString(), label: `${z}日` })
                        }
                        m.push({ value: j.toString(), label: `${j}月`, children: d })
                        break
                    case 2:
                        for (let z = 1; z <= 29; z++) {
                            d.push({ value: z.toString(), label: `${z}日` })
                        }
                        m.push({ value: j.toString(), label: `${j}月`, children: d })
                        break
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        for (let z = 1; z <= 30; z++) {
                            d.push({ value: z.toString(), label: `${z}日` })
                        }
                        m.push({ value: j.toString(), label: `${j}月`, children: d })
                        break
                }
            }
            opt.push({ value: i.toString(), label: '每年', children: m })
        }
    }
    return opt
}
const kv = {
    companyName: '公司名称', capitalVerificationReport: '验资报告', invoiceSeal: '发票专用章',
    taxFirstTime: '国税首次申报时间', taxCaTerm: '国税CA证书有效期', taxVpndTerm: '国税VPDN有效期',
    taxFirstTime_: '地税首次申报时间', taxCaTerm_: '地税CA证书有效期', residualReport: '残障金是否需要申报',
    socialLandTaxCut: '社保申报是否地税申报扣款', firstCutTime: '社保首次扣款时间', annualSocialDeadline1: '年度社保清算'
}

const { MonthPicker, RangePicker } = DatePicker
const commonTitleProps = {
    style: { width: 100 },
    placeholder: "请选择",
    getPopupContainer: triggerNode => triggerNode.parentElement || document.body
}
const actionProps = {
    getCompanyInfo,
    entry,
}
interface stateProps {
    data: any[],
    total: number;
}
interface internalState {
    loading: boolean;
    current: number;
    pageSize: number;
    tags: JSX.Element[];
    companyName: string;
    enterShow: boolean;
    enterFetching: boolean;
}

class ChapterFinancialOne extends React.Component<typeof actionProps & stateProps, internalState> {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            current: 1,
            pageSize: 20,
            tags: [],
            companyName: '',
            enterShow: false,
            enterFetching: false,
        }
        props.getCompanyInfo({
            start: (this.state.current - 1) * this.state.pageSize,
            length: this.state.pageSize
        })
    }

    /** 变量 */

    filterCache: any = {}


    /** 方法 */

    addFilterCache = (key, value, index?) => {
        // monthPicker
        if (typeof index === 'number') {
            if (!this.filterCache[key])
                this.filterCache[key] = []

            this.filterCache[key][index] = value
        } else {
            this.filterCache[key] = value
        }

        console.log(this.filterCache)
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

    // 处理filterCache是适应请求格式
    processFilterCache = () => ({
        companyName: this.filterCache.companyName,
        jsInfoCompanyBasic: {
            capitalVerificationReport: this.filterCache.capitalVerificationReport,
            invoiceSeal: this.filterCache.invoiceSeal,
        },
        jsInfoNationalTax: {
            taxFirstTime: this.filterCache.taxFirstTime,
            taxCaTermStart: this.filterCache.taxCaTerm && this.filterCache.taxCaTerm[0],
            taxCaTermEnd: this.filterCache.taxCaTerm && this.filterCache.taxCaTerm[1],
            taxVpndTermStart: this.filterCache.taxVpndTerm && this.filterCache.taxVpndTerm[0],
            taxVpndTermEnd: this.filterCache.taxVpndTerm && this.filterCache.taxVpndTerm[1],
        },
        jsInfoLandTax: {
            taxFirstTime: this.filterCache.taxFirstTime_,
            taxCaTermStart: this.filterCache.taxCaTerm_ && this.filterCache.taxCaTerm_[0],
            taxCaTermEnd: this.filterCache.taxCaTerm_ && this.filterCache.taxCaTerm_[1],
            residualReport: this.filterCache.residualReport,
            socialLandTaxCut: this.filterCache.socialLandTaxCut,
            annualSocialDeadline1: this.filterCache.annualSocialDeadline1,
            // annualSocialDeadline2:      this.filterCache.annualSocialDeadline2,
        },
        jsInfoSocial: {
            firstCutTime: this.filterCache.firstCutTime
        }
    })

    // 处理filterCache是适应tag显示
    processFilterCacheToTagData = () => {
        let tagData: any = {}
        for (let key in this.filterCache) {
            tagData[key] = this.filterCache[key]
            // 后处理
            switch (key) {
                // boolean
                case 'socialLandTaxCut':
                case 'residualReport':
                    tagData[key] = tagData[key] === 0 ? '否' : '是'
                    break
                case 'invoiceSeal':
                case 'capitalVerificationReport':
                    tagData[key] = tagData[key] === 0 ? '无' : '有'
                    break
                case 'taxCaTerm_':
                case 'taxVpndTerm':
                case 'taxCaTerm':
                    tagData[key] = tagData[key][0] + '~' + tagData[key][1]
                    break
                // last column
                case 'annualSocialDeadline1':
                    const a = tagData[key]
                    tagData[key] = (a[0] == 1 ? '每月' : '每年') + (a[2] ? `${a[1]}月${a[2]}日` : `${a[1]}日`) + '前'
                    break
                default:
                    break
            }
        }
        return tagData
    }

    // 带着缓存数据发起请求
    filterRequest = (payload = {params: {}} ) => {
        this.refreshTags()
        const { pageSize } = this.state
        this.props.getCompanyInfo({
            ...this.processFilterCache(),
            start: 0,
            length: pageSize,
            ...payload.params,
        })
        this.setState({ loading: true, current: 1, ...payload.params  })
    }

    pagination: (current: number, total: number, pageSize: number) => any = (current, total, pageSize) => ({
        current, total, pageSize,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total, range) => `第${range[0]}项-第${range[1]}项  共${total}项`,
        // showTotal: (total, range) => `第${(this.state.current-1) * 20 + 1}项-第${range[1]}项  共${total}项`,
        onChange: (page, pageSize) => {
            this.setState({ loading: true, current: page })
            this.props.getCompanyInfo({
                ...this.processFilterCache(),
                start: (page - 1) * pageSize,
                length: pageSize
            })
        },
        onShowSizeChange: (current, pageSize) => {
            this.setState({ current, pageSize })
            this.props.getCompanyInfo({
                start: (current - 1) * pageSize,
                length: pageSize
            })
        }
    })
    enter = ({id, companyName}) => {
        this.enterId = id;
        this.enterCompanyName = companyName;
        this.setState({
            enterShow: true,
        })
    }
    enterSave = () => {
        
        // const {
        //     chapterInfoEnterSave,
        // } = this.props;
        if (this.ChapterInfoEnter) {
            const result = this.ChapterInfoEnter.wrappedInstance.getResult();
            if (result) {
                this.setState({
                    enterFetching: true,
                })
                result.csId = this.enterId;
                this.props.entry(result, {
                    success: () => {
                        this.setState({
                            enterShow: false,
                            enterFetching: false,
                        })
                        this.filterRequest({
                            params: {start: (this.state.current  - 1) * this.state.pageSize,}
                        });
                    },
                    fail: () => {
                        this.setState({
                            enterFetching: false,
                        })
                    }
                });
            }
        }
    }
    enterId;
    enterCompanyName = '';
    ChapterInfoEnter;
    render() {
        const { data, total, } = this.props
        const { current, pageSize, enterFetching } = this.state
        const columns = [
            {
                title:'编辑',
                key: 'edit',
                width: 50,
                fixed: true,
                render: (data) => {
                    return <a href="#" onClick={e => {e.preventDefault(); this.enter(data)}}>编辑</a>
                }
            },
            {
                title: '公司名称', key: 'companyName', dataIndex: 'companyName', width: 230, fixed: true,
                render: (data, rowData) => {
                    return <Link to={`${ROUTER_PATH}/newadmin/chapter/info?id=${rowData.id}`} >{rowData.companyName}</Link>
                }
            },
            {
                title: '公司基本信息', children: [
                    { title: '负责人', key: 'chargeMan', dataIndex: 'chargeMan', width: 200 },
                    { title: '成立时间', key: 'fundingTime', dataIndex: 'fundingTime', width: 150 },
                    { title: '纳税人统一信用代码', key: 'taxpayerCreditCode', dataIndex: 'taxpayerCreditCode', width: 160 },
                    { title: '营业场所(注册地址)', key: 'businessRegisterAddress1', dataIndex: 'businessRegisterAddress1', width: 230 },
                    { title: '办公地址', key: 'businessOfficeAddress1', dataIndex: 'businessOfficeAddress1', width: 230 },
                    {
                        title: <FilterTable title="验资报告" ok={() => this.filterRequest()}>
                            {getTitle(0, value => this.addFilterCache('capitalVerificationReport', value), ['无', '有'])}
                        </FilterTable>,
                        key: 'capitalVerificationReport', dataIndex: 'capitalVerificationReport', width: 230
                    },
                    { title: '营业期限', key: 'registerDeadline', dataIndex: 'registerDeadline', width: 200 },
                    {
                        title: <FilterTable title="发票专用章" ok={() => this.filterRequest()}>
                            {getTitle(0, value => this.addFilterCache('invoiceSeal', value), ['无', '有'])}
                        </FilterTable>,
                        key: 'invoiceSeal', dataIndex: 'invoiceSeal', width: 150
                    },
                ]
            },
            {
                title: '国税信息', children: [
                    {
                        title: '国税申报网址',
                        render: renderLink,
                        key: 'taxUrl', dataIndex: 'taxUrl', width: 150
                    },
                    { title: '国税登录密码', key: 'taxPassword', dataIndex: 'taxPassword', width: 230 },
                    {
                        title: <FilterTable title="国税首次申报时间" ok={() => this.filterRequest()}>
                            {getTitle(1, (value, index) => this.addFilterCache('taxFirstTime', value.format('YYYY/MM/DD')))}
                        </FilterTable>,
                        key: 'taxFirstTime', dataIndex: 'taxFirstTime', width: 150
                    },
                    {
                        title: '国税专管员&电话',
                        render: data => renderTaxPerson(data),
                        key: 'taxPerson', dataIndex: 'taxPerson', width: 200
                    },
                    {
                        title: <FilterTable title="国税CA证书有效期" ok={() => this.filterRequest()}>
                            {getTitle(2, (value, index) => this.addFilterCache('taxCaTerm', [value[0].format('YYYY/MM/DD'), value[1].format('YYYY/MM/DD')]))}
                        </FilterTable>,
                        key: 'taxCaTerm', dataIndex: 'taxCaTerm', width: 200
                    },
                    {
                        title: <FilterTable title="国税VPDN有效期" ok={() => this.filterRequest()}>
                            {getTitle(2, value => this.addFilterCache('taxVpndTerm', [value[0].format('YYYY/MM/DD'), value[1].format('YYYY/MM/DD')]))}
                        </FilterTable>,
                        key: 'taxVpndTerm', dataIndex: 'taxVpndTerm', width: 200
                    }
                ]
            },
            {
                title: '地税信息', children: [
                    {
                        title: '地税申报网址',
                        render: renderLink,
                        key: 'taxUrl_', dataIndex: 'taxUrl_', width: 150
                    },
                    {
                        title: <FilterTable title="地税首次申报时间" ok={() => this.filterRequest()}>
                            {getTitle(1, (value, index) => this.addFilterCache('taxFirstTime_', value.format('YYYY/MM/DD')))}
                        </FilterTable>,
                        key: 'taxFirstTime_', dataIndex: 'taxFirstTime_', width: 150
                    },
                    { title: '地税登录密码', key: 'taxPassword_', dataIndex: 'taxPassword_', width: 230 },
                    { title: '地税服务厅地址', key: 'taxHallAddress', dataIndex: 'taxHallAddress', width: 230 },
                    {
                        title: '地税专管员&电话',
                        render: data => renderTaxPerson(data),
                        key: 'taxPerson_', dataIndex: 'taxPerson_', width: 200
                    },
                    {
                        title: <FilterTable title="地税CA证书有效期" ok={() => this.filterRequest()}>
                            {getTitle(2, value => this.addFilterCache('taxCaTerm_', [value[0].format('YYYY/MM/DD'), value[1].format('YYYY/MM/DD')]))}
                        </FilterTable>,
                        key: 'taxCaTerm_', dataIndex: 'taxCaTerm_', width: 200
                    },
                    { title: '个税申报系统登录', key: 'personalTaxSystem', dataIndex: 'personalTaxSystem', width: 230 },
                    { title: '个税申报密码', key: 'personalTaxPassword', dataIndex: 'personalTaxPassword', width: 230 },
                    {
                        title: <FilterTable title="残障金是否需要申报" ok={() => this.filterRequest()}>
                            {getTitle(0, value => this.addFilterCache('residualReport', value), ['否', '是'])}
                        </FilterTable>,
                        key: 'residualReport', dataIndex: 'residualReport', width: 150
                    },
                    {
                        title: <FilterTable title="社保申报是否地税申报扣款" ok={() => this.filterRequest()}>
                            {getTitle(0, value => this.addFilterCache('socialLandTaxCut', value), ['否', '是'])}
                        </FilterTable>,
                        key: 'socialLandTaxCut', dataIndex: 'socialLandTaxCut', width: 150
                    },
                    { title: '社会保险登记编码', key: 'registerCode', dataIndex: 'registerCode', width: 230 },
                    { title: '社会保险指定收款人', key: 'payee', dataIndex: 'payee', width: 230 },
                    {
                        title: <FilterTable title="社保首次扣款时间" ok={() => this.filterRequest()}>
                            {getTitle(1, (value, index) => this.addFilterCache('firstCutTime', value.format('YYYY/MM/DD')))}
                        </FilterTable>,
                        key: 'firstCutTime', dataIndex: 'firstCutTime', width: 150
                    },
                    {
                        title: <FilterTable title="年度社保清算" ok={() => this.filterRequest()}>
                            {getTitle(3, (value, selected) => this.addFilterCache('annualSocialDeadline1', value))}
                        </FilterTable>,
                        key: 'annualSocialDeadline1', dataIndex: 'annualSocialDeadline1', width: 150
                    }
                ]
            }
        ];
        
        return (
            <Spin spinning={this.state.loading}>
                <TableTitle
                    tags={this.state.tags}
                    reset={this.resetFilterOptions}
                    companyName={this.state.companyName}
                    filterCompany={this.filterRequest}
                    inputChange={
                        e => {
                            this.addFilterCache('companyName', e.target.value)
                            this.setState({ companyName: e.target.value })
                        }
                    } />
                <Table
                    columns={columns} dataSource={data} scroll={{ x: 5590, y: 500 }}
                    pagination={this.pagination(current, total, pageSize)} bordered />
                <Modal
                    key={`${this.enterId}${this.state.enterShow}`}
                    title={`编辑 | ${this.enterCompanyName}`}
                    visible={this.state.enterShow}
                    maskClosable={false}
                    onCancel={() => this.setState({ enterShow: false })}
                    footer={<div>
                        <Button loading={enterFetching} type="primary" onClick={this.enterSave}>保存</Button>
                        <Button onClick={() => this.setState({ enterShow: false })}>取消</Button>
                    </div>}
                    width={950}
                >
                    <div>
                        <ChapterInfoEnter
                            csId={this.enterId}
                            className="chapter-list-modal"
                            ref={node => this.ChapterInfoEnter = node} 
                            edit={true}
                            panes={[2,3]}
                        />
                    </div>
                </Modal>
            </Spin>
        )
    }

    componentWillReceiveProps() {
        this.setState({ loading: false })
    }

    componentDidMount() {
        // const tableHeader = document.getElementsByClassName('ant-table-header')[0]
        //
        // const wrapper = document.createElement('div')
        // wrapper.className = 'adjust-wrapper'
        //
        // const first = document.createElement('span')
        // first.textContent = '公司基本信息'
        // first.className = 'adjust-first'
        // const second = document.createElement('span')
        // second.textContent = '国税信息'
        // second.className = 'adjust-second'
        // const third = document.createElement('span')
        // third.textContent = '地税信息'
        // third.className = 'adjust-third'
        //
        // wrapper.appendChild(first)
        // wrapper.appendChild(second)
        // wrapper.appendChild(third)
        //
        // tableHeader.insertBefore(wrapper, document.getElementsByClassName('ant-table-fixed')[0])
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

}

function mapStateToProps(state) {
    const companyInfo = state.get('chapterFinancialOne')
    return {
        data: companyInfo.get('data').toJS(),
        total: companyInfo.get('total'),
    }
}

export default connect(mapStateToProps, { getCompanyInfo, entry })(ChapterFinancialOne)