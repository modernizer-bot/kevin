/*
 * @Author: chandre 
 * @Date: 2021-04-18 00:27:28 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-04-18 17:55:30
 */

export default {

    // 获取文件后缀
    getFileExt(fileName) {
        return fileName.substring(fileName.lastIndexOf('.'));
    },

    // 文件对象转数组
    toFileList(files) {
        let fileList = [];
        if (files && files.length) {
            Array.prototype.push.apply(fileList, files);
        }
        return fileList;
    },

    // 文件MB转Byte
    toByte(fileSize) {
        return fileSize * Math.pow(1024,2);
    },

    // 生成本地URI
    toBlobUri(file) {
        const createObjectURL = window.createObjectURL || window.URL.createObjectURL || window.webkitURL.createObjectURL;
        return createObjectURL(file);
    },

    // Bolb转File对象
    BlobToFile(blob, filename) {
        return new File([blob], filename, { type: blob.type })
    },

    // 是否为文件对象
    isFile(file) {
        return (file.__proto__.hasOwnProperty('constructor') && file.__proto__.constructor === File)
    },

    // 获取图片尺寸
    getImageSize(file) {
        const Img = new Image();
        return new Promise((resolve, reject) => {
            Img.onload = () => resolve(Img);
            let imgURL = '';
            if (this.isFile(file)) {
                Img.src = this.toBlobUri(file);
            } else {
                Img.src = file;
            }
        })
    },

    // 获取压缩后的图片大小
    getCompressSize(originalWidth, originalHeight, maxWidth, maxHeight) {
        // 按宽度度缩小
        if (maxWidth > 0 && maxHeight===0 && originalWidth > maxWidth) {
            const ratio = maxWidth / originalWidth;
            return {
                width: maxWidth,
                height: parseInt(originalHeight * ratio)
            }
        }
        // 按高度缩小
        else if (maxHeight > 0 && maxWidth===0 && originalHeight > maxHeight) {
            const ratio = maxHeight / originalHeight;
            return {
                width: parseInt(maxWidth  * ratio),
                height: originalHeight
            }
        }
        // 等比缩小
        else if (maxWidth > 0 && maxHeight > 0 ) {
            // 原图片宽高比例 大于原始图片宽高比例
            if (maxWidth / maxHeight <= originalWidth / originalHeight) {
                return {
                    width: maxWidth,
                    height: parseInt(maxWidth * ( originalHeight / originalWidth ))                            
                }
            } 
            // 原图片宽高比例 小于原始图片宽高比例
            else {
                return {
                    width: parseInt( maxHeight * ( originalWidth / originalHeight )),
                    height: maxHeight                           
                }
            }
        } 
        // 不缩放图片
        else {
            return {
                width: originalWidth,
                height: originalHeight
            }
        }
    },

    // 图片压缩
    async compress(imgFile, options) {
        let { maxHeight, maxWidth, outputType, outputSize } = options;

        if (!['jpeg','png'].includes(outputType)) outputType = 'jpeg';
        outputSize = +outputSize || 1;
        
        let Img  = await this.getImageSize(imgFile);
        // 如果原图小于压缩大小直接返回
        if ( Img.width <= maxWidth && Img.height <=maxHeight ) {
            throw new Error('图片无需压缩')
        };


        // 计算缩放大小
        let size = this.getCompressSize(Img.width, Img.height, maxWidth, maxHeight);
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = size.width;
        canvas.height = size.height;
        ctx.drawImage(Img, 0, 0, size.width, size.height);

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                let filename = imgFile.name;
                    filename = filename.substring(0, filename.lastIndexOf('.'));
                    filename = filename + '.' + outputType;
                const file = this.BlobToFile(blob, filename);
                resolve(file);
                ctx.clearRect(0,0, size.width, size.height);
            }, `image/${ outputType }`, outputSize);
        })
    }



}