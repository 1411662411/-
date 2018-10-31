import Immutable from 'immutable'
import { RECEIVE_EXAMPLE, RECEIVE_COMPANY_LIST, RECEIVE_DETAIL } from '../../action/businessComponents/chapterInfoAction'

const initialState = Immutable.fromJS({
    temp: 'temp value',
    company: [],
    detail: {}
})

export default (state = initialState, action) => {
    const { type, payload, extra } = action
    switch (type) {
        case RECEIVE_EXAMPLE:
            return state.update('temp', () => payload)
        case RECEIVE_COMPANY_LIST:
            return state.update('company', () => Immutable.fromJS(payload))
        case RECEIVE_DETAIL:
            return state.update('detail', () => Immutable.fromJS(payload))
        default:
            return state
    }
}