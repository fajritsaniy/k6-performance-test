import http from 'k6/http';

export const options = {
    vus : 10,
    duration : '30s',
}

export default function () {
    http.get('http://reqres.in/api/users?page=2')
}