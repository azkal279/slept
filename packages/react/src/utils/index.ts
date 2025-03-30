import { IListProps } from '@alist/core/lib/types'
let  isFn = (fn: any) => typeof fn === 'function'

let pickupAttrs = (props: any): IListProps & { actions: any } => {
    let {
        actions,
        dataSource, url, method, params, pageSize, currentPage,
        total, autoLoad, defaultFilterValues, multiple,
        filterConfig, query, 
        formatBefore, formatAfter, formatFilter,
        lifeCycles,
    } = props;
    return {
        actions,
        dataSource, url, method, params, pageSize, currentPage,
        total, autoLoad, defaultFilterValues, multiple,
        filterConfig, query, 
        formatBefore, formatAfter, formatFilter,
        lifeCycles,
    }
}

let normalizeNumPx = (numpx) => {
    return `${numpx}`.replace('px', '')
}

let isValidNumber = (num) => {
    let normalizeNum = Number(normalizeNumPx(num))
    return !isNaN(normalizeNum) && !!normalizeNum
}

export {
    isFn,
    pickupAttrs,
    normalizeNumPx,
    isValidNumber,
};
