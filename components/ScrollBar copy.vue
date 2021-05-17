<template>
    <div class="ScrollBar">
        <div class="ScrollBar-Wrapper" ref="Wrapper" @scroll.passive="handlerScroller">
            <slot />
        </div>
        <div class="ScrollBar-box" v-show="docHeight > winHeight">
            <div class="ScrollBar-slider" :class="{ isActive }" :style="setSliderStyle" @mousedown="onMouseDown" />
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ScrollBar',

        data() {
            return {
                size: 0,
                // 可视高度
                winHeight: 0,
                // 内容高度
                docHeight: 0,
                // 当前位置
                sliderTop: 0,
                // 滚动滑块
                startY: 0,
                startTop: 0,
                // 滑块激活状态
                isActive: false,
                // client
                clientY: 0,
            }
        },

        computed: {
            
            // 滑块高度
            sliderHiehgt() {
                const { docHeight, winHeight } = this;
                let sliderHiehgt = winHeight / ( docHeight / winHeight );
                return sliderHiehgt < 18 ? 18 : sliderHiehgt
            },

            setSliderStyle() {
                return {
                    transform: `translateY(${ this.sliderTop }px)`,
                    height: `${ this.sliderHiehgt }px`
                }
            }
        },

        beforeMount() {
            this.size = this.getScrollWidth();
        },
        
        mounted() {
            this.__WrapperResize();
        },

        beforeDestroy() {
            clearInterval(this.__timer);
        },
        
        methods: {
         
            // 获取滚动条宽度
            getScrollWidth() {
                let wrapper = document.createElement('div');
                Object.assign(wrapper.style, { width: '100px', height: '100px', overflow: 'hidden', 'overflow-y': 'scroll' });
                let body = document.createElement('div');
                Object.assign(body.style, { width: '100%', height: '200px' });
                wrapper.appendChild(body);
                document.body.appendChild(wrapper)
                let width = 100 - body.offsetWidth
                document.body.removeChild(wrapper);
                return width;
            },

            // 定时更新容器尺寸
            __WrapperResize() {
                clearInterval(this.__timer);
                this.__timer = setInterval(this.__getWrapperSize, 500);
                this.__getWrapperSize();
            },
            
            // 获取容器尺寸
            async __getWrapperSize() {
                let wrapper = this.$refs.Wrapper;
                this.winHeight = wrapper.offsetHeight;
                this.docHeight = wrapper.scrollHeight;
            },

            // 滚动到指定元素
            scrollToElem(elem) {
                const $elem = document.querySelector(elem);
                if ($elem) {
                    $elem.scrollIntoView()
                }
            },
            
            // 监听滚动条滚动
            handlerScroller(event) {
                const { docHeight, winHeight, top, sliderHiehgt } = this;
                let wrapper = this.$refs.Wrapper;
                this.sliderTop = (winHeight - sliderHiehgt)/(docHeight - winHeight) * wrapper.scrollTop;
            },

            // 滚动到底部
            scrollToBottom() {
                this.$refs.Wrapper.scrollTo({
                    left: 0,
                    top: this.docHeight,
                    behavior: 'smooth'
                })
            },

            // 按键滑块
            onMouseDown(event) {
                this.startY = event.clientY;
                this.startTop = this.$refs.Wrapper.scrollTop;
                this.isActive = true;
                // 监听鼠标移动
                document.addEventListener('mousemove', this.onMouseMove, false);
                // 监听鼠标抬起
                document.addEventListener('mouseup', this.onMouseUp, false);
            },

            // 监听滑块拖动
            onMouseMove(event) {
                let move = event.clientY - this.startY;
                this.$refs.Wrapper.scroll(0, this.startTop + ( move / this.winHeight * this.docHeight ) );
            },

            // 抬起鼠标
            onMouseUp(event) {
                this.isActive = false;
                document.removeEventListener('mousemove', this.onMouseMove, false);
                document.removeEventListener('mouseup', this.onMouseUp, false);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .ScrollBar {
        position: relative;
        height: 100%;
        overflow: hidden;
        &-Wrapper {
            height: 100%;
            overflow: hidden;
            overflow-y: scroll;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            &::-webkit-scrollbar {
                width: 0;
                height: 0;
                display: none;
            }
        }

        &-Body {
            position: relative;
            height: 100%;
        }

        &-box {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 12px;
            user-select: none;
        }
        
        &-slider {
            opacity: 0;
            position: absolute;
            top: 0;
            right: 2px;
            width: 6px;
            margin-left: -4px;
            border-radius: 10px;
            background-color: rgba(0,0,0,0.2);
            transition: background-color .3s, opacity .3s;
        }
        &:hover &-slider {
            opacity: 1;
        }
        &-slider.isActive, &-slider:hover {
            opacity: 1;
            background-color: rgba(0,0,0,0.6);
        }
    }
</style>