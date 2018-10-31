export interface CreateWebSocket {
    ws: WebSocket;
    send: (data) => void;
    close: () => void;
}

interface CreateWebSocketProps {
    url: string; /* 链接地址 */
    maxConnect? : number;
    heartRate?: number; /* 心率监测时间 */
    onopen?: (event) => void; /* 链接成功后执行的方法 */
    onmessage?: (event) => void;
    onerror?: (event) => void;
    onclose?: (event) => void;
}
export default class createWebSocket implements CreateWebSocket {


    /**
     * websocket实例
     */
    ws: WebSocket;


    /**
     * 重连接的锁, 避免重复连接
     */
    private lockReconnect = false;
     

    /**
     * 是否是手动关闭
     */
    private triggerClosed = false;

    constructor(private props: CreateWebSocketProps) {
        const defaultProps = {
            /**
             * 心率
             */
            heartRate: 60000,

            /**
             * 尝试重连的次数
             */
            maxConnect: 10,
        }
        this.props = {
            ...defaultProps,
            ...props
        }
        const {
            url,
        } = props;
        this.createWebSocket();
        // /**
        //  * 这里因为阿里云负载均衡不支持wesocket，
        //  * 解决方案是：另外构建一个websocket服务不走阿里云的负载均衡，
        //  * 但是由于SSO单点登陆，需要先用隐藏的iframe登陆。
        //  */
        // const urlSplit = url.split('/');
        // const loginUrl = (urlSplit && urlSplit.length > 3 && `//${urlSplit[2]}/admin/ws`) || ''
        // const iframe:  HTMLElement | null = document.getElementById('websocket-sso-login');
        // if(iframe) {
        //     iframe.setAttribute('url', loginUrl);
        //     this.createWebSocket();
        //     return;
        // }
        // else {
        //     const newIframe: HTMLIFrameElement = document.createElement('iframe');
        //     newIframe.setAttribute('id', 'websocket-sso-login')
        //     newIframe.setAttribute('style', 'display:none;')
        //     newIframe.src = loginUrl;
        //     document.body.appendChild(newIframe);
        //     newIframe.onload = () => {
        //         this.createWebSocket();
        //     }

        // }
        
    }
    private createWebSocket:(data?) => void = (data) => {
        const {
            url
        } = this.props;
        try {
            this.ws = new WebSocket(url);
            this.initEventHandle(data);
        } catch (e) {
            this.reconnect();
        }
    }
    private initEventHandle:(data?) => void = (data) => {
        const {
            ws,
            heartCheckReset,
            heartCheckStart,
        } = this;
        const {
            onopen,
            onmessage,
            onerror,
            onclose,
        } = this.props;
        ws.onclose = (event) => {
            // console.log(`${new Date()} websocket close`);
            !this.triggerClosed && this.reconnect();
            typeof onclose === 'function' && onclose(event);
        };
        ws.onerror = (event) => {
            // console.log(`${new Date()} websocket onerror`)
            // this.reconnect();
            typeof onerror === 'function' && onerror(event);
        };
        ws.onopen = (event) => {
            if(data) {
                ws.send(data);
            }
            /**
             * 心跳监测重置
             */
            heartCheckReset();

            /**
             * 心跳监测开始
             */
            heartCheckStart();

            typeof onopen === 'function' && onopen(event);

        };
        ws.onmessage = (event) => {
            /**
             * 如果获取到消息，心跳监测重置
             * 拿到任何消息都说明当前连接是正常的
             */
            heartCheckReset();
            heartCheckStart();

            typeof onmessage === 'function' && onmessage(event);
        }
    }
    private reconnect = () => {
        // console.log(`${new Date()} websocket reconnect`);
        let {
            createWebSocket,
            lockReconnect,
            props,
        } = this;

        /**
         * 超过尝试重连的次数
         */
        if(<number>this.props.maxConnect <= 0 ) {
            return;
        }


        if (lockReconnect) return;
        lockReconnect = true;
        this.props.maxConnect =   <number>this.props.maxConnect - 1;

        /**
         * 没连接上会一直重连，设置延迟避免请求过多
         */
        setTimeout(() => {
            createWebSocket();
            lockReconnect = false;
        }, 5000);
    }

    /**
     * 心跳监测
     */
    private heartRater;
    private serverTimeouter;

    /**
     * 心跳监测重置
     */
    private heartCheckReset = () => {
        clearTimeout(this.heartRater);
        clearTimeout(this.serverTimeouter);
    };

    /**
     * 心跳监测开始
     */
    private heartCheckStart = () => {
        const {
            heartRate
        } = this.props;
        const {
            ws,
            createWebSocket,
        } = this;
        this.heartRater = setTimeout(　() => {

            /**
             * 这里发送一个心跳，后端收到后，返回一个心跳消息，
             * onmessage拿到返回的心跳就说明连接正常
             */
            // try {
            //     ws.send('{"HeartBeat": 1}');
            // }
            // catch (e) {
            //     console.log(e)
            //     this.reconnect();
            // }

            this.serverTimeouter = setTimeout(() => {

                /**
                 * 如果超过一定时间还没重置，说明后端主动断开了
                 * 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                 */
                ws.close();
            }, heartRate);
        }, heartRate);
    }
    send = (data) => {
        const {
            ws,
        } = this;
        if(ws  && ws.readyState !== 1) {
            this.createWebSocket(data)
        }
        else {
            ws.send(data)
        }
    }
    close = () => {
        this.heartCheckReset();
        this.triggerClosed = true;
        this.ws.close();
    }
}