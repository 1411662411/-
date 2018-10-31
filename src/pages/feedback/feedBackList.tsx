import React, { Component } from 'react';
import QueueAnim from "rc-queue-anim/lib";
import moment, { Moment } from 'moment';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {
    Button,
    Select,
    Input,
    Table,
    Row,
    Col,
    Radio,
    DatePicker,
    Icon,
    Pagination,
    Spin,
    message,
    Modal,
    Divider,
    Form,
} from 'antd';
import { Link } from 'react-router';
import {
    DOMAIN_OXT,
    PAGINATION_PARAMS,
} from '../../global/global';
import * as actions from './../../action/feedback/feedBackListAction';
import { statePaginationConfig, mapCurrentPageToStart, } from '../../util/pagination';
import Immutable, { Map, List } from 'immutable';
import '../../css/feedBack/feedBackList.less';
import { replyFetching } from './../../action/feedback/feedBackListAction';
const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const actionCreators = {
    listGet: actions.listGet,
    like: actions.like,
    reply: actions.reply,
    replylist: actions.replylist
}

interface TStateProps {
    dataSource: List<Map<string, any>>;
    fetching: boolean;
    replyFetching: boolean;
    total: number;
    replylistSource: List<Map<string, any>>;
    replylistFetching: boolean;
    userInfo: Any.UserInfo;
}

interface TOwnProps {

}

interface FeedBackListState {
    currentPage: number;
    pageSize: number;
    visible: boolean;
    name: string;
    feedbackId?: number;
    feedbackUserId?: number;
}

type TDispatchProps = typeof actionCreators;
type FeedBackListProps = TStateProps & TDispatchProps & TOwnProps;


class FeedBackList extends React.Component<FeedBackListProps, FeedBackListState> {
    constructor(props) {
        super(props);
        this.state = {
            ...PAGINATION_PARAMS,
            visible: false,
            name: '',
        }
        this.search();
    }
    time: any[] = [];
    order: number = 1;
    replytext: any;
    searchParams = () => {
        return {
            startTime: this.time[0] ? this.time[0].startOf('day').unix() : undefined,
            endTime: this.time[1] ? this.time[1].endOf('day').unix() : undefined,
            order: this.order,
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            userId: this.props.userInfo.userId,
        };
    }
    search = (params = {}) => {
        this.props.listGet(mapCurrentPageToStart({ ...this.searchParams(), ...params }));
    }
    pagination = () => {
        const {
            currentPage,
            pageSize,
        } = this.state;
        const {
            total,
        } = this.props;
        return statePaginationConfig(
            {
                currentPage,
                pageSize,
                total,
            },
            (newParams) => this.search(newParams),
            null,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            }
        )
    }
    like = (params) => {
        this.props.like({ ...params, userId: this.props.userInfo.userId }, this.search);
    }
    reply = () => {
        if (!this.replytext) {
            return;
        }
        const replyContent = this.replytext.textAreaRef.value.trim();
        if (replyContent.length <= 0) {
            return message.error('请填写回复内容');
        }
        if (replyContent.length > 300) {
            return message.error('回复内容请控制在300个字之内');
        }
        this.props.reply({ feedbackId: this.state.feedbackId, name: this.props.userInfo.name, replyContent, feedbackUserId: this.state.feedbackUserId }, () => {
            this.props.replylist({ feedbackId: this.state.feedbackId, name: this.props.userInfo.name });
            this.search();

        });
    }
    showReply = (params) => {
        this.setState({ 
            visible: true, 
            feedbackId: params.feedbackId, 
            name: params.name, 
            feedbackUserId: params.feedbackUserId, 
        });
        this.props.replylist(params);
    }
    columns: any[] = [
        {
            title: "操作",
            key: 'handle',
            width: 140,
            render: (data) => {
                return (
                    <div>
                        {
                            data.status === 1 ?
                                <span className="handle-like" onClick={() => this.like({ id: data.id, ifPraise: 0 })} >
                                    <Icon type="like" className="" /> {data.praise || 0}
                                </span>
                                :
                                <span className="handle-unlike" onClick={() => this.like({ id: data.id, ifPraise: 1 })} >
                                    <Icon type="like-o" /> {data.praise || 0}
                                </span>
                        }
                        <span className="handle-reply" onClick={() => this.showReply({ name: data.feedback_user, feedbackId: data.id, feedbackUserId: data.feedback_user_id,  })}><Icon type="message" /> {data.num || 0}</span>
                    </div>
                );
            }
        },
        {
            title: '留言者姓名',
            key: 'feedback_user',
            dataIndex: 'feedback_user',
            width: 450,
            render: (data) => data || '/',
        }, {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            width: 140,
            render: (data) => data ? moment(data, 'X').format('YYYY/MM/DD HH:mm') : '/',
        }, {
            title: '留言内容',
            dataIndex: 'feedback_content',
            key: 'feedback_content',
            render: (data) => data,
        }, {
            title: '反馈类型',
            dataIndex: 'feedback_type',
            key: 'feedback_type',
            width: 75,
            render: (data) => data === 1 ? '表扬' : '吐槽',
        }
    ]
    rangePickerChange = (value) => {
        this.time = value;
        if(value.length <= 0 ) {
            this.search();
        }
    }
    render() {
        const {
            fetching,
            dataSource,
            replyFetching,
            replylistSource,
            replylistFetching,
        } = this.props;
        const {
            visible,
            name,
        } = this.state;
        const splitName = name.split('|')[0];
        return (
            <QueueAnim>
                <div className="feedBackList">
                    <div className="form-site">
                        <Form layout="inline">
                            <FormItem label="排序">
                                <Radio.Group defaultValue={this.order} onChange={e => { this.order = e.target.value; this.search(); }}>
                                    <Radio.Button value={1}>按点赞数排序</Radio.Button>
                                    <Radio.Button value={2}>按创建时间排序</Radio.Button>
                                </Radio.Group>
                            </FormItem>
                            <FormItem label="创建时间">
                                <RangePicker onChange={value => { this.time = value; this.search()}}  />
                            </FormItem>
                        </Form>
                    </div>
                    <QueueAnim type="bottom" delay="300">
                        <Table
                            style={{ marginTop: 20 }}
                            loading={fetching}
                            rowKey={(record: any) => record.id}
                            pagination={this.pagination()}
                            dataSource={dataSource.toJS()}
                            bordered={true}
                            columns={this.columns}
                            scroll={{ x: 800 }}
                        >
                        </Table>
                    </QueueAnim>
                    <Modal key={this.state.feedbackId} className="reply-modal" visible={visible} title={`回复${splitName}`} footer={null} onCancel={() => { this.setState({ visible: false, name: '', feedbackId: undefined,  feedbackUserId: undefined, }) }}>
                        <div>
                            <TextArea placeholder="回复内容" key={Date.now()} rows={4} ref={node => this.replytext = node} />
                            <div className="reply-button-wrapper">
                                <Button type="primary" loading={replyFetching} onClick={() => this.reply()}>回复</Button>
                            </div>
                            <Spin spinning={replylistFetching}>
                                <div className="reply-histroy">
                                    {replylistSource.size > 0 ? replylistSource.toJS().map(value => (
                                        <div className="reply-histroy-item">
                                            <div className="reply-header">
                                                <span className="reply-name">{value.replyer_name} 回复:</span>
                                                <span className="reply-time">{moment(value.create_time, 'X').format('YYYY/MM/DD HH:mm')}</span>
                                            </div>
                                            <p className="reply-content">
                                                {value.reply_content}
                                            </p>
                                        </div>
                                    )) :
                                        <div className="reply-list-empty">暂无回复</div>
                                    }
                                </div>
                            </Spin>
                        </div>
                    </Modal>
                </div>
            </QueueAnim>
        )
    }
}




function mapStateToProps(state: Any.Store) {
    const data = state.get('feddBackListReducer');
    return {
        dataSource: data.get('dataSource'),
        total: data.get('total'),
        fetching: data.get('fetching'),
        replyFetching: data.get('replyFetching'),
        replylistSource: data.get('replylistSource'),
        replylistFetching: data.get('replylistFetching'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}
const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedBackList)




