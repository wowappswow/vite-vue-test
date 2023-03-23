<script setup>
    import { ref, watch, onMounted } from 'vue';

    const agent = ref();

    function isWebview() {
        var useragent = navigator.userAgent;
        var rules = ['WebView','(iPhone|iPod|iPad)(?!.*Safari\/)','Android.*(wv|\.0\.0\.0)'];
        var regex = new RegExp(`(${rules.join('|')})`, 'ig');
        return Boolean(useragent.match(regex));
    }

    onMounted(() => {
        agent.value = window.navigator.userAgent;
    });
</script>

<template>
    <div>
        Your user agent is :
        <div>
            {{agent}}
        </div>
        <div>
            is webview : {{isWebview()}}
        </div>
        <br/>
        <div>
            test how input with type file in difference deivece work.

            <input type="file" class="form-control"/>
        </div>
    </div>
</template>