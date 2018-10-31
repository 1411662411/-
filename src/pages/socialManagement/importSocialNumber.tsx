import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Map, List } from 'immutable';
import { browserHistory } from 'react-router';
import {
    Button,
    Form,
    Card,
    Table,
    Input,
    Select,
    Modal,
    Checkbox,
    message,
} from "antd";
import {
    PAGINATION_PARAMS,
} from "../../global/global";
import UploadFile from '../../businessComponents/common/uploadFile';
import SelectCity from '../../components/select-city/index';
import { statePaginationConfig } from "../../util/pagination";
import {
    listGet,
} from '../../action/socialManagement/importSocialNumberAction';
import { fetchFn} from '../../util/fetch';
import { DOMAIN_OXT, ROUTER_PATH } from '../../global/global';
import getRegExpName from '../../util/regExp';
const confirm = Modal.confirm;


const FormItem = Form.Item;
const Option = Select.Option;

const actions = {
    listGet,
};

interface TStateProps {
    dataSource: List<Map<string, any>>;
    fetching: boolean;
    total: number;
    userInfo: Any.UserInfo;
}
type TDispatchProps = typeof actions;

type ImportSocialNumberProps = TStateProps & TDispatchProps;

interface ImportSocialNumberState {
    pageSize: number;
    currentPage: number;
    orderStatus: any;
    selectVal: number[];
}

const uploadUrl = `${DOMAIN_OXT}/api/social/usersocial/import/insured-number`;
const pollUrl = `${DOMAIN_OXT}/apiv2_/social/usersocial/download/url`;
const recordUrl = `${ROUTER_PATH}/newadmin/socialnumber/import/record`;

class ImportSocialNumber extends Component<ImportSocialNumberProps, ImportSocialNumberState> {
    nameOrId: Input | null;
    cName: Input | null;
    checkbox: any;
    idCardTest = getRegExpName('idcard');
    constructor(props) {
        super(props);
        this.state = {
            ...PAGINATION_PARAMS,
            orderStatus: '130',
            selectVal: [],
        };
        this.search();
    }
    search = () => {
        this.props.listGet(this.searchParams())
    }
    searchParams() {
        const {
            currentPage,
            pageSize,
            selectVal,
        } = this.state;
        const params:any = {
            currentPage,
            pageSize,
            policyId: selectVal[2],
            name: this.nameOrId ?  this.nameOrId.input.value : ''
        }
        return params;
    }
    columns = () => [
        {
            title: '序号',
            key: 'index',
            render: (text, record, index) => {
                return  index + 1;
            },
            width: 100,
        },
        {
            title: '员工名称',
            dataIndex: 'userSocialName',
            key: 'userSocialName',
            width: 150,
        },
        {
            title: '证件号码',
            dataIndex: 'certificateNumber',
            key: 'certificateNumber',
            width: 200,
        },
        {
            title: '参保地',
            dataIndex: 'cityName',
            key: 'cityName',
            width: 200,
        },
        {
            title: '社保编号',
            dataIndex: 'socialNumber',
            key: 'socialNumber',
            width: 350,
        },
        {
            title: '公积金编号',
            dataIndex: 'fundNumber',
            key: 'fundNumber',
            width: 150,
        },
    ]
    selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
        
        return {
            deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            addressApi:`${DOMAIN_OXT}/apiv2_/social/usersocial/insured-number/extend-policy`,
            transform:true,
            // address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 200,
            }, /* input 的样式 */
            onChange:(selectVal, selectName, code)=> { /* 每层选择的回调，除了， 除了最后一层调用onChange */
                this.setState({
                    selectVal,
                })
            },

            
        }
    }
    ImportSocialNumberConfirm = (e: React.MouseEvent<HTMLAnchorElement>, params: {contractId:string, cName:string}) => {
        e.preventDefault();
        confirm({
            title: `公司名称：${params.cName}`,
            content: <Checkbox ref={node => this.checkbox = node}><span style={{color: '#f60'}}>我确认：款已打出，退费已完成</span></Checkbox>,
            onOk: () => {
                return new Promise(async (reslove, reject) => {
                    if(!this.checkbox || this.checkbox.rcCheckbox.state.checked === false) {
                        message.error('请确认已完成退费');
                        return reject();
                    }
                    const data = await fetchFn(`${DOMAIN_OXT}/apiv2_/order/member-order/confirm/ImportSocialNumber`, {
                        contractId: params.contractId,
                        userName: this.props.userInfo.userName,
                    }).then(data => data as any);
                    if (data.status === 0) {
                        reslove();
                        message.success('退费完成');
                        this.search();
                    }
                    else {
                        reject();
                    }
                })
            },
        });
    }
    pagination = () => {
        const {
            pageSize,
            currentPage,
        } = this.state;
        const {
            total
        } = this.props;

        return statePaginationConfig(
            {
                pageSize,
                currentPage,
                total,
            },
            (newParams) => this.props.listGet({ ...this.searchParams(), ...newParams, }),
            null,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize,
                })
            }
        )
    }
    render() {
        const {
            fetching,
            dataSource,
        } = this.props;
        return (
            <div>
                <UploadFile
                    uploadUrl={uploadUrl}
                    pollData={{
                        topic: 2,
                        userId: this.props.userInfo.userId,
                        userName: this.props.userInfo.userName,
                    }}
                    accept={['.xls', '.xlsx']}
                    uploadData={{
                        userId: this.props.userInfo.userId,
                        userName: this.props.userInfo.userName,
                        type: 1,
                    }}
                    success={() => this.search()}
                    pollUrl={pollUrl}>
                    <Button icon="cloud-upload-o"  type="primary">
                        导入社保/公积金编号
                    </Button>
                </UploadFile>
                <a href="http://img.joyowo.com/joyo_templates/社保-公积金编号.xlsx" target="_blank" style={{marginLeft: 10, textDecoration: 'underline'}}>下载导入模板</a>
                <Form layout="inline" style={{marginTop: 35}}>
                    <FormItem label="员工姓名/证件号码">
                        <Input  ref={node => this.nameOrId = node} />
                    </FormItem>
                    <FormItem label="参保地">
                    <SelectCity params={this.selectCityParams()}> </SelectCity>
                    </FormItem>
                    <FormItem style={{ marginLeft: 100 }}>
                        <Button type="primary" loading={fetching} onClick={this.search}>搜索</Button>
                    </FormItem>
                </Form>
                <div style={{textAlign: 'right'}}>
                    <a href={recordUrl} target="_blank">查看导入记录</a>
                </div>
                <Table
                    style={{marginTop: 20}}
                    dataSource={dataSource.toJS()}
                    pagination={this.pagination()}
                    columns={this.columns()}
                    loading={fetching}
                    scroll={{x: 1150, y: window.innerHeight * 0.6}}
                />
            </div>

        )
    }
}

const mapStateToProps = (state: Any.Store): TStateProps => {
    const data = state.get('importSocialNumberReducer');
    return {
        dataSource: data.get('dataSource'),
        fetching: data.get('fetching'),
        total: data.get('total'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => bindActionCreators(actions, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(ImportSocialNumber);