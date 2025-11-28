# Contributing to SurveyPro AI

Cảm ơn bạn đã quan tâm đến việc đóng góp cho SurveyPro AI! 🎉

## 🚀 Quy trình đóng góp

### 1. Fork Repository

Fork repository này về tài khoản GitHub của bạn.

### 2. Clone Repository

```bash
git clone https://github.com/your-username/surveypro-ai.git
cd surveypro-ai
```

### 3. Tạo Branch mới

```bash
git checkout -b feature/ten-tinh-nang-moi
```

Quy tắc đặt tên branch:
- `feature/` - Tính năng mới
- `fix/` - Sửa lỗi
- `docs/` - Cập nhật documentation
- `refactor/` - Refactor code
- `test/` - Thêm tests

### 4. Cài đặt Dependencies

```bash
npm install
```

### 5. Thực hiện thay đổi

- Viết code rõ ràng, dễ hiểu
- Tuân thủ coding style hiện tại
- Thêm comments khi cần thiết
- Test kỹ trước khi commit

### 6. Commit Changes

```bash
git add .
git commit -m "feat: mô tả ngắn gọn về thay đổi"
```

Quy tắc commit message:
- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Cập nhật documentation
- `style:` - Formatting, missing semicolons, etc
- `refactor:` - Refactoring code
- `test:` - Thêm tests
- `chore:` - Cập nhật build tasks, package manager configs, etc

### 7. Push lên GitHub

```bash
git push origin feature/ten-tinh-nang-moi
```

### 8. Tạo Pull Request

1. Truy cập repository trên GitHub
2. Click "New Pull Request"
3. Chọn branch của bạn
4. Điền mô tả chi tiết về thay đổi
5. Submit Pull Request

## 📋 Coding Standards

### JavaScript

- Sử dụng ES6+ syntax
- Sử dụng `const` và `let`, tránh `var`
- Sử dụng arrow functions khi phù hợp
- Async/await thay vì callbacks
- Meaningful variable names

### Code Style

```javascript
// ✅ Good
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ Bad
function getUser(id) {
  User.findById(id, function(err, u) {
    if (err) console.log(err);
    return u;
  });
}
```

### API Design

- RESTful conventions
- Consistent error handling
- Proper HTTP status codes
- Clear response structures

### Frontend

- Semantic HTML
- Responsive design
- Accessibility (a11y)
- Progressive enhancement

## 🧪 Testing

Trước khi submit PR, hãy đảm bảo:

- [ ] Code chạy được locally
- [ ] Không có lỗi console
- [ ] Test trên nhiều browsers (Chrome, Firefox, Safari)
- [ ] Test responsive trên mobile
- [ ] Kiểm tra performance

## 📝 Documentation

Khi thêm tính năng mới:

- Cập nhật README.md nếu cần
- Cập nhật HUONG_DAN_SU_DUNG.md
- Thêm comments trong code
- Cập nhật API documentation

## 🐛 Báo cáo Bug

Khi báo cáo bug, hãy bao gồm:

1. **Mô tả bug**: Mô tả ngắn gọn về vấn đề
2. **Các bước tái hiện**:
   - Bước 1
   - Bước 2
   - ...
3. **Kết quả mong đợi**: Điều gì nên xảy ra
4. **Kết quả thực tế**: Điều gì đã xảy ra
5. **Screenshots**: Nếu có
6. **Môi trường**:
   - OS: [e.g. Windows 10]
   - Browser: [e.g. Chrome 120]
   - Node version: [e.g. 18.0.0]

## 💡 Đề xuất tính năng

Khi đề xuất tính năng mới:

1. **Mô tả tính năng**: Tính năng là gì?
2. **Use case**: Tại sao cần tính năng này?
3. **Giải pháp đề xuất**: Bạn muốn implement như thế nào?
4. **Alternatives**: Có giải pháp thay thế nào không?

## 🎯 Priority Areas

Các khu vực cần đóng góp:

### High Priority
- [ ] Unit tests
- [ ] Integration tests
- [ ] Error handling improvements
- [ ] Performance optimization

### Medium Priority
- [ ] UI/UX improvements
- [ ] Accessibility enhancements
- [ ] Documentation improvements
- [ ] Code refactoring

### Low Priority
- [ ] New features (Phase 2, 3)
- [ ] Advanced analytics
- [ ] Third-party integrations

## 🤝 Code Review Process

1. Maintainer sẽ review PR của bạn
2. Có thể yêu cầu thay đổi
3. Sau khi approve, PR sẽ được merge
4. Branch sẽ được xóa sau khi merge

## 📞 Liên hệ

Nếu có câu hỏi, hãy:
- Tạo Issue trên GitHub
- Comment trong Pull Request
- Liên hệ maintainers

## 🙏 Cảm ơn

Cảm ơn bạn đã đóng góp cho SurveyPro AI! Mọi đóng góp, dù lớn hay nhỏ, đều được đánh giá cao.

---

**Happy Coding!** 🚀
