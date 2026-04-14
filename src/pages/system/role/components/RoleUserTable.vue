<template>
    <PageLayout type="table" :padding="false">
      <BoxTable ref="tableRef" :tableConfig="TableConfig" @mounted="handleTableMounted">
      </BoxTable>
      <footer>
        <div class="flex justify-center mt-5">
          <el-button @click="emit('close')">取消</el-button>
        </div>
      </footer>
    </PageLayout>
</template>

<script setup lang="ts">
import { getRoleUsers } from '@/api/system/userRole'
const emit = defineEmits<{
  (e: 'close'): void
}>()

interface Props {
  row: {
    [key: string]: any
  }
}
const props = defineProps<Props>()
  // ToDo 可以根据具体业务添加用户或者批量添加用户

const TableConfig = {
  tableColumn: [
    { prop: 'account',  label: '账号' },
    { prop: 'username',  label: '姓名' },
    { prop: 'phone',  label: '手机号' },
    { prop: 'email',  label: '邮箱' },
  ],
  // 表格查询接口
  queryApi: (params: any) => getRoleUsers(props.row.id, params),
  // 分页相关
  page: 1,
  total: 0,
  pageSize: 20,
  apiList: 'users'
}

const tableRef = ref()
const tableInstance = ref<any>(null)
// 表格渲染完成后的回调，获取组件实例
const handleTableMounted = (instance: any) => {
  tableInstance.value = instance
  instance.queryTableList()
}

</script>

<style lang="scss" scoped></style>