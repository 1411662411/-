import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Anchor, Select, Row, Col, Table, Checkbox, Spin, Card, Tooltip, BackTop } from 'antd'
import { getExample, getCompanyList, getDetail } from '../../action/businessComponents/chapterInfoAction';
import ChapterInfoEnter from '../../businessComponents/chapter/chapterInfoEnter';
import '../../css/page/chapterInfo.less'

// type
const actionCreator = { getExample, getCompanyList, getDetail }
export interface Company {
    id: number,
    companyName: string,
    creatorId: number,
    creatorInfo: string,
    type: number
}
interface ZZZ {
    exist: boolean,
    operatorId: number,
    operatorInfo: string,
    phone: string,
    record: string
}
interface Bank {
    exist: boolean,
    openTime: string
}
export interface Detail {
    id: number,
    type: number,
    rule: number[],
    companyName: string,
    creatorId: number,
    creatorInfo: string,
    csMap: any,
    jsInfoCompanyBasic: any,
    jsInfoNationalTax: any,
    jsInfoLandTax: any,
    jsInfoBanks: any[],
    jsInfoSocial: any,
    jsInfoCommonFund: any,
    jsInfoIndustry: any,
    jsInfoContact: any,
    jsInfoHuman: any,
    jsInfoLabor: any
}
interface chapterInfoProps {
    temp: string,
    company: Company[],
    detail: Detail
}

// function
const renderTableColumn = (data: ZZZ | Bank, rowData: any, mark: number, bank?: boolean) => {
    if (rowData.rule.indexOf(mark) < 0) {
        return <span className="not-exist">/</span>
    }
    if (!data) {
        return <span>/</span>
    }
    if (bank) {
        const { exist, openTime } = data as Bank
        return <Checkbox checked={exist}>{openTime || '/'}</Checkbox>
    }
    const { exist, operatorInfo, record } = data as ZZZ
    return <Row>
            <Col span={3}>
                <Checkbox checked={exist}/>
            </Col>
            <Col span={21}>
                <div>
                    {record 
                        ? <Tooltip title={<span style={{wordBreak: 'break-all'}}>{record}</span>}><span className='ellipsis'>{record}</span> </Tooltip>
                        : (operatorInfo || record ||  '/')}
                </div>
            </Col>
        </Row>
}

// variable
let defaultCsId: number
let defaultCsIdValue: string
const Link = Anchor.Link
const Option = Select.Option
const colBusinessLicense = [
    { title: '营业执照', key: '11', width: 200, dataIndex: '11', render: (d, r) => renderTableColumn(d, r, 11) },
    { title: '组织机构代码证', key: '12', width: 200, dataIndex: '12', render: (d, r) => renderTableColumn(d, r, 12) },
    { title: '税务登记证', key: '13', width: 200, dataIndex: '13', render: (d, r) => renderTableColumn(d, r, 13) },
    { title: '社会保险登记证', key: '14', width: 200, dataIndex: '14', render: (d, r) => renderTableColumn(d, r, 14) },
    { title: '统计登记证', key: '15', width: 200, dataIndex: '15', render: (d, r) => renderTableColumn(d, r, 15) }
]
const colChapter = [
    { title: '公章', key: '21', width: 200, dataIndex: '21', render: (d, r) => renderTableColumn(d, r, 21) },
    { title: '法人章', key: '22', width: 200, dataIndex: '22', render: (d, r) => renderTableColumn(d, r, 22) },
    { title: '财务章', key: '23', width: 200, dataIndex: '23', render: (d, r) => renderTableColumn(d, r, 23) },
    { title: '合同章', key: '24', width: 200, dataIndex: '24', render: (d, r) => renderTableColumn(d, r, 24) },
    { title: '发票章', key: '25', width: 200, dataIndex: '25', render: (d, r) => renderTableColumn(d, r, 25) },
    { title: '人事行政章', key: '26', width: 200, dataIndex: '26', render: (d, r) => renderTableColumn(d, r, 26) }
]
const colOperationLicense = [
    { title: '人力资源服务许可证', key: '31', width: 200, dataIndex: '31', render: (d, r) => renderTableColumn(d, r, 31) },
    { title: '劳务派遣许可证', key: '32', width: 200, dataIndex: '32', render: (d, r) => renderTableColumn(d, r, 32) },
    { title: '开户许可证', key: '33', width: 200, dataIndex: '33', render: (d, r) => renderTableColumn(d, r, 33) }
]
const colBank = [
    { title: '银行基本户', key: '41', width: 200, dataIndex: '41', render: (d, r) => renderTableColumn(d, r, 41, true) },
    { title: '银行一般户', key: '42', width: 200, dataIndex: '42', render: (d, r) => renderTableColumn(d, r, 42, true) },
    { title: '社保户', key: '51', width: 200, dataIndex: '51', render: (d, r) => renderTableColumn(d, r, 51, true) },
    { title: '公积金户', key: '52', width: 200, dataIndex: '52', render: (d, r) => renderTableColumn(d, r, 52, true) }
]

class ChapterInfo extends React.Component<typeof actionCreator & chapterInfoProps, any> {
    constructor(props, context) {
        super(props, context)
        const id =  parseInt(location.search.substr(4)) // 地址栏参数
        this.state = {
            loading: true,
            csId: id >=0 ? id : null
        }
        props.getExample('new value')
        props.getCompanyList()
        this.getDefaultData(id)
    }

    render() {

        const { dataBusinessLicense, dataChapter, dataOperationLicense, dataBank, typeText, creatorInfo } = this.getDetail()
        // 公司选择框option列表
        const getCompanyOptions = () => this.props.company.map(item => <Option key={item.id} value={item.companyName}>{item.companyName}</Option>)

        const id = this.state.csId
        return (
            <Spin spinning={this.state.loading}>
                <BackTop/>
                <Row>
                    <Col span={6} offset={4}>
                        <span>公司名称: </span>
                        {/*此组件在render时不会更新(因为只有子组件option随着props发生改变) 故而其defaultValue也不会改变 设置props.detail改变时更新Select 使其defaultValue发生变化*/}
                        <Select
                            showSearch
                            ref="sl"
                            key={this.props.detail.companyName || 'defaultKey'}
                            defaultValue={this.props.detail.companyName || ''}
                            onChange={this.handleChangeCompany}
                            style={{ width: 200 }} placeholder="请选择公司"
                            dropdownMatchSelectWidth={false}
                            dropdownStyle={{overflowX: 'scroll', width: 200}}
                            optionFilterProp="children" allowClear={true}>
                            {getCompanyOptions()}
                        </Select>
                    </Col>
                    <Col span={6}>
                        <span>
                            <span style={{fontWeight: 'bold'}}>开办人: </span>
                            <span>{creatorInfo}</span>
                        </span>
                    </Col>
                    <Col span={6}>
                        <span>
                            <span style={{fontWeight: 'bold'}}>登记模式: </span>
                            <span>{typeText}</span>
                        </span>
                    </Col>
                </Row>

                <div style={{height: 1, backgroundColor: '#eee', margin: '10px 0'}}/>

                <Row style={{marginTop: 18}} className='chapterInfoPage'>
                    <Col span={4} style={{position: 'relative'}}>
                        <div style={{position: 'absolute'}}>
                        <Anchor affix={true} bounds={5} offsetTop={5}>
                            <Link href="#Zzz" title="证章照信息" />
                            <Link href="#CompanyInfo" title="公司基本信息" />
                            <Link href="#CentralTax" title="国税信息" />
                            <Link href="#LandTax" title="地税信息" />
                            <Link href="#BankInfo" title="银行账户信息" />
                            <Link href="#SocialInfo" title="社保五险信息" />
                            <Link href="#FundInfo" title="公积金信息" />
                            <Link href="#IannualInspectInfo" title="工商年检" />
                            <Link href="#ContactInfo" title="联系人" />
                            <Link href="#HumanInfo" title="人力资源服务许可证" />
                            <Link href="#LaborInfo" title="劳动派遣许可证" />
                            <Link href="#Record" title="操作日志" />
                        </Anchor>
                        </div>
                    </Col>

                    {/*表格一*/}

                    <Col span={20} offset={4}>
                        <Card title="工商相关证照情况" style={{marginBottom: 26}} id="Zzz">
                            <Table columns={colBusinessLicense} dataSource={dataBusinessLicense} pagination={false} bordered className="custom-table"/>
                        </Card>
                    </Col>


                    {/*表格二*/}

                    <Col span={20} offset={4}>
                        <Card title="印章情况" style={{marginBottom: 26}}>
                            <Table columns={colChapter} dataSource={dataChapter} pagination={false} bordered className="custom-table"/>
                        </Card>
                    </Col>

                    {/*表格三*/}

                    <Col span={20} offset={4}>
                        <Card title="业务相关证照情况" style={{marginBottom: 26}}>
                            <Table columns={colOperationLicense} dataSource={dataOperationLicense} pagination={false} bordered className="custom-table"/>
                        </Card>
                    </Col>

                    {/*表格四*/}

                    <Col span={20} offset={4}>
                        <Card title="银行账户情况" style={{marginBottom: 26}}>
                            <Table columns={colBank} dataSource={dataBank} pagination={false} bordered className="custom-table"/>
                        </Card>
                    </Col>


                    <Col span={20} offset={4}>
                        {
                            this.state.csId
                                ? <ChapterInfoEnter key={this.state.csId} csId={this.state.csId} edit={false}/>
                                : ''
                        }
                    </Col>
                </Row>
            </Spin>
        )
    }

    // 此生命周期中setState不会重新渲染 loading状态保存在state中而非store(适合一个操作只有一个请求)
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: false })

        // let select:any = this.refs.sl
        // if (select && nextProps.detail.companyName)
        //     select.props.defaultValue = nextProps.detail.companyName
    }

    componentDidUpdate() {
        // componentWillReceiveProps发生在render之前
        this.adjustTableHead()
    }

    componentDidMount() {
        // 修复Select设置defaultValue placeholder自动隐藏
        let d: any =  document.querySelector('.ant-select-selection__placeholder')
        this.props.detail.companyName || (d.style.display = 'block')
    }

    handleChangeCompany = (value) => {
        const { company, getDetail } = this.props
        company.forEach(item => {
            if (item.companyName === value) {
                this.setState({ csId: item.id, loading: true })
                getDetail({ csId: item.id })
            }
        })
    }

    // 根据公司id获取章证照信息
    getDetail = () => {
        let dataBusinessLicense
        let dataChapter
        let dataOperationLicense
        let dataBank
        let typeText

        const { type, csMap, creatorInfo, rule } = this.props.detail

        if (csMap) {
            dataBusinessLicense = [{
                '11': csMap['11'], '12': csMap['12'], '13': csMap['13'], '14': csMap['14'], '15': csMap['15'], rule: rule[type]
            }]
            dataChapter = [{
                '21': csMap['21'], '22': csMap['22'], '23': csMap['23'], '24': csMap['24'], '25': csMap['25'], '26': csMap['26'], rule: rule[type]
            }]
            dataOperationLicense = [{
                '31': csMap['31'], '32': csMap['32'], '33': csMap['33'], rule: rule[type]
            }]
            dataBank = [{
                '41': csMap['41'], '42': csMap['42'], '51': csMap['51'], '52': csMap['52'], rule: rule[type]
            }]
        }

        switch (type) {
            case 1: // 传统章证
                typeText = '传统章证'
                break
            case 2:
                typeText = '三证合一'
                break
            case 3:
                typeText = '五证合一'
                break
            case 4:
                typeText = '多证合一'
                break
            default:
                break
        }

        return { dataBusinessLicense, dataChapter, dataOperationLicense, dataBank, typeText, creatorInfo }
    }

    // 根据表格渲染的内容改变表头背景颜色
    adjustTableHead = () => {
        let heads: any = document.querySelectorAll('.custom-table .ant-table-thead th')
        let targets: any = document.querySelectorAll('.custom-table .ant-table-tbody td')
        for (let i = 0; i < targets.length; i++) {
            if (targets[i].lastElementChild.className === 'not-exist') {
                heads[i].className += ' gray-background-th'
            } else {
                heads[i].className = ''
            }
        }
    }

    // constructor invoke
    getDefaultData = (id) => {
        id >= 0 && this.props.getDetail({ csId: id })
    }
}

function mapStateToProps(state) {
    const chapterInfo = state.get('chapterInfo')
    return {
        temp: chapterInfo.get('temp'),
        company: chapterInfo.get('company').toJS(),
        detail: chapterInfo.get('detail').toJS()
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getExample, getCompanyList, getDetail }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ChapterInfo)