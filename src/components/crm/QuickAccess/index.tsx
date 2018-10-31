import React from 'react';
import { DOMAIN_OXT } from '../../../global/global';
import { Row, Col, Icon } from 'antd'
import Import from '../../../components/crm/CustomerImport'
import { fetchFn } from '../../../util/fetch';
import noPng from "../../../images/no-msg.png"

const Api = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/getQuickEntryButton`
const getQuickEntryButtonApi = () => {
    return fetchFn(Api, {}).then(data => data);
}

import './style.less'
class QuickAccess extends React.Component<any, any>{
    constructor(props){
        super(props)
        this.state={
            importCustomerVisible: false,
            importType:0,
            importCustomerClue: 0,
            createCustomer: 0,
            importCustomer: 0,
            customerRepeat: 0,
            claimCustomer: 0,
            createCustomerClue: 0,
            none: false,
        }
    }

    async componentWillMount(){
        if(this.props.type === 'none'){
            this.setState({
                importCustomerClue: 1,
                createCustomer: 1,
                importCustomer: 1,
                customerRepeat: 1,
                claimCustomer: 1,
                createCustomerClue: 1,
            })
        }else{
            let res:any = await getQuickEntryButtonApi();
            if(res.errcode !== 0){
                this.setState({none: true})
                return ;
            }
            const {
                importCustomerClue,
                createCustomer,
                importCustomer,
                customerRepeat,
                claimCustomer,
                createCustomerClue,
            } = res.data;
            this.setState({
                importCustomerClue,
                createCustomer,
                importCustomer,
                customerRepeat,
                claimCustomer,
                createCustomerClue,
            })
        }
    }

    render(){
        const {
            importCustomerClue,
            createCustomer,
            importCustomer,
            customerRepeat,
            claimCustomer,
            createCustomerClue,
        } = this.state;
        const span ={
            xs:{span:12},
            sm:{span:12},
            md:{span:12},
            lg:{span:12},
            xl:{span:12},
            style:{
                height: 120,
            }
        }
        return this.state.none ? <div className='text-center' style={{paddingTop:20}}>
        <img src={noPng} alt=""/>
    </div>:<Row className='crm-workbench-quickAccess-container' style={{marginTop: 15}}>
            {
                createCustomer == 1 && <Col {...span}>
                    <div style={{textAlign:'center'}}>
                    <a href={`${DOMAIN_OXT}/crm/background/customermanagement/createcompanycustomer`} target='_blank'>
                    <i style={{fontSize:56, color:'#FF6600'}} className='crmiconfont crmicon-xinzengkehu1'></i>
                    </a>
                    <div style={{color:'#666'}}>新增客户</div>
                    </div>
                </Col>
            }
            {
                createCustomerClue == 1 && <Col {...span}>
                    <div style={{textAlign:'center'}}>
                    <a href={`${DOMAIN_OXT}/newadmin/crm/customermanagement/createclue`} target='_blank'>
                    <i style={{fontSize:56, color:'#F4A027'}} className='crmiconfont crmicon-xinzengxiaoshouxiansuo'></i>
                    </a>
                    <div style={{color:'#666'}}>新增销售线索</div>
                    </div>
                </Col>
            }
            {
                importCustomer == 1 && <Col {...span}>
                    <span>
                    <div style={{textAlign:'center'}}>
                    <i onClick={() => {this.setState({importCustomerVisible:true, importType:0})}} style={{fontSize:56, color:'#7A6FBE', cursor: 'pointer'}} className='crmiconfont crmicon-daorukehu'></i>
                    <div style={{color:'#666'}}>导入客户</div>
                    </div>
                    </span>
                    {
                        this.state.importCustomerVisible && <Import close={() => {this.setState({importCustomerVisible:false})}} visible={this.state.importCustomerVisible} type={this.state.importType}/>
                    }
                </Col>
            }
            {
                importCustomerClue == 1 && <Col {...span}>
                    <span>
                    <div style={{textAlign:'center'}}>
                    <i onClick={() => {this.setState({importCustomerVisible:true, importType:3})}} style={{fontSize:56, color:'#4B5D7F', cursor: 'pointer'}} className='crmiconfont crmicon-daoruxiaoshouxiansuo-'></i>
                    <div style={{color:'#666'}}>导入销售线索</div>
                    </div>
                    </span>
                </Col>
            }
            {
                customerRepeat == 1 && <Col {...span}>
                    <div style={{textAlign:'center'}}>
                    <a href={`${DOMAIN_OXT}/crm/background/customermanagement/duplicatechecking`} target='_blank'>
                    <i style={{fontSize:56, color:'#22BAA1'}} className='crmiconfont crmicon-kehuchazhong1'></i>
                    </a>
                    <div style={{color:'#666'}}>客户查重</div>
                    </div>
                </Col>
            }
            {
                claimCustomer == 1 && <Col {...span}>
                    <div style={{textAlign:'center'}}>
                    <a href={`${DOMAIN_OXT}/crm/background/customermanagement/customerpublicpool`} target='_blank'>
                    <i style={{fontSize:56, color:'#84A7DF'}} className='crmiconfont crmicon-renlingkehu'></i>
                    </a>
                    <div style={{color:'#666'}}>认领客户</div>
                    </div>
                </Col>
            }
        </Row>
    }
}

export default QuickAccess