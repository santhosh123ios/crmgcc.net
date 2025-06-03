import {db} from "../../config/db.config.js";

export const executeQuery = ({query, data = null, callback})=>{
    db.query(query,data,callback);
}