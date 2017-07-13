<template>
    <div>
        <keep-alive v-if="$route.meta.keepAlive">
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>


<script type="text/javascript">
    // import FastClick from 'fastclick';
    // import "./libs/autosize.js";
    import 'phaser';
    export default {
        name: 'app',
        data (){
            return {}
        }
    }
</script>

<style lang="sass">

</style>