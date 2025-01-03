import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const body = {
    email: __ENV.EMAIL,
    password: __ENV.PASSWORD,
  }

  const res = http.post('http://ticketing.rus/api/v1/auth/sign-in', JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('res', res);
  check(res, { 'status was 201': (r) => r.status == 201 });
}