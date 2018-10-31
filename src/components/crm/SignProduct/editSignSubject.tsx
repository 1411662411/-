import React from 'react';
import { browserHistory } from 'react-router'
import {
    Spin,
    Input,
    Table,
    Popconfirm,
    Button,
    message,
    InputNumber
} from 'antd';

import { DOMAIN_OXT } from "../../../global/global";
import { fetchFn } from "../../../util/fetch";

const API = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/list`; //获取签约主体
const getDataList = (key) => {
    return fetchFn(API, {
        'key': key
    }).then(data => data);
}

const EditableNameCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value.trim())} />
            : value
        }
    </div>
);
const EditableEnCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value.trim().toUpperCase())} />
            : value
        }
    </div>
);
const EditableSortCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <InputNumber min={1} precision={0} style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e)} />
            : value
        }
    </div>
);

class EditSignSubject extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            signSubject: [],//签约主体
            sortArr: [],//排序数组
            sort: null,
        }
    }

    /**
     * 获取签约主体
     */
    getDataList = async() => {
        let res:any = await getDataList('QYZT');
        if(res.status === 0){
            let tempArr:any = [];
            res.data.map((item) => {
                tempArr.push(item.sort);
            })
            let cacheData:any = res.data.map(item => ({ ...item }));
            this.setState({
                signSubject: res.data,
                sortArr: tempArr,
                loading: false,
                cacheData: cacheData,
                isAdd: true,
            })
        }
    }

    async componentWillMount() {
        this.setState({ loading: true });
        await this.getDataList();
    }

    renderNameColumns(text, record, column) {
        return (
            <EditableNameCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.id, column)}
            />
        );
    }
    renderEnColumns(text, record, column) {
        return (
            <EditableEnCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.id, column)}
            />
        );
    }
    renderSortColumns(text, record, column) {
        return (
            <EditableSortCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.id, column)}
            />
        );
    }
    handleChange(value, id, column) {
        const newData = [...this.state.signSubject];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            target[column] = value;
            this.setState({ signSubject: newData });
        }
    }
    edit(id, sort) {
        this.setState({sort});
        const newData = [...this.state.signSubject];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            target.editable = true;
            this.setState({ signSubject: newData });
        }
    }
    add() {
        this.setState({isAdd: false});
        const newData = [...this.state.signSubject];
        newData.push({
            dictName: '',
            description: '',
            sort: undefined,
            editable: true,
        })
        this.setState({ signSubject: newData });
    }
    update(id) {
        const newData = [...this.state.signSubject];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            if(target.dictName == ''){
                message.error('请填写产品类型');
                return false;
            }else if(!/^[\w\W]{1,20}$/.test(target.dictName)){
                message.error('产品类型最多允许输入20个字');
                return false;
            }
            if(target.description == ''){
                message.error('请填写英文缩写');
                return false;
            }else if(!/^[a-zA-Z]*$/.test(target.description)){
                message.error('请填写正确的英文缩写');
                return false;
            }
            if(target.sort == '' || target.sort == undefined){
                message.error('请填写正确的序号数字');
                return false;
            }else if(target.sort != this.state.sort){
                if(this.state.sortArr.includes(target.sort)){
                    message.error('序号数字已存在，请使用其他数字');
                    return false;
                }
            }
            this.setState({loading: true});
            if(id){
                fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/updateSubject`,
                    { 
                        id: id,
                        subjectName: target.dictName,
                        englishName: target.description,
                        sort: target.sort
                    }
                )
                .then((res: any) => {
                    if(res.status == 0){
                        delete target.editable;
                        this.getDataList();
                    }
                    this.setState({loading: false});
                });
            }else{
                fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/addSubject`,
                    { 
                        subjectName: target.dictName,
                        englishName: target.description,
                        sort: target.sort
                    }
                )
                .then((res: any) => {
                    if(res.status == 0){
                        delete target.editable;
                        this.getDataList();
                    }
                    this.setState({loading: false});
                });
            }
        }
    }
    cancel(id) {
        if(id){
            const newData = [...this.state.signSubject];
            const target = newData.filter(item => id === item.id)[0];
            if (target) {
                Object.assign(target, this.state.cacheData.filter(item => id === item.id)[0]);
                delete target.editable;
                this.setState({ signSubject: newData });
            }
        }else{
            this.setState({loading: true});
            this.getDataList();
        }
    }
    columns = [{
        title: '签约主体',
        dataIndex: 'dictName',
        width: '40%',
        render: (text, record) => this.renderNameColumns(text, record, 'dictName'),
    }, {
        title: '英文缩写',
        dataIndex: 'description',
        width: '25%',
        render: (text, record) => this.renderEnColumns(text, record, 'description'),
    }, {
        title: '序号',
        dataIndex: 'sort',
        width: '15%',
        render: (text, record) => this.renderSortColumns(text, record, 'sort'),
    }, {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => {
            const { editable } = record;
            return (
                <div className="editable-row-operations">
                    {
                        editable ?
                            <span>
                                <a onClick={() => this.update(record.id)}>保存</a>
                                <a onClick={() => this.cancel(record.id)}>取消</a>
                            </span>
                            :
                            <span>
                                <a onClick={() => this.edit(record.id, record.sort)}>编辑</a>
                                <Popconfirm title="确定删除?" onConfirm={() => this.delHandle(record.id)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </span>
                    }
                </div>
            );
        },
    }];

    delHandle = (id) => {
        this.setState({loading: true});
        fetchFn(`${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/deleteSubject`,
            { id: id }
        )
        .then((res: any) => {
            if(res.status == 0){
                this.getDataList();
            }
            this.setState({loading: false});
        });
    }

    render() {
        const {
            loading,
            signSubject,
            isAdd,
        } = this.state;

        return (
            <div className="edit-sign-product">
                <Table
                pagination={false}
                bordered
                loading={loading}
                dataSource={signSubject}
                columns={this.columns}
                footer={(currentPageData) =>{
                    return isAdd ? <a onClick={() => this.add()}>添加</a> : ''
                }}
                />
            </div>
        )
    }
}

export default EditSignSubject;