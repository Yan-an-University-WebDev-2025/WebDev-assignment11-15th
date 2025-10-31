// 声明节点
const editor = document.getElementById('editor');/*编辑区*/
const preview = document.getElementById('preview');/*预览区*/
const LS_KEY = 'md-editor-content';/*本地存储的键*/
/*正则转换*/
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


/*渲染*/
function render() {
    /*将编辑器中的内容进行解析，并渲染到预览区*/
    preview.innerHTML = parse(editor.value);
    localStorage.setItem(LS_KEY, editor.value);/*保存到本地*/
}

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

/*监听输入，并渲染*/
editor.addEventListener('input', render);/*监听输入，并渲染*/

/* 拖动编辑器宽度 */
const resizer = document.getElementById('resizer');/*拖动编辑器宽度*/
let isResizing = false;/*是否正在拖动*/
resizer.addEventListener('mousedown', e => {
    isResizing = true;/*正在拖动*/
    document.body.style.cursor = 'col-resize';/*改变鼠标样式*/
});/*监听鼠标按下*/
document.addEventListener('mousemove', e => {
    if (!isResizing) return;/*不在拖动中*/
    const width = e.clientX;/*获取鼠标位置*/
    document.querySelector('.left').style.width = width + 'px';/*设置编辑器宽度*/
});/*监听鼠标移动*/
document.addEventListener('mouseup', () => {
    isResizing = false;/*停止拖动*/
    document.body.style.cursor = 'default';/*恢复鼠标样式*/
});/*监听鼠标抬起*/

/* 页面加载完成时渲染 */
window.addEventListener('DOMContentLoaded', () => {
    editor.value = localStorage.getItem(LS_KEY) || `# 欢迎使用实时 Markdown 编辑器

**功能清单：**
- 左侧编辑，右侧实时预览
- 工具栏快速插入语法
- 拖拽中间条调整宽度
- 自动保存到 localStorage

开始写作吧！`;
    render();/* 渲染 */
});


















