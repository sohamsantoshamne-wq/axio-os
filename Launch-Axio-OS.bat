@echo off
title AXIO OS - Executive Daily Habits & Rhythm
cd /d "%~dp0"

echo ========================================================
echo        AXIO OS - Executive Consistency Engine
echo             Daily Habits & Rhythm System
echo ========================================================
echo.
echo Launching AXIO OS in your default web browser...
echo (Keep this small window open while using the app offline)
echo.

powershell -ExecutionPolicy Bypass -NoProfile -Command "$port = 49152; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:' + $port + '/'); try { $listener.Start() } catch { Start-Process ('http://localhost:' + $port + '/'); exit }; Start-Process ('http://localhost:' + $port + '/'); $base = if (Test-Path 'dist/index.html') { 'dist' } else { '.' }; while ($listener.IsListening) { $ctx = $listener.GetContext(); $req = $ctx.Request; $res = $ctx.Response; $urlPath = $req.RawUrl.Split('?')[0]; if ($urlPath -eq '/' -or $urlPath -eq '') { $urlPath = '/index.html' }; $filePath = Join-Path $base $urlPath.TrimStart('/'); if (Test-Path $filePath -PathType Leaf) { $bytes = [System.IO.File]::ReadAllBytes($filePath); $res.ContentLength64 = $bytes.Length; $ext = [System.IO.Path]::GetExtension($filePath).ToLower(); switch ($ext) { '.html' { $res.ContentType = 'text/html; charset=utf-8' } '.js' { $res.ContentType = 'application/javascript; charset=utf-8' } '.css' { $res.ContentType = 'text/css; charset=utf-8' } '.png' { $res.ContentType = 'image/png' } '.jpg' { $res.ContentType = 'image/jpeg' } '.jpeg' { $res.ContentType = 'image/jpeg' } '.svg' { $res.ContentType = 'image/svg+xml' } '.ico' { $res.ContentType = 'image/x-icon' } '.json' { $res.ContentType = 'application/json' } default { $res.ContentType = 'application/octet-stream' } }; $res.OutputStream.Write($bytes, 0, $bytes.Length) } else { $res.StatusCode = 404 }; $res.OutputStream.Close() }"

pause
