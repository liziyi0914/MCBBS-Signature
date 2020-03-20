import react from 'react';
import {
	Button,
	Card
} from 'antd';
import { Picture } from '../utils';

export default class extends react.Component {

	static defaultProps = {
		logo: '',
		bg: '#00FF00',
		icons: [],
		iconData: {}
	};

	comps = {};
	canvas = null;
	ctx = null;
	resultURL = '';

	constructor() {
		super();
		this.state = {
			resultURL: ''
		};
		this.pid = setInterval(()=>{
			if(this.canvas!=null) {
				this.ctx = this.canvas.getContext('2d');
				clearInterval(this.pid)
			}
		},500);
	}

	reloadProps() {
		this.comps = {
			logo: {
				data: this.props.logo,
				x: 0,
				y: 0,
				w: parseInt(210/this.props.logo.height*this.props.logo.width)
			},
			bg: this.props.bg,
			icons: {
				items: this.props.icons,
				x: 0,
				y: 6
			}
		};

		this.paint();
	}

	paint() {
		if(this.ctx==null) {
			return;
		}
		this.clear();
		this.paintBg();
		this.paintLogo();
		this.paintGradient();
		this.paintIcons();

		this.setState({resultURL: this.canvas.toDataURL()});
	}

	clear() {
		this.ctx.clearRect(0,0,760,210);
	}

	paintBg() {
		this.ctx.fillStyle = this.comps.bg;
		this.ctx.fillRect(0,0,760,210);
	}

	paintLogo() {
		this.ctx.putImageData(this.comps.logo.data.resize(this.comps.logo.w,210).getPic(),this.comps.logo.x,this.comps.logo.y);
	}

	paintGradient() {
		var lg = this.ctx.createLinearGradient(this.comps.logo.w-10,0,this.comps.logo.w,0);
		lg.addColorStop(0,this.comps.bg+'00');
		lg.addColorStop(1,this.comps.bg);
		this.ctx.fillStyle = lg;
		this.ctx.fillRect(this.comps.logo.w-10,0,10,210);
	}

	paintIcons() {
		var bg = Picture.of(this.ctx.getImageData(0,0,760,210));
		var i = 0;
		this.comps.icons.items.forEach(icon=>{
			bg.drawImage(this.props.iconData[icon].resize(48,48),parseInt(i/3)*60+6+this.comps.icons.x+this.comps.logo.w,(i%3)*60+6+this.comps.icons.y);
			i++;
		});
		this.ctx.putImageData(bg.getPic(),0,0);
	}

	render() {
		return (
		<Card style={{margin:'1em',width:'808px'}}>
			<canvas ref={c=>this.canvas=c} width={760} height={210}/>
			<Button onClick={()=>this.reloadProps()}>绘制</Button>
			<a href={this.state.resultURL} download='signature.png' style={{marginLeft:'1em'}}><Button type='primary'>下载图片</Button></a>
		</Card>
		);
	}

}
