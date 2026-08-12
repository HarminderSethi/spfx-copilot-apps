<#
.SYNOPSIS
    Provisions both SharePoint lists behind the Kudos & Recognition Wall:
    the "Departments" lookup vocabulary and the "Kudos" recognition list.

.DESCRIPTION
    - Departments: a controlled list of teams. Its Title column is renamed to
      "Department" and seeded with the starting teams. This is the single source
      for the wall's team filter and the Give-kudos team picker.
    - Kudos: the recognition records, with the internal field names SpKudosService
      expects (Message, Recipient, Giver, KudosType, Team). Title is a hidden
      summary. Retires the legacy KudosValue column if present.

    Safe to re-run — each step checks for existing lists/fields first.

.PARAMETER SiteUrl
    Absolute URL of the SharePoint site the component runs in.

.PARAMETER ClientId
    Entra app (client) id used by Connect-PnPOnline -Interactive.

.EXAMPLE
    ./Provision-Lists.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/sandboxed" -ClientId "<app-id>"

.NOTES
    Requires PnP.PowerShell:  Install-Module PnP.PowerShell -Scope CurrentUser
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$ClientId
)

$ErrorActionPreference = 'Stop'
$kudosList = 'Kudos'
$departmentsList = 'Departments'

# Starting team vocabulary — edit the list in SharePoint afterwards to add more.
$seedDepartments = @(
    'Consulting',
    'Finance',
    'Engineering',
    'Research',
    'Operations'
)

Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId

function New-KudosList {
    param([string]$Title)
    $list = Get-PnPList -Identity $Title -ErrorAction SilentlyContinue
    if ($null -eq $list) {
        Write-Host "Creating list '$Title' ..." -ForegroundColor Cyan
        $list = New-PnPList -Title $Title -Template GenericList -OnQuickLaunch
    }
    else {
        Write-Host "List '$Title' already exists." -ForegroundColor Yellow
    }
    return $list
}

function Add-KudosField {
    param([string]$List, [string]$InternalName, [string]$DisplayName, [string]$Type, [string[]]$Choices)
    if ($null -ne (Get-PnPField -List $List -Identity $InternalName -ErrorAction SilentlyContinue)) {
        Write-Host "  Field '$InternalName' already exists." -ForegroundColor Yellow
        return
    }
    Write-Host "  Adding field '$InternalName' ($Type) to '$List' ..." -ForegroundColor Cyan
    if ($Type -eq 'Choice') {
        Add-PnPField -List $List -DisplayName $DisplayName -InternalName $InternalName `
            -Type Choice -Choices $Choices -AddToDefaultView | Out-Null
    }
    else {
        Add-PnPField -List $List -DisplayName $DisplayName -InternalName $InternalName `
            -Type $Type -AddToDefaultView | Out-Null
    }
}

# ── 1. Departments list ──────────────────────────────────────────────────────
New-KudosList -Title $departmentsList | Out-Null

# Rename the built-in Title column's DISPLAY name to "Department" (internal name
# stays "Title", which is what the service reads).
Set-PnPField -List $departmentsList -Identity 'Title' -Values @{ Title = 'Department' } | Out-Null

foreach ($dept in $seedDepartments) {
    $existing = Get-PnPListItem -List $departmentsList -Query `
        "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>$dept</Value></Eq></Where></Query></View>"
    if (-not $existing) {
        Write-Host "  Seeding department '$dept' ..." -ForegroundColor Cyan
        Add-PnPListItem -List $departmentsList -Values @{ Title = $dept } | Out-Null
    }
}

# ── 2. Kudos list ────────────────────────────────────────────────────────────
New-KudosList -Title $kudosList | Out-Null

Add-KudosField -List $kudosList -InternalName 'Recipient' -DisplayName 'Recipient' -Type 'User'
Add-KudosField -List $kudosList -InternalName 'Giver'     -DisplayName 'Giver'     -Type 'User'
Add-KudosField -List $kudosList -InternalName 'Team'      -DisplayName 'Team'      -Type 'Text'
Add-KudosField -List $kudosList -InternalName 'KudosType' -DisplayName 'Kudos type' -Type 'Choice' `
    -Choices @('Teamwork', 'Client impact', 'Innovation', 'Going the extra mile')

# Message — dedicated multiline (plain text) column that holds the kudos text.
if ($null -eq (Get-PnPField -List $kudosList -Identity 'Message' -ErrorAction SilentlyContinue)) {
    Write-Host "  Adding field 'Message' (Note) to '$kudosList' ..." -ForegroundColor Cyan
    Add-PnPField -List $kudosList -DisplayName 'Message' -InternalName 'Message' -Type Note -AddToDefaultView | Out-Null
    Set-PnPField -List $kudosList -Identity 'Message' -Values @{ RichText = $false; NumberOfLines = 4 } | Out-Null
}
else {
    Write-Host "  Field 'Message' already exists." -ForegroundColor Yellow
}

# Title is a summary only — not required, hidden from the new/edit forms.
Set-PnPField -List $kudosList -Identity 'Title' `
    -Values @{ Required = $false; ShowInNewForm = $false; ShowInEditForm = $false } | Out-Null

# Hide Title from the default view by setting the view's columns explicitly.
$defaultView = Get-PnPView -List $kudosList | Where-Object { $_.DefaultView } | Select-Object -First 1
if ($null -ne $defaultView) {
    Write-Host "  Setting default view columns (Title excluded) ..." -ForegroundColor Cyan
    Set-PnPView -List $kudosList -Identity $defaultView.Id `
        -Fields 'Message', 'Recipient', 'Giver', 'Team', 'KudosType', 'Created' | Out-Null
}

# Retire the legacy KudosValue column if an earlier provisioning created it.
$legacy = Get-PnPField -List $kudosList -Identity 'KudosValue' -ErrorAction SilentlyContinue
if ($null -ne $legacy) {
    Write-Host "  Removing legacy field 'KudosValue' ..." -ForegroundColor Yellow
    Remove-PnPField -List $kudosList -Identity 'KudosValue' -Force
}

Write-Host "Done. '$kudosList' and '$departmentsList' are ready at $SiteUrl." -ForegroundColor Green
