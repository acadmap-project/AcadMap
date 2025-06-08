function renomearKey(obj, oldKey, newKey) {
    const { [oldKey]: value, ...rest } = obj;
    return {
        ...rest,
        [newKey]: value
    };
}

export default renomearKey;