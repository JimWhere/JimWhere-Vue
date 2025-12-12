<template>
  <div class="access-history-detail">

    <div class="access-history-detail__header">
      <h2>출입내역 상세</h2>
    </div>
    <el-card class="access-history-detail__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          header-cell-class-name="access-history-detail__table-header"
      >
        <el-table-column
            prop="inOutHistoryCode"
            label="출입내역 코드"
            width="140"
            align="center"
        >
        </el-table-column>

        <el-table-column
            prop="inOutName"
            label="입출고 물품"
            min-width="240"
            align="center"
        />


        <el-table-column
            prop="inOutQuantity"
            label="입출고 수량"
            width="160"
            align="center"
        >
        </el-table-column>

        <el-table-column
            prop="boxName"
            label="이용한 박스"
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
import {useRoute, useRouter} from 'vue-router'
import {entryHistoryDetail} from "@/api/myPage.js";

const route = useRoute();
const router = useRouter()

const loading = ref(false)
const rows = ref([])
const inOutList=ref([])

const page = ref(1)
const total = ref(0)


const fetchAccessHistoryDetail = async () => {
  loading.value = true
  try {
    const res = await entryHistoryDetail(route.query.accessHistoryCode)
    const list = res.data.data.inOutList
    rows.value = list

  } catch (e) {
    console.error("출입내역 조회 실패", e)
    console.log("Server response:", err.response?.data);
  } finally {
    loading.value = false
  }
}

watch(page, fetchAccessHistoryDetail)

onMounted(fetchAccessHistoryDetail)
</script>

<style scoped>
.access-history-detail {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 30px 40px;
}

.access-history-detail__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.access-history-detail__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.access-history-detail__card {
  flex: 1;
  border-radius: 14px;
  padding: 20px;
  background: #fafbfd;
}

</style>
