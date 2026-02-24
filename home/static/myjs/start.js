function changeRowColor(button) {
    const row = button.parentElement.parentElement;
    row.style.backgroundColor = row.style.backgroundColor === "lightgreen" ? "" : "lightgreen";
}

//Lấy toàn bộ ID và value của ID đưa vào object
function GET_ALL_INPUT_FROM_DIV(id_DIV) {
    var data = {}
    $("#" + id_DIV + " :input").each(function() {
        data[$(this).attr('id')] = $(this).val();
    });
    return data;
}

//Phương thức ajax xử lý dữ liệu từ server
function AJAX_REQUEST_RESPONSE(url, type, data, func) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(response) {
            func(response);
        },
        error: function(response) {
            AlertErrorSQL(response);
        }
    });
}



function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function AlertErrorSQL(response) {
    console.log(response);
}


//THông báo OK sweatAlert2
function Alert_OK() {
    alert("Lưu OK..");
}

function stopVideo() {
    video.pause(); // Dừng video
    video.currentTime = 0; // Đưa về thời điểm bắt đầu
}

function exitVideo() {
    video.pause(); // Dừng video
    video.currentTime = 0; // Đưa về thời điểm bắt đầu
    video.style.display = "none"; // Ẩn video
    document.querySelector('.controls').style.display = "none"; // Ẩn các nút điều khiển
}

//Hiển thị modal
function ShowModal() {
    $('#ModalSetting').modal('show');
}


$('.form-add').hide();
const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

tr_colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffb5a7', '#fcd5ce', '#f8edeb', '#e8e8e4', '#d8e2dc', '#ece4db', '#ffe5d9', '#ffd7ba', '#fec89a', '#ffcbf2', '#f3c4fb', '#ecbcfd', '#dee2ff', '#c4f4ff', '#b7e4c7', '#fdffa4', '#ffe699', '#fdd1c7', '#ef9a9a', '#e57373', '#ff7043', '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffb5a7', '#fcd5ce', '#f8edeb', '#e8e8e4', '#d8e2dc', '#ece4db', '#ffe5d9', '#ffd7ba', '#fec89a', '#ffcbf2', '#f3c4fb', '#ecbcfd', '#dee2ff', '#c4f4ff', '#b7e4c7', '#fdffa4', '#ffe699', '#fdd1c7', '#ef9a9a', '#e57373', '#ff7043'];
money_colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33aa', '#ffaa33', '#ff5733', '#33ff57', '#3357ff', '#ff33aa', '#ffaa33', '#ff5733', '#33ff57', '#3357ff', '#ff33aa', '#ffaa33', '#ff5733', '#33ff57', '#3357ff', '#ff33aa', '#ffaa33', '#ff5733', '#33ff57', '#3357ff', '#ff33aa', '#ffaa33', '#ff5733', '#33ff57', '#3357ff', '#ff33aa', '#ffaa33', '#ff5733', '#33ff57', '#3357ff', '#ff33aa', '#ffaa33', '#ff5733', '#33ff57', '#3357ff', '#ff33aa', '#ffaa33'];
//Lấy danh sách thông tin bảng
function load_table_ticket() {
    formdata = new FormData();
    formdata.append('Action', 'ALL');
    formdata.append('type', 'select');
    id_tab1 = '#tab_ticket';
    id_tab2 = '#tab_ticket2';
    tab1 = $(id_tab1 + ' tbody');
    tab2 = $(id_tab2 + ' tbody');
    tab1.empty();
    tab2.empty();
    $.ajax({
        type: 'POST',
        url: '/lucky/',
        data: formdata,
        contentType: false,
        processData: false,
        headers: { "X-CSRF-Token": '' },
        success: function(response) {
            //console.log(response);
            d = response['data'];
            i = 0;

            if (d.length % 2 === 0) { c = d.length / 2 } else { c = (d.length / 2) - 1; }
            tab = tab1;
            color = "";
            d.forEach(function(item) {
                if (i >= c) { tab = tab2 }
                Money = parseInt(item['Money']);
                if (Money <= 500000) { color = "#33ff57" } else if (Money <= 600000) { color = "#ff33aa" } else if (Money <= 800000) { color = "#ffaa33" }
                //console.log(Money);
                //console.log(color);
                color = '#e5ff33';
                tab.append('\
                    <tr >\
                        <td><i code="' + item['id'] + '" onclick="editTicket(this)" class="fa fa-edit fa-1x"></i></td>\
                        <td style="color:' + color + '">' + item['Ticket'] + '</td>\
                        <td style="color:' + color + '">' + VND.format(item['Money']) + '</td>\
                        <td style="color:' + color + '">' + item['Recipient'] + '</td>\
                    </tr>');
                i += 1;
            });
        },
        error: function(response) { console.log(response); }
    });
}

//Thêm thông tin
function SaveTicket(number) {
    data = GET_ALL_INPUT_FROM_DIV('form_ticket');
    console.log(data);
    Action = '', type = 'select';
    if (number == 1) {
        Action = 'INSERT';
        type = 'exec';
        if (data.Ticket == '') { return }
    } else if (number == 2) {
        Action = 'UPDATE';
        type = 'exec';
        if (data.ID == '') { return }
    } else if (number == 3) {
        Action = 'DELETE';
        type = 'exec';
        if (data.ID == '') { return }
    }

    formdata = new FormData();
    formdata.append('Action', Action);
    formdata.append('type', type);

    // Kết hợp object vào đối tượng FormData
    for (const [key, value] of Object.entries(data)) {
        formdata.append(key, value);
    }

    $.ajax({
        type: 'POST',
        url: '/lucky/',
        data: formdata,
        contentType: false,
        processData: false,
        headers: { "X-CSRF-Token": '' },
        success: function(response) {
            console.log(response);
            $('.form-add').hide();
            load_table_ticket();
        },
        error: function(response) { console.log(response); }
    });
}

//Thêm thông tin
function editTicket(el, number) {
    formdata = new FormData();
    formdata.append('Action', 'SELECT');
    formdata.append('type', 'select');
    formdata.append('id', $(el).attr('code'));

    $.ajax({
        type: 'POST',
        url: '/lucky/',
        data: formdata,
        contentType: false,
        processData: false,
        headers: { "X-CSRF-Token": '' },
        success: function(response) {
            console.log(response);
            d = response['data'];
            d.forEach(function(item) {
                for (let i in item) {
                    $('.form-add #' + i).val(item[i]);
                    //console.log(i)
                }
            });
            $('.btn-add').hide();
            $('.btn-save,.btn-del,.form-add').show();
        },
        error: function(response) { console.log(response); }
    });
}


var app = new Vue({
    el: '#OtherID',
    delimiters: ['[[', ']]'],
    data: {
        Flag: "",
        Control: {
            ConfName: "1",
            LogoLeft: "Foxconn.png",
            LogoRight: "Tet.png",
            Header: 1,
            VideoShow: "",
            SrcVideoShow: "",
            BgColorHeader: "yearlow_1",
            TextHeader1: "IT TỔNG BỘ VIỆT NAM ",
            TextHeader2: "越南資訊",
            TextHeader3: "TẾT SUM VẦY - GẮN KẾT YÊU THƯƠNG",
            BgMain: "bg_tet_0.jpg",
            BgMainMgTop: 0,
            BgMainMgLeft: 0,
            BgMainWidth: 100,
            BgMainHeight: 100,

            TabLucky: "0",

            LeafEffect_1: false,
            LeafEffect_2: false,
            LeafEffect_3: false,
            LeafEffect_4: false,
            FireWorkEffect_1: false,
            FireWorkEffect_2: false,
            FireWorkEffect_3: false,
            FireWorkEffect_4: false,
            FireWorkEffect_5: false,
            FireWorkEffect_6: false,
            FireWorkEffect_7: false,
        },
        F_LeafEffect_1: null,
        F_LeafEffect_2: null,
        F_LeafEffect_3: null,
        F_LeafEffect_4: null,
        F_LeafEffect_5: null,
        F_LeafEffect_6: null,
        F_LeafEffect_7: null,


    },
    mounted() {
        vm = this;
        //vm.GetVideos();
        $(document).ready(function() {

            $('.btn-control a i').mousedown(function() {
                step = 1;
                step1 = 1;
                tag = this;
                var code = $(tag).attr('code');
                var num = $(tag).attr('num');
                //  console.log(code);
                // Khi nhấn chuột  
                intv = setInterval(function() {
                    if (num == '-') { step1 = step * -1 } else { step1 = step * 1 }
                    console.log(step1)
                    vm.MoveBgMain(code, step1);
                }, 10);

            }).mouseup(function() {
                // Khi thả chuột  
                clearInterval(intv)
            });

        });
        load_table_ticket();
        $('.video-main,#TabLucky').removeAttr('hidden');

    },
    created: function() {
        var vm = this;

        vm.ApplyEffect(1);

        //Nạp thông tin
        $.ajaxSetup({
            async: false
        });
        //get info config
        vm.ApplyEffect(3);

    },
    methods: {

        ChangeLogoLeft: function() {
            if (this.Control.Logo == "") {
                $('.img-logo').attr("src", "");
            } else {
                $('.img-logo').attr("src", "/static/img/icon/left/" + this.Control.LogoLeft);
            }
        },
        ChangeLogoRight: function() {
            if (this.Control.LogoRight == "") {
                $('.img-tet').attr("src", "");
            } else {
                $('.img-tet').attr("src", "/static/img/icon/right/" + this.Control.LogoRight);
            }
        },
        ChangeBgMain: function() {
            BgMain = "url(/static/img/bg_tet/" + this.Control.BgMain + ")";
            BgMain = "/static/img/bg_tet/" + this.Control.BgMain;

            if (this.Control.BgMain == "") {
                $('.background-main').removeAttr('src')
            } else {
                $('.background-main').attr("src", BgMain)
            }
            console.log("Đã đổi hình nền: " + BgMain);
        },
        ResizeBgMain: function() {
            t = vm.Control.BgMainMgTop;
            l = vm.Control.BgMainMgLeft;

            w = vm.Control.BgMainWidth;
            h = vm.Control.BgMainHeight;

            //console.log(w);
            $('.background-main').css({ 'margin-top': String(t) + "px", 'margin-left': String(l) + "px", "width": String(w) + "%", "height": String(h) + "%" });
        },

        ChangeTextHeader: function() {
            $('.header-text-first')
                .text(this.Control.TextHeader1);
            $('.header-text-second')
                .text(this.Control.TextHeader2);
            $('.header-text-third')
                .text(this.Control.TextHeader3);
        },
        SetShowVideo: function() {
            this.SrcVideoShow = "/static/video/" + this.Control.VideoShow;
            console.log("Đổi src video: " + this.SrcVideoShow);
            const tagVideo = $('.video-main video');
            tagVideo.attr('src', this.SrcVideoShow);
            tagVideo.prop('muted', true);
            tagVideo.prop('defaultMuted', true);
            tagVideo.prop('volume', 0);
            tagVideo.removeAttr('controls');
        },

        ApplyEffect: function(action) {
            vm = this;

            //Luu thông thin
            if (action == 2) {
                var dt = vm.Control;

                //dt = GET_ALL_INPUT_FROM_DIV('div_conf');
                dt.ConfVal = $('#ConfName option:selected').text();
                //console.log(dt);
                AJAX_REQUEST_RESPONSE('/save_conf/', 'GET', dt, func);
            }
            //Nạp lại thông tin cấu hình
            else if (action == 3) {
                var dt = vm.Control;
                dt.ConfName = $('#ConfName').val();
                AJAX_REQUEST_RESPONSE('/load_conf/', 'GET', dt, func);

                function func(res) {

                    d = res['data'];

                    // Load videos
                    $('.video-setting,#VideoShow').empty();
                    $('#VideoShow').append('<option value="">Không hiển thị</option>')
                    d['ls_vi'].forEach(el => {
                        $('#VideoShow').append('<option value="' + el + '">' + el + '</option>');
                        // $('.video-setting').append('<div class="col-xl-2 col-lg-3 col-md-4">\
                        //     <div class="card" style="max-width: 18rem;">\
                        //         <video src="/static/video/' + el + '" class="card-img-top" controls muted autoplay1 loop></video>\
                        //         <div class="card-body">\
                        //             <h5 class="card-title" hidden></h5>\
                        //             <p class="card-text" >' + el + '</p>\
                        //             <a href="#" class="btn btn-primary" hidden></a>\
                        //         </div>\
                        //     </div>\
                        // </div>');
                    });


                    // Load list config
                    $('#ConfName').empty();
                    $('#ConfName').append('<option value="">Không sử dụng</option>');
                    d['ls_confs'].forEach(el => {
                        $('#ConfName').append("<option value='" + el['cfgname'] + "'>" + el['cfg']['ConfVal'] + "</option>");
                    });

                    // Load background
                    $('#BgMain').empty();
                    $('#BgMain').append('<option value="">Không sử dụng</option>');
                    d['ls_bg'].forEach(el => {
                        $('#BgMain').append("<option value='" + el + "'>" + el + "</option>");
                    });

                    // Load logo left
                    $('#LogoLeft').empty();
                    $('#LogoLeft').append('<option value="">Không sử dụng</option>');
                    d['ls_logo'].forEach(el => {
                        $('#LogoLeft').append("<option value='" + el + "'>" + el + "</option>");
                    });

                    // Load logo right
                    $('#LogoRight').empty();
                    $('#LogoRight').append('<option value="">Không sử dụng</option>');
                    d['ls_logo2'].forEach(el => {
                        $('#LogoRight').append("<option value='" + el + "'>" + el + "</option>");
                    });

                    //Màu của tiêu đề nền
                    $('#BgColorHeader').empty();
                    $('#BgColorHeader').append('<option value="">Không sử dụng</option>');
                    d['ls_color'].forEach(el => {
                        $('#BgColorHeader').append("<option value='" + el['class'] + "'>" + el['name'] + "</option>");
                    });

                    //nạp thông tin hiện cấu hình
                    d['conf'].forEach(el => {
                        //console.log(el)
                        document.title = el['ConfVal'];
                        vm.Control.LogoLeft = el['LogoLeft'];
                        vm.Control.LogoRight = el['LogoRight'];
                        vm.Control.Header = el['Header'];
                        vm.Control.VideoShow = el['VideoShow'];
                        vm.Control.BgColorHeader = el['BgColorHeader'];
                        vm.Control.TextHeader1 = el['TextHeader1'];
                        vm.Control.TextHeader2 = el['TextHeader2'];
                        vm.Control.TextHeader3 = el['TextHeader3'];
                        vm.Control.BgMain = el['BgMain'];
                        vm.Control.BgMainMgTop = el['BgMainMgTop'];
                        vm.Control.BgMainMgLeft = el['BgMainMgLeft'];
                        vm.Control.TabLucky = el['TabLucky'];
                        vm.Control.LeafEffect_1 = el['LeafEffect_1'];
                        vm.Control.LeafEffect_2 = el['LeafEffect_2'];
                        vm.Control.LeafEffect_3 = el['LeafEffect_3'];
                        vm.Control.FireWorkEffect_1 = el['FireWorkEffect_1'];
                        vm.Control.FireWorkEffect_2 = el['FireWorkEffect_2'];
                        vm.Control.FireWorkEffect_3 = el['FireWorkEffect_3'];
                        vm.Control.FireWorkEffect_4 = el['FireWorkEffect_4'];
                        vm.Control.FireWorkEffect_5 = el['FireWorkEffect_5'];
                        vm.Control.FireWorkEffect_6 = el['FireWorkEffect_6'];
                        vm.Control.FireWorkEffect_7 = el['FireWorkEffect_7'];
                    });
                    vm.Control.ConfName = d['ConfName'];
                    init_();
                }

            }
            //Nạp lại hiệu ứng
            else if (action == 4) {
                console.log("OK");
                if (vm.Control.LeafEffect_1 == true) { $('#LeafEffect_1').removeAttr('style') } else { $('#LeafEffect_1').hide() }
                if (vm.Control.LeafEffect_2 == true) { $('#LeafEffect_2').removeAttr('style') } else { $('#LeafEffect_2').hide() }
                if (vm.Control.LeafEffect_3 == true) { $('#LeafEffect_3').removeAttr('style') } else { $('#LeafEffect_3').hide() }
                if (vm.Control.LeafEffect_4 == true) { $('#LeafEffect_4').removeAttr('style') } else { $('#LeafEffect_4').hide() }
                if (vm.Control.FireWorkEffect_1 == true) {
                    $('#FireWorkEffect_1').removeAttr('style');
                    vm.F_LeafEffect_1 = FireWorkEffect_1()
                } else {
                    $('#FireWorkEffect_1').hide();
                    vm.F_LeafEffect_1 = null
                }
                if (vm.Control.FireWorkEffect_2 == true) {
                    $('#FireWorkEffect_2').removeAttr('style');
                    vm.F_LeafEffect_1 = FireWorkEffect_2()
                } else {
                    $('#FireWorkEffect_2').hide();
                    vm.F_LeafEffect_2 = null
                }
                if (vm.Control.FireWorkEffect_3 == true) {
                    $('#FireWorkEffect_3').removeAttr('style');
                    vm.F_LeafEffect_1 = FireWorkEffect_3()
                } else {
                    $('#FireWorkEffect_3').hide();
                    vm.F_LeafEffect_3 = null
                }
                if (vm.Control.FireWorkEffect_4 == true) {
                    $('#FireWorkEffect_4').removeAttr('style');
                    vm.F_LeafEffect_1 = FireWorkEffect_4()
                } else {
                    $('#FireWorkEffect_4').hide();
                    vm.F_LeafEffect_4 = null
                }
                if (vm.Control.FireWorkEffect_5 == true) {
                    $('#FireWorkEffect_5').removeAttr('style');
                    vm.F_LeafEffect_1 = FireWorkEffect_5()
                } else {
                    $('#FireWorkEffect_5').hide();
                    vm.F_LeafEffect_5 = null
                }
                if (vm.Control.FireWorkEffect_6 == true) {
                    $('#FireWorkEffect_6').removeAttr('style');
                    vm.F_LeafEffect_1 = FireWorkEffect_6()
                } else {
                    $('#FireWorkEffect_6').hide();
                    vm.F_LeafEffect_6 = null
                }
                if (vm.Control.FireWorkEffect_7 == true) {
                    $('#FireWorkEffect_7').removeAttr('style');
                    vm.F_LeafEffect_1 = FireWorkEffect_7()
                } else {
                    $('#FireWorkEffect_7').hide();
                    vm.F_LeafEffect_7 = null
                }

            }

            function init_() {
                vm.ChangeLogoLeft();
                vm.ChangeLogoRight();
                //this.ChangeTextHeader();
                vm.ChangeBgMain();
                vm.ResizeBgMain();
                vm.ApplyEffect(4);
                vm.SetShowVideo();

            }

        },
        MoveBgMain: function(action, index) {
            vm = this;

            //  = "";
            if (action == 'top') {
                vm.Control.BgMainMgTop += index;

            } else if (action == 'left') {
                vm.Control.BgMainMgLeft += index;
            } else if (action == 'zoom-in') {
                vm.Control.BgMainWidth += 0.02;
                vm.Control.BgMainHeight += 0.02;
            } else if (action == 'zoom-out') {
                vm.Control.BgMainWidth -= 0.02;
                vm.Control.BgMainHeight -= 0.02;
            }
            vm.ResizeBgMain();
        },

    }
});


$(function() {
    Move_modal('ModalSetting');
});