<template>
  <div class="auth-container">
    <h2 class="title">회원가입</h2>

    <div class="auth-box">

      <div class="row">
        <input v-model="form.userId" placeholder="아이디를 입력해주세요" class="input"
        style="width:100%;"/>
        <button class="btn small" @click="checkUserId">중복 확인</button>
      </div>

      <input
          type="password"
          v-model="form.password"
          placeholder="비밀번호를 입력해주세요"
          class="input"
      />

      <!-- 전화번호 + 중복확인 -->
      <div class="row">
        <input v-model="form.phone" placeholder="' - ' 를 제외한 전화번호를 입력해주세요" class="input"
        style="width: 100%;"/>
        <button class="btn small" @click="checkPhone">인증</button>
      </div>

      <!-- 인증번호 입력 -->
      <div v-if="form.phoneChecked" class="row">
        <input v-model="form.smsCode" placeholder="인증번호 입력" class="input" />
        <button class="btn small" @click="verifySms">인증 확인</button>
      </div>

      <!-- 사업자번호 -->
      <input v-model="form.business" placeholder="사업자번호를 입력해주세요" class="input" />

      <!-- 대표자명 -->
      <input v-model="form.pname" placeholder="대표자명을 입력해주세요" class="input" />

      <!-- 개업일자 -->
      <input v-model="form.startDt" placeholder="개업일자 yyyy-mm-dd" class="input" />

      <!-- 사업자 진위 확인 -->
      <button class="btn small" @click="checkBusiness">사업자 진위확인</button>

      <!-- 회원가입 버튼 (조건 충족될 때만 활성화) -->
      <button
          class="btn primary"
          :disabled="!canRegister"
          @click="register"
      >
        가입
      </button>
    </div>

    <p class="login-link">
      이미 계정이 있으신가요?
      <span @click="goLogin" class="login-text">로그인</span>
    </p>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import {checkDuplicateBusinessApi, checkDuplicateIdApi, checkDuplicatePhoneApi, signupApi} from "@/api/authApi";
import {businessStatusApi, validateBusinessApi} from "@/api/businessApi";
import { sendSmsApi, verifySmsApi } from "@/api/smsApi";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  userId: "",
  password: "",
  phone: "",
  smsCode: "",
  business: "",
  pname: "",
  startDt: "",

  // 검증 상태
  phoneChecked: false,
  phoneVerified: false,
  businessVerified: false,
  userIdChecked: false
});

const goLogin = () => {
  router.push("/login");
};


// 아이디 중복체크
const checkUserId = async () => {
  if (!form.userId) return alert("아이디를 입력해주세요.");

  try {
    const res = await checkDuplicateIdApi(form.userId);

    if (res.data.data === true) {
      alert("이미 사용 중인 아이디입니다.");
    } else {
      alert("중복 확인 완료!");
      form.userIdChecked = true;
    }

  } catch (e) {
    alert("아이디 중복 확인 실패");
  }
};

// 전화번호 중복 확인 + 인증번호 발송
const checkPhone = async () => {
  if (!form.phone) return alert("전화번호를 입력하세요.");

  try {
    // 1) 중복 체크
    const dupRes = await checkDuplicatePhoneApi(form.phone);

    if (dupRes.data.data === true) {
      return alert("이미 가입된 전화번호입니다.");
    }

    // 2) 문자 발송
    await sendSmsApi(form.phone);

    alert("인증번호가 발송되었습니다!");
    form.phoneChecked = true;

  } catch (e) {
    alert("전화번호 인증 요청 실패");
  }
};

// 문자 인증 확인
const verifySms = async () => {
  if (!form.smsCode) return alert("인증번호를 입력하세요.");

  try {
    const res = await verifySmsApi(form.phone, form.smsCode);
    if (res.data.data === true) {
      form.phoneVerified = true;
      alert("휴대폰 인증 완료!");
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  } catch (e) {
    alert("인증 실패");
  }
};

// 사업자 진위확인
const checkBusiness = async () => {
  if (!form.business || !form.pname || !form.startDt) {
    alert("사업자번호, 대표자명, 개업일자를 모두 입력해주세요.");
    return;
  }



  try {

    const dup = await checkDuplicateBusinessApi(form.business);

    if (dup.data.data === true) {
      return alert("이미 가입된 사업자번호입니다.");
    }

    const res = await businessStatusApi(form.business);

    const info = res.data.data;

    const statusCode = info.b_stt_cd;
    const statusName = info.b_stt; // 계속사업자 / 휴업자 / 폐업자

    if (statusCode === "01") {
      alert(`정상 영업중인 사업자입니다.\n상태: ${statusName}`);
      form.businessVerified = true;
    } else if (statusCode === "02") {
      alert(`휴업 상태의 사업자입니다.\n상태: ${statusName}`);
    } else if (statusCode === "03") {
      alert(`폐업한 사업자입니다.\n상태: ${statusName}`);
    } else {
      alert("알 수 없는 사업자 상태입니다.");
    }

  } catch (e) {
    alert("사업자 조회 실패");
  }

  // 현재 실제 사업자가 없어서 진위확인 불가능 추후 서비스할때 이걸로 교체
  // try {
  //   const payload = {
  //     businessNumber: form.business,
  //     representativeName: form.pname,
  //     startDate: form.startDt
  //   };
  //   const res = await validateBusinessApi(payload);
  //
  //   if (res.data.data === true) {
  //     form.businessVerified = true;
  //     alert("사업자 진위확인 성공!");
  //   } else {
  //     alert("사업자 정보가 일치하지 않습니다.");
  //   }
  //
  // } catch (e) {
  //   alert("사업자 인증 실패");
  // }
};

// 회원가입 버튼 활성 조건
const canRegister = computed(() => {
  return (
      form.userIdChecked &&
      form.phoneVerified &&
      form.businessVerified &&
      form.password
  );
});

// 최종 회원가입 요청
const register = async () => {
  try {
    const payload = {
      userId: form.userId,
      password: form.password,
      userPhoneNumber: form.phone,
      userBusinessNumber: form.business,
      pName: form.pname,
      startDt: form.startDt
    };

    const res = await signupApi(payload);
    alert(res.data.message || "회원가입 완료!");
    router.replace("/login");

  } catch (e) {
    console.error(e);
    alert("회원가입 실패: " + (e.response?.data?.message || "알 수 없는 오류"));
  }
};
</script>

<style scoped>
.auth-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  margin: 20px 0;
  font-size: 20px;
  font-weight: bold;
}

.auth-box {
  width: 400px;
  padding: 30px;
  background: linear-gradient(180deg, #e0f3ff, #ffffff);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.input {
  padding: 10px 12px;
  border: 1px solid #bcd8e8;
  border-radius: 6px;
}

.row {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn.small {
  background: #d8eefd;
  width: 110px;
}

.btn.primary {
  background: #87c9ff;
  color: white;
}

.btn.primary:disabled {
  background: #bcd8e8;   /* 흐린색 */
  cursor: not-allowed;
  opacity: 0.6;
}

.login-link {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.login-text {
  color: #409eff;
  cursor: pointer;
  margin-left: 4px;
}

.login-text:hover {
  text-decoration: underline;
}
</style>
