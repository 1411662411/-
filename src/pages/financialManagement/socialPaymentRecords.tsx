import React, { Component } from 'react';
import SocialMentImportExportRecords from '../../businessComponents/socialManagement/socialMentImportExportRecords';
interface ImportExportRecordsProps {

}
class SocialPaymentRecords extends Component<ImportExportRecordsProps, any>{
    constructor(props) {
        super(props);
    }
    render() {
        return <SocialMentImportExportRecords></SocialMentImportExportRecords>
    }
}


export default SocialPaymentRecords

