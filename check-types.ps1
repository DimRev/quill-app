# Run TypeScript check
Write-Host "Checking Types..."
tsc --noEmit

# Check if TypeScript check completed successfully
if ($LASTEXITCODE -eq 0) {
    Write-Host "TypeScript check passed."
} else {
    Write-Host "TypeScript check failed. BREAKING."
    exit 1
}