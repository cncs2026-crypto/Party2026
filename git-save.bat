@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

echo ==========================================
echo   GIT SAVE: status - add - commit - pull --rebase - push
echo ==========================================

where git >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Khong tim thay git trong PATH.
  pause
  exit /b 1
)

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Thu muc hien tai khong phai git repository.
  pause
  exit /b 1
)

echo.
echo [1/5] git status
git status --short

set HAS_CHANGES=
for /f %%i in ('git status --porcelain') do set HAS_CHANGES=1
if not defined HAS_CHANGES (
  echo.
  echo [INFO] Khong co thay doi nao de commit.
  pause
  exit /b 0
)

echo.
set /p COMMIT_MSG=Nhap commit message (bo trong de dung timestamp): 
if "%COMMIT_MSG%"=="" (
  for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss\""') do set NOW=%%i
  set COMMIT_MSG=Auto save !NOW!
)

echo.
echo [2/5] git add .
git add .
if errorlevel 1 (
  echo [ERROR] git add that bai.
  pause
  exit /b 1
)

echo.
echo [3/5] git commit
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
  echo [ERROR] git commit that bai.
  echo Kiem tra cau hinh user.name/user.email hoac conflict.
  pause
  exit /b 1
)

set BRANCH=
for /f %%b in ('git branch --show-current') do set BRANCH=%%b
if "%BRANCH%"=="" set BRANCH=main

echo.
echo [4/5] git pull --rebase origin %BRANCH%
git pull --rebase origin %BRANCH%
if errorlevel 1 (
  echo [ERROR] git pull --rebase that bai. Vui long resolve conflict roi chay lai.
  pause
  exit /b 1
)

echo.
echo [5/5] git push origin %BRANCH%
git push origin %BRANCH%
if errorlevel 1 (
  echo [ERROR] git push that bai. Kiem tra quyen hoac credential.
  pause
  exit /b 1
)

echo.
echo [DONE] Da dong bo code len origin/%BRANCH% thanh cong.
pause
exit /b 0
