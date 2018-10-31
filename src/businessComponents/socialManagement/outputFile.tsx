import * as React from 'react';
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { browserHistory, Link } from 'react-router';
import { ROUTER_PATH, DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
import {
    connect,
} from 'react-redux';
import * as Immutable from 'immutable'
import createWebsocket, { CreateWebSocket } from '../../util/createWebsocket';
import CreatePoll, { CreatePollInterface } from '../../util/createPoll';
import {
    Button,
    notification,
    message,
    Spin,
} from 'antd';
interface wss {
    wss: CreateWebSocket | null,
}


interface createWss {
    (url: string, params: {
        index: number,
        title: string;
        uuid?: string;
    }): any;
}
interface OutputFileProps {
    params: any;
    // wss: wss;
    // triggerType?: number;
    handleCallBack?: any;
    outputRequest: string;
    // webSocketUrl: string;
    downloadFileUrl: string;
    handleVerifyBefore?: any;
    pollUrl: string;
    contentType?:string;
    pollData: {
        type?: number;
        userId: string;
        userName?: string;
    }
    // callback:any;
    // buttonUi:any;
}
const wssExport: wss = {
    wss: null,
}
export class OutputFile extends React.Component<OutputFileProps, any> {

    constructor(props) {
        super(props);
        this.state = {
            webSocketUrl: props.webSocketUrl,
            isUploading: false,
        }
    }

    componentWillMount() {

    }
    componentWillUnmount() {
        /* 销毁wss对象 */
        let {
            wss,
        } = wssExport;
        wss && wss.close();
    }
    handleChangeExportStatus = (isExporting: boolean) => {
        const { handleCallBack } = this.props;
        if (handleCallBack) {
            handleCallBack(isExporting);
        } else {
            this.setState({ isUploading: isExporting })
        }

    }
    // createWss: createWss = (url, params) => {
    //     const {
    //         title,
    //         index,
    //         uuid,
    //     } = params;
    //     const wss = new createWebsocket({
    //         url,
    //         onmessage: ({ data }) => {
    //             data = JSON.parse(data);

    //             const {
    //                 loadingSwitch,
    //                 schedule,
    //                 detail,
    //             } = data;

    //             this.handleChangeExportStatus(true);
    //             if (schedule === 100) {
    //                 /**
    //                  * 控制上传状态...
    //                  */
    //                 var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

    //                 // 后端返回的地址还需要调用接口下载
    //                 if (reg.test(detail)) {
    //                     notification.success!({
    //                         message: title,
    //                         description: '导出成功',

    //                     });
    //                     this.handleChangeExportStatus(false);
    //                     this.setState({
    //                         batchExportUrl: detail.url,
    //                     })
    //                 } else {
    //                     this.handleDownFile(detail);
    //                 }

    //             }
    //             if (schedule === -1) {
    //                 this.handleChangeExportStatus(false);
    //                 notification.error!({
    //                     message: title,
    //                     description: detail || '导出文件失败',

    //                 });
    //             }
    //         },
    //         onerror: () => {
    //              notification.error!({
    //                 message: title,
    //                 description: '导出文件失败',
    //             });

    //             this.handleChangeExportStatus(false);
    //         }

    //     });
    //     // wss.send(uuid);
    //     return wss;


    // }
    sendOutputRequest = () => {
        // const {webSocketUrl} = this.state;
        const {
            params,
            children,
            outputRequest,
            pollUrl,
            pollData,
            contentType,
        } = this.props;
        const that = this;
        this.handleChangeExportStatus(true);
        fetchFn(outputRequest, removeEmpty(params), {
            headers: {
                'Content-Type': contentType?contentType:'application/x-www-form-urlencoded',
            }
        }).then((data: any) => {
            if (data.status === 0) {
                let uuid = data.data.uuid;
                if (uuid) {
                    // uuid = JSON.stringify({ guid: uuid })
                    // const index = params.toString();

                    const instancePoll: CreatePollInterface = new CreatePoll({ url: pollUrl })
                    instancePoll.start({ guid: uuid, ...pollData, })
                        .then((responeData) => {
                            instancePoll.poll({ ...pollData, topic: 2,guid: uuid }, (responeData) => responeData.data.loadingSwitch === true, (responeData) => {
                                this.pollCallback(responeData);
                            });
                        }, (responeData) => {
                            // message.error(data.msg || '导入任务失败');
                        });
                    // if(wssExport.wss && wssExport.wss.ws.readyState !==3){
                    //     wssExport.wss.send(uuid);
                    // }else{
                    //     wssExport.wss = that.createWss(webSocketUrl, {uuid,title:'',index });
                    //     // 延迟发送
                    //     setTimeout(() => {
                    //         wssExport.wss&&wssExport.wss.send(uuid);
                    //     }, 2000)
                    // }
                }

            } else {
                this.handleChangeExportStatus(false);
            }
        });
    }

    /**
     * 对轮询业务的封装
     */
    /**
     * 轮询的回掉
     */
    pollCallback = (data) => {
        const {
            schedule,
            detail,
        } = data.data;

        this.handleChangeExportStatus(true);
        if (schedule == 100) {
            /**
             * 控制上传状态...
             */
            var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

            // 后端返回的地址还需要调用接口下载
            if (reg.test(detail)) {
                notification.success({
                    type: 'success',
                    message: '提醒',
                    description: '导出成功',

                });
                this.handleChangeExportStatus(false);
                this.setState({
                    batchExportUrl: detail,
                })
            } else {
                this.handleDownFile(detail);
            }

        }
        if (schedule === -1) {
            this.handleChangeExportStatus(false);
            notification.error({
                type: 'error',
                message: '提醒',
                description: detail || '导出文件失败',

            });
        }



    }


    handleDownFile = (url) => {
        const { params, downloadFileUrl } = this.props;
        const {
            index,
            title,
            uploading,
        } = params;


        const link = `${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download?fileName=${url}&type=EXCEL`;
        notification.success({
            type: 'success',
            message: '提醒',
            description: '导出成功',

        });
        this.setState({
            batchExportUrl: link,
        });
        this.handleChangeExportStatus(false);

    }



    handleOutputFile = () => {
        const { params, outputRequest, children, handleVerifyBefore } = this.props;
        let {
            index,
            title,
            uploading,
         } = params;
        if (handleVerifyBefore) {
            const verifyResult = handleVerifyBefore();
            if (verifyResult) {
                this.sendOutputRequest();
            }

        } else {
            this.sendOutputRequest();
        }

        // this.sendOutputRequest();

    }

    render() {

        const { params, children } = this.props;
        const { isUploading, batchExportUrl } = this.state;
        return (<a onClick={(e) => { e.preventDefault(); this.handleOutputFile(); }}>{children}<iframe src={batchExportUrl} style={{ display: 'none' }}></iframe></a>
            )

    }
}
/**
 * 去除空值对象给后台
 * @param obj{any} 对象
 * @return 
 */
const removeEmpty = (obj: any) => {
    if(obj instanceof Array){
        return obj
    }
    let newObj = {};
    for (var key in obj) {
        if (obj[key] !== '') {
            newObj[key] = obj[key];

        }
    }
    return newObj;
}