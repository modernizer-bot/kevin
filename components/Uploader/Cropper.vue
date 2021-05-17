<script>
    import Dialog from '../Dialog';
    import fileHelper from './fileHelper';

    export default {

        props: {
            config: Object
        },

        computed: {
            // 配置
            conf() {
                return Object.assign({
                    mode: 'contain',
                    outputType: 'jpeg',
                    outputSize: 0.8,
                    autoCrop: true,
                    autoCropWidth: 375,
                    autoCropHeight: 211,
                    info: true,
                    canScale: true,
                    fixed: false,
                    fixedNumber: [1, 1],
                    full: true,
                    fixedBox: false,
                    canMove: true,
                    canMoveBox: true,
                    original: false,
                    centerBox: true,
                    high: false,
                    infoTrue: true,
                    maxImgSize: 2000,
                    enlarge: 1,
                }, this.config)
            }
        },

        data() {
            return {
                visible: false,
                // 文件URL
                imgURL: ''
            }
        },

        methods: {
            // 显示
            show(file) {
                this.visible = true;
                this.imgURL = fileHelper.toBlobUri(file);
            },

            // 隐藏
            hide() {
                this.visible = false;
            },

            // 图片缩放
            onClickScale(value) {
                this.$refs.VueCropper.changeScale(value)
            },

            // 图片旋转
            onClickRotate(value) {
                if (value=='left') {
                    this.$refs.VueCropper.rotateLeft();
                } else {
                    this.$refs.VueCropper.rotateRight();
                }
            },
            
            // 裁剪
            onClickCrop() {
                this.$refs.VueCropper.getCropBlob( data => {
                    const filename = 'cropper_'+ Date.now() + '.' + this.conf.outputType;
                    const file = fileHelper.BlobToFile(data, filename);
                    this.$emit('crop', file)
                });
            },

            // 画布
            renderCanvas() {
                return (
                    <div class="Cropper-Canvas">
                        <vue-cropper 
                            props = { this.conf } 
                            ref="VueCropper" 
                            img = { this.imgURL }
                        />
                    </div>
                )
            },

            // 工具
            renderTools() {
                return (
                    <div class="Cropper-Tools">
                        <el-button-group>
                            <el-button icon="el-icon-zoom-out" size="default"
                                onClick={ e => this.onClickScale(-1.5) } 
                            />
                            <el-button icon="el-icon-zoom-in"  size="default"
                                onClick={ e => this.onClickScale(1.5) } 
                            />
                            <el-button icon="el-icon-refresh-left"  size="default"
                                onClick={ e => this.onClickRotate('left') } 
                            />
                            <el-button icon="el-icon-refresh-right"  size="default"
                                onClick={ e => this.onClickRotate('right') } 
                            />
                        </el-button-group>
                        <el-button type="primary" size="default" onClick={ this.onClickCrop }>裁剪</el-button>
                    </div>
                )
            }
        },

        render() {

            const DialogProps = {
                attrs: {
                    visible: this.visible,
                },
                on: {
                    'update:visible': value => this.visible = value
                }
            }

            return (
                <Dialog title="裁剪图片" { ...DialogProps } width="700px">
                    { this.renderCanvas() }
                    <template slot="footer">
                        { this.renderTools() }
                    </template>
                </Dialog>
            )
        }
    }
</script>


<style lang="scss" scoped>
    .Cropper {
        &-Canvas {
            height: 400px;
        }
        &-Tools {
            display: flex;
            justify-content: space-between;
        }
    }
</style>