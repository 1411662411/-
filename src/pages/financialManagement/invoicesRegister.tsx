// /**
//  * Created by yangws on 2017/7/26.
//  */
import * as React from 'react';
import {
    Tabs,
    Table,
    Input,
    Card,
    Row,
    Form,
    Select,
    Button,
} from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import { browserHistory, Link } from 'react-router';
import { ROUTER_PATH } from '../../global/global';
import InvoicesList from '../../components/financialManagement/invoicesList';

const subject = [{
    name:'杭州今元标矩科技有限公司',
    id:1
},{
    name:'杭州今元标矩科技有限公司天津武清分公司',
    id:2
}];
class  InvoicesRegisterList  extends React.Component<{}, any> {
    constructor(props) {
        super(props);

        this.state = {
            activeKey:'1'
        }
    }
    componentWillMount() {
        // this.setState({activeKey:'1'})
    }
    onTabClick = (key) => {
        // if (Number(key) === 1) {
        //     browserHistory.push(`${ROUTER_PATH}/newadmin/social/cashout/approve/submit`);
        // }
        // return false;
    }
    handleTabsChange = (activeKey) => {
        this.setState({activeKey})
    }
    render() {
        const {
            activeKey
        } = this.state;
        return (
            <div key="invoicesRegisterList">
                <Tabs activeKey={activeKey} onChange={this.handleTabsChange} key={activeKey}>
                    {
                        subject.map((item,index)=>{
                            return <TabPane tab={`开票主体：${item.name}`} key={index+1}>
                                <InvoicesList type={1} subject={item.id}/>
                            </TabPane>
                        })
                    }
                    
                </Tabs>
            </div>
            
        )
    }
}
export default InvoicesRegisterList;

