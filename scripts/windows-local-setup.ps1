Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoName = "lipyum-partner-design-studio"
$RepoUrl = "https://github.com/alierdem6681-svg/lipyum-partner-design-studio.git"
$Branch = "feature/v12-golden-vue-cutover"
$DocumentsPath = [Environment]::GetFolderPath("MyDocuments")
$ProjectsPath = Join-Path $DocumentsPath "Projects"
$RepoPath = Join-Path $ProjectsPath $RepoName

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-CommandAvailable {
  param([string]$Name)
  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Invoke-CheckedCommand {
  param(
    [string]$FilePath,
    [string[]]$Arguments
  )

  Write-Host "> $FilePath $($Arguments -join ' ')" -ForegroundColor DarkGray
  & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Komut basarisiz oldu: $FilePath $($Arguments -join ' ')"
  }
}

function Get-SemVer {
  param([string]$VersionText)

  $clean = $VersionText.Trim() -replace "^[^\d]*", "" -replace "[^\d.].*$", ""
  $parts = @($clean.Split("."))
  while ($parts.Count -lt 3) {
    $parts += "0"
  }

  return [version]::new([int]$parts[0], [int]$parts[1], [int]$parts[2])
}

function Get-PackageManager {
  if (Test-Path "pnpm-lock.yaml") {
    return "pnpm"
  }

  if (Test-Path "yarn.lock") {
    return "yarn"
  }

  if (Test-Path "package-lock.json") {
    return "npm"
  }

  return "npm"
}

function Get-RunCommand {
  param(
    [string]$PackageManager,
    [string]$ScriptName
  )

  switch ($PackageManager) {
    "npm" {
      if ($ScriptName -eq "start") {
        return "npm start"
      }
      return "npm run $ScriptName"
    }
    "pnpm" { return "pnpm run $ScriptName" }
    "yarn" { return "yarn run $ScriptName" }
    default { return "$PackageManager run $ScriptName" }
  }
}

Write-Step "Windows lokal proje klasoru hazirlaniyor"
New-Item -ItemType Directory -Force -Path $ProjectsPath | Out-Null
Write-Host "Projects klasoru: $ProjectsPath"

Write-Step "Git kontrolu"
if (-not (Test-CommandAvailable "git")) {
  throw "Git bulunamadi. Once Windows icin Git kurulmali: https://git-scm.com/download/win"
}
Invoke-CheckedCommand "git" @("--version")

if (-not (Test-Path $RepoPath)) {
  Write-Step "Repository clone ediliyor"
  Invoke-CheckedCommand "git" @("clone", "--branch", $Branch, "--single-branch", $RepoUrl, $RepoPath)
} else {
  Write-Step "Mevcut repository guncelleniyor"
  if (-not (Test-Path (Join-Path $RepoPath ".git"))) {
    throw "Bu klasor var ama Git repository degil: $RepoPath"
  }

  Set-Location $RepoPath
  Invoke-CheckedCommand "git" @("fetch", "--prune", "origin", $Branch)

  $localBranchExists = $false
  & git rev-parse --verify $Branch *> $null
  if ($LASTEXITCODE -eq 0) {
    $localBranchExists = $true
  }

  if ($localBranchExists) {
    Invoke-CheckedCommand "git" @("checkout", $Branch)
  } else {
    Invoke-CheckedCommand "git" @("checkout", "-B", $Branch, "origin/$Branch")
  }

  $dirtyStatus = & git status --porcelain
  if ($dirtyStatus) {
    Write-Warning "Yerel commit edilmemis degisiklik var; kayip olmamasi icin pull atlandi. Codex'e bu klasoru actirip commit/push yaptirin."
  } else {
    Invoke-CheckedCommand "git" @("pull", "--ff-only", "origin", $Branch)
  }
}

Set-Location $RepoPath

Write-Step "Aktif branch kontrolu"
$activeBranch = (& git branch --show-current).Trim()
if ($activeBranch -ne $Branch) {
  Invoke-CheckedCommand "git" @("checkout", $Branch)
}
Write-Host "Aktif branch: $Branch"

Write-Step "Node.js ve npm kontrolu"
if (-not (Test-CommandAvailable "node")) {
  throw "Node.js bulunamadi. Node.js 20.19 veya daha yeni surumu kurulmali: https://nodejs.org/"
}
if (-not (Test-CommandAvailable "npm")) {
  throw "npm bulunamadi. Node.js kurulumu ile birlikte gelmesi gerekir."
}

$nodeVersionText = (& node --version).Trim()
$npmVersionText = (& npm --version).Trim()
Write-Host "Node.js: $nodeVersionText"
Write-Host "npm: $npmVersionText"

$packageJsonPath = Join-Path $RepoPath "package.json"
if (-not (Test-Path $packageJsonPath)) {
  throw "package.json bulunamadi: $packageJsonPath"
}

$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
if ($packageJson.engines -and $packageJson.engines.node) {
  Write-Host "Proje Node beklentisi: $($packageJson.engines.node)"

  if ($packageJson.engines.node -match ">=\s*(\d+\.\d+\.\d+)") {
    $requiredNode = Get-SemVer $Matches[1]
    $installedNode = Get-SemVer $nodeVersionText
    if ($installedNode -lt $requiredNode) {
      throw "Node.js surumu dusuk. Gerekli: $requiredNode, mevcut: $installedNode"
    }
  }
}

Write-Step "Package manager tespiti"
$packageManager = Get-PackageManager
Write-Host "Package manager: $packageManager"

if (($packageManager -eq "pnpm") -and (-not (Test-CommandAvailable "pnpm"))) {
  throw "pnpm-lock.yaml bulundu ama pnpm kurulu degil. Once pnpm kurulmali."
}
if (($packageManager -eq "yarn") -and (-not (Test-CommandAvailable "yarn"))) {
  throw "yarn.lock bulundu ama yarn kurulu degil. Once yarn kurulmali."
}

Write-Step "Dependency kurulumu"
switch ($packageManager) {
  "pnpm" {
    Invoke-CheckedCommand "pnpm" @("install", "--frozen-lockfile")
  }
  "yarn" {
    Invoke-CheckedCommand "yarn" @("install", "--frozen-lockfile")
  }
  default {
    if (Test-Path "package-lock.json") {
      Invoke-CheckedCommand "npm" @("ci")
    } else {
      Invoke-CheckedCommand "npm" @("install")
    }
  }
}

Write-Step "Env dosyasi kontrolu"
$envExample = Join-Path $RepoPath ".env.example"
$envCandidates = @(".env.local", ".env.development.local", ".env")
$existingEnv = $envCandidates | Where-Object { Test-Path (Join-Path $RepoPath $_) } | Select-Object -First 1

if ((Test-Path $envExample) -and (-not $existingEnv)) {
  Copy-Item $envExample (Join-Path $RepoPath ".env.local")
  Write-Host ".env.example dosyasindan .env.local olusturuldu. Gizli anahtar uretilmedi."
} elseif ($existingEnv) {
  Write-Host "Env dosyasi zaten var: $existingEnv"
} else {
  Write-Host ".env.example bulunmadi; env dosyasi olusturulmadi."
}

Write-Step "Proje calistirma komutlari"
$scriptNames = @($packageJson.scripts.PSObject.Properties | ForEach-Object { $_.Name })
$preferredScripts = @("dev", "preview", "build", "check", "test", "test:quality-gate:v12", "test:quality-gate")
foreach ($scriptName in $preferredScripts) {
  if ($scriptNames -contains $scriptName) {
    Write-Host "- $(Get-RunCommand $packageManager $scriptName)"
  }
}

$readmePath = Join-Path $RepoPath "README.md"
if (Test-Path $readmePath) {
  $readmeText = Get-Content $readmePath -Raw
  $readmeMatches = [regex]::Matches($readmeText, "(npm|pnpm|yarn)\s+(run\s+)?[A-Za-z0-9:_-]+")
  $readmeCommands = @($readmeMatches | ForEach-Object { $_.Value } | Select-Object -Unique)
  if ($readmeCommands.Count -gt 0) {
    Write-Host ""
    Write-Host "README icinde bulunan komutlar:"
    foreach ($command in $readmeCommands) {
      Write-Host "- $command"
    }
  }
}

Write-Step "Kurulum tamamlandi"
Write-Host "Windows'ta Codex ile acilacak klasor:"
Write-Host $RepoPath -ForegroundColor Green
