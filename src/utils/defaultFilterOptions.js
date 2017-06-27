//defaultFilterOptions.js

import stripDiacritics from './stripDiacritics.js';

const filterOptions = (options, filterValue, excludeOptions, props)=>{
    if(props.ignoreAccents){
        filterValue = stripDiacritics(filterValue);
    }

    if(props.ignoreCase){
        filterValue = filterValue.toLowerCase();
    }

    if(excludeOptions) excludeOptions = excludeOptions.map(option=>option[props.valueKey]);

    return options.filter(option => {
        //排除excludeOptions
        if(excludeOptions && excludeOptions.indexOf(option[props.valueKey]) > -1) return false;
        //自定义props.filterOption
        if(props.filterOption) return props.filterOption.call(this, options, filterValue);
        //filterValue为空，options全部返回
        if(!filterValue) return true;

        let valueTest = String(option[props.valueKey]);
        let labelTest = String(option[props.labelKey]);

        if(props.ignoreAccents){
            if(props.matchProp !== 'label') valueTest = stripDiacritics(valueTest);
            if(props.matchProp !== 'value') labelTest = stripDiacritics(labelTest);
        }

        if(props.ignoreCase){
            if(props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
            if(props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
        }

        return props.matchPos === 'start' ? (
            (matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue) ||
            (matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue)
        ):(
            (matchProp !== 'label' && valueTest.indexOf(filterValue) > -1) ||
            (matchProp !== 'value' && labelTest.indexOf(filterValue) > -1)
        )
    });
};

export default filterOptions;
