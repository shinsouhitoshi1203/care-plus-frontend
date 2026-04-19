# 📱 Hướng dẫn cài đặt và Chạy FE (Care+)

Tài liệu này hướng dẫn cách thiết lập môi trường để chạy ứng dụng Care+ trên giả lập hoặc thiết bị thật.

---

## 🛠 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18 trở lên.
- **Giả lập**: Khuyến khích dùng **BlueStacks 5** (Bản P64) hoặc Android Studio Emulator.
- **Công cụ**: Cài đặt EAS CLI (`npm install -g eas-cli`).

---

## 📂 2. Cấu hình file bí mật (Secrets)
Vì lí do bảo mật, các file sau không có trên Git, bạn cần copy từ trưởng nhóm:
1. **`.env`**: Tạo tại thư mục gốc FE.
   ```env
   # Dùng 10.0.2.2 để gọi về host machine từ giả lập
   EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080/api
   ```
2. **`google-services.json`**: Đặt vào thư mục `/private/google-services.json`.

---

## 📦 3. Cài đặt thư viện
Dự án có sử dụng một số thư viện Native, hãy cài đặt bằng lệnh đặc biệt sau:
```bash
npm install --legacy-peer-deps
```

---

## 🎮 4. Thiết lập BlueStacks (Rất quan trọng)
Để app kết nối được với máy tính:
1. **Mở ADB**: Cài đặt BlueStacks -> Advanced -> Bật "Android Debug Bridge".
2. **Kết nối**: Chạy lệnh `adb connect localhost:5555` trên PC.
3. **Mã Device Unique**: Để test 2 máy khác nhau, vào Settings -> Phone -> Đổi **Device Profile** và chọn **Randomize ID** cho mỗi máy, sau đó Restart BlueStacks.

---

## 🚀 5. Chạy ứng dụng

### Bước 1: Khởi động Metro Bundler
```bash
npx expo start
```

### Bước 2: Cài đặt và Mở App
- Nếu đã có bản APK trong BlueStacks: Mở app, chọn **Enter URL manually** -> Nhập `http://[IP_MAY_TINH]:8081` (Ví dụ: `http://192.168.1.15:8081`).
- Nếu chưa có app: Bạn cần build bản Development Client (Xem mục 6).

---

## 🏗 6. Build bản Android mới (EAS Build)
Khi thêm thư viện Native mới (như Firebase, Camera, Location), bạn cần đúc lại file APK:
```bash
# Đăng nhập expo trước (nếu chưa)
eas login

# Build trên Cloud (kết quả trả về link tải file APK)
eas build --platform android --profile development
```
*Sau khi build xong, tải file .apk về và kéo thả vào BlueStacks.*

---

## 🆘 Troubleshooting (Lỗi thường gặp)
- **Lỗi Network Error**: Kiểm tra Backend đã chạy chưa và IP trong `.env` có đúng không.
- **Lỗi TurboModule/RNCDatePicker**: Do bản APK trên BlueStacks cũ, hãy thực hiện lại Bước 6 (EAS Build).
- **Lỗi "Missing google-services.json" trên Cloud**: Đảm bảo file `.easignore` KHÔNG chặn thư mục `/private`.
