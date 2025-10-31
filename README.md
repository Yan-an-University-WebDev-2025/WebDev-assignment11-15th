[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1IGw8b5u)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21272489&assignment_repo_type=AssignmentRepo)

# 课程设计作业 - 题目十一：实时 MARKDOWN 编辑器

## 功能要求

1. 双栏布局：左侧为纯文本编辑区（ `<textarea>` ），右侧为实时预览区。可拖动中间的分隔线

   调整两侧宽度。

2. Markdown 解析与渲染：

   - 监听编辑区的`input`事件，实时将`Markdown`文本转换为`HTML`并在预览区渲染。

   - 必须支持的语法：各级标题（`#`）、粗体（`**`）、斜体（`*`）、代码块

​ （` `）、链接（`[]()`）、图片（`![]()`）、无序列表（`-`）、引用（`>`）、行内代码(` `)。

3. 工具栏：在编辑区上方提供工具栏，包含按钮（如：`B`、`I`、链接、图片等），点击后可在光标

   处插入对应的`Markdown`语法符号。

4. 本地存储：自动将编辑内容保存到 `localStorage` ，页面刷新后自动恢复上次编辑的内容

## 提交日志

- 编写了 Markdown 编辑器页面的工具栏按钮、文本框；

- 进行页面布局设计：按钮的设计，以及一些悬停变化，字体、边框颜色，和鼠标类型；

- 进行了编辑区和预览区的初步设计；

- 页面布局设计：按钮的设计，以及一些悬停变化，字体、边框颜色，和鼠标类型；

- 编辑区和预览区的初步设计；

- 设计了拖拽条 css 样式：宽度、鼠标样式、鼠标悬停（拖拽条的功能尚未实现）；

- 实现了文本的实时输出；

- 添加正则解析模块（函数：parse(md)）；

- 实现了代码快、行内代码、图片、链接、三级标题、引用、无序列表、粗体、斜体、段落的正则转换；

- 修改了部分过长的自定义属性：

- unordered-list --> ul；

- 实现了工具栏插入:通过点击工具栏对应语法的按钮，实现语法插入或替换选中文本；

- 添加了拖拽条功能：通过鼠标监听，修改左侧编辑区宽度，实现拖拽调整宽度，并且添加了鼠标样式转换；

- 为了实现界面简洁美观，预览区样式适宜于阅读：设计了 Markdown 各个语法对应的 CSS 样式，包含了当前实现的 Markdown 语法；

- 本地存储：自动将编辑内容保存到 localStorage，页面刷新后自动恢复上次编辑的内容。

- 添加了浏览器第一次运行，展示的测试文本；

## 一、核心编辑与预览

> 将 Markdown 语法转换成 HTML 文件

### 正则转换

````
function parse(md) {
    let html = md
        // 代码块 ```...```
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // 行内代码 `...`
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // 图片 ![alt](url)
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
        // 链接 [text](url)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        // 标题 #...######
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // 引用 > ...
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        // 无序列表 - ...
        .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
        // 合并相邻 <ul>
        .replace(/<\/ul>\s<ul>/g, '')
        // 粗体 ** **
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // 斜体 * *
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // 段落
        .split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('');
    return html;
}
将Markdown文本转换为HTML
依次处理：代码块、行内代码、图片、链接、标题、引用、无序列表、粗体、斜体
最后将剩余文本按段落处理并返回HTML字符串
**由于实时输出的关系，没有设计成循环结构
````

### 实时渲染

```
function render() {
    preview.innerHTML = parse(editor.value);/* 渲染 */
    localStorage.setItem(LS_KEY, editor.value);/* 本地存储 */
}
editor.value：获取 textarea 编辑器中的 Markdown 文本内容
parse()：调用 Markdown 解析函数，将 Markdown 文本转换为 HTML 字符串
preview.innerHTML：将解析后的 HTML 内容设置到预览区域中显示
```

## 二、工具栏功能

> 添加 Markdown 语法文本

```
/*工具栏插入*/
document.querySelector('.toolbar').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;/*忽略非按钮点击*/
    const cmd = e.target.dataset.command;/*获取按钮命令*/
    const start = editor.selectionStart;/*获取当前光标位置*/
    const end = editor.selectionEnd;/*获取当前光标位置*/
    const selected = editor.value.slice(start, end);/*获取选中的文本*/
    let text = selected;/*默认选中文本*/
    switch (cmd) {
        case 'bold':
            text = `**${selected || '粗体'}**`;
            break;
        case 'italic':
            text = `*${selected || '斜体'}*`;
            break;
        case 'link':
            text = `[${selected || '链接文本'}](url)`;
            break;
        case 'image':
            text = `![${selected || '图片描述'}](image-url)`;
            break;
        case 'code':
            text = `\`${selected || 'code'}\``;
            break;
        case 'ul':
            text = `- ${selected || '列表项'}`;
            break;
        case 'quote':
            text = `> ${selected || '引用内容'}`;
            break;
        case 'h1':
            text = `# ${selected || '标题'}`;
            break;
        case 'h2':
            text = `## ${selected || '标题'}`;
            break;
        case 'h3':
            text = `### ${selected || '标题'}`;
            break;
    }
    editor.setRangeText(text, start, end, 'end');/*替换选中文本*/
    render();/*渲染*/
    editor.focus();/*聚焦*/
});
```

### 主要功能

- 监听 `.toolbar` 元素的点击事件，处理工具栏按钮点击
- 根据不同按钮命令插入对应的 Markdown 语法格式

### 核心逻辑

1. **事件过滤**

   - 检查点击目标是否为按钮元素，如果不是则直接返回
   - 通过 `e.target.dataset.command` 获取按钮的命令类型（应用到在 html 的自定义属性）

2. **光标位置处理**

   - 使用 `editor.selectionStart` 和 `editor.selectionEnd` 获取当前光标位置
   - 通过 `editor.value.slice(start, end)` 获取选中的文本内容

3. **命令处理**
   根据不同的 `cmd` 值，插入对应的 Markdown 语法：

   - `bold`: 插入 `**粗体**` 格式
   - `italic`: 插入 `*斜体*` 格式
   - `link`: 插入 `[链接文本](url)` 格式
   - `image`: 插入 `![图片描述](image-url)` 格式
   - `code`: 插入 ``` null
 `代码`  `` 格式
   - `ul`: 插入 `- 列表项` 格式
   - `quote`: 插入 `> 引用内容` 格式
   - `h1,h2,h3`: 插入对应级别的标题格式

4. **文本替换与更新**
   - 使用 `editor.setRangeText()` 方法替换选中文本
   - 调用 `render()` 函数重新渲染预览
   - 使用 `editor.focus()` 使编辑器重新获得焦点

## 三、交互与 UX

### 拖拽条功能实现

1. **初始化变量**

   ```javascript
   const resizer = document.getElementById("resizer");
   let isResizing = false;
   ```

   - 获取拖拽条元素 `resizer`
   - 定义状态变量 `isResizing` 记录是否正在拖拽

2. **鼠标按下事件**

   ```javascript
   resizer.addEventListener("mousedown", (e) => {
     isResizing = true;
     document.body.style.cursor = "col-resize";
   });
   ```

   - 当在拖拽条上按下鼠标时，设置 `isResizing` 为 `true`
   - 将鼠标光标样式改为列拖拽样式

3. **鼠标移动事件**

   ```javascript
   document.addEventListener("mousemove", (e) => {
     if (!isResizing) return;
     const width = e.clientX;
     document.querySelector(".editor-wrap").style.width = width + "px";
   });
   ```

   - 只有当 `isResizing` 为 `true` 时才执行调整逻辑
   - 获取鼠标当前位置的 X 坐标作为新的宽度值
   - 实时更新 `.editor-wrap` 元素的宽度

4. **鼠标释放事件**

   ```javascript
   document.addEventListener("mouseup", () => {
     isResizing = false;
     document.body.style.cursor = "default";
   });
   ```

   - 鼠标释放时重置 `isResizing` 状态为 `false`
   - 恢复鼠标光标为默认样式

   ​

   | 类别         | 方法名                        | 说明                                       |
   | ------------ | ----------------------------- | ------------------------------------------ |
   | DOM API 方法 | `document.getElementById()`   | 获取页面中指定 ID 的元素对象               |
   | DOM API 方法 | `document.querySelector()`    | 通过 CSS 选择器查找第一个匹配的元素        |
   | DOM API 方法 | `document.addEventListener()` | 为文档添加事件监听器                       |
   | 元素对象方法 | `resizer.addEventListener()`  | 为拖拽手柄元素添加鼠标事件监听器           |
   | 元素对象方法 | `editor.setRangeText()`       | 替换编辑器中指定范围的文本内容             |
   | 自定义函数   | `parse()`                     | 将 Markdown 文本转换为 HTML 标记的解析函数 |
   | 自定义函数   | `render()`                    | 渲染预览区域内容的函数                     |
   | 事件回调函数 | `mousedown` 事件回调          | 处理鼠标按下开始拖拽                       |
   | 事件回调函数 | `mousemove` 事件回调          | 处理鼠标移动调整宽度                       |
   | 事件回调函数 | `mouseup` 事件回调            | 处理鼠标释放结束拖拽                       |

   ### 本地存储（localStorage）

   在这个 Markdown 编辑器中的实现主要通过以下两个部分：

   #### 1. 存储内容

   当用户在编辑器中输入内容时，会触发 `input` 事件，进而调用 [render()](file://C:\Users\26272\Desktop\Web开发基础\big-home\no.8\markdown.js#L37-L41) 函数。在 [render()](file://C:\Users\26272\Desktop\Web开发基础\big-home\no.8\markdown.js#L37-L41) 函数中，会将编辑器的内容保存到 localStorage：

   ```javascript
   function render() {
     preview.innerHTML = parse(editor.value);
     localStorage.setItem(LS_KEY, editor.value); // 保存到本地
   }
   ```

   这里使用了 `localStorage.setItem()` 方法，将编辑器的内容（`editor.value`）以 `LS_KEY`（即 'md-editor-content'）为键名存储起来。

   #### 2. 读取内容

   当页面加载完成时，会从 localStorage 中读取之前保存的内容：

   ```javascript
   window.addEventListener("DOMContentLoaded", () => {
     editor.value =
       localStorage.getItem(LS_KEY) || `# 欢迎使用实时 Markdown 编辑器...`;
     render();
   });
   ```

   这里使用 `localStorage.getItem()` 方法，通过 `LS_KEY` 键名获取之前保存的内容。如果之前没有保存过内容（返回 null），则使用默认的欢迎文本。

   这种实现方式除非用户手动清除浏览器数据，否则数据会一直保存。

   ​

## 四、UI 设计

> Markdown 各个语法的 CSS 样式：

| Markdown 元素     | CSS 选择器                 | 核心样式规则                                                                       |
| ----------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| 一级标题          | `#preview h1`              | 字体大小 2em，底部边框 1px（颜色取自 --border），底部内边距 0.3em                  |
| 二级标题          | `#preview h2`              | 字体大小 1.5em，底部边框 1px（颜色取自 --border），底部内边距 0.3em                |
| 三级标题          | `#preview h3`              | 字体大小 1.25em                                                                    |
| 段落              | `#preview p`               | 上下外边距 8px（控制段间距）                                                       |
| 无序列表/有序列表 | `#preview ul, #preview ol` | 左外边距 24px（控制列表缩进）                                                      |
| 引用块            | `#preview blockquote`      | 左右内边距 1em，文本色 #656d76，左边框 0.25em（颜色取自 --border），上下外边距 8px |
| 行内代码          | `#preview code`            | 背景色取自 --code-bg，内边距 2px 6px，圆角 4px，字体大小 85%                       |
| 代码块            | `#preview pre`             | 背景色取自 --code-bg，内边距 12px，圆角 6px，溢出时显示滚动条                      |
| 代码块内的代码    | `#preview pre code`        | 取消内边距，无背景色                                                               |
| 链接              | `#preview a`               | 文本色取自 --primary，无下划线                                                     |
| 链接（悬停状态）  | `#preview a:hover`         | 显示下划线                                                                         |
| 图片              | `#preview img`             | 最大宽度 100%（自适应容器），圆角 4px                                              |

尚存在问题：

1. 不能调用本体图片；
2. 引用语法，仅实现了一级引用
3. 未实现表格语法

自定义属性

所有这些自定义数据属性都可以通过所属元素的 [`HTMLElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement) 接口来访问。通过 [`HTMLElement.dataset`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) 属性可以访问它们。

1. data-command

提升用户体验，使界面交互更加直观：

1. [cursor - CSS：鼠标样式](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)

代码优化：

1. javascript 中与 CSS 中的鼠标样式重复，移除 js
