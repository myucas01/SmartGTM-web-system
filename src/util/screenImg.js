import html2canvas from "html2canvas"
export default function (id, lw = '350', lh = '41') {
	var lw1 = lw
	var lh1 = lh
	
	var element = document.getElementById(id)
	var width = element.offsetWidth - lw1;
	var height = element.offsetHeight - lh1;
	
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d")
	
	var scale = 2;
	
	canvas.width = width * scale;
	canvas.height = height * scale;
	
	context.translate(-lw1 * scale, -lh1 * scale)
	
	html2canvas(element, {
		dpi: window.devicePixelRatio * scale,
		scale: scale,
		canvas: canvas,
		width: width,
		heigth: height,
		useCORS: true
	}).then(function(canvas) {
		const dataImg = new Image()
		dataImg.src = canvas.toDataURL('image/png', 1.0)
		const alink = document.createElement("a");
		alink.href = dataImg.src;
		alink.download = "商圈截图.jpg";
		alink.click();
	})
}
