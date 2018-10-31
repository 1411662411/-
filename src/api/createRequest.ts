import { fetchFn } from "../util/fetch";

const createRequest = (api: string, opt?: object) => (params?: object) => fetchFn(api, params, opt).then(res => res)

export default createRequest