param([switch]$Check)

Add-Type -AssemblyName System.Drawing

$steel = [System.Drawing.Color]::FromArgb(11, 90, 122)
$cyan = [System.Drawing.Color]::FromArgb(62, 215, 223)
$white = [System.Drawing.Color]::White

function Set-IconGraphicsQuality {
  param([System.Drawing.Graphics]$Graphics)

  $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $Graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $Graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
}

function Add-ZavaItMark {
  param(
    [System.Drawing.Graphics]$Graphics,
    [single]$Scale,
    [single]$OffsetX,
    [single]$OffsetY,
    [bool]$Monochrome
  )

  $ringColor = if ($Monochrome) { $white } else { $cyan }
  $ringPen = [System.Drawing.Pen]::new($ringColor, 12 * $Scale)
  $markBrush = [System.Drawing.SolidBrush]::new($white)
  $dotBrush = [System.Drawing.SolidBrush]::new($ringColor)
  $zPath = [System.Drawing.Drawing2D.GraphicsPath]::new()

  try {
    $ringPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $ringPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $ringBounds = [System.Drawing.RectangleF]::new(
      $OffsetX + 34 * $Scale,
      $OffsetY + 34 * $Scale,
      124 * $Scale,
      124 * $Scale
    )
    $Graphics.DrawArc($ringPen, $ringBounds, 72, 286)

    [System.Drawing.PointF[]]$zPoints = @(
      [System.Drawing.PointF]::new($OffsetX + 61 * $Scale, $OffsetY + 58 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 132 * $Scale, $OffsetY + 58 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 132 * $Scale, $OffsetY + 76 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 86 * $Scale, $OffsetY + 117 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 132 * $Scale, $OffsetY + 117 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 132 * $Scale, $OffsetY + 137 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 59 * $Scale, $OffsetY + 137 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 59 * $Scale, $OffsetY + 120 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 106 * $Scale, $OffsetY + 78 * $Scale),
      [System.Drawing.PointF]::new($OffsetX + 61 * $Scale, $OffsetY + 78 * $Scale)
    )
    $zPath.AddPolygon($zPoints)
    $Graphics.FillPath($markBrush, $zPath)

    $Graphics.FillEllipse(
      $dotBrush,
      $OffsetX + 151 * $Scale,
      $OffsetY + 124 * $Scale,
      13 * $Scale,
      13 * $Scale
    )
  }
  finally {
    $ringPen.Dispose()
    $markBrush.Dispose()
    $dotBrush.Dispose()
    $zPath.Dispose()
  }
}

function Write-ColorIcon {
  param([string]$Path)

  $bitmap = [System.Drawing.Bitmap]::new(192, 192, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    Set-IconGraphicsQuality -Graphics $graphics
    $graphics.Clear($steel)
    Add-ZavaItMark -Graphics $graphics -Scale 1 -OffsetX 0 -OffsetY 0 -Monochrome $false
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

function Write-OutlineIcon {
  param([string]$Path)

  $bitmap = [System.Drawing.Bitmap]::new(32, 32, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    Set-IconGraphicsQuality -Graphics $graphics
    $graphics.Clear([System.Drawing.Color]::Transparent)
    Add-ZavaItMark -Graphics $graphics -Scale ([single](1 / 6)) -OffsetX 0 -OffsetY 0 -Monochrome $true
    for ($x = 0; $x -lt $bitmap.Width; $x++) {
      for ($y = 0; $y -lt $bitmap.Height; $y++) {
        $pixel = $bitmap.GetPixel($x, $y)
        if ($pixel.A -gt 0) {
          $bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, 255, 255, 255))
        }
      }
    }
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

function Assert-AgentIcon {
  param(
    [string]$Path,
    [int]$ExpectedSize,
    [bool]$RequireTransparentCorners,
    [bool]$RequireMonochromeWhite
  )

  $bitmap = [System.Drawing.Bitmap]::new($Path)
  try {
    if ($bitmap.Width -ne $ExpectedSize -or $bitmap.Height -ne $ExpectedSize) {
      throw "$(Split-Path $Path -Leaf) must be ${ExpectedSize}x${ExpectedSize}."
    }

    $corners = @(
      $bitmap.GetPixel(0, 0),
      $bitmap.GetPixel($bitmap.Width - 1, 0),
      $bitmap.GetPixel(0, $bitmap.Height - 1),
      $bitmap.GetPixel($bitmap.Width - 1, $bitmap.Height - 1)
    )
    if ($RequireTransparentCorners -and ($corners | Where-Object { $_.A -ne 0 })) {
      throw "$(Split-Path $Path -Leaf) must have transparent corners."
    }

    $visiblePixels = 0
    for ($x = 0; $x -lt $bitmap.Width; $x++) {
      for ($y = 0; $y -lt $bitmap.Height; $y++) {
        $pixel = $bitmap.GetPixel($x, $y)
        if ($pixel.A -gt 0) {
          $visiblePixels++
          if ($RequireMonochromeWhite -and ($pixel.R -ne 255 -or $pixel.G -ne 255 -or $pixel.B -ne 255)) {
            throw "$(Split-Path $Path -Leaf) must contain only white visible pixels."
          }
        }
      }
    }
    if ($visiblePixels -lt [Math]::Floor($ExpectedSize * $ExpectedSize * 0.08)) {
      throw "$(Split-Path $Path -Leaf) does not contain enough visible mark pixels."
    }
  }
  finally {
    $bitmap.Dispose()
  }
}

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$colorPath = Join-Path $root 'copilot/color.png'
$outlinePath = Join-Path $root 'copilot/outline.png'

if ($Check) {
  $temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) "zava-it-agent-icons-$([System.Guid]::NewGuid().ToString('N'))"
  New-Item -ItemType Directory -Path $temporaryDirectory | Out-Null
  try {
    $generatedColorPath = Join-Path $temporaryDirectory 'color.png'
    $generatedOutlinePath = Join-Path $temporaryDirectory 'outline.png'
    Write-ColorIcon -Path $generatedColorPath
    Write-OutlineIcon -Path $generatedOutlinePath
    Assert-AgentIcon -Path $generatedColorPath -ExpectedSize 192 -RequireTransparentCorners $false -RequireMonochromeWhite $false
    Assert-AgentIcon -Path $generatedOutlinePath -ExpectedSize 32 -RequireTransparentCorners $true -RequireMonochromeWhite $true
    Assert-AgentIcon -Path $colorPath -ExpectedSize 192 -RequireTransparentCorners $false -RequireMonochromeWhite $false
    Assert-AgentIcon -Path $outlinePath -ExpectedSize 32 -RequireTransparentCorners $true -RequireMonochromeWhite $true

    if ((Get-FileHash $generatedColorPath -Algorithm SHA256).Hash -ne (Get-FileHash $colorPath -Algorithm SHA256).Hash) {
      throw 'copilot/color.png is stale. Run npm run generate:agent-icons.'
    }
    if ((Get-FileHash $generatedOutlinePath -Algorithm SHA256).Hash -ne (Get-FileHash $outlinePath -Algorithm SHA256).Hash) {
      throw 'copilot/outline.png is stale. Run npm run generate:agent-icons.'
    }
  }
  finally {
    Remove-Item $temporaryDirectory -Recurse -Force -ErrorAction SilentlyContinue
  }
}
else {
  Write-ColorIcon -Path $colorPath
  Write-OutlineIcon -Path $outlinePath
  Assert-AgentIcon -Path $colorPath -ExpectedSize 192 -RequireTransparentCorners $false -RequireMonochromeWhite $false
  Assert-AgentIcon -Path $outlinePath -ExpectedSize 32 -RequireTransparentCorners $true -RequireMonochromeWhite $true
}

Write-Host "$(if ($Check) { 'Verified' } else { 'Generated and validated' }) Zava IT Concierge agent icons:"
Get-FileHash $colorPath, $outlinePath -Algorithm SHA256 | ForEach-Object {
  Write-Host "- $([System.IO.Path]::GetFileName($_.Path)): $($_.Hash.ToLowerInvariant())"
}