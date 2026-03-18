<template>
  <div class="dept-management">
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="部门名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入部门名称"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" style="width: 200px" placeholder="全部" clearable>
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>部门列表</span>
          <div>
            <el-button type="primary" @click="handleAdd(null)" v-permission="'system:dept:add'">
              <el-icon><Plus /></el-icon>新增
            </el-button>
            <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0" v-permission="'system:dept:remove'">
              <el-icon><Delete /></el-icon>批量删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="部门名称" width="200">
          <template #default="{ row }">
            <span style="margin-left: 10px">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="部门编码" width="120" />
        <el-table-column prop="orderNum" label="排序" width="80" />
        <el-table-column prop="leader" label="负责人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'" size="small">
              {{ row.status === '0' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAdd(row)" v-permission="'system:dept:add'">
              添加子部门
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)" v-permission="'system:dept:edit'">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)" v-permission="'system:dept:remove'">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @closed="handleDialogClosed"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="父级部门" prop="parentId">
          <el-cascader
            v-model="formData.parentId"
            :options="deptOptions"
            :props="{ value: 'id', label: 'name', children: 'children', checkStrictly: true, emitPath: false }"
            placeholder="选择父级部门（不选则为顶级部门）"
            style="width: 100%"
            clearable
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="formData.orderNum" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="formData.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { getDeptTree, createDept, updateDept, deleteDept, batchDeleteDepts } from '@/api/system/dept'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: ''
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
const parentDept = ref<any>(null)

// 表单数据
const formData = reactive({
  parentId: '',
  name: '',
  code: '',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0'
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { max: 50, message: '部门名称不能超过50个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入部门编码', trigger: 'blur' },
    { max: 30, message: '部门编码不能超过30个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { pattern: /^\S+@\S+\.\S+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 部门选项（用于选择父级部门）
const deptOptions = ref<any[]>([])

// 加载部门树
const loadDeptTree = async () => {
  try {
    loading.value = true
    const res = await getDeptTree(searchForm)
    tableData.value = res.data
    deptOptions.value = res.data
  } catch (error) {
    console.error('加载部门树失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  loadDeptTree()
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  loadDeptTree()
}

// 表格选择变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

// 新增部门
const handleAdd = (row: any | null) => {
  isAdd.value = true
  parentDept.value = row
  dialogTitle.value = row ? `新增子部门（${row.name}）` : '新增部门'
  
  // 设置父级部门
  if (row) {
    formData.parentId = row.id
  } else {
    formData.parentId = ''
  }
  
  dialogVisible.value = true
}

// 编辑部门
const handleEdit = (row: any) => {
  isAdd.value = false
  dialogTitle.value = '编辑部门'
  parentDept.value = null
  
  // 填充表单数据
  Object.assign(formData, {
    parentId: row.parentId || '',
    name: row.name,
    code: row.code,
    orderNum: row.orderNum,
    leader: row.leader || '',
    phone: row.phone || '',
    email: row.email || '',
    status: row.status
  })
  
  dialogVisible.value = true
}

// 删除部门
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await deleteDept(row.id)
      ElMessage.success('删除成功')
      loadDeptTree()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的部门')
    return
  }
  
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个部门吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      const deptIds = selectedRows.value.map(row => row.id)
      await batchDeleteDepts(deptIds)
      ElMessage.success('批量删除成功')
      selectedRows.value = []
      loadDeptTree()
    } catch (error: any) {
      ElMessage.error(error.message || '批量删除失败')
    }
  })
}

// 对话框关闭
const handleDialogClosed = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    parentId: '',
    name: '',
    code: '',
    orderNum: 0,
    leader: '',
    phone: '',
    email: '',
    status: '0'
  })
  parentDept.value = null
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      const params = { ...formData }
      
      // 处理parentId（如果是数组，取最后一个）
      if (Array.isArray(params.parentId) && params.parentId.length > 0) {
        params.parentId = params.parentId[params.parentId.length - 1]
      }
      
      if (isAdd.value) {
        await createDept(params)
        ElMessage.success('新增成功')
      } else {
        await updateDept(params)
        ElMessage.success('更新成功')
      }
      
      dialogVisible.value = false
      loadDeptTree()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    }
  })
}

// 初始化
onMounted(() => {
  loadDeptTree()
})
</script>

<style lang="scss" scoped>
.dept-management {
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
</style>