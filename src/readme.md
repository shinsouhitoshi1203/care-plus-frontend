Để tránh thiếu nhất quán, sau đây là những quy tắc để dễ thực hiện và duy trì:

# Router

- Expo Router tạo route theo thư mục app (file-based routing), theo đó:
  - Mỗi file trong thư mục app sẽ trở thành một route.
  - Các thư mục con => tạo route con.
  - Mặc định file index.tsx sẽ được sử dụng làm route chính cho thư mục đó.

Quy ước đặt tên:

- Đặt theo camelCase, ví dụ: app/home/index.tsx sẽ tạo route /home.
- Những file có tên bắt đầu bằng dấu gạch dưới (\_) sẽ được coi là route ẩn, không thể truy cập trực tiếp qua URL. Ví dụ: app/\_private/index.tsx sẽ không tạo route /private.

Tham khảo: https://docs.expo.dev/router/basics/notation/

- Nên đặt tên file và thư mục theo feature
- Ví dụ: app/home/index.tsx, app/profile/index.tsx, app/settings/index.tsx

# Chia folder:

- Repo frontend này chia theo các module, do đó tất cả các tính năng (business logic) sẽ được đặt trong thư mục features
- Những phần dùng chung sẽ được đặt trong thư mục cùng cấp với /app.
- Các phần dùng riêng cho feature sẽ được đặt trong thư mục của feature đó.
- Ví dụ:

```
├── app
│   ├── home
│   │   └── index.tsx
│   ├── profile
│   │   └── index.tsx
│   └── settings
│       └── index.tsx
├── features
│   ├── auth
│   ├── invites
│   └── notifications
│         └── components  (dùng riêng cho notifications)
│
│  (Những phần dùng chung sẽ được đặt ở đây)
├── components
├── hooks
├── utils
├── services
├── types
└── ...
```

Khi tao trang moi, nếu có phần dùng chung thì tạo folder trong thư mục cùng cấp với /app, nếu không có phần dùng chung thì tạo folder trong thư mục của feature đó.

# Đặt tên file và folder

- Nên đặt tên file và folder theo feature

| Tên cho mục đích      | Đặt tên theo kiểu | Ví dụ           |
| --------------------- | ----------------- | --------------- |
| File component, class | PascalCase        | UserProfile.tsx |
| File còn lại khác     | camelCase         | useAuth.ts      |

Chú ý chính tả và chữ hoa thường. GitHub không sửa được tên file khi commit nếu chỉ đổi tên file từ chữ hoa sang chữ thường hoặc ngược lại.

- Tên object, function, variable: camelCase
- Tên component và class: PascalCase

## Lưu ý: Đặt tên component trong file không cần thêm hậu tố .component, .view, .screen,...

- Không cần thêm hậu tố Component, View, Screen,... vào tên file component.
  Ví dụ: UserProfile.tsx thay vì UserProfileComponent.tsx / UserProfileView.tsx / UserProfileScreen.tsx. :thumsdown:
- Đặt tên hàm của component theo tên file, ví dụ: Header.tsx => function HeaderLayout() { ... }. Dễ nhận biết khi render component trong JSX, ví dụ: <HeaderLayout /> thay vì <HeaderComponent /> hoặc <HeaderView />.

# Chia nhánh:

Xem README.md trong thư mục .github/readme.md
