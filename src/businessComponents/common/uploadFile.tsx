import React, { Component } from 'react';
import {
    Upload,
    message,
    notification,
    Spin,
} from 'antd';
import CreatePoll, { CreatePollInterface } from '../../util/createPoll';
import './uploadFile.less';
import { fail } from 'assert';
interface UploadFileProps {
    uploadUrl: string;
    pollUrl: string;
    uploadData?: ((file) => void) | Object;
    pollData?: Object;
    accept?: [keyof FileTypesInterface];
    fileSize?: number;
    success?: (data) => void;
    fail?: (data) => void;
}

interface UploadFileState {
    uploading: boolean;
}
/**
 * MINI 类型
 */
interface FileTypesInterface {
    '.csv': 'application/vnd.ms-excel';
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.bmp': 'image/bmp',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.jpe': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
}
const fileTypes: FileTypesInterface = {
    '.csv': 'application/vnd.ms-excel',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.bmp': 'image/bmp',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.jpe': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
}

export default class UploadFile extends Component<UploadFileProps, UploadFileState> {
    poll: CreatePollInterface;
    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
        }
        const {
            pollUrl,
        } = this.props;
        this.poll = new CreatePoll({ url: pollUrl, fetchFnMessageType: 0 });
    }
    startPoll = (params) => {
        const {
            success,
            fail,
            pollData = {} as any,
        } = this.props;
        console.log(pollData);
        const instancePoll = this.poll;
        const topic = pollData.topic;
        const newPollData = {
            ...pollData,
        };
        delete newPollData.topic;
        instancePoll.start({ ...params, ...newPollData })
            .then((responeData) => {
                try {
                    instancePoll.poll({ ...params, ...newPollData, topic, }, (responeData) => {
                        return responeData.data.loadingSwitch === true || responeData.data.schedule === -1 || responeData.data.schedule === 100
                    } , (responeData) => {
                        const data = responeData.data;
                        const {
                            message,
                            description,
                        } = data;
                        if (data.schedule === 100) {
                            notification.success({
                                type: "success",
                                message,
                                description,
                            });
                            typeof success === 'function' && success(responeData);
                            this.setState({
                                uploading: false,
                            });
                        }
                        if (data.schedule === -1) {
                            description && notification.error({
                                type: "error",
                                message,
                                description,
                            });
                            typeof fail === 'function' && fail(responeData);
                            this.setState({
                                uploading: false,
                            });
    
                        }
    
                    });
                }
                catch (error) {
                    message.error(error);
                    this.setState({
                        uploading: false,
                    });
                }
            }, (responeData) => {
                /**
                 * 这一段提示已经由fetchFn处理
                 */
                // const data = responeData.data;
                // const {
                //     message,
                //     description,
                // } = data;
                // notification.error({
                //     type: "error",
                //     message,
                //     description,
                // });
                this.setState({
                    uploading: false,
                });
            });
    }
    uploadProps = () => {
        const {
            uploadUrl,
            accept,
            fileSize,
            uploadData,
        } = this.props;
        let props: any = {
            name: 'file',
            action: uploadUrl,
            showUploadList: false,
            beforeUpload: (file) => {
                if (fileSize !== undefined && !(file.size / 1024 / 1024 < fileSize)) {
                    message.error(`导入的文件大小需控制在 ${fileSize}M以内`);
                    return false;
                }
                if (accept !== undefined) {
                    const types = accept.map((value) => {
                        if (Object.prototype.hasOwnProperty.call(fileTypes, value)) {
                            return fileTypes[value];
                        }
                        return value;
                    });

                    if (types.length > 0 && types.indexOf(file.type) === -1) {
                        message.error(`导入格式错误，请上传 ${accept.join('，')} 文件`);
                        return false;
                    }
                }
                this.setState({
                    uploading: true,
                });
                return true;
            },
            onChange: (info) => {
                const file = info.file;
                const errormsg = `${file.name} 上传失败.`;
                let title = '提醒';
                if (file.status === 'done') {
                    const response = file.response;
                    let {
                        status,
                        errcode,
                        msg = errormsg,
                        data,
                    } = response;
                    /**
                     * 登录超时
                     */
                    if(status === -1) {
                        location.reload();
                        return;
                    }
                    // if (orderCode) {
                    //     uuid.code = orderCode;
                    // }
                    // uuid = JSON.stringify(uuid);
                    if ((Number(status) === 0 || Number(errcode) === 0)) {

                        const {
                            ossKey,
                            uuid,
                        } = data;
                        
                        const params:any = {
                            uuid,
                        }
                        /**
                         * ossKey 是否存在
                         */
                        if(ossKey) {
                            const str = ossKey.split("/");
                            const fileName = str.pop();
                            params.fileName = fileName;
                            params.ossKey = ossKey;
                        }
                       
                        this.startPoll(params);
                        // wss.wss.send(uuid);
                    }
                    else if(status === -1) {
                        location.reload();
                    }
                    else {
                        notification.error({
                            type: "error",
                            message: title,
                            description: msg,
                        });
                        this.setState({
                            uploading: false,
                        });
                    }
                }
                else if (file.status === 'error') {
                    notification.error({
                        type: "error",
                        message: title,
                        description: errormsg,
                    });
                    this.setState({
                        uploading: false,
                    });
                }
            },
        }

        if (accept !== undefined) {
            props.accept = accept.join(',');
        }
        if (uploadData !== undefined) {
            props.data = uploadData;
        }
        return props;
    };
    render() {
        const {
            children
        } = this.props;
        const {
            uploading,
        } = this.state;
        return (
            <Upload {...this.uploadProps() } disabled={uploading} className="no-overflow" style={{display: 'inline-block'}}>
                <Spin spinning={uploading}>
                    {children}
                </Spin>
            </Upload>
        )
    }
}