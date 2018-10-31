import React from 'react'
import { browserHistory } from 'react-router';
import { DOMAIN_OXT } from '../../global/global';
import { Table,Popconfirm,Row,Switch,Select,Button,message} from 'antd';
import {
  statePaginationConfig,
} from '../../util/pagination';
import { connect } from 'react-redux';
import addressCityaa from '../../components/select-city/address.json';
import {
   allEncycleDis,
   allEncycleAddDis,
   allEncycleEditorDis,
   allEncycleDelteDis,
} from '../../action/socialEncycleAction/socialEncycleAction';
import SelectCity from '../../components/select-city/index';
import './addTable.less'
const Option = Select.Option;
class AddTable extends React.Component<any,any>{
  constructor(props) {
        super(props)
        this.state={
          currentPage:0,
          pageSize:20,
          isShowSave:false,
          showSaveIndex:'',
          provinceId :'',//     省id
          provinceName :'',//   省名
          cityId:'',//		城市id
          cityName :'',//  	市名
          isInner:'',//		是否对内 0对外 1对内
          isOpen:'',//		是否开放 0否 1是
          dataSource :'',
          handleEditor:false,
          id:''
        }
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
            total: this.props.allEncycleList.total,
        },
            (newParams) => allEncycleDis({ ...this.props.searchInfo,...Prams, ...newParams}),
            dispatch,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            },
        )
    }
selectChange(value,name,index){
  let dataSource = this.props.allEncycleList.result
  let newval
  if(name=='isOpen'){
      newval = value?1:0 
      dataSource[index][name] = newval
  }else{
    newval = value
    dataSource[index][name] = newval
  }
  this.setState({
    [name]:newval,
    dataSource
  })
}
switchChange(value,v,index){
  const {dispatch} = this.props
    let dataSource = this.props.allEncycleList.result
    let newval = value?1:0 
      dataSource[index][name] = newval
      this.setState({
        [name]:newval,
        dataSource
      })
       let param = {
          provinceId:v.provinceId,//     省id
          provinceName:v.provinceName,//   省名
          cityId:v.cityId,//		城市id
          cityName:v.cityName ,//  	市名
          isInner:v.isInner,//		是否对内 0对外 1对内
          isOpen:newval,//		是否开放 0否 1是
  }
    dispatch(allEncycleEditorDis({...param,id:v.id},{ currentPage:this.state.currentPage,
          pageSize:this.state.pageSize}))
}
  columns:any =[{
          title: '省',
          dataIndex: 'pro',
          key: 'pro',
          width: 100,
          render:(text, record, index)=>{
            const selectCityParams = {
                    placeholder: '请选择',
                    deepMap: record.provinceId ? [{ name: '省', value: record.provinceId }, { name: '市', value: record.cityId }] : [{ name: '省' }, { name: '市'}],
                    popupStyle: {
                        width: 350,
                        zIndex: 99,
                    }, 
                    address:addressCityaa, 
                    onChange: (selectVal, selectName, code) => { 
                        this.setState({
                          provinceId:selectVal[0],
                          provinceName:selectName[0],
                          cityId:selectVal[1],
                          cityName:selectName[1]
                        })
                    },
                }
            if(this.state.isShowSave&&this.state.showSaveIndex==index){
              return <SelectCity params={selectCityParams}> </SelectCity>
            }else{
              return <span>{record.provinceName}&nbsp;{record.cityName}</span>
            }
          }
        },{
          title: '对内/对外',
          dataIndex: 'isInner',
          key: 'isInner',
          width: 100,
          render:(text, record, index)=>{
            if(this.state.isShowSave&&this.state.showSaveIndex==index){
              if(this.state.handleEditor){
                  return <Select style={{ width: '100%' }} value={text} onSelect={(value:any)=>this.selectChange(value,'isInner',index)}>
                          
                          <Option value={1}>对内</Option>
                          <Option value={0}>对外</Option>
                      </Select>
              }else{
                  return <Select style={{ width: '100%' }} onSelect={(value:any)=>this.selectChange(value,'isInner',index)}>
                         
                          <Option value={1}>对内</Option>
                          <Option value={0}>对外</Option>
                      </Select>
              } 
            }else{
                return text==1?'对内':'对外'
            }
          }
        },{
          title: '是否开放',
          dataIndex: 'isOpen',
          key: 'index',
          width: 100,
          render:(text, record, index)=>{
            let isChecked = text==0?false:true
            if(this.state.isShowSave&&this.state.showSaveIndex==index){
              if(this.state.handleEditor){
                return <Switch checkedChildren="是" checked={isChecked} unCheckedChildren="否" onChange={value => this.selectChange(value,'isOpen',index)} />
              }
                else{
                  return <Switch checkedChildren="是" unCheckedChildren="否" onChange={value => this.selectChange(value,'isOpen',index)} />
                }
            }else{
                return <Switch checkedChildren="是" onChange={value => this.switchChange(value,record,index)} unCheckedChildren="否" checked={isChecked} />
            }
          } 
        },{
          title: '审核状态',
          dataIndex: 'articleAuditStatusString',
          key: 'articleAuditStatusString',
          width: 200,
        },{
          title: '操作',
          dataIndex: null,
          key: 'address',
          width: 150,
          render:(text, record, index)=>{
            if(this.state.isShowSave&&this.state.showSaveIndex==index){
              return <Row type="flex" justify="space-around">
                      <a onClick={()=>this.handleShow(record)}>保存</a>
                      <a onClick={()=>this.handleBack(record)}>取消</a>
                  </Row>
            }else{
            return <Row type="flex" justify="space-around">
                      <a onClick={()=>browserHistory.push(`${DOMAIN_OXT}/newadmin/socialensycle/policyentry?encyclopediaManageId=${record.id}&&province=${record.provinceName}&&cityname=${record.cityName}`)}
                      // href={`${DOMAIN_OXT}/newadmin/socialensycle/policyentry?encyclopediaManageId=${record.id}&&province=${record.provinceName}&&cityname=${record.cityName}`}
                        >
                        内容录入
                      </a>
                      <a onClick={()=>this.handleEditor(index)}>编辑</a>
                      <Popconfirm title="请确认该政策包真的要删除？删除后将不可还原" onConfirm={()=>this.handleDele(index)} okText="是" cancelText="否">
                        <a>删除</a>
                      </Popconfirm>
                  </Row>
            }
          }
        }]
handleBack(content){
  let dataSource = this.props.allEncycleList.result
  if(!content.id){
    dataSource.shift()
  }
  this.setState({
    isShowSave:false,
    handleEditor:false,
    dataSource
  })
}
handleDele(index){
  let dataSource = this.props.allEncycleList.result
  const {dispatch} = this.props
  let param = {
    currentPage:this.state.currentPage,
    pageSize:this.state.pageSize,
    provinceNameL:'',    //省模糊查询
    cityName:'',   	//市模糊查询
    isInner:'',		//是否对内 0对外 1对内
    isOpen:''		//是否开放 0否 1是
  }
  dispatch(allEncycleDelteDis({id:dataSource[index].id},param))
}
handleShow(record){
  this.setState({
    isShowSave:false,
    handleEditor:false
  })
  const {dispatch} = this.props
  let {
          provinceId,//     省id
          provinceName,//   省名
          cityId,//		城市id
          cityName ,//  	市名
          isInner,//		是否对内 0对外 1对内
          isOpen,//		是否开放 0否 1是
          id,
  } = this.state
  let param = {
          provinceId,//     省id
          provinceName,//   省名
          cityId,//		城市id
          cityName ,//  	市名
          isInner,//		是否对内 0对外 1对内
          isOpen,//		是否开放 0否 1是
  }
  if(this.state.handleEditor){
    dispatch(allEncycleEditorDis({...param,id},{ currentPage:this.state.currentPage,
          pageSize:this.state.pageSize}))
     this.setState({
      showSaveIndex:'',
      id:'',
      provinceId:'',//     省id
      cityId:'',//		城市id
      isInner:'',//		是否对内 0对外 1对内
      isOpen:'',//		是否开放 0否 1是
      provinceName:'',
      cityName:''
    })
  }else{
    let promise = new Promise((resovle,reject)=>{
      dispatch(allEncycleAddDis({...param,resovle}))
    }).then((data:any)=>{
      let dataww = data.data
      let dataSource = this.props.allEncycleList.result
      if(dataww!=0){
        dataSource.shift()
        this.setState({
          dataSource
        })
      }
    })
  }
  
}
  handleEditor(index){
    let dataSource = this.props.allEncycleList.result
    this.setState({
      dataSource,
      isShowSave:true,
      handleEditor:true,
      showSaveIndex:index,
      id:dataSource[index].id,
      provinceId:dataSource[index].provinceId,//     省id
      cityId:dataSource[index].cityId,//		城市id
      isInner:dataSource[index].isInner,//		是否对内 0对外 1对内
      isOpen:dataSource[index].isOpen,//		是否开放 0否 1是
      provinceName:dataSource[index].provinceName,
      cityName:dataSource[index].cityName
    })
  }
  addRow(){
    if(this.state.isShowSave){
      return message.error('请填写内容')
    }
    let dataSource = this.props.allEncycleList.result
    dataSource.unshift({})
    this.setState({
        dataSource,
        isShowSave:true,
        showSaveIndex:0
    })
  }
  render(){
    let dataSource = this.state.isShowSave?this.state.dataSource:this.props.allEncycleList.result
    return <div className='addTableStyle'>
      <Row type="flex" justify="end" style={{margin:'40px 0 20px 0'}}>             
        <Button type='primary' onClick={()=>this.addRow()}>新增</Button>
      </Row>
      <Table
          dataSource={dataSource}
          scroll={{ x: 650, y: 500 }}
          columns={this.columns}
          rowKey={(record: any) => record.id}
          pagination={this.pagination()}
          bordered
          loading={this.props.tableloading}
      />
    </div>
  }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('socialEncycleListReducer');
    data = data.toJS()
    return {
      allEncycleList:data.allEncycleList,
      tableloading:data.tableloading,
    }
}; 
export default connect(mapStateToProps)(AddTable);