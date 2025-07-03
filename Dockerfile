# Node.js 18 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 백엔드 의존성 설치
RUN npm install

# 프론트엔드 의존성 설치
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# 모든 소스 코드 복사
COPY . .

# 프론트엔드 빌드
RUN cd frontend && npm run build

# 포트 노출
EXPOSE 5000

# 데이터 디렉토리 생성
RUN mkdir -p /app/data /app/uploads

# 시작 명령어
CMD ["npm", "start"]
