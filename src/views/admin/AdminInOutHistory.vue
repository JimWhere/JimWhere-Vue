
<template>
  <div class="inout-history">
    <div class="inout-history__header">
      <h2>입출고내역</h2>
      <span class="inout-history__desc">기간별 입출고 이력</span>
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


        <el-table-column label="유형" width="120" align="center">
          <template #default="{ row }">
            {{ row.inOutType === 'IN' ? '입고' : '출고' }}
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
const pageSize = ref(5)
const total = ref(0)

const fetchStockInOut = async () => {
  loading.value = true
  try {
    const res = await adminInOutHistoryAll({
      page: page.value,
      size: pageSize.value
    })

    console.log("INOUT RAW:", res.data)

    const data = res.data.data
    rows.value = data.content        // 리스트
    total.value = data.totalElements // 페이지 total

  } catch (err) {
    console.error('입출고 내역 조회 실패', err)
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

  const { inOutHistoryCode, ...payload } = editRow.value
  console.log("수정된 데이터:", payload)
  console.log("수정된:", inOutHistoryCode)
  await updateInOutHistory(inOutHistoryCode,payload)

  editDialogVisible.value = false
}

const handleCurrentChange = (newPage) => {
  page.value = newPage
}

watch(page, fetchStockInOut)

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
</style>
