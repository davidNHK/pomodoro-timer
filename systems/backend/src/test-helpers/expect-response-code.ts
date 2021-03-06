import type { Request, Response } from 'supertest';

function jsonParse(val: string) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
}

export function expectResponseCode(params: {
  expectedStatusCode: number;
  message?: string;
}) {
  const { expectedStatusCode, message = 'Unexpected response status code' } =
    params;
  return (res: Response & { request: Request }) => {
    if (res.status !== expectedStatusCode) {
      throw new Error(
        `
${message}
${res.request.method} ${res.request.url}
Response status: ${res.status}
Request body
${
  // @ts-expect-error type error from supertest
  JSON.stringify(jsonParse(res.request._data), null, 4)
}
Response body
${JSON.stringify(jsonParse(res.text), null, 4)}`,
      );
    }
    return true;
  };
}
