<template>
    <ImageViewer
        ref="ImageViewer"
        v-show="visible"
        :onClose='onClose'
        :initialIndex="index"
        :urlList="urlList"
    />
</template>

<script>
    import { Image } from 'element-ui'
    const ImageViewer = Image.components.ImageViewer;
    export default {
        components: {
            ImageViewer
        },
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            index: {
                type: Number,
                default: 0
            },
            urlList: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            index: 'resetIndex'
        },
        methods: {
            // 重置当前选中图片索引
            resetIndex() {
                let self = this.$refs.ImageViewer;
                if (!self) return;
                self.$set(self, 'index', this.index)
            },
            
            // 关闭时同步状态
            onClose() {
                this.$emit('update:visible', false);
            }
        }
    }
</script>