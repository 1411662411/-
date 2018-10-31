import React from 'react';
import SingleAccountList from '../../businessComponents/policyPackage/singleAccountList';

class  SingleAccountManageList  extends React.Component<{}, any> {
    render() {
        return (
            <SingleAccountList type={3} />
        )
    }
}
export default SingleAccountManageList;