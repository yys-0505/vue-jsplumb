<template>
  <div class="workplace-chart" :id="id" :style="nodeStyle" @dblclick="handleNodeDbclick">
    <i :style="{'backgroundImage': 'url('+icon+')'}"></i>
    <span>{{text}}</span>
    <div class="ep"></div>
    <div>
      <ul>
        <li v-for="(v, k) in props">{{k}}: {{v}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "ChartNode",
  // props 验证
  props: {
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    nodeStyle: {
      type: Object
    },
    props: {
      type: Object,
      default () {
        return {}
      }
    },
    busiTypePropsMap: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {};
  },
  created () {
    console.log("this.item", this.icon);
  },
  methods: {
    handleNodeDbclick() {
      this.$emit("edit")
    }
  }
};
</script>
<style lang="scss">
.workplace-chart {
  text-align: center;
  margin: 0;
  cursor: pointer;
  padding: 10px;
  i {
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center;
    font-size: 20px;
    color: #409eff;
    cursor: pointer;
    margin-bottom: 5px;
    touch-action: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;

    width: 60px;
    height: 60px;
    line-height: 60px;
    background-size: 85%;
    display: inline-block;
    margin-right: 0 !important;
  }
  span {
    display: block;
  }
  .ep {
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 10px;
    height: 10px;
    background: #409eff;
    border-radius: 5px;
  }
  &:hover {
    .ep {
      opacity: 1;
    }
  }
  &.dragHover {
    .ep {
      opacity: 0;
    }
  }
}
</style>
