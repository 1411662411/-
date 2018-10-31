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
import './outputFile.less';
interface wss {
    wss: CreateWebSocket | null,
}

export interface CreatePollInterface {
    poll: (data: any, stopFlag: StopFlag, callback?: any) => void;
    start: (data: any) => Promise<any>;
    end: () => void;
}
interface CreatePollProps {
    delay?: number;
    url: string;
}
interface StopFlag {
    (responeData): boolean;
}
interface createWss {
    (url: string, params: {
        index: number,
        title: string;
        uuid?: string;
    }): any;
}
interface OutputFileProps {
    outputParams: any;
    callback?: (data) => void;
    outputUrl: string;
    pollData: {
        type?: number;
        userId: string;
        userName?: string;
    }
    type?: number; // 导出类型 1 同时导出 2 单个导出 (默认单个) 单个导出需要在父组件添加loading
    pollUrl: string;
    contentType?: string;
    beforeOutput?: (data) => void;
    downloadUrl: string;
    role?: number;

}

export class OutputFile extends React.Component<OutputFileProps, any> {
    poll: CreatePollInterface;
    constructor(props) {
        super(props);
        this.state = {
            outputing: false,
        }

    }
    /**
     * 更新导出状态
     */
    handleChangeExportStatus = (outputing: boolean) => {

        const { callback, type } = this.props;


        if (callback && type != 1) {
            callback(outputing);
        } else {
            this.setState({ outputing: outputing })
        }
    }






    /**
     * 导出之前发送请求获取任务key (uuid)
     */
    sendOutputRequest = () => {

        const {
            outputParams,
            children,
            outputUrl,
            pollUrl,
            contentType,
            pollData,
        } = this.props;
        if (!outputUrl || !pollUrl) {
            message.error('参数有误');
            return false;
        }
        this.handleChangeExportStatus(true);
        fetchFn(outputUrl, removeEmpty(outputParams), {
            headers: {
                'Content-Type': contentType ? contentType : 'application/x-www-form-urlencoded',
            }
        }).then((data: any) => {
            if (data.status === 0) {
                let uuid = data.data.uuid;
                if (uuid) {

                    console.log(uuid);

                    const instancePoll: CreatePollInterface = new CreatePoll({ url: pollUrl })
                    instancePoll.start({ guid: uuid, ...pollData, })
                        .then((responeData) => {
                            instancePoll.poll({ ...pollData, topic: 2, guid: uuid }, (responeData) => responeData.data.loadingSwitch === true, (responeData) => {
                                console.log("============" + uuid);
                                this.pollCallback(responeData, uuid);
                            });
                        }, (responeData) => {
                            // message.error(data.msg || '导入任务失败');
                        });

                }

            } else {
                this.handleChangeExportStatus(false);
            }
        });
    }




    /**
     * 轮询的回掉
     */
    pollCallback = (data, uuid) => {
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
                this.createIframe(detail, uuid)
            } else {
                this.handleDownFile(detail, uuid);
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





    /**
     * 根据文件key 生成下载链接
     */
    handleDownFile = (url, uuid) => {

        const { outputParams, downloadUrl } = this.props;


        const link = `${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download?fileName=${url}&type=EXCEL`;
        notification.success({
            type: 'success',
            message: '提醒',
            description: '导出成功',

        });

        this.createIframe(link, uuid)
        this.handleChangeExportStatus(false);

    }


    /**
     * 创建iframe 下载文件
     */
    createIframe = (url, uuid) => {

        const iframe: HTMLElement | null = document.getElementById(uuid);
        if (iframe) {
            iframe.setAttribute('url', url);
        }
        else {
            const newIframe: HTMLIFrameElement = document.createElement('iframe');
            newIframe.setAttribute('id', uuid)
            newIframe.setAttribute('style', 'display:none;')
            newIframe.src = url;
            document.body.appendChild(newIframe);


        }
    }


    /**
     * 导出组件绑定的props
     */
    outputProps = () => {
        let {
            outputParams,
            callback,
            outputUrl,
            pollUrl,
            type,
            contentType,
            beforeOutput,
            downloadUrl,
        } = this.props;
        const {
            outputing,
        } = this.state;
        let props: any = {
            onClick: () => {
                if (typeof beforeOutput === "function") {
                    const verifyResult = beforeOutput({});
                    if (verifyResult) {
                        this.sendOutputRequest();
                    }

                } else {
                    this.sendOutputRequest();
                }
            }
        }



        return props;
    }




    render() {
        const { outputParams, children, type } = this.props;
        const { outputing } = this.state;

        return (<div {...this.outputProps() } className="no-overflow" style={{ display: 'inline-block' }}>
            {
                type === 1 ? <Spin spinning={outputing}> {children}</Spin> : children

            }</div>

        )

    }
}
/**
 * 去除空值对象给后台
 * @param obj{any} 对象
 * @return 
 */
const removeEmpty = (obj: any) => {
    if (obj instanceof Array) {
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