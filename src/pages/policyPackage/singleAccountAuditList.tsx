import React from 'react';
import SingleAccountList from '../../businessComponents/policyPackage/singleAccountList';

class  SingleAccountAuditList  extends React.Component<{}, any> {
    render() {
        return (
            <SingleAccountList type={1} />
        )
    }
}
export default SingleAccountAuditList;