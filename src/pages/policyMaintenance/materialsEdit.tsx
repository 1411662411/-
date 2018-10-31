import React from 'react';
import Materials from '../../businessComponents/policyMaintenance/materials';
import {
    message,
} from 'antd';

const MaterialsEdit = ({location}) => {
    let {
        policyId,
        role,
    } = location.query;
    role = parseInt(role, 10);
    return (
        <Materials role={role} edit={true} policyId={policyId} />
    )
}
export default MaterialsEdit;
