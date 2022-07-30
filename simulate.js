'use strict'

/*

simulate.js

kutil.jsが読まれている必要がある。
svggraph.jsが読まれている必要がある。

*/


// x方向で近い政党に投票。距離が同じならランダム。
function election()
{

    let nv = votergroup.voters.length;
    let np = partygroup.parties.length;

    for ( let j = 0; j < np; ++j){
        partygroup.parties[ j].prevvote = partygroup.parties[ j].vote;
        partygroup.parties[ j].vote = 0;
    }

    for ( let i = 0; i < nv; ++i){
        let vx = votergroup.voters[ i].xpos;
        let vy = votergroup.voters[ i].ypos;
        let utilvec = [];
        for ( let j = 0; j < np; ++j){
            let px = partygroup.parties[ j].xpos;
            let py = partygroup.parties[ j].ypos;
            let util = -1 * Math.abs( vx - px);
            utilvec.push( util);
        }
        let idx = getIndexOfMaxRandomize( utilvec);
        partygroup.parties[ idx].vote++;
        let rgb = partygroup.parties[ idx].getRGBVec();
        votergroup.voters[ i].setPartyRGBVec( rgb);
    }

}


// 前回動いていて、前回より得票が増えていれば、前回動いた方向と同じ方向に移動。
// そうでなければランダム。
function partymove()
{

    let step = 0.1;

    let np = partygroup.parties.length;

    let prevdirection_nan = Number.isNaN( partygroup.parties[ 0].prevdirection);
    let prevvote_nan = Number.isNaN( partygroup.parties[ 0].prevvote);

    if ( prevdirection_nan == true || prevvote_nan == true){
        
        for ( let j = 0; j < np; ++j){
            let currentxpos = partygroup.parties[ j].xpos;
            let dire = getDiscreteUniformRandom( -1, 1);
            let newxpos = partygroup.parties[ j].xpos + dire * step;
            if ( newxpos < -3 || 3 < newxpos){
                newxpos = currentxpos;
                dire = 0;
            }
            partygroup.parties[ j].xpos = newxpos;
            partygroup.parties[ j].prevdirection = dire;
        }

    } else {

        for ( let j = 0; j < np; ++j){

            let prevvote = partygroup.parties[ j].prevvote;
            let vote = partygroup.parties[ j].vote;
            let prevdirection = partygroup.parties[ j].prevdirection;
            let currentxpos = partygroup.parties[ j].xpos;
            let dire;

            if ( vote > prevvote && prevdirection != 0){
                dire = prevdirection;
            } else {
                dire = getDiscreteUniformRandom( -1, 1);
            }
            
            let newxpos = currentxpos + dire * step;
            if ( newxpos < -3 || 3 < newxpos){
                newxpos = currentxpos;
                dire = 0;
            }

            partygroup.parties[ j].xpos = newxpos;
            partygroup.parties[ j].prevdirection = dire;

        }

    }

}
