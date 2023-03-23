<script setup>
import { ref, watch, toRef, onMounted } from 'vue';
import VideoStream from './videoStream.vue';

// Props
const props = defineProps({
    msg: String,
})

// Internal Variable
const video = ref(null);
const canvas = ref(null);
const mediaStreams = ref(null);
const imgData = ref(null);
const cameraDirection = ref('environment');
const cameraConstraints = ref({
    audio: false,
    video: {
        frameRate: { min: 1.0, max: 60.0 },
        facingMode: cameraDirection.value,
        //width : document.body.clientWidth,
        // width: { ideal: 1936 },
        // height: { ideal: 2592 },
        width: {
            min: 480,
            ideal: 640,
            max: 800
        },
        height: {
            min: 360,
            ideal: 480,
            max: 600
        },
        aspectRatio: (4 / 3),
        resizeMode: "none",//crop-and-scale
    },
});
const isVideoOpen = ref(true);
const isCanvasOpen = ref(false);

const mediaStreamsMsg = ref({
    height: '',
    width: ''
});
const videoStreamsMsg = ref({
    height: '',
    width: ''
});
const canvasStreamsMsg = ref({
    height: '',
    width: ''
});
const devicePixelRatios = ref(window.devicePixelRatio);

// -------- Life Cycle --------
onMounted(() => {
    initNavigator();
    getCamStream();
});

// -------- Methods --------
const setVideo = (val) => { video.value = val; }
const setCanvas = (val) => { canvas.value = val; }
const initNavigator = () => {
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            var getUserMedia =
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
            if (!getUserMedia) {
                return Promise.reject(
                    new Error("當前版本瀏覽器不支援該功能，請先進行更新後繼續使用，謝謝。")
                );
            }
            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        };
    }
};
const getCamStream = async () => {
    await window.navigator.mediaDevices
        .getUserMedia(cameraConstraints.value)
        .then((res) => camPromiseResolve(res, video.value))
        .catch(camPromiseReject);
};
const setCanvasFromVideo = () => {
    const {width, height, aspectRatio} = video.value.srcObject.getTracks()[0].getSettings();
    console.log(width, height)

    videoStreamsMsg.value.width = width;
    videoStreamsMsg.value.height = height;
    canvasStreamsMsg.value.width = width;
    canvasStreamsMsg.value.height = height;

    const ctx = canvas.value.getContext('2d');
    canvas.value.width = (width);
    canvas.value.height = (height);
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(1, 1);
    ctx.drawImage(video.value, 0, 0, width, height);
    ctx.restore();
};
const getCamMode = () => {
    isVideoOpen.value = true;
    isCanvasOpen.value = false;
};
const getEditMode = () => {
    isVideoOpen.value = false;
    isCanvasOpen.value = true;
};

// -------- CallBack Function --------
function camPromiseResolve(res, dom) {
    mediaStreams.value = res;

    let { width, height, aspectRatio } = mediaStreams.value.getTracks()[0].getSettings();
    console.log(mediaStreams.value.getTracks()[0].getSettings())

    mediaStreamsMsg.value.width = width;
    mediaStreamsMsg.value.height = height;

    try {
        //dom.width = width/aspectRatio ;
        //dom.height = height/aspectRatio;
        dom.srcObject = mediaStreams.value;
        alert(`${dom.width} ,${dom.height}`)
    } catch {
        dom.src =
            (window.URL && window.URL.createObjectURL(mediaStreams.value)) ||
            mediaStreams.value;
    } finally {
        dom.play();
    }

    console.log(dom.videoHeight );
};
function camPromiseReject(err) {
    alert('執行錯誤 : ' + '您的裝置沒有提供可以進行拍攝的設備');
};

// -------- Event --------
async function onSnap($event) {
    console.log(isCanvasOpen.value)

    if (video.value) {
        try {
            video.value.pause();
            setCanvasFromVideo();
            await mediaStreams.value.getTracks().forEach((track) => {
                track.stop();
            });

            getEditMode();
        }
        catch (err) {
            console.error('相機尚未準備好');
        }
    }
    getEditMode();
}
function onCancel($event) {
    getCamStream();
    getCamMode();
}
async function onToggle($event) {
    $event.target.disabled = true;

    if (mediaStreams.value) {
        await mediaStreams.value
            .getTracks()
            .forEach((track) => { track.stop() });
    }

    switch (cameraDirection.value) {
        case 'environment':
            cameraConstraints.value.video.facingMode = 'user';
            cameraDirection.value = 'user';
            await navigator.mediaDevices.enumerateDevices().then(function (devices) {
                devices = devices.filter(function (device) { return device.kind === 'videoinput' })  // 檢測出攝影裝置
                // 針對安卓 9 系統別做設定
                if (navigator.userAgent.toLowerCase().indexOf("android") > 0) {
                    for (let i = 0; i < devices.length; i++) {
                        let device = devices[i];
                        if (device.label) {
                            if (device.label.split(',')[1] === 'facing front') {
                                cameraConstraints.video = { deviceId: { 'exact': device.deviceId } };
                                break;
                            }
                        }
                    }
                }
            });
            await getCamStream();
            break;

        case 'user':
            cameraConstraints.value.video.facingMode = 'environment';
            cameraDirection.value = 'environment';
            await getCamStream();
            break;

        default: break;
    }

    $event.target.disabled = false;
}
function onCaptrue($event){
    imgData.value = canvas.value.toDataURL();
}

</script>

<template>
    <div id="camera" style="overflow-y: scroll;overflow-x: clip;" class="pb-5">
        <div class="d-flex flex-column vw-100 vh-100" style="background-color: #FFF">
            <VideoStream :set-video="setVideo" :set-canvas="setCanvas" :is-canvas-open="isCanvasOpen"
                :is-video-open="isVideoOpen"></VideoStream>
            <div id="control" class="d-flex justify-content-around">
                <button type="button" class="btn btn-primary" v-on:click="onSnap">Snap</button>
                <button type="button" class="btn btn-primary" v-on:click="onCancel">Cancel</button>
                <button type="button" class="btn btn-primary" v-on:click="onToggle">Toggle</button>
                <button type="button" class="btn btn-primary" v-on:click="onCaptrue">To IMG</button>
            </div>
            <div class="d-flex flex-column align-items-center mt-3">
                <div class="d-flex">
                    目前 mediaStreams 資訊-->
                    <p class="mb-0">width : {{ mediaStreamsMsg?.width }}</p>,
                    <p class="mb-0">height : {{ mediaStreamsMsg?.height }}</p>
                </div>
                <div class="d-flex">
                    目前 videoStreams 資訊-->
                    <p class="mb-0">width : {{ videoStreamsMsg?.width }}</p>,
                    <p class="mb-0">height : {{ videoStreamsMsg?.height }}</p>
                </div>
                <div class="d-flex">
                    目前 canvasStreams 資訊-->
                    <p class="mb-0">width : {{ canvasStreamsMsg?.width }}</p>,
                    <p class="mb-0">height : {{ canvasStreamsMsg?.height }}</p>
                </div>
                <div class="d-flex">
                    目前 devicePixelRatio 資訊-->
                    <p class="mb-0">ratio : {{ devicePixelRatios }}</p>
                </div>
            </div>
            <div id="resultContainer" class="rounded position-relative" style="height : 300px; width : max-content; margin : auto; max-width: 100%;">
                <img id="result-img-data"
                    :src="imgData"
                    alt="upload img result"
                    class="h-100 rounded w-100"
                    style="object-fit: contain;" />
            </div>
        </div>
    </div>
</template>

<style>
.width-fill{
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }
</style>