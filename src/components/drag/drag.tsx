import React from 'react'
import './drag.less'
import {
    Icon,
    Input,
    Popconfirm,
    message
    } from 'antd'
    import { connect } from 'react-redux';
import {
  isChangeColorDis,
  poicyEncycleSortDis
} from '../../action/socialEncycleAction/socialEncycleAction';
const classMap = {
  0:'oneCategory',
  1:'twoCategory',
  2:'threeCategory',
  3:'fourCategory',
  4:'fiveCategory'
}
import Bubble from './bubble'
const mapStatus:any={
    1:'待审核',
    2:'通过',
    3:'驳回'
}
class Drag extends React.Component<any,any>{
   constructor(props) {
    super(props);
    this.state = {
          data:this.props.dataListsss,
          isShowInput:false,
          index:'',
          isaddClass:'',
          inputValue:'',
        };
  }
  componentWillMount(){
      this.setState({
        isaddClass:this.props.isaddClass
      })
  }
  componentWillReceiveProps (nextProps){
    if(nextProps.isaddClass){
      this.setState({
        isaddClass:nextProps.dataListsss.length-1,
      })
    }
    this.setState({
      data:nextProps.dataListsss,
    })
  }
  dragged:any//鼠标点击的元素
  over:any//经过的元素
  dragStart(e) {
    this.dragged = e.currentTarget;
  }
dragOver(e) {
    e.preventDefault();
    this.dragged.style.display = "none";
    
    if (e.target.tagName !== "LI") {
      return;
    }
    //判断当前拖拽target 和 经过的target 的 newIndex

    const dgIndex = JSON.parse(this.dragged.dataset.item).newIndex;
    const taIndex = JSON.parse(e.target.dataset.item).newIndex;
    const animateName = dgIndex > taIndex ? "drag-up" : "drag-down";


    if (this.over && e.target.dataset.item !== this.over.dataset.item) {
      this.over.classList.remove("drag-up", "drag-down");
    }

    if(!e.target.classList.contains(animateName)) {
      e.target.classList.add(animateName);
      this.over = e.target;
    }
  }
  dragEnd(e,i) {
    this.dragged.style.display = 'block';
    e.target.classList.remove("drag-up");
    this.over.classList.remove("drag-up");
    
    e.target.classList.remove("drag-down");
    this.over.classList.remove("drag-down");
    
    let data = this.state.data;
    let from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);
    data.splice(to, 0, data.splice(from, 1)[0]);

    //set newIndex to judge direction of drag and drop
    data = data.map((doc, index)=> {
      doc.newIndex = index + 1;
      return doc;
    })
    this.setState({data: data,isaddClass:to});
    let count = data[0].classTop
    let classNammeTop = classMap[count]
    console.log(data)
    const {dispatch}=this.props
    dispatch(isChangeColorDis({classic:classNammeTop,index:to,id:data[0].id},this.props))
    let idList:any = []
    data.map((v,i)=>{
        idList.push(v.id)
    })
    console.log(idList)
    let idPrams = idList.join(',')
    console.log(`'${idPrams}'`)
    dispatch(poicyEncycleSortDis({idString:idPrams}))
  }
isShowInput(i,e,item){
    this.setState({
        isShowInput:true,
        index:i,
        inputValue:item.categoryName
    })
}
inputtext(e,which,index,id){
    if(e.target.value.length>7){
      return message.error('输入内容少于7个字')
    }
    this.setState({
        isShowInput:false,
        isaddClass:index,
        
    })
    const {dispatch}=this.props
    if(e.target.value===''){
      message.error('请添加类目信息')
      dispatch(isChangeColorDis({classic:which,index:index,id:id},this.props))
      return
    }else{
      this.props.sonInput({
          value:e.target.value,
          topClass:which,
          index,
          id:id
      })
    }
   
}

sonInfo(){
    return this.state.data
}

changeColor(index,e,id){
  e.stopPropagation();
   this.setState({
     isaddClass:index
   })
   const {dispatch}=this.props
    dispatch(isChangeColorDis({classic:this.props.topClass,index:index,id:id},this.props))
}
 showIcon(mode:any){
   this.setState({
     isaddClass:0
   })
   const {dispatch}=this.props
    dispatch(isChangeColorDis({classic:mode.classic,index:0,id:mode.id},this.props))
   this.props.showIcon({e:mode.e,id:mode.id,categoryName:mode.categoryName,classic:mode.classic,index:mode.index,v:mode.v})
 }
 showcon(mode:any){
  
   this.props.showIcon({e:mode.e,id:mode.id,categoryName:mode.categoryName,classic:mode.classic,index:mode.index,v:mode.v})
 }
 inputTextChange(e){
    this.setState({
      inputValue:e.target.value
    })
 }
 inputBlurChange(){
    this.setState({
      isShowInput:false
    })
 }
  render() {
    const classTopName = this.props.topClass
    let color0:any = null
    let color1:any = null
    let color2:any = null
    let color3:any = null
    let color4:any = null
    if(classTopName=='oneCategory'){
       color0= this.props.isChangeColor[0].index
    }
    if(classTopName=='twoCategory'){
      color1= this.props.isChangeColor[1].index
    }
    if(classTopName=='threeCategory'){
      color2= this.props.isChangeColor[2].index
    }
    if(classTopName=='fourCategory'){
      color3= this.props.isChangeColor[3].index
    }
    if(classTopName=='fiveCategory'){
      color4= this.props.isChangeColor[4].index
    }
    let listItems = this.state.data.map((item, i) => {
        if(this.state.index===i&&this.state.isShowInput){
            return<li style={{height: "30px", border: "solid 1px #22baa0", }}>
                    <Input 
                      autoFocus={true} 
                      value={this.state.inputValue} 
                      onChange={(e)=>{this.inputTextChange(e)}}
                      onBlur={()=>{this.inputBlurChange()}}
                      onPressEnter={(e)=>{this.inputtext(e,this.props.topClass,i,item.id)}}
                    />
                  </li> 
        }
      
        if(color0===i||color1===i||color2===i||color3===i||color4===i){
           return (
              <li 
                data-id={i}
                key={i}
                style={{height: "30px", border: "solid 1px #22baa0",}}
                draggable={true}
                onDragEnd={(e)=>this.dragEnd(e,i)}
                onDragStart={this.dragStart.bind(this)}
                data-item={JSON.stringify(item)}
                onDoubleClick={(e)=>this.isShowInput(i,e,item)}
                onClick={(e)=>this.changeColor(i,e,item.id)}
                className='catygeory-select'
              ><span>{item.categoryName}</span>{item.auditStatus&&item.auditStatus!=2?<Bubble text={mapStatus[item.auditStatus]}/>:null}
              {item.children
                ?
                <Popconfirm title="当前类目存在子类，请先删除完子类" okText="是" cancelText="否">
                    <Icon type="close" style={{color:'red'}} className='icon-position'/>
                </Popconfirm>:
                (item.auditStatus
                  ?
                  <Popconfirm title="当前类目存在文章内容，删除此类目将同时删除文章内容，请确认" onConfirm={(e)=>this.showIcon({e:e,id:item.id,categoryName:item.categoryName,classic:classTopName,index:i,v:item})} okText="是" cancelText="否">
                    <Icon type="close" style={{color:'red'}} className='icon-position'/>
                  </Popconfirm>
                  :
                  <Popconfirm title={`正在删除${item.categoryName}类目，请确认`} onConfirm={(e)=>this.showIcon({e:e,id:item.id,categoryName:item.categoryName,classic:classTopName,index:i,v:item})} okText="是" cancelText="否">
                    <Icon type="close" style={{color:'red'}} className='icon-position'/>
                  </Popconfirm>
                  
                )
            }

            </li>
            ) 
        }
        else{
             return (
              <li 
                data-id={i}
                key={i}
                style={{height: "30px", border: "solid 1px #22baa0", }}
                draggable={true}
                onDragEnd={this.dragEnd.bind(this)}
                onDragStart={this.dragStart.bind(this)}
                data-item={JSON.stringify(item)}
                onDoubleClick={(e)=>this.isShowInput(i,e,item)}
                onClick={(e)=>this.changeColor(i,e,item.id)}
              ><span>{item.categoryName}</span>{item.auditStatus&&item.auditStatus!=2?<Bubble text={mapStatus[item.auditStatus]}/>:null}
               {item.children
                ?
                <Popconfirm title="当前类目存在子类，请先删除完子类" okText="是" cancelText="否">
                    <Icon type="close" style={{color:'red'}} className='icon-position'/>
                </Popconfirm>:
                (item.auditStatus
                  ?
                  <Popconfirm title="当前类目存在文章内容，删除此类目将同时删除文章内容，请确认"  okText="是" cancelText="否">
                    <Icon type="close" style={{color:'red'}} className='icon-position'/>
                  </Popconfirm>
                  :
                  <Popconfirm title={`正在删除${item.categoryName}类目，请确认`} onConfirm={(e)=>this.showIcon({e:e,id:item.id,categoryName:item.categoryName,classic:classTopName,index:i,v:item})} okText="是" cancelText="否">
                    <Icon type="close" style={{color:'red'}} className='icon-position'/>
                  </Popconfirm>
                )
            }
            </li>
            )
        }
     
     });
    return (
      <ul onDragOver={this.dragOver.bind(this)} className ="aaaa">
        {listItems}
      </ul>
    )
  }
}
const mapStateToProps = (state, ownProps: any): any => {
    let data = state.get('socialEncycleListReducer');
    data = data.toJS()
    return {
      isChangeColor:data.isChangeColor,
      categoryList:data.categoryList
    }
}; 

export default connect(mapStateToProps)(Drag);
// export default Drag