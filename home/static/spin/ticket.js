//Khởi tạo tooltip
$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})
const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

function _init_ticket2() {
    html = '';
    var ticket = [{
        Ticket: 'Đặc Biệt',
        Award: 'Tủ lạnh',
        Money: '20,00,000 VNĐ',
        ImgPath: 'tivi.jpg'

    }, {
        Ticket: 'Nhất',
        Award: 'Xe máy',
        Money: '16,000,000 VNĐ',
        ImgPath: 'tivi.jpg'

    }, {
        Ticket: 'Nhì',
        Award: 'Bếp từ',
        Money: '3000,000 VNĐ',
        ImgPath: 'tivi.jpg'

    }, {
        Ticket: 'Ba',
        Award: 'Xe đạp',
        Money: '2,500,000 VNĐ',
        ImgPath: 'tivi.jpg'

    }, {
        Ticket: 'Tư',
        Award: 'Siêu nước điện',
        Money: '500,000 VNĐ',
        ImgPath: 'tivi.jpg'

    }, {
        Ticket: 'Khuyến Khích',
        Award: 'Tiền mặt',
        Money: '300,000 VNĐ',
        ImgPath: 'lixitien.jpg'

    }]
    i = 0;
    for (let t of ticket) {
        html += '<article class="glass-card" id="ticket-' + (i += 1) + '">\
        <h3 class="glass-card-title">\
            <a href="#">' + t.Ticket + ' </a>\
        </h3>\
        <div class="tags">\
            <a href="#" rel="tag">' + t.Award + '</a>\
            <a href="#" rel="tag" hidden="">tag 2</a>\
        </div>\
        <p>Trị giá giải thưởng : ' + t.Money + ' VNĐ</p>\
        <img src="../static/spin/images/' + t.ImgPath + '" alt="Sample Image">\
        <div class="author-row">\
            <a class="author-name" href="#"> Chọn giải </a>\
        </div>\
    </article>';

    }
    $('.list-award .glass-card-grid').append(html);
    $('.list-award-second .glass-card-grid').append(html);
}

//Thiết lập giá trị quay thưởng 
function setParamesLucky(item) {
    console.log(MaGiai_HienTai);
    if (SetUp_pram == 1 && MaGiai_HienTai != undefined) {
        console.log("Đã bị quay lại do đã thiết lập");
        return;
    }

    console.log("Đã thiết lập lại tham số quay thưởng cho giải : " + item['TenGiai']);
    //console.log(item);
    MaGiai_HienTai = item['MaGiai'];
    MaSanChoi_HienTai = item['MaSanChoi'];
    TongSoLuongGiai = parseInt(item['SoLuongGiai']);
    SoLanQuay_Tong = parseInt(item['SoLanQuay']);
    LanQuayThu_HienTai = parseInt(item['LanQuayThu']);
    LanQuayThu_Cu = parseInt(item['DangQuayLanThu']);
    if (LanQuayThu_Cu == 1000 || LanQuayThu_Cu > LanQuayThu_HienTai) {
        LanQuayThu_Cu = LanQuayThu_HienTai;
        console.log("Đã thay đổi giá trị lần quay thứ: " + LanQuayThu_Cu);
    } else if (LanQuayThu_Cu < LanQuayThu_HienTai) {
        DungQuay = 1;
        LanQuayThu_Cu = LanQuayThu_HienTai;
    }
    SoGiaiDaNhan_HienTai = parseInt(item['SoGiaiDaNhan']);
    SoGiaiConLai_HienTai = parseInt(item['SoGiaiConLai']) == null ? 0 : parseInt(item['SoGiaiConLai']);
    SetUp_pram = 1;

    //Lưu số lần quay vào hệ thống
    ActionSanChoi(8);
}


//Khởi tạo thẻ giải thưởng:lấy danh sách trúng và danh sách vé quay mới,Khởi tạo giao diện
function _init_ticket(res) {
    function normalizeGiftNameForDisplay(value) {
        return String(value ?? '')
            .replace(/\\r\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\n');
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function get_cardTicket(item, option, i) {
        LanQuayThu = item['LanQuayThu'];
        SoLanQuay = item['SoLanQuay'];
        if (LanQuayThu > SoLanQuay) {
            LanQuayThu = SoLanQuay;
        }
        // if (LanQuayThu == '0') { LanQuayThu = '1' }
        TrangThai = item['TrangThai'];
        active = '', fire = '';
        if (TrangThai == '1') {
            active = 'tick-up';
            fire = '<div class="fire-border"></div>';
        }
        thongtinboctham = '';
        if (option == 1) {
            thongtinboctham = '<br> [' + LanQuayThu + '/' + SoLanQuay + '] (' + item['SoGiaiDaNhan'] + '/' + item['SoLuongGiai'] + ')';
        } else if (option == 0) {
            fire = '<div class="fire-border"></div>';
        }
        TienMat = VND.format(item['GiaTien']);
        TienMat = "<span class='text-success ml-4'>SỰ MAY MẮN</span>";
        TenQuaTangHienThi = escapeHtml(normalizeGiftNameForDisplay(item['TenQuaTang']));
        return '<article class="glass-card ' + active + '" id="ticket-' + i + '" masanchoi="' + item['MaSanChoi'] + '" magiai="' + item['MaGiai'] + '">\
                    <h3 class="glass-card-title">\
                        <a href="#">' + item['TenGiai'] + thongtinboctham + '</a>\
                    </h3>\
                    <div class="tags">\
                        <a href="#" rel="tag"><pre >' + TenQuaTangHienThi + '</pre></a>\
                        <a href="#" rel="tag" hidden="">tag 2</a>\
                    </div>\
                    <p hidden>Trị giá giải thưởng :<br> ' + TienMat + ' </p>\
                    <img src="../static/spin/images/' + item['HinhAnh'] + '" alt="Sample Image">\
                    <div class="author-row">\
                        <a class="author-name" href="#"> Chọn giải </a>\
                    </div>\
                    ' + fire + '\
                </article>';
    }

    html = '';
    html2 = '';
    i = 0;
    res['data'].forEach(function(item) {
        i += 1;
        html += get_cardTicket(item, 1, i);
        html2 += get_cardTicket(item, 0, i);
        if (item['TrangThai'] == 1) {
            SetUp_pram = 0;
            setParamesLucky(item);
        }
    });

    tag = $('.list-award .glass-card-grid').empty().append(html);
    console.log("Chọn giải :" + chon_giai)
    if (chon_giai == '') { tag2 = $('.list-award-second .glass-card-grid').empty().append(html2); }

    //document.querySelector('.tick-up').click();
    tag = $('.tick-up').attr('masanchoi');
    console.log(tag);
    if (tag !== undefined) {
        chon_Giaithuong($('.tick-up'), option = 0);
        ActionGameCf(1);
        //Lấy danh sách bảng nhật ký trúng giải trước đó của sân chơi
        ActionTrungThuong(5);
        //Lấy danh sách vé chưa quay thưởng từ sân chơi và giải đang kích hoạt
        ActionEmp(9);
    }

}


//Thực hiện chọn thẻ giải thưởng
function chon_Giaithuong(el, option = 0) {
    //Nếu thẻ đang được kích hoạt rồi thì bỏ qua
    if ($(el).hasClass('tick-up') == false) {
        LanQuayThu_Cu = 1000;
    }
    if (option == 1) {
        SetUp_pram = 0;
        $('#resultTable tbody').empty();
        document.getElementById('result').textContent = 'Nhấn "Quay Số" để bắt đầu !';
        roundBoxLucky('00000');
    }
    magiai_ = $(el).attr('magiai');
    //Nếu là giải 2,3,4,5 thì quay dạng nhiều
    if (['GT003', 'GT004', 'GT005', 'GT006'].includes(magiai_)) {
        //ẩn các thuộc tính quay đơn
        $('.spin-container,.result').hide();
        $('#resultTable').show();
    }
    //là giải đặc biệt hoặc 1 thì quay giải đơn
    else {
        //ẩn các thuộc tính quay nhiều
        $('#resultTable').hide();
        $('.spin-container,.result').show();
    }

    //Thay đổi hình nền khi chọn giải
    // if (magiai_ == 'GT001') {
    //     ChangeBackgr('', 'bg_2.jpg');
    // } else if (magiai_ == 'GT002') { ChangeBackgr('', 'bg_9.jpg') } else if (magiai_ == 'GT003') { ChangeBackgr('', 'bg_8.jpg') } else if (magiai_ == 'GT004') { ChangeBackgr('', 'bg_7.jpg') } else if (magiai_ == 'GT005') { ChangeBackgr('', 'bg_3.jpg') } else if (magiai_ == 'GT006') { ChangeBackgr('', 'bg_10.jpg') }

    playAudio('mp3Spin');
    ActionSanChoi(6, el); //lưu trạng thái chọn giải chơi
    $('.list-award-three').remove();
    $('.card-tran-aminate').remove();
    $('.list-award-second .thrown').removeClass('thrown');
    id = $(el).attr('id');
    chon_giai = parseInt(id.replace('ticket-', ''));
    $('.tick-up').removeClass('tick-up');
    $('.fire-border').remove();
    $(el).addClass('tick-up').append('<div class="fire-border"></div>');
    $('.list-award-second #' + id).addClass('thrown').append('<div class="card-tran-aminate"></div><div class="fire-border"></div>');
    $('.list-award-second .thrown .author-name').text('Đang bốc thăm');

}

/////////////////////////////////////////////////////////////////////////////////////
//</script><!-- Khởi tạo và quản lý danh sách người chơi -->

// Xử lý sự kiện nhấn checkbox giải
$(document).on('click', '.modal .list-group-item', function() {
    checkid = $(this).find('.form-check-input').attr('id');
    checkbox = document.getElementById(checkid);
    checkbox.checked = !checkbox.checked; // Đổi trạng thái checkbo
});

//Thao tác nhấn vào thẻ card chọn sân ch
$(document).on('click', '#Modal_ChonSanChoi .card', function() {
    ActionDsSanChoi(4, this);
});

//Thao tác đặt vắng mặt cho người đã trúng
$(document).on('click', '.game-table .fa-eraser', function() {
    console.log("Đang vắng mặt")
    ActionTrungThuong(6, this);
});

//<!-- JS cho hiệu ứng click chuột vào thẻ giải thưởng -->
$(document).on('click', '.list-award .glass-card', function() {
    chon_Giaithuong(this, option = 1);
});


//Thao tác nhấn: chỉ áp dụng khi đổi "Chọn quà"
$(document).on('change', '.tab-sanchoi select[name^="LsQuaTang_"]', function() {
    val = $(this).find('option:selected').text();
    code = $(this).val();
    tag1 = $(this).parent().parent().find('.img-ticket-name').val(val);
    tag2 = $(this).parent().parent().find('.img-ticket-code').val(code);
    // console.log(tag1);
});

function ShowMoreTab(action) {
    if (action == 0) {
        $('.table-container').css({ 'max-height': '100%', 'background': '#0c0d19' });
    } else {
        $('.table-container').removeAttr('style');
    }
}