# 해커 굿즈 쇼핑몰 🛒🔐

**⚠️ 교육 목적으로만 사용하세요!**

웹 보안 교육을 위한 의도적으로 취약한 쇼핑몰 웹사이트입니다.

## � 빠른 시작

```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd docker_shopping

# 2. 의존성 설치
npm install

# 3. 서버 실행
PORT=3001 node server.js
```

브라우저에서 `http://localhost:3001`로 접속하세요.

## 🔐 취약점 목록

- **Command Injection**: 검색 기능에서 명령어 주입
- **SQL Injection**: 로그인 시스템의 SQL 주입
- **XSS**: 사용자 프로필 페이지의 스크립트 주입
- **Race Condition**: 주문 시스템의 동시성 문제
- **권한 우회**: 관리자 페이지 접근 제어 부족
- **Path Traversal**: 파일 업로드 시 경로 탐색

## 🛠️ 기술 스택

- **Frontend**: React 18, Styled Components
- **Backend**: Node.js, Express.js
- **Database**: JSON 파일 기반 (교육용 단순화)
- **Container**: Docker, Docker Compose

## 🧪 취약점 테스트

### 자동 테스트 스크립트
```bash
# 모든 취약점 테스트 실행
./test_vulnerabilities.sh
```

### 수동 테스트 예시

1. **Command Injection**
```bash
curl "http://localhost:3001/api/search?q=\"; ls -la; echo \""
```

2. **SQL Injection**
```bash
curl -X POST "http://localhost:3001/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin\" OR \"1\"=\"1", "password": "anything"}'
```

3. **XSS**
```bash
curl "http://localhost:3001/api/profile?name=<script>alert('XSS')</script>"
```

## 🐳 Docker 실행

```bash
# Docker Compose 사용
docker-compose up --build

# 또는 Docker 직접 사용
docker build -t hacker-shop .
docker run -p 3001:3001 hacker-shop
```

## 📚 추가 문서

- [취약점 실습 가이드](VULNERABILITY_GUIDE.md)
- [보안 대책 가이드](SECURITY_GUIDE.md)

## ⚠️ 주의사항

- 이 애플리케이션은 **교육 목적으로만** 사용하세요
- 실제 운영 환경에서는 절대 사용하지 마세요
- 다른 사람의 시스템에 대한 무단 침입은 불법입니다

## 👥 기여

교육 목적의 프로젝트입니다. 개선사항이나 추가 취약점에 대한 제안은 언제든 환영합니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스하에 제공됩니다.
```

2. **프론트엔드 의존성 설치**
```bash
cd frontend
## 🧪 테스트 계정

| 사용자명 | 비밀번호 | 권한 |
|---------|----------|------|
| admin | admin123 | 관리자 |
| hacker1 | password123 | 일반사용자 |

## 🔍 주요 취약점 예시

### Command Injection
```bash
# 검색어에 입력
"; ls -la; echo "
```

### SQL Injection
```bash
# 로그인 사용자명에 입력
admin' OR '1'='1
```

### XSS
```html
<!-- 프로필 이름에 입력 -->
<script>alert('XSS')</script>
```

---

**⚠️ 주의: 이 프로젝트는 교육용입니다. 실제 시스템에 대한 무단 침입이나 공격은 불법입니다.**
