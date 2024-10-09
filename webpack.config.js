const path = require('path');

module.exports = {
  // 입력(entry) 파일
  entry: {
    main: ['./src/js/main.js', './src/js/main_canvas.js'],
    about: './src/js/about.js',
    solution: ['./src/js/solution.js', './src/js/solution_canvas.js'],
  },

  // 출력(output) 설정
  output: {
    filename: '[name].bundle.js', // 번들링된 파일의 이름
    path: path.resolve(__dirname, 'dist'), // 출력 파일이 저장될 디렉토리
    clean: true, // 빌드 시 이전 출력 디렉토리의 파일을 정리
  },

  // 모드(mode) 설정
  mode: 'development', // 'production'으로 설정하면 코드 최적화 및 압축이 진행됨

  // 모듈(module) 설정
  module: {
    rules: [
      {
        test: /\.js$/, // .js 확장자 파일을 대상으로
        exclude: /node_modules/, // node_modules 폴더 제외
        use: {
          loader: 'babel-loader', // Babel을 사용해 ES6+ 코드를 ES5로 변환
          options: {
            presets: ['@babel/preset-env'], // 최신 JavaScript 문법을 구형 브라우저에 맞게 변환
          },
        },
      },
      {
        test: /\.css$/, // .css 확장자 파일을 대상으로
        use: ['style-loader', 'css-loader'], // CSS를 번들에 포함시키기 위해 사용
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
