<template>
  <div>
    <div
      class="add"
      :style="{ transform: isEdit ? 'translate(-50%, 0)' : 'translate(-50%, -200%)' }"
    >
      <div class="form">
        <div class="guide">指南</div>
        <input
          v-model.trim="label"
          autofocus
          type="text"
          placeholder="触发文字。如 “kbd”"
        />
        <input v-model.trim="command" type="text" placeholder="快捷键。如 “cmd+k”" />
        <textarea
          v-model="documentation"
          rows="5"
          placeholder="说明。如 “HTML <kbd> 标签快速输入”"
        />

        <div class="unitext-button" @click="handleModify()">
          {{ lock !== -1 ? "修 改" : "添 加" }}
        </div>
        <div v-if="lock !== -1" class="unitext-button" @click="handleDelete()">删除</div>
        <div class="unitext-button" @click="handleCancel()">取消</div>
      </div>

      <textarea
        class="snippet-input"
        @keydown="textareaTab($event)"
        v-model="insertText"
        placeholder="片段内容。如 “<kbd>${1:键}<kbd>”
1 是第一个填写的内容，: 后是默认值
注意，回车将被保留"
      />
    </div>

    <div class="show">
      <li><i class="floating ri-add-line" @click="handleEdit()" /></li>
      <li v-for="(v, i) in userData" :key="i" @click="handleEdit(i)">
        <div class="floating">
          <div>{{ v.label }}</div>
          <div>{{ v.command === "" ? "-" : v.command }}</div>
          <div>{{ v.documentation }}</div>
        </div>
        <pre class="snippet-show">{{ v.insertText }}</pre>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "Snippet",
})
export default class Snippet extends Vue {
  label = "";

  command = "";

  documentation = "";

  insertText = "";

  isEdit = false;

  lock = -1;

  userData: any;

  data() {
    return {
      userData: [],
    };
  }

  textareaTab(e: KeyboardEvent) {
    if (e.key === "Tab") {
      this.insertText += "\t";
      e.preventDefault();
    }
  }

  handleEdit(idx?: number) {
    if (idx !== undefined) {
      this.lock = idx;
      const targ = this.userData[idx];
      this.label = targ.label;
      this.command = targ.command;
      this.documentation = targ.documentation;
      this.insertText = targ.insertText;
    }
    this.isEdit = true;
  }

  handleCancel() {
    if (!this.isEdit) return;

    this.label = "";
    this.command = "";
    this.documentation = "";
    this.insertText = "";
    this.lock = -1;
    this.isEdit = false;
  }

  handleModify() {
    if (this.label === "") return;

    const newData = {
      label: this.label,
      command: this.command,
      documentation: this.documentation,
      insertText: this.insertText,
    };

    if (this.lock === -1) {
      this.userData.reverse();
      this.userData.push(newData);
      this.userData.reverse();
    } else {
      this.userData[this.lock] = newData;
    }

    this._handleSubmit();
  }

  handleDelete() {
    this.userData.splice(this.lock, 1);
    this._handleSubmit();
  }

  _handleSubmit() {
    this.$snippet.update(this.userData);
    this.handleCancel();
  }

  created() {
    this.userData = this.$snippet.getAll();
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

@item-spacing-width: 3px;
@item-pageing-width: 1em;
@card-spacing-width: 5px;

input,
textarea {
  font-family: @normal-font-family;
  color: var(--inputBox-Fg);
  background: var(--inputBox-Bg);
  font-size: 1em;
  min-height: 1.8em;
  margin: @item-spacing-width 0;
}

li {
  list-style: none;
  cursor: pointer;
}

.add {
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 99;
  top: 37px;
  width: 80%;
  height: 80%;
  left: 50%;
  transform: translate(-50%, 0);
  transition: all 0.5s ease-out;
  padding: 0 2 * @item-spacing-width;
  backdrop-filter: blur(4px);
  box-shadow: var(--tabBarShadow-Color) 2px 2px 4px -2px;

  .form {
    width: 35%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    input {
      text-align: center;
    }

    .unitext-button {
      margin-top: @item-spacing-width;
      margin-bottom: 2 * @item-spacing-width;
      width: 70%;
      align-self: center;
    }

    .guide {
      text-align: center;
    }
  }

  .snippet-input {
    overflow: scroll;
    position: absolute;
    width: 60%;
    top: @item-spacing-width;
    right: @item-spacing-width;
    bottom: @item-spacing-width;
  }
}

.show {
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
  margin: @item-pageing-width 0;
  overflow-x: auto;

  li {
    height: 150px;
    width: 30%;
    margin: @card-spacing-width;
    padding: 0 @card-spacing-width;
    position: relative;
    overflow: hidden;
    box-shadow: 2px 2px 3px -2px var(--snipetShadow-Color);

    &:hover {
      box-shadow: 5px 5px 8px -3px var(--snipetShadow-hoverColor);

      div.floating {
        backdrop-filter: unset;
        z-index: -9;

        div {
          visibility: hidden;
        }
      }
    }

    div {
      user-select: none;
      color: var(--button-Fg);
    }

    .label {
      text-align: center;
    }

    .floating {
      backdrop-filter: blur(2px);
      background-color: var(--snipetMask-Color);
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
    }

    .ri-add-line {
      font-size: 5em;
    }

    .snippet-show {
      overflow: hidden;
      margin: 0;
      tab-size: 4;
      font-size: 1.1em;
    }
  }
}
</style>
