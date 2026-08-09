# Project & AI Rules - CFC_Shop

## Quy tắc 1: Luôn lập kế hoạch (Plan) và đợi phê duyệt
- AI BẮT BUỘC phải trình bày Kế hoạch triển khai (Implementation Plan) chi tiết trước khi sửa hay viết mã nguồn mới.
- Chỉ bắt đầu viết code sau khi người dùng xác nhận chấp thuận kế hoạch.

## Quy tắc 2: Cập nhật `docs/memory.md` liên tục
- Sau khi hoàn thành một nhiệm vụ (Task) lớn hoặc bước quan trọng (Step), AI BẮT BUỘC phải tóm tắt các đầu việc đã hoàn thành và cập nhật vào file `docs/memory.md` kèm mốc thời gian.

## Quy tắc 3: Kiến trúc & Tổ chức Code
- **Controllers**: Giữ Controller gọn gàng, chỉ nhận/trả request và validate cơ bản. Không viết logic tính toán phức tạp trực tiếp ở Controller.
- **Helpers/Utils**: Các hàm xử lý độc lập (tính giá, format chuỗi, ngày tháng...) đặt trong thư mục `Helpers` hoặc `Utils`. Không inject DbContext hay Service vào Helper.
- **DTOs**: Dùng DTOs để truyền nhận dữ liệu API, không trả Entity trực tiếp ra ngoài.

## Quy tắc 4: Quản lý Git & CSDL
- Mọi thay đổi về Schema DB phải đi kèm file Migration EF Core hợp lệ.
- AI không tự động push code trừ khi người dùng yêu cầu.
