/* eslint valid-jsdoc: "off" */

'use strict';
const redisStore = require('cache-manager-ioredis')

module.exports = appInfo => {
    
    return {

        jwt: {
            secret: appInfo.name + '_1619703127058_7703'
        },

        cache: {
            default: 'redis',
            stores: {
                redis: {
                    driver: redisStore,
                    host: '192.168.10.10',
                    port: 6379,
                    password: '',
                    db: 0,
                    ttl: 600,
                    valid: _ => _ !== null,
                },
            },
        },


        sequelize: {
            dialect: 'mysql',
            host: '192.168.10.10',
            port: 3306,
            database: 'kevin',
            username: 'root',
            password: 'Fxe5S7TtN8e4TzFk',
            timezone: '+08:00', //时区
            logging: false,
            dialectOptions: {
                dateStrings: true,
                typeCast: true,
            },
            define: {
                //查询是对字段驼峰类型和下划线类型进行转换
                underscored: true,
                //使用自己配置的表名，避免sequelize自动将表名转换为复数
                freezeTableName: true,
                // 是否自动添加时间戳createAt，updateAt
                timestamps: true,
                // 将createdAt对应到数据库的created_at字段
                createdAt: 'created_at',
                // 将updatedAt对应到数据库的updated_at字段
                updatedAt: 'updated_at',
                // 将deletedAt对应到数据库的deleted_at字段
                deletedAt: 'deleted_at', 
                //删除数据时不删除数据，而是更新deleted_at字段
                paranoid: false
            }
        }
        
    }
};
