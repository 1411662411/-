const ATTR = 'social/req/payment/tw/submit'
export const LOADING = `${ATTR}/loading`;


export const setLoading = (params) => ({
    type: LOADING,
    params,
});