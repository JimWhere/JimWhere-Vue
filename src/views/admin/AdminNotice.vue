<template>
  <div class="notice">

    <div class="notice__header">
      <h2>공지사항 관리</h2>

      <div class="notice__actions">
      <el-button type="primary" size="small" @click="goCreate()" class="noticeCreate">
        공지사항 생성
      </el-button>
      </div>
    </div>


    <el-card class="notice__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          header-cell-class-name="notice__table-header"
      >


        <el-table-column
            prop="noticeCode"
            label="공지사항 ID"
            width="140"
            align="center"
        >
        </el-table-column>

        <el-table-column
            prop="noticeTitle"
            label="공지사항 제목"
            min-width="240"
            align="center"
        />


        <el-table-column
            prop="createdAt"
            label="작성일"
            width="160"
            align="center"
        >
          <template #default="{ row }">
            {{ row.createdAt?.split('T')[0] }}
          </template>
        </el-table-column>


        <el-table-column
            label="상세보기"
            width="120"
            align="center"
        >
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="goDetail(row)">
              보기
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <div class="notice__pagination">
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
import {noticeAll} from "@/api/notice.js";


const router = useRouter()

const loading = ref(false)
const rows = ref([])

const page = ref(1)
const pageSize = ref(5)
const total = ref(0)


const fetchNoticeList = async () => {
  loading.value = true
  try {
    const res = await noticeAll({
      page: page.value,
      size: pageSize.value
    })

    const data = res.data.data
    rows.value = data.content
    total.value = data.totalElements

  } catch (e) {
    console.error("공지사항 조회 실패", e)
    console.log("Server response:", err.response?.data);
  } finally {
    loading.value = false
  }
}

const goDetail = (row) => {
  router.push({
    name: "AdminNoticeDetail",
    query: { noticeCode: row.noticeCode }
  })
}
const goCreate = () => {
  router.push({name: "AdminNoticeCreate"});
}

const handlePageChange = (newPage) => {
  page.value = newPage
}

watch(page, fetchNoticeList)

onMounted(fetchNoticeList)
</script>

<style scoped>
.notice {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 32px;
  border-radius: 10px;
  box-sizing: border-box;
}

.notice__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.notice__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
.notice__actions{
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
}

.notice__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}



.notice__pagination {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
}
</style>
