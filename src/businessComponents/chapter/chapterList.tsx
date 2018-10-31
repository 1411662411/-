import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Table,
    Form,
    Input,
    Select,
    Button,
    Icon,
    Modal,
    message,
    Tooltip,
    DatePicker,
} from 'antd';
import {
    Link,
} from 'react-router';
import * as R from 'ramda'
import * as actions from '../../action/businessComponents/chapterListActions';
import {
    PAGINATION_PARAMS,
    DOMAIN_OXT,
    ROUTER_PATH,
} from '../../global/global';
import { Map, List, fromJS } from 'immutable';
import { fetchFn } from '../../util/fetch';
import RightMenu from '../../components/right-menu/index'
import './chapterList.less';
import {
    statePaginationConfig,
} from '../../util/pagination';
import moment from 'moment';
import ChapterInfoEnter from '../../businessComponents/chapter/chapterInfoEnter';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea

const actionCreators = {
    chapterListGet: actions.chapterListGet,
    chapterListSet: actions.chapterListSet,
    personSourceGet: actions.personSourceGet,
    compareDataSourceSet: actions.compareDataSourceSet,
    transfer: actions.transfer,
    chapterInfoEnterSave: actions.chapterInfoEnterSave,
}

/**
 * 登记模式
 */
const registerTypeMap = {
    1: '传统章证',
    2: '三证合一',
    3: '五证合一',
    4: '多证合一',
}
/**
 * 验证必选规则
 */
const requireRule = {
    1: [11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 31, 32, 33, 41, 42, 51, 52],
    2: [11, 14, 15, 21, 22, 23, 24, 25, 26, 31, 32, 33, 41, 42, 51, 52],
    3: [11, 21, 22, 23, 24, 25, 26, 31, 32, 33, 41, 42, 51, 52],
    4: [11, 21, 22, 23, 24, 25, 26, 31, 32, 33, 41, 42, 51, 52]
}

/**
 * datePicker 类型
 */
const datePickerRule = [41, 42, 51, 52]

interface RegisterTypeInteface {
    (props: {
        value?: number;
        onChange?: (e) => void;
        edit?: boolean;
    }
    ): JSX.Element;
}
const RegisterType: RegisterTypeInteface = ({ value, onChange, edit, }) => {
    /**
     * 只读
     */
    if (!edit) {
        for (let key in registerTypeMap) {
            if (Number(key) === value) {
                return <span>{registerTypeMap[key]}</span>
            }
        }
        return <span></span>;
    }

    /**
     * 编辑
     */
    const arr: JSX.Element[] = [];
    for (let key in registerTypeMap) {
        arr.push(<Option value={Number(key)}>{registerTypeMap[key]}</Option>);
    }
    let props: any = {
        placeholder: "请选择",
        style: { width: 112 },
    };
    if (value) {
        props.defaultValue = value;
    }
    if (onChange && typeof onChange === 'function') {
        props.onChange = onChange;
    }
    return <Select {...props}>{arr}</Select>

}


interface SelectPersonInterface {
    (
        props: {
            disabled?: boolean
            source: List<Map<any, any>>;
            onSelect?: (e, option) => void;
            value?: {
                operatorId: number | string;
                operatorInfo?: string;
            };
            edit?: boolean;
            allowClear?: boolean
        }
    ): JSX.Element;
}
/**
 * 保管人
 */
const SelectPerson: SelectPersonInterface = ({ source, value, edit, onSelect, disabled = false, allowClear = false }) => {
    if (!edit && value) {
        return <span>{value.operatorInfo || '/'}</span>
    }
    let props: any = {
        key: value && value.operatorId,
        style: { width: 182 },
        placeholder: '请填写',
        showSearch: true,
        disabled,
        allowClear,
        getPopupContainer: trigger => document.querySelector('.chapterTable'),
        onPopupScroll: e => {
            e.stopPropagation()
        },
        filterOption: (inputValue: string, option) => {
            if (inputValue && inputValue.length < 2) {
                return true
            }
            // const child = option.props.children as string
            const employeeNumber = option.props['data-employeeNumber'] as string
            const name = option.props['data-name']
            const organizationName = option.props['data-organizationName'] || ''
            return name.indexOf(inputValue) > -1 || employeeNumber.indexOf(inputValue) > -1 || organizationName.indexOf(inputValue) > -1
        },
    };
    if (onSelect && typeof onSelect === 'function') {
        props.onSelect = onSelect;
    }
    if (value) {
        props.defaultValue = value.operatorId || undefined;
    }
    return (
        <Select {...props} >
            {
                source.toJS().map((value, index) => 
                    <Option 
                        value={value.id} 
                        data-name-info={value.userInfo} 
                        data-name={value.name} 
                        data-phone={value.phone}
                        data-employeeNumber={value.employeeNumber}
                        data-organizationName={value.organizationName}
                    >
                        {value.userInfo}
                    </Option>)
            }
        </Select>
    )
}

interface OperatorInfo {
    operatorId: number | string;
    operatorInfo: string;
    exist: boolean;
    phone: number | string;
    openTime: string;
    record: string;
}



/**
 * 获取对应列的数据
 */
const getOperatorInfo = (data: Partial<OperatorInfo> = {}): OperatorInfo => {
    const {
        operatorId = '',
        operatorInfo = '',
        exist = false,
        phone = '',
        openTime = '',
        record = ''
    } = data;
    return {
        exist,
        operatorId,
        operatorInfo,
        phone,
        openTime,
        record
    }
}

/**
 * 编辑时候的缓存数据
 */
let cacheEditData: {
    [key: string]: Map<any, any>
} = {};

interface TStateProps {
    dataSource: List<Map<any, any>>;
    personSource: List<Map<any, any>>;
    compareDataSource: List<Map<any, any>>;
    fetching: boolean;
    total: number;
}
interface TOwnProps {
    /** 
     * 角色控制 1：管理员， 2 录入人员
     */
    role: 1 | 2;
}
type TDispatchProps = typeof actionCreators;
type ChapterListProps = TStateProps & TDispatchProps & TOwnProps;

interface ChapterListState {
    show: boolean;
    showTransfer: boolean;
    pageSize: number;
    currentPage: number;
    enterShow: boolean;
    type?: any;
    operator?: string;
    registryStateWordCount?: boolean
}

class ChapterList extends React.Component<ChapterListProps, ChapterListState> {
    constructor(props) {
        super(props);
        this.props.chapterListGet({ ...PAGINATION_PARAMS, role: this.props.role });
        this.props.personSourceGet({});
        this.state = {
            enterShow: false,
            show: true,
            showTransfer: false,
            ...PAGINATION_PARAMS,
            registryStateWordCount: false
        }
    }
    disabledOnlyOneEdit = false;
    addIng = false;
    transferData: any = {};
    companyName: string;


    /**
     * 公共columns
     */
    columns: any[] = [
        {
            title: '登记模式',
            key: 'mode',
            render: (text, record, index) => {
                if (record.edit && (this.props.role === 1 || record.id.toString().length === 13)) {
                    return <RegisterType key={record.id} value={record.type} edit={true} onChange={value => this.editChange([{ key: ['type'], value, }], record.id, index)} />
                }
                return <RegisterType key={record.id} value={record.type} />

            },
            width: 130,
        },
        {
            title: '工商相关证照情况',
            key: 'industry-business',
            children: [
                {
                    title: '营业执照',
                    key: 'business-licence',
                    children: [
                        {
                            title: '有无',
                            key: 'business-licence-has',
                            className: 'td-11-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['11']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '11', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'business-licence-person',
                            className: 'td-11-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['11']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '11', 'operatorId',], value, }, { key: ['csMap', '11', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '11', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {

                    title: '组织机构代码证',
                    key: 'business-code',
                    children: [
                        {
                            title: '有无',
                            key: 'business-code-has',
                            className: 'td-12-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['12']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.type !== 1) {
                                    return <span className="no-fill">-</span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '12', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'business-code-person',
                            className: 'td-12-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['12']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.type !== 1) {
                                    return <span className="no-fill">-</span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '12', 'operatorId',], value, }, { key: ['csMap', '12', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '12', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '税务登记证',
                    key: 'tax-licence',
                    children: [
                        {
                            title: '有无',
                            key: 'tax-licence-has',
                            className: 'td-13-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['13']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.type !== 1) {
                                    return <span className="no-fill">-</span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '13', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'tax-licence-person',
                            className: 'td-13-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['13']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.type !== 1) {
                                    return <span className="no-fill">-</span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '13', 'operatorId',], value, }, { key: ['csMap', '13', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '13', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '社会保险登记证',
                    key: 'social-licence',
                    children: [
                        {
                            title: '有无',
                            key: 'social-licence-has',
                            className: 'td-14-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['14']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.type === 3 || record.type === 4) {
                                    return <span className="no-fill">-</span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '14', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'social-licence-person',
                            className: 'td-14-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['14']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.type === 3 || record.type === 4) {
                                    return <span className="no-fill">-</span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '14', 'operatorId',], value, }, { key: ['csMap', '14', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '14', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '统计登记证',
                    key: 'counter-licence',
                    children: [
                        {
                            title: '有无',
                            key: 'counter-licence-has',
                            className: 'td-15-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['15']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.type === 3 || record.type === 4) {
                                    return <span className="no-fill">-</span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '15', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'counter-licence-person',
                            className: 'td-15-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['15']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.type === 3 || record.type === 4) {
                                    return <span className="no-fill">-</span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '15', 'operatorId',], value, }, { key: ['csMap', '15', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '15', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
            ]
        },
        {
            title: '印章情况',
            key: 'business',
            children: [
                {
                    title: '公章',
                    key: 'official-stamp',
                    children: [
                        {
                            title: '有无',
                            key: 'official-stamp-has',
                            className: 'td-21-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['21']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '21', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'official-stamp-person',
                            className: 'td-21-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['21']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '21', 'operatorId',], value, }, { key: ['csMap', '21', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '21', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '法人章',
                    key: 'person-stamp',
                    children: [
                        {
                            title: '有无',
                            key: 'person-stamp-has',
                            className: 'td-22-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['22']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type !== 3) {
                                //     return <span className="no-fill">-</span>
                                // }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '22', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'person-stamp-person',
                            className: 'td-22-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['22']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type !== 3) {
                                //     return <span className="no-fill">-</span>
                                // }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '22', 'operatorId',], value, }, { key: ['csMap', '22', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '22', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '财务章',
                    key: 'financial-licence',
                    children: [
                        {
                            title: '有无',
                            key: 'financial-licence-has',
                            className: 'td-23-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['23']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type === 2) {
                                //     return <span className="no-fill">-</span>
                                // }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '23', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'financial-licence-person',
                            className: 'td-23-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['23']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type === 2) {
                                //     return <span className="no-fill">-</span>
                                // }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '23', 'operatorId',], value, }, { key: ['csMap', '23', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '23', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '合同章',
                    key: 'contract-stamp',
                    children: [
                        {
                            title: '有无',
                            key: 'contract-stamp-has',
                            className: 'td-24-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['24']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type !== 3) {
                                //     return <span className="no-fill">-</span>
                                // }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '24', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'contract-stamp-person',
                            className: 'td-24-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['24']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type !== 3) {
                                //     return <span className="no-fill">-</span>
                                // }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '24', 'operatorId',], value, }, { key: ['csMap', '24', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '24', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '发票章',
                    key: 'invoice-stamp',
                    children: [
                        {
                            title: '有无',
                            key: 'invoice-stamp-has',
                            className: 'td-25-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['25']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type !== 3) {
                                //     return <span className="no-fill">-</span>
                                // }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '25', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'invoice-stamp-person',
                            className: 'td-25-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['25']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type !== 3) {
                                //     return <span className="no-fill">-</span>
                                // }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '25', 'operatorId',], value, }, { key: ['csMap', '25', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '25', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '人事行政章',
                    key: 'hr-stamp',
                    children: [
                        {
                            title: '有无',
                            key: 'hr-stamp-has',
                            className: 'td-26-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['26']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type === 1) {
                                //     return <span className="no-fill">-</span>
                                // }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '26', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'hr-stamp-person',
                            className: 'td-26-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['26']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                // if (record.type === 1) {
                                //     return <span className="no-fill">-</span>
                                // }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '26', 'operatorId',], value, }, { key: ['csMap', '26', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '26', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
            ]
        },
        {
            title: '业务相关证照情况',
            key: 'business',
            children: [
                {
                    title: '人力资源服务许可证',
                    key: 'hr-service',
                    children: [
                        {
                            title: '有无',
                            key: 'hr-service-has',
                            className: 'td-31-a',
                            width: 50,
                            render: (text, record, index) => {
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['31']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '31', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'hr-service-person',
                            className: 'td-31-b',
                            width: 200,
                            render: (text, record, index) => {
                                const {
                                    operatorId,
                                    operatorInfo,
                                    phone,
                                    exist,
                                } = getOperatorInfo(record.csMap['31']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([{ key: ['csMap', '31', 'operatorId',], value, }, { key: ['csMap', '31', 'operatorInfo',], value: option.props['data-name-info'] }, { key: ['csMap', '31', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                },
                {
                    title: '劳务派遣许可证',
                    key: 'work-dispatch',
                    children: [
                        {
                            title: '有无',
                            key: 'work-dispatch-has',
                            className: 'td-32-a',
                            width: 50,
                            render: (text, record, index) => {
                                const { exist } = getOperatorInfo(record.csMap['32']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole(
                                        [
                                            { key: ['csMap', '32', 'exist'], value: !exist }
                                        ], 
                                        record.id, 
                                        index) 
                                    }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'work-dispatch-person',
                            className: 'td-32-b',
                            width: 200,
                            render: (text, record, index) => {
                                const { operatorId, operatorInfo, phone, exist, record: stateRecord } = getOperatorInfo(record.csMap['32'])
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist || !!stateRecord}
                                        edit={true}
                                        key={record.id}
                                        allowClear={record.id.toString().length === 13}
                                        onSelect={(value, option) => this.editChange(
                                            [
                                                { key: ['csMap', '32', 'operatorId' ], value }, 
                                                { key: ['csMap', '32', 'operatorInfo' ], value: option.props['data-name-info'] }, 
                                                { key: ['csMap', '32', 'phone'], value: option.props['data-phone'] }
                                            ], 
                                            record.id, 
                                            index
                                        )}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        },
                        {
                            title: '备案情况',
                            key: 'work-dispatch-state',
                            className: 'td-32-c',
                            width: 200,
                            render: (text, record, index) => {
                                const { operatorId, operatorInfo, phone, exist, record: stateRecord } = getOperatorInfo(record.csMap['32']);
                                const { registryStateWordCount } = this.state
                                // console.log('stateRecord', stateRecord)
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.edit) {
                                    // <Form.Item 
                                    //     className='registry-state-form-item' 
                                    //     help={registryStateWordCount ? '备案情况最长为100个字' : undefined}
                                    //     validateStatus={registryStateWordCount ? 'error' : undefined}>
                                    // </Form.Item>
                                    return <TextArea
                                                value={stateRecord}
                                                disabled={!exist || !!operatorId} 
                                                autosize={{ minRows: 1, maxRows: 2 }} 
                                                placeholder='请填写'
                                                onBlur={() => {
                                                    if (registryStateWordCount)
                                                        message.error('备案情况最长为100个字')
                                                }}
                                                onChange={(e) => {
                                                    this.setState({ registryStateWordCount: e.target.value.length > 100 })
                                                    this.editChange(
                                                        [
                                                            { key: ['csMap', '32', 'record'], value: e.target.value }
                                                        ],
                                                        record.id, 
                                                        index
                                                    )
                                            }}/>
                                }
                                return <Tooltip title={<span style={{wordBreak: 'break-all'}}>{stateRecord || '无'}</span>}>  
                                        <div className='ellipsis'>{stateRecord || '/'}</div>
                                    </Tooltip>
                            }
                        }
                    ]
                },
                {
                    title: '开户许可证',
                    key: 'hr-service',
                    children: [
                        {
                            title: '有无',
                            key: 'open-license',
                            className: 'td-33-a',
                            width: 50,
                            render: (text, record, index) => {
                                const { exist } = getOperatorInfo(record.csMap['33']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '33', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '保管人',
                            key: 'open-license-person',
                            className: 'td-33-b',
                            width: 200,
                            render: (text, record, index) => {
                                const { operatorId, operatorInfo, phone, exist } = getOperatorInfo(record.csMap['33']);
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                if (record.edit) {
                                    return <SelectPerson
                                        source={this.props.personSource}
                                        disabled={!exist}
                                        edit={true}
                                        key={record.id}
                                        onSelect={(value, option) => this.editChange([
                                            { key: ['csMap', '33', 'operatorId'], value, }, 
                                            { key: ['csMap', '33', 'operatorInfo'], value: option.props['data-name-info'] }, 
                                            { key: ['csMap', '33', 'phone'], value: option.props['data-phone'] }], record.id, index)}
                                        value={{ operatorId, operatorInfo }}
                                    />
                                }
                                // return <Tooltip title={<span>手机号: {phone ? phone : '/'}</span>}>  <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} /></Tooltip>
                                return <SelectPerson source={this.props.personSource} value={{ operatorId, operatorInfo }} key={record.id} />
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: '银行账户情况',
            key: 'bank',
            children: [
                {
                    title: '银行基本户',
                    key: 'bank-base-account',
                    children: [
                        {
                            title: '有无',
                            key: 'bank-base-account-has',
                            width: 50,
                            render: (text, record, index) => {
                                // if (record.type === undefined) {
                                //     return null;
                                // }
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['41']);
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '41', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '开办时间',
                            key: 'bank-base-account-time',
                            width: 200,
                            render: (text, record, index) => {
                                // if (record.type === undefined) {
                                //     return null;
                                // };
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                const {
                                    openTime,
                                    exist,
                                } = getOperatorInfo(record.csMap['41']);
                                if (record.edit) {
                                    return <DatePicker {...this.datePickerProps({ path: ['csMap', '41', 'openTime'], exist, openTime, id: record.id, index }) } />
                                }
                                return openTime || '/';
                            }
                        }
                    ]
                },
                {
                    title: '银行一般户',
                    key: 'bank-ordinary-account',
                    children: [
                        {
                            title: '有无',
                            key: 'bank-ordinary-account-has',
                            width: 50,
                            render: (text, record, index) => {
                                // if (record.type === undefined) {
                                //     return null;
                                // }
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['42']);
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '42', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '开办时间',
                            key: 'bank-ordinary-account-time',
                            width: 200,
                            render: (text, record, index) => {
                                // if (record.type === undefined) {
                                //     return null;
                                // };
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                const {
                                    openTime,
                                    exist,
                                } = getOperatorInfo(record.csMap['42']);
                                if (record.edit) {
                                    return <DatePicker {...this.datePickerProps({ path: ['csMap', '42', 'openTime'], exist, openTime, id: record.id, index }) } />
                                }
                                return openTime || '/';
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: '五险一金开户情况',
            key: 'socialfund',
            children: [
                {
                    title: '社保户',
                    key: 'social',
                    children: [
                        {
                            title: '有无',
                            key: 'social-has',
                            width: 50,
                            render: (text, record, index) => {
                                // if (record.type === undefined) {
                                //     return null;
                                // }
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['51']);
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '51', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '开办时间',
                            key: 'social-time',
                            width: 200,
                            render: (text, record, index) => {
                                // if (record.type === undefined) {
                                //     return null;
                                // };
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                const {
                                    openTime,
                                    exist,
                                } = getOperatorInfo(record.csMap['51']);
                                if (record.edit) {
                                    return <DatePicker {...this.datePickerProps({ path: ['csMap', '51', 'openTime'], exist, openTime, id: record.id, index }) } />
                                }
                                return openTime || '/';
                            }
                        }
                    ]
                },
                {
                    title: '公积金户',
                    key: 'fund',
                    children: [
                        {
                            title: '有无',
                            key: 'fund-has',
                            width: 50,
                            render: (text, record, index) => {
                                // if (record.type === undefined) {
                                //     return null;
                                // }
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                const {
                                    exist,
                                } = getOperatorInfo(record.csMap['52']);
                                return <Icon
                                    key={record.id}
                                    type="check-circle"
                                    className={exist ? "check-person" : "uncheck-person"}
                                    onClick={() => { this.checkedByRole([{ key: ['csMap', '52', 'exist',], value: !exist, }], record.id, index) }}
                                />
                            }
                        },
                        {
                            title: '开办时间',
                            key: 'fund-time',
                            width: 200,
                            render: (text, record, index) => {
                                // if (record.type === undefined) {
                                //     return null;
                                // };
                                if (!record.type) {
                                    return <span className="no-fill"></span>
                                }
                                const {
                                    openTime,
                                    exist,
                                } = getOperatorInfo(record.csMap['52']);
                                if (record.edit) {
                                    return <DatePicker {...this.datePickerProps({ path: ['csMap', '52', 'openTime'], exist, openTime, id: record.id, index }) } />
                                }
                                return openTime || '/';
                            }
                        }
                    ]
                }
            ]
        }
    ]
    /**
     * 1：管理员
     */
    columns1: any[] = [
        {
            title: '操作',
            index: 'handle',
            fixed: 'left',
            width: 100,
            render: (text, record, index) => {
                if (record.edit) {
                    return (
                        <div>
                            <a href="" onClick={e => { e.preventDefault(); this.save(index, record.id) }}> 保存 </a>
                            <a href="" onClick={(e) => { e.preventDefault(); this.cancel(record, index) }}> 取消 </a>
                        </div>
                    )

                }
                return <a href="" onClick={e => { e.preventDefault(); this.edit([{ key: ['edit'], value: true, }], record.id, index) }}>编辑</a>;
            }
        },
        {
            title: '公司名称',
            key: 'commpany',
            fixed: 'left',
            render: (text, record, index) => {
                if (record.edit && (this.props.role === 1 || record.id.toString().length === 13)) {
                    return (
                        <div>
                            <Input key={record.id} value={record.companyName} style={{ wdith: 260 }} onChange={e => this.editChange([{
                                key: ['companyName'],
                                value: e.target.value,
                            }], record.id, index)} placeholder="请填写公司名称" onBlur={(e: any) => this.companyNameCheck(e.target.value, false)} />
                            {record.fitAll && <span className="check-wrapper">
                                <span className="triangle"></span>
                                <Icon type="check" className="check" />
                            </span>}
                        </div>


                    )

                }
                return (
                    <div className="company-name">
                        <Link to={`${ROUTER_PATH}/newadmin/chapter/info?id=${record.id}`} >{record.companyName}</Link>
                        {record.fitAll && <span className="check-wrapper">
                            <span className="triangle"></span>
                            <Icon type="check" className="check" />
                        </span>}
                    </div>
                )
            },
            width: 190,
        },
        {
            title: <span>开办人/录入人<br />（右键转移开办人）</span>,
            key: 'creator-person',
            width: 200,
            render: (text, record, index) => {
                const {
                    creatorId,
                    creatorInfo,
                } = record;
                const menu = [
                    {
                        name: '仅转移该条',
                    },
                    {
                        name: '转移全部此开办人',
                    }
                ]
                const style = {
                    // position: 'absolute',
                    // width: 200,
                    // height: 50,
                    // left: -1,
                    // top: -25,
                    // 'line-height': '50px',
                } as any;

                return <RightMenu menu={menu} data={record} onSelect={this.setTransfer}>
                    <div style={{ position: 'relative' }}>
                        <span className='ellipsis' style={style}>{creatorInfo}</span>
                    </div>
                </RightMenu>
            }
        }
    ].concat(this.columns)
    /**
     * 2：录入人员
     */
    columns2: any[] = [
        {
            title: '操作',
            index: 'handle',
            fixed: 'left',
            width: 100,
            render: (text, record, index) => {
                let enter: null | JSX.Element = null;
                if (record.id.toString().length !== 13) {
                    enter = <a href="" onClick={(e) => { e.preventDefault(); this.enter(record) }}> 录入 </a>;
                }
                if (record.edit) {
                    return (
                        <div>
                            <a href="" onClick={e => { e.preventDefault(); this.save(index, record.id) }}> 保存 </a>
                            <a href="" onClick={(e) => { e.preventDefault(); this.cancel(record, index) }}> 取消 </a>
                        </div>
                    )
                }
                return (
                    <div>
                        <a href="" onClick={e => { e.preventDefault(); this.edit([{ key: ['edit'], value: true, }], record.id, index) }}>编辑</a>
                        {enter}
                    </div>
                );
            }
        },
        {
            title: '公司名称',
            key: 'commpany',
            fixed: 'left',
            render: (text, record, index) => {
                if (record.edit && (this.props.role === 1 || record.id.toString().length === 13)) {
                    return (
                        <div>
                            <Input key={record.id} value={record.companyName} style={{ wdith: 260 }} onChange={e => this.editChange([{
                                key: ['companyName'],
                                value: e.target.value,
                            }], record.id, index)} placeholder="请填写公司名称" onBlur={(e: any) => this.companyNameCheck(e.target.value, false)} />
                            {record.fitAll && <span className="check-wrapper">
                                <span className="triangle"></span>
                                <Icon type="check" className="check" />
                            </span>}
                        </div>

                    )
                }
                return (
                    <div className="company-name">
                        <Link to={`${ROUTER_PATH}/newadmin/chapter/info?id=${record.id}`} >{record.companyName}</Link>
                        {record.fitAll && <span className="check-wrapper">
                            <span className="triangle"></span>
                            <Icon type="check" className="check" />
                        </span>}
                    </div>
                )
            },
            width: 190,
        }
    ].concat(this.columns)

    // 切换保管人显示/隐藏
    toggleKeeperShow = (role: 1 | 2 , isShow: boolean) => {
        if (!isShow) {
            let c = R.clone(this[`columns${role}`])
                // .filter((child) => R.prop('key', child) === 'industry-business' || R.prop('key', child) === 'business')
                .map(item => {
                    if (item.children && !(R.prop('key', item) === 'bank' || R.prop('key', item) === 'socialfund')) {
                        item.children = item.children.map(arr => {
                            let keeper = -1
                            if (arr.children) {
                                arr.children.forEach((item, i)=> {
                                    if (R.prop('title', item) === '保管人') {
                                        keeper = i
                                    }
                                    if (R.prop('title', item) === '有无') {
                                        item.width = 150
                                    }
                                })
                                keeper > -1 && arr.children.splice(keeper)
                            }
                            return arr
                        })
                    }
                    return item
                })
            return c
        }
        return this[`columns${role}`]
    }

    datePickerProps = (params) => {
        const {
            exist,
            openTime,
            index,
            id,
            path,
        } = params;

        let props = {
            format: 'YYYY/MM/DD',
            onChange: (date, dateString) => {
                this.editChange([{ key: path, value: dateString }], id, index)
            }

        } as any;
        if (exist && openTime) {
            props.defaultValue = moment(openTime)
        }
        if (!exist) {
            props.disabled = true;
        }
        return props;
    }
    changeTdBg() {
        const nofill = document.querySelectorAll('.no-fill') as any;
        nofill.forEach(node => { node.parentNode.className = 'td-gray' })
    }
    cancel = (data, index) => {
        this.setState({ registryStateWordCount: false })
        this.disabledOnlyOneEdit = false;
        const {
            dataSource,
            compareDataSource,
            chapterListSet,
        } = this.props;
        /**
         * 如果新增状态，并且是第一条
         */
        if (this.addIng && index === 0) {
            this.addIng = false;
        }
        if (data.id.toString().length === 13) {
            chapterListSet(dataSource.shift());
        }
        else {
            chapterListSet(dataSource.update(index, () => compareDataSource.get(index)))
        }
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
            (newParams) => this.props.chapterListGet({ ...this.searchParams(), ...newParams}),
            null,
            (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize
                });
            }
        )
    }
    setTransfer = (selectInfo, data) => {
        const { key } = selectInfo;
        const index = Number(key);
        if (index === 0) {
            this.transferData = {
                ids: [data.id],
                creatorInfo: data.creatorInfo,
                companyName: data.companyName,
                type: 1,
                id: data.id,
            }
        }
        else {
            // let ids: number[] = [];
            // this.props.dataSource.toJS().map(({ creatorId, id }) => {
            //     if (creatorId === data.creatorId) {
            //         ids.push(id);
            //     }
            // });
            this.transferData = {
                //ids,
                creatorId: data.creatorId,
                creatorInfo: data.creatorInfo,
                type: 2,
                id: data.id,
            }
        }
        this.setState({
            showTransfer: true,
        });
    }
    transferOk = () => {
        const {
            transferId,
            ids,
            creatorId,
            transferInfo,
        } = this.transferData;
        const {
            role,
        } = this.props;
        const {
            currentPage,
            pageSize,
        } = this.state;
        if (transferId === undefined) {
            message.error('请输入新负责人');
            return;
        }
        this.props.transfer({ info: JSON.stringify({ transferId, ids, creatorId, transferInfo }), ...this.searchParams() }, () => this.setState({
            showTransfer: false,
        }));
    }
    edit = (values: { key: (string | number)[], value: any }[], id: number, index: number) => {
        
        if (this.disabledOnlyOneEdit) {
            message.warn('请保存当前编辑内容');
            return;
        };
        this.disabledOnlyOneEdit = true;
        this.editChange(values, id, index);
    }
    checkFitAll = (data: Map<any, any>, index: number) => {
        const rule = requireRule[data.get('type')]
        if (rule === undefined) return data;
        const csMap = data.get('csMap');

        let fitAll = true;

        // 遍历所有证照
        for (let value of rule) {
            value = value.toString();
            const exist = csMap.getIn([value, 'exist']);
            const operatorId = csMap.getIn([value, 'operatorId']);
            if (!exist || !operatorId) {
                fitAll = false;
                break;
            }
        }

        return data.update('fitAll', () => fitAll);
    }
    editChange = (values: { key: (string | number)[], value: any }[], id: number, index: number) => {
        
        const {
            chapterListSet,
            dataSource,
        } = this.props;

        let newData = this.props.dataSource.get(index);
        if (values.length > 0) {
            values.map(({ key, value }) => {
                newData = newData.updateIn(key, () => value);
            })
            /**
             * 检查下是否全部填写
             */
            newData = this.checkFitAll(newData, index);

            chapterListSet(dataSource.update(index, () => newData));
        }
    }
    updateCompareDataSource = (data, method: 'unshift' | 'update', index?: number) => {
        const {
            compareDataSourceSet,
            compareDataSource,
        } = this.props;
        if (method === 'unshift') {
            return compareDataSourceSet(compareDataSource.unshift(fromJS(data)));
        }
        if (index !== undefined && method === 'update') {
            compareDataSourceSet(compareDataSource.update(index, () => fromJS(data)));
        }

    }
    checkedByRole = (values: any[], id, index) => {
        
        const {
            role,
            compareDataSource,
            dataSource,
        } = this.props;

        // 不是编辑状态 check按钮不作处理
        // 编辑状态(非新增) checked不允许unchecked操作
        if ((id.toString().length !== 13 /* 临时新增数据 */ && compareDataSource.get(index).getIn(values[0].key) === true /* 原值为 ture */ && role !== 1) || !dataSource.getIn([index, 'edit']) /* 不是编辑状态 */) {
            return;
        }

        /**
         * 勾选取消清空数据
         */
        if (values[0].value === false) {
            const path: any[] = values[0].key.slice(0, 2);
            const type = path[0];

            /**
             * 区别不同类型
             */
            if (type === 'csMap') {
                values = values.concat(
                    { key: [...path, 'operatorId'], value: '' }, 
                    { key: [...path, 'operatorInfo'], value: '' }, 
                    { key: [...path, 'phone'], value: '' }, 
                    { key: [...path, 'record'], value: '' }
                )
            } else if (type == 'bankSocialMap') {
                values = values.concat({ key: [...path, 'openTime'], value: '' })
            }
        }

        this.editChange(values, id, index);
    }
    checkRquire = (data) => {
        if (data.companyName === undefined || data.companyName.trim() === '') {
            message.error('公司名称以及登记模式为必填项');
            return false;
        }

        if (data.type === undefined) {
            message.error('公司名称以及登记模式为必填项');
            return false;
        }

        /**
         * 验证章和保管人一一对应
         */
        const rule = requireRule[data.type]
        if (rule === undefined) return true;
        for (let value of rule) {
            value = value.toString();
            const csMap = data.csMap[value] || {};
            if (!csMap.exist) {
                continue;
            }
            else if (!(csMap.operatorId || csMap.record) && !datePickerRule.includes(Number(value))) {
                message.error('请填写保管人');
                return false;
            }
            else if (!csMap.openTime && datePickerRule.includes(Number(value))) {
                message.error('请选择开办时间');
                return false;
            }
        }
        return true;
    }
    /**
     * 对比数据用于判断是否弹窗
     * @param {Object} 新数据 newData
     * @param {Object} 旧数据 oldData
     * @param {Boolean} 是否只是判断不同 diff
     */
    compareData = (newData, oldData, diff = false): boolean => {
        let flag = true;
        if (newData.id.toString().length === 13) {
            return false;
        }



        const rule = requireRule[newData.type]
        if (rule === undefined) return true;

        /**
         * 类型不同的对比
         */
        if (newData.type !== oldData.type) {
            const oldRule = requireRule[oldData.type];
            /**
             * 取差集
             */
            const diffRule = oldRule.filter((i) => { return rule.indexOf(i) < 0; });
            for (let value of diffRule) {
                value = value.toString();
                const oldCsMap = oldData.csMap[value] || {};
                if (oldCsMap && oldCsMap.exist === true) {
                    flag = false;
                    break;
                }
            }
        }
        else {
            for (let value of rule) {
                value = value.toString();
                const newCsMap = newData.csMap[value] || {};
                const oldCsMap = oldData.csMap[value] || {};
                if (diff) {
                    if (newCsMap.exist === true && oldCsMap.exist === undefined) {
                        flag = false;
                        break;
                    }
                }
                else {
                    if (newCsMap.exist !== oldCsMap.exist && oldCsMap.exist !== undefined) {
                        flag = false;
                        break;
                    }
                }
            }
        }
        return flag;
    }
    filterDataByRule = (ajaxData) => {
        let newCsMap: any = {};
        const csMap = ajaxData.csMap;
        requireRule[ajaxData.type].forEach((value) => {
            if (Object.prototype.hasOwnProperty.call(csMap, value)) {
                newCsMap[value] = csMap[value]
            }
        });
        return { ...ajaxData, ...{ csMap: newCsMap } }

    }
    save = (index, id) => {
        
        const ajaxData = this.props.dataSource.get(index).toJS();
        if (!this.checkRquire(ajaxData)) return false;
        // 备案情况填写内容验证
        if (this.state.registryStateWordCount) {
            message.error('备案情况最长为100个字')
            return
        }



        // /**
        //  * 更新api
        //  */
        // let api = this.props.role === 1 ? `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/updateCsesForAdmin` : `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/updateCses`

        // /**
        //  * 新增api
        //  */
        // if (ajaxData.id.toString().length === 13) {
        //     type = 'add';
        //     api = `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/addCses`;
        // }

        let title = '确定添加该公司信息';
        let content = '添加后将不可删除';

        const oldData = this.props.compareDataSource.get(index);
        const result = this.compareData(ajaxData, oldData ? oldData.toJS() : {}, this.props.role === 2 && ajaxData.id.toString().length !== 13);


        if (result) {
            return this.savePromise(this.filterDataByRule(ajaxData), index, id);
        }
        /**
         * 管理员
         */
        if (this.props.role === 1) {
            title = '确定删除该公司信息';
            content = '删除后将不可恢复';
        }

        Modal.confirm({
            title,
            content,
            onOk: () => {
                return this.savePromise(this.filterDataByRule(ajaxData), index, id);

            },
            okText: '确定',
            cancelText: '取消'
        })
    }
    savePromise = (ajaxData, index, id) => {
        let type = 'update';

        /**
         * 更新api
         */
        let api = this.props.role === 1 ? `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/updateCsesForAdmin` : `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/updateCses`

        /**
         * 新增api
         */
        if (ajaxData.id.toString().length === 13) {
            type = 'add';
            api = `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/addCses`;
        }
        return new Promise((resolve, reject) => {
            const data = fetchFn(api, { cses: JSON.stringify(ajaxData) }).then((data: any) => {
                if (data.status === 0) {
                    message.success('保存成功');
                    /**
                     * 修改编辑状态
                     */
                    this.disabledOnlyOneEdit = false;

                    /**
                     * 如果新增状态，并且是第一条
                     */
                    if (this.addIng && index === 0) {
                        this.addIng = false;
                    }
                    this.search(false);



                    //const newId = data.data.id;


                    /**
                     * 更新显示的数据源
                     */
                    // if (type === 'add') {

                    //     this.editChange([{ key: ['id'], value: newId }, { key: ['edit'], value: false }], id, index);

                    // }
                    // else {
                    //     this.editChange([{ key: ['edit'], value: false }], id, index);
                    // }

                    // /**
                    //  * 更新作为对比的数据源
                    //  */
                    // let method: any = 'update';
                    // if (ajaxData.id.toString().length === 13) {
                    //     ajaxData.id = newId;
                    //     method = 'unshift'
                    // }
                    // this.updateCompareDataSource(ajaxData, method, index);

                    return resolve();
                }
                return reject();
            }, (data) => {
                reject();
            })
        })
    }
    addOne = (e) => {
        if (this.disabledOnlyOneEdit) {
            message.warn('请保存当前编辑内容');
            return;
        }
        this.addIng = true;
        const {
            chapterListSet,
            dataSource,
        } = this.props;
        chapterListSet(dataSource.unshift(fromJS({ edit: true, id: Date.now(), csMap: {} })));
        this.disabledOnlyOneEdit = true;
    }
    searchParams = () => {
        const companyNameCheck = this.companyNameCheck(this.companyName, false);
        if (companyNameCheck === false) return {};
        const {type, operator } = this.state;
        return {
            type, 
            creatorId: operator,
            companyName: this.companyName,
            pageSize: this.state.pageSize,
            currentPage: this.state.currentPage,
            role: this.props.role,
        }
    }
    search = (reset = true) => {
        const companyNameCheck = this.companyNameCheck(this.companyName, false);
        if (companyNameCheck) {
            this.disabledOnlyOneEdit = false;
            this.addIng = false;
            this.props.chapterListGet({
                ...this.searchParams(),
                currentPage: reset ? 0 : this.state.currentPage,
            });
        }
    }
    reset = () => {
        const i = this.refs.companyName as any
        i.input.value = '';
        this.companyName = '';
        this.setState({
            type: undefined,
            operator: undefined,
            currentPage: 0,
        }, this.search)
    }
    showHideContact = () => {
        this.setState({
            show: !this.state.show,
        })
    }
    companyNameCheck = (value, require = true) => {

        if (!require && !value) {
            return true;
        }
        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
            message.error('公司名称只可为中文字符');
            return false;
        }
        if (value.length > 25) {
            message.error('公司名称最长为25字');
            return false;
        }
        return value;
    }
    enterId;
    modalCompanyName = '';
    ChapterInfoEnter;
    enter = ({id, companyName}) => {
        
        if (this.disabledOnlyOneEdit) {
            message.warn('请保存当前编辑内容');
            return;
        };
        this.enterId = id;
        this.modalCompanyName = companyName;
        this.setState({
            enterShow: true,
        })
    }
    enterSave = () => {
        
        const {
            chapterInfoEnterSave,
        } = this.props;
        if (this.ChapterInfoEnter) {
            const result = this.ChapterInfoEnter.wrappedInstance.getResult();
            if (result) {
                result.csId = this.enterId;
                chapterInfoEnterSave(result, () => this.setState({
                    enterShow: false
                }));
            }
        }
    }
    render() {
        const {
            dataSource,
            role,
            fetching,
        } = this.props;
        const {
            show,
            showTransfer,
        } = this.state;
        const transferData = this.transferData;
        return (
            <div className="chapterList">
                <Form layout="inline">
                    <FormItem>
                        <Input placeholder="公司名称" ref="companyName" onBlur={(e: any) => { this.companyName = e.target.value; }} />
                    </FormItem>
                    <FormItem>
                        <Select value={this.state.type} style={{ width: 150 }} ref="type"  placeholder="登记模式" allowClear onChange={(value) => this.setState({type: value})} >
                            <Option value={4}>
                                多证合一
                            </Option>
                            <Option value={3}>
                                五证合一
                            </Option>
                            <Option value={2}>
                                三证合一
                            </Option>
                            <Option value={1}>
                                传统章证
                            </Option>
                        </Select>
                    </FormItem>
                    {
                        role == 1 
                        ? <FormItem>
                            <Select
                                style={{ width: 200 }} 
                                dropdownMatchSelectWidth={false}
                                dropdownStyle={{width: 200, overflowX: 'scroll'}}
                                ref="type" 
                                placeholder="开办人/录入人" 
                                allowClear
                                showSearch
                                value={this.state.operator}
                                onChange={(value) => this.setState({operator: value as string}, () => {this.search()})}
                                filterOption={(inputValue: string, option) => {
                                    if (inputValue && inputValue.length < 2) {
                                        return true
                                    }
                                    // const child = option.props.children as string
                                    const employeeNumber = option.props['data-employeeNumber'] as string
                                    const organizationName = option.props['data-organizationName'] || ''
                                    const name = option.props['data-name']
                                    return name.indexOf(inputValue) > -1 || employeeNumber.indexOf(inputValue) > -1 || organizationName.indexOf(inputValue) > -1
                                }}
                            >
                                {
                                    this.props.personSource.toJS().map((value, index) => 
                                        <Option
                                            value={value.id}
                                            data-employeeNumber={value.employeeNumber} 
                                            data-organizationName={value.organizationName}
                                            data-name={value.name} 
                                            data-phone={value.phone}>
                                            {value.userInfo}
                                        </Option>)
                                }
                            </Select>
                        </FormItem>
                        : null
                    }
                    <FormItem>
                        <Button type="primary" onClick={() => this.search()}>搜索</Button>
                    </FormItem>
                    <FormItem>
                        <Button onClick={this.reset}>重置</Button>
                    </FormItem>
                </Form>
                <Form layout="inline" style={{ margin: '20px 0' }}>
                    {
                        role !== 1 &&
                        <FormItem>
                            <Button type="primary" onClick={this.addOne}>新增</Button>
                        </FormItem>
                    }
                    <FormItem>
                        <Button type="ghost" onClick={this.showHideContact} >{show ? '隐藏保管人' : '显示保管人'}</Button>
                    </FormItem>
                </Form>
                <Table
                    rowClassName={(record: any, index) => `chapterTable-tr-${record.type}`}
                    className="chapterTable"
                    loading={fetching}
                    rowKey={(record: any) => record.id}
                    pagination={this.pagination()}
                    dataSource={dataSource.toJS()}
                    columns={this.toggleKeeperShow(role, show)}
                    bordered={true}
                    scroll={show ? { x: role === 1 ? 5320 : 5120, y: 500 } : { x: role === 1 ? 3720 : 3520, y: 500 }}
                >
                </Table>
                <Modal
                    visible={showTransfer}
                    title="开办人转移"
                    maskClosable={false}
                    onCancel={() => this.setState({ showTransfer: false })}
                    footer={<div><Button type="primary" loading={fetching} onClick={this.transferOk}>确定</Button></div>}
                >
                    {
                        transferData.type === 1 ?
                            <div>
                                <div style={{ marginBottom: 20 }}>
                                    <strong> {transferData.creatorInfo} </strong> 负责的 <strong>{transferData.companyName} </strong> , 转移给
                            </div>
                            </div>
                            :
                            <div>
                                <div style={{ marginBottom: 20 }}>
                                    <strong> {transferData.creatorInfo} </strong> 负责的 <strong>所有公司 </strong> , 转移给
                            </div>
                            </div>
                    }
                    新负责人 :  <SelectPerson
                        key={Date.now()}
                        source={this.props.personSource}
                        edit={true}
                        value={{ operatorId: this.transferData.transferId, }}
                        onSelect={(value, option) => {
                            this.transferData.transferId = value;
                            this.transferData.transferInfo = option.props['data-name-info']
                        }}
                    />
                </Modal>

                <Modal
                    key={`${this.enterId}${this.state.enterShow}`}
                    title={`录入信息 | ${this.modalCompanyName}`}
                    visible={this.state.enterShow}
                    maskClosable={false}
                    onCancel={() => this.setState({ enterShow: false })}
                    footer={<div>
                        <Button loading={fetching} type="primary" onClick={this.enterSave}>保存</Button>
                        <Button onClick={() => this.setState({ enterShow: false })}>取消</Button>
                    </div>}
                    width={950}
                >
                    <div>
                        <ChapterInfoEnter
                            csId={this.enterId}
                            ref={node => this.ChapterInfoEnter = node} className="chapter-list-modal"
                            edit={true}
                            panes={[1,2,3,5,6,7,8,9,10]}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state: Any.Store, ownProps: TOwnProps): TStateProps => {
    const data = state.get('chapterList');
    return {
        dataSource: data.get('dataSource'),
        personSource: data.get('personSource'),
        compareDataSource: data.get('compareDataSource'),
        fetching: data.get('fetching'),
        total: data.get('total'),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChapterList);