<script>
    import _ from 'underscore'
    // 脚本加载状态
    let SCRIPT_LOADED = false;

    const EDITOR_MODE = {
        // 基础版
        base: {
            // menubar: ['edit', 'view', 'format', 'insert', 'tools'],
            menubar: false,
            plugins: [
                'link', 'image', 'media', 'table', 'lists', 'advlist',
                'fullscreen', 'paste', 'code', 'codesample'
            ],
            toolbar: [
                `
                    | formatselect fontsizeselect
                    | bold italic underline strikethrough removeformat 
                    | forecolor backcolor 
                    | table image media 
                `,
                `
                    | undo redo 
                    | blockquote link unlink 
                    | align bullist numlist indent outdent 
                    | fullscreen code
                `
            ]
        },

        // 迷你版
        mini: {
            menubar: false,
            toolbar_drawer: "sliding",
            plugins: ['image', 'media', 'lists'],
            toolbar: `
                | formatselect fontsizeselect 
                | bold italic underline strikethrough removeformat
                | alignleft aligncenter alignright alignjustify
                | numlist bullist
                | image media
            `,
        }
    }

    export default {
        
        model: {
            prop: "content",
            event: 'input'
        },

        props: {
            // 编辑内容
            content: String,
            // TinyMCE 脚本URL
            scriptSrc: {
                type: String,
                default: '/tinymce/tinymce.min.js'
            },
            // 模式
            mode: {
                type: String,
                default: 'mini',
                validator: val => {
                    return ['base', 'mini'].includes(val)
                }
            },
            height: {
                type: String,
                default: '500px'
            },
            width: {
                type: String,
                default: 'auto'
            },
            // 自定义配置
            setting: Object,
            // 自定义插件安装
            setup: Function,
            // 禁用状态
            disabled: Boolean,
            // 远程资源上传
            imageSourceRequest: Function,
        },
        

        data() {
            return {
                id: `timymce_${ this._uid }`,
                currentContent: ''
            }
        },

        watch: {
            content: 'setContent',
            disabled: 'setMode'
        },

        async beforeMount() {

            // 监听内容改变
            this.__onContentChange = _.throttle(() => {
                this.currentContent = this.editor.getContent();
                this.$emit('input', this.currentContent)
            }, 300, { leading: false })

            await this.__LoadScript().then(this.__createEditor);
        },

        beforeDestroy: function(){
            this.editor && this.editor.remove();
        },

        render() {
            return (
                <div id={ this.id } style={{
                    height: this.height,
                    width: this.width
                } } />
            )
        },

        methods: {

            // 加载脚本
            __LoadScript() {
                return new Promise((resolve, reject) => {
                    if (SCRIPT_LOADED) return resolve();
                    const script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = this.scriptSrc;
                    const onLoad = function() {
                        resolve();
                        SCRIPT_LOADED = true;
                        script.removeEventListener('load', onLoad, false);
                    }
                    script.addEventListener('load', onLoad, false);
                    document.getElementsByTagName("head")[0].appendChild(script);
                })
            },
            
            // 创建编辑器
            __createEditor() {
                const setting = this.setting ? this.setting : EDITOR_MODE[this.mode]
                const SETTING = Object.assign({}, setting , {
                    language: 'zh_CN',
                    skin: 'custom',
                    branding: false,
                    selector: `#${ this.id }`,
                    height: this.height,
                    draggable_modal: true,
                    paste_data_images: true,
                    convert_urls: false,
                    images_upload_handler: this.handlerImageUpload,
                    setup: (editor) => {
                        this.setup && this.setup(editor);
                        // 初始化
                        editor.on('init', this.__onEditorInit);
                        // 内容变化
                        editor.on('input keyup Change Undo Redo ExecCommand NodeChange', this.__onContentChange)
                    }
                })
                const editor = tinymce.createEditor(SETTING.selector, SETTING);
                editor.targetElm = this.$el;
                editor.render();
                this.editor = editor;
            },

            // 编辑器初始化
            __onEditorInit() {
                this.setContent(this.content);
                this.setMode(this.disabled);
            },

            // 设置编辑模式
            setMode(val) {
                this.editor.setMode( val ? 'readonly' : 'design' )
            },

            // 同步内容
            setContent(val) {
                if ( this.currentContent !== val ) {
                    this.editor.setContent(val);
                }
            },

            // 光标位置插入内容
            insert(html) {
                this.editor.execCommand('mceInsertContent', false, html);
            },

            // 图片上传
            async handlerImageUpload(blobInfo, success, failure, progress) {
                const formData = new FormData();
                formData.append('file',  blobInfo.blob());
                formData.append('type', 1);
                await this.$api.Uploader.Image(formData).then(res => {
                    this.$emit('upload', res); //图片上传成功
                    success(res.realName);
                }).catch(err => {
                    failure(err)
                })
            }
        }
    }
</script>