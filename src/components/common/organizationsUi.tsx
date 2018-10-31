import * as React from 'react';
import {
    Select, TreeSelect
} from 'antd';
const { Option, OptGroup } = Select;

interface OrganizationsProps {
    dataSource?: any;
    onChange?: any;
    onSelect?: any;
    initValue?: any;
    needAll?:boolean;

    child?: string;  //子集名称
    department?: string;    //组织名称
    mode?: 'multiple' | 'tags' | 'combobox';
    renderValue?: (item) => string;
    width?: number | string;
    note?: string;
    renderBody?: true | false;
}
export class Organizations extends React.Component<OrganizationsProps, any> {

    employeesMap:any;
    constructor(props) {
        super(props)
        this.employeesMap = {}
        this.state={
            child: props.child || 'subDepartment',
            department: props.department || 'department',
            note: props.note || 'userName',
        }
        // this.employeesMap = {};
    }
    renderOrganizations = (data) => {
        const {child, department, note} = this.state;
        if (!data || !data[department]) return;
        let that = this;
        const {needAll,onChange,initValue,onSelect} = this.props;
        const employees = data.employees;
        const subDepartment = data[child];
        const employeeOptions: Array<JSX.Element> = [];
        employees && employees.map((employee) => {
            that.employeesMap[employee.id] = employee;
            employeeOptions.push(<Option 
                value={this.props.renderValue ? this.props.renderValue(employee) : employee.id} 
                data-username={employee.name} 
                data-mail={employee.email}
                data-phone={employee.phone}
                >-{employee.name}({employee[note]})</Option>)
            
        })
        // 默认需要全部 
        const isAll =needAll==undefined?true:needAll;
        return (
            <Select
                showSearch
                style={{ width: this.props.width || 250 }}
                placeholder='请选择'
                onChange={(value)=>{onChange && onChange(value,this.employeesMap)}}
                // onChange={onChange}
                optionFilterProp="children"
                optionLabelProp='children'
                defaultValue={initValue}
                // onSelect={onSelect}
                onSelect={(value,option)=>{onSelect && onSelect(value,option,this.employeesMap)}}
                getPopupContainer={ this. props.renderBody ? undefined : () => document.getElementById('popupWrap') as HTMLElement}
                // onSearch={onChange}
                mode={this.props.mode ? this.props.mode : undefined}
            >
                {isAll ? <OptGroup label="">
                    <Option value=''>全部</Option>
                </OptGroup >:[]}
                
                <OptGroup label={data[department]} key={data[department]}>
                    {employeeOptions}
                    {(subDepartment && subDepartment.length > 0) ? this.addSubDepartment(subDepartment):[]}
                </OptGroup>
            </Select>

        )


    }
    addSubDepartment = (data) => {
        const {child, department, note} = this.state;
        if (!data || data.length <= 0) return;
        let employees;
        var subDepartment;
        const that = this;

        const addSubDepartmentOptions: Array<JSX.Element> = [];

        data.map( (sub) => {
            const employeeOptions: Array<JSX.Element> = [];

            employees = sub.employees || [];
            subDepartment = sub[child] || [];

            employees.map( (employee) => {
                that.employeesMap[employee.id] = employee;
                employeeOptions.push(<Option value={this.props.renderValue ? this.props.renderValue(employee) : employee.id}  data-username={employee.name} data-phone={employee.phone} data-mail={employee.email}>-{employee.name}({employee[note]})</Option>)
            })
            addSubDepartmentOptions.push(<OptGroup label={sub[department]} key={sub[department]}>
                {employeeOptions}
                {(subDepartment && subDepartment.length > 0) ? that.addSubDepartment(subDepartment) : []}
            </OptGroup>)
        })

        return addSubDepartmentOptions

    }

    
    render() {
        const { dataSource } = this.props;
        // const data = [...Array(20).keys()];
        const items = [];
        /*const treeData = [{
            label: 'Node1',
            value: '0-0',
            key: '0-0',
            children: [{
                label: 'Child Node1',
                value: '0-0-1',
                key: '0-0-1',
            }, {
                label: 'Child Node2',
                value: '0-0-2',
                key: '0-0-2',
            }],
            }, {
            label: 'Node2',
            value: '0-1',
            key: '0-1',
        }];
        for (let i = 0; i < 1000; i++) {
            items.push({
            label: 'Node1'+i,
            value: '0-0'+i,
            key: '0-0'+i,
            children: [{
                label: 'Child Node1'+i,
                value: '0-0-1'+i,
                key: '0-0-1'+i,
            }, {
                label: 'Child Node2'+i,
                value: '0-0-2'+i,
                key: '0-0-2'+i,
            }, {
                label: 'Child Node3'+i,
                value: '0-0-3'+i,
                key: '0-0-3'+i,
            }, {
                label: 'Child Node4'+i,
                value: '0-0-4'+i,
                key: '0-0-4'+i,
            }, {
                label: 'Child Node5'+i,
                value: '0-0-5'+i,
                key: '0-0-5'+i,
            }, {
                label: 'Child Node6'+i,
                value: '0-0-6'+i,
                key: '0-0-6'+i,
            }]});
        }
        return (
      <TreeSelect
        style={{ width: 300 }}
        
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={items}
        placeholder="Please select"
        treeDefaultExpandAll
      />
    );*/
        /*for (let i = 0; i < 1000; i++) {
            items.push(
            <OptGroup label={`OptGroup${i}`}>
                <Option value={`jack1${i}`}>{`jack${i}`}</Option>
                <Option value={`Lucy2${i}`}>{`Lucy${i}`}</Option>
                <Option value={`jack3${i}`}>{`jack${i}`}</Option>
                <Option value={`Lucy4${i}`}>{`Lucy${i}`}</Option>
                <Option value={`jack5${i}`}>{`jack${i}`}</Option>
                <Option value={`Lucy6${i}`}>{`Lucy${i}`}</Option>
                <Option value={`jack7${i}`}>{`jack${i}`}</Option>
                <Option value={`Lucy8${i}`}>{`Lucy${i}`}</Option>
                <Option value={`jack9${i}`}>{`jack${i}`}</Option>
                <Option value={`Lucy11${i}`}>{`Lucy${i}`}</Option>
                <Option value={`jack12${i}`}>{`jack${i}`}</Option>
                <Option value={`Lucy13${i}`}>{`Lucy${i}`}</Option>
                <Option value={`jack14${i}`}>{`jack${i}`}</Option>
                <Option value={`Lucy15${i}`}>{`Lucy${i}`}</Option>
            </OptGroup>
            )
        }
        
        return <Select
                    showSearch
                    style={{ width: 200 }}
                    
                >
                     {items}
                </Select>*/
        return <div style={{ position: 'relative', textAlign: 'left' }} id="popupWrap">{this.renderOrganizations(dataSource)}</div>

    }
}