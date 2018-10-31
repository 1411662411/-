

export const SEARCH_SOCIAL_MATERIAL_PLICY_DISPATCH = 'SEARCH_SOCIAL_MATERIAL_PLICY_DISPATCH'
export const SEARCH_SOCIAL_MATERIAL_PLICY_SAGA = 'SEARCH_SOCIAL_MATERIAL_PLICY_SAGA'
export const SEARCH_SOCIAL_MATERIAL_PLICY_RECEIVED = 'SEARCH_SOCIAL_MATERIAL_PLICY_RECEIVED'

export const SEARCH_SOCIAL_MATERIAL_LIST_DISPATCH = 'SEARCH_SOCIAL_MATERIAL_LIST_DISPATCH'
export const SEARCH_SOCIAL_MATERIAL_LIST_SAGA = 'SEARCH_SOCIAL_MATERIAL_LIST_SAGA'
export const SEARCH_SOCIAL_MATERIAL_LIST_RECEIVED = 'SEARCH_SOCIAL_MATERIAL_LIST_RECEIVED'

export const SEARCH_SOCIAL_MATERIAL_EXPORT_DISPATCH = 'SEARCH_SOCIAL_MATERIAL_EXPORT_DISPATCH'
export const SEARCH_SOCIAL_MATERIAL_EXPORT_SAGA = 'SEARCH_SOCIAL_MATERIAL_EXPORT_SAGA'
export const SEARCH_SOCIAL_MATERIAL_EXPORT_RECEIVED = 'SEARCH_SOCIAL_MATERIAL_EXPORT_RECEIVED'

export const SEARCH_SOCIAL_MATERIAL_LOADING_RECEIVED = 'SEARCH_SOCIAL_MATERIAL_LOADING_RECEIVED'
export const SEARCH_SOCIAL_MATERIAL_FETCHING_RECEIVED = 'SEARCH_SOCIAL_MATERIAL_FETCHING_RECEIVED'

export const searchSocialLoadingExportDis = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_LOADING_RECEIVED,
        params,
    }
}

export const searchSocialFechingExportDis = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_FETCHING_RECEIVED,
        params,
    }
}



export const searchSocialListExportDis = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_EXPORT_DISPATCH,
        params,
    }
}

export const searchSocialListExportSaga = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_EXPORT_SAGA,
        params,
    }
}
export const searchSocialListExportRecived = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_EXPORT_RECEIVED,
        params,
    }
}



export const searchSocialMaterialDis = (params)=>{
    return {
        type: SEARCH_SOCIAL_MATERIAL_PLICY_DISPATCH,
        params,
    }
}

export const searchSocialMaterialSaga = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_PLICY_SAGA,
        params,
    }
}
export const searchSocialMaterialRecived = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_PLICY_RECEIVED,
        params,
    }
}




export const searchSocialListMaterialDis = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_LIST_DISPATCH,
        params,
    }
}

export const searchSocialListMaterialSaga = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_LIST_SAGA,
        params,
    }
}
export const searchSocialListMaterialRecived = (params) => {
    return {
        type: SEARCH_SOCIAL_MATERIAL_LIST_RECEIVED,
        params,
    }
}