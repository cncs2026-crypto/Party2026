/**
 * ========================================
 * Hàm quản lý Sân Chơi (Game/Tournament)
 * ========================================
 */

// ========== DANH SÁCH SÂN CHƠI ==========
/**
 * Thao tác với danh sách sân chơi
 * @param action - 1: SAVE, 2: DELETE, 3: LOAD, 4: EDIT
 *                 10: DELETE (from table row), 30: EDIT (from table row)
 * @param el - Element that triggered the action (for extracting ID from code attribute)
 */
function ActionDsSanChoi(action, el) {
    console.log('🎯 ActionDsSanChoi(action=' + action + ', el=' + (el ? 'provided' : 'undefined') + ')');

    var data = GET_ALL_INPUT_FROM_DIV('form_dsSanChoi');
    console.log('📋 Form data:', data);

    // Handle actions 10 (DELETE) and 30 (EDIT) from table rows
    if (action == 10 || action == 30) {
        if (el && el.hasAttribute && el.hasAttribute('code')) {
            data.id = el.getAttribute('code');
            console.log('🔑 ID extracted from code attribute:', data.id);
        }
    }

    switch (action) {
        case 1: // SAVE - Lưu sân chơi mới
            if (data.TenSanChoi.trim() == '') {
                Swal.fire('Cảnh báo', 'Vui lòng nhập tên sân chơi', 'warning');
                return;
            }
            console.log('💾 Lưu sân chơi mới:', data);
            data.Action = 'SAVE';
            data.tab_name = 'TabDsSanChoi';
            console.log('📤 Sending data with Action:', data.Action);
            SendDataToDB(data, '/action_dbLite/');
            break;

        case 2: // DELETE - Xóa sân chơi (from form button)
            if (data.id == '') {
                Swal.fire('Cảnh báo', 'Vui lòng chọn sân chơi để xóa', 'warning');
                return;
            }
            console.log('🗑️ Xóa sân chơi:', data.id);
            data.Action = 'DELETE';
            data.tab_name = 'TabDsSanChoi';
            console.log('📤 Sending data with Action:', data.Action);
            SendDataToDB(data, '/action_dbLite/');
            break;

        case 3: // LOAD - Tải danh sách sân chơi
            console.log('🔄 Tải danh sách sân chơi');
            data.Action = 'ALL';
            data.tab_name = 'TabDsSanChoi';
            console.log('📤 Sending data with Action:', data.Action);
            LoadDsSanChoi(data);
            break;

        case 4: // EDIT - Chỉnh sửa (from form button)
            if (data.id == '') {
                Swal.fire('Cảnh báo', 'Vui lòng chọn sân chơi để chỉnh sửa', 'warning');
                return;
            }
            console.log('✏️ Chỉnh sửa sân chơi:', data.id);
            data.Action = 'EDIT';
            data.tab_name = 'TabDsSanChoi';
            console.log('📤 Sending data with Action:', data.Action);
            SendDataToDB(data, '/action_dbLite/');
            break;

        case 10: // DELETE - Xóa sân chơi (from table row icon)
            if (!data.id) {
                Swal.fire('Lỗi', 'Không thể xác định sân chơi cần xóa', 'error');
                return;
            }
            Swal.fire({
                title: 'Xác nhận xóa',
                text: 'Bạn có chắc muốn xóa sân chơi này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('🗑️ Xóa sân chơi (from row):', data.id);
                    data.Action = 'DELETE';
                    data.tab_name = 'TabDsSanChoi';
                    console.log('📤 Sending data with Action:', data.Action);
                    SendDataToDB(data, '/action_dbLite/');
                }
            });
            break;

        case 30: // EDIT - Chỉnh sửa (from table row icon)
            if (!data.id) {
                Swal.fire('Lỗi', 'Không thể xác định sân chơi cần chỉnh sửa', 'error');
                return;
            }
            console.log('✏️ Chỉnh sửa sân chơi (from row):', data.id);
            data.Action = 'EDIT';
            data.tab_name = 'TabDsSanChoi';
            console.log('📤 Sending data with Action:', data.Action);
            SendDataToDB(data, '/action_dbLite/');
            break;

        default:
            console.warn('⚠️ Action không hợp lệ:', action);
            return;
    }
}

/**
 * Tải danh sách sân chơi
 */
function LoadDsSanChoi(data) {
    console.log('🔄 LoadDsSanChoi được gọi với data:', data);
    Show_loading();

    var formData = new FormData();

    // Thêm CSRF token
    var el = document.querySelector('[name=csrfmiddlewaretoken]');
    var csrftoken = el ? el.value : '';
    if (csrftoken) {
        formData.append('csrfmiddlewaretoken', csrftoken);
    }

    // Thêm dữ liệu
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }

    // DEBUG: Log FormData entries
    console.log('📤 LoadDsSanChoi - FormData entries:');
    for (var pair of formData.entries()) {
        console.log('   ' + pair[0] + ': ' + pair[1]);
    }

    console.log('📤 Gửi POST request tới /action_dbLite/ với action=ALL, tab_name=TabDsSanChoi');

    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            Exit_Loading();
            console.log('✅ Response nhận được:', response);

            if (response.data && response.data.length > 0) {
                console.log('📊 Số lượng sân chơi:', response.data.length);

                // Cập nhật tất cả select với name="MaSanChoi" hoặc id="MaSanChoi"
                $('select[name="MaSanChoi"], #MaSanChoi').each(function() {
                    console.log('🎯 Cập nhật select:', $(this).attr('id'));
                    $(this).empty().append('<option value="">-- Chọn sân chơi --</option>');

                    response.data.forEach(function(item) {
                        $(this).append(`<option value="${item.MaSanChoi}">${item.TenSanChoi}</option>`);
                    }.bind(this));
                });

                // Cập nhật bảng danh sách
                $('#Tab_DsSanChoi tbody').empty();

                var i = 1;
                response.data.forEach(function(item) {
                    $('#Tab_DsSanChoi tbody').append(`
                        <tr>
                            <td>${i}</td>
                            <td>${item.MaSanChoi}</td>
                            <td>${item.TenSanChoi}</td>
                            <td>
                                <i class="fa fa-edit fa-1x" onclick="EditDsSanChoi('${item.id}')" title="Chỉnh sửa" style="cursor:pointer;margin-right:10px;"></i>
                                <i class="fa fa-trash fa-1x" onclick="DeleteDsSanChoi('${item.id}')" title="Xóa" style="cursor:pointer;color:red;"></i>
                            </td>
                        </tr>
                    `);
                    i++;
                });

                console.log('✓ Danh sách sân chơi đã được load thành công');
            } else {
                console.log('⚠️ Không có dữ liệu sân chơi');
                Swal.fire('Thông báo', 'Chưa có sân chơi nào được tạo', 'info');
            }
        },
        error: function(xhr, status, error) {
            Exit_Loading();
            console.error('❌ Lỗi:', error);
            console.error('Status:', xhr.status);
            console.error('Response:', xhr.responseText);
            Swal.fire('Lỗi', 'Không thể tải danh sách sân chơi. Lỗi: ' + error, 'error');
        }
    });
}

/**
 * Chỉnh sửa thông tin sân chơi
 */
function EditDsSanChoi(id) {
    var formData = new FormData();

    // Lấy CSRF token
    var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    formData.append('Action', 'EDIT');
    formData.append('tab_name', 'TabDsSanChoi');
    formData.append('id', id);
    formData.append('csrfmiddlewaretoken', csrftoken);

    // DEBUG: Log FormData content
    console.log('📋 EditDsSanChoi - FormData entries:');
    for (var pair of formData.entries()) {
        console.log('   ' + pair[0] + ': ' + pair[1]);
    }

    Show_loading();
    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            Exit_Loading();
            console.log('🔄 EditDsSanChoi response:', response);

            if (response.data && response.data.length > 0) {
                var item = response.data[0];
                $('#MaSanChoi').val(item.MaSanChoi);
                $('#TenSanChoi').val(item.TenSanChoi);
                $('#form_dsSanChoi input[name="id"]').val(item.id);
                console.log('✅ EditDsSanChoi: Dữ liệu được load:', item);
            } else {
                console.error('❌ EditDsSanChoi: Không nhận được dữ liệu');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            Exit_Loading();
            console.error('❌ EditDsSanChoi Error:', textStatus, errorThrown);
            alert('Lỗi: ' + errorThrown);
        }
    });
}

/**
 * Xóa sân chơi
 */
function DeleteDsSanChoi(id) {
    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa sân chơi này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            var data = {
                'Action': 'DELETE',
                'tab_name': 'TabDsSanChoi',
                'id': id
            };

            Show_loading();
            SendDataToDB(data, '/action_dbLite/');
        }
    });
}

// ========== CẤU HÌNH SÂN CHƠI ==========
/**
 * Thao tác cấu hình sân chơi
 * @param action - 1: SAVE, 2: LOAD, 3: GET_INFO
 */
function ActionSanChoi(action) {
    var data = GET_ALL_INPUT_FROM_DIV('form_sanchoi');

    switch (action) {
        case 1: // SAVE - Lưu cấu hình
            if (data.MaSanChoi.trim() == '') {
                Swal.fire('Cảnh báo', 'Vui lòng chọn sân chơi', 'warning');
                return;
            }
            data.Action = 'SAVE';
            break;
        case 2: // LOAD - Tải danh sách giải
            if (data.MaSanChoi.trim() == '') {
                Swal.fire('Cảnh báo', 'Vui lòng chọn sân chơi trước', 'warning');
                return;
            }
            LoadDsMaGiai(data.MaSanChoi);
            return;
        case 3: // GET_INFO - Lấy thông tin giải thưởng
            if (data.MaSanChoi.trim() == '') {
                Swal.fire('Cảnh báo', 'Vui lòng chọn sân chơi', 'warning');
                return;
            }
            LoadThongTinSanChoi(data.MaSanChoi);
            return;
        default:
            return;
    }

    data.tab_name = 'TabSanChoi';
    SendDataToDB(data, '/action_dbLite/');
}

/**
 * Tải danh sách mã giải cho sân chơi
 */
function LoadDsMaGiai(maSanChoi) {
    Show_loading();

    var data = {
        'Action': 'ALL',
        'tab_name': 'TabGiaiThuong'
    };

    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
        Exit_Loading();

        if (response.data && response.data.length > 0) {
            var html = '';
            response.data.forEach(function(item) {
                html += `
                    <li class="list-group-item">
                        <input class="form-check-input me-1" type="checkbox" 
                               id="GT_${item.id}" 
                               name="GT_${item.MaQuaTang}"
                               value="${item.MaQuaTang}">
                        <label class="form-check-label" for="GT_${item.id}">
                            ${item.TenQuaTang}
                        </label>
                    </li>
                `;
            });

            $('#DsMaGiai').html(html);
        }
    });
}

/**
 * Tải thông tin sân chơi
 */
function LoadThongTinSanChoi(maSanChoi) {
    Show_loading();

    var data = {
        'Action': 'VIEWCF',
        'tab_name': 'TabSanChoi',
        'MaSanChoi': maSanChoi
    };

    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
        Exit_Loading();

        if (response.data && response.data.length > 0) {
            var tbody = $('#Tab_DsSanChoi tbody');
            tbody.empty();

            var i = 1;
            response.data.forEach(function(item) {
                tbody.append(`
                    <tr>
                        <td>${i}</td>
                        <td>${item.TenQuaTang}</td>
                        <td>${item.GiaTien}</td>
                        <td><img src="/static/img/gifts/${item.HinhAnh}" style="width:50px;height:50px;"></td>
                    </tr>
                `);
                i++;
            });
        }
    });
}

// ========== QUẢN LÝ NGƯỜI CHƠI ==========
/**
 * Thao tác với người chơi
 * @param action - 1: ADD_EMP, 2: DELETE, 3: SELECT, 8: LOAD_LIST
 */
function ActionEmp(action) {
    var data = GET_ALL_INPUT_FROM_DIV('form_emp');

    switch (action) {
        case 1: // ADD - Thêm người chơi
            if (data.MaSanChoi.trim() == '') {
                Swal.fire('Cảnh báo', 'Vui lòng chọn sân chơi', 'warning');
                return;
            }
            if (data.MaNhanVien.trim() == '') {
                Swal.fire('Cảnh báo', 'Vui lòng nhập mã nhân viên', 'warning');
                return;
            }
            data.Action = 'ADD_EMP';
            break;
        case 2: // DELETE
            data.Action = 'DELETE';
            break;
        case 3: // SELECT
            data.Action = 'SELECT';
            break;
        case 8: // LOAD_LIST - Tải danh sách
            LoadListEmp(data.MaSanChoi);
            return;
        default:
            return;
    }

    data.tab_name = 'TabNguoiChoi';
    SendDataToDB(data, '/action_dbLite/');
}

/**
 * Tải danh sách người chơi
 */
function LoadListEmp(maSanChoi) {
    Show_loading();

    var data = {
        'Action': 'ALL',
        'tab_name': 'TabNguoiChoi',
        'MaSanChoi': maSanChoi
    };

    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
        Exit_Loading();

        if (response.data && response.data.length > 0) {
            var tbody = $('table tbody').not('#Tab_DsSanChoi tbody');
            tbody.empty();

            var i = 1;
            response.data.forEach(function(item) {
                tbody.append(`
                    <tr>
                        <td>${i}</td>
                        <td>${item.MaNhanVien}</td>
                        <td>${item.TenNhanVien}</td>
                        <td>${item.VangMat == 0 ? 'Có mặt' : 'Vắng mặt'}</td>
                        <td>
                            <i class="fa fa-trash fa-1x" onclick="DeleteEmp('${item.id}')" 
                               title="Xóa" style="cursor:pointer;color:red;"></i>
                        </td>
                    </tr>
                `);
                i++;
            });
        }
    });
}

/**
 * Xóa người chơi
 */
function DeleteEmp(id) {
    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa người chơi này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            var data = {
                'Action': 'DELETE',
                'tab_name': 'TabNguoiChoi',
                'id': id
            };

            SendDataToDB(data, '/action_dbLite/');
        }
    });
}

// ========== HÀM HỖ TRỢ ==========
/**
 * Gửi dữ liệu lên database
 */
function SendDataToDB(data, url) {
    Show_loading();

    var formData = new FormData();

    // Thêm CSRF token
    var el = document.querySelector('[name=csrfmiddlewaretoken]');
    var csrftoken = el ? el.value : '';
    if (csrftoken) {
        formData.append('csrfmiddlewaretoken', csrftoken);
    }

    // Thêm dữ liệu
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }

    // DEBUG: Log FormData entries
    console.log('📤 SendDataToDB - FormData entries:');
    for (var pair of formData.entries()) {
        console.log('   ' + pair[0] + ': ' + pair[1]);
    }

    console.log('📤 Gửi request tới:', url);
    console.log('📋 Original data:', data);

    $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            Exit_Loading();
            console.log('📥 Response:', response);

            if (response.error) {
                Swal.fire('Lỗi', response.error, 'error');
            } else if (response.data) {
                Swal.fire('Thành công', 'Lưu thành công!', 'success');
                // Reload danh sách
                if (url.includes('action_dbLite')) {
                    setTimeout(() => {
                        ActionDsSanChoi(3);
                    }, 800);
                }
            }
        },
        error: function(xhr, status, error) {
            Exit_Loading();
            console.error('❌ Lỗi:', error);
            Swal.fire('Lỗi', 'Có lỗi xảy ra: ' + error, 'error');
        }
    });
}

/**
 * Hiển thị Modal chọn sân chơi
 */
function ShowModalChonSanChoi() {
    var data = {
        'Action': 'ALL',
        'tab_name': 'TabDsSanChoi'
    };

    Show_loading();
    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
        Exit_Loading();

        if (response.data && response.data.length > 0) {
            var cardList = '#cardList';
            $(cardList).empty();

            response.data.forEach(function(item) {
                $(cardList).append(`
                    <div class="card" onclick="SelectSanChoi('${item.MaSanChoi}', '${item.TenSanChoi}')">
                        <pre>${item.TenSanChoi}</pre>
                    </div>
                `);
            });
        }

        $('#Modal_ChonSanChoi').modal('show');
    });
}

/**
 * Chọn sân chơi
 */
function SelectSanChoi(maSanChoi, tenSanChoi) {
    $('#MaSanChoi').val(maSanChoi);
    $('#TenSanChoi').text(tenSanChoi);
    $('#Modal_ChonSanChoi').modal('hide');

    // Tải thông tin sân chơi
    ActionSanChoi(3);
}

// ========== KHỞI TẠO KHI TRANG LOAD ==========
/**
 * Khởi tạo các modal - gọi khi trang load
 */
$(document).ready(function() {
    console.log('🚀 Document ready - Khởi tạo các modal');

    // Khởi tạo các select dropdown
    InitializeModals();

    // Event khi mở Modal_DsSanChoi - QUAN TRỌNG
    $('#Modal_DsSanChoi').on('show.bs.modal', function(e) {
        console.log('📂 Event: Modal_DsSanChoi show.bs.modal được kích hoạt');

        var data = {
            'Action': 'ALL',
            'tab_name': 'TabDsSanChoi'
        };
        LoadDsSanChoi(data);
    });

    // Event khi mở Modal_SanChoi
    $('#Modal_SanChoi').on('show.bs.modal', function(e) {
        console.log('⚙️ Event: Modal_SanChoi show.bs.modal được kích hoạt');
        setTimeout(function() {
            var data = {
                'Action': 'ALL',
                'tab_name': 'TabDsSanChoi'
            };
            AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
                console.log('📥 Cấu hình sân chơi response:', response);
                if (response.data && response.data.length > 0) {
                    LoadSanChoiSelects(response.data);
                }
            });
        }, 200);
    });

    // Event khi mở Modal_NguoiChoi
    $('#Modal_NguoiChoi').on('show.bs.modal', function(e) {
        console.log('👥 Event: Modal_NguoiChoi show.bs.modal được kích hoạt');
        setTimeout(function() {
            var data = {
                'Action': 'ALL',
                'tab_name': 'TabDsSanChoi'
            };
            AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
                console.log('📥 Người chơi sân chơi response:', response);
                if (response.data && response.data.length > 0) {
                    LoadSanChoiSelects(response.data);
                }
            });
        }, 200);
    });
});

/**
 * Khởi tạo các modal
 */
function InitializeModals() {
    console.log('🔧 InitializeModals() được gọi');

    // Tải danh sách sân chơi cho Modal_DsSanChoi
    setTimeout(function() {
        console.log('⏳ Sau 2s - Gọi LoadDsSanChoi lần đầu');
        var data = {
            'Action': 'ALL',
            'tab_name': 'TabDsSanChoi'
        };

        LoadDsSanChoi(data);
    }, 2000); // Chờ 2 giây để JS khác tải xong
}

/**
 * Load sân chơi vào tất cả các select
 */
function LoadSanChoiSelects(dataSanChoi) {
    // Xóa các option cũ (giữ lại option đầu tiên)
    $('select[name="MaSanChoi"]').each(function() {
        var firstOption = $(this).find('option:first');
        $(this).html(firstOption);

        // Thêm các option mới
        dataSanChoi.forEach(function(item) {
            $(this).append(`<option value="${item.MaSanChoi}">${item.TenSanChoi}</option>`);
        }.bind(this));
    });

    console.log('✓ Đã load danh sách sân chơi vào select');
}

// ========== QUẢN LÝ PHẦN QUÀ ==========
/**
 * Quản lý giải thưởng/phần quà
 * @param action - 0: LOAD, 1: SAVE, 2: DELETE, 3: SAVE_IMAGE
 */
function ActionGiaiThuong(action, el) {
    console.log('🎁 ActionGiaiThuong(action=' + action + ')');

    var action_type = '';
    var form_id = 'form_giaithuong';
    var data = GET_ALL_INPUT_FROM_DIV(form_id);

    if (action == 0) { // LOAD - Tải danh sách giải thưởng
        action_type = 'ALL';
    } else if (action == 1) { // SAVE - Lưu thông tin giải thưởng
        if (data.TenGiaiThuong.trim() == '') {
            Swal.fire('Cảnh báo', 'Vui lòng nhập tên phần quà', 'warning');
            return;
        }
        action_type = 'SAVE';
    } else if (action == 2) { // DELETE - Xóa giải thưởng
        action_type = 'DELETE';
    } else if (action == 3) { // SAVE_IMAGE - Lưu ảnh cho phần quà
        return SaveGiftImage(el);
    }

    data.Action = action_type;
    data.tab_name = 'TabGiaiThuong';

    console.log('📤 Sending data:', data);

    Show_loading();
    AJAX_REQUEST_RESPONSE('/action_dbLite/', 'POST', data, function(response) {
        Exit_Loading();
        console.log('📥 Response:', response);

        if (action == 0) { // LOAD
            var tbody = $('#Modal_GiaiThuong tbody');
            tbody.empty();

            if (response.data && response.data.length > 0) {
                var i = 1;
                response.data.forEach(function(item) {
                    tbody.append(`
                        <tr>
                            <td>${i}</td>
                            <td>${item.MaQuaTang}</td>
                            <td>${item.TenQuaTang}</td>
                            <td><img class="card-img-ticket" width="70" src="/static/spin/images/${item.HinhAnh}?v=1"></td>
                            <td>
                                <div style="position:relative;">
                                    <input type="file" class="form-control gift-image-input" 
                                           data-gift-id="${item.id}" 
                                           data-gift-code="${item.MaQuaTang}"
                                           accept=".jpg,.png,.jpeg">
                                    <button type="button" class="btn btn-primary" 
                                            style="position:absolute;top:0;right:0" 
                                            onclick="ActionGiaiThuong(3,this)">
                                        <i class="fa fa-save"></i>Lưu
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `);
                    i++;
                });
            } else {
                Swal.fire('Thông báo', 'Chưa có phần quà nào', 'info');
            }
        } else if (action == 1) { // SAVE
            Swal.fire('Thành công', 'Lưu phần quà thành công!', 'success');
            setTimeout(() => {
                ActionGiaiThuong(0);
            }, 1000);
        } else if (action == 2) { // DELETE
            Swal.fire('Thành công', 'Xóa phần quà thành công!', 'success');
            ActionGiaiThuong(0);
        }
    });
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
    var el = document.querySelector('[name=csrfmiddlewaretoken]');
    var csrftoken = el ? el.value : '';
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