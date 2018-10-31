import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectCity from '../../components/select-city/index';
import address from '../../components/select-city/address.json';
import { DOMAIN_OXT } from '../../global/global';
import {
    Form,
    Button,
    Card,
    Cascader,
    Tabs,
    Upload,
    Icon,
    message,
    Checkbox,
    Select,
    Table,
    Modal,
    Input,
    Affix,
    Spin,
} from 'antd';
import { getPolicyPackageData, submitPolicyPackage, approvePolicyPackage } from '../../action/businessComponents/policyMaintenance/materialsAction';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import Immutable, { Map, List } from 'immutable';
import getRegExp from '../../util/regExp';
import './materials.less';
import { browserHistory } from 'react-router'

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const actionCreators = {
    getPolicyPackageData,
    submitPolicyPackage,
    approvePolicyPackage,
}
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    }
}

const noFormItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,

        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
            offset: 8
        },
    }
}

interface TOwnProps {
    /**
     * 0 查看
     * 1 普通录入人员
     * 2 审核人员
     * 3 文案审核人员
     */
    role: 0 | 1 | 2 | 3;
    edit?: boolean;
    policyId: string;
}
interface TStateProps {
    policypackageFetching: boolean;
    approvePolicypackageFetching: boolean;
    submitPolicypackageFetching: boolean;
    policypackageData: Map<any, any>;
}
type TDispatchProps = typeof actionCreators;
type MaterialsProps = TDispatchProps & TOwnProps & TStateProps;

interface MaterialsState {
    templateName: string[];
    selectVal: string[];
    $$templateList: List<any>;
    hoverId?: number;
    copyId?: number;
    $$insuredTypes: List<Map<string, any>>;
    $$cacheMaterials: Map<string, any>;
    edit: boolean;
    role: TOwnProps['role'];
    step: 1 | 2;
    customerRemark: string;
    joyowoRemark: string;
    materialAddress?: any;
    insuredPersonCopyId?: any;
    insuredPersonHoverId?: any;
}
const maps = {
    materialBg: {
        1: '白',
        2: '红',
        3: '蓝',
        4: '红或蓝',
        5: '红、白或蓝',
    },
    materialSize: {
        1: '一',
        2: '二',
    },

}

const changeMaterialTemplates = (materialTemplates) => {
    const time = Date.now();
    const arr = materialTemplates.map((value, index) => {
        if (!value.status) {
            value.status = 'done';
        }
        if (!value.name) {
            value.name = value.filetypeName
        }
        if (!value.url) {
            value.url = value.fileUrl;
        }
        if (!value.uid) {
            value.uid = value.materialTypeId + index;
        }
        return value;
    });
    return arr;
}
/**
     * 旧数据的材料所属分类据没有type类型
     * 根据字段加入类型
     */
const insuredPersonTypeCascaderType = (singeCacheMaterials) => {
    const {
            materialName,
        materialContent,
        } = singeCacheMaterials;
    const type = `${materialName}|${materialContent}`;
    if (type === '免冠照片|原件') {
        return 5;
    }
    else if (type === '免冠照片|电子版') {
        return 6;
    }
    else {
        const type = materialContent;
        switch (type) {
            case '原件':
                //需寄送;
                return 1;
            case '电子版':
                //需上传
                return 2;
            case '个人账户':
            case '编号':
            case '账号':
            case '用户名':
            case '密码':
            case '全称':
            case '开户所属地':
            case '银行名称':
            case '卡号':
                //需提供'
                return 3;
            case '复印件':
            case '扫描件':
                return 4;
        }
    }
}

class Materials extends Component<MaterialsProps, MaterialsState> {
    cacheMaterialsRef: any = {};
    modalSingeMaterialsRef;
    customerRemarkRef;
    materialJoyowoRemarkRef;
    city;
    AddressForm: any;
    constructor(props: MaterialsProps) {
        super(props);
        const {
            edit = true,
            role,
            getPolicyPackageData,
            policyId = '',
        } = this.props;
        if (policyId === '') {
            message.error('缺少政策包policyId');
            return;
        }
        let materialsEditCache = localStorage.getItem('materialsEditCache');

        materialsEditCache = materialsEditCache ? JSON.parse(materialsEditCache) : '';
        if (materialsEditCache && materialsEditCache[policyId] && edit) {
            const data = materialsEditCache[policyId];
            Modal.confirm({
                content: '当前城市有缓存的数据，需要加载么？',
                onOk: () => {
                    const {
                        insuredTypes,
                        materialAddress,
                        materialTemplates = [],
                        joyowoRemark,
                        customerRemark,
                    } = data;
                    getPolicyPackageData({ policyId, role }, (data) => {
                        this.setState({
                            $$insuredTypes: Immutable.fromJS(insuredTypes),
                            $$templateList: Immutable.fromJS(changeMaterialTemplates(materialTemplates)),
                            customerRemark,
                            materialAddress,
                            joyowoRemark,
                        })
                    });
                },
                onCancel: () => {
                    getPolicyPackageData({ policyId, role }, (data) => {
                        const {
                            insuredTypes,
                            materialContentJson = {},
                        } = data;
                        const {
                            joyowoRemark = '',
                            customerRemark = '',
                            materialTemplates = [],
                            materialAddress,
                        } = materialContentJson as any;
                        this.setState({
                            $$insuredTypes: Immutable.fromJS(insuredTypes),
                            $$templateList: Immutable.fromJS(changeMaterialTemplates(materialTemplates)),
                            joyowoRemark,
                            customerRemark,
                            materialAddress,
                        })
                    });
                }
            });
        }
        else {
            getPolicyPackageData({ policyId, role }, (data) => {
                const {
                    insuredTypes,
                    materialContentJson = {},
                } = data;
                const {
                    joyowoRemark = '',
                    customerRemark = '',
                    materialTemplates = [],
                    materialAddress,
                } = materialContentJson as any;
                this.setState({
                    $$insuredTypes: Immutable.fromJS(insuredTypes),
                    $$templateList: Immutable.fromJS(changeMaterialTemplates(materialTemplates)),
                    joyowoRemark,
                    customerRemark,
                    materialAddress
                })
            });
        }


        this.state = {
            templateName: [],
            selectVal: [],
            $$templateList: Immutable.fromJS([]),
            $$insuredTypes: Immutable.fromJS([]),
            $$cacheMaterials: Immutable.fromJS({}),
            edit,
            role,
            step: 1,
            customerRemark: '',
            joyowoRemark: '',

        };
    }
    cascaderChange = (value) => {
        if(value.length >= 3) {
            this.setState({
                templateName: value,
            })
        }
        else {
            this.setState({
                templateName: [],
            })
        }
    }

    uploadProps = () => {
        const {
            templateName,
            $$templateList,
            edit,
        } = this.state;
        const params = templateName.map(value => {
            return value.split('|')[1];
        });
        const ids = templateName.map(value => {
            return value.split('|')[0];
        });

        const obj = {
            materialTypeId: ids[0],
            materialNameId: ids[1],
            materialContentId: ids[2],
            remarkId: ids[3] ? ids[3] : '',
        }
        let fileList = $$templateList.toJS();

        return {

            action: '/admin/api/policypackage/material/template/upload/',
            fileList,
            data: {
                fileTypeName: params.join(' ')
            },
            showUploadList: {
                showPreviewIcon: true,
                showRemoveIcon: edit,
            },
            disabled: this.state.templateName.length <= 0,
            beforeUpload: (file) => {
                const fileSize = 8;

                if (fileSize !== undefined && !(file.size / 1024 / 1024 < 8)) {
                    message.error(`上传的文件大小需控制在 ${fileSize}M以内`);
                    return false;
                }

                return true;

            },
            onSuccess: (response, file) => {
                const {
                    uid,
                    name,
                } = file;
                const {
                    msg,
                    status,
                    errcode,
                    data,
                    errmsg,
                    fileTypeName,
                } = response;
                if (Number(status) === 0 || Number(errcode) === 0) {
                    const newfile = {
                        uid,
                        name: data.fileTypeName,
                        url: data.fileUrl,
                        status: 'done',

                        fileUrl: data.fileUrl,
                        ...obj,
                    };
                    this.setState({
                        $$templateList: $$templateList.push(newfile)
                    })
                }
                else {
                    message.error(msg);
                }

            },
            onRemove: (file) => {
                const deleteUid = file.uid;
                let fileList = $$templateList.toJS();
                let deletIndex: number | null = null;
                for (let i = 0, l = fileList.length; i < l; i++) {
                    let uid = fileList[i].uid;
                    if (uid === deleteUid) {
                        deletIndex = i;
                        break;
                    }
                }
                if (deletIndex !== null) {
                    this.setState({
                        $$templateList: $$templateList.delete(deletIndex)
                    })
                }
            },

        };
    }
    CheckboxGroupOnChange = (insuredTypeId, insuredPersonTypeIds) => {
        let {
            $$insuredTypes,
        } = this.state;

        /**
         * 第一层索引
         */
        const index = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === insuredTypeId : false);

        /**
         * 勾选数据
         */
        let $$insuredPersonTypes = $$insuredTypes.getIn([index, 'insuredPersonTypes']);
        insuredPersonTypeIds.forEach(value => {
            const [id, name] = value.split('|');
            const index = $$insuredPersonTypes.findIndex(data => {
                return parseInt(data.get('insuredPersonType'), 10) == id;
            })
            if (index < 0) {
                $$insuredPersonTypes = $$insuredPersonTypes.push(Immutable.fromJS({
                    insuredPersonType: id,
                    insuredPersonTypeName: name,
                }));
            }
            else {
                $$insuredPersonTypes = $$insuredPersonTypes.updateIn([index, 'insuredPersonType'], () => id).updateIn([index, 'insuredPersonTypeName'], () => name);
            }
        });

        /**
         * 过滤未勾选的数据
         */
        $$insuredPersonTypes = $$insuredPersonTypes.filter((data) => {
            return insuredPersonTypeIds.indexOf(`${data.get('insuredPersonType')}|${data.get('insuredPersonTypeName')}`) >= 0
        }).sortBy((value) => parseInt(value.get('insuredPersonType'), 10), (a, b) => a > b);




        this.setState({
            $$insuredTypes: $$insuredTypes.updateIn([index, 'insuredPersonTypes'], () => $$insuredPersonTypes)
        });
    }
    tabProps = () => {
        const {
            copyId,
            hoverId,
            $$insuredTypes,
            edit,
        } = this.state;
        const {
            policypackageData
        } = this.props;
        const insuredTypesMap = policypackageData.get('insuredTypesMap').toJS();
        const TabPanes = $$insuredTypes.toJS().map((value) => {
            return <TabPane
                tab={
                    <div onMouseLeave={() => this.setState({
                        hoverId: undefined
                    })}
                        onMouseEnter={() => this.setState({
                            hoverId: value.insuredType
                        })}>
                        {insuredTypesMap[value.insuredType]}
                        {
                            edit && !copyId && value.insuredType === hoverId
                            &&
                            <span
                                onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        this.setState({
                                            copyId: value.insuredType,
                                        })
                                    }
                                }
                                style={{ marginLeft: 5, color: '#f5222d' }} >
                                复制
                                </span>
                        }
                        {
                            edit && copyId && value.insuredType !== copyId
                            &&
                            <span
                                onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        this.copyOnce(value.insuredType)
                                    }
                                }
                                style={{ marginLeft: 5, color: '#f5222d' }} >
                                粘贴
                                    </span>
                        }
                    </div>
                }
                key={value.insuredType}>
                {this.tabPane(value.insuredType)}
            </TabPane>
        });
        return (
            <Tabs animated={false} size="large">
                {TabPanes}
            </Tabs>
        )
    }
    tabPane = (insuredType) => {
        const {
            policypackageData
        } = this.props;
        const {
            $$insuredTypes,
            edit,
        } = this.state;


        const insuredPersonTypes = policypackageData.get('insuredPersonTypes').toJS();
        const insuredPersonTypesMap = policypackageData.get('insuredPersonTypesMap').toJS();


        /**
         * checkboxGroup
         */
        const checkboxGroupOptions = insuredPersonTypes.map(value => ({
            label: value.dictName,
            value: `${value.id}|${value.dictName}`,
        }));
        const index = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === insuredType : false);

        const checkboxGroupValue = $$insuredTypes.getIn([index, 'insuredPersonTypes']).toJS().map(value => `${value.insuredPersonType}|${insuredPersonTypesMap[value.insuredPersonType]}`);




        return (
            <div>
                {edit &&
                    <Form layout="inline">
                        <FormItem label="参保身份">
                            <CheckboxGroup options={checkboxGroupOptions} value={checkboxGroupValue} onChange={(checkedValues) => this.CheckboxGroupOnChange(insuredType, checkedValues)} />
                        </FormItem>
                    </Form>
                }
                {this.insuredPersonTypeTabs(insuredType)}
            </div>
        )
    }
    insuredPersonTypeTabs = (insuredType) => {
        const {
            $$insuredTypes,
            edit,
            insuredPersonCopyId = '',
            insuredPersonHoverId,
        } = this.state;
        const {
            policypackageData
        } = this.props;
        const insuredPersonTypesMap = policypackageData.get('insuredPersonTypesMap').toJS();
        const index = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === insuredType : false);
        let $$insuredPersonTypes = $$insuredTypes.getIn([index, 'insuredPersonTypes']);


        const TabPanes = $$insuredPersonTypes.toJS().map((value) => {
            const deepIndex = `${insuredType}|${value.insuredPersonType}`;


            /**
             * 记录层级的index
             */
            return <TabPane
                tab={
                    <div
                        onMouseLeave={() => this.setState({
                            insuredPersonHoverId: undefined
                        })}
                        onMouseEnter={() => this.setState({
                            insuredPersonHoverId: deepIndex
                        })}>
                        {insuredPersonTypesMap[value.insuredPersonType]}
                        {
                            edit && !insuredPersonCopyId && deepIndex === insuredPersonHoverId
                            &&
                            <span
                                onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        this.setState({
                                            insuredPersonCopyId: deepIndex,
                                        })
                                    }
                                }
                                style={{ marginLeft: 5, color: '#f5222d' }} >
                                复制
                                </span>
                        }
                        {
                            edit && parseInt(insuredPersonCopyId.split('|')[0], 10) === insuredType && insuredPersonCopyId && deepIndex !== insuredPersonCopyId
                            &&
                            <span
                                onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        this.copyOncePerson(deepIndex)
                                    }
                                }
                                style={{ marginLeft: 5, color: '#f5222d' }} >
                                粘贴
                                    </span>
                        }
                    </div>
                }
                key={value.insuredPersonType}>
                {edit &&
                    <SingeMaterials
                        materialTypes={policypackageData.get('materialTypes')}
                        deepIndex={deepIndex}
                        ref={(node) => { if (node) { this.cacheMaterialsRef[deepIndex] = node } }}
                    />
                }
                {edit &&
                    <Form>
                        <FormItem>
                            <Button type="primary" onClick={() => { this.handleMaterials(deepIndex) }}>添加</Button>
                        </FormItem>
                    </Form>
                }
                {
                    value.materials && value.materials.length > 0 &&
                    <Table
                        columns={this.columns(deepIndex)}
                        dataSource={value.materials}
                        scroll={{ x: 1350 }}
                    />
                }

            </TabPane>
        });
        return (
            $$insuredPersonTypes.size > 0 ?
                <Tabs animated={false} type="card" size="small" className="insuredType" style={{ marginTop: 20 }}>
                    {TabPanes}
                </Tabs>
                : null
        )
    }
    columns = (deepIndex) => {
        const {
            edit,
        } = this.state;
        return [
            {
                title: '序号',
                key: 'index',
                render(text, record, index) {
                    return index + 1;
                },
                width: 50,
            },
            {
                title: '分类',
                dataIndex: 'materialType',
                key: 'materialType',
                width: 200,
            },
            {
                title: '名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 200,
            },
            {
                title: '详情',
                dataIndex: 'materialContent',
                key: 'materialContent',
                width: 200,
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 450,
            },
            {
                title: '客户需提供',
                dataIndex: 'customerProvide',
                key: 'customerProvide',
                render(text) {
                    return <span dangerouslySetInnerHTML={{ __html: text }}></span>
                },
                width: 150,
            },
            {
                title: '操作',
                key: 'handle',
                render: (text, record, index) => {
                    return edit ? <span>
                        <a style={{ marginRight: 5 }} onClick={() => this.editSingeMaterial(deepIndex, index)}>编辑</a>
                        <a onClick={() => this.deleteSingeMaterial(deepIndex, index)}>删除</a>
                    </span> : null
                },
            }

        ]
    }


    editSingeMaterial = (deepIndex, index) => {
        const {
            $$insuredTypes,
        } = this.state;
        const {
            policypackageData,
        } = this.props;
        const [insuredType, insuredPersonType] = deepIndex.split('|').map(value => parseInt(value, 10));
        const insuredTypesIndex = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === insuredType : false);
        const insuredPersonTypesIndex = $$insuredTypes.getIn([insuredTypesIndex, 'insuredPersonTypes']).findIndex(data => parseInt(data.get('insuredPersonType'), 10) === insuredPersonType);
        let $$singeCacheMaterial = $$insuredTypes.getIn([insuredTypesIndex, 'insuredPersonTypes', insuredPersonTypesIndex, 'materials', index]);
        Modal.confirm({
            content: <SingeMaterials
                materialTypes={policypackageData.get('materialTypes')}
                deepIndex={deepIndex}
                defaultValue={$$singeCacheMaterial}
                ref={node => this.modalSingeMaterialsRef = node}
            />,
            width: 800,
            onOk: () => {
                return new Promise((relove, reject) => {
                    this.handleMaterials(deepIndex, this.modalSingeMaterialsRef.getSingeCacheMaterials(deepIndex), index, (flag) => {
                        if (flag) {
                            return relove();
                        }
                        reject();
                    })
                });
            },
        });
    }
    /**
     * 删除单个材料
     */
    deleteSingeMaterial = (deepIndex, index) => {
        const {
            $$insuredTypes,
            $$cacheMaterials,
        } = this.state;
        const [insuredType, insuredPersonType] = deepIndex.split('|').map(value => parseInt(value, 10));
        const insuredTypesIndex = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === insuredType : false);
        const insuredPersonTypesIndex = $$insuredTypes.getIn([insuredTypesIndex, 'insuredPersonTypes']).findIndex(data => parseInt(data.get('insuredPersonType'), 10) === insuredPersonType);
        let $$materials = $$insuredTypes.getIn([insuredTypesIndex, 'insuredPersonTypes', insuredPersonTypesIndex, 'materials']);
        $$materials = $$materials.delete(index);

        /**
         * 更新材料
         */
        this.setState({
            $$insuredTypes: $$insuredTypes.updateIn([insuredTypesIndex, 'insuredPersonTypes', insuredPersonTypesIndex, 'materials'], () => $$materials),
        });
    }

    /**
     * 添加单个材料
     */
    handleMaterials = (deepIndex: string, $$singeCacheMaterials?, index?, callback?) => {
        const {
            $$insuredTypes,
        } = this.state;

        /**
         * 操作类型
         */
        let handleType = 'add';
        if ($$singeCacheMaterials) {
            handleType = 'edit';
        }

        const _$$singeCacheMaterials = $$singeCacheMaterials || this.cacheMaterialsRef[deepIndex].getSingeCacheMaterials(deepIndex);
        if (!_$$singeCacheMaterials) {
            return message.error('请先选择材料所属分类');
        }
        const [insuredType, insuredPersonType] = deepIndex.split('|').map(value => parseInt(value, 10));
        let singeCacheMaterials = _$$singeCacheMaterials.toJS();
        /**
         * 需上传 ifNeedElectronic
         * 需提供 ifNeedProvide
         * 需寄送 ifNeedSend
         * 数量 materialNumber,
         * 尺寸 materialSize,
         * 底色 materialBg,
         */
        let {
            ifNeedElectronic,
            ifNeedProvide,
            ifNeedSend,
            key,
            materialNumber,
            materialBg,
            materialSize,
            type,
            materialType,
            materialTypeId,
            materialNameId,
            materialContentId,
            remarkId,
        } = singeCacheMaterials;

        if (!materialType) {
            callback && callback(false);
            return message.error('请先选择材料所属分类');
        }

        /**
         * 旧数据没有type
         */
        if (type === undefined) {
            type = insuredPersonTypeCascaderType(singeCacheMaterials);
        }

        if (type === 4 || type === 5 || type === 6) {
            if (ifNeedElectronic === 0 && ifNeedSend === 0) {
                callback && callback(false);
                return message.error('请选择客户需提供的材料');
            }
        }

        switch (type) {
            case 4: {
                const arr: string[] = [];
                if (ifNeedSend) {
                    arr.push(`需寄送${materialNumber}张`);
                }
                if (ifNeedElectronic) {
                    arr.push(`需上传电子版本`);
                }
                singeCacheMaterials.customerProvide = arr.map((value, index) => `<p>${index + 1}.${value}</p>`).join('');
                break;
            }
            case 5: {
                if (ifNeedSend) {
                    singeCacheMaterials.customerProvide = `需寄送${maps.materialSize[materialSize]}寸${maps.materialBg[materialBg]}底${materialNumber}张`;
                }
                break;
            }
            case 6: {
                if (ifNeedElectronic) {
                    singeCacheMaterials.customerProvide = `需上传电子版本${maps.materialSize[materialSize]}寸${maps.materialBg[materialBg]}底`;
                }
                break;
            }

        }


        const insuredTypesIndex = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === insuredType : false);
        const insuredPersonTypesIndex = $$insuredTypes.getIn([insuredTypesIndex, 'insuredPersonTypes']).findIndex(data => parseInt(data.get('insuredPersonType'), 10) === insuredPersonType);



        let $$materials = $$insuredTypes.getIn([insuredTypesIndex, 'insuredPersonTypes', insuredPersonTypesIndex, 'materials']);
        if ($$materials) {
            const materialsIndex = $$materials.findIndex(data => data.get('materialContentId') === materialContentId && data.get('materialTypeId') === materialTypeId && data.get('materialNameId') === materialNameId && data.get('remarkId') === remarkId);

            /**
             * 材料所属分类已经添加过
             */
            if (materialsIndex >= 0 && materialsIndex !== index) {
                callback && callback(false);
                return message.error('材料所属分类已经添加过，请直接编辑');;
            }

            /**
             * 编辑状态下做更新
             */
            if (handleType === 'edit') {
                $$materials = $$materials.update(index, () => Immutable.fromJS(singeCacheMaterials));
            }
            /**
             * 新增状态下做添加
             */
            else {
                $$materials = $$materials.push(Immutable.fromJS(singeCacheMaterials));
            }
        }


        else {
            $$materials = Immutable.fromJS([singeCacheMaterials]);
        }

        /**
         * 更新材料
         */
        this.setState({
            $$insuredTypes: $$insuredTypes.updateIn([insuredTypesIndex, 'insuredPersonTypes', insuredPersonTypesIndex, 'materials'], () => $$materials),
        });

        callback && callback(true);
    }
    copyOnce = (id) => {
        const {
            copyId,
            $$insuredTypes,
        } = this.state;
        const copyIndex = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === copyId : false);

        const pasteIndex = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === id : false);

        const newinsuredTypes =  $$insuredTypes.get(copyIndex).toJS();
        
        newinsuredTypes.id = id;
        newinsuredTypes.insuredType = id;
        newinsuredTypes['insuredPersonTypes'].forEach(value =>  {
            let materials =  value.materials;
            if(materials.length > 0) {
                materials.forEach(value => {
                    value.insuredType = id;
                });
            }
        });
        
        /**
         * 复制
         */
        this.setState({
            copyId: undefined,
            hoverId: undefined,
            $$insuredTypes: $$insuredTypes.update(pasteIndex, () => Immutable.fromJS(newinsuredTypes)),
        }, () => {
            message.success('粘贴成功');
        });
    }
    copyOncePerson = (deepIndex) => {
        const [insuredType, insuredPersonType] = deepIndex.split('|').map(value => parseInt(value, 10));
        const {
            insuredPersonCopyId,
            $$insuredTypes,
        } = this.state;
        const {
            policypackageData,
        } = this.props;
        const insuredPersonTypesMap = policypackageData.get('insuredPersonTypesMap').toJS();
        const index = $$insuredTypes.findIndex(data => data ? data.get('insuredType') === insuredType : false);
        const copyIndex = $$insuredTypes.getIn([index, 'insuredPersonTypes']).findIndex(data => parseInt(data.get('insuredPersonType'), 10) === parseInt(insuredPersonCopyId.split('|')[1], 10));
        const pasteIndex = $$insuredTypes.getIn([index, 'insuredPersonTypes']).findIndex(data => parseInt(data.get('insuredPersonType'), 10) === insuredPersonType);


        const newInsuredPersonTypes =  $$insuredTypes.getIn([index, 'insuredPersonTypes', copyIndex]).toJS();
        
        newInsuredPersonTypes.insuredPersonType = insuredPersonType;
        newInsuredPersonTypes.insuredPersonTypeName = insuredPersonTypesMap[insuredPersonType];
        if(newInsuredPersonTypes.materials && newInsuredPersonTypes.materials.length > 0) {
            newInsuredPersonTypes.materials.forEach(value =>  {
                value.insuredPersonType = insuredPersonType;
            });
        }
        /**
         * 复制
         */
        this.setState({
            insuredPersonCopyId: undefined,
            insuredPersonHoverId: undefined,
            $$insuredTypes: $$insuredTypes.updateIn([index, 'insuredPersonTypes', pasteIndex], () => Immutable.fromJS(newInsuredPersonTypes)),
        }, () => {
            message.success('粘贴成功');
        });
    }
    copy = (dictName) => {
        let {
            $$insuredTypes,
        } = this.state;
        const insuredTypes: any[] = $$insuredTypes.toJS();
        const insuredTypesMap = this.props.policypackageData.get('insuredTypesMap').toJS();
        let firstIndex;
        const arr: any[] = [];
        insuredTypes.forEach((value, index) => {
            if (insuredTypesMap[value.insuredType].indexOf(dictName) > -1) {
                if (firstIndex === undefined) {
                    firstIndex = index;
                }
                arr.push({ index, id: value.insuredType, })
            }
        });


        if (arr.length > 0) {
            arr.forEach(({ index, id, }) => {
                if (index !== firstIndex) {
                    const newInsuredTypes = $$insuredTypes.get(firstIndex).toJS();
                    newInsuredTypes.dictName = 
                    newInsuredTypes.insuredType = id;
                    newInsuredTypes.id = id;
                    if(newInsuredTypes.insuredPersonTypes && newInsuredTypes.insuredPersonTypes.length > 0) {
                        newInsuredTypes.insuredPersonTypes.forEach(value => {
                            if(value.materials && value.materials.length > 0) {
                                value.materials.forEach(value => value.insuredType = id);
                            }
                        })
                    }
                    $$insuredTypes = $$insuredTypes.update(index, () => Immutable.fromJS(newInsuredTypes));
                }
            });
            /**
             * 复制
             */
            this.setState({
                copyId: undefined,
                hoverId: undefined,
                $$insuredTypes,
            }, () => message.success('粘贴成功'));
        }
    }
    edit = () => {
        this.setState({
            edit: true,
            step: 1,
        }, () => window.scrollTo(0, 0))
    }
    preview = () => {
        this.AddressForm && this.AddressForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {
                    hasAddress,
                    materialContacts,
                    materialContactsPhone,
                    materialAddress = {},
                    materialAddressDetail,
                } = values;
                const {
                    selectVal = [],
                    selectName = [],
                } = materialAddress;
                const materialAddressTemp = {
                    hasAddress,
                    materialContacts,
                    materialContactsPhone,
                    materialProvince: selectVal[0],
                    materialCity: selectVal[1],
                    materialDistrict: selectVal[2],
                    materialAddress: materialAddressDetail,
                    materialCityName: selectName.length > 0 ? selectName.join(',') : null
                }
                this.setState({
                    edit: false,
                    step: 2,
                    materialAddress: materialAddressTemp,
                }, () => window.scrollTo(0, 0))
            }
        })


    }
    createData = () => {
        const {
            $$templateList,
            $$insuredTypes,
        } = this.state;
        const {
            policyId,
        } = this.props;

        let materialAddressTemp = {};
        this.AddressForm && this.AddressForm.validateFieldsAndScroll((err, values) => {
            const {
                hasAddress,
                materialContacts,
                materialContactsPhone,
                materialAddress = {},
                materialAddressDetail,
            } = values;
            const {
                selectVal = [],
                selectName = [],
            } = materialAddress;
            materialAddressTemp = {
                hasAddress,
                materialContacts,
                materialContactsPhone,
                materialProvince: selectVal[0],
                materialCity: selectVal[1],
                materialDistrict: selectVal[2],
                materialAddress: materialAddressDetail,
                materialCityName: selectName.length > 0 ? selectName.join(',') : undefined,
            }
        });
        const params = {
            id: policyId,
            materialTemplates: $$templateList.toJS().map(value => {
                delete value.status;
                value.filetypeName = value.name;
                return value;
            }),
            insuredTypes: $$insuredTypes.toJS(),
            materialAddress: materialAddressTemp,
            customerRemark: this.customerRemarkRef && this.customerRemarkRef.textAreaRef.value,
            joyowoRemark: this.materialJoyowoRemarkRef && this.materialJoyowoRemarkRef.textAreaRef.value,
        }
        return params;
    }
    submitApprove = () => {
        this.props.submitPolicyPackage({ role: this.props.role, ...this.createData() }, this.deletelocalStorage);
    }
    approve = (vetted) => {
        const {
            role,
            policyId,
        } = this.props;
        let obj = {};
        /**
         * 文案审核
         */
        if (role === 3) {
            obj = {
                customerRemark: this.customerRemarkRef && this.customerRemarkRef.textAreaRef.value,
                customerRemarkVetted: vetted,
            }
        }
        /**
         * 普通审核
         */
        if (role === 2) {
            obj = {
                vetted,
            }
        }
        this.props.approvePolicyPackage({
            policyId,
            role: this.props.role,
            ...obj,
        });
    }
    savelocalStorage = () => {
        const {
            policyId,
        } = this.props;
        const materialsEditCache = localStorage.getItem('materialsEditCache');
        let newMaterialsEditCache = materialsEditCache ? JSON.parse(materialsEditCache) : {};
        newMaterialsEditCache[policyId] = this.createData();
        localStorage.setItem('materialsEditCache', JSON.stringify(newMaterialsEditCache));
        console.log(newMaterialsEditCache[policyId]);
        message.success('暂存成功');
    }
    deletelocalStorage = () => {
        const {
            policyId,
        } = this.props;
        const materialsEditCache = localStorage.getItem('materialsEditCache');
        if (materialsEditCache) {
            const newMaterialsEditCache = JSON.parse(materialsEditCache);
            delete newMaterialsEditCache[policyId];
            localStorage.setItem('materialsEditCache', JSON.stringify(newMaterialsEditCache));
        }
    }
    render() {
        const {
            policypackageData,
            policypackageFetching,
            approvePolicypackageFetching,
            submitPolicypackageFetching,
        } = this.props;
        const {
            $$insuredTypes,
            templateName,
            $$cacheMaterials,
            edit,
            role,
            step,
            joyowoRemark,
            customerRemark,
            materialAddress = {},
        } = this.state;

        const {
            materialContacts,
            materialContactsPhone,
            materialProvince,
            materialCity,
            materialDistrict,
            materialCityName,
            hasAddress,
        } = materialAddress;
        const materialAddressDetail = materialAddress.materialAddress || '';
        let selectCityVal;
        if (materialCityName && materialProvince !== undefined && materialCity !== undefined && materialDistrict !== undefined) {
            selectCityVal = {
                selectVal: [materialProvince, materialCity, materialDistrict],
                selectName: materialCityName.split(','),
            }
        }
        const {
            provinceName = '',
            cityName = '',
            districtName = '',
            createUser = '/',
            createTime = '/',
            vettedUser = '/',
            vettedTime = '/',
            globalVetted,
        } = policypackageData.toJS();
        return (
            <Spin spinning={policypackageFetching}>
                <div className="materials-wrapper">
                    <div className="materials-info-wrapper">
                        <Form layout="inline">
                            <FormItem label="城市">
                                {`${provinceName} ${cityName} ${districtName}`}
                            </FormItem>
                        </Form>
                        <Form layout="horizontal" className="materials-info">
                            {globalVetted !== undefined && <FormItem label="录入人" {...formItemLayout}>
                                {createUser}
                            </FormItem>}
                            {globalVetted !== undefined && <FormItem label="录入时间" {...formItemLayout}>
                                {createTime}
                            </FormItem>}
                            {globalVetted !== 0 && <FormItem label="审核人" {...formItemLayout}>
                                {vettedUser}
                            </FormItem>}
                            {globalVetted !== 0 && <FormItem label="审核时间" {...formItemLayout}>
                                {vettedTime}
                            </FormItem>}
                        </Form>
                    </div>
                    {edit &&
                        <div className="save-data" onClick={this.savelocalStorage}><Icon type="save" style={{ fontSize: 20 }} />暂存</div>
                    }
                    <Card title="上传材料模板" style={{ marginTop: 20 }}>
                        <Form layout="inline" style={{ marginBottom: 20 }}>
                            {edit &&
                                <FormItem label="模板名称">
                                    <Cascader popupClassName="my-cascader" defaultValue={templateName} options={policypackageData.get('materialTypes').toJS()} onChange={this.cascaderChange} placeholder="请选择" style={{ width: 700 }} changeOnSelect />
                                </FormItem>
                            }
                        </Form>
                        <div style={{ maxWidth: 700 }}>
                            <Upload {...this.uploadProps() }>
                                {edit &&
                                    <Button type="primary" disabled={templateName.length <= 0}>
                                        <Icon type="upload" /> 上传
                                    </Button>
                                }
                            </Upload>
                        </div>
                    </Card>
                    <Card
                        title="添加材料"
                        style={{ marginTop: 20 }}
                        extra={
                            edit && <div>
                                <Button type="primary" onClick={() => this.copy('五险')}>一键复制五险</Button>
                                <Button type="primary" onClick={() => this.copy('公积金')} style={{ marginLeft: 5 }}>一键复制公积金</Button>
                            </div>}>
                        {this.tabProps()}
                    </Card>

                    <Card title="材料接收地址" style={{ marginTop: 20 }}>
                        <AddressForm
                            key={hasAddress}
                            hasAddress={hasAddress}
                            materialContacts={materialContacts}
                            materialContactsPhone={materialContactsPhone}
                            materialAddress={selectCityVal}
                            materialAddressDetail={materialAddressDetail}
                            edit={edit}
                            ref={node => this.AddressForm = node}
                        />
                    </Card>
                    <Card title="相关说明（对内)" style={{ marginTop: 20 }}>
                        <TextArea key={joyowoRemark} defaultValue={joyowoRemark} style={{ height: 200 }} ref={node => this.materialJoyowoRemarkRef = node} disabled={!edit}></TextArea>
                    </Card>
                    <Card title="相关说明（对客户)" style={{ marginTop: 20 }}>
                        <TextArea key={customerRemark} defaultValue={customerRemark} style={{ height: 200 }} ref={node => this.customerRemarkRef = node} disabled={role != 3 && !edit}></TextArea>
                    </Card>
                    <div className="buttons-wrapper" style={{ textAlign: 'center', marginTop: 15 }}>
                        {role === 1 && step === 2 && <Button onClick={this.edit}>上一步</Button>}
                        {role === 1 && step === 1 && <Button type="primary" onClick={this.preview}>预览</Button>}
                        {role === 1 && step === 2 && <Button loading={submitPolicypackageFetching} type="primary" onClick={this.submitApprove}>提交审核</Button>}

                        {role === 2 && <Button loading={approvePolicypackageFetching} onClick={() => this.approve(2)}>不同意</Button>}
                        {(role === 2 || role === 3) && <Button loading={approvePolicypackageFetching} type="primary" onClick={() => this.approve(role === 2 ? 1 : 2)}>同意</Button>}
                        {role === 0 && <Button onClick={() => browserHistory.goBack()}>返回</Button>}
                    </div>

                </div>
            </Spin>
        )
    }
}

interface SingeMaterialsProps {
    materialTypes: any;
    deepIndex: string;
    defaultValue?: any;
}
interface SingeMaterialsState {
    $$cacheMaterials: Map<string, any>;
}
class SingeMaterials extends Component<SingeMaterialsProps, SingeMaterialsState> {
    constructor(props) {
        super(props);
        const {
            deepIndex,
            defaultValue,
        } = this.props;
        const $$cacheMaterials = this.props.defaultValue ? { [deepIndex]: defaultValue } : {};
        this.state = {
            $$cacheMaterials: Immutable.fromJS($$cacheMaterials)
        }
    }
    cacheMaterialsChange = ({ index, value, key }) => {
        const {
            $$cacheMaterials,
        } = this.state;
        if ($$cacheMaterials.get(index)) {
            this.setState({
                $$cacheMaterials: $$cacheMaterials.updateIn([index, key], () => value)
            });
        }

    }

    insuredPersonTypeCascaderChange = (value, key) => {
       
        let newValue = value.map(value => {
            const arr = value.split('|');
            return {
                id: arr[0],
                name: arr[1],
            }
        });
        if (newValue.length < 3) {
            newValue = [{}, {}, {}];
        };
        const [insuredType, insuredPersonType] = this.props.deepIndex.split('|').map(value => parseInt(value, 10));


        const type = `${newValue[1].name}|${newValue[2].name}`;
        let obj: any = {
            /**
             * 分类
             */
            materialType: newValue[0].name,
            materialTypeId: parseInt(newValue[0].id, 10),

            /**
             * 名称
             */
            materialName: newValue[1].name,
            materialNameId: parseInt(newValue[1].id, 10),

            /**
             * 详情
             */
            materialContent: newValue[2].name,
            materialContentId: parseInt(newValue[2].id, 10),

            remark: newValue[3] ? newValue[3].name : '',
            remarkId: newValue[3] ? parseInt(newValue[3].id, 10) : '',

            /**
             * 客户需提供
             */
            customerProvide: '',

            /**
              * 需上传 ifNeedElectronic
              * 需提供 ifNeedProvide
              * 需寄送 ifNeedSend
              */
            ifNeedSend: 0,
            ifNeedElectronic: 0,
            ifNeedProvide: 0,

            /**
              * 需寄送 1
              * 需上传 2
              * 需提供 3
              * 需寄送 & 需上传 4
              * 免冠照片|原件 5
              * 免冠照片|电子版 6
            */
            type: -1,

            //数量
            //materialNumber: '',
            //寸
            //materialSize: '',
            //底色
            //materialBg: '',
            insuredType,
            insuredPersonType,

        }


        /**
         * 匹配类型返回固定的提供
         */
        if (type === '免冠照片|原件') {
            obj.type = 5;
            obj.materialSize = 1;
            obj.materialBg = 1;
            obj.materialNumber = 1;
        }
        else if (type === '免冠照片|电子版') {
            obj.type = 6;
            obj.materialSize = 1;
            obj.materialBg = 1;
        }
        else {
            const type = newValue[2].name;
            switch (type) {
                case '原件':
                    //需寄送;
                    obj.ifNeedSend = 1;
                    obj.customerProvide = '需寄送';
                    obj.type = 1;
                    break;
                case '电子版':
                    //需上传
                    obj.ifNeedElectronic = 1;
                    obj.customerProvide = '需上传';
                    obj.type = 2;
                    break;
                case '个人账户':
                case '编号':
                case '账号':
                case '用户名':
                case '密码':
                case '全称':
                    //需提供'
                    obj.ifNeedProvide = 1;
                    obj.customerProvide = '需提供';
                    obj.type = 3;
                    break;
                case '复印件':
                case '扫描件':
                    obj.materialNumber = 1;
                    obj.type = 4;
                    break;
            }
        }
        this.setState(({ $$cacheMaterials }) => ({
            $$cacheMaterials: $$cacheMaterials.update(key, () => Immutable.fromJS(obj))
        }));
    }
    getSingeCacheMaterials = (deepIndex) => {
        return this.state.$$cacheMaterials.get(deepIndex);
    }
    render() {
        const {
            materialTypes,
            deepIndex,
        } = this.props;
        const {
            $$cacheMaterials,
        } = this.state;
        const cacheMaterials = $$cacheMaterials.toJS();
        const singeCacheMaterials = cacheMaterials[deepIndex] || {};

        /**
         * 需上传 ifNeedElectronic
         * 需提供 ifNeedProvide
         * 需寄送 ifNeedSend
         * 数量 materialNumber
         * 尺寸 materialSize
         * 底色 materialBg
         */
        const {
            ifNeedElectronic,
            ifNeedProvide,
            ifNeedSend,
            materialNumber,
            materialSize,
            materialBg,
            materialType,
            materialTypeId,
            materialName,
            materialNameId,
            materialContent,
            materialContentId,
            remark,
            remarkId,
        } = singeCacheMaterials;
        let type = singeCacheMaterials.type;
        /**
         * 旧数据没有type
         */
        if (type === undefined) {
            type = insuredPersonTypeCascaderType(singeCacheMaterials);
        }

        const materialSizeOption: JSX.Element[] = [];
        for (let key in maps.materialSize) {
            materialSizeOption.push(<Option value={parseInt(key, 10)}>{maps.materialSize[key]}</Option>);
        }
        const materialBgOption: JSX.Element[] = [];
        for (let key in maps.materialBg) {
            materialBgOption.push(<Option value={parseInt(key, 10)}>{maps.materialBg[key]}</Option>);
        }

        const cascaderDefault: string[] = [];
        if (materialType) {
            cascaderDefault.push(`${materialTypeId}|${materialType}`);
        }
        if (materialName) {
            cascaderDefault.push(`${materialNameId}|${materialName}`);
        }
        if (materialContent) {
            cascaderDefault.push(`${materialContentId}|${materialContent}`);
        }
        if (remark) {
            cascaderDefault.push(`${remarkId}|${remark}`);
        }

        return (
            <div >
                <Form layout="inline" style={{ marginTop: 20 }}>
                    <FormItem label="材料所属分类">
                        <Cascader defaultValue={cascaderDefault} popupClassName="my-cascader" options={materialTypes.toJS()} placeholder="请选择" onChange={(changeValue) => this.insuredPersonTypeCascaderChange(changeValue, deepIndex)} style={{ width: 700 }} changeOnSelect  />
                    </FormItem>
                </Form>
                <Form layout="horizontal" style={{ marginTop: 20 }}>
                    {
                        /**
                         * 需寄送 1
                         * 需上传 2
                         * 需提供 3
                         * 需寄送 & 需上传 4
                         * 免冠照|原件 5
                         * 免冠照|电子版 6
                        */
                    }
                    {
                        type === 1 &&
                        <FormItem>
                            需寄送
                             </FormItem>
                    }
                    {
                        type === 2 &&
                        <FormItem>
                            需上传
                            </FormItem>
                    }
                    {
                        type === 3 &&
                        <FormItem>
                            需提供
                            </FormItem>
                    }
                    {
                        type === 4 &&
                        [
                            <FormItem>
                                <Checkbox checked={ifNeedSend === 1} onChange={(e) => this.cacheMaterialsChange({
                                    index: deepIndex,
                                    value: e.target.checked ? 1 : 0,
                                    key: 'ifNeedSend'
                                })}>需寄送</Checkbox>
                                <Select size="small" value={materialNumber} style={{ width: 70, marginRight: 5, marginLeft: 5, }} placeholder="请选择" onChange={(value) => this.cacheMaterialsChange({
                                    index: deepIndex,
                                    value: value,
                                    key: 'materialNumber'
                                })}>
                                    {
                                        Array.from({ length: 10 }, (v, k) => k).map((value, index) => <Option value={index + 1}>{index + 1}</Option>)
                                    }
                                </Select>
                                张
                                </FormItem>,
                            <FormItem>
                                <Checkbox checked={ifNeedElectronic === 1} onChange={(e) => this.cacheMaterialsChange({
                                    index: deepIndex,
                                    value: e.target.checked ? 1 : 0,
                                    key: 'ifNeedElectronic'
                                })} >需上传电子版</Checkbox>
                            </FormItem>
                        ]

                    }
                    {
                        type === 5 && <FormItem>
                            <Checkbox checked={ifNeedSend === 1} onChange={(e) => this.cacheMaterialsChange({
                                index: deepIndex,
                                value: e.target.checked ? 1 : 0,
                                key: 'ifNeedSend'
                            })}>需寄送</Checkbox>
                            <span>
                                <Select size="small" style={{ width: 70, marginRight: 5, marginLeft: 5, }} placeholder="请选择" value={materialSize} onChange={(value) => this.cacheMaterialsChange({
                                    index: deepIndex,
                                    value: value,
                                    key: 'materialSize'
                                })}>
                                    {materialSizeOption}
                                </Select>
                                寸
                                    <Select size="small" style={{ width: 120, marginRight: 5, marginLeft: 5, }} placeholder="请选择" value={materialBg} onChange={(value) => this.cacheMaterialsChange({
                                    index: deepIndex,
                                    value: value,
                                    key: 'materialBg'
                                })}>
                                    {materialBgOption}
                                </Select>
                                底
                                    <Select size="small" style={{ width: 70, marginRight: 5, marginLeft: 5, }} placeholder="请选择" value={materialNumber} onChange={(value) => this.cacheMaterialsChange({
                                    index: deepIndex,
                                    value: value,
                                    key: 'materialNumber'
                                })}>
                                    {
                                        Array.from({ length: 10 }, (v, k) => k).map((value, index) => <Option value={index + 1}>{index + 1}</Option>)
                                    }
                                </Select>
                                张
                                </span>
                        </FormItem>
                    }
                    {
                        type === 6 &&
                        <FormItem>
                            <Checkbox checked={ifNeedElectronic === 1} onChange={(e) => this.cacheMaterialsChange({
                                index: deepIndex,
                                value: e.target.checked ? 1 : 0,
                                key: 'ifNeedElectronic'
                            })}>需上传电子版</Checkbox>
                            <span>
                                <Select size="small" style={{ width: 70, marginRight: 5, marginLeft: 5, }} placeholder="请选择" value={materialSize} onChange={(value) => this.cacheMaterialsChange({
                                    index: deepIndex,
                                    value: value,
                                    key: 'materialSize'
                                })}>
                                    {materialSizeOption}
                                </Select>
                                寸
                                    <Select size="small" style={{ width: 120, marginRight: 5, marginLeft: 5, }} placeholder="请选择" value={materialBg} onChange={(value) => this.cacheMaterialsChange({
                                    index: deepIndex,
                                    value: value,
                                    key: 'materialBg'
                                })}>
                                    {materialBgOption}
                                </Select>
                                底
                                </span>
                        </FormItem>
                    }
                </Form>
            </div>
        )
    }
}








interface AddressTOwnProps {
    /* 是否有编辑状态 */
    edit?: boolean;
    /**
     * 是否需要地址
     */
    hasAddress: boolean;
    /**
     * 姓名
     */
    materialContacts?: string;
    /**
     * 联系号码
     */
    materialContactsPhone?: string;
    /**
     * 机构名称
     */
    materialAddress?: {
        selectVal: number[];
        selectName: string[];
    };
    /**
     * 地址（详细地址）
     */
    materialAddressDetail?: string;
}




interface AddressProps extends AddressTOwnProps, FormComponentProps {

}
interface AddressState {
    hasAddress: boolean;
}
class Address extends Component<AddressProps, AddressState> {
    constructor(props: AddressProps) {
        super(props);
        this.state = {
            hasAddress: this.props.hasAddress,
        }
        console.log(this.state)
    }
    selectCityParams = ({ selectVal = [] as number[], selectName = [] as string[] } = {}) => {
        return {
            deepMap: [{ name: '省', value: selectVal && selectVal.length >= 1 ? selectVal[0] : undefined }, { name: '市', value: selectVal && selectVal.length >= 2 ? selectVal[1] : undefined }, { name: '区', value: selectVal && selectVal.length >= 3 ? selectVal[2] : undefined }],
            popupStyle: {
                width: 350,
                zIndex: 99999,
            }, /* 弹窗样式 */
            placeholder: '请选择',
            address, /* json方式 方式城市基本数据，与addressApi选项2选1， 优先 address */
            style: {
                width: 166,
            }, /* input 的样式 */
        }
    }
    validatorSelectCity = (rule, value, callback) => {
        if (value === undefined) {
            return callback('请选择地区');
        }
        let {
            selectVal = [],
            selectName = []
        } = value;

        // 过滤undefined成员
        selectVal = selectVal.filter(item => !!item)
        selectName = selectName.filter(item => !!item)

        if (selectName.length < 3) {
            callback('请选择地区');
        } else {
            callback()
        }
    }
    render() {
        const {
            form,
            edit,
            materialContacts,
            materialContactsPhone,
            materialAddress,
            materialAddressDetail,
        } = this.props;
        const {
            getFieldDecorator,
            setFieldsValue,
        } = form;
        const {
            hasAddress,
        } = this.state;
        return (
            <Form className="companyinfo" style={{ width: 500 }}>
                <FormItem label="" {...noFormItemLayout}>
                    {
                        getFieldDecorator('hasAddress', {
                            initialValue: hasAddress,
                        })(
                            <Checkbox disabled={!edit} checked={hasAddress} onChange={value => this.setState({ hasAddress: value.target.checked })}>设置材料接收地址</Checkbox>
                            )
                    }
                </FormItem>
                {
                    hasAddress &&
                    <span>
                        <FormItem required={false} label="联系人姓名" {...formItemLayout}>
                            {
                                getFieldDecorator('materialContacts', {
                                    initialValue: materialContacts,
                                    rules: [edit ? {
                                        required: true,
                                        pattern: getRegExp('zh2-20'),
                                        message: '联系人姓名格式不正确',
                                    } : {},
                                    ],
                                })(
                                    edit ? <Input placeholder="请填写" /> :
                                        <span>
                                            {materialContacts || '/'}
                                        </span>
                                    )

                            }
                        </FormItem>
                        <FormItem required={false} label="联系号码" {...formItemLayout}>
                            {
                                getFieldDecorator('materialContactsPhone', {
                                    initialValue: materialContactsPhone,
                                    rules: [
                                        edit ? {
                                            required: true,
                                            pattern: getRegExp('mobile|landline'),
                                            message: '联系号码格式不正确',
                                        } : {},
                                    ]
                                })(
                                    edit ? <Input placeholder="请填写" /> :
                                        <span>
                                            {materialContactsPhone || '/'}
                                        </span>
                                    )

                            }
                        </FormItem>
                        <FormItem required={false} label="地址" {...formItemLayout}>
                            {
                                getFieldDecorator('materialAddress', {
                                    initialValue: materialAddress ? materialAddress : undefined,
                                    rules: [{
                                        validator: this.validatorSelectCity,
                                    }
                                    ]
                                })
                                    (
                                    edit ? <SelectCity params={this.selectCityParams(materialAddress ? materialAddress : undefined)} /> :
                                        <span>
                                            {
                                                !materialAddress && !materialAddressDetail ?
                                                    '/' :
                                                    `${materialAddress && materialAddress.selectName.join('')} ${materialAddressDetail}`
                                            }
                                        </span>
                                    )
                            }

                        </FormItem>
                        {
                            <FormItem style={!edit ? { display: 'none' } : {}} label=" " required={false} colon={false} {...formItemLayout}>
                                {
                                    getFieldDecorator('materialAddressDetail', {
                                        initialValue: materialAddressDetail,
                                        rules: [
                                            edit ? {
                                                required: true,
                                                max: 100,
                                                message: '请控制在100个字之内',
                                            } : {}
                                        ],
                                    })(
                                        edit ? <TextArea placeholder="请填写详细地址" /> :
                                            <span>{materialAddressDetail}</span>
                                        )

                                }
                            </FormItem>
                        }
                    </span>
                }

            </Form>
        )
    }
}
const AddressForm = Form.create()(Address);


const mapStateToProps = (state: Any.Store): TStateProps => {
    const data = state.get('materialsReducer');
    return {
        policypackageFetching: data.get('policypackageFetching'),
        approvePolicypackageFetching: data.get('approvePolicypackageFetching'),
        submitPolicypackageFetching: data.get('submitPolicypackageFetching'),
        policypackageData: data.get('policypackageData'),
    }
}
const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Materials);

