import { Response } from "express";
import { Result, ValidationError } from "express-validator";

export function notFound(res: Response, msg: EndpointErrorMessage) {
  return res.status(404).json({
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

export function created(res: Response, obj: object) {
  res.status(201).send(obj);
}

export function serverApiError(res: Response, msg: string | string[]) {
  res.status(500).send({
    errors: Array.isArray(msg) ? msg : [msg],
  });
}

type EndpointErrorMessage = string | Array<string> | Result<ValidationError>;
