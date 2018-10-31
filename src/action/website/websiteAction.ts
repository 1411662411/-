
export const ACTIVITY_LIST_DISPATCH = 'ACTIVITY_LIST_DISPATCH';
export const ACTIVITY_LIST_RECIV = 'ACTIVITY_LIST_RECIV';

export const ACTIVITY_ISRELEASE_DISPATCH = 'ACTIVITY_ISRELEASE_DISPATCH';
export const ACTIVITY_ISRELEASE_RECIV = 'ACTIVITY_ISRELEASE_RECIV';

export const ACTIVITY_CHECK_DISPATCH = 'ACTIVITY_CHECK_DISPATCH';
export const ACTIVITY_CHECK_RECIV = 'ACTIVITY_CHECK_RECIV';

export const ACTIVITY_SIGNUP_DISPATCH = 'ACTIVITY_SIGNUP_DISPATCH';
export const ACTIVITY_SIGNUP_RECIV = 'ACTIVITY_SIGNUP_RECIV';

export const ACTIVITY_ADD_DISPATCH = 'ACTIVITY_ADD_DISPATCH';
export const ACTIVITY_ADD_RECIV = 'ACTIVITY_ADD_RECIV';

export const ACTIVITY_AREA_DISPATCH = 'ACTIVITY_AREA_DISPATCH';
export const ACTIVITY_AREA_RECIV = 'ACTIVITY_AREA_RECIV';

export const ACTIVITY_CREATOR_DISPATCH = 'ACTIVITY_CREATOR_DISPATCH';
export const ACTIVITY_CREATOR_RECIV = 'ACTIVITY_CREATOR_RECIV';

export const ACTIVITY_EXPORTSIGNUP_DISPATCH = 'ACTIVITY_EXPORTSIGNUP_DISPATCH';
export const ACTIVITY_EXPORTSIGNUPLIST_RECIV = 'ACTIVITY_EXPORTSIGNUPLIST_RECIV';

export const ACTIVITY_ISRELEASESTATUS_DISPATCH = 'ACTIVITY_ISRELEASESTATUS_DISPATCH';
export const ACTIVITY_ISRELEASESTATUS_RECIV = 'ACTIVITY_ISRELEASESTATUS_RECIV';

export const ACTIVITY_LOADING_RECIV = 'ACTIVITY_LOADING_RECIV';

export const ACTIVITY_DATALISTLOADING_RECIV = 'ACTIVITY_DATALISTLOADING_RECIV';
export const dataLoadingRecieve = (params) => {
    return {
        type: ACTIVITY_DATALISTLOADING_RECIV,
        params,
    }
};

export const LoadingRecieve = (params) => {
    return {
        type: ACTIVITY_LOADING_RECIV,
        params,
    }
};


export const activityIsrealeaseStatusDis = (params) => {
    return {
        type: ACTIVITY_ISRELEASESTATUS_DISPATCH,
        params,
    }
};
export const activityIsrealeaseStatusReciv = (params) => {
    return {
        type: ACTIVITY_ISRELEASESTATUS_RECIV,
        params,
    }
};



export const activityExportSignUpListDis = (params) => {
    return {
        type: ACTIVITY_EXPORTSIGNUP_DISPATCH,
        params,
    }
};
export const activityExportSignUpListReciv = (params) => {
    return {
        type: ACTIVITY_EXPORTSIGNUPLIST_RECIV,
        params,
    }
};



export const activityCreatorDis = (params) => {
    return {
        type: ACTIVITY_CREATOR_DISPATCH,
        params,
    }
};
export const activityCreatorReciv = (params) => {
    return {
        type: ACTIVITY_CREATOR_RECIV,
        params,
    }
};

export const activityAreaDis = (params) => {
    return {
        type: ACTIVITY_AREA_DISPATCH,
        params,
    }
};
export const activityAreaReciv = (params) => {
    return {
        type: ACTIVITY_AREA_RECIV,
        params,
    }
};

export const activityAddDis = (params,callback?) => {
    return {
        type: ACTIVITY_ADD_DISPATCH,
        params,
        callback
    }
};
export const activityAddReciv = (params) => {
    return {
        type: ACTIVITY_ADD_RECIV,
        params,
    }
};



export const activitySignUpDis = (params) => {
    return {
        type: ACTIVITY_SIGNUP_DISPATCH,
        params,
    }
};
export const activitySignUpReciv = (params) => {
    return {
        type: ACTIVITY_SIGNUP_RECIV,
        params,
    }
};

export const activityCheckDis = (params) => {
    return {
        type: ACTIVITY_CHECK_DISPATCH,
        params,
    }
};
export const activityCheckReciv = (params) => {
    return {
        type: ACTIVITY_CHECK_RECIV,
        params,
    }
};


export const activityListDis = (params) => {
    return {
        type: ACTIVITY_LIST_DISPATCH,
        params,
    }
};
export const activityListReciv = (params) => {
    return {
        type: ACTIVITY_LIST_RECIV,
        params,
    }
};


export const activityIsReleaseDis = (params,callback?) => {
  
    return {
        type: ACTIVITY_ISRELEASE_DISPATCH,
        params,
        callback,
    }
};
export const activityIsReleaseReciv = (params) => {
    return {
        type: ACTIVITY_ISRELEASE_RECIV,
        params,
    }
};
