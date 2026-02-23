//<!-- Khởi tạo và quản lý sân chơi -->

listGT = ['GT001', 'GT002', 'GT003', 'GT004', 'GT005', 'GT006', 'GT007', 'GT008', 'GT009', 'GT010'];
listGTNam = ['Đặc Biệt', 'Giải Nhất', 'Giải Nhì', 'Giải Ba', 'Giải Tư', 'Giải Năm', 'Giải Sáu', 'Giải Bảy', 'Giải Tám', 'Giải Chín', 'Khuyến Khích'];
listGTName = listGTNam; // Alias cho compatibility
listGTImage = ['Iphone-16-pro-256GB.jpg', 'Laptop_Dell-ins-3530-Core i5-Ram8G.jpg', 'Tivi_TCL-4K-55P638-55inch.jpg', 'TaiNghe_AirPods4.jpg', 'NoiChien_KiporKP-AF657.jpg', 'DongHo_RedmiWatch.jpg', '', '', '', '', '']
listSC = ['SC001', 'SC002', 'SC003', 'SC004', 'SC005'];
listSCName = ['Sân chơi 1', 'Sân chơi 2', 'Sân chơi 6', 'Sân chơi 4', 'Sân chơi 5']
DungQuay = 0;
DsNhanVienQuayThuong = [];
DsNhanVienQuayThuong2 = {};
MaSanChoi_HienTai = '';
MaGiai_HienTai = '';

TongSoLuongGiai = 0;
LanQuayThu_HienTai = 0;
LanQuayThu_Cu = 1000;
SoGiaiDaQuay_HienTai = 0;
SoLanQuay_Tong = 0;
SoGiaiConLai_HienTai = 0;
SetUp_pram = 0;
MATRUNGTHUONG = "";
MANHANVIENTRUNGTHUONG = "";
TENNHANVIENTRUNGTHUONG = "";

GTDB_F = 'HV018';

let gameBgImages = [];
let gameBgVideos = [];
let gameSpinBackgrounds = [];
const DEFAULT_GAME_BG_IMAGE = 'bg_1.jpg';
const DEFAULT_SPIN_WHEEL_BG = 'spin3.png';

function extractFileNameFromPath(path = '') {
    if (!path) return '';
    const cleanPath = String(path).split('?')[0];
    const parts = cleanPath.split('/');
    return parts[parts.length - 1] || '';
}

function BuildGameBgOptionsHtml() {
    let html = '<option value="">Mặc định</option>';
    gameBgImages.forEach(function(item) {
        html += `<option value="${item.file}">${item.file}</option>`;
    });
    return html;
}

function BuildGameVideoOptionsHtml() {
    let html = '<option value="">Mặc định</option>';
    gameBgVideos.forEach(function(item) {
        html += `<option value="${item.file}">${item.file}</option>`;
    });
    return html;
}

function BuildSpinBgOptionsHtml() {
    let html = '<option value="spin3.png">spin3.png</option>';
    gameSpinBackgrounds.forEach(function(item) {
        if (item.file !== 'spin3.png') {
            html += `<option value="${item.file}">${item.file}</option>`;
        }
    });
    return html;
}

function PopulateGameMediaSelects() {
    const bgOptions = BuildGameBgOptionsHtml();
    const videoOptions = BuildGameVideoOptionsHtml();
    const spinBgOptions = BuildSpinBgOptionsHtml();

    $('#form_sanchoi .bg-image-select').each(function() {
        const selected = $(this).attr('data-selected') || $(this).val() || '';
        $(this).html(bgOptions).val(selected);
    });

    $('#form_sanchoi .bg-video-select').each(function() {
        const selected = $(this).attr('data-selected') || $(this).val() || '';
        $(this).html(videoOptions).val(selected);
    });

    $('#form_sanchoi .spin-bg-select').each(function() {
        const selected = $(this).attr('data-selected') || $(this).val() || 'spin3.png';
        $(this).html(spinBgOptions).val(selected || 'spin3.png');
    });
}

function ApplySpinWheelBackground(fileName = 'spin3.png') {
    const bgFile = fileName && String(fileName).trim() !== '' ? String(fileName).trim() : 'spin3.png';
    const cssUrl = `url('/static/spin/img_spin/${bgFile}')`;
    $('.circle-button img').css({
        'background-image': cssUrl,
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': 'center center'
    });
}

function ApplyDefaultGameVisualConfig() {
    ChangeBackgr('', DEFAULT_GAME_BG_IMAGE);
    $('.video-bg').hide();
    ApplySpinWheelBackground(DEFAULT_SPIN_WHEEL_BG);
}

function TryApplyImageBackground(imageName, onSuccess = null, onError = null) {
    if (!imageName || String(imageName).trim() === '') {
        if (typeof onError === 'function') onError();
        return;
    }

    const fileName = String(imageName).trim();
    const tester = new Image();
    tester.onload = function() {
        ChangeBackgr('', fileName);
        if (typeof onSuccess === 'function') onSuccess();
    };
    tester.onerror = function() {
        if (typeof onError === 'function') onError();
    };
    tester.src = `/static/img/bg_tet/${fileName}?v=${Date.now()}`;
}

function ApplyGameVisualConfigWithFallback(videoFile, imageFile) {
    if (videoFile && String(videoFile).trim() !== '') {
        changeVideo(
            String(videoFile).trim(),
            'background_video',
            'source_background_video',
            function() {
                console.log('✅ Video nền đã load thành công');
            },
            function() {
                console.warn('⚠️ Video nền lỗi, chuyển sang ảnh nền');
                TryApplyImageBackground(imageFile, null, function() {
                    console.warn('⚠️ Ảnh nền lỗi, chuyển về mặc định');
                    ApplyDefaultGameVisualConfig();
                });
            }
        );
        return;
    }

    TryApplyImageBackground(imageFile, null, function() {
        console.warn('⚠️ Không có video/ảnh hợp lệ, chuyển về mặc định');
        ApplyDefaultGameVisualConfig();
    });
}

function LoadGameMediaLibrary(callback = null) {
    let doneCount = 0;

    function done() {
        doneCount += 1;
        if (doneCount >= 3) {
            PopulateGameMediaSelects();
            if (typeof callback === 'function') callback();
        }
    }

    $.ajax({
        url: '/get_images/',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            gameBgImages = [];
            if (response && response.success && Array.isArray(response.images)) {
                response.images.forEach(function(img) {
                    gameBgImages.push({
                        id: img.id,
                        file: extractFileNameFromPath(img.path)
                    });
                });
            }
            done();
        },
        error: function() {
            gameBgImages = [];
            done();
        }
    });

    $.ajax({
        url: '/get_videos/',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            gameBgVideos = [];
            if (response && response.success && Array.isArray(response.videos)) {
                response.videos.forEach(function(video) {
                    gameBgVideos.push({
                        id: video.id,
                        file: extractFileNameFromPath(video.path)
                    });
                });
            }
            done();
        },
        error: function() {
            gameBgVideos = [];
            done();
        }
    });

    $.ajax({
        url: '/get_spin_backgrounds/',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            gameSpinBackgrounds = [];
            if (response && response.success && Array.isArray(response.images)) {
                response.images.forEach(function(img) {
                    gameSpinBackgrounds.push({
                        id: img.id,
                        file: img.file || extractFileNameFromPath(img.path)
                    });
                });
            }
            done();
        },
        error: function() {
            gameSpinBackgrounds = [];
            done();
        }
    });
}

function SaveGameCfBySanChoi(maSanChoi, callback = null) {
    if (!maSanChoi) {
        if (typeof callback === 'function') callback();
        return;
    }

    const selectedGiai = [];
    $('#form_sanchoi .tab-sanchoi tbody tr').each(function() {
        const checkbox = $(this).find('input.form-check-input');
        if (checkbox.length > 0 && checkbox.is(':checked')) {
            selectedGiai.push(checkbox.attr('id'));
        }
    });

    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', {
        Action: 'RESET_BY_SANCHOI',
        tab_name: 'TabGameCf',
        MaSanChoi: maSanChoi
    }, function() {
        if (selectedGiai.length === 0) {
            if (typeof callback === 'function') callback();
            return;
        }

        let processed = 0;
        selectedGiai.forEach(function(maGiai) {
            const hinhNen = $(`#form_sanchoi #HinhNen_${maGiai}`).val() || '';
            const nenVideo = $(`#form_sanchoi #NenVideo_${maGiai}`).val() || '';
            const nenVongQuay = $(`#form_sanchoi #NenVongQuay_${maGiai}`).val() || 'spin3.png';

            AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', {
                Action: 'SAVE_GAME',
                tab_name: 'TabGameCf',
                MaSanChoi: maSanChoi,
                MaGiai: maGiai,
                HinhNen: hinhNen,
                NenVideo: nenVideo,
                NenVongQuay: nenVongQuay
            }, function() {
                processed += 1;
                if (processed >= selectedGiai.length && typeof callback === 'function') {
                    callback();
                }
            });
        });
    });
}

// ========== DANH SÁCH SÂN CHƠI (Modal.js version) ==========
/**
 * Thao tác với danh sách sân chơi
 * @param action - 0: LOAD, 1: SAVE, 2: DELETE, 3: LOAD_ALL
 */
function ActionDsSanChoi(action, el) {
    console.log('🎯 ActionDsSanChoi(action=' + action + ')');

    var data = { 'tab_name': 'TabDsSanChoi' };

    if (action == 0) { // LOAD - Tải danh sách sân chơi
        data.Action = 'ALL';
    } else {
        // Khác: cần GET_ALL_INPUT_FROM_DIV hoặc xử lý theo action
        return;
    }

    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
        console.log('📥 ActionDsSanChoi response:', response);

        if (response.data && response.data.length > 0) {
            // Cập nhật select với name="MaSanChoi"
            $('select[name="MaSanChoi"]').each(function() {
                $(this).empty().append('<option value="">-- Chọn sân chơi --</option>');

                response.data.forEach(function(item) {
                    $(this).append(`<option value="${item.MaSanChoi}">${item.TenSanChoi}</option>`);
                }.bind(this));
            });

            console.log('✓ Danh sách sân chơi đã được load');
        }
    });
}

//Quản lý cấu hình
function ActionGameCf(action, el = '') {
    data = { 'tab_name': 'TabGameCf' }
    if (action == 1) { //Lấy thông tin cài đặt
        data.Action = 'LOAD_GAME_CF';
    } else if (action == 2) { //Lưu thông tin cài đặt
        data.Action = 'SAVE_GAME';
    }

    if (el && typeof el === 'object') {
        if (el.MaSanChoi) data.MaSanChoi = el.MaSanChoi;
        if (el.MaGiai) data.MaGiai = el.MaGiai;
    }

    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, load_cf)

    function load_cf(res) {
        console.log("Đang thực hiện lấy hình nền");
        d = res['data'];
        console.log(d);
        if (d.length <= 0) {
            if (action == 1) {
                ApplyDefaultGameVisualConfig();
            }
            return
        }
        d = d[0];
        bg_video = d['NenVideo'];
        bg_nen = d['HinhNen'];
        bg_vong_quay = d['NenVongQuay'] || DEFAULT_SPIN_WHEEL_BG;
        // console.log(bg_video);
        if (action == 1) {
            ApplyGameVisualConfigWithFallback(bg_video, bg_nen);
            ApplySpinWheelBackground(bg_vong_quay);
        }
    }
}

//Quản lý giải thưởng
function ActionGiaiThuong(action, el = '') {
    Action = '';
    id_form = 'form_giaithuong'
    data = GET_ALL_INPUT_FROM_DIV(id_form)

    url = '/action_dbLite/';
    if (action == 0) { //Tra cứu lấy danh sách
        Action = 'ALL';
    } else if (action == 1) { //Thêm mới hoặc lưu thông tin
        Action = 'SAVE';
    } else if (action == 2) { //Xóa thông tin
        Action = 'DELETE';
    } else if (action == 3) { //LƯU ẢNH - Upload image for gift
        console.log('📸 ActionGiaiThuong(3) - Lưu ảnh phần quà');
        return SaveGiftImage(el);
    } else if (action == 4) { //CẬP NHẬT - Sửa thông tin phần quà
        console.log('✏️ ActionGiaiThuong(4) - Cập nhật phần quà');
        Action = 'EDIT';
    }
    data.Action = Action;
    data.tab_name = 'TabGiaiThuong';
    AJAX_REQUEST_RESPONSE(url, 'POST', data, loadQuaTang);


    function loadQuaTang(res) {
        if (action == 0) {
            dt = res['data'];
            const prizeSelects = $('select[name^="LsQuaTang_"]');
            prizeSelects.each(function() {
                $(this).empty().append('<option></option>');
            });

            // Nạp lại danh sách bảng hiển thị phần thưởng (OLD TABLE - TabGiaiThuong)
            tbody = $('#Modal_GiaiThuong tbody');
            if (tbody.length > 0) {
                tbody.empty();
                i = 0;
                dt.forEach(function(item) {
                    tbody.append('<tr>\
                                        <td>' + (i += 1) + '</td>\
                                        <td>' + item['MaQuaTang'] + '</td>\
                                        <td>' + item['TenQuaTang'] + '</td>\
                                        <td><img class="card-img-ticket" width="70" src="/static/spin/images/' + item['HinhAnh'] + '?v=1"></td>\
                                        <td>\
                                            <div class="" style="position:relative;">\
                                                <input type="file" class="form-control gift-image-input" data-gift-id="' + item['id'] + '" data-gift-code="' + item['MaQuaTang'] + '" name="gift_image_' + item['id'] + '" placeholder="" aria-label="" accept=".jpg,.png,.jpeg">\
                                                <button type="button" class="btn btn-primary" style="position:absolute;top:0;right:0" onclick="ActionGiaiThuong(3,this)"><i class="fa fa-save"></i>Lưu</button>\
                                            </div>\
                                        </td>\
                                        <td>\
                                            <button type="button" class="btn btn-sm btn-warning" onclick="EditGift(\'' + item['id'] + '\',\'' + item['MaQuaTang'] + '\',\'' + item['TenQuaTang'] + '\')" title="Sửa">\
                                                <i class="fa fa-edit"></i> Sửa\
                                            </button>\
                                            <button type="button" class="btn btn-sm btn-danger" onclick="DeleteGift(\'' + item['id'] + '\')" title="Xóa">\
                                                <i class="fa fa-trash"></i> Xóa\
                                            </button>\
                                        </td>\
                                    </tr>');
                });
            }

            // Nạp lại danh sách bảng hiển thị phần thưởng (NEW TABLE - modal_giaithuong)
            tbody_new = $('#gift-table-body');
            if (tbody_new.length > 0) {
                tbody_new.empty();
                i = 0;
                dt.forEach(function(item) {
                    tbody_new.append('<tr>\
                                        <td>' + (i += 1) + '</td>\
                                        <td><strong>' + item['MaQuaTang'] + '</strong></td>\
                                        <td>' + item['TenQuaTang'] + '</td>\
                                        <td style="text-align: center;"><img src="/static/spin/images/' + item['HinhAnh'] + '?v=1" style="max-width: 80px; height: auto; border-radius: 6px; border: 1px solid #e0e0e0;"></td>\
                                        <td style="text-align: center;">\
                                            <input type="file" class="form-control form-control-sm gift-image-input" data-gift-id="' + item['id'] + '" data-gift-code="' + item['MaQuaTang'] + '" name="gift_image_' + item['id'] + '" accept=".jpg,.png,.jpeg" style="display: inline-block; width: 200px;">\
                                            <button type="button" class="btn btn-sm btn-primary" onclick="SaveGiftImage(this)" style="margin-left: 5px;"><i class="fa fa-save"></i> Lưu</button>\
                                        </td>\
                                        <td style="text-align: center;">\
                                            <button type="button" class="btn btn-sm btn-warning" onclick="EditGift(\'' + item['id'] + '\',\'' + item['MaQuaTang'] + '\',\'' + item['TenQuaTang'] + '\')" title="Sửa">\
                                                <i class="fa fa-edit"></i>\
                                            </button>\
                                            <button type="button" class="btn btn-sm btn-danger" onclick="DeleteGift(\'' + item['id'] + '\')" title="Xóa">\
                                                <i class="fa fa-trash"></i>\
                                            </button>\
                                        </td>\
                                    </tr>');
                });

                // Cập nhật số lượng phần quà
                $('#gift-count').text(dt.length);
            }

            // 🔄 Cập nhật tất cả select dropdown (LsQuaTang_GT001, LsQuaTang_GT002, ...)
            console.log('🔄 Cập nhật danh sách phần quà trong các select dropdown');
            prizeSelects.each(function() {
                dt.forEach(function(item) {
                    $(this).append('<option value="' + item['MaQuaTang'] + '">' + item['TenQuaTang'] + '</option>');
                }.bind(this));
            });

        } else if (action == 1) { // SAVE - Thêm mới
            console.log('✅ Thêm phần quà mới thành công');
            Swal.fire('Thành công', 'Thêm phần quà thành công!', 'success');
            ClearGiftForm();
            setTimeout(() => { ActionGiaiThuong(0); }, 800);

        } else if (action == 4) { // EDIT - Cập nhật
            console.log('✅ Cập nhật phần quà thành công');
            Swal.fire('Thành công', 'Cập nhật phần quà thành công!', 'success');
            ClearGiftForm();
            setTimeout(() => { ActionGiaiThuong(0); }, 800);

        } else if (action == 2) { // DELETE - Xóa
            console.log('✅ Xóa phần quà thành công');
        }
    }
}

/**
 * Hàm sửa thông tin phần quà
 */
function EditGift(id, code, name) {
    console.log('✏️ EditGift - ID:', id, 'Code:', code, 'Name:', name);

    // Load dữ liệu vào form
    $('#MaGiaiThuong').val(code);
    $('#TenGiaiThuong').val(name);
    $('#form_giaithuong').data('gift-id', id);

    // Ẩn nút "Lưu", hiển thị nút "Cập nhật" và "Hủy"
    $('button[onclick="ActionGiaiThuong(1)"]').hide();
    $('#btn-edit-gift').show();
    $('#btn-clear-gift').show();

    // Đổi text button "Lưu" thành "Cập nhật"
    $('#btn-save-gift').text('Cập Nhật');

    // Cuộn lên form (scroll to form)
    var modalBody = $('#modal_giaithuong .modal-body');
    if (modalBody.length > 0) {
        modalBody.scrollTop(0);
    } else {
        $('html, body').animate({
            scrollTop: $('#form_giaithuong').offset().top - 100
        }, 500);
    }
}

/**
 * Hàm xóa phần quà
 */
function DeleteGift(id) {
    console.log('🗑️ DeleteGift - ID:', id);

    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc muốn xóa phần quà này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            var data = {
                'Action': 'DELETE',
                'tab_name': 'TabGiaiThuong',
                'id': id
            };

            Show_loading();
            AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
                Exit_Loading();
                console.log('✅ Xóa thành công:', response);
                Swal.fire('Thành công', 'Phần quà đã được xóa!', 'success');
                ActionGiaiThuong(0); // Reload danh sách
            });
        }
    });
}

/**
 * Hàm xóa form (hủy sửa)
 */
function ClearGiftForm() {
    console.log('❌ ClearGiftForm');

    // Xóa dữ liệu form
    $('#MaGiaiThuong').val('');
    $('#TenGiaiThuong').val('');
    $('#form_giaithuong').data('gift-id', '');

    // Ẩn nút "Cập nhật" và "Hủy", hiển thị nút "Lưu"
    $('button[onclick="ActionGiaiThuong(1)"]').show();
    $('#btn-edit-gift').hide();
    $('#btn-clear-gift').hide();

    // Đổi text button về "Thêm Mới"
    $('#btn-save-gift').text('Thêm Mới');
}

/**
 * Hàm lưu ảnh phần quà
 * @param el - Button element
 */
function SaveGiftImage(el) {
    // Tìm file input trong hàng hiện tại
    var fileInput = $(el).closest('td').find('input[type="file"]')[0];

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        Swal.fire('Cảnh báo', 'Vui lòng chọn ảnh trước khi lưu', 'warning');
        return;
    }

    var file = fileInput.files[0];
    var giftId = $(fileInput).data('gift-id');
    var giftCode = $(fileInput).data('gift-code');

    // Kiểm tra loại file
    var allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        Swal.fire('Lỗi', 'Chỉ chấp nhận file JPG, PNG hoặc JPEG', 'error');
        return;
    }

    // Kiểm tra kích thước (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Lỗi', 'Kích thước file không được vượt quá 5MB', 'error');
        return;
    }

    console.log('📸 Uploading gift image:', {
        id: giftId,
        code: giftCode,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
    });

    Show_loading();

    var formData = new FormData();
    formData.append('Action', 'SAVE_IMAGE');
    formData.append('tab_name', 'TabGiaiThuong');
    formData.append('id', giftId);
    formData.append('MaQuaTang', giftCode);
    formData.append('gift_image', file);

    // Thêm CSRF token
    var el_csrf = document.querySelector('[name=csrfmiddlewaretoken]');
    var csrftoken = el_csrf ? el_csrf.value : '';
    if (csrftoken) {
        formData.append('csrfmiddlewaretoken', csrftoken);
    }

    // DEBUG: Log FormData
    console.log('📤 SaveGiftImage - FormData entries:');
    for (var pair of formData.entries()) {
        if (pair[0] !== 'gift_image') { // Don't log the file itself
            console.log('   ' + pair[0] + ': ' + pair[1]);
        }
    }

    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            Exit_Loading();
            console.log('✅ Upload response:', response);

            if (response.error) {
                Swal.fire('Lỗi', 'Lỗi upload: ' + response.error, 'error');
            } else {
                Swal.fire('Thành công', 'Ảnh phần quà đã được lưu!', 'success');

                // Cập nhật hình ảnh trong bảng
                var newImageUrl = '/static/spin/images/' + response.filename + '?v=' + new Date().getTime();
                $(el).closest('tr').find('img').attr('src', newImageUrl);

                // Reset file input
                $(fileInput).val('');

                // Reload danh sách
                setTimeout(function() {
                    ActionGiaiThuong(0);
                }, 1500);
            }
        },
        error: function(xhr, status, error) {
            Exit_Loading();
            console.error('❌ Upload error:', error);
            console.error('Response:', xhr.responseText);
            Swal.fire('Lỗi', 'Có lỗi xảy ra khi upload: ' + error, 'error');
        }
    });
}

//NOTE: ActionDsSanChoi() is now defined in sanChoi.js (home/static/myjs/sanChoi.js)
// This version is kept only for backward compatibility with spin.html
// The main implementation supports actions: 1=SAVE, 2=DELETE, 3=LOAD, 4=EDIT, 10=DELETE(table), 30=EDIT(table)

//Thao tavs xử lý bảng danh sách sân chơi
function ActionDsSanChoi(action, el = '') {
    Action = '';
    url = '/action_dbLite/';
    form_id = 'form_dsSanChoi';
    tab_name = 'TabNguoiChoi';
    data = GET_ALL_INPUT_FROM_DIV('form_dsSanChoi');
    data.action = action;
    if (el != '') {
        data.id = $(el).attr('code');
    }
    var formData = form_toFormData(form_id);

    if (action == 0) { //Tra cứu lấy danh sách
        Action = 'ALL';
    } else if (action == 1) { //Thêm mới hoặc lưu thông tin
        Action = 'SAVE';
    } else if (action == 2) { //Xóa thông tin
        Action = 'DELETE';
    } else if (action == 3) { //Lấy thông tin 1 loại sân chơi
        Action = 'SELECT';
    } else if (action == 4) { //Thiết lập lưu sân chơi hiện tại
        Action = 'SAVE_STATUS';
        data.MaSanChoi = $(el).attr('code');
        $(el).parent('div').find('.card').removeClass('card-active');
        $(el).addClass('card-active');
    } else if (action == 10) { //DELETE from table row
        // Action = 'DELETE';
        // data.id = $(el).attr('code');
    } else if (action == 30) { //EDIT from table row
        Action = 'EDIT';
        data.id = $(el).attr('code');
    }


    data.Action = Action;
    AJAX_REQUEST_RESPONSE(url, 'POST', data, loadSanchoi);

    function BindingTabDsSanChoi(res) {
        console.log("Đang khởi tạo các dữ liệu sàn chơi và giải chơi");
        dt = res['data'];
        // dtb_DsSanChoi = $('#Modal_DsSanChoi table');
        body_DsSanChoi = $('#Modal_DsSanChoi table tbody');
        // dtb_DsSanChoi.destroy();
        body_DsSanChoi.empty();
        i = 0;
        dt = res['data'];
        if (dt.length <= 0) {
            return;
        }
        listSC = [];
        listSCName = [];
        //Cài đặt lại giá trị của sân chơi
        dt.forEach(function(item) {

            listSC.push(item['MaSanChoi']);
            listSCName.push(item['TenSanChoi']);
            if (item['TrangThai'] == '1') {
                MaSanChoi_HienTai = item['MaSanChoi']
            }
            // console.log(item);
            body_DsSanChoi.append('\
                        <tr>\
                            <td>' + (i += 1) + '</td>\
                            <td>' + item['MaSanChoi'] + '</td>\
                            <td>' + item['TenSanChoi'] + '</td>\
                            <td>\
                                <i class="fas fa-edit text-primary" onclick="ActionDsSanChoi(30,this)" code="' + item['id'] + '"></i>\
                                <i class="fas fa-trash-alt text-primary"  onclick="ActionDsSanChoi(10,this)" code="' + item['id'] + '"></i>\
                            </td>\
                        </tr>');
        });

        tag = $('.tab-sanchoi tbody');
        tag.empty();

        //Thiết lập danh sách giải thưởng
        for (var i = 0; i < listGTName.length; i++) {
            tag.append('<tr class="tr-' + listGT[i] + '">\
                            <td>\
                                <li class="list-group-item  list-group-item-action" onclick="setCheckBox(this)">\
                                    <input class="form-check-input me-1" type="checkbox" value="" id="' + listGT[i] + '" name="' + listGT[i] + '">\
                                    <label class="form-check-label">' + listGTName[i] + '</label>\
                                </li>\
                            </td>\
                            <td>\
                                <select class="form-select form-select" value="' + listGT[i] + '" name="LsQuaTang_' + listGT[i] + '" id="LsQuaTang_' + listGT[i] + '">\
                                </select>\
                            </td>\
                            <td>\
                                <input type="text" class="form-control img-ticket-name" id="TenQuaTang_' + listGT[i] + '" name="TenQuaTang_' + listGT[i] + '" value="">\
                                <input type="text" class="form-control img-ticket-code" id="MaQuaTang_' + listGT[i] + '" name="MaQuaTang_' + listGT[i] + '" value="" hidden>\
                            </td>\
                            <td>\
                                <img class="card-img-ticket" src="">\
                            </td>\
                            <td>\
                                <select class="form-select form-select bg-image-select" name="HinhNen_' + listGT[i] + '" id="HinhNen_' + listGT[i] + '"></select>\
                            </td>\
                            <td>\
                                <select class="form-select form-select bg-video-select" name="NenVideo_' + listGT[i] + '" id="NenVideo_' + listGT[i] + '"></select>\
                            </td>\
                            <td>\
                                <select class="form-select form-select spin-bg-select" name="NenVongQuay_' + listGT[i] + '" id="NenVongQuay_' + listGT[i] + '"></select>\
                            </td>\
                            <td>\
                                <input type="number" class="form-control" id="SoLanQuay_' + listGT[i] + '" name="SoLanQuay_' + listGT[i] + '" placeholder="Số lần quay" value="0" min="0">\
                            </td>\
                            <td>\
                                <input type="number" class="form-control" id="SoLuongGiai_' + listGT[i] + '" name="SoLuongGiai_' + listGT[i] + '" placeholder="Số lượng giải" value="0" min="0">\
                            </td>\
                        </tr>');
        }

        PopulateGameMediaSelects();

        //Thiết lập sân chơi
        tag2 = $('#Modal_SanChoi #MaSanChoi,#Modal_NguoiChoi #MaSanChoi,#Modal_TrungThuong #MaSanChoi');
        tag3 = $('#Modal_DsSanChoi #MaSanChoi');
        tag2.empty().append('<option></option>');
        tag3.empty().append('<option></option>');
        tag4 = $('#cardList');
        tag4.empty;

        for (var i = 0; i < listSC.length; i++) {
            tag2.append(' <option value="' + listSC[i] + '">' + listSCName[i] + '</option>'); //Xây dựng lại thẻ 
            tag3.append(' <option value="' + listSC[i] + '">' + listSC[i] + '</option>'); //Xây dựng lại thẻ 
            tag4.append('<div class="card" code="' + listSC[i] + '" onclick1="ActionSanChoi(4,this)"><pre>' + listSCName[i] + '</pre></div>'); //Xây dựng lại thẻ 
        }

        //Hiển thị lại giao diện sân chơi
        ActionSanChoi(5); //Khởi tạo giao diện ,lấy thông tin danh sách giải
        console.log("đã chọn sân");
    }



    function loadSanchoi(res) {
        // console.log(res);
        if (action == 0) {
            BindingTabDsSanChoi(res);
        } else if (action == 1) {
            ActionDsSanChoi(0);
            Alert_OK();
        } else if (action == 3) {
            dt = res['data'][0];
            $('#form_dsSanChoi #TenSanChoi').val(dt['TenSanChoi']);
        } else if (action == 4) { //Lưu hiện tại thì 
            MaSanChoi_HienTai = data.MaSanChoi;
            ActionSanChoi(5); //Lấy lại giao diện sân chơi
            ActionEmp(5); //Lấy lại danh sách người chơi
        } else if (action == 30 || action == 10) { // load lại danh sách sau khi sửa hoặc xóa
            ActionSanChoi(0);
        }

    }
}

//thao tác sân choi
function ActionSanChoi(action, el = '') {
    Action = '';
    url = '/action_dbLite/';
    form_id = 'form_sanchoi';
    var formData = form_toFormData(form_id);
    data = GET_ALL_INPUT_FROM_DIV(form_id);
    dt = { 'tab_name': 'TabSanChoi' }

    if (action == 0) { //Tra cứu lấy danh sách
        Action = 'ALL';
    } else if (action == 1) { //Thêm mới hoặc lưu thông tin
        Action = 'SAVE';
    } else if (action == 2) { //Xóa thông tin
        Action = 'DELETE';
    } else if (action == 3) { //Lấy thông tin 1 loại sân chơi
        Action = 'VIEWCF';
    } else if (action == 5 || action == 7) { //nạp lại giao diện
        data.Action = 'GET_CF';
        return AJAX_REQUEST_RESPONSE(url, 'POST', data, func);
    } else if (action == 6) { //Lưu giải game đang chơi
        dt.Action = 'ACTIVE_GIAI';
        dt.MaSanChoi = $(el).attr('masanchoi');
        dt.MaGiai = $(el).attr('magiai');
        return AJAX_REQUEST_RESPONSE(url, 'POST', dt, func);
    } else if (action == 8) {
        dt.Action = 'SAVE_LANQUAY';
        dt.DangQuayLanThu = LanQuayThu_HienTai;
        return AJAX_REQUEST_RESPONSE(url, 'POST', dt, func);
    }
    post_form();

    function post_form() {
        // console.log(action, Action);
        formData.set('Action', Action);
        arr = [3];
        if (arr.includes(action)) {
            if ($('#' + form_id + ' #MaSanChoi').val() == '') {
                Show_Alert_Message("Chưa chọn sân chơi");
                return;
            }
        }

        form_submit(formData, url, func);
    }
    // data.Action = Action;
    // AJAX_REQUEST_RESPONSE(url, 'POST', data, loadSanchoi);

    function func(res) {

        if (action == 3) { //Lấy thông tin cấu hình
            //xóa trạng thái dữ liệu thông tin giải cũ
            $('#' + form_id + ' .tab-sanchoi input').prop('checked', false);
            $('#' + form_id + ' .tab-sanchoi .img-ticket-name').val('');
            $('#' + form_id + ' .tab-sanchoi .img-ticket-code').val('');
            $('#' + form_id + ' .tab-sanchoi .card-img-ticket').prop('src', '');
            $('#' + form_id + ' .tab-sanchoi .form-select').val('');
            // Reset các input số lần quay và số lượng giải
            $('#' + form_id + ' .tab-sanchoi input[name^="SoLanQuay_"]').val('0');
            $('#' + form_id + ' .tab-sanchoi input[name^="SoLuongGiai_"]').val('0');

            res['data'].forEach(function(item) {
                // console.log(item);
                $('#' + form_id + ' .tr-' + item['MaGiai'] + ' input').prop('checked', true);
                $('#' + form_id + ' .tr-' + item['MaGiai']).find('.img-ticket-code').val(item['MaQuaTang']);
                $('#' + form_id + ' .tr-' + item['MaGiai']).find('.img-ticket-name').val(item['TenQuaTang']);
                // Populate số lần quay và số lượng giải
                $('#' + form_id + ' .tr-' + item['MaGiai']).find('input[name="SoLanQuay_' + item['MaGiai'] + '"]').val(item['SoLanQuay'] || '0');
                $('#' + form_id + ' .tr-' + item['MaGiai']).find('input[name="SoLuongGiai_' + item['MaGiai'] + '"]').val(item['SoLuongGiai'] || '0');
                $('#' + form_id + ' .tr-' + item['MaGiai']).find('select[name="HinhNen_' + item['MaGiai'] + '"]').attr('data-selected', item['HinhNenGame'] || '').val(item['HinhNenGame'] || '');
                $('#' + form_id + ' .tr-' + item['MaGiai']).find('select[name="NenVideo_' + item['MaGiai'] + '"]').attr('data-selected', item['NenVideoGame'] || '').val(item['NenVideoGame'] || '');
                $('#' + form_id + ' .tr-' + item['MaGiai']).find('select[name="NenVongQuay_' + item['MaGiai'] + '"]').attr('data-selected', item['NenVongQuayGame'] || 'spin3.png').val(item['NenVongQuayGame'] || 'spin3.png');
                if (item['HinhAnh'] != '') {
                    $('#' + form_id + ' .tr-' + item['MaGiai']).find('.card-img-ticket').attr('src', '/static/spin/images/' + item['HinhAnh'] + '?v=1');
                }
            });

            PopulateGameMediaSelects();

            // 🔄 Load danh sách quà cho sân chơi này vào tất cả select
            console.log('🔄 ActionSanChoi(3) - Load danh sách quà cho sân chơi');
            ActionGiaiThuong(0); //Nạp lại danh sách quà tặng vào select box
        }
        //Nạp lại thông tin sân chơi hiện tại
        else if (action == 5) {
            return _init_ticket(res);
        } else if (action == 6) { //Lấy thông tin các Cấu hình số lần quay,số lượng đã hay chưa quay
            MaGiai_HienTai = dt.MaGiai;
            MaSanChoi_HienTai = dt.MaSanChoi;

            //Nạp ngay cấu hình nền/video/nền vòng quay theo giải vừa chọn
            ActionGameCf(1, {
                MaSanChoi: dt.MaSanChoi,
                MaGiai: dt.MaGiai
            });

            //Lấy lại danh sách mã quay thưởng
            // console.log("bắt đầu lấy danh sách người quay thưởng");
            //ActionSanChoi(5);
            // console.log(MaGiai_HienTai);
            // console.log(MaSanChoi_HienTai);

            //Lấy lại thông tin các số lượng giải và lượt quay
            ActionSanChoi(7);
            //Lấy danh sách vé chưa quay thưởng từ sân chơi và giải đang kích hoạt
            ActionEmp(9);
            return;
        } else if (action == 7 || action == 5) {
            //console.log(res);
            res['data'].forEach(function(item) {
                if (item['TrangThai'] == 1) {
                    setParamesLucky(item);
                }
            });
            return;
        } else if (action == 8) { return }

        if (action == 1) {
            SaveGameCfBySanChoi(data.MaSanChoi, function() {
                Alert_OK();
                ActionSanChoi(3);
            });
            return;
        }

        Alert_OK();
    }
}

$(document).ready(function() {
    LoadGameMediaLibrary();
});


body_NguoiChoi = $('#Tab_NguoiChoi tbody');
dtb_NguoiChoi = new DataTable('#Tab_NguoiChoi', {
    layout: {
        topStart: {
            buttons: ['copy', 'excel', 'pdf', 'colvis']
        }
    }
});

function getTenGiai(DsMaGiai) {
    DsMaGiai = DsMaGiai.split(',');
    chuoi = "";
    for (let i of DsMaGiai) {
        chuoi += listGTName[listGT.indexOf(i)] + ",";
    }
    return chuoi;
}


//kiểm tra thông tin người tham gia
function check_emp() {
    var data = GET_ALL_INPUT_FROM_DIV('div_Emp');
    if (data.MaNhanVien == '') {
        Show_Alert_Message('Chưa có mã nhân viên');
        return false;
    } else
    if (data.TenNhanVien == '') {
        Show_Alert_Message('Chưa có họ Tên nhân viên');
        return false
    } else
    if (data.MaDuThuong == '') {
        Show_Alert_Message('Chưa có họ Mã dự thưởng');
        return false
    }
    return true;
}

//Kiểm tra chọn thao tác và sân chơi
function check_thaotac() {
    thaotac = $('#form_emp #Action').val();
    MaSanChoi = $('#form_emp #MaSanChoi').val();
    //console.log(MaSanChoi);
    if (thaotac == '') {
        Show_Alert_Message('Chưa chọn thao tác thực hiện !');
        return false;
    }
    if (MaSanChoi == '') {
        Show_Alert_Message('Chưa chọn mục sân chơi !');
        return false;
    }
    return true;
}


//Xử lý lưu dữ liệu đơn 
function ActionEmp(action, el = '') {
    console.log('🎯 ActionEmp called with action:', action);
    thaotac = $('#form_emp #Action').val();
    MaSanChoi = $('#form_emp #MaSanChoi').val();

    url = '/action_dbLite/';
    form_id = 'form_emp';
    tab_name = 'TabNguoiChoi';
    var formData = form_toFormData(form_id);

    var data = GET_ALL_INPUT_FROM_DIV('div_Emp');
    Action = '';

    if (action == 0) { // Tìm kiếm thông tin
        if (thaotac == '0') {
            Action = 'SEARCH_ALL';
            post_data();
        } else if (thaotac == '1') { //Thêm 1 người
            if (check_emp() == false) {
                return false
            }
            Action = 'ADD_EMP';
            return post_data();
        } else if (thaotac == '3') { //Xóa 1 người
            if (check_emp() == false) {
                return false
            }
            Action = 'DEL_EMP';
            return Question_(post_data);

        } else if (thaotac == '5') { //Xóa toàn bộ
            if (check_thaotac() == false) {
                return false
            }
            Action = 'RESET';
            return Question_(post_data);
        }
        // post_data();
        return;
    } else if (action == 1) { //Xóa thông tin 1 người
        Action = 'DELETE';
        data.id = $(el).attr('code');
        return Question_(post_data);
    } else if (action == 2) { //Thêm/xóa thông tin từ excel
        if (check_thaotac() == false) {
            return;
        }
        if (thaotac == '2') { //Thêm thông tin từ excel
            //Kiểm tra đã chọn mã giải chưa
            check_dsm = false;
            $('#Modal_NguoiChoi .form-check-input').each(function(index, el) {
                if ($(this).is(':checked')) {
                    check_dsm = true
                }
            });
            if (check_dsm == false) {
                Show_Alert_Message("Bạn cần chọn giải cho danh sách chơi !");
                return;
            }
            Action = 'ADD_EXCEL'

        } else if (thaotac == '4') { //xóa từ file excel
            Action = 'DEL_EXCEL'
        } else {
            Show_Alert_Message("Bạn cần chọn thao tác với tệp EXCEL");
            return;
        }

        Question_(upload_excelEmp)
        return;
    } else if (action == 3) { //sửa 1 người
        Action = 'EDIT_EMP';
        return post_data();
    } else if (action == 4) { //Tìm thông tin
        Action = 'SEARCH_ALL';
        return post_data();
    } else if (action == 5) { //tra cứu thông tin
        Action = 'SEARCH_ALL';
        return post_data();
    } else if (action == 8) { //Lấy danh sách giải đã cài đặt cho sân chơi
        Action = 'VIEWCF';
        data.tab_name = 'TabSanChoi';
        return post_data();
    } else if (action == 9) { //Lấy danh sách người chơi chưa được quay cho 1 giải trên 1 sân chơi
        Action = 'GET_LIST_PLAY';
        data.MaGiai = MaGiai_HienTai;
        data.MaSanChoi = MaSanChoi_HienTai;
        if (data.MaGiai == undefined) { return; }
        return post_data();
    }

    function post_data() {
        data.Action = Action;
        AJAX_REQUEST_RESPONSE(url, 'POST', data, func);
    }

    //Xử lý lưu dữ liệu từ file excel
    function upload_excelEmp() {
        form_id = 'form_emp';
        var formData = form_toFormData(form_id);

        if ($("#" + form_id + " #listfile").val() == '') {
            Show_Alert_Message('Bạn chưa chọn file upload');
            return false;
        }
        // console.log(Action);
        formData.set('Action', Action);
        form_submit(formData, url, func);
    }

    function func(res) {
        // console.log(action);
        // console.log(thaotac);
        // console.log(res);
        if (action == 8) { //Lấy ds giải đã cài đặt cho sân chơi
            tag = $('#form_emp #DsMaGiai');
            tag.empty();
            html = '';
            res['data'].forEach(function(item) {
                html += '<li class="list-group-item list-group-item-action"  onclick="setCheckBox(this)">\
                                    <input class="form-check-input me-1" type="checkbox" value="" id="' + item['MaGiai'] + '" name="' + item['MaGiai'] + '">\
                                    <label class="form-check-label" for="' + item['MaGiai'] + '">' + listGTName[listGT.indexOf(item['MaGiai'])] + '</label>\
                                </li>';
            });

            tag.append(html);
            //Lấy thông tin danh sách người chơi của sân chơi
            //ActionEmp(0);
            return;
        } else if (action == 2) { //Thao tác với file exel
            console.log("Đã thao tác với file excel");
            Alert_OK();
            ActionEmp(4);
        } else if ((action == 0 && (thaotac == '0')) || action == 4) { //Thêm hoặc xóa đề đổ dữ liệu     

            i = 0;
            dt = res['data'];
            if (dt.length <= 0) {
                Show_Alert_Message("Không có dữ liệu !")
                    // dtb_NguoiChoi = new DataTable('#Tab_NguoiChoi', {
                    //     layout: {
                    //         topStart: {
                    //             buttons: ['copy', 'excel', 'pdf', 'colvis']
                    //         }
                    //     }
                    // });
                return;
            }
            dtb_NguoiChoi.destroy();
            body_NguoiChoi.empty();
            dt.forEach(function(item) {
                body_NguoiChoi.append('\
                        <tr>\
                            <td>' + (i += 1) + '</td>\
                            <td>' + item['MaNhanVien'] + '</td>\
                            <td>' + item['TenNhanVien'] + '</td>\
                            <td>' + item['MaDuThuong'] + '</td>\
                            <td>' + getTenGiai(item['DsMaGiai']) + '</td>\
                            <td>' + listSCName[listSC.indexOf(item['MaSanChoi'])] + '</td>\
                            <td>' + item['NgayTao'] + '</td>\
                            <td>\
                                <i class="fas fa-edit text-primary" onclick="ActionEmp(3,this)" code="' + item['id'] + '"></i>\
                                <i class="fas fa-trash-alt text-primary"  onclick="ActionEmp(1,this)" code="' + item['id'] + '"></i>\
                            </td>\
                        </tr>');
            });

            dtb_NguoiChoi = new DataTable('#Tab_NguoiChoi', {
                layout: {
                    topStart: {
                        buttons: ['copy', 'excel', 'pdf', 'colvis']
                    }
                }
            });
        } else if (action == 0 && (thaotac == '1' || thaotac == '2' || thaotac == '3' || thaotac == '4' || thaotac == '5') || action == 1) { //Nạp lại bảng nếu thao tác thêm xóa dữ liêu
            Alert_OK();
            ActionEmp(4);
        } else if (action == 9) { //Sau khi lấy được danh sách người chơi thì nạp lại danh sách quay thưởng
            console.log('✅ ActionEmp action==9 callback triggered');
            winningCodes = [];
            dt = res['data'];
            DsNhanVienQuayThuong = dt;
            DsNhanVienQuayThuong2 = {};
            //console.log(dt)
            dt.forEach(function(item) {
                winningCodes.push(item['MaDuThuong']);
                DsNhanVienQuayThuong2[item['MaDuThuong']] = item['TenNhanVien'];
            });
            console.log("đã lấy danh sách người quay thưởng mới nhất");
            console.log('📋 Danh sách người quay thưởng còn lại:', winningCodes);
            console.log('📋 Tổng số người còn lại:', winningCodes.length);
            console.log('📋 Chi tiết:', DsNhanVienQuayThuong);
            // console.log(winningCodes);
            return;
        }

        if (action == 2) { //Nếu up excel hoặc thao tác thêm xóa thì hiển thị OK
            Alert_OK();
        }
        return;
    }

}


//<!-- Khởi tạo và quản lý danh sách trúng thưởng -->

//Thao tavs xử lý bảng danh sách sân chơi
function ActionTrungThuong(action, el = '') {
    Action = '';
    url = '/action_dbLite/';
    form_id = 'form_TrungThuong';
    tab_name = 'Tab_TrungThuong';
    data = GET_ALL_INPUT_FROM_DIV(form_id)
    var formData = form_toFormData(form_id);


    function check_sanchoi() {
        sanchoi = $('#div_TrungThuong #MaSanChoi').val() != '';
        if (sanchoi == false) {
            Show_Alert_Message("Bạn chưa chọn mục sân chơi");
        }
        return sanchoi;
    }
    if (action == 0) { //Tra cứu lấy danh sách
        Action = 'SEARCH';
        if (check_sanchoi() == false) {
            return;
        }
    } else if (action == 1) { //Thêm mới hoặc lưu thông tin
        Action = 'SAVE';
    } else if (action == 2) { //Xóa thông tin
        Action = 'DELETE';
        data.id = $(el).attr('code');

    } else if (action == 3) { //Lấy thông tin 1 loại sân chơi
        Action = 'SELECT';
        data.id = $(el).attr('code');
        if (check_sanchoi() == false) {
            return;
        }
    } else if (action == 4) { //Xóa toàn bộ bảng của 1 sân
        Action = 'RESET';
        if (check_sanchoi() == false) {
            return;
        }
    } else if (action == 5) { //lấy danh sách mã đã trúng thưởng của 1 mã sân chơi theo thứ tự mới đến cũ
        Action = 'GET_TICKET_OK';
        data.MaSanChoi = MaSanChoi_HienTai;
    } else if (action == 6) { //Thiết lập vắng mặt
        data.Action = 'SET_VANGMAT';
        data.id = $(el).attr('code');
        return AJAX_REQUEST_RESPONSE(url, 'POST', data, loadTrungThuong);
    } else if (action == 8) { //Lấy thông tin giải cài đặt cho sân chơi về modal Modal_TrungThuong
        Action = 'GET_TICKET';
    } else if (action == 10) { //Lưu người trúng khi quay số xong có kết quả vào csdl
        dt = { 'tab_name': 'TabTrungThuong' }
        dt.Action = 'SAVE_TICKET_OK';
        dt.MaDuThuong = MATRUNGTHUONG;
        dt.MaNhanVien = MANHANVIENTRUNGTHUONG;
        dt.MaGiai = MaGiai_HienTai;
        dt.MaSanChoi = MaSanChoi_HienTai;
        return AJAX_REQUEST_RESPONSE(url, 'POST', dt, loadTrungThuong);
    } else if (action == 11) { //Lấy danh sách mã đã trúng thưởng từ sân chơi đã kích hoạt
        Action = 'GET_TICKET_ACTIVE';
    } else if (action == 12) { //Lưu thông tin danh sách trúng thưởng vào db
        Action = 'SAVE_LIST_TICKET_OK';
        data.Wincodes = Object.assign({}, el);
    }

    data.Action = Action;
    AJAX_REQUEST_RESPONSE(url, 'POST', data, loadTrungThuong);

    function BindingTabTrungThuong(res) {
        dt = res['data'];
        tbl_TrungThuong = $('#Modal_TrungThuong table');
        body_TrungThuong = $('#Modal_TrungThuong table tbody');
        body_TrungThuong.empty();
        i = 0;
        dt = res['data'];
        if (dt.length <= 0) {
            return;
        }

        dt.forEach(function(item) {
            body_TrungThuong.append('\
                <tr>\
                <td>' + (i += 1) + '</td>\
                <td>' + item['MaNhanVien'] + '</td>\
                <td>' + item['TenNhanVien'] + '</td>\
                <td>' + item['MaDuThuong'] + '</td>\
                <td>' + getTenGiai(item['MaGiai']) + '</td>\
                <td>' + listSCName[listSC.indexOf(item['MaSanChoi'])] + '</td>\
                <td>' + item['NgayTao'] + '</td>\
                <td>\
                    <i class="fas fa-edit text-primary" onclick="ActionTrungThuong(3,this)" code="' + item['id'] + '"></i>\
                    <i class="fas fa-trash-alt text-primary"  onclick="ActionTrungThuong(2,this)" code="' + item['id'] + '"></i>\
                </td>\
            </tr>');
        });

    }

    function loadTrungThuong(res) {
        // console.log(res);
        if (action == 0) { //tra cứu
            BindingTabTrungThuong(res);
        } else if (action == 1 || action == 2) {
            ActionTrungThuong(0);
            Alert_OK();
            if (action == 2) { //nạp lại giao diện sau khi xóa
                console.log("Đã xóa thông tin trúng thưởng");
                ActionSanChoi(5); //Lấy lại giao diện sân chơi
            }
        } else if (action == 3) {
            dt = res['data'][0];
            $('#form_dsSanChoi #TenSanChoi').val(dt['TenSanChoi']);
        } else if (action == 5 || action == 11) {
            body = $('.game-table tbody');
            dt = res['data'];
            html = '';
            num = dt.length + 1;
            dt.forEach(function(item, index) {
                html += ('<tr>\
                    <td>' + (num -= 1) + '</td>\
                    <td><i class="fa fa-eraser text-warning" code="' + item['id'] + '"></i> ' + item['MaDuThuong'] + '</td>\
                    <td hidden>' + item['TenGiai'] + '</td>\
                    <td hidden>' + item['MaNhanVien'] + '</td>\
                    <td hidden>' + item['TenNhanVien'] + '</td>\
                    </tr>');
            });
            //body.empty();
            body.html(html);
            console.log("Đã danh sách đã trúng giải cho bảng nhật ký");
        } else if (action == 4) {
            console.log("Đã xóa hết thông tin trúng thưởng");
            SetUp_pram = 0;
            ActionSanChoi(5); //Lấy lại giao diện sân chơi
        } else if (action == 6) {
            Alert_OK();
            //Nạp lai thông tin giao diện và danh sách trúng thưởng và lấy danh sách người chơi mơi
            ActionSanChoi(5);

        } else if (action == 8) { //Lấy thông tin danh sách giải
            tag = $('#' + form_id + ' #DsMaGiai');
            tag.empty();
            html = '';
            res['data'].forEach(function(item) {
                html += '<li class="list-group-item  list-group-item-action" onclick="setCheckBox(this)">\
                            <input class="form-check-input me-1" type="checkbox" value="" id="' + item['MaGiai'] + '" name="' + item['MaGiai'] + '">\
                            <label class="form-check-label" for="' + item['MaGiai'] + '">' + listGTName[listGT.indexOf(item['MaGiai'])] + '</label>\
                        </li>';
            });
            tag.append(html);
        } else if (action == 10) { //Sau khi lưu vé trúng vào bảng thì xóa vé khỏi danh sách quay thưởng
            console.log("Đã lưu vé quay thưởng");
            //winningCodes = winningCodes.filter(item => item !== MATRUNGTHUONG); // Xóa phần tử có giá trị trúng thưởng
            // Tìm chỉ số của phần tử cần xóa
            let index = winningCodes.indexOf(3); // Tìm chỉ số của giá trị 3
            winningCodes.splice(index, 1); // Xóa 1 phần tử tại chỉ số index

            console.log('📋 Danh sách người quay thưởng sau khi xóa:');
            console.log('📋 Mã du thưởng:', winningCodes);
            console.log('📋 Tổng số người còn lại:', winningCodes.length);
            console.log('📋 Chi tiết từng người:');
            winningCodes.forEach(function(code) {
                console.log('   - Mã:', code, '| Tên:', DsNhanVienQuayThuong2[code]);
            });

            //Lấy danh sách bảng nhật ký trúng giải trước đó của sân chơi
            ActionTrungThuong(11);

            // Thêm dòng mới vào đầu <tbody>
            // dodai_body = $('.game-table tbody row').length + 1;
            // $('.game-table tbody').prepend('\
            //     <tr>\
            //         <td >' + dodai_body + '</td>\
            //         <td hidden>' + MATRUNGTHUONG + '</td>\
            //          <td hidden>' + MaGiai_HienTai + '</td>\
            //         <td>' + MANHANVIENTRUNGTHUONG + '</td>\
            //         <td>' + TENNHANVIENTRUNGTHUONG + '</td>\
            //     </tr>');

            //Nạp lại giao diện thông số và  số lần quay mới
            ActionSanChoi(5);
        } else if (action == 12) { //Sau khi lưu vé trúng vào bảng thì xóa vé khỏi danh sách quay thưởng
            console.log("Đã lưu vé quay thưởng");
            for (let i of el) {
                let index = winningCodes.indexOf(i); // Tìm chỉ số của giá trị 3
                winningCodes.splice(index, 1); // Xóa 1 phần tử tại chỉ số index
            }
            //Nạp lại giao diện thông số và  số lần quay mới
            ActionSanChoi(5);
        }


    }
}

function scrollToTop(idTag) {
    const tableContainer = document.getElementById(idTag);
    tableContainer.scrollTop = 0; // Cuộn về đầu
    // Xóa class sau khi hoàn tất hiệu ứng (1 giây)
    setTimeout(() => {
        tableContainer.classList.remove('scrolling');
    }, 1000);
}

function setCheckBox(el) {
    // console.log("checked");
    checkb = $(el).find('input');
    if (checkb.is(':checked')) {
        checkb.prop('checked', false);
    } else {
        checkb.prop('checked', true);
    }
}

function ChangeBackgr(el = '', image = 'bg_1.jpg') {
    if (el == '') {
        img = image;
    } else {
        img = $(el).val();
        console.log(img);
    }
    let date = new Date();
    let timestamp = date.getTime(); // Hoặc date.valueOf()

    //$('.glass-card,.table-container').css('background-color', "#9b0006");
    $('html,body,.modal,.body-modal,#Modal_ChonSanChoi').css('background-image', "url('/static/img/bg_tet/" + img + "?v=" + timestamp + "')");

}

function changeVideo(newSrc, idVideo, idSource, onSuccess = null, onError = null) {
    if (!newSrc || String(newSrc).trim() === '') {
        $('.video-bg').hide();
        if (typeof onError === 'function') onError();
        return;
    }

    let video = document.getElementById(idVideo);
    let source = document.getElementById(idSource);
    if (!video || !source) {
        $('.video-bg').hide();
        if (typeof onError === 'function') onError();
        return;
    }

    url_video = '/static/video/';
    src_old = source.src

    let index = src_old.lastIndexOf('video/') + 6;
    src_old = src_old.substring(index);

    let handled = false;
    const clearHandlers = function() {
        video.oncanplay = null;
        video.onerror = null;
        video.onstalled = null;
        video.onabort = null;
    };

    video.oncanplay = function() {
        if (handled) return;
        handled = true;
        clearHandlers();
        $('.video-bg').show();
        video.play().catch(function() {});
        console.log("Đã đổi video nền", src_old, newSrc);
        if (typeof onSuccess === 'function') onSuccess();
    };

    const fail = function() {
        if (handled) return;
        handled = true;
        clearHandlers();
        $('.video-bg').hide();
        if (typeof onError === 'function') onError();
    };

    video.onerror = fail;
    video.onstalled = fail;
    video.onabort = fail;

    source.src = url_video + String(newSrc).trim();
    video.load();
}

// ============= QUẢN LÝ SÂN CHƠI =============

/**
 * Hiển thị form thêm sân chơi mới
 */
function ShowAddSanChoiForm() {
    console.log('📝 ShowAddSanChoiForm - Hiển thị form thêm sân chơi');
    $('#form_sanchoi_container').show();
    $('#form_title').text('Thêm sân chơi mới');
    $('#form_sanchoi_add')[0].reset();
    $('#MaSanChoi_Add').prop('readonly', false);
    $('#btn_save_sanchoi').html('<i class="fa fa-save"></i> Lưu').data('action', 'add');
}

/**
 * Ẩn form sân chơi
 */
function HideSanChoiForm() {
    console.log('❌ HideSanChoiForm - Ẩn form sân chơi');
    $('#form_sanchoi_container').hide();
    $('#form_sanchoi_add')[0].reset();
}

/**
 * Load danh sách sân chơi
 */
function LoadDanhSachSanChoi() {
    console.log('📋 LoadDanhSachSanChoi - Tải danh sách sân chơi');
    Show_loading();

    var data = {
        'Action': 'ALL',
        'tab_name': 'TabDsSanChoi'
    };

    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: data,
        success: function(response) {
            Exit_Loading();
            console.log('✅ LoadDanhSachSanChoi response:', response);

            if (!response.data) {
                console.warn('Không có dữ liệu sân chơi');
                return;
            }

            var tbody = $('#table_danhsach_sanchoi tbody');
            tbody.empty();

            response.data.forEach(function(item, index) {
                var trangThai = item['TrangThai'] == 1 ? '<span class="badge bg-success">Hoạt động</span>' : '<span class="badge bg-secondary">Tạm dừng</span>';

                tbody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${item['MaSanChoi']}</strong></td>
                        <td>${item['TenSanChoi']}</td>
                        <td>${trangThai}</td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick="EditSanChoi('${item['id']}', '${item['MaSanChoi']}', '${item['TenSanChoi']}')" title="Sửa">
                                <i class="fa fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="DeleteSanChoi('${item['id']}')" title="Xóa">
                                <i class="fa fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(err) {
            Exit_Loading();
            console.error('❌ LoadDanhSachSanChoi error:', err);
            Swal.fire('Lỗi', 'Không thể tải danh sách sân chơi', 'error');
        }
    });
}

/**
 * Sửa sân chơi
 */
function EditSanChoi(id, maSanChoi, tenSanChoi) {
    console.log('✏️ EditSanChoi - id:', id, 'maSanChoi:', maSanChoi, 'tenSanChoi:', tenSanChoi);
    $('#form_sanchoi_container').show();
    $('#form_title').text('Sửa sân chơi');
    $('#MaSanChoi_Add').val(maSanChoi).prop('readonly', true);
    $('#TenSanChoi_Add').val(tenSanChoi);
    $('#form_sanchoi_add').data('record-id', id);
    $('#btn_save_sanchoi').html('<i class="fa fa-refresh"></i> Cập nhật').data('action', 'edit');

    // Scroll to form
    $('html, body').animate({ scrollTop: $('#form_sanchoi_container').offset().top - 100 }, 300);
}

/**
 * Xóa sân chơi
 */
function DeleteSanChoi(id) {
    console.log('🗑️ DeleteSanChoi - id:', id);
    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa sân chơi này? Dữ liệu sẽ không thể khôi phục.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            Show_loading();

            var data = {
                'Action': 'DELETE',
                'tab_name': 'TabDsSanChoi',
                'id': id
            };

            $.ajax({
                type: 'POST',
                url: '/action_dbLite/',
                data: data,
                success: function(response) {
                    Exit_Loading();
                    console.log('✅ DeleteSanChoi success:', response);
                    Swal.fire('Thành công', 'Xóa sân chơi thành công!', 'success');
                    LoadDanhSachSanChoi();
                },
                error: function(err) {
                    Exit_Loading();
                    console.error('❌ DeleteSanChoi error:', err);
                    Swal.fire('Lỗi', 'Không thể xóa sân chơi', 'error');
                }
            });
        }
    });
}

/**
 * Lưu sân chơi (thêm mới hoặc sửa)
 */
function SaveSanChoi() {
    console.log('💾 SaveSanChoi');

    var maSanChoi = $('#MaSanChoi_Add').val().trim();
    var tenSanChoi = $('#TenSanChoi_Add').val().trim();
    var action = $('#btn_save_sanchoi').data('action') || 'add';

    // Validate
    if (!maSanChoi) {
        Swal.fire('Cảnh báo', 'Vui lòng nhập mã sân chơi', 'warning');
        return;
    }

    if (!tenSanChoi) {
        Swal.fire('Cảnh báo', 'Vui lòng nhập tên sân chơi', 'warning');
        return;
    }

    Show_loading();

    var data = {
        'Action': 'SAVE',
        'tab_name': 'TabDsSanChoi',
        'MaSanChoi': maSanChoi,
        'TenSanChoi': tenSanChoi
    };

    // Nếu là edit, thêm id vào
    if (action === 'edit') {
        data.Action = 'EDIT';
        data.id = $('#form_sanchoi_add').data('record-id');
    }

    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: data,
        success: function(response) {
            Exit_Loading();
            console.log('✅ SaveSanChoi response:', response);

            if (response.error) {
                Swal.fire('Lỗi', 'Lỗi lưu sân chơi: ' + response.error, 'error');
            } else {
                var msg = action === 'edit' ? 'Cập nhật sân chơi thành công!' : 'Thêm sân chơi mới thành công!';
                Swal.fire('Thành công', msg, 'success');
                HideSanChoiForm();
                LoadDanhSachSanChoi();
            }
        },
        error: function(err) {
            Exit_Loading();
            console.error('❌ SaveSanChoi error:', err);
            Swal.fire('Lỗi', 'Không thể lưu sân chơi', 'error');
        }
    });
}

// Khởi tạo event khi modal "Thiết lập sân chơi" mở
$(document).ready(function() {
    var modalSanChoi = document.getElementById('Modal_SanChoi');
    if (modalSanChoi) {
        modalSanChoi.addEventListener('show.bs.modal', function() {
            console.log('🎯 Modal_SanChoi opened - Load danh sách sân chơi');
            LoadGameMediaLibrary();
            LoadDanhSachSanChoi();
            LoadDanhSachGiai();
        });
    }
});


// ========== QUẢN LÝ DANH SÁCH GIẢI (TabDsGiai) ==========

/**
 * Hiển thị form thêm giải mới
 */
function ShowAddGiaiForm() {
    console.log('📝 ShowAddGiaiForm - Hiển thị form thêm giải');
    $('#form_giai_container .card').show();
    $('#form_giai_title').text('Thêm giải mới');
    $('#form_giai_add')[0].reset();
    $('#MaGiai_Add').prop('readonly', false);
    $('#btn_save_giai').html('<i class="fa fa-save"></i> Lưu').data('action', 'add');
}

/**
 * Ẩn form giải
 */
function HideGiaiForm() {
    console.log('❌ HideGiaiForm - Ẩn form giải');
    $('#form_giai_container .card').hide();
    $('#form_giai_add')[0].reset();
}

/**
 * Lưu giải thưởng
 */
function SaveGiai() {
    console.log('💾 SaveGiai');

    var maGiai = $('#MaGiai_Add').val().trim();
    var tenGiai = $('#TenGiai_Add').val().trim();
    var action = $('#btn_save_giai').data('action') || 'add';

    // Validate
    if (!maGiai) {
        Swal.fire('Cảnh báo', 'Vui lòng nhập mã giải', 'warning');
        return;
    }

    if (!tenGiai) {
        Swal.fire('Cảnh báo', 'Vui lòng nhập tên giải', 'warning');
        return;
    }

    Show_loading();

    var data = {
        'Action': 'SAVE',
        'tab_name': 'TabDsGiai',
        'MaGiai': maGiai,
        'TenGiai': tenGiai
    };

    // Nếu là edit, thêm id vào
    if (action === 'edit') {
        data.Action = 'EDIT';
        data.id = $('#form_giai_add').data('record-id');
    }

    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: data,
        success: function(response) {
            Exit_Loading();
            console.log('✅ SaveGiai response:', response);

            if (response.error) {
                Swal.fire('Lỗi', 'Lỗi lưu giải: ' + response.error, 'error');
            } else {
                var msg = action === 'edit' ? 'Cập nhật giải thành công!' : 'Thêm giải mới thành công!';
                Swal.fire('Thành công', msg, 'success');
                HideGiaiForm();
                LoadDanhSachGiai();
            }
        },
        error: function(err) {
            Exit_Loading();
            console.error('❌ SaveGiai error:', err);
            Swal.fire('Lỗi', 'Không thể lưu giải', 'error');
        }
    });
}

/**
 * Load danh sách giải
 */
function LoadDanhSachGiai() {
    console.log('📋 LoadDanhSachGiai - Tải danh sách giải');
    Show_loading();

    var data = {
        'Action': 'ALL',
        'tab_name': 'TabDsGiai'
    };

    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: data,
        success: function(response) {
            Exit_Loading();
            console.log('✅ LoadDanhSachGiai response:', response);

            if (!response.data) {
                console.warn('Không có dữ liệu giải');
                return;
            }

            var tbody = $('#table_danhsach_giai tbody');
            tbody.empty();

            var i = 0;
            response.data.forEach(function(item) {
                i++;
                var row = $('<tr>').append(
                    $('<td>').text(i),
                    $('<td>').text(item.MaGiai),
                    $('<td>').text(item.TenGiai),
                    $('<td>').html(
                        '<button class="btn btn-sm btn-warning" onclick="EditGiai(\'' + item.id + '\',\'' + item.MaGiai + '\',\'' + item.TenGiai + '\')" title="Sửa">' +
                        '<i class="fa fa-edit"></i> Sửa</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="DeleteGiai(\'' + item.id + '\')" title="Xóa">' +
                        '<i class="fa fa-trash"></i> Xóa</button>'
                    )
                );
                tbody.append(row);
            });
        },
        error: function(err) {
            Exit_Loading();
            console.error('❌ LoadDanhSachGiai error:', err);
        }
    });
}

/**
 * Sửa thông tin giải
 */
function EditGiai(id, code, name) {
    console.log('✏️ EditGiai - ID:', id, 'Code:', code, 'Name:', name);

    // Load dữ liệu vào form
    $('#MaGiai_Add').val(code);
    $('#TenGiai_Add').val(name);
    $('#MaGiai_Add').prop('readonly', true);
    $('#form_giai_add').data('record-id', id);

    // Ẩn nút "Lưu", hiển thị nút "Cập nhật" và "Hủy"
    $('#btn_save_giai').html('<i class="fa fa-edit"></i> Cập nhật').data('action', 'edit');
    $('#form_giai_title').text('Sửa thông tin giải');

    // Hiển thị form
    $('#form_giai_container .card').show();

    // Cuộn lên form
    $('html, body').animate({
        scrollTop: $('#form_giai_add').offset().top - 100
    }, 500);
}

/**
 * Xóa giải
 */
function DeleteGiai(id) {
    console.log('🗑️ DeleteGiai - ID:', id);

    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc muốn xóa giải này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            var data = {
                'Action': 'DELETE',
                'tab_name': 'TabDsGiai',
                'id': id
            };

            Show_loading();
            $.ajax({
                type: 'POST',
                url: '/action_dbLite/',
                data: data,
                success: function(response) {
                    Exit_Loading();
                    console.log('✅ Xóa giải thành công:', response);
                    Swal.fire('Thành công', 'Giải đã được xóa!', 'success');
                    LoadDanhSachGiai();
                },
                error: function(err) {
                    Exit_Loading();
                    console.error('❌ Lỗi xóa giải:', err);
                    Swal.fire('Lỗi', 'Không thể xóa giải', 'error');
                }
            });
        }
    });
}