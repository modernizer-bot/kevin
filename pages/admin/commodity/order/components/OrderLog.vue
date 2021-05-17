<template>
    <Dialog
        :visible.sync="visible"
        :isReload="true"
        title="操作记录"
        width="600px"
    >
        <Table :data="LIST">
            <el-table-column align="center" type="index" label="序号"  width="60" />
            <el-table-column align="center" label="操作人" prop="account.name"  width="80" />
            <el-table-column label="操作时间" width="150" v-slot="{ row }"  align="center">
                {{ $helper.formatDate(row.created_at, 'Y-m-d H:i') }}
            </el-table-column>
            <el-table-column label="操作描述" prop="desc" />
        </Table>
    </Dialog>
</template>

<script>
    import _ from 'underscore'

    export default {

        data() {
            return {
                visible: false,
                LIST: []
            }
        },

        methods: {
            show(data) {
                this.LIST = data;
                this.visible = true
            },
        }
    }
</script>
