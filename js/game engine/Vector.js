const calvec=function(v1, symbol, other){
    let v2=Number.isFinite(other) ? [other, other] : other;
    let calArray=(v1,v2, f)=>{return [f(v1,v2, 0), f(v1,v2, 1)];}
    switch(symbol){
        case '=': calArray(v1, v2, (v1, v2, i) => { v1[i] = v2[i] }); return v1;
        case '+=': calArray(v1, v2, (v1, v2, i) => { v1[i] += v2[i] }); return v1;
        case '-=': calArray(v1, v2, (v1, v2, i) => { v1[i] -= v2[i] }); return v1;
        case '*=': calArray(v1, v2, (v1, v2, i) => { v1[i] *= v2[i] }); return v1;
        case '/=': calArray(v1, v2, (v1, v2, i) => { v1[i] /= v2[i] }); return v1;
        case '+': return calArray(v1, v2, (v1, v2, i) => { return v1[i] + v2[i] });
        case '-': return calArray(v1, v2, (v1, v2, i) => { return v1[i] - v2[i] });
        case '*': return calArray(v1, v2, (v1, v2, i) => { return v1[i] * v2[i] });
        case '/': return calArray(v1, v2, (v1, v2, i) => { return v1[i] / v2[i] });
    }
}

const orvec = function(){
    let v2=Number.isFinite(other) ? [other, other] : other;
    let calArray=(v1,v2, f)=>{return f(v1,v2, 0)||f(v1,v2, 1);}
    switch(symbol){
        case '<': return calArray(v1, v2, (v1, v2, i) => { return v1[i]<v2[i] });
        case '>': return calArray(v1, v2, (v1, v2, i) => { return v1[i]>v2[i] });
        case '<=': return calArray(v1, v2, (v1, v2, i) => { return v1[i]<=v2[i] });
        case '>=': return calArray(v1, v2, (v1, v2, i) => { return v1[i]>=v2[i] });
        case '==': return calArray(v1, v2, (v1, v2, i) => { return v1[i]==v2[i] });
    }
}

const andvec = function(){
    let v2=Number.isFinite(other) ? [other, other] : other;
    let calArray=(v1,v2, f)=>{return f(v1,v2, 0)&&f(v1,v2, 1);}
    switch(symbol){
        case '<': return calArray(v1, v2, (v1, v2, i) => { return v1[i]<v2[i] });
        case '>': return calArray(v1, v2, (v1, v2, i) => { return v1[i]>v2[i] });
        case '<=': return calArray(v1, v2, (v1, v2, i) => { return v1[i]<=v2[i] });
        case '>=': return calArray(v1, v2, (v1, v2, i) => { return v1[i]>=v2[i] });
        case '==': return calArray(v1, v2, (v1, v2, i) => { return v1[i]==v2[i] });
    }
}

const limvec = function(v1, symbol, other){
    let v2=Number.isFinite(other) ? [other, other] : other;
    let calArray=(v1,v2, f)=>{return [f(v1,v2, 0), f(v1,v2, 1)];}
    switch(symbol){
        case '<': calArray(v1, v2, (v1, v2, i) => { if(v1[i] > v2[i])v1[i] = v2[i] }); return v1;
        case '>': calArray(v1, v2, (v1, v2, i) => { if(v1[i] < v2[i])v1[i] = v2[i] }); return v1;
    }
}

const vec={
    tovec(num){return [num,num]},
    new(v){return [v[0], v[1]]},
    set(v1,v2){v1[0]=v2[0];v1[1]=v2[1];return v1;},
    add(v1,v2){v1[0]+=v2[0];v1[1]+=v2[1];return v1;},
    sub(v1,v2){v1[0]-=v2[0];v1[1]-=v2[1];return v1;},
    div(v1,v2){v1[0]/=v2[0];v1[1]/=v2[1];return v1;},
    mul(v1,v2){v1[0]*=v2[0];v1[1]*=v2[1];return v1;},
    max(v1,v2){v1[0]=(v1[0]<v2[0]?v1[0]:v2[0]);v1[1]=(v1[1]<v2[1]?v1[1]:v2[1]);return v1;},
    min(v1,v2){v1[0]=(v1[0]>v2[0]?v1[0]:v2[0]);v1[1]=(v1[1]>v2[1]?v1[1]:v2[1]);return v1;},
    inv(v1){return [-v1[0], -v1[1]]},
    rev(v1){return [v1[1],v1[0]]},
    abs(v1){return [Math.abs(v1[0]), Math.abs(v1[1])]},
}