import { Response } from 'express';

export const buildSSEMessage = (data: string, event: string) => {
  return `event: ${event}\ndata: ${data}\n\n`;
};

export const setSSEResponseHeaders = (res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res;
};
