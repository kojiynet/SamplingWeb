'use strict'

  // Canvas Point Transformer
  class CanvTrans {

    // グラフ内座標をmath、HTMLでの座標をscreenとする。

    constructor( scx1, scy1, scx2, scy2, mx1, my1, mx2, my2)
    {

      this.screenx1 = scx1; // screenでの左上の点
      this.screeny1 = scy1; // screenでの左上の点
      this.screenx2 = scx2; // screenでの右下の点
      this.screeny2 = scy2; // screenでの右下の点
      this.screenw = this.screenx2 - this.screenx1;
      this.screenh = this.screeny2 - this.screeny1;

      this.mathx1 = mx1; // mathでの左下の点
      this.mathy1 = my1; // mathでの左下の点
      this.mathx2 = mx2; // mathでの右上の点
      this.mathy2 = my2; // mathでの右上の点
      this.mathw = this.mathx2 - this.mathx1;
      this.mathh = this.mathy2 - this.mathy1;

      this.xTransRate = this.screenw / this.mathw; // x座標のmathでの1がscreenでのいくつか
      this.yTransRate = this.screenh / this.mathh; // y座標のmathでの1がscreenでのいくつか

    }

    xMathToScreen( mX)
    {
      let retx = this.screenx1 + ( mX - this.mathx1) * this.xTransRate;
      return retx;
    }

    yMathToScreen( mY)
    {
      let rety = this.screeny1 + ( this.mathy2 - mY) * this.yTransRate;
      return rety;
    }

    // リストで返す。
    mathToScreen( mX, mY)
    {
      return [ xMathToScreen( mX), yMathToScreen( mY)];
    }

  };

  let ct = new CanvTrans();

  function drawFirst()
  {

    let drawCon = canvId.getContext( "2d");

    let canvasW = canvId.getAttribute( "width");
    let canvasH = canvId.getAttribute( "height");
    let screenx1 = 50;
    let screeny1 = 50;
    let screenx2 = canvasW - 10;
    let screeny2 = canvasH - 40;

    let mathx1 = 0;
    let mathy1 = 40;
    let mathx2 = 50;
    let mathy2 = 80;

    ct = new CanvTrans( screenx1, screeny1, screenx2, screeny2, mathx1, mathy1, mathx2, mathy2);

    // タイトル描画
    drawCon.textAlign = "center"; // 指定x座標はテキストの左右方向の中心を指す、ように（？）
    drawCon.textBaseline = "top"; // 指定y座標はテキストの上部を指す、ように（？）
    drawCon.font = "15pt Arial";
    drawCon.fillStyle = "rgb(0,0,0)";
    drawCon.fillText( "標本サイズと標本平均", ( canvasW / 2), 5); 

    // x軸描画
    drawCon.textAlign = "center"; // 指定x座標はテキストの左右方向の中心を指す、ように（？）
    drawCon.textBaseline = "top"; // 指定y座標はテキストの上部を指す、ように（？）
    drawCon.font = "12pt Arial";
    drawCon.fillStyle = "rgb(0,0,0)";
    drawCon.strokeStyle = "rgb(0,0,0)";

    drawCon.fillText( "標本サイズ", canvasW / 2, canvasH - 15);

    drawCon.beginPath();
    drawCon.moveTo( screenx1, screeny2);
    drawCon.lineTo( screenx2, screeny2);
    drawCon.stroke();
    
    for ( let x = mathx1; x <= mathx2; x += 5){
      
      let scx = ct.xMathToScreen( x);
      
      drawCon.strokeStyle = "rgb(0,0,0)";
      drawCon.beginPath();
      drawCon.moveTo( scx, screeny2);
      drawCon.lineTo( scx, screeny2 + 5);
      drawCon.stroke();
      drawCon.fillText( x, scx, screeny2 + 5);

      drawCon.strokeStyle = "rgb(180,180,180)";
      drawCon.beginPath();
      drawCon.moveTo( scx, screeny2);
      drawCon.lineTo( scx, screeny1);
      drawCon.stroke();

    }

    // y軸描画
    drawCon.textAlign = "center"; // 指定x座標はテキストの左右方向の中心を指す、ように（？）
    drawCon.textBaseline = "top"; // 指定y座標はテキストの上部を指す、ように（？）
    drawCon.font = "12pt Arial";
    drawCon.fillStyle = "rgb(0,0,0)";
    drawCon.strokeStyle = "rgb(0,0,0)";

    drawCon.rotate( -0.5 * Math.PI); // 座標系を回転
    drawCon.fillText( "標本平均", -1 * canvasH / 2, 5);
    drawCon.rotate( 0.5 * Math.PI); // 座標系を回転（戻す）

    drawCon.beginPath();
    drawCon.moveTo( screenx1, screeny1);
    drawCon.lineTo( screenx1, screeny2);
    drawCon.stroke();
    
    drawCon.textAlign = "end";
    drawCon.textBaseline = "middle";

    for ( let y = mathy1; y <= mathy2; y += 5){

      let scy = ct.yMathToScreen( y);

      drawCon.beginPath();
      drawCon.moveTo( screenx1, scy);
      drawCon.lineTo( screenx1 - 5, scy);
      drawCon.stroke();
      drawCon.fillText( y, screenx1 - 5, scy);

      drawCon.strokeStyle = "rgb(180,180,180)";
      drawCon.beginPath();
      drawCon.moveTo( screenx1, scy);
      drawCon.lineTo( screenx2, scy);
      drawCon.stroke();

    }

  }

  function addSamplePoint()
  {

    let drawCon = canvId.getContext( "2d");

    let ssize = sample.length;
    let smean = getSampleScoreMean();

    let x = ct.xMathToScreen( ssize); 
    let y = ct.yMathToScreen( smean);

    drawCon.strokeStyle = "rgb(0,0,0)";
    drawCon.beginPath();
    drawCon.ellipse( x, y, 2, 2, 0, 0, Math.PI * 2);
    drawCon.stroke();

  }

