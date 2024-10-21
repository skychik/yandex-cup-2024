import {createSelector} from "./bakufu";

const selector1 = createSelector((state) => {
    if (state.isEnabled) {
        return state.inner.value;
    }

    return null;
});

const selector2 = createSelector((state) => {
    if (Array.isArray(state.array) && state.array.length > 0) {
        return state.array[0];
    }

    return null;
});

const selector3 = createSelector((state, params) => {
    if (params.short) {
        return {
            id: state.id,
            name: state.name,
        };
    }

    return state;
});

const result1 = selector1({isEnabled: true, inner: {value: 42}})
const result2 = selector1({isEnabled: false, inner: {value: 21}})
const result3 = selector2({array: [1, 2, 3]});
const result4 = selector3({id: 2135, name: "Ivan", lastname: "Ivanov", age: 25}, {short: false});

const obj1 = {
    result: 42,
    steps: [
        ["arg0", "isEnabled"],
        ["arg0", "inner", "value"],
    ],
}

const obj2 = {
    result: null,
    steps: [["arg0", "isEnabled"]],
}

const obj3 = {
    result: 1,
    steps: [
        ["arg0", "array"],
        ["arg0", "array", "length"],
        ["arg0", "array", "0"]
    ],
}

const obj4 = {
    result: {
        id: 2135,
        name: "Ivan",
        lastname: "Ivanov",
        age: 25
    },
    steps: [
        ["arg1", "short"],
        ["arg0"]
    ]
}

console.log(JSON.stringify(result1) === JSON.stringify(obj1)) // true
console.log(JSON.stringify(result2) === JSON.stringify(obj2)) // true
console.log(JSON.stringify(result3) === JSON.stringify(obj3)) // true
console.log(JSON.stringify(result4) === JSON.stringify(obj4)) // true