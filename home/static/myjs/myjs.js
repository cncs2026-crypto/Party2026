//Local variable
var FormName = '';
var urlstatic_JS = '/static/';
var urlimg = '/static/Images/blank.JPG';
var urlimg2 = '/static/media/';
var mydate = new Date;

var option_appro = '<option  selected="selected" value=""></option>\
                    <option value="課級主管審核" data-i18n="Manager1" selected="selected">Chủ quản phòng</option>\
                    <option value="部級主管審核" data-i18n="Manager2" selected="selected">Chủ quản bộ phận</option>\
                    <option value="處級主管審核" data-i18n="Manager3">Xưởng trưởng</option>\
                    <option value="BU HEADER" data-i18n="Manager4" hidden>Chủ quản cấp cao/BU Header</option>\
                    <option value="BG HEADER" data-i18n="Manager6" hidden>Chủ quản cấp cao/BG Header</option>\
                    <option value="使用單位審核" data-i18n="Manager7">使用單位審核</option>\
                    <option value="主管核准" data-i18n="Manager8">最高主管核准</option>\
                    <option value="BU IT 主管審核" data-i18n="Manager10">BU IT 主管審核</option>\
                    <option value="BU IT 審核" data-i18n="Manager11">BU IT 審核</option>\
                    <option value="經管簽核" data-i18n="COST-manager">Chủ quản COST</option>\
                    <option value="會簽單位" data-i18n="Manager5">會簽單位/Hội ký</option>\
                    <option value="結案單位" data-i18n="Manager9">Người kết án</option>';

var option_site = '<option value="VN" data-i18n="VN">VN</option>\
                    <option value="桂武(QUẾ VÕ)" data-i18n="桂武(QUẾ VÕ)">QUẾ VÕ</option>\
                    <option value="黃田(ĐỒNG VÀNG)" data-i18n="黃田(ĐỒNG VÀNG)">ĐỒNG VÀNG</option>\
                    <option value="光州(QUANG CHÂU)" data-i18n="光州(QUANG CHÂU)">QUANG CHÂU</option>\
                    <option value="雲中(VÂN TRUNG)" data-i18n="雲中(VÂN TRUNG)">VÂN TRUNG</option>';

function Return_SignType_Val(data_i18n) {
    switch (data_i18n) {
        case 'Applicant': //Người làm đơn
            return '申請人';
        case 'Manager1': //Chủ quản phòng
            return '課級主管審核';
        case 'Manager2': //Chủ quản bộ phận
            return '部級主管審核';
        case 'Manager3': //Xưởng trưởng
            return '處級主管審核';
        case 'Manager7':
            return '使用單位審核';
        case 'Manager8':
            return '主管核准';
        case 'Manager10':
            return 'BU IT 主管審核';
        case 'Manager11':
            return 'BU IT 審核';
        case 'COST-manager': //Chủ quản COST
            return '經管簽核';
        case 'Manager5': //Hội ký
            return '會簽單位';
        case 'Manager9': //Người kết án
            return '結案單位';
        case 'CV-000': //申請人-Người làm đơn
            return '申請人';
        case 'CV-001': //課級主管審核-Chủ quản phòng
            return '課級主管審核';
        case 'CV-002': //課級主管審核-Chủ quản BP
            return '部級主管審核';
        case 'CV-003': //處級主管審核-Chủ quản xưởng
            return '處級主管審核';
        case 'CV-004': //BU關務簽核-Hải quan BU
            return 'BU關務簽核';
        case 'CV-005': //TW 關務簽核-Hải quan TW
            return 'TW關務簽核';
        case 'CV-006': //BU經管簽核-Kế Toán BU
            return 'BU經管簽核';
        case 'CV-007': //BU環安簽核-An toàn BU
            return 'BU環安簽核';
        case 'CV-008': //中央環安簽核-ATMT VN
            return '中央環安簽核';
        case 'CV-009': //BU總務簽核-Tổng vụ BU
            return 'BU總務簽核';
        case 'CV-010': //FG保安簽核-An Ninh FG
            return 'FG保安簽核';
        case 'CV-011': //警衛結案-Bảo vệ kết án
            return '警衛結案';
        case 'CV-012': //Fii最高主管簽核-Chủ quản cao nhất Fii
            return 'Fii最高主管簽核';
        case 'CV-013': //中央經管簽 Quản lý chi tiêu TW
            return '中央經管簽';

    }
}

//Hỏi trước khi thực hiện trả về true-false:CONFIRM_Question()
//Hàm trả về biểu tượng của trạng thái đơn:SHOW_FLAG_STATUS(STATUS_DOC, size_icon)
//Hàm chỉ cho nhập vào số: ONLY_NUMBER_INPUT(element)
//lấy thông tin truyền hình ảnh vào formdata : GET_FORM_DATA_TO_POST(photo)
//Lọc menu tìm kiếm DROPDOWN vơi input text: filterFunction(id_input, id_dropmenu)
//Lấy dữ liệu từ menu dropdownMenuButton truyền vào 1 input id: GET_TEXT_MENU(element, id_settext)
//Lấy toàn bộ ID và value của ID input đưa vào object: GET_ALL_INPUT_FROM_DIV(id_DIV)
//Click one input file: CLICK_InputFile(id_inputFile)
//Kiểm tra có tệp có phải là ảnh hay không: CHECK_IMAGE_FILE(element)
//Hàm kiểm tra dữ liệu từng đối tượng có null không: CHECK_ARR_NOT_NULL(arr)
//RESET trống thông tin của các thẻ con trong thẻ cha: RESET_AREA(id_area)
//Ẩn tất cả các button trong thẻ div: Hide_All_Button_FromDiv(id_DIV)
//Loại bỏ các thuộc tính hidden trong các thẻ button của thẻ DIV cha: Remove_Attr_Hidden_Button_FromDiv(id_DIV)
//Load lại trang: LOAD_PAGE_AGAIN()
//Kiểm tra trình duyệt có phải IE: CHECK_IE()
//Hiển thị Modal thông qua Show_Modal_FromID(id_modal)
//Đóng Modal thông qua ID: Close_Modal_FromID(id_modal)
//Checkbox thay đổi toàn bộ các checkbox khác:CHECKBOX_CHANGE_ALL(id_checkbox, id_Area)
//Show modal loadding: Show_loading()
//Countdown thoát Loading: Exit_Loading()
//Nhấn nút hủy bỏ: BACK_HOME()
// Hiển thị ảnh cá nhân: show_icon_user()
//Sự kiện enter cho 1 input thực hiện hàm fun:Enter_input(id_input, fun)
//Hiển thị thông tin chi tiết đơn vào form docdetail :Doc_Detail(el)
//Đi tới 1 liên kết( host + '/' + href_name + '/'): Goto_link(href_name)
//Đăng xuất tài khoản: LogOut()
//Tải file từ server về với 1 element: Donwload_File(element)
//Hàm tải file với tên file biết trước:downloadFile(fname)
//Tải file gộp với 1 file PDF khác:downloadFile_PDF_Merge(file1, file2, fname)
//Hàm lấy thông tin HOSTNAME: GET_HOSTNAME()
//Hàm trả về chuỗi thời gian dd-mm-yyy h:m: GET_STRING_DATETIME1(dateString)
//Hàm trả về thông tin các đơn đang chờ ký: SHOW_DOC_Notifications()
//Hàm phân quyền cho các module: GET_perMission_module(idModule, val_fied)
//Hàm Phân quyền User các module: PERMISSION_USER()
//In chữ ký màu của thẻ Div: printDiv(divName)
//In chữ ký đen trắng của thẻ Div: PrintElem(elem)
//Cuộn Trở về đầu trang:    $(this).scrollTop(0);
//Load file HTML vào html: Load_html(id_DIV, path_html)

//change background color auto with timer
function change_corlor_background(id_element, color1, color2) {
    if ($('#' + id_element).attr('style') == "background-color:" + color1 + ";") {
        $('#' + id_element).attr('style', "background-color:" + color2 + ";");
    } else { $('#' + id_element).attr('style', "background-color:" + color1 + ";"); }
}


//Show modal loadding
function Show_loading() {
    $("#modal-loading").modal('show');
}
//Countdown thoát Loading
function Exit_Loading() {
    // Update the count down every 1 second
    var x = setTimeout(function() {
        $("#modal-loading").modal('hide');
    }, 1000);
}



//Lạp nạp tooltip cho bảng
function Reload_Tooltip(id_table) {
    $("#" + id_table)
        .on('draw', function() {
            $('[data-toggle="tooltip"]').tooltip({
                html: true,
            });
        });
}


//Lọc menu tìm kiếm DROPDOWN vơi input text
function filterFunction(id_input, id_dropmenu) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(id_input);
    filter = input.value.toUpperCase();
    div = document.getElementById(id_dropmenu);
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

//Thông báo một tin nhắn ra màn hình
function Show_Alert_Message(message, code = "") {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-info',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: 'Thông báo !',
        html: message,
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'Hủy', //' Hủy/取消 '
        reverseButtons: true
    }).then((result) => {
        eval(code);
        console.log("chạy phương thức có code:" + code)
    });

}

//THông báo hỏi lại sweatAlert2 
function Question_(func, args = []) {
    Swal.fire({
        title: 'Bạn có muốn thực hiện?', //"您是否操作<br/>Bạn có muốn thực hiện?"
        text: 'Không thể hoàn nguyên!', //"Không thể hoàn nguyên! (您將無法還原此內容！)"
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FF7043',
        confirmButtonText: 'Đồng ý', // "同意 / Đồng ý",
        cancelButtonText: 'Quay lại', //"拒絕 / Từ chối",

    }).then((result) => {
        if (result.isConfirmed) {
            func();
        }
    })
}




//Thông báo NG sweatAlert2
function AlertErrorSQL(response) {
    Exit_Loading();
    console.log(response);
    var text = response['responseJSON'];
    text = JSON.stringify(text);
    if (text == undefined) { Show_Alert_Message(text); return }
    console.log(text);
    //if (text.lastIndexOf('rror') > 0) { text = response['responseJSON']['error'] }

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-info ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })


    if (text.lastIndexOf('login') > 0 || text.lastIndexOf('Liên hệ quản trị') > 0) {
        swalWithBootstrapButtons.fire({
            title: 'Thông tin lỗi!(錯誤信息)',
            text: text,
            icon: 'warning',
            showCancelButton: true,
            showCancelButton: false,
            confirmButtonText: "OK/同意",
            cancelButtonText: 'Hủy/取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                BACK_HOME();
                //LOAD_PAGE_AGAIN();
            }
        })


    } else {
        swalWithBootstrapButtons.fire({
            title: 'Thông tin lỗi!(錯誤信息)',
            text: text,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: "OK/同意",
            reverseButtons: true
        })
    }
}



//Thông báo NG sweatAlert2
function AlertError(res) {
    console.log(res);

    text = '';
    _title = 'Thông báo';

    try {
        res = res['responseText'];
        res = JSON.parse(res);

        Exit_Loading();
        text = res['message'];
        text = JSON.stringify(text);
        if (text === undefined) {
            // this.Show_Alert_Message(JSON.stringify(res));
            console.log(res);
            return;
        }
    } catch (ex) {
        console.log(ex);
    }
    console.log(text);
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-info ml-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    if (text.lastIndexOf('login') > 0 || text.lastIndexOf('Login') > 0) {
        swalWithBootstrapButtons.fire({
            title: _title,
            html: 'Cần đăng nhập lại',
            icon: 'warning',
            showCancelButton: true,
            showCancelButton: true,
            confirmButtonText: 'OK', //"OK/同意",
            cancelButtonText: 'Thoát', //'Hủy/取消',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // BACK_HOME();
                //LOAD_PAGE_AGAIN();
            }
        })


    } else {
        swalWithBootstrapButtons.fire({
            title: 'Thông báo !',
            html: text,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK', //"OK/同意",
            reverseButtons: true
        })
    }
}

//THông báo OK sweatAlert2
function Alert_OK() {
    Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Operate Success', //'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
    })
    Exit_Loading();
}

//Lấy dữ liệu từ menu dropdownMenuButton truyền vào 1 input id
function GET_TEXT_MENU(element, id_element2) {
    var div = element.parentElement.parentElement;
    var input = $(div).find(":input");
    //alert($(input).attr('id'));
    var text = $(element).text().trim();
    text = text.substring(0, text.indexOf(" "));
    if ($(element).attr('title') === 'null') { Show_Alert_Message("Mã thẻ có thể chưa tồn tại trong hệ thống !"); return; }
    $(input).val(text);
    $("#" + id_element2).val(ReplaceAll($(element).attr('title'), 'null', ''));
}



//Phương thức ajax xử lý dữ liệu từ server
function AJAX_REQUEST(url, type, data, func) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(response) {
            func();
        },
        error: function(response) { AlertErrorSQL(response); }
    });
}

//Phương thức ajax xử lý dữ liệu từ server với 1 tham số 
function AJAX_REQUEST_PARAM(url, type, data, func, param) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(response) {
            func(param);
        },
        error: function(response) { AlertErrorSQL(response); }
    });
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

//Phương thức ajax POST xử lý dữ liệu từ server
function AJAX_POST_REQUEST_RESPONSE(url, formdata, func) {
    $.ajax({
        type: 'POST',
        url: url,
        data: formdata,
        contentType: false,
        processData: false,
        headers: { "X-CSRF-Token": formdata['csrf_value'] },
        success: function(response) {
            func(response);
        },
        error: function(response) { AlertErrorSQL(response); }
    });
}






//Load option cho các select
function Load_option_(id_select, option) {
    $("#" + id_select).empty()
        .append(option);
}



//Show modal Tải file
function List_template() {
    $("#list_downloadfile_Temp").modal('show');
}



//Di chuyển modal :
function Move_modal(id_modalDialog) {
    $("#" + id_modalDialog).draggable();
}

//RESET trống thông tin của các thẻ con trong thẻ cha
function RESET_AREA(id_area) {
    $("#" + id_area).each(function() {
        $(this).val('');
        var button = $(this).find(':input');
        $(button).val('');
        var button1 = $(this).find('select');
        $(button1).val('');
        var button2 = $(this).find('textarea');
        $(button2).val('');
    });
}


//Lấy toàn bộ ID và value của ID đưa vào object
function GET_ALL_INPUT_FROM_DIV(id_DIV) {
    var data = {}
    $("#" + id_DIV + " :input").each(function() {
        val = $(this).val();
        if ($(this).attr('type') == 'checkbox') {
            val = false;
            if ($(this).is(":checked")) {
                val = true;
            }
        }
        data[$(this).attr('id')] = val;
    });
    return data;
}


//Kiểm tra báo vàng phần input chưa có dữ liệu
function CHECK_FILL_DATA_INPUT(id_DIV) {
    $("#" + id_DIV + " input").each(function() {
        if ($(this).val().length < 1) {
            $(this).css("background-color", "#f0e6e4");
            $('#pass2id').removeAttr("style");
        }
    });
}



//Kiểm tra có tệp có phải là ảnh hay không
function CHECK_IMAGE_FILE(element) {
    var photo = $(element)[0].files[0];
    // alert(photo.name);
    var validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/bmp'];
    var fileType = photo['type'];
    if (!validImageTypes.includes(fileType)) {
        alert("Not Image File, check again!");
        return false;
    }
    return true;
}




//lấy thông tin truyền hình ảnh vào formdata 
function GET_FORM_DATA_TO_POST(photo) {

    // Sử dụng jquery:
    var formData = new FormData($('#frm_formfile')[0]);
    //Lấy mã csrftocken gán vào Formdata
    $("#frm_csftk").each(function() {
        if ($(this).find(':input')) {
            btn = $(this).find(':input');
            csrf_name = $(btn).attr('name');
            csrf_value = $(btn).attr('value');
            formData.append(csrf_name, csrf_value);
        }
    });

    var files = photo;
    if (files.name.indexOf("+") > 0) {
        alert("Name file error '+'");
        e.preventDefault();
    }
    formData.append('myfile', files);
    formData.append('file_length', 1);
    return formData;
}




//Di chuyển modal :
function Move_modal(id_modalDialog) {
    $("#" + id_modalDialog).draggable();
}


//Mở 1 tab liên kết( host + '/' + href_name + '/'):
function Open_link(href_name) {
    var host = window.location.protocol + "//" + window.location.host;
    var newhref = host + '/' + href_name
    window.open(newhref, '_blank'); //Mở 1 tab mới
}


//Kiểm tra có phải là IE
function CHECK_IE() {
    var isIE = window.ActiveXObject || "ActiveXObject" in window;
    //<!--Nếu  là  IE js -->
    if (isIE) {
        return true;
        //<!--Nếu Không phải là  IE js -->
    } else {
        return false;
    }
}




//Kiểm tra trình duyệt có phải IE
function CHECK_IE() {
    var isIE = window.ActiveXObject || "ActiveXObject" in window;
    //<!--Nếu  là  IE js -->
    if (isIE) {
        return true;
        //<!--Nếu Không phải là  IE js -->
    } else {
        return false;
    }
}


//Hàm lấy tất cả thông tin của DoC
function GET_ALL_INFOR_DOCNO() {
    // SHOW_DOC_Notifications();
    // GET_TOP_DOC_NEW();
    SHOW_INFOR_PAGE();
}


//Nhấn nút hủy bỏ
function BACK_HOME() {
    choice = '';
    // var hostname = "https://" + window.location.host + "/"
    var host = window.location.protocol + "//" + window.location.host;
    var hostname = window.location = host + "/home/"
    window.location.assign(hostname);
    window.location = hostname;
    window.location.href = hostname;
}


function create_app(but) { //create application
    //khai báo dữ liệu

    $("#modal-delete-row1").modal();
    $("#btn_save").click(function() {
        //do something
        $('#modal-delete-row1').modal('hide');
    });
}


// Hiển thị ảnh cá nhân
function show_icon_user() {
    AJAX_REQUEST_RESPONSE('/show_icon_user/', 'GET', 'me', func);

    function func(response) {
        var str = JSON.stringify(response["returndata"]);
        var arrdic = JSON.parse(str);
        var fields = arrdic;
        var img = fields.img;
        d = new Date();
        if (img == null) {

            $("#icon_user img").removeAttr('src');
            $("#icon_user img").prop('src', urlstatic_JS + "img/pen.jpg?" + d.getTime());

            $("#bg_user img").removeAttr('src');
            $("#bg_user img").prop('src', urlstatic_JS + "img/pen.jpg?" + d.getTime());

        } else {

            $("#icon_user img").removeAttr('src');
            $("#icon_user img").prop('src', urlimg2 + img + "?" + d.getTime());

            $("#bg_user img").removeAttr('src');
            $("#bg_user img").prop('src', urlimg2 + img + "?" + d.getTime());

        }
    }
}


//------------------------------------------------------------FORM NAME SETTING--------------------------------------------------------
$(document).ready(function() {


    // Sự kiện enter input text
    // $("#txt_title").keypress(function(event) {
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if (keycode == '13') {
    //         location = "?flowtitle=" + $("#txt_title").val();
    //     }
    // });
    //sự kiện thay đổi href khi nhấn input text
    //     $("#txt_title").keydown(function() {
    //         var data = $("#txt_title").val();
    //         $("#btn_tk4").prop("href", "/formnamesetting/?flowtitle=" + data);
    //     });
    //     $("#txt_title").keyup(function() {
    //         var data = $("#txt_title").val();
    //         $("#btn_tk4").prop("href", "/formnamesetting/?flowtitle=" + data);
    //     });
});



//Hàm kiểm tra dữ liệu từng đối tượng có null không
function CHECK_ARR_NOT_NULL(arr) {
    var check = true;
    $.each(arr, function(index, value) {
        if (value == "") {
            // console.log("Giá trị trống :" + index);
            alert("Bạn thiếu thông tin :" + index);
            check = false;
            return false;
        }
    });
    // alert('OK');
    return check;
}



//Ajax find User ID trên MYSQL DB foxconn
function SearUser() {
    // get the nickname
    var nick_name = $("#txtempno").val();
    AJAX_REQUEST_RESPONSE('/checknickname/', 'GET', { "nick_name": nick_name }, func);

    function func(response) {
        // on successfull creating object
        // 1. clear the form.
        $("#showUser").empty();
        // 2. focus to nickname input 
        $("#txtempno").focus();
        if (response["userdata"] == "") {
            alert("Not Found Name ID !");
            e.preventDefault;
        }
        var str = JSON.stringify(response["userdata"]);
        var arrdic = JSON.parse(str);
        var fields = arrdic[0];
        $("#showUser").prepend(
            '<tr>\
              <td id="tdIDuser">' + fields["USER_ID"] || "" + '</td>\
              <td id="+tdname+">' + fields["USER_NAME"] || "" + '</td>\
              <td id="+tdmail+">' + fields["EMAIL"] || "" + '</td>\
              <td><button name="btn_getUsser" id="btn_getUsser"  type="button" class="btn btn-success"><i class="fa fa-check" aria-hidden="true" onclick="GetID();"></i></button></td>\
              </tr>');
    }
}



function Query_Docno(docno) {
    AJAX_REQUEST_RESPONSE('/find_part_docno/', 'GET', { docno: docno }, func);

    function func(response) {
        response["returndata"].forEach(function myFunctionx(item, index1) {
            nonum += 1;
            $("#tbody_query").append(
                '<tr  class="clickable-row">\
                <td id="ID_' + item["Apply_No"] + '">' + nonum + '</td>\
                <td id="Apply_No_' + item["Apply_No"] + '"><a id="DG_base_link_Apply_No_0" href="#" style="color:Blue;text-decoration:underline;">' + item["Apply_No"] + '</a></td>\
                <td id="Level_Grade_' + item["Apply_No"] + '">' + item["Level_Grade"] + '</td>\
                <td class="text-left" id="Apply_File_' + item["Apply_No"] + '" class="text-left"><a  href="javascript:void(0);" style="color:Blue;text-decoration:underline;">' + item["Apply_File"].substring(14) + '</a><br></td>\
                <td class="text-left" id="Attem_File_' + item["Apply_No"] + '"></td>\
                <td id="Apply_Person_' + item["Apply_No"] + '">' + item["Apply_Person"] + '</td>\
                <td id="Status_' + item["Apply_No"] + '">' + item["Process"] + '</td>\
                <td id="Sign_Type_' + item["Apply_No"] + '">' + item["Sign_Type"] + '</td>\
                <td id="Signer_' + item["Apply_No"] + '">' + item["Next_Name"] + '</td>\
                <td class="text-center">\
                    <i id="btn_edit_approver_' + item["Apply_No"] + '"  class="fas fa-edit "  style="cursor: pointer;" onclick="edit_approver(this);"></i><i class="fas ">&nbsp;&nbsp;</i>\
                    <i id="btn_del_approver_' + item["Apply_No"] + '"  class="fas fa-trash-alt"  style="cursor: pointer;" onclick="delete_approver(this);"></i>\
                </td>\
              </tr>');
            Show_Attem_FileDocno(item["Apply_No"]);
            //Show_Waiting_Approver(item["Apply_No"]);
        });
    }
}



//Hiển thị thông tin chi tiết đơn vào form docdetail
function Doc_Detail(el) {
    var docno = $(el).text();
    var host = window.location.protocol + "//" + window.location.host;
    var newhref = host + '/doc_detail/?docno=' + docno
        // window.open(newhref, '_blank'); //Mở 1 tab mới
        // window.open(newhref);
    window.location = newhref;
}



//Về trang chờ ký
function Go_TO_WaitingApprove() {
    var host = window.location.protocol + "//" + window.location.host;
    var newhref = host + '/waittingdoc/'
    window.location = newhref;
}



//Upload file FORM lên server
function Upload_File_Form(id_inputfile, id_Div, id_form, tage_filename) {

    //Check input file
    if ($("#" + id_inputfile).val().length == 0) {
        Swal.fire('Please Choose Files Application...!', '', 'warning')
        e.preventDefault();
        return false;
    }

    var csrf_name = '';
    var csrf_value = '';
    // Sử dụng jquery:
    var formData = new FormData($('#' + id_form)[0]);
    //Lấy mã csrftocken gán vào Formdata
    $("#" + id_Div).each(function() {
        if ($(this).find(':input')) {
            btn = $(this).find(':input');
            csrf_name = $(btn).attr('name');
            csrf_value = $(btn).attr('value');
            formData.append(csrf_name, csrf_value);
        }
    });

    var files = $('#' + id_inputfile)[0].files;
    var res = Array.prototype.slice.call(files);
    for (var i = 0; i < files.length; i++) {
        if (files[i].name.indexOf("+") > 0) {
            alert("Tên file không hợp lệ, đổi lại tên '+'");
            e.preventDefault();
            return false;
        }
        formData.append('myfile' + i, files[i]);
    }

    formData.append('file_length', files.length);
    //Gửi dữ liệu file lên server trong myfile
    FormName = '';
    $.ajax({
        type: "POST",
        data: formData,
        url: "/simple_upload/",
        contentType: false,
        processData: false,
        headers: { "X-CSRF-Token": csrf_value },
        success: function(response) {
            check_upform = true;
            $("#" + tage_filename).text(response['returndata'][0]);
            // console.log(FormName);
        },
        error: function(response) {
            AlertErrorSQL(response);
        }
    });

}




// //Hiển thị các file upload đính kèm
function Show_Attem_FileDocno1(doc) {
    // GET AJAX request
    $.ajax({
        type: 'GET',
        url: "/show_attem_file_upload/",
        data: {
            docno: doc
        },
        success: function(response) {
            response["returndata"].forEach(function myFunctionx(item, index1) {
                $("#Attem_File_" + doc).prepend('<a href="javascript:void(0);">' + item["File_Name"].substring(14) + '</a><br>');
            });
        },
        error: function(response) {
            AlertErrorSQL(response);
        }
    })
}



//Hiển thị các file upload đính kèm
function Show_Attem_FileDocno(doc) {
    // GET AJAX request
    $.ajax({
        type: 'GET',
        url: "/show_attem_file_upload/",
        data: {
            docno: doc
        },
        success: function(response) {
            response["returndata"].forEach(function myFunctionx(item, index1) {
                $("#Attem_File_" + doc).prepend(
                    '<a href="javascript:void(0);" style="color:#448aff;text-decoration:underline;">' + item["File_Name"].substring(14) + '</a><br>\
                    ');
            });
        },
        error: function(response) {
            AlertErrorSQL(response);
        }
    })
}



//HÀM GỬI MAIL TỰ ĐỘNG các mail cách nhau dấu ,
function WMSendMail(mailto, mailfrom, cc, subject, message) {
    // GET AJAX request
    $.ajax({
        type: 'GET',
        url: "http://10.224.69.51/SMTPService/SMTPService.asmx/WMSendMail?mailto=" + mailto + "&from=" + mailfrom + "&cc=" + cc + "&subject=" + subject + "&msg=" + message + "",
        data: ''
            // success: function(response) {
            //     Alert_OK();
            // },
            // error: function(response) {
            //     alert(JSON.stringify(response));
            //     AlertErrorSendMail();
            // }
    })
}



//TEst gửi mail
function TestMail() {
    var mailto = 'cncs-vn-code@mail.foxconn.com';
    var mailfrom = 'cncs-vn-code@mail.foxconn.com';
    var cc = 'cncs-vn-code@mail.foxconn.com';
    var subject = 'E_Sign 4.0';
    var message = 'Test send mail by ajax';
    message = message;
    WMSendMail(mailto, mailfrom, cc, subject, message);
}


//Load lại trang
function LOAD_PAGE_AGAIN() {
    location.reload();
}

//Đăng xuất tài khoản
function LogOut() {
    // GET AJAX request
    var host = window.location.protocol + "//" + window.location.host;
    var newhref = host + '/logout/'
    window.location = newhref;
    LOAD_PAGE_AGAIN();
    $.ajax({
        type: 'GET',
        url: "/logout/",
        data: '',
        success: function(response) {
            LOAD_PAGE_AGAIN();
        },
        error: function(response) {
            AlertErrorSQL(response);
        }
    })
}




//Láº¥y dá»¯u liá»‡u tá»« form vÃ o formdataa
function form_toFormData(form_id) {
    form_id = "#" + form_id;
    var formData = new FormData($(form_id)[0]);

    $(form_id + " :input").each(function() {
        if ($(this).attr('type') == 'file') {
            var file = this.files[0];
            formData.append(this.name, file);
        } else if ($(this).attr('type') == 'checkbox') {
            val = false;
            if ($(this).is(":checked")) {
                val = true;
            }
            formData.append(this.name, val);
        } else {
            formData.append($(this).attr('name'), $(this).val());
        }
    });
    // console.log(formData.get('csrfmiddlewaretoken'));
    return formData;
}

//Submit 1 form lÃªn server vá»›i ajax
function form_submit(formData, actionUrl, func) {
    Show_loading();
    $.ajax({
        url: actionUrl,
        type: 'POST',
        data: formData,
        success: function(data) {
            func(data)
        },
        error: function(response) { AlertErrorSQL(response) },
        cache: false,
        contentType: false,
        processData: false
    });
}




//Load module tìm kiếm
function Load_module_query() {
    // console.log($("#menux2").hasClass("active"));
    if (!$("#menux2").hasClass("active")) {
        //Load_Html_('/static/html/query_doc_resul.html','Div_mainbody');
        ChangeReload_Location_URL('querydoc');
    }
}


//Load HTML từ 1 file vào thẻ DIV
function Load_Html_(path_fileHtml, div_main) {
    $("#" + div_main).empty()
        .load(path_fileHtml, function() {
            $("#Modal_option_search").on('draw', function() {
                $('[data-toggle="modal"]').modal({
                    html: true,
                });
            });
            SHOW_LANG_()
        });
    // console.log("đã load");
}

//Tải file từ server về
function Donwload_File1(element) {
    var filename = $(element).text();
    // alert('msg');
    downloadFile(filename);
}


//Tải file từ server về
function Donwload_File(element, docno) {
    //var savename = docno + $(element).text().substring(14);
    var fname = $(element).text();
    // alert('msg');
    downloadFile(fname);
}





//Hàm tải file từ static media
function downloadFile(fname) {

    // GET AJAX request
    $.ajax({
        type: 'GET',
        url: "/download_file/",
        data: { "lstfile": fname },
        dataType: 'binary',
        xhrFields: {
            'responseType': 'blob'
        },
        success: function(data, status, xhr, contentType) {
            Down_Link(data, status, xhr, contentType, fname)
        },
        error: function(response) {
            console.log(JSON.stringify(response));
            AlertErrorSQL(response);
        }
    })
}

function Down_Link(data, status, xhr, contentType, fname) {
    // download the file
    var link = document.createElement('a'),
        filename = fname;
    link.href = URL.createObjectURL(data);
    link.download = fname;
    link.click();
}

//Hàm tải file từ static + folder
function download_FileinFolder(fname, folder) {
    // GET AJAX request
    $.ajax({
        type: 'GET',
        url: "/download_file/",
        data: { "lstfile": fname, folder: folder },
        dataType: 'binary',
        xhrFields: {
            'responseType': 'blob'
        },
        success: function(data, status, xhr, contentType) {
            Down_Link(data, status, xhr, contentType, fname)
        },
        error: function(response) {
            console.log(JSON.stringify(response));
            AlertErrorSQL(response);
        }
    })
}



//Hàm tải file
function downloadFile_PDF_Merge(file1, file2, fname) {
    var data = { file1: file1, file2: file2 }
        // GET AJAX request        
    AJAX_REQUEST_RESPONSE('/download_PDF_merge/', 'GET', data, func);

    function func(response) {
        download_FileinFolder(response['returndata'], 'download')
            //console.log(response);window.open(response['returndata'],'_blank')
    };
}


//Hàm lấy thông tin HOSTNAME
function GET_HOSTNAME() {
    var host = window.location.protocol + "//" + window.location.host;
    // var hostname = window.location = host
    return host;
}

//Change but not reload URL
function Change_Location_URL(url) {
    window.history.pushState({}, document.title, "/" + url);
    // location.replace(window.location.origin+'/'+url+'/');
}
//Change but not reload URL
function ChangeReload_Location_URL(url) {

    location.replace(window.location.origin + '/' + url + '/');
}




//Hàm trả về chuỗi thời gian dd-mm-yyy h:m
function GET_STRING_DATETIME1(dateString) {
    if (dateString === null) { return ''; }
    const d = new Date(dateString);
    let y = d.getFullYear();
    let mm = d.getMonth();
    let dd = d.getDate();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    var ampm = h >= 12 ? 'PM' : 'AM';
    today = dd + "/" + mm + "/" + y + " " + h + ":" + m + " " + ampm;
    return today;
}


//API regex replace all
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function ReplaceAll(str, find, replace) {
    if (str === null || str === undefined) { return "" }
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


//Hàm trả về chuỗi thời gian yyyy-mm-dd hh:m
function GET_STRING_DATETIME2(dateString) {
    if (dateString === null) { return ''; }
    dateString = dateString.replace("T", ' ');
    dateString = ReplaceAll(dateString, "-", '/');
    dateString = dateString.substring(0, 19)
    return dateString;
}



//Hàm trả về thông tin các đơn đang chờ ký
function SHOW_DOC_Notifications() {
    // console.log("OK");
    // GET AJAX request
    SHOW_INFOR_PAGE();
    AJAX_REQUEST_RESPONSE('/Waiting_approver/', 'GET', { docno: '' }, func);

    function func(response) {
        var lang = getcookie_lang();

        if (lang.length <= 0) { lang = "en"; }
        var noti = '',
            op = '';
        if (lang == 'vn') {
            noti = 'Thông báo';
            op = "Mới";
        } else if (lang == 'en') {
            noti = 'Notifications';
            op = 'New';
        } else if (lang == 'cn') {
            noti = '通知';
            op = '新的'
        }


        $("#Show_docnolist")
            .empty()
            .append(
                '<li>\
            <!-- MENU SHOW ICON -->\
            <h6>' + noti + '</h6>\
            <label class="label label-warning">' + op + '</label>\
          </li>');

        $(".badge").removeClass("bg-c-yellow"); //Xóa thông báo khi không có đơn ký
        // console.log(response["returndata"].length);
        response["returndata"].forEach(function(item, index) {
            var Level_Grade = item["Level_Grade"];
            Level_Grade = Level_Grade == 'Urgent' ? '<label class="label label-danger text-white">Urgent' : '<label class="label label-info text-white">Normal';
            var img = item['img'];

            $(".badge").addClass("bg-c-yellow"); //Tô màu thông báo có đơn 

            if (img == null) {
                $("#Show_docnolist").append(
                    '<li class="waves-effect waves-light">\
                        <div class="media">\
                            <img style="object-fit:cover" class="d-flex align-self-center img-radius" src="' + urlstatic_JS + 'img/pen.jpg" alt="User image">\
                            <div class="media-body">\
                                <h5 class="notification-user">' + item["Apply_Person"] + '_' + item["Apply_EmpNo"] + '</h5>\
                                <p class="notification-msg"><a href="javascript:void(0);" onclick="Doc_Detail(this);"  style="color:#448aff;text-decoration:underline;">' + item["Apply_No"] + '</a></p>\
                                <span class="notification-time">At: ' + GET_STRING_DATETIME1(item["Edit_Time"]) + '</span>\
                            </div>\
                            ' + Level_Grade + '</label>\
                        </div>\
                    </li>\
                    ');
            } else {
                $("#Show_docnolist").append(
                    '<li class="waves-effect waves-light">\
                        <div class="media">\
                            <img style="object-fit:cover" class="d-flex align-self-center img-radius" src="' + urlstatic_JS + 'media/' + img + '" alt="User image">\
                            <div class="media-body">\
                                <h5 class="notification-user">' + item["Apply_Person"] + '_' + item["Apply_EmpNo"] + '</h5>\
                                <p class="notification-msg"><a href="javascript:void(0);" onclick="Doc_Detail(this);"  style="color:#448aff;text-decoration:underline;">' + item["Apply_No"] + '</a></p>\
                                <span class="notification-time">At: ' + GET_STRING_DATETIME1(item["Edit_Time"]) + '</span>\
                            </div>\
                            ' + Level_Grade + '</label>\
                        </div>\
                    </li>\
                    ');
            }
        });
    }

}



//Hàm hiển thị thông tin TOP4 người mới làm đơn trên hệ thống Esign
function GET_TOP_DOC_NEW() {
    AJAX_REQUEST_RESPONSE('/get_top_newdoc/', 'GET', { docno: '' }, func);

    function func(response) {
        $("#tbody_top_doc").empty();
        response["returndata"].forEach(function(item, index) {
            var img = item['img'];
            if (img == null) {
                $("#tbody_top_doc").append(
                    '<tr>\
                    <td>\
                      <div class="d-inline-block align-middle">\
                        <img src="' + urlstatic_JS + 'img/pen.jpg" alt="user image" class="img-radius img-40 align-top m-r-15">\
                        <div class="d-inline-block">\
                          <h6>' + item["Apply_Person"] + '&nbsp;</h6>\
                          <p class="text-muted m-b-0">\
                          <a href="javascript:void(0);" onclick="Doc_Detail(this);"  style="color:#005ffd;text-decoration:underline;">' + item["Apply_No"] + '</a>\
                            <a>At: ' + GET_STRING_DATETIME1(item["Edit_Time"]) + '</a>\
                          </p>\
                        </div>\
                      </div>\
                    </td>\
                    <td class="text-right">\
                      <h6 class="f-w-700">1<i class="fas fa-level-up-alt text-c-green m-l-10"></i></h6>\
                    </td>\
                  </tr>\
                    ');
            } else {
                $("#tbody_top_doc").append(
                    '<tr>\
                        <td>\
                          <div class="d-inline-block align-middle">\
                            <img src="' + urlstatic_JS + 'media/' + img + '" alt="user image" class="img-radius img-40 align-top m-r-15">\
                            <div class="d-inline-block">\
                              <h6>' + item["Apply_Person"] + '&nbsp;</h6>\
                              <p class="text-muted m-b-0">\
                              <a href="javascript:void(0);" onclick="Doc_Detail(this);"  style="color:#005ffd;text-decoration:underline;">' + item["Apply_No"] + '</a>\
                                <a>At: ' + GET_STRING_DATETIME1(item["Edit_Time"]) + '</a>\
                              </p>\
                            </div>\
                          </div>\
                        </td>\
                        <td class="text-right">\
                          <h6 class="f-w-700">1<i class="fas fa-level-up-alt text-c-green m-l-10"></i></h6>\
                        </td>\
                      </tr>\
                        ');
            }
        });
    }
}




//Lấy danh sách tệp mẫu
function get_File_Templates() {
    $('#list_template').empty();
    AJAX_REQUEST_RESPONSE('/action_Categorys/', 'GET', { Action: 'CODE_TYPE', TypeCode: 'TEMPLATE' }, func);

    function func(response) {
        response['returndata'].forEach(function(item) {
            var tag = '<a style="color:#448aff;cursor:pointer;text-decoration:underline;\
                                                href="javascript:void(0)" \
                                                onclick="window.open(' + "'/static/download/F-templates/" + item['Name'] + "', '_blank'" + ')">\
                                                ' + item['Group'] + '.' + item['Name'] + '</a><br>';
            $('#list_template').append(tag);
        });
    }
}


//Hàm hiển thị thống kê các thông tin trang index
function SHOW_INFOR_PAGE() {
    var tags = document.querySelectorAll("#Show_docnolist a");
    // console.log(tags.length);
    if (tags > 0) { return false; }
    // GET AJAX request
    $.ajax({
        type: 'GET',
        url: "/show_info_page/",
        data: {
            data: ''
        },
        success: function(response) {
            try {
                // console.log(response['warning']);
                $('#_warning').removeAttr('hidden')
                    .prop(response['warning'], true)
                    //Nạp top 4 đơn mới nhất
                var topdoc = response["topdoc"];
                //alert(JSON.stringify(topdoc));
                if (topdoc != '') {
                    $("#tbody_top_doc").empty();
                    topdoc.forEach(function myFunctionx(item, index) {
                        var img = item['img'];

                        if (img == null) {
                            $("#tbody_top_doc").append(
                                '<tr>\
                                    <td>\
                                      <div class="d-inline-block align-middle">\
                                        <img src="' + urlstatic_JS + 'img/pen.jpg" alt="user image" class="img-radius img-40 align-top m-r-15">\
                                        <div class="d-inline-block">\
                                          <h6>' + item["Apply_Person"] + '&nbsp;</h6>\
                                          <p class="text-muted m-b-0">\
                                          <a href="javascript:void(0);" onclick="Doc_Detail(this);"  style="color:#005ffd;text-decoration:underline;">' + item["Apply_No"] + '</a>\
                                            <a>At: ' + GET_STRING_DATETIME1(item["Edit_Time"]) + '</a>\
                                          </p>\
                                        </div>\
                                      </div>\
                                    </td>\
                                    <td class="text-right">\
                                      <h6 class="f-w-700">1<i class="fas fa-level-up-alt text-c-green m-l-10"></i></h6>\
                                    </td>\
                                  </tr>\
                                    ');
                        } else {
                            $("#tbody_top_doc").append(
                                '<tr>\
                                    <td>\
                                      <div class="d-inline-block align-middle">\
                                        <img src="' + urlstatic_JS + 'media/' + img + '" alt="user image" class="img-radius img-40 align-top m-r-15">\
                                        <div class="d-inline-block">\
                                          <h6>' + item["Apply_Person"] + '&nbsp;</h6>\
                                          <p class="text-muted m-b-0">\
                                          <a href="javascript:void(0);" onclick="Doc_Detail(this);"  style="color:#005ffd;text-decoration:underline;">' + item["Apply_No"] + '</a>\
                                            <a>At: ' + GET_STRING_DATETIME1(item["Edit_Time"]) + '</a>\
                                          </p>\
                                        </div>\
                                      </div>\
                                    </td>\
                                    <td class="text-right">\
                                      <h6 class="f-w-700">1<i class="fas fa-level-up-alt text-c-green m-l-10"></i></h6>\
                                    </td>\
                                  </tr>\
                                    ');
                        }

                    });
                }


                //Nạp các đơn đang chờ ký vào Notifications
                var docwaiting = response["docwaiting"];
                var lang = getcookie_lang();
                var noti = '',
                    op = '';
                if (lang == 'vn') {
                    noti = 'Thông báo';
                    op = "Mới";
                } else if (lang == 'en') {
                    noti = 'Notifications';
                    op = 'New';
                } else if (lang == 'cn') {
                    noti = '通知';
                    op = '新的'
                }
                $("#Show_docnolist")
                    .empty()
                    .append(
                        '<li>\
                        <!-- MENU SHOW ICON -->\
                        <h6>' + noti + '</h6>\
                        <label class="label label-warning">' + op + '</label>\
                      </li>');
                $(".badge").removeClass("bg-c-yellow"); //Xóa thông báo khi không có đơn ký
                if (docwaiting != '') {
                    docwaiting.forEach(function myFunctionx(item, index) {
                        var Level_Grade = item["Level_Grade"];

                        var img = item['img'];

                        if (lang == 'vn') {
                            Level_Grade = Level_Grade == 'Urgent' ? '<label class="label label-danger text-white">Khẩn cấp' : '<label class="label label-info text-white">Thông thường';
                        } else if (lang == 'en') {
                            Level_Grade = Level_Grade == 'Urgent' ? '<label class="label label-danger text-white">Urgent' : '<label class="label label-info text-white">Normal';
                        } else if (lang == 'cn') {
                            Level_Grade = Level_Grade == 'Urgent' ? '<label class="label label-danger text-white">紧急' : '<label class="label label-info text-white">普通的';
                        }

                        $(".badge").addClass("bg-c-yellow"); //Tô màu thông báo có đơn 

                        if (img == null) {
                            $("#Show_docnolist").append(
                                '<li class="waves-effect waves-light">\
                                    <div class="media">\
                                        <img style="object-fit:cover" class="d-flex align-self-center img-radius" src="' + urlstatic_JS + 'img/pen.jpg" alt="User image">\
                                        <div class="media-body">\
                                            <h5 class="notification-user">' + item["Apply_Person"] + '_' + item["Apply_EmpNo"] + '</h5>\
                                            <p class="notification-msg"><a href="javascript:void(0);" onclick="Doc_Detail(this);"  style="color:#448aff;text-decoration:underline;">' + item["Apply_No"] + '</a></p>\
                                            <span class="notification-time">At: ' + GET_STRING_DATETIME1(item["Edit_Time"]) + '</span>\
                                        </div>\
                                        ' + Level_Grade + '</label>\
                                    </div>\
                                </li>\
                                ');
                        } else {
                            $("#Show_docnolist").append(
                                '<li class="waves-effect waves-light">\
                                    <div class="media">\
                                        <img class="d-flex align-self-center img-radius" src="' + urlstatic_JS + 'media/' + img + '" alt="User image">\
                                        <div class="media-body">\
                                            <h5 class="notification-user">' + item["Apply_Person"] + '_' + item["Apply_EmpNo"] + '</h5>\
                                            <p class="notification-msg"><a href="javascript:void(0);" onclick="Doc_Detail(this);"  style="color:#448aff;text-decoration:underline;">' + item["Apply_No"] + '</a></p>\
                                            <span class="notification-time">At: ' + GET_STRING_DATETIME1(item["Edit_Time"]) + '</span>\
                                        </div>\
                                        ' + Level_Grade + '</label>\
                                    </div>\
                                </li>\
                                ');
                        }
                    });
                }
                //Load dữ liệu thống kê
                var item = response["returndata"];
                if (item != '') {
                    $("#total_acount").text(item.total_acount);
                    $("#total_doc").text(item.total_doc);
                    $("#total_fileattach").html('<i class="fa fa-arrow-up m-r-15 text-c-green"></i>' + item.total_fileattach);
                    $("#total_formfile").html('<i class="fa fa-arrow-up m-r-15 text-c-green"></i>' + item.total_formfile);
                    $("#total_waiting").text(item.total_waiting);
                    $("#total_cancel").text(item.total_cancel);
                    $("#total_approved").text(item.total_approved);
                    $("#total_application").text(item.total_application);

                    $("#total_application1").html(item.total_application);
                    $("#my_waiting").html(item.my_waiting);

                    $("#total_ApplicationClosed").text(item.total_ApplicationClosed);
                    $("#total_return").html('<i class="fa fa-arrow-down m-r-15 text-c-red"></i>' + item.total_return);
                    $("#total_pending").html('<i class="fa fa-arrow-up m-r-15 text-c-green "></i>' + item.total_pending);
                    $("#total_signature").text(item.total_signature);
                    $("#total_signature_system").text(item.total_signature_system);
                    $("#total_finish").text(item.total_finish);
                    $("#total_closed").text(item.total_closed);

                    $("#task_canceled").text(item.total_canceled);
                    $("#task_pending").text(item.total_pending);
                    $("#task_return").text(item.total_return);
                    $("#task_application").text(item.total_application);
                    $("#task_ApplicationClosed").text(item.total_ApplicationClosed);

                    $("#ratio_canceled").html(item.ratio_canceled);
                    $("#ratio_pending").text(item.ratio_pending);
                    $("#ratio_return").text(item.ratio_return);
                    $("#ratio_application").text(item.ratio_application);
                    $("#ratio_ApplicationClosed").text(item.ratio_ApplicationClosed);

                    $("#ratio_canceled1")
                        .removeAttr('style')
                        .prop('style', 'width:' + item.ratio_canceled);
                    $("#ratio_pending1")
                        .removeAttr('style')
                        .prop('style', 'width:' + item.ratio_pending);
                    $("#ratio_return1")
                        .removeAttr('style')
                        .prop('style', 'width:' + item.ratio_return);
                    $("#ratio_application1")
                        .removeAttr('style')
                        .prop('style', 'width:' + item.ratio_application);
                    $("#ratio_ApplicationClosed1")
                        .removeAttr('style')
                        .prop('style', 'width:' + item.ratio_ApplicationClosed);


                }

            } catch (err) {

            }

        },
        error: function(response) {
            // AlertErrorSQL(response);
        }
    })
}



//Hàm Phân quyền User các module
function PERMISSION_USER() {
    // GET AJAX request
    $.ajax({
        type: 'GET',
        url: "/show_permission/",
        data: {
            userID: ''
        },
        success: function(response) {
            var item = response["permission"];
            if (item == '') { return; }
            var APPROVAL = item.APPROVAL;
            var NEW_APP_CREAT = item.NEW_APP_CREAT;
            var QUERY_DOC = item.QUERY_DOC;
            var FLOW_SET = item.FLOW_SET;
            var FORM_SET = item.FORM_SET;
            var APPROVER_SET = item.APPROVER_SET;
            var USER_MANAGE = item.USER_MANAGE;
            var PASS_MODIFY = item.PASS_MODIFY;
            var API_CREATE_USER = item.API_CREATE_USER;

            //style="pointer-events: none;"
            if (APPROVAL == 1) {
                $("#APPROVAL").removeAttr('hidden');
                $("#APPROVAL1").removeAttr('hidden');

                $("#btn_cancel").removeAttr('hidden');
                $("#btn_reject").removeAttr('hidden');
                $("#btn_forward").removeAttr('hidden');
                $("#btn_Approval").removeAttr('hidden');
                $("#btn_update_appro").removeAttr('hidden');

                $("#APPROVAL").removeAttr('style');
                $("#APPROVAL1").removeAttr('style');
            }
            if (NEW_APP_CREAT == 1) {
                $("#NEW_APP_CREAT").removeAttr('hidden');
                $("#NEW_APP_CREAT1").removeAttr('hidden');

                $("#NEW_APP_CREAT").removeAttr('style');
                $("#NEW_APP_CREAT1").removeAttr('style');

                $("#Add_wifi").removeAttr('hidden');
                $("#Add_wifi").removeAttr('style');
            }
            if (QUERY_DOC == 1) {
                $("#QUERY_DOC").removeAttr('hidden');
                $("#QUERY_DOC1").removeAttr('hidden');
                $("#search_docno_quick").removeAttr('hidden');
                $("#news_task").removeAttr('hidden');
                $("#Show_docnolist").removeAttr('hidden');

                $("#QUERY_DOC").removeAttr('style');
                $("#QUERY_DOC1").removeAttr('style');
                $("#search_docno_quick").removeAttr('style');
                $("#news_task").removeAttr('style');
                $("#Show_docnolist").removeAttr('style');

            }
            if (FLOW_SET == 1) {
                $("#FLOW_SET").removeAttr('hidden');
                $("#FLOW_SET1").removeAttr('hidden');

                $("#FLOW_SET").removeAttr('style');
                $("#FLOW_SET1").removeAttr('style');
            }
            if (FORM_SET == 1) {
                $("#FORM_SET").removeAttr('hidden');
                $("#FORM_SET1").removeAttr('hidden');

                $("#FORM_SET").removeAttr('style');
                $("#FORM_SET1").removeAttr('style');
            }
            if (APPROVER_SET == 1) {
                $("#APPROVER_SET").removeAttr('hidden');
                $("#APPROVER_SET1").removeAttr('hidden');

                $("#APPROVER_SET").removeAttr('style');
                $("#APPROVER_SET1").removeAttr('style');
            }
            if (USER_MANAGE == 1) {
                $("#USER_MANAGE").removeAttr('hidden');
                $("#USER_MANAGE1").removeAttr('hidden');

                $("#USER_MANAGE").removeAttr('style');
                $("#USER_MANAGE1").removeAttr('style');
            }
            if (PASS_MODIFY == 1) {
                $("#PASS_MODIFY").removeAttr('hidden');
                $("#PASS_MODIFY1").removeAttr('hidden');

                $("#PASS_MODIFY").removeAttr('style');
                $("#PASS_MODIFY1").removeAttr('style');
            }
            if (API_CREATE_USER == 1) {
                $("#API_CREATE_USER").removeAttr('hidden');
                $("#API_CREATE_USER1").removeAttr('hidden');

                $("#API_CREATE_USER").removeAttr('style');
                $("#API_CREATE_USER1").removeAttr('style');
            }

            // if (APPROVAL == 0) { $("#APPROVAL").attr("hidden", true); }
            // if (NEW_APP_CREAT == 0) { $("#NEW_APP_CREAT").attr("hidden", true); }
            // if (QUERY_DOC == 0) { $("#QUERY_DOC").attr("hidden", true); }
            // if (FLOW_SET == 0) { $("#FLOW_SET").attr("hidden", true); }
            // if (FORM_SET == 0) { $("#FORM_SET").attr("hidden", true); }
            // if (APPROVER_SET == 0) { $("#APPROVER_SET").attr("hidden", true); }
            // if (USER_MANAGE == 0) { $("#USER_MANAGE").attr("hidden", true); }
            // if (PASS_MODIFY == 0) { $("#PASS_MODIFY").attr("hidden", true); }
            // if (API_CREATE_USER == 0) { $("#API_CREATE_USER").attr("hidden", true); }
        },
        error: function(response) {
            AlertErrorSQL(response);
        }
    })
}



//Hàm phân quyền cho các module
function setPropertiesMenu(nameMenu) {
    $('Div[name*="' + nameMenu + '"],ul[name*="' + nameMenu + '"],li[name*="' + nameMenu + '"]')
        .removeAttr('hidden')
        .removeClass("hide-submenu");
}

//Lấy danh sách module cho user
function get_listMenu() {
    AJAX_REQUEST_RESPONSE('/get_listMenu/', 'GET', { Action: 'GET_MENU' }, func);

    function func(response) {
        var data = response['returndata'];
        if (data.length <= 0) { return false }
        data.forEach(function(item) {
            // console.log(item);
            setPropertiesMenu(item['CodeMenu']);
        });
    }
}


$(document).ready(function() {

    //Cuộn Trở về đầu trang
    $(this).scrollTop(0);



    //Sự kiện tìm kiếm nhanh với ô tìm kiếm nhanh
    $("#search_docno_quick").keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {

            //Gọi Hàm tìm kiếm tên user 
            var docno = ($(event.target).val());
            var host = window.location.protocol + "//" + window.location.host;
            var hostname = window.location = host + "/querydoc/?docno=" + docno;
            window.location.assign(hostname);
            window.location = hostname;
            window.location.href = hostname;
            return false;
        }
    });



    //Sự kiện tìm kiếm nhanh với ô tìm kiếm nhanh
    $("#search_docno_quick2").keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {

            //Gọi Hàm tìm kiếm tên user 
            var docno = ($(event.target).val());
            var host = window.location.protocol + "//" + window.location.host;
            var hostname = window.location = host + "/querydoc/?docno=" + docno;
            window.location.assign(hostname);
            window.location = hostname;
            window.location.href = hostname;
            return false;
        }
    });



    //Sự kiện nhấn vào mục Hiển thị thông báo có đơn mới
    // $("#notification_info").click(function() {
    //     SHOW_DOC_Notifications();
    // });

});