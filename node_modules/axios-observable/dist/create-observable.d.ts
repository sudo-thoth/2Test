import { AxiosPromise } from 'axios';
import { AxiosObservable } from './axios-observable.interface';
export declare function createObservable<T>(promiseFactory: (...args: any[]) => AxiosPromise<T>, ...args: any[]): AxiosObservable<T>;
