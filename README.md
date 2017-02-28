# job_dsigner core
job runner, continuous integration

## Main features

- Run CLI (Powershell, Bash..)
- Run remote CLI (SSH)
- Run code (Javascript, Python, C#, Java, Go-lang..)
- Aliases to transform any long string/sentence into single variable/string
- Command aliases.. 
  which can be transformed in well formed commandline set like
  ***POSIX*** like options (ie. tar -zxvf foo.tar.gz), 
  ***GNU*** like long options (ie. du --human -readable --max-depth=1), 
  ***SHELL*** options ($property=value), 
  ***JAVA*** like properties (ie. java -Djava.awt.headless=true - Djava.net.useSystemProxies=true Foo), 
  ***Robot-Framework*** properties (--variable DB_HOST:dbservername --variable DATABASE_SID:some_SID) 
  ***Database*** url strings (jdbc:oracle://127.0.0.1:8080)
- Auth (Basic, LDAP)
- Run, schedule jobs.. JOB is also TEST_SUITE!
- Chain jobs and create complex architectures
- Execute SQL thru several connectors (PG,MYSQL,ORACLE,MSSQL)
- Reporting
- Time-line execution database
- Encryption

```bash
# The MIT License (MIT)
# Copyright © 2017 Peter Ducai, http:#daemonna.com <peter.ducai@gmail.com>
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software
# and associated documentation files (the “Software”), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
#     The above copyright notice and this permission notice shall be included
#     in all copies or substantial portions of the Software.
#
#     THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
#     INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
#     PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
#     FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
#     ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
```