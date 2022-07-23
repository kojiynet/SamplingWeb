'use strict'

/*

datahandle.js

Before reading this file, read "popdata.js"

Defined in this file...

Classes:
    Person
    Result

Global Variables:
    popPersons
    sample
    resultVec
    ncol

Functions:
    readPopData()
    getPopTable()
    getPopScoreMean()
    getDiscreteUniformRandom( lower, upper)
    getSampleIntSeqWOR( lower, upper, samplelen)
    getSampleTable( ssize)
    getSampleScoreMean()

*/


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

    // 文字列フィールドに代入すると同時に、数値フィールドにもパースして格納する。
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

// 抽出時の結果
class Result {

    constructor( ssize0, smean0)
    {
        this.ssize = ssize0; // sample size
        this.smean = smean0; // sample mean
    }

};

// 母集団のリスト
let popPersons = [];

// 標本。これはpopPersonsのインデックスの列になる。
let sample = []; 

// Resultのリスト
let resultVec = []; 

// 表にするときの列数。
let ncol = 5; 

// 母集団データをPerson型のリストpopPersonsに格納する。
function readPopData()
{

    // 修正用変数に代入
    let popPeopleCsvMod = popPeopleCsv;

    // 改行コード3種類に対応
    popPeopleCsvMod = popPeopleCsvMod.replace( "\r", "\n")
    popPeopleCsvMod = popPeopleCsvMod.replace( "\n\n", "\n")

    let rawlines = popPeopleCsvMod.split( "\n")

    // 空行以外をlinesに格納
    let lines = [];
    for ( let i = 0; i < rawlines.length; ++i){
        let l = rawlines[ i];
        if ( l.length >= 1){
            lines.push( rawlines[ i]);
        }
    }

    // 行メジャーでトークンを入れる。
    let rowTokens = []; 
    for ( let i = 0; i < lines.length; ++i){
        let tokens = lines[ i].split( ",");
        rowTokens.push( tokens);
    }
    // 各行のトークンの数が一致しているかは確認していない。

    // 変数名のリスト（＝1行目のトークンたち）
    let varNames = rowTokens[ 0];

    // 列メジャーでトークンを入れる。変数名は入れない。
    let colTokens = []; 
    for ( let i = 0; i < varNames.length; ++i){
        let strs = []
        for ( let j = 1; j < rowTokens.length; ++j){
            strs.push( rowTokens[ j][ i]);
        }
        colTokens.push( strs);
    }

    // varNames[ idx]がそれぞれ何に対応しているかを識別する。
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
    let ret = "";

    for ( let i = 0; i < popPersons.length; ++i){

        if ( colCount == 1){
            ret += "<tr>";
        }

        ret +=
            "<td>" +
            '<div class = "table-name">' + popPersons[ i].name + "</div>" + 
            '<div class = "table-score">' + popPersons[ i].score_str + "点</div>" +
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

// [lower, upper]の範囲の離散型（整数）一様分布の乱数を得る。
// lowerとupperは整数だと仮定。
function getDiscreteUniformRandom( lower, upper)
{

    // This gives float ranging [0, 1) 
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
            '<div class = "table-name">' + popPersons[ idx].name + "</div>" + 
            '<div class = "table-score">' + popPersons[ idx].score_str + "点</div>" +
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

