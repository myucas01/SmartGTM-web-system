<!-- 树状选择器 -->
<template>
  <el-popover
    class="popper-class-tree-wrapper"
    popper-class="popper-class-select-wrapper"
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover">
    <el-tree
      ref="tree"
      class="select-tree"
      highlight-current
      :style="`min-width: ${treeWidth}`"
      :data="treeData"
      :props="props"
      node-key="id"
      :filter-node-method="filterNode"
      :default-expand-all="false"
      :expand-on-click-node="true"
      @node-click="onClickNode">
    </el-tree>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      :style="`width: ${width}px`"
      suffix-icon="el-icon-search"
      :placeholder="placeholder"
      size="small">
    </el-input>
  </el-popover>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index';

export default {
  name: 'Pagination',
  props: {
    // 接收绑定参数
    value: String,
    // 输入框宽度
    width: String,
    // 选项数据
    // options: {
    //   type: Array,
    //   required: true,
    // },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择',
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        children: 'children',
        label: 'name',
        value: 'id',
        parent: 'parentId',
      }),
    },
     clear: {
      default: false,
      type: Boolean,
    }
  },
  // 设置绑定参数
  // model: {
  //   prop: 'value',
  //   event: 'selected',
  // },
  computed: {
    // 是否为树状结构数据
    // dataType() {
    //   const jsonStr = JSON.stringify(this.options);
    //   return jsonStr.indexOf(this.props.children) !== -1;
    // },
    // 若非树状结构，则转化为树状结构数据
    // data() {
    //   return this.dataType ? this.options : this.switchTree();
    // },
  },
  watch: {
    labelModel(val) {
      if (!val) {
        this.valueModel = '';
      }
      this.$refs.tree.filter(val);
    },
    value(val) {
      this.labelModel = this.queryTree(this.data, val);
    },
    clear(val) {
      if (val) this.labelModel = '';
    },
  },
  data() {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: 'auto',
      // 输入框显示值
      labelModel: '',
      // 实际请求传值
      valueModel: '0',
      treeData: [],
    };
  },
  created() {
    this.getTreeData();
    // 检测输入框原有值并显示对应 label
    if (this.value) {
      this.labelModel = this.queryTree(this.data, this.value);
    }
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`;
    });
  },
  methods: {
    getTreeData() {
      ROUTE_PLANNING_API.get_work_standards_query_org().then((res) => {
        const { code, data } = res;
        if (code === '200') {
          this.treeData = data;
        }
      });
    },
    // 单击节点
    onClickNode(node) {
      // 如果不是根节点 return
      // if (node.children && node.children.length) return;
      this.labelModel = node[this.props.label];
      this.valueModel = node[this.props.value];
      this.onCloseTree();
      this.$emit('handleCloseName', this.labelModel);
      this.$emit('handleCloseId', this.valueModel);
    },
    // 偏平数组转化为树状层级结构
    switchTree() {
      return this.cleanChildren(this.buildTree(this.options, '0'));
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false;
    },
    // 显示时触发
    onShowPopover() {
      this.showStatus = true;
      this.$refs.tree.filter(false);
    },
    // 隐藏时触发
    onHidePopover() {
      this.showStatus = false;
      this.$emit('selected', this.valueModel);
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.props.label].indexOf(query) !== -1;
    },
    // 搜索树状数据中的 ID
    queryTree(tree, id) {
      let stark = [];
      stark = stark.concat(tree);
      while (stark.length) {
        const temp = stark.shift();
        if (temp[this.props.children]) {
          stark = stark.concat(temp[this.props.children]);
        }
        if (temp[this.props.value] === id) {
          return temp[this.props.label];
        }
      }
      return '';
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n[this.props.parent] === parentId) {
            n.children = fa(n.rowGuid);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(id);
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children.length) {
            fa(e.children);
          } else {
            delete e.children;
          }
          return e;
        });
        return list;
      };
      return fa(data);
    },
  },
};
</script>

<style lang="scss">
.global-config-select-tree-wrapper {
  .el-input.el-input--suffix {
    cursor: pointer;
    overflow: hidden;
  }
  .el-input.el-input--suffix.rotate .el-input__suffix {
    transform: rotate(180deg);
  }
  .select-tree {
    max-height: 350px;
    overflow-y: scroll;
  }
}
.popper-class-select-wrapper {
  max-height: 350px;
  overflow-y: scroll;
  background-color: #0a2757;
  border-color: #0a2757;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.7);
  .el-tree {
    background-color: #0a2757;
    .el-tree-node__label {
      color: #ffffff;
      font-size: 12px;
    }

    .el-tree-node:focus > .el-tree-node__content {
      background-color: #252174 !important;
    }

    .el-tree-node__content:hover {
      background-color: #252174;
    }

    &.el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: #7909c1 !important;
    }
  }
  .popper__arrow::after {
    display: none;
  }
}
</style>
