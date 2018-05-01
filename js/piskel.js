(function ($) {
  var frames = [], isClicked = false, brushSize = 10, index = -1, animIndex = 0, button = 0;
  // frames 빈 배열 선언, isClicked 클릭되어있는가? 초기화false, 브러쉬사이즈 10, 순서 -1, anim순서 0, 버튼 0

  var piskel = {    //piskel 변수 선언
    init : function () {    //init 함수 선언
      this.addFrame();      //addFrame 함수 실행

      setInterval(this.refreshAnimatedPreview, 500);    //refreshAnimatedPreview 실행 : 0.5초 후
    },

    getCurrentCanvas : function () {    //현재 캔버스 번호 반환 함수
      return frames[index];   //프레임[순서]
    },

    onCanvasMousemove : function (event) {  //캔버스 위로 마우스 올릴경우 이벤트 함수
      //this.updateCursorInfo(event);
      if (isClicked) {        //클릭된 상태일 경우
        var coords = this.getRelativeCoordinates(event.clientX, event.clientY);// 클릭한경우 x,y값을 get
        this.drawAt(coords.x, coords.y);  //x,y 좌표에 드로우 실행
      }
    },

    createPreviews : function () {    //프리뷰 만들기
      var container = $('preview-list');  //컨테이너 = preview-list
      container.innerHTML = "";     //preview-list 태그 값 ""
      for (var i = 0 ; i < frames.length ; i++) { // 프레임 수만큼 반복
        var preview = document.createElement("li"); //preview 변수 = li 태그 생성
        if (index == i) {                     //현재 캔버스일경우
          preview.className = "selected";     //프리뷰의 클래스 이름은 셀렉티드
        }
        var canvasPreview = document.createElement("canvas"); //캔버스 생성
        
        canvasPreview.setAttribute('width', '128');   //캔버스 넓이 128로 설정
        canvasPreview.setAttribute('height', '128');  // 캔버스 높이 128로 설정
        
        canvasPreview.setAttribute('onclick', 'piskel.setFrame('+i+')');    // 

        canvasPreview.getContext('2d').drawImage(frames[i], 0, 0, 320, 320, 0, 0 , 128, 128);
        preview.appendChild(canvasPreview); // 캔버스_프리뷰를 프리뷰의 자식으로 설정


        container.appendChild(preview);   //프리뷰를 컨테이너의 자식으로 설정

      }
    },

    refreshAnimatedPreview : function () {  // 애니메이션화된 프리뷰 리프레쉬
      var context = $('animated-preview').getContext('2d');   // context 변수 = 에니메이션화된 프리뷰의 내용 겟 '2d'
      // erase canvas, verify proper way
      context.fillStyle = "white";    //context를 흰색으로 설정
      context.fillRect(0, 0, 256, 256);

      context.drawImage(frames[animIndex++], 0, 0, 320, 320, 0, 0 , 256, 256);
      if (animIndex == frames.length) {
        animIndex = 0;
      }
    },

    setFrame : function (frameIndex) {
      index = frameIndex;
      $('canvas-container').innerHTML = "";
      $('canvas-container').appendChild(this.getCurrentCanvas());
      this.createPreviews();
    },

    updateCursorInfo : function (event) {
      var cursor = $('cursorInfo');
      cursor.style.top = event.clientY + 10 + "px";
      cursor.style.left = event.clientX + 10 + "px";

      var coordinates = this.getRelativeCoordinates(event.clientX, event.clientY)
      cursor.innerHTML = [
        "X : " + coordinates.x,
        "Y : " + coordinates.y
      ].join(", ");
    },

    onCanvasMousedown : function (event) {  //마우스 클릭했을 경우 이벤트 함수
      isClicked = true;   //클릭  불린 true
      button = event.button;  // 버튼은 이벤트.버튼
      var coords = this.getRelativeCoordinates(event.clientX, event.clientY);   // x,y 좌표값을 따온다
      this.drawAt(coords.x, coords.y);  //x,y 좌표에 드로우 실행
    },
    
    onCanvasMouseup : function (event) {    //마우스 클릭후 손가락 땠을때 이벤트 함수
      isClicked = false;    //클릭 불린 false
    },

    drawAt : function (x, y) {    //드로우 함수 (매개변수 x,y 좌표값)
      if (x < 0 || y < 0 || x > 320 || y > 320) return;   //x,y가 범위 0~ 320 을 벗어났을 경우 함수 종료
      var context = this.getCurrentCanvas().getContext('2d');   // context = 현재 캔버스의 context 호출
      if (button == 0) {        //버튼 0 일경우
        context.fillStyle = "black";       // 검은색으로
      } else {                  //아닐경우
        context.fillStyle = "white";        //흰색으로   
      }

      context.fillRect(x - x%brushSize, y - y%brushSize, brushSize, brushSize);   //context를 채운다. (x시작점,y시작점, x칠할범위,y칠할 범위)
      this.createPreviews();
    },

    onCanvasContextMenu : function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.cancelBubble = true;
      return false;
    },
    getRelativeCoordinates : function (x, y) {  //관계적 x,y 좌표 얻기
      var canvas = this.getCurrentCanvas();     //캔버스 현재 캔버스 불러오기
      var canvasRect = canvas.getBoundingClientRect();    //
      return {
        x : x - canvasRect.left,
        y : y - canvasRect.top
      }
    },

    addFrame : function () {
      var canvas = document.createElement("canvas");
      canvas.setAttribute('width', '320');
      canvas.setAttribute('height', '320');
      canvas.setAttribute('onmousemove', 'piskel.onCanvasMousemove(arguments[0])');
      canvas.setAttribute('oncontextmenu', 'piskel.onCanvasContextMenu(arguments[0])');
      canvas.setAttribute('onclick', 'piskel.onCanvasClick(arguments[0])');
      var context = canvas.getContext('2d'); 

      context.fillStyle = "white";
      context.fillRect(0, 0, 320, 320);

      if(frames[index]) { //is a valid canvas
        context.drawImage(frames[index], 0, 0, 320, 320, 0, 0 , 320, 320);
      }

      frames.push(canvas);
      this.setFrame(frames.length - 1);
    }
  };

  window.piskel = piskel;
  piskel.init();

})(function(id){return document.getElementById(id)});
