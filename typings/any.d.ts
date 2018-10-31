

export as namespace Any;

import * as Redux from "redux";
import { Map } from 'immutable';
import {  ReducerInteface } from '../src/reducers/index';
/**
 * Redux Dispatch
 */
export type Dispatch<T>  = Redux.Dispatch<T>;


/**
 * 用户登陆信息
 */
export type UserInfo = {
  employeeNumber: string;
  name: string; 
  userId: string ;
  userName: string;
};

export type Store = Map<keyof ReducerInteface, any>


