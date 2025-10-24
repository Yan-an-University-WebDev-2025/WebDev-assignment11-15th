[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1IGw8b5u)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21272489&assignment_repo_type=AssignmentRepo)

# 课程设计作业 - 题目十一：实时 MARKDOWN 编辑器

## 功能要求

1. 双栏布局：左侧为纯文本编辑区（ `<textarea>` ），右侧为实时预览区。可拖动中间的分隔线
   调整两侧宽度。
2. Markdown 解析与渲染：

   - 监听编辑区的`input`事件，实时将`Markdown`文本转换为`HTML`并在预览区渲染。
   - 必须支持的语法：各级标题（`#`）、粗体（`**`）、斜体（`*`）、代码块
     （` `）、链接（`[]()`）、图片（`![]()`）、无序列表（`-`）、引用（`>`）、行内代码(` `)。

3. 工具栏：在编辑区上方提供工具栏，包含按钮（如：`B`、`I`、链接、图片等），点击后可在光标
   处插入对应的`Markdown`语法符号。
4. 本地存储：自动将编辑内容保存到 `localStorage` ，页面刷新后自动恢复上次编辑的内容
