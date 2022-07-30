'use strict'

/*

party.js

kutil.jsが読まれている必要がある。
svggraph.jsが読まれている必要がある。

*/

class PartyType {

    constructor( x0, y0, r0, g0, b0)
    {
        this.xpos = x0;
        this.ypos = y0;
        this.color_r = r0;
        this.color_g = g0;
        this.color_b = b0;

        this.vote = NaN;
        this.prevvote = NaN;

        this.prevdirection = NaN; 
    }

    getRGBStr()
    {
        let ret = "rgb(" + String( this.color_r) + "," + String( this.color_g) + "," + String( this.color_b);
        return ret;
    }

    getRGBVec()
    {
        let ret = []
        ret.push( this.color_r);
        ret.push( this.color_g);
        ret.push( this.color_b);
        return ret;
    }

};

class PartyGroupType {

    constructor()
    {
        this.parties = []
    }

    createParties( nparty0)
    {
        this.parties = []
        for ( let i = 0; i < nparty0; ++i){
            
            let x = getDiscreteUniformRandom( -2, 2);
            let y = 0;
            
            let r0 = 0;
            let g0 = 0;
            let b0 = 0;

            // 3党目以降は全部赤。。
            if ( i == 0){
                g0 = 255;
            } else if ( i == 1){
                b0 = 255;
            } else {
                r0 = 255;
            }

            let pobj = new PartyType( x, y, r0, g0, b0);
            this.parties.push( pobj);

        }
    }

    plot()
    {
        let n = this.parties.length;
        for ( let i = 0; i < n; ++i){
            let x = this.parties[ i].xpos;
            let y = this.parties[ i].ypos;
            let colorstr = this.parties[ i].getRGBStr();
            svggraphobj.drawSinglePoint( x, y, 3, colorstr);
        }
    }

};

let partygroup = new PartyGroupType();
