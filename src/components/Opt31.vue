<template>
  <el-container class="container" id="work-container">
    <el-aside width="200px">
      <div class="box-card">
        <div class="header">任务列表</div>
        <div class="card-body">
          <div class="item" v-for="(item, idx) in tasks" :key="idx" :data-icon="item.icon" :data-text="item.name" :data-busitype="item.busiType">
            <i :style="{backgroundImage: 'url('+item.icon+')'}"></i>
            <span class="text">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="template-box">
        <div class="header">场景列表</div>
        <ul class="template-list">
          <li class="item" :class="{'active':idx===currScenarioIdx}" v-for="(item,idx) in scenarioList" :key="item.id" @click="handleClickTemp(item.id, idx)">
            {{item.name}}
          </li>
        </ul>
      </div>
    </el-aside>
    <el-main>
      <el-button class="btn-clear" @click="clearChart" type="primary">清空</el-button>
      <el-button class="btn-save" @click="saveChart" type="success">保存</el-button>
      <div class="workplace" id="workplace">
        <chart-node
          :busiTypePropsMap="busiTypePropsMap[item.busiType]"
          v-for="(item, idx) in chartData.nodes"
          v-bind="item"
          :key="idx"
          @edit="editNode(item,idx)"
        ></chart-node>
      </div>
    </el-main>
  
    <el-dialog title="场景保存" :visible.sync="dialogFormVisible">
      <el-form :model="chartForm" ref="chartForm" :label-width="formLabelWidth">
        <el-form-item label="场景名称">
          <el-input v-model="chartForm.name" auto-complete="off" placeholder="请输入场景名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="submitSave">确 定</el-button>
      </div>
    </el-dialog>
  
    <!-- 节点属性设置弹出层 -->
    <el-dialog :visible.sync="dialogFormVisible2">
      <div slot="title">属性设置</div>
      <el-form :model="nodeForm" ref="nodeForm" :label-width="formLabelWidth">
        <el-form-item :label="obj.displayName" v-for="(obj, idx) in busiTypePropsMap[currEditItem.busiType]" :key="idx">
          <el-input type="text" v-model="nodeForm[obj.keyName]" />
        </el-form-item>
        <!-- <el-form-item label="属性1">
          <el-input v-model="nodeForm.attr1" type="text" placeholder="请输入属性1"/>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="saveNodeEdit">确 定</el-button>
          <el-button @click="cancelSaveNodeEdit">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>
  
<script>
import ChartNode from "@/components/ChartNode.1";
export default {
  name: "DemoChart",
  data() {
    return {
      currScenarioIdx: -1,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      chartForm: {
        name: ""
      },
      formLabelWidth: "100px",
      nodeForm: {},
      scenarioList: this.$store.state.scenario,
      tasks: this.$store.state.tasks,
      jsp: null,
      chartData: {
        nodes: [],
        connections: [],
        props: {}
      },
      busiTypePropsMap: {
        'emr': [{displayName: '姓名', keyName: ' '}],
        'xdata': [{displayName: '姓名', keyName: 'name'},{displayName: '年龄', keyName: 'age'}],
      },
      currEditItem: {
        busiType: ""
      }
    };
  },
  mounted() {
    const _self = this;
    jsPlumb.ready(() => {
      // 默认配置
      var instance = jsPlumb.getInstance({
        Endpoint: [
          "Blank",
          { cssClass: "chart-dot", hoverClass: "chart-dot-hover", radius: 5 }
        ],
        Connector: "Straight",
        HoverPaintStyle: { stroke: "#1e8151", strokeWidth: 2 },
        ConnectionOverlays: [
          [
            "Arrow",
            {
              location: 1,
              visible: true,
              width: 11,
              height: 11,
              id: "Arrow"
            }
          ]
          // ["Label", { label: "-", id: "label", cssClass: "aLabel" }]
        ],
        Container: "workplace"
      });
      this.jsp = instance;
      var canvas = document.getElementById("workplace");

      // 删除连接线
      // instance.bind("click", function(c) {
      //   instance.deleteConnection(c);
      // });

      // 监听 connection 事件
      instance.bind("connection", function(info) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
      });
      // 监听拖动connection 事件，判断是否有重复链接
      instance.bind("beforeDrop", function(info) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        // console.log(info);
        // 判断是否已有该连接
        let isSame = true;
        _self.chartData.connections.forEach(item => {
          if ((item.targetId === info.targetId && item.sourceId === info.sourceId) ||
            (item.targetId === info.sourceId && item.sourceId === info.targetId)
          ) {
            isSame = false;
          }
        });
        if (isSame) {
          _self.chartData.connections.push({
            targetId: info.targetId,
            sourceId: info.sourceId
          });
        } else {
          _self.$message.error("不允许重复连接！");
        }
        return isSame;
      });

      // bind a double click listener to "canvas"; add new node when this occurs.
      // jsPlumb.on(canvas, "dblclick", function(e) {
      //   newNode(e.offsetX, e.offsetY);
      // });
      // 将模块拖入画板中
      $(".box-card .item").draggable({
        scope: "plant",
        helper: "clone",
        containment: $("#work-container")
      });
      $("#workplace").droppable({
        scope: "plant",
        drop: function(ev, ui) {
          // console.log(ev, ui);
          let helper = ui.helper;
          let id = jsPlumbUtil.uuid();
          let item = {
            id,
            icon: helper.attr("data-icon"),
            busiType: helper.attr("data-busitype"),
            text: helper.attr("data-text"),
            nodeStyle: {
              top: ui.position.top - 20 + "px",
              left: ui.position.left - 460 + "px"
            },
            props: {}
          };

          _self.chartData.nodes.push(item);
          _self.$nextTick(() => {
            _self.initNode(id);
          });
        }
      });

      // 暂停渲染，执行以下操作
      instance.batch(() => {
        jsPlumb.getSelector(".workplace-chart").forEach(item => {
          _self.initNode(item);
        });
      });
    });
  },
  methods: {
    // 初始化node节点
    initNode(el) {
      let _self = this;
      this.jsp.draggable(el, {
        containment: true,
        start(params) {
          // 拖动开始
          // console.log(params);
        },
        drag(params) {
          // 拖动中
          // console.log(params);
        },
        stop(params) {
          // 拖动结束
          // console.log(params);
          let id = params.el.id;
          _self.chartData.nodes.forEach(item => {
            if (item.id === id) {
              item.nodeStyle.left = params.pos[0] + "px";
              item.nodeStyle.top = params.pos[1] + "px";
            }
          });
        }
      });

      this.jsp.makeSource(el, {
        filter: ".ep",
        anchor: "Continuous",
        // anchor: ["Perimeter", { shape: "Rectangle" }],
        connectorStyle: {
          stroke: "#5c96bc",
          strokeWidth: 2,
          outlineStroke: "transparent",
          outlineWidth: 4
        },
        extract: {
          action: "the-action"
        },
        maxConnections: -1,
        onMaxConnections: function(info, e) {
          alert("Maximum connections (" + info.maxConnections + ") reached");
        }
      });

      this.jsp.makeTarget(el, {
        dropOptions: { hoverClass: "dragHover" },
        anchor: ["Perimeter", { shape: "Rectangle" }],
        allowLoopback: false
      });
    },
    // 保存
    saveChart() {
      console.log(JSON.stringify(this.chartData));
      this.dialogFormVisible = true;
    },
    /**
     * @description 取消保存
     */
    cancelSave() {
      this.dialogFormVisible = false;
      this.chartForm = {
        name: ""
      };
      this.$message.info("已取消保存");
    },
    submitSave() {
      this.dialogFormVisible = false;
      this.chartData.props = this.chartForm;
      this.$message.success("保存成功");
    },
    /**
     * @description 模板点击事件
     * @param {String} id 场景id
     */
    handleClickTemp(id, idx) {
      this.currScenarioIdx = idx;
      this.chartData = {
        nodes: [],
        connections: [],
        props: {}
      };
      this.jsp.empty("workplace");
      if (id) {
        let url = "./static/json/" + id;
        this.$axios.get(url).then(res => {
          this.chartData = res.data;
          this.$nextTick(() => {
            this.chartData.nodes.forEach(item => {
              this.initNode(item.id);
            });
            this.chartData.connections.forEach(item => {
              this.jsp.connect({
                source: item.sourceId,
                target: item.targetId
              });
            });
          });
        }).catch(err => {
          console.log(err);
        });
      }
    },
    /**
     * @description 双击触发节点编辑事件
     * @param {Object} item 节点当前数据
     * @param {Number} idx 下标
     */
    editNode(item, idx) {
      this.currEditItem = JSON.parse(JSON.stringify(item));
      console.log(item);
      this.dialogFormVisible2 = true;
    },
    /**
     * @description 节点编辑保存
     */
    saveNodeEdit() {
      // 验证表单
      if (this.verifyNodeForm()) {
        this.$message.success("保存成功");
        this.dialogFormVisible2 = false;
      }
      let idx = this.chartData.nodes.findIndex(item => {
        return item.id === this.currEditItem.id;
      });
      this.chartData.nodes[idx].props = JSON.parse(JSON.stringify(this.nodeForm));
    },
    /**
     * @description 节点保存验证
     */
    verifyNodeForm() {
      let flag = false;
      if (this.nodeForm.name === "") {
        this.$message.warning("属性1不能为空");
      }  else {
        flag = true;
      }
      return flag;
    },
    /**
     * @description 取消保存
     */
    cancelSaveNodeEdit() {
      this.dialogFormVisible2 = false;
    },
    /**
     * @description 清空
     */
    clearChart () {
      this.jsp.empty("workplace");
    }
  },
  components: {
    ChartNode
  }
};
</script>
<style lang="scss" scoped>
.el-aside {
  background-color: #D3DCE6;
  color: #333;
}
.el-main {
  position: relative;
}
.workplace {
  width: 100%;
  height: 100%;
  position: relative;
}
#start {
  top: 50px;
  left: 50px;
}
.btn-clear {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 100px;
  z-index: 1;
}
.item {
  text-align: center;
  margin: 0;
  cursor: pointer;
  i {
    width: 60px;
    height: 60px;
    line-height: 60px;
    background-size: 85%;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center;
    font-size: 20px;
    color: #409eff;
    cursor: pointer;
    margin-bottom: 5px;
    margin-right: 0!important;
    -ms-touch-action: none;
    touch-action: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  span {
    display: block;
  }
}

.box-card .card-body .item {
    display: inline-block;
    padding-left: 10px;
    padding-top: 10px;
}
</style>