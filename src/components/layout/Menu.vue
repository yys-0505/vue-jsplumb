<template>
    <el-menu
        default-active="2"
        class="el-menu-vertical"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :router="true"
        :default-active="$route.path">
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/opt11">FLOWCHART</el-menu-item>
                <el-menu-item index="/opt12">STATE MACHINE</el-menu-item>
                <el-menu-item index="/opt13">DRAG AND DROP</el-menu-item>
                <el-menu-item index="/opt14">PERIMETER ANCHORS</el-menu-item>
                <el-menu-item index="/opt15">HIERARCHICAL CHART</el-menu-item>
                <el-menu-item index="/opt16">SOURCES AND TARGETS</el-menu-item>
                <el-menu-item index="/opt17">DYNAMIC ANCHORS</el-menu-item>
                <el-menu-item index="/opt18">ANIMATION</el-menu-item>
                <el-menu-item index="/opt19">GROUPS</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
        </el-menu-item>
    </el-menu>
</template>
<script>
export default {}
</script>
<style lang="stylus">
.el-menu-vertical {
    width: 240px;
    min-height: 400px;
}
</style>