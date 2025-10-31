// 声明节点
const editor = document.getElementById('editor');/*编辑区*/
const preview = document.getElementById('preview');/*预览区*/

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
}

editor.addEventListener('input', render);/*监听输入，并渲染*/

window.addEventListener('DOMContentLoaded', () => {
    render();/* 渲染 */
});/* 页面加载完成时渲染 */


















