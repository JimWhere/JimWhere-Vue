<template>
  <div class="inventory">

    <div class="inventory__header">
      <h2>재고 현황 관리</h2>
      <!-- 🔍 검색 영역 -->
      <div class="inventory__search">
        <!-- 검색 조건 (고정: 방 번호) -->
        <el-select
            v-model="searchField"
            size="small"
            style="width: 120px"
            disabled
        >
          <el-option label="방 번호" value="roomCode" />
        </el-select>

        <!-- 방 번호 입력 -->
        <el-input
            v-model="roomCode"
            placeholder="방 번호 입력"
            size="small"
            style="width: 220px"
            @keyup.enter="goSearch"
        />

        <el-button type="primary" size="small" @click="goSearch">
          검색
        </el-button>
      </div>
    </div>


    <el-card class="inventory__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          header-cell-class-name="inventory__table-header"
      >


        <el-table-column
            prop="boxName"
            label="박스 이름"
            width="140"
            align="center"
        >
        </el-table-column>

        <el-table-column
            prop="boxContent"
            label="물품 명"
            min-width="240"
            align="center"
        />


        <el-table-column
            prop="boxCurrentCount"
            label="물품 수"
            width="160"
            align="center"
        >
        </el-table-column>
          <el-table-column
              prop="roomCode"
              label="방 번호"
              width="160"
              align="center"
          >
        </el-table-column>

      </el-table>
      <div class="inventory__pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :current-page="page"
            :page-size="pageSize"
            :total="total"
            @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import {adminBoxListAll} from "@/api/admin.js";

const router = useRouter()

const loading = ref(false)
const rows = ref([])

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchField = ref('roomCode') // 고정
const roomCode = ref('')



const availableBoxCount =ref(0)


const fetchNoticeList = async () => {
  loading.value = true
  try {
    const res = await adminBoxListAll(
        roomCode.value ? Number(roomCode.value) : null,
        {
          page: page.value,
          size: pageSize.value
        }
    )

    const data = res.data.data
    rows.value = data.content
    total.value = data.totalElements
  } catch (e) {
    console.error('재고 조회 실패', e)
  } finally {
    loading.value = false
  }
}
const goSearch = async () => {
  page.value = 1
  await fetchNoticeList()
}

const handlePageChange = (newPage) => {
  page.value = newPage
}

watch(page, fetchNoticeList)

onMounted(fetchNoticeList)
</script>

<style scoped>
.inventory {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 32px;
  border-radius: 10px;
  box-sizing: border-box;
}

.inventory__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.inventory__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.inventory__desc {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}
.available-box-wrapper {
  margin-left: auto;
}

.inventory__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}

.inventory__pagination {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
}
.inventory__search {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
