import React from 'react';
import { Table, Icon, Checkbox, Button } from 'antd';

import './style.less'
const CheckboxGroup = Checkbox.Group;

const materialsMap = {
    // 材料要求
    materialsRequire: {
        1: '原件',
        2: '复印件',
        3: '原件和复印件'
    },// 盖章要求
    sealRequire: {
        1: '公司公章',
        2: '总公司和分公司公章',
    }, // 提交份数
    amount: {
        1: '一式一份',
        2: '一式两份',
        3: '一式三份'
    },// 用途
    purpose: {
        1: '社保开户',
        2: '公积金开户',
        3: '数字证书'
    }
}
class MaterialsTable extends React.Component<any, any>{
    constructor(props) {
        super(props)
    }

    columns = () => {
        return [{
            title: <label className="ant-form-item-required">序号</label>,
            width: 80,
            dataIndex: 'index',
            key: 'index',
            className: 'text-center',
            render: (text, record, index) => {
                return index + 1;
            }
        }, {
            title: <label className="ant-form-item-required">材料名称</label>,
            width: 350,
            dataIndex: 'materialsName',
            key: 'materialsName',
        }, {
            title: <label className="ant-form-item-required">材料要求</label>,
            width: 150,
            dataIndex: 'materialsRequire',
            key: 'materialsRequire',
            className: 'text-center',
            render: (text, record, index) => {
                return materialsMap['materialsRequire'][text];
            }
        }, {
            title: '盖章要求',
            width: 150,
            dataIndex: 'sealRequire',
            key: 'sealRequire',
            className: 'text-center',
            render: (text, record, index) => {
                return materialsMap['sealRequire'][text];
            }
        }, {
            title: '提交份数',
            width: 100,
            dataIndex: 'amount',
            key: 'amount',
            className: 'text-center',
            render: (text, record, index) => {
                return materialsMap['amount'][text];
            }
        }, {
            title: <label className="ant-form-item-required">用途</label>,
            width: 150,
            dataIndex: 'purpose',
            key: 'purpose',
            className: 'text-center',
            render: (text, record, index) => {
                return this.setPurpose(text)
            },
            filterIcon: <Icon type="filter" style={{ color: '#fff' }} />,
            filters: [{
                text: '社保开户',
                value: '1',
            }, {
                text: '公积金开户',
                value: '2',
            }, {
                text: '数字证书',
                value: '3',
            }],
            onFilter: (value, record) => {
                return Array.isArray(record.purpose) ? record.purpose.join('').indexOf(value) !== -1 : record.purpose == value;
            },
        }, {
            title: '特殊要求与注意事项',
            width: 300,
            dataIndex: 'mark',
            key: 'mark',
        }, {
            title: '模板文件',
            width: 100,
            dataIndex: 'template',
            key: 'template',
            className: 'text-center',
            render: (text, record, index) => {
                return text && text.length ? <a href={text[0].url} target="_blank">下载模板</a> : '';
            }
        }]
    }

    setPurpose = (purpose) => {
        if (Array.isArray(purpose)) {
            let str = '';
            purpose.forEach((value, i) => {
                str += materialsMap['purpose'][value] + (i == purpose.length - 1 ? '' : '；');
            });
            return str;
        } else {
            return materialsMap['purpose'][purpose];
        }
    }

    render() {
        if (!this.props.customerPrepare) {
            return false;
        }
        return <div className='materials-table' style={{ 'margin-bottom': '20px' }}>
            {!this.props.isEmail ? <Table
                bordered={true}
                rowKey={(record: any) => record.key}
                columns={this.columns()}
                dataSource={this.props.customerPrepare}
                pagination={false}
            />
                :
                <table className="email-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th style={{'width': '120px', 'text-align': 'left'}}>材料名称</th>
                            <th>材料要求</th>
                            <th>盖章要求</th>
                            <th>提交份数</th>
                            <th>用途</th>
                            <th style={{'width': '180px', 'text-align': 'left'}}>特殊要求与注意事项</th>
                            <th>模板文件</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.customerPrepare.map((item, index) => {
                            return <tr>
                                <td>{item.index + 1}</td>
                                <td style={{'width': '120px', 'text-align': 'left'}}>{item.materialsName}</td>
                                <td>{materialsMap['materialsRequire'][item.materialsRequire]}</td>
                                <td>{materialsMap['sealRequire'][item.sealRequire]}</td>
                                <td>{materialsMap['amount'][item.amount]}</td>
                                <td style={{'max-width': '100px', 'word-break': 'keep-all'}}>{this.setPurpose(item.purpose)}</td>
                                <td style={{'width': '180px', 'text-align': 'left'}}>{item.mark}</td>
                                <td>{item.template && item.template.length ? <a href={item.template[0].url} target="_blank">下载模板</a> : ''}</td>
                            </tr>;
                        })}
                    </tbody>
                </table>}
        </div>
    }
}

export default MaterialsTable