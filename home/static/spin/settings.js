/**
 * Settings Modal - Quản lý hiệu ứng và hình nền
 * Author: Lottery Wheel System
 */

// Danh sách video có sẵn - sẽ được load từ server
let AVAILABLE_VIDEOS = [];

// Danh sách hình ảnh có sẵn - sẽ được load từ server
let AVAILABLE_IMAGES = [];

// Danh sách hiệu ứng
const AVAILABLE_EFFECTS = {
    snow: {
        name: 'Tuyết Rơi',
        element: '#LeafEffect_1',
        icon: '❄️'
    },
    fireworks: {
        name: 'Pháo Hoa',
        element: '.list-award-second',
        icon: '🎆'
    },
    bubbles: {
        name: 'Bong Bóng',
        element: '#bubbles',
        icon: '🎈'
    },
    rainbow: {
        name: 'Cầu Vồng',
        element: 'body',
        icon: '🌈'
    },
    stars: {
        name: 'Mưa Sao',
        element: '#stars',
        icon: '⭐'
    },
    particles: {
        name: 'Hạt Tử',
        element: '#particles',
        icon: '✨'
    }
};

/**
 * Load danh sách video từ server
 */
function LoadVideosFromServer() {
    console.log('📹 Loading videos from server...');

    $.ajax({
        url: '/get_videos/',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.videos) {
                AVAILABLE_VIDEOS = response.videos;
                console.log('✅ Videos loaded:', AVAILABLE_VIDEOS);
            } else {
                console.warn('⚠️ No videos found');
                AVAILABLE_VIDEOS = [];
            }
        },
        error: function(error) {
            console.error('❌ Error loading videos:', error);
            AVAILABLE_VIDEOS = [];
        }
    });
}

/**
 * Load danh sách hình ảnh từ server
 */
function LoadImagesFromServer() {
    console.log('🖼️ Loading images from server...');

    $.ajax({
        url: '/get_images/',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.images) {
                AVAILABLE_IMAGES = response.images;
                console.log('✅ Images loaded:', AVAILABLE_IMAGES);
                LoadImageList();
            } else {
                console.warn('⚠️ No images found');
                AVAILABLE_IMAGES = [];
            }
        },
        error: function(error) {
            console.error('❌ Error loading images:', error);
            AVAILABLE_IMAGES = [];
        }
    });
}

/**
 * Khởi tạo modal Settings khi mở
 */
function InitializeSettings() {
    console.log('⚙️ Khởi tạo Settings Modal');

    // Load danh sách từ server trước
    LoadVideosFromServer();
    LoadImagesFromServer();

    // Sau 500ms, load UI
    setTimeout(() => {
        // Load danh sách video
        LoadVideoList();

        // Load danh sách hình ảnh
        LoadImageList();

        // Load cài đặt hiện tại
        LoadCurrentSettings();
    }, 500);
}

/**
 * Load danh sách video vào panel - Card View
 */
function LoadVideoList() {
    console.log('📹 Load Video List');

    const videoList = document.getElementById('video-list');
    if (!videoList) return;

    videoList.innerHTML = '';

    if (AVAILABLE_VIDEOS.length === 0) {
        videoList.innerHTML = '<div class="col-12"><p class="text-muted text-center">Không tìm thấy video nào</p></div>';
        return;
    }

    AVAILABLE_VIDEOS.forEach((video, idx) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 col-xl-3';

        // Extract filename without extension
        const fileName = video.name || `Video ${idx + 1}`;

        col.innerHTML = `
            <div class="video-card-wrapper">
                <div class="bg-item" 
                     id="video-${video.id}" 
                     onclick="SelectBackgroundVideo('${video.id}', '${video.path}')"
                     style="background-image: url('${video.thumb}'); position: relative;">
                    
                    <!-- Play Button Icon -->
                    <div class="play-button-overlay">
                        <div class="play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    
                    <!-- Label -->
                    <div class="bg-item-label">
                        <div class="video-icon">📹</div>
                        <div class="video-name">${fileName}</div>
                    </div>
                    
                    <!-- Checkmark for selected -->
                    <div class="selection-indicator">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            </div>
        `;
        videoList.appendChild(col);
    });
}

/**
 * Load danh sách hình ảnh vào panel - Card View
 */
function LoadImageList() {
    console.log('🖼️ Load Image List');

    const imageList = document.getElementById('image-list');
    if (!imageList) return;

    imageList.innerHTML = '';

    if (AVAILABLE_IMAGES.length === 0) {
        imageList.innerHTML = '<div class="col-12"><p class="text-muted text-center">Không tìm thấy hình ảnh nào</p></div>';
        return;
    }

    AVAILABLE_IMAGES.forEach((image, idx) => {
        const col = document.createElement('div');
        col.className = 'image-card-bg';

        // Extract filename without extension
        const fileName = image.name || `Image ${idx + 1}`;
        col.innerHTML = `
            <img src="${image.path}" alt="${fileName}" class="img-fluid img-card-bg" onclick="SelectBackgroundImage('${image.id}', '${image.path}')">
        `;

        imageList.appendChild(col);
    });
}

/**
 * Load cài đặt hiện tại từ localStorage
 */
function LoadCurrentSettings() {
    console.log('📋 Load Current Settings');

    const settings = GetSettingsFromStorage();

    // Restore effect checkboxes từ trạng thái runtime (DB đã apply khi vào trang)
    const effectState = {
        snow: !!window.SPIN_EFFECT_FLAGS?.LeafEffect_1,
        fireworks_1: !!window.SPIN_EFFECT_FLAGS?.FireWorkEffect_1,
        fireworks_2: !!window.SPIN_EFFECT_FLAGS?.FireWorkEffect_2,
        fireworks_3: !!window.SPIN_EFFECT_FLAGS?.FireWorkEffect_3,
        fireworks_4: !!window.SPIN_EFFECT_FLAGS?.FireWorkEffect_4,
        fireworks_5: !!window.SPIN_EFFECT_FLAGS?.FireWorkEffect_5,
        fireworks_6: !!window.SPIN_EFFECT_FLAGS?.FireWorkEffect_6,
        fireworks_7: !!window.SPIN_EFFECT_FLAGS?.FireWorkEffect_7,
        bubbles: !!window.SPIN_EFFECT_FLAGS?.LeafEffect_4,
        rainbow: document.body.classList.contains('effect-rainbow'),
        stars: !!window.SPIN_EFFECT_FLAGS?.LeafEffect_3,
        particles: !!window.SPIN_EFFECT_FLAGS?.LeafEffect_2
    };

    Object.keys(effectState).forEach(effect => {
        const checkbox = document.getElementById(`effect_${effect}`);
        if (checkbox) checkbox.checked = !!effectState[effect];
    });

    // Restore background selection
    if (settings.background.type === 'video') {
        const videoItem = document.getElementById(`video-${settings.background.id}`);
        if (videoItem) {
            videoItem.classList.add('active');
        }
    } else if (settings.background.type === 'image') {
        const imageItem = document.getElementById(`image-${settings.background.id}`);
        if (imageItem) {
            imageItem.classList.add('active');
        }
    }
}

function GetEffectStateFromUI() {
    const effectState = {
        snow: false,
        fireworks_1: false,
        fireworks_2: false,
        fireworks_3: false,
        fireworks_4: false,
        fireworks_5: false,
        fireworks_6: false,
        fireworks_7: false,
        bubbles: false,
        rainbow: false,
        stars: false,
        particles: false
    };

    document.querySelectorAll('.effect-checkbox').forEach(checkbox => {
        const effect = checkbox.getAttribute('data-effect');
        if (effect && Object.prototype.hasOwnProperty.call(effectState, effect)) {
            effectState[effect] = !!checkbox.checked;
        }
    });

    return effectState;
}

function SaveEffectsToDatabase(done) {
    $.ajax({
        url: '/load_conf/',
        type: 'GET',
        data: {},
        success: function(res) {
            const d = (res && res.data) ? res.data : {};
            const confList = d.conf || [];
            const confBase = confList.length > 0 ? confList[0] : {};
            const effectState = GetEffectStateFromUI();

            const payload = {
                ConfName: d.ConfName || confBase.ConfName || 'conf_1.1',
                ConfVal: confBase.ConfVal || 'Cấu hình mặc định',
                LogoLeft: confBase.LogoLeft || '',
                LogoRight: confBase.LogoRight || '',
                Header: confBase.Header ?? 1,
                VideoShow: confBase.VideoShow || '',
                BgColorHeader: confBase.BgColorHeader || '',
                TextHeader1: confBase.TextHeader1 || '',
                TextHeader2: confBase.TextHeader2 || '',
                TextHeader3: confBase.TextHeader3 || '',
                BgMain: confBase.BgMain || '',
                BgMainMgTop: confBase.BgMainMgTop ?? 0,
                BgMainMgLeft: confBase.BgMainMgLeft ?? 0,
                BgMainWidth: confBase.BgMainWidth ?? 1,
                BgMainHeight: confBase.BgMainHeight ?? 1,
                TabLucky: confBase.TabLucky ?? '0',

                LeafEffect_1: !!effectState.snow,
                LeafEffect_2: !!effectState.particles,
                LeafEffect_3: !!effectState.stars,
                LeafEffect_4: !!effectState.bubbles,
                FireWorkEffect_1: !!effectState.fireworks_1,
                FireWorkEffect_2: !!effectState.fireworks_2,
                FireWorkEffect_3: !!effectState.fireworks_3,
                FireWorkEffect_4: !!effectState.fireworks_4,
                FireWorkEffect_5: !!effectState.fireworks_5,
                FireWorkEffect_6: !!effectState.fireworks_6,
                FireWorkEffect_7: !!effectState.fireworks_7
            };

            $.ajax({
                url: '/save_conf/',
                type: 'GET',
                data: payload,
                success: function(saveRes) {
                    if (typeof done === 'function') done(true, saveRes);
                },
                error: function(err) {
                    console.error('❌ Lưu hiệu ứng vào DB thất bại:', err);
                    if (typeof done === 'function') done(false, err);
                }
            });
        },
        error: function(err) {
            console.error('❌ Không load được cấu hình để lưu effect:', err);
            if (typeof done === 'function') done(false, err);
        }
    });
}

/**
 * Chọn video làm hình nền
 */
function SelectBackgroundVideo(videoId, videoPath) {
    console.log(`📹 Select Video: ${videoId}`);

    // Xóa active class khỏi các video/image khác
    document.querySelectorAll('#video-list .bg-item.active, #image-list .bg-item.active').forEach(el => {
        el.classList.remove('active');
    });

    // Thêm active class cho video này
    const videoItem = document.getElementById(`video-${videoId}`);
    if (videoItem) {
        videoItem.classList.add('active');
    }

    // Lưu vào localStorage
    const settings = GetSettingsFromStorage();
    settings.background = {
        type: 'video',
        id: videoId,
        path: videoPath
    };
    SaveSettingsToStorage(settings);

    // ✅ Áp dụng nền video ngay lập tức
    ApplyVideoBackground(videoPath);
}

/**
 * Chọn hình ảnh làm hình nền
 */
function SelectBackgroundImage(imageId, imagePath) {
    console.log(`🖼️ Select Image: ${imageId}`);

    // Xóa active class khỏi các video/image khác
    document.querySelectorAll('#video-list .bg-item.active, #image-list .bg-item.active').forEach(el => {
        el.classList.remove('active');
    });

    // Thêm active class cho image này
    const imageItem = document.getElementById(`image-${imageId}`);
    if (imageItem) {
        imageItem.classList.add('active');
    }

    // Lưu vào localStorage
    const settings = GetSettingsFromStorage();
    settings.background = {
        type: 'image',
        id: imageId,
        path: imagePath
    };
    SaveSettingsToStorage(settings);

    // ✅ Áp dụng nền ngay lập tức
    ApplyImageBackground(imagePath);
}

/**
 * Upload hình ảnh mới làm hình nền
 */
function UploadBackgroundImage() {
    console.log('📤 Upload Background Image');

    const fileInput = document.getElementById('bg_upload_file');
    if (!fileInput || fileInput.files.length === 0) {
        Swal.fire('Lỗi', 'Vui lòng chọn hình ảnh', 'error');
        return;
    }

    const files = Array.from(fileInput.files);
    const progressDiv = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');

    progressDiv.style.display = 'block';
    let uploadedCount = 0;

    files.forEach((file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'background');

        Show_loading();

        $.ajax({
            url: '/upload_background/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                uploadedCount++;
                const progress = Math.round((uploadedCount / files.length) * 100);
                progressBar.style.width = progress + '%';
                progressBar.textContent = progress + '%';

                if (uploadedCount === files.length) {
                    Exit_Loading();
                    Swal.fire('Thành công', 'Tải lên hình ảnh thành công!', 'success');
                    fileInput.value = '';
                    progressDiv.style.display = 'none';

                    // Reload danh sách hình ảnh
                    setTimeout(() => {
                        LoadImageList();
                        LoadCurrentSettings();
                    }, 500);
                }
            },
            error: function(error) {
                Exit_Loading();
                Swal.fire('Lỗi', 'Tải lên hình ảnh thất bại!', 'error');
                console.error('Upload error:', error);
            }
        });
    });
}

/**
 * Lưu cài đặt
 */
function SaveSettings() {
    console.log('💾 Save Settings');

    const settings = GetSettingsFromStorage();
    settings.effects = GetEffectStateFromUI();

    // Áp dụng cài đặt
    ApplySettings(settings);

    // Effect chỉ lưu vào DB (không lưu local)
    SaveEffectsToDatabase(function(ok) {
        if (ok) {
            Swal.fire('Thành công', 'Đã lưu hiệu ứng vào DB!', 'success');
        } else {
            Swal.fire('Lỗi', 'Không thể lưu hiệu ứng vào DB', 'error');
        }
    });
}

/**
 * Đặt lại mặc định
 */
function ResetSettings() {
    console.log('🔄 Reset Settings');

    Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc muốn đặt lại tất cả cài đặt về mặc định?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đặt lại',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            const defaultSettings = GetDefaultSettings();
            // Chỉ giữ local cho background, effect sẽ lưu DB
            const localSettings = GetSettingsFromStorage();
            localSettings.background = defaultSettings.background;
            SaveSettingsToStorage(localSettings);

            Object.keys(defaultSettings.effects).forEach(effect => {
                const checkbox = document.getElementById(`effect_${effect}`);
                if (checkbox) checkbox.checked = !!defaultSettings.effects[effect];
            });

            ApplySettings(defaultSettings);
            LoadCurrentSettings();

            SaveEffectsToDatabase(function(ok) {
                if (ok) {
                    Swal.fire('Thành công', 'Đã đặt lại và lưu effect vào DB!', 'success');
                } else {
                    Swal.fire('Lỗi', 'Đặt lại local xong nhưng lưu DB thất bại', 'error');
                }
            });
        }
    });
}

/**
 * Áp dụng cài đặt vào trang
 */
function ApplySettings(settings) {
    console.log('⚙️ Apply Settings', settings);

    // Áp dụng hiệu ứng
    Object.keys(settings.effects).forEach(effect => {
        if (settings.effects[effect]) {
            EnableEffect(effect);
        } else {
            DisableEffect(effect);
        }
    });

    // Áp dụng hình nền
    if (settings.background.type === 'video') {
        ApplyVideoBackground(settings.background.path);
    } else if (settings.background.type === 'image') {
        ApplyImageBackground(settings.background.path);
    }
}

/**
 * Áp dụng hình nền video
 */
function ApplyVideoBackground(videoPath) {
    console.log('📹 Apply Video Background:', videoPath);

    const video = document.getElementById('source_background_video');
    if (video) {
        video.src = videoPath;
        const videoElement = document.getElementById('background_video');
        if (videoElement) {
            videoElement.muted = true;
            videoElement.defaultMuted = true;
            videoElement.volume = 0;
            videoElement.setAttribute('muted', 'muted');
            videoElement.load();
            videoElement.play().catch(() => {});
        }
    }

    // Áp dụng vào tất cả modal
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.backgroundImage = `url('${videoPath}')`;
        modal.style.backgroundSize = 'cover';
        modal.style.backgroundPosition = 'center center';
        modal.style.backgroundRepeat = 'no-repeat';
    });
}

/**
 * Áp dụng hình nền ảnh
 */
function ApplyImageBackground(imagePath) {
    console.log('🖼️ Apply Image Background:', imagePath);

    // Áp dụng vào html, body
    document.documentElement.style.backgroundImage = `url('${imagePath}')`;
    document.documentElement.style.backgroundSize = 'cover';
    document.documentElement.style.backgroundPosition = 'center center';
    document.documentElement.style.backgroundAttachment = 'fixed';
    document.documentElement.style.backgroundRepeat = 'no-repeat';

    document.body.style.backgroundImage = `url('${imagePath}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';

    // Áp dụng vào tất cả modal
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.backgroundImage = `url('${imagePath}')`;
        modal.style.backgroundSize = 'cover';
        modal.style.backgroundPosition = 'center center';
        modal.style.backgroundRepeat = 'no-repeat';
    });
}

/**
 * Kích hoạt hiệu ứng
 */
function EnableEffect(effect) {
    console.log(`✅ Enable Effect: ${effect}`);

    switch (effect) {
        case 'snow':
            ToggleEffectElement('LeafEffect_1', true);
            break;
        case 'fireworks_1':
            ToggleEffectElement('FireWorkEffect_1', true);
            StartEffectOnce('FireWorkEffect_1', 'FireWorkEffect_1');
            document.body.classList.add('effect-fireworks');
            break;
        case 'fireworks_2':
            ToggleEffectElement('FireWorkEffect_2', true);
            StartEffectOnce('FireWorkEffect_2', 'FireWorkEffect_2');
            document.body.classList.add('effect-fireworks');
            break;
        case 'fireworks_3':
            ToggleEffectElement('FireWorkEffect_3', true);
            StartEffectOnce('FireWorkEffect_3', 'FireWorkEffect_3');
            document.body.classList.add('effect-fireworks');
            break;
        case 'fireworks_4':
            ToggleEffectElement('FireWorkEffect_4', true);
            StartEffectOnce('FireWorkEffect_4', 'FireWorkEffect_4');
            document.body.classList.add('effect-fireworks');
            break;
        case 'fireworks_5':
            ToggleEffectElement('FireWorkEffect_5', true);
            StartEffectOnce('FireWorkEffect_5', 'FireWorkEffect_5');
            document.body.classList.add('effect-fireworks');
            break;
        case 'fireworks_6':
            ToggleEffectElement('FireWorkEffect_6', true);
            StartEffectOnce('FireWorkEffect_6', 'FireWorkEffect_6');
            document.body.classList.add('effect-fireworks');
            break;
        case 'fireworks_7':
            ToggleEffectElement('FireWorkEffect_7', true);
            StartEffectOnce('FireWorkEffect_7', 'FireWorkEffect_7');
            document.body.classList.add('effect-fireworks');
            break;
        case 'bubbles':
            ToggleBubblesEffect(true);
            break;
        case 'rainbow':
            // Áp dụng cầu vồng
            document.body.classList.add('effect-rainbow');
            break;
        case 'stars':
            ToggleEffectElement('LeafEffect_3', true);
            StartEffectOnce('LeafEffect_3', 'canvas_laroi_2');
            break;
        case 'particles':
            ToggleEffectElement('LeafEffect_2', true);
            StartEffectOnce('LeafEffect_2', 'laroi_2');
            break;
    }
}

/**
 * Vô hiệu hoá hiệu ứng
 */
function DisableEffect(effect) {
    console.log(`❌ Disable Effect: ${effect}`);

    switch (effect) {
        case 'snow':
            ToggleEffectElement('LeafEffect_1', false);
            break;
        case 'fireworks_1':
            ToggleEffectElement('FireWorkEffect_1', false);
            if (!window.SPIN_EFFECT_FLAGS.FireWorkEffect_2 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_3 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_4 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_5 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_6 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_7) {
                document.body.classList.remove('effect-fireworks');
            }
            break;
        case 'fireworks_2':
            ToggleEffectElement('FireWorkEffect_2', false);
            if (!window.SPIN_EFFECT_FLAGS.FireWorkEffect_1 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_3 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_4 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_5 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_6 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_7) {
                document.body.classList.remove('effect-fireworks');
            }
            break;
        case 'fireworks_3':
            ToggleEffectElement('FireWorkEffect_3', false);
            if (!window.SPIN_EFFECT_FLAGS.FireWorkEffect_1 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_2 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_4 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_5 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_6 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_7) {
                document.body.classList.remove('effect-fireworks');
            }
            break;
        case 'fireworks_4':
            ToggleEffectElement('FireWorkEffect_4', false);
            if (!window.SPIN_EFFECT_FLAGS.FireWorkEffect_1 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_2 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_3 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_5 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_6 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_7) {
                document.body.classList.remove('effect-fireworks');
            }
            break;
        case 'fireworks_5':
            ToggleEffectElement('FireWorkEffect_5', false);
            if (!window.SPIN_EFFECT_FLAGS.FireWorkEffect_1 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_2 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_3 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_4 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_6 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_7) {
                document.body.classList.remove('effect-fireworks');
            }
            break;
        case 'fireworks_6':
            ToggleEffectElement('FireWorkEffect_6', false);
            if (!window.SPIN_EFFECT_FLAGS.FireWorkEffect_1 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_2 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_3 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_4 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_5 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_7) {
                document.body.classList.remove('effect-fireworks');
            }
            break;
        case 'fireworks_7':
            ToggleEffectElement('FireWorkEffect_7', false);
            if (!window.SPIN_EFFECT_FLAGS.FireWorkEffect_1 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_2 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_3 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_4 &&
                !window.SPIN_EFFECT_FLAGS.FireWorkEffect_5 && !window.SPIN_EFFECT_FLAGS.FireWorkEffect_6) {
                document.body.classList.remove('effect-fireworks');
            }
            break;
        case 'bubbles':
            ToggleBubblesEffect(false);
            break;
        case 'rainbow':
            document.body.classList.remove('effect-rainbow');
            break;
        case 'stars':
            ToggleEffectElement('LeafEffect_3', false);
            break;
        case 'particles':
            ToggleEffectElement('LeafEffect_2', false);
            break;
    }
}

/**
 * Lấy cài đặt mặc định
 */
function GetDefaultSettings() {
    return {
        effects: {
            snow: false,
            fireworks_1: false,
            fireworks_2: false,
            fireworks_3: false,
            fireworks_4: false,
            fireworks_5: false,
            fireworks_6: false,
            fireworks_7: false,
            bubbles: false,
            rainbow: false,
            stars: false,
            particles: false
        },
        background: {
            type: 'video',
            id: 'vd-bgtet-1',
            path: '/static/video/vd-bgtet-1.mp4'
        }
    };
}

/**
 * Lấy cài đặt từ localStorage
 */
function GetSettingsFromStorage() {
    const stored = localStorage.getItem('lottery_settings');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing settings:', e);
            return GetDefaultSettings();
        }
    }
    return GetDefaultSettings();
}

/**
 * Lưu cài đặt vào localStorage
 */
function SaveSettingsToStorage(settings) {
    localStorage.setItem('lottery_settings', JSON.stringify(settings));
    console.log('💾 Settings saved to storage:', settings);
}

let SPIN_EFFECTS_BOOTSTRAPPED = {};

window.SPIN_EFFECT_FLAGS = window.SPIN_EFFECT_FLAGS || {};

const SPIN_EFFECT_IDS = [
    'LeafEffect_1', 'LeafEffect_2', 'LeafEffect_3', 'LeafEffect_4',
    'FireWorkEffect_1', 'FireWorkEffect_2', 'FireWorkEffect_3', 'FireWorkEffect_4',
    'FireWorkEffect_5', 'FireWorkEffect_6', 'FireWorkEffect_7'
];

SPIN_EFFECT_IDS.forEach(function(id) {
    if (typeof window.SPIN_EFFECT_FLAGS[id] === 'undefined') {
        window.SPIN_EFFECT_FLAGS[id] = false;
    }
});

function SetEffectRunFlag(effectId, enabled) {
    window.SPIN_EFFECT_FLAGS[effectId] = !!enabled;
    if (!enabled) {
        const stopFnName = `Stop_${effectId}`;
        if (typeof window[stopFnName] === 'function') {
            try {
                window[stopFnName]();
            } catch (e) {
                console.warn(`Không thể dừng hiệu ứng ${effectId}:`, e);
            }
        }
    }
}

function ToggleEffectElement(effectId, enabled) {
    SetEffectRunFlag(effectId, enabled);
    const el = document.getElementById(effectId);
    if (!el) return;
    if (enabled) {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

function ToggleBubblesEffect(enabled) {
    const isOn = !!enabled;
    SetEffectRunFlag('LeafEffect_4', isOn);
    const el = document.getElementById('LeafEffect_4');
    if (!el) return;
    el.style.display = isOn ? 'block' : 'none';
}

function StartEffectOnce(effectKey, fnName) {
    if (typeof window[fnName] === 'function') {
        try {
            window[fnName]();
            SPIN_EFFECTS_BOOTSTRAPPED[effectKey] = true;
        } catch (e) {
            console.warn(`Không thể khởi tạo hiệu ứng ${effectKey}:`, e);
        }
    }
}

function ApplyCommonEffectsConfig(conf) {
    const c = conf || {};

    function toBool(value) {
        if (value === true || value === false) return value;
        if (typeof value === 'number') return value === 1;
        if (typeof value === 'string') {
            const v = value.trim().toLowerCase();
            return v === 'true' || v === '1' || v === 'yes' || v === 'on';
        }
        return false;
    }

    const isLeaf1 = toBool(c.LeafEffect_1);
    const isLeaf2 = toBool(c.LeafEffect_2);
    const isLeaf3 = toBool(c.LeafEffect_3);
    const isLeaf4 = toBool(c.LeafEffect_4);
    const isFW1 = toBool(c.FireWorkEffect_1);
    const isFW2 = toBool(c.FireWorkEffect_2);
    const isFW3 = toBool(c.FireWorkEffect_3);
    const isFW4 = toBool(c.FireWorkEffect_4);
    const isFW5 = toBool(c.FireWorkEffect_5);
    const isFW6 = toBool(c.FireWorkEffect_6);
    const isFW7 = toBool(c.FireWorkEffect_7);

    console.log('🎛️ Effect flags from config:', {
        LeafEffect_1: c.LeafEffect_1,
        LeafEffect_2: c.LeafEffect_2,
        LeafEffect_3: c.LeafEffect_3,
        LeafEffect_4: c.LeafEffect_4,
        FireWorkEffect_1: c.FireWorkEffect_1,
        FireWorkEffect_2: c.FireWorkEffect_2,
        FireWorkEffect_3: c.FireWorkEffect_3,
        FireWorkEffect_4: c.FireWorkEffect_4,
        FireWorkEffect_5: c.FireWorkEffect_5,
        FireWorkEffect_6: c.FireWorkEffect_6,
        FireWorkEffect_7: c.FireWorkEffect_7,
    });

    ToggleEffectElement('LeafEffect_1', isLeaf1);

    ToggleEffectElement('LeafEffect_2', isLeaf2);
    if (isLeaf2) StartEffectOnce('LeafEffect_2', 'laroi_2');

    ToggleEffectElement('LeafEffect_3', isLeaf3);
    if (isLeaf3) StartEffectOnce('LeafEffect_3', 'canvas_laroi_2');

    ToggleBubblesEffect(isLeaf4);

    ToggleEffectElement('FireWorkEffect_1', isFW1);
    if (isFW1) StartEffectOnce('FireWorkEffect_1', 'FireWorkEffect_1');

    ToggleEffectElement('FireWorkEffect_2', isFW2);
    if (isFW2) StartEffectOnce('FireWorkEffect_2', 'FireWorkEffect_2');

    ToggleEffectElement('FireWorkEffect_3', isFW3);
    if (isFW3) StartEffectOnce('FireWorkEffect_3', 'FireWorkEffect_3');

    ToggleEffectElement('FireWorkEffect_4', isFW4);
    if (isFW4) StartEffectOnce('FireWorkEffect_4', 'FireWorkEffect_4');

    ToggleEffectElement('FireWorkEffect_5', isFW5);
    if (isFW5) StartEffectOnce('FireWorkEffect_5', 'FireWorkEffect_5');

    ToggleEffectElement('FireWorkEffect_6', isFW6);
    if (isFW6) StartEffectOnce('FireWorkEffect_6', 'FireWorkEffect_6');

    ToggleEffectElement('FireWorkEffect_7', isFW7);
    if (isFW7) StartEffectOnce('FireWorkEffect_7', 'FireWorkEffect_7');
}

function LoadCommonEffectsForSpinPage() {
    $.ajax({
        url: '/load_conf/',
        type: 'GET',
        data: {},
        success: function(res) {
            const d = (res && res.data) ? res.data : {};
            const confList = d.conf || [];
            const conf = confList.length > 0 ? confList[0] : {};
            ApplyCommonEffectsConfig(conf);
        },
        error: function(err) {
            console.warn('Không tải được cài đặt hiệu ứng chung:', err);
        }
    });
}

function HideAllSpinEffects() {
    SPIN_EFFECT_IDS.forEach(function(id) {
        ToggleEffectElement(id, false);
    });
}

/**
 * Khởi tạo cài đặt khi trang load
 */
$(document).ready(function() {
    console.log('🚀 Initializing Settings on page load');

    const isSpinPage = window.location.pathname.indexOf('/spin') === 0;

    if (isSpinPage) {
        // Vào trang quay: mặc định tắt toàn bộ hiệu ứng, chỉ bật theo cấu hình đã lưu trên server
        HideAllSpinEffects();
        LoadCommonEffectsForSpinPage();
    } else {
        // Các trang settings khác vẫn giữ hành vi localStorage cũ
        const settings = GetSettingsFromStorage();
        ApplySettings(settings);
    }

    // Khi modal Settings mở
    $('#Modal_Setting').on('shown.bs.modal', function() {
        console.log('📭 Modal Settings opened');
        InitializeSettings();
    });

    // Bật/tắt hiệu ứng trực tiếp ngay khi đổi switch trong modal
    $(document).on('change', '.effect-checkbox', function(e) {
        if (!e.originalEvent) return;
        const settings = GetSettingsFromStorage();
        settings.effects = GetEffectStateFromUI();
        const changedEffect = $(this).attr('data-effect');
        if (changedEffect === 'bubbles') {
            ToggleBubblesEffect(this.checked);
        }
        ApplySettings(settings);
    });

    // Spin page đã được xử lý ở block trên
});