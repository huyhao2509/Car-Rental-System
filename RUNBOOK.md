# Car Rental System - Runbook

Tai lieu nay giup mo lai project la chay duoc ngay, va nho quy trinh lam viec/Git.

## 1) Cau truc chinh
- Backend: `car-rental-backend`
- Frontend: `car-rental-website`
- Docker services: MySQL + Redis (trong `car-rental-backend/docker-compose.yaml`)

## 2) Ports dang dung (local)
- Backend API: `http://localhost:5000`
- Frontend Vite: `http://localhost:5173`
- MySQL Docker (host): `3307` -> container `3306`
- Redis Docker (host): `6380` -> container `6379`

## 3) Bien moi truong backend (.env)
File: `car-rental-backend/.env`

Gia tri local da dung:
- `DB_HOST=localhost`
- `DB_PORT=3307`
- `DB_NAME=car_rental`
- `DB_USER=root`
- `DB_PASSWORD=123456`
- `DB_ROOT_PASSWORD=123456`
- `REDIS_HOST=localhost`
- `REDIS_PORT=6380`
- `REDIS_PASSWORD=123456`
- `PORT=5000`
- `CLIENT_URL=http://localhost:5173`
- `OPENAI_API_KEY=<your_key>`
- `DB_AUTO_SYNC=false`
- `DB_SYNC_ALTER=false`
- `MB_SCHEDULER_ENABLED=false`

## 4) Chay project tu dau
### B1. Bat Docker
Mo Docker Desktop, doi den khi Docker daemon running.

### B2. Chay MySQL + Redis
```powershell
cd car-rental-backend
docker compose up -d
docker ps
```

### B3. Chay Backend
```powershell
cd car-rental-backend
npm start
```
Health check:
```powershell
Invoke-RestMethod http://localhost:5000/
```

### B4. Chay Frontend
```powershell
cd car-rental-website
npm run dev
```
Mo: `http://localhost:5173`

## 5) Tai khoan mac dinh sau khi seed
Neu DB rong, seed lai:
```powershell
cd car-rental-backend
npm run db:seed
```

Tai khoan admin mac dinh:
- Email: `admin@gmail.com`
- Password: `123456`

## 6) Chatbot OpenAI
- Frontend chatbot goi endpoint qua proxy: `/api/chatbot/ask`
- Backend route: `/api/chatbot/ask`
- Can co `OPENAI_API_KEY` hop le trong `.env`

Test nhanh chatbot:
```powershell
$body = @{ question = 'Xin chao' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:5173/api/chatbot/ask' -ContentType 'application/json' -Body $body
```

## 7) Loi thuong gap va cach xu ly
### Loi: Port 5000 dang duoc su dung
Nguyen nhan: chay backend trung 2 lan.

Cach xu ly:
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -First 1 -ExpandProperty OwningProcess
Stop-Process -Id <PID> -Force
npm start
```

### Loi: Frontend khong ket noi server
- Dam bao backend dang chay o `5000`
- Dam bao frontend dang chay o `5173`
- Hard reload trinh duyet: `Ctrl+F5`

### Loi: Chatbot khong ket noi
- Kiem tra `OPENAI_API_KEY`
- Test truc tiep endpoint `/api/chatbot/ask`

### Loi DB schema conflict (FK/PK duplicate)
- Khong bat auto alter schema (`DB_AUTO_SYNC=false`, `DB_SYNC_ALTER=false`)
- Neu can, reset DB/seed lai

## 8) Quy trinh Git de lam viec an toan
### Tao nhanh moi
```powershell
git switch -c ten-nhanh-moi
```

### Luu thay doi
```powershell
git add -A
git commit -m "mo ta thay doi"
```

### Push nhanh moi
```powershell
git push -u origin ten-nhanh-moi
```

### Dong bo nhanh cap nhat
```powershell
git fetch origin
git switch cap-nhat-moi-nhat
git merge origin/hoan_thanh
git push origin cap-nhat-moi-nhat
```

## 9) Bao mat
- Khong commit `.env`
- Khong chia se API key
- Neu key bi lo, rotate key ngay (xoa key cu, tao key moi)

## 10) Checklist moi lan mo lai project
- [ ] Docker running
- [ ] `docker compose up -d` trong backend
- [ ] Backend health OK (`/`)
- [ ] Frontend mo duoc (`5173`)
- [ ] Login admin OK
- [ ] Chatbot tra loi duoc
