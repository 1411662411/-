export const PAYEEMANAGEMENT_SAGA = 'PAYEEMANAGEMENT_SAGA';
export const PAYEEMANAGEMENT_REDUCERS = 'PAYEEMANAGEMENT_REDUCERS';
export const PAYEESOURCE_SAGA = 'PAYEESOURCE_SAGA';
export const PAYEESOURCE_REDUCERS = 'PAYEESOURCE_REDUCERS';
export const FETCHING = 'PAYEEMANAGEMENT_FETCHING';

export const payeeManagementSaga = (params) => {
    return {
        type: PAYEEMANAGEMENT_SAGA,
        params,
    }
};
export const payeeManagementReducers = (params) => {
    return {
        type: PAYEEMANAGEMENT_REDUCERS,
        params,
    }
};
export const payeesourceSaga = (params) => {
    return {
        type: PAYEESOURCE_SAGA,
        params,
    }
};
export const payeesourceReducers = (params) => {
    return {
        type: PAYEESOURCE_REDUCERS,
        params,
    }
};
export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}