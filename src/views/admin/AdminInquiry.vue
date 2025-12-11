<!-- InquiryList.vue -->
<template>
  <div class="inquiry">

    <!-- 제목 -->
    <div class="inquiry__header">
      <h2>문의내역</h2>
      <span class="inquiry__desc">고객님의 문의 기록을 확인할 수 있습니다.</span>
    </div>


    <!-- 카드 영역 -->
    <el-card class="inquiry__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          header-cell-class-name="inquiry__table-header"
          class="inquiry__table"
      >

        <!-- 문의 번호 -->
        <el-table-column
            prop="inquiryCode"
            label="문의 번호"
            width="120"
            align="center"
        />

        <!-- 제목 -->
        <el-table-column
            prop="inquiryTitle"
            label="문의 제목"
            min-width="220"
            align="center"
        />

        <!-- 작성일 -->
        <el-table-column
            prop="createdAt"
            label="작성일"
            width="180"
            align="center"
        >
          <template #default="{ row }">
            {{ row.createdAt?.split('T')[0] }}
          </template>
        </el-table-column>

        <!-- 답변 상태 -->
        <el-table-column
            prop="answer"
            label="답변 상태"
            width="120"
            align="center"
        >
          <template #default="{ row }">
            {{ row.answer  === null ? '답변 대기중' : '답변 완료'}}
          </template>
        </el-table-column>

        <!-- 상세 -->
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

      <!-- 페이지네이션 -->
      <div class="inquiry__pagination">
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
import { useRouter } from 'vue-router'
import {adminInquiryAll} from "@/api/admin.js";

const router = useRouter()
const loading = ref(false)
const rows = ref([])

const page = ref(1)
const pageSize = ref(5)
const total = ref(0)

const fetchInquiryList = async () => {
  loading.value = true
  try {
    const res = await adminInquiryAll({
      page: page.value,
      size: pageSize.value
    })

    const data = res.data.data
    rows.value = data.content
    total.value = data.totalElements

  } catch (e) {
    console.error('문의내역 조회 실패', e)
  } finally {
    loading.value = false
  }
}

const goDetail = (row) => {
  router.push({
    name: 'AdminInquiryDetail',
    query: { inquiryCode: row.inquiryCode }
  })
}

const goWrite = () => {
  router.push({ name: 'InquiryCreate' })
}

const handleCurrentChange = (newPage) => {
  page.value = newPage
}

watch(page, fetchInquiryList)
onMounted(fetchInquiryList)
</script>

<style scoped>
.inquiry {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 30px 40px;
}

/* 제목 */
.inquiry__header {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.inquiry__header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #3f3f3f;
}

.inquiry__desc {
  margin-top: 6px;
  font-size: 13px;
  color: #8a8a8a;
}



.inquiry__card {
  flex: 1;
  border-radius: 14px;
  padding: 20px;
  background: #fafbfd;
}


.inquiry__table-header {
  background-color: #f1f4f9 !important;
  font-weight: 600;
  color: #444;
}

.inquiry__pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
