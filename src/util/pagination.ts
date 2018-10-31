interface pagination {
    (params: params & any, createAction: createAction<any>, dispatch: any, sessionStorageName?: string): any;
}
interface statePagination {
    (params: params & any, createAction: createAction<any> | null, dispatch: any, setCurrentPage:(current: number,size: number) => void,sessionStorageName?: string): any;
}
interface params {
    currentPage: number;
    total: number;
    pageSize: number;
}
interface createAction<T> {
    (params: T): T;
}
/**
 * @param params {Object} 参数
 * @param createAction {Function} action创建函数 
 * @param sessionStorageName {String} 缓存的key名称
 */
export const paginationConfig : pagination = (params, createAction, dispatch, sessionStorageName?) => {
    const {
        currentPage,
        total,
        pageSize,
    } = params;
    return {
        current: currentPage,
        total,
        showSizeChanger: true,
        defaultPageSize: pageSize,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        onShowSizeChange: (current, size) => {
            const newParams = {
                ...params,
                currentPage: current,
                pageSize: size,
            };

            /**
             * dispatch action
             */
            dispatch(createAction(newParams));

            /**
             * 缓存在同名的sessionStorage
             */
            sessionStorageName !== undefined && sessionStorage.setItem(sessionStorageName, JSON.stringify(newParams));
        },
        onChange: (current,size) => {
            const newParams = {
                ...params,
                currentPage: current,
                pageSize: size,
            };

            /**
             * dispatch action
             */
            dispatch(createAction(newParams));

            /**
             * 缓存在同名的sessionStorage
             */
            sessionStorageName !== undefined && sessionStorage.setItem(sessionStorageName, JSON.stringify(newParams));
        }
    }
}
/**
 * @param params {Object} 参数
 * @param createAction {Function} action创建函数 
 * @param sessionStorageName {String} 缓存的key名称
 */
export const statePaginationConfig : statePagination = (params, createAction, dispatch,setCurrentPage, sessionStorageName?) => {
    const {
        currentPage,
        total,
        pageSize,
    } = params;
    return {
        current: currentPage,
        total,
        showSizeChanger: true,
        defaultPageSize: pageSize,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        onShowSizeChange: (current, size) => {
            const newParams = {
                ...params,
                currentPage: current,
                pageSize: size,
            };
            setCurrentPage(current,size);
            /**
             * dispatch action
             */
            if(dispatch === null) {
                createAction && createAction(newParams)
            }
            else {
                createAction && dispatch(createAction(newParams));
            }
            

            /**
             * 缓存在同名的sessionStorage
             */
            sessionStorageName !== undefined && sessionStorage.setItem(sessionStorageName, JSON.stringify(newParams));
        },
        onChange: (current,size) => {
            const newParams = {
                ...params,
                currentPage: current,
                pageSize: size,
            };
            setCurrentPage(current,size);
            /**
             * dispatch action
             */
            if(dispatch === null) {
                createAction && createAction(newParams)
            }
            else {
                createAction && dispatch(createAction(newParams));
            }

            /**
             * 缓存在同名的sessionStorage
             */
            sessionStorageName !== undefined && sessionStorage.setItem(sessionStorageName, JSON.stringify(newParams));
        }
    }
}
interface mapCurrentPageToStart<T> {
    (params: T): T;
}
interface mapCurrentPageToStartParams {
    currentPage: any;
    pageSize: any;
}
export const mapCurrentPageToStart:mapCurrentPageToStart<mapCurrentPageToStartParams & any> = (params) => {
    const { currentPage, pageSize } = params;
    if(currentPage !== undefined && pageSize !== undefined) {
        let obj = {
            ...params,
            start: (Number(currentPage) > 0 ? Number(currentPage) - 1 : Number(currentPage)) * Number(pageSize),
            length: pageSize,
        }

        delete obj.pageSize;
        delete obj.currentPage;
        return obj;
    }
    return params;
}
