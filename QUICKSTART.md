# 🚀 Quick Start Guide - SurveyPro AI

## Khởi động nhanh trong 3 bước

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Cấu hình MongoDB

Bạn có 3 tùy chọn:

#### Option A: MongoDB Atlas (Khuyến nghị - Miễn phí, không cần cài đặt)

1. Đăng ký tài khoản tại: https://www.mongodb.com/cloud/atlas/register
2. Tạo cluster miễn phí
3. Lấy connection string
4. Cập nhật file `.env`:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/surveypro?retryWrites=true&w=majority
```

#### Option B: MongoDB Local

Xem hướng dẫn chi tiết trong file `MONGODB_SETUP.md`

#### Option C: Sử dụng MongoDB demo (Tạm thời)

Để test nhanh, bạn có thể sử dụng connection string demo (chỉ dùng cho development):

```env
# Lưu ý: Đây chỉ là ví dụ, bạn cần tạo MongoDB của riêng mình
MONGODB_URI=mongodb://localhost:27017/surveypro
```

### Bước 3: Khởi động server

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:5000**

---

## 🎯 Sử dụng ngay

1. Mở trình duyệt: `http://localhost:5000`
2. Nhấn "Đăng ký" để tạo tài khoản
3. Tạo khảo sát đầu tiên của bạn!

---

## 📱 Demo Flow

### 1. Đăng ký tài khoản
- Truy cập: `http://localhost:5000/register`
- Nhập: Tên, Email, Mật khẩu
- Nhấn "Đăng ký"

### 2. Tạo khảo sát
- Dashboard → "Tạo khảo sát mới"
- Nhập tiêu đề: "Khảo sát về Smartphone"
- Thêm câu hỏi:
  - **Câu 1** (Text): "Bạn nghĩ gì về smartphone của mình?"
  - **Câu 2** (Radio): "Bạn đang dùng điện thoại gì?"
    - iPhone
    - Samsung
    - Oppo
    - Khác
  - **Câu 3** (Checkbox): "Bạn thích smartphone như thế nào?"
    - Giá rẻ
    - Bền chắc
    - Camera tốt
    - Pin trâu
- Đổi trạng thái: "Đang hoạt động"
- Nhấn "Lưu khảo sát"

### 3. Chia sẻ khảo sát
- Dashboard → "🔗 Sao chép link"
- Mở link trong tab mới (hoặc chế độ ẩn danh)
- Trả lời khảo sát

### 4. Xem kết quả
- Dashboard → "📊 Xem kết quả"
- Xem biểu đồ, thống kê
- Export CSV

---

## 🎨 Tính năng đã có

✅ 6 loại câu hỏi (Text, Radio, Checkbox, Date, Table)  
✅ Dashboard quản lý khảo sát  
✅ Trang trả lời khảo sát đẹp mắt  
✅ Phân tích với biểu đồ Chart.js  
✅ Export CSV  
✅ Authentication (JWT)  
✅ Dark theme hiện đại  

---

## ❓ Gặp vấn đề?

### Lỗi kết nối MongoDB
- Kiểm tra MongoDB đang chạy: `Get-Service -Name MongoDB`
- Hoặc sử dụng MongoDB Atlas (cloud)

### Port 5000 đã được sử dụng
- Đổi port trong file `.env`:
```env
PORT=3000
```

### Lỗi khác
- Xem log trong terminal
- Kiểm tra file `README.md` để biết thêm chi tiết

---

## 📚 Tài liệu

- **README.md**: Hướng dẫn chi tiết
- **MONGODB_SETUP.md**: Hướng dẫn cài MongoDB
- **API Documentation**: Xem trong README.md

---

## 🚀 Next Steps

Sau khi chạy thành công, bạn có thể:

1. Tùy chỉnh giao diện trong `public/css/style.css`
2. Thêm tính năng mới trong `server/controllers/`
3. Phát triển các tính năng nâng cao (conditional logic, rewards, etc.)

---

**Chúc bạn thành công! 🎉**
