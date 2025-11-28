# 📖 Hướng dẫn sử dụng SurveyPro AI

## 🎯 Giới thiệu

SurveyPro AI là hệ thống quản lý khảo sát đa công ty với cấu trúc đơn giản:

**2 Loại người dùng:**
- 👤 **Admin**: Cần đăng nhập để tạo và quản lý surveys
- 🧑 **End Users**: KHÔNG cần đăng nhập, chỉ cần link để làm survey

**Cấu trúc:**
```
🏢 Company (Công ty)
   └─ 👤 Admins (Quản trị viên - CẦN ĐĂNG NHẬP)
       └─ 📋 Surveys (Khảo sát)
           ├─ ❓ Questions (Câu hỏi)
           │   └─ ☑️ Answers (Lựa chọn)
           └─ 📝 Responses (Từ End Users - KHÔNG CẦN ĐĂNG NHẬP)
```

---

## 🚀 Bắt đầu

### 1. Khởi động server

```bash
# Cài đặt dependencies (lần đầu)
npm install

# Khởi động MongoDB (đảm bảo MongoDB đang chạy)
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod

# Khởi động server
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

---

## 👨‍💼 Dành cho Admin

### Bước 1: Đăng ký Admin

1. Truy cập: `http://localhost:5000/admin/register`
2. Chọn công ty có sẵn HOẶC tạo công ty mới
3. Nhập thông tin:
   - Email (bắt buộc)
   - Mật khẩu (tối thiểu 6 ký tự)
   - Số điện thoại (tùy chọn)
4. Click **"Đăng ký"**

### Bước 2: Đăng nhập Admin

1. Truy cập: `http://localhost:5000/admin/login`
2. Nhập email và mật khẩu
3. Click **"Đăng nhập"**

### Bước 3: Xem Admin Dashboard

1. Sau khi đăng nhập, bạn sẽ được chuyển đến: `/admin/dashboard`
2. Có 2 tabs:
   - **🏢 Công ty**: Quản lý danh sách công ty
   - **👤 Admins**: Quản lý admins trong công ty của bạn

### Bước 4: Quản lý Surveys

1. Từ navbar, click **"SurveyPro AI - Admin"** hoặc truy cập: `/dashboard`
2. Danh sách surveys của bạn sẽ hiển thị
3. Click **"+ Tạo khảo sát mới"** để tạo survey

### Bước 5: Tạo Survey

1. Truy cập: `/create-survey`
2. Điền thông tin:
   - **Tiêu đề khảo sát** (bắt buộc)
   - **Mô tả** (tùy chọn)
   - **Trạng thái**:
     - `Nháp`: Chưa công khai
     - `Đang hoạt động`: Có thể truy cập công khai
     - `Đã đóng`: Không thể submit responses

3. Thêm câu hỏi:
   - Click **"+ Thêm câu hỏi"**
   - Chọn loại câu hỏi:
     - ✍️ **Text**: Văn bản tự do
     - ⭕ **Radio**: Chọn một lựa chọn
     - ☑️ **Checkbox**: Chọn nhiều lựa chọn
     - 📅 **Date**: Ngày tháng
     - 📊 **Table - Single**: Bảng với radio
     - 📊 **Table - Multiple**: Bảng với checkbox
   - Nhập câu hỏi
   - Đánh dấu "Bắt buộc trả lời" nếu cần
   - Với Radio/Checkbox: Thêm các lựa chọn
   - Với Table: Nhập danh sách hàng và cột

4. Click **"💾 Lưu khảo sát"**

### Bước 6: Chia sẻ Survey

1. Trong dashboard, tìm survey muốn chia sẻ
2. Click **"🔗 Sao chép link"**
3. Link sẽ có dạng: `http://localhost:5000/survey/{surveyId}`
4. Chia sẻ link này với end users

### Bước 7: Xem Analytics

1. Trong dashboard, click **"📊 Xem kết quả"** trên survey
2. Analytics page sẽ hiển thị:
   - 📈 Biểu đồ cho Radio/Checkbox questions
   - 📝 Danh sách text answers
   - 📊 Tổng số responses
3. Click **"📥 Export CSV"** để xuất dữ liệu

### Bước 8: Chỉnh sửa/Xóa Survey

- **Chỉnh sửa**: Click **"✏️ Chỉnh sửa"** → cập nhật thông tin → Lưu
- **Xóa**: Click **"🗑️ Xóa"** → Xác nhận

---

## 🧑‍💻 Dành cho End Users (Người tham gia khảo sát)

### ⚡ KHÔNG CẦN ĐĂNG KÝ / ĐĂNG NHẬP!

End users **KHÔNG CẦN TÀI KHOẢN**. Đơn giản thế này:

1. 📩 **Nhận link** từ Admin (ví dụ: `http://localhost:5000/survey/abc123`)
2. 🖱️ **Click vào link** (mở trong bất kỳ trình duyệt nào)
3. 📝 **Đọc và trả lời** các câu hỏi
4. ✅ **Click "✓ Gửi câu trả lời"**
5. 🎉 **Xong!** - Không cần làm gì thêm

> 💡 **Lưu ý:** End users chỉ có thể:
> - Xem và làm survey qua link công khai
> - Không thể tạo survey
> - Không thể xem responses của người khác
> - Không thể xem analytics

---

## 🔐 Phân quyền và Bảo mật

### 👤 Admin (CẦN ĐĂNG NHẬP)
**Có thể làm:**
- ✅ Tạo, chỉnh sửa, xóa surveys của mình
- ✅ Xem responses và analytics của surveys của mình
- ✅ Export dữ liệu CSV
- ✅ Quản lý admins trong cùng company
- ✅ Chia sẻ link surveys công khai

**Không thể làm:**
- ❌ Xem/sửa surveys của admin khác (khác company hoặc cùng company)
- ❌ Xem responses của surveys không phải của mình

### 🧑 End Users (KHÔNG CẦN ĐĂNG NHẬP)
**Có thể làm:**
- ✅ Truy cập surveys có status = "Đang hoạt động" qua link công khai
- ✅ Submit responses
- ✅ Xem survey description và questions

**Không thể làm:**
- ❌ Tạo survey
- ❌ Xem analytics
- ❌ Xem responses của người khác
- ❌ Chỉnh sửa/xóa responses đã submit
- ❌ Truy cập surveys có status = "Nháp" hoặc "Đã đóng"

---

## 📊 Các loại câu hỏi

### 1. Text (Văn bản)
- Người dùng nhập văn bản tự do
- Sử dụng cho: Ý kiến, feedback, mô tả

### 2. Radio (Một lựa chọn)
- Chọn MỘT trong các options
- Analytics: Biểu đồ cột
- Sử dụng cho: Tuổi, giới tính, lựa chọn duy nhất

### 3. Checkbox (Nhiều lựa chọn)
- Chọn NHIỀU trong các options
- Analytics: Biểu đồ cột
- Sử dụng cho: Sở thích, kỹ năng, nhiều lựa chọn

### 4. Date (Ngày tháng)
- Chọn ngày tháng
- Sử dụng cho: Ngày sinh, ngày sự kiện

### 5. Table - Single (Bảng - Một lựa chọn)
- Ma trận với radio buttons
- Mỗi hàng chọn MỘT cột
- Sử dụng cho: Rating nhiều items

### 6. Table - Multiple (Bảng - Nhiều lựa chọn)
- Ma trận với checkboxes
- Mỗi hàng chọn NHIỀU cột
- Sử dụng cho: So sánh features

---

## 🛠️ Troubleshooting

### Lỗi: Cannot connect to database
**Giải pháp:**
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra connection string trong `.env`
- Default: `MONGODB_URI=mongodb://localhost:27017/surveypro-ai`

### Lỗi: 401 Unauthorized
**Giải pháp:**
- Token hết hạn → Đăng xuất và đăng nhập lại
- Xóa localStorage:
  ```javascript
  localStorage.clear();
  location.reload();
  ```

### Lỗi: Survey không tải được
**Giải pháp:**
- Kiểm tra survey status = "active"
- Kiểm tra surveyId trong URL có đúng không
- Kiểm tra survey chưa bị xóa (soft delete)

### Lỗi: Không submit được response
**Giải pháp:**
- Kiểm tra đã điền tất cả câu hỏi bắt buộc chưa
- Kiểm tra survey status = "active"
- Mở Console (F12) để xem lỗi chi tiết

---

## 📚 API Endpoints Reference

### 🔒 Admin Routes (Yêu cầu adminToken)

```javascript
// Surveys
GET    /api/surveys              // Lấy tất cả surveys của admin
GET    /api/surveys/:id          // Lấy chi tiết survey
POST   /api/surveys              // Tạo survey mới
PUT    /api/surveys/:id          // Cập nhật survey
DELETE /api/surveys/:id          // Xóa survey

// Responses & Analytics
GET /api/responses/survey/:surveyId              // Lấy responses
GET /api/responses/survey/:surveyId/analytics    // Lấy analytics
GET /api/responses/survey/:surveyId/export       // Export CSV

// Admins
POST   /api/admins/register      // Đăng ký admin
POST   /api/admins/login         // Đăng nhập admin
GET    /api/admins/company/:id   // Lấy admins của company
DELETE /api/admins/:id           // Xóa admin

// Companies
GET    /api/companies            // Lấy tất cả companies
POST   /api/companies            // Tạo company mới
GET    /api/companies/:id/stats  // Lấy stats của company
DELETE /api/companies/:id        // Xóa company
```

### 🌐 Public Routes (KHÔNG cần authentication)

```javascript
// End users chỉ dùng 2 routes này:
GET  /api/surveys/public/:id           // Lấy public survey
POST /api/responses/survey/:surveyId   // Submit response
```

---

## 💡 Tips & Best Practices

### Cho Admin:

1. **Đặt tiêu đề rõ ràng**: "Khảo sát về smartphone" thay vì "Survey 1"
2. **Viết mô tả**: Giải thích mục đích khảo sát
3. **Sắp xếp câu hỏi logic**: Từ dễ đến khó, từ chung đến cụ thể
4. **Sử dụng "Bắt buộc"**: Chỉ đánh dấu bắt buộc cho câu hỏi quan trọng
5. **Test trước khi chia sẻ**: Click "👁️ Xem trước" để test
6. **Export định kỳ**: Backup dữ liệu bằng Export CSV

### Cho Survey Design:

1. **Giữ survey ngắn gọn**: 5-10 câu hỏi là tối ưu
2. **Tránh câu hỏi mơ hồ**: Rõ ràng, cụ thể
3. **Sử dụng đúng loại câu hỏi**: Radio cho single choice, Checkbox cho multiple
4. **Thêm progress bar**: Người dùng biết còn bao nhiêu câu
5. **Kiểm tra trên mobile**: Đảm bảo responsive

---

## 🎨 Customization

### Thay đổi màu sắc

Chỉnh sửa `public/css/style.css`:

```css
:root {
    --primary: #7c3aed;      /* Màu chính */
    --secondary: #10b981;    /* Màu phụ */
    --accent: #f59e0b;       /* Màu nhấn */
}
```

### Thay đổi API URL

Chỉnh sửa `public/js/app.js`:

```javascript
const API_BASE_URL = 'http://your-domain.com/api';
```

---

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra Console log (F12 → Console)
2. Kiểm tra Network tab (F12 → Network)
3. Đọc file `FRONTEND_FLOW_FIX.md` để hiểu chi tiết flow
4. Contact support team

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-26  
**Maintained by:** Development Team

