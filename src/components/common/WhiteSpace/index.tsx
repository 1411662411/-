import React from 'react';

interface WhiteSpaceProps{
    size?: 'sm' | 'md' | 'lg'; //默认md  sm 10px  md 20px  lg 30px
    height?: number; //WhiteSpace 高度，将覆盖size
}
export default class WhiteSpace extends React.Component<WhiteSpaceProps>{
    constructor(props:WhiteSpaceProps) {
        super(props);
        
    }

    getHeight(){
        const {size, height} = this.props;
        let h = 20;
        if(height){
            h = height;
            return h;
        }
        if(size){
            switch (size){
                case 'sm' : h = 10; break;
                case 'md' : h = 20; break;
                case 'lg' : h = 30; break;
                default: h = 20;
            }
        }
        return h;
    }
    public render() {
        const height = this.getHeight();
        return <p style={{display: 'block', height}}></p>;
    }
}