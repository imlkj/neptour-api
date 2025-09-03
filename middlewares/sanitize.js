import sanitize from "mongo-sanitize";
import xss from "xss";

export const sanitizeInputs = (req, res, next) => {
  const sanitizeObject = (obj, sanitizeFn) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = sanitizeFn(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key], sanitizeFn);
      }
    }
  };

  [req.body, req.query, req.params].forEach((source) => {
    if (source && typeof source === "object") {
      sanitizeObject(source, sanitize);
      sanitizeObject(source, xss);
    }
  });

  next();
};
