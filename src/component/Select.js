//Select.js

import React, {Component} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Option from './Option.js';
import Value from './Value.js';

import styles from './style.css';

import defaultFilterOptions from '../utils/defaultFilterOptions.js'

import TransitionEventsHandler from '../utils/TransitionEventsHandler.js'

class Select extends Component{

    constructor(props){
        super(props);

        this.state = {
            inputValue : '',
            showDropdown : false,
            isFocused: false
            //focusedOption
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
        valueKey: 'value',

        filterOptions: defaultFilterOptions,
        ignoreAccents: true,
        ignoreCase: true,
        labelKey: 'label',
        matchPos: 'any',
        matchProp: 'any',

        searchable: false
    };

    static PropTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        ident: PropTypes.string.isRequired,         //select组件实例key
        selectedValue: PropTypes.any,               //已选option value
        options: PropTypes.array,                   //select所有选项 option object's array
        disabled: PropTypes.bool,
        multi: PropTypes.bool,                      //是否多选
        required: PropTypes.bool,                   //Form控件是否要求必需
        placeholder: PropTypes.string,              //placeholder
        delimiter: PropTypes.string,                //selectedValue多选分隔符
        valueKey: PropTypes.string,                 //option对象value属性名

        filterOptions: PropTypes.any,               //自定义筛选函数模块，设置为假值(false, 0, '')可跳过筛选
        filterOption: PropTypes.func,               //自定义条件筛选函数
        ignoreAccents: PropTypes.bool,              //筛选options时是否忽略特殊字符
        ignoreCase: PropTypes.bool,                 //筛选options时是否忽略大小写
        labelKey: PropTypes.string,                 //option对象label属性名
        matchPos: PropTypes.string,                 //(any|start)筛选字符串任意位置或者从头开始匹配
        matchProp: PropTypes.string,                //(any|label|value)筛选基于option对象的哪个值

        searchable: PropTypes.bool,                 //是否开启输入框和filterOption功能

        wrapperStyle: PropTypes.object              //补充样式

    };

    componentWillMount(){

    }

    handleControlClick(){
        this.setState({showDropdown: true})
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

    //根据输入值筛选options
    filterOptions(excludeOptions){
        let filterValue = this.state.inputValue;
        let options = this.props.options || [];
        if(this.props.filterOptions){
            const filterOptions = typeof this.props.filterOptions === 'function'
                                    ? this.props.filterOptions
                                    : defaultFilterOptions ;
            return filterOptions(options, filterValue, excludeOptions, {
                filterOption: this.props.filterOption,
                ignoreAccents: this.props.ignoreAccents,
                ignoreCase: this.props.ignoreCase,
                labelKey: this.props.labelKey,
                valueKey: this.props.valueKey,
                matchPos: this.props.matchPos,
                matchProp: this.props.matchProp
            });
        }else{
            return options;
        }
    }

    //获取当前focus的option的index。
    getFocusableOptionIndex(selectedOption){
        let options = this._visibleOptions;
        if(options.length){
            return null;
        }
        const valueKey = this.props.valueKey;
        let focusedOption = this.state.focusedOption || selectedOption;

        if(focusedOption && !focusedOption.disabled){
            let focusedOptionIndex = -1;
            options.some((option, index)=>{
                const isOptionEqual = option[valueKey] === focusedOption[valueKey];
                if(isOptionEqual){
                    focusedOptionIndex = index;
                }
                return isOptionEqual;
            });
            if(focusedOptionIndex !== -1){
                return focusedOptionIndex;
            }
        }

        //如果当前state或者selectedOption都不能提供focusedIndex，返回第一个没有disabled的option index。
        for(let i=0; i< options.length; i++){
            if(!options[i].disabled){
                return i;
            }
        }

        return null;
    }

    //渲染一个hidden的input，用作表单提交
    renderHiddenField(valueArray){

    }

    render(){
        //根据selectedValue获取已选择option对象数组。
        let valueArray = this.getValueArray(this.props.selectedValue);

        let options;

        const searchable = this.props.searchable;
        //searchable === false, 不进行filterOptions，所有options显示
        //searchable === true, 进行filterOptions
        if(searchable === false){
            options = this._visibleOptions = this.props.options;
        }else{
            //
        }

        const focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);
        let focusedOption = null;
        if(focusedOptionIndex !== null){
            focusedOption = this._focusedOption = options[focusedOptionIndex];
        }else{
            focusedOption = this._focusedOption = null;
        }


        const showDropdown = this.state.showDropdown;

        const {className, prefixCls, multi} = this.props;

        const selectClassName = classnames({
            [styles[prefixCls]]: true,
            [styles[className]]: !!className,
            [styles[`${prefixCls}-single`]]: !multi,
            [styles[`${prefixCls}-multiple`]]: multi,
            [styles[`${prefixCls}-visible`]]: showDropdown
        });

        return (
            <div className={selectClassName} style={this.props.wrapperStyle}>
                {this.renderHiddenField(valueArray)}
                <div className={styles[`${prefixCls}-control`]} onClick={this.handleControlClick.bind(this)} >
                    <span className={styles[`${prefixCls}-value-wrapper`]}>
                        <div className={styles[`${prefixCls}-placeholder`]}>请选择</div>
                        <div className={styles[`${prefixCls}-input`]} style={{display: 'none'}}>
                            <input role="combobox" aria-expanded="false" aria-owns aria-haspopup aria-activedescendant value/>
                        </div>
                    </span>
                    <span className={styles[`${prefixCls}-clean-zone`]}>
                        <span className={styles[`${prefixCls}-clean`]}><FontAwesome name="times-circle"/></span>
                    </span>
                    <span className={styles[`${prefixCls}-arrow-zone`]}>
                        <span className={styles[`${prefixCls}-arrow`]}><FontAwesome name="caret-down"/></span>
                    </span>
                </div>
                <div className={styles[`${prefixCls}-dropdown`]} style={{width:'200px',
                                                                 position: 'absolute',
                                                                 top: '32px',
                                                                 left: '0px',
                                                                 transformOrigin: 'center top 0px'
                                                                }}>
                    <ul className={styles[`${prefixCls}-not-found`]} style={{ display: 'none'}}>
                        <li>无匹配数据</li>
                    </ul>
                    <ul className={styles[`${prefixCls}-dropdown-list`]} >
                        <li className={styles[`${prefixCls}-item`]}>北京市</li>
                        <li className={styles[`${prefixCls}-item`] +' '+styles[`${prefixCls}-item-selected`]}>上海市</li>
                        <li className={styles[`${prefixCls}-item`]}>深圳市</li>
                        <li className={styles[`${prefixCls}-item`]}>杭州市</li>
                        <li className={styles[`${prefixCls}-item`]}>南京市</li>
                        <li className={styles[`${prefixCls}-item`]}>重庆市</li>
                    </ul>
                    <ul className={styles[`${prefixCls}-loading`]} style={{display: 'none'}}>加载中</ul>
                </div>
            </div>
        );
    }
}

export default Select;
