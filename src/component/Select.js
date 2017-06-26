//Select.js

import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Option from './Option.js';
import Value from './Value.js';

class Select extends Component{

    constructor(props){
        super(props);

        this.state = {
            inputValue : '',
            showDropdown : false,
            isFocused: false
        };
    }

    static defaultProps = {
        prefixCls: 'bin-select',
        className: '',
        ident: '',
        selectedValue: '',
        multi: false,
        required: false,
        placeholder: '请选择',
        delimiter: ',',
        valueKey: 'value'
    };

    static PropTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        ident: PropTypes.string.isRequired,
        selectedValue: PropTypes.any,
        options: PropTypes.array,
        disabled: PropTypes.bool,
        multi: PropTypes.bool,                      //是否多选
        required: PropTypes.bool,                   //Form控件是否要求必需
        placeholder: PropTypes.string,
        delimiter: PropTypes.string,
        valueKey: PropTypes.string,                 //获取option的key值

        filterOption: PropTypes.func,               //
        filterOptions: PropTypes.any
    };

    componentWillMount(){

    }

    //根据value获取相应option对象的数组
    getValueArray(value, nextProps){
        const props = typeof nextProps === 'object' ? nextProps : this.props;
        if(props.multi){
            if(typeof value === 'string') value = value.split(props.delimiter);
            if(!Array.isArray(value)){
                if(value === null || value === undefined) return [];
                value = [value];
            }
            return value.map(value=>this.expandValue(value, props)).filter(i=>i);
        }
        let expandedValue = this.expandValue(value, props);
        return expandedValue ? [expandedValue] : [];
    }

    //根据value获取相应option对象
    expandValue(value, props){
        if(typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean'){
            return value;
        }
        let {options, valueKey} = props;
        if(!options){
            return;
        }
        for(let option of options) {
            if (option[valueKey] === value) {
                return option;
            }
        }
    }

    render(){
        let valueArray = this.getValueArray(this.props.selectedValue);

        return (

        );
    }
}

export default Select;
