import React from 'react'

import { 
    Form, 
    Select, 
    Row, 
    Col, 
} from 'antd';
import './completePolicy.less'
import { connect } from 'react-redux';
import addressCityaa from '../../components/select-city/address.json';
import AddTable from '../../businessComponents/socialEncycle/addTable';
import {
   allEncycleDis,
} from '../../action/socialEncycleAction/socialEncycleAction';
import SelectCity from '../../components/select-city/index';
const FormItem = Form.Item;
const Option = Select.Option;

class CompletePolicyc extends React.Component<any,any>{
    constructor(props){
        super(props);
        this.state={
            provinceId:'',
            cityId:'',
            isInner:'',
            isOpen:''
        }
    }
    componentWillMount(){
        const {dispatch} = this.props
        const {
            provinceId,
            cityId,
            isInner,
            isOpen
            }=this.state
       dispatch(allEncycleDis({
            currentPage:0,
            pageSize:20,
            provinceId:provinceId,    
            cityId:cityId,   
            isInner:isInner,		
            isOpen:isOpen		
        }))
    }
   selectCityParams:any=() =>{ return {
                    placeholder: '请选择',
                    deepMap: this.state.provinceId ? [{ name: '省', value: this.state.provinceId }, { name: '市', value: this.state.cityId }] : [{ name: '省' }, { name: '市'}],
                    popupStyle: {
                        width:350,
                        zIndex: 99,
                    }, 
                    address:addressCityaa, 
                    onChange: (selectVal, selectName, code) => { 
                        this.setState({
                          provinceId:selectVal[0],
                          cityId:selectVal[1],
                        })
                        this.provinceChange(selectVal[0],selectVal[1])
                    },
                    onSelect: (selectVal, selectName, code) => { 
                        // this.handleEditChange({ selectVal, selectName, }, { key: 'cityName', index, id })
                    },
                }}


      disFetch(value,name){
           const {dispatch} = this.props
            const {
                provinceId,
                cityId,
                isInner,
                isOpen
                }=this.state
            let newpar = {
                provinceId,
                cityId,
                isInner,
                isOpen
            }
        dispatch(allEncycleDis({
                currentPage:0,
                pageSize:20,
                ...	newpar,
                [name]:value
            }))
          this.setState({
              [name]:value
          })
      }
      selectChange(value,name){
          this.disFetch(value,name)
      }
      provinceChange(proId,citYId){
          const {dispatch} = this.props
            const {
                provinceId,
                cityId,
                isInner,
                isOpen
                }=this.state
            let newpar = {
                provinceId,
                cityId,
                isInner,
                isOpen
            }
        dispatch(allEncycleDis({
                currentPage:0,
                pageSize:20,
                ...	newpar,
                provinceId:proId,
                cityId:citYId
            }))
          this.setState({
              provinceId:proId,
                cityId:citYId
          })
      }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              span: 8,
            },
            wrapperCol: {
             span: 16
            },
          };
          const selectItemLayout = {
            labelCol: {
              span: 16,
            },
            wrapperCol: {
             span: 5
            },
          };
        return <div>
                    <Form className='select-style'>
                    <Row type="flex" justify="start">
                        <Col span={4}>
                            <span style={{display:'inline-block',height:'32px',lineHeight:'32px',float:'left'}}>请选择省市：</span><span style={{display:'inline-block',width:'120px',float:'left'}}><SelectCity params={this.selectCityParams()}></SelectCity></span>
                        </Col>
                        <Col span={3}>
                            <FormItem
                                {...selectItemLayout}
                                label="对内/对外"
                                >
                                {getFieldDecorator('isInner', {
                                    
                                })(
                                <Select style={{ width: 120 }} onSelect={(value:any)=>this.selectChange(value,'isInner')}>
                                    <Option value=''>全部</Option>
                                    <Option value={1}>对内</Option>
                                    <Option value={0}>对外</Option>
                                </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem
                                {...selectItemLayout}
                                label="是否开放"
                                >
                                {getFieldDecorator('isOpen', {
                                    
                                })(
                                <Select style={{ width: 120 }} onSelect={(value:any)=>this.selectChange(value,'isOpen')}>
                                    <Option value={1}>开放</Option>
                                    <Option value={0}>不开放</Option>
                                    <Option value=''>全部</Option>
                                </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <AddTable searchInfo={this.state} data={this.props.allEncycleList.result}/>
              </div>
        
    }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('socialEncycleListReducer');
    data = data.toJS()
    return {
      allEncycleList:data.allEncycleList
    }
}; 

export default connect(mapStateToProps)(Form.create()(CompletePolicyc));
// const CompletePolicy = Form.create()(CompletePolicyc);
// export default CompletePolicy