import _ from 'underscore'

const cloneDeep = (data) => {
    let obj;
    if (_.isArray(data)) {
        obj = [];
    } else if (_.isObject(data)) {
        obj = {};
    } else {
        return data;
    }
    if (_.isArray(data)) {
        _.each(data, value => {
            obj.push(cloneDeep(value));
        })
    } else if (_.isObject(data)) {
        for (const key in data) {
            obj[key] = cloneDeep(data[key]);
        }
    }
    return obj;
};


_.mixin({ cloneDeep })

export default cloneDeep