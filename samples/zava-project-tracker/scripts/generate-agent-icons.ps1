Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$copilot = Join-Path $root 'copilot'

function New-Graphics([System.Drawing.Bitmap]$bitmap) {
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    return $graphics
}

function New-RoundPen([System.Drawing.Color]$color, [float]$width) {
    $pen = [System.Drawing.Pen]::new($color, $width)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    return $pen
}

function Draw-Sparkle($graphics, [float]$centerX, [float]$centerY, [float]$outer, [System.Drawing.Brush]$brush) {
    $points = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new($centerX, $centerY - $outer),
        [System.Drawing.PointF]::new($centerX + $outer * 0.28, $centerY - $outer * 0.28),
        [System.Drawing.PointF]::new($centerX + $outer, $centerY),
        [System.Drawing.PointF]::new($centerX + $outer * 0.28, $centerY + $outer * 0.28),
        [System.Drawing.PointF]::new($centerX, $centerY + $outer),
        [System.Drawing.PointF]::new($centerX - $outer * 0.28, $centerY + $outer * 0.28),
        [System.Drawing.PointF]::new($centerX - $outer, $centerY),
        [System.Drawing.PointF]::new($centerX - $outer * 0.28, $centerY - $outer * 0.28)
    )
    $graphics.FillPolygon($brush, $points)
}

$colorBitmap = [System.Drawing.Bitmap]::new(192, 192, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$colorGraphics = New-Graphics $colorBitmap
$background = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#0B4F7C'))
$colorGraphics.FillRectangle($background, 0, 0, 192, 192)

$subtlePen = New-RoundPen ([System.Drawing.Color]::FromArgb(46, 255, 255, 255)) 3
$colorGraphics.DrawLine($subtlePen, 27, 155, 165, 155)
$colorGraphics.DrawLine($subtlePen, 27, 37, 27, 155)

$whitePen = New-RoundPen ([System.Drawing.Color]::White) 18
$zPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(49, 56),
    [System.Drawing.PointF]::new(125, 56),
    [System.Drawing.PointF]::new(61, 133),
    [System.Drawing.PointF]::new(139, 133)
)
$colorGraphics.DrawLines($whitePen, $zPoints)

$nodeOutline = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$cyan = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#39D5D0'))
$green = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#6CCB5F'))
$amber = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#FFC83D'))

$colorGraphics.FillEllipse($nodeOutline, 33, 40, 32, 32)
$colorGraphics.FillEllipse($cyan, 38, 45, 22, 22)
$colorGraphics.FillEllipse($nodeOutline, 109, 40, 32, 32)
$colorGraphics.FillEllipse($amber, 114, 45, 22, 22)
$colorGraphics.FillEllipse($nodeOutline, 45, 117, 32, 32)
$colorGraphics.FillEllipse($cyan, 50, 122, 22, 22)
$colorGraphics.FillEllipse($nodeOutline, 123, 117, 32, 32)
$colorGraphics.FillEllipse($green, 128, 122, 22, 22)

Draw-Sparkle $colorGraphics 151 39 15 $amber
$colorGraphics.FillEllipse($amber, 163, 61, 7, 7)

$colorGraphics.Dispose()
$colorBitmap.Save((Join-Path $copilot 'color.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$colorBitmap.Dispose()

$outlineBitmap = [System.Drawing.Bitmap]::new(32, 32, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outlineGraphics = New-Graphics $outlineBitmap
$outlineGraphics.Clear([System.Drawing.Color]::Transparent)
$outlinePen = New-RoundPen ([System.Drawing.Color]::White) 3.4
$outlinePoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(5.5, 8),
    [System.Drawing.PointF]::new(20.5, 8),
    [System.Drawing.PointF]::new(7.5, 24),
    [System.Drawing.PointF]::new(25, 24)
)
$outlineGraphics.DrawLines($outlinePen, $outlinePoints)
$whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$outlineGraphics.FillEllipse($whiteBrush, 3.3, 5.8, 4.4, 4.4)
$outlineGraphics.FillEllipse($whiteBrush, 18.3, 5.8, 4.4, 4.4)
$outlineGraphics.FillEllipse($whiteBrush, 5.3, 21.8, 4.4, 4.4)
$outlineGraphics.FillEllipse($whiteBrush, 22.8, 21.8, 4.4, 4.4)
Draw-Sparkle $outlineGraphics 27 5 3.4 $whiteBrush
$outlineGraphics.Dispose()
$outlineBitmap.Save((Join-Path $copilot 'outline.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$outlineBitmap.Dispose()

$background.Dispose()
$subtlePen.Dispose()
$whitePen.Dispose()
$outlinePen.Dispose()
$nodeOutline.Dispose()
$cyan.Dispose()
$green.Dispose()
$amber.Dispose()
$whiteBrush.Dispose()

Write-Output 'Generated copilot/color.png (192x192) and copilot/outline.png (32x32).'
