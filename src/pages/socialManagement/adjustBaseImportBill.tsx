import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectCity from '../../components/select-city/index';
import address from '../../components/select-city/address.json';
import { 
    DOMAIN_OXT, 
    PAGINATION_PARAMS,
    PHP_DOMAIN,
    STATIC_DOMAIN
} from '../../global/global';
import {
    Form,
    Button,
    Upload,
    Icon,
    message,
    Select,
    Table,
    Input,
    Popover,
} from 'antd';
import {
    getListData,
    setCompanyName,
} from '../../action/socialManagement/adjustBaseImportBillAction';
import { browserHistory } from 'react-router'
import Immutable, { Map, List } from 'immutable';
import {
    statePaginationConfig,
} from '../../util/pagination';
import UploadFile from '../../businessComponents/common/uploadFile';

const Option = Select.Option;
const FormItem = Form.Item;
const actionCreators = {
    getListData,
    setCompanyName,
}

const uploadUrl = `${DOMAIN_OXT}/api/adjust-base/advance/import`;
const pollUrl = `${DOMAIN_OXT}/apiv2_/social/bill/progress`;



interface TOwnProps {
}
interface TStateProps {
    listFetching: boolean;
    dataSource: List<Map<any, any>>
    total: number;
    userInfo:  Any.UserInfo;
}
type TDispatchProps = typeof actionCreators;
type AdjustBaseImportBillProps = TDispatchProps & TOwnProps & TStateProps;

interface AdjustBaseImportBillState {
    searchParams: Map<'cert' | 'uploadStatus' | 'policyId' | keyof typeof PAGINATION_PARAMS, any>
    isUploaded: boolean;
}


class AdjustBaseImportBill extends Component<AdjustBaseImportBillProps, AdjustBaseImportBillState> {
    uploadStatus: Select | null ;
    constructor(props: AdjustBaseImportBillProps) {
        super(props);

        this.state = {
            searchParams: Immutable.fromJS({
                uploadStatus: 0,
                ...PAGINATION_PARAMS
            }),
            isUploaded: false,

        };
        this.search();
    }
    selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
        return {
            deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            addressApi: `${DOMAIN_OXT}/apiv2_/policy/singletonpolicy/getcities`,
            transform: true,
            placeholder: '请选择',
            // address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 200,
            }, /* input 的样式 */
            onChange: (selectVal, selectName, code) => {  /* 选择到最后一层的回调 */
                if (selectVal && selectVal.length >= 3) {
                    this.setState(({ searchParams }) => ({
                        searchParams: searchParams.update('policyId', () => selectVal[2])
                    }));
                }
                else {
                    this.setState(({ searchParams }) => ({
                        searchParams: searchParams.delete('policyId')
                    }));
                }
            },
        }
    }
    pagination = () => {
        const {
            searchParams,
        } = this.state;
        const {
            currentPage,
            pageSize,
        } = searchParams.toJS();
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
                this.setState(({ searchParams }) => ({
                    searchParams: searchParams.update('currentPage', () => currentPage).update('pageSize', () => pageSize)
                }));
            }
        )
    }
    getSearchParams = () => {
        return this.state.searchParams.toJS();
    }
    search = (params?) => {
        if (params) {
            return this.props.getListData({ ...this.getSearchParams(), ...params });
        }
        this.props.getListData(this.getSearchParams());
    }
    searchParamsOnChange = (key, value) => {
        this.setState(({ searchParams }) => ({
            searchParams: searchParams.update(key, () => value)
        }));
    }
    columns = (index) => {
        if (index === 0) {
            return [
                {
                    title: '姓名',
                    dataIndex: 'userSocialName',
                    key: 'userSocialName',
                },
                {
                    title: '身份证',
                    dataIndex: 'cert',
                    key: 'cert',
                },
                {
                    title: '客户名称',
                    key: 'cName',
                    render: (text) => {
                        if(text.socialStatus === 1 || text.socialStatus === 2 || text.fundStatus === 1 || text.fundStatus === 2) {
                            return text.cName;
                        }
                        return <MyPopover value={text.cName} ok={(value) => {
                            return new Promise((resolve, reject) => {
                                this.props.setCompanyName(
                                    {
                                        id: text.id,
                                        cName: value,
                                    },
                                    {
                                        resolve,
                                        reject,
                                        callback: this.search
                                    }
                                )
                            });
                        }} />
                    },
                },
                {
                    title: '参保地',
                    dataIndex: 'city',
                    key: 'city',
                },
                {
                    title: '缴费月',
                    dataIndex: 'insuranceFeeMonth',
                    key: 'insuranceFeeMonth',
                },
                {
                    title: '社保缴纳月',
                    dataIndex: 'socialMonth',
                    key: 'socialMonth',
                    render(text) {
                        if(text === undefined) {
                            return '/';
                        }
                        return text;
                    }
                },
                {
                    title: '公积金缴纳月',
                    dataIndex: 'fundMonth',
                    key: 'fundMonth',
                    render(text) {
                        if(text === undefined) {
                            return '/';
                        }
                        return text;
                    }
                },
                {
                    title: '社保预收导入情况',
                    dataIndex: 'socialStatus',
                    key: 'socialStatus',
                    render(text) {
                        switch(text) {
                            case 0: 
                                return <span style={{color: 'red'}}>未导入</span>;
                            case 1:
                            case 2:
                                return '已导入';
                            default: 
                                return '/';
                        }
                    },
                },
                {
                    title: '社保预收金额',
                    key: 'socialMoney',
                    render(text) {
                        if(text.socialStatus === 3) {
                            return '/';
                        }
                        if(text.socialStatus === 0) {
                            return '';
                        }
                        return text.socialMoney;
                    }
                    
                },
                {
                    title: '公积金预收导入情况',
                    dataIndex: 'fundStatus',
                    key: 'fundStatus',
                    render(text) {
                        switch(text) {
                            case 0: 
                                return <span style={{color: 'red'}}>未导入</span>;
                            case 1:
                            case 2:
                                return '已导入';
                            default: 
                                return '/';
                        }
                    },
                },
                {
                    title: '公积金预收金额',
                    key: 'fundMoney',
                    render(text) {
                        if(text.fundStatus === 3) {
                            return '/';
                        }
                        if(text.fundStatus === 0) {
                            return '';
                        }
                        return text.fundMoney;
                    }
                },
                {
                    title: '总金额',
                    dataIndex: 'totalMoney',
                    key: 'totalMoney',
                },
                {
                    title: '操作',
                    key: 'handle',
                    render(text) {

                        if(!text.detailId) {
                            return '';
                        }

                        const insuranceFeeMonth = text.insuranceFeeMonth + '';
                        const momth = `${insuranceFeeMonth.slice(0,4)}-${insuranceFeeMonth.slice(4,6)}-01`

                        return <a href={`${PHP_DOMAIN}/social/social/customer/socialitem?id=${text.userSocialId}&month=${momth}&detail_id=${text.detailId}`} >查看预收详情</a>
                    },
                },
            ]
        }
    }
    /**
     * 创建iframe 下载文件
     */
    createIframe = (url, uuid) => {

        const iframe: HTMLElement | null = document.getElementById(uuid);
        if (iframe) {
            iframe.setAttribute('src', url);
        }
        else {
            const newIframe: HTMLIFrameElement = document.createElement('iframe');
            newIframe.setAttribute('id', uuid)
            newIframe.setAttribute('style', 'display:none;')
            newIframe.src = url;
            document.body.appendChild(newIframe);


        }
    }
    uploaded = (data) => {
        if(data && data.data && data.data.url) {
            this.createIframe(data.data.url, 'iframedownload-1')
        }
        else {
            this.search();
        }
    }
    render() {
        const {
            listFetching,
            dataSource,
        } = this.props;
        console.log(listFetching)
        return (
            <div>
                <Form layout="inline">
                    <FormItem>
                        <UploadFile
                            uploadUrl={uploadUrl}
                            accept={['.xls', '.xlsx']}
                            uploadData={{
                                type: 1,
                            }}
                            success={(data) => this.uploaded(data)}
                            pollUrl={pollUrl}>
                            <Button type="primary">
                                <Icon type="upload" /> 导入社保
                            </Button>
                        </UploadFile>
                    </FormItem>
                    <FormItem>
                        <UploadFile
                            uploadUrl={uploadUrl}
                            accept={['.xls', '.xlsx']}
                            uploadData={{
                                type: 2,
                            }}
                            success={(data) => this.uploaded(data)}
                            pollUrl={pollUrl}>
                            <Button type="primary">
                                <Icon type="upload" /> 导入公积金
                            </Button>
                        </UploadFile>
                    </FormItem>
                    <FormItem label="请下载导入模板">
                        <a style={{ marginRight: 10 }} href={`${STATIC_DOMAIN}/dist/assets/template/调基预收账单模板_五险.xlsx`}>调基预收账单模板_五险.xlsx</a>
                        <a href={`${STATIC_DOMAIN}/dist/assets/template/调基预收账单模板_公积金.xlsx`}>调基预收账单模板_公积金.xlsx</a>
                    </FormItem>
                </Form>
                <Form layout="inline" style={{ marginTop: 20, marginBottom: 10, }}>
                    <FormItem label="身份证号">
                        <Input onChange={(e) => this.searchParamsOnChange('cert', e.target.value === '' ? undefined : e.target.value)} />
                    </FormItem>
                    <FormItem label="预收导入情况">
                        <Select style={{ width: 150 }} defaultValue={this.state.searchParams.get('uploadStatus')} allowClear placeholder="请选择" onChange={(value) => this.searchParamsOnChange('uploadStatus', value)}>
                            <Option value={undefined}>全部</Option>
                            <Option value={0}>等待导入</Option>
                            <Option value={1}>导入完成</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="参保地">
                        <SelectCity params={this.selectCityParams()}> </SelectCity>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={() => this.search()}>搜索</Button>
                    </FormItem>
                </Form>
                <Table
                    bordered
                    loading={listFetching}
                    columns={this.columns(0)}
                    dataSource={dataSource.toJS()}
                    pagination={this.pagination()}
                />
            </div>
        )
    }
}

interface MyPopoverProps {
    ok?: (value) => Promise<any> | void;
    cancel?: () => void;
    value: string;
}
interface MyPopoverState {
    visible: boolean;
    loading: boolean;
}

class MyPopover extends Component<MyPopoverProps, MyPopoverState> {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
        }
    }
    input: Input | null;
    ok = async () => {
        const {
            ok,
        } = this.props;
        const value = this.input ? this.input.input.value : '';
        if (!value) {
            return message.error('请输入客户名称');
        }
        this.setState({
            loading: true,
        });
        if (typeof ok === 'function') {
            try {
                const result = await ok(value);
                this.setState({
                    visible: result !== true,
                    loading: false,
                })
            } catch (result) {
                this.setState({
                    visible: true,
                    loading: false,
                })
            }

        }

    }
    cancel = () => {
        this.setState({
            visible: false,
        })
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }
    render() {
        const {
            loading,
        } = this.state;
        return (
            <Popover
                placement="top"
                content={
                    <div>
                        <Input key={Date.now()} placeholder="请输入客户名称" defaultValue={this.props.value} ref={node => this.input = node} />
                        <div style={{ textAlign: 'right', marginTop: 5 }}>
                            <Button size="small" style={{ marginRight: 5 }} onClick={this.cancel}>取消</Button>
                            <Button size="small" type="primary" onClick={this.ok} loading={loading}>确定</Button>
                        </div>
                    </div>
                }
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                trigger="click">
                <a style={{ textDecoration: 'underline' }}>{this.props.value}</a>
            </Popover>
        )
    }
}


const mapStateToProps = (state: Any.Store): TStateProps => {
    const data = state.get('adjustBaseImportBillReducer');
    return {
        listFetching: data.get('listFetching'),
        dataSource: data.get('dataSource'),
        total: data.get('total'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}
const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdjustBaseImportBill);

