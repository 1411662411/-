import React from 'react';
import TableUI from '../../../../components/Table';
import WhiteSpace from '../../../../components/common/WhiteSpace';
import { Card, Input, Menu, Dropdown, Icon, Button, Table, DatePicker, Spin } from 'antd';

import SelectCityTags from '../../../../components/select-city-tags';
import PaymentBill from '../../../../components/socialManagement/UiComponent/PaymentBill';
import Information from '../../../../components/socialManagement/UiComponent/Information';
import Text from '../../../../components/common/Text';

const {RangePicker} = DatePicker;

class TWSubmitReqPayment extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state={
            value: [{selectVal:[2, 52], selectName: ["北京", "北京"]}],
            dataValue: undefined,
            test: 0,
        }
    }
    menu = (
        <Menu>
          <Menu.Item key="0">
            五险一金合并
          </Menu.Item>
          <Menu.Item key="1">
            五险部分
          </Menu.Item>
          {/* <Menu.Divider /> */}
          <Menu.Item key="3">公积金部分</Menu.Item>
        </Menu>
    )

    importMenu = (
        <Menu>
          <Menu.Item key="1-0">
            清除数据
          </Menu.Item>
          <Menu.Item key="1-1">
            查看导入记录
          </Menu.Item>
          {/* <Menu.Divider /> */}
          <Menu.Item key="1-3">下载导入模板</Menu.Item>
        </Menu>
    );

    handlePanelChange = (dataValue, mode) => {
        this.setState({
            dataValue,
            mode: [
                mode[0] === 'date' ? 'month' : mode[0],
                mode[1] === 'date' ? 'month' : mode[1],
            ],
        });
    }

    
    render() {
        const {value, dataValue} = this.state;
        return <Spin spinning={false}>
            <Card>
                <TableUI 
                    dataSource={[
                        {
                            label: '办理地',
                            value: <SelectCityTags 
                                deepMap={[{name:'省'}, {name: '市'}]}
                                // value={value}
                                onChange={(value)=> {
                                    // console.log('change', value, this);
                                    // this.setState({value});
                                }} 
                            />,
                        },
                        {
                            label: '社保缴费月（操作月）',
                            value: <RangePicker value={dataValue} mode={['month', 'month']} onPanelChange={this.handlePanelChange} format='YYYY-MM' onChange={()=>{}} />,
                        },
                    ]}
                    colgroup={[15,35,20,30]}
                />
                <WhiteSpace height={15}/>
                <Dropdown overlay={this.menu} trigger={['click']}>
                    <Button type='primary' className="ant-dropdown-link">
                        <Icon type="upload" /> 导出相关预收账单 <Icon type="down" />
                    </Button>
                </Dropdown>
            </Card>
            <WhiteSpace />
            <PaymentBill type={1}/>
            <WhiteSpace />
            <Information isSP={true} />
            <WhiteSpace />
            <div className='text-center'>
                <Button type='primary'>提交</Button>
            </div>
        </Spin>;
    }
}

export default TWSubmitReqPayment;