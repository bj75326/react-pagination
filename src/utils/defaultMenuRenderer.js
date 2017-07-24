//defaultMenuRenderer.js

import React from 'react';
import classnames from 'classnames';
import styles from './style.css';

const menuRenderer = ({
    focusedOption,
    ident,
    prefixCls,
    labelKey,
    onFocus,
    onSelect,
    optionClassName,
    optionRenderer,
    optionComponent,
    options,
    valueArray,
    valueKey,
    onOptionRef
})=>{
    let Option = optionComponent;

    return options.map((option, i)=>{
        let isSelected = valueArray && valueArray.indexOf(option) > -1;
        let isFocused = option === focusedOption;
        let optionClass = classnames({
            [styles[`${prefixCls}-item`]]: true,
            [styles[`${prefixCls}-item-selected`]]: isSelected,
            [styles[`${prefixCls}-item-disabled`]]: option.disabled,
            [styles[`${prefixCls}-item-focused`]]: isFocused
        });
        return (
            <Option
                className={optionClass}
                ident={ident}
                isDisabled={option.disabled}
                isFocused={isFocused}
                isSelected={isSelected}
                key={}
                onFocus={onFocus}
                onSelect={onSelect}
                option={option}
                optionIndex={i}
                //
                ref={ref=>{}}
            >
                {optionRenderer(option, i)}
            </Option>
        );
    });
};

export default menuRenderer;