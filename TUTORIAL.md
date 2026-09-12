# Weekly Reading List Mock Test — hướng dẫn từ đầu đến cuối

Tài liệu này giải thích toàn bộ project theo đúng thứ tự một người mới nên học và tự dựng lại. Project dùng HTML, CSS, JavaScript, Bootstrap, Node.js, Express, EJS, Mongoose và MongoDB Atlas.

Thông tin được dùng trong giao diện:

- Họ tên: **Kai Nguyen**
- Student ID: **s4126139**
- Email: **s4126139@rmit.edu.vn**
- Tên database bắt buộc: **`2025b_final_s4126139`**

> Không đưa mật khẩu MongoDB hoặc connection string thật lên GitHub. File `.env` đã được `.gitignore` bảo vệ; chỉ `.env.example` được commit.

## 1. Bootstrap rồi thì có cần CSS không?

**Có.** Bootstrap và CSS không thay thế nhau:

- Bootstrap đảm nhiệm phần khung phổ biến: container, grid responsive, spacing, button, card, flexbox và breakpoint.
- CSS riêng đảm nhiệm những chi tiết đặc thù của wireframe: màu xanh profile, ảnh tròn 250 px, chiều cao card, ảnh phủ bằng `object-fit`, lớp nền tối trên trang sách, hover, focus, kích thước chữ và tinh chỉnh mobile.

Ví dụ, `col-lg-4` và `col-lg-8` tạo bố cục 4/8 cột từ 992 px trở lên. Nhưng Bootstrap không thể biết đề muốn profile màu `#00005b`, hero cao khoảng 540 px hoặc ảnh sách phải crop như thế nào. Vì vậy project **ưu tiên Bootstrap**, còn `public/style.css` chỉ bổ sung phần Bootstrap không thể diễn tả đúng wireframe.

## 2. Bản đồ 40 điểm

| Phần | Điểm | Project đáp ứng ở đâu |
|---|---:|---|
| Database | 5 | `db/bookModel.js`, `db/mongoose.js`, `db/seed.js`; hai collection `books` và `readinglists`; mỗi reading list nhúng đủ ba category |
| EJS | 8 | `views/list.ejs`, `views/book.ejs`, các partial trong `views/partials/`, favicon, footer, ảnh có `alt`, thao tác dùng `button` |
| Configuration | 3 | `.env.example`, `.gitignore`, port 4000/fallback 3000, scripts `start` và `seed` |
| CSS và responsive UI | 9 | Bootstrap 5.3.8 kết hợp `public/style.css`; desktop `>= 992px`, mobile `< 992px`; hover/focus và bố cục giống wireframe |
| JavaScript và dynamic data | 15 | GET/POST `/`, GET `/book/:title`, random reading list, tránh lặp list khi Refresh, thứ tự ngày/category, related books, loading `Refreshing...` |
| **Tổng** | **40** | Logic được kiểm tra tự động trong `tests/`; Atlas thật và pixel-level UI được kiểm tra thủ công theo mục 15 và 19 |

Để tự kiểm tra theo rubric, đừng chỉ nhìn giao diện. Hãy kiểm tra đồng thời database, route, dữ liệu render, hành vi Refresh, responsive và cấu hình bảo mật.

## 3. Cấu trúc thư mục cuối cùng

```text
materials/
├── db/
│   ├── bookModel.js
│   ├── mongoose.js
│   └── seed.js
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── profile.png
│   ├── app.js
│   └── style.css
├── tests/
│   ├── app.test.js
│   ├── client.test.js
│   └── models.test.js
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   ├── head.ejs
│   │   ├── header.ejs
│   │   └── scripts.ejs
│   ├── book.ejs
│   └── list.ejs
├── .env.example
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
└── TUTORIAL.md
```

Thư mục trong ảnh đề chỉ là cấu trúc ban đầu. `public`, `partials` và `tests` là phần mở rộng hợp lý để hoàn thành yêu cầu static files, tái sử dụng EJS và kiểm thử.

## 4. Mental model: một request đi qua hệ thống như thế nào?

```text
@Browser trong Codex
    │ GET /, POST / hoặc GET /book/:title
    ▼
Express route trong app.js
    │ gọi Mongoose model
    ▼
MongoDB Atlas
    │ trả về object JavaScript
    ▼
EJS render HTML động
    │ dùng Bootstrap + style.css + public/app.js
    ▼
Trang hoàn chỉnh trả về @Browser
```

Vai trò từng công nghệ:

- **Node.js** chạy JavaScript bên ngoài browser.
- **Express** nhận request và chọn route phù hợp.
- **Mongoose** định nghĩa schema, validate dữ liệu và giao tiếp với MongoDB.
- **MongoDB Atlas** lưu books và reading lists trên cloud.
- **EJS** trộn HTML với dữ liệu server gửi sang.
- **Bootstrap** cung cấp grid, utility class và component có sẵn.
- **CSS riêng** tinh chỉnh giao diện theo wireframe.
- **JavaScript phía browser** đổi trạng thái nút Refresh trong lúc form đang submit.

## 5. Chuẩn bị công cụ

Cần cài:

- Node.js bản LTS hoặc bản mới tương thích package lock.
- Git.
- GitHub CLI (`gh`) nếu muốn tạo repo hoàn toàn bằng terminal.
- Tài khoản MongoDB Atlas.
- `@Browser` trong Codex để xem và kiểm thử giao diện.

Kiểm tra trong PowerShell:

```powershell
node --version
npm --version
git --version
gh --version
```

Đi vào project:

```powershell
cd "C:\Users\Khoai\RMIT\Web Programming Studio\Final exam\materials"
```

Nếu đã có `package-lock.json`, cài đúng dependency đã khóa:

```powershell
npm ci
```

Nếu đang tự dựng project mới, lệnh tương đương là:

```powershell
npm init -y
npm install express ejs mongoose dotenv
```

Project chỉ dùng bốn dependency runtime:

| Package | Nhiệm vụ |
|---|---|
| `express` | Web server và routing |
| `ejs` | Template engine |
| `mongoose` | Schema/model và kết nối MongoDB |
| `dotenv` | Đọc biến cấu hình từ `.env` |

Bootstrap được nạp bằng CDN trong `views/partials/head.ejs`, nên không cần `npm install bootstrap`.

## 6. Hiểu `package.json` và các npm scripts

Phần quan trọng:

```json
{
  "scripts": {
    "start": "node app.js",
    "seed": "node db/seed.js",
    "test": "node --test"
  }
}
```

Cách đọc:

- `npm start`: chạy server từ `app.js`.
- `npm run seed`: chạy file seed và thoát sau khi hoàn tất.
- `npm test`: chạy test bằng test runner có sẵn của Node.js, không cần thêm Jest.

`package-lock.json` do npm tạo tự động. Nên commit file này để máy khác cài cùng dependency version.

## 7. Thiết lập MongoDB Atlas

### 7.1 Tạo hoặc chọn cluster

Trong MongoDB Atlas:

1. Tạo project hoặc mở project đang dùng.
2. Tạo cluster free nếu chưa có; tên mặc định `Cluster0` là được.
3. Chờ cluster ở trạng thái sẵn sàng.

Không cần tạo database bằng tay trước. Khi chạy seed với URI có path `/2025b_final_s4126139`, MongoDB sẽ tạo database và collection khi dữ liệu đầu tiên được ghi.

### 7.2 Tạo database user

Trong **Security → Database Access**:

1. Chọn **Add New Database User**.
2. Dùng password authentication.
3. Tạo username riêng cho project.
4. Tạo mật khẩu mạnh và lưu ở password manager.
5. Cấp quyền đọc/ghi phù hợp với database dùng cho bài.

Database user khác với tài khoản đăng nhập website Atlas.

### 7.3 Network Access theo yêu cầu chấm

Trong **Security → Network Access**:

1. Chọn **Add IP Address**.
2. Thêm `0.0.0.0/0`, tức **Allow access from anywhere**.
3. Lưu thay đổi và chờ rule có hiệu lực.

> **Cảnh báo bảo mật:** `0.0.0.0/0` cho phép mọi địa chỉ IP thử kết nối tới cluster. Đề yêu cầu cấu hình này để máy chấm truy cập được, nhưng hãy dùng mật khẩu mạnh, chỉ cấp quyền tối thiểu, không tái sử dụng mật khẩu và **xóa rule `0.0.0.0/0` ngay sau khi việc chấm hoàn tất**. Trong project cá nhân bình thường, chỉ whitelist IP cần thiết.

### 7.4 Lấy connection string

Trong cluster chọn **Connect → Drivers → Node.js**, rồi copy URI. URI phải trỏ đến đúng database:

```text
mongodb+srv://<db_user>:<url_encoded_password>@<cluster_host>/2025b_final_s4126139?retryWrites=true&w=majority&appName=Cluster0
```

Ba phần trong dấu `<...>` là placeholder, không được giữ nguyên:

- `<db_user>`: database username.
- `<url_encoded_password>`: mật khẩu đã URL-encode.
- `<cluster_host>`: hostname Atlas cung cấp, ví dụ dạng `cluster0.xxxxx.mongodb.net`.

Nếu mật khẩu có ký tự đặc biệt, phải URL-encode. Ví dụ về cách biến đổi:

| Ký tự | Dạng URL-encoded |
|---|---|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `#` | `%23` |
| `%` | `%25` |

Có thể kiểm tra cách encode trong Node REPL bằng một chuỗi minh họa, không dùng mật khẩu thật trong tài liệu hay ảnh chụp:

```powershell
node
```

```js
encodeURIComponent("example@password")
// 'example%40password'
```

Gõ `.exit` để thoát Node REPL.

### 7.5 Tạo `.env`

Copy file mẫu:

```powershell
Copy-Item .env.example .env
```

Nội dung `.env` trên máy cá nhân:

```dotenv
PORT=4000
MONGODB_CONNECTION_STRING=mongodb+srv://YOUR_DB_USER:YOUR_URL_ENCODED_PASSWORD@YOUR_CLUSTER_HOST/2025b_final_s4126139?retryWrites=true&w=majority&appName=Cluster0
```

Thay các placeholder trên máy, không gửi connection string qua chat và không chụp màn hình làm lộ nó.

Kiểm tra `.env` không bị Git theo dõi:

```powershell
git check-ignore .env
git ls-files .env
```

Kết quả đúng:

- `git check-ignore .env` in ra `.env`.
- `git ls-files .env` không in gì.

## 8. Database layer

### 8.1 `db/mongoose.js`: một nơi duy nhất quản lý kết nối

File này:

1. Nạp `.env` bằng `dotenv`.
2. Lấy `process.env.MONGODB_CONNECTION_STRING`.
3. Báo lỗi rõ nếu biến chưa có.
4. Gọi `mongoose.connect(connectionString)`.
5. Export cả `connectDatabase`, `disconnectDatabase` và instance `mongoose`.

Điểm quan trọng là file không tự kết nối ngay khi vừa `require`. Nhờ vậy test có thể import schema và app mà không cần Atlas.

Hàm kiểm tra `mongoose.connection.readyState === 1` giúp tránh mở kết nối trùng.

### 8.2 `db/bookModel.js`: schema và validation

`bookSchema` có đủ sáu field bắt buộc:

| Field | Type | Ràng buộc chính |
|---|---|---|
| `title` | String | required, trim |
| `author` | String | required, trim |
| `year` | Number | required |
| `image` | String | required, external URL |
| `category` | String | required, enum |
| `description` | String | required, trim |

Enum bắt buộc:

```js
enum: ['TEXTBOOK', 'PHILOSOPHY', 'NOVEL']
```

`readingListSchema` có:

- `name`: String bắt buộc.
- `books`: mảng **embedded `bookSchema`**.
- Custom validator yêu cầu đúng 3 cuốn và 3 category khác nhau.

Nghĩa là mỗi document trong `readinglists` tự chứa đủ dữ liệu ba sách. Khi render trang chủ, server chỉ cần đọc một reading list, không cần query từng book lần nữa.

### 8.3 `db/seed.js`: tạo dữ liệu mẫu

File seed chứa 14 cuốn từ starter data:

- 6 `TEXTBOOK`.
- 5 `PHILOSOPHY`.
- 3 `NOVEL`.

Luồng seed:

1. Kết nối Atlas.
2. Xóa document hiện có trong `books`.
3. Insert 14 books.
4. Xóa document hiện có trong `readinglists`.
5. Với mỗi reading list, dùng aggregation `$match` + `$sample` để lấy ngẫu nhiên một sách từ mỗi category.
6. Tạo `Reading List 1` đến `Reading List 10`; dừng với lỗi rõ ràng nếu thiếu bất kỳ category nào hoặc không tạo đủ đúng 10 list.
7. In lại số lượng records.
8. Luôn ngắt kết nối trong `finally`.

Chạy seed:

```powershell
npm run seed
```

Kết quả mong đợi ở cuối:

```text
Total books in DB: 14
Total reading lists in DB: 10
```

Seed có `deleteMany`, vì vậy chạy lại sẽ dựng lại hai collection thay vì cộng thêm dữ liệu trùng.

## 9. Server và routes trong `app.js`

### 9.1 Cấu hình Express

Các dòng cấu hình có ý nghĩa:

```js
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
```

- `view engine`: cho phép `res.render('list', data)` tìm `views/list.ejs`.
- `urlencoded`: đọc dữ liệu form POST và đưa vào `req.body`.
- `static`: làm `/style.css`, `/app.js` và `/images/...` truy cập được.

`app.disable('x-powered-by')` bỏ header không cần thiết tiết lộ Express.

### 9.2 Port 4000 và fallback 3000

Hàm `getPort` dùng `PORT` nếu đó là số nguyên dương; nếu `.env` thiếu hoặc giá trị không hợp lệ thì dùng 3000:

```js
function getPort(value = process.env.PORT) {
  const parsedPort = Number(value);
  return Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535
    ? parsedPort
    : 3000;
}
```

Với `.env` đúng, URL là `http://localhost:4000`. Không có `PORT`, URL là `http://localhost:3000`.

### 9.3 `GET /`: tải một reading list ngẫu nhiên

Route trang chủ gọi `getRandomReadingList`, trong đó `$sample: { size: 1 }` chọn một document ngẫu nhiên từ collection `readinglists`.

Server gửi sang `list.ejs`:

- `readingList`: document vừa chọn.
- `schedule`: ánh xạ category sang ngày.
- `pageTitle` và `currentBook`: dữ liệu dùng chung cho partial.

Thứ tự schedule được cố định đúng đề:

```js
const SCHEDULE = [
  { category: 'TEXTBOOK', days: 'Monday-Wednesday' },
  { category: 'PHILOSOPHY', days: 'Thursday-Friday' },
  { category: 'NOVEL', days: 'Saturday-Sunday' },
];
```

### 9.4 `POST /`: Refresh nhưng tránh list hiện tại

Form gửi `_id` của list hiện tại qua hidden input:

```html
<input type="hidden" name="currentListId" value="...">
```

Route POST thêm `$match` để loại ID đó, rồi mới `$sample`. Vì MongoDB lưu `_id` dạng ObjectId, code phải:

1. Kiểm tra ID bằng `mongoose.Types.ObjectId.isValid`.
2. Chuyển chuỗi sang `new mongoose.Types.ObjectId(...)`.
3. Dùng `{ _id: { $ne: currentObjectId } }`.

Nếu database chỉ có đúng một list, fallback cho phép trả lại list đó thay vì báo lỗi. Với seed chuẩn 10 list, một lần Refresh sẽ chọn list khác list đang hiển thị.

### 9.5 `GET /book/:title`: trang chi tiết

Ví dụ URL:

```text
/book/Javascript%20The%20Definitive%20Guide
```

Express decode `:title`, rồi query:

```js
BookModel.findOne({ title: req.params.title })
```

Related books được lấy theo cùng category và loại sách đang xem:

```js
BookModel.find({
  category: book.category,
  _id: { $ne: book._id },
})
```

Trong EJS, title luôn đi qua `encodeURIComponent` khi tạo link. Điều này quan trọng với khoảng trắng và ký tự đặc biệt.

### 9.6 404, 500 và khả năng kiểm thử

- Không tìm thấy sách: HTTP 404 `Book not found.`
- Route không tồn tại: HTTP 404 `Page not found.`
- Lỗi ngoài dự kiến: HTTP 500 với thông báo chung; chi tiết chỉ ghi ở terminal.

`createApp({ BookModel, ReadingListModel })` cho phép test truyền fake model, nên test route không phụ thuộc mạng hoặc Atlas.

`if (require.main === module)` đảm bảo server chỉ thật sự connect/listen khi chạy `node app.js`; import từ test sẽ không tự mở port.

## 10. EJS views và partials

### 10.1 Vì sao dùng partial?

Hai trang đều cần `<head>`, header, footer và Bootstrap script. Nếu copy bốn khối này vào từng file, khi sửa phải sửa nhiều nơi. EJS partial giải quyết bằng:

```ejs
<%- include('partials/header') %>
```

Dùng `<%- ... %>` cho kết quả include vì partial chứa HTML. Với dữ liệu text như `<%= book.title %>`, EJS escape nội dung để giảm nguy cơ chèn HTML ngoài ý muốn.

### 10.2 `views/partials/head.ejs`

Chứa:

- UTF-8 và viewport responsive.
- Page title.
- Favicon `/images/logo.png`.
- Bootstrap CSS CDN 5.3.8.
- CSS riêng `/style.css` đặt sau Bootstrap để có thể tinh chỉnh.

Thứ tự CSS rất quan trọng: style viết sau sẽ thắng nếu selector có độ ưu tiên tương đương.

### 10.3 `views/partials/header.ejs`

Header dùng logo thật bằng thẻ `<img>` và breadcrumb:

- Trang chủ: `Home Page`.
- Trang sách: `Home Page > Current Book Title`.
- Current book title là self-link đúng route của chính sách đó.

Ảnh đều có `alt`; nav có `aria-label`.

### 10.4 `views/list.ejs`

Trang chủ có hai vùng:

- Profile: tên, ID, email và ảnh.
- Recommended Reading List: loop ba slot trong `schedule`.

Đoạn logic trung tâm:

```ejs
<% schedule.forEach((slot) => { %>
  <% const book = readingList.books.find(
    (item) => item.category === slot.category
  ); %>
  <!-- render ngày và book tương ứng -->
<% }); %>
```

Loop theo `schedule` thay vì loop trực tiếp `readingList.books` để thứ tự ngày luôn đúng, bất kể thứ tự document trong MongoDB.

Nút Refresh là `<button type="submit">`, không phải `<input>`, và form dùng method POST.

### 10.5 `views/book.ejs`

Trang chi tiết render:

- Hero với ảnh sách thật.
- Title, author, description, category và publication year.
- Related Books loop từ dữ liệu query.
- Nút Back là một button trong form GET `/`.

Hero dùng thẻ `<img>` thay vì background CSS để có `alt` cho accessibility. Một lớp gradient tối đặt lên trên giúp chữ trắng dễ đọc.

### 10.6 `views/partials/footer.ejs`

Footer đúng format:

```html
Made with 👌 by <strong>Kai Nguyen</strong>
```

Tên được in đậm bằng thẻ HTML thật như rubric yêu cầu.

## 11. Bootstrap và responsive layout

Breakpoint chính của đề là 992 px, tương ứng `lg` trong Bootstrap:

| Viewport | Hành vi |
|---|---|
| `>= 992px` | Profile và reading list đứng hai cột; card sách chia text/ảnh 50–50; related books ba cột |
| `< 992px` | Các vùng xếp dọc; text card nằm trên ảnh; related books một cột; header được căn lại |

Các class Bootstrap tiêu biểu:

```html
<div class="container">
<div class="row g-4 align-items-stretch">
<aside class="col-lg-4">
<section class="col-lg-8">
<div class="col-lg-6">
<button class="btn btn-primary">
```

Ý nghĩa:

- `container`: giới hạn chiều rộng và căn giữa.
- `row`/`col-lg-*`: grid 12 cột.
- `g-4`: khoảng cách giữa cột/card.
- `d-flex`, `align-items-*`, `justify-content-*`: căn chỉnh Flexbox.
- `btn btn-primary`: button chuẩn Bootstrap.

`public/style.css` bổ sung:

- CSS variables cho màu chủ đạo.
- Profile panel màu xanh RMIT và bo góc.
- Ảnh profile tròn 250 × 250.
- `object-fit: cover` để ảnh lấp đầy khung mà không méo.
- Hero overlay/typography.
- Hover link ở header đổi background và bỏ underline.
- Focus ring cho người dùng bàn phím.
- Media query `min-width: 992px`, `max-width: 991.98px` và mobile nhỏ.
- `prefers-reduced-motion` để tôn trọng thiết lập giảm chuyển động.

## 12. Loading state bằng JavaScript phía browser

`public/app.js` chỉ làm một nhiệm vụ nhỏ và rõ ràng.

Khi form Refresh submit:

```js
refreshButton.disabled = true;
refreshButton.setAttribute('aria-busy', 'true');
refreshLabel.textContent = 'Refreshing...';
```

Điều này đáp ứng ba yêu cầu:

1. Text đổi chính xác thành `Refreshing...`.
2. Button bị disable để tránh click lặp.
3. `aria-busy` thông báo trạng thái bận cho công nghệ hỗ trợ.

Listener `pageshow` reset button khi browser khôi phục trang từ back-forward cache.

Script có `if (refreshForm)`, nên khi tải trang chi tiết không có form Refresh, code vẫn an toàn và không gây lỗi `null`.

## 13. Chạy project

Thứ tự lần đầu:

```powershell
cd "C:\Users\Khoai\RMIT\Web Programming Studio\Final exam\materials"
npm ci
Copy-Item .env.example .env
# Điền connection string thật vào .env trên máy
npm run seed
npm test
npm start
```

Mở bằng `@Browser`:

```text
http://localhost:4000
```

Dừng server bằng `Ctrl+C` trong terminal.

Những lần sau, nếu Atlas vẫn có dữ liệu:

```powershell
npm start
```

Chỉ chạy seed lại khi cần dựng lại dữ liệu mẫu.

## 14. Test tự động

Chạy:

```powershell
npm test
```

Ba file test có trách nhiệm khác nhau:

### `tests/models.test.js`

- Sáu field của Book đều required.
- Category chỉ nhận ba enum bắt buộc.
- Reading list phải chứa đúng một sách mỗi category.
- Seed data có đúng 14 sách và đúng số lượng category.

### `tests/app.test.js`

- `GET /` render dữ liệu theo đúng thứ tự ngày.
- Link title được URL-encode.
- `POST /` loại reading list hiện tại.
- `GET /book/:title` render sách và related books cùng category.
- Route/sách không tồn tại trả 404.
- Port hợp lệ được dùng; giá trị thiếu, không phải số, số thập phân, âm, `0` hoặc lớn hơn `65535` đều fallback về 3000.

### `tests/client.test.js`

- Submit đổi label thành `Refreshing...`.
- Button bị disable và có `aria-busy`.
- `pageshow` reset trạng thái.

Các route tests dùng fake models, vì vậy có thể chạy khi không có `.env` và không kết nối Atlas. Việc Atlas thật được kiểm tra riêng bằng `npm run seed` và `npm start`.

## 15. Checklist kiểm tra bằng @Browser

### Desktop — viewport từ 992 px trở lên

- [ ] Logo ở header hiển thị và favicon xuất hiện trên tab.
- [ ] Home link hover có background và không underline.
- [ ] Profile nằm bên trái, reading list nằm bên phải.
- [ ] Tên, ID và email đúng thông tin thực tế.
- [ ] Ba khối lần lượt là Monday-Wednesday, Thursday-Friday, Saturday-Sunday.
- [ ] Mỗi khối có đúng category tương ứng.
- [ ] Text và ảnh trong card chia hai cột.
- [ ] Click title mở đúng `/book/:title`.
- [ ] Trang sách có hero, metadata và related books cùng category.
- [ ] Breadcrumb title là self-link.
- [ ] Back quay về `/`.
- [ ] Footer có emoji và tên in đậm.

### Mobile — viewport nhỏ hơn 992 px

- [ ] Không có horizontal scrollbar.
- [ ] Header, profile, reading list xếp dọc và dễ đọc.
- [ ] Trong card, text nằm trên ảnh.
- [ ] Profile photo không tràn màn hình nhỏ.
- [ ] Hero text vẫn nằm trong khung và đủ tương phản.
- [ ] Related books xếp một cột.
- [ ] Refresh và Back đủ lớn để bấm.

### Dynamic behavior

- [ ] Reload `GET /` vài lần cho thấy reading list được chọn ngẫu nhiên.
- [ ] Click Refresh: thấy `Refreshing...`, button disable, list kế tiếp khác list hiện tại.
- [ ] Atlas có collection `books` với 14 documents.
- [ ] Atlas có collection `readinglists` với 10 documents.
- [ ] Mỗi reading list nhúng đúng ba books, đủ ba category.
- [ ] DevTools Console không có JavaScript error.
- [ ] Network không có 404 cho `/style.css`, `/app.js`, logo hoặc profile.

## 16. Troubleshooting

### `MONGODB_CONNECTION_STRING is missing`

Nguyên nhân: chưa có `.env`, sai tên biến hoặc chạy lệnh ngoài thư mục project.

Kiểm tra:

```powershell
Get-Location
Test-Path .env
```

Tên biến phải chính xác là `MONGODB_CONNECTION_STRING`.

### `bad auth` hoặc `Authentication failed`

Kiểm tra:

- Đang dùng **database user**, không phải email đăng nhập Atlas.
- Username/password đúng.
- Mật khẩu đã URL-encode.
- User còn quyền đọc/ghi.

Không in `.env` ra terminal khi quay video hoặc chụp màn hình.

### `querySrv ENOTFOUND`

Thường do hostname bị copy sai, URI bị xuống dòng hoặc DNS/mạng đang chặn. Copy lại URI từ **Connect → Drivers** và giữ nguyên hostname Atlas cấp.

### `MongoServerSelectionError` hoặc timeout

Kiểm tra:

- Cluster đang hoạt động.
- Network Access đã có rule cần thiết.
- Chờ một lúc sau khi vừa sửa IP rule/user.
- Mạng hiện tại truy cập Atlas được.

### Seed chạy nhưng không thấy đúng database

Kiểm tra URI có đoạn:

```text
/2025b_final_s4126139?
```

Nếu bỏ tên database, dữ liệu có thể vào database mặc định khác.

### Trang báo `No reading lists are available`

Chạy:

```powershell
npm run seed
```

Sau đó refresh trang.

### Port 4000 đang bị dùng

Tìm process trên Windows:

```powershell
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
```

Dừng server cũ bằng `Ctrl+C`. Nếu chỉ kiểm tra fallback, có thể tạm đổi `PORT` trong `.env`, nhưng bản nộp nên giữ `PORT=4000` theo đề.

### CSS/ảnh/JS trả 404

Đường dẫn trong HTML phải bắt đầu từ static root:

```text
/style.css
/app.js
/images/logo.png
/images/profile.png
```

Không dùng `/public/style.css`, vì `express.static(public)` đã ánh xạ `public` thành root URL.

### EJS báo biến chưa được định nghĩa

Kiểm tra object truyền vào `res.render`. Tên key phải khớp biến dùng trong view, ví dụ `readingList`, `schedule`, `book`, `relatedBooks`, `currentBook`.

### Title có khoảng trắng mở sai route

Trong EJS phải tạo link bằng:

```ejs
/book/<%= encodeURIComponent(book.title) %>
```

### Refresh đôi khi quay lại list cũ

Với seed chuẩn 10 list, POST loại list hiện tại. Kiểm tra hidden input có `name="currentListId"` và `express.urlencoded` đã được khai báo trước routes.

## 17. Git workflow và commit history

### 17.1 Thiết lập Git cho project

```powershell
git init
git branch -M main
git config user.name "Kai Nguyen"
git config user.email "s4126139@rmit.edu.vn"
```

Trước mỗi commit:

```powershell
git status
git diff
git diff --cached
```

Không dùng `git add .` một cách mù quáng nếu thư mục có file khác. Stage đúng nhóm file của bước đang làm rồi commit bằng conventional commit.

### 17.2 Ledger commit hiện tại

Danh sách dưới đây theo thứ tự từ cũ đến mới và dùng full hash thực tế:

| Hash | Commit | Ý nghĩa |
|---|---|---|
| `5e117bddc342f3e004085d643064dfb6b2f87213` | `chore: initialize weekly reading list project` | Starter files, package config, `.gitignore`, `.env.example` |
| `c99671a27f855a2fd23aaf87e25ad01d3bcb8f00` | `feat(database): add Atlas models and reading list seed` | Schema, connection helpers và seed data |
| `23f9ab95ede120287956ea5c5a57323bcfadbb9d` | `feat(server): implement dynamic reading routes` | Express configuration và dynamic routes |
| `62f6691bd405fd4cecb5a3b231372c07037e0886` | `feat(views): build reusable reading list pages` | Hai EJS pages và reusable partials |
| `5c8d3b40cc879e26d2440cf4570042d28510a43d` | `style(ui): match responsive Canvas wireframes` | Bootstrap layout, custom CSS và image assets |
| `f2a168561ca9d769d02c1ebebb0c485d166cf41d` | `feat(ui): add refresh loading feedback` | Client-side loading/disabled state |
| `0a90f03a3dc68e251601d97d40452d658493a171` | `test: cover reading list behavior` | Model, route và browser behavior tests |
| `ed862b78ce89f287d3ed4c4a708919b9e1ad0585` | `fix: enforce runtime and seed invariants` | Chặn port ngoài range, bắt buộc đủ 10 lists và dùng page title động |
| `4ec982ebe74353e1396445003c8cdc74a639430d` | `fix(ui): align mobile wireframes` | Tinh chỉnh breakpoint mobile, typography và khoảng cách sau visual QA |

Xem ledger mới nhất bất cứ lúc nào:

```powershell
git log --reverse --format="%H %s"
```

Hash của commit chứa chính `TUTORIAL.md` chỉ tồn tại sau khi file này được commit, nên lệnh `git log` là nguồn chính xác để xem cả commit tài liệu và mọi fix phát sinh sau đó.

### 17.3 Toàn bộ lệnh stage và commit theo từng bước

Khối dưới đây là quy trình CLI có thể luyện lại từ đầu. Mỗi lần chỉ stage đúng nhóm file vừa hoàn thành, kiểm tra staged diff rồi mới commit:

```powershell
# Bước 1 — starter và configuration
git add .env.example .gitignore app.js db/bookModel.js db/mongoose.js db/seed.js package-lock.json package.json views/book.ejs views/list.ejs
git diff --cached
git commit -m "chore: initialize weekly reading list project"

# Bước 2 — database models, Atlas connection và seed
git add db/bookModel.js db/mongoose.js db/seed.js
git diff --cached
git commit -m "feat(database): add Atlas models and reading list seed"

# Bước 3 — Express server và dynamic routes
git add app.js
git diff --cached
git commit -m "feat(server): implement dynamic reading routes"

# Bước 4 — EJS pages và reusable partials
git add views/book.ejs views/list.ejs views/partials/footer.ejs views/partials/head.ejs views/partials/header.ejs views/partials/scripts.ejs
git diff --cached
git commit -m "feat(views): build reusable reading list pages"

# Bước 5 — Bootstrap-responsive styling và image assets
git add public/style.css public/images/logo.png public/images/profile.png
git diff --cached
git commit -m "style(ui): match responsive Canvas wireframes"

# Bước 6 — Refresh loading state
git add public/app.js views/list.ejs
git diff --cached
git commit -m "feat(ui): add refresh loading feedback"

# Bước 7 — automated tests
git add tests/app.test.js tests/client.test.js tests/models.test.js
git diff --cached
git commit -m "test: cover reading list behavior"

# Bước 8 — review fixes
git add app.js db/seed.js tests/app.test.js views/partials/head.ejs
git diff --cached
git commit -m "fix: enforce runtime and seed invariants"

# Bước 9 — visual QA fixes
git add public/style.css views/book.ejs views/list.ejs
git diff --cached
git commit -m "fix(ui): align mobile wireframes"

# Bước 10 — tutorial duy nhất
git add TUTORIAL.md
git diff --cached
git commit -m "docs: add complete mock test tutorial"
```

Sau mỗi bước, dùng `git status --short` để bảo đảm không stage nhầm `.env`, file tạm hoặc credential. `git add .` không được dùng trong chuỗi trên vì dễ gom nhầm bí mật.

### 17.4 Tạo repo và push lên GitHub

Đăng nhập một lần:

```powershell
gh auth login
gh auth status
```

Khi repo `s4126139/weekly-reading-list-mock-test` chưa tồn tại, đứng trong thư mục `materials` rồi chạy:

```powershell
gh repo create s4126139/weekly-reading-list-mock-test --public --source . --remote origin --push
```

Nếu repo đã được tạo trên GitHub nhưng local chưa có remote:

```powershell
git remote add origin https://github.com/s4126139/weekly-reading-list-mock-test.git
git push -u origin main
```

Các lần sau:

```powershell
git push
```

Kiểm tra trước khi push:

```powershell
git status
git remote -v
git ls-files .env
```

`git status` nên sạch và `git ls-files .env` phải không có output.

## 18. Trình tự tự dựng lại trong bài

Dùng checklist này để luyện tái tạo project từ một starter folder:

1. [ ] Đọc hết rubric và ghi ra field, route, text bắt buộc, breakpoint và tên database.
2. [ ] Kiểm tra starter data; không tự sửa title/author/year nếu đề đã cung cấp.
3. [ ] Khởi tạo npm; cài đúng `express`, `ejs`, `mongoose`, `dotenv`.
4. [ ] Tạo `.gitignore` trước `.env`; thêm `.env.example` chỉ có placeholder.
5. [ ] Viết `bookSchema` và `readingListSchema`; kiểm tra required/enum/embedded books.
6. [ ] Viết kết nối MongoDB độc lập trong `db/mongoose.js`.
7. [ ] Viết seed; tạo 14 books và 10 reading lists; chạy và kiểm tra count.
8. [ ] Cấu hình Express: EJS, form parser, static public folder.
9. [ ] Viết constant schedule đúng thứ tự ngày.
10. [ ] Viết GET `/`, POST `/`, GET `/book/:title`, rồi 404 và error handler.
11. [ ] Chia EJS partials trước khi hoàn thiện hai trang.
12. [ ] Dùng Bootstrap grid theo breakpoint `lg`.
13. [ ] Thêm CSS riêng chỉ cho fidelity và hành vi không có sẵn trong Bootstrap.
14. [ ] Thêm client JS cho `Refreshing...` và disable button.
15. [ ] Chạy test, seed, server; kiểm tra desktop/mobile trong `@Browser`.
16. [ ] Click thử mọi title, breadcrumb, Refresh và Back.
17. [ ] So `git status`; xác nhận `.env` không được track.
18. [ ] Commit theo từng giai đoạn nhỏ và push GitHub.

## 19. Lệnh kiểm tra cuối cùng

Chạy từ thư mục `materials`:

```powershell
npm test
npm run seed
npm start
```

Trong một terminal khác:

```powershell
git status
git log --reverse --oneline
git remote -v
git ls-files .env
```

Kết quả hoàn chỉnh là:

- Tests pass.
- Seed báo 14 books và 10 reading lists.
- Server mở đúng port 4000 với `.env` hợp lệ.
- Hai trang khớp desktop/mobile wireframe và không có lỗi console.
- Mọi dữ liệu sách đến từ Atlas, không hard-code trong EJS.
- Refresh chọn list khác và hiện `Refreshing...`.
- Repo GitHub có lịch sử commit rõ ràng.
- `.env` và credentials không xuất hiện trong commit hoặc GitHub.
