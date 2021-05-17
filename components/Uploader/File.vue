<template>
    <div class="UploadFile">
        <!-- 图片上传触发 -->
        <input type="file" 
            :multiple="multiple" 
            v-show="false" 
            :accept="accept" ref="fileInput"
            @change="handleFileChange"
        />

        <!-- 拖拽文件 -->
        <div class="UploadFile-Drop"
            :class="dropStatus"
            @dragover.prevent
            @dragenter.prevent="status = 'enter'"
            @dragleave.prevent="status = 'leave'"
            @drop.prevent="handleDrop"
            @click="handleClick"
            v-if="fileList.length===0"
        >
            <i class="el-icon-upload" />
            <p>将文件拖到此处或点击选择文件<br />支持 {{ accept.join("、") }} 后缀格式<br />且不超过 {{ fileSize }}MB</p>
        </div>

        <!-- 文件列表 -->
        <div class="UploadFile-Wrapper" v-else>
            <div class="UploadFile-Tools">
                <el-button size="mini" type="primary" plain @click="handleClick">添加文件</el-button>
                    <!-- <el-button type="primary" size="mini">开始上传</el-button> -->
                <span>{{ total }}/{{ fileNumber }}</span>
            </div>


            <ScrollBar class="UploadFile-List">

                <div class="UploadFile-Item" 
                    v-for="(item, k) in fileList" 
                    :key="k"
                    @mouseenter="activeIndex=k"
                    @mouseleave="activeIndex=null"
                >
                    <span class="UploadFile-Item_icon">
                        <Icon :name="item.type|fileType" size="48" />
                    </span>
                    <div class="UploadFile-Item_container">
                        <p>{{ item.name }}</p>
                        <span>大小：{{ $helper.byteToUnit(item.size) }}</span>
                        <!-- <span>进度：100%</span> -->
                    </div>
                    <a href="javascript:;" class="UploadFile-Item_status">
                        <!-- 完成 -->
                        <i class="el-icon-circle-check success" 
                            v-if="item.status=='success'"
                            v-show="activeIndex!==k"
                        />
                        <!-- 上传中 -->
                        <i class="el-icon-loading upload" 
                            v-else-if="item.status=='upload'"
                        />
                        <!-- 准备上传 -->
                        <i class="el-icon-time ready" 
                            v-else-if="item.status=='ready'"
                            v-show="activeIndex!==k"
                        />
                        <!-- 删除, 完成，准备，滑过时显示，失败状态下显示， 上传状态不显示-->
                        <i class="el-icon-circle-close error"
                            v-if="item.status!=='upload'"
                            v-show="item.status=='error' || activeIndex==k"
                            @click="removeFile(k)"
                        />
                    </a>
                    <!-- 进度条 -->
                    <div class="UploadFile-Item_progress" style="width: 30%" />
                </div>

                <!-- <div class="UploadFile-Item">
                    <span class="UploadFile-Item_icon">
                        <Icon name="pdf" size="48" />
                    </span>
                    <div class="UploadFile-Item_container">
                        <p>文件名.jpg</p>
                        <span>大小：12MB</span>
                        <span>进度：100%</span>
                    </div>
                    <a href="javascript:;" class="UploadFile-Item_status">
                        <i class="el-icon-circle-check success" />
                    </a>
                    <div class="UploadFile-Item_progress" style="width: 50%" />
                </div> -->

                <!-- <div class="UploadFile-Item">
                    <span class="UploadFile-Item_icon">
                        <Icon name="doc" size="48" />
                    </span>
                    <div class="UploadFile-Item_container">
                        <p>文件名.jpg</p>
                        <span>大小：{{ $helper.byteToUnit(10241021) }}</span>
                        <span>进度：100%</span>
                    </div>
                    <a href="javascript:;" class="UploadFile-Item_status">
                        <i class="el-icon-circle-close error" />
                    </a>
                    <div class="UploadFile-Item_progress" style="width: 0%"></div>
                </div> -->

                <!-- <div class="UploadFile-Item">
                    <span class="UploadFile-Item_icon">
                        <Icon name="unknown" size="48" />
                    </span>
                    <div class="UploadFile-Item_container">
                        <p>文件名.jpg</p>
                        <span>文件大小：12MB</span>
                        <span>上传进度：100%</span>
                    </div>
                    <a href="javascript:;" class="UploadFile-Item_status">
                        <i class="el-icon-loading upload" />
                    </a>
                </div> -->
            </ScrollBar>
        </div>
    </div>
</template>

<script>
    import fileHelper from './fileHelper'
    import workersQueue from './workersQueue';
    import Icon from '../Icon'
    import '@/assets/icons/svg/files/unknown.svg'
    import '@/assets/icons/svg/files/doc.svg'
    import '@/assets/icons/svg/files/xls.svg'
    import '@/assets/icons/svg/files/ppt.svg'
    import '@/assets/icons/svg/files/pdf.svg'
    import '@/assets/icons/svg/files/zip.svg'
    import '@/assets/icons/svg/files/mp4.svg'

    export default {

        components: {
            Icon,
        },

        model: {
            prop: 'value',
            event: 'input'
        },

        props: {
            // 图片列表
            value: Array,
            // 文件类型
            accept: { type: Array, default: () => ['.pdf','.doc','.docx','.xls','.xlsx'] },
            // 开启多文件选择
            multiple: { type: Boolean, default: true },
            // 文件数据限制
            fileNumber: { type: Number, default: 10 },
            // 文件上传大小限制, 单位 MB
            fileSize: { type: Number, default: 50 },
            // 同步上传并发
            parallel: { type: Number, default: 5 },
        },

        data() {
            return {
                // 拖拽状态
                dropStatus: 'leave',
                // 文件列表
                fileList: [],
                // 当前滑入的行
                activeIndex: null
            }
        },


        filters: {
            fileType(ext) {
                let types = ['doc','xls','ppt','zip','pdf','mp4'];
                if (types.includes(ext)) {
                    return ext;
                } else if (ext=='docx') {
                    return 'doc'
                } else if (ext=='xlsx') {
                    return 'xls'
                } else if (ext=='pptx') {
                    return 'ppt'
                } else if (ext=='rar') {
                    return 'zip'
                } else {
                    return 'unknown'
                }
            }
        },

        computed: {

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
            this._createRequestWork()._initFileList();
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
                        name: '文件名.jpg',
                        size: 0,
                        type: 'png',
                        status: 'success'
                    });
                })
            },

            // 删除文件
            removeFile(index) {
                let file = this.fileList[index];
                if (file.status==='success') {
                    this.$confirm('确定删除该文件？如要再次添加请重新上传', '提示', { type: 'warning' }).then(res => {
                        this.fileList.splice(index, 1);
                    }).catch(err => {})
                    return;
                }
                this.fileList.splice(index, 1);
                this.asyncValue();
            },

            // 同步数据
            asyncValue() {
                let data = this.fileList.filter(item => item.status=='success');
                data = data.map(({ url, name, size, type }) => {
                    return { url, name, size, type }
                });
                this.$emit('input', data);
            },

            // 点击选择文件
            handleClick() {
                this.$refs.fileInput.click();
            },

            // 获取点击选择文件
            handleFileChange() {
                const $fileInput = this.$refs.fileInput;
                const files = fileHelper.toFileList($fileInput.files);
                this.handleFile(files);
                $fileInput.value = '';
            },

            // 拖拽放入文件
            handleDrop(event) {
                this.dropStatus = 'leave';
                const files = fileHelper.toFileList(event.dataTransfer.files);
                this.handleFile(files);
            },

            handleFile(files) {
                // 可上传文件数
                if (this.total + files.length > this.fileNumber)  {
                    let msg = `最多还可以添加 ${ this.fileNumber - this.total } 张图片`
                    return this.$message.error(msg);
                }

                files.forEach( file => {

                    // 验证文件大小
                    if (file.size > fileHelper.toByte(this.fileSize)) {
                        let msg = `${ file.name } 超出 ${ this.fileSize }MB 限制，已被过滤`;
                        setTimeout(() => this.$message.error(msg));
                        return;
                    }

                    // 验证文件类型
                    const ext = fileHelper.getFileExt(file.name);
                    if (!this.accept.includes(ext)) {
                        let msg = `${ file.name } 不支持的文件类型，已被过滤`;
                        setTimeout(() => this.$message.error(msg));
                        return;
                    }

                    const fileData = {
                        file: file,
                        size: file.size,
                        name: file.name,
                        type: ext.substring(1),
                        status: 'ready'
                    }
                    this.fileList.push(fileData);
                    this.WorkQueue.add(fileData)
                });
            },

            // 文件上传
            async uploadFile(file) {
                file.status = 'upload';
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                        file.status = "success"
                    }, 2000)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .UploadFile {
        box-sizing: border-box;
        width: 500px;
        line-height: 1;
        &-Drop {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            cursor: pointer;
            height: 284px;
            border: 2px dashed $--border-color-base;
            transition: .3s;
            color: $--color-text-placeholder;
            font-size: 12px;
            [class^='el-icon'] {
                font-size: 48px;
            }
            p {
                text-align: center;
                margin-top: $--space-sm;
                color: $--color-text-secondary;
                line-height: 1.4;
            }
            &:hover, &.enter {
                border-color: $--color-primary;
                color: $--color-primary;
            }
        }

        &-Wrapper {
            display: flex;
            flex-direction: column;
            border: 1px solid $--border-color-base;
            min-height: 284px;
            max-height: 440px;
        }

        &-Tools {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: space-between;
            height: 42px;
            padding: 0 $--space-base;
            border-bottom: 1px solid $--border-color-base;
            span {
                color: $--color-text-secondary;
            }
        }

        &-List {
            flex: 1;
        }

        &-Item {
            position: relative;
            display: flex;
            align-items: center;
            margin: 0 $--space-base $--space-sm;
            padding: $--space-base $--space-sm;
            transition: .3s;
            // border-bottom: 1px solid $--border-color-lighter;
            &:first-child {
                margin-top: $--space-sm;
            }

            &:hover {
                background-color: $--background-color-lighter;
            }

            &_progress {
                position: absolute;
                left: 0;
                bottom: 0;
                height: 2px;
                background-color: $--color-success;
            }

            &_icon, &_status, &_container {
                position: relative;
                z-index: 10;
            }

            &_icon, &_status {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                width: 48px;
                font-size: 24px;
            }

            &_container {
                line-height: 1.5;
                flex: 1;
                margin-left: $--space-base;
                p {
                    font-size: 14px;
                    margin-bottom: $--space-sm;
                    @include text-overflow(1);
                }
                span {
                    font-size: 12px;
                    color: $--color-text-secondary;
                    & + span {
                        margin-left: 1em;
                    }
                }
            }

            &_status {
                width: 30px;
                margin-left: $--space-base;
                .success {
                    color: $--color-success;
                }
                .error {
                    color: $--color-danger;
                }
                .ready {
                    color: $--color-text-placeholder;
                }
                .upload {
                    color: $--color-primary;
                }


            }
            
        }
    }
</style>