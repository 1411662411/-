
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { Button, Select, Input, Table, Row, Col } from 'antd';
import "./../../css/components/infoComponent.less";
import { ColumnProps } from 'antd/lib/table';
const Option = Select.Option;

interface AdvertisingManagementProps {

}

interface IUser {
    key: string,
    name: string;
    age ?: any;
    address ?: any,
    action?: any
}
const columns: ColumnProps<IUser>[] = [{
    title: '广告位名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="#">{text}</a>,
}, {
    title: '类别',
    dataIndex: 'age',
    key: 'age',
}, {
    title: 'code',
    dataIndex: 'address',
    key: 'address',
}, {
    title: '是否启用',
    key: 'action',
    dataIndex: 'action'
}];

const dataSource: IUser[] = [{
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
    action:"是"
}, {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
    action:"是"
}];

class UserTable extends Table<IUser> {}

class NameColumn extends Table.Column<IUser> {}

class AdvertisingManagement extends React.Component<AdvertisingManagementProps, any> {
    constructor(props) {
        super(props)
    }
    handleChange(value) {
    }

    render() {

        return (
        <QueueAnim>
            <div key="AdvertisingManagement" className="wrapper-content">
                <div className="form-site">
                    <Row type="flex" justify="center" align="middle">
                        <Col span={4} className="col-label"><label>站点选择：</label></Col>
                        <Col span={20}>
                            <Select defaultValue="official" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                                <Option value="official">官网</Option>
                                <Option value="disabled" disabled>Disabled</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row className="fixed-distance" type="flex" justify="center" align="middle">
                        <Col span={4} className="col-label"><label>广告位：</label></Col>
                        <Col span={16}>
                            <Input id="input-search"  placeholder="large size"/>
                        </Col>
                        <Col span={4}>
                            <Button className="col-distance" type="primary">查询</Button>
                        </Col>
                    </Row>
                </div>
                <div className="advertising-main fixed-distance">
                    <Button type="primary">新增</Button>
                </div>
                <div className="fixed-distance">
                    <UserTable columns={columns} dataSource={dataSource}>
                        <NameColumn key="name" title="Name" dataIndex="name" />
                    </UserTable>
                </div>

            </div>
        </QueueAnim>
        )
    }
}

function mapStateToProps(state ?: any) {
    return{

    }
}

export default connect(mapStateToProps)(AdvertisingManagement)

