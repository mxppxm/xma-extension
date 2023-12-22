
/**
 * 1. 获取到pageData后传给弹窗
 * 2. 弹窗中修改pageData
 * 3. 修改后的pageData传给content
 * 4. 生效
 */



// window.addEventListener(
//     "message",
//     function (event) {
//         const { sign, data } = event.data
//         if (sign == 'XMA_EXTENSION') {
//             if (data.event == 'page_data_load') {
//             }
//         }
//     },
//     false
// )
// 获取 window.pageData 的属性描述符
var propertyDescriptor = Object.getOwnPropertyDescriptor(window, 'pageData');
console.log("🚀 xma 🚀 ~ file: pageData.js:15 ~ propertyDescriptor:", propertyDescriptor);

window.pageData = null;
// 假设初始时 window.pageData 为 undefined
console.log('Initial value of window.pageData:', window.pageData);

// 使用 Object.defineProperty 劫持 window.pageData
Object.defineProperty(window, 'pageData', {
    configurable: true,
    enumerable: true,
    get: function () {
        return this._pageData; // 返回真实的值
    },
    set: function (newValue) {
        this._pageData = { ...newValue, xma: 1 }; // 设置真实的值
        this._pageData.data.is_guide = 1;
        console.log('window.pageData has been changed:', newValue);

        // 在这里可以添加你希望执行的逻辑
    }
});
window.postMessage({ sign: 'XMA_EXTENSION', data: { event: 'page_data_load', pageData } })