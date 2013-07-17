start "Git command prompt" /d c:\devtools\node-js-tests\nobj "C:\Program Files (x86)\Git\bin\sh.exe" --login -i
start "Coffeescript compiler" /d c:\devtools\node-js-tests\nobj\coffee_src cmd /c compile_watch.bat
start "MongoDB server" /d c:\devtools\mongodb-win32-x86_64-2.4.5 cmd /c start-server.bat
timeout 5
start "Node.js server" /d c:\devtools\node-js-tests\nobj cmd /c node svr
