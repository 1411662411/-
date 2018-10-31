export const SOCIAL_PAYMENT_SAGA = 'SOCIAL_PAYMENT_SAGA';
export const DATA_RECEIVED = 'SOCIAL_PAYMENT_DATA_RECEIVED';
export const ISFETCHING = 'GATHERING_INFO_ISFETCHING';
export const GET_COUNT_NUMBER = 'GET_COUNT_NUMBER';
export const GET_COUNT_NUMBER_SAGA = 'GET_COUNT_NUMBER_SAGA';
export const socialPayment = (params) => {
    return {
        type: SOCIAL_PAYMENT_SAGA,
        params,
    };
}
export const getCountNumber = (params) =>{
    return{
        type: GET_COUNT_NUMBER_SAGA,
        params,
    }
}
export const getCountNumberReceived = (params) =>{
    return {
        type: GET_COUNT_NUMBER,
        params,
    }
}
export const socialPaymentReceived = (params) => {
    return {
        type: DATA_RECEIVED,
        params,
    }
}

export const isFetching = (params) => {
    return {
        type: ISFETCHING,
        params,
    }
}