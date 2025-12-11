<template>
  <div class="notice">

    <div class="notice__header">
      <h2>출입내역 상세</h2>
    </div>
    <el-card class="notice__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          header-cell-class-name="notice__table-header"
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


const fetchAdminEntryList = async () => {
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

watch(page, fetchAdminEntryList)

onMounted(fetchAdminEntryList)
</script>

<style scoped>
.notice {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  border-radius: 10px;
  height: 100%;
  box-sizing: border-box;
}

.notice__header {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  color: #5ba0ff;
}

.notice__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.notice__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}

</style>
