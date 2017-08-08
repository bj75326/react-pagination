/**
 * Created by jibin on 17/7/31.
 */

import Transaction from 'react-dom/lib/Transaction';

const transaction = Object.assign({}, Transaction, {
    getTransactionWrappers(){
        return [{
            initialize(){
                console.log('initialize');
            },
            close(){
                console.log('close');
            }
        }];
    }
});

transaction.reinitializeTransaction();


const fn = ()=>{
    console.log('fn');
};

const fn1 = ()=>{
    transaction.perform(fn);
};

export default fn1;