<#
.SYNOPSIS
    Deletes all items from the "Kudos" list (keeps the list and its columns).

.DESCRIPTION
    Handy for iterating on a demo: wipe, then re-run Seed-KudosData.ps1. Does not
    remove the list — only its rows.

.PARAMETER SiteUrl
    Absolute URL of the site holding the Kudos list.

.PARAMETER ClientId
    Entra app (client) id used by Connect-PnPOnline -Interactive.

.EXAMPLE
    ./Reset-KudosData.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/sandboxed" -ClientId "<app-id>"

.NOTES
    Requires PnP.PowerShell.
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$ClientId
)

$ErrorActionPreference = 'Stop'
$listTitle = 'Kudos'

Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId

$items = Get-PnPListItem -List $listTitle -PageSize 500
Write-Host "Deleting $($items.Count) item(s) from '$listTitle' ..." -ForegroundColor Cyan
foreach ($item in $items) {
    Remove-PnPListItem -List $listTitle -Identity $item.Id -Force | Out-Null
}

Write-Host "Done. '$listTitle' is empty. Re-run Seed-KudosData.ps1 to repopulate." -ForegroundColor Green
