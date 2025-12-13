
<template>
  <div class="inout-history">
    <div class="inout-history__header">
      <h2>입출고내역</h2>
      <span class="inout-history__desc">기간별 입출고 이력</span>
      <div class="inout-history__search">
        <el-select
            v-model="searchField"
            placeholder="검색 조건"
            size="small"
            style="width: 120px"
        >
          <el-option
              v-for="opt in searchFieldOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>

        <!-- 검색 입력 -->
        <el-input
            v-model="searchText"
            placeholder="검색어 입력"
            size="small"
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
            width="120"
            align="center"
        />
        <el-table-column
            prop="boxName"
            label="박스 이름"
            width="120"
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
            min-widt="160"
            align="center"
        /><!--min-width =>최소 너비 ,기본적으로 남은 공간 채움-->

        <el-table-column
            prop="inOutQuantity"
            label="수량"
            width="100"
            align="center"
        />
        <el-table-column
            prop="roomCode"
            label="방 번호"
            width="100"
            align="center"
        />
        <el-table-column
            prop="userId"
            label="유저 이름"
            width="100"
            align="center"
        />
        <el-table-column
            label="상세보기"
            width="120"
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
              <el-input v-model="editRow.inOutName" placeholder="물품명을 입력하세요" />
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
import {updateInOutHistory} from '@/api/myPage.js'
import { adminInOutHistoryAll} from "@/api/admin.js";

const loading = ref(false)
const rows = ref([])

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const roomCode= ref(0)

const searchFieldOptions = [
    { label: '전체', value: 'ALL' },
  { label: '방 번호', value: 'roomCode' },
  { label: '박스 이름', value: 'boxName' },
  { label: '유저 ID', value: 'userId' }
]

const searchField = ref('ALL')
const searchText = ref('')
const buildSearchParams = () => {
  const params = {
    page: page.value - 1,
    size: pageSize.value
  }

  if (
      searchField.value === 'ALL' ||
      !searchText.value.trim()
  ) {
    return params
  }

  // roomCode는 숫자로 변환
  if (searchField.value === 'roomCode') {
    params.roomCode = Number(searchText.value)
  } else {
    params[searchField.value] = searchText.value.trim()
  }

  return params
}
const fetchNoticeList = async () => {
  loading.value = true
  try {
    const res = await adminInOutHistoryAll(
        buildSearchParams()
    )

    const data = res.data.data
    rows.value = data.content
    total.value = data.totalElements
  } catch (e) {
    console.error('조회 실패', e)
  } finally {
    loading.value = false
  }
}

const editDialogVisible = ref(false)
const editRow = ref({
  inOutHistoryCode: null,
  inOutType: 'IN',
  inOutName: '',
  inOutQuantity: 1,
})

const goDetail = (row) => {
  editRow.value = { ...row } // 선택한 row 복사
  editDialogVisible.value = true
}

const confirmEdit = async () => {
  try {
    const {inOutHistoryCode, ...payload} = editRow.value
    await updateInOutHistory(inOutHistoryCode, payload)

    alert('재고가 수정되었습니다.')
    window.location.reload()
    editDialogVisible.value = false
  }catch(err) {
    alert('물품 입/출고에 실패 하였습니다.')
  }
}
const goSearch = async () => {
  page.value = 1
  await fetchNoticeList()
}


const handleCurrentChange = (newPage) => {
  page.value = newPage
}

watch(page, fetchNoticeList)

onMounted(fetchNoticeList)
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

.inout-history__header {
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
