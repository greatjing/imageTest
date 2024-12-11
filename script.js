document.getElementById('compressButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const scalePercentageInput = document.getElementById('scalePercentage');
    const preview = document.getElementById('preview');
    const fileSizes = document.getElementById('fileSizes');
    const downloadLink = document.getElementById('downloadLink');

    if (fileInput.files.length === 0) {
        alert('请上传一张图片');
        return;
    }

    const file = fileInput.files[0];
    const scalePercentage = parseInt(scalePercentageInput.value);

    if (isNaN(scalePercentage) || scalePercentage < 1 || scalePercentage > 100) {
        alert('请正确输入缩放比例，范围在 1 到 100 之间');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const originalWidth = img.width;
            const originalHeight = img.height;
            const newWidth = originalWidth * (scalePercentage / 100);
            const newHeight = originalHeight * (scalePercentage / 100);
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            canvas.toBlob(function(blob) {
                const compressedFileSize = (blob.size / 1024).toFixed(2) + ' KB';
                const originalFileSize = (file.size / 1024).toFixed(2) + ' KB';

                // 更新预览区域，保留标题和提示信息
                preview.innerHTML = `
                    <div>
                        <h2>原图</h2>
                        <img src="${event.target.result}" alt="Original Image">
                    </div>
                    <div>
                        <h2>压缩后的图</h2>
                        <img src="${canvas.toDataURL()}" alt="Compressed Image">
                    </div>
                `;
                preview.style.display = 'flex'; // 显示预览区域
                fileSizes.innerHTML = `<p>压缩前文件大小: ${originalFileSize}</p><p>压缩后文件大小: ${compressedFileSize}</p>`;
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = 'compressed_image.png';
                downloadLink.style.display = 'block';
                downloadLink.innerText = '下载压缩后的图片';
            }, 'image/png');
        };
    };
    reader.readAsDataURL(file);
}); 