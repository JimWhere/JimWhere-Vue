<template>
  <div class="inventory">

    <div class="inventory__header">
      <h2>재고 현황 관리</h2>
      <span class="inventory__desc">고객님이 대여한 방의 재고 현황을 표시합니다.</span>
      <div class="available-box-wrapper">
        <AppLabel v-model:availableBoxCount="availableBoxCount">
          이용 가능 박스 수 : {{ availableBoxCount }}
        </AppLabel>
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

      </el-table>

    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import {userAvailableBoxCount, userBoxList} from "@/api/myPage.js";
import AppLabel from "@/components/shared/basic/AppLabel.vue";

const router = useRouter()

const loading = ref(false)
const rows = ref([])

const page = ref(1)
const pageSize = ref(5)
const total = ref(0)
const availableBoxCount =ref(0)


const fetchNoticeList = async () => {
  loading.value = true
  try {
    const res = await userBoxList()
    const countRes= await userAvailableBoxCount();
    availableBoxCount.value=countRes.data.data;

    const data = res.data.data
    rows.value = data
    total.value = data.length

  } catch (e) {
    console.error("재고 조회 실패", e)
  } finally {
    loading.value = false
  }
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
.inventory__header :deep(.app-label__icon) {
  display: none;
}
.inventory__header :deep(.app-label) {
  padding: 6px 12px;   /* 크기 줄이기 */
  font-size: 14px;
}

.inventory__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}

/*.inventory__pagination {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
}*/
</style>
