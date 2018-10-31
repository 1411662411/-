import React from 'react';
import {
    connect,
} from 'react-redux';
import { Select, DatePicker, Icon, List, Spin, Tooltip  } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment'
import {DOMAIN_OXT} from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

const API = `${DOMAIN_OXT}/apiv2_/permission/v1/account/getAllSalesNoTreeByReportUserId`;
const TRENDS_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerOperationLogs/newslist`;
const getUserWithOrganization = (id) => fetchFn(API, {id}).then(data => data);
const getTrendsList = ({pageNow, type, salesId, date}) => fetchFn(TRENDS_LIST_API, {
    type: type ? type : null,
    salesId: salesId ? salesId : null,
    date: date ? date : null,
    pageNow,
    pageSize: 10,
}).then(data => data);

import './style.less';

class Trends extends React.Component<any, any>{
    constructor(props){
        super(props)
        this.state = {
            userWithOrganization:[],
            loading: true,
            hasMore: true,
            dataSource:[],

            pageNow: 1,
            type:'',
            salesId:'',
            date: moment(),
        }
    }

    renderUserWithOrganization = () => {
        const {userWithOrganization} = this.state;
        let options = [<Select.Option value=''>全部</Select.Option>];
        userWithOrganization.map(item => {
            options.push(<Select.Option value={item.id}>{item.name}({item.employeeNumber})</Select.Option>)
        })
        return options;
    }

    getTrendsList = async(pageNow) => {
        const {pageCount, type, salesId, date} = this.state;
        let response:any = await getTrendsList({
            pageNow,
            type,
            salesId,
            date: date ? date.format('YYYY-MM-DD') : null,
        })
        if(response.status === 0 && response.data){
            if(pageNow < response.data.pageCount){
                this.setState({
                    pageNow: pageNow,
                    pageCount: response.data.pageCount,
                    hasMore: true,
                })
            }else{
                this.setState({
                    pageNow: pageNow -1,
                    pageCount: response.data.pageCount,
                    hasMore: false,
                })
            }
            
        }
        return response.data ? response.data.records ? response.data.records : [] : [];
    }

    loadMore = async(value) => {
        this.setState({loading: true});
        let dataSource = await this.getTrendsList(value);
        this.setState({
            dataSource: [...this.state.dataSource, ...dataSource],
            loading: false,
        })
    }

    onSelectChange = (key, value) => {
        this.setState({
            loading: true,
            [key]:value,
        }, async() => {
            const dataSource = await this.getTrendsList(1);
            this.setState({
                dataSource,
                loading: false,
            });
        })
    }

    async componentWillMount(){
        const {userInfo} = this.props;
        let res:any = await getUserWithOrganization(userInfo.userId);
        let dataSource = await this.getTrendsList(1);
        this.setState({
            userWithOrganization:res.data ? res.data : [],
            dataSource,
            loading: false,
        });
    }

    render(){
        const {type, salesId, date, hasMore, dataSource, loading} = this.state;
        const options = this.renderUserWithOrganization();
        return <div className='crm-trends-container'><Spin spinning={loading}>
            <div
                className='crm-trends-search-group text-green'
                style={{
                    padding:'5px 0',
                    borderBottom: '1px solid #eee',
                }}
            >
                <Select
                    size='small'
                    value={salesId}
                    style={{
                        width: 140,
                        marginRight: 10,
                    }}
                    onChange={(value) => {this.onSelectChange('salesId', value)}}
                    showSearch
                    filterOption={(input, option:any) => {
                        // console.log(Array.isArray(option.props.children))
                        if(!Array.isArray(option.props.children)){
                            return option.props.children;
                        }else{
                            return option.props.children.join('').toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }
                    }}
                >    
                    {options}
                </Select>
                <Select
                    size='small'
                    value={type}
                    style={{
                        width: 95,
                    }}
                    onChange={(value) => {this.onSelectChange('type', value)}}
                >    
                    <Select.Option value=''>全部动态</Select.Option>
                    <Select.Option value={1}>新增客户</Select.Option>
                    <Select.Option value={2}>转移客户</Select.Option>
                </Select>
                <span className='rt'>
                    <DatePicker 
                        size='small'
                        value={date}
                        onChange={(date, dateString) => {
                            this.setState({
                                date,
                                loading: true,
                            }, async() => {
                                const dataSource = await this.getTrendsList(1);
                                this.setState({
                                    dataSource,
                                    loading: false,
                                });
                            })
                        }}
                    />
                    <span
                        className='crm-trends-reset'
                    onClick={() => {
                        this.setState({
                            loading: true,
                            type:'',
                            salesId:'',
                            date: moment(),
                        }, async() => {
                            const dataSource = await this.getTrendsList(1);
                            this.setState({
                                dataSource,
                                loading: false,
                            });
                        })
                    }}><Icon type="sync" /></span>
                </span>
            </div>
            <div
                className='crm-trends-list-container'
            >
            <InfiniteScroll
                initialLoad={false}
                pageStart={1}
                loadMore={this.loadMore}
                hasMore={!loading && hasMore}
                useWindow={false}
            >
                <List
                    itemLayout="vertical"
                    dataSource={dataSource}
                    renderItem={item => {
                        const content = JSON.parse(item.content);
                        // const test = '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊'
                        return <List.Item key={item.id}>
                            {/* <List.Item.Meta
                                description={}
                            /> */}
                            <span className='crm-trends-item'>
                                <b className='greenPoint'></b>
                                <span className='text-1-ellipsis crm-trends-sales'>{item.name}</span>
                                <span className='text-1-ellipsis crm-trends-type'>{Number(item.type) === 1 ? '新增客户' : Number(item.type) === 2 ? '转移客户' : '' }</span>
                                <Tooltip title={content.content}>
                                    <span className='text-1-ellipsis crm-trends-content'>
                                        {Number(content.release) === 1 ? <span className='text-1-ellipsis crm-trends-content-hasRelease'>{content.content}</span> : content.content}
                                        {Number(content.release) === 1 && <span className='crm-trends-release'>临近释放</span> }
                                    </span>
                                </Tooltip>
                                <span className='text-1-ellipsis crm-trends-date'>{moment(item.createDate * 1000).format('YYYY-MM-DD HH:mm')}</span>
                            </span>
                        </List.Item>
                    }}
                >
                </List>
            </InfiniteScroll>
            {!this.state.hasMore && dataSource.length > 0 && <div style={{color:'#999'}} className='text-center'>没有更多了</div>}
            </div>
        </Spin></div>
    }
}
const mapStateToProps = (state, ownProps) => ({
    userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
})

export default connect(mapStateToProps)(Trends);