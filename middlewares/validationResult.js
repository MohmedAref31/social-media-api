import {validationResult} from "express-validator"
import { resFormat } from "../utiles/responseFormat.utiles.js";


export const validate = (req, res, next)=>{
    const result = validationResult(req);
    if(result.isEmpty()) return next();

  return  res.status(400).json(resFormat("fail", "validation failed", {errors : result.array()}))
}