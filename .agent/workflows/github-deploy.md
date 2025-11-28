---
description: Hướng dẫn push project lên GitHub và thiết lập CI/CD
---

# 🚀 Push Project lên GitHub và Thiết lập CI/CD

## Bước 1: Tạo Repository trên GitHub

1. Truy cập https://github.com/huynhtulenh/
2. Click nút **"New"** hoặc **"+"** → **"New repository"**
3. Điền thông tin:
   - **Repository name**: `surveypro-ai`
   - **Description**: `SurveyPro AI - Multi-company Survey Management System`
   - **Visibility**: Chọn **Public** hoặc **Private**
   - **KHÔNG** check "Initialize this repository with a README" (vì đã có sẵn)
4. Click **"Create repository"**

## Bước 2: Kết nối Local Repository với GitHub

Sau khi tạo repository, GitHub sẽ hiển thị hướng dẫn. Chạy các lệnh sau:

```bash
# Thêm remote repository
git remote add origin https://github.com/huynhtulenh/surveypro-ai.git

# Đổi tên branch sang main (nếu cần)
git branch -M main

# Push code lên GitHub
git push -u origin main
```

## Bước 3: Xác minh CI/CD đã hoạt động

1. Truy cập repository trên GitHub
2. Click tab **"Actions"**
3. Bạn sẽ thấy workflow **"CI/CD Pipeline"** đang chạy
4. Click vào workflow để xem chi tiết

## Bước 4: Thiết lập GitHub Secrets (nếu cần deploy)

Nếu bạn muốn tự động deploy, cần thêm secrets:

1. Vào repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Thêm các secrets cần thiết:
   - `MONGODB_URI`: Connection string MongoDB
   - `JWT_SECRET`: Secret key cho JWT
   - Các secrets khác tùy theo platform deploy

## Bước 5: Cấu hình Deploy (Tùy chọn)

### Option 1: Deploy lên Heroku

1. Tạo file `Procfile`:
```
web: node server.js
```

2. Cài Heroku CLI và chạy:
```bash
heroku create surveypro-ai
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Option 2: Deploy lên Railway

1. Truy cập https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Chọn repository `surveypro-ai`
4. Thêm environment variables
5. Deploy tự động

### Option 3: Deploy lên DigitalOcean App Platform

1. Truy cập https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Chọn GitHub repository
4. Cấu hình build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Thêm environment variables
6. Deploy

### Option 4: Deploy lên Render

1. Truy cập https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Cấu hình:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Thêm environment variables
6. Deploy

## Bước 6: Cập nhật CI/CD Workflow cho Deploy

Mở file `.github/workflows/ci-cd.yml` và cập nhật phần deploy:

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  
  steps:
  - name: Checkout code
    uses: actions/checkout@v4
  
  # Ví dụ deploy lên Heroku
  - name: Deploy to Heroku
    uses: akhileshns/heroku-deploy@v3.12.14
    with:
      heroku_api_key: ${{secrets.HEROKU_API_KEY}}
      heroku_app_name: "surveypro-ai"
      heroku_email: "your-email@example.com"
```

## Bước 7: Test CI/CD Pipeline

1. Tạo một thay đổi nhỏ:
```bash
# Sửa file README.md hoặc bất kỳ file nào
git add .
git commit -m "test: verify CI/CD pipeline"
git push origin main
```

2. Kiểm tra GitHub Actions để xem pipeline chạy

## 🎯 Workflow Hoàn chỉnh

Sau khi thiết lập xong, workflow sẽ như sau:

1. **Developer push code** → GitHub
2. **GitHub Actions tự động**:
   - Chạy tests
   - Build application
   - Deploy lên production (nếu push vào main branch)
3. **Application live** trên server

## 📝 Lưu ý

- File `.env` đã được gitignore, không push lên GitHub
- Sử dụng `.env.example` làm template
- Thêm secrets vào GitHub Settings, không hardcode trong code
- CI/CD sẽ tự động chạy mỗi khi push hoặc tạo pull request

## 🔧 Troubleshooting

### Lỗi: Authentication failed
```bash
# Sử dụng Personal Access Token thay vì password
# Tạo token tại: https://github.com/settings/tokens
git remote set-url origin https://YOUR_TOKEN@github.com/huynhtulenh/surveypro-ai.git
```

### Lỗi: CI/CD workflow không chạy
- Kiểm tra tab Actions có enabled không
- Kiểm tra file `.github/workflows/ci-cd.yml` có đúng format không

### Lỗi: Deploy failed
- Kiểm tra secrets đã được thêm chưa
- Kiểm tra logs trong GitHub Actions
- Kiểm tra platform deploy có hoạt động không

---

**Chúc mừng!** 🎉 Project của bạn đã có trên GitHub với CI/CD pipeline!
