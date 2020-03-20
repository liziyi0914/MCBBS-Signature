class Color {

	constructor(r,g,b,a=255) {
		this.alpha = parseInt(a);
		this.R = parseInt(r);
		this.G = parseInt(g);
		this.B = parseInt(b);
	}

	mix(c) {
		this.R = ((this.R*(255-c.alpha)+c.R*c.alpha)/255)%256;
		this.G = ((this.G*(255-c.alpha)+c.G*c.alpha)/255)%256;
		this.B = ((this.B*(255-c.alpha)+c.B*c.alpha)/255)%256;
		return this;
	}

	equals(c) {
		return this.R==c.R&&this.G==c.G&&this.B==c.B&&this.alpha==c.alpha;
	}

	static RED = new Color(255,0,0);
	static GLASS = new Color(0,0,0,0);

}

class Picture {

	data = null;
	originData = null;
	width = 0;
	height = 0;

	constructor(data,w,h) {
		this.data = Uint8ClampedArray.from(data);
		this.originData = Uint8ClampedArray.from(data);
		this.width = w;
		this.height = h;
	}

	static of(img) {
		return new Picture(img.data,img.width,img.height);
	}

	static create(w,h) {
		var arr = [];
		for(var i=0;i<w*h*4;i++) {
			arr[i] = 255;
		}
		return new Picture(arr,w,h);
	}

	getPic() {
		return new ImageData(this.data,this.width,this.height);
	}

	setARGB(x,y,color) {
		var index = (x+y*this.width)*4;
		this.data[index] = color.R;
		this.data[index+1] = color.G;
		this.data[index+2] = color.B;
		this.data[index+3] = color.alpha;
	}

	getARGB(x,y) {
		var index = (x+y*this.width)*4;
		return new Color(this.data[index],this.data[index+1],this.data[index+2],this.data[index+3]);
	}

	getColorByChannel(x,y,ch) {
		return this.data[(x+y*this.width)*4+ch];
	}

	setColorByChannel(x,y,ch,color) {
		this.data[(x+y*this.width)*4+ch] = color;
	}

	copy() {
		return new Picture(Uint8ClampedArray.from(this.data),this.width,this.height);
	}

	fill(x,y,w,h,color) {
		for(var i=0;i<w;i++) {
			for(var j=0;j<h;j++) {
				this.setARGB(x+i,y+j,color);
			}
		}
		return this;
	}

	resize(w,h) {
		var img = Picture.create(w,h);
		var floor = Math.floor;
		var ceil = Math.ceil;
		var sqrt = Math.sqrt;
		for(var i=0;i<w;i++) {
			for(var j=0;j<h;j++) {
				var tx = i/w*this.width;
				var ty = j/h*this.height;
				var p1 = this.getARGB(floor(tx),floor(ty)),
					p2 = this.getARGB(floor(tx),ceil(ty)),
					p3 = this.getARGB(ceil(tx),floor(ty)),
					p4 = this.getARGB(ceil(tx),ceil(ty));
				var dx = tx-floor(tx);
				var dy = ty-floor(ty);
/*				var R = (p1.R*dx+p2.R*(1-dx))*dy+(p3.R*dx+p4.R*(1-dx))*(1-dy);
				var G = (p1.G*dx+p2.G*(1-dx))*dy+(p3.G*dx+p4.G*(1-dx))*(1-dy);
				var B = (p1.B*dx+p2.B*(1-dx))*dy+(p3.B*dx+p4.B*(1-dx))*(1-dy);
				var alpha = (p1.alpha*dx+p2.alpha*(1-dx))*dy+(p3.alpha*dx+p4.alpha*(1-dx))*(1-dy);*/
				var d1 = sqrt(dx**2+dy**2),
					d2 = sqrt((1-dx)**2+dy**2),
					d3 = sqrt(dx**2+(1-dy)**2),
					d4 = sqrt((1-dx)**2+(1-dy)**2);
				var sum = d1+d2+d3+d4;
				var R = (p1.R*d1+p2.R*d2+p3.R*d3+p4.R*d4)/sum;
				var G = (p1.G*d1+p2.G*d2+p3.G*d3+p4.G*d4)/sum;
				var B = (p1.B*d1+p2.B*d2+p3.B*d3+p4.B*d4)/sum;
				var alpha = (p1.alpha*d1+p2.alpha*d2+p3.alpha*d3+p4.alpha*d4)/sum;
				img.setARGB(i,j,new Color(R,G,B,alpha));
			}
		}
		return img;
	}

	convert(x,y,w,h) {
		var data = new Uint8ClampedArray(w*h*4);
		data.fill(255);
		for(var i=0;i<w&&x+i<this.width;i++) {
			for(var j=0;j<h&&y+j<this.height;j++) {
				var color = this.getARGB(i+x,j+y);
				var index = (i+j*w)*4;
				data[index] = color.R;
				data[index+1] = color.G;
				data[index+2] = color.B;
				data[index+3] = color.alpha;
			}
		}
		return new Picture(data,w,h);
	}

	drawImage(img,x,y) {
		for(var i=0;i<img.width&&x+i<this.width;i++) {
			for(var j=0;j<img.height&&y+j<this.height;j++) {
				this.setARGB(x+i,y+j,this.getARGB(x+i,y+j).mix(img.getARGB(i,j)));
			}
		}
		return this;
	}

}

function rgb2rgba(arr) {
	var result = [];
	for(var i=0;i<arr.length;i++) {
		result.push(arr[i]);
		if(i%3==2) {
			result.push(255);
		}
	}
	return result;
}

export {
	Picture,
	Color,
};
