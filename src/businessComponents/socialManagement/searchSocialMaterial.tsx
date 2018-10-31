import * as React from 'react';
import {
    connect,
} from 'react-redux';
import {
    Col,
    Row,
    Form,
    Button,
    Tag,
    Table, Icon, Divider, message
} from 'antd'
import { DOMAIN_OXT } from "../../global/global";
import {
    searchSocialMaterialDis,
    searchSocialListMaterialDis,
    searchSocialListExportDis,
} from '../../action/socialManagement/searchSocialMaterialAction'
import SelectCity from '../../components/select-city/index';
import './searchSocialMaterial.less'
const FormItem =Form.Item
const { Column, ColumnGroup } = Table;
const numberTrans = {
    1: '一、',
    2: '二、',
    3: '三、',
    4: '四、',
    5: '五、',
    6: '六、',
    7: '七、',
}
function merialTrans(arr:any):any{
    let dataH:any = []
    arr.map((val, index) => {
        let numberRed = val.split(' ')[0]
        let numberOther = val.replace(val.split(' ')[0],'')
        dataH.push(<div><div>{index + 1}.<span style={{ 'color': 'red' }}>{numberRed}</span></div><span style={{'display':'inline-block','marginLeft':'10px'}}>{numberOther}</span></div>)
    })
    return dataH
}
let timeChunk:any = null
// const merialTrans:any = (arr)=>{
//     arr.map((val,index)=>{
//         <div>{val}</div>
//     })
// }
const columns = [
    {
        title: '政策地',
        key: 'districtName',
        render: (data, recorde, index) => {
            return (
                <span>{data.provinceName}{data.cityName}<br/>{data.districtName}</span>
            )
        },
        width: 100,
    },{
        title: '平台材料接收截止日(遇节假日提前)',
        key: 'wFuntStuffTime',
        className:'centerStyle',
        render: (data, recorde, index) => {
            return (
                <span>{data.wFuntStuffTime}号</span>
                
            )
        },
        width: 100,
    },{
        title: 'sp材料接收截止日(遇节假日提前)',
        key: 'spWFundStuffTime',
        className: 'centerStyle',
        render: (data, recorde, index) => {
            return (
                <span> {data.spWFundStuffTime }号</span >
            )
        },
        width: 100,

      },{
        title: '五险新增',
        children: [{
            title: '有补缴',
            key: 'age',
            width: 200,
            render: (data, recorde, index)=>{
                if (JSON.stringify(data.insuredTypeList) != "{}"){
                    if (data.insuredTypeList['185']){
                        const dataList = data.insuredTypeList['185'].insuredPersonTypeList
                        let dataHtml: any = []
                        let ind = 1
                        for (let k in dataList) {
                            dataHtml.push(
                                <div>
                                    <h4>
                                        <span>{numberTrans[ind]}</span>
                                        {dataList[k].insuredPersonTypeName}
                                    </h4>
                                    <h6>
                                        {merialTrans(dataList[k].materialList)}
                                    </h6>
                                </div>
                            )
                            ind++
                        }

                        return (
                            dataHtml
                        )  
                    } else {
                        return '/'
                    }
                }else{
                    return '/'
                }
                
            }
        }, {
            title: '无补缴',
            key: 'age',
            width: 200,
           render: (data, recorde, index)=>{
               if (JSON.stringify(data.insuredTypeList) != "{}"){
                   if (data.insuredTypeList['184']) {
                    const dataList = data.insuredTypeList['184'].insuredPersonTypeList
                    let dataHtml: any = []
                    let ind = 1
                    for (let k in dataList) {
                        dataHtml.push(
                            <div>
                                <h4>
                                    <span>{numberTrans[ind]}</span>
                                    {dataList[k].insuredPersonTypeName}
                                </h4>
                                <h6>
                                    {merialTrans(dataList[k].materialList)}
                                </h6>
                            </div>
                        )
                        ind++
                    }

                    return (
                        dataHtml
                       )
                   } else {
                       return '/'
                   }
                }else{
                    return '/'
                }
                
            }
        }],
    }, {
        title: '五险续保',
        children: [{
            title: '有补缴',
            key: 'age',
            width: 200,
            render: (data, recorde, index) => {
                if (JSON.stringify(data.insuredTypeList) != "{}") {
                    if (data.insuredTypeList['187']) {
                    const dataList = data.insuredTypeList['187'].insuredPersonTypeList
                    let dataHtml: any = []
                    let ind = 1
                    for (let k in dataList) {
                        dataHtml.push(
                            <div>
                                <h4>
                                    <span>{numberTrans[ind]}</span>
                                    {dataList[k].insuredPersonTypeName}
                                </h4>
                                <h6>
                                    {merialTrans(dataList[k].materialList)}
                                </h6>
                            </div>
                        )
                        ind++
                    }

                    return (
                        dataHtml
                        )
                    } else {
                        return '/'
                    }
                } else {
                    return '/'
                }

            }
        }, {
            title: '无补缴',
            key: 'age',
            width: 200,
            render: (data, recorde, index) => {
                if (JSON.stringify(data.insuredTypeList) != "{}") {
                    if (data.insuredTypeList['186']) {
                    const dataList = data.insuredTypeList['186'].insuredPersonTypeList
                    let dataHtml: any = []
                    let ind = 1
                    for (let k in dataList) {
                        dataHtml.push(
                            <div>
                                <h4>
                                    <span>{numberTrans[ind]}</span>
                                    {dataList[k].insuredPersonTypeName}
                                </h4>
                                <h6>
                                    {merialTrans(dataList[k].materialList)}
                                </h6>
                            </div>
                        )
                        ind++
                    }

                    return (
                        dataHtml
                        )
                    } else {
                        return '/'
                    }
                } else {
                    return '/'
                }

            }
        }],
    }, {
        title: '公积金新增',
        children: [{
            title: '有补缴',
            key: 'age',
            width: 200,
            render: (data, recorde, index) => {
                if (JSON.stringify(data.insuredTypeList) != "{}") {
                    if (data.insuredTypeList['189']) {
                    const dataList = data.insuredTypeList['189'].insuredPersonTypeList
                    let dataHtml: any = []
                    let ind = 1
                    for (let k in dataList) {
                        dataHtml.push(
                            <div>
                                <h4>
                                    <span>{numberTrans[ind]}</span>
                                    {dataList[k].insuredPersonTypeName}
                                </h4>
                                <h6>
                                    {merialTrans(dataList[k].materialList)}
                                </h6>
                            </div>
                        )
                        ind++
                    }

                    return (
                        dataHtml
                        )
                    } else {
                        return '/'
                    }
                } else {
                    return '/'
                }

            }
        }, {
            title: '无补缴',
            key: 'age',
            width: 200,
                render: (data, recorde, index) => {
                    if (JSON.stringify(data.insuredTypeList) != "{}") {
                        if (data.insuredTypeList['188']) {
                        const dataList = data.insuredTypeList['188'].insuredPersonTypeList
                        let dataHtml: any = []
                        let ind = 1
                        for (let k in dataList) {
                            dataHtml.push(
                                <div>
                                    <h4>
                                        <span>{numberTrans[ind]}</span>
                                        {dataList[k].insuredPersonTypeName}
                                    </h4>
                                    <h6>
                                        {merialTrans(dataList[k].materialList)}
                                    </h6>
                                </div>
                            )
                            ind++
                        }

                        return (
                            dataHtml
                            )
                        } else {
                            return '/'
                        }
                    } else {
                        return '/'
                    }

                }
        }],
    }, {
        title: '公积金续保',
        children: [{
            title: '有补缴',
            key: 'age',
            width: 200,
            render: (data, recorde, index) => {
                if (JSON.stringify(data.insuredTypeList) != "{}") {
                    if (data.insuredTypeList['191']) {
                    const dataList = data.insuredTypeList['191'].insuredPersonTypeList
                    let dataHtml: any = []
                    let ind = 1
                    for (let k in dataList) {
                        dataHtml.push(
                            <div>
                                <h4>
                                    <span>{numberTrans[ind]}</span>
                                    {dataList[k].insuredPersonTypeName}
                                </h4>
                                <h6>
                                    {merialTrans(dataList[k].materialList)}
                                </h6>
                            </div>
                        )
                        ind++
                    }

                    return (
                        dataHtml
                        )
                    } else {
                        return '/'
                    }
                } else {
                    return '/'
                }

            }
        }, {
            title: '无补缴',
            key: 'age',
            width: 200,
                render: (data, recorde, index) => {
                    if (JSON.stringify(data.insuredTypeList) != "{}") {
                        if (data.insuredTypeList['190']) {
                        const dataList = data.insuredTypeList['190'].insuredPersonTypeList
                        let dataHtml: any = []
                        let ind = 1
                        for (let k in dataList) {
                            dataHtml.push(
                                <div>
                                    <h4>
                                        <span>{numberTrans[ind]}</span>
                                        {dataList[k].insuredPersonTypeName}
                                    </h4>
                                    <h6>
                                        {merialTrans(dataList[k].materialList)}
                                    </h6>
                                </div>
                            )
                            ind++
                        }

                        return (
                            dataHtml
                            )
                        } else {
                            return '/'
                        }
                    } else {
                        return '/'
                    }

                }
        }],
    }, {
        title: '寄送地址',
        key: 'materialAddress',
        render: (data, recorde, index) => {
            return (
                data.materialAddress
            )
        },
        width: 100,
    }, {
        title: '相关说明（对客户）',
        key: 'customerRemark',
        render: (data, recorde, index) => {
            return (
                data.customerRemark
            )
        },
        width: 100,
    }, {
        title: '相关说明（对内）',
        key: 'joyowoRemark',
        render: (data, recorde, index) => {
            return (
                data.joyowoRemark
            )
        },
        width: 100,
    },
]
class CashoutSearchSocialMaterial extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state={
            policyListData:[],
            timeChunk: timeChunk,
            isShow:false
        }
    }
    componentWillMount(){
        const {dispatch} = this.props
       
    }
    selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
        return {
            // deepMap: [{name: '省',value: selectVal.length?'省':''},{name: '市',value: '市'},{name: '区',value: '区'}],
            deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder: '请选择政策包',
            addressApi: `${DOMAIN_OXT}/apiv2_/policy/policypackage/policy/material-adviser-list`,
            transform: true,
            // address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 200,
            }, /* input 的样式 */
            onChange: (selectVal, selectName, code) => {
                const params = {
                    selectVal,
                    selectName,
                }
                if (params.selectName.length!=0){
                    let { policyListData } = this.state;
                    if (policyListData.length!=0){
                        let num = 0
                        for (let i = 0; i < policyListData.length; i++) {
                            if (policyListData[i].selectName[2] == params.selectName[2] && policyListData[i].selectName[0] == params.selectName[0] && policyListData[i].selectName[1] == params.selectName[1]) {
                                num++
                                break;
                            }
                        }
                        if (num == 0 && policyListData.length<15){
                            policyListData.push(params)
                            this.setState({ policyListData })
                        }
                    }else{
                        policyListData.push(params)
                        this.setState({ policyListData })
                    }
                    
                }
                this.SelectCity1.resetInputValue([],[],false);
            },

        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let { policyListData } = this.state
        let ids:any = []
        if (policyListData.length!=0){
            policyListData.map(
                (val, index) => {
                    ids.push(val.selectVal[2])
                }
            )
            let idsStr = ids.join(',')
            
            const { dispatch } = this.props

            dispatch(searchSocialListMaterialDis({ policyPackageIds: idsStr }))
        }else{
            const { dispatch } = this.props
            dispatch(searchSocialListMaterialDis({ policyPackageIds: null }))
        }
        
    }
    closed = (e)=>{
        let { policyListData } = this.state;
        for (let i = 0; i < policyListData.length;i++){
            if (policyListData[i].selectVal[2] == e.selectVal[2] && policyListData[i].selectVal[0] == e.selectVal[0] && policyListData[i].selectVal[1] == e.selectVal[1]) {
                policyListData.splice(i,1)
                this.setState({
                    policyListData,
                    isShow:true
                })
            }
        }
    }
    Export = () =>{
        this.setState({
            timeChunk: new Date().getTime()
        })
        let { policyListData } = this.state
        let ids: any = []
        if (policyListData.length != 0) {
            policyListData.map(
                (val, index) => {
                    ids.push(val.selectVal[2])
                }
            )
            let idsStr = ids.join(',')

            const { dispatch } = this.props

            dispatch(searchSocialListExportDis({ policyPackageIds: idsStr }))
         
        } else {
            message.error('暂无可导出的材料')
        }

    }
    SelectCity1:any
   
    render() {
        
        return  <div>
                    <Row>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <FormItem
                                label="政策地">
                        <SelectCity ref={node => this.SelectCity1 = node} params={this.selectCityParams()}></SelectCity>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" loading={this.props.loading}>
                                    查询
                                </Button>
                            </FormItem>
                        <iframe style={{ 'display': 'none' }} src={this.props.exportUrl}></iframe>
                                <Button loading={this.props.fetching} type="primary" style={{'marginTop':'4px','float':'right'}} onClick={this.Export}>
                                导出材料给sp客户
                            </Button>
                        </Form>
                    </Row>
                    <Row>
                {this.state.policyListData.map((val, index) => {
                    let cityName = val.selectName.join('')
                    return <Tag closable key={cityName} style={{ 'marginTop': '15px' }} color='#22baa0' onClose={(e) => this.closed(val)}>{cityName}</Tag>
                })}
                    </Row>
                    <Row style={{'marginTop':'45px'}}>
                        <Table
                            columns={columns}
                            dataSource={this.props.dataList}
                            scroll={{ x: 2200, y:true }}
                            bordered
                            loading={this.props.loading}
                            pagination={false}
                        />
                    </Row>
                </div>
        
    }
}
const mapStateToProps = (state:any, ownProps: any): any => {
    const data = state.get('policyDataListReducer');
   console.log(data.toJS())
    return {
        policyData: data.toJS().polociList,
        dataList: data.toJS().dataList,
        loading: data.toJS().loading,
        fetching: data.toJS().fetching,
        exportUrl: data.toJS().exportUrl
    }
}

export default connect(mapStateToProps)(CashoutSearchSocialMaterial);
