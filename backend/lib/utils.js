
import jwt from "jsonwebtoken";

export const generatetoken = (userid) => {
    const token = jwt.sign({ userid }, "kun123")
    return token;
}