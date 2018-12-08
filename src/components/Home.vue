<template>
    <el-container>
        <Menu></Menu>
        <Main></Main>
    </el-container>
</template>
<script>
import Menu from 'components/layout/Menu'
import Main from 'components/layout/Main'
export default {
    components: {
        Menu,
        Main
    }
}
</script>
<style>
.el-container {
    height: 100%;
}
</style>