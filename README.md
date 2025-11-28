# SurveyPro AI 📊

Hệ thống quản lý khảo sát đa công ty - Đơn giản, mạnh mẽ và dễ sử dụng.

## 🎯 Đối tượng sử dụng

- 👤 **Admin**: Đăng nhập để tạo và quản lý surveys
- 🧑 **End Users**: KHÔNG cần đăng nhập, chỉ cần link để làm survey

## 🏗️ Cấu trúc hệ thống

```
🏢 Company (Công ty)
   └─ 👤 Admin (Quản trị viên - CẦN ĐĂNG NHẬP)
       └─ 📋 Survey (Khảo sát)
           ├─ ❓ Questions (Câu hỏi)
           │   └─ ☑️ Answers (Lựa chọn)
           └─ 📝 Responses (Từ End Users - KHÔNG CẦN ĐĂNG NHẬP)
```

## ✨ Tính năng chính

### ✅ Core Features (Đã hoàn thành)

**Cho Admin:**
- ✅ **Multi-company Management**: Hỗ trợ nhiều công ty, mỗi công ty có nhiều admins
- ✅ **Admin Authentication**: Đăng ký, đăng nhập với JWT
- ✅ **Survey Management**: Tạo, chỉnh sửa, xóa khảo sát
- ✅ **6 loại câu hỏi**:
  - Text (Văn bản)
  - Radio (Một lựa chọn)
  - Checkbox (Nhiều lựa chọn)
  - Date (Ngày tháng)
  - Table - Single (Bảng một lựa chọn)
  - Table - Multiple (Bảng nhiều lựa chọn)
- ✅ **Analytics Dashboard**:
  - Biểu đồ trực quan với Chart.js
  - Thống kê tổng quan
  - Xem danh sách responses
  - Export CSV
- ✅ **Share Links**: Chia sẻ link surveys công khai

**Cho End Users:**
- ✅ **No Registration Required**: Không cần đăng ký/đăng nhập
- ✅ **Public Survey Access**: Truy cập surveys qua link
- ✅ **Beautiful UI**: Giao diện đẹp, responsive, dễ sử dụng
- ✅ **Multi-device Support**: Hoạt động tốt trên mobile, tablet, desktop

### Phase 2 - Advanced Features (Sẵn sàng phát triển)

- 🔄 Logic điều kiện (Conditional Logic)
- 🔄 Chuyển hướng câu hỏi
- 🔄 Kết thúc khảo sát sớm
- 🔄 Lọc dữ liệu nâng cao
- 🔄 Cross-tab analysis

### Phase 3 - Premium Features (Kế hoạch)

- 📧 Xác thực email
- 📱 Xác thực SMS/OTP
- 🎁 Hệ thống thưởng
- 📢 Tích hợp quảng cáo

## 🚀 Cài đặt

### Yêu cầu

- Node.js (v18+)
- MongoDB (v4.4+)

### Bước 1: Cài đặt dependencies

```bash
cd surveypro-ai
npm install
```

### Bước 2: Cấu hình MongoDB

Đảm bảo MongoDB đang chạy trên máy của bạn. Mặc định kết nối tới:
```
mongodb://localhost:27017/surveypro
```

Nếu muốn thay đổi, chỉnh sửa file `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/surveypro
```

### Bước 3: Khởi động server

**Development mode** (với nodemon):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📖 Hướng dẫn sử dụng

### 👤 Cho Admin

#### 1. Đăng ký Admin
- Truy cập `http://localhost:5000/admin/register`
- Chọn công ty có sẵn HOẶC tạo công ty mới
- Nhập Email và Mật khẩu
- Nhấn "Đăng ký"

#### 2. Đăng nhập
- Truy cập `http://localhost:5000/admin/login`
- Nhập Email và Mật khẩu
- Nhấn "Đăng nhập"

#### 3. Tạo Survey
- Click "Tạo khảo sát mới"
- Nhập tiêu đề, mô tả, chọn trạng thái
- Thêm câu hỏi với các loại khác nhau
- Nhấn "💾 Lưu khảo sát"

#### 4. Chia sẻ Survey
- Từ Dashboard, click "🔗 Sao chép link"
- Chia sẻ link với end users
- Link: `http://localhost:5000/survey/[ID]`

#### 5. Xem Analytics
- Click "📊 Xem kết quả" trên survey
- Xem biểu đồ và thống kê
- Click "📥 Export CSV" để tải dữ liệu

### 🧑 Cho End Users

1. **Nhận link** từ Admin
2. **Click vào link** (không cần đăng nhập!)
3. **Trả lời** các câu hỏi
4. **Click "✓ Gửi câu trả lời"**
5. **Xong!** 🎉

> 📚 **Xem thêm:** `HUONG_DAN_SU_DUNG.md` để biết chi tiết đầy đủ

## 🏗️ Cấu trúc dự án

```
surveypro-ai/
├── server/
│   ├── models/          # MongoDB models
│   │   ├── Company.js   # Company model
│   │   ├── Admin.js     # Admin model (với company ref)
│   │   ├── Survey.js    # Survey model (với admin ref)
│   │   ├── Question.js  # Question model
│   │   ├── Answer.js    # Answer options
│   │   └── Response.js  # Survey responses
│   ├── routes/          # API routes
│   │   ├── companies.js # Company routes
│   │   ├── admins.js    # Admin auth routes
│   │   ├── surveys.js   # Survey routes
│   │   └── responses.js # Response routes
│   ├── controllers/     # Business logic
│   │   ├── companyController.js
│   │   ├── adminController.js
│   │   ├── surveyController.js
│   │   └── responseController.js
│   ├── middleware/      # Middleware
│   │   └── adminAuth.js # Admin authentication
│   └── config.js        # Configuration
├── public/
│   ├── css/
│   │   └── style.css    # Main stylesheet
│   ├── js/
│   │   └── app.js       # Core JS (adminAuth, adminApi, publicApi)
│   ├── index.html       # Landing page
│   ├── admin-login.html # Admin login
│   ├── admin-register.html # Admin register
│   ├── admin-dashboard.html # Company/Admin management
│   ├── dashboard.html   # Survey management
│   ├── create-survey.html # Survey builder
│   ├── take-survey.html # Public survey (no auth)
│   └── analytics.html   # Analytics dashboard
├── server.js            # Main server file
├── package.json
├── README.md            # This file
├── HUONG_DAN_SU_DUNG.md # Detailed guide (Vietnamese)
├── FRONTEND_FLOW_FIX.md # Technical documentation
├── QUICKSTART.md        # Quick start guide
└── MONGODB_SETUP.md     # MongoDB setup guide
```

## 🎨 Công nghệ sử dụng

### Backend
- **Node.js** + **Express**: Server framework
- **MongoDB** + **Mongoose**: Database
- **JWT**: Authentication
- **bcryptjs**: Password hashing

### Frontend
- **HTML5** + **CSS3** + **JavaScript**: Core technologies
- **Chart.js**: Data visualization
- **Google Fonts (Inter)**: Typography

### Design
- Dark theme với vibrant colors
- Glassmorphism effects
- Smooth animations & transitions
- Responsive design

## 📊 API Endpoints

### 🔒 Admin Routes (Require adminToken)

**Companies**
- `GET /api/companies` - Lấy tất cả companies
- `POST /api/companies` - Tạo company mới
- `GET /api/companies/:id/stats` - Lấy stats của company
- `DELETE /api/companies/:id` - Xóa company

**Admins**
- `POST /api/admins/register` - Đăng ký admin
- `POST /api/admins/login` - Đăng nhập admin
- `GET /api/admins/company/:id` - Lấy admins của company
- `DELETE /api/admins/:id` - Xóa admin

**Surveys**
- `GET /api/surveys` - Lấy surveys của admin
- `GET /api/surveys/:id` - Lấy chi tiết survey
- `POST /api/surveys` - Tạo survey mới
- `PUT /api/surveys/:id` - Cập nhật survey
- `DELETE /api/surveys/:id` - Xóa survey (soft delete)

**Responses & Analytics**
- `GET /api/responses/survey/:surveyId` - Lấy responses
- `GET /api/responses/survey/:surveyId/analytics` - Lấy analytics
- `GET /api/responses/survey/:surveyId/export` - Export CSV

### 🌐 Public Routes (No authentication)

**For End Users**
- `GET /api/surveys/public/:id` - Lấy public survey
- `POST /api/responses/survey/:surveyId` - Submit response

## 🔒 Bảo mật

- ✅ Mật khẩu admin được hash với bcryptjs
- ✅ JWT tokens cho admin authentication
- ✅ Protected routes với adminAuth middleware
- ✅ Admin chỉ xem được surveys của mình
- ✅ Survey ownership validation
- ✅ Input validation
- ✅ CORS enabled
- ✅ Soft delete cho surveys
- ✅ Public surveys chỉ accessible khi status = "active"

## 🎯 Roadmap

### Version 2.0
- [ ] Conditional logic cho câu hỏi
- [ ] Advanced filtering
- [ ] Cross-tab analysis
- [ ] Question branching

### Version 3.0
- [ ] Email verification
- [ ] SMS/OTP verification
- [ ] Reward system
- [ ] Payment integration
- [ ] Advanced analytics với AI

## 🤝 Đóng góp

Dự án này được phát triển như một công cụ học tập và demo. Mọi đóng góp đều được hoan nghênh!

## 📝 License

ISC

## 👨‍💻 Tác giả

Phát triển bởi SurveyPro AI Team

---

## 📚 Documentation

- **README.md** (this file): Overview và quick start
- **HUONG_DAN_SU_DUNG.md**: Hướng dẫn chi tiết bằng tiếng Việt
- **FRONTEND_FLOW_FIX.md**: Chi tiết kỹ thuật về flow và architecture
- **QUICKSTART.md**: Quick start guide
- **MONGODB_SETUP.md**: MongoDB setup guide

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-26  
**Status**: ✅ Production Ready

**Lưu ý**: Hệ thống đã hoàn thiện với multi-company structure và admin authentication. End users không cần authentication để làm surveys.
