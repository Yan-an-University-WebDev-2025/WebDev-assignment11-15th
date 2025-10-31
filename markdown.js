// 声明节点
const editor = document.getElementById('editor');/*编辑区*/
const preview = document.getElementById('preview');/*预览区*/



/*渲染*/
function render() {
    /*将编辑器中的内容进行解析，并渲染到预览区*/
    preview.innerHTML = editor.value;
}

editor.addEventListener('input', render);/*监听输入，并渲染*/

window.addEventListener('DOMContentLoaded', () => {
    render();/* 渲染 */
});/* 页面加载完成时渲染 */


















