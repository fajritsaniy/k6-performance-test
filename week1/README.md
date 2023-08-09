$ go install go.k6.io/xk6/cmd/xk6@latest
$ xk6 build --with github.com/szkiba/xk6-dashboard@latest
./k6 run --out dashboard=open script.js