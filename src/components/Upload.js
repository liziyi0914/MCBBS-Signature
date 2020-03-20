import react from 'react';
import {
	Button,
	Upload
} from 'antd';
import { Picture } from '../utils';

export default class extends react.Component {

	reader = new FileReader();
	img = null;
	loaded = false;
	canvas = null;

	static defaultProps = {
		callback: ()=>{}
	};

	constructor() {
		super();
		this.state = {
			width: 10,
			height: 10
		};
		this.reader.onload = ()=>{
			this.img.src = this.reader.result;
		};
		this.pid = setInterval(()=>{
			if(this.ctx!=null && this.loaded){
				clearInterval(this.pid);
				this.ctx.drawImage(this.img,0,0);
				this.props.callback(Picture.of(this.ctx.getImageData(0,0,this.state.width,this.state.height)));
			}
		},500);
	}

	beforeUpload(file) {
		this.reader.readAsDataURL(file);
		return false;
	}

	onLoad() {
		this.setState({
			width: this.img.width,
			height: this.img.height
		});
		this.loaded = true;
	}

	render() {
		if(this.canvas!=null)this.ctx=this.canvas.getContext('2d');
		return (
		<div>
			<Upload beforeUpload={f=>this.beforeUpload(f)}>
				<Button>{this.props.children}</Button>
			</Upload>
			<img ref={img=>this.img=img} onLoad={()=>this.onLoad()} style={{display:'none'}}/>
			<canvas ref={c=>this.canvas=c} width={this.state.width} height={this.state.height}/>
		</div>
		);
	}

}
