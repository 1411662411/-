import React from 'react'

import { List } from 'antd'

import noProclamationPng from "../../../images/no-msg.png"

import './style.less'

import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn } from '../../../util/fetch';
const getProclamationApi = `${DOMAIN_OXT}/apiv2_/crm/api/module/parameterConfiguration/bulletinBoard`;
const getProclamation = (data) => {
    return fetchFn(getProclamationApi, data).then(data => data);
}


interface ProclamationProps{
    // dataSource: any[] | null | undefined;
    type?: 'none';
}


class Proclamation extends React.Component<ProclamationProps,any>{
    constructor(props){
        super(props)
        this.state = {
            dataSource:[],
        }
    }
    async componentWillMount(){
        if(this.props.type === 'none'){
            this.setState({
                dataSource:[
                    {announcementDate: "03-28",title: '这是一条公告信息',content: '这是一条公告信息', newLable:1},
                    {announcementDate: "03-28",title: '这是一条公告信息',content: '这是一条公告信息', newLable:1},
                    {announcementDate: "03-28",title: '这是一条公告信息',content: '这是一条公告信息', newLable:1},
                    {announcementDate: "03-28",title: '这是一条公告信息',content: '这是一条公告信息', newLable:1},
                    {announcementDate: "03-28",title: '这是一条公告信息',content: '这是一条公告信息', newLable:1},
                    {announcementDate: "03-28",title: '这是一条公告信息',content: '这是一条公告信息', newLable:1},
                    {announcementDate: "03-28",title: '这是一条公告信息',content: '这是一条公告信息', newLable:1},
                    {announcementDate: "03-28",title: '这是一条公告信息',content: '这是一条公告信息', newLable:1},
                ]
            })
        }
        else{
            let res:any = await getProclamation({})
        if(res.errcode === 0){
            this.setState({dataSource: res.data});
        }else{
            this.setState({dataSource: []});
        }
        }
    }
    render(){
        const {
            dataSource,
        } = this.state;
        return <div className='crm-workbench-proclamation'>
            {
                dataSource.length === 0 ? <div className='text-center' style={{paddingTop:20}}>
                    <img src={noProclamationPng} alt=""/>
                </div>
                : <AutoList dataSource={dataSource}/>
            }
            
        </div>
    }
}

class AutoList extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state = {
            isAutoScroll:false,
            isShowMoreList:false,
        }
    }
    listNode:any;
    timer:any;
    translateY:number = 0;
    container:any;
    list:any;
    listTwo:any;
    autoScrollFun(){
        if(this.container && this.list){
            // console.log(container.clientHeight, list.clientHeight)
            if(this.list.clientHeight > this.container.clientHeight){
                this.setState({isAutoScroll:true,isShowMoreList:true})
                this.autoScroll(this.container)
            }
        }
    }
    autoScroll(dom){
        // let scrollTop = dom.scrollTop;
        this.timer = setInterval(()=>{
            // this.listTwo = document.querySelectorAll('.crm-workbench-proclamation .ant-list-split')[1];
            // console.log(this.container.scrollTop, this.listTwo.offsetTop);
            // this.listNode && this.listNode.focus();
            if(this.state.isAutoScroll){
                // if(this.listTwo.offsetTop - this.container.scrollTop <= 0){
                //     this.container.scrollTop -= this.listTwo.offsetHeight;
                // }else{
                //     this.container.scrollTop = '100px' ;
                // }

                if(this.translateY >= this.list.clientHeight){
                    this.translateY = this.translateY-this.list.clientHeight;
                }
                dom.style.transform = `translateY(-${this.translateY++}px)`
            }
        },50)
    }
    componentDidMount(){
        this.container = document.querySelectorAll('.crm-workbench-proclamation')[0];
        this.list = document.querySelectorAll('.crm-workbench-proclamation .ant-list-split')[0];
        this.autoScrollFun();
    }

    render(){

        const {
            isAutoScroll,
            isShowMoreList,
        } = this.state;
        const {
            dataSource
        } = this.props;
        return <div>
            <div
                onMouseEnter={() => {isShowMoreList && this.setState({isAutoScroll: false})}}
                onMouseLeave={() => {isShowMoreList && this.setState({isAutoScroll: true})}}
            >
            <List
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}itemLayout="horizontal"
            // bordered
            // ref={node => this.listNode = node}
            size= 'small'
            dataSource={dataSource}
            renderItem={item => (<List.Item
                actions={[<span className='text-small'>{item.announcementDate}</span>]}
            >
                <div>
                <b className='greenPoint'></b>
                {item.title}
                {item.content ? 
                    <a style={{}} target='_blank' href={`${DOMAIN_OXT}/newadmin/crm/workbenchconfig/proclamation?readId=${item.id}`}>【查看】</a> : ''
                }
                {item.newLable ==1 && <i style={{color: '#FC5C00'}} className='crmiconfont crmicon-new'></i> }
                </div>
            </List.Item>)}
            />
            </div>


            {/* 如果数据过多，自动滚动 */}
            {
                isShowMoreList ?  <div
                onMouseEnter={() => {this.setState({isAutoScroll: false})}}
                onMouseLeave={() => {this.setState({isAutoScroll: true})}}
            >
            <List
            ref={node => this.listNode = node}
            size= 'small'
            dataSource={dataSource}
            renderItem={item => (<List.Item
                actions={[<span className='text-small'>{item.announcementDate}</span>]}
            >
                <b className='greenPoint'></b>
                {item.title}
                {item.content ? 
                    <a target='_blank' href={`${DOMAIN_OXT}/newadmin/crm/workbenchconfig/proclamation?readId=${item.id}`}>【查看】</a> : ''
                }
                {item.newLable ==1 && <i style={{color: '#FC5C00'}} className='crmiconfont crmicon-new'></i> }
            </List.Item>)}
            />
            </div>
            : <div style={{color: '#999'}} className='no-more text-center'>~没有更多公告了</div>
            }
        </div>
    }
}

export default Proclamation