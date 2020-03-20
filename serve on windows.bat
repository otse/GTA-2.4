REM simpler than wamp / xampp / and things like www folders

start "" http://localhost:80/index.html
http-server . -a 0.0.0.0 -p 80 -c-1
