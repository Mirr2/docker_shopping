const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// 보안상 위험한 설정 - 교육용으로 의도적으로 설정
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 정적 파일 제공
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'frontend/build')));

// 데이터 파일 경로
const DATA_PATH = {
  products: path.join(__dirname, 'data', 'products.json'),
  users: path.join(__dirname, 'data', 'users.json'),
  orders: path.join(__dirname, 'data', 'orders.json')
};

// 데이터 읽기 헬퍼 함수
const readData = (filename) => {
  try {
    const data = fs.readFileSync(DATA_PATH[filename], 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// 데이터 쓰기 헬퍼 함수
const writeData = (filename, data) => {
  try {
    fs.writeFileSync(DATA_PATH[filename], JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// 글로벌 변수로 재고 관리 (Race Condition 취약점을 위해)
let stockLocks = {};

// API 엔드포인트들

// 1. 상품 목록 조회
app.get('/api/products', (req, res) => {
  const products = readData('products');
  res.json(products);
});

// 2. 상품 상세 조회
app.get('/api/products/:id', (req, res) => {
  const products = readData('products');
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
  }
  
  res.json(product);
});

// 3. 상품 검색 (Command Injection 취약점)
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }
  
  // 의도적인 Command Injection 취약점
  const command = `grep -i "${q}" data/products.json`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Command execution error:', error);
      return res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
    }
    
    try {
      const products = readData('products');
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      );
      res.json(filtered);
    } catch (err) {
      res.json([]);
    }
  });
});

// 4. 사용자 로그인 (SQL Injection 시뮬레이션)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '사용자명과 비밀번호를 입력해주세요.' });
  }
  
  const users = readData('users');
  
  // 의도적인 SQL Injection 시뮬레이션 (문자열 연결)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log('Simulated SQL Query:', query);
  
  // SQL Injection 시뮬레이션: ' OR '1'='1 같은 패턴 감지
  if (username.includes("' OR '") || password.includes("' OR '")) {
    // 모든 사용자 정보 반환 (SQL Injection 성공 시뮬레이션)
    return res.json({ 
      success: true, 
      user: users[0], // admin 계정 반환
      message: 'SQL Injection 성공!' 
    });
  }
  
  // 정상적인 로그인 처리
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: '잘못된 사용자명 또는 비밀번호입니다.' });
  }
  
  // 쿠키에 사용자 정보 저장 (보안상 위험하지만 교육용)
  res.cookie('user', JSON.stringify(user), { 
    httpOnly: false, // XSS 취약점을 위해 false로 설정
    secure: false,
    sameSite: 'none'
  });
  
  res.json({ success: true, user });
});

// 5. 사용자 등록
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }
  
  const users = readData('users');
  
  // 중복 사용자 확인
  if (users.find(u => u.username === username || u.email === email)) {
    return res.status(409).json({ error: '이미 존재하는 사용자명 또는 이메일입니다.' });
  }
  
  const newUser = {
    id: users.length + 1,
    username,
    password, // 실제 서비스에서는 해시화해야 함
    email,
    role: 'user',
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  writeData('users', users);
  
  res.json({ success: true, message: '회원가입이 완료되었습니다.' });
});

// 6. 상품 주문 (Race Condition 취약점)
app.post('/api/order', async (req, res) => {
  const { productId, quantity, userInfo } = req.body;
  
  if (!productId || !quantity || !userInfo) {
    return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
  }
  
  const products = readData('products');
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
  }
  
  // Race Condition 취약점: 동시성 제어 없이 재고 확인 및 차감
  console.log(`주문 처리 시작: 상품 ${productId}, 수량 ${quantity}, 현재 재고 ${product.stock}`);
  
  if (product.stock < quantity) {
    return res.status(400).json({ error: '재고가 부족합니다.' });
  }
  
  // 의도적인 지연 (Race Condition 테스트를 위해)
  setTimeout(() => {
    const currentProducts = readData('products');
    const currentProduct = currentProducts.find(p => p.id === parseInt(productId));
    
    if (currentProduct && currentProduct.stock >= quantity) {
      // 재고 차감
      currentProduct.stock -= quantity;
      writeData('products', currentProducts);
      
      // 주문 생성
      const orders = readData('orders');
      const newOrder = {
        id: orders.length + 1,
        productId: parseInt(productId),
        productName: product.name,
        quantity,
        totalPrice: product.price * quantity,
        userInfo,
        orderDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      orders.push(newOrder);
      writeData('orders', orders);
      
      console.log(`주문 완료: 주문 ID ${newOrder.id}, 남은 재고 ${currentProduct.stock}`);
      res.json({ success: true, order: newOrder });
    } else {
      res.status(400).json({ error: '재고가 부족합니다.' });
    }
  }, 100); // 100ms 지연
});

// 7. 주문 내역 조회
app.get('/api/orders', (req, res) => {
  const orders = readData('orders');
  res.json(orders);
});

// 8. 사용자 프로필 조회 (XSS 취약점 포함)
app.get('/api/profile', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: '이름을 입력해주세요.' });
  }
  
  // 의도적인 XSS 취약점: 사용자 입력을 그대로 HTML에 삽입
  const profileHtml = `
    <div class="profile">
      <h2>사용자 프로필</h2>
      <p>안녕하세요, ${name}님!</p>
      <p>해커 굿즈 쇼핑몰에 오신 것을 환영합니다.</p>
    </div>
  `;
  
  res.send(profileHtml);
});

// 9. 관리자 페이지 (권한 확인 없음)
app.get('/api/admin/users', (req, res) => {
  // 실제로는 관리자 권한을 확인해야 하지만 교육용으로 생략
  const users = readData('users');
  res.json(users);
});

// 10. 파일 업로드 (경로 탐색 취약점)
app.post('/api/upload', (req, res) => {
  const { filename, content } = req.body;
  
  if (!filename || !content) {
    return res.status(400).json({ error: '파일명과 내용을 입력해주세요.' });
  }
  
  // 의도적인 경로 탐색 취약점
  const filePath = path.join(__dirname, 'uploads', filename);
  
  try {
    // 디렉토리가 없으면 생성
    const uploadDir = path.dirname(filePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    res.json({ success: true, message: '파일이 업로드되었습니다.', path: filePath });
  } catch (error) {
    res.status(500).json({ error: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

// React 앱을 위한 fallback 라우팅
app.get('*', (req, res) => {
  // API 요청이 아닌 경우에만 React 앱을 제공
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  } else {
    res.status(404).json({ error: 'API 엔드포인트를 찾을 수 없습니다.' });
  }
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`=== 해커 굿즈 쇼핑몰 서버 시작 ===`);
  console.log(`서버 포트: ${PORT}`);
  console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n=== 보안 취약점 정보 ===`);
  console.log(`1. Command Injection: /api/search?q="; ls -la; echo "`);
  console.log(`2. SQL Injection: /api/login (username: admin' OR '1'='1)`);
  console.log(`3. XSS: /api/profile?name=<script>alert('XSS')</script>`);
  console.log(`4. Race Condition: /api/order (동시 주문 테스트)`);
  console.log(`5. 권한 우회: /api/admin/users`);
  console.log(`6. 경로 탐색: /api/upload (filename: ../../../etc/passwd)`);
  console.log(`================================\n`);
});

module.exports = app;
