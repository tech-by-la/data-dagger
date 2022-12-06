import {Translation} from "./interfaces";
import {SchemaDefinition, SchemaDefinitionType} from "mongoose";

export const translationDefinition: SchemaDefinition<SchemaDefinitionType<Translation>> = {
    page: { type: "String", },
    key: { type: "String",  },
    translations: {},
}
