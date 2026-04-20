# Ensure we are in the directory containing this script (and the pom.xml)
Set-Location $PSScriptRoot

$ports = @(8088, 8089)
foreach ($port in $ports) {
    Write-Host "Searching for processes on port $port..."
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

    if ($processes) {
        foreach ($procId in $processes) {
            Write-Host "Forcefully killing process $procId on port $port..."
            taskkill /PID $procId /F /T
        }
        Start-Sleep -Seconds 2
        Write-Host "Port $port cleared."
    } else {
        Write-Host "Port $port is free."
    }
}

Write-Host "Starting Backend on Port 8089..."
$env:JAVA_HOME = "C:\Program Files\Java\jdk-26"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
java -jar target\agent-0.0.1-SNAPSHOT.jar > console_output.txt 2>&1
