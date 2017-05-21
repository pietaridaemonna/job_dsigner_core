<#
.SYNOPSIS
    script to install NODEjs
.DESCRIPTION
    this script will download and install nodejs to custom folder
.NOTES
    File Name      : install_NODE.ps1
    Prerequisite   : tested on powershell 5.1.14393
.LINK
    put here website that host link
.EXAMPLE
    install_NODE.ps1 
#>

Write-Output "using POWERSHELL version: $PSVersionTable.PSVersion"
Write-Output "Downloading NODEjs"
Invoke-WebRequest -OutFile node-v6.10.2-x64.msi https://nodejs.org/dist/v6.10.2/node-v6.10.2-x64.msi
msiexec.exe /i node-v6.10.2-x64.msi INSTALLDIR="C:\Tools\NodeJS" /qb