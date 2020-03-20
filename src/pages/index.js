import react from 'react';
import {
	Card,
	Button,
	Input,
	Checkbox,
	Modal
} from 'antd';
import {
	ChromePicker
} from 'react-color';
import { Picture } from '../utils';
import img_bilibili from '../assets/bilibili.png';
import img_acfun from '../assets/acfun.png';
import img_dayu from '../assets/dayu.png';
import img_iqiyi from '../assets/iqiyi.png';
import img_youtube from '../assets/youtube.png';
import img_pornhub from '../assets/pornhub.png';
import img_douyin from '../assets/douyin.png';
import img_kuaishou from '../assets/kuaishou.png';
import img_weibo from '../assets/weibo.png';
import img_twitter from '../assets/twitter.png';
import img_github from '../assets/github.png';
import Painter from '../components/Painter';
import Upload from '../components/Upload';

var icons = [
	{ label: 'Bilibili', value: 'bilibili', img: img_bilibili },
	{ label: '大鱼号', value: 'dayu', img: img_dayu },
	{ label: '爱奇艺', value: 'iqiyi', img: img_iqiyi },
	{ label: 'AcFun', value: 'acfun', img: img_acfun },
	{ label: '抖音', value: 'douyin', img: img_douyin },
	{ label: '快手', value: 'kuaishou', img: img_kuaishou },
	{ label: 'Youtube', value: 'youtube', img: img_youtube },
	{ label: 'PornHub', value: 'pornhub', img: img_pornhub },
	{ label: '微博', value: 'weibo', img: img_weibo },
	{ label: 'Twitter', value: 'twitter', img: img_twitter },
	{ label: 'Github', value: 'github', img: img_github }
];

class IndexPage extends react.Component {

	iconCount = 0;
	iconLoaded = false;

	modal = Modal.info({content:'资源加载中，请稍后……',okButtonProps:{style:{display:'none'}}});

	constructor() {
		super();
		this.state = {
			logo: '',
			bg: '#FFFFFF',
			icons: [],
			iconData: {}
		};
		this.pid = setInterval(()=>{
			if(this.iconLoaded) {
				clearInterval(this.pid);
				this.ctx = this.canvas.getContext('2d');
				var iconData = {};
				icons.forEach(icon=>{
					this.ctx.drawImage(icon.ref,0,0);
					iconData[icon.value] = Picture.of(this.ctx.getImageData(0,0,512,512));
					this.ctx.clearRect(0,0,512,512);
				});
				this.setState({iconData: iconData});
				this.modal.destroy();
			}
		},500);
	}

	onIconLoad() {
		this.iconCount++;
		if(this.iconCount==icons.length) {
			this.iconLoaded = true;
		}
	}

	render() {
		return (
		<div>
			<div style={{display:'none'}}>
				{icons.map(it=>(<img ref={img=>it['ref']=img} src={it.img} onLoad={()=>this.onIconLoad()}/>))}
				<canvas ref={c=>this.canvas=c} width={512} height={512}/>
			</div>
			<Card style={{margin:'1em'}}>
				<Upload callback={data=>this.setState({logo:data})}>上传LOGO</Upload>
				<div>主题色<Input defaultValue='#FFFFFF' onChange={e=>this.setState({bg:e.target.value})}/></div>
				<br/>
				<Checkbox.Group options={icons} onChange={items=>this.setState({icons:items})}/>
			</Card>
			<Painter logo={this.state.logo} icons={this.state.icons} bg={this.state.bg} iconData={this.state.iconData}/>
		</div>
		);
	}

}

export default IndexPage;
