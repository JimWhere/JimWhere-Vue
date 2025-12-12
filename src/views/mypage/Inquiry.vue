<!-- InquiryList.vue -->
<template>
  <div class="inquiry">

    <div class="inquiry__header">
      <h2>문의내역</h2>
      <span class="inquiry__desc">고객님의 문의 기록을 확인할 수 있습니다.</span>

      <div class="inquiry__actions">
        <el-button type="primary" @click="goWrite">문의하기</el-button>
      </div>
    </div>


    <el-card class="inquiry__card" shadow="never">
      <el-table
          :data="rows"
          v-loading="loading"
          border
          header-cell-class-name="inquiry__table-header"
          class="inquiry__table"
      >


        <el-table-column
            prop="inquiryCode"
            label="문의 번호"
            width="120"
            align="center"
        />

        <el-table-column
            prop="inquiryTitle"
            label="문의 제목"
            min-width="220"
            align="center"
        />

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

        <el-table-column
            label="자세히"
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
import { userInquiryList } from '@/api/myPage.js'

const router = useRouter()
const loading = ref(false)
const rows = ref([])

const page = ref(1)
const pageSize = ref(5)
const total = ref(0)

const fetchInquiryList = async () => {
  loading.value = true
  try {
    const res = await userInquiryList({
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
    name: 'InquiryDetail',
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
  padding: 24px 32px;
  border-radius: 10px;
  box-sizing: border-box;
}


.inquiry__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #5ba0ff;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
}

.inquiry__header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.inquiry__desc {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}

.inquiry__actions {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
}

.inquiry__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}


.inquiry__pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
