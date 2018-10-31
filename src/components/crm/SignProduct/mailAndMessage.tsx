import React from 'react';
import {
    Table,
    Button,
    Divider,
    Switch,
    Tooltip,
} from 'antd'

import query from '../../../util/query';
import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';
import PartTitle from '../Title';

const urlId = query('id');

import AddMial from './addMail';

class MailAndMessage extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            total: 0,
            pageSize: 20,
            logAction: [],
            dataSource: [],
            current: 1,
            isLoading: true,
            modalVisible: false,
            modalNumber: 1,
            editId: null,
        }
    }

    getData = async (current, pageSize) => {
        this.setState({ isLoading: true })
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/jyMailSmsTemplatesSetting/list`, {
            associateId: urlId,
            start: (current - 1) * pageSize,
            length: pageSize,
        })
            .then((res: any) => {
                this.setState({
                    dataSource: res.data ? res.data.result : [],
                    total: res.data ? res.data.total : 0,
                    current: current,
                    pageSize: 20,
                    isLoading: false,
                })
            });
    }

    getSettingList = async() => {
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/jyMailSmsTemplatesSetting/list`, {
            associateId: urlId,
            start: 0,
            length: 20
        })
        .then((res: any) => {
            if(res.status == 0){
                this.setState({
                    dataSource: res.data ? res.data.result : [],
                    total: res.data ? res.data.total : 0,
                    current: res.data ? res.data.current : 1,
                    pageSize: 20,
                })
            }
            this.setState({isLoading: false});
        });
    }

    async componentWillMount() {
        await this.getSettingList();
    }

    switchHandle = (checked, record) => {
        this.setState({isLoading: true});
        const {
            id,
            sendType,
            functionName,
        } = record;
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/api/module/jyMailSmsTemplatesSetting/enable`, {
            associateId: urlId,
            id: id,
            sendType: sendType,
            functionName: functionName,
            enable: checked ? 1 : 0
        })
        .then((res: any) => {
            if(res.status == 0){
                const {
                    current,
                    pageSize,
                } = this.state;
                this.getData(current, pageSize);
            }
            this.setState({isLoading: false})
        });
    }

    toggleVisible = (id) => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            modalNumber: this.state.modalNumber + 1,
            isLoading: this.state.modalVisible ? false : true,
            editId: id ? id : null,
        })
    }

    editMail = (e, id) => {
        this.toggleVisible(id);
    }

    successCallback = (id) => {
        const {
            current,
            pageSize,
        } = this.state;
        this.getData(id ? current : 1, pageSize);
    }

    render() {
        const pagination = {
            showTotal: (total, range) => `${range[0]} - ${range[1]} , 共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
            size: "small",
            pageSize: this.state.pageSize,
            total: this.state.total,
            current: this.state.current,
            pageSizeOptions: ['20', '40', '60', '80', '100'],
            onChange: this.getData,
            onShowSizeChange: this.getData,
        }

        const columns = [{
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            render: (text, record, index) => {
                const {
                    id,
                    addType,
                    sendType
                } = record;

                return addType ? this.props.permissionBtns && this.props.permissionBtns.previewProductMessageMailSettingButton ? <a href={`${DOMAIN_OXT}/newadmin/crm/customermanagement/signproduct/detail/preview?id=${id}`} target="_blank">预览</a> : '' : <span>
                    {sendType == 2 && this.props.permissionBtns && this.props.permissionBtns.previewProductMessageMailSettingButton ? <span><a href={`${DOMAIN_OXT}/newadmin/crm/customermanagement/signproduct/detail/preview?id=${id}`} target="_blank">预览</a>
                    <Divider type="vertical" /></span> : ''}
                    {this.props.permissionBtns && this.props.permissionBtns.updateProductMessageMailSettingButton ? <a onClick={(e) => {this.editMail(e, id)}} href="javascript:;">编辑</a> : ''}
                </span>
            },
        }, {
            title: '是否发送',
            dataIndex: 'enable',
            key: 'enable',
            width: '10%',
            render: (text, record, index) => {
                const {
                    id,
                    enable
                } = record;
                return this.props.permissionBtns && this.props.permissionBtns.enableProductMessageMailSettingButton ? <Switch key={id} defaultChecked={enable ? true : false} onChange={(e) => {this.switchHandle(e, record)}} /> : ''
            },
        }, {
            title: '提醒时间',
            dataIndex: 'functionName',
            key: 'functionName',
            width: '15%',
        }, {
            title: '提醒方式',
            dataIndex: 'sendTypeString',
            key: 'sendTypeString',
            width: '10%',
        }, {
            title: '发送顺序',
            dataIndex: 'sort',
            key: 'sort',
            width: '10%',
        }, {
            title: '邮件标题/短信内容',
            dataIndex: 'title',
            key: 'title',
            width: '45%',
            render: (text, record, index) => {
                const {
                    id,
                    title,
                    sendType,
                    content,
                } = record;
                return sendType == 2 ? <div className="log-content">{title}</div> : <div id={`parentM${id}`} className="log-content">{content && content.length > 50 ? <Tooltip getPopupContainer={() => document.getElementById(`parentM${id}`) as HTMLElement} overlayClassName="log-message-tip" title={content}>{content}</Tooltip> : content}</div>;
            },
        }];

        return (
            <div className="log-action" style={{'margin-bottom': '20px'}}>
                <PartTitle
                    title='邮件短信配置'
                    buttons={this.props.permissionBtns && this.props.permissionBtns.createProductMessageMailSettingButton ? [<Button onClick={() => this.toggleVisible(null)} type="primary" loading={this.state.isLoading}>添加</Button>] : ''}
                />
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    bordered={true}
                    loading={this.state.isLoading}
                    pagination={pagination}
                />
                <AddMial
                    key={this.state.modalNumber}
                    title={this.state.editId ? "编辑邮件短信" : "添加邮件短信"}
                    modalNumber={this.state.modalNumber}
                    visible={this.state.modalVisible}
                    toggleVisible={() => this.toggleVisible(null)}
                    successCallback={this.successCallback}
                    editId={this.state.editId}
                    createProduceIntroduceButton={this.props.permissionBtns && this.props.permissionBtns.createProduceIntroduceButton}
                />
            </div>
        )
    }
}

export default MailAndMessage