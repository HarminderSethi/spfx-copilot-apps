<#
.SYNOPSIS
    Seeds the "Kudos" list with sample recognition records.

.DESCRIPTION
    Person fields (Recipient / Giver) must reference real users in your tenant,
    so pass the UPNs/emails of a few colleagues via -Upns. The script rotates them
    through eight sample kudos (giver never equals recipient), varies the value,
    and back-dates Created so the feed and "recent" digest look realistic.

    If -Upns is omitted it falls back to the signed-in user for every record — the
    data will render but every card will be you-to-you.

.PARAMETER SiteUrl
    Absolute URL of the site holding the Kudos list.

.PARAMETER ClientId
    Entra app (client) id used by Connect-PnPOnline -Interactive.

.PARAMETER Upns
    Two or more colleague UPNs/emails to spread across the sample records.

.EXAMPLE
    ./Seed-KudosData.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/sandboxed" `
        -ClientId "<app-id>" `
        -Upns "sarah@contoso.com","rory@contoso.com","aisha@contoso.com","tomas@contoso.com"

.NOTES
    Requires PnP.PowerShell. Run Provision-KudosList.ps1 first.
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    [Parameter(Mandatory = $true)]
    [string]$ClientId,
    [string[]]$Upns
)

$ErrorActionPreference = 'Stop'
$listTitle = 'Kudos'

Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId

if (-not $Upns -or $Upns.Count -lt 1) {
    $web = Get-PnPWeb -Includes CurrentUser
    $Upns = @($web.CurrentUser.Email)
    Write-Host "No -Upns supplied; using signed-in user '$($Upns[0])' for all records." -ForegroundColor Yellow
}

# Sample messages — value + how many hours ago it happened.
$samples = @(
    @{ Value = 'Teamwork';             Hours = 2;   Msg = 'Picked up the client demo forty minutes before it started and carried it as if they had built the deck themselves. Nobody in the room knew.' },
    @{ Value = 'Innovation';           Hours = 5;   Msg = 'Rebuilt the spectrum valuation model overnight so the Nordic team could test three new scenarios before the regulator call.' },
    @{ Value = 'Going the extra mile'; Hours = 26;  Msg = 'Steered the Dublin stakeholder workshop single-handed when the flights fell through — and still sent notes the same evening.' },
    @{ Value = 'Client impact';        Hours = 30;  Msg = 'Turned a difficult procurement conversation into a clear, candid recommendation the client acted on within a week.' },
    @{ Value = 'Teamwork';             Hours = 50;  Msg = 'Held the whole fibre benchmark together while two of us were on leave. Quietly, and without being asked.' },
    @{ Value = 'Innovation';           Hours = 74;  Msg = 'Reworked the DataHub cohort query and cut the analysis from two days to an afternoon.' },
    @{ Value = 'Client impact';        Hours = 98;  Msg = 'Charted a clear course through the National Broadband governance review — the client called the note the most useful thing they read this quarter.' },
    @{ Value = 'Going the extra mile'; Hours = 146; Msg = 'Stayed on the call until midnight to make sure the space-sector data landed correctly.' }
)

# Teams must match entries in the Departments list (see Provision-Lists.ps1).
$teamPool = @(
    'Consulting',
    'Finance',
    'Engineering',
    'Research',
    'Operations'
)

Write-Host "Seeding $($samples.Count) records across $($Upns.Count) user(s) ..." -ForegroundColor Cyan
for ($i = 0; $i -lt $samples.Count; $i++) {
    $s = $samples[$i]
    $recipient = $Upns[$i % $Upns.Count]
    $giver = $Upns[($i + 1) % $Upns.Count]
    $team = $teamPool[$i % $teamPool.Count]

    $item = Add-PnPListItem -List $listTitle -Values @{
        Message   = $s.Msg
        Recipient = $recipient
        Giver     = $giver
        Team      = $team
        KudosType = $s.Value
    }

    # Back-date Created so relative dates ("2h ago", "Yesterday") look natural.
    Set-PnPListItem -List $listTitle -Identity $item.Id -Values @{
        Created = (Get-Date).AddHours(-$s.Hours)
    } | Out-Null

    Write-Host "  [$($i + 1)] $giver -> $recipient ($($s.Value))" -ForegroundColor DarkGray
}

Write-Host "Done. $($samples.Count) sample kudos added to '$listTitle'." -ForegroundColor Green
