import React from 'react';
import {Spin} from 'antd';
import WorkReportTemplate from '../../../../components/crm/WorkReportTemplate';
import { DOMAIN_OXT } from "../../../../global/global";
import { fetchFn } from '../../../../util/fetch';
import { getTreeData } from '../../../../util/crmUtil';

const getEntireAPI = `${DOMAIN_OXT}/apiv2_/crm/api/workReport/template/getEntire`;
const POSITION_API = `${DOMAIN_OXT}/apiv2_/crm/openapi/dictionary/getPositionByWorkReportSet`;
const getById_API = `${DOMAIN_OXT}/apiv2_/crm/api/workReportSet/getById`;
const getBranchCompanysWithLargeAreaAPI = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/getBranchCompanysWithLargeArea`;
const getEntire =  () => fetchFn(getEntireAPI, {}).then(data=>data);
const getById =  (id) => fetchFn(getById_API, {id}).then(data=>data);
const dictionary =  (organizationId) => fetchFn(POSITION_API, {organizationId, reportType:2}).then(data=>data);
const getBranchCompanysWithLargeArea =  () => fetchFn(getBranchCompanysWithLargeAreaAPI, {defaultAll: 0}).then(data=>data);

class CrmWorkReportConfigDaily extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            loading: true,
            id: null,
            disabled: false,
            error: false,
        }
    }
    async componentWillMount(){
        if(this.props.location.state && this.props.location.state.id){
            const id = this.props.location.state.id;
            const disabled = this.props.location.state.disabled;
            try {
                document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link > span')[0].innerHTML = disabled ? '工作报告模板_查看丨周报' : '工作报告模板_编辑丨周报';
            } catch (error) {
                this.setState({error: true});
            }
            const res = await getById(id)
            this.setState({
                id,
                idData: res.data,
                disabled,
            })
        }
        const [
            entire,
            // position,
            company,
        ]:any = await Promise.all([
            getEntire(),
            // dictionary(),
            getBranchCompanysWithLargeArea(),
        ])

        // const totalCount = entire.totalCount.list;

        this.setState({
            entire: entire.data,
            // position: position.data || [],
            company: company.data || [],
        })
        setTimeout(()=> {
            this.setState({loading: false});
        },3000)
    }
    componentDidMount(){
        if(this.state.error){
            const disabled = this.props.location.state.disabled;
            document.querySelectorAll('.ant-breadcrumb .ant-breadcrumb-link > span')[0].innerHTML = disabled ? '工作报告模板_查看丨周报' : '工作报告模板_编辑丨周报';
        }
    }
    getPosition = async(id) => {
        const position = await dictionary(id)
        this.setState({ 
            position: position.data || [],
            positionId: undefined,
            positionName: undefined,
        })
    }
    render(){
        const {loading, company, position} = this.state;
        return <Spin
            className='fixed-center'
            size="large" 
            tip="加载中..." 
            spinning={loading}
        >
            {
                !loading && <WorkReportTemplate 
                    type='weekly'
                    position={position}
                    getPosition={this.getPosition}
                    id={this.state.id ? this.state.idData.id : undefined}
                    disabled={this.state.disabled}
                    positionId={this.state.id ? this.state.idData.positionId : undefined}
                    positionName={this.state.id ? this.state.idData.positionName : undefined}
                    organizationId={this.state.id ? this.state.idData.organizationId : undefined}
                    organizationName={this.state.id ? this.state.idData.organizationName : undefined}
                    company = {getTreeData(company,'name', 'id', 'children')}
                    data={this.state.id ? JSON.parse(this.state.idData.content) : this.state.entire}
                    deadLine={this.state.id ? this.state.idData.deadLine : undefined}
                    deadLineOfWeek={this.state.id ? this.state.idData.deadLineOfWeek : undefined}
                />
            }
        </Spin>
    }
}

export default CrmWorkReportConfigDaily