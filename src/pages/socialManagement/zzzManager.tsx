import React from 'react'
import { connect } from 'react-redux'
import { Button, Select, Table, Spin, Tooltip } from 'antd'
import { getCompanyList } from '../../action/businessComponents/chapterInfoAction'
import { Company } from '../chapter/chapterInfo'
import { listCompanyWithCs } from '../../api/businessComponents/chapterInfoApi'
import { enCodeChar } from '../../util/encodechar'
import '../../css/page/common.less'

/* 组件 */

/* 常量 */
const Option = Select.Option
const actionCreator = { getCompanyList }
type PageProps = {
    company: Company[]
}
type PageState = {
    currentCompanyMangerInfo: any,
    tableSpin: boolean,
    error: boolean,
}

class ZZZManager extends React.Component<typeof actionCreator & PageProps, PageState> {
    constructor(props) {
        super(props)
        props.getCompanyList()
        this.state = {
            currentCompanyMangerInfo: null,
            tableSpin: false,
            error: false
        }
    }

    column = [
        { title: '公司名称', key: 'companyName', dataIndex: 'companyName',  width: 200 }, 
        {title: '营业执照',key: '11',dataIndex: '11', width: 200}, 
        {title: '公章',key: '21',dataIndex: '21', width: 200}, 
        {title: '法人章',key: '22',dataIndex: '22', width: 200}, 
        {title: '财务章',key: '23',dataIndex: '23', width: 200}, 
        {title: '人力资源服务许可证',key: '31',dataIndex: '31', width: 200}, 
        {
            title: '劳务派遣许可证',key: '32',dataIndex: '32', width: 200,
            render: (data) => 
                <Tooltip title={<span style={{wordBreak: 'break-all'}}>{data}</span>}>
                    <span className='ellipsis'>{data}</span> 
                </Tooltip>
        }, 
        {title: '开户许可证',key: '33',dataIndex: '33', width: 200}
    ]

    search = async (v, o) => {
        this.setState({ tableSpin: true })
        let res = await fetch(listCompanyWithCs, { 
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: enCodeChar({csId: v, companyName: o.props['data-cname']}),
        })
        let jsonData = await res.json()
        this.setState({ 
            currentCompanyMangerInfo: this.processServerResult(jsonData.data.rows[0]), 
            tableSpin: false 
        })
    }

    searchBtn = async (companyName) => {
        console.log(companyName)
        this.setState({ tableSpin: true })
        let res = await fetch(listCompanyWithCs, { 
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: enCodeChar({csId: null, companyName}),
        })
        let jsonData = await res.json()
        this.setState({ 
            currentCompanyMangerInfo: this.processServerResult(jsonData.data.rows[0]), 
            tableSpin: false 
        })
    }

    processServerResult = (obj) => {
        let RULE = [11, 21, 22, 23, 31, 32, 33]
        const newMap = {}
        if (obj) {
            const oldMap = obj.csMap
            if (oldMap)
                Object.keys(oldMap).forEach(key => {
                    RULE = RULE.filter(item => item != parseInt(key))
                    newMap[key] = oldMap[key]['record'] || oldMap[key]['operatorInfo']
                })
        } else {
            return []
        }
        RULE.forEach(r => {
            newMap[r] = '/'
        })
        newMap['companyName'] = obj.companyName
        return [newMap]
    }

    render() {

        const getCompanyOptions = () => this.props.company.map(item => <Option key={item.id} value={item.id} data-cname={item.companyName}>{item.companyName}</Option>)

        return (
            <div>
                <div style={{marginBottom: 20}}>
                    <span>公司名称: </span>
                    <Select
                        showSearch
                        allowClear
                        ref="sl"
                        style={{ width: 400, marginLeft: 20 }} placeholder="请搜索公司名称"
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{overflowX: 'scroll', width: 200}}
                        filterOption={(inputValue, option)=>{
                            const label = option.props.children as string
                            return label.indexOf(inputValue) > -1
                        }}
                        onSelect={this.search}>
                        {getCompanyOptions()}
                    </Select>
                </div>
                {this.state.error && <span>渲染出错</span>}
                <Spin spinning={this.state.tableSpin}>
                    <Table scroll={{x: 1600}} bordered={true} columns={this.column} dataSource={this.state.currentCompanyMangerInfo} pagination={false}/>
                </Spin>
            </div>
        )
    }

    componentDidCatch(err, info) {
        console.log(err, info)
        this.setState({ error: true })
    }
}

function mapStateToProps(state) {
    const chapterInfo = state.get('chapterInfo')
    return {
        // temp: chapterInfo.get('temp'),
        company: chapterInfo.get('company').toJS()
    }
}

export default connect(mapStateToProps, { getCompanyList })(ZZZManager)