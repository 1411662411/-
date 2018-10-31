export const MAILSET_SAGA = 'MAILSET_SAGA';
export const MAILSET_REDUCERS = 'MAILSET_REDUCERS';
export const USER_BY_ORGANIZATIONS_SAGA = 'MAILSET_USER_BY_ORGANIZATIONS_SAGA';
export const USER_BY_ORGANIZATIONS_REDUCERS = 'MAILSET_USER_BY_ORGANIZATIONS_REDUCERS';
export const FETCHING = 'MAILSET_FETCHING';

export const mailsetSaga = (params) => {
    return {
        type: MAILSET_SAGA,
        params,
    }
};
export const mailsetReducers = (params) => {
    return {
        type: MAILSET_REDUCERS,
        params,
    }
};
export const userByOrganizationsSaga = (params) => {
    return {
        type: USER_BY_ORGANIZATIONS_SAGA,
        params,
    }
};
export const userByOrganizationsReducers = (params) => {
    return {
        type: USER_BY_ORGANIZATIONS_REDUCERS,
        params,
    }
};
export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}