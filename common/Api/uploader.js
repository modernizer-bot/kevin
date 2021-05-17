/*
 * 文件上传
 * @Author: chandre 
 * @Date: 2021-04-21 21:46:09 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-04-26 10:56:41
 */


export default {
    
    /**
     * 头像
     * @param {FormData} formData 表彰数据
     * @returns {Promise}
     */
    Avatar: function(formData) {
        return this.$axios({
            url: '/api/users/uploadAvatar',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData
        })
    },

    /**
     * 图片
     * @param {FormData} formData 表彰数据
     * @returns {Promise}
     */
    Image: function(formData) {
        return this.$axios({
            url: '/api/file/uploadImage',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData
        })
    },

    /**
     * 文件上传
     * @param {File} file 文件
     * @param {Function} onUploadProgress 文件上传进度回调
     * @returns {Promise}
     */
    File: function(file, onUploadProgress=Function) {
        const formData = new FormData();
        formData.append('file', file);
        return this.$axios({
            url: '/api/users/uploadAvatar',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onUploadProgress: onUploadProgress,
            data: formData
        })
    }
}