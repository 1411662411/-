export const SINGLE_INFO_DISPACH = 'SINGLE_INFO_DISPACH'
export const SINGLE_INFO_SAGE = 'SINGLE_INFO_SAGE'
export const SINGLE_INFO_RECIEVE = 'SINGLE_INFO_RECIEVE'
export const SINGLE_INFO_EDITOR_DISPATCH = 'SINGLE_INFO_EDITOR_DISPATCH'
export const SINGLE_INFO_EDITOR_SAGE = 'SINGLE_INFO_EDITOR_SAGE'
export const SINGLE_INFO_EDITOR_RECIEVE = 'SINGLE_INFO_EDITOR_RECIEVE'
export const FETCH_LOADING = 'FETCH_LOADING'
export const RECIED_LOADING = 'RECIED_LOADING'

export const receievdDispatch = (params) => {
    return {
        type: RECIED_LOADING,
        params
    }

}
export const fetchDispatch = (params) => {
    return {
        type: FETCH_LOADING,
        params
    }

}

export const singleInfoDispatch = (params)=>{
    return{
        type: SINGLE_INFO_DISPACH,
        params
    }
    
}

export const singleInfoSaga = (params)=>{
    return{
        type: SINGLE_INFO_SAGE,
        params
    }
    
}
export const singleInfoRecieved = (params) => {
    return {
        type: SINGLE_INFO_RECIEVE,
        params
    }

}
export const singleInfoEditorDispatch = (params) => {
    return {
        type: SINGLE_INFO_EDITOR_DISPATCH,
        params
    }

}
export const singleInfoEditorSaga = (params) => {
    return {
        type: SINGLE_INFO_EDITOR_SAGE,
        params
    }

}
export const singleInfoEditorRecieved = (params) => {
    return {
        type: SINGLE_INFO_EDITOR_RECIEVE,
        params
    }

}
