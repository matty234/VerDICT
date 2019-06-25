"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IStoredShelfValue {
}
exports.IStoredShelfValue = IStoredShelfValue;
class DiseaseShelfValue extends IStoredShelfValue {
    static isDiseaseShelfValue(arg) {
        return arg !== undefined && arg.omim !== undefined;
    }
}
exports.DiseaseShelfValue = DiseaseShelfValue;
class CustomGeneGroupShelfValue extends IStoredShelfValue {
    constructor() {
        super(...arguments);
        this.genes = new Array();
    }
    static isCustomGeneGroupShelfValue(arg) {
        return arg !== undefined && arg.genes !== undefined;
    }
}
exports.CustomGeneGroupShelfValue = CustomGeneGroupShelfValue;
//# sourceMappingURL=shelf.model.js.map