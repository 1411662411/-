import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    Menu,
} from 'antd';
interface MenuItem {
    name: string;
}
interface RightMenuProps {
    menu: MenuItem[];
    onSelect?: (selectInfo: any, data?: Object) => void;
    data?: Object;
}


export default class RightMenu extends Component<RightMenuProps, any> {
    container: HTMLElement | null | Element;
    menu: JSX.Element | null;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        document.addEventListener('click', this.close);
    }
    componentWillUnMount() {
        if (this.container) {
            ReactDOM.unmountComponentAtNode(this.container);
            if(this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }
    }
    getMenu = (style) => {
        const {
            menu,
        } = this.props;
        return  (
            <div style={style}>
                <Menu onSelect={this.menuOnSelect}>
                    {
                        menu.map((value, index) => (
                            <Menu.Item key={index}>{value.name}</Menu.Item>
                        ))
                    }
                </Menu>
            </div>
        );
    }
    menuOnSelect = (selectInfo) => {
        const { onSelect, data } = this.props;
        if(onSelect && typeof onSelect === 'function') {
            onSelect(selectInfo, data);
        }
    }
    close = () => {
        if (this.container) {
            ReactDOM.unmountComponentAtNode(this.container);
        }
    }
    onRightClick = (e:React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        if (this.menu && this.container) {
            ReactDOM.unmountComponentAtNode(this.container);
        }
        this.getContainer();
        const style = {
            position: 'absolute',
            left: e.pageX,
            top: e.pageY,
            'box-shadow': '0 1px 6px rgba(0, 0, 0, 0.2)',
            'border-radius': 4,
        }
        this.menu = this.getMenu(style);
        ReactDOM.render(this.menu, this.container);
    }
    getContainer = () => {
        this.container = document.querySelector('.right-menu-warpper');
        if (!this.container) {
            const div = document.createElement('div');
            div.setAttribute('class', 'right-menu-warpper');
            this.container = document.body.appendChild(div);
        }
        return this.container;
    }
    render() {
        return (
            <span onContextMenu={e => this.onRightClick(e)}>
                {this.props.children}
            </span>
        )
    }
}