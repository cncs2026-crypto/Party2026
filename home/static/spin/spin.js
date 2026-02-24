VanillaTilt.init(document.querySelectorAll(".box"), {
    max: 25,
    speed: 400,
    easing: "cubic-bezier(.03,.98,.52,.99)",
    perspective: 500,
    transition: true
});
// Danh sách mã trúng thưởng
var winningCodes = [
    "A1B2C",
    "3D4E5",
    "F6G7H",
    "8I9J0"
];

// Ký tự hợp lệ gồm 0-9 và A-Z
const validCharacters = "0AB1CD2EFG3HIJK4LM5NO8PQR6STU7VW8XY9Z";

// Function để tạo cột số
function createDigitColumn(columnId) {
    const column = document.getElementById(columnId);
    const list = document.createElement('div');
    list.className = 'digit-list';

    // Tạo các ký tự (0-9, A-Z) lặp lại để quay mượt mà
    for (let i = 0; i < validCharacters.length * 2; i++) {
        const char = document.createElement('div');
        char.className = 'digit-item';
        char.textContent = validCharacters[i % validCharacters.length];
        list.appendChild(char);
    }

    column.appendChild(list);
}

// Khởi tạo cột số
function initializeColumns() {
    for (let i = 1; i <= 5; i++) {
        createDigitColumn(`digit${i}`);
    }
}

// Khởi tạo các cột số khi tải trang
initializeColumns();

// Tạo phím tắt quay 20:
function keyPressHandler(e) {
    var evtobj = window.event ? window.event : e;

    if (evtobj.ctrlKey && evtobj.keyCode == 32) {
        // alert('Ctrl+spacebar');
        startSpin();
    }
}

window.addEventListener('keydown', keyPressHandler);


function ZoomOutEffect() {
    const container = document.querySelector('.card-award');
    // Tạo shadow mới
    const shadow = document.createElement('div');
    shadow.classList.add('shadow');
    container.appendChild(shadow);

    // Xóa shadow sau khi animation kết thúc
    shadow.addEventListener('animationend', () => {
        // shadow.remove();
    });

}


//<!-- JS cho hiệu ứng menu -->

let marker = document.querySelector('#marker');
let list = document.querySelectorAll('ul li');

function moveIndicator(e) {
    marker.style.left = e.offsetLeft + 'px';
    marker.style.width = e.offsetWidth + 'px';
}
list.forEach(link => {
    link.addEventListener('mousemove', (e) => {
        moveIndicator(e.target);
    })
})

function activeLink() {
    list.forEach((item) =>
        item.classList.remove('active'));
    this.classList.add('active');
}
list.forEach((item) =>
    item.addEventListener('mouseover', activeLink));


//Di chuyển các tập hợp số quay về 1 mã
function roundBoxLucky(winningCode, spinDuration, action = 0) {
    Array.from(document.querySelectorAll('.digit-column')).forEach((column, index) => {
        const list = column.firstChild;

        // Reset vị trí trước khi quay
        list.style.transition = 'none';
        list.style.transform = 'translateY(0)';

        // Tạo reflow để áp dụng vị trí mặc định ngay lập tức
        void list.offsetWidth;

        // Tính toán vị trí đích
        const targetChar = winningCode[index];
        const targetIndex = validCharacters.indexOf(targetChar);
        const targetPosition = -200 * (targetIndex + validCharacters.length); // Dịch đến ký tự trúng thưởng

        // Bắt đầu quay
        if (action == 0) {
            list.style.transition = `transform ${spinDuration}s cubic-bezier(0.42, 0, 0.58, 1)`; //Ease-in-out (Chậm ở đầu & cuối, nhanh ở giữa)
        } else if (action == 1) {
            list.style.transition = `transform ${spinDuration}s cubic-bezier(0.33, 1, 0.68, 1)`; //Nhanh đến chậm dần đều
        }

        list.style.transform = `translateY(${targetPosition}px)`;
    });
}

//////////////////////////////////////////////

// Hàm lấy n phần tử ngẫu nhiên từ mảng mà không bị trùng
function getRandomElements(arr, n) {
    if (n > arr.length) {
        throw new Error("Số phần tử cần lấy lớn hơn số phần tử của mảng!");
    }

    let shuffled = arr.slice(); // Sao chép mảng gốc
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Chọn vị trí ngẫu nhiên
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Hoán đổi vị trí
    }

    return shuffled.slice(0, n); // Trích xuất 15 phần tử đầu tiên sau khi trộn
}


//Hiển thị thông tin danh sách quay lên bảng
function displayNumbers(numbers, column = 3) {
    lenthnums = numbers.length;
    if (lenthnums <= 0) { return }
    if (lenthnums % 3 === 0) { column = 3 } else if (lenthnums % 2 === 0) { column = 2 } else if (lenthnums === 1) { column = 1 }
    if (column == 2) {
        $('#resultTable').css('width', '25%');
    } else if (column == 3) {
        $('#resultTable').css('width', '45%');
    }
    let table = document.getElementById("resultTable");
    table.innerHTML = "";
    for (let i = 0; i < numbers.length; i += column) {
        // console.log(numbers);
        let row = table.insertRow();
        for (let j = 0; j < column; j++) {
            let cell = row.insertCell();
            val = numbers[i + j];
            if (numbers[i + j] !== undefined) {
                cell.innerHTML = val; //Chỉ hiển thị mã dự thưởng
                //cell.innerHTML = val + ' - ' + DsNhanVienQuayThuong2[val];//hiển thị tên
            }
        }
    }
}

/**
 * Hàm quay xổ số cho nhiều giải (Giải 2, 3, 4, 5)
 * Hiển thị danh sách các mã trúng thưởng ngẫu nhiên và lưu vào database
 * @param {number} solan - Số lần vòng lặp quay (mặc định 30)
 * @param {number} n - Số lượng giải cần quay trong mỗi vòng (mặc định 1)
 */
function startLottery(solan = 50, n = 1) {
    SetCardClickLock(true);
    // ===== KHỞI TẠO TRẠNG THÁI =====
    elapsedTime = 0; // Đếm số lần tick interval
    solan = 30; // Số vòng quay tối đa (mỗi vòng 100ms = 3 giây quay)

    // ===== CẬP NHẬT GIAO DIỆN NÚT QUAY =====
    $('.circle-button').addClass('quick-round pointer-none'); // Vô hiệu hóa nút & thêm hiệu ứng
    playAudio('mp3Quay2'); // Phát âm thanh quay

    // ===== KÍCH HOẠT NÚT DỪNG SAU 3 GIÂY =====
    setTimeout(() => {
        $('.circle-button')
            .removeClass('pointer-none prepare-round')
            .addClass('stop-round')
            .attr('onclick', "stopSpin()"); // Cho phép người dùng click dừng
    }, 3000);

    // ===== VÒng LẶP: QUAY NGẪU NHIÊN & HIỂN THỊ KẾT QUẢ =====
    interval = setInterval(() => {
        // --- LẤY N MÃ NGẪU NHIÊN TỪ DANH SÁCH ---
        let numbers = getRandomElements(winningCodes, n);

        // --- TÍNH TOÁN SỐ CỘT BẢNG HIỂN THỊ ---
        lenthnums = numbers.length; // Số lượng mã trúng
        column = 2; // Cột mặc định

        // Xác định số cột dựa vào số lượng giải: chia hết 3→3 cột, chia hết 2→2 cột, còn lại 1 cột
        if (lenthnums <= 0) { return }
        if (lenthnums % 3 === 0) { column = 3 } else if (lenthnums % 2 === 0) { column = 2 } else if (lenthnums === 1) { column = 1 }

        // Điều chỉnh độ rộng bảng kết quả theo số cột
        if (column == 2) {
            $('#resultTable').css('width', '50%');
        } else if (column == 3) {
            $('#resultTable').css('width', '60%');
        }

        // --- HIỂN THỊ DANH SÁCH MÃ TRÚNG THƯỞNG ---
        displayNumbers(numbers = numbers, column = column);

        // --- CẬP NHẬT ĐẾM VÒng =====
        elapsedTime++;

        // Nếu chưa click dừng nhưng đã đủ số vòng, gần đến giới hạn để nút dừng có hiệu lực
        if (DungQuay == 0 && elapsedTime >= solan) {
            elapsedTime = solan - 2; // Lùi lại 2 frame để người dùng kịp click
        }

        console.log(DungQuay); // Debug: kiểm tra trạng thái dừng

        // --- KHI ĐẠTTHỜI GIAN QUAY TỐI ĐA ---
        if (elapsedTime >= solan) {
            clearInterval(interval); // Dừng vòng lặp

            // Loại bỏ các class hiệu ứng từ nút
            $('.circle-button').removeClass('quick-round pointer-none stop-round');

            // Dừng âm thanh quay & phát âm thanh kết thúc
            pauseAudio('mp3Quay2');
            playAudio('mp3EndQuay2');
            Run_NhacNen = 0; // Reset flag âm thanh nền

            // Lưu danh sách những người trúng vào database
            ActionTrungThuong(12, numbers);

            // Lưu trạng thái lần quay sau 1.5 giây (chờ animation kết thúc)
            setTimeout(() => {
                console.log("Lần quay cũ: " + LanQuayThu_Cu);
                console.log("Lần quay hiện tại: " + LanQuayThu_HienTai);
                // Cập nhật trạng thái sân chơi (số giải còn lại, lần quay mới, v.v)
                ActionSanChoi(8);
                SetCardClickLock(false);
            }, 1500);
        }

    }, 100); // Tick mỗi 100ms (10 tick = 1 giây)
}


//quay số theo dạng hộp số quay lẻ
function startGame_1(spinDuration = 2) { // Thời gian quay (giây)
    SetCardClickLock(true);

    $('.circle-button').addClass('quick-round pointer-none');

    playAudio("mp3Spin");

    if (Run_NhacNen != 1) {
        playAudio("mp3Nen");
        Run_NhacNen = 1;
    }

    setTimeout(() => {
        $('.circle-button')
            .removeClass('pointer-none prepare-round')
            .addClass('stop-round')
            .attr('onclick', "stopSpin()");
    }, 3000);

    //console.log(SoGiaiConLai_HienTai);
    var resultDisplay = document.getElementById('result');
    resultDisplay.textContent = 'Đang quay...';
    elapsedTime = 0;
    solan = 30;
    action = 0;
    var winningCode = winningCodes[Math.floor(Math.random() * winningCodes.length)]; // Mã trúng ngẫu nhiên
    MATRUNGTHUONG = winningCode;
    roundBoxLucky(winningCode = winningCode, spinDuration = 4);
    interval = setInterval(() => {

        var winningCode = winningCodes[Math.floor(Math.random() * winningCodes.length)]; // Mã trúng ngẫu nhiên
        //if (MaGiai_HienTai == 'GT001') { winningCode = GTDB_F }
        MATRUNGTHUONG = winningCode;

        roundBoxLucky(winningCode = winningCode, spinDuration = 4, action = 1);

        elapsedTime++;
        if (DungQuay == 0 && elapsedTime >= solan) {
            elapsedTime = solan - 2;
        }

        if (DungQuay == 1) {
            clearInterval(interval);
            $('.circle-button').removeClass('quick-round pointer-none stop-round');
            DsNhanVienQuayThuong.every(item => {
                // console.log(item);
                if (winningCode == item['MaDuThuong']) {
                    //MATRUNGTHUONG = winningCode;
                    MANHANVIENTRUNGTHUONG = item['MaNhanVien'];
                    TENNHANVIENTRUNGTHUONG = item['TenNhanVien'];
                    return false; // Thoát sớm khi gặp điều kiện
                }
                return true; // Tiếp tục vòng lặp
            });
            // Output: 1, 2, 3


            Run_NhacNen = 0;
            scrollToTop('tabResult');
            //Lưu giá trị vào bảng quay thưởng
            if (MATRUNGTHUONG == "" || MANHANVIENTRUNGTHUONG == "" || TENNHANVIENTRUNGTHUONG == "") {
                Show_Alert_Message("Chưa xác định được nhân viên trúng giải !");
                SetCardClickLock(false);
                return false;
            }
            ActionTrungThuong(10); //Lưu người trúng vào cơ sở dữ liệu

            setTimeout(() => {
                console.log("Lần quay cũ: " + LanQuayThu_Cu);
                console.log("Lần quay hiện tại: " + LanQuayThu_HienTai);
                //Lưu trạng thái lần quay vào db
                ActionSanChoi(8);

                //hiển thị mã trúng thưởng 
                //resultDisplay.innerHTML = winningCode;
                html = '<img src="/static/spin/images/ticket1.png?v=1" width=200><span style="margin-top: 22px;">Xin Chúc Mừng : [ ' + winningCode + ' ]</span>';
                resultDisplay.innerHTML = html;
                //$('.result-box').append(html);
                pauseAudio('mp3Nen');
                playAudio('mp3EndQuay');

                Run_NhacNen = 0;
                SetCardClickLock(false);

            }, 4000);
        }

    }, 1000);





    // const winningCode = winningCodes[Math.floor(Math.random() * winningCodes.length)]; // Mã trúng ngẫu nhiên
    // MATRUNGTHUONG = winningCode;

    // roundBoxLucky(winningCode, spinDuration);

    // //console.log(SoGiaiConLai_HienTai);
    // const resultDisplay = document.getElementById('result');
    // resultDisplay.textContent = 'Đang quay...';
    // $('.circle-button').addClass('quick-round');
    // $('.game-table tbody').empty();
    // if (LanQuayThu_Cu > LanQuayThu_HienTai) {
    //     LanQuayThu_Cu = LanQuayThu_HienTai;
    // }


    // playAudio("mp3Spin");

    // if (Run_NhacNen != 1) {
    //     playAudio("mp3Nen");
    //     Run_NhacNen = 1;
    // }

    // i(DungQuay == 0) {
    //         startGame_1();
    //     }
    // setTimeout(() => {
    //     //console.log(DsNhanVienQuayThuong)
    //     DsNhanVienQuayThuong.every(item => {
    //         // console.log(item);
    //         if (winningCode == item['MaDuThuong']) {
    //             //MATRUNGTHUONG = winningCode;
    //             MANHANVIENTRUNGTHUONG = item['MaNhanVien'];
    //             TENNHANVIENTRUNGTHUONG = item['TenNhanVien'];
    //             muteAudio('mp3QuayNgan');
    //             playAudio("mp3EndQuay");
    //             return false; // Thoát sớm khi gặp điều kiện
    //         }
    //         return true; // Tiếp tục vòng lặp
    //     });
    //     // Output: 1, 2, 3

    //     resultDisplay.innerHTML = MANHANVIENTRUNGTHUONG + ' - ' + TENNHANVIENTRUNGTHUONG + '<br> \
    //     <span class="code-win">';
    //     html = '<img src="/static/spin/images/ticket1.png?v=1" width=200><span>' + winningCode + '</span>';
    //     $('.result-box').append(html);

    //     $('.quick-round').removeClass('quick-round');
    //     scrollToTop('tabResult');
    //     //Lưu giá trị vào bảng quay thưởng
    //     if (MATRUNGTHUONG == "" || MANHANVIENTRUNGTHUONG == "" || TENNHANVIENTRUNGTHUONG == "") {
    //         Show_Alert_Message("Chưa xác định được nhân viên trúng giải !");
    //         return false;
    //     }
    //     ActionTrungThuong(10); //Lưu người trúng vào cơ sở dữ liệu

    //     setTimeout(() => {
    //         console.log("Lần quay cũ: " + LanQuayThu_Cu);
    //         console.log("Lần quay hiện tại: " + LanQuayThu_HienTai);

    //         if (DungQuay == 0) {
    //             if (DsNhanVienQuayThuong.length > 0 && SoGiaiConLai_HienTai > 0) {
    //                 //Lưu trạng thái lần quay vào db
    //                 ActionSanChoi(8);
    //                 return startSpin();
    //             }
    //         } else {
    //             // LanQuayThu_Cu = LanQuayThu_HienTai;
    //             //Lưu trạng thái lần quay vào db
    //             ActionSanChoi(8);
    //             // console.log(SoGiaiConLai_HienTai, SoLanQuay_Tong);
    //             // console.log(SoGiaiConLai_HienTai % SoLanQuay_Tong);
    //             // if (SoGiaiConLai_HienTai / SoLanQuay_Tong < 1) {
    //             //     // console.log(SoGiaiConLai_HienTai, SoLanQuay_Tong);
    //             //     // console.log(SoGiaiConLai_HienTai / SoLanQuay_Tong);
    //             //     startSpin();
    //             // } else {
    //             pauseAudio('mp3Nen');
    //             Run_NhacNen = 0;
    //             // }
    //         }


    //     }, 1500);
    // }, spinDuration * 1000);
}
// Hàm quay số
chon_giai = '';
Run_NhacNen = 0;
window.IsSpinRunning = false;

function SetCardClickLock(isLocked) {
    window.IsSpinRunning = !!isLocked;
    if (window.IsSpinRunning) {
        $('body').addClass('spin-card-lock');
    } else {
        $('body').removeClass('spin-card-lock');
    }
}

function CheckLicenseForSpin(callback) {
    $.ajax({
        type: 'POST',
        url: '/action_dbLite/',
        data: {
            tab_name: 'TabTrungThuong',
            Action: 'CHECK_LICENSE'
        },
        success: function(response) {
            if (response && response.data && response.data.ok === true) {
                if (typeof callback === 'function') {
                    callback(true);
                }
                return;
            }
            const msg = (response && response.data && response.data.message) ? response.data.message : 'License không hợp lệ';
            Show_Alert_Message(msg);
            if (typeof callback === 'function') {
                callback(false);
            }
        },
        error: function(response) {
            let msg = 'Không thể kiểm tra license';
            if (response && response.responseJSON && response.responseJSON.error) {
                msg = response.responseJSON.error;
            }
            Show_Alert_Message(msg);
            if (typeof callback === 'function') {
                callback(false);
            }
        }
    });
}

function startSpin() {
    return CheckLicenseForSpin(function(canSpin) {
        if (!canSpin) {
            return;
        }

        DungQuay = 0;
        MATRUNGTHUONG = "";
        MANHANVIENTRUNGTHUONG = "";
        TENNHANVIENTRUNGTHUONG = "";
        //console.log(SoLanQuay_Tong, LanQuayThu_HienTai)
        if (chon_giai == '' || MaGiai_HienTai == '' || MaGiai_HienTai == undefined) {
            console.log(MaGiai_HienTai, chon_giai, MaSanChoi_HienTai);
            Show_Alert_Message('Chưa chọn giải !');
            return;
        } else if (SoGiaiConLai_HienTai <= 0) {
            Show_Alert_Message('Số phần thưởng không còn đủ : ' + SoGiaiConLai_HienTai);
            return;
        } else if (SoLanQuay_Tong <= LanQuayThu_HienTai && SoGiaiConLai_HienTai <= 0) {
            Show_Alert_Message('Đã hết lượt quay giải hiện tại !');
            return;
        } else if (SoGiaiConLai_HienTai <= 0) {
            Show_Alert_Message('Số giải quay đã hết !');
            return;
        } else if (winningCodes.length <= 0) {
            Show_Alert_Message('Chưa lấy được danh sách mã quay thưởng từ db !');
            return;
        }




        //Nếu là giải 2,3,4,5 thì quay dạng nhiều
        if (['GT003', 'GT004', 'GT005', 'GT006'].includes(MaGiai_HienTai)) {
            n = TongSoLuongGiai / SoLanQuay_Tong;
            if ((SoGiaiConLai_HienTai - n) < n) { n = SoGiaiConLai_HienTai }

            //Kiểm tra nếu cài đặt thiết lập đã hoàn thành mới cho quay
            if (SetUp_pram != 1) {
                console.log("Đang đợi thiết lập");
                setTimeout(() => {
                    return startLottery(solan = 120, n = n);
                }, 700);
                return;
            }
            SetUp_pram = 0;

            return startLottery(solan = 120, n = n);
        }

        //là giải đặc biệt hoặc 1 thì quay giải đơn
        else {
            //Kiểm tra nếu cài đặt thiết lập đã hoàn thành mới cho quay
            if (SetUp_pram != 1) {
                console.log("Đang đợi thiết lập");
                setTimeout(() => {
                    startGame_1();
                }, 700);
                return;
            }
            SetUp_pram = 0;
            return startGame_1();
        }
    });

}

//dừng quay
function stopSpin() {
    DungQuay = 1;
    setTimeout(() => {
        $('.circle-button').attr('onclick', "startSpin()");
        $('.circle-button').addClass('prepare-round');
    }, 6000);
}
//-----------------------------------------------------------------CÁC FUNCTION XỬ LÝ AUDIO
let USER_INTERACTED_FOR_AUDIO = false;

function markUserInteractedForAudio() {
    USER_INTERACTED_FOR_AUDIO = true;
}

window.addEventListener('pointerdown', markUserInteractedForAudio, { once: true });
window.addEventListener('keydown', markUserInteractedForAudio, { once: true });
window.addEventListener('touchstart', markUserInteractedForAudio, { once: true });

function safePlayMedia(el) {
    if (!el || !USER_INTERACTED_FOR_AUDIO) return;
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function() {});
    }
}

function playAudio(x, y) {
    const media = document.getElementById(x);
    if (!media) return;

    if (y) {
        window.myInterval = setInterval(function() {
            media.pause();
            media.currentTime = 240;
            safePlayMedia(media);
        }, 50);
    } else {
        media.currentTime = 0;
        safePlayMedia(media);
    }
}

function pauseAudio(x) {
    document.getElementById(x).pause();
}

function muteAudio(x) {
    var vid = document.getElementById(x);
    vid.muted = true;
}

function unMuteAudio(x) {
    var vid = document.getElementById(x);
    vid.muted = false;
}

function ControlVolume(el = '') {
    if (el == '') {
        //tắt volume
        unMuteAudio('mp3Nen');
        unMuteAudio('mp3Quay');
        unMuteAudio('mp3EndQuay');
        unMuteAudio('mp3Quay2');
        unMuteAudio('mp3EndQuay2');
        unMuteAudio('mp3Spin');
        return;
    }
    code = $(el).attr('code');
    icon = $(el).find('.hydrated');
    console.log(icon)
    console.log("Tắt mở: " + code)
    if (code === '1') {
        //tắt volume
        muteAudio('mp3Nen');
        muteAudio('mp3Quay');
        muteAudio('mp3EndQuay');
        muteAudio('mp3Spin');
        icon
            .empty()
            .append('<i class="fa fa-volume-slash"></i>');
        $(el).attr('code', '0');
    } else {
        //Bật volume
        unMuteAudio('mp3Nen');
        unMuteAudio('mp3Quay');
        unMuteAudio('mp3EndQuay');
        unMuteAudio('mp3Spin');
        icon
            .empty()
            .append('<i class="fa fa-volume"></i>');
        $(el).attr('code', '1');
    }
}
ControlVolume();