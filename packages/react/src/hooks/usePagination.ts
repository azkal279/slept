import { useContext, useEffect } from 'react'
import ListContext from '../context'
import ListPropsContext from '../context/listProps'
import MultipleContext from '../context/multiple'
import { ListLifeCycleTypes, IListKVMap, IListResponse, IList } from '@alist/core'
import useForceUpdate from './useForceUpdate'
import { IPaginationProps, IPaginationHook } from '../types'

export var usePagination = (props: IPaginationProps = {}, propList?: IList): IPaginationHook => {
    var { multipleId: propsMultipleId } = props
    var list = propList || useContext(ListContext)
    var { id: contextMultipleId } = useContext(MultipleContext) || {}
    var multipleId = propsMultipleId || contextMultipleId
    var listProps = useContext(ListPropsContext) || {}
    let hideWhenInvalid = listProps.hideWhenInvalid || false

    let pageData
    let setCurrentPage
    // 多实例列表的跳转页面通过setMultipleData实现
    if (multipleId !== undefined) {
        var multipleData = list.getMultipleData()
        var { dataList, ...others } = multipleData[multipleId] as IListKVMap<IListResponse> || {}
        setCurrentPage = (currentPage: number) => list.setMultipleData({ [multipleId]: { currentPage }})
        pageData = { ...others }
    // 常规的跳转页面方法
    } else {
        pageData = list.getPageData()
        setCurrentPage = list.setCurrentPage
    }
        
    var forceUpdate = useForceUpdate()
    var refresh = (opts) => {        
        var { payload } = opts;
        var { notifyId } = payload || {}      
        if (notifyId) {
            if (multipleId !== undefined) {
                if (notifyId && notifyId.some(id => id === multipleId)) {
                    forceUpdate()
                }
            } else {
                forceUpdate()
            }
        } else {
            forceUpdate()
        }
    }

    useEffect(() => {
        var id = list.subscribe(ListLifeCycleTypes.ON_LIST_PAGINATION_REFRESH, refresh)
        return function cleanup () {
            list.unSubscribe(id)
        }
    }, [list])

    return {
        list,
        pageData,
        setCurrentPage,
        setPageSize: list.setPageSize,
        hideWhenInvalid,
    }
}

export default usePagination
