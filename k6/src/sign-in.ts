import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '20s', target: 1000 },
    { duration: '10s', target: 0 },
  ]
}

export default function () {
  const body = {
    email: __ENV.EMAIL,
    password: __ENV.PASSWORD,
  }

  const res = http.post('http://ticketing.rus/api/v1/auth/sign-in', JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'status was 201': (r) => r.status == 201 });
}