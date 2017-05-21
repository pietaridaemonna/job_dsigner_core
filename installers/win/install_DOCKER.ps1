<#
.SYNOPSIS
    script to install DOCKER
.DESCRIPTION
    this script will download and install docker 
.NOTES
    File Name      : install_DOCKER.ps1
    Prerequisite   : tested on powershell 5.1.14393
.LINK
    put here website that host link
.EXAMPLE
    install_DOCKER.ps1 

#>


# download docker
Invoke-WebRequest "https://download.docker.com/win/stable/InstallDocker.msi" -OutFile "$env:TEMP\docker.msi" -UseBasicParsing
msiexec.exe /i InstallDocker.msi /qb

Start-Service Docker

# in the end set proxy and restart docker
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://username:password@proxy:port/", [EnvironmentVariableTarget]::Machine)
Restart-Service Docker