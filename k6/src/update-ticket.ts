import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '20s', target: 1000 },
    { duration: '10s', target: 0 },
  ]
}

export default function() {
  const cookies = {
    accessToken: __ENV.ACCESS_TOKEN,
    refreshToken: __ENV.REFRESH_TOKEN,
    userAgent: __ENV.USER_AGENT,
  }
  const body = {
    title: Math.random().toString(),
    price: '5',
  }
  let res = http.post(
    'http://ticketing.rus/api/v1/tickets',
    body,
    { cookies }
  );

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  const newTicket = JSON.parse(res.body as string);

  sleep(1);

  res = http.put(
    `http://ticketing.rus/api/v1/tickets/${newTicket.id}`,
    { ...body, price: '10' },
    { cookies }
  );

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);

  res = http.put(
    `http://ticketing.rus/api/v1/tickets/${newTicket.id}`,
    { ...body, price: '15' },
    { cookies }
  );

  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}