# Export the generated DOCX files using Microsoft Word on Windows.
$ErrorActionPreference = 'Stop'
$resumeRoot = Split-Path $PSScriptRoot -Parent
$resumeWord = New-Object -ComObject Word.Application
$resumeWord.Visible = $false
$resumeWord.DisplayAlerts = 0
try {
    foreach ($resumeKind in @('concise', 'master')) {
        $resumeDocPath = Join-Path $resumeRoot "public\documents\conold-chisinahama-resume-$resumeKind.docx"
        $resumePdfPath = Join-Path $resumeRoot "public\documents\conold-chisinahama-resume-$resumeKind.pdf"
        $resumeDocument = $resumeWord.Documents.Open($resumeDocPath, $false, $true)
        try {
            $resumeDocument.ExportAsFixedFormat($resumePdfPath, 17)
        } finally {
            $resumeDocument.Close(0)
        }
        Write-Output "$resumeKind PDF exported"
    }
} finally {
    $resumeWord.Quit()
}
