<template>
    <AdminPage title="新闻资讯">
        <!-- 主体页面前面 -->
        <!-- <span slot="before">主体页面前面</span> -->
        <!-- 菜单 -->
        <template slot="menu">
            <a href="javascript:;" class="is-active">行业动态</a>
            <a href="javascript:;">企业资讯</a>
        </template>

        <!-- 工具 -->
        <template slot="tools">
            <el-button type="primary">添加资讯</el-button>
            <el-input placeholder="请输入内容" style="width: 300px">
                <el-button type="primary" slot="append">查询</el-button>
            </el-input>
        </template>
        
        <!-- 查询条件 -->
        <template slot="filter">
            <el-form inline>
                <el-form-item label="姓名">
                    <el-input />
                </el-form-item>
                <el-form-item label="部门">
                    <el-input />
                </el-form-item>
                <el-button type="primary" plain>搜索</el-button>
            </el-form>
        </template>

        <!-- 主体内容 -->
        <Table @select="onSelect">
            <el-table-column label="序号" />
            <el-table-column label="名称" />
            <el-table-column label="内容" />
            <el-table-column label="操作" />
        </Table>
        
        <!-- 底栏 -->
        <PageNav
            slot="footer"
            :total="100"
            :currentPage="4"
        />
        
        <!-- 主体页面尾部 -->
        <!-- <span slot="after">主体页面尾部</span> -->
    </AdminPage>
</template>

<script>
    export default {

        

        methods: {
            onSelect() {

            }
        }
    }
</script>

