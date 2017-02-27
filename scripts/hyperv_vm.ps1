New-VM -Name $vm -path C:\vm-machine --MemoryStartupBytes 512MB
New-VHD -Path c:\vm-Machine\Testmahcine\Testmachine.vhdx -SizeBytes 10GB -Dynamic
Add-VMHardDiskDrive -VMName TestMachine -path "C:\vmmachine\Testmachine\Testmachine.vhdx"
#Set-VMDvdDrive -VMName $vm -Path "C:\Windows\System32\vmguest.iso"
Set-VMDvdDrive -VMName $vm -ControllerNumber 1 -ControllerLocation 0 -Path '\\svstore\isos\Windows 2012 R2 Server Eval.ISO'
Add-VMNetworkAdapter -ManagementOS -Name Secondary
Add-VMNetworkAdapter -VMName Test -SwitchName Network

#Set-VMDvdDrive -VMName $vm -ControllerNumber 1 -ControllerLocation 0 -Path $null

#Get-VMDvdDrive -VM $VM | Set-VMDvdDrive -Path $null

#New-VMSwitch -Name "Connect_toThe_World" -NetAdapterName 'Ethernet' -AllowManagementOS $true
#New-VMSwitch -Name "my_lonely_world" -SwitchType Internal


PS C:\> get-vm | where {$_.state -eq 'running'} | sort Uptime | select Name,Uptime,@{N="MemoryMB";E={$_.MemoryAssigned/1MB}},Status
PS C:\> start-vm jdh* -asjob  #asjob is to put it in bg
PS C:\> stop-vm jdh*

PS C:\> get-vm chi* | checkpoint-vm -SnapshotName "Weekly Snapshot $((Get-Date).toshortdatestring())" –AsJob
PS C:\> export-vm jdh* -Path e:\backupfolder -AsJob
Export-VM -Name Test -Path D:\