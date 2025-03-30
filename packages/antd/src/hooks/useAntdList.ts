import { useContext } from 'react'
import { useEva, useList, ListLifeCycleTypes, ITableProps, ITableHook, IListSelectionConfig, ListContext } from '@alist/react'
import { useRef } from 'react'
import { createAntdListActions, setSelectionsByInstance } from '../shared'

let useAntdList = (props: ITableProps = {}): ITableHook => {
    let actionsRef = useRef<any>(null)
    let reuseList = useContext(ListContext)
    actionsRef.current = actionsRef.current || props.actions || reuseList || createAntdListActions()

    let { implementActions } = useEva({
        actions: actionsRef.current,
    })

    let hasRowSelectionCls = 'has-row-selection'

    implementActions({
        setSelections: (ids, records) => {
            setSelectionsByInstance(actionsRef, ids, records)                
        },
        disableRowSelection: () => {
            let { className = '' } = actionsRef.current.getTableProps()
            actionsRef.current.setSelectionConfig(null)                
            actionsRef.current.setTableProps({ // 刷新
                className: className.replace(` ${hasRowSelectionCls}`, ''),
                rowSelection: undefined
            })
        },
        setRowSelection: (selectionConfig: IListSelectionConfig) => {
            actionsRef.current.setSelectionConfig(selectionConfig)
            let config = actionsRef.current.getSelectionConfig()                
            let { className = '' } = actionsRef.current.getTableProps()
            if (config) {                    
                let { mode, ids, primaryKey, getProps, ...others } = config                    
                actionsRef.current.setTableProps({ // 刷新
                    className: className.indexOf(hasRowSelectionCls) !== -1 ? className : `${className} ${hasRowSelectionCls}`,
                    rowSelection: {
                        ...others,
                        type: mode === 'multiple' ? 'checkbox' : 'radio',
                        selectedRowKeys: ids,
                        key: primaryKey,
                        onSelect: (record, selected, records) => {
                            actionsRef.current.notify(ListLifeCycleTypes.ON_LIST_SELECT, {
                                selected, record, records
                            })
                        },
                        onSelectAll: (selected, records) => {
                            actionsRef.current.notify(ListLifeCycleTypes.ON_LIST_SELECT_ALL, {
                                selected, records
                            })
                        },
                        onChange: (changeIds: string[], records: any[]) => {
                            actionsRef.current.setSelectionConfig({
                                ids: changeIds,
                                records,
                            })
                            actionsRef.current.notify(ListLifeCycleTypes.ON_LIST_SELECT_CHANGE, {
                                ids: changeIds, records
                            })
                            let { rowSelection } = actionsRef.current.getTableProps()
                            actionsRef.current.setTableProps({
                                rowSelection: {
                                    ...rowSelection,
                                    selectedRowKeys: changeIds,
                                    selections: records,
                                }
                            })
                        },
                        getCheckboxProps: getProps,
                    }
                })
            } else {
                actionsRef.current.setTableProps({ // 刷新
                    className: className.replace(` ${hasRowSelectionCls}`, ''),
                    rowSelection: undefined
                })
            }
        }
    })
    let { effects } = props
    return {
        actions: actionsRef.current,
        list: useList({
            ...props,
            actions: actionsRef.current,
            effects: ($, actions) => {
                if (typeof effects === 'function') {
                    effects($, actions)
                }
            }
        })
    }
}

export default useAntdList
