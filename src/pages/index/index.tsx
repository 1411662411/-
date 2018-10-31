import React  from 'react';
// import Draggable, {DraggableCore} from 'react-draggable'; // 可拖动
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';

import { Row, Col, Card, Button } from 'antd'

import Workbench from '../crm/Workbench'

import './style.less'
class Index extends React.Component {
    constructor(props) {
        super(props);
    }
    state:any = {
        ax: 0,
        ay: 0,
        bx: 0,
        by: 0,
        cx: 0,
        cy: 0,
        cards:[],
        newCard:'test01',
    }
    handleStart(e,o){
        console.log(e,o)
    }
    handleDrag = (event, node) => {
        const {x, y} = node;
        switch(event){
            case 'a':{
                this.setState({
                    ax: x,
                    ay: y,
                });
                break;
            }
            case 'b':{
                this.setState({
                    bx: x,
                    by: y,
                });
                break;
            }
            case 'c':{
                this.setState({
                    cx: x,
                    cy: y,
                });
                break;
            }
        }
        
    }
    handleStop(e,o){
        console.log(e,o)
    }

    // add = () => {
    //     let {cards, newCard} = this.state
    //     cards.push(<DragCard></DragCard>)
    //     this.setState({
    //         cards,
    //     })
    // }

    render() {
        const { 
            ax, 
            ay,
            bx, 
            by,
            cx, 
            cy,
            cards,
         } = this.state;
         console.log(cards)
        return (
            <QueueAnim>
                <div className='index' key="index">
                    <div>我是首页</div>
                    {/* <Workbench></Workbench> */}
                </div>
            </QueueAnim>
        );
    }
}
export default Index;
