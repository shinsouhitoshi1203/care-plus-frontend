# 🏥 Care Plus - Frontend (Mobile Application)

> **🧭 Điều hướng dự án:**
>
> - 📱 [**Frontend Repository (Hiện tại)**](https://github.com/shinsouhitoshi1203/care-plus-frontend)
> - ⚙️ [**Backend Repository (Care Plus Backend)**](https://github.com/JamesHarrision/care-plus-backend)

Care Plus là ứng dụng di động (Mobile App) đa nền tảng (iOS & Android) được xây dựng bằng React Native, nhằm cung cấp giải pháp quản lý sức khỏe toàn diện cho người dùng. Dự án này là phần frontend của hệ thống, tập trung vào trải nghiệm người dùng và giao diện trực quan.

## 🎯 Mục tiêu và Tổng quan

Dự án Care Plus Frontend tập trung vào việc cung cấp một giao diện trực quan, mượt mà và thân thiện với người dùng (bệnh nhân, người nhà, hoặc nhân viên y tế).
Các tính năng chính được ứng dụng cung cấp bao gồm:

- **Xác thực người dùng (Auth)**: Đăng nhập, đăng ký, đăng nhập nhanh (Quick Login).
- **Quản lý Hồ sơ y tế (Record)**: Theo dõi sức khỏe, lịch sử bệnh án.
- **Quản lý Đơn thuốc (Medication)**: Nhắc nhở uống thuốc, danh sách thuốc đang dùng.
- **Kết nối Gia đình (Family)**: Quản lý thành viên gia đình, theo dõi sức khỏe người thân.
- **Trợ giúp khẩn cấp (SOS)**: Tính năng gọi khẩn cấp, cảnh báo tức thì.
- **Thông báo đẩy (Push Notifications)**: Nhắc lịch khám, nhắc thuốc, cảnh báo.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

Dự án áp dụng các công nghệ hiện đại nhất trong hệ sinh thái React Native để đảm bảo hiệu năng và dễ dàng bảo trì:

- **Core Framework**: [React Native 0.81](https://reactnative.dev/) kết hợp cùng [Expo](https://expo.dev/) (SDK 54).
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/) (Strict typing).
- **Routing & Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (Dễ dàng quản lý điều hướng dựa trên cấu trúc thư mục).
- **State Management**:
  - [Zustand](https://github.com/pmndrs/zustand) (Quản lý trạng thái Client/Local State nhẹ nhàng).
  - [TanStack React Query](https://tanstack.com/query/latest) (Giao tiếp API, Caching, quản lý Server State).
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Viết Tailwind CSS trực tiếp cho React Native).
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) kết hợp với [Zod](https://zod.dev/) (Xác thực dữ liệu form an toàn).
- **Push Notification**: Sự kết hợp giữa `expo-notifications` và `Firebase Cloud Messaging (FCM)`.
- **Thư viện UI / Khác**: `@rneui/themed`, `lucide-react-native` (Icons), `react-native-reanimated`, và nhiều thư viện Native khác.

---

## 📁 Cấu trúc thư mục (Project Structure)

Toàn bộ logic và giao diện của ứng dụng được đặt trong thư mục `src/`, được tổ chức theo kiến trúc feature-based mô-đun hóa cao:

```text
care-plus-frontend/
├── android/                 # Mã nguồn tự sinh cho nền tảng Android (Native)
├── private/                 # Thư mục chứa các file bảo mật (google-services.json...)
├── release/                 # Thư mục phục vụ đóng gói/phát hành
├── src/                     # Cốt lõi của ứng dụng React Native
│   ├── api/                 # Cấu hình API, hàm gọi API
│   │   └── index.ts         # Entry point cho API chung
│   │
│   ├── app/                 # Màn hình (Screens) và định tuyến (Routing bằng Expo Router)
│   │   ├── (auth)/          # Nhóm route liên quan đến xác thực
│   │   ├── protected/       # Các route cần đăng nhập mới vào được
│   │   ├── index.tsx        # Màn hình khởi đầu
│   │   ├── _auth.tsx        # Entry/flow xử lý xác thực
│   │   └── _layout.tsx      # Layout chính (cấu hình Providers, Header)
│   │
│   ├── assets/              # Hình ảnh, fonts, và tài nguyên tĩnh
│   │
│   ├── components/          # Các UI components dùng chung
│   │   ├── ButtonList/      # Danh sách buttons
│   │   ├── buttons/         # Các button components
│   │   ├── dialogs/         # Dialog/Modal components
│   │   ├── input/           # Input field components
│   │   ├── Loading/         # Loading indicator
│   │   ├── message/         # Message/Toast components
│   │   ├── QR/              # QR code components
│   │   ├── SOS/             # SOS components
│   │   └── UserAvatar/      # User avatar component
│   │
│   ├── config/              # Cấu hình môi trường
│   │   ├── axios/           # Cấu hình Axios (interceptors, request/response)
│   │   ├── env/             # Biến môi trường
│   │   └── routing/         # Cấu hình routing
│   │
│   ├── features/            # Chức năng chính, được chia nhỏ theo Domain
│   │   ├── account/         # Quản lý tài khoản
│   │   ├── auth/            # Xác thực người dùng
│   │   ├── family/          # Quản lý gia đình
│   │   ├── home/            # Trang chủ
│   │   ├── medication/      # Quản lý thuốc
│   │   ├── quickLogin/      # Đăng nhập nhanh
│   │   ├── record/          # Hồ sơ y tế
│   │   ├── sos/             # Tính năng khẩn cấp
│   │   ├── user/            # Thông tin người dùng
│   │   └── welcome/         # Màn hình chào mừng
│   │
│   ├── hocs/                # Higher-Order Components
│   │
│   ├── hooks/               # Các custom React Hooks dùng lại
│   │   ├── useAuth.tsx      # Hook xác thực
│   │   ├── usePushNotifications.ts  # Hook quản lý push notifications
│   │   ├── useReset.tsx     # Hook reset trạng thái
│   │   ├── useSubPageTitle.tsx      # Hook quản lý tiêu đề trang con
│   │   └── useWait.tsx      # Hook delay/wait
│   │
│   ├── layouts/             # Cấu trúc bố cục dùng lại cho các màn hình
│   │
│   ├── stores/              # Global state management
│   │   ├── zustand/         # Zustand stores (client state)
│   │   │   └── index.ts
│   │   ├── tanstack/        # TanStack React Query config
│   │   │   ├── config.ts    # Query client configuration
│   │   │   ├── index.ts
│   │   │   └── readme.md
│   │   ├── secureStore/     # Secure storage (sensitive data)
│   │   │   └── index.ts
│   │   ├── useSOSStore.ts   # SOS state store
│   │   └── readme.md
│   │
│   ├── utils/               # Các hàm tiện ích, formatters, helpers
│   │
│   ├── global.css           # Styles toàn cục
│   └── readme.md            # README cho thư mục src
│
├── app.json                 # Cấu hình Expo app
├── package.json             # Dependencies và scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── nativewind-env.d.ts      # NativeWind type definitions
├── metro.config.js          # Metro bundler configuration
├── babel.config.js          # Babel configuration
├── eslint.config.js         # ESLint configuration
├── eas.json                 # EAS (Expo Application Services) configuration
├── FE_SETUP_GUIDE.md        # Hướng dẫn cài đặt chi tiết
└── README.md                # File README chính
```

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY DỰ ÁN (LOCAL SETUP)

Để cài đặt và khởi chạy dự án tại máy tính cá nhân của bạn (Local) - cho dù thông qua **phần mềm giả lập (Emulator / BlueStacks)** hay **thiết bị thật**, một **tài liệu hướng dẫn chuyên sâu đã được chuẩn bị sẵn**.

👉 **XEM TÀI LIỆU HƯỚNG DẪN CHI TIẾT TẠI ĐÂY**: **[[FE_SETUP_GUIDE.md](FE_SETUP_GUIDE.md)]** 👈

Tài liệu trên bao gồm mọi thứ bạn cần:

1. Yêu cầu cấu hình hệ thống máy tính.
2. Cách thiết lập các file biến môi trường (`.env`) và file khóa vòng bảo mật (`google-services.json`).
3. Cách cài đặt các thư viện Native phức tạp.
4. Hướng dẫn thiết lập mạng giả lập (BlueStacks) kết nối với Backend cục bộ.
5. Cách Build bản app (APK / Development Client) bằng EAS.

**Các lệnh thao tác cơ bản và nhanh:**
_Lưu ý: Bạn phải thiết lập đầy đủ môi trường theo [FE_SETUP_GUIDE.md](FE_SETUP_GUIDE.md) trước khi chạy các lệnh này._

```bash
# 1. Cài đặt các gói Dependency (Chú ý cờ --legacy-peer-deps rất quan trọng cho dự án này)
npm install --legacy-peer-deps

# 2. Khởi chạy Metro Bundler của Expo
npx expo start
# hoặc
npm run start
```

---

## 📃 Scripts quan trọng trong `package.json`

- `npm start`: Chạy Expo Development server.
- `npm run start-f`: Chạy `expo start -c` (Xóa cache của Metro, rất hữu ích khi thay đổi file cấu hình, tailwind hoặc env).
- `npm run android`: Chạy / Build ứng dụng Native nội bộ cục bộ cho Android.
- `npm run lint`: Chạy ESLint để quét lỗi cú pháp mã nguồn.

---

## 🤝 Quy chuẩn Code (Coding Standards) & Đóng góp

- Sử dụng **TypeScript** một cách nghiêm ngặt đối với mọi interfaces và models.
- **Component**: Ưu tiên sử dụng Functional Components kết hợp Hooks.
- **Styling**: Sử dụng các utility classes của Tailwind (thông qua `className`), tránh viết Inline Styles ngoài trừ khi cần tính toán dynamic dimensions.
- **Git Flow**: Tạo một nhánh rẽ (branch) tính năng theo cấu trúc `feature/tên-chức-năng` trước khi gửi Pull Request (PR) về nhánh main.
