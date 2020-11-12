<#

.SYNOPSIS
Script to automate setup of environment and download of exported project. Streamer launched from StartPixelStreaming.ps1 file in project automatically.

.DESCRIPTION

.NOTES
You will need to modify the $buildExecutable variable below to match the file name for your executable in your build.

.LINK

#>

$buildExecutable = "ProjectBuild.exe"
$basePath = "C:\PixelStreamer\Downloads"

Write-Output "Starting UE4-Pixel-Streamer-Bootstrap.ps1 from:", $basePath

# Create basePath if unless it already exists.
if(!(Test-Path -Path $basePath )){
    New-Item -ItemType directory -Path $basePath
}

Write-Output "Installing Node.js"
Invoke-WebRequest -Uri "https://nodejs.org/dist/v12.8.1/node-v12.8.1-x64.msi" -OutFile "$basePath\node-v12.8.1-x64.msi"
Start-Process -FilePath "$basePath\node-v12.8.1-x64.msi" -ArgumentList "/quiet" -Wait
$env:Path += ";C:\Program Files\nodejs\;C:\Users\Administrator\AppData\Roaming\npm"
Write-Output "Node.js Installed"

Write-Output "Adding Windows Firewall Rules for UE4 Pixel Streaming"
New-NetFirewallRule -DisplayName 'UE4 Pixel Streamer' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 80
New-NetFirewallRule -DisplayName 'UE4 Pixel Streamer' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 443
New-NetFirewallRule -DisplayName 'UE4 Pixel Streamer' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 19302-19303
New-NetFirewallRule -DisplayName 'UE4 Pixel Streamer' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8888
New-NetFirewallRule -DisplayName 'UE4 Pixel Streamer' -Direction Inbound -Action Allow -Protocol UDP -LocalPort 8888
New-NetFirewallRule -DisplayName 'UE4 Pixel Streamer' -Direction Inbound -Action Allow -Protocol UDP -LocalPort 19302-19303
Write-Output "Windows Firewall Rules Added for UE4 Pixel Streaming"

Write-Output "Beginning UE4 Project Extraction"
Expand-Archive -Force -LiteralPath "$basePath\PixelStreamerProject.zip" -DestinationPath C:\PixelStreamer
Write-Output "UE4 Project Downloaded and Extracted"

# ToDo:Launch Pixel Streamer.
# Run as SYSTEM otherwise it is not executed at startup
$principal = New-ScheduledTaskPrincipal -UserID "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$action = New-ScheduledTaskAction -Execute "C:\PixelStreamer\WindowsNoEditor\$buildExecutable" -Argument "-PixelStreamingIP=localhost -PixelStreamingPort=8888 -RenderOffScreen"
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -Action $action -Principal $principal -Trigger $trigger -TaskName "UE4PixelStreamer-Project-Launch" -Description "UE4PixelStreamer-Project-Launch"

$principal = New-ScheduledTaskPrincipal -UserID "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$action = New-ScheduledTaskAction -Execute 'C:\PixelStreamer\WindowsNoEditor\Engine\Source\ThirdParty\WebRTC\rev.23789\programs\Win64\VS2017\release\Start_STUNServer.bat'
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -Action $action -Principal $principal -Trigger $trigger -TaskName "UE4PixelStreamer-STUNServer-Launch" -Description "UE4PixelStreamer-STUNServer-Launch"

$principal = New-ScheduledTaskPrincipal -UserID "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$action = New-ScheduledTaskAction -Execute 'C:\PixelStreamer\WindowsNoEditor\Engine\Source\ThirdParty\WebRTC\rev.23789\programs\Win64\VS2017\release\Start_AWS_TURNServer.bat'
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -Action $action -Principal $principal -Trigger $trigger -TaskName "UE4PixelStreamer-TURNServer-Launch" -Description "UE4PixelStreamer-TURNServer-Launch"

$principal = New-ScheduledTaskPrincipal -UserID "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$action = New-ScheduledTaskAction -Execute 'C:\PixelStreamer\WindowsNoEditor\Engine\Source\Programs\PixelStreaming\WebServers\SignallingWebServer\runAWS_WithTURN.bat'
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -Action $action -Principal $principal -Trigger $trigger -TaskName "UE4PixelStreamer-WebServer-Launch" -Description "UE4PixelStreamer-WebServer-Launch"

Write-Output "UE4-Pixel-Streamer-Bootstrap.ps1 Complete"
