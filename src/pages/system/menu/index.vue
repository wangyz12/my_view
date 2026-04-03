<template>
  <div class="menu-management">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>菜单列表</span>
          <div>
            <el-button type="primary" @click="handleAdd(null)" v-permission="'system:menu:add'">
              <el-icon>
                <Plus />
              </el-icon>新增
            </el-button>
            <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0"
              v-permission="'system:menu:remove'">
              <el-icon>
                <Delete />
              </el-icon>批量删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData" row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="菜单名称" width="150">
          <template #default="{ row }">
            <span v-if="row.icon" style="margin-right: 5px">
              <el-icon>
                <component :is="row.icon" />
              </el-icon>
            </span>
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="路由名称" width="150" />
        <el-table-column prop="path" label="路由路径" width="180" />
        <el-table-column prop="component" label="组件路径" width="200" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getMenuTypeType(row.type)" size="small">
              {{ getMenuTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限标识" width="150" />
        <el-table-column prop="hidden" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.hidden ? 'info' : 'success'" size="small">
              {{ row.hidden ? '隐藏' : '显示' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAdd(row)" v-permission="'system:menu:add'">
              添加子菜单
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)" v-permission="'system:menu:edit'">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)" v-permission="'system:menu:remove'">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="handleDialogClosed">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="父级菜单" prop="pid">
          <el-cascader v-model="formData.pid" :options="menuOptions"
            :props="{ value: 'id', label: 'title', children: 'children', checkStrictly: true, emitPath: false }"
            placeholder="选择父级菜单（不选则为顶级菜单）" style="width: 100%" clearable />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type" @change="handleTypeChange">
            <el-radio :value="'menu'">菜单</el-radio>
            <el-radio :value="'button'">按钮</el-radio>
            <el-radio :value="'iframe'">内嵌页面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由名称" prop="name" v-if="formData.type !== 'button'">
          <el-input v-model="formData.name" placeholder="请输入路由名称（英文）" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path" v-if="formData.type !== 'button'">
          <el-input v-model="formData.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="formData.type === 'menu'">
          <el-input v-model="formData.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="内嵌地址" prop="component" v-if="formData.type === 'iframe'">
          <el-input v-model="formData.component" placeholder="请输入内嵌页面地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission" v-if="formData.type === 'button'">
          <el-input v-model="formData.permission" placeholder="请输入权限标识（如：system:user:add）" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="formData.type !== 'button'">
          <div style="display: flex; align-items: center; gap: 10px;">
            <el-input v-model="formData.icon" placeholder="图标名称或点击选择" style="flex: 1;" />
            <el-button type="primary" @click="showIconSelector = true">选择图标</el-button>
            <div v-if="formData.icon" style="display: flex; align-items: center; gap: 5px;">
              <el-icon>
                <component :is="formData.icon" />
              </el-icon>
              <span>{{ formData.icon }}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden" v-if="formData.type !== 'button'">
          <el-switch v-model="formData.hidden" />
        </el-form-item>
        <el-form-item label="是否缓存" prop="cache" v-if="formData.type === 'menu'">
          <el-switch v-model="formData.cache" />
        </el-form-item>
        <el-form-item label="是否外链" prop="external" v-if="formData.type !== 'button'">
          <el-switch v-model="formData.external" @change="handleExternalChange" />
        </el-form-item>
        <el-form-item label="打开方式" prop="target" v-if="formData.external && formData.type !== 'button'">
          <el-radio-group v-model="formData.target">
            <el-radio :value="'_self'">当前窗口</el-radio>
            <el-radio :value="'_blank'">新窗口</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图标选择器对话框 -->
    <el-dialog v-model="showIconSelector" title="选择图标" width="600px" :close-on-click-modal="false">
      <div style="margin-bottom: 15px;">
        <el-input v-model="iconSearch" placeholder="搜索图标..." clearable @input="filterIcons" @clear="filterIcons">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>

      <div style="max-height: 400px; overflow-y: auto;">
        <div v-if="filteredIcons.length === 0" style="text-align: center; padding: 20px; color: #999;">
          未找到匹配的图标
        </div>
        <div v-else style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px;">
          <div v-for="icon in filteredIcons" :key="icon" :class="['icon-item', { 'selected': selectedIcon === icon }]"
            @click="selectIcon(icon)"
            style="padding: 10px; text-align: center; cursor: pointer; border-radius: 4px; border: 1px solid #e4e7ed;"
            @mouseenter="(e: any) => e.currentTarget.style.borderColor = '#409eff'"
            @mouseleave="(e: any) => e.currentTarget.style.borderColor = selectedIcon === icon ? '#409eff' : '#e4e7ed'">
            <el-icon :size="24">
              <component :is="icon" />
            </el-icon>
            <div style="font-size: 12px; margin-top: 5px; word-break: break-all;">{{ icon }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showIconSelector = false">取消</el-button>
          <el-button type="primary" @click="showIconSelector = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Delete, Search, Edit, DeleteFilled, Setting, User, Lock, Menu, Document, Folder, Grid, Collection, ChatDotRound, Bell, Star, Share, Download, Upload, Refresh, More, Close, Check, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, CaretRight, CaretLeft, CaretTop, CaretBottom, ZoomIn, ZoomOut, Plus as IconPlus, Minus, CirclePlus, CircleClose, CircleCheck, CircleCloseFilled, CircleCheckFilled, WarningFilled, InfoFilled, SuccessFilled, Warning, QuestionFilled, RemoveFilled, CirclePlusFilled, Remove, View, Hide, Tools, Monitor, Iphone, Location, Connection, Coordinate, Service, Timer, Calendar, Filter, Operation, Position, Rank, Sort, Tickets, Finished, CopyDocument, DocumentCopy, DocumentChecked, DataBoard, DataLine, PieChart, Histogram, SetUp, Reading, Notebook, Box, Wallet, CreditCard, Money, Goods, SoldOut, ShoppingCart, ShoppingBag, Present, Box as BoxIcon, Van, Printer, Camera, Headset, Phone, Microphone, VideoCamera, VideoPause, VideoPlay, Film, Picture, PictureRounded, UploadFilled, Download as DownloadIcon, Files, FolderOpened, FolderDelete, FolderChecked, FolderRemove, FolderAdd, CollectionTag, AlarmClock, CoffeeCup, Watermelon, IceCream, IceDrink, IceTea, Coffee, Orange, Pear, Apple, Cherry, Grape, Sugar, Dessert, HotWater, Bowl, KnifeFork, Burger, Dish, Chicken, Food, Fries, IceCreamSquare, Lollipop, MilkTea, Pear as PearIcon, IceCreamRound } from '@element-plus/icons-vue'
import { getMenuTree, createMenu, updateMenu, deleteMenu,  } from '@/api/system/menu'
import { getCurrentUserMenus } from '@/api/system/userRole'
import { dynamicRouteManager } from '@/router/dynamic'
import { useUserStore } from '@/store/modules/user'
import storage from '@/utils/storage'

// 搜索表单
const searchForm = reactive({
  title: '',
  type: '',
  hidden: ''
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const selectedRows = ref<any[]>([])

// 对话框
const dialogVisible = ref(false)
const isAdd = ref(true)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const parentMenu = ref<any>(null)

// 表单数据
const formData = reactive({
  pid: '',
  name: '',
  path: '',
  component: '',
  title: '',
  icon: '',
  sort: 0,
  type: 'menu',
  hidden: false,
  cache: true,
  permission: '',
  external: false,
  target: '_self'
})

// 图标选择器
const showIconSelector = ref(false)
const iconSearch = ref('')
const selectedIcon = ref('')

// 常用图标列表
const commonIcons = ref([
  'Home', 'User', 'Setting', 'Menu', 'Document', 'Folder', 'Grid', 'Collection',
  'Search', 'Edit', 'Delete', 'Plus', 'Minus', 'Close', 'Check', 'ArrowRight',
  'ArrowLeft', 'ArrowUp', 'ArrowDown', 'CaretRight', 'CaretLeft', 'CaretTop', 'CaretBottom',
  'ZoomIn', 'ZoomOut', 'Refresh', 'More', 'View', 'Hide', 'Tools', 'Monitor',
  'Location', 'Connection', 'Service', 'Timer', 'Calendar', 'Filter', 'Operation',
  'DataBoard', 'DataLine', 'PieChart', 'Histogram', 'SetUp', 'Reading', 'Notebook',
  'Wallet', 'CreditCard', 'ShoppingCart', 'Goods', 'Printer', 'Camera', 'Phone',
  'VideoCamera', 'Picture', 'Upload', 'Download', 'Files', 'FolderOpened',
  'AlarmClock', 'Coffee', 'Food', 'IceCream', 'Star', 'Bell', 'ChatDotRound',
  'Warning', 'Info', 'Success', 'QuestionFilled'
])

// 过滤后的图标
const filteredIcons = ref([...commonIcons.value])

// 搜索图标
const filterIcons = () => {
  if (!iconSearch.value) {
    filteredIcons.value = [...commonIcons.value]
  } else {
    filteredIcons.value = commonIcons.value.filter(icon =>
      icon.toLowerCase().includes(iconSearch.value.toLowerCase())
    )
  }
}

// 选择图标
const selectIcon = (icon: string) => {
  formData.icon = icon
  selectedIcon.value = icon
  showIconSelector.value = false
  iconSearch.value = ''
  filterIcons()
}

// 表单验证规则
const formRules: FormRules = {
  title: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入路由名称', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '必须以字母开头，只能包含字母、数字、下划线', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
    { pattern: /^\/[a-zA-Z0-9_\-/]*$/, message: '必须以/开头，只能包含字母、数字、下划线、横线和斜杠', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ],
  permission: [
    { pattern: /^[a-zA-Z:]+$/, message: '只能包含字母和冒号', trigger: 'blur' }
  ]
}

// 菜单选项（用于选择父级菜单）
const menuOptions = ref<any[]>([])

// 菜单类型标签
const getMenuTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    'menu': '菜单',
    'button': '按钮',
    'iframe': '内嵌页面'
  }
  return map[type] || type
}

// 菜单类型标签样式
const getMenuTypeType = (type: string) => {
  const map: Record<string, string> = {
    'menu': 'primary',
    'button': 'warning',
    'iframe': 'success'
  }
  return map[type] || 'info'
}

// 加载菜单树
const loadMenuTree = async () => {
  try {
    loading.value = true
    const res = await getMenuTree()
    tableData.value = res.data
    menuOptions.value = res.data
  } catch (error) {
    console.error('加载菜单树失败:', error)
  } finally {
    loading.value = false
  }
}
// 表格选择变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

// 新增菜单
const handleAdd = (row: any | null) => {
  isAdd.value = true
  parentMenu.value = row
  dialogTitle.value = row ? `新增子菜单（${row.title}）` : '新增菜单'

  // 设置父级菜单
  if (row) {
    formData.pid = row.id
  } else {
    formData.pid = ''
  }

  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row: any) => {
  isAdd.value = false
  dialogTitle.value = '编辑菜单'
  parentMenu.value = null

  // 填充表单数据
  Object.assign(formData, {
    id: row.id, // 添加id字段
    pid: row.pid || '',
    name: row.name,
    path: row.path,
    component: row.component,
    title: row.title,
    icon: row.icon || '',
    sort: row.sort,
    type: row.type,
    hidden: row.hidden,
    cache: row.cache,
    permission: row.permission || '',
    external: row.external,
    target: row.target
  })

  // 设置选中的图标
  selectedIcon.value = row.icon || ''

  dialogVisible.value = true
}

// 删除菜单
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await deleteMenu(row.id)
      ElMessage.success('删除成功')
      loadMenuTree()
      // 更新菜单和路由
      await updateMenusAndRoutes()
    } catch (error) {
      console.error('删除菜单失败:', error)
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的菜单')
    return
  }

  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个菜单吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      // 逐个删除菜单
      for (const row of selectedRows.value) {
        await deleteMenu(row.id)
      }
      ElMessage.success('批量删除成功')
      selectedRows.value = []
      loadMenuTree()
      // 更新菜单和路由
      await updateMenusAndRoutes()
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  })
}

// 菜单类型变化
const handleTypeChange = (type: string) => {
  // 根据类型重置相关字段
  if (type === 'button') {
    formData.path = ''
    formData.component = ''
    formData.icon = ''
    formData.hidden = false
    formData.cache = true
    formData.external = false
    formData.target = '_self'
  } else if (type === 'iframe') {
    formData.permission = ''
    formData.cache = true
  }
}

// 外链变化
const handleExternalChange = (external: boolean) => {
  if (!external) {
    formData.target = '_self'
  }
}

// 对话框关闭
const handleDialogClosed = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    pid: '',
    name: '',
    path: '',
    component: '',
    title: '',
    icon: '',
    sort: 0,
    type: 'menu',
    hidden: false,
    cache: true,
    permission: '',
    external: false,
    target: '_self'
  })
  parentMenu.value = null
  // 重置图标选择器状态
  showIconSelector.value = false
  iconSearch.value = ''
  selectedIcon.value = ''
  filterIcons()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const params = { ...formData }

      // 处理pid（如果是数组，取最后一个）
      if (Array.isArray(params.pid) && params.pid.length > 0) {
        params.pid = params.pid[params.pid.length - 1]
      }

      if (isAdd.value) {
        // 新增时发送pid
        await createMenu(params)
        ElMessage.success('新增成功')
      } else {
        console.log(params)
        // 编辑时也发送pid，但确保空字符串被正确处理
        await updateMenu(params)
        ElMessage.success('更新成功')
      }

      dialogVisible.value = false
      loadMenuTree()
      // 更新菜单和路由
      await updateMenusAndRoutes()
    } catch (error: any) {
      console.log(error)
    }
  })
}

// 更新菜单和路由
const updateMenusAndRoutes = async () => {
  try {
    // 1. 重新获取用户菜单
    const menuRes = await getCurrentUserMenus()
    const menus = menuRes.data || []

    // 2. 更新用户store
    const userStore = useUserStore()
    userStore.menus = menus

    // 3. 更新持久化存储
    storage.set('menus', menus)

    // 4. 更新动态路由
    await dynamicRouteManager.generateAndAddRoutes(menus)

    console.log('菜单和路由更新成功')
  } catch (error) {
    console.error('更新菜单和路由失败:', error)
  }
}

// 初始化
onMounted(() => {
  loadMenuTree()
})
</script>

<style lang="scss" scoped>
.menu-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-item {
  transition: all 0.3s;

  &:hover {
    background-color: #f5f7fa;
    transform: translateY(-2px);
  }

  &.selected {
    border-color: #409eff !important;
    background-color: #ecf5ff;
  }
}
</style>