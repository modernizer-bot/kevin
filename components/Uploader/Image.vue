<template>
    <div class="UploadImage">
        <!-- 图片上传触发 -->
        <input type="file" 
            :multiple="multiple" 
            v-show="false" 
            :accept="accept" ref="fileInput"
            @change="handleFileChange"
        />
        <!-- 图片列表 -->
        <ul class="UploadImage-List clearfix">
            <li class="UploadImage-Item"
                v-for="(item, k) in fileList"
                :key="k"
                :style="itemStyle"
                v-loading="item.status=='upload'"
            >
                <img :src="item.url" />

                <!-- 重新上传 -->
                <div class="UploadImage-overlay" 
                    v-if="item.status=='error' || item.status=='ready' "
                >
                    <span v-if="item.status=='error'" class="error">上传失败</span>
                    <span v-else>等待中...</span>
                </div>

                <!-- 移除 -->
                <a href="javascript:;" 
                    class="UploadImage-remove"
                    v-show="item.status=='error' || item.status=='success'"
                    @click="removeFile(k)"
                >
                    <i class="el-icon-error" />
                </a>
            </li>

            <!-- 图片上传按键 -->
            <li class="UploadImage-Item UploadImage-add" 
                v-show="isShowAdd"
                :style="itemStyle"
                @click="handleClick" 
            >
                <i class="el-icon-plus UploadImage-icon" />
            </li>
        </ul>
        
    </div>
</template>


<script>
    import fileHelper from './fileHelper'
    import workersQueue from './workersQueue';

    export default {
        
        model: {
            prop: 'value',
            event: 'input'
        },

        props: {
            // 图片列表
            value: { type: Array, default: () => [] },
            // 其它数据
            data: Object,
            // 宽度
            width: { type: Number, default: 100 },
            // 高度
            height: { type: Number, default: 100 },
            // 文件类型
            accept: { type: Array, default: () => ['.jpg','.jpeg','.png','.gif','.bmp'] },
            // 开启多文件选择
            multiple: { type: Boolean, default: true },
            // 文件数据限制
            fileNumber: { type: Number, default: 10 },
            // 占位图标
            icon: { type: String, default: 'el-icon-plus' },
            // 文件上传大小限制, 单位 MB
            fileSize: { type: Number, default: 2 },
            // 同步上传并发
            parallel: { type: Number, default: 1 },
            // 是否压缩图片
            isCompress: { type: Boolean, default: false },
            // 压缩图片配置
            compress: {
                type: Object,
                default: () => {
                    return {
                        // 最大宽度
                        maxWidth: 1200,
                        // 最大高度
                        maxHeight: 0,
                        // 生成图片的格式 jpeg || png
                        outputType: "jpeg",
                        // 生成图片的质量 0.1 - 1
                        outputSize: 0.9
                    }
                }
            }
        },

        data() {
            return {
                // 文件列表
                fileList: []
            }
        },

        computed: {

            // 缩略图展示大小
            itemStyle() {
                const { width, height } = this;
                return {
                    width: width + 'px',
                    height: height + 'px',
                }
            },

            // 文件数量
            total() {
                return this.fileList.length;
            },

            // 是否显示上传按键
            isShowAdd() {
                return this.total < this.fileNumber;
            }


        },

        mounted() {
            this._createRequestWork()
                ._initFileList();

        },

        methods: {
            
            // 创建上传请求任务
            _createRequestWork() {
                let tasks = [];
                for (let i = 0; i < this.parallel; i++) tasks.push(this.uploadFile);
                this.WorkQueue = new workersQueue(tasks);
                return this;
            },

            // 初始化文件列表
            _initFileList() {
                this.value.forEach(url => {
                    this.fileList.push({
                        url: url,
                        status: 'success'
                    });
                })
            },

            // 点击上传
            handleClick(e) {
                this.$refs.fileInput.click();
            },

            // 文件选择
            handleFileChange(event) {
                const $fileInput = this.$refs.fileInput;
                const files = fileHelper.toFileList($fileInput.files);
                
                // 可上传文件数
                if (this.total + files.length > this.fileNumber)  {
                    let msg = `最多还可以添加 ${ this.fileNumber - this.total } 张图片`
                    return this.$message.error(msg);
                }

                files.forEach( this.handleFile );
                $fileInput.value = '';
            },

            // 处理文件
            async handleFile(file) {
                if (file.size > fileHelper.toByte(this.fileSize)) {
                    let msg = `${ file.name } 超出 ${ this.fileSize }MB 限制，已被过滤`;
                    setTimeout(() => this.$message.error(msg));
                    return;
                }

                const fileItem = {
                    file,
                    url: fileHelper.toBlobUri(file),
                    status: 'ready'
                }

                this.fileList.push(fileItem);

                await this.WorkQueue.add(fileItem)
            },

            // 删除文件
            removeFile(index) {
                this.fileList.splice(index, 1);
                this.asyncValue();
            },

            // 同步数据
            asyncValue() {
                const data = this.fileList.filter(item => item.status=='success').map(({id, url}) => {
                    return { id, url }
                });
                this.$emit('input', data);
                this.$emit('change', data)
            },

            // 上传文件
            async uploadFile(fileItem) {
                fileItem.status = 'upload';

                // 压缩图片
                if (this.isCompress) {
                    await fileHelper.compress(fileItem.file, this.compress).then(img => {
                        fileItem.file = img;
                    }).catch(err => {
                        console.log(err)
                    });
                }
                
                // 表单数据
                const formData = new FormData();
                formData.append('file', fileItem.file);
                if (this.data) {
                    for (const key in this.data) {
                        formData.append(key, this.data[key]);
                    }
                }

                await this.$api.Uploader.Image(formData).then(res => {
                    fileItem.status = 'success';
                    fileItem.url = res.realName;
                    fileItem.id = res.id;
                    this.asyncValue();
                }).catch(err => {
                    fileItem.status = 'error';
                })
                
                this.uploading = false;
            }

        }
        
    }
</script>


<style lang="scss" scoped>
    .UploadImage {
        position: relative;
        line-height: 1;
        overflow: hidden;

        &-List {
            font-size: 0;
            display: flex;
            flex-wrap: wrap;
            margin-left: -5px;
            margin-top: -5px;
        }

        &-Item {
            position: relative;
            flex-shrink: 0;
            border: 1px solid $--border-color-base;
            margin-top: 5px;
            margin-left: 5px;
            overflow: hidden;
            box-sizing: border-box;
            padding: 1px;
            transition: .3s;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
            &:hover {
                border-color: $--color-primary;
            }
        }

        &-overlay, &-add {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        &-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: rgba(#fff, 0.8);
            color: $--color-text-regular;
            [class^='el-icon'] {
                font-size: 24px;
            }
            span {
                margin-top: 5px;
                font-size: 12px;
                &.error {
                    color: $--color-danger;
                }
            }
        }

        &-add {
            color: $--color-text-secondary;
            border-style: dashed;
            cursor: pointer;
            &:hover {
                color: $--color-primary;
            }
        }

        &-icon {
            font-size: 24px;
        }

        &-remove {
            position: absolute;
            top: 4px;
            right: 4px;
            font-size: 16px;
            color: $--color-text-primary;
            opacity: 0.5;
            transition: .3s;
            &:hover {
                opacity: 1;
            }
        }

    }
</style>