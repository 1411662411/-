import React from 'react';
import { Table } from 'antd'
import { DOMAIN_OXT } from '../../../global/global';
import AddFollowRecord from '../FollowRecord/AddFollowRecord';
import CustomerSign from '../CustomerSign';



class SalesHelperTable extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
          total:0,
          pageSize: 20,
          dataSource: [],
          current:1,
          show: true,
          addVisible:false,
          reportVisible: false,
          id:0, //customID
          cname:'',//customName
          cityId: 0, //cityId
          followType:'add', //跟进记录弹窗类型
        }
    }
    columns1 = [{ // 获取后超过25个自然日未跟进的客户
      title: '操作',
      key: 'cc',
      render: (data) => {
          return <a onClick={(e) => {e.preventDefault(); this.setState({followType: 'add', id: data.id, addVisible: true})}}>添加跟进记录</a>
      },
      width: 120,
    }, {
      title: '客户名称',
      key: 'cName',
      render(data){
        return <a target='_blank' href={`${DOMAIN_OXT}/crm/background/customermanagement/customerCooperationDetail?id=${data.id}`}>{data.cName}</a>
      },
    }, {
      title: '未跟进天数',
      dataIndex: 'notFollowDays',
      width: 95,
    }, {
      title: '客户获取时间',
      dataIndex: 'getTimeString',
      width: 190,
    }];

    columns2 = [{  //距上次跟进超过15个自然日未跟进的客户
      title: '客户名称',
      key: 'cName',
      render(data){
          return <a target='_blank' href={`${DOMAIN_OXT}/crm/background/customermanagement/customerCooperationDetail?id=${data.id}`}>{data.cName}</a>
      },
    }, {
      title: '最近一次跟进记录',
      key: 'flow',
      width: 216,
      render:(data)=>{
          return <a onClick={(e) => {e.preventDefault(); this.setState({followType: 'list', id: data.id, addVisible: true})}}>
              <div>{data.lastFollowUpTimeString}</div>
              <div className='text-ellipsis'>{data.lastFollowUpContent}</div>
          </a>
      },
    }, {
      title: '未跟进天数',
      dataIndex: 'notFollowDays',
      width: 95,
    }, {
      title: '客户获取时间',
      dataIndex: 'getTimeString',
      key: 'getTimeString',
      width: 150,
    }];

    columns3 = [{  //获取后超过85个自然日未签约的客户
      title: '操作',
      key: 'cc',
      render:(data) => {
        if (data.reportStatus === null || data.reportStatus === 0 || data.reportStatus === 2 || data.reportStatus === 4) {
            return <a onClick={(e) => {e.preventDefault(); this.setState({id: data.id, cname: data.cname, cityId: data.city, reportVisible: true})}}>签约</a>
        } else {
            return '/';
        }
          
      },
      width: 80,
    }, {
      title: '客户名称',
      key: 'cName',
      render(data){
        return <a target='_blank' href={`${DOMAIN_OXT}/crm/background/customermanagement/customerCooperationDetail?id=${data.id}`}>{data.cName}</a>
      },
    }, {
      title: '客户获取时间',
      dataIndex: 'getTimeString',
      width: 190,
    }];
    getData = async (current, pageSize)=>{
      this.setState({show: true})
      const res:any = await this.props.getData({
        releaseDataType:this.props.type,
        start: (current-1) * pageSize,
        length: pageSize,
      })
      if(res.status == 0){
          this.setState({
            dataSource: res.data.result,
            total: res.data.total,
            current: res.data.current,
            pageSize: res.data.pagesize,
            show:false,
          })
      }
    }

    async componentWillMount(){
      await this.getData(1, 10);
    }

    render(){
        const pagination = {
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            showSizeChanger: true,
            showQuickJumper: true,
            size: "small",
            pageSizeOptions:['10','20','30','50','100'],
            onChange: this.getData,
            onShowSizeChange: this.getData,
        }

        return <div>
          <Table
            className='ant-table-wrapper-text-center'
            loading={this.state.show}
            dataSource={this.state.dataSource} 
            columns={this.props.type == 1 ? this.columns1 : this.props.type == 2 ? this.columns2 : this.columns3}
            bordered
            pagination={{
              ...pagination, 
              total: this.state.total,
              pageSize: this.state.pageSize, 
              current:this.state.current
            }}
            scroll={{y:185}}
        />
        {
          this.state.addVisible && <AddFollowRecord
            visible={this.state.addVisible}
            id={this.state.id}
            type={this.state.followType}
            close={() => {
              this.setState({addVisible: false},()=>{
                this.getData(this.state.current,this.state.pageSize)
              })
            }}
            ok={() => {
              this.setState({addVisible: false},()=>{
                this.getData(this.state.current,this.state.pageSize)
              })
            }}
        />
        }
        {
           this.state.reportVisible && <CustomerSign 
              // visible={this.state.reportVisible}
              id={this.state.id}
              name={this.state.cname}
              ok={() => {}}
              cityId={this.state.cityId}
              close={() => {this.setState({reportVisible: false}, () =>{
                this.getData(this.state.current,this.state.pageSize)
              })}}
           />
        }
        </div>
    }
}

export default SalesHelperTable