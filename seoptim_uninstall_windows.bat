@ECHO OFF
cd /d %USERPROFILE%
cd seoptim
ECHO Uninstall dependencies
npm unlink
npm uninstall -g
npm uninstall
ECHO Remove SEOptim
cd ..
rmdir /s /q seoptim
ECHO Remove shortcuts
PAUSE