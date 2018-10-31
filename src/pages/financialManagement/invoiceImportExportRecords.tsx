import React, { Component} from 'react';
import ImportExportRecords from '../../businessComponents/financialManagement/importExportRecords';
interface ImportExportRecordsProps {

}
export default class extends Component<ImportExportRecordsProps, any> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ImportExportRecords type={1}></ImportExportRecords>
        )
    }
}