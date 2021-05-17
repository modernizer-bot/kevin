<template>
    <div class="UploadAvatar" 
        :style="{ 'width': width+'px', 'height': height+'px' }"
        v-loading="uploading"
        @click="handleClick"
    >
        <!-- 图片 -->
        <img :src="currentValue" v-if="currentValue">
        <!-- 文件上传触发 -->
        <input type="file" 
            :multiple="false" 
            v-show="false" 
            :accept="accept" ref="fileInput"
            @change="handleFileChange"
        />

        <!-- 占位 -->
        <div class="UploadAvatar-overlay" v-show="!currentValue">
            <i :class="icon" class="UploadAvatar-icon" />
            <span v-if="tips">{{ tips }}</span>
        </div>

        <!-- 裁剪图片 -->
        <Cropper 
            v-if="isCrop"
            ref="Cropper"
            :config="cropperConf"
            @crop="handlerCrop"
        />
    </div>
</template>


<script>
    import Cropper from './Cropper';
    import fileHelper from './fileHelper'

    export default {
        
        components: {
            Cropper
        },

        model: {
            prop: 'value',
            event: 'input'
        },

        props: {
            // 图片URL
            value: String,
            // 上传请求
            request: Function,
            // 其它数据
            data: Object,
            // 宽度
            width: { type: Number, default: 100 },
            // 高度
            height: { type: Number, default: 100 },
            // 文件类型
            accept: { type: Array, default: () => ['.jpg','.jpeg','.png','.gif','.bmp'] },
            // 是否开启切图
            isCrop: { type: Boolean, default: true },
            // 占位图标
            icon: { type: String, default: 'el-icon-plus' },
            // 上传提示
            tips: String,
            // 文件上传大小限制, 单位 MB
            fileSize: { type: Number, default: 2 },
            // 图片裁剪尺寸
            cropWidth: { type: Number, default: 256 },
            cropHeight: { type: Number, default: 256 },
            // 是否固定裁剪框大小
            fixedBox: { type: Boolean, default: true }, 
            // 图片输出类型
            outputType: { type: String, default: 'png' }
        },

        data() {
            return {
                currentValue: this.value,
                // 上传状态
                uploading: false,
                // 裁剪图片配置
                cropperConf: {
                    mode: '100% auto',
                    outputType: this.outputType,
                    autoCropWidth: this.cropWidth,
                    autoCropHeight: this.cropHeight,
                    full: false,
                    fixed: false,
                    fixedBox: this.fixedBox,
                    centerBox: true,
                }
            }
        },

        watch: {
            value(val) {
                this.currentValue = val;
            }
        },

        methods: {
            
            // 点击上传
            handleClick(e) {
                this.$refs.fileInput.click();
            },

            // 文件选择
            handleFileChange(event) {
                const $fileInput = this.$refs.fileInput;
                const file = $fileInput.files[0];
                $fileInput.value = '';
                if (this.isCrop) {
                    this.$refs.Cropper.show(file)
                } else {
                    this.uploadFile(file);
                }
            },

            // 监听文件裁剪完成
            handlerCrop(file) {
                this.$refs.Cropper.hide();
                this.uploadFile(file);
            },

            // 上传文件
            async uploadFile(file) {

                if (file.size > fileHelper.toByte(this.fileSize)) {
                    throw new Error(`文件超出 ${ this.fileSize }MB 限制`)
                }

                if (!this.request) {
                    return this.$message.error('未定义上传请求回调');
                }

                this.uploading = true;
                const formData = new FormData();
                formData.append('file', file);

                if (this.data) {
                    for (const key in this.data) {
                        formData.append(key, this.data[key]);
                    }
                }

                await this.request(formData).then(res => {
                    this.currentValue = res.realName;
                    this.$emit('input', res.realName );
                    this.$emit('change', res);
                }).catch(err => {
                    // this.$message.error('上传失败')
                })
                this.uploading = false;
            }
        }
        
    }
</script>


<style lang="scss" scoped>
    .UploadAvatar {
        position: relative;
        line-height: 1;
        font-size: 0;
        border: 1px dashed $--border-color-base;
        box-sizing: border-box;
        overflow: hidden;
        transition: .3s;
        cursor: pointer;
        color: $--color-text-secondary;
        padding: 1px;

        &:hover {
            color: $--color-primary;
            border-color: $--color-primary;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }

        &-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            span {
                margin-top: $--space-sm;
            }
        }

        &-icon {
            font-size: 24px;
        }
    }
</style>