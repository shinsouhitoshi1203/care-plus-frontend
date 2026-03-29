# Lưu trữ state:

Hiện tại lưu trữ cả state ở hai dạng: asynchronous (dùng TanStack Query) và synchronous (dùng Zustand).

- Dùng Tanstack Query để lưu trữ state liên quan đến dữ liệu lấy từ API
- Dùng Zustand để lưu trữ state liên quan đến UI và các trạng thái tạm thời khác.

- Tên instance. Vì 2 deps này không thống nhất cách gọi tên client nên cứ chốt tên như sau:
  Store của Tanstack Query đặt tên là `tanstackClient`, còn store của Zustand đặt tên là `zustandClient`
