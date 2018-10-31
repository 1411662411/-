declare module '*.json' {
    const value: any;
    export default value;
}
declare module '*.png' {
    const value: any;
    export default value;
}
declare module '*.gif' {
    const value:any;
    export default value;
}

declare const __DEV__;
declare const __BGALPHA__;
declare const __BRANCHALPHA__;
declare const __ALPHA__;
declare const __BETA__;
declare const __PRODUCT__;


declare type ValueOf<T, U extends keyof T> = T[U];





