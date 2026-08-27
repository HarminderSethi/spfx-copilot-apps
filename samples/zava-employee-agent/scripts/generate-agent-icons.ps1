Add-Type -AssemblyName System.Drawing

$brandBlue = [System.Drawing.Color]::FromArgb(15, 108, 189)
$sparkGold = [System.Drawing.Color]::FromArgb(255, 214, 51)

function Add-ZavaMark {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.RectangleF]$Bounds,
    [bool]$Outline
  )

  $x = { param([single]$Value) [single]($Bounds.Left + $Value * $Bounds.Width) }
  $y = { param([single]$Value) [single]($Bounds.Top + $Value * $Bounds.Height) }
  $personBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
  $sparkBrush = [System.Drawing.SolidBrush]::new($(if ($Outline) { [System.Drawing.Color]::White } else { $sparkGold }))
  $body = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $spark = [System.Drawing.Drawing2D.GraphicsPath]::new()

  try {
    $Graphics.FillEllipse($personBrush, (& $x 0.18), (& $y 0.12), $Bounds.Width * 0.29, $Bounds.Height * 0.29)

    $body.StartFigure()
    $body.AddBezier(
      [System.Drawing.PointF]::new((& $x 0.06), (& $y 0.91)),
      [System.Drawing.PointF]::new((& $x 0.07), (& $y 0.64)),
      [System.Drawing.PointF]::new((& $x 0.20), (& $y 0.49)),
      [System.Drawing.PointF]::new((& $x 0.34), (& $y 0.49))
    )
    $body.AddBezier(
      [System.Drawing.PointF]::new((& $x 0.34), (& $y 0.49)),
      [System.Drawing.PointF]::new((& $x 0.49), (& $y 0.49)),
      [System.Drawing.PointF]::new((& $x 0.62), (& $y 0.64)),
      [System.Drawing.PointF]::new((& $x 0.63), (& $y 0.91))
    )
    $body.AddLine((& $x 0.63), (& $y 0.91), (& $x 0.06), (& $y 0.91))
    $body.CloseFigure()
    $Graphics.FillPath($personBrush, $body)

    [System.Drawing.PointF[]]$sparkPoints = @(
      [System.Drawing.PointF]::new((& $x 0.76), (& $y 0.02)),
      [System.Drawing.PointF]::new((& $x 0.83), (& $y 0.23)),
      [System.Drawing.PointF]::new((& $x 0.99), (& $y 0.32)),
      [System.Drawing.PointF]::new((& $x 0.83), (& $y 0.41)),
      [System.Drawing.PointF]::new((& $x 0.76), (& $y 0.64)),
      [System.Drawing.PointF]::new((& $x 0.69), (& $y 0.41)),
      [System.Drawing.PointF]::new((& $x 0.53), (& $y 0.32)),
      [System.Drawing.PointF]::new((& $x 0.69), (& $y 0.23))
    )
    $spark.AddPolygon($sparkPoints)
    $Graphics.FillPath($sparkBrush, $spark)

    $dotSize = $Bounds.Width * 0.105
    $Graphics.FillEllipse($personBrush, (& $x 0.79), (& $y 0.75), $dotSize, $dotSize)
  }
  finally {
    $personBrush.Dispose()
    $sparkBrush.Dispose()
    $body.Dispose()
    $spark.Dispose()
  }
}

function Write-ZavaIcon {
  param(
    [string]$Path,
    [int]$Size,
    [bool]$Outline
  )

  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.Clear($(if ($Outline) { [System.Drawing.Color]::Transparent } else { $brandBlue }))

    $inset = if ($Outline) { 2.0 } else { 40.0 }
    $markSize = if ($Outline) { 28.0 } else { 112.0 }
    Add-ZavaMark -Graphics $graphics -Bounds ([System.Drawing.RectangleF]::new($inset, $inset, $markSize, $markSize)) -Outline $Outline
    if ($Outline) {
      for ($x = 0; $x -lt $bitmap.Width; $x++) {
        for ($y = 0; $y -lt $bitmap.Height; $y++) {
          $pixel = $bitmap.GetPixel($x, $y)
          if ($pixel.A -gt 0) {
            $bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, 255, 255, 255))
          }
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

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$colorPath = Join-Path $root 'copilot/color.png'
$outlinePath = Join-Path $root 'copilot/outline.png'
Write-ZavaIcon -Path $colorPath -Size 192 -Outline $false
Write-ZavaIcon -Path $outlinePath -Size 32 -Outline $true
Write-Host "Generated agent icons at $colorPath and $outlinePath."
