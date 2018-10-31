import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
// import * as Upload  from 'rc-upload'
import {
    Button,
    Form,
    Icon,
    Input,
    Table,
    Row,
    Col,
    Progress,
    Upload,
    message,
    Spin,
    notification,
} from 'antd';
const FormItem = Form.Item;


import {
    DOMAIN_OXT,
} from '../../global/global';
const UPLOAD_API = `${DOMAIN_OXT}/api/socialManagement/doExcel`;

import {
    gatheringInfoEntry,
    uploading,
} from '../../action/financialManagement/gatheringInfoAction';

interface GatheringInfoProps {
    progressVisible: boolean;
    progressPercent: number;
    dispatch: any;
    dataSource: Array<any>;
    pageSize: number;
    listIsFetching: boolean;
    currentPage: number;
    total: number;
    uploading: boolean;
}

interface uploadResponse {
    status?: string | number;
    errcode?: string | number;
    msg?: string;
}



class GatheringInfo extends React.Component<GatheringInfoProps, any> {
    constructor(props) {
        super(props);
        const { dispatch } = this.props;
        dispatch(gatheringInfoEntry({}));
    }
    uploadProps = {
        name: 'file',
        action: UPLOAD_API,
        // showUploadList: { 
        //     showPreviewIcon: false, 
        //     showRemoveIcon: true,
        // },
        showUploadList: false,
        accept: '.xls,.xlsx,.csv',
        beforeUpload: (file) => {
            const {
                dispatch,
            } = this.props;

            dispatch(uploading({
                uploading: true,
            }));
            return true;
        },
        onChange: (info) => {
            const {
                pageSize,
                dispatch,
            } = this.props;
            const file = info.file;
            const errormsg = `${file.name} 上传失败.`;
            if (file.status === 'done' ) {
                const response = file.response;
                const {
                    status,
                    errcode,
                    msg = errormsg,
                    data,
                } = response;
                let duplicateData = '';
                let successData = '';
                if(data) {
                    duplicateData = data.duplicateData;
                    successData = data.successData;
                }
                if((Number(status) === 0 || Number(errcode) === 0)) {
                    notification.info!({
                        message: '提示',
                        description: <div>{`${info.file.name} 上传成功`}
                            <br/>
                            共<strong> {successData} </strong>条有效数据，其中<strong> {duplicateData} </strong>条重复数据已自动合并
                        </div>,
                        duration: 9999,
                    });
                    dispatch(gatheringInfoEntry({
                        currentPage: 1,
                        pageSize,
                    }));
                }
                else {
                    message.error(msg);
                }
                dispatch(uploading({
                    uploading: false,
                }));
            } 
            else if (file.status === 'error') {
                message.error(errormsg, 3);
                dispatch(uploading({
                    uploading: false,
                }));
            }
        },
    };
    columns = [
        {
            title: '序号',
            key: 'index',
            render: (text, record, index) => {
                return (
                    <span>{index + 1}</span>
                )
            },
            width: '30%',
        },
        {
            title: '导入来源',
            dataIndex: 'sourceName',
            key: 'sourceName',
            width: '35%'
            
        },
        {
            title: '导入时间',
            dataIndex: 'operateTime',
            key: 'operateTime',
        },
    ]
    pagination = ({ total, currentPage }) => ({
        current: currentPage,
        total,
        showSizeChanger: true,
        defaultPageSize: 20,
        showQuickJumper: true,
        showTotal:(total, range) => `${range[0]}-${range[1]} of ${total}`,
        pageSizeOptions: ['20', '50', '100'],
        onShowSizeChange: (current, size) => {
            const {
                dispatch,
            } = this.props;
            dispatch(gatheringInfoEntry({
                currentPage: current,
                pageSize: size,
            }));
        },
        onChange: (current) => {
            const {
                dispatch,
                pageSize,
            } = this.props;
            dispatch(gatheringInfoEntry({
                currentPage: current,
                pageSize,
            }));
        }
    });
    render() {
        const {
            dataSource,
            total,
            currentPage,
            listIsFetching,
            uploading,
        }  = this.props;
        const pagination:any = this.pagination({ total, currentPage });
        return (
            <QueueAnim>
                
                    <div key="1">
                        <Form layout="inline">
                            <FormItem>
                                <Upload  {...this.uploadProps} data={{source: 1}} disabled={uploading}>
                                    <Button type="primary" icon="upload" loading={uploading} >
                                        支付宝导入
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem>
                                <Upload {...this.uploadProps} data={{source: 2}} disabled={uploading}>
                                    <Button type="primary" icon="upload" loading={uploading} >
                                        微信导入
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem>
                                <Upload {...this.uploadProps} data={{source: 3}} disabled={uploading}>
                                    <Button type="primary" icon="upload" loading={uploading}>
                                        京东导入
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem>
                                <Upload {...this.uploadProps} data={{source: 4}} disabled={uploading}>
                                    <Button type="primary" icon="upload" loading={uploading}>
                                        连连导入
                                    </Button>
                                </Upload>
                            </FormItem>
                        </Form>
                    </div>
                    <QueueAnim type='bottom' delay="300">
                        <div key="2">
                            <Table 
                                columns={this.columns}
                                dataSource={dataSource}
                                pagination={pagination}
                                loading={listIsFetching}
                                scroll={{ y: 500 }}
                                style={{marginTop: '20px'}}
                                rowKey={record => record['id']}
                            >
                            </Table>
                        </div>
                    </QueueAnim>
            </QueueAnim>
        )
    }
}

function mapStateToProps(state: any) {
    const data = state.getIn(['gatheringInfo']);
    return {
        dataSource: data.getIn(['dataSource']).toJS(),
        currentPage: data.getIn(['currentPage']),
        pageSize: data.getIn(['pageSize']),
        total: data.getIn(['total']),
        listIsFetching: data.getIn(['listIsFetching']),
        uploading: data.getIn(['uploading']),
    }
}

export default connect(mapStateToProps)(GatheringInfo)