export function base64ToBlob(urlData) {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
    // 去掉url的头，并转化为byte
    let bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    let ia = new Uint8Array(ab);
    
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {
        type: mime
    });
}
export function getBase64Image(img) {
  
    let canvas: HTMLCanvasElement|null = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx:CanvasRenderingContext2D | any = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    // console.log(img.src, img.src.split('?')[0].split('.'));
    // let ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    let ext = img.src.split('?')[0].split('.');
    ext = ext[ext.length - 1].toLowerCase();
    // console.log(ext);
    let dataURL = canvas.toDataURL("image/"+ext);
    canvas = null; 
    return dataURL;
}
// 如下演示如何拿到base64格式的数据，可用于上传到服务器端的场景
// var eImage = document.querySelector('#J_imageViewer');
// var image = new Image();
// image.crossOrigin = 'anonymous';
// image.onload = function() {
//   var canvas :CanvasRenderingContext2D | any  = document.createElement('CANVAS');
//   var context = canvas.getContext('2d');
//   canvas.height = image.height;
//   canvas.width = image.width;
//   context.drawImage(image, 0, 0);
//   try {
//     var dataURL = canvas.toDataURL('image/jpeg');
//     console.log(dataURL);
//     // eImage.src = dataURL;
//   } catch (e) {
//     // eImage.src = apFilePath[0];
//   }
//   canvas = null;
// }
// // image.src = apFilePath[0];