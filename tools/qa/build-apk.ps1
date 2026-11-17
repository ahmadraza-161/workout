param([switch]$NativeCheckOnly, [switch]$OnlineDependencies)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$buildRoot = Join-Path $projectRoot '.expo\build-tools'
$cacheRoot = Join-Path $buildRoot 'gradle-cache'
$shortCache = Join-Path $projectRoot '.g'

# Keep the real cache short: Android resolves junctions to their actual targets.
# Preserve the old location as a compatibility link after a same-volume move.
$workspacePrefix = $projectRoot.TrimEnd('\') + '\'
foreach ($target in @($cacheRoot, $shortCache)) {
  if (![IO.Path]::GetFullPath($target).StartsWith($workspacePrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Cache path is outside the project: $target"
  }
}
if (Test-Path -LiteralPath $shortCache) {
  $existing = Get-Item -LiteralPath $shortCache
  if ($existing.LinkType -eq 'Junction' -and @($existing.Target)[0] -eq $cacheRoot) {
    # Remove only our alias, never its cache contents.
    Remove-Item -LiteralPath $shortCache -Force
  } elseif ($existing.LinkType) { throw 'Unexpected .g link; existing files were preserved.' }
}
if (!(Test-Path -LiteralPath $shortCache)) {
  if (!(Test-Path -LiteralPath $cacheRoot)) { throw 'Local Gradle cache is missing.' }
  $source = Get-Item -LiteralPath $cacheRoot
  if ($source.LinkType) { throw 'Unexpected source cache link; existing files were preserved.' }
  Move-Item -LiteralPath $cacheRoot -Destination $shortCache
}
if (!(Test-Path -LiteralPath $cacheRoot)) {
  New-Item -ItemType Junction -Path $cacheRoot -Target $shortCache | Out-Null
}

$env:ANDROID_HOME = Join-Path $buildRoot 'android-sdk'
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:ANDROID_USER_HOME = Join-Path $buildRoot 'android-user'
New-Item -ItemType Directory -Path $env:ANDROID_USER_HOME -Force | Out-Null
$env:GRADLE_USER_HOME = $shortCache
$env:APP_VARIANT = 'production'
$env:NODE_ENV = 'production'
$env:EXPO_OFFLINE = '1'
$jdk = Get-ChildItem -LiteralPath (Join-Path $buildRoot 'jdk17') -Directory | Select-Object -First 1
if (!$jdk) { throw 'Local Java 17 runtime is missing.' }
$env:JAVA_HOME = $jdk.FullName
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

$required = @('platforms\android-36\android.jar', 'build-tools\36.0.0\apksigner.bat',
  'ndk\27.1.12297006\source.properties', 'cmake\3.22.1\source.properties')
foreach ($relative in $required) {
  if (!(Test-Path -LiteralPath (Join-Path $env:ANDROID_HOME $relative))) {
    throw "Required Android toolchain file is missing: $relative"
  }
}

Push-Location (Join-Path $projectRoot 'android')
try {
  $task = if ($NativeCheckOnly) { ':react-native-screens:buildCMakeRelWithDebInfo[arm64-v8a]' } else { ':app:assembleRelease' }
  Write-Output "Using short Gradle cache: $shortCache"
  # New native packages need a one-time Maven download. Application networking
  # remains disabled; subsequent builds can use the default offline cache.
  # Windows PowerShell unwraps a one-item array returned by an if expression.
  # Splatting that string passes --offline as separate characters (including
  # bare '-' Gradle tasks). Keep every native argument in one explicit array.
  $gradleArguments = @($task, '--no-daemon', '--max-workers=2', '--console=plain', '--stacktrace',
    '-PreactNativeArchitectures=arm64-v8a',
    '-Dorg.gradle.jvmargs=-Xmx3072m -XX:MaxMetaspaceSize=768m',
    '-Pandroid.enablePngCrunchInReleaseBuilds=false')
  if (!$OnlineDependencies) { $gradleArguments += '--offline' }
  & .\gradlew.bat @gradleArguments
  if ($LASTEXITCODE -ne 0) { throw 'Android compilation failed. See the first FAILED task above.' }
  if (!$NativeCheckOnly) {
    $apk = Join-Path $projectRoot 'android\app\build\outputs\apk\release\app-release.apk'
    & "$env:ANDROID_HOME\build-tools\36.0.0\apksigner.bat" verify $apk
    if ($LASTEXITCODE -ne 0) { throw 'APK signature validation failed; previous APK was preserved.' }
    $destination = Join-Path $projectRoot 'Home-Workout-arm64.apk'
    Copy-Item -LiteralPath $apk -Destination (Join-Path $projectRoot '.expo\Home-Workout-arm64.apk') -Force
    Copy-Item -LiteralPath $apk -Destination $destination -Force
    Get-Item -LiteralPath $destination | Select-Object FullName,Length,LastWriteTime
  }
} finally {
  # A failed native build must not strand the caller inside android/.
  Pop-Location
}
