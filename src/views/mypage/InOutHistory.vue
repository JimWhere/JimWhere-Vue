<template>
  <div class="inout-history">
    <div class="inout-history__header">
      <h2>입출고내역</h2>
      <span class="inout-history__desc">입출고 로그 내역</span>
      <div class="inout-history__search">
        <el-select
            v-model="searchField"
            size="small"
            style="width: 120px"
        >
          <el-option label="전체" value="ALL" />
          <el-option label="입출고 번호" value="inOutHistoryCode" />
          <el-option label="방 번호" value="roomCode" />
          <el-option label="박스 이름" value="boxName" />
          <el-option label="물품 이름" value="inOutName" />
          <el-option label="유형" value="inOutType" />
        </el-select>
        <el-select
            v-if="searchField === 'inOutType'"
            v-model="searchText"
            size="small"
            placeholder="유형 선택"
            style="width: 220px"
        >
          <el-option label="입고" value="IN" />
          <el-option label="출고" value="OUT" />
        </el-select>


        <el-input
            v-else
            v-model="searchText"
            size="small"
            placeholder="검색어 입력"
            style="width: 220px"
            @keyup.enter="goSearch"
        />

        <el-button type="primary" size="small" @click="goSearch">
          검색
        </el-button>
      </div>
    </div>

    <el-card class="inout-history__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          header-cell-class-name="inout-history__table-header"
      >
        <el-table-column
            prop="inOutHistoryCode"
            label="입출고 번호"
            width="100"
            align="center"
        />

        <el-table-column
            prop="boxName"
            label="박스 이름"
            width="100"
            align="center"
        />


        <el-table-column label="유형" width="120" align="center">
          <template #default="{ row }">
    <span
        :class="row.inOutType === 'IN'
          ? 'inout-type--in'
          : 'inout-type--out'"
    >
      {{ row.inOutType === 'IN' ? '입고' : '출고' }}
    </span>
          </template>
        </el-table-column>



        <el-table-column
            prop="inOutName"
            label="물품 이름"
            min-width="100"
            align="center"
        />


        <el-table-column
            prop="inOutQuantity"
            label="수량"
            width="100"
            align="center"
        />
        <el-table-column
            prop="roomCode"
            label="방"
            width="100"
            align="center"
        />
        <el-table-column
            label="상세보기"
            width="100"
            align="center"
        >

          <template #default="{ row }">
            <el-button type="primary" size="small" @click="goDetail(row)">
              수정하기
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
          v-model="editDialogVisible"
          title="입출고 내역 수정"
          width="400px"
      >
        <div class="edit-form">
          <el-form label-width="90px">

            <el-form-item label="유형">
              <el-select v-model="editRow.inOutType" placeholder="선택">
                <el-option label="입고" value="IN" />
                <el-option label="출고" value="OUT" />
              </el-select>
            </el-form-item>

            <el-form-item label="물품명">
              <el-input v-model="editRow.inOutName"
                        border="none"
                        placeholder="물품명을 입력하세요" />
            </el-form-item>

            <el-form-item label="수량">
              <el-input-number v-model="editRow.inOutQuantity" :min="1" />
            </el-form-item>

          </el-form>
        </div>

        <template #footer>
          <el-button @click="editDialogVisible = false">취소</el-button>
          <el-button type="primary" @click="confirmEdit">확인</el-button>
        </template>
      </el-dialog>

      <div class="inout-history__pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :current-page="page"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {updateInOutHistory, userInoutHistory} from '@/api/myPage.js'

const loading = ref(false)
const rows = ref([])

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchField = ref('ALL')
const searchText = ref('')

const fetchStockInOut = async () => {
  loading.value = true
  try {
    const res = await userInoutHistory(
        buildSearchParams()
    )

    const data = res.data.data
    rows.value = data.content
    total.value = data.totalElements
  } catch (err) {
    console.error('입출고 내역 조회 실패', err)
  } finally {
    loading.value = false
  }
}

const buildSearchParams = () => {
  const params = {
    page: page.value - 1,
    size: pageSize.value
  }

  if (searchField.value === 'ALL' || !searchText.value) {
    return params
  }

  switch (searchField.value) {
    case 'roomCode':
    case 'inOutHistoryCode': {
      const num = Number(searchText.value)
      if (!Number.isNaN(num)) {
        params[searchField.value] = num
      }
      break
    }
    case 'inOutType':
      params.inOutType = searchText.value
      break
    default:
      params[searchField.value] = searchText.value.trim()
  }

  return params
}


const editDialogVisible = ref(false)
const editRow = ref({
  inOutHistoryCode: null,
  inOutType: 'IN',
  inOutName: '',
  roomCode: 0,
  boxName: '',
})

const goDetail = (row) => {
  editRow.value = { ...row } // 선택한 row 복사
  editDialogVisible.value = true
}
const goSearch = async () => {
  page.value = 1
  await fetchStockInOut()
}
const confirmEdit = async () => {

  const { inOutHistoryCode, ...payload } = editRow.value
  console.log("수정된 데이터:", payload)
  console.log("수정된:", inOutHistoryCode)
  await updateInOutHistory(inOutHistoryCode,payload)

  editDialogVisible.value = false
}

const handleCurrentChange = (newPage) => {
  page.value = newPage
}

/*watch([page, searchField], () => {
  if (searchField.value !== 'ALL') {
    searchText.value = ''
  }
})*/
watch(page,fetchStockInOut)

onMounted(fetchStockInOut)
</script>

<style scoped>
.inout-history {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 32px;
  border-radius: 10px;
  box-sizing: border-box;
}

.inout-history__header{
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.inout-history__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.inout-history__desc {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}

.inout-history__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}


.inout-history__pagination {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
}

:deep(.el-input__wrapper) {
  background-color: #fff !important;
  border: 1px solid #ccc !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}
.inout-history__search {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.inout-type--in {
  color: #1e88e5;        /* 파란색 */
  font-weight: 600;
}

.inout-type--out {
  color: #e53935;        /* 빨간색 */
  font-weight: 600;
}
</style>
