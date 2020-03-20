
// ref: https://umijs.org/config/
export default {
	treeShaking: true,
	publicPath: '/MCBBS-Signature/',
	history: 'hash',
	plugins: [
		// ref: https://umijs.org/plugin/umi-plugin-react.html
		['umi-plugin-react', {
			antd: true,
			dva: false,
			dynamicImport: false,
			title: 'MCBBS_signature',
			dll: false,

			routes: {
				exclude: [
					/components\//,
				],
			},
		}],
	],
}
