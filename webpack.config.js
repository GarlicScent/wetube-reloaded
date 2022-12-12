const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
	plugins: [
		new MiniCssExtractPlugin({
			filename: "css/styles.css",
		}),
	],
	entry: {
		main: BASE_JS + "main.js",
		videoPlayer: BASE_JS + "videoPlayer.js",
		recorder: BASE_JS + "recorder.js",
		commentSection: BASE_JS + "commentSection.js",
	},
	mode: "development",
	//mode 설정을 안하면 기본적으로 production 모드로 설정되어 압축된다. development에서는 읽기 편하게 바꿔준다.
	watch: true,
	//nodemon 처럼 변경하면 지켜보다가 바로 적용해준다.
	output: {
		filename: "js/[name].js",
		//변경한 파일이름 [name]으로 작성하면 entry의 key로 할 수 있다.
		path: path.resolve(__dirname, "assets"),
		//변경한 파일 저장 위치
		clean: true,
		//기존에 변환한 파일을 삭제하고 다시 설치할 수 있게 해준다.
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				// 모든 js 파일들을 변형하려고 하는 것을 의미한다.
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["@babel/preset-env", { targets: "defaults" }],
						],
					},
				},
			},
			//babel-loader 설정 그대로 가져온 것이다.
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
				//loader는 반대 순서로 작동한다. 1. sass-loader, 2. css-loader, 3.style-loader(MiniCssExtractPlugin.loader로 바꿈)
				// MiniCssExtractPlugin는 css를 따로 빼두는 거다.
			},
		],
	},
};
