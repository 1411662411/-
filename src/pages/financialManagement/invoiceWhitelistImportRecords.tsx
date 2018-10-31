import React, { Component} from 'react';
import ImportExportRecords from '../../businessComponents/financialManagement/importExportRecords';
interface ImportExportRecordsProps {

}
// /newadmin/financial/invoice/whitelist/importrecords
export default class extends Component<ImportExportRecordsProps, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ImportExportRecords type={3} title="导入历史记录"></ImportExportRecords>
        )
    }
}