<script setup>
    import { onMounted } from 'vue';

    const props = defineProps({
        setVideo : {
            type : Function,
            default : () => {}
        },
        setCanvas : {
            type : Function,
            default : () => {}
        },
        isVideoOpen : {
            type : Boolean,
            default : true
        },
        isCanvasOpen : {
            type : Boolean,
            default : false
        }
    })

    onMounted(() => {
        props.setVideo(document.getElementById('video'));
        props.setCanvas(document.getElementById('canvas'));
    });

</script>

<template>
    <div id="media">
        <video id="video" playsinline autoplay style="max-height:100%;" v-show="isVideoOpen" class="width-fill"></video>
        <canvas id="canvas" style="max-height:100%;" v-show="isCanvasOpen" class="width-fill"></canvas>
    </div>
</template>