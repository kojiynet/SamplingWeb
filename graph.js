'use strict'

/*
graph.js

すでにcanvIdが定義されている必要がある。
すでにresultVecが定義されている必要がある。

Defined in this file...

class CanvTrans
class GraphType
Global Variables:
  graphObj
*/


// Canvas Point Transformer
class CanvTrans {

  // グラフ内の理論座標をmath、HTMLでの座標をscreenとする。

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

    this.xTransRate = this.screenw / this.mathw; // x座標のmathでの間隔1がscreenでのいくつか
    this.yTransRate = this.screenh / this.mathh; // y座標のmathでの間隔1がscreenでのいくつか

  }

  // Mathのx座標をScreenの値に変換する。
  xMathToScreen( mX)
  {
    let retx = this.screenx1 + ( mX - this.mathx1) * this.xTransRate;
    return retx;
  }

  // Mathのy座標をScreenの値に変換する。
  yMathToScreen( mY)
  {
    let rety = this.screeny1 + ( this.mathy2 - mY) * this.yTransRate;
    return rety;
  }

  // Mathの(x,y)座標をScreenの値に変換する。
  // リストで返す。
  mathToScreen( mX, mY)
  {
    return [ xMathToScreen( mX), yMathToScreen( mY)];
  }

};

// Graph-drawing Class
class GraphType {

  constructor()
  {
    
    this.drawCon = canvId.getContext( "2d");

    this.canvasW = canvId.getAttribute( "width");
    this.canvasH = canvId.getAttribute( "height");

    this.screenx1 = 50; // canvasのうち、左側50は余白
    this.screeny1 = 50; // canvasのうち、上側50は余白
    this.screenx2 = this.canvasW - 10; // canvasのうち、右側50は余白
    this.screeny2 = this.canvasH - 40; // canvasのうち、下側50は余白

    // 理論座標系の範囲
    this.mathx1 = 0;
    this.mathy1 = 40;
    this.mathx2 = 50;
    this.mathy2 = 80;

    // x方向とy方向の目盛の間隔
    this.xstep = 5;
    this.ystep = 5;

    this.ct = new CanvTrans(
      this.screenx1, this.screeny1, this.screenx2, this.screeny2,
      this.mathx1, this.mathy1, this.mathx2, this.mathy2
    );

  }

  clear()
  {
    this.drawCon.clearRect( 0, 0, this.canvasW, this.canvasH);
  }

  drawBackground()
  {

    let drawCon = this.drawCon;
    let canvasW = this.canvasW;
    let canvasH = this.canvasH;
    let screenx1 = this.screenx1;
    let screeny1 = this.screeny1;
    let screenx2 = this.screenx2;
    let screeny2 = this.screeny2;
    let mathx1 = this.mathx1;
    let mathy1 = this.mathy1;
    let mathx2 = this.mathx2;
    let mathy2 = this.mathy2;
    let xstep = this.xstep;
    let ystep = this.ystep;
    let ct = this.ct;
    
    // タイトル描画
    drawCon.textAlign = "center"; // 指定x座標がテキストの左右方向の中心を指すことになる（はず）
    drawCon.textBaseline = "top"; // 指定y座標がテキストの上部を指すことになる（はず）
    drawCon.font = "15pt Arial";
    drawCon.fillStyle = "rgb(0,0,0)";
    drawCon.fillText( "標本サイズと標本平均", ( canvasW / 2), 5); 

    // x軸描画
    drawCon.textAlign = "center"; // 指定x座標がテキストの左右方向の中心を指すことになる（はず）
    drawCon.textBaseline = "top"; // 指定y座標がテキストの上部を指すことになる（はず）
    drawCon.font = "12pt Arial";
    drawCon.fillStyle = "rgb(0,0,0)";
    drawCon.strokeStyle = "rgb(0,0,0)";

    drawCon.fillText( "標本サイズ", canvasW / 2, canvasH - 15);

    drawCon.beginPath();
    drawCon.moveTo( screenx1, screeny2);
    drawCon.lineTo( screenx2, screeny2);
    drawCon.stroke();
    
    // x方向の目盛の描画
    for ( let x = mathx1; x <= mathx2; x += xstep){
      
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
    drawCon.textAlign = "center"; // 指定x座標がテキストの左右方向の中心を指すことになる（はず）
    drawCon.textBaseline = "top"; // 指定y座標がテキストの上部を指すことになる（はず）
    drawCon.font = "12pt Arial";
    drawCon.fillStyle = "rgb(0,0,0)";
    drawCon.strokeStyle = "rgb(0,0,0)";

    drawCon.rotate( -0.5 * Math.PI); // 座標系を回転
    drawCon.fillText( "標本平均", -1 * canvasH / 2, 5);
    drawCon.rotate(  0.5 * Math.PI); // 座標系を回転（戻す）

    drawCon.beginPath();
    drawCon.moveTo( screenx1, screeny1);
    drawCon.lineTo( screenx1, screeny2);
    drawCon.stroke();

    // y方向の目盛の描画
    drawCon.textAlign = "end"; // 指定x座標がテキストの終端位置を指すことになる（はず）
    drawCon.textBaseline = "middle";  // 指定y座標がテキストの上下方向の中心を指すことになる（はず）
    for ( let y = mathy1; y <= mathy2; y += ystep){

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

  // 1つだけデータ点を描画
  drawSinglePoint( ss, sm, colorstr)
  {

    let x = this.ct.xMathToScreen( ss); 
    let y = this.ct.yMathToScreen( sm);
    this.drawCon.strokeStyle = colorstr; 
    //this.drawCon.fillStyle = "rgb(20,20,200)";
    this.drawCon.beginPath();
    this.drawCon.ellipse( x, y, 4, 4, 0, 0, Math.PI * 2); // 半径が4の円
    this.drawCon.stroke();
    //this.drawCon.fill();

  }

  // データ点をすべて描画
  // 最後の点の色をcolorstrLastで指定する。
  // それ以外の点の色をcolorstrで指定する。
  drawSamplePoints( colorstr = "blue", colorstrLast = "red")
  {

    let npoints = resultVec.length;
    let npointsMinus1 = npoints - 1;

    for ( let i = 0; i < npointsMinus1; ++i){

      let ss = resultVec[ i].ssize;
      let sm = resultVec[ i].smean;
      this.drawSinglePoint( ss, sm, colorstr); 

    }

    let ss = resultVec[ npointsMinus1].ssize;
    let sm = resultVec[ npointsMinus1].smean;
    this.drawSinglePoint( ss, sm, colorstrLast); 

  }

  // グラフをクリアして再描画する。
  redrawGraph()
  {

    this.clear();
    this.drawBackground();
    this.drawSamplePoints();

  }

};

let graphObj = new GraphType();

