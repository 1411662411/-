import React from 'react'
import { connect } from 'react-redux';
import { Table } from 'antd'

import avaterImg from '../../../images/avater-05.png'
import './style.less'

import {
    getSaleKit
} from '../../../action/crm/Workbench'

interface TStateProps {
    saleKitSource: any[];
    type?: 'none';
}
const defaultData = [
    {"id":45,"name":"企业社保通（标准）","signedContractNum":0},
    {"id":46,"name":"金柚宝（标准）","signedContractNum":0},
    {"id":47,"name":"金柚宝（单立户）","signedContractNum":0},
    {"id":48,"name":"金柚宝（同业）","signedContractNum":0},
    {"id":49,"name":"薪酬优化","signedContractNum":0},
    {"id":50,"name":"金柚多多","signedContractNum":0},
    {"id":51,"name":"金柚管家","signedContractNum":0},
    {"id":52,"name":"金柚帮帮","signedContractNum":0},
    {"id":null,"name":"合计","signedContractNum":0}
]

class SalesKit extends React.Component<any>{

    componentWillMount(){
        if(this.props.type === 'none'){

        }else{
            this.props.dispatch(getSaleKit({}))
        }
    }

    switchWidth(width) {
        if(width > 1680 && width < 1920){
            return 280;
        }else if(width > 1024 && width < 1680){
            return 260;
        }else if(width < 1024){
            return 230;
        }
    }

    render() {
        const {saleKitSource} = this.props;
        const saleKitTotal = saleKitSource[saleKitSource.length - 1];

        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {
                    colSpan: 0,
                    rowSpan: 0
                },
            };
            obj.props.colSpan = 2;
            if (index === 0) {
                obj.props.rowSpan = saleKitSource.length - 1;
            }
            return obj;
        };

        const columns = [{
            title: '签单产品',
            dataIndex: 'name',
            className: 'ant-table-tdwidth',
        }, {
            title: '本月已签约合同数量',
            dataIndex: 'signedContractNum',
            className: 'ant-table-tdwidth',
        }, {
            title: '本月已激活合同数量',
            dataIndex: '',
            render: renderContent,
        }, {
            title: '我的分值',
            dataIndex: '',
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {
                        rowSpan: 0,
                        colSpan: 0
                    },
                };
                return obj;
            }
        }];
        
        return (
            <div className="sales-kit">
                <Table 
                    columns={columns}
                    dataSource={this.props.type === 'none' ? defaultData.slice(0, saleKitSource.length - 1) : saleKitSource.slice(0, saleKitSource.length - 1)}
                    bordered
                    pagination={false}
                    className="sales-kit-tbody"
                    scroll={{ y: this.switchWidth(document.body.clientWidth) }}
                    footer={(currentPageData) =>{
                        let tpl = `<table>
                            <tbody class="ant-table-tbody">
                                <tr class="ant-table-row">
                                    <td class="ant-table-tdwidth">${saleKitTotal ? saleKitTotal.name : '合计'}</td>
                                    <td class="ant-table-tdwidth">${saleKitTotal ? saleKitTotal.signedContractNum : 0}</td>
                                    <td colspan="2"></td>
                                </tr>
                            </tboy>
                        </table>`;
                        return <span dangerouslySetInnerHTML={{ __html: tpl }}></span>
                    }}
                />
                <div className="expect-info">
                    <img src={avaterImg} alt="敬请期待" />
                    <span>开发中......敬请期待</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: any, ownProps): TStateProps => {
    //console.log('saleKitSource',state.getIn(['crmWorkbench', 'saleKitSource']))
	return {
        saleKitSource: state.getIn(['crmWorkbench', 'saleKitSource']).toJS(),
        ...ownProps,
	}
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		dispatch,
	}
}


export default connect(mapStateToProps)(SalesKit)