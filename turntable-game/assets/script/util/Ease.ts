import { Config } from "../config/config";

/**
 * Created by Joker on 2020/2/23.
 */

let cos = Math.cos,
    acos = Math.acos,
    max = Math.max,
    //atan2 = Math.atan2,
    pi = Math.PI,
    tau = 2 * pi,
    sqrt = Math.sqrt;

function crt (v) {
    if (v < 0) {
        return -Math.pow(-v, 1 / 3);
    }
    else {
        return Math.pow(v, 1 / 3);
    }
}

function cardano (curve, x) {
    // align curve with the intersecting line:
    //var line = {p1: {x: x, y: 0}, p2: {x: x, y: 1}};
    //var aligned = align(curve, line);
    //// and rewrite from [a(1-t)^3 + 3bt(1-t)^2 + 3c(1-t)t^2 + dt^3] form
    //    pa = aligned[0].y,
    //    pb = aligned[1].y,
    //    pc = aligned[2].y,
    //    pd = aligned[3].y;
    ////// curve = [{x:0, y:1}, {x: curve[0], y: 1-curve[1]}, {x: curve[2], y: 1-curve[3]}, {x:1, y:0}];
    var pa = x - 0;
    var pb = x - curve[0];
    var pc = x - curve[2];
    var pd = x - 1;

    // to [t^3 + at^2 + bt + c] form:
    var pa3 = pa * 3;
    var pb3 = pb * 3;
    var pc3 = pc * 3;
    var d = (-pa + pb3 - pc3 + pd),
        rd = 1 / d,
        r3 = 1 / 3,
        a = (pa3 - 6 * pb + pc3) * rd,
        a3 = a * r3,
        b = (-pa3 + pb3) * rd,
        c = pa * rd,
        // then, determine p and q:
        p = (3 * b - a * a) * r3,
        p3 = p * r3,
        q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
        q2 = q / 2,
        // and determine the discriminant:
        discriminant = q2 * q2 + p3 * p3 * p3,
        // and some reserved variables
        u1, v1, x1, x2, x3;

    // If the discriminant is negative, use polar coordinates
    // to get around square roots of negative numbers
    if (discriminant < 0) {
        var mp3 = -p * r3,
            mp33 = mp3 * mp3 * mp3,
            r = sqrt(mp33),
            // compute cosphi corrected for IEEE float rounding:
            t = -q / (2 * r),
            cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
            phi = acos(cosphi),
            crtr = crt(r),
            t1 = 2 * crtr;
        x1 = t1 * cos(phi * r3) - a3;
        x2 = t1 * cos((phi + tau) * r3) - a3;
        x3 = t1 * cos((phi + 2 * tau) * r3) - a3;

        // choose best percentage
        if (0 <= x1 && x1 <= 1) {
            if (0 <= x2 && x2 <= 1) {
                if (0 <= x3 && x3 <= 1) {
                    return max(x1, x2, x3);
                }
                else {
                    return max(x1, x2);
                }
            }
            else if (0 <= x3 && x3 <= 1) {
                return max(x1, x3);
            }
            else {
                return x1;
            }
        }
        else {
            if (0 <= x2 && x2 <= 1) {
                if (0 <= x3 && x3 <= 1) {
                    return max(x2, x3);
                }
                else {
                    return x2;
                }
            }
            else {
                return x3;
            }
        }
    }
    else if (discriminant === 0) {
        u1 = q2 < 0 ? crt(-q2) : -crt(q2);
        x1 = 2 * u1 - a3;
        x2 = -u1 - a3;

        // choose best percentage

        if (0 <= x1 && x1 <= 1) {
            if (0 <= x2 && x2 <= 1) {
                return max(x1, x2);
            }
            else {
                return x1;
            }
        }
        else {
            return x2;
        }
    }
    // one real root, and two imaginary roots
    else {
        var sd = sqrt(discriminant);
        u1 = crt(-q2 + sd);
        v1 = crt(q2 + sd);
        x1 = u1 - v1 - a3;
        return x1;
    }
}

export function bezierByTime (controlPoints:number[]) {
    cc.log("bezier");
    var p1y = controlPoints[1]; // b
    var p2y = controlPoints[3]; // c
    return function (t:number) :number{
        var percent = cardano(controlPoints, t);    // t
        let current= ((1 - percent) * (p1y + (p2y - p1y) * percent) * 3 + percent * percent) * percent;
        return current;
    }
    // return bezier(0, p1y, p2y, 1, percent);

}
export function bezier4(controlPoints:number[]){
     var x0 = controlPoints[0];
     var y0 = controlPoints[1];
     var x1 = controlPoints[2];
     var y1 = controlPoints[4];
     var x2 = controlPoints[5];
     var y2 = controlPoints[6];
     var x3 = controlPoints[7];
     var y3 = controlPoints[8];
     return function(t:number):number{
         let ans;
         let tt = 1-t
        //  if(t==0)
        //  return 0;
        //  if(t==1)return 1;
         ans = (tt*(tt*(tt*(tt*y0+t*y1)+t*((tt)*y1+t*y2)))+t*(tt*(tt*y1+t*y2)+t*(tt*y2+t*y3)));
         return ans;
     } 
}

// export class EASE{
//     private flag
//     constructor(value){
//         console.log(value);
//          this.flag = value;
//     }

//      easeout (k) {
//          if(k<= this.flag){
//              return k;
//          }
//          if(k >= 0.3* this.flag){
//              return 1;
//          }
//          console.log(this.flag);
//          if (k === 0) {
//              return 0;
//          }
//          if (k  === 1) {
//              return 1;
//          }
//          return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
//       }
// }
export function easeout(k){
    
    if (k === 0) {
        return 0;
    }
    if (k  === 1) {
        return 1;
    }
    k*=0.3;
    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
}

export function esae2(k){
    if(k <= 3/4 ){
        return Math.sqrt(1 - (--k*3/4 * k*3/4));
    }
   else {
   }
}
let epx = 1e-8;
let flag = 0;
export function ease3(k){
    // if (k === 0) {
    //     return 0;
    // }
    // if (k === 1) {
    //     return 1;
    // }
    // k *= 2;
    // if (k < 1) {
    //     // let a = -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI)
    //     // if(1-a<=epx){
    //     //    console.log(k/2);
    //     // }
    //     return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
       
    // }
    // let a = 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1
    // if(a>=0.8&&!flag){
    //     flag =1
    //    console.log(k/2,"11111");
    // }
    // if(a<=0.8&&flag){
    //     flag =0;
    //     console.log(k/2,"000000");
    // }
    // return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
    var s = 1.70158 * 1.525;
    let p = k
        k*=2;
    let b =0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2)

    console.log(b,p);
    
    // if ((k *= 2) < 1) {
    //     return 0.5 * (k * k * ((s + 1) * k - s));
    // }
    // return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
}
export function ease2(k){
    
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    k*=0.87;
    return  --k * k * k + 1;
    // if(k>0.9676140000000005){
    //     return 1;
    // }
        // //k-=0.35;
        // k*=0.35,
        // k+=0.3
        // k*=2
        // return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
       
        // k*=0.7703718
        
        var s = 1.70158 * 1.525;
        k*=2,
        k-=2,
        k/=1.1
		return 0.5 * ((k) * k * ((s + 1) * k + s) + 2 - 0.0213);
}
export function ease4(k){
    
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    k *=0.3665;
    
   k +=0.6339539999999999;
   if(k>=1){
       return 1;
   }
   var s = 1.70158 * 1.525;
   k*=2;
   return Math.max(1,0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2) * 0.95)
}