import React  from 'react';

import TableUI from '../../Table/';

class ElectronicDeclaration extends React.Component<any>{
    constructor(props){
        super(props)
    }

    render(){
        if(!this.props.customerOffer){
            return false;
        }
        return <div className='electronic-declaration'>
            <TableUI 
                dataSource={this.props.customerOffer}
                colgroup={[20,30,20,30]}
            />
        </div>
    }
} 

export default ElectronicDeclaration