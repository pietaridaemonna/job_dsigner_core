echo off
echo ; set +v # > NUL
echo ; function GOTO { true; } # > NUL
 
GOTO WIN
# bash part, replace it to suit your needs
echo -e "universal installer for Job dSIGNER"
echo -e "Linux version 1.0"
cd installers/linux
exit 0
 
:WIN
echo universal installer for Job dSIGNER
echo Windows version 1.0
cd installers\win