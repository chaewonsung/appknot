import Component from './Component.js';

export default class Footer extends Component {
  appendHTML() {
    this.elem.innerHTML = `
              <div class="row1">
          <div class="footer_nav">
            <div class="footer_nav_row">
              <a href=""><span>home</span></a>
              <a href=""><span>solution</span></a>
              <a href=""><span>about</span></a>
              <a href=""><span>work</span></a>
              <a href=""><span>contact</span></a>
            </div>
            <div class="footer_nav_row">
              <a href=""><span>r&d</span></a>
              <a href=""><span>knotters</span></a>
            </div>
          </div>
          <div class="big_text top">
            <span>look around</span>
            <span>our social media</span>
            <span class="tag instagram">instagram</span>
            <span class="tag youtube">youtube</span>
          </div>
        </div>
        <div class="row2">
          <div class="big_text bottom">
            <span>we have</span>
            <span>solutions</span>
            <span class="tag handly">handly</span>
            <span class="tag mentor">mentor</span>
          </div>
          <div class="small_text">
            <span class="address ko">
              서울시 성동구 아차산로 126,<br />
              더리브세종타워 613호 APPKNOT
            </span>
            <span class="tell">T.02-702-5527/F.02-702-5528</span>
            <div class="copyright">
              <span>privacy policy</span>
              <span>&copy; 2023 appknot all rights reserved</span>
            </div>
          </div>
        </div>
    `;
  }
}
