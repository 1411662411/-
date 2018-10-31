import { is } from 'immutable';

/**
 * react shouldComponentUpdate 性能优化
 * @param nextProps {Object} 下一次的props
 * @param nextState {Object} 下一次的state
 */
export const shouldComponentUpdate = (_this, nextProps, nextState) => {
    nextProps = nextProps || {};
    nextState = nextState || {};
    const thisProps = _this.props || {};
    const thisState = _this.state || {};
    if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
        Object.keys(thisState).length !== Object.keys(nextState).length) {
        return true;
    }
    for (const key in nextProps) {
        if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
            return true;
        }
    }
    for (const key in nextState) {
        if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
            return true;
        }
    }
    return false;
}