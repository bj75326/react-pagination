//Select.js

import React, {Component} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Option from './Option.js';
import Value from './Value.js';

import styles from './style.css';

import defaultFilterOptions from '../utils/defaultFilterOptions.js';
import defaultClearRenderer from '../utils/defaultClearRenderer.js';
import defaultArrowRenderer from '../utils/defaultArrowRenderer.js';
import defaultMenuRenderer from '../utils/defaultMenuRenderer.js';

import TransitionEventsHandler from '../utils/TransitionEventsHandler.js';

import AutosizeInput from './AutosizeInput.js';

const stringifyValue = value => {
    const type = typeof value;
    if(type === 'string'){
        return value;
    }else if(type === 'object'){
        return JSON.stringify(value);
    }else if(type === 'number' || type === 'boolean'){
        return String(value);
    }else{
        return '';
    }
};

const stringOrNode = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
]);

class Select extends Component{

    constructor(props){
        super(props);

        let inputValue = '';
        if(!this.props.multi && this.props.searchable){
            const valueArray = this.getValueArray(this.props.selectedValue);
            inputValue = valueArray[0] ? valueArray[0][this.props.labelKey] : '';
        }

        this.state = {
            inputValue : inputValue,
            showDropdown : false,
            isFocused: false,
            required: false,
            isPseudoFocused: false
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

        searchable: false,

        joinValues: false,

        valueComponent: Value,
        simpleValue: false,

        onBlurResetsInput: true,
        backspaceRemoves: true,
        tabSelectsValue: true,
        clearable: true,
        escapeClearsValue: true,
        onCloseResetsInput: true,

        clearRenderer: defaultClearRenderer,
        arrowRenderer: defaultArrowRenderer,
        clearAllText: 'Clear All',
        clearValueText: 'Clear Value',

        noResultText: '无匹配数据',
        menuRenderer: defaultMenuRenderer,
        optionComponent: Option,
    };

    static PropTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        ident: PropTypes.string.isRequired,         //select组件实例key
        selectedValue: PropTypes.any,               //已选option value
        options: PropTypes.array,                   //select所有选项 option object's array
        disabled: PropTypes.bool,
        multi: PropTypes.bool,                      //是否多选
        required: PropTypes.bool,                   //Form控件是否要求必需有值, validator
        placeholder: PropTypes.string,              //placeholder
        delimiter: PropTypes.string,                //selectedValue多选分隔符
        valueKey: PropTypes.string,                 //option对象value属性名
        onChange: PropTypes.func,                   //母组件传递的更新句柄

        filterOptions: PropTypes.any,               //自定义筛选函数模块，设置为假值(false, 0, '')可跳过筛选
        filterOption: PropTypes.func,               //自定义条件筛选函数
        ignoreAccents: PropTypes.bool,              //筛选options时是否忽略特殊字符
        ignoreCase: PropTypes.bool,                 //筛选options时是否忽略大小写
        labelKey: PropTypes.string,                 //option对象label属性名
        matchPos: PropTypes.string,                 //(any|start)筛选字符串任意位置或者从头开始匹配
        matchProp: PropTypes.string,                //(any|label|value)筛选基于option对象的哪个值

        searchable: PropTypes.bool,                 //是否开启输入框和filterOption功能

        wrapperStyle: PropTypes.object,             //select补充样式
        style: PropTypes.object,                    //select control补充样式

        name: PropTypes.string,                     //input hidden name
        joinValues: PropTypes.bool,                 //使用delimiter合并input hidden values，设置false渲染多个input

        valueRenderer: PropTypes.func,              //自定义渲染value的fn function(option){...}
        valueComponent: PropTypes.func,             //用来渲染value的react component
        onValueClick: PropTypes.func,               //已选value绑定的click事件句柄

        autoBlur: PropTypes.bool,                   //选择某个option或者删除某个value(多选)后，是否自动失焦

        simpleValue: PropTypes.bool,                //setValue时用哪种方式传值给onChange，默认false传递完整value对象

        inputProps: PropTypes.object,               //自定义input属性
        inputRenderer: PropTypes.func,              //自定义渲染input的fn function(){...}

        'aria-describedby': PropTypes.string,
        'aria-labelledby': PropTypes.string,
        'aria-label': PropTypes.string,

        tabIndex: PropTypes.string,                 //tab index

        onFocus: PropTypes.func,                    //select input(div)获取焦点回调句柄
        onBlur: PropTypes.func,                     //select input(div)失去焦点回调句柄
        onBlurResetsInput: PropTypes.bool,          //select input 失去焦点时是否清空输入内容
        onInputChange: PropTypes.func,              //select input value改变回调句柄
        onInputKeyDown: PropTypes.func,             //select control 键盘事件回调句柄

        backspaceRemoves: PropTypes.bool,           //backSpace 按键是否移除selected value
        tabSelectsValue: PropTypes.bool,            //tab 按键是否触发select 当前焦点选项

        clearable: PropTypes.bool,                  //select 已选值是否可以清除
        escapeClearsValue: PropTypes.bool,          //esc按键清除已选值
        onCloseResetsInput: PropTypes.bool,         //select input closeDropdown时是否清空输入内容

        clearRenderer: PropTypes.func,              //用来渲染clear 的函数
        arrowRenderer: PropTypes.func,              //用来渲染arrow 的函数
        clearAllText: stringOrNode,                 //指示用来清除所有selected value
        clearValueText: stringOrNode,               //指示用来清除当前selected value
        resetValue: PropTypes.any,                  //默认clearValue时的重置值

        dropdownStyle: PropTypes.object,            //dropdown自定义行内样式
        noResultText: stringOrNode,                 //没有可以匹配的option 时所要渲染的内容
        menuRenderer: PropTypes.func,               //用来渲染dropdown 的函数
        optionClassName: PropTypes.string,          //option自定义css 类
        optionComponent: PropTypes.func,            //用来渲染option的react component
        optionRenderer: PropTypes.func,             //自定义渲染option的fn
    };

    componentDidMount(){

        if(this.dropdown){
            const {prefixCls} = this.props;
            const dropdownClassList = this.dropdown.classList;
            const endListener = this._endListener = ()=>{
                const showDropdown = this.state.showDropdown;
                if(!showDropdown){
                    dropdownClassList.remove(styles['slide-up-leave-active']);
                    dropdownClassList.remove(styles[`${prefixCls}-dropdown-active`]);
                }else{
                    dropdownClassList.remove(styles['slide-up-enter-active']);
                }
            };
            //dropdown动画结束事件绑定
            TransitionEventsHandler.addEndEventListener(this.dropdown, endListener);
        }
    }

    componentWillUnmount(){

        //dropdown动画在select组件卸载前解除绑定
        if(this.dropdown){
            TransitionEventsHandler.removeEndEventListener(this.dropdown, this._endListener);
        }
    }

    componentWillReceiveProps(){

    }

    componentWillUpdate(nextProps, nextState){
        console.log('in componentWillUpdate');
        const prevInputValue = this.state.inputValue;
        const prevShowDropdown = this.state.showDropdown;
        const nextInputValue = nextState.inputValue;
        const nextShowDropdown = nextState.showDropdown;
        this._renderPrevOptions = false;
        this._prevInputValue = null;
        if(prevInputValue !== nextInputValue && prevShowDropdown === true && nextShowDropdown === false){
            this._renderPrevOptions = true;
            this._prevInputValue = prevInputValue;
        }
    }

    componentDidUpdate(){

    }

    handleValueClick(option, event){
        if(!this.props.onValueClick){
            return;
        }
        this.props.onValueClick(option, event);
    }

    handleKeyDown(event){
        if(this.props.disabled) return;

        if(this.props.onInputKeyDown){
            this.props.onInputKeyDown(event);
            if(event.defaultPrevented){
                return;
            }
        }

        switch(event.keyCode) {
            case 8: //backspace
                if (!this.state.inputValue && this.props.backspaceRemoves) {
                    event.preventDefault();
                    this.popValue();
                }
                return;
            case 9: //tab
                if (event.shiftKey || !this.state.showDropdown || !this.props.tabSelectsValue) {
                    return;
                }
                this.selectFocusedOption();
                return;
            case 13: //enter
                if (!this.state.showDropdown) return;
                event.stopPropagation();
                this.selectFocusedOption();
                break;
            case 27: //escape
                if(this.state.showDropdown){
                    this.closeDropdown();
                }else if(this.props.clearable && this.props.escapeClearsValue){
                    this.clearValue(event);
                    event.stopPropagation();
                }
                break;
            case 38: //up
                this.focusPrevOption();
                break;
            case 40: //down
                this.focusNextOption();
                break;
            case 33: //page up
                this.focusPageUpOption();
                break;
            case 34: //page down
                this.focusPageDownOption();
                break;
            case 35: //end key
                if(event.shiftKey) return;
                this.focusEndOption();
                break;
            case 36: //home key
                if(event.shiftKey) return;
                this.focusStartOption();
                break;
            case 46: //delete
                if(!this.state.inputValue && this.props.backspaceRemoves){
                    event.preventDefault();
                    this.popValue();
                }
                return;
            default: return;
        }

        event.preventDefault();

    }

    handleMouseDown(event){
        //如果select组件为disabled，或者不为左键点击，不作处理
        if(this.props.disabled || event.button !== 0){
            return;
        }
        //MouseDown事件如果发生在input上，默认操作
        //if(event.target.tagName === 'INPUT'){
        //    return;
        //}

        //阻止冒泡与默认行为
        event.stopPropagation();
        event.preventDefault();
        /*
        if(!this.props.searchable){
            this.focus();
            this.toggleDropdownClass();
            return;
        }*/
        if(!this.state.showDropdown){
            this.focus();
            this.openDropdown();

            if(this.state.inputValue.length > 0){
                let input = this.input;
                if(typeof input.getInput === 'function'){
                    input = input.getInput;
                }
                input.select();
            }

        }else{
            this.blurInput();
            //this.closeDropdown();
        }

    }

    handleMouseDownOnMenu(){

    }

    handleTouchStart(){

    }

    handleTouchMove(){

    }

    handleTouchEnd(){

    }

    handleTouchEndClearValue(){

    }

    selectFocusedOption(){

    }

    focusPrevOption(){

    }

    focusNextOption(){

    }

    focusPageUpOption(){

    }

    focusPageDownOption(){

    }

    focusEndOption(){

    }

    focusStartOption(){

    }

    //dropdown动画切换，临时方案
    toggleDropdownClass(){

        if(!this.dropdown) return;

        const showDropdown = this.state.showDropdown;
        const {prefixCls} = this.props;
        const dropdownClassList = this.dropdown.classList;
        if(!showDropdown){
            setTimeout(()=>{
                this.setState({showDropdown: !showDropdown});
                dropdownClassList.remove(styles['slide-up-leave-active']);
                dropdownClassList.add(styles[`${prefixCls}-dropdown-active`]);
                dropdownClassList.add(styles['slide-up-enter-active']);
            }, 0);
        }else{
            setTimeout(()=>{
                this.setState({showDropdown: !showDropdown});
                dropdownClassList.remove(styles['slide-up-enter-active']);
                dropdownClassList.add(styles['slide-up-leave-active']);
            }, 0);
        }
    }

    openDropdown() {
        if (!this.dropdown) return;

        const {prefixCls} = this.props;
        const dropdownClassList = this.dropdown.classList;

        this.setState({showDropdown: true});
        dropdownClassList.remove(styles['slide-up-leave-active']);
        dropdownClassList.add(styles[`${prefixCls}-dropdown-active`]);
        dropdownClassList.add(styles['slide-up-enter-active']);
    }

    closeDropdown(nextState){
        if(!this.dropdown) return;

        const dropdownClassList = this.dropdown.classList;
        let inputValue = '';

        if(!this.props.multi && this.props.searchable){
            inputValue = this.resetInputValue();
        }else if(this.props.searchable && this.props.onCloseResetsInput){
            inputValue = this.handleInputValueChange('')
        }

        inputValue = nextState ? nextState.inputValue : inputValue;
        const isFocused = nextState ? nextState.isFocused : this.state.isFocused;

        this.setState({
            showDropdown: false,
            inputValue: inputValue,
            isPseudoFocused: isFocused && !this.props.multi
        });

        dropdownClassList.remove(styles['slide-up-enter-active']);
        dropdownClassList.add(styles['slide-up-leave-active']);

    }

    //this.input 获取焦点
    focus() {
        if (!this.input) return;
        this.input.focus();
    }
    //this.input 失去焦点
    blurInput(){
        if(!this.input) return;
        this.input.blur();
    }
    //指定某个option获取焦点
    focusOption(option){
        this.setState({
            focusedOption: option
        });
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
    //任何时候调用expandValue返回的是options数组的某个对象引用，方便之后setValue时直接比较
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

    setValue(value){
        if(this.props.autoBlur){
            this.blurInput();
        }

        if(!this.props.onChange) return;

        if(this.props.required){
            const required = this.handleRequired(value, this.props.multi);
            this.setState({required});
        }
        if(this.props.simpleValue && value){
            value = this.props.multi ? value.map(i=>i[this.props.valueKey]).join(this.props.delimiter) : value[this.props.valueKey];
        }
        this.props.onChange(this.props.ident, value);
    }

    removeValue(value){
        let valueArray = this.getValueArray(this.props.selectedValue);
        this.setValue(valueArray.filter(i=> i !== value));
        //to fix multi input unmount issue
        setTimeout(()=>{
            this.focus();
        }, 0);
    }

    addValue(value){
        let valueArray = this.getValueArray(this.props.selectedValue);
        const visibleOptions = this._visibleOptions.filter(val=>{
            return !val.disabled;
        });
        const lastValueIndex = visibleOptions.indexOf(value);
        this.setValue(valueArray.concat(value));
        if(visibleOptions.length - 1 === lastValueIndex){
            this.focusOption(visibleOptions[lastValueIndex - 1]);
        }else if(visibleOptions.length > lastValueIndex){
            this.focusOption(visibleOptions[lastValueIndex + 1]);
        }
        //to fix multi input unmount issue
        setTimeout(()=>{
            this.focus();
        }, 0);
    }

    popValue(){
        let valueArray = this.getValueArray(this.props.selectedValue);
        if(!valueArray.length) return;
        if(valueArray[valueArray.length - 1].clearableValue === false) return;
        this.setValue(this.props.multi ? valueArray.slice(0, valueArray.length - 1) : null);
    }

    selectValue(value){
        if(this.props.multi){
            this.setState({
                inputValue: this.handleInputValueChange(''),
                focusedOption: null
            }, ()=>{
                const valueArray = this.getValueArray(this.props.selectedValue);
                if(valueArray.indexOf(value) > -1){
                    this.removeValue(value);
                }else{
                    this.addValue(value);
                }
            });
        }else{
            let inputValue = this.getOptionLabel(value) || '';
            this.closeDropdown();
            this.setState({
                //showDropdown: false,
                inputValue: this.handleInputValueChange(inputValue),
                isPseudoFocused: true
            }, ()=>{
                this.setValue(value);
            });
        }
    }

    clearValue(event){
        if(event && event.type === 'mousedown' && event.button !== 0){
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.setValue(this.getResetValue());
        setTimeout(()=>{
            this.closeDropdown();
            this.focus();
        }, 0);
    }

    getResetValue(){
        if(this.props.resetValue !== undefined){
            return this.props.resetValue;
        }else if(this.props.multi){
            return [];
        }else{
            return null;
        }
    }

    //可输入单选在 closeDropdown blurInput 时，需要reset inputValue
    resetInputValue(){
        const valueArray = this.getValueArray(this.props.selectedValue);
        const inputValue = valueArray[0] ? this.handleInputValueChange(valueArray[0][this.props.labelKey]) : this.handleInputValueChange('');
        return inputValue;
    }

    handleInputBlur(event){
        if(this.dropdown && (this.dropdown === document.activeElement || this.dropdown.contains(document.activeElement))){
            this.focus();
            return;
        }
        if(this.props.onBlur){
            this.props.onBlur(event);
        }

        const onBlurredState = {
            isFocused: false,
            isPseudoFocused: false
        };


        if(!this.props.multi && this.props.searchable){

            onBlurredState.inputValue = this.resetInputValue();

        }else if(this.props.onBlurResetsInput){

            onBlurredState.inputValue = this.handleInputValueChange('');

        }
        //input blur 时需要关闭dropdown
        this.closeDropdown(onBlurredState);

        this.setState(onBlurredState);
    }

    handleInputChange(event){
        this.filterSlient = false;
        let newInputValue = event.target.value;
        if(this.state.inputValue !== newInputValue){
            newInputValue = this.handleInputValueChange(newInputValue);
        }
        this.setState({
            inputValue: newInputValue,
            isPseudoFocused: false
        });
        this.openDropdown();
    }

    handleInputValueChange(newValue){
        if(this.props.onInputChange){
            let nextState = this.props.onInputChange(newValue);
            if(nextState != null && typeof nextState !== 'object'){
                newValue = '' + nextState;
            }
        }
        return newValue;
    }

    handleInputFocus(event) {
        if (this.props.disabled) return;
        //后续补充
        //const showDropdown = this.state.showDropdown;
        if(this.props.onFocus){
            this.props.onFocus(event);
        }
        this.filterSlient = true;
        this.setState({
            isFocused: true,
            isPseudoFocused: false
            //showDropdown: showDropdown
        });
    }

    //根据输入值筛选options
    filterOptions(excludeOptions){
        let filterValue = '';
        if(this._renderPrevOptions){
            filterValue = this._prevInputValue;
        }else{
            filterValue = this.state.inputValue;
        }
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
        if(!this.props.name) return;
        if(this.props.joinValues){
            let value = valueArray.map(i=>stringifyValue(i[this.props.valueKey])).join(this.props.delimiter);
            return (
                <input
                    type="hidden"
                    name={this.props.name}
                    value={value}
                    disabled={this.props.disabled}
                    ref={ref=>{this.value = ref}}
                />
            );
        }
        return valueArray.map((item, index)=>{
            return (
                <input
                    key={"hidden." + index}
                    type="hidden"
                    name={this.props.name}
                    disabled={this.props.disabled}
                    value={stringifyValue(item[this.props.valueKey])}
                    ref={ref=>{this['value' + index] = ref}}
                />
            );
        });
    }

    handleRequired(value, multi){
        if(!value) return true;
        return (multi ? value.length === 0 : Object.keys(value).length === 0);
    }

    getOptionLabel(option){
        return option[this.props.labelKey];
    }

    renderValue(valueArray, showDropdown){
        let renderLabel = this.props.valueRenderer || this.getOptionLabel.bind(this);
        let ValueComponent = this.props.valueComponent;

        const {prefixCls, placeholder, multi, ident, disabled, searchable} = this.props;
        //<div className={styles[`${prefixCls}-placeholder`]}>请选择</div>
        if(!valueArray.length){
            //无值，不可输入，渲染placeholder
            return !searchable ? <div className={styles[`${prefixCls}-placeholder`]}>{placeholder}</div> : null;
        }
        let onClick = this.props.onValueClick ? this.handleValueClick.bind(this) : null;

        if(multi){
            //有值，多选，可输入&不可输入都应正常渲染value
            return valueArray.map((value, i)=>{
                return (
                    <ValueComponent
                        id={ident + '_value_' + i}
                        //dom diff
                        key={ident + '_value_' + i}
                        disabled={disabled}
                        option={value}
                        onClick={onClick}
                        onRemove={this.removeValue.bind(this)}
                    >
                        {renderLabel(value, i)}
                        <FontAwesome name="times"/>
                    </ValueComponent>
                );
            });
        }else if(!searchable){
            //有值，单选，只有在不可输入的情况渲染value，可输入用input代替
            if(showDropdown) onClick = null;
            return (
                <ValueComponent
                    id={ident + '_value_item'}
                    disabled={disabled}
                    onClick={onClick}
                    option={valueArray[0]}
                >
                    {renderLabel(valueArray[0])}
                </ValueComponent>
            );
        }
        /*
        if(multi){
            //有值 多选
            return valueArray.map((value, i)=>{
                return (
                    <ValueComponent
                        id={ident + '_value_' + i}
                        disabled={disabled}
                        option={value}
                        onClick={onClick}
                        onRemove={this.removeValue.bind(this)}
                    >
                        {renderLabel(value, i)}
                        <FontAwesome name="times"/>
                    </ValueComponent>
                );
            });
        }else if(!this.state.inputValue){
            //有值 单选 没输入
            if(showDropdown) onClick = null;
            return (
                <ValueComponent
                    id={ident + '_value_item'}
                    disabled={disabled}
                    onClick={onClick}
                    option={valueArray[0]}
                >
                    {renderLabel(valueArray[0])}
                </ValueComponent>
            );
        } */
    }

    renderInput(valueArray, focusedOptionIndex){
        const showDropdown = this.state.showDropdown;

        const prefixCls= this.props.prefixCls;

        const ariaOwns = classnames({
            [this.props.ident + '-list']: showDropdown,
            //Todo require check
            [this.props.ident + '-backspace-remove-message']: this.props.multi
                && !this.props.disabled
                && this.state.isFocused
                && !this.state.inputValue
        });

        const inputProps = Object.assign({}, this.props.inputProps, {
            role: 'combobox',
            'aria-expanded': '' + showDropdown,
            'aria-owns': ariaOwns,
            'aria-haspopup': '' + showDropdown,
            'aria-activedescendant': showDropdown ? this.props.ident + '-option-' + focusedOptionIndex : this.props.ident + '-value',
            'aria-describedby': this.props['aria-describedby'],
            'aria-labelledby': this.props['aria-labelledby'],
            'aria-label': this.props['aria-labels'],
            tabIndex: this.props.tabIndex,
            onBlur: this.handleInputBlur.bind(this),
            onChange: this.handleInputChange.bind(this),
            onFocus: this.handleInputFocus.bind(this),
            ref: ref => this.input = ref,
            required: this.state.required,
            value: this.state.inputValue
        });

        if(this.props.inputRenderer){
            return this.props.inputRenderer(inputProps);
        }

        if(this.props.disabled || !this.props.searchable){
            const {...divProps} = this.props.inputProps;

            const ariaOwns = classnames({
                [this.props.ident + '-list']: showDropdown
            });

            return (
                <div
                    {...divProps}
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-owns={ariaOwns}
                    aria-activedescendant={showDropdown ? this.props.ident + '-option-' + focusedOptionIndex : this.props.ident + '-value'}
                    className={styles[`${prefixCls}-input`]}
                    tabIndex={this.props.tabIndex || 0}
                    onBlur={this.handleInputBlur.bind(this)}
                    onFocus={this.handleInputFocus.bind(this)}
                    ref={ref=>this.input=ref }
                    aria-readonly={'' + !!this.props.disabled}
                    style={{border: 0, width: 1, display:'inline-block' }}
                />
            );
        }

        if(this.props.multi && valueArray.length > 0){
            return (
                <AutosizeInput {...inputProps} prefixCls="bin-select" className={styles[`${prefixCls}-input`]} />
            );
        }

        return (
            <div className={styles[`${prefixCls}-input`]}>
                <input {...inputProps} placeholder={this.props.placeholder}/>
            </div>
        );
    }

    //<span className={styles[`${prefixCls}-clean`]}><FontAwesome name="times-circle"/></span>
    renderClear(valueArray){
        if(!this.props.clearable || !valueArray.length || this.props.disabled) return;

        const clear = this.props.clearRenderer();

        return (
            <span className={styles[`${this.props.prefixCls}-clean-zone`]}
                  title={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
                  aria-label={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
                  onMouseDown={this.clearValue.bind(this)}
                  onTouchStart={this.handleTouchStart.bind(this)}
                  onTouchMove={this.handleTouchMove.bind(this)}
                  onTouchEnd={this.handleTouchEndClearValue.bind(this)}
            >
                <span className={styles[`${this.props.prefixCls}-clean`]}>
                    {clear}
                </span>
            </span>
        );
    }

    //<span className={styles[`${prefixCls}-arrow`]}><FontAwesome name="caret-down"/></span>
    renderArrow(){

        const arrow = this.props.arrowRenderer();

        return (
            <span className={styles[`${this.props.prefixCls}-arrow-zone`]}>
                <span className={styles[`${this.props.prefixCls}-arrow`]}>
                    {arrow}
                </span>
            </span>
        );
    }

    onOptionRef(ref, isFocused){
        if(isFocused){
            this.focused = ref;
        }
    }

    renderMenu(options, valueArray, focusedOption){
        if(options && options.length){
            return this.props.menuRenderer({
                focusedOption,
                focusOption: this.focusOption.bind(this),
                ident: this.props.ident,
                prefixCls: this.props.prefixCls,
                multi: this.props.multi,
                labelKey: this.props.labelKey,
                onFocus: this.focusOption.bind(this),
                onSelect: this.selectValue.bind(this),
                optionClassName: this.props.optionClassName,
                optionComponent: this.props.optionComponent,
                optionRenderer: this.props.optionRenderer || this.getOptionLabel.bind(this),
                options,
                selectValue: this.selectValue.bind(this),
                valueArray,
                valueKey: this.props.valueKey,
                onOptionRef: this.onOptionRef.bind(this)
            });
        }else if(this.props.noResultText){
            return (
                <ul className={styles[`${this.props.prefixCls}-not-found`]}>
                    <li>{this.props.noResultText}</li>
                </ul>
            );
        }else{
            return null;
        }
    }

    renderDropdown(options, valueArray, focusedOption){

        let dropdownStyle = {
            position: 'absolute',
            left: '0px',
            transformOrigin: 'center top 0px'
        };
        if(this.control){
            dropdownStyle.width = this.control.offsetWidth + 'px';
            dropdownStyle.top = this.control.offsetHeight + 'px';
        }

        if(this.props.dropdownStyle){
            Object.assign(dropdownStyle, this.props.dropdownStyle);
        }

        const menu = this.renderMenu(options, valueArray, focusedOption);

        return (
            <div ref={ref=>{this.dropdown = ref}} className={styles[`${this.props.prefixCls}-dropdown`]} style={dropdownStyle}
                 role="listbox" id={this.props.ident + '-list'}
                 onMouseDown={this.handleMouseDownOnMenu.bind(this)}
            >
                {menu}
            </div>
        );
    }

    render(){
        console.log('render!');
        //根据selectedValue获取已选择option对象数组。
        let valueArray = this.getValueArray(this.props.selectedValue);

        let options;

        const searchable = this.props.searchable;
        const multi = this.props.multi;
        //searchable === false, 不进行filterOptions，所有options显示
        //searchable === true, 进行filterOptions
        if(searchable === false || this.filterSlient === true){
            options = this._visibleOptions = this.props.options;
        }else{
            options = this._visibleOptions = this.filterOptions(multi ? this.getValueArray(this.props.selectedValue): null);
        }

        const focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);
        let focusedOption = null;
        if(focusedOptionIndex !== null){
            focusedOption = this._focusedOption = options[focusedOptionIndex];
        }else{
            focusedOption = this._focusedOption = null;
        }


        const showDropdown = this.state.showDropdown;
        const isFocused = this.state.isFocused;
        const isPseudoFocused = this.state.isPseudoFocused;

        const {className, prefixCls} = this.props;

        const selectClassName = classnames({
            [styles[prefixCls]]: true,
            [styles[className]]: !!className,
            [styles[`${prefixCls}-single`]]: !multi,
            [styles[`${prefixCls}-multiple`]]: multi,
            [styles[`${prefixCls}-visible`]]: showDropdown,
            [styles[`${prefixCls}-focus`]]: isFocused,
            [styles[`${prefixCls}-pseudoFocus`]]: isPseudoFocused
        });

        return (
            <div className={selectClassName} style={this.props.wrapperStyle}>
                {this.renderHiddenField(valueArray)}
                <div className={styles[`${prefixCls}-control`]}
                     ref={ref=>{this.control = ref}}
                     style={this.props.style}
                     onKeyDown={this.handleKeyDown.bind(this)}
                     onMouseDown={this.handleMouseDown.bind(this)}
                     onTouchStart={this.handleTouchStart.bind(this)}
                     onTouchMove={this.handleTouchMove.bind(this)}
                     onTouchEnd={this.handleTouchEnd.bind(this)}
                >
                    <span className={styles[`${prefixCls}-value-wrapper`]}>
                        {this.renderValue(valueArray, showDropdown)}
                        {this.renderInput(valueArray, focusedOptionIndex)}
                    </span>
                    {this.renderArrow()}
                    {this.renderClear(valueArray)}
                </div>
                {this.renderDropdown(options, valueArray, focusedOption)}
            </div>
        );
    }
}

export default Select;
