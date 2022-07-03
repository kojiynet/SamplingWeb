'use strict'

class Person {

    constructor()
    {
        this.name = "";
        this.score_str = "";
        this.id_str = "";
        this.gender_str = "";
        this.qaclass_str = "";
        this.score = -1;
        this.id = -1;
    }

    setStrFields( name0, score0, id0, gender0, qa0)
    {
        this.name = name0;
        this.score_str = score0;
        this.id_str = id0;
        this.gender_str = gender0;
        this.qaclass_str = qa0;

        let s = parseFloat( score0);
        if ( s != s){ // NaN判定
            this.score = NaN;
        } else {
            this.score = s;
        }

        let t = parseFloat( id0);
        if ( t != t){ // NaN判定
            this.id = NaN;
        } else {
            this.id = t;
        }

    }

};

class Result {

    constructor( ssize0, smean0)
    {
        this.ssize = ssize0; // sample size
        this.smean = smean0; // sample mean
    }

};


const popPeopleCsv = `
name,score,id,gender_str,qaclass_str
めい,65,1,女性,未履修
えま,67,2,女性,未履修
ゆい,72,3,女性,未履修
みお,76,4,女性,履修済
あおい,69,5,女性,履修済
ひまり,62,6,女性,未履修
つむぎ,56,7,女性,未履修
あかり,70,8,女性,履修済
ほのか,70,9,女性,履修済
いちか,68,10,女性,履修済
こはる,65,11,女性,未履修
さな,60,12,女性,未履修
りお,74,13,女性,履修済
はな,63,14,女性,履修済
りこ,73,15,女性,履修済
さら,73,16,女性,未履修
ひな,75,17,女性,履修済
さくら,76,18,女性,履修済
いろは,52,19,女性,未履修
りん,64,20,女性,未履修
ゆあ,75,21,女性,履修済
ゆな,50,22,女性,未履修
ひなた,40,23,女性,未履修
ゆづき,45,24,女性,未履修
みゆ,58,25,女性,履修済
はると,67,26,男性,未履修
そうた,58,27,男性,未履修
はるき,65,28,男性,履修済
みなと,80,29,男性,未履修
りく,55,30,男性,履修済
あおと,67,31,男性,未履修
ゆうと,73,32,男性,履修済
あおい,76,33,男性,履修済
いつき,59,34,男性,未履修
ひなた,52,35,男性,未履修
そうま,54,36,男性,未履修
こうき,49,37,男性,未履修
そうすけ,47,38,男性,未履修
はる,67,39,男性,未履修
かいと,72,40,男性,履修済
そら,78,41,男性,履修済
あさひ,60,42,男性,未履修
かなた,68,43,男性,履修済
はやと,76,44,男性,履修済
ゆうせい,65,45,男性,履修済
れん,68,46,男性,履修済
あやと,68,47,男性,履修済
えいと,60,48,男性,未履修
りくと,66,49,男性,履修済
ゆうま,68,50,男性,履修済
`

let popPersons = [];
let sample = []; // これはインデックスの列になる。
let resultVec = []; // Resultのリスト
let ncol = 5; // 表にするときの列数。

function preparePopData()
{

    // 修正用
    let popPeopleCsvMod = popPeopleCsv;

    // 改行コード3種類に対応
    popPeopleCsvMod = popPeopleCsvMod.replace( "\r", "\n")
    popPeopleCsvMod = popPeopleCsvMod.replace( "\n\n", "\n")

    let rawlines = popPeopleCsvMod.split( "\n")
    for ( let l in rawlines){
        l.replace( "\r", "")
    }

    let lines = [];
    for ( let i = 0; i < rawlines.length; ++i){
        let l = rawlines[ i];
        if ( l.length >= 1){
            lines.push( rawlines[ i]);
        }
    }

    let rowTokens = []; // 行メジャーでトークンを入れる。
    for ( let i = 0; i < lines.length; ++i){
        let tokens = lines[ i].split( ",");
        rowTokens.push( tokens);
    }
    // 各行のトークンの数が一致しているか確認していない。

    let varNames = rowTokens[ 0]; // 変数名のリスト

    let colTokens = []; // 列メジャーでトークンを入れる。変数名は入れない。
    for ( let i = 0; i < varNames.length; ++i){
        let strs = []
        for ( let j = 1; j < rowTokens.length; ++j){
            strs.push( rowTokens[ j][ i]);
        }
        colTokens.push( strs);
    }

    let indexOfName = -1;
    let indexOfScore = -1;
    let indexOfId = -1;
    let indexOfGender = -1;
    let indexOfQa = -1;
    for ( let i = 0; i < varNames.length; ++i){
        if ( varNames[ i] == "name"){
            indexOfName = i;
        } else if ( varNames[ i] == "score"){
            indexOfScore = i;
        } else if ( varNames[ i] == "id"){
            indexOfId = i;
        } else if ( varNames[ i] == "gender_str"){
            indexOfGender = i;
        } else if ( varNames[ i] == "qaclass_str"){
            indexOfQa = i;
        }
    }

    popPersons = [];
    
    for ( let i = 0; i < colTokens[ 0].length; ++i){

        let name_str = colTokens[ indexOfName][ i];
        let score = colTokens[ indexOfScore][ i];
        let id = colTokens[ indexOfId][ i];
        let gender = colTokens[ indexOfGender][ i];
        let qa = colTokens[ indexOfQa][ i];
    
        let p = new Person();
        p.setStrFields( name_str, score, id, gender, qa);
        popPersons.push( p);
    
    }
    
}

// 母集団のtableの中身をつくる。
function getPopTable()
{

    let colCount = 1;
    var ret = "";

    for ( let i = 0; i < popPersons.length; ++i){

        if ( colCount == 1){
            ret += "<tr>";
        }

        ret +=
            "<td>" +
            '<div class = "pop-table-name">' + popPersons[ i].name + "</div>" + 
            '<div class = "pop-table-score">' + popPersons[ i].score_str + "点</div>" +
            "</td>"
        ;
        
        if ( colCount == ncol){
            ret += "</tr>";
            colCount = 1;
        } else {
            ++colCount;
        }

    }

    return ret;

}

// 母集団の点数の平均値を返す。
function getPopScoreMean()
{
    let sum = 0;
    for ( const p of popPersons){
        sum += p.score;
    }
    return ( sum / popPersons.length);

}

// [lower, upper]の範囲の離散型一様分布の乱数を得る。
// lowerとupperは整数だと仮定。
function getDiscreteUniformRandom( lower, upper)
{

    // This gives floar ranging [0, 1) 
    let ran = Math.random();

    let ret = Math.floor( ran * ( upper - lower + 1) + lower);
    return ret;
    
}

// {lower, ..., upper}の整数の数列からWORでサンプルを抜き出して返す。
// 順番もランダム。
function getSampleIntSeqWOR( lower, upper, samplelen)
{

    let ret = [];
    while ( ret.length < samplelen){
        let ran;
        do {
            ran = getDiscreteUniformRandom( lower, upper);
        } while ( ret.length > 0 && ret.includes( ran) == true);
        ret.push( ran);
    }

    return ret;

}

// 標本のtableの中身をつくる。
function getSampleTable( ssize)
{

    // sampleには0始まりのインデックスがランダムに入っている。
    sample = getSampleIntSeqWOR( 0, popPersons.length - 1, ssize);

    let colCount = 1;
    var ret = "";

    for ( let i = 0; i < sample.length; ++i){

        if ( colCount == 1){
            ret += "<tr>";
        }

        let idx = sample[ i];
        ret +=
            "<td>" +
            '<div class = "pop-table-name">' + popPersons[ idx].name + "</div>" + 
            '<div class = "pop-table-score">' + popPersons[ idx].score_str + "点</div>" +
            "</td>"
        ;
        
        if ( colCount == ncol){
            ret += "</tr>";
            colCount = 1;
        } else {
            ++colCount;
        }

    }

    return ret;

}

// サンプルの点数の平均値を返す。
// 同時に、resultVecに結果を追加する。
function getSampleScoreMean()
{

    let sum = 0;
    for ( const idx of sample){
        sum += popPersons[ idx].score;
    }
    
    let ssize = sample.length;
    let smean = sum / ssize;

    resultVec.push( new Result( ssize, smean));

    return smean;

}

