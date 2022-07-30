'use strict'

/*

kutil.js

*/

// [lower, upper)の連続型の一様乱数を返す。
function getContinuousUniformRandom( lower, upper)
{

    // This gives float ranging [0, 1) 
    let ran = Math.random();

    let ret = ran * ( upper - lower) + lower;
    return ret;

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

// Normal Random 
// using Box–Muller transform
function getNormalRandom( mu = 0, sd = 1){
    let stdran = Math.sqrt( -2 * Math.log( 1 - Math.random())) * Math.cos( 2 * Math.PI * Math.random());
    return stdran * sd + mu;
}

// Truncated Normal Random
// ranging [left, right]
function getTrNormalRandom( left, right, mu = 0, sd = 1)
{
    let ran;
    do {
        ran = getNormalRandom( mu, sd);
    } while( ran < left || right < ran);
    return ran;
}

// 配列を得て、その中の最大値のインデックスのリストを返す。
function getIndexOfMax( vec0)
{

    let ret = [];
    let n = vec0.length;

    if ( n < 1){
        return ret;
    }

    if ( n == 1){
        ret.push( 0);
        return ret;
    }

    let max = vec0[ 0];
    ret.push( 0);
    for ( let i = 1; i < n; ++i){
        if ( vec0[ i] > max){
            ret = [];
            ret.push( i);
            max = vec0[ i];
        } else if ( vec0[ i] == max){
            ret.push( i);
        }
    }
    return ret;

}

// 配列を得て、その中の最大値のインデックスを返す。
// 複数の要素で最大値をとっている場合にはその1つをランダムに選んで返す。
function getIndexOfMaxRandomize( vec0)
{

    let idxvec = getIndexOfMax( vec0);
    let n = idxvec.length;

    if ( n == 1){
        return idxvec[ 0];
    }

    let ran = getDiscreteUniformRandom( 0, n - 1);

    return idxvec[ ran];

}

