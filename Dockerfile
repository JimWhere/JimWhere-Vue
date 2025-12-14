# =========================
# 1단계: Vue 빌드
# =========================
FROM node:20-alpine AS build
WORKDIR /app

# 의존성 먼저 복사
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드
COPY . .
RUN npm run build


# =========================
# 2단계: nginx로 정적파일 서빙
# =========================
FROM nginx:1.27-alpine

# 빌드 결과물 복사
COPY --from=build /app/dist /usr/share/nginx/html

# nginx 설정 덮어쓰기
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]