Dùng checklist này là đủ để mỗi lần sửa code bạn lưu lên Git an toàn:

Thiết lập 1 lần

git config --global user.name "Ten Cua Ban"
git config --global user.email "email@ban.com"
git remote -v (kiểm tra đã trỏ đúng repo chưa)
Quy trình mỗi lần sửa code

git status (xem file nào đã đổi)
git add . (hoặc git add path/to/file)
git commit -m "Mô tả ngắn gọn thay đổi"
git pull --rebase origin main (đồng bộ trước khi đẩy)
git push origin main
Xem lịch sử nhanh

git log --oneline -n 10
git diff (xem thay đổi chưa add)
git diff --staged (xem thay đổi đã add)
Nếu commit nhầm

git reset --soft HEAD~1 (hủy commit, giữ code)
git reset --hard HEAD~1 (hủy commit + bỏ code, cẩn thận)
Nếu bạn muốn, mình có thể viết luôn cho bạn 1 file git-save.bat để bấm 1 phát là chạy đủ status -> add -> commit -> pull --rebase -> push.