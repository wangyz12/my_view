import { ref } from 'vue'

export function useQueryData() {
  // 级联选择器数据
  const cascaderOptionsMap = ref<Record<string, any[]>>({})
  const cascaderLoadingMap = ref<Record<string, boolean>>({})
  
  // 下拉选择器数据
  const selectOptionsMap = ref<Record<string, any[]>>({})
  const selectLoadingMap = ref<Record<string, boolean>>({})
  const selectLoadedMap = ref<Record<string, boolean>>({})
  
  // 远程搜索数据
  const remoteOptionsMap = ref<Record<string, any[]>>({})
  const remoteLoadingMap = ref<Record<string, boolean>>({})
  const remoteDebounceMap = ref<Record<string, any>>({})
  
  // 格式化级联数据 - 修复：确保返回正确的格式
  const formatCascaderData = (list: any[], props?: any): any[] => {
    if (!Array.isArray(list)) return []
    
    return list.map((item: any) => {
      // 获取 value 和 label
      const valueKey = props?.value || 'value'
      const labelKey = props?.label || 'label'
      const childrenKey = props?.children || 'children'
      
      const formattedItem: any = {
        value: item[valueKey],
        label: item[labelKey]
      }
      
      // 处理子节点
      if (item[childrenKey] && Array.isArray(item[childrenKey]) && item[childrenKey].length) {
        formattedItem.children = formatCascaderData(item[childrenKey], props)
      }
      
      return formattedItem
    })
  }
  
  // 加载级联数据
  const loadCascaderData = async (item: any) => {
    if (item.lazy) return
    if (!item.queryApi) return
    
    const field = item.field
    
    if (cascaderOptionsMap.value[field]?.length) return
    
    cascaderLoadingMap.value[field] = true
    
    try {
      const res = await item.queryApi()
      // 兼容不同的返回格式
      let data = res.data || res
      if (!Array.isArray(data)) {
        data = data?.list || data?.records || []
      }
      
      
      cascaderOptionsMap.value[field] = formatCascaderData(data, item.props)
    } catch (error) {
      cascaderOptionsMap.value[field] = []
    } finally {
      cascaderLoadingMap.value[field] = false
    }
  }
  
  // 加载下拉数据
  const loadSelectData = async (item: any, forceReload = false) => {
    const field = item.field
    
    if (!forceReload && selectLoadedMap.value[field]) return
    
    // 静态数据
    if (item.option && Array.isArray(item.option)) {
      selectOptionsMap.value[field] = item.option
      selectLoadedMap.value[field] = true
      return
    }
    
    // 远程接口
    if (item.queryApi) {
      selectLoadingMap.value[field] = true
      try {
        const params = item.queryParams || {}
        const res = await item.queryApi(params)
        let data = res.data || res || []
        
        if (item.formatData) {
          data = item.formatData(data)
        } else {
          data = data.map((itemData: any) => ({
            value: itemData[item.props?.value || 'value'] || itemData.id,
            label: itemData[item.props?.label || 'label'] || itemData.name
          }))
        }
        
        selectOptionsMap.value[field] = data
        selectLoadedMap.value[field] = true
      } catch (error) {
        console.error('加载下拉数据失败:', error)
        selectOptionsMap.value[field] = []
      } finally {
        selectLoadingMap.value[field] = false
      }
      return
    }
    
    // 字典接口
    if (item.dictType) {
      selectLoadingMap.value[field] = true
      try {
        const dictApi = (window as any).getDictData || item.dictApi
        if (dictApi) {
          const res = await dictApi(item.dictType)
          let data = res.data || res || []
          
          data = data.map((itemData: any) => ({
            value: itemData.dictValue || itemData.value,
            label: itemData.dictLabel || itemData.label
          }))
          
          selectOptionsMap.value[field] = data
          selectLoadedMap.value[field] = true
        }
      } catch (error) {
        console.error('加载字典数据失败:', error)
        selectOptionsMap.value[field] = []
      } finally {
        selectLoadingMap.value[field] = false
      }
      return
    }
    
    if (!selectOptionsMap.value[field]) {
      selectOptionsMap.value[field] = []
    }
  }
  
  // 远程搜索
  const handleRemoteSearch = async (item: any, query: string) => {
    const field = item.field
    
    if (!query && item.skipEmptySearch) {
      remoteOptionsMap.value[field] = []
      return
    }
    
    if (item.minSearchLength && query.length < item.minSearchLength) {
      if (item.showTipOnShortLength) {
        remoteOptionsMap.value[field] = [{ value: '', label: `请输入至少${item.minSearchLength}个字符` }]
      }
      return
    }
    
    if (remoteDebounceMap.value[field]) {
      clearTimeout(remoteDebounceMap.value[field])
    }
    
    remoteDebounceMap.value[field] = setTimeout(async () => {
      remoteLoadingMap.value[field] = true
      
      try {
        let params = {}
        if (item.queryParams) {
          params = typeof item.queryParams === 'function' 
            ? item.queryParams(query) 
            : { ...item.queryParams, keyword: query }
        } else {
          params = { keyword: query }
        }
        
        const res = await item.queryApi(params)
        let data = res.data || res || []
        
        if (item.formatData) {
          data = item.formatData(data)
        } else {
          data = data.map((itemData: any) => ({
            value: itemData[item.props?.value || 'value'] || itemData.id,
            label: itemData[item.props?.label || 'label'] || itemData.name
          }))
        }
        
        if (item.maxResults && data.length > item.maxResults) {
          data = data.slice(0, item.maxResults)
        }
        
        remoteOptionsMap.value[field] = data
      } catch (error) {
        console.error('远程搜索失败:', error)
        remoteOptionsMap.value[field] = []
      } finally {
        remoteLoadingMap.value[field] = false
      }
    }, item.debounceTime || 300)
  }
  
  // 清空所有数据
  const clearAllData = () => {
    cascaderOptionsMap.value = {}
    cascaderLoadingMap.value = {}
    selectOptionsMap.value = {}
    selectLoadingMap.value = {}
    selectLoadedMap.value = {}
    remoteOptionsMap.value = {}
    remoteLoadingMap.value = {}
    
    Object.values(remoteDebounceMap.value).forEach(timer => {
      if (timer) clearTimeout(timer)
    })
    remoteDebounceMap.value = {}
  }
  
  return {
    cascaderOptionsMap,
    cascaderLoadingMap,
    selectOptionsMap,
    selectLoadingMap,
    selectLoadedMap,
    remoteOptionsMap,
    remoteLoadingMap,
    loadCascaderData,
    loadSelectData,
    handleRemoteSearch,
    clearAllData
  }
}