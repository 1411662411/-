import React from 'react'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { DOMAIN_OXT } from '../../global/global';
import {
  statePaginationConfig,
} from '../../util/pagination';
import {
   articleEncycleAuditListDis,
} from '../../action/socialEncycleAction/socialEncycleAction';
class ContentAudit extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            currentPage:0,
            pageSize:20
        }
    }
    componentWillMount(){
       const {dispatch} = this.props
       dispatch(articleEncycleAuditListDis({
            start: 0,
            length: 20,
            auditStatus : 1,
       }))
    }
    pagination = () => {
        const {
            type,
            dispatch,
            listData
        } = this.props;
        
        const {   
            currentPage,
            pageSize,
        } = this.state
        let Prams = {
            currentPage,
            pageSize,
        }
        return statePaginationConfig({
            currentPage,
            pageSize,
            total:0,
        },

            (newParams) => articleEncycleAuditListDis({...Prams, ...newParams,auditStatus :1}),
            dispatch,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            },
        )
    }
    columns:any =()=> [{
                title: '省市',
                dataIndex: 'provinceName',
                key: 'provinceName',
                render: (text,record)=>{
                    return <div>{record.provinceName}&nbsp;{record.cityName}</div>
                },
            }, {
                title: '提交人',
                dataIndex: 'createUser',
                key: 'createUser',
            }, {
                title: '提交时间',
                dataIndex: 'submitTimeString',
                key: 'submitTimeString',
            }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <a onClick={()=>browserHistory.push(`${DOMAIN_OXT}/newadmin/socialensycle/policyadutiorlist?encyclopediaManageId=${record.id}`)}>审核</a>
            ),
        }];
   
    render(){
        const aduitList = this.props.aduitList.result?this.props.aduitList.result:null
        return <Table 
                    columns={this.columns()} 
                    dataSource={aduitList} 
                     rowKey={(record: any) => record.id}
                    pagination={this.pagination()}
                    bordered
                />
    }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('socialEncycleListReducer');
    data = data.toJS()
    return {
      aduitList:data.aduitList
    }
}; 

export default connect(mapStateToProps)(ContentAudit);
// export default ContentAudit