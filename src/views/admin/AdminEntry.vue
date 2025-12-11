<!-- AccessHistory.vue -->
<template>
  <div class="access-history">
    <div class="access-history__header">
      <h2>출입내역</h2>
      <span class="access-history__desc">
        날짜별 입출 로그 내역
      </span>
    </div>

    <el-card class="access-history__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          header-cell-class-name="access-history__table-header"
      >
        <el-table-column
            prop="accessHistoryCode"
            label="출입번호"
            width="120"
            align="center"
        />
        <el-table-column
            prop="userId"
            label="유저 아이디"
            width="100"
            align="center"
        >
        </el-table-column>
        <el-table-column
            label="본인여부"
            width="100"
            align="center"
        >
          <template #default="{ row }">
            {{ row.isOwner === 'Y' ? '본인' : '대리인' }}
          </template>
        </el-table-column>

        <el-table-column
            label="목적"
            width="120"
            align="center"
        >
          <template #default="{ row }">
            {{ row.visitPurpose === 'ENTRY' ? '단순출입' : '입출고' }}
          </template>
        </el-table-column>

        <el-table-column
            prop="roomCode"
            label="방 번호"
            width="100"
            align="center"
        />
        <el-table-column
            prop="accessedAt"
            label="출입 시간"
            width="100"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="accessResult"
            label="출입 결과"
            width="100"
            align="center"
        >
          <template #default="{ row }">
            {{ row.accessResult === 'Y' ? '완료' : '출입 전' }}
          </template>
        </el-table-column>
        <el-table-column
            label="상세보기"
            width="120"
            align="center"
        >

          <template #default="{ row }">
            <el-button type="primary" size="small" @click="goDetail(row)">
              자세히 보기
            </el-button>
          </template>
        </el-table-column>
      </el-table>



      <!-- 페이지네이션 -->
      <div class="access-history__pagination">
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

import {useRouter} from "vue-router";
import {adminAccessHistoryAll} from "@/api/admin.js";

const router = useRouter()
const loading = ref(false)
const rows = ref([])        // 타입 제거

const page = ref(1)
const pageSize = ref(5)     // 한 페이지 5건
const total = ref(0)

const fetchAccessHistory = async () => {
  loading.value = true
  try {
    const res = await adminAccessHistoryAll({
      page: page.value,
      size: pageSize.value
    })

    console.log("RAW RESPONSE:", res.data)

    const entryPage = res.data.data       // PageResponse
    rows.value = entryPage.content        // 리스트
    total.value = entryPage.totalElements // 페이지 total

  } catch (err) {
    console.error('출입내역 조회 실패', err)
  } finally {
    loading.value = false
  }
}

const goDetail = (row) => {
  router.push({
    name: 'AdminEntryDetail',
    query: {
      accessHistoryCode: row.accessHistoryCode
    }
  })
}

const handleCurrentChange = (newPage) => {
  page.value = newPage
}

watch(page, () => {
  fetchAccessHistory()
})

onMounted(() => {
  fetchAccessHistory()
})
</script>

<style scoped>
.access-history {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 32px;
  border-radius: 10px;
  box-sizing: border-box;
}

.access-history__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.access-history__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.access-history__desc {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}

.access-history__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}

.access-history__table-header {
  background-color: #f7f9fc !important;
  font-weight: 600;
}

.access-history__pagination {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
}
</style>
