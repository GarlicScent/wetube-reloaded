const path = require("path");

module.exports = {
	entry: "./src/client/js/main.js",
	mode: "development",
	//mode 설정을 안하면 기본적으로 production 모드로 설정되어 압축된다. development에서는 읽기 편하게 바꿔준다.
	output: {
		filename: "main.js",
		//변경한 파일이름
		path: path.resolve(__dirname, "assets", "js"),
		//변경한 파일 저장 위치
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
			],
		},
	},
};
