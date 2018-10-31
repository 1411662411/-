export interface CreatePollInterface {
    poll: (data: any, stopFlag: StopFlag, callback?: any) => void;
    start: (data: any) => Promise<any>;
    end: () => void;
}

interface CreatePollProps {
    delay?: number;
    url: string;
    fetchFnMessageType?: 0 | 1; 
}
interface StopFlag {
    (responseData): boolean;
}
import { fetchFn } from '../util/fetch'
export default class CreatePoll implements CreatePollInterface {
    constructor(private props: CreatePollProps) {
        const defaultProps = {
            delay: 3000,
            fetchFnMessageType: 1 as 0 | 1,
        }
        this.props = {
            ...defaultProps,
            ...props,
        };
    }
    private firstPoll: boolean = true;
    private timer: number;
    private promisePoll = (data) => {
        let {
            timer,
            props,
            firstPoll,
        } = this;
        const {
            url,
            delay,
            fetchFnMessageType,
        } = props;
        return new Promise((resolve, reject) => {
            timer = setTimeout(() => {

                /**
                 * 第二次设置为false，延迟发送轮询请求
                 */
                this.firstPoll = false;
                fetchFn(url, data, null, fetchFnMessageType).then(data => data).then((data: any) => {
                    if (data.status !== 0 && data.errorCode !== 0) {
                        reject(data);
                    }
                    else {
                        resolve(data);
                    }
                });



            }, firstPoll === true ? 1 : delay /* 如果是第一次的话就快速发出轮询请求 */);

        });
    }
    /**
     * 轮询请求
     * @params data {Object} 参数
     * @params stopFlag {(responseData) => boolean} 停止轮询的阈值
     * 使用例如：poll({userId: 111}, {key: 'loadingSwitch', value: true}, () => {});
     */
    poll: (data: any, stopFlag:StopFlag, callback?: any) => void = (data, stopFlag, callback?) => {
        const {
            promisePoll,
            timer,
            end,
            poll,
        } = this;
        promisePoll(data).then((responseData: any) => {
            if (stopFlag(responseData)) {
                end();
                if (callback && Object.prototype.toString.call(callback).slice(8, -1) === 'Function') {
                    callback(responseData);
                }
            }
            else {
                poll(data, stopFlag, callback);
            }
        }, (responseData)=> {
            if (callback && Object.prototype.toString.call(callback).slice(8, -1) === 'Function') {
                callback(responseData);
            }
        });
    }
    /**
     * 轮询请求前单独发送的请求,
     * 返回Promise,
     * 使用例如：start({x: 1}).then((data) => {}, (data) => {})
     */
    start: (data: any) => Promise<any> = (data) => {
        const {
            url,
            fetchFnMessageType,
        } = this.props;
        return new Promise((resolve, reject) => {
            fetchFn(url, data, {}, fetchFnMessageType).then(data => data).then((data: any) => {
                if (data.status !== 0 && data.errorCode !== 0) {
                    reject(data);
                }
                else {
                    resolve(data);
                }
            })
        });
    }
    /**
     * 停止轮询
     */
    end = () => {
        /**
         * 回复初始状态
         */
        this.firstPoll = true;
        clearTimeout(this.timer);
    }
}


