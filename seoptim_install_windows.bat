@ECHO OFF
ECHO Cloning SEOptim repo
cd /d %USERPROFILE%
git clone https://github.com/JarekBaran/seoptim.git
cd seoptim
ECHO Install dependencies
npm install
npm install -g
npm link
ECHO Add shortcuts
regedit /s win_menu.reg
PAUSE