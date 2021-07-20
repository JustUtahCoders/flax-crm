import { Response } from "express";
import { Result, ValidationError } from "express-validator";

export function notFound(res: Response, msg: EndpointErrorMessage) {
  res.status(404).json({
    errors: Array.isArray(msg) ? msg : [msg],
  });
}

export function invalidRequest(res: Response, errors: EndpointErrorMessage) {
  let msg;

  if (Array.isArray((errors as Result<ValidationError>).array)) {
    res.status;
    msg = (errors as Result<ValidationError>).array();
  } else {
    msg = errors;
  }

  res.status(400).json({
    errors: Array.isArray(msg) ? msg : [msg],
  });
}

export function successNoContent(res: Response) {
  res.status(204).end();
}

type EndpointErrorMessage = string | Array<string> | Result<ValidationError>;
