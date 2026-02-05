@echo off
REM BaseQuest + OpenClaw Setup Script

echo ============================================
echo BaseQuest + OpenClaw Integration Setup
echo ============================================
echo.

REM Check if OpenClaw is installed
where openclaw >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] OpenClaw not found. Installing...
    npm install -g openclaw@latest
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Failed to install OpenClaw
        pause
        exit /b 1
    )
    echo [OK] OpenClaw installed successfully!
) else (
    echo [OK] OpenClaw is already installed
)

echo.
echo ============================================
echo Next Steps:
echo ============================================
echo.
echo 1. Run onboarding wizard:
echo    openclaw onboard --install-daemon
echo.
echo 2. Start OpenClaw gateway:
echo    openclaw gateway --port 18789
echo.
echo 3. In a new terminal, pair WhatsApp:
echo    openclaw channels login
echo.
echo 4. Start BaseQuest frontend:
echo    npm run dev
echo.
echo ============================================
echo.
echo Would you like to start the onboarding wizard now? (Y/N)
set /p "choice=Your choice: "

if /i "%choice%"=="Y" (
    openclaw onboard --install-daemon
) else (
    echo.
    echo Skipped. Run 'openclaw onboard' when ready!
)

echo.
echo ============================================
echo Setup complete! See OPENCLAW_INTEGRATION.md for details.
echo ============================================
pause
