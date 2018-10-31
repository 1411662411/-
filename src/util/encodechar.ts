const r20 = /%20/g;

const type = (obj) => {
    const types = Object.prototype.toString.call(obj).split(' ');
    return types.length >= 2 ? types[1].slice( 0, types[1].length - 1 ) : '';
};


const buildParams = ( prefix, obj, add ) => {
    var name;

    if ( Array.isArray( obj ) ) {
        // Serialize array item.
        obj.forEach( ( i, v ) => {
            // Item is non-scalar (array or object), encode its numeric index.
            buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, add );
        });

    } else if ( type( obj ) === "Object" ) {
        // Serialize object item.
        for ( name in obj ) {
            buildParams( prefix + "[" + name + "]", obj[ name ], add );
        }
    } else {
        // Serialize scalar item.
        add( prefix, obj );
    }
}

// key/values into a query string
export const enCodeChar = ( data ) => {
    let prefix;
    let s:Array<string> = [];
    let add = ( key, value ) => {
        // If value is a function, invoke it and return its value
        value = type( value ) === 'function' ? value() : value;
        if(value === null || value === undefined) return;
        s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    };
    for ( prefix in data ) {
        buildParams( prefix, data[ prefix ], add );
    }
    // Return the resulting serialization
    return s.join( "&" ).replace( r20, "+" );
};

// 两个浮点数求和
export const accAdd = ( num1, num2 ) => {
    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m;
}

// 两个浮点数相减
export const accSub = ( num1, num2 ) => {
        
    var r1, r2, m, n;
    if (isNaN(num1)) {
        num1 = 0;
    }
    if (isNaN(num2)) {
        num2 = 0;
    }
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
}
// 两数相除
export const accDiv = ( num1, num2 ) => {
    var t1, t2, r1, r2;
    try {
        t1 = num1.toString().split('.')[1].length;
    } catch (e) {
        t1 = 0;
    }
    try {
        t2 = num2.toString().split(".")[1].length;
    } catch (e) {
        t2 = 0;
    }
    r1 = Number(num1.toString().replace(".", ""));
    r2 = Number(num2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}
//两个相乘
export const accMul = ( num1, num2 ) => {
    var m = 0,
        s1 = num1.toString(),
        s2 = num2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) { }
    try {
        m += s2.split(".")[1].length;
    } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}