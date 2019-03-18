ECHO Install dependencies
npm install
npm install -g
npm link

ECHO Add menu commands
REG ADD "HKEY_CLASSES_ROOT\*\shell\SEOptim" /v RegValue /t REG_SZ /d "SEOptim"
REG ADD "HKEY_CLASSES_ROOT\*\shell\SEOptim\command" /v RegValue /t REG_SZ /d "cmd /c seoptim"