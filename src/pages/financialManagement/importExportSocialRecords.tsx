import React ,{ Component } from 'react';
import PayinfoimportExportRecords from '../../businessComponents/financialManagement/payinfoimportExportRecords';
interface ImportExportRecordsProps {

}
class ImportExportSocialRecords extends Component<ImportExportRecordsProps, any>{
    constructor(props) {
        super(props);
    }
    render(){
        return <PayinfoimportExportRecords type={1}></PayinfoimportExportRecords>
    }
}


export default ImportExportSocialRecords