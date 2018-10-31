const createActionCreator =
    (type: string) => (payload?: any, extra?: object) => ({ type, payload, ...extra })

export default createActionCreator