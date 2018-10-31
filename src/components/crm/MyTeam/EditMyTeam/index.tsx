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

import './style.less';

import { DOMAIN_OXT } from "../../../../global/global";
import { fetchFn } from "../../../../util/fetch";

import { Organizations } from '../../../../components/common/organizationsUi';
import JoyoModal from '../../../../components/crm/JoyoModal';
import Select from 'antd/lib/select';
import Modal from 'antd/lib/modal/Modal';

const API = `${DOMAIN_OXT}/apiv2_/permission/v1/team/teamList`; //获取团队列表
const getSpecialSubordinateListAPI = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/getSpecialSubordinateList`; //获取主管或成员
const getDataList = () => fetchFn(API, {}).then(data => data);
const getSpecialSubordinateList = (data?) => fetchFn(getSpecialSubordinateListAPI, data || {}).then(data => data);


const EditableNameCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input placeholder='请填写' style={{ margin: '-5px 0' }} value={value} maxLength={50} onChange={e => onChange(e.target.value.trim())} />
            : value
        }
    </div>
);
const EditableEnCell = ({ queryOrganizationsAndUsers, editable, value, onChange, width }) => (
    <div>
        {editable
            ? <Organizations
                renderBody
                needAll={false}
                initValue={value}
                onSelect={onChange}
                width={width}
                child={'children'}
                department='name'
                dataSource={queryOrganizationsAndUsers ? queryOrganizationsAndUsers[0] : []}>
                
            </Organizations>
            : value
        }
    </div>
);
const EditableSortCell = ({queryOrganizationsAndUsers, editable, value, onChange, text }) => (
    <div>
        {editable
            ? queryOrganizationsAndUsers ? <Organizations
            renderBody
            needAll={false}
            initValue={value}
            onChange={onChange}
            child={'children'}
            department='name'
            mode='multiple'
            width='100%'
            dataSource={queryOrganizationsAndUsers ? queryOrganizationsAndUsers[0] : []}
            renderValue={(item) => `${item.id}`}
            >
            
            </Organizations> : <Select placeholder='请选择' style={{width: '100%'}}></Select>
            : text
        }
    </div>
);

class EditMyTeam extends React.Component<any, any>{
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: [],//签约主体
            sortArr: [],//排序数组
            sort: null,
            isAdd: false,
            canEdit: true,
            salesId: null,
            queryOrganizationsAndUsers: {} as any,
        }
    }

    getDataList = async () => {
        let res: any = await getDataList();
        if (res.status === 0) {
            let tempArr: any = [];
            let cacheData: any = res.data ? res.data.map(item => ({ ...item })) : [];
            this.setState({
                data: res.data || [],
                loading: false,
                cacheData: cacheData,
            })
        }
    }

    async componentWillMount() {
        this.setState({ loading: true });
        await this.getDataList();
        // let [
        //     // queryOrganizationsAndUsers,
        //     // specialSubordinateList,
        // ] = await Promise.all([
        //     // fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/organization/queryOrganizationsAndUsers`, {}),
        //     // getSpecialSubordinateList(),
        // ]);
        // this.setState({
        //     // queryOrganizationsAndUsers,
        //     // specialSubordinateList: specialSubordinateList.data && specialSubordinateList.data,
        // })
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
                queryOrganizationsAndUsers={this.state.specialSubordinateList2}
                editable={record.editable}
                width={'128px'}
                value={text}
                onChange={value => this.handleChange(value, record.id, column)}
            />
        );
    }
    renderSortColumns(text, record, column) {
        return (
            <EditableSortCell
                queryOrganizationsAndUsers={this.state.specialSubordinateList2}
                editable={record.editable}
                value={record.member ? record.member.split(',') : undefined}
                text={text}
                onChange={value => this.handleChange(value, record.id, column)}
            />
        );
    }
    handleChange(value, id, column) {
        console.log(value);
        try {
            const newData = [...this.state.data];
            const target = newData.filter(item => id === item.id)[0];
            if (target) {
                target[column] = column === 'member' ? value.join(',') : value;
                this.setState({ data: newData });
            }
        } catch (error) {
            console.error(error);
        }
    }
    async edit(id, sort) {
        if(!this.state.canEdit){
            message.error('有正在编辑团队');
            return ;
        }
        this.setState({ isAdd: true, loading: true, canEdit: false});
        let res = await getSpecialSubordinateList({teamId: id});
        this.setState({
            specialSubordinateList2: res.data && res.data,
            loading: false,
        }, () => {
            const newData = [...this.state.data];
            const target = newData.filter(item => id === item.id)[0];
            if (target) {
                target.editable = true;
                this.setState({ data: newData });
            }
        })
    }
    async add() {
        this.setState({ isAdd: true, canEdit: false, loading: true });
        let res = await getSpecialSubordinateList({teamId: 0});
        const newData = [...this.state.data];
        newData.push({
            name: '',
            masterId: undefined,
            member: undefined,
            editable: true,
        })
        this.setState({ 
            data: newData,
            specialSubordinateList2: res.data && res.data,
            loading: false,
        });
    }
    async update(id) {
        const newData = [...this.state.data];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            if (target.name == '') {
                message.error('请填写团队名称');
                return false;
            } else if (!/^[\w\W]{1,50}$/.test(target.name)) {
                message.error('不可超过50个字');
                return false;
            }
            if (target.masterId === '' || target.masterId === undefined || target.masterId === null) {
                message.error('请选择团队主管');
                return false;
            }
            if(target.member === '' || target.member === undefined || target.member === null){
                message.error('请选择团队成员');
                return false;
            }
            this.setState({ loading: true });
            if (id) {
                let res = await fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/team/update`,
                    {
                        id: id,
                        name: target.name,
                        masterId: target.masterId,
                        member: target.member,
                    }
                )
                if (res.status == 0) {
                    delete target.editable;
                    this.getDataList();
                }
                this.setState({ loading: false, isAdd: false, canEdit:true });
            } else {
                let res = await fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/team/add`,
                    {
                        name: target.name,
                        masterId: target.masterId,
                        member: target.member,
                    }
                )
                if (res.status == 0) {
                    delete target.editable;
                    this.getDataList();
                }
                this.setState({ loading: false, isAdd: false, canEdit:true });
                
            }
        }
    }
    cancel(id) {
        if (id) {
            const newData = [...this.state.data];
            const target = newData.filter(item => id === item.id)[0];
            if (target) {
                Object.assign(target, this.state.cacheData.filter(item => id === item.id)[0]);
                delete target.editable;
                this.setState({ data: newData });
            }
        } else {
            this.setState({ loading: true });
            this.getDataList();
        }
        this.setState({ isAdd: false, canEdit:true });
    }
    columns = [{
        title: '操作',
        dataIndex: 'id',
        width: 90,
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
                            : this.state.canEdit ? 
                            <span>
                                <a onClick={() => this.edit(record.id, record.sort)}>编辑</a>
                                <Popconfirm title="确定删除?" onConfirm={() => this.delHandle(record.id)}>
                                <a 
                                    // onClick={() => this.setState({deleteTeamId: record.id, deleteTeamName: record.name},() => {
                                    //     this.setState({visible: true})
                                    // })}
                                >删除</a>
                                </Popconfirm>
                            </span> : <span> <span style={{marginRight: 10}} className="text-small">编辑</span> <span className="text-small">删除</span> </span>
                    }
                </div>
            );
        },
    }, {
        title: '团队名称',
        dataIndex: 'name',
        width: 90,
        render: (text, record) => this.renderNameColumns(text, record, 'name'),
    }, {
        title: '团队主管',
        dataIndex: 'master',
        width: 140,
        render: (text, record) => this.renderEnColumns(text, record, 'masterId'),
    }, {
        title: '团队成员 ',
        width: 380,
        dataIndex: 'memberString',
        render: (text, record) => this.renderSortColumns(text, record, 'member'),
    }];

    delHandle = async(id) => {
        this.setState({ loading: true });
        const res:any = await fetchFn(`${DOMAIN_OXT}/apiv2_/permission/v1/team/delete`,
            { id: id }
        )
        if (res.status == 0) {
            this.getDataList();
        }
        this.setState({ loading: false, visible: false, deleteTeamName: '', deleteTeamId: '' });
    }

    render() {
        const {
            loading,
            data,
            isAdd,
        } = this.state;

        return (
            <div className="edit-crm-my-team custom-scroll-bar">
                {/* <JoyoModal
                    title='删除团队'
                    width={420}
                    visible={this.state.visible}
                    onCancel={() => {this.setState({visible: false, deleteTeamName: '', deleteTeamId: '',})}}
                    onOk={() => this.delHandle(this.state.deleteTeamId)}
                    okText='确定删除'
                >
                    <h2>是否确定删除<span className='text-green'>{this.state.deleteTeamName}</span>？</h2>
                    <div style={{color: '#EF7800', marginTop:20}}>删除后，该团队下的人员将没有归属团队！ </div>
                </JoyoModal> */}
                <Table
                    pagination={false}
                    bordered
                    loading={loading}
                    dataSource={data}
                    columns={this.columns}
                    scroll={{
                        y: 450,
                        x: 700,
                    }}
                    footer={!isAdd ? (currentPageData) => {
                        return <a style={{width: '100%', textAlign: 'center'}} onClick={() => this.add()}>新增团队</a>
                    } : undefined}
                />
            </div>
        )
    }
}

export default EditMyTeam;