"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelf_model_1 = require("./models/shelf.model");
class GraphQueryBuilder {
    constructor(prepend, append, shelfHandlers) {
        this.prepend = prepend;
        this.append = append;
        this.shelfHandlers = shelfHandlers;
    }
    addShelfItem(shelfValues) {
        this.shelfItems = shelfValues;
        return this;
    }
    build() {
        const shelfItemsValue = this.shelfItems.map(this.getShelfItemString.bind(this)).join('');
        return this.prepend + shelfItemsValue + this.append;
    }
    getShelfItemString(shelfItem) {
        if (shelf_model_1.DiseaseShelfValue.isDiseaseShelfValue(shelfItem)) {
            return this.shelfHandlers.diseaseShelfValueHander(shelfItem);
        }
        if (shelf_model_1.CustomGeneGroupShelfValue.isCustomGeneGroupShelfValue(shelfItem)) {
            return this.shelfHandlers.customGeneGroupShelfValueHander(shelfItem);
        }
    }
}
exports.GraphQueryBuilder = GraphQueryBuilder;
//# sourceMappingURL=graph-query.builder.js.map