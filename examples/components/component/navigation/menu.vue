<template>
    <div>
                <Menu current="overview/real" :openeds="['overview']">
                    <SubMenu name="overview">
                        <template slot="title">
                            <Icon type="android-list"></Icon>基本概况
                        </template>
                        <MenuItem name="overview/real">实时数据</MenuItem>
                        <MenuItem name="overview/key">关键数据</MenuItem>
                        <MenuItem name="overview/version">版本分布</MenuItem>
                    </SubMenu>
                    <SubMenu name="user">
                        <template slot="title">
                            <Icon type="android-desktop"></Icon>用户分析
                        </template>
                        <MenuItem name="user/active">活跃度</MenuItem>
                        <MenuItem name="user/stay">用户留存</MenuItem>
                        <MenuItem name="user/leave">用户流失</MenuItem>
                    </SubMenu>
                    <SubMenu name="admin">
                        <template slot="title">
                            <Icon type="android-people"></Icon>用户管理
                        </template>
                        <MenuItem name="admin/account">账号设置</MenuItem>
                        <MenuItem name="admin/list">账号列表</MenuItem>
                    </SubMenu>
                    <SubMenu name="set">
                        <template slot="title">
                            <Icon type="android-options"></Icon>综合设置
                        </template>
                        <MenuItem name="set/version">版本管理</MenuItem>
                        <MenuItem name="set/channel">渠道管理</MenuItem>
                    </SubMenu>
                </Menu>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>